import { Injectable, OnInit } from "@angular/core";
import { DashboardCommService } from "@vsDashboardCommService";
import { BehaviorSubject } from 'rxjs';
import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { each, filter, uniqBy, mapValues, compact, findIndex } from 'lodash';
import { IBeginningOfTheYear, IRollingYearsModel, INextYearsModel, IYearDropdown, IFromyearDropdown, IFilterList, IRollingQuarterYearsModel, INextQuarterYearsModel, IPreviousQuarterYearsModel, IDateModel, IRollingDateModel, INextDateModel } from "@vsCommonInterface";
import { IFilterValueList } from "@vsDashboardInterface";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { TabDetail } from "@vsDashletModels/tab-detail-model";
@Injectable()
export class GlobalFilterService implements OnInit {
    public reinitializedFilterConfig = new BehaviorSubject<any>({})
    public reportingObjects: any;
    public showSelectedMasterList: boolean;
    public appliedFilterData: any = []
    public chip: any;
    public filterOpen;
    public activeFilter;
    public lstOfFilterRoInTab: Array<any>;
    currentView: any;

    constructor(
        private _dashboardCommService: DashboardCommService,
        private _commUtils: CommonUtilitiesService) {
    }

    // openGlobalFilter(isFilterOpen) {
    //     this.filterOpen = isFilterOpen
    // }

    ngOnInit() {
        this.reinitializedFilterConfig.complete();
    }

    // fade out dashboard when filter is open
    fadeOutDashboardGrid() {
        return this._dashboardCommService.fadeOutDashboardGrid()
    }

    setFilterReportingObjects(filterTabList) {
        this.reportingObjects = filterTabList;
    }

    // fixGloabalFilter() {
    //     this.dashboardService.getGlobalFilterFlag().subscribe((filterFlag) => {
    //         let dashboardWrapper = document.getElementById('dashboard-container-id'),
    //             mainContainer = document.getElementById('main-container-id');
    //         if (filterFlag) {
    //             dashboardWrapper.classList.add("global-filter-fixed");
    //             mainContainer.classList.add("overflow-hide");
    //         }
    //         else {
    //             dashboardWrapper.classList.remove("global-filter-fixed");
    //             mainContainer.classList.remove("overflow-hide");
    //         }
    //         this.dashboardService.setGlobalFilterFlag(filterFlag);
    //     })

    // }

    setActiveFilter(filter) {
        this.activeFilter = filter;
    }

    getActiveFilter() {
        return this.activeFilter;
    }

    getFilterTabInfo(selectedfilterObj) {
        var obj = selectedfilterObj,
            count = selectedfilterObj.selectedFilterList.length,
            op,
            filterListlength = obj.FilterList && obj.FilterList.length;
        if ((obj.FilterType === DashboardConstants.FilterType.MultiSelect ||
            obj.FilterType === DashboardConstants.FilterType.Number) && obj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            if (count) {
                obj.FilterTabInfo = count + ' Selected';
                obj.filterSelSet = true;
                if (count == filterListlength || obj.selectedFilterList[0].title === DashboardConstants.DAXQueryManipulate.AllRecords) {
                    obj.FilterTabInfo = 'All Selected';
                    obj.PartialSelect = false;
                    obj.SelectAll = true;
                }
                else {
                    obj.PartialSelect = true;
                    obj.SelectAll = false;
                }
            }
            else {
                obj.IsShowSelected = false;
                obj.filterSelSet = false;
                obj.PartialSelect = false;
                obj.SelectAll = false;
                obj.FilterTabInfo = '';
            }
            //To bew applied with the below else if Condition   && (obj.filterValueSet || obj.filterCdnSet)
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Number && obj.filterValueSet) {
            this.getTabInfoForMeasureFilter(obj);
            return;
        }
        else if (obj.FilterType >= 3) {
            this.getTabInfoForPeriod(obj);
            return;
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Measure && obj.filterValueSet) { // Measure Filter Implementation
            this.getTabInfoForMeasureFilter(obj);
            return;
        }
        else if (obj.ReportObjectType == 0 && obj.filterValueSet) {
            // This for Measure
            op = obj.FilterConditionOperator.op;
            if (op <= 13 && op >= 10) {
                obj.FilterTabInfo = obj.FilterConditionOperator.title;
            } else if (op == 3 || op == 4) {
                obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionRangeValue.from + " To " + obj.FilterConditionRangeValue.to;
            } else {
                obj.FilterTabInfo = obj.FilterConditionOperator.title + ' "' + obj.FilterConditionValue + '"';
            }
        }
        else
            obj.FilterTabInfo = '';

    }

