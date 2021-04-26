import { Injectable } from "@angular/core";
import { IInputCustomReportObject, ICustomFormula, IWijmoGridAggregatedType, IReportProperties, IOpportunityFinderTypeMaster, IOpportunityFinderEOIMaster, IOpportunityFinderCreationObjectInfo } from "../common-interface/app-common-interface";

//Opportunity Finder Creation Specific Models
class InputCustomReportObject implements IInputCustomReportObject {
    CustomFormula: string;
    ReportObjectId: string;
    ReportObjectDefaultValue: number;
    ReportObjectName: string;
    ReportObjectType: number;
    constructor() {
        this.ReportObjectDefaultValue = null;
        this.ReportObjectName = undefined;
        this.ReportObjectType = null;
        this.ReportObjectId = undefined;
        this.CustomFormula = undefined;
    }
}

class CustomFormula implements ICustomFormula {
    CustomFormula: string;
    CustomReportObjectId: string;
    CustomReportFormula: any[];
    CustomReportObjectName: string;
    CustomReportObjectType: number;

    constructor() {
        this.CustomReportFormula = [];
        this.CustomReportObjectName = undefined;
        this.CustomReportObjectType = null;
        this.CustomReportObjectId = undefined;
        this.CustomFormula = undefined;

    }
}

class WijmoGridAggregatedType implements IWijmoGridAggregatedType {
    WijmoGridAggregatedTypeValue: string;
    ReportObjectId: string;
    ReportObjectName: string;
    WijmoGridAggregatedTypeId?: number;

    constructor() {
        this.ReportObjectId = undefined;
        this.ReportObjectName = undefined;
        this.WijmoGridAggregatedTypeId = null;
        this.WijmoGridAggregatedTypeValue = null;
    }
}

class ReportProperties implements IReportProperties {
    IsActionableReport: boolean;
    constructor() {
        this.IsActionableReport = false;
    }
}


class OpportunityFinderTypeMaster implements IOpportunityFinderTypeMaster {
    OpportunityFinderTypeObjectId: string;
    OpportunityFinderTypeName: string;
    InactiveOpportunitiesJson : string;
    AdditionalProps: any;
    constructor() {
        this.OpportunityFinderTypeObjectId = undefined;
        this.OpportunityFinderTypeName = undefined;
        this.InactiveOpportunitiesJson = undefined;
        this.AdditionalProps = undefined;
    }
}


class OpportunityFinderEOIMaster implements IOpportunityFinderEOIMaster {
    EaseOfImplementationObjectId: string;
    EaseOfImplementationName: string;
    constructor() {
        this.EaseOfImplementationName = undefined;
        this.EaseOfImplementationObjectId = undefined;
    }
}

@Injectable()
export class CustomCalculationFormulaModel {
    ReportProperties: ReportProperties;
    InputCustomReportObject: Array<InputCustomReportObject>;
    customCalculatedFormula: Array<CustomFormula>;
    WijmoAggregatedColumns: Array<WijmoGridAggregatedType>;
    MainOpportunityFinderReportData: IOpportunityFinderCreationObjectInfo;
    constructor() {
        this.ReportProperties = {} as any;
        this.InputCustomReportObject = new Array<InputCustomReportObject>();
        this.customCalculatedFormula = new Array<CustomFormula>();
        this.WijmoAggregatedColumns = new Array<WijmoGridAggregatedType>();
        this.MainOpportunityFinderReportData = null;
        return this;
    }
}

@Injectable()
export class OpportunityFinderMaster {
    OpportunityFinderEOIMaster: Array<OpportunityFinderEOIMaster>;
    OpportunityFinderTypeMaster: Array<OpportunityFinderTypeMaster>;
    constructor() {
        this.OpportunityFinderEOIMaster = new Array<OpportunityFinderEOIMaster>();
        this.OpportunityFinderTypeMaster = new Array<OpportunityFinderTypeMaster>();
    }
}

@Injectable()
export class FraudAnomalyMaster {
    FraudAnomalyMaster: Array<FraudAnomalyMaster>;
    constructor() {
        this.FraudAnomalyMaster = new Array<FraudAnomalyMaster>();
    }
}