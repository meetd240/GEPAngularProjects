import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { NotificationService } from "smart-platform-services";
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardConstants } from "@vsDashboardConstants";
import { DashletInfo } from "@vsDashletModels/dashlet-info.model";
import { SavedFilter } from "@vsMetaDataModels/saved-filter.model";
import { SliderFilterDetails } from "@vsSliderFilterModels/slider-filter-details.model";
// import { LazyComponentConfiguration } from "../../../modules-manifest";
import { each } from 'lodash';
@Component({
  selector: 'slider-widget',
  templateUrl: './slider-widget.component.html',
  styleUrls: ['./slider-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})

export class SliderWidgetComponent {

  // static componentId = LazyComponentConfiguration.SliderWidget.componentName;
  minRange: any;
  maxRange: any;
  btnRangeApplyConfig: any;
  constants = DashboardConstants;
  @Input() config: any;

  constructor(
    private _commUtil: CommonUtilitiesService,
    private _changeDetection: ChangeDetectorRef,
    private _notificationService: NotificationService) {
  }

  ngOnInit() {
    this.btnRangeApplyConfig = this.config.btnRangeApplyConfig;
    this.config.sliderRenderCallback().subscribe((param) => {
    });
    // this.sliderLoaderConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardLoaderConfig);
    this.config.changeDetectionMutation.setSliderState = this.setState.bind(this);
  }

  public rangeOnUpdate($event, index) {
    this.config.sliderSubscriptions.next({ actionId: 'UPDATE', sliderIndex: index, event: $event });
  }

  public rangeOnChange($event, index) {
    this.config.sliderSubscriptions.next({ actionId: 'CHANGE', sliderIndex: index, event: $event });
    //this.categorySpendRangeOnFinish($event, index);
  }

  public onFinish($event, index) {
    this.config.sliderSubscriptions.next({ actionId: 'FINISH', sliderIndex: index, event: $event });
    this.categorySpendRangeOnFinish($event, index);
  }

  public onFromRangeBlur(index, fromVar) {
    if (fromVar === null || fromVar > this.config.sliderFilterArray[index].range.to) {
      this.config.sliderFilterArray[index].range.from = this.config.sliderFilterArray[index].min;
    }
  }

  public onToRangeBlur(index, toVar) {
    if (toVar === null) {
      this.config.sliderFilterArray[index].range.to = this.config.sliderFilterArray[index].max;
    }
    else if (toVar < this.config.sliderFilterArray[index].range.from) {
      this.config.sliderFilterArray[index].range.to = this.config.sliderFilterArray[index].range.from;
    }
  }

  public categorySpendRangeOnFinish(e, index) {
    this.config.sliderFilterArray[index].range.from = e.from;
    this.config.sliderFilterArray[index].range.to = e.to;
  }

  public resetSlide(index) {
    this.config.sliderFilterArray[index].range.from = this.config.sliderFilterArray[index].min;
    this.config.sliderFilterArray[index].range.to = this.config.sliderFilterArray[index].max;
  }

  public validateSliderFilterRangeValue(sliderFilterConfig: any): boolean {
    let validatedSlider: any = {
      isValidRange: true,
      sliderIndex: 0
    }

    for (let sliderIndex = 0; sliderIndex < sliderFilterConfig.length; sliderIndex++) {
      if ((this.config.sliderFilterArray[sliderIndex].min > this.config.sliderFilterArray[sliderIndex].range.from)
        || (this.config.sliderFilterArray[sliderIndex].max < this.config.sliderFilterArray[sliderIndex].range.to)) {
        validatedSlider = {
          isRangeValid: false,
          sliderIndex: sliderIndex
        }
        break;
      }
    }

    if (!validatedSlider.isValidRange) {
      this._commUtil.getMessageDialog(
        `${DashboardConstants.UIMessageConstants.STRING_SLIDER_LIMIT_MESSAGE}${this.config.sliderFilterArray[validatedSlider.sliderIndex].min} ${DashboardConstants.UIMessageConstants.STRING_AND}${this.config.sliderFilterArray[validatedSlider.sliderIndex].max}.`,
        (_response: any) => {
          if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT.toLocaleLowerCase()) {
            return false;
          }
        },
        DashboardConstants.OpportunityFinderConstants.STRING_INFORM,
        DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
      );
    }
    else {
      return true;
    }

  }

  public onApplySliderFilterRange(sliderFilterConfig, $event) {
    if (this.validateSliderFilterRangeValue(sliderFilterConfig)) {
      each(sliderFilterConfig, (sliderFilterConfigValue: any, sliderIndex) => {
        this.setSliderFilterList(this.config, this.config.reportDetails.lstFilterReportObject, sliderFilterConfig[sliderIndex]);
        this.setSliderFilterList(this.config, this.config.reportDetails.preserveFilterList, sliderFilterConfig[sliderIndex]);

        let sliderFilterRoFound = this.config.reportDetails.lstFilterReportObject
          .find(x => x.reportObject.reportObjectId == sliderFilterConfig[sliderIndex].reportObjectId);
        if (sliderFilterRoFound == null) {
          let sliderFilterRoFound = this.config.reportDetails.preserveFilterList
            .find(x => x.reportObject.reportObjectId == sliderFilterConfig[sliderIndex].reportObjectId);

          sliderFilterRoFound.filterValue =
            [sliderFilterConfig[sliderIndex].range.from.toString(), sliderFilterConfig[sliderIndex].range.to.toString()];
          sliderFilterRoFound.reportObject.isDashletModified = true;
          // hard coded for save dashboard (remove after filter mapping)
          //sliderFilterRoFound.filterCondition.FilterConditionObjectId ='F8AF8904-44DC-4D59-A1FB-5E2C8F4C5D74';
          sliderFilterRoFound.filterCondition.FilterTypeObjectId = sliderFilterRoFound.reportObject.filterTypeObjectId;
          this.config.reportDetails.lstFilterReportObject.push(sliderFilterRoFound);
        }
        let filterRepoObjModified = this.config.reportDetails.lstFilterReportObject.find(x => x.reportObject.isDashletModified == true);
        if (filterRepoObjModified != null && filterRepoObjModified.reportObject.isDashletModified) {
          //Calling Widget Component to Get Report Data.
          if (this.config.driveConfig.isDriver) {
            // this.removeDriveFromWidget(this.config[index].reportDetailsId);
          }
          this.config.WidgetDataRecordLength = undefined;
          this.config.btnRangeApplyConfig.disable = true;
        }
      });
      this.btnRangeApplyConfig.disable = true;
      this.config.sliderSubscriptions.next({
        actionId: DashboardConstants.WidgetFunction.SLIDER_APPLY,
        sliderConfig: sliderFilterConfig,
        event: $event
      });
    }
  }

  public setSliderFilterList(dashletConfig: DashletInfo, filterList: Array<SavedFilter>, sliderFilterDetails: SliderFilterDetails) {
    let sliderFilterRoFound = filterList.find(x => x.reportObject.reportObjectId == sliderFilterDetails.reportObjectId);
    if (sliderFilterRoFound != null &&
      (sliderFilterRoFound.filterValue.length == 0 ||
        (sliderFilterRoFound.filterValue[0].toString() != sliderFilterDetails.range.from.toString()
          || sliderFilterRoFound.filterValue[1].toString() != sliderFilterDetails.range.to.toString()))) {

      sliderFilterRoFound.reportObject.isDashletModified = true;
      sliderFilterRoFound.filterValue = [sliderFilterDetails.range.from.toString(), sliderFilterDetails.range.to.toString()];

    }
  }

  public setState() {
    this._changeDetection.markForCheck();
  }
}
