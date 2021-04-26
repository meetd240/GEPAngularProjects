import { Injectable } from '@angular/core';
import { ReportObject } from '@vsMetaDataModels/report-object.model';
import { FilterCondition } from '@vsMetaDataModels/filter-condition.model';
import { DashboardConstants } from '@vsDashboardConstants';
import { GlobalSliderObject } from '@vsMetaDataModels/global-slider-object.model';


// Class provides instance properties for ViewFilterDetails which will be used for .
// @Injectable()
export class TabFilterDetails {

    //Object Id based on filter type
    ObjectId: string;

    // SelectedReportObject is used in Order By Clause.
    reportObject: ReportObject;

    //FilterCondition includes the filter applied to the report
    filterCondition: FilterCondition;

    //FilterValue is the value of the filter
    filterValue: Array<string>;

    //FilterBy is a number.
    filterBy: number;

    //TabId unique identifier for the tab.
    TabId: string;

    //IsGlobalFilter: true if the Current filter is Global filter
    isTabFilter: boolean;

    NestedReportFilterObject: any;

    SetConditionalOperator: number;

    Operators: number;

    FilterIdentifier: string;

    //Identifier for single source / multi source filter
    TabFilterType: number;

    //FilterConditionText is the applied filter description.
    FilterConditionText: string;

    globalSliderObject: GlobalSliderObject;

    constructor() {
        this.ObjectId = undefined;
        this.reportObject = new ReportObject();
        this.filterCondition = new FilterCondition();
        this.filterValue = [];
        this.filterBy = undefined;
        this.isTabFilter = true;
        this.NestedReportFilterObject = null;
        this.SetConditionalOperator = null;
        this.Operators = null;
        this.FilterIdentifier = null;
        this.TabFilterType = undefined;
        this.FilterConditionText = '';
        this.TabId = "";
        this.globalSliderObject = new GlobalSliderObject();
    }

    jsonToObject(savedTabFilter: any) {
        this.TabFilterType = savedTabFilter.TabFilterType == DashboardConstants.ViewFilterType.SingleSource ? 
                                DashboardConstants.ViewFilterType.SingleSource : 
                                savedTabFilter.ViewFilterType == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ? 
                                DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource : savedTabFilter.TabFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ? 
                                DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : 
                                DashboardConstants.ViewFilterType.MultiSource;
        this.ObjectId = savedTabFilter.TabFilterType == DashboardConstants.ViewFilterType.MultiSource ? savedTabFilter.ObjectId : undefined;
        this.reportObject = new ReportObject().jsonToObject(savedTabFilter.ReportObject);
        this.filterCondition = new FilterCondition().jsonToObject(savedTabFilter.FilterCondition);
        //this.filterValue = JSON.parse(savedTabFilter.FilterValue);
        this.filterValue = savedTabFilter.FilterValue;
        this.filterBy = savedTabFilter.FilterBy;
        this.isTabFilter = savedTabFilter.IsGlobalFilter || savedTabFilter.FilterIdentifierType == DashboardConstants.FilterIdentifierType.GlobalLevelFilter || false;
        this.NestedReportFilterObject = savedTabFilter.NestedReportFilterObject || null;
        this.SetConditionalOperator = savedTabFilter.SetConditionalOperator;
        this.Operators = savedTabFilter.Operators;
        this.FilterIdentifier = savedTabFilter.FilterIdentifierType ? savedTabFilter.FilterIdentifierType :
                                savedTabFilter.TabFilterType == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ?
                                DashboardConstants.FilterIdentifierType.SlicerFilter : savedTabFilter.TabFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ? 
                                DashboardConstants.FilterIdentifierType.GlobalSlider : 
                                DashboardConstants.FilterIdentifierType.GlobalLevelFilter ;
        this.FilterConditionText = savedTabFilter.FilterConditionText;
        this.globalSliderObject = typeof(savedTabFilter.GlobalSliderObject) == "string" ? JSON.parse(savedTabFilter.GlobalSliderObject) : savedTabFilter.GlobalSliderObject;
        return this;
    }
}
