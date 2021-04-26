import { Injectable } from "@angular/core";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardConstants } from "@vsDashboardConstants";
import { ReportObject } from "@vsMetaDataModels/report-object.model";
import { ConditionalFormattingConfigDetailsToSave, ConditionalFormatting } from "@vsMetaDataModels/report-conditional-formatting.model";
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { each, isNumber, find, filter, findIndex } from 'lodash';
import { NumberFormatingService } from "@vsNumberFormatingService";
import { DashboardCommService } from "@vsDashboardCommService";


@Injectable()
export class ConditionalFormatingService {

    private rowLevelAggValues = {};
    constructor(
        private _commUtils: CommonUtilitiesService,
        private _numberFormating: NumberFormatingService,
        private _dashboardComService: DashboardCommService
    ) {

    }

    public formatingOnFlexGrid(event: any, reportDetails: any) {
        let rowIndex: number = event.r;
        let columnIndex: number = event.c;
        let cell: any = event.cell;
        let panel:any = event.grid;
        const combineRO = this._commUtils.getCombineColumnValueRowRO(reportDetails);

        // This is to check whether number formatting is applied or not.
        let isNumberFormattingApplied = false;
        combineRO.forEach(element => {
            if (element.ConfigurationValue != '' && element.ConfigurationValue != undefined)
                isNumberFormattingApplied = true;
        });
        if (isNumberFormattingApplied)
            this._numberFormating.NumberFormattingOnFlexGrid(reportDetails, event);

        // Handle code type attributes in case of number formatting
        let reportObjectsOfTypeCode = filter(reportDetails.lstReportObjectOnRow.concat(reportDetails.lstReportObjectOnColumn), (_value) => { return _value.formatKey === DashboardConstants.FormatType.CODE; });
        if (reportObjectsOfTypeCode && reportObjectsOfTypeCode.length > 0) {
            event.grid.cells.columns.map((_value, _index) => {
                if (findIndex(reportObjectsOfTypeCode, { displayName: _value._hdr }) != -1) {
                    _value.format = DashboardConstants.FormatTypeCODE.FormatTypeForCode;
                }
            });
        }

        let conditionalFormattingConfigurationDetails = reportDetails.ConditionalFormattingConfigurationDetails;
        if (conditionalFormattingConfigurationDetails != '') {

            let cfObj: ConditionalFormattingConfigDetailsToSave;
            if (cell.className.includes('wj-header')) return;
            if (conditionalFormattingConfigurationDetails != '') {
                cfObj = new ConditionalFormattingConfigDetailsToSave(JSON.parse(conditionalFormattingConfigurationDetails));
            }
            /**Check if conditional formatting formula not disabled for current product*/
            let forumulas = this._dashboardComService.conditionalFormattingFormulas.filter(f => f.disabledProducts.indexOf(reportDetails.productType) < 0);
            /**If betweenformula condition is not used for current widget no need to calculate aggregate values */
            let isAppliedBasedOnFormula: boolean = forumulas.length > 0 && cfObj.repoObjectsListConditionalFormatting.some(r => r.cf.some(c => c.formatCondition == DashboardConstants.CellFormatConditions.betweenRowLevelFormula));
            if (event.grid.cells.cellType === wjcGrid.CellType.Cell) {
                cell.style.background = '';
                cell.style.color = '';
            }
            if (!cfObj.enableCF)
                return;            

            if (cfObj.isReportUpdated)
                this.setColumnIndexOnGrid(event, cfObj, combineRO);
            let reportObjectFormatConfigLst = cfObj.repoObjectsListConditionalFormatting.filter(function (ro) {
                return (ro.columnIndexOnGridTarget >= 0 && ro.columnIndexOnGridTarget == columnIndex && event.grid.cells.cellType == ro.cellType);
            });
            if (!reportObjectFormatConfigLst.length)
                return;
            reportObjectFormatConfigLst[0].cf = reportObjectFormatConfigLst[0].cf.filter(cfRow => cfRow.columnIndexOnGridBase >= 0);
            if (!reportObjectFormatConfigLst[0].cf.length)
                return cell;
            let activeCellRow_1 = event.grid.cells.rows[rowIndex];
            reportObjectFormatConfigLst[0].cf.slice().reverse().forEach(cfRow => {
                let tempCurrentBasedOnRo = combineRO.filter((cRo: any) => { return cRo.reportObjectId == cfRow.cfBasedOn.reportObjectId; })[0];
                let col = event.grid.cells.columns[cfRow.columnIndexOnGridBase];
                if (cfRow.color == '#ffffff' && cfRow.textcolor == '#000000')
                    return cell;
                if (cfRow.textRuleValue == "" && reportObjectFormatConfigLst[0].cf[0].isTextBasedCf && !this._commUtils.IsEmptyOrNullConditions(cfRow.formatCondition))
                    return cell;
                    //Calculate Row level aggregated values
                if (tempCurrentBasedOnRo.layoutArea == DashboardConstants.ReportObjectLayoutArea.Values && reportDetails.lstReportObjectOnValue != undefined && reportDetails.lstReportObjectOnValue.length > 0 && isAppliedBasedOnFormula)
                    this.getRowLevelAggValuesForMeasureColumn(panel.rows[rowIndex].dataItem, rowIndex, tempCurrentBasedOnRo.displayName, reportDetails);
                if (col != undefined) {
                    let currentCellUnformattedValue = activeCellRow_1._data[cfRow.cfBasedOn.displayName];
                    try {
                        let wijmoNUmberFormat = wjcCore.culture.Globalize.numberFormat;
                        currentCellUnformattedValue = typeof (currentCellUnformattedValue) == 'string' && !reportObjectFormatConfigLst[0].cf[0].isTextBasedCf ? parseFloat(currentCellUnformattedValue.toString().split(wijmoNUmberFormat[',']).join('').split(wijmoNUmberFormat['.']).join('.')) : currentCellUnformattedValue;
                    }
                    catch (e) { return; };
                    let activeCellValue: number = reportObjectFormatConfigLst[0].cf[0].isTextBasedCf ? currentCellUnformattedValue : this._commUtils.formatNumberByGridConfiguration(currentCellUnformattedValue, col.format);
                    if (activeCellValue == null || isNaN(activeCellValue) && !reportObjectFormatConfigLst[0].cf[0].isTextBasedCf)
                        return;
                    if (!reportObjectFormatConfigLst[0].cf[0].isTextBasedCf) {
                        switch (cfRow.formatCondition) {
                            case DashboardConstants.CellFormatConditions.GreaterThan: {
                                if (activeCellValue > cfRow.ruleValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.LessThan: {
                                if (activeCellValue < cfRow.ruleValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.GreaterThanOrEqualTo: {
                                if (activeCellValue >= cfRow.ruleValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.LessThanOrEqualTo: {
                                if (activeCellValue <= cfRow.ruleValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.betweenRowLevelFormula: {
                                let toValue = null, fromValue = null;
                                let fromFormulaObj = forumulas.filter(exp => exp.formulaId == cfRow.betweenFormulas.fromFormula.formulaId)[0];
                                let toFormulaObj = forumulas.filter(exp => exp.formulaId == cfRow.betweenFormulas.toFormula.formulaId)[0];
                                if (fromFormulaObj && toFormulaObj) {
                                    let toExpression = toFormulaObj.expression;
                                    let fromExpression = fromFormulaObj.expression;
                                    let currentPageFormaulaKey = reportDetails.reportRequestKey + '-' + reportDetails.pageIndex;
                                    let aggValues = this.rowLevelAggValues[currentPageFormaulaKey][rowIndex][cfRow.cfBasedOn.displayName];
                                    for (let aggfunc in aggValues) {
                                        let aggVal = this._commUtils.formatNumberByGridConfiguration(aggValues[aggfunc], col.format).toString();
                                        if (eval(aggVal) < 0)
                                            aggVal = '(' + aggVal + ')';
                                        toExpression = toExpression.replace(new RegExp(aggfunc, 'g'), aggVal);
                                        fromExpression = fromExpression.replace(new RegExp(aggfunc, 'g'), aggVal);
                                    }
                                    fromValue = this._commUtils.evaluateFormulaExpression(fromExpression);
                                    toValue = this._commUtils.evaluateFormulaExpression(toExpression);
                                }
                                if (activeCellValue >= fromValue && activeCellValue <= toValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.Between: {
                                if (activeCellValue >= cfRow.between.betweenFromValue && activeCellValue <= cfRow.between.betweenToValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.EqualTo: {
                                if (activeCellValue == cfRow.ruleValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.NotEqualTo: {
                                if (activeCellValue != cfRow.ruleValue) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.TopN:
                            case DashboardConstants.CellFormatConditions.TopNPercent: {
                                if (activeCellValue >= this._commUtils.formatNumberByGridConfiguration(cfRow.minValue, col.format)) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            case DashboardConstants.CellFormatConditions.LowestN:
                            case DashboardConstants.CellFormatConditions.LowestNPercent: {
                                if (activeCellValue <= this._commUtils.formatNumberByGridConfiguration(cfRow.maxValue, col.format)) {
                                    cell.style.background = cfRow.color;
                                    cell.style.color = cfRow.textcolor;
                                }
                                break;
                            }
                            default: {
                                cell.style.background = cfRow.color;
                                cell.style.color = cfRow.textcolor;
                            }
                        }
                    }
                    else {
                        this._commUtils.setTextBasedCellFormattingByCondition(
                            cfRow, activeCellValue,
                            cell,
                            cfObj.repoObjectsListConditionalFormatting.filter(function (cfRo) {
                                return cfRo.reportObjectId == cfRow.cfBasedOn.reportObjectId;
                            })[0],reportDetails.reportViewType);
                    }
                }
            });
        }
    }

    public setColumnIndexOnGrid = (panel, cfObj, combineRO) => {
        cfObj.isReportUpdated = false;
        cfObj.repoObjectsListConditionalFormatting.forEach(cfd => {
            cfd.columnIndexOnGridTarget = panel.grid.cells._cols.filter(x => x._hdr == cfd.displayName)[0] ? panel.grid.cells._cols.indexOf(panel.grid.cells._cols.filter(x => x._hdr == cfd.displayName)[0]) : -1;
            cfd.cellType = wjcGrid.CellType.Cell;
            cfd.cf.forEach(f => {
                let RO: ReportObject = combineRO.filter(r => r.reportObjectId == f.cfBasedOn.reportObjectId)[0];
                if (!RO)
                    return;
                f.columnIndexOnGridBase = panel.grid.cells._cols.filter(x => x._hdr == RO.displayName)[0] ? panel.grid.cells._cols.indexOf(panel.grid.cells._cols.filter(x => x._hdr == RO.displayName)[0]) : -1;
            });
        });
    }

    public formatingOnOlapGrid(s: any, event: any, reportDetails: any) {
        let panel = event.panel, cell = event.cell, rowIndex = event.row, columnIndex = event.col;
        let currentBasedOnRo: any = this._commUtils.getCombineColumnValueRowRO(reportDetails);
        let cfObj: ConditionalFormattingConfigDetailsToSave;
        let reportObjectsOfTypeCode = filter(reportDetails.lstReportObjectOnRow.concat(reportDetails.lstReportObjectOnColumn), (_value) => { return _value.formatKey === DashboardConstants.FormatType.CODE; });

        // This will check if number formatting is applied on olap grid.
        let isNumberFormattingApplied = false;

        currentBasedOnRo.forEach(element => {
            if ((element.ConfigurationValue != '' && element.ConfigurationValue != undefined) || reportObjectsOfTypeCode.length > 0)
                isNumberFormattingApplied = true;
        });
        if (isNumberFormattingApplied)
            this._numberFormating.NumberFormattingOnOlapGrid(reportDetails, event);

        if (reportDetails.ConditionalFormattingConfigurationDetails != '') {
            cfObj = new ConditionalFormattingConfigDetailsToSave(JSON.parse(reportDetails.ConditionalFormattingConfigurationDetails));
            /**Check if conditional formatting formula not disabled for current product*/
            let forumulas = this._dashboardComService.conditionalFormattingFormulas.filter(f => f.disabledProducts.indexOf(reportDetails.productType) < 0);
            /**If betweenformula condition is not used for current widget no need to calculate aggregate values */
            let isAppliedBasedOnFormula: boolean = forumulas.length > 0 && cfObj.repoObjectsListConditionalFormatting.some(r => r.cf.some(c => c.formatCondition == DashboardConstants.CellFormatConditions.betweenRowLevelFormula));
            cell.style.background = '';
            cell.style.color = '';
            let isAttributeOnlyInRows = false;
            //Handle Error while fetching key information
            try {
                if (reportDetails.lstReportObjectOnColumn.length > 0 || panel.cellType == wjcGrid.CellType.Cell)
                    panel.grid.getKeys(rowIndex, columnIndex);
                else {
                    isAttributeOnlyInRows = true;
                    panel.grid.rows[0]._data.$rowKey._names;
                    panel.grid.rows[0]._data.$rowKey._vals;
                }
            }
            catch (e) {
                return;
            }
            if (!cfObj.enableCF || (wjcCore.hasClass(cell, 'wj-aggregate') && panel.cellType == wjcGrid.CellType.Cell && !cfObj.enableCfOnSubtotal))
                return cell;
            if (wjcCore.hasClass(cell, 'wj-aggregate') && rowIndex == panel.rows.length - 1)
                return cell;
            var reportObjectFormatConfigLst = new Array();
            //get Format Configuration for the reporting objects visible on the grid
            if (panel.cellType == wjcGrid.CellType.Cell) {
                if (!panel.columns.getColumn(columnIndex)._binding)
                    return;
                //measure type RO
                reportObjectFormatConfigLst = (
                    cfObj.repoObjectsListConditionalFormatting.filter(
                        (roFormat: any, roFormatKey: number) => {
                            return this._numberFormating.generateColumnKey(
                                panel.grid.getKeys(rowIndex, columnIndex).colKey,
                                this.getRoNameFromReportROlistByRoId(roFormat.reportObjectId, reportDetails)) === panel.columns.getColumn(columnIndex)._binding._path;
                        }
                    ));
            }
            else {
                //number type attribute
                try {
                    reportObjectFormatConfigLst = (
                        cfObj.repoObjectsListConditionalFormatting.filter(
                            (roFormat: any, roFormatKey: number) => {
                                if (isAttributeOnlyInRows) {
                                    //If Attributes are present only in rows
                                    return panel.grid.rows[rowIndex]._data.$rowKey.fieldNames.indexOf(this.getRoNameFromReportROlistByRoId(roFormat.reportObjectId,reportDetails)) === columnIndex;
                                }
                                else {
                                    if (roFormat.layoutArea === DashboardConstants.ReportObjectLayoutArea.Rows && panel.cellType == wjcGrid.CellType.RowHeader)
                                        return panel.grid.getKeys(rowIndex, columnIndex).rowKey.fields.indexOf(this.getRoNameFromReportROlistByRoId(roFormat.reportObjectId,reportDetails)) === columnIndex;
                                    else if(panel.cellType == wjcGrid.CellType.ColumnHeader)
                                        return panel.grid.getKeys(rowIndex, columnIndex).colKey.fields.indexOf(this.getRoNameFromReportROlistByRoId(roFormat.reportObjectId,reportDetails)) === rowIndex;
                                }
                            }
                        ));
                }
                catch (e) {
                    reportObjectFormatConfigLst = new Array();
                }
            }
            if (!reportObjectFormatConfigLst.length)
                return cell;
            //Remove filter conditions from list whose "Based On" RO is not present on the grid
            reportObjectFormatConfigLst[0].cf = reportObjectFormatConfigLst[0].cf.filter(
                (cfRow: any, cfRowKey: number) => {
                    let tempBasedOnRo = currentBasedOnRo.filter((cRo: any) => { return cRo.reportObjectId == cfRow.cfBasedOn.reportObjectId; })[0];

                    if (panel.cellType == wjcGrid.CellType.Cell) {
                        if (!panel.columns.getColumn(panel.columns.indexOf(
                            this._numberFormating.generateColumnKey(panel.grid.getKeys(rowIndex, columnIndex).colKey, this.getRoNameFromReportROlistByRoId(cfRow.cfBasedOn.reportObjectId,reportDetails))))._binding)
                            return false;
                        if (
                            this._numberFormating.generateColumnKey(
                                panel.grid.getKeys(rowIndex, columnIndex).colKey, this.getRoNameFromReportROlistByRoId(cfRow.cfBasedOn.reportObjectId,reportDetails)) === panel.columns.getColumn(panel.columns.indexOf(
                                    this._numberFormating.generateColumnKey(panel.grid.getKeys(rowIndex, columnIndex).colKey, this.getRoNameFromReportROlistByRoId(cfRow.cfBasedOn.reportObjectId,reportDetails))))._binding._path)
                            return true;
                    }
                    else {
                        if (isAttributeOnlyInRows) {
                            //If Attributes are present only in rows
                            return panel.grid.rows[rowIndex]._data.$rowKey.fieldNames.indexOf(tempBasedOnRo.displayName) > -1;
                        }
                        else {
                            return panel.grid.getKeys(rowIndex, columnIndex)[
                                tempBasedOnRo.layoutArea === DashboardConstants.ReportObjectLayoutArea.Rows ? 'rowKey' : 'colKey'].fields.indexOf(tempBasedOnRo.displayName) > -1;
                        }
                    }
                });
            if (!reportObjectFormatConfigLst[0].cf.length)
                return cell;
            //Reversing the foreach traverse to give high priority to top most format condition in the list
            each(reportObjectFormatConfigLst[0].cf.slice().reverse(),
                (cfRow: any, cfRowKey: number) => {
                    let tempCurrentBasedOnRo = currentBasedOnRo.filter((cRo: any) => { return cRo.reportObjectId == cfRow.cfBasedOn.reportObjectId; })[0];
                    let basedOnColumnIndex = null;
                    if (cfRow.color == '#ffffff' && cfRow.textcolor == '#000000')
                        return cell;
                    if (cfRow.textRuleValue == "" && reportObjectFormatConfigLst[0].cf[0].isTextBasedCf && !this._commUtils.IsEmptyOrNullConditions(cfRow.formatCondition))
                        return cell;
                    //Calculate Row level aggregated values
                    if (tempCurrentBasedOnRo.layoutArea == DashboardConstants.ReportObjectLayoutArea.Values && reportDetails.lstReportObjectOnValue != undefined && reportDetails.lstReportObjectOnValue.length > 0 && isAppliedBasedOnFormula) {
                        this.getRowLevelAggValuesForMeasureColumn(panel.rows[rowIndex].dataItem, rowIndex, tempCurrentBasedOnRo.displayName, reportDetails);
                    }
                    //BasedOn Cell value for current target cell
                    let currentCellUnFormattedValue = null;
                    if (panel.cellType == wjcGrid.CellType.Cell) {
                        //Generate BasedOn RO Column key to fetch value and column details
                        var basedOnColumnKey = this._numberFormating.generateColumnKey(panel.grid.getKeys(rowIndex, columnIndex).colKey, this.getRoNameFromReportROlistByRoId(cfRow.cfBasedOn.reportObjectId,reportDetails));
                        //Correct Index of BasedOn column key
                        basedOnColumnIndex = panel.columns.indexOf(basedOnColumnKey);
                        currentCellUnFormattedValue = panel.getCellData(rowIndex, basedOnColumnIndex);
                    }
                    else {
                        if (
                            (
                                reportObjectFormatConfigLst[0].layoutArea === DashboardConstants.ReportObjectLayoutArea.Columns &&
                                panel.cellType === wjcGrid.CellType.RowHeader
                            ) || (
                                reportObjectFormatConfigLst[0].layoutArea === DashboardConstants.ReportObjectLayoutArea.Rows &&
                                panel.cellType === wjcGrid.CellType.ColumnHeader
                            ) || panel.cellType === wjcGrid.CellType.TopLeft
                        ) {
                            //return cell if it is topleft cell and celltype is different than target cells celltype
                            return;
                        }
                        if (tempCurrentBasedOnRo.layoutArea == reportObjectFormatConfigLst[0].layoutArea) {
                            //If Based RO and Target RO have same Layout Area
                            if (isAttributeOnlyInRows) {
                                basedOnColumnIndex = panel.grid.rows[rowIndex]._data.$rowKey._names.indexOf(tempCurrentBasedOnRo.displayName);
                                currentCellUnFormattedValue = panel.grid.rows[rowIndex]._data.$rowKey._vals[panel.grid.rows[rowIndex]._data.$rowKey._names.indexOf(tempCurrentBasedOnRo.displayName)];
                            }
                            else {
                                basedOnColumnIndex = panel.grid.getKeys(rowIndex, columnIndex)
                                [tempCurrentBasedOnRo.layoutArea == DashboardConstants.ReportObjectLayoutArea.Columns ? 'colKey' : 'rowKey'].fields.indexOf(tempCurrentBasedOnRo.displayName);

                                currentCellUnFormattedValue = panel.grid.getKeys(rowIndex, columnIndex)
                                [tempCurrentBasedOnRo.layoutArea == DashboardConstants.ReportObjectLayoutArea.Columns ? 'colKey' : 'rowKey'].values[basedOnColumnIndex];
                            }
                        }
                        else {
                            //If Based RO and Target RO dont have same layout area
                            let dataInfo_1 = panel.grid.rows[rowIndex]._data;
                            let dataProp = Object.getOwnPropertyNames(dataInfo_1).filter((prop: any, _propKey: number) => { return prop != "$rowKey"; }).filter(function (val) { return dataInfo_1[val] != null; });
                            if (dataProp.length > 0) {
                                cfRow.ruleValue = (
                                    cfRow.formatCondition === DashboardConstants.CellFormatConditions.LowestN
                                    || cfRow.formatCondition === DashboardConstants.CellFormatConditions.LowestNPercent
                                ) ? cfRow.maxValue : (
                                    cfRow.formatCondition === DashboardConstants.CellFormatConditions.TopN
                                    || cfRow.formatCondition === DashboardConstants.CellFormatConditions.TopNPercent
                                ) ? cfRow.minValue : cfRow.ruleValue;
                                for (var i = 0; i < dataProp.length; i++) {
                                    let cellValueToCheck: any = dataProp[i].split(tempCurrentBasedOnRo.displayName + ":")[1].split(';')[0];
                                    if (!isNaN(cellValueToCheck) && this._commUtils.checkCellFormattingConditionForGivenValue(
                                        cfRow.formatCondition, cellValueToCheck, cfRow.ruleValue, !cfRow.between ? cfRow.between.betweenFromValue : 0, !cfRow.between ? cfRow.between.betweenToValue : 0)
                                    ) {
                                        cell.style.background = cfRow.color;
                                        cell.style.color = cfRow.textcolor;
                                        break;
                                    }
                                }
                            }
                            return;
                        }
                    }
                    try {
                        //Handle globalization while getting value
                        var wijmoNumberFormat = wjcCore.culture.Globalize.numberFormat;
                        currentCellUnFormattedValue = typeof (currentCellUnFormattedValue) == 'string' && !reportObjectFormatConfigLst[0].cf[0].isTextBasedCf ? parseFloat(currentCellUnFormattedValue.toString().split(wijmoNumberFormat[',']).join('').split(wijmoNumberFormat['.']).join('.')) : currentCellUnFormattedValue;
                    }
                    catch (e) {
                        return;
                    }
                    ;
                    let format = undefined;
                    try {
                        format = (tempCurrentBasedOnRo.layoutArea === DashboardConstants.ReportObjectLayoutArea.Rows ||
                            panel.cellType == wjcGrid.CellType.Cell) ? panel.columns[basedOnColumnIndex].format : undefined;
                    }
                    catch (e) {
                        format = undefined;
                    }
                    let activeCellValue = reportObjectFormatConfigLst[0].cf[0].isTextBasedCf ? currentCellUnFormattedValue : this._commUtils.formatNumberByGridConfiguration(currentCellUnFormattedValue, format);
                    if (activeCellValue == null || isNaN(activeCellValue) && !reportObjectFormatConfigLst[0].cf[0].isTextBasedCf)
                        return;
                    if (reportObjectFormatConfigLst[0].cf[0].isTextBasedCf){
                        cell = this._commUtils.setTextBasedCellFormattingByCondition(
                            cfRow, activeCellValue,
                            cell,
                            cfObj.repoObjectsListConditionalFormatting.filter(function (cfRo) {
                                return cfRo.reportObjectId == cfRow.cfBasedOn.reportObjectId;
                            })[0], reportDetails.reportViewType);
                    }
                    else {
                        if (cfRow.formatCondition == DashboardConstants.CellFormatConditions.betweenRowLevelFormula) {
                            /**Check if active conditional formulas are applied on current widget */
                            let fromFormulaObj = forumulas.filter(exp => exp.formulaId == cfRow.betweenFormulas.fromFormula.formulaId)[0];
                            let toFormulaObj = forumulas.filter(exp => exp.formulaId == cfRow.betweenFormulas.toFormula.formulaId)[0];
                            cfRow.between = {};
                            if (cfRow.betweenFormulas && fromFormulaObj && toFormulaObj) {
                                let toExpression = toFormulaObj.expression;
                                let fromExpression = fromFormulaObj.expression;
                                let currentPageFormaulaKey = reportDetails.reportRequestKey + '-' + reportDetails.pageIndex;
                                /**Fetch current row aggregate values from rowLevelAggValues*/
                                let aggValues = this.rowLevelAggValues[currentPageFormaulaKey][rowIndex][cfRow.cfBasedOn.displayName];
                                for (let aggfunc in aggValues) {
                                    let aggVal = this._commUtils.formatNumberByGridConfiguration(aggValues[aggfunc], format).toString();
                                    if (eval(aggVal) < 0)
                                        aggVal = '(' + aggVal + ')';
                                    toExpression = toExpression.replace(new RegExp(aggfunc, 'g'), aggVal);
                                    fromExpression = fromExpression.replace(new RegExp(aggfunc, 'g'), aggVal);
                                }
                                /**evaluate forulas to calculate result */
                                cfRow.between.betweenFromValue = this._commUtils.evaluateFormulaExpression(fromExpression);
                                cfRow.between.betweenToValue = this._commUtils.evaluateFormulaExpression(toExpression);
                            } else {
                                cfRow.between.betweenFromValue = null;
                                cfRow.between.betweenToValue = null;
                            }
                        }
                        cell = this._commUtils.setCellFormattingByCondition(
                            cfRow, activeCellValue,
                            cell,
                            cfObj.repoObjectsListConditionalFormatting.filter(function (cfRo) {
                                return cfRo.reportObjectId == cfRow.cfBasedOn.reportObjectId;
                            })[0], format);
                    }
                });
            return cell;
        }
    }
    public formatingOnSummaryCard(reportDetails: any, cardValue: number) {
        let currentBasedOnRo: any = this._commUtils.getCombineColumnValueRowRO(reportDetails);
        let cfObj: ConditionalFormattingConfigDetailsToSave;
        let colorSet : boolean = false;
        let color = { 'backgroundColor': DashboardConstants.SummaryCardColors.backgroundColor, 'valueColor':DashboardConstants.SummaryCardColors.valueColor };
        if (reportDetails.ConditionalFormattingConfigurationDetails != '') {
            cfObj = new ConditionalFormattingConfigDetailsToSave(JSON.parse(reportDetails.ConditionalFormattingConfigurationDetails));
            var reportObjectFormatConfigLst = new Array();
            if(!cfObj.repoObjectsListConditionalFormatting.length)
               return color;
            reportObjectFormatConfigLst = cfObj.repoObjectsListConditionalFormatting.filter((cRo: any) => { return cRo.layoutArea == DashboardConstants.ReportObjectLayoutArea.Values; });
            if (!cfObj.enableCF)
                return color;
            if (!reportObjectFormatConfigLst.length && !reportObjectFormatConfigLst[0].cf.length)
                return color;
            //Reversing the foreach traverse to give high priority to top most format condition in the list
            each(reportObjectFormatConfigLst[0].cf.slice().reverse(),
                (cfRow: any, cfRowKey: number) => {
                    if (!colorSet) {
                        if (cardValue == null || isNaN(cardValue))
                            return color;
                        if (cfRow.color == '#ffffff' && cfRow.textcolor == '#000000')
                            return color;                        
                        color = this._commUtils.setCellFormattingByCondition(
                            cfRow, cardValue, null, null, null);
                        /*Added for CLI-153978 to ensure if a cf condition is satisfied not to execute other cf rules as it is not needed */
                        if (color.backgroundColor != DashboardConstants.SummaryCardColors.backgroundColor || color.valueColor != DashboardConstants.SummaryCardColors.valueColor)
                            colorSet = true;
                    }
                });
        }
        return color;
    }
    public getRoNameFromReportROlistByRoId(roId: string, reportDetails: any) {
        let ro = this._commUtils.getCombineColumnValueRowRO(reportDetails).filter(ro => ro.reportObjectId == roId)[0];
        if (!ro)
            return '';
        return ro.displayName;
    }

    private getRowLevelAggValuesForMeasureColumn(row: any, rowIndex: number, currentMeasureColumn: string, reportObjDetails:any) {
        if (row == undefined)
            return;
        if (reportObjDetails.pageIndex == 1 && rowIndex == 0)
            this.rowLevelAggValues = {};
        let currentPageFormaulaKey = reportObjDetails.reportRequestKey + '-' + reportObjDetails.pageIndex;
        //Check if aggregated values present for current report page else set is as blank array
        if (Object.keys(this.rowLevelAggValues).length == 0 || Object.keys(this.rowLevelAggValues).some(mm => mm.indexOf(currentPageFormaulaKey) < 0)) {
            this.rowLevelAggValues[currentPageFormaulaKey] = [];
        }
        let currentPageFormulaArray: Array<any> = this.rowLevelAggValues[currentPageFormaulaKey];
        //If aggregated values already present for current row then return
        if (currentPageFormulaArray[rowIndex] != undefined && currentPageFormulaArray[rowIndex][currentMeasureColumn] != undefined)
            return;
        let obj = {};
        //Remove other properties which are not needed for aggregated calculation
        for (let o in row) {
            if ((o.indexOf(currentMeasureColumn) > 0 || reportObjDetails.lstReportObjectOnColumn.length == 0) && row[o] != null && !isNaN(row[o]) && row[o] !== '') {
                obj[o] = row[o];
            }
        }
        //If aggregated values not present then return
        if (Object.keys(obj).length == 0)
            return;
        //Get aggregated object for current row
        let calObj = this._commUtils.getAggregationOfObjectValues(obj)
        //If object already present for current row then push it in object else add new object at current row index
        if (currentPageFormulaArray[rowIndex] != undefined) {
            currentPageFormulaArray[rowIndex][currentMeasureColumn] = calObj;
        } else {
            currentPageFormulaArray[rowIndex] = { [currentMeasureColumn]: calObj }
        }
        //Add current row aggregated values to conditional formatting config object
        this.rowLevelAggValues[currentPageFormaulaKey][rowIndex] = currentPageFormulaArray[rowIndex];
    }
}
