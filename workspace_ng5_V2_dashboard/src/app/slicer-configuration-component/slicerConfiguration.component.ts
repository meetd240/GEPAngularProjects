import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef
} from "@angular/core";
import { DashboardConstants } from "@vsDashboardConstants";
import { findIndex, sortBy, uniq, filter, each, find } from "lodash";
import { retry } from "rxjs/operators";
import { DashboardCommService } from "@vsDashboardCommService";
import { ReportObject } from "@vsMetaDataModels/report-object.model";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { SortReportObject } from "@vsDataModels/sort-report-object.model";
import { ReportDetails } from "@vsDataModels/report-details.model";
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { IReportObject, IReportingObjectMultiDataSource, ISlicerFilterConfig, ISlicerFitlerValue } from "interfaces/common-interface/app-common-interface";
import { Observable } from 'rxjs';
import { AnalyticsCommonMetadataService } from "@vsAnalyticsCommonService/analytics-common-metadata.service";
import { AnalyticsMapperService } from "@vsAnalyticsCommonService/analytics-mapper.service";
import { CommonUtilsService } from "smart-platform-services";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { GlobalFilterService } from '@vsGlobalFilterService';

@Component({
  selector: "slicer-configuration",
  templateUrl: "./slicerConfiguration.component.html",
  styleUrls: ["./slicerConfiguration.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlicerConfigurationComponent implements OnInit {
  @Input() config: any;
  @ViewChild("slicerConfigurationPopUp", { read: ViewContainerRef })
  private slicerConfigurationPopUpRef: ViewContainerRef;
  @ViewChild("outletTemplate") outletTemplateRef: TemplateRef<any>;
  private appliedSlicerFilter: any = [];
  lstOfSlicerFilterToRemove: any = [];
  exisitingSlicerFilter: any = [];
  lstOfSeletedFilter: any = [];
  private maxAllowedSelection: number = 3;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _dashboardCommService: DashboardCommService,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    private _commUtils: CommonUtilitiesService,
    private _globalFilterService: GlobalFilterService
  ) { }

  public ngOnInit(): void {
    this.openSlicerConfigurationPopup();
  }

  private openSlicerConfigurationPopup(): void {
    const nonStandardFilterPopupConfig: any = {
      api: {
        addClick: () => {
          this.addToStandardFilter();
        },
        closeClick: () => {
          this.closeAddToSlicerFilterPopup();
        }
      },
      nonStandardFilterList: this.getObjectListExcludingSavedFilter(),
      filterTabList: this.config.filterTabList,
      popUpFor: DashboardConstants.PopupFor.Slicer,
      title: DashboardConstants.UIMessageConstants.STRING_SLICER_FILTER_POPUP
    };

    this.slicerConfigurationPopUpRef.detach();
    this.slicerConfigurationPopUpRef.clear();
    this.slicerConfigurationPopUpRef.createEmbeddedView(
      this.outletTemplateRef,
      {
        manifestPath: "add-to-standard-filter/add-to-standard-filter",
        config: {
          config: nonStandardFilterPopupConfig
        }
      }
    );
  }

  onInitialize() { }

  onDeinitialize() { }

  onActivate() { }

  addToStandardFilter() {
    this._commUtils.showLoader();
    this.lstOfSlicerFilterToRemove = [];
    this.lstOfSeletedFilter = [];
    let isCheckedTrueFilters: any = [];
    //Done this to handle the case when the user checks the global filter in the popup and then click on the slicer filter.
    //Also here we will only select those filters which are not already applied as slicerFIlter.

    let nonStandardFilterList = filter(this.config.nonStandardFilterList, (_val: any) => {
      return _val.isChecked && !_val.isDisable;
    });

    each(this._dashboardCommService.appliedFilters, (val: any) => {
      if (val.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
        let index = findIndex(this.config.filterTabList, (_value: any) => {
          return _value.ReportObjectId === val.ReportObjectId
        });
        if (index != -1) {
          this.config.filterTabList[index].FilterIdentifier = val.FilterIdentifier
        }
      }
    });

    each(this.config.filterTabList, (_val: any) => {
      if (
        (
          (findIndex(this._dashboardCommService.appliedFilters, (_value: any) => {
            return _value.ReportObjectId === _val.ReportObjectId
          }) === -1 && _val.isChecked) || _val.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource
        ) &&
        findIndex(nonStandardFilterList, (_value: any) => { return _value.ReportObjectId === _val.ReportObjectId }) === -1) {
        nonStandardFilterList.push(_val);
      }
    });


    //this.lstOfSeletedFilter.push(...nonStandardFilterList);
    this.lstOfSlicerFilterToRemove = filter(this._dashboardCommService.slicerFilterList, (_val: any, _index: number) => {
      if (findIndex(nonStandardFilterList, (_value: any) => { return _value.ReportObjectId === _val.ReportObjectId }) === -1) {
        return _val;
      }
    })

    if (this.lstOfSlicerFilterToRemove.length) {
      each(this.lstOfSlicerFilterToRemove, (_val: any) => {
        if (findIndex(this._dashboardCommService.slicerFilterList, (_value: any) => { return _value.ReportObjectId === _val.ReportObjectId }) != -1) {
          this._dashboardCommService.slicerFilterList.splice(findIndex(this._dashboardCommService.slicerFilterList, (_value: any) => { return _value.ReportObjectId === _val.ReportObjectId }), 1)
        }
      })
    }

    each(nonStandardFilterList, (_filter: any, _index: number) => {
      //We will also set the isExpand prop for this filterObject as true by default.
      _filter.isExpand = true;
      _filter.FilterIdentifier = DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource;
    })

    each(this.config.filterTabList, (_filter: any) => {
      if (_filter.hasOwnProperty('isChecked'))
        _filter.isChecked = true;
    })
    this.appliedSlicerFilter.push(...nonStandardFilterList);
    isCheckedTrueFilters.push(...nonStandardFilterList);
    //this.config.filterTabList = isCheckedTrueFilters;
    this.closeAddToSlicerFilterPopup();
    this.generateReportCallForFilters(isCheckedTrueFilters);
    each(this.config.filterTabList, (_filter: any) => {
      if (_filter.hasOwnProperty('isChecked'))
        _filter.isChecked = true;
    })

    //this.config.setFilterTabList(this.config.filterTabList);
  }



  generateReportCallForFilters(filterTabList: Array<IReportingObjectMultiDataSource>) {

    this._dashboardCommService.generateReportDetailForSlicerFilters(filterTabList);
    //let ROObjects = [];
    this.getReportObjectsWithFilterData(filterTabList);
  }

  public getReportObjectsWithFilterData(filterTabList: Array<any>) {
    let ROObjects = [];
    let promiseArray = [];
    //We will only call generate report for newly added slicer filter and not the existing one.
    let tempList = filter(filterTabList, (_val: any) => {
      if (findIndex(this._dashboardCommService.slicerFilterList, { ReportObjectId: _val.ReportObjectId }) == -1) {
        return _val;
      }
    })
    each(tempList, (_val: any) => {
      if (_val)
        promiseArray.push(this._analyticsCommonDataService.generateReport(this._dashboardCommService.slicerFilterConfig.get(_val.ReportObjectId).ReportDetail));
    });
    if (promiseArray.length) {
      Observable.forkJoin(
        ...promiseArray
      ).subscribe(response => {
        each(response, (res: any, index: number) => {
          if (
            res instanceof Object &&
            res.Data != 'Error' &&
            res.Data
            //&& res.Data.length > 0
          ) {

            let filterObject: IReportingObjectMultiDataSource = tempList[index];
            let repoObject: any = this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).ReportDetail.lstReportObject[0];

            //On updating the values of the slicerFilter object we will also reset the pageIndex of the ReportDetail property of this filter.
            //and also update the recordCount.
            this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).ReportDetail.pageIndex = 1;
            this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).ReportDetail.TotalRowCount = res.TotalRowCount;


            //let filterObject: IReportingObjectMultiDataSource = filterTabList[findIndex(filterTabList, { ReportObjectId: repoObject.reportObjectId })]
            //Done to handle the lazy loading case wherein if the nos. of res data are same as the page size we splice the last record.
            if (res.Data.length === this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).ReportDetail.pageSize) {
              res.Data.splice(res.Data.length - 1, 1);
            }
            let configObject = [];
            res.Data.forEach(function (element) {
              let filterList = {};
              filterList["title"] = element[repoObject.displayName];
              filterList["IsSelected"] = false;
              //filterList["IsPresentInData"] = true;
              configObject.push(filterList);
            });
            filterObject.FilterList = configObject;
            if (filterObject.FilterList != undefined) {
              ROObjects.push(filterObject);
            }
          }
        });
        this._dashboardCommService.slicerFilterList.push(...ROObjects);
        // let lstOfSeletedFilter = [];
        // lstOfSeletedFilter.push(...ROObjects);


        if (ROObjects.length === promiseArray.length) {
          let config = {
            config: {
              config: (this._dashboardCommService.slicerFilterList),
              lstOfSlicerFilterToRemove: this.lstOfSlicerFilterToRemove
            }
          };
          this._commUtils.hideLoader();
          this._dashboardCommService.slicerComponetRefEvent.destroySlicerComponentRef();
          this._dashboardCommService.slicerComponetRefEvent.createSlicerComponent(config);
        }
        else {
          each(tempList, slicerFilter => {
            let filter = find(filterTabList, { ReportObjectId: slicerFilter.ReportObjectId });
            filter.isChecked = false;
            filter.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
            let index = findIndex(this._dashboardCommService.slicerFilterList, { ReportObjectId: slicerFilter.ReportObjectId });
            if (index != -1) {
              this._dashboardCommService.slicerFilterList.splice(index, 1);
            }
            this._dashboardCommService.slicerFilterConfig.delete(slicerFilter.ReportObjectId);
          });
          this._commUtils.hideLoader();
          this._commUtils.getMessageDialog(
            `Error occurred while fetching Slicer Filter Data.`
            , () => { });
        }
      });
    }
    else {
      let config = {
        config: {
          lstOfSlicerFilterToRemove: this.lstOfSlicerFilterToRemove,
          config: filterTabList
        }
      };
      this._commUtils.hideLoader();
      this._dashboardCommService.slicerComponetRefEvent.createSlicerComponent(config);
    }
  }


  getSortReportObject(reportObject: ReportObject) {
    let reportSort = new SortReportObject();
    reportSort.reportObject = reportObject;
    return reportSort;
  }

  closeAddToSlicerFilterPopup() {
    this.slicerConfigurationPopUpRef.detach();
    this.slicerConfigurationPopUpRef.clear();
    each(this.config.nonStandardFilterList, (_val) => {
      _val.isChecked = false;
    })
    each(this.config.filterTabList, (_filter: any) => {
      if (_filter.hasOwnProperty('isChecked'))
        _filter.isChecked = true;
    })
    this.config.closePopup();

  }

  private getObjectListExcludingSavedFilter(): any[] {
    let filterData = uniq(
      this.config.nonStandardFilterList.concat(this.config.filterTabList)
    );
    /** 
     * here instead of checking in the filterTabList of the config we will check for the appliedFilterList of dashboardCommService.
     * We will mark those filterObject as checked and disabled in the slicer popup.
     * We only disable those filter objects as those are not in slicer filter and they cant be selected. 
     * Also adding them as isChecked cause a error in the global-filter component on addToStandardFilter where we set the isCheckedTrueFilters list.
  //   */

    /** Tyring to set the isChecked flag = true for all the slicer Filters. 
     * 
     */
    filterData.map((_filterObject: any, _filterKey: number) => {
      //If the filter is slicerFilter then we just show it as selected.
      if (
        this._commUtils.isNune(this._dashboardCommService.slicerFilterConfig.get(_filterObject.ReportObjectId))
      ) {
        //isDisable is set to false as in the global filter we set this to true to diable all the slicerFilter from the add-to-std popup.
        _filterObject.isDisable = false;
        _filterObject.isChecked = true;
      }
      //If its in the global filter we will show it selected and disable it.
      //Now only if the user applies the filter in global filter we will disable it.
      else if (findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: _filterObject.ReportObjectId }) != -1) {
        if (!_filterObject.hasOwnProperty('isChecked'))
          _filterObject.isCheckedTrueFilter = true;
        _filterObject.isChecked = true,
          _filterObject.isDisable = true;
      }
      else {
        if (_filterObject.isCheckedTrueFilter)
          delete _filterObject.isChecked;
        else {
          if (!_filterObject.hasOwnProperty('isChecked'))
            _filterObject.isCheckedTrueFilter = true;
          _filterObject.isChecked = false;
        }
        _filterObject.isDisable = false;
      }
    });
    filterData = sortBy(filterData, "DisplayName");
    filterData = filter(filterData, (_value: any) => {
      return _value.FilterType === DashboardConstants.FilterType.MultiSelect ||
        _value.FilterType === DashboardConstants.FilterType.Year;
    })
    return filterData;
  }
}
