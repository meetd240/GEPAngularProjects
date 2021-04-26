import { Injectable, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { Subject } from 'rxjs';
import * as wjcOlap from 'wijmo/wijmo.olap';
import * as wjcCore from 'wijmo/wijmo';
import { DashboardConstants } from '@vsDashboardConstants';
import { DashboardCommService } from '@vsDashboardCommService';
import { config } from 'smart-button';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
var IswijmoOverridingDone = false;

@Injectable()
export class OlapGridDirectiveService implements OnInit, OnDestroy {

    public olapGridService$ = new Subject<any>();
    private old_sendHttpRequest = wjcOlap._ServerConnection.prototype['_sendHttpRequest'];
    constructor(
        @Inject(CommonUtilitiesService) private _commUtils: CommonUtilitiesService,
        public _dashboardCommService: DashboardCommService
    ) {

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.olapGridService$.complete();
    }

    public checkReportObjectWidth(reportObjectWidth: any) {
        return parseFloat(reportObjectWidth) < 0 || reportObjectWidth ? 150 : reportObjectWidth;
    }

    public preparePrivotEngine(_preparePrivotEngine: any, config: any, options: any) {
        const { reportDetails } = config;
        const { olapPivotEngineConfig } = config.config;
        const _reportObjects = [] as Array<any>;
        //Geeting the Combined RO Objects;
        this._commUtils.getCombineColumnValueRowRO(reportDetails).map((_croValue: any, _croKey: number) => {
            //this will push  expression and derived ro type in reportObjects if it is a trend measure object. 
            if(_croValue.derivedRoType &&  _croValue.derivedRoType==AnalyticsCommonConstants.DerivedRoType.TrendMeasureType)
            {
                _reportObjects.push({
                    displayName: _croValue.displayName,
                    reportObjectName: _croValue.reportObjectName,
                    reportObjectWidth: this.checkReportObjectWidth(_croValue.reportObjectWidth),
                    derivedRoType:_croValue.derivedRoType,
                    expression:_croValue.expression
                });
            }
            else{
                _reportObjects.push({
                displayName: _croValue.displayName,
                reportObjectName: _croValue.reportObjectName,
                reportObjectWidth: this.checkReportObjectWidth(_croValue.reportObjectWidth),
                });
            }
        });
        _preparePrivotEngine.engineId = olapPivotEngineConfig.engineId;
        _preparePrivotEngine.autoGenerateFields = olapPivotEngineConfig.autoGenerateFields;
        _preparePrivotEngine.sortOnServer = olapPivotEngineConfig.sortOnServer;
        _preparePrivotEngine.allowSorting = olapPivotEngineConfig.allowSorting;
        _preparePrivotEngine.showZeros = olapPivotEngineConfig.showZeros;
        _preparePrivotEngine.old_success = olapPivotEngineConfig.old_success;
        _preparePrivotEngine.totalsBeforeData = olapPivotEngineConfig.totalsBeforeData;
        _preparePrivotEngine.itemsSource = olapPivotEngineConfig.itemsSource;
        _preparePrivotEngine.showColumnTotals = olapPivotEngineConfig.showColumnTotals;
        _preparePrivotEngine.showRowTotals = olapPivotEngineConfig.showRowTotals;
        reportDetails.isLazyLoadingRequired = true;
        reportDetails.isGrandTotalRequired = options.showGrandtotal;
        reportDetails.isSubTotalRequired = options.showSubtoal;
        reportDetails.reportRequestKey = config.reportRequestKey;
        reportDetails.pageIndex = config.pageIndex;

        const reportMeteData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetails);
        _preparePrivotEngine.customData = JSON.stringify(reportMeteData);


        // Claring All the Fields from Pivot Engine
        _preparePrivotEngine.fields.splice(0, _preparePrivotEngine.fields.length);
        _preparePrivotEngine.rowFields.splice(0, _preparePrivotEngine.rowFields.length);
        _preparePrivotEngine.columnFields.splice(0, _preparePrivotEngine.columnFields.length);
        _preparePrivotEngine.valueFields.splice(0, _preparePrivotEngine.valueFields.length);
        let trendMeasureNames=[];
        //Creating the Pivot Engine Fields
        for (var _roCount = 0; _roCount < _reportObjects.length; _roCount++) {
            _preparePrivotEngine.fields.push(
                new wjcOlap.PivotField(
                    _preparePrivotEngine,
                    _reportObjects[_roCount].reportObjectName,
                    _reportObjects[_roCount].displayName,
                    {
                        width: this.checkReportObjectWidth(_reportObjects[_roCount].reportObjectWidth),
                    }
                )
            );
           
            //this code will push two extra column of trend measure when trend measure with display percentage change along with value column is pinned here.
            if( _reportObjects[_roCount].derivedRoType==AnalyticsCommonConstants.DerivedRoType.TrendMeasureType)
            {
                let trendMeasureExpression=JSON.parse(_reportObjects[_roCount].expression);
                if(trendMeasureExpression.TrendMeasureDisplayOptions==AnalyticsCommonConstants.trendMeasureReportViewOptions.DisplayPercentageChangeAndValueColumn)
                {
                    if(trendMeasureNames.indexOf(trendMeasureExpression.CurrentSpendName)==-1)
                    {
                        //this will push current spend column  of trend measure 
                        _preparePrivotEngine.fields.push(
                            new wjcOlap.PivotField(
                                _preparePrivotEngine,
                                trendMeasureExpression.CurrentSpendName,
                                trendMeasureExpression.CurrentSpendName,
                                {
                                    width: this.checkReportObjectWidth(_reportObjects[_roCount].reportObjectWidth),

                                }
                            )
                        );
                        trendMeasureNames.push(trendMeasureExpression.CurrentSpendName);
                    }
                    if(trendMeasureNames.indexOf(trendMeasureExpression.PreviousSpendName)==-1)
                    {
                        //this will push previous spend column of trend measure 
                        _preparePrivotEngine.fields.push(
                            new wjcOlap.PivotField(
                                _preparePrivotEngine,
                                trendMeasureExpression.PreviousSpendName,
                                trendMeasureExpression.PreviousSpendName,
                                {
                                    width: this.checkReportObjectWidth(_reportObjects[_roCount].reportObjectWidth),

                                }
                            )
                        );
                        trendMeasureNames.push(trendMeasureExpression.PreviousSpendName);

                    }
                }
            }

        }

        //Creating the Pivot Engine Row Fields from Report Object in ROWS
        reportDetails.lstReportObjectOnRow.map((_roValue: any, _roKey: number) => {
            _preparePrivotEngine.rowFields.push(
                new wjcOlap.PivotField(
                    _preparePrivotEngine,
                    _roValue.reportObjectName,
                    _roValue.displayName,
                    {
                        
                        width: this._dashboardCommService.getReportObjectWidthForPersistance(_roValue.reportObjectId ,_preparePrivotEngine.engineId),
                        format: this._commUtils.getFlexWijmoFormat(_roValue.formatKey, _roValue.filterType, _roValue.ConfigurationValue)
                    }
                )
            );
        });

        //Creating the Pivot Engine Column Fields from Report Object in COLUMNS
        reportDetails.lstReportObjectOnColumn.map((_roValue: any, _roKey: number) => {
            _preparePrivotEngine.columnFields.push(
                new wjcOlap.PivotField(
                    _preparePrivotEngine,
                    _roValue.reportObjectName,
                    _roValue.displayName,
                    {
                        width: this._dashboardCommService.getReportObjectWidthForPersistance(_roValue.reportObjectId,_preparePrivotEngine.engineId),
                        format: this._commUtils.getFlexWijmoFormat(_roValue.formatKey, _roValue.filterType, _roValue.ConfigurationValue)
                    }
                )
            );
        });
        trendMeasureNames.length=0;
        //Creating the Pivot Engine Value Fields from Report Object in VALUES
        reportDetails.lstReportObjectOnValue.map((_roValue: any, _roKey: number) => {
            _preparePrivotEngine.valueFields.push(
                new wjcOlap.PivotField(
                    _preparePrivotEngine,
                    _roValue.reportObjectName,
                    _roValue.displayName,
                    {
                        width: this._dashboardCommService.getReportObjectWidthForPersistance(_roValue.reportObjectId,_preparePrivotEngine.engineId),
                        format: this._commUtils.getFlexWijmoFormat(_roValue.formatKey, _roValue.filterType, _roValue.ConfigurationValue)
                    }
                )
            );
           
            //this code will push two extra column of trend measure when trend measure with display percentage change along with value column is pinned here.
            if(_roValue.derivedRoType==AnalyticsCommonConstants.DerivedRoType.TrendMeasureType)
            {
                let trendMeasureExpression=JSON.parse(_roValue.expression);
                if(trendMeasureExpression.TrendMeasureDisplayOptions==AnalyticsCommonConstants.trendMeasureReportViewOptions.DisplayPercentageChangeAndValueColumn)
                {
                    if(trendMeasureNames.indexOf(trendMeasureExpression.CurrentSpendName)==-1)
                    {
                        //this will push current spend column  of trend measure 
                        _preparePrivotEngine.valueFields.push(
                            new wjcOlap.PivotField(
                                _preparePrivotEngine,
                                trendMeasureExpression.CurrentSpendName,
                                trendMeasureExpression.CurrentSpendName,
                                {
                                    width: this.checkReportObjectWidth(_roValue.reportObjectWidth),
                                    format:""
                                    
                                }
                            )
                        );
                        trendMeasureNames.push(trendMeasureExpression.CurrentSpendName);
                    }
                    if(trendMeasureNames.indexOf(trendMeasureExpression.PreviousSpendName)==-1)
                    {
                        //this will push previous spend column of trend measure 
                        _preparePrivotEngine.valueFields.push(
                            new wjcOlap.PivotField(
                                _preparePrivotEngine,
                                trendMeasureExpression.PreviousSpendName,
                                trendMeasureExpression.PreviousSpendName,
                                {
                                    width: this.checkReportObjectWidth(_roValue.reportObjectWidth),
                                    format:""

                                }
                            )
                        );
                        trendMeasureNames.push(trendMeasureExpression.PreviousSpendName);

                    }
                }
            }
        });
    }

    public getWijmoOverrideMethodsinstance(widgetConfig: any) {
        const gridthisRef = this;
        wjcOlap.PivotField.prototype._getValue = function (item, formatted) {
            var value;
            if (this._ng && this._ng._server) {
                value = item[this.key];
            } else {
                value = this._binding._key
                    ? item[this._binding._key]
                    : this._binding.getValue(item);
            }


            const months = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
            if (isNaN(value) && !isNaN(Date.parse(value)) && months.test(value) == false) {
            }

            if (this._format == 'd') {
                return !formatted || typeof (value) == 'string'
                    ? (!isNaN(Date.parse(value)))? new Date(value):value
                    : wjcCore.Globalize.format(value, this._format);
            }
            else {
                return !formatted || typeof (value) == 'string' || typeof (value) == 'number'
                    ? value
                    : wjcCore.Globalize.format(value, this._format);
            }
        };

        Object.defineProperty(wjcOlap.PivotEngine.prototype, 'isViewDefined', {
            get: function () {
                var vf = this.valueFields.length,
                    rf = this.rowFields.length,
                    cf = this.columnFields.length;
                return vf > 0 || rf > 0 || cf > 0;
            },
            enumerable: true,
            configurable: true
        });

        wjcOlap._ServerConnection.prototype.getOutputView = function (callBack) {
            this.clearPendingRequests();
            this._getMyResults(callBack);
        };

        wjcOlap._ServerConnection.prototype['_getMyResults'] = function (callBack) {
            this._getResults(callBack);
        };

        if (!IswijmoOverridingDone) {
            console.log('******* overriding ************');
            IswijmoOverridingDone = true;
            // This method is used  to get the url for different commands.
            var old_getUrl = wjcOlap._ServerConnection.prototype['_getUrl'];
            wjcOlap._ServerConnection.prototype['_getUrl'] = function (command, token, fieldName) {
                var url = old_getUrl.call(this, command, token, fieldName);
                if (command.toLowerCase() != 'result') {
                    return url;
                }
                return widgetConfig.config.olapPivotEngineConfig.itemsSource;
            }

            wjcOlap._ServerConnection.prototype['_sendHttpRequest'] = function (commands, settings) {
                var httpthisRef = this;
                switch (commands) {
                    case 'Analyses': // AnalysisData
                    case 'Status':   // GetAnalysisStatus
                        // remove the codes for these services as they are replaced with GetAnalysisResult.
                        return;
                    case 'Result':
                        if (!settings) {
                            settings = {};
                        }

                        // change the request type to POST
                        settings.method = 'POST';

                        // pass the view definition to the server.
                        settings.data = {
                        };
                        // pass custom data to the server.
                        settings.data.customData = {
                            test1: this._ng.customData
                        }
                        this._ng.old_success = settings.success;
                        settings.success = function (resp) {
                            const _dataLength = JSON.parse(resp.responseText);
                            if (_dataLength.Data && _dataLength.Data.toLowerCase() === "error") {
                                gridthisRef.olapGridService$.next(
                                    {
                                        EventType: DashboardConstants.EventType.Olap.OlapHttpStatus.Error,
                                        DataLength: -1,
                                        PivotEngineId: httpthisRef._ng.engineId
                                    }
                                );
                            }
                            else {
                                gridthisRef.olapGridService$.next({

                                    EventType: DashboardConstants.EventType.Olap.OlapHttpStatus.Success,
                                    DataLength: _dataLength.length,
                                    PivotEngineId: httpthisRef._ng.engineId
                                });
                                httpthisRef._ng.old_success(resp);
                                //widgetConfig.config.collapseClickEvent();
                                widgetConfig.cardLoader = false;
                                widgetConfig.config.olapGridInstanceConfig.olapCardLoader.hideCardLoader();
                            
                            }
                        }
                        settings.error = function () {
                            gridthisRef.olapGridService$.next(
                                {
                                    EventType: DashboardConstants.EventType.Olap.OlapHttpStatus.Error,
                                    DataLength: -1,
                                    PivotEngineId: httpthisRef._ng.engineId
                                }
                            );
                        }
                        gridthisRef.old_sendHttpRequest.call(this, commands, settings);
                }
            }
        }
    }

    public bindingEventsWijmoGrid({ wijmoPivotGridInstance, olapGridInstanceConfig, currentOlapId }: any) {
        const thisRef = this;
        if (olapGridInstanceConfig.olapEvents.formatItem) {
            wijmoPivotGridInstance.formatItem.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.FormatItem,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            })
        }

         if (olapGridInstanceConfig.olapEvents.resizedColumn) {
            wijmoPivotGridInstance.resizedColumn.addHandler(function (s, e) {
                  thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.ResizedColumn,
                      s: s,
                      e: e,
                      PivotEngineId: currentOlapId
                  });
              });
          }

        else  if (olapGridInstanceConfig.olapEvents.resizedRow) {
            wijmoPivotGridInstance.resizedRow.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.ResizedRow,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }


        else if (olapGridInstanceConfig.olapEvents.resizingColumn) {
            wijmoPivotGridInstance.resizingColumn.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.resizingColumn,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

  
          else if (olapGridInstanceConfig.olapEvents.rowEditStarted) {
            wijmoPivotGridInstance.rowEditStarted.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.RowEditStarted,
                    s: s,
                    e: e
                });
            });
        }

      else if (olapGridInstanceConfig.olapEvents.rowEditStarting) {
            wijmoPivotGridInstance.rowEditStarting.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.RowEditStarting,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

      else if (olapGridInstanceConfig.olapEvents.scrollPositionChanged) {
            wijmoPivotGridInstance.scrollPositionChanged.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.ScrollPositionChanged,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

        else if (olapGridInstanceConfig.olapEvents.selectionChanged) {
            wijmoPivotGridInstance.selectionChanged.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.SelectionChangeded,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

       else if (olapGridInstanceConfig.olapEvents.selectionChanging) {
            wijmoPivotGridInstance.selectionChanging.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.SelectionChanging,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

       else if (olapGridInstanceConfig.olapEvents.updatedLayout) {
            wijmoPivotGridInstance.updatedLayout.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.UpdatedLayout,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

        else if (olapGridInstanceConfig.olapEvents.updatedView) {
            wijmoPivotGridInstance.updatedView.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.UpdatedView,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

        else if (olapGridInstanceConfig.olapEvents.updatingLayout) {
            wijmoPivotGridInstance.updatingLayout.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.UpdatedLayout,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

      else if (olapGridInstanceConfig.olapEvents.updatingView) {
            wijmoPivotGridInstance.updatingView.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.UpdatingView,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

       else if (olapGridInstanceConfig.olapEvents.sortingColumn) {
            wijmoPivotGridInstance.sortingColumn.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.SortingColumn,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

        else if (olapGridInstanceConfig.olapEvents.sortedColumn) {
            wijmoPivotGridInstance.sortedColumn.addHandler(function (s, e) {
                thisRef.wijmoOlapGridEvent({
                    EventType: DashboardConstants.EventType.Olap.OlapEvent.SortedColumn,
                    s: s,
                    e: e,
                    PivotEngineId: currentOlapId
                });
            });
        }

       
    }

    public wijmoOlapGridEvent(eventInfo: any) {
        this.olapGridService$.next(eventInfo);
    }
}
