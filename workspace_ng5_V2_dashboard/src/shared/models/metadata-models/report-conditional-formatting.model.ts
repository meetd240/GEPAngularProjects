import { Injectable } from '@angular/core';
import { ReportObject } from './report-object.model';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

// @Injectable()
export class ConditionalFormattingConfigDetailsToSave {
    //Apply conditionalFormatting at subtotal level or nth level
    enableCfOnSubtotal: Boolean = false;
    disableApplyToSubtotals = false;
    //Enable Disable Conditional formatting at report level
    enableCF = true;
    isReportUpdated = false;
    repoObjectsListConditionalFormatting: Array<ReportObjectFormatCondition> = new Array<ReportObjectFormatCondition>();
    repoObjectsListConditionalFormattingNotPresentOnGrid: ReportObjectFormatCondition[];
    constructor(obj: any) {
        this.repoObjectsListConditionalFormatting = obj.repoObjectsListConditionalFormatting;
        this.enableCF = obj.enableCF;
        this.disableApplyToSubtotals = obj.disableApplyToSubtotals;
        this.enableCfOnSubtotal = obj.enableCfOnSubtotal;
        this.isReportUpdated =true;
    }
}

export class ConditionalFormattingConfigDetails extends ConditionalFormattingConfigDetailsToSave {
    repoObjectsListConditionalFormattingNotPresentOnGrid: Array<ReportObjectFormatCondition> = new Array<ReportObjectFormatCondition>();
    selectedCFValue: ReportObject = new ReportObject();
    selectedCFIndex = 0;
    isConditionalFormattingEnabledForSelectedDatasource = true;
    showConditionalFormattingIcon: boolean = true;
}

export interface ReportObjectFormatCondition extends ReportObject {
    active: Boolean;
    repoObjs: {};
    cf: Array<ConditionalFormatting>;
    columnIndexOnGridTarget: number;
    cellType: number;
}

export class ConditionalFormatting {
    cfBasedOn: { [key: string]: string };
    color: string = '#ffffff';;
    textcolor: string = '#000000';
    isChecked: boolean = false;
    ruleValue: number = 0;
    textRuleValue: string = "";
    between: { betweenFromValue: 0, betweenToValue: 0 };
    columnIndexOnGridBase: number;
    isTextBasedCf: boolean = false;
    formatCondition: AnalyticsCommonConstants.CellFormatConditions = this.isTextBasedCf ? AnalyticsCommonConstants.CellFormatConditions.contains : AnalyticsCommonConstants.CellFormatConditions.GreaterThan;
    minValue: number;
    maxValue: number;
    betweenFormulas: {
        fromFormula: { [key: string]: string }, toFormula: { [key: string]: string }
    };
}

export interface IConditionalFormattingFormula {
    formulaId: string,
    formulaName: string,
    expression: string,
    disabledProducts: string
}
