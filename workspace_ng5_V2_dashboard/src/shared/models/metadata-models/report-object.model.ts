import { Injectable } from '@angular/core';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
 

// Class provides instance properties for ReportObject.
// @Injectable()
export class ReportObject {

    // ReportObjectId is Unique Identifier for Reporting Object.
    reportObjectId: string;

    // ReportObjectName provides reporting Object Name.
    reportObjectName: string;

    // ObjectGroupName is the name of the group to which the object belongs to
    objectGroupName: string;

    // DisplayName is used for displaying headers of report object.
    displayName: string;

    // LayoutArea is used to show Report Object, is applied on either Row or Column or Value.
    layoutArea: AnalyticsCommonConstants.ReportObjectLayoutArea;

    // Sequence number is the order in which the RO is placed in left panel.
    sequenceNumber: number;

    // True is filter can be applied on the RO
    isFilterable: boolean;

    // Set true if the measure is derived from a particular attribute.
    isDerived: boolean;

    // Set true if the RO is not to be shown on left panel
    isTransactional: boolean;

    // Lazy loading will not be available if isSelectAll is true
    isSelectAll: boolean;

    // ReportObjectType can be Metrics or Attribute.
    reportObjectType: AnalyticsCommonConstants.ReportObjectType;

    // ReportObjectDataType can be String , Int etc.    
    reportObjectDataType: AnalyticsCommonConstants.ReportObjectDataType;

    // True if the RO is used for drill to transaction
    isDrillToTransactional: boolean;

    // Order in which transaction order is to be placed in drill to transaction pop up
    drillTransactionOrder: number;

    // Unique Identifier for filter type object.
    filterTypeObjectId: string;

    // FilterType are used in Where Clause, to distinguish Year, Month, Quarter etc.
    filterType: AnalyticsCommonConstants.FilterType;

    //Format key is used to show symbol before the data.
    formatKey: string;

    //Width of report object for drag in olap or flex 
    reportObjectWidth?: number;

    // True if Chart Drill feature is enabled, otherwise false.
    isDrill: boolean;

    // True if Dashlet is Modified and need to Save immediately, otherwise false.
    isDashletModified: boolean;

    // True if Opportunity Finder Default column
    is_DefaultOpportunityFinder: boolean;

    // Derived Mertic Expression
    expression: string;

    // Derived Metric Tablename 
    tableName: string;
    
    //ContactCode for creator of derived measure
    createdBy:number;

    // Derived Metric ParentReportObjects
    parentReportObjects: any;

    // DataSource Object Id of the RO
    dataSource_ObjectId: string;

    // Wijmo grid aggregate type
    wijmoGridAggregatedType: number;

    // opportunity finder Sequence Number
    opportunityFinder_SequenceNumber: number;

    // Custom Formula
    customFormula: string;

    // Number format configuration value.
    ConfigurationValue : string;

    // Link active for Report Objects
    isLinkActive : boolean;

    //isStandardFilterRO for Report Objects
    isStandardFilterRO:boolean;

    //derivedRoType for Derived RO Type
    derivedRoType : number;

    FilterIdentifier: AnalyticsCommonConstants.ViewFilterType;

    FilterList?: any;
    contructor() {
        this.reportObjectId = undefined;
        this.reportObjectName = undefined;
        this.objectGroupName = undefined;
        this.displayName = undefined;
        this.layoutArea = AnalyticsCommonConstants.ReportObjectLayoutArea.None;
        this.sequenceNumber = undefined;
        this.isFilterable = false;
        this.isDerived = false;
        this.isTransactional = false;
        this.isSelectAll = false;
        this.reportObjectType = AnalyticsCommonConstants.ReportObjectType.Attribute;
        this.reportObjectDataType = AnalyticsCommonConstants.ReportObjectDataType.String;
        this.isDrillToTransactional = false;
        this.drillTransactionOrder = 0;
        this.filterTypeObjectId = undefined;
        this.filterType = AnalyticsCommonConstants.FilterType.MultiSelect;
        this.formatKey = undefined;
        this.reportObjectWidth = undefined;
        this.isDrill = false;
        this.isDashletModified = false;
        this.expression = undefined;
        this.tableName = undefined;
        this.createdBy = 0;
        this.parentReportObjects = [] as Array<ReportObject>;
        this.dataSource_ObjectId = undefined;
        this.is_DefaultOpportunityFinder = false;
        this.wijmoGridAggregatedType = undefined;
        this.opportunityFinder_SequenceNumber = undefined;
        this.customFormula = undefined;
        this.ConfigurationValue = undefined;
        this.isLinkActive = false;
        this.isStandardFilterRO = false;
        this.derivedRoType = 0;
        this.FilterList = undefined;
        this.FilterIdentifier = AnalyticsCommonConstants.ViewFilterType.SingleSource;
        return this;
    }

    jsonToObject(reportObject: any) {
        this.reportObjectId = reportObject.ReportObjectId;
        this.reportObjectName = reportObject.ReportObjectName;
        this.objectGroupName = reportObject.ObjectGroupName;
        this.displayName = reportObject.DisplayName;
        this.layoutArea = reportObject.LayoutArea;
        this.sequenceNumber = reportObject.SequenceNumber;
        this.isFilterable = reportObject.IsFilterable;
        this.isDerived = reportObject.IsDerived;
        this.isTransactional = reportObject.IsTransactional;
        this.isSelectAll = reportObject.IsSelectAll;
        this.reportObjectType = reportObject.ReportObjectType;
        this.reportObjectDataType = reportObject.ReportObjectDataType;
        this.isDrillToTransactional = reportObject.IsDrillToTransactional;
        this.drillTransactionOrder = reportObject.DrillTransactionOrder;
        this.filterTypeObjectId = reportObject.FilterTypeObjectId;
        this.filterType = reportObject.FilterType;
        this.formatKey = reportObject.FormatKey;
        this.reportObjectWidth = reportObject.ReportObjectWidth;
        this.isDrill = reportObject.IsDrill;
        this.isDashletModified = false;
        this.expression = reportObject.Expression;
        this.tableName = reportObject.Tablename;
        this.createdBy = reportObject.CreatedBy;
        this.parentReportObjects = reportObject.ParentReportObjects;
        this.dataSource_ObjectId = reportObject.DataSource_ObjectId;
        this.is_DefaultOpportunityFinder = reportObject.Is_DefaultOpportunityFinder;
        this.wijmoGridAggregatedType = reportObject.wijmoGridAggregatedType;
        this.opportunityFinder_SequenceNumber = reportObject.OpportunityFinder_SequenceNumber;
        this.customFormula = reportObject.CustomFormula;
        this.ConfigurationValue = reportObject.ConfigurationValue;
        this.isLinkActive = reportObject.IsLinkActive;
        this.isStandardFilterRO = reportObject.IsStandardFilterRO;
        this.derivedRoType = reportObject.DerivedRoType;
        this.FilterList = reportObject.FilterList;
        this.FilterIdentifier = reportObject.FilterIdentifier;
        
        return this;
    }

}
