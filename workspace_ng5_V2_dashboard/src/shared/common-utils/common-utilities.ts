import { Injectable, OnDestroy, OnInit, ComponentFactory, Inject, ComponentFactoryResolver, ViewContainerRef, TemplateRef } from "@angular/core";
import { AppConstants, NotificationService } from "smart-platform-services";
import { ToasterService } from 'smart-toast';
import { StaticModuleLoaderService } from 'smart-module-loader';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DashboardConstants } from "@vsDashboardConstants";
import { IReportingObjectMultiDataSource, ITabInfo } from "@vsCommonInterface";
import { Observable } from "rxjs/Observable";
// import { visionModulesManifest } from './../../../modules-manifest';
import { DatePipe } from "@angular/common";
import { some, map, findKey, filter, each, values } from "lodash";
import { productConfiguration, productName, productTitle, ActionMenuConditions } from "../../configuration/productConfig";
import { IProductConfiguration } from "@vsDashboardInterface";
import { NumberFormatingService } from "@vsNumberFormatingService";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import canvg, * as Canvg from 'canvg';
import { GlobalSliderObject } from "@vsMetaDataModels/global-slider-object.model";
declare var supplierScorecardConfig: any;


@Injectable()
export class CommonUtilitiesService implements OnInit, OnDestroy {

