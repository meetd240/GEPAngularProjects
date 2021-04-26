import { Injectable } from '@angular/core';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';


// Class provides instance properties for ReportObject.
// @Injectable()
export class ReportObject {

    // ReportObjectId is Unique Identifier for Reporting Object.
    reportObjectId: string;

    // ReportObjectName provides reporting Object Name.
    reportObjectName: string;

    // ReportObjectType can be Metrics or Attribute.
    reportObjectType: AnalyticsCommonConstants.ReportObjectType;

    // ReportObjectDataType can be String , Int etc.    
    reportObjectDataType: AnalyticsCommonConstants.ReportObjectDataType;

    // LayoutArea is used to show Report Object, is applied on either Row or Column or Value.
    layoutArea: AnalyticsCommonConstants.ReportObjectLayoutArea;

    // FilterType are used in Where Clause, to distinguish Year, Month, Quarter etc.
    filterType: AnalyticsCommonConstants.FilterType;

    // IsOnOrAfterTerm text is used to get next set of Data for Lazy Loading.
    isOnOrAfterTerm?: string;

    // True if Chart Drill/Down feature is enabled, otherwise false.
    isDrill: boolean;

    // Derived Metrics Expression
    expression: string;

    // Derived Metrics tablename
    tableName: string;
    
    // Derived Metrics parentReportObjects
    parentReportObjects: Array<ReportObject>;

    // Link active for Report Objects
    isLinkActive : boolean;
    //IsStandard Filter 
    isStandardFilterRO: boolean;

    //derivedRoType for Derived RO Type
    derivedRoType : number;

    constructor() {
        this.reportObjectId = undefined;
        this.reportObjectName = undefined;
        this.reportObjectType = AnalyticsCommonConstants.ReportObjectType.Attribute;
        this.reportObjectDataType = AnalyticsCommonConstants.ReportObjectDataType.String;
        this.layoutArea = AnalyticsCommonConstants.ReportObjectLayoutArea.Rows;
        this.filterType = AnalyticsCommonConstants.FilterType.MultiSelect;
        this.isOnOrAfterTerm = "";
        this.isDrill = false;
        this.expression = undefined;
        this.tableName = undefined;
        this.parentReportObjects = [] as Array<ReportObject>;
        this.isLinkActive = false;
        this.isStandardFilterRO = false;
        this.derivedRoType = 0;

    }
}
