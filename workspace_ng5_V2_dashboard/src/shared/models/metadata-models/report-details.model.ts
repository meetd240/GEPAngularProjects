import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model'
import { SavedFilter } from './saved-filter.model'
import { ReportSortingDetails } from './report-sorting-details.model'
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

// Class provides instance properties for ReportDetails which will be used for .
// @Injectable()
export class ReportDetails {

    // ReportId is Unique Identifier for report.
    reportId: string;

    //ReportDetailObjectId is Unique Identifier for report Detail Object.
    reportDetailObjectId: string;

    //Name of the report
    reportName: string;

    //Display name is the name which is shown on UI
    displayName: string;

    //ReportDescription contains the description of the report
    reportDescription: string;

    //Report type includes adhoc report, VI report etc
    reportType: AnalyticsCommonConstants.ReportType;

    //True if the report is a standard report
    isStandardReport: boolean;

    // DataSourceObjectId is Unique Identifier for Data Source.
    dataSourceObjectId: string;


    //CreatedBy conatins the name of the user who created the report
    createdBy: string;

    //CreatedOn contains the created date by the user
    createdOn: Date;

    //ModifiedOn contains the modified date by the user
    modifiedOn: Date;

    // LstReportObject provides selected Reporting Object on Rows.
    lstReportObjectOnRow: Array<ReportObject>;

    // LstReportObject provides selected Reporting Object on Columns.
    lstReportObjectOnColumn: Array<ReportObject>;

    // LstReportObject provides selected Reporting Object on Metrices.
    lstReportObjectOnValue: Array<ReportObject>;

    // SortReportObject can be for creating Order By Clause.
    lstReportSortingDetails: Array<ReportSortingDetails>;

    // ReportFilter can be for creating Where Clause.
    lstFilterReportObject: Array<SavedFilter>;

    // ReportViewType defines types of Reporting ie., Grid or highchart(Line Chart, ColumnChart).
    reportViewType: AnalyticsCommonConstants.ReportViewType;

    // IsSubTotalRequired set True if Sub Total needs to be calculated from service, otherwise false.
    isTotalRequired: boolean;

    // Count of the stakeholder
    stakeholderCount: number;

    // Used to hold Filter list backup, (to avoid Drill down and Drill Down Filter).
    preserveFilterList: Array<SavedFilter>;

    // IsGrandTotalRequired set True if Grand Total needs to be calculated from service, otherwise false.
    isGrandTotalRequired: boolean = false;

    // IsSubTotalRequired set True if Sub Total needs to be calculated from service, otherwise false.
    isSubTotalRequired: boolean = false;

    // IsLazyLoadingRequired set True if Lazy Loading/Pagination required, otherwise false.
    isLazyLoadingRequired: boolean = false;

    // IsLinkReport set false if report is unlinked , otherwise true.
    isLinkReport: boolean = false;

    // ReportProperties if false driving is not allowed for the report, otherwise driving allowed.
    reportProperties: boolean = true;

    //  ConditionalFormattingConfigurationDetails used to display applied conditionalformatting on vision dashboard. 
    ConditionalFormattingConfigurationDetails : string;

    // ReportColorConfigurationDetails stores the colors applied by user on a legend
    ReportColorConfigurationDetails:string

    // DataSourceType defines Backend is either Tabular or Cube or SQL or SQL Engine.
    dataSourceType: AnalyticsCommonConstants.DataSourceType;

    // DataSourceType defines Backend is either Tabular or Cube or SQL or SQL Engine.
    productType: AnalyticsCommonConstants.ProductType;

    // isPercentageEnabledSummaryCard is used to indicate summary card's where there are 1 in row or columns and 1 in values, used to indicate % of row or column of total spend
    isPercentageEnabledSummaryCard: boolean = false;

    //IsSharedReport is used to indicate if the particular report is shared then set it true else  false.
    IsSharedReport:boolean=false;

    //SharedReportCount is used to indicate the count the particular report is shared with.
    SharedReportCount:number;

    //EnableGlobalSliderFiltering indicates if for a summary card global slider filter must be applied or not
    EnableGlobalSliderFiltering: boolean = false;


