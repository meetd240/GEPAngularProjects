import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { NotificationService } from "smart-platform-services";
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardConstants } from "@vsDashboardConstants";
import { DashletInfo } from "@vsDashletModels/dashlet-info.model";
import { SavedFilter } from "@vsMetaDataModels/saved-filter.model";
import { SliderFilterDetails } from "@vsSliderFilterModels/slider-filter-details.model";
import { DashboardCommService } from '@vsDashboardCommService';
import { findIndex,filter } from 'lodash';
import { GlobalFilterService } from "@vsGlobalFilterService";
import { TabDetail } from "@vsDashletModels/tab-detail-model";
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';


// import { LazyComponentConfiguration } from "../../../modules-manifest";
@Component({
  selector: 'GlobalSliderWidget',
  templateUrl: './global-slider-widget.component.html',
  styleUrls: ['./global-slider-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})

export class GlobalSliderWidgetComponent {

  // static componentId = LazyComponentConfiguration.SliderWidget.componentName;
  minRange: any;
  maxRange: any;
  btnRangeApplyConfig: any;
  constants = DashboardConstants;
  @Input() config: any;
  sliderOpenGlobalFilterConfig = {
    message: "Open global filter",
    position: "top"
  };

  constructor(
    private _commUtil: CommonUtilitiesService,
    private _changeDetection: ChangeDetectorRef,
    private _dashboardCommService: DashboardCommService,
    private _notificationService: NotificationService,
    private _globalFilterService: GlobalFilterService
  ) {
  }

  ngOnInit() {
    this.btnRangeApplyConfig = this.config.btnRangeApplyConfig;
  }

  public rangeOnUpdate($event, index) {
    // this.config.sliderSubscriptions.next({ actionId: 'UPDATE', sliderIndex: index, event: $event });
  }

  public rangeOnChange($event, index) {
    // this.config.sliderSubscriptions.next({ actionId: 'CHANGE', sliderIndex: index, event: $event });
  }

  public onFinish($event, index) {
    // this.config.sliderSubscriptions.next({ actionId: 'FINISH', sliderIndex: index, event: $event });
    this.updateRangeOnFinish($event, index);
  }

  public onFromRangeBlur(index, fromVar) {
    // if (fromVar === null) {
    //   this.config.sliderFilterArray[index].range.from = this.config.sliderFilterArray[index].min;
    // }
    this.btnRangeApplyConfig.disable = fromVar === null;
  }

  public onToRangeBlur(index, toVar) {
    // if (toVar === null) {
    //   this.config.sliderFilterArray[index].range.to = this.config.sliderFilterArray[index].max;
    // }
    // else if (toVar < this.config.sliderFilterArray[index].range.from) {
    //   this.config.sliderFilterArray[index].range.to = this.config.sliderFilterArray[index].range.to;
    // }
    this.btnRangeApplyConfig.disable = toVar === null;
  }

  public updateRangeOnFinish(e, index) {
    this.config.sliderFilterArray[index].range.from = e.from;
    this.config.sliderFilterArray[index].range.to = e.to;
  }

  public resetSlide(index) {
    this.config.sliderFilterArray[index].range.from = this.config.sliderFilterArray[index].min;
    this.config.sliderFilterArray[index].range.to = this.config.sliderFilterArray[index].max;
  }

  public validateSliderFilterRangeValue(sliderFilterConfig: any): boolean {
    const index = findIndex(this.config.sliderFilterArray, { reportObjectId: sliderFilterConfig.reportObjectId });
    let validatedSlider: any = {
      isValidRange: true,
      sliderIndex: index
    }

    //for (let sliderIndex = 0; sliderIndex < sliderFilterConfig.length; sliderIndex++) {
    if ((this.config.sliderFilterArray[index].min > this.config.sliderFilterArray[index].range.from)
      || (this.config.sliderFilterArray[index].max < this.config.sliderFilterArray[index].range.to) || (this.config.sliderFilterArray[index].range.to < this.config.sliderFilterArray[index].range.from)) {
      validatedSlider = {
        isValidRange: false,
        sliderIndex: index
      }
    }
    //}

    if (!validatedSlider.isValidRange) {
        this._commUtil.getMessageDialog(
          `${DashboardConstants.UIMessageConstants.STRING_SLIDER_LIMIT_MESSAGE} ${this.config.sliderFilterArray[validatedSlider.sliderIndex].min} ${DashboardConstants.UIMessageConstants.STRING_AND} ${this.config.sliderFilterArray[validatedSlider.sliderIndex].max}.`,
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

  public onApplySliderFilterRange(globalSliderFilterConfig, $event) {
    if (this.validateSliderFilterRangeValue(globalSliderFilterConfig)) {
      let globalSliderFilterRO;
      const currentTabDetails = this._dashboardCommService.tabDashletInfo.lstTabDetails.find(x => x.tabId == this._dashboardCommService.selectedTab.tabId);
      if(this._dashboardCommService.appliedFilters.length)
      {
        globalSliderFilterRO = this._dashboardCommService.appliedFilters
        .find(x => x.ReportObjectId == globalSliderFilterConfig.reportObjectId);
      }
      if ((!this._commUtil.isNune(globalSliderFilterRO) || globalSliderFilterConfig.isTabFilter) && this._commUtil.isNune(this._dashboardCommService.tabDashletInfo)) {
        const currentTabDetails = this._dashboardCommService.tabDashletInfo.lstTabDetails.find(x => x.tabId == this._dashboardCommService.selectedTab.tabId);
        globalSliderFilterRO = currentTabDetails.lstAppliedTabFilters.find(x => x.ReportObjectId == globalSliderFilterConfig.reportObjectId);
        //If the the slider on which apply is clicked is not present in lstAppliedTabfilters we need to push it from lstTabFilters
        if (!this._commUtil.isNune(globalSliderFilterRO))
        {
          this._dashboardCommService.mapTabAppliedFiltersToListTabFilters();
          globalSliderFilterRO = currentTabDetails.lstAppliedTabFilters.find(x => x.ReportObjectId == globalSliderFilterConfig.reportObjectId);
        }
      }
      globalSliderFilterRO.FilterConditionRangeValue.from = this._commUtil.isNune(globalSliderFilterConfig.range.from) ? globalSliderFilterConfig.range.from : '';
      globalSliderFilterRO.FilterConditionRangeValue.to = this._commUtil.isNune(globalSliderFilterConfig.range.to) ? globalSliderFilterConfig.range.to : '';
      globalSliderFilterRO.FilterIdentifier = globalSliderFilterConfig.enabledAsGlobalSlider ? DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : globalSliderFilterConfig.FilterIdentifier;
      globalSliderFilterRO.globalSliderObject.globalSliderMin =  this._commUtil.isNune(globalSliderFilterConfig.min) ? globalSliderFilterConfig.min : 0;
      globalSliderFilterRO.globalSliderObject.globalSliderMax = this._commUtil.isNune(globalSliderFilterConfig.max) ? globalSliderFilterConfig.max : 0;
      if (!globalSliderFilterRO.enabledAsGlobalSlider) {
        if (this._commUtil.isNune(globalSliderFilterRO.sliderFilterPanelObject)) {
          globalSliderFilterRO.sliderFilterPanelObject.sliderFilterArray[0].min = this._commUtil.isNune(globalSliderFilterConfig.min) ? globalSliderFilterConfig.min : 0;
          globalSliderFilterRO.sliderFilterPanelObject.sliderFilterArray[0].max = this._commUtil.isNune(globalSliderFilterConfig.max) ? globalSliderFilterConfig.max : 0;
        }
      }
      this._dashboardCommService.globalSliderApplyFilterTabUpdate$.next(globalSliderFilterRO);
      //this.btnRangeApplyConfig.disable = true;
      // this.config.sliderSubscriptions.next({
      //   actionId: DashboardConstants.WidgetFunction.APPLY_GLOBAL_FILTER,
      //   sliderConfig: sliderFilterConfig,
      //   event: $event
      // });
      this._dashboardCommService.setAppliedFilterData(
        {
          validatedTabs: globalSliderFilterConfig.isTabFilter ? currentTabDetails.lstAppliedTabFilters : this._dashboardCommService.appliedFilters,
          appliedFilterData: [],
          applyGlobalFilter: true,
          isTabFilter: globalSliderFilterConfig.isTabFilter,
          applyGlobalSlider: true,
          applyFilterPanelSlider: !globalSliderFilterRO.enabledAsGlobalSlider
        }
      );
    }
  }

  openFilterPanel(filterSlider, isTabFilter) {
    let itemFilter: any;
    if (isTabFilter) {
      itemFilter = this.openTabFilterConfig(filterSlider);
      this._dashboardCommService.openFilterpop({
        LoadFilterPopup: true,
        TabFilter: true
      })
      this._globalFilterService.setActiveFilter(itemFilter);
    }
    else {
      itemFilter = filter(this._dashboardCommService.appliedFilters, { ReportObjectId: filterSlider.reportObjectId })[0];
      this._dashboardCommService.openFilterpop({
        LoadFilterPopup: true
      })
      this._globalFilterService.setActiveFilter(itemFilter);
    }
  }

  openTabFilterConfig(filterSlider) {
    let itemFilter: any;
    let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
    let index = findIndex(_currentTabDetail.lstAppliedTabFilters, { ReportObjectId: filterSlider.reportObjectId });
    if (index != -1) {
      itemFilter = _currentTabDetail.lstAppliedTabFilters[index];
    }
    else {
      //If the global slider filter is not present in applied tab filters we need to find it in lstTabFilters and create the applied tab filters object for it.
      index = findIndex(_currentTabDetail.lstTabFilter, (x) => { return x.reportObject.reportObjectId == filterSlider.reportObjectId });

      itemFilter = AnalyticsUtilsService.savedViewFilterToAppliedFilter(_currentTabDetail.lstTabFilter[index], {
        listAllCrossSuiteFilterMapping: this._dashboardCommService.listAllCrossSuiteFilterMapping,
        listAllReportObjectWithMultiDatasource: this._dashboardCommService.listAllReportObjectWithMultiDatasource,
      },
        this._dashboardCommService.FilterConditionMetadata, true);
    }
    return itemFilter;

  }
  public setState() {
    this._changeDetection.markForCheck();
  }
}