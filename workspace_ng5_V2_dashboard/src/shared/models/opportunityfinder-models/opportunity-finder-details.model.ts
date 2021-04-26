import { Injectable } from '@angular/core';
import { CustomCalculationFormulaModel } from '@vsOpportunityFinderInterface';
import { IOpportunityFinderCreationObjectInfo } from '@vsCommonInterface';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardConstants } from '@vsDashboardConstants';
import { map, each, uniq, concat } from 'lodash';

// Class provides instance properties for ReportDetails which will be used for .
@Injectable()
export class OpportunityFinderModel {
    constructor(
        private customCalculatedFormula: CustomCalculationFormulaModel,
        private _commonUtils: CommonUtilitiesService
    ) {
    }

    public calculateSavingAndEstimatedSaving(_reportObjectDetails): any {
        let uniqueAllROOpportunityFinderReport: any = [];
        //Making the New Instance of the Opportunity Finder Models
        this.customCalculatedFormula = new CustomCalculationFormulaModel();

        uniqueAllROOpportunityFinderReport = concat(
            _reportObjectDetails.LstReportObjectOnColumn || [],
            _reportObjectDetails.LstReportObjectOnRow || [],
            _reportObjectDetails.LstReportObjectOnValue || []);

        uniqueAllROOpportunityFinderReport = map(
            uniq(
                map(uniqueAllROOpportunityFinderReport, function (obj) {
                    return JSON.stringify(obj);
                })
            ), function (obj) {
                return JSON.parse(obj);
            }
        );


        //Getting the Opportunity Finder Report Id based Custom RO Objects and Input RO Objects
        uniqueAllROOpportunityFinderReport.filter((listObj) => {
            if (listObj.CustomFormula != null && listObj.CustomFormula != undefined) {

                if (
                    listObj.ReportObjectType == DashboardConstants.ReportObjectType.Input ||
                    listObj.ReportObjectType == DashboardConstants.ReportObjectType.Custom) {
                    this.customCalculatedFormula.InputCustomReportObject.push({
                        ReportObjectType: listObj.ReportObjectType,
                        ReportObjectName: listObj.ReportObjectName,
                        ReportObjectDefaultValue: DashboardConstants.OpportunityFinderConstants.REPORT_OBJECT_DEFAULT_VALUE,
                        ReportObjectId: listObj.ReportObjectId,
                        CustomFormula: listObj.CustomFormula
                    });
                }

                if (listObj.ReportObjectType == DashboardConstants.ReportObjectType.Custom) {
                    this.customCalculatedFormula.customCalculatedFormula.push({
                        CustomReportObjectName: listObj.ReportObjectName,
                        CustomReportObjectType: listObj.ReportObjectType,
                        CustomReportObjectId: listObj.ReportObjectId,
                        CustomFormula: listObj.CustomFormula,
                        CustomReportFormula: this.getCustomCalculatedFormula(uniqueAllROOpportunityFinderReport, listObj.CustomFormula)
                    })
                    return listObj;
                }
            }
        });

        //Setting the Main Opportunity Finder Reporting Objects Record 
        this.customCalculatedFormula.MainOpportunityFinderReportData = _reportObjectDetails as IOpportunityFinderCreationObjectInfo;

        //Creating the Report Properties Object
        this.getReportProperties(_reportObjectDetails);

        //Creating the RO WijmoGridAggregatedType 
        this.getWijmoGridAggregatedTypeFromReport(uniqueAllROOpportunityFinderReport);
        // console.log(this.InputCustomReportObject);
        return this.customCalculatedFormula;
    }

    private getCustomCalculatedFormula(_distinctReportObjects: any, _customProperties: any): any {
        try {
            let strCustomCalculatedFormula: any = [];
            const delimitter: string = ',';
            if (_distinctReportObjects != undefined && _distinctReportObjects != null && _distinctReportObjects.length > 0 && _customProperties != "" && _customProperties != null && _customProperties != undefined) {
                //console.log(_customProperties.split(delimitter));
                for (let i = 0; i < _customProperties.split(delimitter).length; i++) {
                    if (this._commonUtils.isValidGuid(_customProperties.split(delimitter)[i])) {
                        strCustomCalculatedFormula.push(this.getReportObjectNameByGUID(_distinctReportObjects, _customProperties.split(delimitter)[i]));
                    }
                    else {
                        strCustomCalculatedFormula.push(_customProperties.split(delimitter)[i]);
                    }
                }
            }
            // console.log(strCustomCalculatedFormula); 
            return (strCustomCalculatedFormula != "" && strCustomCalculatedFormula != null && strCustomCalculatedFormula != undefined) ? strCustomCalculatedFormula : '';
        } catch (e) {
            this._commonUtils.getMessageDialog("Method Name : getCustomCalculatedFormula\nError:" + e.messgae,()=>{});
        }
    }