    constructor() {
        this.reportId = undefined;
        this.reportDetailObjectId = undefined;
        this.reportName = undefined;
        this.displayName = undefined;
        this.reportDescription = undefined;
        this.reportType = AnalyticsCommonConstants.ReportType.AdhocReport;
        this.isStandardReport = false;
        this.dataSourceObjectId = undefined;
        this.createdBy = undefined;
        this.createdOn = undefined;
        this.modifiedOn = undefined;
        this.lstReportObjectOnRow = new Array<ReportObject>();
        this.lstReportObjectOnColumn = new Array<ReportObject>();
        this.lstReportObjectOnValue = new Array<ReportObject>();
        this.lstReportSortingDetails = new Array<ReportSortingDetails>();
        this.lstFilterReportObject = new Array<SavedFilter>();
        this.reportViewType = AnalyticsCommonConstants.ReportViewType.Olap;
        this.isTotalRequired = false;
        this.stakeholderCount = undefined;
        this.preserveFilterList = new Array<SavedFilter>();
        this.isGrandTotalRequired = false;
        this.isSubTotalRequired = false;
        this.isLazyLoadingRequired = false;
        this.isLinkReport = false;
        this.reportProperties = false;
        this.ConditionalFormattingConfigurationDetails = undefined;
        this.ReportColorConfigurationDetails = undefined;
        this.dataSourceType = AnalyticsCommonConstants.DataSourceType.Tabular;
        this.productType = AnalyticsCommonConstants.ProductType.Reports;
        this.isPercentageEnabledSummaryCard = false;
        this.IsSharedReport=false;
        this.SharedReportCount=undefined;
        this.EnableGlobalSliderFiltering = false;
    }

    jsonToObject(reportDetails: any) {
        this.reportId = reportDetails.ReportId;
        this.reportDetailObjectId = reportDetails.ReportDetailObjectId;
        this.reportName = reportDetails.ReportName;
        this.displayName = reportDetails.DisplayName;
        this.reportDescription = reportDetails.ReportDescription;
        this.reportType = reportDetails.ReportType;
        this.isStandardReport = reportDetails.IsStandardReport;
        this.dataSourceObjectId = reportDetails.DataSourceObjectId;
        this.createdBy = reportDetails.CreatedBy;
        this.createdOn = new Date(parseInt(reportDetails.CreatedOn.replace("\/Date(", "").replace(")\/", "")));
        this.modifiedOn = new Date(parseInt(reportDetails.ModifiedOn.replace("\/Date(", "").replace(")\/", "")));
        //Preparing the List Report Object on Row 
        this.lstReportObjectOnRow = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstReportObjectOnRow, reportDetails.LstReportObjectOnRow, new ReportObject);
        //Preparing the List Report Object on Column 
        this.lstReportObjectOnColumn = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstReportObjectOnColumn, reportDetails.LstReportObjectOnColumn, new ReportObject);
         //Preparing the List Report Object on Value 
        this.lstReportObjectOnValue = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstReportObjectOnValue, reportDetails.LstReportObjectOnValue, new ReportObject);
         //Preparing the List Report Object on Sorting Details 
        this.lstReportSortingDetails = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstReportSortingDetails, reportDetails.LstReportSortingDetails, new ReportSortingDetails);
        //Preparing the List Report Object on Filter  
        this.lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstFilterReportObject, reportDetails.lstFilterReportObject, new SavedFilter);
        this.reportViewType = reportDetails.ReportViewType;
        this.isTotalRequired = reportDetails.IsTotalRequired;
        this.stakeholderCount = reportDetails.StakeholderCount;
        this.preserveFilterList = new Array<SavedFilter>();
        this.isGrandTotalRequired = reportDetails.isGrandTotalRequired;
        this.isSubTotalRequired = reportDetails.isSubTotalRequired;
        this.isLazyLoadingRequired = reportDetails.isLazyLoadingRequired;
        this.isLinkReport = reportDetails.IsLinkReport;
        this.reportProperties = typeof reportDetails.ReportProperties === 'string' && reportDetails.ReportProperties != "" ? JSON.parse(reportDetails.ReportProperties) : reportDetails.ReportProperties;
      this.ConditionalFormattingConfigurationDetails = reportDetails.ConditionalFormattingConfigurationDetails;
      this.ReportColorConfigurationDetails = reportDetails.ReportColorConfigurationDetails;
      this.dataSourceType = reportDetails.DataSourceType ? reportDetails.DataSourceType : AnalyticsCommonConstants.DataSourceType.Tabular;
      this.productType = reportDetails.ProductType ? reportDetails.ProductType : AnalyticsCommonConstants.ProductType.Reports;
      this.isPercentageEnabledSummaryCard = reportDetails.isPercentageEnabledSummaryCard;
      this.IsSharedReport=reportDetails.IsSharedReport;
      this.SharedReportCount=reportDetails.SharedReportCount;
      this.EnableGlobalSliderFiltering = reportDetails.EnableGlobalSliderFiltering;
        return this;
    }
}
