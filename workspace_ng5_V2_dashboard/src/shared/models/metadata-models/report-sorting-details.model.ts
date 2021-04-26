import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model'
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

// Class provides instance properties for Sort ReportObject.
// @Injectable()
export class ReportSortingDetails {

    // SelectedReportObject is used in Order By Clause.
    reportObject: ReportObject;

    // SortOrder are sequence of Columnname in Order By Clause.
    sortOrder: number;

    // SortType can be Asc, Desc.
    sortType: AnalyticsCommonConstants.SortType;

    constructor(){
        this.reportObject = new ReportObject();
        this.sortOrder = undefined;
        this.sortType = AnalyticsCommonConstants.SortType.Asc;
    }

    jsonToObject(reportSortingDetails : any){
        this.reportObject = new ReportObject().jsonToObject(reportSortingDetails.ReportObject);
        this.sortOrder = reportSortingDetails.SortOrder;
        this.sortType = reportSortingDetails.SortType;

        return this;
    }
}
