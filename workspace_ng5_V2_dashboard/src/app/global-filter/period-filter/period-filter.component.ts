import { Component, OnInit, Input, ViewChild, ViewContainerRef, OnDestroy, ComponentRef, TemplateRef, EmbeddedViewRef, ComponentFactoryResolver, ChangeDetectionStrategy } from "@angular/core";
import { GlobalFilterService } from "@vsGlobalFilterService";
import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { IDAXReportFilter } from "@vsCommonInterface";
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { filter, each, map, findIndex } from 'lodash';
// import { LazyComponentConfiguration } from "../../../../modules-manifest";
import { DashboardCommService } from "@vsDashboardCommService";
import { LoaderService } from "@vsLoaderService";
import { SelectYearPopupComponent } from '../period-filter/select-year-popup/select-year-popup.component';
import { Observable } from "rxjs";
@Component({
    selector: 'period-filter',
    templateUrl: './period-filter.component.html',
    styleUrls: ['./period-filter.component.scss'],
    preserveWhitespaces: false,
    entryComponents: [SelectYearPopupComponent]
})

export class PeriodFilterComponent implements OnInit, OnDestroy {
    // static componentId = LazyComponentConfiguration.PeriodFilter.componentName;
    periodFilterObj: any;
    FilterByConfig: any;
    DateRadioConfig: any;
    DateConfig: any;
    filterByDateOpts: any;
    FromDateConfig: any;
    ToDateConfig: any;
    @Input() config;
    yearDropdown: any;
    FromyearDropdown: any;
    ToyearDropdown: any;
    filterByYearOpts: any;
    filterByQuarterYearOpts: any;
    today: any;
    YearRadioConfig: any;
    QuarterYearRadioConfig: any;
    RollingDateModel: any = { rollingDateValue: '' };
    NextDateModel: any = { nextDateValue: '' };
    periodDate: any;
    filterByModel = {
        field: {
            title: "",
            value: 1
        }
    };
    @ViewChild('selectYearPoup', { read: ViewContainerRef }) private selectYearPoupRef: ViewContainerRef;
    @ViewChild('periodFilterContainer', { read: ViewContainerRef }) periodFilterContainerRef: ViewContainerRef;
    @ViewChild('quarterYearFilterTemplate') quarterYearFilterTemplateRef: TemplateRef<any>;
    @ViewChild('quarterFilterTemplate') quarterFilterTemplateRef: TemplateRef<any>;
    @ViewChild('monthYearFilterTemplate') monthYearFilterTemplateRef: TemplateRef<any>;
    @ViewChild('monthFilterTemplate') monthFilterTemplateRef: TemplateRef<any>;
    @ViewChild('outletTemplate') outletTemplateRef: TemplateRef<any>;
    constants = DashboardConstants;
    constructor(
        private filterService: GlobalFilterService,
        private _commUtil: CommonUtilitiesService,
        private _dashboardCommService: DashboardCommService,
        private _loaderService: LoaderService,
        private _analyticsCommonDataService: AnalyticsCommonDataService,
        private _comFactResolver: ComponentFactoryResolver
    ) {
    }

    ngOnInit() {
        this.periodFilterObj = this.config;
        this.today = new Date();
        this.periodFilterConfig();
        this.configureFilterByCondition(this.periodFilterObj);
        this.configureDynamicCondition(this.periodFilterObj);
        switch (this.periodFilterObj.FilterType) {
            case DashboardConstants.FilterType.Year: {
                this.setDefaultYear(this.periodFilterObj);
                this.setFilterListInSelected();
                break;
            }
            case DashboardConstants.FilterType.QuarterYear: {
                this.periodFilterContainerRef.detach();
                this.periodFilterContainerRef.clear();
                this.periodFilterContainerRef.createEmbeddedView(this.quarterYearFilterTemplateRef, { $implicit: '' });
                this.setDefaultQuarterYear(this.periodFilterObj);
                this.setFilterListInSelected();
                break;
            }
            case DashboardConstants.FilterType.Quarter: {
                this.periodFilterContainerRef.detach();
                this.periodFilterContainerRef.clear();
                this.periodFilterContainerRef.createEmbeddedView(this.quarterFilterTemplateRef, { $implicit: '' });
                this.setDefaultQuarter(this.periodFilterObj);
                this.setFilterListInSelected();
                break;
            }
            case DashboardConstants.FilterType.MonthYear: {
                this.periodFilterContainerRef.detach();
                this.periodFilterContainerRef.clear();
                this.periodFilterContainerRef.createEmbeddedView(this.monthYearFilterTemplateRef, { $implicit: '' });
                this.setDefaultMonthYear(this.periodFilterObj);
                this.setFilterListInSelected();
            }
                break;
            case DashboardConstants.FilterType.Month: {
                this.periodFilterContainerRef.detach();
                this.periodFilterContainerRef.clear();
                this.periodFilterContainerRef.createEmbeddedView(this.monthFilterTemplateRef, { $implicit: '' });
                this.setDefaultMonth(this.periodFilterObj);
                this.setFilterListInSelected();
            }
                break;
            default:
                break;

        }
        if (!(this.periodFilterObj.appliedFilter) && !(this.periodFilterObj.filterCdnSet || this.periodFilterObj.filterValueSet)) {
            switch (this.periodFilterObj.FilterType) {
                case DashboardConstants.FilterType.Year: {
                    this.periodYearHandling(this.periodFilterObj);
                    break;
                }
                case DashboardConstants.FilterType.Date: {
                    this.setDefaultDate(this.periodFilterObj); // May need to write this in a separate if statement(as done for setDefaultYear()) if models are undefined
                    this.periodDateHandling(this.periodFilterObj);
                    break;
                }
                case DashboardConstants.FilterType.QuarterYear: {
                    this.periodQuarterYearHandling(this.periodFilterObj);
                    break;
                }
                case DashboardConstants.FilterType.Quarter: {
                    this.periodQuarterHandling(this.periodFilterObj);
                    break;
                }
                case DashboardConstants.FilterType.MonthYear: {
                    this.periodMonthYearHandling(this.periodFilterObj);
                }
                    break;
                case DashboardConstants.FilterType.Month: {
                    this.periodMonthHandling(this.periodFilterObj);
                }
                    break;
            }
        }
        let isFilterOpen;
        isFilterOpen = this.filterService.fadeOutDashboardGrid();
        isFilterOpen = !isFilterOpen;
        if (isFilterOpen == true) {
            let dashboardWrapper = document.getElementById('dashboard-container-id'),
                mainContainer = document.getElementById('main-container-id');
            dashboardWrapper.classList.add("global-filter-fixed");
            mainContainer.classList.add("overflow-hide");
        }

    }

    ngOnDestroy() {
        this.selectYearPoupRef.detach();
        this.selectYearPoupRef.clear();
        this.periodFilterContainerRef.detach();
        this.periodFilterContainerRef.clear();
    }

