import { Component, OnInit, ElementRef, ChangeDetectionStrategy, Renderer2, ViewChild, Input, ViewEncapsulation, TemplateRef, ViewContainerRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { DashboardCommService } from '@vsDashboardCommService';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardConstants } from "@vsDashboardConstants";
import { findIndex, each, filter } from 'lodash';
import { GlobalFilterService } from '@vsGlobalFilterService';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './global-filter-container.component.html',
    styleUrls: ['./global-filter-container.component.scss'],
    // encapsulation: ViewEncapsulation.Native,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GlobalFilterContainerComponent implements OnInit {
    @ViewChild("filterPanelContainer", { read: ViewContainerRef }) filterPanelContainerRef: ViewContainerRef;
    @ViewChild("addFilterTemplate") addFilterTemplateRef: TemplateRef<any>;
    @ViewChild("appliedFiltersTemplate") appliedFiltersTemplateRef: TemplateRef<any>;
    @ViewChild("appliedFiltersOnWidgetTemplate") appliedFiltersOnWidgetTemplateRef: TemplateRef<any>;
    @ViewChild("appliedFiltersOnAllTabsTemplate") appliedFiltersOnAllTabsTemplateRef: TemplateRef<any>;


    @Input() config: any;

    appliedFilterData: any;
    initialLoadFilterData: any;
    strikedListCount: any = 0;
    filterPanelHeight: any;
    manageSubscription$ = new Subscription();
    slicerFilterTypedashboardConstant = DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource;
    cancelFilterBtnConfig: any = {
        title: 'Cancel',
        flat: true,
        disable: true
    };

    applyFilterBtnConfig: any = {
        title: 'Apply',
        flat: true,
        disable: true
    }

    searchKeyText: any = { "value": '' };
    searchListConfig: any = {
        label: '',
        data: 'value',
        attributes: {
            placeholder: 'Search'
        }
    };

    constants = DashboardConstants;
    appliedFiltersOnWidget: any;
    // appliedFiltersOnAllTabs: { DisplayName: string; filterPanelList: { title: string; isStriked: boolean; } };
    appliedFiltersOnCurrentTab = [];
    isTabFilter: boolean = false;
    //When no widgets are present in the tab then we will disable the tab filter for that tab.
    disableTabFilter: boolean = false;
    //Flag to determine whether to show or not the Filter on all tab option.
    showFilterOnAllTab: boolean = false;
    sliderTooltipConfig  = {
        message: "Between filter applied",
        position: "top"
    };

  constructor(private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _dashboardCommService: DashboardCommService,
    private _commUtil: CommonUtilitiesService,
    private _cdRef: ChangeDetectorRef,
    private _globalFilterService: GlobalFilterService
  ) { }

    ngOnInit() {
        // this.config.config = this._commUtil.getDeReferencedObject(this.config.config);
        this.appliedFilterData = this.config.config;

        // this.appliedFiltersOnAllTabs = [{ 'DisplayName' : 'Spend in USD', 'filterPanelList': [{title: "Greater than '1000000' ", isStriked: false}] }];

        this.loadFilterPanel();
        this.manageSubscription$.add(
            this._dashboardCommService.apppliedFilterDataSource$.subscribe((data) => {
                this.loadFilterPanel();
            })
        );
        this.manageSubscription$.add(
            this._dashboardCommService.loadTabFilter$.subscribe((data)=>{
                this.loadFilterPanel();
            })
        );
        this.toggleFilterPanelCss();
        this.config.api.loadFilterPanel = this.loadFilterPanel.bind(this);
        this.config.api.changeDetectionMutation.setGlobalFilterContainerState = this.setState.bind(this);
        this._dashboardCommService.showNoTabFilterMsg =  this._commUtil.isNune(this.config.tabFilter) ?  (this.config.tabFilter.length === 0) : true;
        window.addEventListener('scroll', () => {
            this.CalcFilterPanelHeight();
        });
        //Check if widget is present in the given tab.
        this.disableTabFilter = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails,{tabId: this._dashboardCommService.selectedTab.tabId})[0].lstSectionInfo[0].lstDashletInfo.length === 0;
    }

    ngAfterViewInit() {
    }
    ngOnDestroy() {
        window.removeEventListener('scroll', () => {
        });
        this.manageSubscription$.unsubscribe();
    }
    onFilterSearch() {
        this.setState();
  }

    toggleFilterPanelCss() {
        let filterPanelListEle = this._elementRef.nativeElement.querySelector('.filterWrapperContainer')
        //let filterPanelListEle = this._elementRef.nativeElement.querySelector('.filters-panel-list')
        let filterPanelSearchEle = this._elementRef.nativeElement.querySelector('.filters-panel-search')
        //let clearAllFilterEle = this._elementRef.nativeElement.querySelector('.clear-all-filter')
        // let filterIconEle = this._elementRef.nativeElement.querySelector('.filter-panel-icon')
        if (filterPanelListEle && filterPanelSearchEle) {
            if (!this.config.api.isFilterSidebarExpand) {
                this._renderer.addClass(filterPanelListEle, 'is-hide');
                this._renderer.addClass(filterPanelSearchEle, 'is-hide');
                //this._renderer.addClass(clearAllFilterEle, 'is-hide')
                //this._renderer.setStyle(filterIconEle, 'margin-left', '-26px')

            }
            else {
                this._renderer.removeClass(filterPanelListEle, 'is-hide');
                this._renderer.removeClass(filterPanelSearchEle, 'is-hide');
                // this._renderer.removeClass(clearAllFilterEle, 'is-hide')
                //this._renderer.setStyle(filterIconEle, 'margin-left', '-15px')
            }
        }
    }

    loadFilterPanel() {
        this.filterPanelContainerRef.clear();
        //To check wether in the config we have only slicer filters or any global filter too.
        let isOnlySlicerFiltersPresent = true;
        // each(this.config.config,(_filterObject: any,_index:number)=>{
        //     if(_filterObject.FilterType === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource){
        //         this.config.config.splice(_index,1);
        //     }
        // })

        /* Now in this case the config has all the view level filters i.e. Global as well as Slicer Filters so instead of passing the 
           this.config.config  to the appliedFilterTemplateRef we will create a new config and set store only the filters which are not 
           of Slicer Filter and pass it to the appliedFilterTemplateRef.
        */
        each(this.config.config, (_val: any) => {
            if (_val.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                isOnlySlicerFiltersPresent = false;
                return;
            }
        })



        // if (this.config.config.length > 0 && !isOnlySlicerFiltersPresent) {
        //     this.filterPanelContainerRef.createEmbeddedView(this.appliedFiltersTemplateRef, { $implicit: this.config.config });
        //     this.CalcFilterPanelHeight();
        // }
        // else {
        //     this.filterPanelContainerRef.createEmbeddedView(this.addFilterTemplateRef, { $implicit: this.config.config });

        // }

        //this.filterPanelContainerRef.createEmbeddedView(this.appliedFiltersOnWidgetTemplateRef, { $implicit: this.appliedFiltersOnWidget });
        if (this._dashboardCommService.tabDashletInfo.lstTabDetails[0] &&
            this._dashboardCommService.tabDashletInfo.lstTabDetails[0].tabName.toLowerCase() === DashboardConstants.DefaultTab) {
                this.filterPanelContainerRef.clear();
                this.showFilterOnAllTab = false;
                this.loadGlobalSliderWidget(filter(this.config.config, (x) => { return x.FilterConditionOperator.op == 14 || x.FilterConditionOperator.op == 15 }),false);
        }
        else {
            this.filterPanelContainerRef.createEmbeddedView(this.appliedFiltersTemplateRef, { $implicit: this.config.tabFilter });
            this.showFilterOnAllTab = true;
            this.loadGlobalSliderWidget(filter(this.config.tabFilter, (x) => { return x.FilterConditionOperator.op == 14 || x.FilterConditionOperator.op == 15 }),true);
        }
        this.filterPanelContainerRef.createEmbeddedView(this.appliedFiltersOnAllTabsTemplateRef, { $implicit: this.config.config });
        this.loadGlobalSliderWidget(filter(this.config.config, (x) => { return x.FilterConditionOperator.op == 14 || x.FilterConditionOperator.op == 15 }),false);

        this.CalcFilterPanelHeight();
        this.cancelFilterBtnConfig.disable = true;
        this.applyFilterBtnConfig.disable = true;
        this.setState();
    }

    CalcFilterPanelHeight() {
        //let filterPanelListEle = this._elementRef.nativeElement.querySelector('.filters-panel-list');
        let filterPanelListEle = this._elementRef.nativeElement.querySelector('.filterWrapperContainer')

        if (filterPanelListEle && document.querySelector('.filter-panel-container') != undefined) {
            // filterPanelListEle.style.height = document.querySelector('.filter-panel-container').clientHeight - this._elementRef.nativeElement.querySelector('.filters-panel-header').clientHeight - this._elementRef.nativeElement.querySelector('.filter-panel-footer').clientHeight - this._elementRef.nativeElement.querySelector('.filters-panel-search').clientHeight - 24 + 'px';
            filterPanelListEle.style.height = '67%';
            //filterPanelListEle.style.height = document.querySelector('.filter-panel-container').clientHeight - this._elementRef.nativeElement.querySelector('.filter-panel-footer').clientHeight - this._elementRef.nativeElement.querySelector('.filters-panel-search').clientHeight - 51 + 'px';
            this._renderer.setStyle(filterPanelListEle, 'overflow-y', 'auto')
        }
        this.toggleFilterPanelCss();
    }

    openGlobalFilter(filter) {
        this.config.api.openGlobalFilter(filter);
    }

    openTabFilter(filter) {
        this.config.api.openTabFilter(filter);
  }

    addNewGlobalFilter() {
        if (this._dashboardCommService.appliedFilters.length > 0) {
            this.config.api.openGlobalFilter(this._dashboardCommService.appliedFilters[0]);
        }
        else {
            this.config.api.openGlobalFilter(this._dashboardCommService.listAllReportObjectWithMultiDatasource[0]);
        }
    }

    filterItemClick(obj, index, evt) {
        obj.isExpand = !obj.isExpand;
        let currentFilterEle = this._elementRef.nativeElement.querySelector('#selected-filter-' + index);
        if (obj.isExpand) {
            evt.target.closest('#selected-filter-' + index).classList.add('filter-expand-view');
        }
        else {
            evt.target.closest('#selected-filter-' + index).classList.remove('filter-expand-view');
        }
    }

    removeFilter(obj, index, isCancelFooter, evt, isTabFilter: boolean = false) {
        this.isTabFilter = isTabFilter;
        if (!isCancelFooter || obj.isStriked) {
            obj.isStriked = !obj.isStriked;
        }
        let selectedfilterEle = evt.target.closest('#selected-filter-' + index);
        let filterEle = selectedfilterEle.querySelector(".panel-content-iteamList-item");
        let filterIcon = filterEle.querySelector('.filter-close-icon').querySelector("use");
        this.applyFilterBtnConfig.disable = true;
        this.cancelFilterBtnConfig.disable = true;
        let filterPanelLength: number = obj.filterPanelList.length > 10 ? 10 : obj.filterPanelList.length;
        if (obj.isStriked) {
            this._renderer.setStyle(filterEle, 'text-decoration', 'line-through')
            this._renderer.setStyle(filterEle, 'background-color', '#d6d6d6')
            filterIcon.setAttribute('href', '#icon_Reset')
            for (let i = 0; i < filterPanelLength; i++) {
                this.removefilterList(obj, i, true, evt, isTabFilter)
            }
            // this.strikedListCount = this.strikedListCount + 1
        }
        else {
            this._renderer.setStyle(filterEle, 'text-decoration', 'none')
            this._renderer.setStyle(filterEle, 'background-color', '')
            filterIcon.setAttribute('href', '#icon_Close')
            for (let i = 0; i < filterPanelLength; i++) {
                this.removefilterList(obj, i, true, evt, isTabFilter)
            }
            //this.strikedListCount = this.strikedListCount ? this.strikedListCount - 1 : this.strikedListCount;
        }
        // if (this.strikedListCount) {
        //     this.applyFilterBtnConfig.disable = false;
        //     this.cancelFilterBtnConfig.disable = false;
        // }
        // else {
        //     this.applyFilterBtnConfig.disable = true;
        //     this.cancelFilterBtnConfig.disable = true;
        // }
        this.enableDisableFooterPanel();

    }

    removefilterList(obj, index, isParentFilterStriked, evt, isTabFilter: boolean = false) {
        this.isTabFilter = isTabFilter;
        let filterEle = this._elementRef.nativeElement.querySelector("#selected-filter-list-" + obj.ReportObjectId + "-" + index)
        let filterIcon = this._elementRef.nativeElement.querySelector('.filter-close-icon').querySelector("use");
        obj.filterPanelList[index].isStriked = isParentFilterStriked ? obj.isStriked : !obj.filterPanelList[index].isStriked;
        this.applyFilterBtnConfig.disable = true;
        this.cancelFilterBtnConfig.disable = true;
        if (obj.filterPanelList[index].isStriked) {

            this._renderer.setStyle(filterEle, 'text-decoration', 'line-through')
            this._renderer.setStyle(filterEle, 'background-color', '#d6d6d6')
            if (!isParentFilterStriked) {
                filterIcon.setAttribute('href', '#icon_Reset')
            }
            else {
                if (filterEle.getElementsByClassName('filter-close-icon').length)
                    filterEle.getElementsByClassName('filter-close-icon')[0].classList.add("is-hide")
            }
            //this.strikedListCount = this.strikedListCount + 1
        }
        else {
            if (filterEle.getElementsByClassName('filter-close-icon').length)
                filterEle.getElementsByClassName('filter-close-icon')[0].classList.remove("is-hide")
            this._renderer.setStyle(filterEle, 'text-decoration', 'none')
            this._renderer.setStyle(filterEle, 'background-color', '')
            filterIcon.setAttribute('href', '#icon_Close')
            //this.strikedListCount = this.strikedListCount ? this.strikedListCount - 1 : this.strikedListCount;
        }

        // if (this.strikedListCount) {
        //     this.applyFilterBtnConfig.disable = false;
        //     this.cancelFilterBtnConfig.disable = false;
        // }
        // else {
        //     this.applyFilterBtnConfig.disable = true;
        //     this.cancelFilterBtnConfig.disable = true;
        // }
        this.enableDisableFooterPanel(isTabFilter);

    }
    enableDisableFooterPanel(isTabFilter: boolean = false) {
        let _appliedFilterList = isTabFilter ? this.config.tabFilter : this.config.config;
        for (let item of _appliedFilterList) {
            if (item.isStriked) {
                this.applyFilterBtnConfig.disable = false;
                this.cancelFilterBtnConfig.disable = false;
                break;
            }
            else {
                for (let ele of item.filterPanelList) {
                    if (ele.isStriked) {
                        this.applyFilterBtnConfig.disable = false;
                        this.cancelFilterBtnConfig.disable = false;
                        break;
                    }
                }
            }
        }
    }

    onCancelFilterPanelChanges(evt) {
        for (var i = 0; i < this.config.config.length; i++) {
            this.removeFilter(this.config.config[i], i, true, evt, this.isTabFilter);
        }
        this.setState();
    }
  
     onApplyFilterPanel(e) {
        this._commUtil.checkAllWidgetLoaded().then((_response: boolean) => {
            if (_response) {
                //Calling the onApplyFilter method twice first in case of tabFilter and then for global filter.
                let tabFilterObject: any = this.onApplyFilterPanelChanges(e, true);
                let globalFilterOject: any = this.onApplyFilterPanelChanges(e, false);
                //Calling onApplyFilter at the end only once to reflect the changes when chips are being removed
                this._dashboardCommService.setAppliedFilterData({
                    validatedTabs: globalFilterOject.validatedTabs,
                    validatedFilterForTabs: tabFilterObject.validatedTabs,
                    appliedFilterData: [],
                    applyGlobalFilter: true,
                    isOpenView: true
                });
            }
        });
    }

    onApplyFilterPanelChanges(e, isTabFilter) {
                this.isTabFilter = isTabFilter
                let _lstAppliedFilter = this.isTabFilter ? this.config.tabFilter : this.config.config;
                if (!this._commUtil.isNune(_lstAppliedFilter)) {
                  _lstAppliedFilter = [];
                }
                let chipTemp = this._commUtil.getDeReferencedObject(_lstAppliedFilter);
                chipTemp.forEach((chip, indexChip) => {
                     //The lstAppliedFitler was not getting updated even though the reference is present of this.config.config and this.config.config is being updated properly, hence updating the value of _lstAppliedFilter explicitly.
                    _lstAppliedFilter = this.isTabFilter ? this.config.tabFilter : this.config.config;
                    //  let index = findIndex(this.config.config,(item)=>{ return item.ReportObjectId == chip.ReportObjectId });
                    let index = _lstAppliedFilter.findIndex((item) => { return item.ReportObjectId == chip.ReportObjectId });
                    if (chip.FilterType != DashboardConstants.FilterType.MultiSelect &&
                        chip.FilterType != DashboardConstants.FilterType.Number) {
                        if (chip.isStriked) {
                            _lstAppliedFilter[index].FilterTabInfo = "";
                            _lstAppliedFilter[index].isStriked = false;
                            // removeCurrentChipCallback(e, index);
                            // setTimeout(() => {
                            this.config.api.removeCurrentFilterChip(e, chip, chip.ReportObjectId, this.isTabFilter);
                            this.setState();
                            // }, 1000);

                        }
                        else if (chip.filterPanelList[0].isStriked) {
                            if (chip.FilterConditionValue) {
                                _lstAppliedFilter[index].FilterConditionValue = "";
                            }
                            else if (chip.FilterConditionRangeValue) {
                                _lstAppliedFilter[index].FilterConditionRangeValue = { "from": '', "to": '' }
                            }

                            _lstAppliedFilter[index].FilterTabInfo = ""
                            _lstAppliedFilter[index].filterPanelList.splice(0, 1);
                            _lstAppliedFilter[index].selectedFilterList.splice(0, 1);
                            _lstAppliedFilter[index].autoCompleteFilterList = [];
                            _lstAppliedFilter[index].isStriked = false;
                            if (!this.config.config[index].filterPanelList.length)
                                // removeCurrentChipCallback(e, index);
                                // setTimeout(() => {
                                this.config.api.removeCurrentFilterChip(e, chip, chip.ReportObjectId, this.isTabFilter)
                            this.setState();
                            // }, 1000);
                            //this.config.config.splice(this.config.config.indexOf(chip), 1)
                        }
                    }
                    else if (chip.FilterType == DashboardConstants.FilterType.MultiSelect ||
                        chip.FilterType == DashboardConstants.FilterType.Number) {
                        if (chip.isStriked || (!chip.selectedFilterList.length && chip.FilterConditionValue[0] == DashboardConstants.DAXQueryManipulate.AllRecords && chip.filterPanelList[0].isStriked) || (chip.filterPanelList[0].isStriked && chip.filterPanelList[0].title == "All Selected" && chip.FilterList[0].title == DashboardConstants.DAXQueryManipulate.AllRecords)) {
                            _lstAppliedFilter[index].FilterTabInfo = "";
                            _lstAppliedFilter[index].isStriked = false;
                            // setTimeout(() => {
                            this.config.api.removeCurrentFilterChip(e, chip, chip.ReportObjectId, this.isTabFilter)
                            this.setState();
                            // }, 1000);
                            // removeCurrentChipCallback(e, index);
                        }
                        else if (chip.filterPanelList.length > 0) {
                            if (chip.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                                // for (let filterlist of chip.FilterList) {
                                chip.filterPanelList.forEach((list, indexFilterPanelList) => {
                                    //if ((filterlist.title == list.title || (list.title == "Blank" && filterlist.title == "")) && filterlist.IsSelected && list.isStriked) {
                                    if (list.isStriked) {
                                        let indexList = findIndex(_lstAppliedFilter[index].FilterList, (item1: any) => {
                                            return item1.title.toString().toLowerCase() == list.title.toString().toLowerCase();
                                        })
                                        if (list.title == DashboardConstants.DAXQueryManipulate.EmptyFiltersData) {
                                            indexList = findIndex(_lstAppliedFilter[index].FilterList, (item1: any) => {
                                                return item1.title == "";
                                            })
                                        }
                                        if (indexList > -1 && indexList < _lstAppliedFilter[index].FilterList.length) {
                                            _lstAppliedFilter[index].FilterList[indexList].IsSelected = false;
                                            _lstAppliedFilter[index].PartialSelect = true;
                                            _lstAppliedFilter[index].SelectAll = false;
                                        }
                                        let StrikedEleindex = findIndex(_lstAppliedFilter[index].filterPanelList, list);
                                        _lstAppliedFilter[index].filterPanelList.splice(StrikedEleindex, 1);
                                        if (indexList != -1)
                                            _lstAppliedFilter[index].selectedFilterList.splice(findIndex(_lstAppliedFilter[index].selectedFilterList, ['title', _lstAppliedFilter[index].FilterList[indexList].title]), 1);
                                        // Added in case of lazyloaded filters the filterList does not hold the entire data and hence index might not be found, so splicing based on index from filterPanelList
                                        else if (findIndex(_lstAppliedFilter[index].selectedFilterList, ['title', list.title]) != -1) {
                                            _lstAppliedFilter[index].selectedFilterList.splice(findIndex(_lstAppliedFilter[index].selectedFilterList, ['title', list.title]), 1);
                                        }
                                        if (!_lstAppliedFilter[index].filterPanelList.length) {
                                            _lstAppliedFilter[index].FilterTabInfo = "";
                                            _lstAppliedFilter[index].isStriked = false;
                                            // removeCurrentChipCallback(e, index);
                                            // setTimeout(() => {
                                            this.config.api.removeCurrentFilterChip(e, chip, chip.ReportObjectId, this.isTabFilter)
                                            this.setState();
                                            // }, 1000);
                                            //this.config.config.splice(this.config.config.indexOf(chip), 1)
                                        }
                                        // else{
                                        //     //this.config.api.applyFilterChanges();
                                        //     this._dashboardCommService.setAppliedFilterData(
                                        //         {
                                        //             validatedTabs: this._dashboardCommService.appliedFilters,
                                        //             appliedFilterData: []
                                        //         }
                                        //     );
                                        // }

                                    }
                                });
                                // }
                            }


                            else if (chip.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                                if (chip.filterPanelList[0].isStriked) {
                                    _lstAppliedFilter[index].FilterConditionText.value = "";
                                    _lstAppliedFilter[index].FilterTabInfo = ""
                                    _lstAppliedFilter[index].filterPanelList.splice(0, 1);
                                    _lstAppliedFilter[index].selectedFilterList.splice(0, 1);
                                    if (!_lstAppliedFilter[index].filterPanelList.length) {
                                        _lstAppliedFilter[index].FilterTabInfo = "";
                                        // removeCurrentChipCallback(e, index);
                                        // setTimeout(() => {
                                        _lstAppliedFilter[index].isStriked = false;
                                        this.config.api.removeCurrentFilterChip(e, chip, chip.ReportObjectId, this.isTabFilter)
                                        this.setState();
                                        // }, 1000);
                                    }

                                    //this.config.config.splice(this.config.config.indexOf(chip), 1)
                                }
                            }
                        }
                        else {
                            _lstAppliedFilter.splice(index, 1)
                        }
                    }
                    if (chip.isStriked && _lstAppliedFilter.indexOf(chip) > 0) {
                        _lstAppliedFilter[index].FilterTabInfo = "";
                        _lstAppliedFilter[index].isStriked = false;
                        // removeCurrentChipCallback(e, index);
                        // setTimeout(() => {
                        this.config.api.removeCurrentFilterChip(e, chip, chip.ReportObjectId, this.isTabFilter)
                        this.setState();
                        // }, 1000);
                    }
                    // this.config.api.removeCurrentFilterChip(e, chip, index)
                    //If the user removes the filter we will set its isChecked and isDisabled prop as false
                    if (chip.isStriked) {
                        let ind = findIndex(this._globalFilterService.reportingObjects, { ReportObjectId: chip.ReportObjectId })
                        if (ind != -1) {
                            chip.isDisable = false;
                        }
                    }
                });
                this.strikedListCount = 0;
                this.applyFilterBtnConfig.disable = true;
                this.cancelFilterBtnConfig.disable = true;
        // }

        // this.config.api.applyFilterChanges();
        if (this._dashboardCommService.oppFinderState.oppFinderFlag) {
            this._dashboardCommService.filterCount = 1;
        }
         return {
            validatedTabs: this.isTabFilter ? filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0].lstAppliedTabFilters :
                this._dashboardCommService.appliedFilters,
            appliedFilterData: [],
            applyGlobalFilter: true,
            isTabFilter: this.isTabFilter
          };

  }
  
  /*This method will create the config required for loading global slider widget for between and not between */
    public loadGlobalSliderWidget(filterItem,isTabFilterApplied:boolean = false) {
        if (this._commUtil.isNune(filterItem) && filterItem.length) {
            this._dashboardCommService.createGlobalSliderConfig(filterItem, true, true,isTabFilterApplied);
            // if (this._commUtil.isNune(this.config.tabFilter) && this.config.tabFilter.length && isTabFilterApplied) {
                this.mapGlobalSliderFilterArrayToObject(filterItem, isTabFilterApplied);
                this.setState();
            // }
            
            // if (this._commUtil.isNune(this.config.config) && this.config.config.length && !isTabFilterApplied) {
            //     this.mapGlobalSliderFilterArrayToObject(this.config.config, false);
            // }
            
        }
    }
    mapGlobalSliderFilterArrayToObject(filterObj: any, isTabFilter: boolean = false) {
        filterObj.forEach(item => {
                const index = findIndex(this._dashboardCommService.globalSliderConfigArray, { cardId: item.ReportObjectId });
                if (index != -1) {
                    item["sliderFilterPanelObject"] = this._dashboardCommService.globalSliderConfigArray[index];
                    this._dashboardCommService.globalSliderConfigArray[index].sliderFilterArray[0].isTabFilter = isTabFilter;
                    this.sliderTooltipConfig = this._dashboardCommService.globalSliderConfigArray[index].sliderFilterArray[0].sliderTooltipConfig;
                }
        });
    }
    public setState() {
        this._cdRef.markForCheck();
    }
}
