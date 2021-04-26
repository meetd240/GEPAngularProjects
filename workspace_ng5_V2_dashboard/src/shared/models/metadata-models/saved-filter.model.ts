import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model'
import { FilterCondition } from './filter-condition.model'
import { DashboardConstants } from '@vsDashboardConstants';

// Class provides instance properties for ReportFilter.
// @Injectable()
export class SavedFilter {

    // SelectedReportObject is used in Order By Clause.
    reportObject: ReportObject;

    //FilterCondition includes the filter applied to the report
    filterCondition: FilterCondition;

    //FilterValue is the value of the filter
    filterValue: Array<string>;

    //FilterBy is a number.
    filterBy: number;

    //IsSliderWidgetFilter : True if current filter is used for Slider Filter.
    isSliderWidgetFilter: boolean;

  //FilterConditionText: Display Filter Conditions in filterTabs
    FilterConditionText:string;

    //FilterAppliedAs : Identification for filter applied as (Report level / Drill) Filter.
    FilterAppliedAs: number;

    //IsGlobalFilter: true if the Current filter is Global filter
    isGlobalFilter: boolean;

    NestedReportFilterObject: any;

    SetConditionalOperator: number;

    Operators: number;

    FilterIdentifier: string;

    //WidgetID is a string.
    WidgetID: string;

    globalSliderObject: string;

    constructor() {
        this.reportObject = new ReportObject();
        this.filterCondition = new FilterCondition();
        this.filterValue = [];
        this.filterBy = undefined;
        this.isSliderWidgetFilter = false;
        this.FilterAppliedAs = DashboardConstants.FilterAppliedAs.ReportFilter;
        this.isGlobalFilter = false
        this.NestedReportFilterObject = null;
        this.SetConditionalOperator = null;
        this.Operators = null;
        this.FilterIdentifier = null;
        this.WidgetID = null;
        this.FilterConditionText = "";
        this.globalSliderObject = '{}';
    }

    jsonToObject(savedFilter: any) {
        this.reportObject = new ReportObject().jsonToObject(savedFilter.ReportObject);
        this.filterCondition = new FilterCondition().jsonToObject(savedFilter.FilterCondition);
        this.filterValue = JSON.parse(savedFilter.FilterValue);
        this.filterBy = savedFilter.FilterBy;
        this.isSliderWidgetFilter = savedFilter.IsSliderWidgetFilter;
        this.FilterAppliedAs = savedFilter.FilterAppliedAs == DashboardConstants.FilterAppliedAs.DrillFilter ? DashboardConstants.FilterAppliedAs.DrillFilter : DashboardConstants.FilterAppliedAs.ReportFilter;
        this.isGlobalFilter = savedFilter.IsGlobalFilter || false;
        this.NestedReportFilterObject = savedFilter.NestedReportFilterObject || null;
        this.SetConditionalOperator = savedFilter.SetConditionalOperator;
        this.Operators = savedFilter.Operators
        //To identify the Filter as Report Level or Drill Level Filter
        this.FilterIdentifier = (savedFilter.FilterIdentifierType || savedFilter.FilterAppliedAs == DashboardConstants.FilterAppliedAs.DrillFilter) ? 
                                DashboardConstants.FilterIdentifierType.DrillFilter : 
                                savedFilter.FilterIdentifier ?  savedFilter.FilterIdentifier : 
                                DashboardConstants.FilterIdentifierType.ReportLevelFilter;
        this.WidgetID = null;
        this.FilterConditionText = savedFilter.FilterConditionText;
        this.globalSliderObject = savedFilter.GlobalSliderObject;
        return this;
    }
}
