import { Injectable } from "@angular/core";
import { DashboardConstants } from "@vsDashboardConstants";
import * as wjcGrid from 'wijmo/wijmo.grid';
import { isNumber, find } from 'lodash';
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
declare var userInfo: any;
@Injectable()
export class NumberFormatingService {

    //dont inject commutil cyclic dependency
    constructor(
    ) {

    }

    // This code will execute only in case of number formatting on Olap Grid.
    public NumberFormattingOnOlapGrid(reportDetails: any, event: any) {
        let panel = event.panel, rowIndex = event.row, columnIndex = event.col;       
        if (panel.cellType === wjcGrid.CellType.Cell || panel.cellType == wjcGrid.CellType.RowHeader) {
            let col = panel.columns[columnIndex];
            if (panel.cellType == wjcGrid.CellType.RowHeader) {
                col = panel.grid.collectionView.items[0].$rowKey.fields[columnIndex];
            }
            this.SetNumberFormatting(col, event,reportDetails.lstReportObjectOnValue,true);
        }
    }

    // This code will execute only in case of number formatting on FLEX Grid.
    public NumberFormattingOnFlexGrid(reportDetails: any, event: any) {
        if (event.cell.className.includes('wj-header')) return;
        if (event.grid.cells.cellType === wjcGrid.CellType.Cell) {
            let col = event.grid.cells.columns[event.c];
            if (col.format != undefined && col.format != "")
                event.cell.className = "wj-cell wj-align-right"
            this.SetNumberFormatting(col, event,reportDetails.lstReportObjectOnValue);
        }
    }


    // This function will return the format applied on reporting object according to its configuration value.
    public GetWijmoConfigurationFormat(configValue, filterType) {
        var configFormat = "";
        if (configValue != null && configValue != "") {
            configValue = JSON.parse(configValue);
            var type = find(this.GetConfigurationOptions(DashboardConstants.DecimalConfigurationOptions.ConfigurationType), { id: configValue.type });
            var currencyunit = "";

            if (configValue.type != undefined) {
                if (type == DashboardConstants.NumberConfigurationType.Automatic) {
                    if (filterType == DashboardConstants.FilterType.Measure)
                        return "n0";
                    else
                        return "";
                }
                if (type == DashboardConstants.NumberConfigurationType.Number) {
                    if (configValue.isThousandSeparator == true) {
                        configFormat = "n";
                    } else {
                        configFormat = "f";
                    }
                }
                else if (type == DashboardConstants.NumberConfigurationType.Percentage) {
                    configFormat = "p";
                }
                else if (type == DashboardConstants.NumberConfigurationType.Currency) {
                    configFormat = "c";
                    currencyunit = find(DashboardConstants.CurrencySymbolOptions, { id: configValue.currencyFormat }).unit;
                }
            }

            if (configValue.decimal != undefined) {
                configFormat = configFormat + find(this.GetConfigurationOptions(DashboardConstants.DecimalConfigurationOptions.DecimalOptions), { id: configValue.decimal }).text;
            }
            else {
                configFormat = configFormat + '0';
            }

            if (configValue.displayUnit != undefined) {
                switch (find(DashboardConstants.DisplayUnitOptions, { id: configValue.displayUnit }).id) {
                    case DashboardConstants.DisplayUnitOptions.Thousands.id:
                        configFormat = configFormat + "," + currencyunit + '|K';
                        break;
                    case DashboardConstants.DisplayUnitOptions.Millions.id:
                        configFormat = configFormat + ",," + currencyunit + '|M';
                        break;
                    case DashboardConstants.DisplayUnitOptions.Billions.id:
                        configFormat = configFormat + ",,," + currencyunit + '|B';
                        break;
                    default:
                        configFormat = configFormat + currencyunit + '|';
                        break;
                }
            }
            else {
                configFormat = configFormat + '|';
            }

            if (configValue.negativeFormat != undefined) {
                configFormat = configFormat + '|' + find(this.GetConfigurationOptions(DashboardConstants.DecimalConfigurationOptions.NegativeFormatOptions), { id: configValue.negativeFormat }).id;
            }
        }
        return configFormat;
    }

