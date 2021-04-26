import { Injectable, Inject, Optional } from '@angular/core';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { DashletAdditionalProps } from '@vsDashletModels/dashlet-additional-props.model';
import { ReportDetails } from '@vsMetaDataModels/report-details.model';
import { CommonUtilitiesService } from '@vsCommonUtils';


// Class provides instance properties for ReportDetails which will be used for .
// @Injectable()
export class DashletInfo {

    // widgetDataType defines types of Reporting ie., Grid or highchart(Line Chart, ColumnChart).
    widgetDataType: string;

    // True if Dashlet is Editable Otherwise false.
    showEdit: boolean = false;

    // True if Dashlet is Editable Otherwise false.
    isRemoved: boolean = false;

    //Provides title for Dashlet.
    title: string;

    // ReportDetailsId is Unique Identifier for Dashlet Metadata.
    reportDetailsId: string;

    // Report details contains Meta data for Dashlet.
    reportDetails: ReportDetails;

    // Addition Properties in form of Json stored eg., Hieght, Width etc.
    additionalProperties: DashletAdditionalProps;

    // True if Report is Linked otherwise it will known as Unlinked Report.
    // If Report is linked that means Reports and Dashlets will be in Sync.
    isLinkReport: boolean = false;

    // AddedOn : Specify when User has Added Dashlet to View
    addedOn: Date;

    // AddedBy : Specify which User has Added Dashlet to View.
    addedBy: string;

    // To Enable Slider Filter.
    showSliderWidget: boolean;

    // To Specify that apply on Slider Filter is Clicked
    isSliderApplyOn: boolean = false;

    //Adding the WidgetDataRecordLength Attribute to handle config Records
    WidgetDataRecordLength: number;

    //Adding the button Info Record for the Dashboard Apply button
    btnRangeApplyConfig: any;

    //Adding the Report Request Key for the Each of the Report
    reportRequestKey: any;

    //Adding the linked view id for each linked widget
    linkViewId: string;

    constructor() {
        this.title = "";
        this.reportDetailsId = "";
        this.reportDetails = new ReportDetails();
        this.isLinkReport = false;
        this.addedOn = new Date();
        this.addedBy = "";
        this.widgetDataType = "";
        this.showSliderWidget = undefined;
        this.WidgetDataRecordLength = undefined;
        this.btnRangeApplyConfig = undefined;
        this.reportRequestKey = "";
        this.linkViewId = "";
    }

    jsonToObject(dashletInfo: any) {
        this.title = dashletInfo.Title;
        this.reportDetailsId = dashletInfo.ReportDetailsId;
        this.reportDetails = new ReportDetails().jsonToObject(dashletInfo.ReportDetails);
        this.additionalProperties = new DashletAdditionalProps(JSON.parse(dashletInfo.AdditionalProperties));
        this.isLinkReport = dashletInfo.IsLinkReport;
        this.addedOn = new Date(parseInt(dashletInfo.AddedOn.replace("\/Date(", "").replace(")\/", "")));;
        this.addedBy = dashletInfo.AddedBy;
        this.showSliderWidget = undefined;
        this.linkViewId = dashletInfo.LinkViewId;

        /**
         *  Explicitly Sending the null for the other parameters becuase does not rw
         */
        const isChart = new CommonUtilitiesService(null, null, null, null, null,null).getWidgetType(dashletInfo.ReportDetails.ReportViewType) === AnalyticsCommonConstants.WidgetDataType.Chart;
        if (isChart)
            this.widgetDataType = AnalyticsCommonConstants.WidgetDataType.Chart;
        else if (dashletInfo.ReportDetails.ReportViewType == AnalyticsCommonConstants.ReportViewType.Olap)
            this.widgetDataType = AnalyticsCommonConstants.WidgetDataType.Olap;
        else if (dashletInfo.ReportDetails.ReportViewType == AnalyticsCommonConstants.ReportViewType.Flex)
            this.widgetDataType = AnalyticsCommonConstants.WidgetDataType.Flex;
        else if (dashletInfo.ReportDetails.ReportViewType == AnalyticsCommonConstants.ReportViewType.MapChart)
            this.widgetDataType = AnalyticsCommonConstants.WidgetDataType.MapChart;
        else if (dashletInfo.ReportDetails.ReportViewType === AnalyticsCommonConstants.ReportViewType.SummaryCard)
            this.widgetDataType = AnalyticsCommonConstants.WidgetDataType.SummaryCard;
        else if (dashletInfo.ReportDetails.ReportViewType === AnalyticsCommonConstants.ReportViewType.GaugeChart)
            this.widgetDataType = AnalyticsCommonConstants.WidgetDataType.GuageChart;

        return this;
    }

    objectToEntity(dashletInfoObj: DashletInfo, viewId: string) {
        let dashletInfo: any = dashletInfoObj;
        dashletInfo.reportDetails.lstFilterReportObject.forEach(filter => {
            filter.filterCondition.filterConditionObjectId = undefined;
            if (typeof filter.filterValue !== 'string')
                filter.filterValue = '["' + filter.filterValue.join('","') + '"]';
        });
        return {
            Title: dashletInfo.title,
            ReportDetailsId: dashletInfo.reportDetailsId,
            ReportDetails: dashletInfo.reportDetails,
            AdditionalProperties: JSON.stringify(new DashletAdditionalProps(dashletInfo)),
            IsLinkReport: dashletInfo.isLinkReport,
            AddedOn: dashletInfo.addedOn,
            AddedBy: dashletInfo.addedBy,
            ViewId: viewId,
            linkViewId: dashletInfo.LinkViewId
        }
    }
}