    private getReportObjectNameByGUID(_distinctReportObjects: any, _reportObjectGUID: string): any {
        try {
            let tmpfilterListReportObjects: any;
            if (_distinctReportObjects != null && _distinctReportObjects != undefined
                && _distinctReportObjects.length > 0) {
                tmpfilterListReportObjects = _distinctReportObjects.filter((listObj) => {
                    if (listObj.ReportObjectId.trim().toLowerCase() === _reportObjectGUID.trim().toLowerCase()) {
                        return listObj;
                    }
                })
            }
            return (tmpfilterListReportObjects != undefined && tmpfilterListReportObjects != null && tmpfilterListReportObjects.length > 0) ? tmpfilterListReportObjects[0].ReportObjectName : '';
        } catch (e) {
            this._commonUtils.getMessageDialog("Method Name : getReportObjectNameByGUID\nError:" + e.messgae,()=>{});
        }
    }

    private getReportProperties(_reportObjectDetails: any) {
        try {
            if (_reportObjectDetails != undefined && _reportObjectDetails != null) {
                //defining the IsActionable Properties 
                if (_reportObjectDetails.ReportProperties != undefined &&
                    _reportObjectDetails.ReportProperties != null &&
                    _reportObjectDetails.ReportProperties != DashboardConstants.OpportunityFinderConstants.STRING_EMPTY) {
                    let _reportProperties = JSON.parse(_reportObjectDetails.ReportProperties);
                    // Boolean Convertation is not Supported in Angular 2
                    this.customCalculatedFormula.ReportProperties.IsActionableReport = JSON.parse(_reportProperties.IsActionableReport);
                }
            }
        } catch (e) {
            this._commonUtils.getMessageDialog("Method Name : getReportProperties\nError:" + e.messgae,()=>{});
        }

    }

    private getWijmoGridAggregatedTypeFromReport(_uniqueROObjects) {
        if (_uniqueROObjects != null && _uniqueROObjects != undefined) {
            _uniqueROObjects.filter((_wijmoValues: any, _wijmoKeys: any) => {
                if (_wijmoValues.WijmoGridAggregatedType !== DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._id) {
                    this.customCalculatedFormula.WijmoAggregatedColumns.push({
                        ReportObjectId: _wijmoValues.ReportObjectId,
                        ReportObjectName: _wijmoValues.ReportObjectName,
                        WijmoGridAggregatedTypeId: _wijmoValues.WijmoGridAggregatedType,
                        WijmoGridAggregatedTypeValue: this.getWijmoGridAggregatedTypeValue(_wijmoValues.WijmoGridAggregatedType)
                    });
                }
            });
        }
    }