    public GetConfigurationOptions(val) {
        let FormatOptions = [];
        switch (val) {
            case DashboardConstants.DecimalConfigurationOptions.ConfigurationType:
                FormatOptions = Object.keys(DashboardConstants.NumberConfigurationType).map(key => DashboardConstants.NumberConfigurationType[key]);
                break;
            case DashboardConstants.DecimalConfigurationOptions.DecimalOptions:
                FormatOptions = Object.keys(DashboardConstants.DecimalNumberOptions).map(key => DashboardConstants.DecimalNumberOptions[key]);
                break;
            case DashboardConstants.DecimalConfigurationOptions.NegativeFormatOptions:
                FormatOptions = Object.keys(DashboardConstants.NegativeFormatOptions).map(key => DashboardConstants.NegativeFormatOptions[key]);
                break;
            case DashboardConstants.DecimalConfigurationOptions.DisplayUnitOptions:
                FormatOptions = Object.keys(DashboardConstants.DisplayUnitOptions).map(key => DashboardConstants.DisplayUnitOptions[key]);
                break;
            case DashboardConstants.DecimalConfigurationOptions.CurrencySymbolOptions:
                FormatOptions = Object.keys(DashboardConstants.CurrencySymbolOptions).map(key => DashboardConstants.CurrencySymbolOptions[key]);
                break;
            default:
                break;
        }
        return FormatOptions;
    }

    // This function is used to find out the column index of a cell on Olap grid.
    public generateColumnKey(colKeys: any, ReportObjectName: any) {
        let columnKey: string = '';
        if (colKeys && colKeys.fields && colKeys.fields.length > 0) {
            colKeys.fields.forEach(function (c, i) {
                columnKey = columnKey + (i == 0 ? '' : ';') + c + ':' + colKeys.values[i];
            });
        }
        return columnKey + (columnKey == '' ? '' : ';') + ReportObjectName + ':0;';
    };

    public getCombineColumnValueRowRO(reportDetails: any): Array<any> {
        return reportDetails.lstReportObjectOnRow
            .concat(reportDetails.lstReportObjectOnColumn)
            .concat(reportDetails.lstReportObjectOnValue);
    }

    // This function is used to set the number formatting according to the format applied on reporting object.
    public SetNumberFormatting(col, event,lstReportObjectOnValue,isOlap=false) {
        let cell=event.cell;
        if (col != undefined && col.format != undefined && col.format != "" && col.format.indexOf('|') > 0) {
            let celltext = cell.innerHTML.replace('%', '').replace(',', '');

            // handle negative numbers in currency- override wijmo config
            if (col.format[0] == 'c' && cell.innerHTML[0] == '(' && cell.innerHTML[cell.innerHTML.length - 1] == ')') {
                cell.innerHTML = cell.innerHTML.replace('(', '-').replace(')', '');
            }
            if (isNumber(parseFloat(celltext)) && celltext != '') {
                var colArray = col.format.split('|');
                // for display units 
                if (colArray[1] != '') {
                    cell.innerHTML = cell.innerHTML + colArray[1];
                }
                // for currency symbol replace
                cell.innerHTML = cell.innerHTML.replace("|" + colArray[1] + "|" + colArray[2], "");
                // for negative number format
                if (parseFloat(cell.innerHTML) < 0 || (parseFloat(cell.innerHTML) == 0 && cell.innerHTML[0] == '-') || (col.format[0] == 'c' && cell.innerHTML[0] == '-')) {
                    if (colArray[2] != '') {
                        if (colArray[2] == DashboardConstants.NegativeFormatOptions.option2.id.toString()) {
                            cell.innerHTML = '(' + cell.innerHTML.replace('-', '') + ')';
                        }
                    }
                }
            }
            //to integerate trend measure icons on the trend measure column
            if(lstReportObjectOnValue.length>0 )
            { 
                let panel,rowIndex,columnIndex;
                if(isOlap)
                {
                    panel=event.panel;
                    rowIndex=event.row;
                    columnIndex=event.col;
                }    
                else{
                    panel=event.grid.cells;
                    rowIndex=event.r;
                    columnIndex=event.c;
                }  
                if((panel.cellType == wjcGrid.CellType.Cell))
                {
                    let trendMeasureColumnNameOfDisplayIcon=lstReportObjectOnValue.filter((trendMeasureRo)=>{
                        if(trendMeasureRo.derivedRoType == AnalyticsCommonConstants.DerivedRoType.TrendMeasureType)
                        {
                            var trendMeasureExpression=JSON.parse(trendMeasureRo.expression);
                            if(trendMeasureExpression.DisplayTrendIcon==true)
                            {
                                return trendMeasureRo.displayName;
                            }

                        }
                    });
                    //this is to apply trend measure icons on the derived measure pulled
                    trendMeasureColumnNameOfDisplayIcon.forEach(element => {
                        // we are interested in the cells panel
                        if( panel.columns[columnIndex].binding.indexOf(element.displayName)!==-1){
                            let value = panel.getCellData(rowIndex,columnIndex);
                            if (value != null) {
                                if (value < 0 ) { // negative variation
                                    cell.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16"><path d="M10,9V2H6v7H3l5,6l5-6H10z" fill="#e53935"/></svg>';
                                } else if (value >0.0000000000001) { // positive variation
                                    cell.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16"><path d="M8,1L3,8h3v6h4V8h3L8,1z" fill="#388E3C"/></svg>';
                                }
                            }
                        }
                        
                    });
                }
            }
        }
    }

