import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation, Input, Renderer2, AfterViewInit, OnDestroy, ChangeDetectionStrategy, } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
// import { GlobalFilterService } from "@vsGlobalFilterService";
import { IFilterList, IDAXReportFilter } from "@vsCommonInterface";
// import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { CommonUtilitiesService } from '@vsCommonUtils';
import { Observable } from "rxjs/Observable";
import { DashboardConstants } from "@vsDashboardConstants";
import { findIndex, find, sortBy, each, filter, map, debounce, compact, uniqBy } from 'lodash';
// import { FilterPipe } from "../../../shared/pipes/filter.pipe";
// import { LazyComponentConfiguration } from "../../../../modules-manifest";
// import { DashboardCommService } from "@vsDashboardCommService";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { GlobalFilterService } from "shared/services/global-filter-service/global-filter.service";
import { LoaderService } from "shared/services/loader-service/loader.service";
import { DashboardCommService } from "shared/services/dashboard-comm-service/dashboard-comm.service";
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { FilterPipe } from "shared/pipes/filter.pipe";
import { debug } from "core-js/fn/log";
// import { LoaderService } from "@vsLoaderService";

@Component({
    selector: 'number-filter',
    templateUrl: './number-filter.component.html',
    styleUrls: ['./number-filter.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NumberFilterComponent implements OnInit, AfterViewInit, OnDestroy {

    filterByMeasuresOpts: any;
    filterTabList: any;
    StringFilterObj: any;
    FilterByConfig: any;
    searchFilterConfig: any;
    selectAllConfig: any;
    filterByCdnValueConfig: any;
    filterByCdnValuesConfig: any;
    filterByCdnConfig: any;
    showSelectedMasterList: boolean;
    selectedListCount: number;
    setClearTimeout = null;
    autoCompleteConfig: any;
    measureConditionRangeValue: any;
    cancelButtonConfig = {
        "title": "CANCEL",
        "flat": true
    };
    filterConditionInfoTip = {
        message: ""
    };
    closeTooltipConfig = {
        message: "Close",
        position: "bottom"
    };
    filterByModel = {
        field: {
            title: "",
            value: 1
        }
    };
    filterSeachText: any = {
        value: ""
    };
    stringConditionValue: any = { 'value': '' };
    stringConditionMultipleValue: any = { 'value': '' };

    sliderTooltipConfig: any = {
        delay: 100,
        html: false,
        message: DashboardConstants.UIMessageConstants.STRING_NUMBER_MULTIPLE_VALUES,
        position: DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.RIGHT,
    };

    //ANLT-9214 setting isLazyLoadOnSearchTextClear by default to true to enable service call when search is cleared
    isLazyLoadOnSearchTextClear: boolean = true;
    isLastRecordLoaded: boolean;
    @Input() config;
    constants = DashboardConstants;

    constructor(
        private _renderer: Renderer2,
        private activatedRoute: ActivatedRoute,
        private globalFilterService: GlobalFilterService,
        private _analyticsCommonDataService: AnalyticsCommonDataService,
        private _dashboardCommService: DashboardCommService,
        private _commUtil: CommonUtilitiesService,
        private _loaderService: LoaderService,
        private _filterPipe: FilterPipe,
        private changeDetector: ChangeDetectorRef) {

        //this.ngOnInit();

    }

    ngOnInit() {

        this.StringFilterObj = this.config;
        this.measuresFilterConfig();
        this.StringFilterConfig();
        this.configureFilterByCondition(this.StringFilterObj);
        this.StringFilterObj.SelectAllTxt = "Select All";
        // this.filterByModel.field = Object.assign({}, this.StringFilterObj.FilterBy.field);
        this.filterSeachText.value = this.StringFilterObj.FilterSearchText.value;
        // this.StringFilterObj.FilterBy.field = this.filterByModel.field;
        this.StringFilterObj.filteredList = Object.assign([], this.StringFilterObj.FilterList);
        // if(this.FilterByConfig.api.modelRefrenceChanged)
        // this.FilterByConfig.api.modelRefrenceChanged();
        if (!(this.StringFilterObj.appliedFilter) && !(this.StringFilterObj.filterCdnSet || this.StringFilterObj.filterValueSet || this.StringFilterObj.filterSelSet)) {
            this.StringFilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.GreaterThan;
            this.StringFilterObj.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.GreaterThan];
            this.StringFilterObj.FilterConditionOperator.FilterConditionObjectId = filter(
                this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                    return filterCdn.Condition == DashboardConstants.ReportObjectOperators.GreaterThan
                })[0].FilterConditionObjectId;
            this.StringFilterObj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        }

        let isFilterOpen
        isFilterOpen = this.globalFilterService.fadeOutDashboardGrid();
        isFilterOpen = !isFilterOpen;
        if (isFilterOpen == true) {
            let dashboardWrapper = document.getElementById('dashboard-container-id'),
                mainContainer = document.getElementById('main-container-id');
            if (dashboardWrapper) dashboardWrapper.classList.add("global-filter-fixed");
            mainContainer.classList.add("overflow-hide");
        }
        if (this.StringFilterObj.FilterList.length == 0) {
            this.setFilterListInSelected();
        }
        if (this.StringFilterObj.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.In ||
            this.StringFilterObj.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.NotIn) {
            this.stringConditionMultipleValue.value = this.StringFilterObj.FilterConditionText.value;
        }
        else {
            this.stringConditionValue.value = this.StringFilterObj.FilterConditionValue;
        }
        setTimeout(() => {
            this.addingScrollEndEvent();
        }, 200);

    }

    ngOnDestroy() {
        console.log('Not Implemented the Method')
    }

    ngAfterViewInit() {
        this.addingScrollEndEvent();
    }

    StringFilterConfig() {
        this.FilterByConfig = {
            valueKey: "title",
            fieldKey: "field",
            layout: 'horizontal',
            collection: [
                { "value": "1", "title": "Filter by Selection" },
                { "value": "2", "title": "Filter by Condition" }
            ]
        }

        this.searchFilterConfig = {
            label: '',
            data: 'value',
            fieldKey: 'value',
            attributes: {
                placeholder: 'Search'
            }
        }
        this.selectAllConfig = {
            disable: false,
            isMandatory: false,
            isVisible: false,
            label: 'All',
            validate: true,
            focus: true,
            errorMessage: '',
            data: 'SelectAll'
        };
        this.filterByCdnValueConfig = {
            label: "Value",
            data: 'FilterConditionText',
            fieldKey: 'value',
            attributes: {
                maxLength: 20,
            }
        }
        this.filterByCdnValuesConfig = {
            data: 'FilterConditionText',
            fieldKey: 'value',
            attributes: {
                maxLength: 5000,
                placeholder: 'Value1;Value2;Value3...',
            }
        }
        this.filterByCdnConfig = {
            label: '',
            dataKey: 'op',
            displayKey: 'title',
            fieldKey: 'FilterConditionOperator',
            cssClass: 'line-height-manager',
            options: []
        }
        // if any of the value exists
        this.measureConditionRangeValue = {
            from: this.StringFilterObj.FilterConditionRangeValue.from || "",
            to: this.StringFilterObj.FilterConditionRangeValue.to || ""
        };
        this.autoCompleteConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartAutoCompleteConfig);
        this.filterConditionInfoTip.message = DashboardConstants.UIMessageConstants.STRING_FILTER_BY_CONDITION;
        this.setAutoCompleteChipsValues(this.config);
    }


    // change filter by condition/values

    onChangeFilterBy(FilterObj, field) {
        if (field === DashboardConstants.FilterBy.FilterBySelection) {
            FilterObj.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.In &&
                    filterCdn.FilterTypeObjectId == FilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId;
            FilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.In;
            FilterObj.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.In];
            setTimeout(() => {
                this.addingScrollEndEvent();
            }, 200);
        }
        else if (field === DashboardConstants.FilterBy.FilterByCondition) {
            FilterObj.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.GreaterThan &&
                    filterCdn.FilterTypeObjectId == FilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId;
            FilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.GreaterThan;
            FilterObj.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.GreaterThan];
        }
        // FilterObj.FilterBy.field = Object.assign({}, field);
        this.globalFilterService.getFilterTabInfo(FilterObj);
    }

    onSearchKeypress(event, FilterObj, txt) {
        // console.log(event);
        //let clone = this.cloneEvent(event);

        if (this.StringFilterObj.IsShowSelected === true) {
            this.StringFilterObj.IsShowSelected = false;
        }

        if (!txt)
            this.StringFilterObj.filteredList = Object.assign([], this.StringFilterObj.FilterList);

        // this.ftabs[index].filteredList = Object.assign([], this.ftabs[index].FilterList).filter(
        //     item => item.title.toLowerCase().indexOf(txt.toLowerCase()) > -1
        // )
        if (this.StringFilterObj.IsSelectAll) {
            this.StringFilterObj.filteredList = Object.assign([],
                this._filterPipe.transform(this.StringFilterObj.FilterList,
                    {
                        term: this.StringFilterObj.FilterSearchText.value,
                        key: 'title',
                        isSelectAll: this.StringFilterObj.IsSelectAll
                    }));
        }
        else {
            clearTimeout(this.setClearTimeout);
            //ANLT-9214 added !txt to enable service call in the case of backspace
            if (event.which == 8 &&
                this.StringFilterObj.FilterSearchText.value != undefined &&
                this.StringFilterObj.FilterSearchText.value.length == 0 &&
                this.isLazyLoadOnSearchTextClear || !txt) {
                this.isLazyLoadOnSearchTextClear = false;
                //Loading the default record for the Search Filter if user has enetered backspace and empty text
                this.setClearTimeout = setTimeout((event) => {
                    // $('.filter-search input').blur()
                    ($('.input-field input')[0]).blur();
                    this.LazyLoadingHandler(true);
                }, 1500);
            }
            else {
                this.setClearTimeout = setTimeout((event) => {
                    if (this.StringFilterObj.FilterSearchText.value != undefined &&
                        this.StringFilterObj.FilterSearchText.value.length > 2) {
                        this.StringFilterObj.isSearchOn = true;
                        // $('.filter-search input').blur()
                        ($('.input-field input')[0]).blur();
                        this.LazyLoadingHandler(true);
                        this.isLazyLoadOnSearchTextClear = true;
                    }
                }, 1500);
            }
        }
        this.globalFilterService.onSearchKeypress(FilterObj, txt);
    }

    onChangeFilterList(FilterObj, arg, index, i) {
        this.selectedListCount = 0;
        var filterListlength = this.StringFilterObj.filteredList.length;
        for (let i = 0; i < filterListlength; i++) {
            if (this.StringFilterObj.filteredList[i].IsSelected)
                this.selectedListCount++;
        }
        this.StringFilterObj.PartialSelect = true;
        if (this.selectedListCount === 0) {
            this.StringFilterObj.PartialSelect = false;
            this.StringFilterObj.SelectAll = false;
            this.StringFilterObj.filterSelSet = false;
            this.StringFilterObj.IsShowSelected = false;
            this.showSelectedMasterList = false;
        }
        else if (this.selectedListCount === filterListlength) {
            this.StringFilterObj.PartialSelect = false;
            this.StringFilterObj.SelectAll = true;
            this.StringFilterObj.filterSelSet = true;
        }
        else {
            this.StringFilterObj.filterSelSet = true;
        }
        this.setSelectedFilterList(arg);
        this.globalFilterService.getFilterTabInfo(FilterObj);
    }

    setSelectedFilterList(objCurrentFilter: IFilterList) {
        this.StringFilterObj.FilterList[findIndex(this.StringFilterObj.FilterList, {
            title: objCurrentFilter.title
        })] = objCurrentFilter;

        let _findCurrFilteredItem: IFilterList = find(this.StringFilterObj.selectedFilterList, {
            title: objCurrentFilter.title
        }) as IFilterList;

        if (_findCurrFilteredItem == undefined) {
            this.StringFilterObj.selectedFilterList.push(objCurrentFilter);
        }
        else if (!objCurrentFilter.IsSelected) {
            this.StringFilterObj.selectedFilterList.splice(this.StringFilterObj.selectedFilterList.indexOf(_findCurrFilteredItem), 1);
        }
        else if (_findCurrFilteredItem.IsSelected != objCurrentFilter.IsSelected) {
            //Added the Code If user has making on and off for the same 
            let foundIndex: number = findIndex(this.StringFilterObj.selectedFilterList, {
                title: objCurrentFilter.title
            });
            this.StringFilterObj.selectedFilterList[foundIndex].IsSelected = objCurrentFilter.IsSelected;
        }
        this.StringFilterObj.selectedFilterList = sortBy(this.StringFilterObj.selectedFilterList, ['title']);
        this.StringFilterObj.FilterTabInfo = this.StringFilterObj.selectedFilterList.length > 0 ?
            this.StringFilterObj.selectedFilterList.length + " Selected" : DashboardConstants.OpportunityFinderConstants.STRING_EMPTY;
        // this.chip = JSON.parse(JSON.stringify(this.ftabs));
        //this.getFilterTabInfo();
    }

    onChangeAllFilter(FilterObj, arg, index) {
        // var filterListlength = this.StringFilterObj.filteredList.length,
        //     incre;
        // this.StringFilterObj.PartialSelect = false;
        // for (var i = 0; i < filterListlength; i++) {
        //     this.StringFilterObj.filteredList[i].IsSelected = arg;
        // }
        // if (arg) {
        //     this.selectedListCount = filterListlength;
        //     this.StringFilterObj.filterSelSet = true;
        // }
        // else {
        //     this.selectedListCount = 0;
        //     this.StringFilterObj.filterSelSet = false;
        // }

        this.StringFilterObj.filteredList.map((_value: IFilterList) => {
            _value.IsSelected = arg;
        });

        if (arg) {
            this.StringFilterObj.filteredList.forEach((_filterValue: IFilterList, _filterKey: number) => {
                let _ExistInSelectedFilterList: IFilterList = find(this.StringFilterObj.selectedFilterList, {
                    title: _filterValue.title
                }) as IFilterList;
                if (!_ExistInSelectedFilterList) {
                    this.StringFilterObj.selectedFilterList.push(_filterValue);
                }
            });
        }
        else {
            this.StringFilterObj.selectedFilterList = [];
        }

        this.globalFilterService.getFilterTabInfo(FilterObj);
    }

    onShowSelectedCallback(FilterObj, IsSelected) {
        this.globalFilterService.ShowSelectedCallback(FilterObj, IsSelected)
        if (!IsSelected) this.addingScrollEndEvent();
    }
    clearSearch(FilterObj, value) {
        if (this.StringFilterObj.FilterSearchText.value.length > 0) {
            this.StringFilterObj.filteredList = Object.assign([], this.StringFilterObj.FilterList);
            this.StringFilterObj.FilterSearchText.value = '';
            //if the Search Reporting Object Is Select All is false and Search Text is Empty then only lazy loading 
            if (!this.StringFilterObj.IsSelectAll && this.isLazyLoadOnSearchTextClear) {
                this.isLazyLoadOnSearchTextClear = false;
                this.LazyLoadingHandler(true);
            }
            // else {
            //     this.globalFilterService.syncSearchWithSelections(this.StringFilterObj, value);
            // }
        }
        this.filterSeachText.value = '';
        this.globalFilterService.clearSearch(FilterObj, value);
        this.addingScrollEndEvent();
    }

    onValueKeypress(FilterObj, value) {
        FilterObj.filterValueSet = false;
        if (FilterObj != null &&
            (
                FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between ||
                FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween
            )
        ) {
            if (this._commUtil.isNuneArray([this.measureConditionRangeValue.from, this.measureConditionRangeValue.to])) {
                FilterObj.FilterConditionRangeValue = this.measureConditionRangeValue;
                FilterObj.filterValueSet = true;
            }
        }
        if (this.StringFilterObj.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.In ||
            this.StringFilterObj.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.NotIn) {
            if (this._commUtil.isNune(this.StringFilterObj.FilterConditionText.value)) {
                FilterObj.filterValueSet = true;
            }
        }
        else if (this._commUtil.isNune(this.stringConditionValue.value)) {
            this.StringFilterObj.FilterConditionValue = this.stringConditionValue.value;
            FilterObj.filterValueSet = true;
        }
        this.globalFilterService.onValueKeypress(FilterObj, value);
    }
    onChangeFilterByOp(FilterObj, op) {
        FilterObj.filterValueSet = false;
        // if user change filter type from other type to "in" or "not in"
        if (FilterObj != undefined &&
            (
                FilterObj.FilterConditionOperator.op == 7 ||
                FilterObj.FilterConditionOperator.op == 6
            ) && FilterObj.FilterConditionText.value != '') {
            var tempChipArray = [];

            // 1. Use uniqBy - to get unique value When user change filter type from Is to In 
            // 2. Remove duplicate values form chip array including case sensative values
            // 3. Remove ;;;;; values while copy paste
            uniqBy(FilterObj.FilterConditionText.value.split(';'), (value: string) => value.toLowerCase()).forEach((value) => {
                if (value != '' && tempChipArray.length < 300) {
                    tempChipArray.push(value);
                }
            });
            FilterObj.filterValueSet = true;
            // join string with ; values for unique chip data
            FilterObj.FilterConditionText.value = tempChipArray.join(";");
        }
        else if (FilterObj != null && (
            FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between ||
            FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween)) {
            if (this._commUtil.isNuneArray([this.measureConditionRangeValue.from, this.measureConditionRangeValue.to])) {
                FilterObj.FilterConditionRangeValue = this.measureConditionRangeValue;
                FilterObj.filterValueSet = true;
            }
        }

        this.globalFilterService.onChangeFilterByOp(FilterObj, op);
    }

    private LazyLoadingHandler = debounce((IsSearchKeyPressEvent: boolean) => {
        if (this.StringFilterObj != undefined) {
            let _currentFtabsObject: any = {
                ActiveFtabsObject: [],
                ActiveFtabsObjectIndex: -1
            };
            //Getting the Current Active Flag from the all available ftabs.Should be onle one thats why hard coded 0. 
            // _currentFtabsObject.ActiveFtabsObject = filter(this.ftabs, (_value: any, _key: any) => {
            //     return _value.active;
            // })[0];
            // _currentFtabsObject.ActiveFtabsObjectIndex = this.ftabs.indexOf(_currentFtabsObject.ActiveFtabsObject);

            if (this.StringFilterObj.FilterList.length >= 0 && !this.StringFilterObj.IsSelectAll) {

                let _daxReportFilterObject: IDAXReportFilter = {
                    isSelectAll: this.StringFilterObj.IsSelectAll,
                    dataSourceObjectId: this.StringFilterObj.DataSource_ObjectId,
                    dataSourceType: this.StringFilterObj.DatasourceType ? this.StringFilterObj.DatasourceType : AnalyticsCommonConstants.DataSourceType.Tabular,
                    isOnOrAfterTerm: this.getIsOnOrAfterTermBasedOnDatasourceType(IsSearchKeyPressEvent),
                    searchTerm: this.StringFilterObj.FilterSearchText.value || '',
                    reportObject: {
                        isOnOrAfterTerm: "",
                        isDrill: false,
                        tableName: "",
                        expression: "",
                        derivedRoType: 0,
                        parentReportObjects: [
                        ],
                        createdBy: "",
                        reportObjectId: this.StringFilterObj.ReportObjectId,
                        reportObjectName: this.StringFilterObj.ReportObjectName,
                        reportObjectType: 1
                    }
                };

                this._loaderService.showGlobalLoader();
                this.getFilterData(_daxReportFilterObject)
                    .toPromise()
                    .then((_response: Array<IFilterList>) => {
                        if (this.StringFilterObj.FilterList.length >= 0) {
                            let newDAXFilterResponse: Array<IFilterList> = [], selectedFilterList: Array<IFilterList> = [];
                            //Explicitly making the Filter List Empty becasue when It will come from search should empty and then set the new result based upon FilterSearchText only if IsSearchKeyPressEvent true else should not clear the array
                            if (IsSearchKeyPressEvent) {
                                this.StringFilterObj.FilterList = Object.assign([], []);
                                this.StringFilterObj.filteredList = Object.assign([], []);
                            }
                            newDAXFilterResponse = Object.assign([], this.StringFilterObj.FilterList);
                            selectedFilterList = Object.assign([], this.StringFilterObj.selectedFilterList);

                            each(_response, (_value: IFilterList, _key: number) => {
                                let _resContainsFilterValue: IFilterList = find(selectedFilterList, {
                                    title: _value.title
                                });
                                if (_key != 0) {
                                    newDAXFilterResponse.push({
                                        IsSelected: !_resContainsFilterValue ? _value.IsSelected : _resContainsFilterValue.IsSelected,
                                        title: _value.title
                                    });
                                }
                                else if (IsSearchKeyPressEvent) {
                                    newDAXFilterResponse.push({
                                        IsSelected: !_resContainsFilterValue ? _value.IsSelected : _resContainsFilterValue.IsSelected,
                                        title: _value.title
                                    });
                                    //$('.collection')[0].scrollTop = $('.collection')[0].scrollTop / 2;
                                }
                            });


                            // Making the fresh intialization to refelct child to parent component. 
                            this.StringFilterObj.FilterList = Object.assign([], newDAXFilterResponse);
                            this.StringFilterObj.filteredList = Object.assign([], newDAXFilterResponse);
                            this.globalFilterService.getFilterTabInfo(this.StringFilterObj);
                        }

                        this._loaderService.hideGlobalLoader();
                        this.globalFilterService.setChipData(this.StringFilterObj.ReportObjectId);
                        this.StringFilterObj.isSearchOn = false;
                        setTimeout(() => {
                            this.addingScrollEndEvent();
                        }, 200);
                        // this.syncSearchWithSelections(this.index, this.StringFilterObj.FilterSearchText);
                    });

            }

        }
    }, 500, {
        'leading': false,
        'trailing': true
    }
    )

    getIsOnOrAfterTermBasedOnDatasourceType(IsSearchKeyPressEvent: boolean): string {
        if (IsSearchKeyPressEvent) {
            this.StringFilterObj.pageIndex = 1;
            return this.StringFilterObj.DatasourceType == AnalyticsCommonConstants.DataSourceType.ElasticSearch ? '1' : '';
        }
        return this.StringFilterObj.DatasourceType == AnalyticsCommonConstants.DataSourceType.ElasticSearch ? ++this.StringFilterObj.pageIndex : this.StringFilterObj.FilterList[this.StringFilterObj.FilterList.length - 1].title || '';
    }

    setFilterListInSelected() {
        if (this.StringFilterObj != undefined) {
            let _currentFtabsObject: any = {
                ActiveFtabsObject: [],
                ActiveFtabsObjectIndex: -1
            };
            //Getting the Current Active Flag from the all available ftabs.Should be onle one thats why hard coded 0. 
            // _currentFtabsObject.ActiveFtabsObject = filter(this.ftabs, (_value: any, _key: any) => {
            //     return _value.active;
            // })[0];
            // _currentFtabsObject.ActiveFtabsObjectIndex = this.ftabs.indexOf(_currentFtabsObject.ActiveFtabsObject);

            if (
                (
                    this.StringFilterObj.filteredList.length == 0 && !(
                        this._commUtil.isPeriodFilter(this.StringFilterObj.FilterType)
                    ) || (
                        this.StringFilterObj.FilterType === DashboardConstants.FilterType.Year
                        && this.StringFilterObj.sourceYear.length === 0
                    )
                )
            ) {
                let _daxReportFilterObject: IDAXReportFilter = {
                    isSelectAll: this.StringFilterObj.IsSelectAll,
                    dataSourceObjectId: this.StringFilterObj.DataSource_ObjectId,
                    dataSourceType: this.StringFilterObj.DatasourceType ? this.StringFilterObj.DatasourceType : AnalyticsCommonConstants.DataSourceType.Tabular,
                    isOnOrAfterTerm: this.StringFilterObj.DatasourceType && this.StringFilterObj.DatasourceType == AnalyticsCommonConstants.DataSourceType.ElasticSearch ? "1" : "",
                    searchTerm: '',
                    reportObject: {
                        isOnOrAfterTerm: "",
                        isDrill: false,
                        tableName: "",
                        expression: "",
                        derivedRoType: 0,
                        parentReportObjects: [
                        ],
                        createdBy: "",
                        reportObjectId: this.StringFilterObj.ReportObjectId,
                        reportObjectName: this.StringFilterObj.ReportObjectName,
                        reportObjectType: 1
                    }
                };

                this._loaderService.showGlobalLoader();
                if (this.StringFilterObj.FilterType === DashboardConstants.FilterType.Number) {
                    this.getFilterData(_daxReportFilterObject)
                        .toPromise()
                        .then((_response: Array<IFilterList>) => {
                            if (this.StringFilterObj.FilterList.length == 0) {
                                //Updating the Main Array to display on the filter component
                                this.StringFilterObj.FilterList = Object.assign([], []);
                                this.StringFilterObj.filteredList = Object.assign([], []);

                                //Applying  to chip data becuase to refelcet on dashboard grid component.
                                this.StringFilterObj.FilterList = Object.assign([], []);;
                                this.StringFilterObj.filteredList = Object.assign([], []);;

                                // let newDAXFilterResponse: Array<IFilterList> = [], selectedFilterList: Array<IFilterList> = [];
                                // newDAXFilterResponse = Object.assign([], this.ftabs[_currentFtabsObject.ActiveFtabsObjectIndex].FilterList);
                                let selectedFilterList = Object.assign([], this.StringFilterObj.selectedFilterList);
                                if (selectedFilterList.length && selectedFilterList[0].title === DashboardConstants.DAXQueryManipulate.AllRecords) {
                                    each(_response, (_value: IFilterList, _key: number) => {
                                        _value.IsSelected = true;
                                    })
                                    this.StringFilterObj.selectedFilterList = Object.assign([], _response);
                                }
                                else {
                                    each(_response, (_value: IFilterList, _key: number) => {
                                        let _resContainsFilterValue: IFilterList = find(selectedFilterList, {
                                            title: _value.title
                                        }) as IFilterList;
                                        _response[_key].IsSelected = !_resContainsFilterValue ? _value.IsSelected : _resContainsFilterValue.IsSelected;
                                    });
                                }
                                // Making the fresh intialization to refelct child to parent component. 
                                this.StringFilterObj.FilterList = _response
                                this.StringFilterObj.filteredList = _response
                                this.StringFilterObj.FilterList = _response
                                this.StringFilterObj.filteredList = _response
                            }
                            this._loaderService.hideGlobalLoader();
                            this.globalFilterService.setChipData(this.StringFilterObj.ReportObjectId);
                            setTimeout(() => {
                                this.addingScrollEndEvent();
                            }, 200);
                            this.globalFilterService.getFilterTabInfo(this.StringFilterObj);
                        });
                }

            }
            else {
                this.globalFilterService.getFilterTabInfo(this.StringFilterObj);
            }
        }
    }

    getFilterData(_daxReportFilterObject: IDAXReportFilter) {
        return new Observable((observer) => {
            this._analyticsCommonDataService.
                getFilterData(_daxReportFilterObject)
                .toPromise()
                .then((_response) => {
                    let _filterResultResponse: Array<IFilterList> = [];
                    each(_response, (_value: any, _key: number) => {
                        // if (_value.title != '') {
                        _filterResultResponse.push({
                            IsSelected: _value.isSelected,
                            title: _value.title
                        });
                        // }
                    });
                    this.isLastRecordLoaded = _filterResultResponse.length == 0 || _filterResultResponse.length == 1;
                    observer.next(_filterResultResponse);
                    observer.complete();
                })

        });
    }

    // updateSelectYearLabel(data) {
    //     let copyofFilter = data
    //     if (copyofFilter.length === 0) {
    //         this.showLabel = false;
    //         this.SelectedYear = 'Select Year'
    //     }
    //     else {
    //         this.showLabel = true;
    //         if (copyofFilter.length > 1) {
    //             this.SelectedYear = `${copyofFilter[0].name} + ${((copyofFilter.length) - 1)} more`
    //         }
    //         else {
    //             this.SelectedYear = copyofFilter[0].name
    //         }
    //     }

    //     // Check for applied filter data, and persist the selection on opening filter
    //     if (this.maintainAppliedData != '') {
    //         for (let year of copyofFilter) {
    //             if (!(year in this.maintainAppliedData)) {
    //                 year.IsCheck = false;
    //             }
    //         }
    //     }
    // }

    addingScrollEndEvent() {
        let scrolledEle = document.getElementById('filter-list');
        if (scrolledEle != undefined) {
            if (scrolledEle.scrollTop != 0) { scrolledEle.scrollTop = scrolledEle.scrollTop - 20 };
            this._renderer.listen(scrolledEle, 'scroll', (event) => {
                if (event.target.scrollTop && ((event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight)) {
                    if (this.StringFilterObj != undefined && this.StringFilterObj != null && !this.isLastRecordLoaded) {
                        if (!this.StringFilterObj.IsSelectAll) {
                            this.LazyLoadingHandler(false);
                        }
                    }
                }
            });
        }
    }

    private configureFilterByCondition(_reportObject: any) {
        let lstOfConditions: Array<any>;
        lstOfConditions = filter(this._dashboardCommService.FilterConditionMetadata, (filterObj, index) => {
            return (filterObj.FilterTypeObjectId == _reportObject.FilterTypeObjectId && !filterObj.IsPeriodFilter)
        });
        switch (_reportObject.FilterType) {
            case DashboardConstants.FilterType.Number:
                this.filterByMeasuresOpts.options = map(lstOfConditions, (obj, index) => {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                break;
        }
    }

    public trackByFilteredList(index, item) {
        return index;
    }

    // Remove Filter chips
    public removeFilterChip(FilterObj, index) {
        this.globalFilterService.removeFilterChip(FilterObj, index);
    };

    // On auto complete search type - bind auto complete component
    onSearchAutoCompleteKeypress(event, FilterObj, txt) {
        if (txt != undefined) {
            // ANLT-8801 : Restrict ; as input value in auto complete,because ; is use to seperate chip data
            if (event != undefined && event.keyCode == 186 && event.target.value != undefined && event.target.value.indexOf(';') > -1) {
                event.target.value = event.target.value.split(";").join("");
                return;
            }

            // ANLT-8801 : when user copy paste value with ;,add validation that only one ; is persent between each values
            if (event != undefined && event.ctrlKey && event.keyCode == 86 && event.target.value != undefined && event.target.value.indexOf(';') > -1) {
                event.target.value = compact(event.target.value.split(";").map(x => { if (x != '') return x; })).join(";");
                return;
            }

            // ANLT-8802 : auto complete values will display in auto complete list when text contain more than 2 charactres
            if (txt.length > 2) {
                this.autoCompleteConfig.attributes.options = Object.assign([],
                    this._filterPipe.transform(this.StringFilterObj.FilterList,
                        {
                            term: txt,
                            key: 'title',
                            isSelectAll: true
                        }));
            }
            else {
                this.autoCompleteConfig.attributes.options = [];
            }

            // As per ANLT-8802 - User can create single character chip also.
            if (event.keyCode != undefined && event.keyCode == 13) {
                this.globalFilterService.onChangeAutoCompleteFilter(event.target.value, FilterObj);
                // Resolved- ANLT-8803 
                event.target.value = "";
                this.autoCompleteConfig.attributes.options = [];
            }
        }
    }

    // Convert filter condition text into array for save filter details when filer popup open from 
    // dash board
    private setAutoCompleteChipsValues(config) {
        if (config != undefined && (config.FilterConditionOperator.op == 7 || config.FilterConditionOperator.op == 6) && config.FilterConditionText != '')
            config.autoCompleteFilterList = config.FilterConditionText.value.split(';').filter(s => s != '');
    }

    private measuresFilterConfig() {
        this.filterByMeasuresOpts = {
            label: "",
            dataKey: 'op',
            displayKey: 'title',
            fieldKey: 'FilterConditionOperator',
            options: []
        };
    }

    // private validateInputForNumber(event) {
    //     // const value = this.stringCdnMultipleValue.value[this.stringCdnMultipleValue.value.length - 1];
    //     // if (isNaN(value) && value != ';') {
    //     //     this.stringCdnMultipleValue.value = this.stringCdnMultipleValue.value.slice(0, this.stringCdnMultipleValue.value.length - 1);
    //     //     this.stringConditionMultipleValue = { ...this.stringCdnMultipleValue };
    //     // }
    //     if ((isNaN(event.key) && event.key != ';')) {
    //         if (event.target.value.length === 0) {
    //             event.target.value = '';
    //         }
    //         else {
    //             event.target.value = event.target.value.slice(0, event.target.value.length - 1)
    //         }
    //     }
    //     this.stringConditionMultipleValue.value = event.target.value;
    // }

    // private callMe(event) {
    //     debugger;
    //     console.log(event)
    // }

    private validateInputForNumber(event) {

        if (this._commUtil.isNune(event.key.match('[^\-0-9.,\;]'))) {
            if ([8, 37, 39].indexOf(event.keyCode) === -1) { //Allowing the right arrow, left arrow and backspace keypress.
                return false;
            }
        }
    }

}
