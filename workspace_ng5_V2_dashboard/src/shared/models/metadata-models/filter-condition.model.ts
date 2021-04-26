import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model' 
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

// Class provides instance properties for ReportFilter.
// @Injectable()
export class FilterCondition {

    //Unique Id of the filter object
    FilterConditionObjectId: string;

    //Name of the filter condition
    name: string;

    // Contains all the filter conditin in AnalyticsCommonConstants.ReportObjectOperators enum
    condition: AnalyticsCommonConstants.ReportObjectOperators;

    //True if it is a period filter eg. year, month
    isPeriodFilter: boolean;

    //Unique Id of the filter type
    FilterTypeObjectId: string;

    filterType: number;

    constructor() {
        this.FilterConditionObjectId = undefined;
        this.name = undefined;
        this.condition = AnalyticsCommonConstants.ReportObjectOperators.Contains;
        this.isPeriodFilter = false;
        this.FilterTypeObjectId = undefined;
        this.filterType = undefined;
        return this;
    }

    jsonToObject(filterCondition: any) {
        this.FilterConditionObjectId = filterCondition.FilterConditionObjectId;
        this.name = filterCondition.Name;
        this.condition = filterCondition.Condition;
        this.isPeriodFilter = filterCondition.IsPeriodFilter;
        this.FilterTypeObjectId = filterCondition.FilterTypeObjectId;
        this.filterType = filterCondition.FilterType;
        return this;
    }
}
