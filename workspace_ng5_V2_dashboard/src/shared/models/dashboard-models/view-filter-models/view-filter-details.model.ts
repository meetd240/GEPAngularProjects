import { Injectable } from '@angular/core';
import { ReportObject } from '@vsMetaDataModels/report-object.model';
import { FilterCondition } from '@vsMetaDataModels/filter-condition.model';
import { DashboardConstants } from '@vsDashboardConstants';
import { GlobalSliderObject } from '@vsMetaDataModels/global-slider-object.model';


// Class provides instance properties for ViewFilterDetails which will be used for .
// @Injectable()
export class ViewFilterDetails {

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

    //IsGlobalFilter: true if the Current filter is Global filter
    isGlobalFilter: boolean;

    NestedReportFilterObject: any;

    SetConditionalOperator: number;

    Operators: number;

    FilterIdentifier: string;

    //Identifier for single source / multi source filter
    ViewFilterType: number;

    //FilterConditionText is the applied filter description.
    FilterConditionText: string;

    globalSliderObject : GlobalSliderObject;
    constructor() {
        this.ObjectId = undefined;
        this.reportObject = new ReportObject();
        this.filterCondition = new FilterCondition();
        this.filterValue = [];
        this.filterBy = undefined;
        this.isGlobalFilter = true;
        this.NestedReportFilterObject = null;
        this.SetConditionalOperator = null;
        this.Operators = null;
        this.FilterIdentifier = null;
        this.ViewFilterType = undefined;
        this.FilterConditionText = '';
        this.globalSliderObject = new GlobalSliderObject();
    }

    jsonToObject(savedViewFilter: any) {
        this.ViewFilterType = savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.SingleSource ? 
                                DashboardConstants.ViewFilterType.SingleSource : 
                                savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ? 
                                DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource : 
                                savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ? 
                                DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : 
                                DashboardConstants.ViewFilterType.MultiSource;
        this.ObjectId = savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.MultiSource ? savedViewFilter.ObjectId : undefined;
        this.reportObject = new ReportObject().jsonToObject(savedViewFilter.ReportObject);
        this.filterCondition = new FilterCondition().jsonToObject(savedViewFilter.FilterCondition);
        //this.filterValue = JSON.parse(savedViewFilter.FilterValue);
        this.filterValue = savedViewFilter.FilterValue;
        this.filterBy = savedViewFilter.FilterBy;
        this.isGlobalFilter = savedViewFilter.IsGlobalFilter || savedViewFilter.FilterIdentifierType == DashboardConstants.FilterIdentifierType.GlobalLevelFilter || false;
        this.NestedReportFilterObject = savedViewFilter.NestedReportFilterObject || null;
        this.SetConditionalOperator = savedViewFilter.SetConditionalOperator;
        this.Operators = savedViewFilter.Operators;
        this.FilterIdentifier = savedViewFilter.FilterIdentifierType ? savedViewFilter.FilterIdentifierType :
                                savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ?
                                DashboardConstants.FilterIdentifierType.SlicerFilter :
                                savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ?
                                DashboardConstants.FilterIdentifierType.GlobalSlider :
                                DashboardConstants.FilterIdentifierType.GlobalLevelFilter ;
        this.FilterConditionText = savedViewFilter.FilterConditionText;
        this.globalSliderObject = typeof(savedViewFilter.GlobalSliderObject) == "string" ? JSON.parse(savedViewFilter.GlobalSliderObject) : savedViewFilter.GlobalSliderObject;
        return this;
    }
}
