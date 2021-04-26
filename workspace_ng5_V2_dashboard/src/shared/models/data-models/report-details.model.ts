import { Injectable } from '@angular/core';

import { ReportObject } from './report-object.model'
import { ReportFilter } from './report-filter.model'
import { SortReportObject } from './sort-report-object.model'
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';


// Class provides instance properties for ReportDetails which will be used for .
// @Injectable()
export class ReportDetails {

    // DataSourceObjectId is Unique Identifier for Data Source.
    dataSourceObjectId: string;

    // DataSourceType defines Backend is either Tabular or Cube or SQL or SQL Engine.
    dataSourceType: AnalyticsCommonConstants.DataSourceType;

    // isGNG set True if Grand Total needs to be calculated from service, otherwise false.
    isGNG: boolean = false;

    // LstReportObject provides selected Reporting Object on Rows, Columns, Metrices.
    lstReportObject: Array<ReportObject>;

    // ReportFilter can be for creating Where Clause.
    lstFilterReportObject: Array<ReportFilter>;

    // SortReportObject can be for creating Order By Clause.
    lstSortReportObject: Array<SortReportObject>;

    // ReportViewType defines types of Reporting ie., Grid or highchart(Line Chart, ColumnChart).
    reportViewType: AnalyticsCommonConstants.ReportViewType;

    // ReportRequestKey is Unique Identifier for a Generate Report Request.
    reportRequestKey: string;

    // IsGrandTotalRequired set True if Grand Total needs to be calculated from service, otherwise false.
    isGrandTotalRequired: boolean = false;

    // IsSubTotalRequired set True if Sub Total needs to be calculated from service, otherwise false.
    isSubTotalRequired: boolean = false;

    // IsLazyLoadingRequired set True if Lazy Loading/Pagination required, otherwise false.
    isLazyLoadingRequired: boolean = false;

    // PageIndex is used to show Page number.
    pageIndex: number = 1;

    // PageSize is used to show Page number.
    pageSize: number = 0;

    //  ConditionalFormattingConfigurationDetails used to display applied conditionalformatting on vision dashboard. 
    ConditionalFormattingConfigurationDetails : string;

    // ReportColorConfigurationDetails stores the colors applied by user on a legend
    ReportColorConfigurationDetails:string

    // isPercentageEnabledSummaryCard is used to indicate summary card's where there are 1 in row or columns and 1 in values, used to indicate % of row or column of total spend
    isPercentageEnabledSummaryCard: boolean = false;

    //EnableGlobalSliderFiltering indicates if for a summary card global slider filter must be applied or not
    EnableGlobalSliderFiltering: boolean = false;

    constructor() {
        this.dataSourceObjectId = undefined;
        this.dataSourceType = 0;
        this.reportRequestKey = '';
        this.lstReportObject = new Array<ReportObject>();
        this.lstFilterReportObject = new Array<ReportFilter>();
        this.lstSortReportObject = new Array<SortReportObject>();
        this.isGrandTotalRequired = false;
        this.isGNG = false;
        this.isSubTotalRequired = false;
        this.isLazyLoadingRequired = false;
        this.pageIndex = 1;
        this.pageSize = 0;
        this.ConditionalFormattingConfigurationDetails = '';
        this.ReportColorConfigurationDetails = '';
        this.isPercentageEnabledSummaryCard = false;
        this.EnableGlobalSliderFiltering = false;
    }
}