    periodFilterConfig() {
        this.FilterByConfig = {
            valueKey: "title",
            isMandatory: true,
            fieldKey: "field",
            layout: 'horizontal',
            collection: [
                { "value": "1", "title": "Filter by Dynamic Period" },
                { "value": "2", "title": "Filter by Condition" }
            ]
        }

        this.periodDate = {
            valueKey: "title",
            fieldKey: "field",
            layout: 'vertical',
            collection: [
                // { "op": "1", "title": "Yesterday" },
                // { "op": "2", "title": "Today" },
                // { "op": "3", "title": "Tomorrow" },
                // { "op": "4", "title": "Rolling Days" },
                // { "op": "5", "title": "Next Days" },
                // { "op": "6", "title": "From to Current Date" }
            ],
        }
        this.DateRadioConfig = {
            label: '',
            data: 'DateRadioModel',
            fieldKey: 'DateRadioValue',
            attributes: {
                disable: false
            }
        }
        this.DateConfig = {
            label: '',
            data: 'DateModel',
            fieldKey: 'DateValue',
            attributes: {
                disable: false
            }
        }
        this.filterByDateOpts = {
            label: '',
            dataKey: 'op',
            displayKey: 'title',
            fieldKey: 'FilterConditionOperator',
            options: [
                // { "title": "Is", "op": 3 },
                // { "title": "Is Not", "op": 4 },
                // { "title": "Before", "op": 1 },
                // { "title": "After", "op": 2 },
                // { "title": "Is Empty", "op": 9 },
                // { "title": "Is Not Empty", "op": 10 },
                // { "title": "Between", "op": 11 }
            ]
        };
        this.FromDateConfig = {
            label: '',
            data: 'FromDateModel',
            fieldKey: 'FromDateValue',
            attributes: {
                disable: false
            }
        };

        this.ToDateConfig = {
            label: '',
            data: 'ToDateModel',
            fieldKey: 'ToDateValue',
            attributes: {
                disable: false
            }
        };


        this.filterByYearOpts = {
            dataKey: 'op',
            label: 'Fliter By Condition',
            isMandatory: false,
            displayKey: 'title',
            fieldKey: 'FilterConditionOperator',
            cssClass: 'line-height-manager',
            type: 'select',
            options: []

            // { "title": "Is", "op": 3 },
            // { "title": "Is Not", "op": 4 },
            // { "title": "Before", "op": 1 },
            // { "title": "After", "op": 2 },
            // { "title": "Between", "op": 11 },
            // { "title": "Is Empty", "op": 9 },
            // { "title": "Is Not Empty", "op": 10 }

        }

        this.filterByQuarterYearOpts = {
            dataKey: 'op',
            label: 'Fliter By Condition',
            isMandatory: false,
            displayKey: 'title',
            fieldKey: 'FilterConditionOperator',
            cssClass: 'line-height-manager',
            type: 'select',
            options: []
        }

        this.YearRadioConfig = {
            valueKey: "title",
            fieldKey: "field",
            layout: 'vertical',
            collection: [
                // { "op": "1", "title": "Previous Year" },
                // { "op": "2", "title": "This Year" },
                // { "op": "3", "title": "Next Year" },
                // { "op": "4", "title": "Rolling Years" },
                // { "op": "5", "title": "Next Years" },
                // { "op": "6", "title": "Beginning of the Year to Current Date" }
            ],
        }

        this.QuarterYearRadioConfig = {
            valueKey: "title",
            fieldKey: "field",
            layout: 'vertical',
            collection: [],
        }
    }
    onChangeFilterBy(FilterObj, Type) {
        if (FilterObj.FilterType === DashboardConstants.FilterType.Date) {
            if (FilterObj && FilterObj.filterCdnSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                if (FilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Rolling_Days) {
                    FilterObj.FilterConditionValue = FilterObj.RollingDateModel.rollingDateValue;
                }
                else if (FilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Next_Days) {
                    FilterObj.FilterConditionValue = FilterObj.NextDateModel.nextDateValue;
                }
                else if (FilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.From_DateTillToday) {
                    FilterObj.FilterConditionValue = this._commUtil.getDateInFormat(FilterObj.DateRadioModel.DateRadioValue);
                }
            }
            else if (FilterObj && FilterObj.filterValueSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Is || FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.IsNot || FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Before || FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.After) {
                    if (FilterObj.DateModel.DateValue != undefined && FilterObj.DateModel.DateValue != null && FilterObj.DateModel.DateValue != "") {
                        FilterObj.FilterConditionValue = this._commUtil.getDateInFormat(FilterObj.DateModel.DateValue);
                    }
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between || FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween) {
                    if (FilterObj.FromDateModel.FromDateValue != undefined && FilterObj.FromDateModel.FromDateValue != null && FilterObj.FromDateModel.FromDateValue != "" && FilterObj.ToDateModel.ToDateValue != undefined && FilterObj.ToDateModel.ToDateValue != null && FilterObj.ToDateModel.ToDateValue != "") {
                        FilterObj.FilterConditionRangeValue.from = this._commUtil.getDateInFormat(FilterObj.FromDateModel.FromDateValue);
                        FilterObj.FilterConditionRangeValue.to = this._commUtil.getDateInFormat(FilterObj.ToDateModel.ToDateValue);
                    }
                }
            }
        }
        else if (FilterObj.FilterType === DashboardConstants.FilterType.Year) {
            if (FilterObj && FilterObj.filterCdnSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                if (FilterObj.YearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Years) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.RollingYearsModel.rollingYearValue);
                }
                else if (FilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Years) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.NextYearsModel.nextYearValue);
                }
                else if (FilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.From_YearTillToday) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.BeginningOfTheYear.selectedOption.title);
                }
            }
            else if (FilterObj && FilterObj.filterValueSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Before ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.After) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.yearDropdown.selectedOption.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween) {
                    FilterObj.FilterConditionRangeValue.from = Object.assign(FilterObj.FromyearDropdown.selectedRangeOptions.from.title);
                    FilterObj.FilterConditionRangeValue.to = Object.assign(FilterObj.ToyearDropdown.selectedRangeOptions.to.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Is ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.IsNot) {
                    FilterObj.FilterConditionValue = Object.assign(filter(FilterObj.sourceYear, (value) => { return value.IsCheckModel.IsCheck }));
                }
            }
        }
        else if (FilterObj.FilterType === DashboardConstants.FilterType.QuarterYear) {
            if (FilterObj && FilterObj.filterCdnSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                if (FilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Quarters) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.RollingQuarterYearsModel.rollingQuarterYearValue);
                }
                else if (FilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Quarters) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.NextQuarterYearsModel.nextQuarterYearValue);
                }
                else if (FilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                    let formatedVal = this.formattedFilterValueForQuarterYear(
                        FilterObj.BeginningOfTheQuarterYear.selectedOption.title, FilterObj.BeginningOfTheQuarter.selectedOption.title
                    );
                    FilterObj.FilterConditionValue = [...formatedVal];
                }
                else if (FilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Previous_Quarter) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.PreviousQuarterYearsModel.previousQuarterYearValue);
                }
            }
            else if (FilterObj && FilterObj.filterValueSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Before ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.After) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.yearDropdown.selectedOption.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween) {
                    //Update here the case for quater year.
                    FilterObj.FilterConditionRangeValue.from = Object.assign(FilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title);
                    FilterObj.FilterConditionRangeValue.to = Object.assign(FilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Is ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.IsNot) {
                    FilterObj.FilterConditionValue = Object.assign(filter(FilterObj.sourceQuarterYear, (value) => { return value.IsCheckModel.IsCheck }));
                }
            }
        }
        //Code here for QUarter.
        else if (FilterObj.FilterType === DashboardConstants.FilterType.Quarter) {
            if (FilterObj && FilterObj.filterCdnSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                if (FilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Quarters) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.RollingQuarterYearsModel.rollingQuarterYearValue);
                }
                else if (FilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Quarters) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.NextQuarterYearsModel.nextQuarterYearValue);
                }
                else if (FilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                    let formatedVal = this.formattedFilterValueForQuarterYear(
                        FilterObj.BeginningOfTheQuarterYear.selectedOption.title, FilterObj.BeginningOfTheQuarter.selectedOption.title
                    );
                    FilterObj.FilterConditionValue = [...formatedVal];
                }
                else if (FilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Previous_Quarter) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.PreviousQuarterYearsModel.previousQuarterYearValue);
                }
            }
            else if (FilterObj && FilterObj.filterValueSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Before ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.After) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.yearDropdown.selectedOption.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween) {
                    //Update here the case for quater year.
                    FilterObj.FilterConditionRangeValue.from = Object.assign(FilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title);
                    FilterObj.FilterConditionRangeValue.to = Object.assign(FilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Is ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.IsNot) {
                    FilterObj.FilterConditionValue = Object.assign(filter(FilterObj.sourceQuarterYear, (value) => { return value.IsCheckModel.IsCheck }));
                }
            }
        }
        else if (FilterObj.FilterType === DashboardConstants.FilterType.Month) {
            if (FilterObj && FilterObj.filterCdnSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                if (FilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Months) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.RollingQuarterYearsModel.rollingQuarterYearValue);
                }
                else if (FilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Months) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.NextQuarterYearsModel.nextQuarterYearValue);
                }
                else if (FilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
                    let formatedVal = this.formattedFilterValueForQuarterYear(
                        FilterObj.BeginningOfTheQuarterYear.selectedOption.title, FilterObj.BeginningOfTheQuarter.selectedOption.title
                    );
                    FilterObj.FilterConditionValue = [...formatedVal];
                }
            }
            else if (FilterObj && FilterObj.filterValueSet && FilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Before ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.After) {
                    FilterObj.FilterConditionValue = Object.assign(FilterObj.yearDropdown.selectedOption.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Between ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.NotBetween) {
                    //Update here the case for quater year.
                    FilterObj.FilterConditionRangeValue.from = Object.assign(FilterObj.FromQuarteryearDropdown.selectedRangeOptions.from.title);
                    FilterObj.FilterConditionRangeValue.to = Object.assign(FilterObj.ToQuarteryearDropdown.selectedRangeOptions.to.title);
                }
                else if (FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.Is ||
                    FilterObj.FilterConditionOperator.op == DashboardConstants.ReportObjectOperators.IsNot) {
                    FilterObj.FilterConditionValue = Object.assign(filter(FilterObj.sourceQuarterYear, (value) => { return value.IsCheckModel.IsCheck }));
                }
            }
        }
        this.filterService.getFilterTabInfo(FilterObj);
    }


    onChangeFilterByOp(FilterObj, op) {
        this.filterService.onChangeFilterByOp(FilterObj, op);
    }

    dateRadioChange(selectedFilterObj) {

        selectedFilterObj.filterCdnSet = true;
        // created different model for rolling years and next year 
        // and updated value of 'FilterConditionValue' accordingly
        switch (selectedFilterObj.FilterType) {
            case DashboardConstants.FilterType.Date: {
                if (selectedFilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Rolling_Days) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.RollingDateModel.rollingDateValue
                    if (selectedFilterObj.RollingDateModel.rollingDateValue == null || selectedFilterObj.RollingDateModel.rollingDateValue == undefined || selectedFilterObj.RollingDateModel.rollingDateValue == "") {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Next_Days) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.NextDateModel.nextDateValue
                    if (selectedFilterObj.NextDateModel.nextDateValue == null || selectedFilterObj.NextDateModel.nextDateValue == undefined || selectedFilterObj.NextDateModel.nextDateValue == "") {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Yesterday) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Tomorrow) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.Today) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.FilterRadioOperator.field.op == DashboardConstants.ReportObjectOperators.From_DateTillToday) {
                    if (selectedFilterObj.DateRadioModel.DateRadioValue == "") {
                        selectedFilterObj.DateRadioModel.DateRadioValue = new Date();
                    }
                    selectedFilterObj.FilterConditionValue =
                        this._commUtil.getDateInFormat(selectedFilterObj.DateRadioModel.DateRadioValue);
                }
                else if (selectedFilterObj)
                    break;
                break;
            }
            case DashboardConstants.FilterType.Year: {
                selectedFilterObj.FilterRadioOperator.field.op = selectedFilterObj.YearModel.field.op;
                selectedFilterObj.FilterRadioOperator.field.title = selectedFilterObj.YearModel.field.title;
                selectedFilterObj.FilterRadioOperator.field.FilterConditionObjectId = selectedFilterObj.YearModel.field.FilterConditionObjectId;
                if (selectedFilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.Rolling_Years) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.RollingYearsModel.rollingYearValue;
                    if (selectedFilterObj.RollingYearsModel.rollingYearValue == null || selectedFilterObj.RollingYearsModel.rollingYearValue == undefined || selectedFilterObj.RollingYearsModel.rollingYearValue == "") {
                        selectedFilterObj.filterCdnSet = false;
                    }

                }
                else if (selectedFilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Years) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.NextYearsModel.nextYearValue;
                    if (selectedFilterObj.NextYearsModel.nextYearValue == null || selectedFilterObj.NextYearsModel.nextYearValue == undefined || selectedFilterObj.NextYearsModel.nextYearValue == "") {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.ThisYear) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.PreviousYear) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.NextYear) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.YearModel.field.op == DashboardConstants.ReportObjectOperators.From_YearTillToday) {
                    if (selectedFilterObj.BeginningOfTheYear.selectedOption.title === "") {
                        selectedFilterObj.BeginningOfTheYear.selectedOption.title =
                            selectedFilterObj.BeginningOfTheYear.options[selectedFilterObj.BeginningOfTheYear.options.length - 1].title;
                    }
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.BeginningOfTheYear.selectedOption.title;
                }
                else if (selectedFilterObj.YearModel.field)
                    break;
                break;
            }
            case DashboardConstants.FilterType.QuarterYear: {
                selectedFilterObj.FilterRadioOperator.field.op = selectedFilterObj.QuarterYearModel.field.op;
                selectedFilterObj.FilterRadioOperator.field.title = selectedFilterObj.QuarterYearModel.field.title;
                selectedFilterObj.FilterRadioOperator.field.FilterConditionObjectId = selectedFilterObj.QuarterYearModel.field.FilterConditionObjectId;
                if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Rolling_Quarters) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.RollingQuarterYearsModel.rollingQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.RollingQuarterYearsModel.rollingQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }

                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Quarters) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Previous_Quarter) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.PreviousQuarterYearsModel.previousQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.PreviousQuarterYearsModel.previousQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.ThisQuarter) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.PreviousQuarter) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.NextQuarter) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
                    if (selectedFilterObj.BeginningOfTheQuarterYear.selectedOption.title === "") {
                        selectedFilterObj.BeginningOfTheQuarterYear.selectedOption.title =
                            selectedFilterObj.BeginningOfTheQuarterYear.options[selectedFilterObj.BeginningOfTheQuarterYear.options.length - 1].title;
                    }
                    if (selectedFilterObj.BeginningOfTheQuarter.selectedOption.title === "") {
                        selectedFilterObj.BeginningOfTheQuarter.selectedOption.title =
                            selectedFilterObj.BeginningOfTheQuarter.options[selectedFilterObj.BeginningOfTheQuarter.options.length - 1].title;
                    }
                    let formatedVal = this.formattedFilterValueForQuarterYear(
                        selectedFilterObj.BeginningOfTheQuarterYear.selectedOption.title, selectedFilterObj.BeginningOfTheQuarter.selectedOption.title
                    );
                    selectedFilterObj.FilterConditionValue = [...formatedVal];
                    selectedFilterObj.filterCdnSet = true;
                }
                break;
            }
            case DashboardConstants.FilterType.Quarter: {
                selectedFilterObj.FilterRadioOperator.field.op = selectedFilterObj.QuarterYearModel.field.op;
                selectedFilterObj.FilterRadioOperator.field.title = selectedFilterObj.QuarterYearModel.field.title;
                selectedFilterObj.FilterRadioOperator.field.FilterConditionObjectId = selectedFilterObj.QuarterYearModel.field.FilterConditionObjectId;
                if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Quarters) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.ThisQuarter) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.PreviousQuarter) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.NextQuarter) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field)
                    break;
                break;
            }
            case DashboardConstants.FilterType.MonthYear: {
                selectedFilterObj.FilterRadioOperator.field.op = selectedFilterObj.QuarterYearModel.field.op;
                selectedFilterObj.FilterRadioOperator.field.title = selectedFilterObj.QuarterYearModel.field.title;
                selectedFilterObj.FilterRadioOperator.field.FilterConditionObjectId = selectedFilterObj.QuarterYearModel.field.FilterConditionObjectId;
                if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Rolling_Months) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.RollingQuarterYearsModel.rollingQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.RollingQuarterYearsModel.rollingQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }

                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Months) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.QuarterYearModel.field.op === DashboardConstants.ReportObjectOperators.Previous_Month) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.PreviousQuarterYearsModel.previousQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.PreviousQuarterYearsModel.previousQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.ThisMonth) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.PreviousMonth) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.NextMonth) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
                    if (selectedFilterObj.BeginningOfTheQuarterYear.selectedOption.title === "") {
                        selectedFilterObj.BeginningOfTheQuarterYear.selectedOption.title =
                            selectedFilterObj.BeginningOfTheQuarterYear.options[selectedFilterObj.BeginningOfTheQuarterYear.options.length - 1].title;
                    }
                    if (selectedFilterObj.BeginningOfTheQuarter.selectedOption.title === "") {
                        selectedFilterObj.BeginningOfTheQuarter.selectedOption.title =
                            selectedFilterObj.BeginningOfTheQuarter.options[selectedFilterObj.BeginningOfTheQuarter.options.length - 1].title;
                    }
                    let formatedVal = this.formattedFilterValueForMonthYear(
                        selectedFilterObj.BeginningOfTheQuarterYear.selectedOption.title, selectedFilterObj
                    );
                    formatedVal.reverse();
                    selectedFilterObj.FilterConditionValue = [...formatedVal]
                    selectedFilterObj.filterCdnSet = true;
                }
                break;
            }
            case DashboardConstants.FilterType.Month: {
                selectedFilterObj.FilterRadioOperator.field.op = selectedFilterObj.QuarterYearModel.field.op;
                selectedFilterObj.FilterRadioOperator.field.title = selectedFilterObj.QuarterYearModel.field.title;
                selectedFilterObj.FilterRadioOperator.field.FilterConditionObjectId = selectedFilterObj.QuarterYearModel.field.FilterConditionObjectId;
                if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.Next_Months) {
                    selectedFilterObj.FilterConditionValue = selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue;
                    if (!this._commUtil.isNune(selectedFilterObj.NextQuarterYearsModel.nextQuarterYearValue)) {
                        selectedFilterObj.filterCdnSet = false;
                    }
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.ThisMonth) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.PreviousMonth) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field.op == DashboardConstants.ReportObjectOperators.NextMonth) {
                    selectedFilterObj.FilterConditionValue = "";
                }
                else if (selectedFilterObj.QuarterYearModel.field)
                    break;
            }
                break;
            default:
                break;
        }
        this.filterService.getFilterTabInfo(selectedFilterObj);
    }

    onchangeDateFilter(selectedFilterObj, op) {
        switch (selectedFilterObj.FilterType) {
            case DashboardConstants.FilterType.Date: {
                // date filter
                if (selectedFilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    selectedFilterObj.filterValueSet = true;
                    if (op == DashboardConstants.ReportObjectOperators.Between ||
                        op == DashboardConstants.ReportObjectOperators.NotBetween) {
                        if (this._commUtil.isNune(selectedFilterObj.FromDateModel.FromDateValue)) {
                            selectedFilterObj.FilterConditionRangeValue.from =
                                this._commUtil.getDateInFormat(selectedFilterObj.FromDateModel.FromDateValue);
                        }
                        if (this._commUtil.isNune(selectedFilterObj.ToDateModel.ToDateValue)) {
                            selectedFilterObj.FilterConditionRangeValue.to =
                                this._commUtil.getDateInFormat(selectedFilterObj.ToDateModel.ToDateValue);
                        }
                        if (!this._commUtil.isNune(selectedFilterObj.FromDateModel.FromDateValue) ||
                            !this._commUtil.isNune(selectedFilterObj.ToDateModel.ToDateValue)) {
                            selectedFilterObj.filterValueSet = false;
                        }
                        //     this.getFilterTabInfo();
                        //     break;
                    }
                    else {
                        selectedFilterObj.FilterConditionValue =
                            this._commUtil.getDateInFormat(selectedFilterObj.DateModel.DateValue);
                    }
                }
                else if (selectedFilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    selectedFilterObj.filterCdnSet = true;
                    if (selectedFilterObj.DateRadioModel.DateRadioValue == "") {
                        selectedFilterObj.filterCdnSet = false;
                    }
                    selectedFilterObj.FilterConditionValue =
                        this._commUtil.getDateInFormat(selectedFilterObj.DateRadioModel.DateRadioValue);
                }
                this.filterService.getFilterTabInfo(selectedFilterObj);
                break;
            }
            default: {
                break;
            }
        }
    }


    onValueKeypress(selectedFilterObj, text) {
        //$timeout(function () {   
        if (typeof text == 'string' && text.trim() != '') {
            selectedFilterObj.filterCdnSet = true;
            selectedFilterObj.filterValueSet = true;
        }
        else if (typeof text == 'number' && text != null) {
            selectedFilterObj.FilterConditionValue = text;
            if (selectedFilterObj.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                selectedFilterObj.filterCdnSet = true;
            }
            else if (selectedFilterObj.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                selectedFilterObj.filterValueSet = true;
            }
        }
        else {
            selectedFilterObj.filterCdnSet = false;
            selectedFilterObj.filterValueSet = false;
        }
        if (selectedFilterObj.ReportObjectType == 0 && text == '-') {
            selectedFilterObj.filterValueSet = false;
        }
        if (selectedFilterObj.ReportObjectType == 0 && (selectedFilterObj.FilterConditionOperator.op == 3 || selectedFilterObj.FilterConditionOperator.op == 4)) {
            selectedFilterObj.filterValueSet = selectedFilterObj.FilterConditionRangeValue.from !== "" &&
                selectedFilterObj.FilterConditionRangeValue.from !== "-" &&
                selectedFilterObj.FilterConditionRangeValue.to !== "" &&
                selectedFilterObj.FilterConditionRangeValue.to !== "-";
        }

        if (selectedFilterObj.FilterType >= 3 && text > 0 && selectedFilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            selectedFilterObj.filterValueSet = true;
        }
        if (selectedFilterObj.FilterType >= 3 && text > 0 && (selectedFilterObj.FilterConditionOperator.op == 11) && selectedFilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            selectedFilterObj.filterValueSet = selectedFilterObj.FilterConditionRangeValue.from > 0 && selectedFilterObj.FilterConditionRangeValue.to > 0
        }
        if (selectedFilterObj.FilterType === DashboardConstants.FilterType.Year && text > 0 && selectedFilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            selectedFilterObj.filterValueSet = selectedFilterObj.FilterConditionValue.month !== "" &&
                selectedFilterObj.FilterConditionValue.year !== "";
        }
        if (selectedFilterObj.FilterType == 8 && text > 0) {
            selectedFilterObj.filterValueSet = selectedFilterObj.FilterConditionValue.quarter !== "" &&
                selectedFilterObj.FilterConditionValue.year !== "";
        }
        this.filterService.getFilterTabInfo(selectedFilterObj);
        //});
    }

    private configureFilterByCondition(_reportObject: any) {
        let lstOfConditions: Array<any>;
        lstOfConditions = filter(this._dashboardCommService.FilterConditionMetadata, (filterObj) => {
            return (filterObj.FilterTypeObjectId == _reportObject.FilterTypeObjectId && !filterObj.IsPeriodFilter)
        });
        switch (_reportObject.FilterType) {
            case DashboardConstants.FilterType.Date:
                this.filterByDateOpts.options = map(lstOfConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _reportObject.filterByDateOpts = this.filterByDateOpts
                break;
            case DashboardConstants.FilterType.Year:
                this.filterByYearOpts.options = map(lstOfConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _reportObject.filterByYearOpts = this.filterByYearOpts
                break;
            case DashboardConstants.FilterType.QuarterYear:
                this.filterByQuarterYearOpts.options = map(lstOfConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _reportObject.filterByQuarterYearOpts = this.filterByQuarterYearOpts
                break;
            case DashboardConstants.FilterType.Quarter:
                this.filterByQuarterYearOpts.options = map(lstOfConditions, function (obj) {
                    if (obj.Condition === DashboardConstants.ReportObjectOperators.Is ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.IsNot) {
                        return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                    }
                });
                this.filterByQuarterYearOpts.options = this.filterByQuarterYearOpts.options.filter(_val => _val != undefined);
                _reportObject.filterByQuarterYearOpts = this.filterByQuarterYearOpts
                break;
            case DashboardConstants.FilterType.MonthYear: {
                this.filterByQuarterYearOpts.options = map(lstOfConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _reportObject.filterByQuarterYearOpts = this.filterByQuarterYearOpts
            }
                break;
            case DashboardConstants.FilterType.Month:
                this.filterByQuarterYearOpts.options = map(lstOfConditions, function (obj) {
                    if (obj.Condition === DashboardConstants.ReportObjectOperators.Is ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.IsNot) {
                        return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                    }
                });
                this.filterByQuarterYearOpts.options = this.filterByQuarterYearOpts.options.filter(_val => _val != undefined);
                _reportObject.filterByQuarterYearOpts = this.filterByQuarterYearOpts
                break;
            default:
                break;
        }
    }


    private configureDynamicCondition(_repoObject: any) {
        let lstOfPeriodConditions: Array<any>;
        lstOfPeriodConditions = filter(this._dashboardCommService.FilterConditionMetadata, (filterObj) => {
            return (filterObj.FilterTypeObjectId == _repoObject.FilterTypeObjectId && filterObj.IsPeriodFilter)
        });
        switch (_repoObject.FilterType) {
            case DashboardConstants.FilterType.Date:
                this.periodDate.collection = map(lstOfPeriodConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _repoObject.periodDate = this.periodDate;
                break;
            case DashboardConstants.FilterType.Year:
                this.YearRadioConfig.collection = map(lstOfPeriodConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _repoObject.YearRadioConfig = this.YearRadioConfig;
                break;
            case DashboardConstants.FilterType.QuarterYear:
                this.QuarterYearRadioConfig.collection = map(lstOfPeriodConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _repoObject.QuarterYearRadioConfig = this.QuarterYearRadioConfig;
                break;
            case DashboardConstants.FilterType.Quarter:
                this.QuarterYearRadioConfig.collection = map(lstOfPeriodConditions, obj => {
                    if (obj.Condition === DashboardConstants.ReportObjectOperators.PreviousQuarter ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.ThisQuarter ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.NextQuarter ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.Next_Quarters) {
                        return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                    }
                });
                this.QuarterYearRadioConfig.collection = this.QuarterYearRadioConfig.collection.filter(_val => _val != undefined);
                _repoObject.QuarterYearRadioConfig = this.QuarterYearRadioConfig;
                break;
            case DashboardConstants.FilterType.MonthYear:
                this.QuarterYearRadioConfig.collection = map(lstOfPeriodConditions, function (obj) {
                    return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                });
                _repoObject.QuarterYearRadioConfig = this.QuarterYearRadioConfig;
                break;
            case DashboardConstants.FilterType.Month:
                this.QuarterYearRadioConfig.collection = map(lstOfPeriodConditions, obj => {
                    if (obj.Condition === DashboardConstants.ReportObjectOperators.PreviousMonth ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.ThisMonth ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.NextMonth ||
                        obj.Condition === DashboardConstants.ReportObjectOperators.Next_Months) {
                        return { op: obj.Condition, title: obj.Name, FilterConditionObjectId: obj.FilterConditionObjectId }
                    }
                });
                this.QuarterYearRadioConfig.collection = this.QuarterYearRadioConfig.collection.filter(_val => _val != undefined);
                _repoObject.QuarterYearRadioConfig = this.QuarterYearRadioConfig;
                break;
            default:
                break;
        }
    }

    private periodYearHandling(filterObject: any) {
        filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Is;
        filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is];
        filterObject.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => { return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is })[0].FilterConditionObjectId;
        filterObject.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        filterObject.FilterConditionValue = "";
        filterObject.FromyearDropdown.selectedRangeOptions.from.title = "";
        filterObject.ToyearDropdown.selectedRangeOptions.to.title = "";
        filterObject.yearDropdown.selectedOption.title = "";
        filterObject.YearModel.field.op = DashboardConstants.ReportObjectOperators.ThisYear;
        filterObject.YearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisYear];
        filterObject.YearModel.field.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => { return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisYear })[0].FilterConditionObjectId;
    }

    private periodQuarterYearHandling(filterObject: any) {
        filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Is;
        filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is];
        filterObject.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => { return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is })[0].FilterConditionObjectId;
        filterObject.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        filterObject.FilterConditionValue = "";
        filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title = "";
        filterObject.FromQuarterDropdown.selectedRangeOptions.from.title = "";
        filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title = "";
        filterObject.ToQuarterDropdown.selectedRangeOptions.to.title = "";
        filterObject.QuarteryearDropdown.selectedOption.title = "";
        filterObject.sourceQuarterDropDown.selectedOption.title = "";
        filterObject.QuarterYearModel.field.op = DashboardConstants.ReportObjectOperators.ThisQuarter;
        filterObject.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter];
        filterObject.QuarterYearModel.field.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter
        })[0].FilterConditionObjectId;
    }

    private periodQuarterHandling(filterObject: any) {
        filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Is;
        filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is];
        filterObject.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => { return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is })[0].FilterConditionObjectId;
        filterObject.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        filterObject.FilterConditionValue = "";
        filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title = "";
        filterObject.FromQuarterDropdown.selectedRangeOptions.from.title = "";
        filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title = "";
        filterObject.ToQuarterDropdown.selectedRangeOptions.to.title = "";
        filterObject.QuarteryearDropdown.selectedOption.title = "";
        filterObject.sourceQuarterDropDown.selectedOption.title = "";
        filterObject.QuarterYearModel.field.op = DashboardConstants.ReportObjectOperators.ThisQuarter;
        filterObject.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter];
        filterObject.QuarterYearModel.field.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter
        })[0].FilterConditionObjectId;
    }

    private periodMonthHandling(filterObject: any) {
        filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Is;
        filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is];
        filterObject.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => { return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is })[0].FilterConditionObjectId;
        filterObject.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        filterObject.FilterConditionValue = "";
        filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title = "";
        filterObject.FromQuarterDropdown.selectedRangeOptions.from.title = "";
        filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title = "";
        filterObject.ToQuarterDropdown.selectedRangeOptions.to.title = "";
        filterObject.QuarteryearDropdown.selectedOption.title = "";
        filterObject.sourceQuarterDropDown.selectedOption.title = "";
        filterObject.QuarterYearModel.field.op = DashboardConstants.ReportObjectOperators.ThisMonth;
        filterObject.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth];
        filterObject.QuarterYearModel.field.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth
        })[0].FilterConditionObjectId;
    }

    private periodDateHandling(filterObject: any) {

        filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Between;
        filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Between];
        filterObject.FilterConditionOperator.FilterConditionObjectId = filter(
            this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Between
            })[0].FilterConditionObjectId;
        filterObject.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        filterObject.FilterConditionValue = "";
        filterObject.FilterConditionRangeValue.from = "";
        filterObject.FilterConditionRangeValue.to = "";
        filterObject.FilterRadioOperator.field.op = DashboardConstants.ReportObjectOperators.Today;
        filterObject.FilterRadioOperator.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Today],
            filterObject.FilterRadioOperator.field.FilterConditionObjectId = filter(
                this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
                    return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Today
                })[0].FilterConditionObjectId;
        filterObject.DateModel.DateValue = "";
        filterObject.FromDateModel.FromDateValue = "";
        filterObject.ToDateModel.ToDateValue = "";
        filterObject.DateRadioModel.DateRadioValue = "";
        filterObject.RollingDateModel.rollingDateValue = "";
        filterObject.NextDateModel.nextDateValue = "";
    }

    private periodMonthYearHandling(filterObject: any) {
        filterObject.FilterConditionOperator.op = DashboardConstants.ReportObjectOperators.Is;
        filterObject.FilterConditionOperator.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is];
        filterObject.FilterConditionOperator.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => { return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is })[0].FilterConditionObjectId;
        filterObject.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        filterObject.FilterConditionValue = "";
        filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title = "";
        filterObject.FromQuarterDropdown.selectedRangeOptions.from.title = "";
        filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title = "";
        filterObject.ToQuarterDropdown.selectedRangeOptions.to.title = "";
        filterObject.QuarteryearDropdown.selectedOption.title = "";
        filterObject.sourceQuarterDropDown.selectedOption.title = "";
        filterObject.QuarterYearModel.field.op = DashboardConstants.ReportObjectOperators.ThisMonth;
        filterObject.QuarterYearModel.field.title = DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth];
        filterObject.QuarterYearModel.field.FilterConditionObjectId = filter(this._dashboardCommService.FilterConditionMetadata, (filterCdn) => {
            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth
        })[0].FilterConditionObjectId;
    }

    setFilterListInSelected() {
        if (this.periodFilterObj != undefined) {
            //Getting the Current Active Flag from the all available ftabs.Should be onle one thats why hard coded 0. 
            // _currentFtabsObject.ActiveFtabsObject = filter(this.ftabs, (_value: any, _key: any) => {
            //     return _value.active;
            // })[0];
            // _currentFtabsObject.ActiveFtabsObjectIndex = this.ftabs.indexOf(_currentFtabsObject.ActiveFtabsObject);

            if (
                (
                    (this.periodFilterObj.FilterType === DashboardConstants.FilterType.Year &&
                        this.periodFilterObj.sourceYear.length === 0) ||
                    (this.periodFilterObj.FilterType === DashboardConstants.FilterType.QuarterYear &&
                        this.periodFilterObj.sourceQuarterDropDown.options.length === 0) ||
                    (this.periodFilterObj.FilterType === DashboardConstants.FilterType.Quarter &&
                        this.periodFilterObj.sourceQuarterDropDown.options.length === 0) ||
                    (this.periodFilterObj.FilterType === DashboardConstants.FilterType.MonthYear &&
                        this.periodFilterObj.sourceQuarterDropDown.options.length === 0) ||
                    (this.periodFilterObj.FilterType === DashboardConstants.FilterType.Month &&
                        this.periodFilterObj.sourceQuarterDropDown.options.length === 0)
                )
            ) {
                let _daxReportFilterObject: IDAXReportFilter = {
                    isSelectAll: this.periodFilterObj.IsSelectAll,
                    dataSourceObjectId: this.periodFilterObj.DataSource_ObjectId,
                    dataSourceType: 0,
                    isOnOrAfterTerm: "",
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
                        reportObjectId: this.periodFilterObj.ReportObjectId,
                        reportObjectName: this.periodFilterObj.ReportObjectName,
                        reportObjectType: 1
                    }
                };

                this._loaderService.showGlobalLoader();
                if (this.periodFilterObj.FilterType === DashboardConstants.FilterType.Year) {
                    _daxReportFilterObject.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Year].toLowerCase();
                    this.getRelatedTableData(_daxReportFilterObject).then((_response) => {
                        if (_response.length > 0 && _response.success) {
                            _response.forEach((filterValue) => {
                                //For Beginning Of the Year Dynamic options
                                this.periodFilterObj.BeginningOfTheYear.options.push(
                                    {
                                        title: this._commUtil.getObjValueFromKey(filterValue),
                                        check: false
                                    });
                                //For Before and After options                           
                                this.periodFilterObj.yearDropdown.options.push(
                                    {
                                        title: this._commUtil.getObjValueFromKey(filterValue),
                                        check: false
                                    });
                                //For Between Condition
                                this.periodFilterObj.FromyearDropdown.options.push(
                                    {
                                        title: this._commUtil.getObjValueFromKey(filterValue),
                                        check: false
                                    });
                                //For To Year Condition
                                this.periodFilterObj.ToyearDropdown.options.push(
                                    {
                                        title: this._commUtil.getObjValueFromKey(filterValue),
                                        check: false
                                    });
                                //For Is and IsNot Condition
                                this.periodFilterObj.sourceYear.push(
                                    {
                                        name: this._commUtil.getObjValueFromKey(filterValue),
                                        check: false,
                                        IsCheckModel: {
                                            IsCheck: false
                                        }
                                    });
                            });
                            if (this.periodFilterObj.yearDropdown.selectedOption.title == undefined || this.periodFilterObj.yearDropdown.selectedOption.title == "") {
                                this.periodFilterObj.yearDropdown.selectedOption.title = this.periodFilterObj.yearDropdown.options[this.periodFilterObj.yearDropdown.options.length - 1].title;
                            }
                            if (this.periodFilterObj.BeginningOfTheYear.selectedOption.title == undefined || this.periodFilterObj.BeginningOfTheYear.selectedOption.title == "") {
                                this.periodFilterObj.BeginningOfTheYear.selectedOption.title = this.periodFilterObj.BeginningOfTheYear.options[this.periodFilterObj.BeginningOfTheYear.options.length - 1].title;
                            }
                            if (this.periodFilterObj.FromyearDropdown.selectedRangeOptions.from.title == undefined || this.periodFilterObj.FromyearDropdown.selectedRangeOptions.from.title == "") {
                                this.periodFilterObj.FromyearDropdown.selectedRangeOptions.from.title = this.periodFilterObj.FromyearDropdown.options[this.periodFilterObj.FromyearDropdown.options.length - 1].title;
                            }
                            if (this.periodFilterObj.ToyearDropdown.selectedRangeOptions.to.title == undefined || this.periodFilterObj.ToyearDropdown.selectedRangeOptions.to.title == "") {
                                this.periodFilterObj.ToyearDropdown.selectedRangeOptions.to.title = this.periodFilterObj.ToyearDropdown.options[this.periodFilterObj.ToyearDropdown.options.length - 1].title;
                            }
                            this.periodFilterObj.isFilterDataLoaded = true;
                            if (this.periodFilterObj.FilterConditionValue != undefined && this.periodFilterObj.FilterConditionValue.length > 0) {
                                each(this.periodFilterObj.FilterConditionValue, (element) => {
                                    this.periodFilterObj.sourceYear.forEach((x) => {
                                        if (x.name === element.name) {
                                            x.IsCheckModel.IsCheck = true;
                                        }
                                    });
                                });
                            }
                            if (this.periodFilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                                if (this.periodFilterObj.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
                                    this.periodFilterObj.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
                                    if (this.periodFilterObj.FilterConditionValue != undefined &&
                                        this.periodFilterObj.FilterConditionValue != null &&
                                        this.periodFilterObj.FilterConditionValue.length > 0) {
                                        this.periodFilterObj.appliedYearFilter = this._commUtil.getDeReferencedObject(this.periodFilterObj.FilterConditionValue);
                                        this.periodFilterObj.maintainAppliedData = this._commUtil.getDeReferencedObject(this.periodFilterObj.FilterConditionValue);
                                        // update this when popup is done implemeneted.
                                        this.updateSelectYearLabel(this.periodFilterObj.FilterConditionValue, this.periodFilterConfig);
                                    }
                                }
                            }
                        }
                        this.filterService.setChipData(this.periodFilterObj.ReportObjectId);
                        this._loaderService.hideGlobalLoader();
                    });
                }
                else if (this.periodFilterObj.FilterType === DashboardConstants.FilterType.QuarterYear) {
                    let _daxReportFilterObjectForQuarter = { ..._daxReportFilterObject };
                    _daxReportFilterObjectForQuarter.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Quarter].toLowerCase();
                    _daxReportFilterObject.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Year].toLowerCase();
                    Observable.forkJoin(
                        [this.getRelatedTableData(_daxReportFilterObject), this.getRelatedTableData(_daxReportFilterObjectForQuarter)]
                    ).subscribe(response => {
                        const yearValues = response[0];
                        const quarterValues = response[1];
                        each(yearValues, (_yearValue) => {
                            this.periodFilterObj.QuarteryearDropdown.options.push(
                                { title: this._commUtil.getObjValueFromKey(_yearValue) }
                            );
                        })
                        each(quarterValues, (_quarterValue) => {
                            this.periodFilterObj.sourceQuarterDropDown.options.push(
                                { title: Object.keys(_quarterValue)[0] }
                            );
                            this.periodFilterObj.sourceQuarterDropDown.values.push(
                                { title: this._commUtil.getObjValueFromKey(_quarterValue) }
                            )
                        })
                        this.periodFilterObj.FromQuarteryearDropdown.options.push(...this.periodFilterObj.QuarteryearDropdown.options);
                        this.periodFilterObj.ToQuarteryearDropdown.options.push(...this.periodFilterObj.QuarteryearDropdown.options);
                        this.periodFilterObj.FromQuarterDropdown.options.push(...this.periodFilterObj.sourceQuarterDropDown.options);
                        this.periodFilterObj.ToQuarterDropdown.options.push(...this.periodFilterObj.sourceQuarterDropDown.options);
                        this.periodFilterObj.BeginningOfTheQuarterYear.options.push(...this.periodFilterObj.QuarteryearDropdown.options);
                        this.periodFilterObj.BeginningOfTheQuarter.options.push(...this.periodFilterObj.sourceQuarterDropDown.options)


                        //Check if its a saved quarter year filter.
                        if (findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: this.periodFilterObj.ReportObjectId }) != -1) {
                            this.updateQuarterTitle();
                        }

                        this.filterService.setChipData(this.periodFilterObj.ReportObjectId);
                        this._loaderService.hideGlobalLoader();


                    });

                }
                else if (this.periodFilterObj.FilterType === DashboardConstants.FilterType.Quarter) {
                    let _daxReportFilterObjectForQuarter = { ..._daxReportFilterObject };
                    _daxReportFilterObjectForQuarter.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Quarter].toLowerCase();
                    this.getRelatedTableData(_daxReportFilterObjectForQuarter).then(response => {
                        let quarterValues = response;
                        each(quarterValues, (_quarterValue) => {
                            this.periodFilterObj.sourceQuarterDropDown.options.push(
                                { title: Object.keys(_quarterValue)[0] }
                            );
                            this.periodFilterObj.sourceQuarterDropDown.values.push(
                                { title: this._commUtil.getObjValueFromKey(_quarterValue) }
                            )
                            //For Is and IsNot.
                            this.periodFilterObj.sourceQuarterYear.push(
                                {
                                    name: Object.keys(_quarterValue)[0],
                                    check: false,
                                    IsCheckModel: {
                                        IsCheck: false
                                    }
                                });
                        });


                        this.periodFilterObj.isFilterDataLoaded = true;
                        let appliedFilterList = [];
                        if (this.periodFilterObj.FilterConditionValue != undefined &&
                            this.periodFilterObj.FilterConditionValue.length > 0 &&
                            this.periodFilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                            each(this.periodFilterObj.FilterConditionValue, (element) => {
                                let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values, { title: element });
                                this.periodFilterObj.sourceQuarterYear[index].IsCheckModel.IsCheck = true;
                                appliedFilterList.push(this.periodFilterObj.sourceQuarterYear[index]);
                            });
                            this.periodFilterObj.appliedYearFilter = this._commUtil.getDeReferencedObject(appliedFilterList);
                            this.periodFilterObj.maintainAppliedData = this._commUtil.getDeReferencedObject(appliedFilterList);
                            // update this when popup is done implemeneted.
                            this.updateSelectYearLabel(this.periodFilterObj.appliedYearFilter, this.periodFilterConfig);
                            this.filterService.getFilterTabInfo(this.periodFilterObj);
                        }

                        this.filterService.setChipData(this.periodFilterObj.ReportObjectId);
                        this._loaderService.hideGlobalLoader();
                    });

                }
                else if (this.periodFilterObj.FilterType === DashboardConstants.FilterType.MonthYear) {
                    let _daxReportFilterObjectForMonth = { ..._daxReportFilterObject };
                    _daxReportFilterObjectForMonth.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Month].toLowerCase();
                    _daxReportFilterObject.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Year].toLowerCase();
                    Observable.forkJoin(
                        [this.getRelatedTableData(_daxReportFilterObject), this.getRelatedTableData(_daxReportFilterObjectForMonth)]
                    ).subscribe(response => {
                        const yearValues = response[0];
                        const monthValues = response[1];
                        each(yearValues, (_yearValue) => {
                            this.periodFilterObj.QuarteryearDropdown.options.push(
                                { title: this._commUtil.getObjValueFromKey(_yearValue) }
                            );
                        })
                        each(monthValues, (_monthValue) => {
                            this.periodFilterObj.sourceQuarterDropDown.options.push(
                                { title: Object.keys(_monthValue)[0] }
                            );
                            this.periodFilterObj.sourceQuarterDropDown.values.push(
                                { title: this._commUtil.getObjValueFromKey(_monthValue) }
                            )
                        })
                        this.periodFilterObj.FromQuarteryearDropdown.options.push(...this.periodFilterObj.QuarteryearDropdown.options);
                        this.periodFilterObj.ToQuarteryearDropdown.options.push(...this.periodFilterObj.QuarteryearDropdown.options);
                        this.periodFilterObj.FromQuarterDropdown.options.push(...this.periodFilterObj.sourceQuarterDropDown.options);
                        this.periodFilterObj.ToQuarterDropdown.options.push(...this.periodFilterObj.sourceQuarterDropDown.options);
                        this.periodFilterObj.BeginningOfTheQuarterYear.options.push(...this.periodFilterObj.QuarteryearDropdown.options);
                        this.periodFilterObj.BeginningOfTheQuarter.options.push(...this.periodFilterObj.sourceQuarterDropDown.options)


                        //Check if its a saved quarter year filter.
                        if (findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: this.periodFilterObj.ReportObjectId }) != -1) {
                            this.updateMonthTitle();
                        }

                        this.filterService.setChipData(this.periodFilterObj.ReportObjectId);
                        this._loaderService.hideGlobalLoader();


                    });

                }
                else if (this.periodFilterObj.FilterType === DashboardConstants.FilterType.Month) {
                    let _daxReportFilterObjectForQuarter = { ..._daxReportFilterObject };
                    _daxReportFilterObjectForQuarter.ftype = DashboardConstants.FilterType[DashboardConstants.FilterType.Month].toLowerCase();
                    this.getRelatedTableData(_daxReportFilterObjectForQuarter).then(response => {
                        let quarterValues = response;
                        each(quarterValues, (_quarterValue) => {
                            this.periodFilterObj.sourceQuarterDropDown.options.push(
                                { title: Object.keys(_quarterValue)[0] }
                            );
                            this.periodFilterObj.sourceQuarterDropDown.values.push(
                                { title: this._commUtil.getObjValueFromKey(_quarterValue) }
                            )
                            //For Is and IsNot.
                            this.periodFilterObj.sourceQuarterYear.push(
                                {
                                    name: Object.keys(_quarterValue)[0],
                                    check: false,
                                    IsCheckModel: {
                                        IsCheck: false
                                    }
                                });
                        });


                        this.periodFilterObj.isFilterDataLoaded = true;
                        let appliedFilterList = [];
                        if (this.periodFilterObj.FilterConditionValue != undefined &&
                            this.periodFilterObj.FilterConditionValue.length > 0 &&
                            this.periodFilterObj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                            each(this.periodFilterObj.FilterConditionValue, (element) => {
                                let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values, { title: element });
                                this.periodFilterObj.sourceQuarterYear[index].IsCheckModel.IsCheck = true;
                                appliedFilterList.push(this.periodFilterObj.sourceQuarterYear[index]);
                            });
                            this.periodFilterObj.appliedYearFilter = this._commUtil.getDeReferencedObject(appliedFilterList);
                            this.periodFilterObj.maintainAppliedData = this._commUtil.getDeReferencedObject(appliedFilterList);
                            // update this when popup is done implemeneted.
                            this.updateSelectYearLabel(this.periodFilterObj.appliedYearFilter, this.periodFilterConfig);
                            this.filterService.getFilterTabInfo(this.periodFilterObj);
                        }

                        this.filterService.setChipData(this.periodFilterObj.ReportObjectId);
                        this._loaderService.hideGlobalLoader();
                    });

                }

            }
            else {
                this.filterService.getFilterTabInfo(this.periodFilterObj);
            }
        }
    }

    public getRelatedTableData(_daxReportFilterObject: IDAXReportFilter): Promise<any> {
        return new Promise((resolve, reject) => {
            this._analyticsCommonDataService.getRelatedTableData(_daxReportFilterObject).subscribe((res) => {
                if (res != undefined && res != null && res.length > 0) {
                    res.success = true;
                    resolve(res);
                }
            }), (error) => {
                console.log(error);
                reject(false);
            }
        });
    }

    private setDefaultYear(selectedFilterObj) {
        if (Object.keys(selectedFilterObj.BeginningOfTheYear).length === 0) {
            selectedFilterObj.BeginningOfTheYear = {
                dataKey: 'op',
                displayKey: 'title',
                options: [],
                selectedOption: { title: "" },
            }
        }
        if (Object.keys(selectedFilterObj.FromyearDropdown).length === 0) {
            selectedFilterObj.FromyearDropdown = {
                label: 'From',
                dataKey: 'title',
                displayKey: 'title',
                options: [],
                fieldKey: 'from',
                type: 'select',
                cssClass: 'line-height-manager',
                selectedRangeOptions: {
                    from: { title: "" },
                },
            }
        }
        if (Object.keys(selectedFilterObj.ToyearDropdown).length === 0) {
            selectedFilterObj.ToyearDropdown = {
                label: 'To',
                dataKey: 'title',
                displayKey: 'title',
                cssClass: 'line-height-manager',
                fieldKey: 'to',
                options: [],
                type: 'select',
                selectedRangeOptions: {
                    to: { title: "" },
                },
            }
        }
        if (Object.keys(selectedFilterObj.yearDropdown).length === 0) {
            selectedFilterObj.yearDropdown = {
                displayKey: 'title',
                options: [],
                label: 'Select Year',
                dataKey: 'title',
                cssClass: 'line-height-manager',
                fieldKey: 'selectedOption',
                type: 'select',
                selectedOption: { title: "" },
            };
        }
        if (Object.keys(selectedFilterObj.YearModel).length === 0) {
            selectedFilterObj.YearModel = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisYear, title: "ThisYear", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisYear)
                    })[0].FilterConditionObjectId
                }
            };
        }

        if (Object.keys(selectedFilterObj.FilterRadioOperator).length === 0) {
            selectedFilterObj.FilterRadioOperator = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisYear, title: "ThisYear", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisYear)
                    })[0]
                }
            };
        }
        if (Object.keys(selectedFilterObj.RollingYear).length === 0) {
            selectedFilterObj.RollingYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'rollingYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.RollingYearsModel).length === 0) {
            selectedFilterObj.RollingYearsModel = {
                rollingYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.NextYears).length === 0) {
            selectedFilterObj.NextYears = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'nextYearValue'
            }
        }
        if (Object.keys(selectedFilterObj.NextYearsModel).length === 0) {
            selectedFilterObj.NextYearsModel = {
                nextYearValue: '',
            }
        }

        if (Object.keys(selectedFilterObj.sourceYear).length === 0) {
            selectedFilterObj.sourceYear = [];
        }
        selectedFilterObj.FilterTabInfo = selectedFilterObj.FilterTabInfo ? selectedFilterObj.FilterTabInfo : "";
        selectedFilterObj.showSelectYearPopup = selectedFilterObj.showSelectYearPopup ? selectedFilterObj.showSelectYearPopup : false;
        selectedFilterObj.showLabel = selectedFilterObj.showLabel ? selectedFilterObj.showLabel : false;
        selectedFilterObj.appliedYearFilter = selectedFilterObj.appliedYearFilter ? selectedFilterObj.appliedYearFilter : [];
        selectedFilterObj.maintainAppliedData = selectedFilterObj.maintainAppliedData ? selectedFilterObj.maintainAppliedData : [];
        selectedFilterObj.SelectedYear = selectedFilterObj.SelectedYear ? selectedFilterObj.SelectedYear : 'Select Year';
    }

    private setDefaultDate(selectedFilterObj) {
        if (Object.keys(selectedFilterObj.DateModel).length === 0) {
            selectedFilterObj.DateModel = {
                DateValue: new Date(),
            }
        }
        if (Object.keys(selectedFilterObj.FromDateModel).length === 0) {
            selectedFilterObj.FromDateModel = {
                FromDateValue: new Date(),
            }
        }
        if (Object.keys(selectedFilterObj.ToDateModel).length === 0) {
            selectedFilterObj.ToDateModel = {
                ToDateValue: new Date(),
            }
        }
        if (Object.keys(selectedFilterObj.DateRadioModel).length === 0) {
            selectedFilterObj.DateRadioModel = {
                DateRadioValue: new Date(),
            }
        }
        if (Object.keys(selectedFilterObj.RollingDateModel).length === 0) {
            selectedFilterObj.RollingDateModel = {
                rollingDateValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.NextDateModel).length === 0) {
            selectedFilterObj.NextDateModel = {
                nextDateValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.FilterRadioOperator).length === 0) {
            selectedFilterObj.FilterRadioOperator = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.Today,
                    title: "Today",
                    FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return filterCondition.Condition == DashboardConstants.ReportObjectOperators.Today
                    })[0]
                }
            };
        }
    }

    private setDefaultQuarterYear(selectedFilterObj) {
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarterYear).length === 0) {
            selectedFilterObj.BeginningOfTheQuarterYear = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarterYear.label = 'Select Year';
            selectedFilterObj.BeginningOfTheQuarterYear.selectedOption = { title: '' };
        }
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarter).length === 0) {

            selectedFilterObj.BeginningOfTheQuarter = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarter.label = 'Select Quarter';
            selectedFilterObj.BeginningOfTheQuarter.selectedOption = { title: '' };

        }
        if (Object.keys(selectedFilterObj.FromQuarteryearDropdown).length === 0) {

            selectedFilterObj.FromQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.FromQuarteryearDropdown.label = 'From';
            selectedFilterObj.FromQuarteryearDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarteryearDropdown.selectedRangeOptions = { from: { title: '' } };

        }
        if (Object.keys(selectedFilterObj.ToQuarteryearDropdown).length === 0) {
            selectedFilterObj.ToQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.ToQuarteryearDropdown.label = 'To';
            selectedFilterObj.ToQuarteryearDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarteryearDropdown.selectedRangeOptions = { to: { title: '' } };

        }
        if (Object.keys(selectedFilterObj.FromQuarterDropdown).length === 0) {

            selectedFilterObj.FromQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.FromQuarterDropdown.label = 'From';
            selectedFilterObj.FromQuarterDropdown.values = [];
            selectedFilterObj.FromQuarterDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarterDropdown.selectedRangeOptions = {
                from: { title: '' },
            }

        }
        if (Object.keys(selectedFilterObj.ToQuarterDropdown).length === 0) {

            selectedFilterObj.ToQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.ToQuarterDropdown.label = 'To';
            selectedFilterObj.ToQuarterDropdown.values = [];
            selectedFilterObj.ToQuarterDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarterDropdown.selectedRangeOptions = {
                to: { title: '' },
            };
        }
        if (Object.keys(selectedFilterObj.QuarteryearDropdown).length === 0) {

            selectedFilterObj.QuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.QuarteryearDropdown.label = 'Select Year';
            selectedFilterObj.QuarteryearDropdown.selectedOption = { title: '' };

        }
        if (Object.keys(selectedFilterObj.sourceQuarterDropDown).length === 0) {

            selectedFilterObj.sourceQuarterDropDown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.sourceQuarterDropDown.label = 'Select Quarter';
            selectedFilterObj.sourceQuarterDropDown.selectedOption = {
                title: ''
            };
            selectedFilterObj.sourceQuarterDropDown.values = [];

        }
        if (Object.keys(selectedFilterObj.QuarterYearModel).length === 0) {
            selectedFilterObj.QuarterYearModel = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter, title: "ThisQuarter", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter)
                    })[0].FilterConditionObjectId
                }
            };
        }
        if (Object.keys(selectedFilterObj.FilterRadioOperator).length === 0) {
            selectedFilterObj.FilterRadioOperator = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter, title: "ThisQuarter", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter)
                    })[0]
                }
            };
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYear).length === 0) {
            selectedFilterObj.RollingQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'rollingQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYearsModel).length === 0) {
            selectedFilterObj.RollingQuarterYearsModel = {
                rollingQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYears).length === 0) {
            selectedFilterObj.NextQuarterYears = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'nextQuarterYearValue'
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYear).length === 0) {
            selectedFilterObj.PreviousQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'previousQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYearsModel).length === 0) {
            selectedFilterObj.NextQuarterYearsModel = {
                nextQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYearsModel).length === 0) {
            selectedFilterObj.PreviousQuarterYearsModel = {
                previousQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.sourceQuarterYear).length === 0) {
            selectedFilterObj.sourceQuarterYear = [];
        }
        selectedFilterObj.FilterTabInfo = selectedFilterObj.FilterTabInfo ? selectedFilterObj.FilterTabInfo : "";
        selectedFilterObj.showSelectYearPopup = selectedFilterObj.showSelectYearPopup ? selectedFilterObj.showSelectYearPopup : false;
        selectedFilterObj.showLabel = selectedFilterObj.showLabel ? selectedFilterObj.showLabel : false;
        selectedFilterObj.appliedYearFilter = selectedFilterObj.appliedYearFilter ? selectedFilterObj.appliedYearFilter : [];
        selectedFilterObj.maintainAppliedData = selectedFilterObj.maintainAppliedData ? selectedFilterObj.maintainAppliedData : [];
        selectedFilterObj.SelectedYear = selectedFilterObj.SelectedYear ? selectedFilterObj.SelectedYear : 'Select Year';
    }

    private setDefaultQuarter(selectedFilterObj) {
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarterYear).length === 0) {
            selectedFilterObj.BeginningOfTheQuarterYear = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarterYear.label = 'Select Year';
            selectedFilterObj.BeginningOfTheQuarterYear.selectedOption = { title: '' };

        }
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarter).length === 0) {
            selectedFilterObj.BeginningOfTheQuarter = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarter.label = 'Select Quarter';
            selectedFilterObj.BeginningOfTheQuarter.selectedOption = { title: '' };
        }
        if (Object.keys(selectedFilterObj.FromQuarteryearDropdown).length === 0) {
            selectedFilterObj.FromQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.FromQuarteryearDropdown.label = 'From';
            selectedFilterObj.FromQuarteryearDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarteryearDropdown.selectedRangeOptions = { from: { title: '' }, };
        }
        if (Object.keys(selectedFilterObj.ToQuarteryearDropdown).length === 0) {
            selectedFilterObj.ToQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.ToQuarteryearDropdown.label = 'To';
            selectedFilterObj.ToQuarteryearDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarteryearDropdown.selectedRangeOptions = { to: { title: '' }, };
        }
        if (Object.keys(selectedFilterObj.FromQuarterDropdown).length === 0) {
            selectedFilterObj.FromQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.FromQuarterDropdown.label = 'From';
            selectedFilterObj.FromQuarterDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarterDropdown.values = [];
            selectedFilterObj.FromQuarterDropdown.selectedRangeOptions = {
                from: { title: '' },
            }
        }
        if (Object.keys(selectedFilterObj.ToQuarterDropdown).length === 0) {
            selectedFilterObj.ToQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.ToQuarterDropdown.label = 'To';
            selectedFilterObj.ToQuarterDropdown.values = [];
            selectedFilterObj.ToQuarterDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarterDropdown.selectedRangeOptions = {
                to: { title: '' },
            };
        }
        if (Object.keys(selectedFilterObj.QuarteryearDropdown).length === 0) {
            selectedFilterObj.QuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.QuarteryearDropdown.label = 'Select Year';
            selectedFilterObj.QuarteryearDropdown.selectedOption = { title: '' };
        }
        if (Object.keys(selectedFilterObj.sourceQuarterDropDown).length === 0) {
            selectedFilterObj.sourceQuarterDropDown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.sourceQuarterDropDown.label = 'Select Quarter';
            selectedFilterObj.sourceQuarterDropDown.selectedOption = {
                title: ''
            };
            selectedFilterObj.sourceQuarterDropDown.values = [];

        }
        if (Object.keys(selectedFilterObj.QuarterYearModel).length === 0) {
            selectedFilterObj.QuarterYearModel = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter, title: "ThisQuarter", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter)
                    })[0].FilterConditionObjectId
                }
            };
        }
        if (Object.keys(selectedFilterObj.FilterRadioOperator).length === 0) {
            selectedFilterObj.FilterRadioOperator = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter, title: "ThisQuarter", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter)
                    })[0]
                }
            };
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYear).length === 0) {
            selectedFilterObj.RollingQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'rollingQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYearsModel).length === 0) {
            selectedFilterObj.RollingQuarterYearsModel = {
                rollingQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYears).length === 0) {
            selectedFilterObj.NextQuarterYears = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'nextQuarterYearValue'
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYear).length === 0) {
            selectedFilterObj.PreviousQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'previousQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYearsModel).length === 0) {
            selectedFilterObj.NextQuarterYearsModel = {
                nextQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYearsModel).length === 0) {
            selectedFilterObj.PreviousQuarterYearsModel = {
                previousQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.sourceQuarterYear).length === 0) {
            selectedFilterObj.sourceQuarterYear = [];
        }
        selectedFilterObj.FilterTabInfo = selectedFilterObj.FilterTabInfo ? selectedFilterObj.FilterTabInfo : "";
        selectedFilterObj.showSelectYearPopup = selectedFilterObj.showSelectYearPopup ? selectedFilterObj.showSelectYearPopup : false;
        selectedFilterObj.showLabel = selectedFilterObj.showLabel ? selectedFilterObj.showLabel : false;
        selectedFilterObj.appliedYearFilter = selectedFilterObj.appliedYearFilter ? selectedFilterObj.appliedYearFilter : [];
        selectedFilterObj.maintainAppliedData = selectedFilterObj.maintainAppliedData ? selectedFilterObj.maintainAppliedData : [];
        selectedFilterObj.SelectedYear = selectedFilterObj.SelectedYear ? selectedFilterObj.SelectedYear : 'Select Quarter';
    }

    private setDefaultMonthYear(selectedFilterObj) {
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarterYear).length === 0) {
            selectedFilterObj.BeginningOfTheQuarterYear = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarterYear.label = 'Select Year';
            selectedFilterObj.BeginningOfTheQuarterYear.selectedOption = { title: '' };
        }
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarter).length === 0) {

            selectedFilterObj.BeginningOfTheQuarter = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarter.label = 'Select Month';
            selectedFilterObj.BeginningOfTheQuarter.selectedOption = { title: '' };

        }
        if (Object.keys(selectedFilterObj.FromQuarteryearDropdown).length === 0) {

            selectedFilterObj.FromQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.FromQuarteryearDropdown.label = 'From';
            selectedFilterObj.FromQuarteryearDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarteryearDropdown.selectedRangeOptions = { from: { title: '' } };

        }
        if (Object.keys(selectedFilterObj.ToQuarteryearDropdown).length === 0) {
            selectedFilterObj.ToQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.ToQuarteryearDropdown.label = 'To';
            selectedFilterObj.ToQuarteryearDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarteryearDropdown.selectedRangeOptions = { to: { title: '' } };

        }
        if (Object.keys(selectedFilterObj.FromQuarterDropdown).length === 0) {

            selectedFilterObj.FromQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.FromQuarterDropdown.label = 'From';
            selectedFilterObj.FromQuarterDropdown.values = [];
            selectedFilterObj.FromQuarterDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarterDropdown.selectedRangeOptions = {
                from: { title: '' },
            }

        }
        if (Object.keys(selectedFilterObj.ToQuarterDropdown).length === 0) {

            selectedFilterObj.ToQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.ToQuarterDropdown.label = 'To';
            selectedFilterObj.ToQuarterDropdown.values = [];
            selectedFilterObj.ToQuarterDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarterDropdown.selectedRangeOptions = {
                to: { title: '' },
            };
        }
        if (Object.keys(selectedFilterObj.QuarteryearDropdown).length === 0) {

            selectedFilterObj.QuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.QuarteryearDropdown.label = 'Select Year';
            selectedFilterObj.QuarteryearDropdown.selectedOption = { title: '' };

        }
        if (Object.keys(selectedFilterObj.sourceQuarterDropDown).length === 0) {

            selectedFilterObj.sourceQuarterDropDown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.sourceQuarterDropDown.label = 'Select Month';
            selectedFilterObj.sourceQuarterDropDown.selectedOption = {
                title: ''
            };
            selectedFilterObj.sourceQuarterDropDown.values = [];

        }
        if (Object.keys(selectedFilterObj.QuarterYearModel).length === 0) {
            selectedFilterObj.QuarterYearModel = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisMonth, title: "ThisMonth", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisMonth)
                    })[0].FilterConditionObjectId
                }
            };
        }
        if (Object.keys(selectedFilterObj.FilterRadioOperator).length === 0) {
            selectedFilterObj.FilterRadioOperator = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisMonth, title: "ThisMonth", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisMonth)
                    })[0]
                }
            };
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYear).length === 0) {
            selectedFilterObj.RollingQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'rollingQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYearsModel).length === 0) {
            selectedFilterObj.RollingQuarterYearsModel = {
                rollingQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYears).length === 0) {
            selectedFilterObj.NextQuarterYears = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'nextQuarterYearValue'
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYear).length === 0) {
            selectedFilterObj.PreviousQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'previousQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYearsModel).length === 0) {
            selectedFilterObj.NextQuarterYearsModel = {
                nextQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYearsModel).length === 0) {
            selectedFilterObj.PreviousQuarterYearsModel = {
                previousQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.sourceQuarterYear).length === 0) {
            selectedFilterObj.sourceQuarterYear = [];
        }
        selectedFilterObj.FilterTabInfo = selectedFilterObj.FilterTabInfo ? selectedFilterObj.FilterTabInfo : "";
        selectedFilterObj.showSelectYearPopup = selectedFilterObj.showSelectYearPopup ? selectedFilterObj.showSelectYearPopup : false;
        selectedFilterObj.showLabel = selectedFilterObj.showLabel ? selectedFilterObj.showLabel : false;
        selectedFilterObj.appliedYearFilter = selectedFilterObj.appliedYearFilter ? selectedFilterObj.appliedYearFilter : [];
        selectedFilterObj.maintainAppliedData = selectedFilterObj.maintainAppliedData ? selectedFilterObj.maintainAppliedData : [];
        selectedFilterObj.SelectedYear = selectedFilterObj.SelectedYear ? selectedFilterObj.SelectedYear : 'Select Year';
    }
    private setDefaultMonth(selectedFilterObj) {
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarterYear).length === 0) {
            selectedFilterObj.BeginningOfTheQuarterYear = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarterYear.label = 'Select Year';
            selectedFilterObj.BeginningOfTheQuarterYear.selectedOption = { title: '' };

        }
        if (Object.keys(selectedFilterObj.BeginningOfTheQuarter).length === 0) {
            selectedFilterObj.BeginningOfTheQuarter = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.BeginningOfTheQuarter.label = 'Select Month';
            selectedFilterObj.BeginningOfTheQuarter.selectedOption = { title: '' };
        }
        if (Object.keys(selectedFilterObj.FromQuarteryearDropdown).length === 0) {
            selectedFilterObj.FromQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.FromQuarteryearDropdown.label = 'From';
            selectedFilterObj.FromQuarteryearDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarteryearDropdown.selectedRangeOptions = { from: { title: '' }, };
        }
        if (Object.keys(selectedFilterObj.ToQuarteryearDropdown).length === 0) {
            selectedFilterObj.ToQuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.ToQuarteryearDropdown.label = 'To';
            selectedFilterObj.ToQuarteryearDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarteryearDropdown.selectedRangeOptions = { to: { title: '' }, };
        }
        if (Object.keys(selectedFilterObj.FromQuarterDropdown).length === 0) {
            selectedFilterObj.FromQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.FromQuarterDropdown.label = 'From';
            selectedFilterObj.FromQuarterDropdown.fieldKey = "from"
            selectedFilterObj.FromQuarterDropdown.values = [];
            selectedFilterObj.FromQuarterDropdown.selectedRangeOptions = {
                from: { title: '' },
            }
        }
        if (Object.keys(selectedFilterObj.ToQuarterDropdown).length === 0) {
            selectedFilterObj.ToQuarterDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear)
            selectedFilterObj.ToQuarterDropdown.label = 'To';
            selectedFilterObj.ToQuarterDropdown.values = [];
            selectedFilterObj.ToQuarterDropdown.fieldKey = "to"
            selectedFilterObj.ToQuarterDropdown.selectedRangeOptions = {
                to: { title: '' },
            };
        }
        if (Object.keys(selectedFilterObj.QuarteryearDropdown).length === 0) {
            selectedFilterObj.QuarteryearDropdown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.QuarteryearDropdown.label = 'Select Year';
            selectedFilterObj.QuarteryearDropdown.selectedOption = { title: '' };
        }
        if (Object.keys(selectedFilterObj.sourceQuarterDropDown).length === 0) {
            selectedFilterObj.sourceQuarterDropDown = this._commUtil.getUIElementConfig(DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear);
            selectedFilterObj.sourceQuarterDropDown.label = 'Select Month';
            selectedFilterObj.sourceQuarterDropDown.selectedOption = {
                title: ''
            };
            selectedFilterObj.sourceQuarterDropDown.values = [];

        }
        if (Object.keys(selectedFilterObj.QuarterYearModel).length === 0) {
            selectedFilterObj.QuarterYearModel = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter, title: "ThisMonth", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisMonth)
                    })[0].FilterConditionObjectId
                }
            };
        }
        if (Object.keys(selectedFilterObj.FilterRadioOperator).length === 0) {
            selectedFilterObj.FilterRadioOperator = {
                field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter, title: "ThisMonth", FilterConditionObjectId: filter(this._dashboardCommService.FilterConditionMetadata, (filterCondition) => {
                        return (filterCondition.Condition == DashboardConstants.ReportObjectOperators.ThisMonth)
                    })[0]
                }
            };
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYear).length === 0) {
            selectedFilterObj.RollingQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'rollingQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.RollingQuarterYearsModel).length === 0) {
            selectedFilterObj.RollingQuarterYearsModel = {
                rollingQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYears).length === 0) {
            selectedFilterObj.NextQuarterYears = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'nextQuarterYearValue'
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYear).length === 0) {
            selectedFilterObj.PreviousQuarterYear = {
                label: '',
                attributes: { maxLength: 2 },
                data: 'previousQuarterYearValue',
            }
        }
        if (Object.keys(selectedFilterObj.NextQuarterYearsModel).length === 0) {
            selectedFilterObj.NextQuarterYearsModel = {
                nextQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.PreviousQuarterYearsModel).length === 0) {
            selectedFilterObj.PreviousQuarterYearsModel = {
                previousQuarterYearValue: '',
            }
        }
        if (Object.keys(selectedFilterObj.sourceQuarterYear).length === 0) {
            selectedFilterObj.sourceQuarterYear = [];
        }
        selectedFilterObj.FilterTabInfo = selectedFilterObj.FilterTabInfo ? selectedFilterObj.FilterTabInfo : "";
        selectedFilterObj.showSelectYearPopup = selectedFilterObj.showSelectYearPopup ? selectedFilterObj.showSelectYearPopup : false;
        selectedFilterObj.showLabel = selectedFilterObj.showLabel ? selectedFilterObj.showLabel : false;
        selectedFilterObj.appliedYearFilter = selectedFilterObj.appliedYearFilter ? selectedFilterObj.appliedYearFilter : [];
        selectedFilterObj.maintainAppliedData = selectedFilterObj.maintainAppliedData ? selectedFilterObj.maintainAppliedData : [];
        selectedFilterObj.SelectedYear = selectedFilterObj.SelectedYear ? selectedFilterObj.SelectedYear : 'Select Month';
    }


    updateYearDropdown(obj, type) {
        switch (type) {
            case "from":
            case "to": {
                this.periodFilterObj.FilterConditionRangeValue.from = obj.FromyearDropdown.selectedRangeOptions.from.title;
                this.periodFilterObj.FilterConditionRangeValue.to = obj.ToyearDropdown.selectedRangeOptions.to.title;
                this.periodFilterObj.filterValueSet = obj.FromyearDropdown.selectedRangeOptions.from.title !== "" && obj.ToyearDropdown.selectedRangeOptions !== "";
                break;
            }
            case 'month-my': {

                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionValue.month.title !== "" &&
                    this.periodFilterObj.FilterConditionValue.year.title !== "";
                break;
            }
            case 'year-my': {

                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionValue.month.title !== "" &&
                    this.periodFilterObj.FilterConditionValue.year.title !== "";
                break;
            }
            case 'month-my-from':
            case 'month-my-to': {
                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionRangeValue.month.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.month.to.title !== "" && this.periodFilterObj.FilterConditionRangeValue.year.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.year.to.title !== "";
                break;
            }
            case 'year-my-from':
            case 'year-my-to': {
                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionRangeValue.month.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.month.to.title !== "" && this.periodFilterObj.FilterConditionRangeValue.year.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.year.to.title !== "";
                break;
            }
            case 'quarter-qy': {
                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionValue.quarter.title !== "" &&
                    this.periodFilterObj.FilterConditionValue.year.title !== "";
                break;
            }
            case 'year-qy': {
                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionValue.quarter.title !== "" &&
                    this.periodFilterObj.FilterConditionValue.year.title !== "";
                break;
            }
            case 'quarter-qy-from':
            case 'quarter-qy-to': {
                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionRangeValue.quarter.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.quarter.to.title !== "" && this.periodFilterObj.FilterConditionRangeValue.year.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.year.to.title !== "";
                break;
            }
            case 'year-qy-from':
            case 'year-qy-to': {
                this.periodFilterObj.filterValueSet = this.periodFilterObj.FilterConditionRangeValue.quarter.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.quarter.to.title !== "" && this.periodFilterObj.FilterConditionRangeValue.year.from.title !== "" &&
                    this.periodFilterObj.FilterConditionRangeValue.year.to.title !== "";
                break;
            }
            case 'from_quarter': {
                this.periodFilterObj.filterValueSet = this._commUtil.isNune(obj.BeginningOfTheQuarterYear.selectedOption.title) &&
                    this._commUtil.isNune(obj.BeginningOfTheQuarter.selectedOption.title);
                if (this.periodFilterObj.filterValueSet) {
                    let formatedValue = this.formattedFilterValueForQuarterYear(obj.BeginningOfTheQuarterYear.selectedOption.title, obj.BeginningOfTheQuarter.selectedOption.title);
                    this.periodFilterObj.FilterConditionValue = [...formatedValue];
                }
                break;
            }
            case 'from_month': {
                this.periodFilterObj.filterValueSet = this._commUtil.isNune(obj.BeginningOfTheQuarterYear.selectedOption.title) &&
                    this._commUtil.isNune(obj.BeginningOfTheQuarter.selectedOption.title);
                if (this.periodFilterObj.filterValueSet) {
                    let formatedValue = this.formattedFilterValueForMonthYear(obj.BeginningOfTheQuarterYear.selectedOption.title, obj);
                    formatedValue.reverse();
                    this.periodFilterObj.FilterConditionValue = [...formatedValue];
                }
                break;
            }
            default: {
                if (obj.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
                    this.periodFilterObj.FilterConditionValue = Object.assign(obj.yearDropdown.selectedOption.title);
                }
                else if (obj.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
                    this.periodFilterObj.FilterConditionValue = Object.assign(obj.BeginningOfTheYear.selectedOption.title);
                }
                this.periodFilterObj.filterValueSet = true;
            }
        }
        this.filterService.getFilterTabInfo(obj);
    }

    public async openSelectYearPopup() {
        const selectyearpopupConfig = {
            api: {
                closePopup: () => { this.closeselectYearPopup(); },
                doneClick: (selectedYearList) => { this.selectYearPopupDone(selectedYearList); },
                cancelClick: (selectedYearList) => { this.selectYearPopupCancel(selectedYearList); },
                sourceYear: this.periodFilterObj.sourceYear,
                appliedYearFilter: JSON.parse(JSON.stringify(this.periodFilterObj.appliedYearFilter)),
                filterType: this.periodFilterObj.FilterType
            }
        };

        this.selectYearPoupRef.detach();
        this.selectYearPoupRef.clear();
        this.selectYearPoupRef.createEmbeddedView(this.outletTemplateRef, {
            manifestPath: 'select-year-popup/select-year-popup',
            config: {
                config: selectyearpopupConfig
            }
        });
    }


    public async openSelectQuarterPopup() {
        const selectyearpopupConfig = {
            api: {
                closePopup: () => { this.closeselectYearPopup(); },
                doneClick: (selectedYearList) => { this.selectQuarterPopupDone(selectedYearList); },
                cancelClick: (selectedYearList) => { this.selectYearPopupCancel(selectedYearList); },
                sourceYear: this.periodFilterObj.sourceQuarterYear,
                appliedYearFilter: JSON.parse(JSON.stringify(this.periodFilterObj.appliedYearFilter)),
                filterType: this.periodFilterObj.FilterType
            }
        };

        this.selectYearPoupRef.detach();
        this.selectYearPoupRef.clear();
        this.selectYearPoupRef.createEmbeddedView(this.outletTemplateRef, {
            manifestPath: 'select-year-popup/select-year-popup',
            config: {
                config: selectyearpopupConfig
            }
        });
    }

    closeselectYearPopup() {
        this.selectYearPoupRef.detach();
        this.selectYearPoupRef.clear();
    }

    selectYearPopupDone(selectedYearList) {
        this.periodFilterObj.showLabel = true
        if (selectedYearList != '') {
            this.periodFilterObj.appliedYearFilter = JSON.parse(JSON.stringify(selectedYearList));
            this.updateSelectYearLabel(selectedYearList, this.periodFilterObj);

            //passing list of selected year to FilterConditionValue
            this.periodFilterObj.FilterConditionValue = this.periodFilterObj.appliedYearFilter;
            this.periodFilterObj.showSelectYearPopup = false;
            this.periodFilterObj.filterValueSet = true;
            this.filterService.getFilterTabInfo(this.periodFilterObj);
        }
        else {
            this.periodFilterObj.showSelectYearPopup = false;
            this.periodFilterObj.appliedYearFilter = JSON.parse(JSON.stringify(selectedYearList));
            this.periodFilterObj.FilterConditionValue = this.periodFilterObj.appliedYearFilter;
            this.periodFilterObj.filterValueSet = false;
            this.updateSelectYearLabel(selectedYearList, this.periodFilterObj);
            this.filterService.getFilterTabInfo(this.periodFilterObj);
        }
        this.closeselectYearPopup();
    }

    selectQuarterPopupDone(selectedQuarterList) {
        this.periodFilterObj.showLabel = true
        if (selectedQuarterList != '') {
            this.periodFilterObj.appliedYearFilter = JSON.parse(JSON.stringify(selectedQuarterList));
            this.updateSelectYearLabel(selectedQuarterList, this.periodFilterObj);
            let { options, values } = this.periodFilterObj.sourceQuarterDropDown;
            //passing list of selected year to FilterConditionValue
            let filterValues = [];
            each(this.periodFilterObj.appliedYearFilter, _val => {
                filterValues.push(
                    values[
                        findIndex(options, { title: _val.name })
                    ].title
                )
            })
            this.periodFilterObj.FilterConditionValue = [];
            this.periodFilterObj.FilterConditionValue.push(...filterValues);
            this.periodFilterObj.showSelectYearPopup = false;
            this.periodFilterObj.filterValueSet = true;
            this.filterService.getFilterTabInfo(this.periodFilterObj);
        }
        else {
            this.periodFilterObj.showSelectYearPopup = false;
            this.periodFilterObj.appliedYearFilter = JSON.parse(JSON.stringify(selectedQuarterList));
            let { options, values } = this.periodFilterObj.sourceQuarterDropDown;
            //passing list of selected year to FilterConditionValue
            let filterValues = [];
            each(this.periodFilterObj.appliedYearFilter, _val => {
                filterValues.push(
                    values[
                    findIndex(options, { title: _val.name })
                    ]
                )
            })
            this.periodFilterObj.FilterConditionValue = [];
            this.periodFilterObj.FilterConditionValue.push(...filterValues);
            this.periodFilterObj.filterValueSet = false;
            this.updateSelectYearLabel(selectedQuarterList, this.periodFilterObj);
            this.filterService.getFilterTabInfo(this.periodFilterObj);
        }
        this.closeselectYearPopup();
    }

    selectYearPopupCancel(selectedYearList) {
        this.periodFilterObj.showSelectYearPopup = false;
        for (let year of selectedYearList) {
            if (!(year in this.periodFilterObj.appliedYearFilter)) {
                year.IsCheckModel.IsCheck = false;
            }
        }
        // this.closeselectYearPopup(_selectYearPoupCompRef);
    }


    // function to update the select year label according to the year selected from popup
    updateSelectYearLabel(data, periodFilterObj: any): void {
        let filterType = periodFilterObj.FilterType;
        let copyofFilter = data
        if (copyofFilter.length === 0) {
            this.periodFilterObj.showLabel = false;
            if (filterType === DashboardConstants.FilterType.Year) {
                this.periodFilterObj.SelectedYear = 'Select Year';
            }
            else if (filterType === DashboardConstants.FilterType.Quarter) {
                this.periodFilterObj.SelectedYear = 'Select Quarter';
            }
            else if (filterType === DashboardConstants.FilterType.Month) {
                this.periodFilterObj.SelectedYear = 'Select Month';
            }
        }
        else {
            this.periodFilterObj.showLabel = true;
            if (copyofFilter.length > 1) {
                this.periodFilterObj.SelectedYear = `${copyofFilter[0].name} + ${((copyofFilter.length) - 1)} more`
            }
            else {
                this.periodFilterObj.SelectedYear = copyofFilter[0].name
            }
        }

        // Check for applied filter data, and persist the selection on opening filter
        if (this.periodFilterObj.maintainAppliedData != '') {
            for (let year of copyofFilter) {
                if (findIndex(this.periodFilterObj.maintainAppliedData, year) === -1) {
                    year.IsCheckModel.IsCheck = false;
                }
            }
        }
    }

    //When the user updates the Quarter dropdown
    updateQuarterDropdown(filterObject, op) {
        switch (op) {
            case DashboardConstants.ReportObjectOperators.Is:
            case DashboardConstants.ReportObjectOperators.IsNot:
            case DashboardConstants.ReportObjectOperators.Before:
            case DashboardConstants.ReportObjectOperators.After: {
                filterObject.filterValueSet = this._commUtil.isNuneArray([
                    filterObject.QuarteryearDropdown.selectedOption.title,
                    filterObject.sourceQuarterDropDown.selectedOption.title]);
                if (filterObject.filterValueSet) {
                    let quarterValue = "";
                    let index = findIndex(filterObject.sourceQuarterDropDown.options, { title: filterObject.sourceQuarterDropDown.selectedOption.title });
                    if (index != -1)
                        quarterValue = filterObject.sourceQuarterDropDown.values[index].title;
                    filterObject.FilterConditionValue = filterObject.QuarteryearDropdown.selectedOption.title + quarterValue;
                }
                break;
            }
            case DashboardConstants.ReportObjectOperators.Between: {
                filterObject.filterValueSet = this._commUtil.isNuneArray([
                    filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title,
                    filterObject.FromQuarterDropdown.selectedRangeOptions.from.title,
                    filterObject.ToQuarterDropdown.selectedRangeOptions.to.title,
                    filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title
                ]);
                if (filterObject.filterValueSet) {
                    let formatedVal = this.formattedFilterValueForQuarterYear(filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title, filterObject.FromQuarterDropdown.selectedRangeOptions.from.title);
                    filterObject.FilterConditionRangeValue.from = formatedVal[0] + formatedVal[1];
                    formatedVal = this.formattedFilterValueForQuarterYear(filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title, filterObject.ToQuarterDropdown.selectedRangeOptions.to.title);
                    filterObject.FilterConditionRangeValue.to = formatedVal[0] + formatedVal[1];
                }
                break;
            }
        }
        this.filterService.getFilterTabInfo(filterObject);
    }

    formattedFilterValueForQuarterYear(Year: string, Quarter: string) {
        let quarterValue = "";
        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.options, { title: Quarter });
        if (index != -1)
            quarterValue = this.periodFilterObj.sourceQuarterDropDown.values[index].title;
        return [Year, quarterValue]
    }

    updateMonthYearDropdown(filterObject, op) {
        switch (op) {
            case DashboardConstants.ReportObjectOperators.Is:
            case DashboardConstants.ReportObjectOperators.IsNot:
            case DashboardConstants.ReportObjectOperators.Before:
            case DashboardConstants.ReportObjectOperators.After: {
                filterObject.filterValueSet = this._commUtil.isNuneArray([
                    filterObject.QuarteryearDropdown.selectedOption.title,
                    filterObject.sourceQuarterDropDown.selectedOption.title]);
                if (filterObject.filterValueSet) {
                    let monthValue = "";
                    let index = findIndex(filterObject.sourceQuarterDropDown.options, { title: filterObject.sourceQuarterDropDown.selectedOption.title });
                    if (index != -1)
                        monthValue = filterObject.sourceQuarterDropDown.values[index].title;
                    monthValue = monthValue.length === 1 ? '0' + monthValue : monthValue;
                    filterObject.FilterConditionValue = filterObject.QuarteryearDropdown.selectedOption.title + monthValue;
                }
                break;
            }
            case DashboardConstants.ReportObjectOperators.Between: {
                filterObject.filterValueSet = this._commUtil.isNuneArray([
                    filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title,
                    filterObject.FromQuarterDropdown.selectedRangeOptions.from.title,
                    filterObject.ToQuarterDropdown.selectedRangeOptions.to.title,
                    filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title
                ]);
                if (filterObject.filterValueSet) {
                    let formatedVal = this.formattedFilterValueForMonthYear(filterObject.FromQuarteryearDropdown.selectedRangeOptions.from.title, filterObject, 'from');
                    filterObject.FilterConditionRangeValue.from = formatedVal[0] + formatedVal[1];
                    formatedVal = this.formattedFilterValueForMonthYear(filterObject.ToQuarteryearDropdown.selectedRangeOptions.to.title, filterObject, 'to');
                    filterObject.FilterConditionRangeValue.to = formatedVal[0] + formatedVal[1];
                }
                break;
            }
        }
        this.filterService.getFilterTabInfo(filterObject);
    }

    formattedFilterValueForMonthYear(year, filterObject, betweenDropDownOption?: string) {
        let monthValue = "";
        if (filterObject.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
            let index = findIndex(filterObject.BeginningOfTheQuarter.options, { title: filterObject.BeginningOfTheQuarter.selectedOption.title })
            if (index != -1)
                monthValue = filterObject.sourceQuarterDropDown.values[index].title;
            monthValue = monthValue.length === 1 ? '0' + monthValue : monthValue;
            return [year, monthValue];
        }
        else if (filterObject.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            switch (filterObject.FilterConditionOperator.op) {
                case DashboardConstants.ReportObjectOperators.Is:
                case DashboardConstants.ReportObjectOperators.IsNot:
                case DashboardConstants.ReportObjectOperators.Before:
                case DashboardConstants.ReportObjectOperators.After: {
                    let index = findIndex(filterObject.sourceQuarterDropDown.options, { title: filterObject.sourceQuarterDropDown.selectedOption.title })
                    if (index != -1)
                        monthValue = filterObject.sourceQuarterDropDown.values[index].title;
                    monthValue = monthValue.length === 1 ? '0' + monthValue : monthValue;
                    return [year, monthValue];
                }
                case DashboardConstants.ReportObjectOperators.Between: {
                    if (betweenDropDownOption === 'from') {
                        let index = findIndex(filterObject.sourceQuarterDropDown.options, { title: filterObject.FromQuarterDropdown.selectedRangeOptions.from.title })
                        if (index != -1)
                            monthValue = filterObject.sourceQuarterDropDown.values[index].title;
                        monthValue = monthValue.length === 1 ? '0' + monthValue : monthValue;
                        return [year, monthValue];
                    }
                    else if (betweenDropDownOption === 'to') {
                        let index = findIndex(filterObject.sourceQuarterDropDown.options, { title: filterObject.ToQuarterDropdown.selectedRangeOptions.to.title })
                        if (index != -1)
                            monthValue = filterObject.sourceQuarterDropDown.values[index].title;
                        monthValue = monthValue.length === 1 ? '0' + monthValue : monthValue;
                        return [year, monthValue];
                    }
                }
            }


        }
    }


    //When the view contains saved Quarter Year filter we will update the filter dropdown title with the appropriate Quarter title values.
    updateQuarterTitle() {
        switch (this.periodFilterObj.FilterBy) {
            case DashboardConstants.FilterBy.FilterBySelection: {
                switch (this.periodFilterObj.QuarterYearModel.field.op) {
                    case DashboardConstants.ReportObjectOperators.From_QuarterTillToday: {
                        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values, { title: this.periodFilterObj.BeginningOfTheQuarter.selectedOption.title });
                        this.periodFilterObj.BeginningOfTheQuarter.selectedOption.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        break;
                    }
                }
                break;
            }
            case DashboardConstants.FilterBy.FilterByCondition: {
                switch (this.periodFilterObj.FilterConditionOperator.op) {
                    case DashboardConstants.ReportObjectOperators.Is:
                    case DashboardConstants.ReportObjectOperators.IsNot:
                    case DashboardConstants.ReportObjectOperators.Before:
                    case DashboardConstants.ReportObjectOperators.After: {
                        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values, { title: this.periodFilterObj.sourceQuarterDropDown.selectedOption.title });
                        if (index != -1)
                            this.periodFilterObj.sourceQuarterDropDown.selectedOption.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        break;
                    }
                    case DashboardConstants.ReportObjectOperators.Between: {
                        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values, { title: this.periodFilterObj.FromQuarterDropdown.selectedRangeOptions.from.title });
                        if (index != -1)
                            this.periodFilterObj.FromQuarterDropdown.selectedRangeOptions.from.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values, { title: this.periodFilterObj.ToQuarterDropdown.selectedRangeOptions.to.title });
                        if (index != -1)
                            this.periodFilterObj.ToQuarterDropdown.selectedRangeOptions.to.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        break;
                    }
                }
            }
        }
        this.filterService.getFilterTabInfo(this.periodFilterObj);
    }



    //When the view contains saved Month Year filter we will update the filter dropdown title with the appropriate Month title values.
    updateMonthTitle() {
        switch (this.periodFilterObj.FilterBy) {
            case DashboardConstants.FilterBy.FilterBySelection: {
                switch (this.periodFilterObj.QuarterYearModel.field.op) {
                    case DashboardConstants.ReportObjectOperators.From_MonthTillToday: {
                        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values,
                            { title: parseInt(this.periodFilterObj.BeginningOfTheQuarter.selectedOption.title).toString() }
                        );
                        if (index != -1)
                            this.periodFilterObj.BeginningOfTheQuarter.selectedOption.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        break;
                    }
                }
                break;
            }
            case DashboardConstants.FilterBy.FilterByCondition: {
                switch (this.periodFilterObj.FilterConditionOperator.op) {
                    case DashboardConstants.ReportObjectOperators.Is:
                    case DashboardConstants.ReportObjectOperators.IsNot:
                    case DashboardConstants.ReportObjectOperators.Before:
                    case DashboardConstants.ReportObjectOperators.After: {
                        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values,
                            { title: parseInt(this.periodFilterObj.sourceQuarterDropDown.selectedOption.title).toString() }
                        );
                        if (index != -1)
                            this.periodFilterObj.sourceQuarterDropDown.selectedOption.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        break;
                    }
                    case DashboardConstants.ReportObjectOperators.Between: {
                        let index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values,
                            { title: parseInt(this.periodFilterObj.FromQuarterDropdown.selectedRangeOptions.from.title).toString() }
                        );
                        if (index != -1)
                            this.periodFilterObj.FromQuarterDropdown.selectedRangeOptions.from.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        index = findIndex(this.periodFilterObj.sourceQuarterDropDown.values,
                            { title: parseInt(this.periodFilterObj.ToQuarterDropdown.selectedRangeOptions.to.title).toString() }
                        );
                        if (index != -1)
                            this.periodFilterObj.ToQuarterDropdown.selectedRangeOptions.to.title = this.periodFilterObj.sourceQuarterDropDown.options[index].title;
                        break;
                    }
                }
            }
        }
        this.filterService.getFilterTabInfo(this.periodFilterObj);
    }
}
