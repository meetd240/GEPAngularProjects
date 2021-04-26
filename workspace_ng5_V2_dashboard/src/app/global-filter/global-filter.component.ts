import { Component, OnInit, ElementRef, Renderer2, ViewEncapsulation, ViewContainerRef, ViewChild, Input, ComponentFactoryResolver, TemplateRef, EmbeddedViewRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@vsGlobalFilterService';
// import { visionModulesManifest, LazyComponentConfiguration } from '../../../modules-manifest';
import { DashboardConstants } from '@vsDashboardConstants';
import { DashboardCommService } from '@vsDashboardCommService';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { LoaderService } from '@vsLoaderService';
import { filter, map, findIndex, each, sortBy, find } from 'lodash';
@Component({
    templateUrl: './global-filter.component.html',
    styleUrls: ['./global-filter.component.scss'],
    // providers: [GlobalFilterService]
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})

export class GlobalFilterComponent implements OnInit {
    // static componentId = LazyComponentConfiguration.GlobalFilter.componentName;
    filterConfig: any;
    reportingObjects: any;
    isFilterOpen;
    // public reinitializedFilterConfig = new BehaviorSubject<any>({})
    constants = DashboardConstants;
    cancelButtonConfig = {
        "title": DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
        "flat": true
    }
    applyButtonConfig = {
        "title": DashboardConstants.UIMessageConstants.STRING_APPLY_TXT,
        "flat": true
    }

    @ViewChild('filterTypeContainer', { read: ViewContainerRef }) private filterTypeContainerRef: ViewContainerRef;
    @ViewChild('outletTemplate') outletTemplateRef: TemplateRef<any>;

    @ViewChild('addToStandardFilter', { read: ViewContainerRef }) private addToStandardFilterRef: ViewContainerRef;
    tmpAddToStandardFilterRef: EmbeddedViewRef<any>;
    // @Input() dataSourceTypeTitle: any;
    // @Input() globalFilterRef;
    // @Input() selectedView;
    @Input() config;
    public filterTabList;
    public tooltipconfig: any = {
        message: DashboardConstants.UIMessageConstants.STRING_APPLIED_AS_SLICER,
        position: DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.RIGHT,
    }

    //#region <======  Dashboard Card Component Global Filter Chunk Configuration ===>
    // fliterTypeManifest: IManifestCollection = visionModulesManifest;
    //#endregion

    msgDatasourceDisplay: any = {
        datasourceDisplayMessage: DashboardConstants.OpportunityFinderConstants.STRING_EMPTY,
        sliderTooltipConfig: {
            delay: 100,
            html: false,
            message: DashboardConstants.OpportunityFinderConstants.STRING_EMPTY,
            position: DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.LEFT,
        },
        filterLevel: DashboardConstants.OpportunityFinderConstants.STRING_EMPTY,
    };

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _element: ElementRef,
        private _renderer2: Renderer2,
        private _dashboardCommService: DashboardCommService,
        public _loaderService: LoaderService,
        private _globalFilterService: GlobalFilterService,
        private _commUtils: CommonUtilitiesService) {

    }

    ngOnInit() {
        if (
            this._globalFilterService.reportingObjects != undefined &&
            this._globalFilterService.currentView === this.config.selectedView &&
            !this.config.isTabFilter
        ) {
            this.reportingObjects = this._globalFilterService.reportingObjects;
            this._globalFilterService.chip = JSON.parse(JSON.stringify(this.reportingObjects));
        } else {
            this.reportingObjects = this.config.filterTabList;
            //START - Used for lazyloading in filter for view/dashboard created by elasticsearch datasource 
            this.reportingObjects.map(ro => ro.pageIndex = 1);
            //END - Used for lazyloading in filter for view/dashboard created by elasticsearch datasource 
            if (!this.config.isTabFilter) {
                this._globalFilterService.reportingObjects = this.reportingObjects;
            }
            else {
                this._globalFilterService.lstOfFilterRoInTab = this._commUtils.getDeReferencedObject(this.reportingObjects);
            }
            this._globalFilterService.chip = JSON.parse(JSON.stringify(this.reportingObjects));
            this._globalFilterService.currentView = this.config.selectedView;
        }
        //We will set the fitlerIdentifier type of reportOject as slicer if they are present in the slicer filter config
        each(this.reportingObjects, (_val: any) => {
            if (this._commUtils.isNune(this._dashboardCommService.slicerFilterConfig.get(_val.ReportObjectId)) && !this.config.isTabFilter) {
                _val.FilterIdentifier = DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource
            }
            else {
                _val.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
            }
        })

        //this.globalFilterService.chip = JSON.parse(JSON.stringify(this.filterTabList));
        this._activatedRoute.data.subscribe((data) => {
            this.filterConfig = data.config;
        });
        // let isFilterOpen = this.globalFilterService.fadeOutDashboardGrid();
        // isFilterOpen = !isFilterOpen;
        // if (isFilterOpen == true) {
        //     let dashboardWrapper = document.getElementById('dashboard-container-id');
        //     dashboardWrapper.classList.add("global-filter-fixed");
        // }
        this.reportingObjects.forEach(element => {
            if (([DashboardConstants.FilterType.Quarter,
            DashboardConstants.FilterType.QuarterYear,
            DashboardConstants.FilterType.MonthYear,
            DashboardConstants.FilterType.Month].indexOf(element.FilterType) != -1)) {
                if (!(this._commUtils.isNune(element.sourceQuarterDropDown.options) && element.sourceQuarterDropDown.options.length > 0) &&
                    (element.filterCdnSet || element.filterValueSet)) {
                    element.FilterTabInfo = element.FilterConditionText.value;
                }
                else {
                    element.FilterTabInfo = "";
                }

            }
        });
        this.prepareMessageForDisplayDatasource(this.config.dataSourceTypeTitle);
    }

    ngAfterViewInit() {
        let thisRef = this;
        setTimeout(() => {
            thisRef._renderer2.addClass(this._element.nativeElement.querySelector('.model_body'), 'open');
            let activeFilter = this._globalFilterService.getActiveFilter();
            //On click of plus icon in the filter panel active filter should be the first filter in the global filter tab
            if (activeFilter == undefined) {
                if (
                    this._commUtils.isNune(this._dashboardCommService.appliedFilters) &&
                    this._commUtils.isNune(this.reportingObjects) &&
                    !this.config.isTabFilter
                ) {
                    let firstIndex = findIndex(this._dashboardCommService.appliedFilters, (itemAppliedFilters) => { return itemAppliedFilters.ReportObjectId === this.reportingObjects[0].ReportObjectId });
                    if (firstIndex != -1)
                        activeFilter = this._dashboardCommService.appliedFilters[firstIndex];
                    //After setting the first tab details all the applied filter details must also be in sync with filterPanel in case of cancel especially
                    this._dashboardCommService.appliedFilters.forEach((appliedFiltersItem) => {
                        let reportObjectIndex = findIndex(this.reportingObjects, { ReportObjectId: appliedFiltersItem.ReportObjectId });
                        if (reportObjectIndex != -1) {
                            this.reportingObjects[reportObjectIndex].selectedFilterList = appliedFiltersItem.selectedFilterList;
                            if (this.reportingObjects[reportObjectIndex].FilterList.length) {
                                appliedFiltersItem.FilterList.forEach(activeFilterEle => {
                                    let eleIndex = findIndex(this.reportingObjects[reportObjectIndex].FilterList, { title: activeFilterEle.title });
                                    if (eleIndex != -1) {
                                        this.reportingObjects[reportObjectIndex].FilterList[eleIndex].IsSelected = activeFilterEle.IsSelected;
                                    }
                                });
                            }
                            if (this.reportingObjects[reportObjectIndex].filteredList.length) {
                                appliedFiltersItem.filteredList.forEach(activeFilteredListEle => {
                                    let indexFilteredList = findIndex(this.reportingObjects[reportObjectIndex].filteredList, { title: activeFilteredListEle.title })
                                    if (indexFilteredList != -1) {
                                        this.reportingObjects[reportObjectIndex].filteredList[indexFilteredList].IsSelected = activeFilteredListEle.IsSelected;
                                    }
                                });
                            }
                        }
                    })
                }
            }
            if (activeFilter) {
                let reportObjectId = activeFilter.ReportObjectId;
                this.reportingObjects.forEach((element) => {
                    if (reportObjectId === element.ReportObjectId) {
                        if (activeFilter.selectedFilterList && activeFilter.selectedFilterList.length > 0)
                            element.selectedFilterList = activeFilter.selectedFilterList;
                        //To keep the selectedFilterList,FilterList of reportingObjects and activeFilter in sync   
                        if (element.FilterList.length) {
                            // element.FilterList ={...element.FilterList,...activeFilter.FilterList};
                            activeFilter.FilterList.forEach(activeFilterEle => {
                                let eleIndex = findIndex(element.FilterList, { title: activeFilterEle.title });
                                if (eleIndex != -1) {
                                    element.FilterList[eleIndex].IsSelected = activeFilterEle.IsSelected;
                                }
                            });
                        }

                        if (element.filteredList.length) {
                            activeFilter.filteredList.forEach(activeFilteredEle => {
                                let indexFilteredListElement = findIndex(element.filteredList, { title: activeFilteredEle.title });
                                if (indexFilteredListElement != -1) {
                                    element.filteredList[indexFilteredListElement].IsSelected = activeFilteredEle.IsSelected;
                                }
                            });
                        }
                        element.IsShowSelected = activeFilter.IsShowSelected;
                        activeFilter = element;
                    }
                });
                thisRef.onTabChange(activeFilter);
            }
            else {
                thisRef.onTabChange(this.reportingObjects[0]);
            }
            this.reportingObjects.forEach(element => {
                if ([DashboardConstants.FilterType.Quarter,
                DashboardConstants.FilterType.QuarterYear,
                DashboardConstants.FilterType.MonthYear].indexOf(element.FilterType) === -1) {
                    this._globalFilterService.getFilterTabInfo(element);
                }
                else if ([DashboardConstants.FilterType.Quarter,
                DashboardConstants.FilterType.QuarterYear,
                DashboardConstants.FilterType.MonthYear,
                DashboardConstants.FilterType.Month].indexOf(element.FilterType) != -1) {
                    if (this._commUtils.isNune(element.sourceQuarterDropDown.options) && element.sourceQuarterDropDown.options.length > 0) {
                        this._globalFilterService.getFilterTabInfo(element);
                    }
                }
            });
            //this.router.navigate(['./number','123'], { relativeTo: this.activatedRoute, skipLocationChange: true });
            thisRef.scrollToView();
        }, 200);
    }

    async onTabChange(tab) {
        this._loaderService.showGlobalLoader();
        for (var i = 0; i < this.reportingObjects.length; i++) {
            if (tab.DisplayName === this.reportingObjects[i].DisplayName) {
                this.reportingObjects[i].active = true;
            } else {
                this.reportingObjects[i].active = false;
            }
        }
        tab["isTabFilter"] = this.config.isTabFilter;
        let _componentRef;
        switch (tab.FilterType) {
            case DashboardConstants.FilterType.SingleSelect:
                _componentRef = 'string-filter/string-filter'
                break;
            case DashboardConstants.FilterType.MultiSelect:
                _componentRef = 'string-filter/string-filter'
                break;
            case DashboardConstants.FilterType.Measure:
                _componentRef = 'measure-filter/measure-filter'
                break;
            case 3:
                break;
            case 4:
                _componentRef = 'period-filter/period-filter';
                break;
            case 5:
                _componentRef = 'period-filter/period-filter';
                break;
            case 6:
                _componentRef = 'period-filter/period-filter';
                break;
            case 7:
                _componentRef = 'period-filter/period-filter';
                break;
            case 8:
                _componentRef = 'period-filter/period-filter';
                break;
            case 9:
                _componentRef = 'period-filter/period-filter';
                break;
            case DashboardConstants.FilterType.Number:
                _componentRef = 'number-filter/number-filter'
                break;
        }
        this.filterTypeContainerRef.detach();
        this.filterTypeContainerRef.clear();
        this.filterTypeContainerRef.createEmbeddedView(this.outletTemplateRef, {
            manifestPath: _componentRef,
            config: { config: tab }
        });

        this._globalFilterService.getFilterTabInfo(tab);
    }

    onCancel(event) {
        let _currentTab = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
        if (this.config.isTabFilter) {
            each(_currentTab.filterTabList, (_filterTab) => {
                let _filter = filter(this._globalFilterService.lstOfFilterRoInTab, (_filter: any) => { return _filter.ReportObjectId === _filterTab.ReportObjectId })[0];
                let _filterList = _filterTab.FilterList;
                each(_filterList, (_filterValue)=>{
                    _filterValue.IsSelected = false;
                });
                _filterTab = this._commUtils.getDeReferencedObject(_filter);
                _filterTab.FilterList = _filterList;
            })
        }
        else {
            this._globalFilterService.cancelGlobalFilter();
        }
        //this.reportingObjects = JSON.parse(JSON.stringify(this.reportingObjects))
        this._dashboardCommService.globalFilterApplyCancelClick();
        this.config.globalFilterRef.detach();
        this.config.globalFilterRef.clear();
        this.fixGlobalFilter();
        let lstFilterObject = this._globalFilterService.reportingObjects;
        if (this.config.isTabFilter) {
            lstFilterObject = _currentTab.filterTabList;
        }
        let appliedFilterList = this.config.isTabFilter ? _currentTab.lstAppliedTabFilters :
            this._dashboardCommService.appliedFilters;
        //To keep the filterPanelList,selectedFilterList,FilterList in sync in case of cancel
        if (this._commUtils.isNune(appliedFilterList)) {
            appliedFilterList.forEach((item) => {
                if (item.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    let tempSelectedFilteredList = this._commUtils.getDeReferencedObject(item.filterPanelList);
                    map(tempSelectedFilteredList, (item) => {
                        item["IsSelected"] = true;
                        if (item.title == DashboardConstants.DAXQueryManipulate.EmptyFiltersData) {
                            item.title = "";
                        }
                        delete item.isStriked;
                    });
                    item.selectedFilterList = tempSelectedFilteredList;
                    if (item.FilterList.length) {
                        item.FilterList.forEach((filterListEle, index) => {
                            let eleIndex = findIndex(item.filterPanelList, (filterPanelListEle) => { return filterPanelListEle.title == filterListEle.title });
                            if (eleIndex == -1 && filterListEle.title == "") {
                                eleIndex = findIndex(item.filterPanelList, (filterPanelListEle) => { return filterPanelListEle.title == DashboardConstants.DAXQueryManipulate.EmptyFiltersData });
                            }
                            if (eleIndex == -1) {
                                item.FilterList[index].IsSelected = false;
                            }
                            else {
                                item.FilterList[index].IsSelected = true;
                            }
                        });
                    }
                    if (item.filteredList.length) {
                        item.filteredList.forEach((filteredListEle, index) => {
                            let eleIndex = findIndex(item.filterPanelList, (filterPanelListEle) => { return filterPanelListEle.title == filteredListEle.title });
                            if (eleIndex == -1 && filteredListEle.title == "") {
                                eleIndex = findIndex(item.filterPanelList, (filterPanelListEle) => { return filterPanelListEle.title == DashboardConstants.DAXQueryManipulate.EmptyFiltersData });
                            }
                            if (eleIndex == -1) {
                                item.filteredList[index].IsSelected = false;
                            }
                            else {
                                item.filteredList[index].IsSelected = true;
                            }
                        });
                    }
                }
                if (item.FilterType === DashboardConstants.FilterType.Month) {
                    if (item.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {

                        let reportObject = find(lstFilterObject, { ReportObjectId: item.ReportObjectId });
                        this.mapPropsValueFromReportingObjectToAppliedFilter(item, reportObject);
                    }
                }
                else if (item.FilterType === DashboardConstants.FilterType.Measure) {
                    let reportObject = find(lstFilterObject, { ReportObjectId: item.ReportObjectId });
                    this.mapPropsValueFromReportingObjectToAppliedFilter(item, reportObject);
                }
            });
            /*Commenting fill filter panel list for fixing ANLT-9307 - Issue strike through line not appearing for the first time
             after clicking Cancel of global filter */
            // this._dashboardCommService.fillFilterPanelList();
        }
    }

    applyFilter(event) {

        // this.fixGloabalFilter();
        event.isTabFilter = this.config.isTabFilter ? true : false;
        this._dashboardCommService.globalFilterApplyCancelClick();

        setTimeout(() => {
            this.config.globalFilterRef.detach();
            this.config.globalFilterRef.clear();        
            this._globalFilterService.applyGlobalFilter(event);
        }, 300);


        this.fixGlobalFilter();
    }

    fixGlobalFilter() {
        this.isFilterOpen = this._globalFilterService.fadeOutDashboardGrid();
        this.isFilterOpen = !this.isFilterOpen
        let dashboardWrapper = document.getElementById('dashboard-container-id'),
            mainContainer = document.getElementById('main-container-id');;
        if (this.isFilterOpen) {
            dashboardWrapper.classList.add("global-filter-fixed");
            mainContainer.classList.add("overflow-hide");
        }
        else {
            dashboardWrapper.classList.remove("global-filter-fixed");
            mainContainer.classList.remove("overflow-hide");
        }
        this._dashboardCommService.openGlobalFilter(this.isFilterOpen);

    }

    clearAllSelections(obj) {
        this._globalFilterService.clearFilter(obj);
    }

    // scroll to active filter on click
    scrollToView() {
        setTimeout(() => {
            let scrollEle = this._element.nativeElement.querySelector('.tabparent .tab .active'),
                scrollIntoViewOptions = { block: "center", inline: "nearest" };
            if (scrollEle) {
                scrollEle.scrollIntoView(scrollIntoViewOptions);
            }
        });
    }


    private prepareMessageForDisplayDatasource(dataSourceTypeTitle: any) {
        if (dataSourceTypeTitle == DashboardConstants.ViewFilterType.SingleSource) {
            if (this.config.isTabFilter) {
                this.msgDatasourceDisplay.datasourceDisplayMessage = DashboardConstants.UIMessageConstants.STRING_SINGLE_SOURCE_TAB;
                this.msgDatasourceDisplay.sliderTooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SINGLE_SOURCE_TAB_INFO_MSG;
            }
            else {
                this.msgDatasourceDisplay.datasourceDisplayMessage = DashboardConstants.UIMessageConstants.STRING_SINGLE_SOURCE_VIEW;
                this.msgDatasourceDisplay.sliderTooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SINGLE_SOURCE_VIEW_INFO_MSG;
            }
        }
        else {
            if (this.config.isTabFilter) {
                this.msgDatasourceDisplay.datasourceDisplayMessage = DashboardConstants.UIMessageConstants.STRING_MULTI_SOURCE_TAB;
                this.msgDatasourceDisplay.sliderTooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_MULTI_SOURCE_TAB_INFO_MSG;
            }
            else {
                this.msgDatasourceDisplay.datasourceDisplayMessage = DashboardConstants.UIMessageConstants.STRING_MULTI_SOURCE_VIEW;
                this.msgDatasourceDisplay.sliderTooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_MULTI_SOURCE_VIEW_INFO_MSG;
            }
        }
        this.msgDatasourceDisplay.filterLevel = this.config.isTabFilter ? DashboardConstants.UIMessageConstants.STRING_tabFilters :
            DashboardConstants.UIMessageConstants.STRING_viewFilters;
    }

    public trackByReportObject(index) {
        return index;
    }
    public async openNonStandardFilterPopup() {
        this._loaderService.showGlobalLoader();
        let nonStandardFilterList = this.config.nonStandardFilterList;//JSON.parse(JSON.stringify(this.config.nonStandardFilterList));
        nonStandardFilterList.map((item: any, key: number) => {
            //Here we will check if the filterObject is slicer we will disable that and mark it as checked.
            if (item.FilterIdentifier == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                if (this._commUtils.isNune(this._dashboardCommService.slicerFilterConfig.get(item.ReportObjectId))) {
                    item.isDisable = true;
                    item.isChecked = true;
                }
                else {
                    item.isDisable = false;
                    item.isChecked = false;
                }
            }
            //If it is not slice fitler we will set the disable flag as false.
            else if (item.FilterIdentifier == DashboardConstants.ViewFilterType.SingleSource) {
                item.isDisable = false;
                //We will check if this is present in the filtertablist  if present then we will set the isChecked flag as true
                if (findIndex(this.config.filterTabList, (_value: any) => { return _value.ReportObjectId === item.ReportObjectId }) != -1) {
                    item.isChecked = true;
                }
            }
        });

        const nonStandardFilterPopupConfig: any = {
            api: {
                addClick: () => { this.addToStandardFilter(); },
                closeClick: () => { this.closeAddToStandardFilterPopup(); },
            },
            nonStandardFilterList: nonStandardFilterList,
            filterTabList: this.config.filterTabList
        }
        this.addToStandardFilterRef.detach();
        this.addToStandardFilterRef.clear();
        this.addToStandardFilterRef.createEmbeddedView(this.outletTemplateRef, {
            manifestPath: 'add-to-standard-filter/add-to-standard-filter',
            config: {
                config: nonStandardFilterPopupConfig
            }
        });


    }
    closeAddToStandardFilterPopup() {
        this.addToStandardFilterRef.detach();
        this.addToStandardFilterRef.clear();

    }
    addToStandardFilter() {
        let isCheckedTrueFilters: any = [];
        this.config.filterTabList.forEach(item => {
            if (!item.hasOwnProperty('isChecked') ||
                item.hasOwnProperty('isCheckedTrueFilter') ||
                item.IsStandardFilterRO) {
                isCheckedTrueFilters.push(item);
            }
        });

        //Here we will add all those filters from the nonStandardFilterList which are selected and are not diasbled i.e. slicer filters.
        //To select only the filter objects which are selected and not disabled from the popup.

        each(this.config.nonStandardFilterList, (_val) => {
            if (_val.isChecked &&
                !_val.isDisable &&
                findIndex(isCheckedTrueFilters, (_value: any) => { return _value.ReportObjectId === _val.ReportObjectId }) === -1) {
                isCheckedTrueFilters.push(_val)
            }
        })
        // isCheckedTrueFilters.push(...filter(this.config.nonStandardFilterList, (_val: any) => { return _val.isChecked && !_val.isDisable }));
        //To select the disabled filters from the left panel which are applied as slicer filter.
        each(this.config.filterTabList, (_val: any) => {
            if (_val.isDisable &&
                findIndex(isCheckedTrueFilters, (_value: any) => { return _value.ReportObjectId === _val.ReportObjectId }) === -1) {
                isCheckedTrueFilters.push(_val);
            }
        });
        let stdFilter = filter(isCheckedTrueFilters, (_val: any) => { return _val.IsStandardFilterRO != true });
        isCheckedTrueFilters = filter(isCheckedTrueFilters, (_val: any) => { return _val.IsStandardFilterRO === true });
        stdFilter = sortBy(stdFilter, "DisplayName");
        isCheckedTrueFilters.push(...stdFilter);
        // Removed this check here as when removing the slicer filter we update this prop in the slicer component.
        // each(isCheckedTrueFilters, (_val: any) => {
        //     if (findIndex(this._dashboardCommService.slicerFilterList, { ReportObjectId: _val.ReportObjectId }) === -1) {
        //         _val.FilterList = [];
        //         _val.selectedFilterList = [];
        //         _val.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
        //     }
        // });
        this.config.filterTabList = isCheckedTrueFilters;
        this.reportingObjects = this.config.filterTabList;


        this.closeAddToStandardFilterPopup();
        if (!this.config.isTabFilter) {
            this.config.api.setFilterTabList(this.config.filterTabList);
        }
    }

    onInitialize() {

    }

    onDeinitialize() {

    }

    onActivate() {
        this._loaderService.hideGlobalLoader();
    }

    mapPropsValueFromReportingObjectToAppliedFilter(appliedFilter, reportObject) {
        switch (appliedFilter.FilterType) {
            case DashboardConstants.FilterType.Month: {
                if (reportObject.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                    appliedFilter.FilterConditionOperator = { ...reportObject.FilterConditionOperator };
                    appliedFilter.SelectedYear = { ...reportObject.SelectedYear };
                    appliedFilter.appliedYearFilter = { ...reportObject.appliedYearFilter };
                    each(appliedFilter.appliedYearFilter, (_monthValue) => {
                        let month: any = find(appliedFilter.sourceQuarterYear, { 'name': _monthValue.name });
                        month.IsCheckModel.IsCheck = true;
                    })
                }
                else {
                    appliedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    appliedFilter.FilterRadioOperator = { ...reportObject.FilterRadioOperator };
                    appliedFilter.NextQuarterYearsModel = { ...reportObject.NextQuarterYearsModel };
                    appliedFilter.QuarterYearModel = { ...reportObject.QuarterYearModel };
                    appliedFilter.maintainAppliedData = { ...reportObject.maintainAppliedData };

                }
                appliedFilter.FilterConditionValue = this._commUtils.getDeReferencedObject(reportObject.FilterConditionValue);
                appliedFilter.FilterTabInfo = this._commUtils.getDeReferencedObject(reportObject.FilterTabInfo);
            }
                break;
            case DashboardConstants.FilterType.Measure: {
                appliedFilter.FilterConditionOperator = { ...reportObject.FilterConditionOperator };
                appliedFilter.FilterConditionRangeValue = { ...reportObject.FilterConditionRangeValue };
                appliedFilter.FilterConditionValue = this._commUtils.getDeReferencedObject(reportObject.FilterConditionValue);
                appliedFilter.FilterTabInfo = this._commUtils.getDeReferencedObject(reportObject.FilterTabInfo);
                appliedFilter.FilterConditionText = { ...reportObject.FilterConditionText };


            }
            default:
                break;
        }
    }
}