    getTabInfoForPeriod(obj) {
        if (obj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            this.getTabInfoForFilterByPeriod(obj);
            return;
        }
        if (!obj.filterValueSet) {
            obj.FilterTabInfo = "";
            return;
        }

        let op = obj.FilterConditionOperator.op;

        if (op == 9 || op == 10) {
            obj.FilterTabInfo = obj.FilterConditionOperator.title;
            return;
        }


        switch (obj.FilterType) {
            case DashboardConstants.FilterType.Date: {
                if (op == DashboardConstants.ReportObjectOperators.Between) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + (obj.FilterConditionRangeValue.from) + " To " + (obj.FilterConditionRangeValue.to);
                } else {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + (obj.FilterConditionValue);
                }
                break;
            }
            case DashboardConstants.FilterType.Month: {
                if (op == 11) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionRangeValue.quarter.from.title + " " +
                        obj.FilterConditionRangeValue.year.from.title
                        + ' To ' + obj.FilterConditionRangeValue.quarter.to.title + " " + obj.FilterConditionRangeValue.year.to.title;
                }
                else if (op === DashboardConstants.ReportObjectOperators.Is ||
                    op === DashboardConstants.ReportObjectOperators.IsNot) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title;
                    if (this._commUtils.isNune(obj.appliedYearFilter)) {
                        for (var i = 0; i < obj.appliedYearFilter.length; i++) {
                            obj.FilterTabInfo += " " + obj.appliedYearFilter[i].name + ";";
                        }
                    }
                    else if (this._commUtils.isNune(obj.FilterConditionText.value)) {
                        obj.FilterTabInfo = obj.FilterConditionText.value;
                    }
                }
                else {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionValue.quarter.title + " and " + obj.FilterConditionValue.year.title;
                }
                break;
            }
            case DashboardConstants.FilterType.Year: {
                // case 6 year filter 

                if (op == DashboardConstants.ReportObjectOperators.Between) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionRangeValue.from + " To " + obj.FilterConditionRangeValue.to;
                }
                // op = 3 and op = 4 checks only for 'IS' and 'IS NOT',in which multiple years are selected from popup, hence for loop is applied
                else if (op == 2 || op == 3) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title;
                    for (var i = 0; i < obj.FilterConditionValue.length; i++) {
                        obj.FilterTabInfo += " " + obj.FilterConditionValue[i].name + ";";
                    }
                } else {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionValue;
                }
                break;

            }
            case DashboardConstants.FilterType.Quarter: {
                if (op == 11) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionRangeValue.quarter.from.title + " " +
                        obj.FilterConditionRangeValue.year.from.title
                        + ' To ' + obj.FilterConditionRangeValue.quarter.to.title + " " + obj.FilterConditionRangeValue.year.to.title;
                }
                else if (op === DashboardConstants.ReportObjectOperators.Is ||
                    op === DashboardConstants.ReportObjectOperators.IsNot) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title;
                    if (this._commUtils.isNune(obj.appliedYearFilter)) {
                        for (var i = 0; i < obj.appliedYearFilter.length; i++) {
                            obj.FilterTabInfo += " " + obj.appliedYearFilter[i].name + ";";
                        }
                    }
                    else if (this._commUtils.isNune(obj.FilterConditionText.value)) {
                        obj.FilterTabInfo = obj.FilterConditionText.value;
                    }
                }
                else {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionValue.quarter.title + " and " + obj.FilterConditionValue.year.title;
                }
                break;
            }
            case DashboardConstants.FilterType.QuarterYear: {
                // case 6 year filter 

                if (op == DashboardConstants.ReportObjectOperators.Between) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " +
                        obj.FromQuarterDropdown.selectedRangeOptions.from.title + " " +
                        obj.FromQuarteryearDropdown.selectedRangeOptions.from.title + " " +
                        " To " +
                        obj.ToQuarterDropdown.selectedRangeOptions.to.title + " " +
                        obj.ToQuarteryearDropdown.selectedRangeOptions.to.title;
                }
                // op = 3 and op = 4 checks only for 'IS' and 'IS NOT',in which multiple years are selected from popup, hence for loop is applied
                else {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title;
                    obj.FilterTabInfo += " " + obj.sourceQuarterDropDown.selectedOption.title;
                    obj.FilterTabInfo += " " + obj.QuarteryearDropdown.selectedOption.title;
                }
                // if (op == DashboardConstants.ReportObjectOperators.Is ||
                //     op == DashboardConstants.ReportObjectOperators.IsNot) {
                //     obj.FilterTabInfo = obj.FilterConditionOperator.title;
                //     for (var i = 0; i < obj.FilterConditionValue.length; i++) {
                //         obj.FilterTabInfo += " " + obj.FilterConditionValue[i].name + ";";
                //     }
                // } else {
                //     obj.FilterTabInfo = obj.FilterConditionOperator.title + " " + obj.FilterConditionValue;
                // }
                break;

            }
            case DashboardConstants.FilterType.MonthYear: {
                // case 6 year filter 

                if (op == DashboardConstants.ReportObjectOperators.Between) {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title + " " +
                        obj.FromQuarterDropdown.selectedRangeOptions.from.title + " " +
                        obj.FromQuarteryearDropdown.selectedRangeOptions.from.title + " " +
                        " To " +
                        obj.ToQuarterDropdown.selectedRangeOptions.to.title + " " +
                        obj.ToQuarteryearDropdown.selectedRangeOptions.to.title;
                }
                // op = 3 and op = 4 checks only for 'IS' and 'IS NOT',in which multiple years are selected from popup, hence for loop is applied
                else {
                    obj.FilterTabInfo = obj.FilterConditionOperator.title;
                    obj.FilterTabInfo += " " + obj.sourceQuarterDropDown.selectedOption.title;
                    obj.FilterTabInfo += " " + obj.QuarteryearDropdown.selectedOption.title;
                }
                break;

            }
        }
        //this.ftabs[this.index].FilterTabInfo = obj.FilterTabInfo;
    }

    getTabInfoForFilterByPeriod(obj) {
        if (!obj.filterCdnSet) {
            //this.ftabs[this.index].FilterTabInfo = "";
            obj.FilterTabInfo = "";
            return;
        }
        if (obj.FilterType === DashboardConstants.FilterType.Date) {
            let op = obj.FilterRadioOperator.field.op;

            if ((DashboardConstants.ReportObjectOperators.From_QuarterTillToday < op) && (op < DashboardConstants.ReportObjectOperators.Rolling_Days)) {
                obj.FilterTabInfo = obj.FilterRadioOperator.field.title;
                //this.ftabs[this.index].FilterTabInfo = obj.FilterTabInfo;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.Rolling_Days || op == DashboardConstants.ReportObjectOperators.Next_Days) {
                obj.FilterTabInfo = obj.FilterRadioOperator.field.title + ' ' + obj.FilterConditionValue;
                //this.ftabs[this.index].FilterTabInfo = obj.FilterTabInfo
                return;
            }
            else {
                if (obj.FilterType == DashboardConstants.FilterType.Date && op == DashboardConstants.ReportObjectOperators.From_DateTillToday) {
                    obj.FilterTabInfo = obj.FilterRadioOperator.field.title + " " + (obj.FilterConditionValue);
                    //this.ftabs[this.index].FilterTabInfo = obj.FilterTabInfo;
                    return;
                }
                else {
                    obj.FilterTabInfo = obj.FilterRadioOperator.field.title + ' ' + (obj.FilterConditionValue);
                    //this.ftabs[this.index].FilterTabInfo = obj.FilterTabInfo;
                }
            }
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Year) {
            let op = obj.YearModel.field.op;
            if ((DashboardConstants.ReportObjectOperators.ThisYear === op || DashboardConstants.ReportObjectOperators.NextYear === op || DashboardConstants.ReportObjectOperators.PreviousYear === op)) {
                obj.FilterTabInfo = obj.YearModel.field.title;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.Rolling_Years || op == DashboardConstants.ReportObjectOperators.Next_Years) {
                obj.FilterTabInfo = obj.YearModel.field.title + ' ' + obj.FilterConditionValue;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.From_YearTillToday) {
                obj.FilterTabInfo = obj.YearModel.field.title + " " + obj.FilterConditionValue;
                return;
            }
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Quarter) {
            let op = obj.QuarterYearModel.field.op;
            if ((DashboardConstants.ReportObjectOperators.ThisQuarter === op ||
                DashboardConstants.ReportObjectOperators.NextQuarter === op ||
                DashboardConstants.ReportObjectOperators.PreviousQuarter === op)) {
                obj.FilterTabInfo = obj.QuarterYearModel.field.title;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.Next_Quarters) {
                obj.FilterTabInfo = obj.QuarterYearModel.field.title + ' ' + obj.FilterConditionValue;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.From_YearTillToday) {
                obj.FilterTabInfo = obj.QuarterYearModel.field.title + " " + obj.FilterConditionValue;
                return;
            }
        }
        else if (obj.FilterType === DashboardConstants.FilterType.QuarterYear) {
            let op = obj.QuarterYearModel.field.op;
            switch (op) {
                case DashboardConstants.ReportObjectOperators.ThisQuarter:
                case DashboardConstants.ReportObjectOperators.NextQuarter:
                case DashboardConstants.ReportObjectOperators.PreviousQuarter:
                    obj.FilterTabInfo = obj.QuarterYearModel.field.title;
                    break;
                case DashboardConstants.ReportObjectOperators.Rolling_Quarters:
                case DashboardConstants.ReportObjectOperators.Next_Quarters:
                case DashboardConstants.ReportObjectOperators.Previous_Quarter:
                    obj.FilterTabInfo = obj.QuarterYearModel.field.title + " " + obj.FilterConditionValue;
                    break;
                case DashboardConstants.ReportObjectOperators.From_QuarterTillToday:
                    obj.FilterTabInfo = obj.QuarterYearModel.field.title + " " + obj.BeginningOfTheQuarter.selectedOption.title + " " +
                        obj.BeginningOfTheQuarterYear.selectedOption.title;
                    break;
                default:
                    obj.FilterTabInfo = '';
            }
        }
        else if (obj.FilterType === DashboardConstants.FilterType.MonthYear) {
            let op = obj.QuarterYearModel.field.op;
            switch (op) {
                case DashboardConstants.ReportObjectOperators.ThisMonth:
                case DashboardConstants.ReportObjectOperators.NextMonth:
                case DashboardConstants.ReportObjectOperators.PreviousMonth:
                    obj.FilterTabInfo = obj.QuarterYearModel.field.title;
                    break;
                case DashboardConstants.ReportObjectOperators.Rolling_Months:
                case DashboardConstants.ReportObjectOperators.Next_Months:
                case DashboardConstants.ReportObjectOperators.Previous_Month:
                    obj.FilterTabInfo = obj.QuarterYearModel.field.title + " " + obj.FilterConditionValue;
                    break;
                case DashboardConstants.ReportObjectOperators.From_MonthTillToday:
                    obj.FilterTabInfo = obj.QuarterYearModel.field.title + " " + obj.BeginningOfTheQuarter.selectedOption.title + " " +
                        obj.BeginningOfTheQuarterYear.selectedOption.title;
                    break;
                default:
                    obj.FilterTabInfo = '';
            }
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Month) {
            let op = obj.QuarterYearModel.field.op;
            if ((DashboardConstants.ReportObjectOperators.ThisMonth === op ||
                DashboardConstants.ReportObjectOperators.NextMonth === op ||
                DashboardConstants.ReportObjectOperators.PreviousMonth === op)) {
                obj.FilterTabInfo = obj.QuarterYearModel.field.title;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.Next_Months) {
                obj.FilterTabInfo = obj.QuarterYearModel.field.title + ' ' + obj.FilterConditionValue;
                return;
            }
            else if (op == DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
                obj.FilterTabInfo = obj.QuarterYearModel.field.title + " " + obj.FilterConditionValue;
                return;
            }
        }

        // if (obj.FilterRadioOperator.inputOptions.length == 2) {
        //     obj.FilterTabInfo = obj.FilterRadioOperator.title + " " +
        //         obj.FilterRadioOperator.inputOptions[0].model + " " + obj.FilterRadioOperator.inputOptions[1].model + " " +
        //         (obj.FilterRadioOperator.postfix ? obj.FilterRadioOperator.postfix : "");
        //     return;
        // }
        // obj.FilterTabInfo = obj.FilterRadioOperator.title + " " + (obj.FilterRadioOperator.inputType == "date" ? new Date(obj.FilterRadioOperator.inputOptions.model).toLocaleDateString('en-GB') : obj.FilterRadioOperator.inputOptions.model) + " " +
        //     (obj.FilterRadioOperator.postfix ? obj.FilterRadioOperator.postfix : "");

    }

    // number and string search
    onSearchKeypress(selectedfilterObj, value) {

        if (selectedfilterObj.IsShowSelected === true) {
            selectedfilterObj.IsShowSelected = false;
        }
        if (typeof value == 'string') {
            selectedfilterObj.FilterSearchText.value = value;
            selectedfilterObj.filteredList = Object.assign([], selectedfilterObj.FilterList);
            if (selectedfilterObj.IsSelectAll) {
                selectedfilterObj.filteredList = Object.assign([], selectedfilterObj.FilterList).filter(
                    item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1
                );
            }
            this.syncSearchWithSelections(selectedfilterObj, value);
        }
    }

    syncSearchWithSelections(selectedfilterObj, value) {

        if (!selectedfilterObj.IsSelectAll && value != '')
            selectedfilterObj.SelectAllTxt = 'Select all search results';
        else
            selectedfilterObj.SelectAllTxt = 'Select All';
        var filterListlength = selectedfilterObj.filteredList.length,
            incre,
            counter = 0;
        for (var i = 0; i < filterListlength; i++) {
            if (selectedfilterObj.filteredList[i].IsSelected)
                counter++;
        }
        selectedfilterObj.PartialSelect = true;
        if (counter === 0) {
            selectedfilterObj.PartialSelect = false;
            selectedfilterObj.SelectAll = false;
        }
        else if (counter === filterListlength) {
            selectedfilterObj.PartialSelect = false;
            selectedfilterObj.SelectAll = true;
        }
        else {
            selectedfilterObj.PartialSelect = false;
            selectedfilterObj.SelectAll = false;
        }
    }

    // number and string show selected callback
    ShowSelectedCallback(selectedfilterObj, IsSelected) {
        // this.clearSearch(0, '');
        selectedfilterObj.filteredList = selectedfilterObj.FilterList;
        // selectedfilterObj.selectedFilterList = Object.assign([], selectedfilterObj.FilterList).filter(
        //     item => { return item.IsSelected; }
        // )

        if (IsSelected) {
            this.showSelectedMasterList = true;
        } else {
            this.showSelectedMasterList = false;
        }
    }

    clearSearch(selectedfilterObj, txt) {
        selectedfilterObj.FilterSearchText.value = '';
        selectedfilterObj.filteredList = Object.assign([], selectedfilterObj.FilterList);

        if (selectedfilterObj.FilterSearchText.value) {
            this.syncSearchWithSelections(selectedfilterObj, selectedfilterObj.FilterSearchText.value);

        }
        // else if (selectedfilterObj.FilterSearchValue.value) {
        //     this.syncSearchWithSelections(selectedfilterObj, selectedfilterObj.FilterSearchValue.value);
        // }
    }
    onChangeFilterByOp(selectedfilterObj, op) {

        //set this true when user changes any value;

        if (selectedfilterObj.FilterType === DashboardConstants.FilterType.MultiSelect) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.IsNull:
                case DashboardConstants.ReportObjectOperators.IsNotNull:
                case DashboardConstants.ReportObjectOperators.IsEmpty:
                case DashboardConstants.ReportObjectOperators.IsNotEmpty:
                case DashboardConstants.ReportObjectOperators.In:
                case DashboardConstants.ReportObjectOperators.NotIn:
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    selectedfilterObj.filterValueSet = true;
                    break;
                default:
                    if (!this._commUtils.isNune(selectedfilterObj.FilterConditionText.value)) {
                        selectedfilterObj.filterValueSet = false;
                    }
                    break;
            }
        }
        // selectedfilterObj.FilterConditionRangeValue.from = '';
        // selectedfilterObj.FilterConditionRangeValue.to = ''
        if ([DashboardConstants.FilterType.Year,
        DashboardConstants.FilterType.Month,
        DashboardConstants.FilterType.Measure,
        DashboardConstants.FilterType.Number].indexOf(selectedfilterObj.FilterType) === -1) {
            selectedfilterObj.FilterConditionValue = '';
            selectedfilterObj.FilterConditionRangeValue = { "from": '', "to": '' };
        }
        if (selectedfilterObj.ReportObjectType == 0) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.GreaterThan:
                case DashboardConstants.ReportObjectOperators.LessThan:
                case DashboardConstants.ReportObjectOperators.TopNRecords:
                case DashboardConstants.ReportObjectOperators.LowestNRecords:
                case DashboardConstants.ReportObjectOperators.LowestNRecords:
                case DashboardConstants.ReportObjectOperators.TopNPercentage:
                case DashboardConstants.ReportObjectOperators.LowestNPercentage:
                case DashboardConstants.ReportObjectOperators.GreaterThanOrEqualTo:
                case DashboardConstants.ReportObjectOperators.LessThanOrEqualTo:
                    if (this._commUtils.isNune(selectedfilterObj.FilterConditionValue)) {
                        selectedfilterObj.filterValueSet = true;
                    }
                    else {
                        selectedfilterObj.filterValueSet = false;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    if (this._commUtils.isNuneArray([
                        selectedfilterObj.FilterConditionRangeValue.from,
                        selectedfilterObj.FilterConditionRangeValue.to
                    ])) {
                        selectedfilterObj.filterValueSet = true;
                    }
                    else {
                        selectedfilterObj.filterValueSet = false;
                    }
                    break;

            }
            // if (op <= 13 && op >= 10)
            //     selectedfilterObj.filterValueSet = true;

            // else if (selectedfilterObj.FilterConditionValue == '' || selectedfilterObj.FilterConditionValue == '-')
            //     selectedfilterObj.filterValueSet = false;

            // else if (op == 3 || op == 4) {
            //     selectedfilterObj.filterValueSet = !(selectedfilterObj.FilterConditionRangeValue.from == '' || selectedfilterObj.FilterConditionRangeValue.from == '-' || selectedfilterObj.FilterConditionRangeValue.to == '' || selectedfilterObj.FilterConditionRangeValue.to == '-');
            // }
            // else
            //     selectedfilterObj.filterValueSet = true;
            this.getFilterTabInfo(selectedfilterObj);
            return;
        }
        if (selectedfilterObj.FilterType === DashboardConstants.FilterType.Number) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.In:
                case DashboardConstants.ReportObjectOperators.NotIn:
                    if (this._commUtils.isNune(selectedfilterObj.FilterConditionText.value)) {
                        selectedfilterObj.filterValueSet = true;
                    }
                    else {
                        selectedfilterObj.filterValueSet = false;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.GreaterThan:
                case DashboardConstants.ReportObjectOperators.LessThan:
                case DashboardConstants.ReportObjectOperators.TopNRecords:
                case DashboardConstants.ReportObjectOperators.GreaterThanOrEqualTo:
                case DashboardConstants.ReportObjectOperators.LessThanOrEqualTo:
                    if (this._commUtils.isNune(selectedfilterObj.FilterConditionValue)) {
                        selectedfilterObj.filterValueSet = true;
                    }
                    else {
                        selectedfilterObj.filterValueSet = false;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    if (this._commUtils.isNuneArray([
                        selectedfilterObj.FilterConditionRangeValue.from,
                        selectedfilterObj.FilterConditionRangeValue.to
                    ])) {
                        selectedfilterObj.filterValueSet = true;
                    }
                    else {
                        selectedfilterObj.filterValueSet = false;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.IsNull:
                case DashboardConstants.ReportObjectOperators.IsNotNull:
                    selectedfilterObj.filterValueSet = true;
                    break
                default:
                    break;
            }
            // if (op <= 13 && op >= 10)
            //     selectedfilterObj.filterValueSet = true;

            // else if (selectedfilterObj.FilterConditionValue == '' || selectedfilterObj.FilterConditionValue == '-')
            //     selectedfilterObj.filterValueSet = false;

            // else if (op == 3 || op == 4) {
            //     selectedfilterObj.filterValueSet = !(selectedfilterObj.FilterConditionRangeValue.from == '' || selectedfilterObj.FilterConditionRangeValue.from == '-' || selectedfilterObj.FilterConditionRangeValue.to == '' || selectedfilterObj.FilterConditionRangeValue.to == '-');
            // }
            // else
            //     selectedfilterObj.filterValueSet = true;
            this.getFilterTabInfo(selectedfilterObj);
            return;
        }
        if (!(this._commUtils.isPeriodFilter(selectedfilterObj.FilterType)) &&
            selectedfilterObj.filterBy === DashboardConstants.FilterBy.FilterBySelection) {
            if (op <= 12 && op >= 9)
                selectedfilterObj.filterCdnSet = true;
            else if (selectedfilterObj.FilterConditionText.value == '')
                selectedfilterObj.filterCdnSet = false;
            else
                selectedfilterObj.filterCdnSet = true;
        }
        if (selectedfilterObj.FilterType == DashboardConstants.FilterType.Date) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                case DashboardConstants.ReportObjectOperators.Before:
                case DashboardConstants.ReportObjectOperators.After:
                    if (this._commUtils.isNune(selectedfilterObj.DateModel)) {
                        selectedfilterObj.DateModel.DateValue = new Date();
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    if (this._commUtils.isNune(selectedfilterObj.FromDateModel)) {
                        selectedfilterObj.FromDateModel.FromDateValue = new Date();
                    }
                    if (this._commUtils.isNune(selectedfilterObj.ToDateModel)) {
                        selectedfilterObj.ToDateModel.ToDateValue = new Date();
                    }
                    break;
                default: {
                    selectedfilterObj.DateModel.DateValue = "";
                    selectedfilterObj.FromDateModel.FromDateValue = "";
                    selectedfilterObj.ToDateModel.ToDateValue = "";
                    selectedfilterObj.filterValueSet = false;
                }
                    break;
            }
        }
        else if (selectedfilterObj.FilterType == DashboardConstants.FilterType.Year) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.Before:
                case DashboardConstants.ReportObjectOperators.After:
                    if (selectedfilterObj.yearDropdown.selectedOption.title === "") {
                        selectedfilterObj.yearDropdown.selectedOption.title = selectedfilterObj.yearDropdown.options[selectedfilterObj.yearDropdown.options.length - 1].title;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    if (selectedfilterObj.FromyearDropdown.selectedRangeOptions.from.title == "") {
                        selectedfilterObj.FromyearDropdown.selectedRangeOptions.from.title = selectedfilterObj.FromyearDropdown.options[selectedfilterObj.FromyearDropdown.options.length - 1].title;
                    }
                    if (selectedfilterObj.ToyearDropdown.selectedRangeOptions.to.title == "") {
                        selectedfilterObj.ToyearDropdown.selectedRangeOptions.to.title = selectedfilterObj.ToyearDropdown.options[selectedfilterObj.ToyearDropdown.options.length - 1].title;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                    break;
                default: {
                    selectedfilterObj.DateModel.DateValue = "";
                    selectedfilterObj.FromDateModel.FromDateValue = "";
                    selectedfilterObj.ToDateModel.ToDateValue = "";
                    selectedfilterObj.filterValueSet = false;
                }
                    break;
            }
        }

        else if (selectedfilterObj.FilterType == DashboardConstants.FilterType.Quarter) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                    break;
                default: {
                    selectedfilterObj.DateModel.DateValue = "";
                    selectedfilterObj.FromDateModel.FromDateValue = "";
                    selectedfilterObj.ToDateModel.ToDateValue = "";
                    selectedfilterObj.filterValueSet = false;
                }
                    break;
            }
        }

        else if (selectedfilterObj.FilterType == DashboardConstants.FilterType.QuarterYear) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                case DashboardConstants.ReportObjectOperators.Before:
                case DashboardConstants.ReportObjectOperators.After:
                    if (!this._commUtils.isNune(selectedfilterObj.QuarteryearDropdown.selectedOption.title)) {
                        selectedfilterObj.QuarteryearDropdown.selectedOption.title = selectedfilterObj.QuarteryearDropdown.options[selectedfilterObj.QuarteryearDropdown.options.length - 1].title;
                    }
                    if (!this._commUtils.isNune(selectedfilterObj.sourceQuarterDropDown.selectedOption.title)) {
                        selectedfilterObj.sourceQuarterDropDown.selectedOption.title = selectedfilterObj.sourceQuarterDropDown.options[selectedfilterObj.sourceQuarterDropDown.options.length - 1].title;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title = !this._commUtils.isNune(selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title) ?
                        selectedfilterObj.FromQuarteryearDropdown.options[selectedfilterObj.FromQuarteryearDropdown.options.length - 1].title :
                        selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title;

                    selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title = !this._commUtils.isNune(selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title) ?
                        selectedfilterObj.FromQuarterDropdown.options[selectedfilterObj.FromQuarterDropdown.options.length - 1].title :
                        selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title;

                    selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title = !this._commUtils.isNune(selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title) ?
                        selectedfilterObj.ToQuarteryearDropdown.options[selectedfilterObj.ToQuarteryearDropdown.options.length - 1].title :
                        selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title;

                    selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title = !this._commUtils.isNune(selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title) ?
                        selectedfilterObj.ToQuarterDropdown.options[selectedfilterObj.ToQuarterDropdown.options.length - 1].title :
                        selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title;

                    break;
                default: {
                    selectedfilterObj.filterValueSet = false;
                }
                    break;
            }
        }

        else if (selectedfilterObj.FilterType == DashboardConstants.FilterType.Month) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                    break;
                default: {
                    selectedfilterObj.DateModel.DateValue = "";
                    selectedfilterObj.FromDateModel.FromDateValue = "";
                    selectedfilterObj.ToDateModel.ToDateValue = "";
                    selectedfilterObj.filterValueSet = false;
                }
                    break;
            }
        }

        else if (selectedfilterObj.FilterType == DashboardConstants.FilterType.MonthYear) {
            switch (op) {
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                case DashboardConstants.ReportObjectOperators.Before:
                case DashboardConstants.ReportObjectOperators.After:
                    if (!this._commUtils.isNune(selectedfilterObj.QuarteryearDropdown.selectedOption.title)) {
                        selectedfilterObj.QuarteryearDropdown.selectedOption.title = selectedfilterObj.QuarteryearDropdown.options[selectedfilterObj.QuarteryearDropdown.options.length - 1].title;
                    }
                    if (!this._commUtils.isNune(selectedfilterObj.sourceQuarterDropDown.selectedOption.title)) {
                        selectedfilterObj.sourceQuarterDropDown.selectedOption.title = selectedfilterObj.sourceQuarterDropDown.options[selectedfilterObj.sourceQuarterDropDown.options.length - 1].title;
                    }
                    break;
                case DashboardConstants.ReportObjectOperators.Between:
                case DashboardConstants.ReportObjectOperators.NotBetween:
                    selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title = !this._commUtils.isNune(selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title) ?
                        selectedfilterObj.FromQuarteryearDropdown.options[selectedfilterObj.FromQuarteryearDropdown.options.length - 1].title :
                        selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title;

                    selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title = !this._commUtils.isNune(selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title) ?
                        selectedfilterObj.FromQuarterDropdown.options[selectedfilterObj.FromQuarterDropdown.options.length - 1].title :
                        selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title;

                    selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title = !this._commUtils.isNune(selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title) ?
                        selectedfilterObj.ToQuarteryearDropdown.options[selectedfilterObj.ToQuarteryearDropdown.options.length - 1].title :
                        selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title;

                    selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title = !this._commUtils.isNune(selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title) ?
                        selectedfilterObj.ToQuarterDropdown.options[selectedfilterObj.ToQuarterDropdown.options.length - 1].title :
                        selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title;

                    break;
                default: {
                    selectedfilterObj.filterValueSet = false;
                }
                    break;
            }
        }

        if (this._commUtils.isPeriodFilter(selectedfilterObj.FilterType)) {
            this.onchangeDateFilter(selectedfilterObj, op);
            return;
        }
        else {
            this.getFilterTabInfo(selectedfilterObj);
        }
    }

    applyGlobalFilter(e) {
        var validatedTabs = [];
        var newChips = [];
        let _currenTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
        let lstFilterObject = e.isTabFilter ? _currenTabDetail.filterTabList : this.reportingObjects;
        for (let i of lstFilterObject) {
            if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.FilterType === DashboardConstants.FilterType.MultiSelect) {
                //To do when doing Date filter
                // i.FilterConditionOperator = Object.assign({}, this.filterByCdnConfig.options[0]);
                // i.FilterConditionOperator = Object.assign({}, this.filterByCdnConfig.options[0]);
                i.FilterConditionText.value = '';
            }
            else if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.FilterType === DashboardConstants.FilterType.MultiSelect) {
                i.FilterList.map((value: any) => {
                    value.IsSelected = false;
                });
                i.filteredList = i.FilterList;
                i.selectedFilterList = [];
                i.PartialSelect = false;
                // i.IsSelectAll = false;
            }

            if (
                (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection &&
                    i.filterSelSet === true && i.FilterType != DashboardConstants.FilterType.Number
                ) ||
                (
                    i.FilterType <= DashboardConstants.FilterType.MultiSelect &&
                    i.FilterBy == DashboardConstants.FilterBy.FilterByCondition &&
                    i.filterCdnSet === true
                )
            ) {
                if (i.inChip === true) {
                    validatedTabs.push(i);
                }
                else {
                    newChips.push(i);
                    i.inChip = true;
                }

            } else {
                i.IsSelected = false;
            }
            // if (i.ReportObjectType == DashboardConstants.ReportObjectType.Metrics && i.filterValueSet === true && i.FilterType != DashboardConstants.FilterType.Number)
            //     validatedTabs.push(i);
            // if ((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.FilterType >= 3 && i.filterValueSet === true)
            //     || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.FilterType >= 3 && i.filterCdnSet === true))
            //     validatedTabs.push(i);
            //To push the filter into filterTabList when it is MultiSelect and Filter By Condition.
            if (i.FilterType === DashboardConstants.FilterType.MultiSelect && i.FilterBy === DashboardConstants.FilterBy.FilterByCondition
                && i.filterValueSet === true) {
                if (i.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNull ||
                    i.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNotNull ||
                    i.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsEmpty ||
                    i.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNotEmpty) {
                    validatedTabs.push(i);
                }
                else if (this._commUtils.isNune(i.FilterConditionText.value)) {
                    validatedTabs.push(i);
                }
            }
            if (i.FilterType == DashboardConstants.FilterType.Date) {
                //Push the current filter by data into the validate tab

                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.FilterType == DashboardConstants.FilterType.Date && i.filterValueSet === true) {
                    this.clearDateFilterByDynamicCondition(i);
                    i.filterCdnSet = false;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.FilterType == DashboardConstants.FilterType.Date && i.filterCdnSet === true) {
                    this.clearDateFilterByCondition(i);
                    i.filterValueSet = false;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                //If the current filterBy and its corresponding filter flag is false reset the filter value
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && !i.filterCdnSet)) && i.filterByDateOpts && i.periodDate) {
                    this.clearDateFilterByCondition(i);
                    this.clearDateFilterByDynamicCondition(i);
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }
            }
            else if (i.FilterType == DashboardConstants.FilterType.Year) {
                //Push the current filter by data into the validate tab
                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.filterValueSet === true) {
                    this.clearYearFilterByDynamicCondition(i);
                    i.filterCdnSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.filterCdnSet === true) {
                    this.clearYearFilterByCondition(i);
                    i.filterValueSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && !i.filterCdnSet)) && i.YearRadioConfig && i.filterByYearOpts) {
                    this.clearYearFilterByCondition(i);
                    this.clearYearFilterByDynamicCondition(i);
                    i.inChip = false;
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }

            }
            else if (i.FilterType == DashboardConstants.FilterType.QuarterYear) {
                //Push the current filter by data into the validate tab
                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.filterValueSet === true) {
                    this.clearQuarterYearFilterByDynamicCondition(i);
                    i.filterCdnSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.filterCdnSet === true) {
                    this.clearQuarterYearFilterByCondition(i);
                    i.filterValueSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && !i.filterCdnSet)) && i.QuarterYearRadioConfig && i.filterByQuarterYearOpts) {
                    this.clearQuarterYearFilterByDynamicCondition(i)
                    this.clearQuarterYearFilterByCondition(i);
                    i.inChip = false;
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }

            }
            else if (i.FilterType == DashboardConstants.FilterType.Quarter) {
                //Push the current filter by data into the validate tab
                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.filterValueSet === true) {
                    this.clearQuarterFilterByDynamicCondition(i);
                    i.filterCdnSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.filterCdnSet === true) {
                    this.clearQuarterFilterByCondition(i);
                    i.filterValueSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && !i.filterCdnSet)) && i.QuarterYearRadioConfig && i.filterByQuarterYearOpts) {
                    this.clearQuarterFilterByCondition(i);
                    this.clearQuarterFilterByDynamicCondition(i);
                    i.inChip = false;
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }

            }
            if (i.FilterType == DashboardConstants.FilterType.MonthYear) {
                //Push the current filter by data into the validate tab
                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.filterValueSet === true) {
                    this.clearMonthYearFilterByDynamicCondition(i);
                    i.filterCdnSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.filterCdnSet === true) {
                    this.clearMonthYearFilterByCondition(i);
                    i.filterValueSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && !i.filterCdnSet)) && i.QuarterYearRadioConfig && i.filterByQuarterYearOpts) {
                    this.clearMonthYearFilterByDynamicCondition(i)
                    this.clearMonthYearFilterByCondition(i);
                    i.inChip = false;
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }

            }
            else if (i.FilterType == DashboardConstants.FilterType.Month) {
                //Push the current filter by data into the validate tab
                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.filterValueSet === true) {
                    this.clearMonthFilterByDynamicCondition(i);
                    i.filterCdnSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && i.filterCdnSet === true) {
                    this.clearMonthFilterByCondition(i);
                    i.filterValueSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && !i.filterCdnSet)) && i.QuarterYearRadioConfig && i.filterByQuarterYearOpts) {
                    this.clearMonthFilterByCondition(i);
                    this.clearMonthFilterByDynamicCondition(i);
                    i.inChip = false;
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }

            }
            else if (i.FilterType === DashboardConstants.FilterType.Measure &&
                i.filterValueSet === true) {
                i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                validatedTabs.push(i);
            }
            else if (i.FilterType == DashboardConstants.FilterType.Number) {
                //Push the current filter by data into the validate tab
                if (i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && i.filterValueSet === true) {
                    this.clearStringFilterBySelection(i);
                    i.filterCdnSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && (i.filterCdnSet || i.filterSelSet)) {
                    this.clearStringFilterByCondition(i);
                    i.filterValueSet = false;
                    i.inChip = true;
                    i.appliedFilter = true;
                    validatedTabs.push(i);
                }
                else if (((i.FilterBy == DashboardConstants.FilterBy.FilterByCondition && !i.filterValueSet) || (i.FilterBy == DashboardConstants.FilterBy.FilterBySelection && (!i.filterCdnSet || !i.filterSelSet)) && i.QuarterYearRadioConfig && i.filterByQuarterYearOpts)) {
                    this.clearStringFilterBySelection(i);
                    this.clearStringFilterByCondition(i);
                    i.inChip = false;
                    i.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    i.filterCdnSet = false;
                    i.filterValueSet = false;
                    i.appliedFilter = false;
                }

            }
        }
      validatedTabs = validatedTabs.concat(newChips);

        this.chip = JSON.parse(JSON.stringify(this.reportingObjects));
        // if(e.isTabFilter){
        //     this.reportingObjects = this._dashboardCommService.globalFilterList;
        // }
        // make a copy of appliesYearFilter and store it to maintainAppliedData
        // this.maintainAppliedData = JSON.parse(JSON.stringify( this.appliedYearFilter));
        let apply = ({
            event: e,
            validatedTabs: validatedTabs,
            appliedFilterData: this.chip,
            applyGlobalFilter: true,
            isTabFilter: e.isTabFilter
            // index: this.index
        });
        // As of now all are default filters so commenting below code
        // this.ftabs.forEach((item,index) => {
        //     if(item.isDefault==false&&item.filterSelSet!=true){
        //        this.ftabs.splice(index,1);
        //     }
        // });
        // this.appliedFilterData = JSON.parse(JSON.stringify(this.reportingObjects));
        this._dashboardCommService.setAppliedFilterData(apply);

    }

    cancelGlobalFilter() {
        let reportObjOriginal = this._commUtils.getDeReferencedObject(this.reportingObjects);
        this.reportingObjects = JSON.parse(JSON.stringify(this.chip));
        this.reportingObjects = compact(this.reportingObjects);
        if (this._commUtils.isNune(filter(reportObjOriginal, { isChecked: true })[0])) {
            this.reportingObjects.push(...filter(reportObjOriginal, { isChecked: true }));
            this.reportingObjects.push(...filter(reportObjOriginal, { isCheckedTrueFilter: true }));
        }
        this.reportingObjects = uniqBy(this.reportingObjects, 'ReportObjectId');
    }

    clearFilter(obj) {
        obj.SelectAll = false;
        obj.IsShowSelected = false;
        obj.PartialSelect = false;
        obj.SelectAllTxt = 'Select All';
        obj.FilterTabInfo = '';
        obj.appliedFilter = false;
        obj.selectedFilterList = [];
        if (this._commUtils.isNune(this._commUtils._widgetCards)) {
            obj.FilterIdentifier = obj.enabledAsGlobalSlider ? DashboardConstants.ViewFilterType.SingleSource : obj.FilterIdentifier;
            obj.enabledAsGlobalSlider = false;
            const index = this._commUtils._widgetCards.findIndex(x => x.cardId == obj.ReportObjectId);
            if (index != -1) {
                this._commUtils._widgetCards[index].isRemoved = true;
                this._commUtils._widgetCards[index].subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.REMOVE_GLOBAL_SLIDER, cardId: this._commUtils._widgetCards[index].cardId })
            }

        }
        if (([DashboardConstants.ReportObjectType.Attribute,
        DashboardConstants.ReportObjectType.Metrics].indexOf(obj.ReportObjectType) != -1) &&
            (
                [DashboardConstants.FilterType.SingleSelect,
                DashboardConstants.FilterType.MultiSelect,
                DashboardConstants.FilterType.Measure,
                DashboardConstants.FilterType.Number].indexOf(obj.FilterType) != -1)
        ) {

            if (obj.FilterType != DashboardConstants.FilterType.Measure &&
                obj.FilterType != DashboardConstants.FilterType.Number) {

                obj.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                this.clearStringFilterBySelection(obj);
            }
            else if (obj.FilterType === DashboardConstants.FilterType.Number) {
                obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                this.clearStringFilterBySelection(obj);
                this.clearStringFilterByCondition(obj);
            }
            else {
                obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                this.clearStringFilterByCondition(obj);
            }
        }
        // if (obj.ReportObjectType == 1 && obj.FilterType < 3) {
        //     for (var i = 0; i < obj.FilterList.length; i++) {
        //         obj.filteredList[i].IsSelected = false;
        //         obj.FilterList[i].IsSelected = false;
        //         obj.FilterConditionOperator = { "title": "Is", "op": 3 };
        //         obj.FilterConditionText.value = '';
        //         obj.FilterSearchText.value = '';
        //     }
        // }
        //else if (obj.FilterType >= 3 && obj.FilterType !== 10) {
        // obj.currentdateModel.value = '';
        // obj.RollingDateModel.value = "";
        // obj.NextDateModel.value = "";
        // obj.FilterConditionOperator = { "title": "Is", "op": 3 },
        //     obj.FilterRadioOperator.field = { "op": "2", "title": "Today" }
        // obj.FilterConditionValue.value = "";
        // obj.FilterConditionRangeValue = {
        //     "from": "",
        //     "to": ""
        // };

        // uncheck selected checkboxes
        // this.SelectedYear = 'Select Year'
        // for(let i of this.appliedYearFilter ){
        //     i.IsCheck = false;
        // }
        // this.appliedYearFilter = [];
        // this.maintainAppliedData = JSON.parse(JSON.stringify(this.appliedYearFilter));
        // this.updateSelectYearLabel(this.maintainAppliedData);

        // this.yearDropdown.selectedOption = { "title": this.today.getFullYear().toString() };
        // this.FromyearDropdown.selectedOption = { "title": this.today.getFullYear().toString() };
        // this.ToyearDropdown.selectedOption = { "title": this.today.getFullYear().toString() };
        // this.BeginningOfTheYear.selectedOption = { "title": this.today.getFullYear().toString() };

        // this.sourceMonth.selectedoption = "";
        // this.sourceQuarter.selectedoption = "";
        // this.sourceYear.selectedoption = "";
        //}
        //Set value after clear
        else if (obj.FilterType === DashboardConstants.FilterType.Date) {
            obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
            this.clearDateFilterByDynamicCondition(obj);
            this.clearDateFilterByCondition(obj);
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Year) {
            obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
            this.clearYearFilterByCondition(obj);
            this.clearYearFilterByDynamicCondition(obj);
            obj.SelectedYear = 'Select Year'
            for (let i of obj.appliedYearFilter) {
                i.IsCheckModel = {
                    IsCheck: false
                }
            }
            obj.appliedYearFilter = [];
            obj.maintainAppliedData = JSON.parse(JSON.stringify(obj.appliedYearFilter));
            //this.updateSelectYearLabel(obj.maintainAppliedData);
        }
        else if (obj.FilterType === DashboardConstants.FilterType.QuarterYear) {
            obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
            this.clearQuarterYearFilterByDynamicCondition(obj);
            this.clearQuarterYearFilterByCondition(obj);
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Quarter) {
            obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
            this.clearQuarterFilterByCondition(obj);
            this.clearQuarterFilterByDynamicCondition(obj);
            obj.SelectedYear = 'Select Quarter';
            for (let i of obj.appliedYearFilter) {
                i.IsCheckModel = {
                    IsCheck: false
                }
            }
            obj.appliedYearFilter = [];
            obj.maintainAppliedData = JSON.parse(JSON.stringify(obj.appliedYearFilter));
        }
        else if (obj.FilterType === DashboardConstants.FilterType.MonthYear) {
            obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
            this.clearMonthYearFilterByDynamicCondition(obj);
            this.clearMonthYearFilterByCondition(obj);
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Month) {
            obj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
            this.clearMonthFilterByCondition(obj);
            this.clearMonthFilterByDynamicCondition(obj);
            obj.SelectedYear = 'Select Month';
            for (let i of obj.appliedYearFilter) {
                i.IsCheckModel = {
                    IsCheck: false
                }
            }
            obj.appliedYearFilter = [];
            obj.maintainAppliedData = JSON.parse(JSON.stringify(obj.appliedYearFilter));
        }
        else {
            obj.FilterConditionRangeValue = '';
            obj.FilterConditionOperator = { "title": "Greater than", "op": 1 };
            obj.FilterConditionRangeValue = {
                "from": "",
                "to": ""
            };
            if (obj.FilterType === 10) {
                for (var i = 0; i < obj.FilterList.length; i++) {
                    obj.filteredList[i].IsSelected = false;
                }

            }
        }
        obj.filterCdnSet = false;
        obj.filterValueSet = false;
        obj.filterSelSet = false;
    }

    onValueKeypress(selectedfilterObj, value) {
        if (typeof value == 'string' && value.trim() != '') {
            if (selectedfilterObj.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
                selectedfilterObj.filterCdnSet = true;
            }
            else if (selectedfilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                selectedfilterObj.filterValueSet = true;
            }
        }
        else if (typeof value == 'number' && value != null) {
            selectedfilterObj.filterCdnSet = true;
            selectedfilterObj.filterValueSet = true;
        }
        else {
            selectedfilterObj.filterCdnSet = false;
            selectedfilterObj.filterValueSet = false;
        }
        if (selectedfilterObj.ReportObjectType == 0 && !this._commUtils.isNune(value)) {
            selectedfilterObj.filterValueSet = false;
        }
        if (selectedfilterObj.FilterType >= 3 && value > 0) {
            selectedfilterObj.filterValueSet = true;
        }
        this.getFilterTabInfo(selectedfilterObj);
    }

    periodRadioChange(selectedfilterObj, currentSelected) {
        let obj = selectedfilterObj;
        // obj.FilterRadioOperator = currentSelected;

        //  whether to make seperate model for current/rolling date/year. 
        // switch (obj.FilterType){
        //     case 4 : {
        //         if(currentSelected.op == 4) {
        //             obj.FilterConditionValue = this.RollingYearsModel.rollingYearValue
        //         }

        //         else if(currentSelected.op == 5){
        //             obj.FilterConditionValue = this.NextYearsModel.nextYearValue
        //         }
        //         else {
        //             obj.FilterConditionValue = this.BeginningOfTheYear.selectedOption.title
        //         }
        //         break;
        //     }

        // }
        obj.filterCdnSet = true;
        this.getFilterTabInfo(selectedfilterObj);

    }

    removeFilter(obj, lstTabFilters = []) {
        let _filterList = this.reportingObjects;
        if (lstTabFilters.length > 0)
            _filterList = lstTabFilters;
        if (_filterList) {
            _filterList.forEach((item, index) => {
                if (item.DisplayName === obj.DisplayName) {
                    _filterList[index].inChip = false;
                    this.clearFilter(_filterList[index]);
                    if (lstTabFilters.length === 0)
                        this.chip = JSON.parse(JSON.stringify(this.reportingObjects));
                }
            });
        }
    }


    setChipData(reportObjectId) {
        this.reportingObjects.forEach((element, index) => {
            if (reportObjectId === element.ReportObjectId) {
                this.chip[index] = JSON.parse(JSON.stringify(element))
            }
        });
        //this.chip = JSON.parse(JSON.stringify(this.reportingObjects));
    }

    onchangeDateFilter(selectedfilterObj, op) {
        //Code for QUarter
        switch (selectedfilterObj.FilterType) {
            case DashboardConstants.FilterType.Date: {
                // date filter
                if (selectedfilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    selectedfilterObj.filterValueSet = true;
                    if (op == DashboardConstants.ReportObjectOperators.Between ||
                        op == DashboardConstants.ReportObjectOperators.NotBetween) {
                        selectedfilterObj.FilterConditionRangeValue.from =
                            this._commUtils.getDateInFormat(selectedfilterObj.FromDateModel.FromDateValue);
                        selectedfilterObj.FilterConditionRangeValue.to =
                            this._commUtils.getDateInFormat(selectedfilterObj.ToDateModel.ToDateValue);
                        if (selectedfilterObj.FromDateModel.FromDateValue == "" ||
                            selectedfilterObj.ToDateModel.ToDateValue == "") {
                            selectedfilterObj.filterValueSet = false;
                        }
                        //     this.getFilterTabInfo();
                        //     break;
                    }
                    else {
                        selectedfilterObj.FilterConditionValue =
                            this._commUtils.getDateInFormat(selectedfilterObj.DateModel.DateValue);
                    }
                }
                else if (selectedfilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    selectedfilterObj.filterCdnSet = true;
                    if (selectedfilterObj.DateRadioModel.DateRadioValue == "") {
                        selectedfilterObj.filterCdnSet = false;
                    }
                    selectedfilterObj.FilterConditionValue =
                        this._commUtils.getDateInFormat(selectedfilterObj.DateRadioModel.DateRadioValue);
                }
                this.getFilterTabInfo(selectedfilterObj);
                break;
            }
            case DashboardConstants.FilterType.Year: {
                if (op === DashboardConstants.ReportObjectOperators.Between) {
                    selectedfilterObj.FilterConditionRangeValue.from = Object.assign(selectedfilterObj.FromyearDropdown.selectedRangeOptions.from.title);
                    selectedfilterObj.FilterConditionRangeValue.to = Object.assign(selectedfilterObj.ToyearDropdown.selectedRangeOptions.to.title);
                    selectedfilterObj.filterValueSet = true;
                }
                else if (op === DashboardConstants.ReportObjectOperators.Before || op === DashboardConstants.ReportObjectOperators.After) {
                    selectedfilterObj.FilterConditionValue = Object.assign(selectedfilterObj.yearDropdown.selectedOption.title);
                    selectedfilterObj.filterValueSet = true;
                }
                else if (op === DashboardConstants.ReportObjectOperators.Is || op === DashboardConstants.ReportObjectOperators.IsNot) {
                    if (filter(selectedfilterObj.sourceYear, (value, index) => { return value.IsCheckModel.IsCheck; }).length === 0) {
                        selectedfilterObj.filterValueSet = false;
                    }
                    selectedfilterObj.FilterConditionValue = Object.assign(filter(selectedfilterObj.sourceYear, (value, index) => { return value.IsCheckModel.IsCheck }));
                }
                this.getFilterTabInfo(selectedfilterObj);
                break;
            }
            case DashboardConstants.FilterType.Quarter: {
                if (op === DashboardConstants.ReportObjectOperators.Is || op === DashboardConstants.ReportObjectOperators.IsNot) {
                    if (filter(selectedfilterObj.sourceQuarterYear, (value, index) => { return value.IsCheckModel.IsCheck; }).length === 0) {
                        selectedfilterObj.filterValueSet = false;
                    }
                    else {
                        let { options, values } = selectedfilterObj.sourceQuarterDropDown;
                        let filterValues = [];
                        each(selectedfilterObj.appliedYearFilter, _val => {
                            filterValues.push(
                                values[
                                    findIndex(options, { title: _val.name })
                                ].title
                            )
                        })
                        selectedfilterObj.FilterConditionValue = [...filterValues];
                    }
                }
                this.getFilterTabInfo(selectedfilterObj);
                break;
            }
            case DashboardConstants.FilterType.QuarterYear: {
                switch (op) {
                    case DashboardConstants.ReportObjectOperators.Is:
                    case DashboardConstants.ReportObjectOperators.IsNot:
                    case DashboardConstants.ReportObjectOperators.Before:
                    case DashboardConstants.ReportObjectOperators.After:
                        selectedfilterObj.FilterConditionValue = selectedfilterObj.QuarteryearDropdown.selectedOption.title +
                            selectedfilterObj.sourceQuarterDropDown.values[
                                findIndex(selectedfilterObj.sourceQuarterDropDown.options, (_val: any) => _val.title == selectedfilterObj.sourceQuarterDropDown.selectedOption.title)
                            ].title
                        selectedfilterObj.filterValueSet = true;
                        break;
                    case DashboardConstants.ReportObjectOperators.Between:
                    case DashboardConstants.ReportObjectOperators.NotBetween:
                        let from = selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title +
                            selectedfilterObj.sourceQuarterDropDown.values[
                                findIndex(selectedfilterObj.sourceQuarterDropDown.options, (_val: any) => _val.title == selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title)
                            ].title;
                        let to = selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title +
                            selectedfilterObj.sourceQuarterDropDown.values[
                                findIndex(selectedfilterObj.sourceQuarterDropDown.options, (_val: any) => _val.title == selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title)
                            ].title;
                        selectedfilterObj.FilterConditionValue = [];
                        selectedfilterObj.FilterConditionRangeValue.from = from;
                        selectedfilterObj.FilterConditionRangeValue.to = to;
                        selectedfilterObj.filterValueSet = true;
                        break;
                }
                this.getFilterTabInfo(selectedfilterObj);
            }
            case DashboardConstants.FilterType.MonthYear: {
                switch (op) {
                    case DashboardConstants.ReportObjectOperators.Is:
                    case DashboardConstants.ReportObjectOperators.IsNot:
                    case DashboardConstants.ReportObjectOperators.Before:
                    case DashboardConstants.ReportObjectOperators.After:
                        selectedfilterObj.FilterConditionValue = selectedfilterObj.QuarteryearDropdown.selectedOption.title;
                        let monthValue = selectedfilterObj.sourceQuarterDropDown.values[
                            findIndex(selectedfilterObj.sourceQuarterDropDown.options, (_val: any) => _val.title == selectedfilterObj.sourceQuarterDropDown.selectedOption.title)
                        ].title
                        monthValue = monthValue.length === 1 ? '0' + monthValue : monthValue;
                        selectedfilterObj.FilterConditionValue += monthValue;
                        selectedfilterObj.filterValueSet = true;
                        break;
                    case DashboardConstants.ReportObjectOperators.Between:
                    case DashboardConstants.ReportObjectOperators.NotBetween:
                        let from = selectedfilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title;
                        let fromMonth = selectedfilterObj.sourceQuarterDropDown.values[
                            findIndex(selectedfilterObj.sourceQuarterDropDown.options, (_val: any) => _val.title == selectedfilterObj.FromQuarterDropdown.selectedRangeOptions.from.title)
                        ].title;
                        fromMonth = fromMonth.length === 1 ? '0' + fromMonth : fromMonth;
                        from += fromMonth;
                        let to = selectedfilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title;
                        let toMonth = selectedfilterObj.sourceQuarterDropDown.values[
                            findIndex(selectedfilterObj.sourceQuarterDropDown.options, (_val: any) => _val.title == selectedfilterObj.ToQuarterDropdown.selectedRangeOptions.to.title)
                        ].title;
                        toMonth = toMonth.length === 1 ? '0' + toMonth : toMonth;
                        to += toMonth;
                        selectedfilterObj.FilterConditionValue = [];
                        selectedfilterObj.FilterConditionRangeValue.from = from;
                        selectedfilterObj.FilterConditionRangeValue.to = to;
                        selectedfilterObj.filterValueSet = true;
                        break;
                }
                this.getFilterTabInfo(selectedfilterObj);
            }
                break;
            case DashboardConstants.FilterType.Month: {
                if (op === DashboardConstants.ReportObjectOperators.Is || op === DashboardConstants.ReportObjectOperators.IsNot) {
                    if (filter(selectedfilterObj.sourceQuarterYear, (value, index) => { return value.IsCheckModel.IsCheck; }).length === 0) {
                        selectedfilterObj.filterValueSet = false;
                    }
                    else {
                        let { options, values } = selectedfilterObj.sourceQuarterDropDown;
                        let filterValues = [];
                        each(selectedfilterObj.appliedYearFilter, _val => {
                            filterValues.push(
                                values[
                                    findIndex(options, { title: _val.name })
                                ].title
                            )
                        })
                        selectedfilterObj.FilterConditionValue = [...filterValues];
                    }
                }
                this.getFilterTabInfo(selectedfilterObj);
                break;
            }
            default: {
                break;
            }
        }
    }

    private clearYearFilterByDynamicCondition(selectedfilterObj) {
        selectedfilterObj.YearModel.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisYear,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisYear],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisYear &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        selectedfilterObj.FilterRadioOperator.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisYear,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisYear],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisYear &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.BeginningOfTheYear.selectedOption.title = filterObject.BeginningOfTheYear.options[filterObject.BeginningOfTheYear.options.length - 1].title;
        selectedfilterObj.BeginningOfTheYear = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.BeginningOfTheYear.options && selectedfilterObj.BeginningOfTheYear.options.length > 0 ? selectedfilterObj.BeginningOfTheYear.options : [],
            selectedOption: {
                title: '',
            }
        } as IBeginningOfTheYear;
        selectedfilterObj.RollingYearsModel = {
            rollingYearValue: '',
        } as IRollingYearsModel;
        selectedfilterObj.NextYearsModel = {
            nextYearValue: '',
        } as INextYearsModel;
    }

    private clearYearFilterByCondition(selectedfilterObj: any) {
        selectedfilterObj.FilterConditionOperator = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.Is,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.yearDropdown.selectedOption.title = filterObject.yearDropdown.options[filterObject.yearDropdown.options.length - 1].title;
        //filterObject.FromyearDropdown.selectedRangeOptions.from.title = filterObject.FromyearDropdown.options[filterObject.FromyearDropdown.options.length - 1].title;
        //filterObject.ToyearDropdown.selectedRangeOptions.to.title = filterObject.ToyearDropdown.options[filterObject.ToyearDropdown.options.length - 1].title;
        selectedfilterObj.yearDropdown = {
            fieldKey: 'selectedOption',
            dataKey: 'title',
            displayKey: 'title',
            label: 'Select Year',
            options: selectedfilterObj.yearDropdown.options && selectedfilterObj.yearDropdown.options.length > 0 ? selectedfilterObj.yearDropdown.options : [],
            selectedOption: {
                title: '',
            },
            values: [],
            type: 'select',
            attributes: {}
        } as IYearDropdown;


        selectedfilterObj.FromyearDropdown = {
            fieldKey: 'from',
            label: 'From',
            dataKey: 'title',
            displayKey: 'title',
            options: selectedfilterObj.FromyearDropdown.options && selectedfilterObj.FromyearDropdown.options.length > 0 ? selectedfilterObj.FromyearDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            attributes: {},
            type: 'select'
        } as IFromyearDropdown;
        selectedfilterObj.ToyearDropdown = {
            fieldKey: 'to',
            label: 'To',
            dataKey: 'title',
            displayKey: 'title',
            options: selectedfilterObj.ToyearDropdown.options && selectedfilterObj.ToyearDropdown.options.length > 0 ? selectedfilterObj.ToyearDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            attributes: {},
            type: 'select'
        };
        each(selectedfilterObj.sourceYear, (_value: any, _index: any) => {
            _value.IsCheckModel.IsCheck = false;
        });
        selectedfilterObj.appliedYearFilter = [];
        selectedfilterObj.showLabel = false;
        selectedfilterObj.SelectedYear = 'Select Year';
        selectedfilterObj.showSelectYearPopup = false;
        // this.showLabel = false;
        // this.SelectedYear = 'Select Year';
        // this.appliedYearFilter = [];
    }

    private clearDateFilterByDynamicCondition(selectedfilterObj: any) {

        selectedfilterObj.FilterRadioOperator.field.op = DashboardConstants.ReportObjectOperators.Today;
        selectedfilterObj.FilterRadioOperator.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Today];
        selectedfilterObj.FilterRadioOperator.field.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Today &&
                filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
        })[0].FilterConditionObjectId;
        selectedfilterObj.RollingDateModel.rollingDateValue = "";
        selectedfilterObj.NextDateModel.nextDateValue = "";
        selectedfilterObj.DateRadioModel.DateRadioValue = "";
    }

    private clearDateFilterByCondition(selectedfilterObj: any) {
        selectedfilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Between;
        selectedfilterObj.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Between];
        selectedfilterObj.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Between &&
                filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
        })[0].FilterConditionObjectId;
        selectedfilterObj.FilterConditionRangeValue.from = "";
        selectedfilterObj.FilterConditionRangeValue.to = "";
        selectedfilterObj.DateModel.DateValue = "";
        selectedfilterObj.FromDateModel.FromDateValue = "";
        selectedfilterObj.ToDateModel.ToDateValue = "";

    }

    private clearStringFilterBySelection(selectedfilterObj: any) {
        if (selectedfilterObj.FilterType != DashboardConstants.FilterType.Number) {
            selectedfilterObj.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId;
            selectedfilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Is;
            selectedfilterObj.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is];
            selectedfilterObj.FilterConditionText.value = '';
        }
        for (var i = 0; i < selectedfilterObj.FilterList.length; i++) {
            if (selectedfilterObj.filteredList[i] != undefined) {
                selectedfilterObj.filteredList[i].IsSelected = false;
            }
            selectedfilterObj.FilterList[i].IsSelected = false;
            selectedfilterObj.FilterSearchText.value = '';
        }
    }

    private clearStringFilterByCondition(selectedfilterObj: any) {
        if (selectedfilterObj.FilterType != DashboardConstants.FilterType.Measure && selectedfilterObj.FilterType != DashboardConstants.FilterType.Number) {
            selectedfilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.In;
            selectedfilterObj.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.In &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId;
            selectedfilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.In;
        }
        else if (selectedfilterObj.FilterType === DashboardConstants.FilterType.Measure || selectedfilterObj.FilterType === DashboardConstants.FilterType.Number) {
            selectedfilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.GreaterThan;
            selectedfilterObj.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.GreaterThan &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId;
            selectedfilterObj.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.GreaterThan;
            selectedfilterObj.FilterConditionRangeValue.from = '';
            selectedfilterObj.FilterConditionRangeValue.to = '';
        }
        selectedfilterObj.FilterConditionText.value = "";
        selectedfilterObj.FilterConditionValue = "";
        selectedfilterObj.autoCompleteFilterData = "";
        selectedfilterObj.autoCompleteFilterList = [];
    }

    public getFilterValueWithOperator(
        _appliedfilterValues: any,
        _appliedfilterKeys: number
    ): IFilterValueList {
        //assigning the default values to filter value list for both filter objects.
        let _filterValue: IFilterValueList = { FilterBy: -1, Operators: -1, listFilterValues: [] };
        let listFilterValues: any = [];
        let Operators: number;
        let FilterBy: number;
        const _isCrossSuiteView: boolean = this._commUtils.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource);
        if (_isCrossSuiteView) {
            //Getting the Filter Selected Values for the All the Applied Filter Objects
            Operators = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ?
                DashboardConstants.ReportObjectOperators.Is : _appliedfilterValues.FilterConditionOperator.op;
            FilterBy = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ?
                DashboardConstants.FilterBy.FilterBySelection : DashboardConstants.FilterBy.FilterByCondition;

            if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                if (_appliedfilterValues.SelectAll && _appliedfilterValues.IsSelectAll) {
                    // Sending -1 when user has selected all with
                    listFilterValues.push(DashboardConstants.DAXQueryManipulate.AllRecords);
                }
                else {
                    _appliedfilterValues.selectedFilterList.filter((_selAppliedFilter: IFilterList) => {
                        if (_selAppliedFilter.IsSelected) {
                            listFilterValues.push(_selAppliedFilter.title);
                        }
                    });
                }
            }
            else {
                // Will split the Values only for the In and Not In Values Otherwise Not.
                if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.In || _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.NotIn) {
                    listFilterValues = _appliedfilterValues.FilterConditionText.value.split(';');
                    listFilterValues = (listFilterValues.length > 1 && _appliedfilterValues.FilterConditionText.value.endsWith(';')) ? listFilterValues.slice(0, listFilterValues.length - 1) : listFilterValues;
                }
                else {
                    if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsEmpty ||
                        _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotEmpty) {
                        listFilterValues.push("");
                    } else {
                        listFilterValues.push(_appliedfilterValues.FilterConditionText.value);
                    }
                }
            }
        }
        else {
            //Getting the Filter Selected Values for the All the Applied Filter Objects
            FilterBy = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ?
                DashboardConstants.FilterBy.FilterBySelection : DashboardConstants.FilterBy.FilterByCondition;
            //In case of the slicer filter we will set the operator as In.
            if (!(this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType)) &&
                _appliedfilterValues.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                Operators = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ?
                    DashboardConstants.ReportObjectOperators.In : _appliedfilterValues.FilterConditionOperator.op;
            }
            //Here we will only check if the filterOBject is slicer filter irrespective of period or not and assing the operator as in.
            else if (_appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                if (this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType)) {
                    Operators = DashboardConstants.ReportObjectOperators.Is;
                }
                else {
                    Operators = DashboardConstants.ReportObjectOperators.In;
                }
            }
            //Here if the period object is a slicer filter we will treat it as a FilterBySelection of any other attribute filter and fill the listFilterValues.
            if (!(this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType)) ||
                _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    if (_appliedfilterValues.SelectAll && _appliedfilterValues.IsSelectAll) {
                        // Sending -1 when user has selected all with
                        listFilterValues.push(DashboardConstants.DAXQueryManipulate.AllRecords);
                    }
                    else {
                        _appliedfilterValues.selectedFilterList.filter((_selAppliedFilter: IFilterList) => {
                            if (_selAppliedFilter.IsSelected) {
                                listFilterValues.push((_selAppliedFilter.title).toString());
                            }
                        });
                    }
                }
                else {
                    // Will split the Values only for the In and Not In Values Otherwise Not.
                    if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.In || _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.NotIn) {
                        listFilterValues = _appliedfilterValues.FilterConditionText.value.split(';');
                        if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.MultiSelect) {
                            listFilterValues = (listFilterValues.length > 1 && _appliedfilterValues.FilterConditionText.value.endsWith(';')) ? listFilterValues.slice(0, listFilterValues.length - 1) : listFilterValues;
                        }
                    }
                    else if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsEmpty ||
                        _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotEmpty ||
                        _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNull ||
                        _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotNull) {
                        listFilterValues.push("");
                    }
                    else if
                        (
                        [
                            DashboardConstants.ReportObjectOperators.Between,
                            DashboardConstants.ReportObjectOperators.NotBetween
                        ].indexOf(_appliedfilterValues.FilterConditionOperator.op) != -1
                    ) {
                        listFilterValues = [
                            _appliedfilterValues.FilterConditionRangeValue.from,
                            _appliedfilterValues.FilterConditionRangeValue.to
                        ];
                    }
                    else if (
                        [
                            DashboardConstants.ReportObjectOperators.GreaterThan,
                            DashboardConstants.ReportObjectOperators.LessThan,
                            DashboardConstants.ReportObjectOperators.TopNRecords,
                            DashboardConstants.ReportObjectOperators.LowestNRecords,
                            DashboardConstants.ReportObjectOperators.TopNPercentage,
                            DashboardConstants.ReportObjectOperators.LowestNPercentage,
                            DashboardConstants.ReportObjectOperators.GreaterThanOrEqualTo,
                            DashboardConstants.ReportObjectOperators.LessThanOrEqualTo,

                        ].indexOf(_appliedfilterValues.FilterConditionOperator.op) != -1
                    ) {
                        listFilterValues.push(_appliedfilterValues.FilterConditionValue);
                    }
                    else {
                        listFilterValues.push(_appliedfilterValues.FilterConditionText.value);
                    }

                }
            }
            //This will be only checked for non slicer filter period objects
            if (_appliedfilterValues.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                //Check if it is Date Period Filter
                if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.Date) {
                    //check if Period Filter By Dynamic Period. 
                    if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                        Operators = _appliedfilterValues.FilterRadioOperator.field.op;
                        if (DashboardConstants.ReportObjectOperators.From_DateTillToday != _appliedfilterValues.FilterRadioOperator.field.op) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
                        }
                        else {
                            listFilterValues.push.apply(listFilterValues, [new Date(_appliedfilterValues.FilterConditionValue.toString()).getFullYear().toString(),
                            (new Date(_appliedfilterValues.FilterConditionValue.toString()).getMonth() + 1).toString(), new Date(_appliedfilterValues.FilterConditionValue.toString()).getDate().toString()]);
                        }
                    }
                    //Check if Period Filter By Condition
                    if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                        Operators = _appliedfilterValues.FilterConditionOperator.op;
                        //If it is not Between condition
                        if (_appliedfilterValues.FilterConditionOperator.op != DashboardConstants.ReportObjectOperators.Between) {
                            listFilterValues.push(this._commUtils.getPeriodDateValue(_appliedfilterValues.FilterConditionValue));
                        }
                        else {
                            listFilterValues.push(this._commUtils.getPeriodDateValue(_appliedfilterValues.FilterConditionRangeValue.from));
                            listFilterValues.push(this._commUtils.getPeriodDateValue(_appliedfilterValues.FilterConditionRangeValue.to));
                        }
                    }
                }
                //Check if it is Year PEriod Filter
                else if (this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType) &&
                    _appliedfilterValues.FilterType === DashboardConstants.FilterType.Year) {
                    if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                        Operators = _appliedfilterValues.FilterConditionOperator.op;
                        //If it is 'IS' or 'IS NOT' Condition
                        if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
                            listFilterValues = filter(mapValues(_appliedfilterValues.FilterConditionValue, 'name'), (value, index) => {
                                return value;
                            });
                        }
                        else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.from);
                            listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.to);
                        }
                        else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue);
                        }
                    }
                    else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                        Operators = _appliedfilterValues.YearModel.field.op;
                        listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
                    }
                }
                else if (this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType) &&
                    _appliedfilterValues.FilterType === DashboardConstants.FilterType.QuarterYear) {
                    if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                        Operators = _appliedfilterValues.FilterConditionOperator.op;
                        //If it is 'IS' or 'IS NOT' Condition
                        if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
                            _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue);
                        }
                        else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.from);
                            listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.to);
                        }
                        else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before ||
                            _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue);
                        }
                    }
                    else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                        Operators = _appliedfilterValues.QuarterYearModel.field.op;
                        if (Operators != DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
                        }
                        else if (Operators === DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                            each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val.toString()));
                        }
                    }
                }
                else if (this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType) &&
                    _appliedfilterValues.FilterType === DashboardConstants.FilterType.Quarter) {
                    if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                        Operators = _appliedfilterValues.FilterConditionOperator.op;
                        //If it is 'IS' or 'IS NOT' Condition
                        if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
                            _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
                            each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val.toString()))
                        }
                    }
                    else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                        Operators = _appliedfilterValues.QuarterYearModel.field.op;
                        if (Operators != DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
                        }
                        else if (Operators === DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                            each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val.toString()));
                        }
                    }
                }
                else if (this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType) &&
                    _appliedfilterValues.FilterType === DashboardConstants.FilterType.Month) {
                    if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                        Operators = _appliedfilterValues.FilterConditionOperator.op;
                        //If it is 'IS' or 'IS NOT' Condition
                        if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
                            _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
                            each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val.toString()))
                        }
                    }
                    else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                        Operators = _appliedfilterValues.QuarterYearModel.field.op;
                        if (Operators != DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
                        }
                        // else if (Operators === DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                        //     each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val.toString()));
                        // }
                    }
                }
                else if (this._commUtils.isPeriodFilter(_appliedfilterValues.FilterType) &&
                    _appliedfilterValues.FilterType === DashboardConstants.FilterType.MonthYear) {
                    if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                        Operators = _appliedfilterValues.FilterConditionOperator.op;
                        //If it is 'IS' or 'IS NOT' Condition
                        if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
                            _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
                            listFilterValues[0] = (_appliedfilterValues.FilterConditionValue);
                        }
                        else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
                            listFilterValues[0] = (_appliedfilterValues.FilterConditionRangeValue.from);
                            listFilterValues[1] = (_appliedfilterValues.FilterConditionRangeValue.to);
                        }
                        else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before ||
                            _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
                            listFilterValues[0] = (_appliedfilterValues.FilterConditionValue);
                        }
                    }
                    else if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
                        Operators = _appliedfilterValues.QuarterYearModel.field.op;
                        if (Operators != DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
                            listFilterValues[0] = (_appliedfilterValues.FilterConditionValue.toString());
                        }
                        else if (Operators === DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
                            each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val.toString()));
                        }
                    }
                }
            }
        }
        _filterValue.FilterBy = FilterBy;
        _filterValue.Operators = Operators;
        _filterValue.listFilterValues = listFilterValues;
        return _filterValue;
    }

    // logic to create chip 
    onChangeAutoCompleteFilter(value, selectedfilterObj) {
        if (value != undefined && value.trim() != '') {
            selectedfilterObj.autoCompleteFilterData = '';
            selectedfilterObj.FilterConditionText.value = "";

            let autoCompleteFilterListInLowerCase = selectedfilterObj.autoCompleteFilterList.map(item => item.toLowerCase());

            // remove duplicate values form chip array including case sensative values,also remove ;;;;; values while copy paste
            uniqBy(value.split(';'), (value: string) => value.toLowerCase()).forEach((value) => {
                if (value != '' && autoCompleteFilterListInLowerCase.indexOf(value.toLowerCase()) < 0)
                    if (selectedfilterObj.autoCompleteFilterList.length < 300) {
                        selectedfilterObj.autoCompleteFilterList.push(value);
                    }
            });

            // convert chip array data into filter conftion text string for further use           
            selectedfilterObj.FilterConditionText.value = selectedfilterObj.autoCompleteFilterList.join(';') + ";";

            if (typeof selectedfilterObj.FilterConditionText.value == 'string' && selectedfilterObj.FilterConditionText.value.trim() != '') {
                selectedfilterObj.filterValueSet = true;
            } else {
                selectedfilterObj.filterCdnSet = false;
            }
            this.getFilterTabInfo(selectedfilterObj);
        }
    }

    // Logic to remove chips from array
    removeFilterChip = function (selectedfilterObj, index) {
        selectedfilterObj.autoCompleteFilterList.splice(index, 1);
        selectedfilterObj.FilterConditionText.value = "";
        if (selectedfilterObj.autoCompleteFilterList.length > 0) {
            selectedfilterObj.FilterConditionText.value = selectedfilterObj.autoCompleteFilterList.join(";") + ";";
        }
        if (selectedfilterObj.autoCompleteFilterList.length == 0) {
            selectedfilterObj.filterCdnSet = false;
            selectedfilterObj.filterValueSet = false;
        }
        this.getFilterTabInfo(selectedfilterObj);
    }


    private clearQuarterYearFilterByDynamicCondition(selectedfilterObj) {
        selectedfilterObj.QuarterYearModel.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisQuarter,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        selectedfilterObj.FilterRadioOperator.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisQuarter,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.BeginningOfTheYear.selectedOption.title = filterObject.BeginningOfTheYear.options[filterObject.BeginningOfTheYear.options.length - 1].title;
        selectedfilterObj.BeginningOfTheQuarterYear = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Year',
            options: selectedfilterObj.BeginningOfTheQuarterYear.options && selectedfilterObj.BeginningOfTheQuarterYear.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarterYear.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {}
        } as IBeginningOfTheYear;

        selectedfilterObj.BeginningOfTheQuarter = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Quarter',
            options: selectedfilterObj.BeginningOfTheQuarter.options && selectedfilterObj.BeginningOfTheQuarter.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarter.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {},
        } as IBeginningOfTheYear;
        selectedfilterObj.RollingQuarterYearsModel = {
            rollingQuarterYearValue: '',
        } as IRollingQuarterYearsModel;
        selectedfilterObj.NextQuarterYearsModel = {
            nextQuarterYearValue: '',
        } as INextQuarterYearsModel;
        selectedfilterObj.PreviousQuarterYearsModel = {
            previousQuarterYearValue: '',
        } as IPreviousQuarterYearsModel
    }


    private clearQuarterYearFilterByCondition(selectedfilterObj: any) {
        selectedfilterObj.FilterConditionOperator = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.Is,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.yearDropdown.selectedOption.title = filterObject.yearDropdown.options[filterObject.yearDropdown.options.length - 1].title;
        //filterObject.FromyearDropdown.selectedRangeOptions.from.title = filterObject.FromyearDropdown.options[filterObject.FromyearDropdown.options.length - 1].title;
        //filterObject.ToyearDropdown.selectedRangeOptions.to.title = filterObject.ToyearDropdown.options[filterObject.ToyearDropdown.options.length - 1].title;
        selectedfilterObj.sourceQuarterDropDown = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Quarter',
            options: selectedfilterObj.sourceQuarterDropDown.options && selectedfilterObj.sourceQuarterDropDown.options.length > 0 ? selectedfilterObj.sourceQuarterDropDown.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {},
            values: selectedfilterObj.sourceQuarterDropDown.values && selectedfilterObj.sourceQuarterDropDown.values.length > 0 ? selectedfilterObj.sourceQuarterDropDown.values : [],
            type: 'select'
        } as IYearDropdown;
        selectedfilterObj.QuarteryearDropdown = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Year',
            options: selectedfilterObj.QuarteryearDropdown.options && selectedfilterObj.QuarteryearDropdown.options.length > 0 ? selectedfilterObj.QuarteryearDropdown.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {},
            values: selectedfilterObj.QuarteryearDropdown.values && selectedfilterObj.QuarteryearDropdown.values.length > 0 ? selectedfilterObj.QuarteryearDropdown.values : [],
            type: 'select'
        } as IYearDropdown;
        selectedfilterObj.FromQuarterDropdown = {
            label: 'From',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'from',
            options: selectedfilterObj.FromQuarterDropdown.options && selectedfilterObj.FromQuarterDropdown.options.length > 0 ? selectedfilterObj.FromQuarterDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            attributes: {},
            type: 'select'
        } as IFromyearDropdown;
        selectedfilterObj.FromQuarteryearDropdown = {
            label: 'From',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'from',
            options: selectedfilterObj.FromQuarteryearDropdown.options && selectedfilterObj.FromQuarteryearDropdown.options.length > 0 ? selectedfilterObj.FromQuarteryearDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            type: 'select',
            attributes: {},
        } as IFromyearDropdown;
        selectedfilterObj.ToQuarterDropdown = {
            label: 'To',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'to',
            options: selectedfilterObj.ToQuarterDropdown.options && selectedfilterObj.ToQuarterDropdown.options.length > 0 ? selectedfilterObj.ToQuarterDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            type: 'select',
            attributes: {},
        };
        selectedfilterObj.ToQuarteryearDropdown = {
            label: 'To',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'to',
            options: selectedfilterObj.ToQuarteryearDropdown.options && selectedfilterObj.ToQuarteryearDropdown.options.length > 0 ? selectedfilterObj.ToQuarteryearDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            type: 'select',
            attributes: {},
        };
        // each(selectedfilterObj.sourceYear, (_value: any, _index: any) => {
        //     _value.IsCheckModel.IsCheck = false;
        // });
        selectedfilterObj.appliedYearFilter = [];
        selectedfilterObj.showLabel = false;
        //selectedfilterObj.SelectedYear = 'Select Year';
        //selectedfilterObj.showSelectYearPopup = false;
        // this.showLabel = false;
        // this.SelectedYear = 'Select Year';
        // this.appliedYearFilter = [];
    }


    private clearQuarterFilterByCondition(selectedfilterObj: any) {
        selectedfilterObj.FilterConditionOperator = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.Is,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.yearDropdown.selectedOption.title = filterObject.yearDropdown.options[filterObject.yearDropdown.options.length - 1].title;
        //filterObject.FromyearDropdown.selectedRangeOptions.from.title = filterObject.FromyearDropdown.options[filterObject.FromyearDropdown.options.length - 1].title;
        //filterObject.ToyearDropdown.selectedRangeOptions.to.title = filterObject.ToyearDropdown.options[filterObject.ToyearDropdown.options.length - 1].title;
        selectedfilterObj.sourceQuarterDropDown = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.sourceQuarterDropDown.options && selectedfilterObj.sourceQuarterDropDown.options.length > 0 ? selectedfilterObj.sourceQuarterDropDown.options : [],
            selectedOption: {
                title: '',
            },
            values: selectedfilterObj.sourceQuarterDropDown.values && selectedfilterObj.sourceQuarterDropDown.values.length > 0 ? selectedfilterObj.sourceQuarterDropDown.values : [],
            type: 'select'
        } as IYearDropdown;
        selectedfilterObj.FromyearDropdown = {
            label: 'From',
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.FromyearDropdown.options && selectedfilterObj.FromyearDropdown.options.length > 0 ? selectedfilterObj.FromyearDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            type: 'select'
        } as IFromyearDropdown;
        selectedfilterObj.ToyearDropdown = {
            label: 'To',
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.ToyearDropdown.options && selectedfilterObj.ToyearDropdown.options.length > 0 ? selectedfilterObj.ToyearDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            type: 'select'
        };
        each(selectedfilterObj.sourceQuarterYear, (_value: any, _index: any) => {
            _value.IsCheckModel.IsCheck = false;
        });
        selectedfilterObj.appliedYearFilter = [];
        selectedfilterObj.showLabel = false;
        selectedfilterObj.SelectedYear = 'Select Quarter';
        selectedfilterObj.showSelectYearPopup = false;
    }


    private clearQuarterFilterByDynamicCondition(selectedfilterObj) {
        selectedfilterObj.QuarterYearModel.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisQuarter,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        selectedfilterObj.FilterRadioOperator.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisQuarter,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.BeginningOfTheYear.selectedOption.title = filterObject.BeginningOfTheYear.options[filterObject.BeginningOfTheYear.options.length - 1].title;
        selectedfilterObj.BeginningOfTheQuarterYear = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.BeginningOfTheQuarterYear.options && selectedfilterObj.BeginningOfTheQuarterYear.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarterYear.options : [],
            selectedOption: {
                title: '',
            }
        } as IBeginningOfTheYear;

        selectedfilterObj.BeginningOfTheQuarter = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.BeginningOfTheQuarter.options && selectedfilterObj.BeginningOfTheQuarter.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarter.options : [],
            selectedOption: {
                title: '',
            }
        } as IBeginningOfTheYear;
        selectedfilterObj.RollingQuarterYearsModel = {
            rollingQuarterYearValue: '',
        } as IRollingQuarterYearsModel;
        selectedfilterObj.NextQuarterYearsModel = {
            nextQuarterYearValue: '',
        } as INextQuarterYearsModel;
        selectedfilterObj.PreviousQuarterYearsModel = {
            previousQuarterYearValue: '',
        } as IPreviousQuarterYearsModel
    }

    private clearMonthYearFilterByDynamicCondition(selectedfilterObj) {
        selectedfilterObj.QuarterYearModel.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisMonth,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        selectedfilterObj.FilterRadioOperator.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisMonth,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.BeginningOfTheYear.selectedOption.title = filterObject.BeginningOfTheYear.options[filterObject.BeginningOfTheYear.options.length - 1].title;
        selectedfilterObj.BeginningOfTheQuarterYear = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Year',
            options: selectedfilterObj.BeginningOfTheQuarterYear.options && selectedfilterObj.BeginningOfTheQuarterYear.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarterYear.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {}
        } as IBeginningOfTheYear;

        selectedfilterObj.BeginningOfTheQuarter = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Month',
            options: selectedfilterObj.BeginningOfTheQuarter.options && selectedfilterObj.BeginningOfTheQuarter.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarter.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {},
        } as IBeginningOfTheYear;
        selectedfilterObj.RollingQuarterYearsModel = {
            rollingQuarterYearValue: '',
        } as IRollingQuarterYearsModel;
        selectedfilterObj.NextQuarterYearsModel = {
            nextQuarterYearValue: '',
        } as INextQuarterYearsModel;
        selectedfilterObj.PreviousQuarterYearsModel = {
            previousQuarterYearValue: '',
        } as IPreviousQuarterYearsModel
    }


    private clearMonthYearFilterByCondition(selectedfilterObj: any) {
        selectedfilterObj.FilterConditionOperator = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.Is,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        selectedfilterObj.sourceQuarterDropDown = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Month',
            options: selectedfilterObj.sourceQuarterDropDown.options && selectedfilterObj.sourceQuarterDropDown.options.length > 0 ? selectedfilterObj.sourceQuarterDropDown.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {},
            values: selectedfilterObj.sourceQuarterDropDown.values && selectedfilterObj.sourceQuarterDropDown.values.length > 0 ? selectedfilterObj.sourceQuarterDropDown.values : [],
            type: 'select'
        } as IYearDropdown;
        selectedfilterObj.QuarteryearDropdown = {
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'selectedOption',
            label: 'Select Year',
            options: selectedfilterObj.QuarteryearDropdown.options && selectedfilterObj.QuarteryearDropdown.options.length > 0 ? selectedfilterObj.QuarteryearDropdown.options : [],
            selectedOption: {
                title: '',
            },
            attributes: {},
            values: selectedfilterObj.QuarteryearDropdown.values && selectedfilterObj.QuarteryearDropdown.values.length > 0 ? selectedfilterObj.QuarteryearDropdown.values : [],
            type: 'select'
        } as IYearDropdown;
        selectedfilterObj.FromQuarterDropdown = {
            label: 'From',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'from',
            options: selectedfilterObj.FromQuarterDropdown.options && selectedfilterObj.FromQuarterDropdown.options.length > 0 ? selectedfilterObj.FromQuarterDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            attributes: {},
            type: 'select'
        } as IFromyearDropdown;
        selectedfilterObj.FromQuarteryearDropdown = {
            label: 'From',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'from',
            options: selectedfilterObj.FromQuarteryearDropdown.options && selectedfilterObj.FromQuarteryearDropdown.options.length > 0 ? selectedfilterObj.FromQuarteryearDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            type: 'select',
            attributes: {},
        } as IFromyearDropdown;
        selectedfilterObj.ToQuarterDropdown = {
            label: 'To',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'to',
            options: selectedfilterObj.ToQuarterDropdown.options && selectedfilterObj.ToQuarterDropdown.options.length > 0 ? selectedfilterObj.ToQuarterDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            type: 'select',
            attributes: {},
        };
        selectedfilterObj.ToQuarteryearDropdown = {
            label: 'To',
            dataKey: 'title',
            displayKey: 'title',
            fieldKey: 'to',
            options: selectedfilterObj.ToQuarteryearDropdown.options && selectedfilterObj.ToQuarteryearDropdown.options.length > 0 ? selectedfilterObj.ToQuarteryearDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            type: 'select',
            attributes: {},
        };
        selectedfilterObj.appliedYearFilter = [];
        selectedfilterObj.showLabel = false;
    }


    public createFilterTabChip(appliedSelectedFilter: any, _value: any) {
        switch (appliedSelectedFilter.FilterType) {
            case DashboardConstants.FilterType.MultiSelect:
                if (appliedSelectedFilter.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.selectedFilterList = _value.selectedFilterList;
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                }
                else if (appliedSelectedFilter.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterValueSet = true;
                }
                break;
            case DashboardConstants.FilterType.Date:
                if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterCdnSet = true;
                    appliedSelectedFilter.FilterRadioOperator = _value.FilterRadioOperator;
                    appliedSelectedFilter.FilterRadioOperator.field.title =
                        filter(
                            this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => {
                                return filterConfig.FilterConditionObjectId == _value.FilterRadioOperator.field.FilterConditionObjectId
                            }
                        )[0].Name;

                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    if (_value.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.Rolling_Days) {
                        appliedSelectedFilter.RollingDateModel = {
                            rollingDateValue: _value.FilterConditionValue
                        } as IRollingDateModel;
                    }
                    else if (_value.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.Next_Days) {
                        appliedSelectedFilter.NextDateModel = {
                            nextDateValue: _value.FilterConditionValue
                        } as INextDateModel
                    }
                    else if (_value.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.From_DateTillToday) {
                        appliedSelectedFilter.DateRadioModel = {
                            DateRadioValue: new Date(_value.FilterConditionValue as string),
                        }
                    }
                }
                else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.FilterRadioOperator = _value.FilterRadioOperator;
                    appliedSelectedFilter.filterValueSet = true;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionRangeValue.from = _value.FilterConditionRangeValue.from
                    appliedSelectedFilter.FilterConditionRangeValue.to = _value.FilterConditionRangeValue.to;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    if (_value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
                        appliedSelectedFilter.FromDateModel = {
                            FromDateValue: new Date(_value.FilterConditionRangeValue.from),
                        }
                        appliedSelectedFilter.ToDateModel = {
                            ToDateValue: new Date(_value.FilterConditionRangeValue.to),
                        }
                    }
                    else if (_value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot ||
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before ||
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
                        appliedSelectedFilter.DateModel = {
                            DateValue: new Date(_value.FilterConditionValue),
                        } as IDateModel;
                    }
                }
                break;
            case DashboardConstants.FilterType.Year:
                if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterCdnSet = true;
                    appliedSelectedFilter.YearModel = _value.YearModel;
                    appliedSelectedFilter.YearModel.field.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.YearModel.field.FilterConditionObjectId })[0].Name;
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    if (_value.YearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Years) {
                        appliedSelectedFilter.RollingYearsModel = {
                            rollingYearValue: _value.FilterConditionValue,
                        } as IRollingYearsModel;
                    }
                    else if (_value.YearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Years) {
                        appliedSelectedFilter.NextYearsModel = {
                            nextYearValue: _value.FilterConditionValue,
                        } as INextYearsModel
                    }
                    else if (_value.YearModel.field.op === DashboardConstants.ReportObjectOperators.From_YearTillToday) {
                        appliedSelectedFilter.BeginningOfTheYear = {
                            dataKey: 'op',
                            displayKey: 'title',
                            options: [],
                            selectedOption: { title: _value.FilterConditionValue },
                        } as IBeginningOfTheYear
                    }
                }
                else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.YearModel = _value.YearModel;
                    appliedSelectedFilter.filterValueSet = true;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionRangeValue.from = _value.FromyearDropdown.selectedRangeOptions.from.title;
                    appliedSelectedFilter.FilterConditionRangeValue.to = _value.ToyearDropdown.selectedRangeOptions.to.title;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    if (
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between ||
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
                        appliedSelectedFilter.FromyearDropdown = {
                            label: 'From',
                            dataKey: 'op',
                            displayKey: 'title',
                            options: [],
                            selectedRangeOptions: {
                                from: { title: _value.FromyearDropdown.selectedRangeOptions.from.title }
                            },
                        }
                        appliedSelectedFilter.ToyearDropdown = {
                            label: 'From',
                            dataKey: 'op',
                            displayKey: 'title',
                            options: [],
                            selectedRangeOptions: {
                                to: { title: _value.ToyearDropdown.selectedRangeOptions.to.title }
                            },
                        }
                    }
                    else if (
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before ||
                        _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
                        appliedSelectedFilter.yearDropdown = {
                            dataKey: 'op',
                            displayKey: 'title',
                            options: [],
                            selectedOption: { title: _value.FilterConditionValue },
                        } as IYearDropdown;
                    }
                }
                break;
            case DashboardConstants.FilterType.Quarter:
                if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterCdnSet = true;
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.QuarterYearModel.field.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.QuarterYearModel.field.FilterConditionObjectId })[0].Name;
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Quarters) {
                        appliedSelectedFilter.NextQuarterYearsModel = {
                            nextQuarterYearValue: _value.FilterConditionValue,
                        } as INextQuarterYearsModel
                    }
                }
                else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.filterValueSet = true;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter];
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                }
                break;
            case DashboardConstants.FilterType.QuarterYear:
                if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterCdnSet = true;
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.QuarterYearModel.field.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.QuarterYearModel.field.FilterConditionObjectId })[0].Name;
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Quarters) {
                        appliedSelectedFilter.RollingQuarterYearsModel = {
                            rollingQuarterYearValue: _value.FilterConditionValue,
                        } as IRollingQuarterYearsModel;
                    }
                    else if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Quarters) {
                        appliedSelectedFilter.NextQuarterYearsModel = {
                            nextQuarterYearValue: _value.FilterConditionValue,
                        } as INextQuarterYearsModel
                    }
                    else if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Previous_Quarter) {
                        appliedSelectedFilter.PreviousQuarterYearsModel = {
                            previousQuarterYearValue: _value.FilterConditionValue,
                        } as IPreviousQuarterYearsModel
                    }
                    else if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                        appliedSelectedFilter.BeginningOfTheQuarterYear = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear) as IBeginningOfTheYear
                        appliedSelectedFilter.BeginningOfTheQuarterYear.label = 'Select Year';
                        appliedSelectedFilter.BeginningOfTheQuarterYear.selectedOption = { title: _value.FilterConditionValue[0] };

                        appliedSelectedFilter.BeginningOfTheQuarter = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear) as IBeginningOfTheYear
                        appliedSelectedFilter.BeginningOfTheQuarter.label = 'Select Quarter';
                        appliedSelectedFilter.BeginningOfTheQuarter.selectedOption = { title: _value.FilterConditionValue[1] };
                    }
                }
                else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.filterValueSet = true;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionRangeValue.from = _value.FilterConditionRangeValue.from;
                    appliedSelectedFilter.FilterConditionRangeValue.to = _value.FilterConditionRangeValue.to;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    appliedSelectedFilter.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter];
                    switch (_value.FilterConditionOperator.op) {
                        case DashboardConstants.ReportObjectOperators.Between: {
                            appliedSelectedFilter.FromQuarteryearDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
                            appliedSelectedFilter.FromQuarteryearDropdown.selectedRangeOptions = {
                                from: { title: _value.FromQuarteryearDropdown.selectedRangeOptions.from.title },
                            }
                            appliedSelectedFilter.FromQuarteryearDropdown.label = 'From';
                            appliedSelectedFilter.FromQuarteryearDropdown.fieldKey = "from"

                            appliedSelectedFilter.FromQuarterDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.FromQuarterDropdown.label = 'From';
                            appliedSelectedFilter.FromQuarterDropdown.fieldKey = "from"
                            appliedSelectedFilter.FromQuarterDropdown.values = [];
                            appliedSelectedFilter.FromQuarterDropdown.selectedRangeOptions = {
                                from: { title: _value.FromQuarterDropdown.selectedRangeOptions.from.title },
                            }

                            appliedSelectedFilter.ToQuarteryearDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.ToQuarteryearDropdown.label = 'To';
                            appliedSelectedFilter.ToQuarteryearDropdown.fieldKey = "to"
                            appliedSelectedFilter.ToQuarteryearDropdown.selectedRangeOptions = {
                                to: { title: _value.ToQuarteryearDropdown.selectedRangeOptions.to.title },
                            };

                            appliedSelectedFilter.ToQuarterDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
                            appliedSelectedFilter.ToQuarterDropdown.label = 'To';
                            appliedSelectedFilter.ToQuarterDropdown.fieldKey = "to"
                            appliedSelectedFilter.ToQuarterDropdown.values = [];
                            appliedSelectedFilter.ToQuarterDropdown.selectedRangeOptions = {
                                to: { title: _value.ToQuarterDropdown.selectedRangeOptions.to.title },
                            };

                            break;
                        }
                        case DashboardConstants.ReportObjectOperators.Is:
                        case DashboardConstants.ReportObjectOperators.IsNot:
                        case DashboardConstants.ReportObjectOperators.After:
                        case DashboardConstants.ReportObjectOperators.Before: {
                            appliedSelectedFilter.QuarteryearDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.QuarteryearDropdown.label = 'Select Year';
                            appliedSelectedFilter.QuarteryearDropdown.selectedOption = { title: _value.QuarteryearDropdown.selectedOption.title };

                            appliedSelectedFilter.sourceQuarterDropDown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.sourceQuarterDropDown.label = 'Select Quarter';
                            appliedSelectedFilter.sourceQuarterDropDown.selectedOption = {
                                title: _value.sourceQuarterDropDown.selectedOption.title
                            };
                            appliedSelectedFilter.sourceQuarterDropDown.values = [];

                            break;
                        }
                        default:
                            break;

                    }
                }
                break;
            case DashboardConstants.FilterType.MonthYear:
                if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterCdnSet = true;
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.QuarterYearModel.field.title = filter(this._dashboardCommService.FilterConditionMetadata,
                        (filterConfig, index) => {
                            return filterConfig.FilterConditionObjectId == _value.QuarterYearModel.field.FilterConditionObjectId
                        })[0].Name;
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Months) {
                        appliedSelectedFilter.RollingQuarterYearsModel = {
                            rollingQuarterYearValue: _value.FilterConditionValue,
                        } as IRollingQuarterYearsModel;
                    }
                    else if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Months) {
                        appliedSelectedFilter.NextQuarterYearsModel = {
                            nextQuarterYearValue: _value.FilterConditionValue,
                        } as INextQuarterYearsModel
                    }
                    else if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Previous_Month) {
                        appliedSelectedFilter.PreviousQuarterYearsModel = {
                            previousQuarterYearValue: _value.FilterConditionValue,
                        } as IPreviousQuarterYearsModel
                    }
                    else if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
                        appliedSelectedFilter.BeginningOfTheQuarterYear = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear) as IBeginningOfTheYear
                        appliedSelectedFilter.BeginningOfTheQuarterYear.label = 'Select Year';
                        appliedSelectedFilter.BeginningOfTheQuarterYear.selectedOption = { title: _value.FilterConditionValue[1] };

                        appliedSelectedFilter.BeginningOfTheQuarter = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear) as IBeginningOfTheYear
                        appliedSelectedFilter.BeginningOfTheQuarter.label = 'Select Month';
                        appliedSelectedFilter.BeginningOfTheQuarter.selectedOption = { title: _value.FilterConditionValue[0] };
                    }
                }
                else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.filterValueSet = true;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata,
                        (filterConfig, index) => {
                            return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId
                        })[0].Name
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionRangeValue.from = _value.FilterConditionRangeValue.from;
                    appliedSelectedFilter.FilterConditionRangeValue.to = _value.FilterConditionRangeValue.to;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                    appliedSelectedFilter.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth];
                    switch (_value.FilterConditionOperator.op) {
                        case DashboardConstants.ReportObjectOperators.Between: {
                            appliedSelectedFilter.FromQuarteryearDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
                            appliedSelectedFilter.FromQuarteryearDropdown.selectedRangeOptions = {
                                from: { title: _value.FromQuarteryearDropdown.selectedRangeOptions.from.title },
                            }
                            appliedSelectedFilter.FromQuarteryearDropdown.label = 'From';
                            appliedSelectedFilter.FromQuarteryearDropdown.fieldKey = "from"

                            appliedSelectedFilter.FromQuarterDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.FromQuarterDropdown.label = 'From';
                            appliedSelectedFilter.FromQuarterDropdown.fieldKey = "from"
                            appliedSelectedFilter.FromQuarterDropdown.values = [];
                            appliedSelectedFilter.FromQuarterDropdown.selectedRangeOptions = {
                                from: { title: _value.FromQuarterDropdown.selectedRangeOptions.from.title },
                            }

                            appliedSelectedFilter.ToQuarteryearDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.ToQuarteryearDropdown.label = 'To';
                            appliedSelectedFilter.ToQuarteryearDropdown.fieldKey = "to"
                            appliedSelectedFilter.ToQuarteryearDropdown.selectedRangeOptions = {
                                to: { title: _value.ToQuarteryearDropdown.selectedRangeOptions.to.title },
                            };

                            appliedSelectedFilter.ToQuarterDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
                            appliedSelectedFilter.ToQuarterDropdown.label = 'To';
                            appliedSelectedFilter.ToQuarterDropdown.fieldKey = "to"
                            appliedSelectedFilter.ToQuarterDropdown.values = [];
                            appliedSelectedFilter.ToQuarterDropdown.selectedRangeOptions = {
                                to: { title: _value.ToQuarterDropdown.selectedRangeOptions.to.title },
                            };

                            break;
                        }
                        case DashboardConstants.ReportObjectOperators.Is:
                        case DashboardConstants.ReportObjectOperators.IsNot:
                        case DashboardConstants.ReportObjectOperators.After:
                        case DashboardConstants.ReportObjectOperators.Before: {
                            appliedSelectedFilter.QuarteryearDropdown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.QuarteryearDropdown.label = 'Select Year';
                            appliedSelectedFilter.QuarteryearDropdown.selectedOption = { title: _value.QuarteryearDropdown.selectedOption.title };

                            appliedSelectedFilter.sourceQuarterDropDown = this._commUtils.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
                            appliedSelectedFilter.sourceQuarterDropDown.label = 'Select Month';
                            appliedSelectedFilter.sourceQuarterDropDown.selectedOption = {
                                title: _value.sourceQuarterDropDown.selectedOption.title
                            };
                            appliedSelectedFilter.sourceQuarterDropDown.values = [];

                            break;
                        }
                        default:
                            break;

                    }
                }
                break;
            case DashboardConstants.FilterType.Month:
                if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.filterCdnSet = true;
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.QuarterYearModel.field.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.QuarterYearModel.field.FilterConditionObjectId })[0].Name;
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
                    if (_value.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Months) {
                        appliedSelectedFilter.NextQuarterYearsModel = {
                            nextQuarterYearValue: _value.FilterConditionValue,
                        } as INextQuarterYearsModel
                    }
                }
                else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
                    appliedSelectedFilter.filterValueSet = true;
                    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
                    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
                    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
                    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
                    appliedSelectedFilter.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter];
                    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
                }
                break;
            default:
                break;
        }
    }
    private clearMonthFilterByCondition(selectedfilterObj: any) {
        selectedfilterObj.FilterConditionOperator = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.Is,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.yearDropdown.selectedOption.title = filterObject.yearDropdown.options[filterObject.yearDropdown.options.length - 1].title;
        //filterObject.FromyearDropdown.selectedRangeOptions.from.title = filterObject.FromyearDropdown.options[filterObject.FromyearDropdown.options.length - 1].title;
        //filterObject.ToyearDropdown.selectedRangeOptions.to.title = filterObject.ToyearDropdown.options[filterObject.ToyearDropdown.options.length - 1].title;
        selectedfilterObj.sourceQuarterDropDown = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.sourceQuarterDropDown.options && selectedfilterObj.sourceQuarterDropDown.options.length > 0 ? selectedfilterObj.sourceQuarterDropDown.options : [],
            selectedOption: {
                title: '',
            },
            values: selectedfilterObj.sourceQuarterDropDown.values && selectedfilterObj.sourceQuarterDropDown.values.length > 0 ? selectedfilterObj.sourceQuarterDropDown.values : [],
            type: 'select'
        } as IYearDropdown;
        selectedfilterObj.FromyearDropdown = {
            label: 'From',
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.FromyearDropdown.options && selectedfilterObj.FromyearDropdown.options.length > 0 ? selectedfilterObj.FromyearDropdown.options : [],
            selectedRangeOptions: {
                from: {
                    title: '',
                }
            },
            type: 'select'
        } as IFromyearDropdown;
        selectedfilterObj.ToyearDropdown = {
            label: 'To',
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.ToyearDropdown.options && selectedfilterObj.ToyearDropdown.options.length > 0 ? selectedfilterObj.ToyearDropdown.options : [],
            selectedRangeOptions: {
                to: {
                    title: '',
                }
            },
            type: 'select'
        };
        each(selectedfilterObj.sourceQuarterYear, (_value: any, _index: any) => {
            _value.IsCheckModel.IsCheck = false;
        });
        selectedfilterObj.appliedYearFilter = [];
        selectedfilterObj.showLabel = false;
        selectedfilterObj.SelectedYear = 'Select Month';
        selectedfilterObj.showSelectYearPopup = false;
    }

    private clearMonthFilterByDynamicCondition(selectedfilterObj) {
        selectedfilterObj.QuarterYearModel.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisMonth,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        selectedfilterObj.FilterRadioOperator.field = Object.assign({}, {
            op: DashboardConstants.ReportObjectOperators.ThisMonth,
            title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth],
            FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth &&
                    filterCdn.FilterTypeObjectId == selectedfilterObj.FilterTypeObjectId
            })[0].FilterConditionObjectId
        });
        //filterObject.BeginningOfTheYear.selectedOption.title = filterObject.BeginningOfTheYear.options[filterObject.BeginningOfTheYear.options.length - 1].title;
        selectedfilterObj.BeginningOfTheQuarterYear = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.BeginningOfTheQuarterYear.options && selectedfilterObj.BeginningOfTheQuarterYear.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarterYear.options : [],
            selectedOption: {
                title: '',
            }
        } as IBeginningOfTheYear;

        selectedfilterObj.BeginningOfTheQuarter = {
            dataKey: 'op',
            displayKey: 'title',
            options: selectedfilterObj.BeginningOfTheQuarter.options && selectedfilterObj.BeginningOfTheQuarter.options.length > 0 ? selectedfilterObj.BeginningOfTheQuarter.options : [],
            selectedOption: {
                title: '',
            }
        } as IBeginningOfTheYear;
        selectedfilterObj.RollingQuarterYearsModel = {
            rollingQuarterYearValue: '',
        } as IRollingQuarterYearsModel;
        selectedfilterObj.NextQuarterYearsModel = {
            nextQuarterYearValue: '',
        } as INextQuarterYearsModel;
        selectedfilterObj.PreviousQuarterYearsModel = {
            previousQuarterYearValue: '',
        } as IPreviousQuarterYearsModel
    }


    getTabInfoForMeasureFilter(obj) {
        const op = obj.FilterConditionOperator.op;
        let showTabInfo = this._commUtils.isNuneArray([
            obj.FilterConditionRangeValue.from,
            obj.FilterConditionRangeValue.to
        ])
        if (op == DashboardConstants.ReportObjectOperators.Between || op == DashboardConstants.ReportObjectOperators.NotBetween) {
            obj.FilterTabInfo = showTabInfo ? obj.FilterConditionOperator.title + " " + obj.FilterConditionRangeValue.from + " To " + obj.FilterConditionRangeValue.to : '';
        }
        else if (op === DashboardConstants.ReportObjectOperators.IsNull || op === DashboardConstants.ReportObjectOperators.IsNotNull) {
            obj.FilterTabInfo = obj.FilterConditionOperator.title;
        }
        else if (obj.FilterType === DashboardConstants.FilterType.Number && ([
            DashboardConstants.ReportObjectOperators.In, DashboardConstants.ReportObjectOperators.NotIn
        ].indexOf(op) != -1)) {
            obj.FilterTabInfo = obj.FilterConditionOperator.title + ' "' + obj.FilterConditionText.value + '"';
        }
        else {
            obj.FilterTabInfo = obj.FilterConditionOperator.title + ' "' + obj.FilterConditionValue + '"';
        }
    }
}