    private getWijmoGridAggregatedTypeValue(_wijmoGridAggregatedType: number): string {
        if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_AVG._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_AVG._value;
        }
        else if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_CNT._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_CNT._value;
        }
        else if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_SUM._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_SUM._value;
        }
        else if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._value;
        }
        else if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_MAX._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_MAX._value;
        }
        else if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_MIN._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_MIN._value;
        }
        else if (_wijmoGridAggregatedType === DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_STD._id) {
            return DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_STD._value;
        }
        else {
            return DashboardConstants.OpportunityFinderConstants.STRING_EMPTY;
        }
    }

    //Custom Calulcation Formula based Upon Custom Parameter Object
    public calculateCustomEstimatedValues(_objCustomParameters: any, _reportObjectId: string): number {
        try {
            let _calculateValue: any = '';
            _reportObjectId = _reportObjectId.toUpperCase();
            if (
                _objCustomParameters.ObjectCustomFormula.customCalculatedFormula !== null &&
                _objCustomParameters.ObjectCustomFormula.customCalculatedFormula !== undefined &&
                _objCustomParameters.ObjectCustomFormula.customCalculatedFormula != DashboardConstants.OpportunityFinderConstants.STRING_EMPTY) {
                each(_objCustomParameters.ObjectCustomFormula.InputCustomReportObject, (_inputValues: any, _inputKeys: any) => {
                    if (_inputValues.ReportObjectType === DashboardConstants.ReportObjectType.Input) {
                        let _arrEffectiveCustomRO = eval(_inputValues.CustomFormula);
                        if (_arrEffectiveCustomRO != undefined && _arrEffectiveCustomRO.length > 0 && _arrEffectiveCustomRO.indexOf(_reportObjectId) != -1) {
                            each(_objCustomParameters.ObjectCustomFormula.customCalculatedFormula, (_customValues: any, _customKeys: any) => {
                                if (_customValues.CustomReportObjectId.toUpperCase() === _reportObjectId) {
                                    let tempObj = _customValues.CustomReportFormula;
                                    for (let i = 0; i < tempObj.length; i++) {
                                        _calculateValue +=
                                            _objCustomParameters[tempObj[i]] != undefined ? parseFloat(_objCustomParameters[tempObj[i]]) : tempObj[i];
                                    }
                                }
                            });
                        }
                    }
                });
            }
            let calculatedResult = eval(_calculateValue);
            return (calculatedResult != undefined || calculatedResult != null) ? calculatedResult : 0;
        }
        catch (exception) {
            return 0;
        }
    }

    //Manipulating and Generation of Unique Data Row Id for the DAX Response
    public getFlexGridOppFinderData(_reportDetails: any, _moduleType: string, _config: any): Array<any> {
        /**
         *      _reportDetails : Opportunity finder Report Details 
         *      _moduleType    : Code has been written specifically for Opportunity Finder Module
         *      _config        : Widget Component Config is Passing for Flex
         */

        let _gridColumnJson: any = null;
        let _checkExistence: any = null;
        let _strGridColumnJson: any = _config.mainOppFinderReportData.OppFinderDetails.GridColumnsJSON;


        _reportDetails.forEach((_resValues: any, _resKey: any) => {
            let __GENERATE__DATAROW__ID__: string = this._commonUtils.generateUniqueDataRowIdFromResponse(_resValues);
            if (_strGridColumnJson != DashboardConstants.OpportunityFinderConstants.STRING_EMPTY) {
                _gridColumnJson = JSON.parse(_strGridColumnJson);
                _checkExistence = this.checkGridColumnJsonExistInResponse(__GENERATE__DATAROW__ID__, _gridColumnJson);
            }
            //setting th default value for the Active and Inscope Parameters
            _resValues[DashboardConstants.OpportunityFinderConstants.ACTIVE] = false;
            _resValues[DashboardConstants.OpportunityFinderConstants.INSCOPE] =
                _checkExistence ? true : (_strGridColumnJson == '' ? true : false);
            _resValues[DashboardConstants.OpportunityFinderConstants.ID] = _resKey + 1;
            _resValues[DashboardConstants.OpportunityFinderConstants.UNIQUEDATA_ROWID] = __GENERATE__DATAROW__ID__;
            _resValues[DashboardConstants.OpportunityFinderConstants.OBJECT_CUSTOM_FORMULA] = _config.customCalculatedFormula;
            _config.customCalculatedFormula.InputCustomReportObject.forEach((_inpCusValues: any, _inpCusKey: any) => {
                if (_inpCusValues.ReportObjectType === DashboardConstants.ReportObjectType.Input) {
                    _resValues[_inpCusValues.ReportObjectName] = _inpCusValues.ReportObjectDefaultValue;
                    if (_checkExistence != null) {
                        _resValues[_inpCusValues.ReportObjectName] = parseFloat(_checkExistence[_inpCusValues.ReportObjectName]);
                    }
                }
                else if (_inpCusValues.ReportObjectType === DashboardConstants.ReportObjectType.Custom) {
                    if (_inpCusValues.ReportObjectDefaultValue != 0) {
                        _resValues[_inpCusValues.ReportObjectName] = this.calculateCustomEstimatedValues(_resValues, _inpCusValues.ReportObjectId);
                    }
                    else {
                        _resValues[_inpCusValues.ReportObjectName] = _inpCusValues.ReportObjectDefaultValue;
                        if (_checkExistence != null) {
                            _resValues[_inpCusValues.ReportObjectName] = parseFloat(_checkExistence[_inpCusValues.ReportObjectName]);
                        }
                    }
                }
            });
            // }
        });

        return _reportDetails;
    }

     

    private checkGridColumnJsonExistInResponse(__GENERATE__DATAROW__ID__: any, gridColumnJson: any): any {
        for (let intGridJson = 0; intGridJson < gridColumnJson.length; intGridJson++) {
            if (__GENERATE__DATAROW__ID__ === gridColumnJson[intGridJson][DashboardConstants.OpportunityFinderConstants.UNIQUEDATA_ROWID]) {
                return gridColumnJson[intGridJson];
            }
        }
        return null;
    }


}