    public GetCurrencySymbolLocation() {
        let before = true;
        switch (userInfo.UserBasicDetails.Culture) {
            case "de-DE":
            case "fr-FR":
            case "da-DK":
            case "ru-RU":
            case "it-IT":
            case "es-ES":
            case "pl-PL":
            case "sv-SE":
                before = false;

        }
        return before;
    }

    public GetUserInfo() {
        return userInfo;
    }

    public FormatChartTooltip(tooltipValue: any, configurationValue: any) {
        const _userCulutureCode: any = userInfo.UserBasicDetails.Culture;
        if (configurationValue && tooltipValue != "" && tooltipValue != null && (typeof tooltipValue) === "number") {
            let decimalNumber = configurationValue.substring(1, 2);
            let multiplier = configurationValue.split(',').length;
            let currencySymbol = '';
            let splitConfigValue = configurationValue.split('|');
            let finalValue = tooltipValue;
            let isPercent = false;
            let unitDisplay = '';
            let isThousandSeparator = false;
            if (configurationValue[0] == 'p') {
                isPercent = true;
                //finalValue = tooltipValue * 100;
                isThousandSeparator = true;
            }
            else if (configurationValue[0] == 'c') {
                currencySymbol = splitConfigValue[0].substring(1 + multiplier, splitConfigValue[0].length)
                isThousandSeparator = true;
            }
            else if (configurationValue[0] == 'n') {
                isThousandSeparator = true;
            }
            //based on comma characters in configurationValue multilpier is selected
            switch (multiplier) {
                case 2:
                    finalValue = (tooltipValue / 1000);
                    unitDisplay = ' K';
                    break;
                case 3:
                    finalValue = (tooltipValue / 1000000);
                    unitDisplay = ' M'
                    break;
                case 4:
                    finalValue = (tooltipValue / 1000000000);
                    unitDisplay = ' B'
                    break;
            }
            finalValue = finalValue.toFixed(parseInt(decimalNumber));


            if (parseInt(decimalNumber) > 0) {
                finalValue = parseFloat(finalValue).toLocaleString(_userCulutureCode.split('-')[0], { minimumFractionDigits: parseInt(decimalNumber), maximumFractionDigits: parseInt(decimalNumber), useGrouping: isThousandSeparator });
            }
            else {
                finalValue = parseInt(finalValue).toLocaleString(_userCulutureCode.split('-')[0], { minimumFractionDigits: parseInt(decimalNumber), maximumFractionDigits: parseInt(decimalNumber), useGrouping: isThousandSeparator });
            }

            finalValue = currencySymbol + finalValue + unitDisplay;
            if (isPercent) {
                finalValue = finalValue + '%';
            }
            if (tooltipValue < 0 && splitConfigValue[2] == "2") {
                finalValue = '(' + finalValue.replace('-', '') + ')';
            }
            return finalValue;
        }
        else {
            return parseFloat(tooltipValue ? tooltipValue.toFixed(0) : 0).toLocaleString(_userCulutureCode, { minimumFractionDigits: 0 });
        }
    }

    public isNumber(value: any): number {
        return ((value != undefined && value != null && value !== "") && typeof value === "number") ? value : 0;
    }

}
