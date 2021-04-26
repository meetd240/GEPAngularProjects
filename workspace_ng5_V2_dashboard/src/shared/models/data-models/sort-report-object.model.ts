import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model'
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

// Class provides instance properties for Sort ReportObject.
// @Injectable()
export class SortReportObject {

    // SelectedReportObject is used in Order By Clause.
    reportObject: ReportObject;

    // SortType can be Asc, Desc.
    sortType: AnalyticsCommonConstants.SortType;

    // SortOrder are sequence of Columnname in Order By Clause.
    sortOrder: number;

    constructor(){
        this.reportObject = new ReportObject();
        this.sortType = AnalyticsCommonConstants.SortType.Asc;
        this.sortOrder = 0;
    }
}