    public _globalLoaderbehaviorSubject$ = new BehaviorSubject<any>(
        this.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartGlobalLoaderConfig));
    public _widgetCards: any;
    private containerRef: ViewContainerRef;
    private templateRef: TemplateRef<any>;

    constructor(
        private _notificationService: NotificationService,
        private _toasterService: ToasterService,
        private _numberFormattingSerice: NumberFormatingService,
        private _datePipe: DatePipe,
        private _compFactResolver: ComponentFactoryResolver,
        private _appConstants: AppConstants
    ) {
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this._globalLoaderbehaviorSubject$.unsubscribe();
    }

    public hasMinimumActiveWidgetInView(noOfWidgets: number = 1): boolean {
        return filter(this._widgetCards, card => !card.isRemoved).length > noOfWidgets;
    }



    registerPopupOutlets(containerRef: ViewContainerRef, templateRef: TemplateRef<any>) {
        this.containerRef = containerRef;
        this.templateRef = templateRef;
    }

    /**
     * load a module defined using SMI at the specified manifest path utilising the passed config
     * @param containerRef Container reference to inject the template
     * @param templateRef Template reference to load the module
     * @param path path of the module defined as per IManifestCollection
     * @param config Object containing all the Input properties of the module to be loaded
     */
    loadModule(containerRef: ViewContainerRef, templateRef: TemplateRef<any>, path: string, config: Object): void {
        containerRef.clear();
        containerRef.createEmbeddedView(templateRef, { manifestPath: path, config: config });
    }

    notify(config: any, callback: Function): void {
        this.loadModule(this.containerRef, this.templateRef, 'smartNotification/smartNotification', {
            config: config,
            buttonClick: (e: any) => {
                callback(e);
            }
        })
    }

    // public getMessageDialog(
    //     _strMessage: string,
    //     _strDialogType: string = DashboardConstants.OpportunityFinderConstants.STRING_ERROR,
    //     _strBtnText: string = DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
    //     _strBtnFlatStyle: boolean = DashboardConstants.OpportunityFinderConstants.BOOLEAN_BTN_FLAT) {
    //     return new Observable((observer) => {
    //         let notifyObj = {
    //             type: _strDialogType,
    //             message: _strMessage,
    //             buttons: [
    //                 {
    //                     title: _strBtnText,
    //                     flat: _strBtnFlatStyle,
    //                     result: _strBtnText.toLocaleLowerCase()
    //                 }]
    //         };
    //         this._notificationService.notify(notifyObj, (response) => {
    //             if (response.result === _strBtnText.toLocaleLowerCase()) {
    //                 observer.next(response);
    //                 observer.complete();
    //             }
    //         });
    //     });
    // }

    // public getConfirmMessageDialog(
    //     _strMessage: string,
    //     _strBtnText: Array<string>,
    //     _strDialogType: string = DashboardConstants.OpportunityFinderConstants.STRING_CONFIRM,
    //     _strBtnFlatStyle: boolean = DashboardConstants.OpportunityFinderConstants.BOOLEAN_BTN_FLAT
    // ) {
    //     return new Promise((resolve, reject) => {
    //         let _arrBtn = [];
    //         for (let _strBtnItem of _strBtnText) {
    //             _arrBtn.push({
    //                 title: _strBtnItem,
    //                 result: _strBtnItem.toLowerCase(),
    //                 flat: _strBtnFlatStyle
    //             });
    //         }
    //         let notifyObj = {
    //             type: _strDialogType,
    //             message: _strMessage,
    //             buttons: _arrBtn
    //         };
    //         this._notificationService.notify(notifyObj, (response) => {
    //             if (response.result != null && response.result != undefined) {
    //                 resolve(response);
    //             } else {
    //                 return;
    //             }

    //         });
    //     })
    // }

    public getMessageDialog(
        _strMessage: string,
        _resultCallback: Function,
        _strDialogType: string = DashboardConstants.OpportunityFinderConstants.STRING_ERROR,
        _strBtnText: string = DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
        _strBtnFlatStyle: boolean = DashboardConstants.OpportunityFinderConstants.BOOLEAN_BTN_FLAT) {

        const notifyObj = {
            type: _strDialogType,
            message: _strMessage,
            buttons: [
                {
                    title: _strBtnText,
                    flat: _strBtnFlatStyle,
                    result: _strBtnText.toLocaleLowerCase()
                }]
        };
        this.notify(notifyObj, _resultCallback);
    }

    public getConfirmMessageDialog(
        _strMessage: string,
        _strBtnText: Array<string>,
        _resultCallback: Function,
        _strDialogType: string = DashboardConstants.OpportunityFinderConstants.STRING_CONFIRM,
        _strBtnFlatStyle: boolean = DashboardConstants.OpportunityFinderConstants.BOOLEAN_BTN_FLAT
    ) {
        let _arrBtn = [];
        for (let _strBtnItem of _strBtnText) {
            _arrBtn.push({
                title: _strBtnItem,
                result: _strBtnItem.toLowerCase(),
                flat: _strBtnFlatStyle
            });
        }
        let notifyObj = {
            type: _strDialogType,
            message: _strMessage,
            buttons: _arrBtn
        };
        this.notify(notifyObj, _resultCallback);
    }


    public isEmptyObject(_objCheck): boolean {
        return (_objCheck && (Object.keys(_objCheck).length === 0));
    }

    // Angular 5 Provision to Make HeaderCache Flag While making the request.
    public noCacheUrl(url: string): string {
        const timestap = "urid=" + ((new Date()).getTime());
        const prefix = ((url.indexOf("?") !== -1) ? "&" : "?");
        return (url + prefix + timestap);
    }

    public getUrlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^\/&#]*)')
            .exec(window.location.href);

        if (results && results[1])
            return results[1]
        return undefined;
    }

    public isValidGuid(_strToCheckIsGUID: string) {
        if (_strToCheckIsGUID[0] === "{") {
            _strToCheckIsGUID = _strToCheckIsGUID.substring(1, _strToCheckIsGUID.length - 1);
        }
        var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(_strToCheckIsGUID);
    }

    public isEmptyGuid(_strGUID: string) {
        const _emptyGUID: string = '00000000-0000-0000-0000-000000000000';
        return _strGUID == _emptyGUID;
    }

    public getToastMessage(
        _strMessage: string,
        _intLength: number = DashboardConstants.OpportunityFinderConstants.TOAST_LENTH,
        _strPositionX: string = DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.START,
        _strPositionY: string = DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.BOTTOM,
        _strAction: string = DashboardConstants.UIMessageConstants.STRING_OK_BTN_TEXT,

    ) {
        this._toasterService.generateToast({
            message: _strMessage,
            length: _intLength,
            positionX: _strPositionX,
            positionY: _strPositionY,
            // action: _strAction
        });
    }

    public getServiceErrorMessage(error): string {
        return `${error.status} : ${error.statusText}\n
        ${DashboardConstants.UIMessageConstants.STRING_SHOW_SOMETHING_WENT_WRONG} : ${error.url}`;
    }

    public getDeReferencedObject(_defObject: any): any {
        return JSON.parse(JSON.stringify(_defObject));
    }

    //Common method for Applying the Filter for the Both Module i.e. Opportunity Finder and Dashboard Module
    public createFilterReportObject(
        _appliedfilter: IReportingObjectMultiDataSource,
        _isAppliedFilterExits: any,
        _dashletInfoObject: any,
        _operators: any,
        _filterBy: any,
        _listFilterValues: any,
        _moduleType: string,
        _viewFilterType: number): any {
        let filterConditionObjectId = "";
        if (_filterBy == DashboardConstants.FilterBy.FilterBySelection) {
            if (_appliedfilter.FilterIdentifier == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                if (_appliedfilter.FilterType == DashboardConstants.FilterType.Year) {
                    filterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIs;
                }
                else {
                    filterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIn;
                }
            }
            else if (_appliedfilter.FilterType == DashboardConstants.FilterType.Date) {
                filterConditionObjectId = _appliedfilter.FilterRadioOperator.field.FilterConditionObjectId;
            }
            else if (_appliedfilter.FilterType == DashboardConstants.FilterType.MultiSelect) {
                filterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIs;
            }
            else if (_appliedfilter.FilterType === DashboardConstants.FilterType.Number) {
                filterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIn;
            }
            else if (_appliedfilter.FilterType == DashboardConstants.FilterType.Year) {
                filterConditionObjectId = _appliedfilter.YearModel.field.FilterConditionObjectId;
            }
            else if (([DashboardConstants.FilterType.QuarterYear,
            DashboardConstants.FilterType.Quarter,
            DashboardConstants.FilterType.MonthYear,
            DashboardConstants.FilterType.Month].indexOf(_appliedfilter.FilterType) != -1)) {
                filterConditionObjectId = _appliedfilter.QuarterYearModel.field.FilterConditionObjectId;
            }
        }
        else if (_filterBy == DashboardConstants.FilterBy.FilterByCondition) {
            if (this.isPeriodFilter(_appliedfilter.FilterType)) {
                filterConditionObjectId = _appliedfilter.FilterConditionOperator.FilterConditionObjectId;
            }
            else if ([DashboardConstants.FilterType.MultiSelect,
            DashboardConstants.FilterType.Measure,
            DashboardConstants.FilterType.Number].indexOf(_appliedfilter.FilterType) != -1) {
                filterConditionObjectId = _appliedfilter.FilterConditionOperator.FilterConditionObjectId;
            }
        }
        let _filterReportingObject =
            [
                {
                    ReportObject:
                    {
                        DisplayName: _appliedfilter.DisplayName,
                        DrillTransactionOrder: _appliedfilter.DrillTransactionOrder,
                        Expression: _appliedfilter.Expression,
                        DerivedRoType: _appliedfilter.DerivedRoType,
                        FilterType: _appliedfilter.FilterType,
                        FilterTypeObjectId: _appliedfilter.FilterTypeObjectId,
                        FormatKey: _appliedfilter.FormatKey,
                        isDashletModified: false,
                        IsDerived: _appliedfilter.IsDerived,
                        IsDrill: _appliedfilter.IsDrill,
                        IsDrillToTransactional: _appliedfilter.IsDrillToTransactional,
                        IsFilterable: _appliedfilter.IsFilterable,
                        IsSelectAll: _appliedfilter.IsSelectAll,
                        IsTransactional: _appliedfilter.IsTransactional,
                        LayoutArea: _appliedfilter.LayoutArea,
                        ObjectGroupName: _appliedfilter.ObjectGroupName,
                        ParentReportObjects: _appliedfilter.ParentReportObjects,
                        ReportObjectDataType: _appliedfilter.ReportObjectDataType,
                        ReportObjectId: _appliedfilter.ReportObjectId,
                        ReportObjectName: _appliedfilter.ReportObjectName,
                        ReportObjectType: _appliedfilter.ReportObjectType,
                        ReportObjectWidth: _appliedfilter.ReportObjectWidth,
                        SequenceNumber: _appliedfilter.SequenceNumber,
                        Tablename: _appliedfilter.TableName,
                        FilterIdentifier: _appliedfilter.FilterIdentifier
                    },
                    Operators: _isAppliedFilterExits.IsPresent ? _dashletInfoObject.reportDetails.lstFilterReportObject[_isAppliedFilterExits.filterObjectIndex].Operators : _operators,
                    FilterBy: _filterBy,
                    FilterType: _appliedfilter.FilterType,
                    FilterValue: _isAppliedFilterExits.IsPresent ? JSON.stringify
                        (
                            _dashletInfoObject.reportDetails.lstFilterReportObject[_isAppliedFilterExits.filterObjectIndex].filterValue || []
                        ) : JSON.stringify(_listFilterValues),
                    SetConditionalOperator: _isAppliedFilterExits.IsPresent ?
                        DashboardConstants.ConditionalOperator.AND :
                        DashboardConstants.ConditionalOperator.Nan,
                    FilterCondition: {
                        FilterConditionObjectId: filterConditionObjectId,
                        Name: '',
                        IsPeriodFilter: false,
                        Condition: _isAppliedFilterExits.IsPresent ? _dashletInfoObject.reportDetails.lstFilterReportObject[_isAppliedFilterExits.filterObjectIndex].Operators : _operators
                    },
                    NestedReportFilterObject: _isAppliedFilterExits.IsPresent ?
                        {
                            NestedReportFilterObject: null,
                            FilterType: _appliedfilter.FilterType,
                            Operators: _operators,
                            ReportObject: null,
                            SetConditionalOperator: DashboardConstants.ConditionalOperator.AND,
                            Values: _listFilterValues
                        } : null,
                    IsGlobalFilter: _isAppliedFilterExits.IsPresent ? false : true,
                    FilterIdentifier: _isAppliedFilterExits.IsPresent ? DashboardConstants.FilterIdentifierType.ReportLevelFilter :
                        _appliedfilter.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ?
                            DashboardConstants.FilterIdentifierType.SlicerFilter :
                            DashboardConstants.FilterIdentifierType.GlobalLevelFilter,
                    IsSliderWidgetFilter: false,
                    FilterConditionText: _appliedfilter.FilterTabInfo,
                    GlobalSliderObject : this.isNune(_appliedfilter.globalSliderObject) ? _appliedfilter.globalSliderObject : new GlobalSliderObject()
                }
            ];
        return _filterReportingObject;
    }

    public showLoader() {
        this._globalLoaderbehaviorSubject$.next({
            isLoaderVisiable: true
        });
    }

    public hideLoader() {
        this._globalLoaderbehaviorSubject$.next({
            isLoaderVisiable: false
        });
    }

    public checkCellFormattingConditionForGivenValue(
        condition: number, cellValue: number, userInputValue: number, betweenFromValue: number, betweenToValue: number = void 0) {
        if (betweenFromValue === void 0) { betweenFromValue = 0; }
        if (betweenToValue === void 0) { betweenToValue = 0; }
        switch (condition) {
            case DashboardConstants.CellFormatConditions.GreaterThan: {
                return cellValue > userInputValue;
            }
            case DashboardConstants.CellFormatConditions.LessThan: {
                return cellValue < userInputValue;
            }
            case DashboardConstants.CellFormatConditions.GreaterThanOrEqualTo: {
                return cellValue >= userInputValue;
            }
            case DashboardConstants.CellFormatConditions.LessThanOrEqualTo: {
                return cellValue <= userInputValue;
            }
            case DashboardConstants.CellFormatConditions.EqualTo: {
                return cellValue == userInputValue;
            }
            case DashboardConstants.CellFormatConditions.NotEqualTo: {
                return cellValue != userInputValue;
            }
            case DashboardConstants.CellFormatConditions.Between: {
                if (betweenFromValue == null || betweenToValue == null)
                    return false;
                return (cellValue >= betweenFromValue && cellValue <= betweenToValue);
            }
            case DashboardConstants.CellFormatConditions.TopN:
            case DashboardConstants.CellFormatConditions.TopNPercent: {
                return cellValue >= userInputValue;
            }
            case DashboardConstants.CellFormatConditions.LowestN:
            case DashboardConstants.CellFormatConditions.LowestNPercent: {
                return cellValue <= userInputValue;
            }
            default: {
                return false;
            }
        }
    };

    public setCellFormattingByCondition(cfRow: any, activeCellValue: any, cell: any, targetRO: any, format: any) {
        let toApplyCellFormatting: boolean = false;
        switch (cfRow.formatCondition) {
            case DashboardConstants.CellFormatConditions.GreaterThan:
            case DashboardConstants.CellFormatConditions.LessThan:
            case DashboardConstants.CellFormatConditions.GreaterThanOrEqualTo:
            case DashboardConstants.CellFormatConditions.LessThanOrEqualTo:
            case DashboardConstants.CellFormatConditions.NotEqualTo:
            case DashboardConstants.CellFormatConditions.EqualTo: {
                if (this.checkCellFormattingConditionForGivenValue(
                    cfRow.formatCondition,
                    activeCellValue,
                    cfRow.ruleValue,
                    void 0)
                )
                    toApplyCellFormatting = true;
                break;
            }
            case DashboardConstants.CellFormatConditions.betweenRowLevelFormula:
            case DashboardConstants.CellFormatConditions.Between: {
                if (this.checkCellFormattingConditionForGivenValue(
                    DashboardConstants.CellFormatConditions.Between,
                    activeCellValue,
                    cfRow.ruleValue,
                    cfRow.between.betweenFromValue,
                    cfRow.between.betweenToValue
                )
                )
                    toApplyCellFormatting = true;
                break;
            }
            case DashboardConstants.CellFormatConditions.TopN:
            case DashboardConstants.CellFormatConditions.TopNPercent: {
                if (this.checkCellFormattingConditionForGivenValue(
                    cfRow.formatCondition, activeCellValue,
                    this.formatNumberByGridConfiguration(cfRow.minValue, format),
                    void 0)
                )
                    toApplyCellFormatting = true;
                break;
            }
            case DashboardConstants.CellFormatConditions.LowestN:
            case DashboardConstants.CellFormatConditions.LowestNPercent: {
                if (this.checkCellFormattingConditionForGivenValue(
                    cfRow.formatCondition,
                    activeCellValue,
                    this.formatNumberByGridConfiguration(cfRow.maxValue, format),
                    void 0
                )
                )
                    toApplyCellFormatting = true;
                break;
            }
        }
        //Added undefined check for cell as cell value will be null in the case of summary card formatting
        if (toApplyCellFormatting) {
            if (this.isNune(cell)) {
                cell.style.background = cfRow.color;
                cell.style.color = cfRow.textcolor;
            }
            else {
                cell = { backgroundColor: cfRow.color, valueColor: cfRow.textcolor };
            }
        }
        else if (!toApplyCellFormatting && !this.isNune(cell)) {
            cell = { backgroundColor: AnalyticsCommonConstants.SummaryCardColors.backgroundColor, valueColor: DashboardConstants.SummaryCardColors.valueColor };
        }

        return cell;
    }
    public setTextBasedCellFormattingByCondition(cfRow: any, activeCellValue: any, cell: any, targetRO: any, reportViewType: any) {
        let toApplyCellFormatting = false;
        switch (cfRow.formatCondition) {
            case DashboardConstants.CellFormatConditions.contains:
            case DashboardConstants.CellFormatConditions.doesNotContain:
            case DashboardConstants.CellFormatConditions.beginsWith:
            case DashboardConstants.CellFormatConditions.endsWith:
            case DashboardConstants.CellFormatConditions.isNull:
            case DashboardConstants.CellFormatConditions.isNotNull:
            case DashboardConstants.CellFormatConditions.isEmpty:
            case DashboardConstants.CellFormatConditions.isNotEmpty: {
                if (this.checkTextBasedCellFormattingCondition(cfRow.formatCondition, activeCellValue, cfRow.textRuleValue))
                    toApplyCellFormatting = true;
                break;
            }
        }
        if (toApplyCellFormatting) {
            // cell.style.background = targetRO.layoutArea == DashboardConstants.ReportObjectLayoutArea.Rows && reportViewType == DashboardConstants.ReportViewType.Olap ? cfRow.defaultColorOlapFlexTextCf : cfRow.color;
            cell.style.background = cfRow.color;
            cell.style.color = cfRow.textcolor;
        }
        return cell;
    }
    public checkTextBasedCellFormattingCondition(condition: number, cellValue: string, userInputValue: string) {
        switch (condition) {
            case DashboardConstants.CellFormatConditions.contains: {
                return cellValue.toString().toLowerCase().indexOf(userInputValue.toString().toLowerCase()) != -1;
            }
            case DashboardConstants.CellFormatConditions.doesNotContain: {
                return cellValue.toString().toLowerCase().indexOf(userInputValue.toString().toLowerCase()) == -1;
            }
            case DashboardConstants.CellFormatConditions.beginsWith: {
                return cellValue.toString().toLowerCase().indexOf(userInputValue.toString().toLowerCase()) == 0;
            }
            case DashboardConstants.CellFormatConditions.endsWith: {
                return cellValue.toString().substring(cellValue.length - userInputValue.length, cellValue.length).toLowerCase() == userInputValue.toString().toLowerCase();
            }
            case DashboardConstants.CellFormatConditions.isNull: {
                return cellValue.toString() == DashboardConstants.NullIndicator.NullIndicator;
            }
            case DashboardConstants.CellFormatConditions.isNotNull: {
                return cellValue.toString() != DashboardConstants.NullIndicator.NullIndicator;
            }
            case DashboardConstants.CellFormatConditions.isEmpty: {
                return cellValue.toString() == "";
            }
            case DashboardConstants.CellFormatConditions.isNotEmpty: {
                return cellValue.toString() != "";
            }
            default: {
                return false;
            }
        }
    };

    public toCamelWrapper(obj) {
        var _this = this;
        var toCamel = (o) => {
            var newO, origKey, newKey, value
            if (o instanceof Array) {
                return o.map(function (value) {
                    if (typeof value === "object") {
                        value = toCamel(_this.getDeReferencedObject(value))
                    }
                    return value
                })
            } else {
                newO = {}
                for (origKey in o) {
                    if (o.hasOwnProperty(origKey)) {
                        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                        value = o[origKey]
                        if (value instanceof Array || (value !== null && value.constructor === Object)) {
                            value = toCamel(_this.getDeReferencedObject(value))
                        }
                        newO[newKey] = value
                    }
                }
            }
            return newO
        }
        return toCamel(obj);

    }

    public formatNumberByGridConfiguration(value: number, formatString: string): number {
        if (isNaN(value) || value == null || !formatString) return value;
        let formatArray: Array<string> = new Array<string>();
        formatArray.push(formatString[0]);
        formatArray.push(formatString[1]);
        switch (formatArray[0]) {
            case 'p': {
                value = value * 100;
                break;
            }
            case 'c': break;
            default: break;
        }
        if (formatString.indexOf('|') > -1) {
            formatArray.push(formatString.split('|')[1]);
            switch (formatArray[2]) {
                case 'K': {
                    value = value / 1000;
                    break;
                }
                case 'M': {
                    value = value / 1000000;
                    break;
                }
                case 'B': {
                    value = value / 1000000000;
                    break;
                }
                default: break;
            }

        }
        value = parseFloat(value.toFixed(parseInt(formatArray[1])));
        return value;
    }

    public generateColumnKey(colKeys: any, ReportObjectName: any) {
        let columnKey: string = '';
        if (colKeys && colKeys.fields && colKeys.fields.length > 0) {
            colKeys.fields.forEach(function (c, i) {
                columnKey = columnKey + (i == 0 ? '' : ';') + c + ':' + colKeys.values[i];
            });
        }
        return columnKey + (columnKey == '' ? '' : ';') + ReportObjectName + ':0;';
    };

    public getUIElementConfig(_uiConfigElement: any): any {
        switch (_uiConfigElement) {
            case DashboardConstants.SmartComponentConfig.SmartGlobalLoaderConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_LOADER_TXT,
                    isLoaderVisiable: false,
                }
            case DashboardConstants.SmartComponentConfig.SmartVisionGridConfig:
                return {
                    container: {
                        manifestId: 'SmartCardsContainer',
                        componentId: 'SmartCardsContainerComponent',
                        classId: 'DA4IBwgKBgUIBQYKBAUKBw'
                    },
                    layout: {
                        manifestId: 'SmartGridstackLayout',
                        componentId: 'SmartGridstackLayoutComponent',
                        classId: 'CQMCBAgHBwgLDQMDBAEBCQ',
                        config: {
                            handle: '.drag-handle',
                            float: false,
                            animate: true,
                            verticalMargin: 10,
                            width: 2,
                            staticGrid: this.getUrlParam('vm') === 'op' ? true : false,
                            disableResize: this.getUrlParam('vm') === 'op' ? true : false
                        },
                        classes: ['layout-wrapper']
                    },
                    placeholder: {
                        manifestId: 'SmartCardsPlaceholder',
                        componentId: 'SmartCardsPlaceholderComponent',
                        classId: 'CwICCQYCCAsDDgIPBAsDBg',
                        classes: ['placeholder-wrapper']
                    },
                    cards: []
                };
            case DashboardConstants.SmartComponentConfig.SmartButtonConfig:
                return {
                    title: DashboardConstants.UIMessageConstants.STRING_APPLY_TXT,
                    flat: true,
                    disable: false
                }
            case DashboardConstants.SmartComponentConfig.SmartDashboardCardConfig:
                return {
                    manifestId: 'DashboardCard',
                    componentId: 'DashboardCardComponent',
                    classId: "CQUNCg0KAwsOBQcGBA4JAQ",
                }
            case DashboardConstants.SmartComponentConfig.SmartCardTitleConfig:
                return {
                    label: '',
                    isMandatory: true,
                    allowEmpty: false,
                    disabled: false,
                    data: 'graphTitle',
                    fieldKey: 'value',
                    tabIndex: 2,
                    attributes: {
                        placeholder: '',
                        maxLength: 100
                    }
                }
            case DashboardConstants.SmartComponentConfig.SmartMenuTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_MENU_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartCardLoaderConfig:
                return {
                    bgwhite: true,
                    plain: true,
                    center: true,
                    message: " ",
                    isFixed: false,
                    api: {}
                }
            case DashboardConstants.SmartComponentConfig.SmartFullScreenTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_FULL_SCREEN_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartFilterTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_FILTER_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartSlicerTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_SLICER_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartActionTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_ACTION_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartPreviousTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_PREVIOUS_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartNextTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_NEXT_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartLinkedReportConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_LINKED_REPORT_TXT,
                    position: "right"
                }
            case DashboardConstants.SmartComponentConfig.SmartViewAppliedFilterConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_VIEW_FILTERS_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartAddWidgetTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_ADD_WIDGET_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartRefreshWidgetTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_REFRESH_WIDGET_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartLinkedToDashboardConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_LINKED_TO_DASHBOARD_TXT,
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.SmartCopyDashboardViewUrlConfig:
                return {
                    message: "Copy the link to this View",
                    position: "bottom"
                }
            case DashboardConstants.SmartComponentConfig.shareDashBoardAddTooltipConfig:
                return {
                    message: "Add Member",
                    position: 'left'
                }
            case DashboardConstants.SmartComponentConfig.shareDashBoardSearchTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_SEARCH_TEXT,
                    position: 'bottom'
                }
            case DashboardConstants.SmartComponentConfig.shareDashBoardUnShareTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_UnShare_Button_ToolTip,
                    position: 'bottom'
                }

            case DashboardConstants.SmartComponentConfig.shareDashBoardCloseTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
                    position: 'bottom'
                }

            case DashboardConstants.SmartComponentConfig.shareDashBoardShareTooltipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Share_Button_Text,
                    position: 'bottom'
                }

            case DashboardConstants.SmartComponentConfig.SmartAutoCompleteConfig:
                return {
                    placeholder: '',
                    type: "autocomplete",
                    data: 'autoCompleteFilterData',
                    fieldKey: 'selected',
                    attributes: {
                        disable: false,
                        displayformat: '{title}',
                        optionformat: '{title}',
                        options: [],
                        lookupConfig: {
                            showLookup: false,
                            filterKey: ['title'],
                            titleofmodel: "Select Student",
                            descKey: "title"
                        }
                    }
                }
            case DashboardConstants.SmartComponentConfig.SmartDrillUpToolTipConfig:
                return {
                    message: DashboardConstants.UIMessageConstants.STRING_DRILL_UP_TXT,
                    position: "bottom"
                }
            case DashboardConstants.PeriodFilterPropsConfig.BeginningOfTheQuarterYear:
                return {
                    displayKey: 'title',
                    options: [],
                    label: '',
                    dataKey: 'title',
                    cssClass: 'line-height-manager',
                    fieldKey: 'selectedOption',
                    type: 'select',
                    attributes: {}
                }
            default:
        }
    }

    public isPeriodFilter(_filterType: number): boolean {
        switch (_filterType) {
            case DashboardConstants.FilterType.SingleSelect:
            case DashboardConstants.FilterType.MultiSelect:
            case DashboardConstants.FilterType.Measure:
            case DashboardConstants.FilterType.Tree:
            case DashboardConstants.FilterType.Number:
                return false;
            case DashboardConstants.FilterType.Date:
            case DashboardConstants.FilterType.Month:
            case DashboardConstants.FilterType.MonthYear:
            case DashboardConstants.FilterType.Year:
            case DashboardConstants.FilterType.Quarter:
            case DashboardConstants.FilterType.QuarterYear:
                return true;
            default:
                return false;
        }
    }

    public async getLazyComponentReferences(_lazyComponentInfo: any): Promise<ComponentFactory<any>> {
        try {

            return await this._compFactResolver.resolveComponentFactory(_lazyComponentInfo.componentName);
        }
        catch (e) {
            console.log(e.message);
        }
    }

    public getDateInFormat(_dateValue: any, _format: any = 'Mdy') {
        switch (_format) {
            case 'Mdy':
                return this._datePipe.transform(new Date(_dateValue), 'MM/dd/yyyy');
        }
    }

    public getObjValueFromKey(_jsonData: any): string {
        if (_jsonData && _jsonData != null) {
            const values = Object.keys(_jsonData).map(key => _jsonData[key]);
            const commaJoinedValues = values.join(",");
            return commaJoinedValues;
        }
        else {
            throw new Error(`The value for _jsonData is undefined or null i.e.${_jsonData}`);
        }
    }

    //To get the date value for DAX
    public getPeriodDateValue(_dateValue: any): string {
        if (typeof _dateValue == "string" && _dateValue.indexOf("/") == -1) {
            _dateValue = new Date(_dateValue.slice(0, 4) + "/" + _dateValue.slice(4, 6) + "/" + _dateValue.slice(6, 8));
        }
        return this._datePipe.transform(new Date(_dateValue), "yyyyMMdd");
    }

    // To verify the object is not undefined ,null and empty.
    public isNune(_object: any): boolean {
        return (_object != undefined && _object != null && _object !== "" && _object != 'NaN')
    }

    public isNuneArray(_lstOfObjects: Array<any>) {
        if (_lstOfObjects.length) {
            for (let i = 0; i < _lstOfObjects.length; i++) {
                if (_lstOfObjects[i] === undefined || _lstOfObjects[i] === null || _lstOfObjects[i] === "" || _lstOfObjects[i] === 'NaN') {
                    return false;
                }
            }
            return true;
        }
    }
    public checkForCrossSuiteRelationMapping(_arrCheckforMapping: any): boolean {
        if (_arrCheckforMapping.array.length == 0) {
            let _strMessage: string;
            if (_arrCheckforMapping.type == DashboardConstants.ViewFilterType.MultiSource) {
                _strMessage = 'The Cross Suite Relation Object Mapping are Missing.'
            }
            else if (_arrCheckforMapping.type == DashboardConstants.ViewFilterType.SingleSource) {
                _strMessage = 'The Datasource filter Report Objects have been loaded yet.'
            }
            this.getToastMessage(_strMessage);
            return false;
        }
        return true;
    }

    /**
     * @param reportDetailsId = Uniquily idnetify the Report Request Id
     * @param contactCode = Generate the Unique Id for the Redis Cache Request Key for the Generate Report 
     */
    public generateReportRequestKey(reportDetailsId: string, contactCode: any) {
        return (
            `${DashboardConstants.ModuleType.DASHBOARD}`
            + reportDetailsId
            + (((((1 + Math.random()) * 0x10000) | 0)).toString(16) + contactCode
                + new Date().getTime()).toUpperCase()
        ).replace('-', '').toUpperCase();
    }

    public getWidgetType(reportViewType): string {
        return (
            reportViewType === DashboardConstants.ReportViewType.column ||
            reportViewType === DashboardConstants.ReportViewType.spline ||
            reportViewType === DashboardConstants.ReportViewType.stColumn ||
            reportViewType === DashboardConstants.ReportViewType.pie ||
            reportViewType === DashboardConstants.ReportViewType.treemap ||
            reportViewType === DashboardConstants.ReportViewType.ParetoChart ||
            reportViewType === DashboardConstants.ReportViewType.MultiAxisChart ||
            reportViewType === DashboardConstants.ReportViewType.BarChart ||
            reportViewType === DashboardConstants.ReportViewType.StackedBarChart ||
            reportViewType === DashboardConstants.ReportViewType.PercentStackedBarChart ||
            reportViewType === DashboardConstants.ReportViewType.PercentStackedColumnChart ||
            reportViewType === DashboardConstants.ReportViewType.DonutChart ||
            reportViewType === DashboardConstants.ReportViewType.ColumnLineCombinationChart ||
            reportViewType === DashboardConstants.ReportViewType.BarLineCombinationChart ||
            reportViewType === DashboardConstants.ReportViewType.BubbleChart ||
            reportViewType === DashboardConstants.ReportViewType.WaterFallChart ||
            reportViewType === DashboardConstants.ReportViewType.HistogramChart ||
            reportViewType === DashboardConstants.ReportViewType.HeatMap

        ) ? DashboardConstants.WidgetDataType.Chart :
            (
                reportViewType === DashboardConstants.ReportViewType.Flex ?
                    DashboardConstants.WidgetDataType.Flex :
                    (
                        reportViewType === DashboardConstants.ReportViewType.SummaryCard ?
                            DashboardConstants.WidgetDataType.SummaryCard :
                            (
                                reportViewType === DashboardConstants.ReportViewType.Olap ?
                                    DashboardConstants.WidgetDataType.Olap :
                                    (
                                        reportViewType === DashboardConstants.ReportViewType.MapChart ?
                                            DashboardConstants.WidgetDataType.MapChart :
                                            (
                                                reportViewType === DashboardConstants.ReportViewType.GaugeChart ?
                                                    DashboardConstants.WidgetDataType.GuageChart : '--Undefined--'
                                            )
                                    )
                            )
                    )

            );
    }

    /**
     *  We have not Consider the Metric during Id generation for the DAX Response
     *  Algorithm basically does the Extract the 
     *  Up to @param __NO_EXTRACTION_PARAMETER__ Length of the Report Object Name
     *  Up to @param __NO_EXTRACTION_PARAMETER__ Value of the Report Object Name  + 
     *  Up to @param __NO_EXTRACTION_PARAMETER__ Length of the Report Object Data Value  +
     *  Up to @param __NO_EXTRACTION_PARAMETER__ Value of the Report Object Name 
     *  Removing All the Spaces in Final Result
     * @param __daxResponse  = DAX Response Result for During Generate Report Service 
     * @param __EXCLUDE_METRICS__  = Excluding the Mertics RO and Value while Generating the ID
     */
    public generateUniqueDataRowIdFromResponse(__daxResponse: any, __EXCLUDE_METRICS__: any = null, __CARDID__: any = null): string {
        const __WILD__CHARCTER__REPLACEMENT__: string = '-';
        const __NO_EXTRACTION_PARAMETER__: number = 15;
        const __SPLITING__CHAR__: string = ' ';
        let __GENERATE__DATAROW__ID__: string = __CARDID__;
        for (let iterationItem in __daxResponse) {
            if (__EXCLUDE_METRICS__.indexOf(iterationItem) == -1) {
                let _iterationItemValue = __daxResponse[iterationItem] || '';
                __GENERATE__DATAROW__ID__ +=
                    iterationItem.toString().trim().length +
                    __WILD__CHARCTER__REPLACEMENT__ +
                    iterationItem.toString().substr(0, __NO_EXTRACTION_PARAMETER__).toLocaleUpperCase().trim() +
                    __WILD__CHARCTER__REPLACEMENT__ +
                    _iterationItemValue.toString().trim().length +
                    __WILD__CHARCTER__REPLACEMENT__ +
                    _iterationItemValue.toString().substr(0, __NO_EXTRACTION_PARAMETER__).toLocaleUpperCase().trim() +
                    __WILD__CHARCTER__REPLACEMENT__;
            }
        }
        __GENERATE__DATAROW__ID__ = __GENERATE__DATAROW__ID__.substr(0, __GENERATE__DATAROW__ID__.lastIndexOf(__WILD__CHARCTER__REPLACEMENT__));
        return __GENERATE__DATAROW__ID__.split(__SPLITING__CHAR__).join(__SPLITING__CHAR__);
    }

    /**
     *  Check if all the widgets have been loaded or not
     */
    public checkAllWidgetLoaded(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (some(this._widgetCards, 'cardLoader')) {
                this.getConfirmMessageDialog(
                    "All the Widgets have not loaded yet ? Would you like to proceed further",
                    [
                        DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                        DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
                    ]
                    , (_response: any) => {
                        if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    });
            }
            else {
                resolve(true);
            }
        });
    }

    /**
     *  Combining the Column,Row and Value Reporting Objects
     * @param reportDetails  = Complete Report Details 
     */
    public getCombineColumnValueRowRO(reportDetails: any): Array<any> {
        return reportDetails.lstReportObjectOnRow
            .concat(reportDetails.lstReportObjectOnColumn)
            .concat(reportDetails.lstReportObjectOnValue);

    }

    /**
     * Returns the Current Product Configuration based upon @param currentProductName
     * @param currentProductName Active Product Name for the Current View
     */
    public getProductConfiguration(currentProductName: productName): IProductConfiguration {
        if (currentProductName && currentProductName == productName.categoryWorkbenchProduct) {
            var cwFlags = this.getUrlParam('cwFlags');
            var editFlags = this.getUrlParam('editFlags');
            if (cwFlags && productConfiguration[currentProductName]) {
                var strCwFlags = cwFlags.toString();
                if (strCwFlags.charAt(0)) {
                    productConfiguration[currentProductName].showSmartHedaerCompponent = strCwFlags.charAt(0) == '1' ? true : false;
                }
                // if (strCwFlags.charAt(1)) {
                //     productConfiguration[currentProductName].showSubheaderComponent = strCwFlags.charAt(1) == '1' ? true : false;
                // }
            }
            if (editFlags && productConfiguration[currentProductName]) {
                var srtEditFlags = editFlags.toString();
                if (srtEditFlags.charAt(1)) {
                    let isEditable = srtEditFlags.charAt(1) == '1' ? true : false;
                    productConfiguration[currentProductName].isCWEditable = isEditable;
                }
            }
        }
        else if (supplierScorecardConfig != null && supplierScorecardConfig['ProductType'] != undefined
            && supplierScorecardConfig['ProductType'] == productName.scorecardProduct
            && this._appConstants.userPreferences.UserBasicDetails.IsSupplier) {
            return productConfiguration[productName.scorecardProduct] as IProductConfiguration;
        }
        return productConfiguration[currentProductName] ?
            productConfiguration[currentProductName] :
            productConfiguration[productName.defaultVisionProduct] as IProductConfiguration;
    }

    /**
     * Enabling the Feature Like Sort and Pagination based upon the Chart Types
     * @param _reportViewType   == Accepts the Report View Type
     * @param _featureType      == Accepts the Feature type As Sort,Pagination etc....
    */
    public enableFeatureFor(_reportViewType: any, _featureType: any): boolean {
        switch (_featureType) {
            case DashboardConstants.EnableFeature.Sort:
                return _reportViewType === DashboardConstants.ReportViewType.column
                    || _reportViewType === DashboardConstants.ReportViewType.MultiAxisChart
                    || _reportViewType === DashboardConstants.ReportViewType.spline
                    || _reportViewType === DashboardConstants.ReportViewType.stColumn
                    || _reportViewType === DashboardConstants.ReportViewType.BarChart
                    || _reportViewType === DashboardConstants.ReportViewType.PercentStackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.PercentStackedColumnChart
                    || _reportViewType === DashboardConstants.ReportViewType.StackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.ColumnLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.BarLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.WaterFallChart
                    || _reportViewType === DashboardConstants.ReportViewType.GaugeChart
                    || _reportViewType === DashboardConstants.ReportViewType.HistogramChart
                    || _reportViewType === DashboardConstants.ReportViewType.HeatMap
            case DashboardConstants.EnableFeature.Pagination:
                return _reportViewType === DashboardConstants.ReportViewType.column
                    || _reportViewType === DashboardConstants.ReportViewType.spline
                    || _reportViewType === DashboardConstants.ReportViewType.stColumn
                    //  || _reportViewType === DashboardConstants.ReportViewType.pie
                    //  || _reportViewType === DashboardConstants.ReportViewType.treemap
                    //  || _reportViewType === DashboardConstants.ReportViewType.ParetoChart
                    || _reportViewType === DashboardConstants.ReportViewType.MultiAxisChart
                    || _reportViewType === DashboardConstants.ReportViewType.BarChart
                    || _reportViewType === DashboardConstants.ReportViewType.StackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.PercentStackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.PercentStackedColumnChart
                    || _reportViewType === DashboardConstants.ReportViewType.Flex
                    || _reportViewType === DashboardConstants.ReportViewType.Olap
                    || _reportViewType === DashboardConstants.ReportViewType.ColumnLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.BarLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.GaugeChart
                    || _reportViewType === DashboardConstants.ReportViewType.HistogramChart
                    || _reportViewType === DashboardConstants.ReportViewType.HeatMap
            case DashboardConstants.EnableFeature.MinMaxValue:
                return _reportViewType === DashboardConstants.ReportViewType.column
                    || _reportViewType === DashboardConstants.ReportViewType.stColumn
                    || _reportViewType === DashboardConstants.ReportViewType.MultiAxisChart
                    || _reportViewType === DashboardConstants.ReportViewType.spline
                    // Comment for as the pagination does not required for pareto chart 
                    // || _reportViewType === DashboardConstants.ReportViewType.ParetoChart ||
                    || _reportViewType === DashboardConstants.ReportViewType.BarChart
                    || _reportViewType === DashboardConstants.ReportViewType.StackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.ColumnLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.BarLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.HistogramChart
                    || _reportViewType === DashboardConstants.ReportViewType.HeatMap
            case DashboardConstants.EnableFeature.TwentyRows:
                return _reportViewType === DashboardConstants.ReportViewType.BarLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.ColumnLineCombinationChart
                    || _reportViewType === DashboardConstants.ReportViewType.BarChart
                    || _reportViewType === DashboardConstants.ReportViewType.PercentStackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.StackedBarChart
                    || _reportViewType === DashboardConstants.ReportViewType.PercentStackedColumnChart
                    || _reportViewType === DashboardConstants.ReportViewType.MultiAxisChart
                    || _reportViewType === DashboardConstants.ReportViewType.column
                    || _reportViewType === DashboardConstants.ReportViewType.stColumn
                    || _reportViewType === DashboardConstants.ReportViewType.HistogramChart
                    || _reportViewType === DashboardConstants.ReportViewType.HeatMap
            case DashboardConstants.EnableFeature.NAPageSize:
                return _reportViewType === DashboardConstants.ReportViewType.DonutChart
                    || _reportViewType === DashboardConstants.ReportViewType.pie
                    || _reportViewType === DashboardConstants.ReportViewType.treemap
                    || _reportViewType === DashboardConstants.ReportViewType.ParetoChart
                    || _reportViewType === DashboardConstants.ReportViewType.MapChart

            default:
                return false;
        }
    }
    public formSubmitMethod(url: string, target: string = "_blank", inputParam: Array<{ [key: string]: string }>): void {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = url;
        form.target = target;
        if (inputParam.length) {
            inputParam.forEach(obj => {
                const input = document.createElement("input");
                input.setAttribute("type", 'hidden');
                input.setAttribute("name", Object.keys(obj)[0]);
                input.setAttribute("value", obj[Object.keys(obj)[0]]);
                form.appendChild(input);
            });
        }
        document.body.appendChild(form);
        form.submit();
    }

    /*
    *   Adding the Percentage Sign to each Wijmo Columns
    *   @param _formatKey  = Currency Sign for the Wijmo Grid Columns
    */
    public getFlexWijmoFormat(_formatKey: string, _filterType: number, _configurationValue: any): string {
        if (_filterType === DashboardConstants.FilterType.Year) {
            return 'f';
        }
        else if (_filterType === DashboardConstants.FilterType.Date) {
            return 'd';
        }
        else if (_configurationValue != '' && _configurationValue != null) {
            return this._numberFormattingSerice.GetWijmoConfigurationFormat(_configurationValue, _filterType);
        }
        else if (_formatKey == '' && _filterType == DashboardConstants.FilterType.Measure) {
            return 'n0';
        }
        else if (_formatKey != "" && _formatKey != null) {
            if (_formatKey != DashboardConstants.CommonConstants.Year && _formatKey != DashboardConstants.CommonConstants.Percent && _formatKey != DashboardConstants.FormatType.CODE)
                return 'c0' + DashboardConstants.FormatType[_formatKey];
            else if (_formatKey == DashboardConstants.FormatType.CODE) {
                return DashboardConstants.FormatTypeCODE.FormatTypeForCode;
            }
            //ANLT-10627 --in case of inbuild percent measure there is no configuration applied on it.
            else if (_formatKey == DashboardConstants.CommonConstants.Percent) {
                return 'P' + DashboardConstants.FormatType[_formatKey];
            }
        }
        else {
            return _formatKey ===
                DashboardConstants.CommonConstants.Percent ?
                DashboardConstants.FormatType[_formatKey] ? ('P' + DashboardConstants.FormatType[_formatKey]) : '' :
                DashboardConstants.FormatType[_formatKey] ? ('C' + DashboardConstants.FormatType[_formatKey]) : ''
        }
    }

    /*
     *   Adding the Percentage Sign to each Wijmo Columns
     *   @param _formatKey  = Currency Sign for the Wijmo Grid Columns
     *   Browser support for Chrome 43+, Firefox 42+, Edge and IE 10+.
    */
    public copyToClipboard(_copyTextToClipboard: any) {
        if (window["clipboardData"] && window["clipboardData"].setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return window["clipboardData"].setData("Text", _copyTextToClipboard);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = _copyTextToClipboard;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    /**
    *  @param action for drive object and widget is the chartwidget object type
    *  Please make the changes in getChartPointName as well to set the opacity of charts
    *  currently it has been handled for Pie Chart and Donut Chart
    */
    public getDrillDriveFilterValue(action: any, widget: any): string {
        if (action.driveAction && this.isNune(action.driveAction.filterValue)) {
            return action.driveAction.filterValue;
        } else {
            switch (widget.reportDetails.reportViewType) {
                case DashboardConstants.ReportViewType.BubbleChart:
                    {
                        if (
                            widget.reportDetails.lstReportObjectOnRow.length == 1 &&
                            widget.reportDetails.lstReportObjectOnValue.length == 2 &&
                            widget.reportDetails.lstReportObjectOnColumn.length == 0
                        ) {
                            return action.event.event.point.category;
                        }
                        else if (
                            widget.reportDetails.lstReportObjectOnRow.length >= 1 &&
                            widget.reportDetails.lstReportObjectOnValue.length == 3 &&
                            widget.reportDetails.lstReportObjectOnColumn.length == 0
                        ) {
                            return action.event.event.point.options.header;
                        }
                        else if (
                            widget.reportDetails.lstReportObjectOnRow.length == 0 &&
                            widget.reportDetails.lstReportObjectOnValue.length == 3 &&
                            widget.reportDetails.lstReportObjectOnColumn.length >= 1
                        ) {
                            return action.event.event.point.series.name;
                        }
                    }
                    break;
                case DashboardConstants.ReportViewType.pie || DashboardConstants.ReportViewType.DonutChart:
                    {
                        // Becuase due to plot option implementation Percentage value along with category is getting passed in GenerateReport Service Call. eg. CAPITAL : 10.0% which is incorrect
                        return action.event.event.point.name.split(':')[0]
                    }
                case DashboardConstants.ReportViewType.MapChart:
                    {
                        return action.event.event.event.mainName;
                    }
                case DashboardConstants.ReportViewType.GaugeChart:
                    {
                        return action.event.event.point.series.name;
                    }
                case DashboardConstants.ReportViewType.WaterFallChart:
                    {
                        return action.event.event.point.category;
                    }
                case DashboardConstants.ReportViewType.HeatMap:
                    {
                        return action.event.event.point.series.xAxis.categories[action.event.event.point.x];
                    }

                default:
                    {
                        return action.event.event.point.name != undefined ? action.event.event.point.name : action.event.event.point.category;
                    }
            }
        }
    }

    public enableFeatureByProductType(product: string, actionMenuOn: AnalyticsCommonConstants.ActionMenuType, ActionName: string): string {
        let productkey = findKey(productTitle, (o) => o == product)
        if (!this.isNune(ActionMenuConditions[actionMenuOn][productkey]))
            productkey = productName.defaultVisionProduct
        return "return " + ActionMenuConditions[actionMenuOn][productkey][ActionName];
    }

    public createDriveFilterForCrossSuiteView(widget: any, driveFilter: any, relationShipObjectList: Array<any>) {
        let reportObjectID = this.isNune(driveFilter.reportObjectId) ? driveFilter.reportObjectId : driveFilter.reportObject.reportObjectId;
        //Always will get only single RelationObject for the given RO and DataSourceObjectID    
        let relationShipObject = filter(relationShipObjectList, (_object) => {
            return _object.ReportObjectId == reportObjectID &&
                _object.DataSourceObjectId == widget.reportDetails.dataSourceObjectId
        })[0];
        if (relationShipObject != undefined) {
            driveFilter.RelationObjectTypeId = relationShipObject.RelationObjectTypeId;
        }
    }

    public isCrossSuiteView(listofDistinctWidgetDataSource: Array<any>): boolean {
        return listofDistinctWidgetDataSource.length > 1;
    }
    public IsEmptyOrNullConditions(formatConditions: any): boolean {
        let result: boolean = false;
        result = formatConditions == DashboardConstants.CellFormatConditions.isEmpty || formatConditions == DashboardConstants.CellFormatConditions.isNotEmpty || formatConditions == DashboardConstants.CellFormatConditions.isNull || formatConditions == DashboardConstants.CellFormatConditions.isNotNull;
        return result;
    }

    public exportToPdf(viewname: string, appliedFilters: any, buyerPartnerName: string, tabList: Array<ITabInfo>) {
        //if every widget is loaded then perform export otherwise display a message
        if (!some(this._widgetCards, 'cardLoader')) {
            this.showLoader();
            const domElementToExport = document.getElementById("exportToPdf");
            html2canvas(domElementToExport,
                {
                    onclone: (document) => {
                        // this is to detect IE version 
                        var ua = window.navigator.userAgent;
                        var trident = ua.indexOf('Trident/');
                        if (tabList.length > 1 || (tabList.length === 1 && tabList[0].title.toLowerCase() != DashboardConstants.DefaultTab)) {
                            let tabListTable = document.createElement('table');
                            // let tableStyle = {
                            //     backgroundColor: "white",
                            //     border: "1px solid black",
                            //     marginBottom: "25px",
                            //     marginTop: "25px"
                            // }
                            let tr = document.createElement('tr');
                            each(tabList, (_tab, _index) => {
                                if (_tab.isActive) {
                                    let td = document.createElement('td');
                                    td.innerHTML = `<b>Tab : ${_tab.title}</b>`
                                    // td.setAttribute("style", "word-break:berak-all;");
                                    // let td_data = document.createTextNode(_tab.title);
                                    // td.appendChild(td_data);
                                    tr.appendChild(td);
                                    tabListTable.appendChild(tr);
                                }
                            })
                            tabListTable.style['marginLeft'] = '-20px';
                            // for (let key in tableStyle) {
                            //     tabListTable.style[key] = tableStyle[key];
                            // }
                            let insertBeforeNode = document.querySelector("#exportToPdf");
                            insertBeforeNode.insertBefore(tabListTable, insertBeforeNode.childNodes[1]);
                        }
                        if (appliedFilters.length > 0) {
                            let table = document.createElement('table');
                            //this creates a header in the table
                            let tableHeader = table.createTHead();
                            // this creates a row inside head tag in table
                            let row1 = tableHeader.insertRow(0);
                            //this creates a td tag in head tag of table as well filling value inside td tag
                            row1.insertCell(0).innerHTML = `<b>${DashboardConstants.UIMessageConstants.STRING_Applied_Filters}</b>`;
                            row1.insertCell(1).innerHTML = `<b>${DashboardConstants.UIMessageConstants.STRING_Selected_Value}</b>`;
                            let tableStyle = {
                                backgroundColor: "yellow",
                                border: "1px solid black",
                                marginBottom: "25px",
                                marginTop: "25px"

                            }

                            //this will push the applied filters into the table
                            for (let index = 0; index < appliedFilters.length; index++) {
                                let tr = document.createElement('tr');
                                let td1 = document.createElement('td');
                                let td2 = document.createElement('td');
                                //adding style to both the  td
                                td1.setAttribute("style", "word-break:break-all;");
                                td2.setAttribute("style", "word-break:break-all;");
                                let appliedFilterSelectedValue = [];
                                if (
                                    [
                                        DashboardConstants.FilterType.MultiSelect,
                                        DashboardConstants.FilterType.Number
                                    ].indexOf(appliedFilters[index].FilterType) != -1 &&
                                    appliedFilters[index].FilterBy == DashboardConstants.FilterBy.FilterBySelection
                                ) {
                                    map(appliedFilters[index].selectedFilterList, (filters) => {
                                        appliedFilterSelectedValue.push(filters.title);

                                    });
                                }
                                else {
                                    appliedFilterSelectedValue.push(appliedFilters[index].filterChipName);
                                }
                                //this is the data for table tag td1
                                let td1_data = document.createTextNode(appliedFilters[index].DisplayName.toLocaleString());
                                //this is the data for table tag td2
                                let td2_data = document.createTextNode(appliedFilterSelectedValue.toLocaleString());
                                td1.appendChild(td1_data);
                                td2.appendChild(td2_data);
                                tr.appendChild(td1);
                                tr.appendChild(td2);
                                table.appendChild(tr);
                            }
                            //adding style to table
                            for (let key in tableStyle) {
                                table.style[key] = tableStyle[key];
                            }
                            //adding the table before the first children
                            //let insertBeforeNode=document.querySelector("highcharts-g82gdbc-107");
                            let insertBeforeNode = document.querySelector("#exportToPdf");
                            insertBeforeNode.insertBefore(table, insertBeforeNode.childNodes[1]);
                        }                       
                        //this is each widget div which has class "grid-stack-item-content.dashboard-widget-content"
                        let eachWidgetDiv = document.querySelectorAll("div.grid-stack-item-content.dashboard-widget-content");
                        //adding border to every widget for more clarity
                        map(eachWidgetDiv, (ele) => {
                            ele = ele as HTMLElement;
                            ele["style"].border = "groove rgb(211,211,211)";
                        });
                        //setting the transform style property to none because html2canvas does not render transform style properly
                        map(document.querySelectorAll("#summaryCardChangesForExport"), (ele) => {
                            ele = ele as HTMLElement;
                            ele["style"].left = "9%";
                            ele["style"].top = "20%";
                            ele["style"].transform = "none";
                        });

                        //removing the class summary-card-description as it is not getting rendered properly
                        map(document.querySelectorAll(".summary-card-description"), (x) => {
                            x.className = x.className.replace("summary-card-description", "");
                        });
                        //removing the absolute path and taking just the id as html2canvas does not render it yet.Local developement gives full path.uncomment it if you want it to work locally
                        // map(document.querySelectorAll(".highcharts-legend-item.highcharts-undefined-series.highcharts-color-undefined rect"), (x) => {
                        //     if (x.hasAttribute("fill") && x.getAttribute("fill").slice(4).startsWith("#")) {


                        //     } else {
                        //         var replaceWithIndexValue = x.getAttribute("fill").indexOf("#");
                        //         var replaceValue = x.getAttribute("fill").slice(replaceWithIndexValue);
                        //         x.setAttribute("fill", "url(" + replaceValue);
                        //     }
                        // });
                        //removing this div because html2canvas cannot rendersimage which has height and width=0 .
                        let domElementToRemove = document.querySelectorAll(".NavBar_MapTypeButtonDropDownIcon.NavBar_MapTypeButtonHeight.selectorIconDropDown");
                        //finding all the div which has id MapStyleSelector
                        let parentDivIdForMap = document.querySelectorAll("#MapStyleSelector");
                        map(domElementToRemove, (y) => {
                            if (parentDivIdForMap.length > 0) {

                                map(parentDivIdForMap, (x) => {
                                    //removing domElementToRemove from dom
                                    if (x.contains(y)) {
                                        x.removeChild(y);
                                    }

                                })
                            }
                        });
                        // this code will work only on internet explorer
                        if (trident > 0) {
                            let svgElements = document.querySelectorAll('#exportToPdf .highcharts-container svg.highcharts-root');
                            map(svgElements, (svgElement) => {
                                let canvas = document.createElement("canvas");
                                let xml = (new XMLSerializer()).serializeToString(svgElement);
                                xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                                (<any>Canvg)(canvas, xml)
                                let imgToPng = canvas.toDataURL("image/png");
                                // imagePngList.push(imgToPng);
                                $(svgElement).replaceWith("<img src=" + imgToPng + ">");
                            });
                        }

                        //removing this piece of code as it is not getting rendered properly on some browser
                        var mapElemenrRemoval = document.querySelectorAll("#MapStyleSelector");
                        map(mapElemenrRemoval, (mapDropDownSelector) => {
                            mapDropDownSelector.parentNode.removeChild(mapDropDownSelector);
                        });

                        //setting up the confidelity note at the bottom
                        let confidentialityDivNode = document.createElement("div");
                        confidentialityDivNode.setAttribute("style", "word-break:break-all;color:black;top:10px,hyphens:auto;-ms-hyphens: auto");
                        confidentialityDivNode.setAttribute("id", "confidentialityNote");
                        let confidentialityTextNode = document.createElement("p");
                        document.querySelector("#exportToPdf").appendChild(confidentialityDivNode);
                        document.querySelector("#confidentialityNote").appendChild(confidentialityTextNode);
                        confidentialityTextNode.innerHTML = DashboardConstants.UIMessageConstants.STRING_Confidentiality_Message.replace("{{buyerPartnerName}}", buyerPartnerName);


                    },
                    removeContainer: true,
                    logging: false,
                    useCORS: true,
                    allowTaint: true //this will allow data from different origin to modify the existing canvas

                }).then(canvas => {

                    let imgWidth = 208;
                    let imgHeight = canvas.height * imgWidth / canvas.width;
                    let constUrl = canvas.toDataURL('image/png');
                    let pdf = new jspdf();
                    if (canvas.width <= (screen.width - screen.width / 4)) {
                        if (canvas.width > canvas.height) {
                            pdf = new jspdf('l', 'mm', [canvas.width, canvas.height]);
                        }
                        else {
                            pdf = new jspdf('p', 'mm', [canvas.height, screen.width / 2]);
                        }

                    }
                    else if (screen.width <= 1680) {
                        if (canvas.width > canvas.height) {
                            pdf = new jspdf('l', 'mm', [canvas.height, screen.width / 2]);
                        }
                        else {
                            pdf = new jspdf('p', 'mm', [canvas.height / 2, screen.width / 2]);
                        }
                    }
                    else {
                        if (canvas.width > canvas.height) {
                            pdf = new jspdf('l', 'mm', [canvas.height / 1.5, screen.width / 3]);
                        }
                        else {
                            pdf = new jspdf('p', 'mm', [canvas.height / 3, screen.width / 3]);
                        }
                    }
                    pdf.addImage(constUrl, 'PNG', 10, 10, imgWidth, imgHeight);
                    pdf.save(viewname + '.pdf');
                    this.hideLoader();

                }).catch((error) => {
                    console.log(error);
                    this.hideLoader();
                    this.getMessageDialog(DashboardConstants.UIMessageConstants.STRING_Export_Message_Error_Display, () => { }, DashboardConstants.OpportunityFinderConstants.STRING_ERROR, DashboardConstants.UIMessageConstants.STRING_OK_BTN_TEXT)
                });
        }
        else {
            this.getMessageDialog(DashboardConstants.UIMessageConstants.STRING_Widgets_Not_Loaded_Warning_ForExport, () => { }, DashboardConstants.OpportunityFinderConstants.STRING_WARNNING, DashboardConstants.UIMessageConstants.STRING_OK_BTN_TEXT);
        }
    }

    public isDrillDriveActiveOnView(): boolean {
        for (let iCount = 0; iCount < this._widgetCards.length; iCount++) {
            return (this._widgetCards[iCount].driveConfig.isDriver || this._widgetCards[iCount].driveConfig.isDriven);
        }
        return false;

    }
    //This method can be used to find the ancestor of the passed element that contains the passed class
    public findAncestor(el, cls) {
        if (el.classList != undefined) {
            while ((el = el.parentNode) && el && !el.classList.contains(cls));
            return el;
        }
        else {
            while ((el = el.parentNode) && el && el.getAttribute('class').indexOf(cls) == -1);
            return el;
        }
    }

    getGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getAggregationOfObjectValues(obj: any) {
        let finalObj = {};
        Object.keys(DashboardConstants.AggregateFunction).reverse().forEach(k => {
            switch (k) {
                case DashboardConstants.AggregateFunction.Average:
                    finalObj[DashboardConstants.AggregateFunction.Average] = finalObj[DashboardConstants.AggregateFunction.Sum.toString()] / Object.keys(obj).length;
                    break;
                case DashboardConstants.AggregateFunction.Min:
                    finalObj[DashboardConstants.AggregateFunction.Min] = Math.min(...values(obj));
                    break;
                case DashboardConstants.AggregateFunction.Max:
                    finalObj[DashboardConstants.AggregateFunction.Max] = Math.max(...values(obj));
                    break;
                case DashboardConstants.AggregateFunction.Sum:
                    finalObj[DashboardConstants.AggregateFunction.Sum] = [].concat(values(obj)).reduce((a, c) => a + c);
                    break;
            }
        });
        return finalObj;
    }

    evaluateFormulaExpression(expression: string) {
        try {
            let result = eval(expression);
            if (result == Infinity)
                return null;
            return result;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    sortMonthInChronologicalOrder(selectedMonthArray) {
        let monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        selectedMonthArray.sort(function (a, b) {
            return monthsArray.indexOf(a.name) - monthsArray.indexOf(b.name);
        });
        return selectedMonthArray;
    }
  
      getProductName() {
        switch (this._appConstants.userPreferences.moduleSettings.productTitle) {
            case productTitle[productName.defaultVisionProduct]:
                return productName.defaultVisionProduct;
            case productTitle[productName.awardScenariosProduct]:
                return productName.awardScenariosProduct;
            case productTitle[productName.bidInsightsProduct]:
                return productName.bidInsightsProduct;
            case productTitle[productName.categoryWorkbenchProduct]:
                return productName.categoryWorkbenchProduct;
            case productTitle[productName.fraudAnomalyProduct]:
                return productName.fraudAnomalyProduct;
            case productTitle[productName.opportunityAssessmentProduct]:
                return productName.opportunityAssessmentProduct;
            case productTitle[productName.opportunityFinderProduct]:
                return productName.opportunityFinderProduct;
            case productTitle[productName.scorecardProduct]:
                return productName.scorecardProduct;
        }
    }


}
