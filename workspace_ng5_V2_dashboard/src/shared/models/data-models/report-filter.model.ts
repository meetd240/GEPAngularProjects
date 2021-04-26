import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model'
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

// Class provides instance properties for ReportFilter.
// @Injectable()
export class ReportFilter {

    // SelectedReportObject is used in Order By Clause.
    reportObject: ReportObject;

    // Operators are used in Where Clause.
    operators: AnalyticsCommonConstants.ReportObjectOperators;

    // ValuesList is used in Where Clause as Column's as Filter Value.
    values: Array<string>;

    NestedReportFilterObject: any;

    SetConditionalOperator: number;

    FilterIdentifierType: string;

    constructor() {
        this.reportObject = new ReportObject();
        this.operators = AnalyticsCommonConstants.ReportObjectOperators.Contains;
        this.values = new Array<string>();
        this.NestedReportFilterObject = null;
        this.SetConditionalOperator = AnalyticsCommonConstants.ConditionalOperator.Nan;
        this.FilterIdentifierType = AnalyticsCommonConstants.FilterIdentifierType.ReportLevelFilter;
    }
}
