import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, Input, ElementRef, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { GlobalFilterService } from '@vsGlobalFilterService';
import { DashboardCommService } from '@vsDashboardCommService';
import { ReportFilter } from '@vsDataModels/report-filter.model';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { DashboardConstants } from '@vsDashboardConstants'
import { filter, findIndex, debounce, each } from 'lodash';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { IReportingObjectMultiDataSource } from 'interfaces/common-interface/app-common-interface';
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { Observable, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';

@Component({
  selector: 'app-dashboard-slicer',
  templateUrl: './dashboard-slicer.component.html',
  styleUrls: ['./dashboard-slicer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSlicerComponent implements OnInit, OnDestroy {
  constants = DashboardConstants;
  @Input() config: any;
  applyButtonConfig = {
    title: "APPLY",
    // flat: true,
    primaryBtn: true
  };
  cancelButtonConfig = {
    title: "Cancel",
    flat: true
  };
  lstOfSelectedFilterValues: Array<any> = [];
  lstOfSlicerFilterToRemove: any = [];
  slicerLoaderConfig: any;
  isActiveSearch: boolean = false;
  showClose: boolean = false;
  checkboxConfig: any = {
    disable: false,
    isMandatory: false,
    isVisible: false,
    label: "",
    validate: true,
    focus: true,
    errorMessage: "",
    fieldKey: "IsSelected",
    data: 'IsSelected'
  };
  isSlicerFilterSidebarExpand = false;
  _dashboardComm: any;
  filterIconValue: string = '#icon_Filter';

  constructor(private _globalFilterService: GlobalFilterService,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _dashboardCommService: DashboardCommService,
    private _commUtil: CommonUtilitiesService,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    private _cdRef: ChangeDetectorRef) { }


  ngOnInit() {
    this._dashboardComm = this._dashboardCommService;
    this.isSlicerFilterSidebarExpand = this.config.isSlicerFilterSidebarExpand;
    this.updateSlicerFilterIcon();
    //this.slicerLoaderConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardLoaderConfig);
    if (this.config.createSlicerComponent) {
      //IF this is the call for creating the component after opening the dashboard with the slicer filter saved on it.
      this._dashboardCommService.showSlicerLoader = true;
      //Once we know that this is open dashboard we will reset the config value and update the slicerFilter's filterList.
      this.config.config = this.config.config;
      this.setState();
      this.updateSlicerFilterIcon();
      this.updateSlicerFilter(undefined);
    }
    if (this.config.lstOfSlicerFilterToRemove && this.config.lstOfSlicerFilterToRemove.length > 0) {
      this.updateSlicerComponent(this.config.lstOfSlicerFilterToRemove);
    }
    this._dashboardCommService.updateSlicerFilterData = this.updateSlicerFilter.bind(this);

    window.addEventListener('scroll', () => {
      this.CalcFilterPanelHeight();
    });
    setTimeout(() => {
      this.setState();
    }, 150);
  }


  updateSlicerComponent = debounce((lstOfSlicerFilterToRemove) => {
    // this._cdRef.detach()
    each(lstOfSlicerFilterToRemove, (_val: any, _index: number) => {
      this.onRemoveFilterObject(_val);
    });
    // this._cdRef.reattach();
    this.setState();
    this.updateSlicerFilter(undefined, true);
    this.applyFilter();

  }, 150, {
    leading: false,
    trailing: true
  })

  openSearch(index) {
    this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).SearchConfig.IsSearchActive = true;
    this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).SearchConfig.ShowSearchClose = true;
  }

  hideSearch(index) {
    this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).SearchConfig.IsSearchActive = false;
    this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).SearchConfig.ShowSearchClose = false;
    this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).SearchConfig.SearchText = '';
    let _ind = findIndex(this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).ReportDetail.lstFilterReportObject,
      (_val: any) => { return _val.reportObject.reportObjectId == this.config.config[index].ReportObjectId });
    if (_ind != -1) {
      this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).ReportDetail.lstFilterReportObject.splice(_ind, 1);
    }
    this._dashboardCommService.slicerFilterConfig.get(this.config.config[index].ReportObjectId).ReportDetail.pageIndex = 1;
    this.getSlicerFilterCallForLazyLoadingAndSearch(this.config.config[index], true);
  }

  onSearchKeypress($event, filter) {
    this.serachFilterValue($event, filter);
  }


  serachFilterValue = debounce(($event, filter) => {
    let slicerFilterObject = this._commUtil.getDeReferencedObject(this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).FilterObject);
    slicerFilterObject.values = [];
    slicerFilterObject.values.push(this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).SearchConfig.SearchText);
    slicerFilterObject.operators = slicerFilterObject.reportObject.filterType === DashboardConstants.FilterType.Year ? DashboardConstants.ReportObjectOperators.Is : DashboardConstants.ReportObjectOperators.Contains;
    //In case of searchhing value we will always reset the pageIndex to 1.
    this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).ReportDetail.pageIndex = 1;
    //We will first check if this filter is present i.e. user has already searched any value here if yes we will remove it.
    let _ind = findIndex(this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).ReportDetail.lstFilterReportObject,
      (_val: any) => { return _val.reportObject.reportObjectId == filter.ReportObjectId });
    if (_ind != -1) {
      this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).ReportDetail.lstFilterReportObject.splice(_ind, 1);
    }
    //When the user add some text in the input field and he wants to search for that value.
    if (this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).SearchConfig.SearchText != "") {
      this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).ReportDetail.lstFilterReportObject.push(slicerFilterObject);
    }
    this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId).ReportDetail.pageIndex = 1;
    this.getSlicerFilterCallForLazyLoadingAndSearch(filter, true);
  }, 1000, {
    'leading': false,
    'trailing': true
  }
  );


  removeFilter(index) {
    //this._dashboardCommService.removeSlicerFilter(this.config.config[index],this.config.config)
    this.onRemoveFilterObject(this.config.config[index]);
    this.updateSlicerFilter(undefined, true);
    this.applyFilter();
  }


  removeSlicerFilters() {
    let nosOfSlicerFilters = this.config.config.length;
    for (let i = 0; i < nosOfSlicerFilters; i++) {
      //chk and remove this each.
      each(this.config.config[i].FilterList, (_val) => {
        _val.IsSelected = false;
      });
      this.config.config[i].selectedFilterList = [];
      this.config.config[i].FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
      this.config.config[i].isChecked = false
      this.config.config[i].FilterList = [];
      let _filterIndex = this._globalFilterService.reportingObjects.findIndex(x => x.ReportObjectId == this.config.config[i].ReportObjectId);
      if (_filterIndex != -1) {
        this._globalFilterService.reportingObjects[_filterIndex].FilterList = [];
        this._globalFilterService.reportingObjects[_filterIndex].selectedFilterList = [];
        this._globalFilterService.reportingObjects[_filterIndex].FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
      }
    }
    each(this.config.config, (_filter) => {
      let index = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: _filter.ReportObjectId });
      if (index != -1) {
        this._dashboardCommService.appliedFilters.splice(index, 1);
      }
      let _index = findIndex(this._dashboardCommService.lstOfGlobalFilters, (_val) => _val.reportObject.reportObjectId === _filter.ReportObjectId);
      if (_index != -1) {
        this._dashboardCommService.lstOfGlobalFilters.splice(_index, 1);
      }
      this._dashboardCommService.slicerFilterConfig.delete(_filter.ReportObjectId)
      // delete this._dashboardCommService.slicerFilterConfig[_filter.ReportObjectId];
    });
    this._dashboardCommService.slicerFilterList = [];
    this.config.config = [];
    //Since this a slightly different call. i.e. we add isRemoveAllSlicer we will not use applyFilterMethod and wrtie it here.
    this._dashboardCommService.setAppliedFilterData(
      {
        validatedTabs: this._dashboardCommService.appliedFilters,
        appliedFilterData: [],
        filterType: DashboardConstants.PopupFor.Slicer,
        isRemoveAllSlicer: true
      }
    );
  }


  CalcFilterPanelHeight() {
    let isHeaderFixed = document.querySelector('.extra-nav-wrap-fixed');
    var dashboardSlicerEle = this._elementRef.nativeElement.parentNode;
    if (isHeaderFixed) {
      let fixedHeaderHeight = document.querySelector('.extra-nav-wrap-fixed').clientHeight;
      dashboardSlicerEle.style.marginTop = -fixedHeaderHeight + "px";
    } else {
      dashboardSlicerEle.style.marginTop = -window.scrollY + "px";
    }

  }
  filterItemClick(obj, index) {
    if(!this._commUtil.isNune(obj.isExpand)){
      obj.isExpand = true;
    }
    obj.isExpand = !obj.isExpand;
    let currentFilterEle = this._elementRef.nativeElement.querySelector('#selected-filter-' + index);
    if (!obj.isExpand) {
      this._renderer.addClass(currentFilterEle, 'filter-expand-view')
      this._renderer.addClass(currentFilterEle, 'heightAuto');
      this._dashboardCommService.slicerFilterConfig.get(obj.ReportObjectId).SlicerFilterExpanded = false;
    }
    else {
      this._renderer.removeClass(currentFilterEle, 'filter-expand-view');
      this._renderer.removeClass(currentFilterEle, 'heightAuto');
      this._dashboardCommService.slicerFilterConfig.get(obj.ReportObjectId).SlicerFilterExpanded = true;
    }
  }

  onElementScroll(event, filter) {
    var target = event.target || event.srcElement || event.currentTarget;
    if (Math.ceil($(target).scrollTop()) + $(target).innerHeight() >= $(target)[0].scrollHeight) {
      let slicerRoConfig = this._dashboardCommService.slicerFilterConfig.get(filter.ReportObjectId);
      slicerRoConfig.ReportDetail.pageIndex += 1;
      if (slicerRoConfig.ReportDetail.pageIndex <= Math.ceil(slicerRoConfig.ReportDetail.TotalRowCount / (slicerRoConfig.ReportDetail.pageSize - 1))) {
        this.getSlicerFilterCallForLazyLoadingAndSearch(filter);
      }
    }
  }

  change(filterObject, filterValue) {
    this.lstOfSelectedFilterValues.push({ Title: filterValue.toString() });
    this.applySlicerFilterHandler(filterObject);
  }

  applySlicerFilterHandler = debounce((filterObject: any) => {
    let slicerFilterConfigRo = this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId);
    //From the listOfSelectedFilterValues we will first remove all the values whose IsDataPresent flag is false;
    //We will remove the values from filterList if its mapping is not present.
    each(this.lstOfSelectedFilterValues, (_val: any) => {
      let _index = findIndex(slicerFilterConfigRo.SelectedFilterList, { Title: _val.Title });

      //We will remove all the values from the slicerFilterConfig FilterObject Values list so as to update the rest of the slicer filter.
      //We will remove the values from the SelectedFilterList Of SlicerRoConfig if the user has unchecked it.
      if (!filterObject.FilterList[filterObject.FilterList.findIndex(x => x.title.toString() === _val.Title)].IsSelected) {
        slicerFilterConfigRo.FilterObject.values.splice(slicerFilterConfigRo.FilterObject.values.findIndex(x => x.toString() === _val.Title), 1);
        if (_index != -1 &&
          !slicerFilterConfigRo.SelectedFilterList[_index].IsPresentInData) {
          filterObject.FilterList.splice(filterObject.FilterList.findIndex(x => x.title.toString() === _val.Title), 1);
        }
        slicerFilterConfigRo.SelectedFilterList.splice(slicerFilterConfigRo.SelectedFilterList.findIndex(x => x.Title.toString() === _val.Title), 1);
      }

    });
    this.setState();
    //Check if this filter is already applied and now updating the filter selected list.
    let filterIndex = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: filterObject.ReportObjectId });
    if (filterIndex != -1) {
      this._dashboardCommService.appliedFilters.splice(filterIndex, 1);
      this.createSelectedFilterList(filterObject);
    }
    //The filter is applied for the first time.
    else {
      this.createSelectedFilterList(filterObject);
      filterObject.FilterConditionOperator = {
        op: DashboardConstants.ReportObjectOperators.In,
        title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.In]
      }
      filterObject.FilterConditionOperator.FilterConditionObjectId = filter(
        this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
          return filterCdn.Condition == DashboardConstants.ReportObjectOperators.In
        })[0].FilterConditionObjectId;
      filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.In;
      filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.In];
      filterObject.FilterIdentifier = DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource;

    }
    this._dashboardCommService.appliedFilters.push(filterObject);
    this.lstOfSelectedFilterValues = [];
    this.applyFilter();
    this.updateSlicerFilter(filterObject);
    // }
    //}
  }, 1000, {
    'leading': false,
    'trailing': true
  }
  )

  applyFilter() {
    this.updateSlicerFilterIcon();
    this._dashboardCommService.setAppliedFilterData(
      {
        validatedTabs: this._dashboardCommService.appliedFilters,
        appliedFilterData: [],
        filterType: DashboardConstants.PopupFor.Slicer
      }
    );
  }

  /**
   *  In this function we will first reset the selectedFilterlist of the RO, SelectedFiltetList of the SlicerCOnfigRO, and the filterValues of
   *  SlicerFilterRO config. Then we will set those values according to the user selected fitler value. 
   */
  createSelectedFilterList(filterObject: IReportingObjectMultiDataSource): any {
    filterObject.selectedFilterList = [];
    let sliceFilterRoConfig = this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId);
    each(filterObject.FilterList, (_val) => {
      if (_val.IsSelected) {
        filterObject.selectedFilterList.push(_val);
        //In this case the values added to this list will always be selected from the data present and so setting the IsPresentInData as True.
        if (sliceFilterRoConfig.SelectedFilterList.findIndex(x => x.Title.toString() === _val.title.toString()) === -1) {
          sliceFilterRoConfig.SelectedFilterList.push({ Title: _val.title.toString(), IsPresentInData: true });
        }
        if (sliceFilterRoConfig.FilterObject.values.findIndex(x => x.toString() === _val.title.toString()) === -1) {
          sliceFilterRoConfig.FilterObject.values.push(_val.title.toString());
        }
      }
    });
  }

  onRemoveFilterObject(filterObject) {
    // filterObject.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
    filterObject.isChecked = false;
    filterObject.isDisabled = false;
    each(filterObject.FilterList, (_val) => {
      _val.IsSelected = false;
    });
    filterObject.selectedFilterList = [];
    filterObject.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
    filterObject.FilterList = [];
    //We will also chk if this RO is present in the this._globalFilterService.reportingObjects if so we will update the propery here also.
    let _filterIndex = this._globalFilterService.reportingObjects.findIndex(x => x.ReportObjectId == filterObject.ReportObjectId);
    if (_filterIndex != -1) {
      this._globalFilterService.reportingObjects[_filterIndex].FilterList = [];
      this._globalFilterService.reportingObjects[_filterIndex].selectedFilterList = [];
      this._globalFilterService.reportingObjects[_filterIndex].FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
    }

    this._dashboardCommService.slicerFilterConfig.delete(filterObject.ReportObjectId);
    //delete this._dashboardCommService.slicerFilterConfig[filterObject.ReportObjectId];
    let _index = findIndex(this._dashboardCommService.slicerFilterList, { ReportObjectId: filterObject.ReportObjectId });
    if (_index != -1) {
      this._dashboardCommService.slicerFilterList.splice(_index, 1);
    }
    _index = findIndex(this._dashboardCommService.appliedFilters, (_val) => _val.ReportObjectId === filterObject.ReportObjectId);
    if (_index != -1) {
      this._dashboardCommService.appliedFilters.splice(_index, 1);
    }
    _index = findIndex(this._dashboardCommService.lstOfGlobalFilters, (_val) => _val.reportObject.reportObjectId === filterObject.ReportObjectId);
    if (_index != -1) {
      this._dashboardCommService.lstOfGlobalFilters.splice(_index, 1);
    }
    //We will remove this slicer filter from all the rest of the slicerFilter as well.
    if (this._dashboardCommService.slicerFilterConfig.size) {
      this._dashboardCommService.slicerFilterConfig.forEach((value, key) => {
        if (this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail)) {
          let _ind = findIndex(this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.lstFilterReportObject, (_val: any) => {
            return filterObject.ReportObjectId === _val.reportObject.reportObjectId
          })
          if (_ind != -1) {
            this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.lstFilterReportObject.splice(_ind, 1);
          }
        }
      });
    }
    _index = this.config.config.findIndex(x => x.ReportObjectId === filterObject.ReportObjectId);
    if (_index != -1) {
      this.config.config.splice(_index, 1);
    }
  }
  /**
   * 
   * @param drivingSlicerFilter: If the user is selecting some filter values of slicer filter then pass that filter else pass undefined.
   * @param removeSlicerFilters : If the user has removed and particular slicer filter than send this argument as true and the drivingSlicerFilter as undefined.
   * Functionality: Updates the FilterList and selectedFilterList of the SlicerFilter object accrording to the given global and other slicer filter.
   */
  updateSlicerFilter(drivingSlicerFilter: IReportingObjectMultiDataSource, removeSlicerFilters?: boolean) {
    let promiseArray: any = [];
    let tempArray = [];
    if (!removeSlicerFilters) {
      if (this._commUtil.isNune(drivingSlicerFilter) && this._dashboardCommService.slicerFilterConfig.size) {
        this._dashboardCommService.slicerFilterConfig.forEach((value, key) => {
          if (key != drivingSlicerFilter.ReportObjectId &&
            this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail)) {
            //For all the slicer widget who are currently being updated we will set there loader as true.
            this._dashboardCommService.slicerFilterConfig.get(key).SlicerLoaderConfig.api.showLoader(true);
            // We will first check if this current slicer filter is applied if so then we will remove that and apply the new slicer filter.
            let index = findIndex(this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.lstFilterReportObject, (_val: any) => {
              return _val.reportObject.reportObjectId === drivingSlicerFilter.ReportObjectId
            })
            if (index != -1) {
              this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.lstFilterReportObject.splice(index, 1);
            }
            if (drivingSlicerFilter.selectedFilterList.length) {
              this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.lstFilterReportObject.push(this._dashboardCommService.slicerFilterConfig.get(drivingSlicerFilter.ReportObjectId).FilterObject);
            }
            //We will also reset the page index here.
            this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.pageIndex = 1;
            tempArray.push(key);
            promiseArray.push(this._analyticsCommonDataService.generateReport(this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail))
            //We will also set all the SelectedFilter IsPresentInData property  of the this slicer filter in the slicer config as false.
            //Later we will match the response and upate the IsPresentInData accordingly.
            //When lazy loading call is executed then we will also chk there and update the IsPresentInData flag there too.
            each(this._dashboardCommService.slicerFilterConfig.get(key).SelectedFilterList, (_val: any) => {
              _val.IsPresentInData = false;
            });
          }
        });

      }
      else if (this._dashboardCommService.slicerFilterConfig.size) {
        this._dashboardCommService.slicerFilterConfig.forEach((value, _key) => {
          if (this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail)) {
            //This is for the global filter case and we will set the show loader here for all the slicerFIlter loader config. 
            setTimeout(() => {
              this._dashboardCommService.slicerFilterConfig.get(_key).SlicerLoaderConfig.api.showLoader(true);
            }, 10);
            this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail.lstFilterReportObject =
              filter(this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail.lstFilterReportObject,
                (_filterObject: any) => {
                  return _filterObject.FilterIdentifierType != DashboardConstants.FilterIdentifierType.GlobalLevelFilter;
                });

            //We will also reset the page index here.
            this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail.pageIndex = 1;
            //Reset the serarch config.
            this._dashboardCommService.slicerFilterConfig.get(_key).SearchConfig = {
              IsSearchActive: false,
              ShowSearchClose: false,
              SearchText: ''
            }

            //We will reset the filter and apply the lstOfFilterToBeAppliedOnGivenSlicer.
            this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail.lstFilterReportObject = [];

            //We will only apply all the gloabl filters and the slicer filter and not the global filter whose values are -1 i.e. all selected.
            let lstOfFilterToBeAppliedOnGivenSlicer = filter(this._dashboardCommService.lstOfGlobalFilters, (_val) => {
              return _val.reportObject.reportObjectId != _key && _val.filterValue != "-1"
            })

            //Here we push the lstOfGlobalFilter into the ReportDetails list.
            AnalyticsMapperService.MapFilterObjectMetaDataToData(
              this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail,
              lstOfFilterToBeAppliedOnGivenSlicer
            );
            //here after adding this we'll have to check if all the other slicer filter to this slicerFitlerObject is to be applied or not.
            each(this._dashboardCommService.slicerFilterConfig.get(_key).SelectedFilterList, (_val: any) => {
              _val.IsPresentInData = false;
            });
            tempArray.push(_key);
            promiseArray.push(this._analyticsCommonDataService.generateReport(this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail))
          }
        })
      }
    }
    else if (this._dashboardCommService.slicerFilterConfig.size) {
      this._dashboardCommService.slicerFilterConfig.forEach((value, _key) => {
        if (this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail)) {
          //We will also reset the page index here.
          each(this._dashboardCommService.slicerFilterConfig.get(_key).SelectedFilterList, (_val: any) => {
            _val.IsPresentInData = false;
          });
          this._dashboardCommService.slicerFilterConfig.get(_key).SlicerLoaderConfig.api.showLoader(true);
          this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail.pageIndex = 1;
          tempArray.push(_key);
          promiseArray.push(this._analyticsCommonDataService.generateReport(this._dashboardCommService.slicerFilterConfig.get(_key).ReportDetail))
        }
      })
    }
    if (promiseArray.length > 0) {
      //this.slicerLoaderConfig.api.showLoader(true);
      Observable.forkJoin(
        ...promiseArray
      ).subscribe(response => {
        each(response, (res: any, index: number) => {
          let slicerFltRepoObjConfig: any = this._dashboardCommService.slicerFilterConfig.get(tempArray[index]);
          let slicerFltRepoObj: any = filter(this.config.config, { ReportObjectId: tempArray[index] })[0];
          if (
            res instanceof Object &&
            res.Data != 'Error' &&
            res.Data &&
            res.Data.length > 0
          ) {
            //On updating the values of the slicerFilter object we will also reset the pageIndex of the ReportDetail property of this filter.
            //and also update the recordCount.
            slicerFltRepoObjConfig.ReportDetail.pageIndex = 1;
            slicerFltRepoObjConfig.ReportDetail.TotalRowCount = res.TotalRowCount;


            //Done to handle the lazy loading case wherein if the nos. of res data are same as the page size we splice the last record.
            if (res.Data.length === this._dashboardCommService.slicerFilterConfig.get(tempArray[index]).ReportDetail.pageSize) {
              res.Data.splice(res.Data.length - 1, 1);
            }
            //We will empty the filterList and selectedFilterList and then update it.
            slicerFltRepoObj.FilterList = [];
            slicerFltRepoObj.selectedFilterList = [];
            /**
             * No since the filterList for this RO is being updated based on the other slicerFilter.
             * We will first set the IsSelected flag for all the  selectedFilterList in the Slicer FilterConfig for this RO as false.
             * Then update the values of the SelectedFilterList of the SlicerConfig based on the response.
             */

            let configObject = [];
            let counter = 0;
            res.Data.forEach(function (element) {
              let filterList = {};
              filterList["title"] = element[slicerFltRepoObj.DisplayName];
              let _index = findIndex(slicerFltRepoObjConfig.SelectedFilterList, (_val: any) => { return _val.Title.toString() === filterList['title'].toString() });
              if (counter < slicerFltRepoObjConfig.SelectedFilterList.length &&
                _index != -1) {
                filterList["IsSelected"] = true;
                slicerFltRepoObj.selectedFilterList.push(filterList);
                slicerFltRepoObjConfig.SelectedFilterList[_index].IsPresentInData = true;
                counter++;
              }
              else {
                filterList["IsSelected"] = false;
              }
              configObject.push(filterList);
            });
            //Now we push all the filter value whose mapping are not present in the new batch of the filterList at the end of the FilterList.
            //Here we also add the filter values to the selectedFilterList of that RO. 
            each(slicerFltRepoObjConfig.SelectedFilterList, (_val) => {
              if (!_val.IsPresentInData) {
                configObject.push({ 'title': _val.Title, 'IsSelected': true });
                slicerFltRepoObj.selectedFilterList.push({ 'title': _val.Title, 'IsSelected': true });
              }
            });

            slicerFltRepoObj.FilterList = configObject;
            slicerFltRepoObjConfig.SlicerLoaderConfig.api.showLoader(false);
            if (this._dashboardCommService.showSlicerLoader) this._dashboardCommService.showSlicerLoader = false;
            this.setState()
          }
          else if (
            res instanceof Object &&
            res.Data != 'Error' &&
            res.Data &&
            res.Data.length === 0
          ) {
            if (slicerFltRepoObjConfig.SelectedFilterList.length) {
              let configObject = [];
              slicerFltRepoObj.FilterList = [];
              slicerFltRepoObj.selectedFilterList = [];
              each(slicerFltRepoObjConfig.SelectedFilterList, (_val) => {
                if (!_val.IsPresentInData) {
                  configObject.push({ 'title': _val.Title, 'IsSelected': true });
                  slicerFltRepoObj.selectedFilterList.push({ 'title': _val.Title, 'IsSelected': true });
                }
              });
              slicerFltRepoObj.FilterList = configObject;
              slicerFltRepoObjConfig.SlicerLoaderConfig.api.showLoader(false);
              if (this._dashboardCommService.showSlicerLoader) this._dashboardCommService.showSlicerLoader = false;
              this.setState();
            }
            else {
              this.noDataOrErrorOccured(tempArray[index], true);
            }
          }
          else {
            this.noDataOrErrorOccured(tempArray[index], false);
          }
        });
      });
    }
  }


  public showCardLoader() {
    this.config.config.cardLoader = true;
    if (this.slicerLoaderConfig.api["showLoader"]) this.slicerLoaderConfig.api.showLoader(true);
  }


  private getSlicerFilterCallForLazyLoadingAndSearch(filterObject, isSearchCall?: any) {
    this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).SlicerLoaderConfig.api.showLoader(true);
    //In case of search text we will first check if this the serach call then append the filterObject for the search call. 
    // console.log(this.manageSubscription$)
    //this.manageSubscription$.unsubscribe()
    //this.manageSubscription$.unsubscribe()
    if (this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).SlicerSubscription) {
      this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).SlicerSubscription.unsubscribe();
    }
    this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).SlicerSubscription = this._analyticsCommonDataService.generateReport(this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).ReportDetail).
      subscribe(res => {
        if (
          res instanceof Object &&
          res.Data != 'Error' &&
          res.Data &&
          res.Data.length > 0
        ) {

          let slicerFltRepoObjConfig: any = this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId);

          let slicerFltRepoObj: any = filter(this.config.config, { ReportObjectId: filterObject.ReportObjectId })[0];
          //Since this is the call for lazy loaded data we wont reset the filterLIst and the selectedFilterList.
          //slicerFltRepoObj.FilterList = [];
          //slicerFltRepoObj.selectedFilterList = [];

          //If this is the call for searching the filterValue we will update the pageIndex and rowCount of the ReportDetail property of this 
          //slicerRoConfig.
          if (isSearchCall) {
            //On updating the values of the slicerFilter object we will also reset the pageIndex of the ReportDetail property of this filter.
            //and also update the recordCount.
            slicerFltRepoObjConfig.ReportDetail.pageIndex = 1;
            slicerFltRepoObjConfig.ReportDetail.TotalRowCount = res.TotalRowCount;
            //We will empty the filterList and selectedFilterList and then update it.
            slicerFltRepoObj.FilterList = [];
            slicerFltRepoObj.selectedFilterList = [];
            each(this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).SelectedFilterList, (_val: any) => {
              _val.IsPresentInData = false;
            });
          }


          /** In case of the lazy laoded data we will first check if this is for the data other than the first page.
           *  If thats the case we will first remove all the data from the filteredList and selectedFilter list whose data is not present.
           * i.e. IsPresentData flag is false and then again fill them according to the logic in the below iteration.
           */
          if (slicerFltRepoObjConfig.ReportDetail.pageIndex > 1) {
            each(slicerFltRepoObjConfig.SelectedFilterList, (_val: any) => {
              if (!_val.IsPresentInData) {
                let _index = findIndex(slicerFltRepoObj.FilterList, (_value: any) => { return _value.title.toString() === _val.Title.toString() });
                if (_index != -1)
                  slicerFltRepoObj.FilterList.splice(_index, 1);
                _index = findIndex(slicerFltRepoObj.selectedFilterList, (_value: any) => { return _value.title.toString() === _val.Title.toString() });
                if (_index != -1)
                  slicerFltRepoObj.selectedFilterList.splice(_index, 1);
              }
            });
          }


          //Done to handle the lazy loading case wherein if the nos. of res data are same as the page size we splice the last record.
          if (res.Data.length === this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).ReportDetail.pageSize) {
            res.Data.splice(res.Data.length - 1, 1);
          }
          /**
           * No since the filterList for this RO is being updated based on the other slicerFilter.
           * We will first set the IsSelected flag for all the  selectedFilterList in the Slicer FilterConfig for this RO as false.
           * Then update the values of the SelectedFilterList of the SlicerConfig based on the response.
           */

          let configObject = [];
          let counter = 0;
          res.Data.forEach(function (element) {
            let filterList = {};
            filterList["title"] = element[slicerFltRepoObj.DisplayName];
            let _index = findIndex(slicerFltRepoObjConfig.SelectedFilterList, (_val: any) => { return _val.Title.toString() === filterList['title'].toString() });
            if (counter < slicerFltRepoObjConfig.SelectedFilterList.length &&
              _index != -1) {
              filterList["IsSelected"] = true;
              slicerFltRepoObj.selectedFilterList.push(filterList);
              slicerFltRepoObjConfig.SelectedFilterList[_index].IsPresentInData = true;
              counter++;
            }
            else {
              filterList["IsSelected"] = false;
            }
            configObject.push(filterList);
          });
          //Now we push all the filter value whose mapping are not present in the new batch of the filterList at the end of the FilterList.
          //Here we also add the filter values to the selectedFilterList of that RO. 
          each(slicerFltRepoObjConfig.SelectedFilterList, (_val) => {
            if (!_val.IsPresentInData) {
              configObject.push({ 'title': _val.Title, 'IsSelected': true });
              slicerFltRepoObj.selectedFilterList.push({ 'title': _val.Title, 'IsSelected': true });
            }
          });
          //If this is the call for search then we will replace the FilterList
          if (isSearchCall) {
            slicerFltRepoObj.FilterList = configObject;
          }
          //Else if this is the call for lazy loading data then we will append the respone to the FilterList.
          else {
            slicerFltRepoObj.FilterList.push(...configObject);
          }
          //this.slicerLoaderConfig.api.showLoader(false);

          this._dashboardCommService.slicerFilterConfig.get(filterObject.ReportObjectId).SlicerLoaderConfig.api.showLoader(false);
          this.setState();
        }
        else if (
          res instanceof Object &&
          res.Data != 'Error' &&
          res.Data &&
          res.Data.length === 0
        ) {
          this.noDataOrErrorOccured(filterObject.ReportObjectId,true);
        }
        else {
          this.noDataOrErrorOccured(filterObject.ReportObjectId,false);
        }

      });
  }
  onCancel() {

  }
  private setState() {
    this._cdRef.markForCheck();
  }


  trackByFilterId(index: number, filter: any): string {
    return filter.ReportObjectId;
  }



  updateSlicerFilterIcon() {
    this.filterIconValue = '#icon_Filter';
    if (this._dashboardCommService.slicerFilterConfig.size) {
      this._dashboardCommService.slicerFilterConfig.forEach((value, key) => {
        if (this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(key).SelectedFilterList)) {
          if (this._dashboardCommService.slicerFilterConfig.get(key).SelectedFilterList.length) {
            this.filterIconValue = '#icon_FilterAppli'
            return;
          }
          else {
            if (this.filterIconValue != '#icon_FilterAppli'){
                this.filterIconValue = '#icon_Filter';
             }
          }
        }
      })
    }
  }

   noDataOrErrorOccured(key:string,isNoData:boolean){
    let slicerFilterConfig = this._dashboardCommService.slicerFilterConfig.get(key);
    let slicerFltRepoObj: any = filter(this.config.config, { ReportObjectId: key })[0];
    slicerFltRepoObj.FilterList = [];
    slicerFltRepoObj.selectedFilterList = [];
    slicerFilterConfig.Message = isNoData ?  DashboardConstants.UIMessageConstants.STRING_SLICER_NO_DATA_RETURNED_TXT : 'Error Occurred.'
    slicerFilterConfig.SlicerLoaderConfig.api.showLoader(false);
    if (this._dashboardCommService.showSlicerLoader) this._dashboardCommService.showSlicerLoader = false;
    this.setState();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', () => {
      this.CalcFilterPanelHeight();
    });
  }

}
