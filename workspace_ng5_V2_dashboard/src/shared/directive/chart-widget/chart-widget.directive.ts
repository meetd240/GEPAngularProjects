import {
    Directive, Input, Output, EventEmitter,
    ElementRef, Injectable
} from '@angular/core';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { DashboardConstants } from '@vsDashboardConstants';
import * as Highcharts from 'highcharts';

declare var require: any;
require('highcharts/modules/stock')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/pareto')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

// require('highcharts-custom-events')(Highcharts);


@Injectable()
export class chartWidgetService {
    onCallback: any;

    constructor() {
    }

    register(callback) {
        this.onCallback = callback;
    }
    updateChart(obj) {
        this.onCallback && this.onCallback(obj);
    }

}

@Directive({
    selector: '[chartWidget]'
})
export class ChartWidgetDirective {

    @Input() config: any;
    @Output() eventHandler: EventEmitter<any> = new EventEmitter<any>();
    private _chart: any;
    constructor(
        private _elementRef: ElementRef) {

    }

    ngOnInit() {
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        this.config.chartAPI = {};
        this.config.chartAPI.updateChart = this.updateChart.bind(this);
        this.config.chartAPI.reflowChart = this.reflowChart.bind(this);

        this.renderGraph();
    }


    renderGraph() {
        // Preparing the Chart for the Indivdual Card.
        let chartJson: any = (
            this.config.chartType == AnalyticsCommonConstants.ReportViewType.treemap
        ) ? this.getTreemapChartJson() : this.getChartJson();
        this._chart = Highcharts.chart(this._elementRef.nativeElement, chartJson);
        this.eventHandler.emit({ eventType: 'render' });
    }

    getTreemapChartJson(updatedConfig: any = undefined) {
        if (updatedConfig != undefined) {
            this.config = updatedConfig;
        }
        let thisRef = this;
        return {
            chart: {
                zoomType: 'xy'
            },
            credits: {
                enabled: false
            },
            colorAxis: {
              stops: this.config.chartColors
            },
            series: [
                {
                    type: thisRef.config.series.type,
                    layoutAlgorithm: thisRef.config.series.layoutAlgorithm,
                    tooltip: thisRef.config.series.tooltip,
                    data: thisRef.config.series.data,
                    cursor: thisRef.config.series.cursor,
                    turboThreshold: 0,
                    events: {
                        // dblclick: function (event) {
                        //     thisRef.eventHandler.emit({ event: event, eventType: 'doubleClick', data: {} });
                        // },
                        click: function (event) {
                            thisRef.eventHandler.emit({
                                event: event, eventType: DashboardConstants.EventType.Click,
                                data: { category: this, series: thisRef.config.series }
                            });
                        },
                        contextmenu: function (event) {
                            thisRef.eventHandler.emit({
                                event: event, eventType: DashboardConstants.EventType.ContextMenu,
                                data: { category: this, series: thisRef.config.series }
                            });
                        }
                    }
                }],
            title: {
                align: 'left',
                verticalAlign: 'bottom',
                style: {
                    fontSize: '12px'
                },
                text: (function () {
                    var data = thisRef.config.graphTitle;
                    return '';
                }())
            }
        }
    }

    getChartJson(updatedConfig: any = undefined) {
        if (updatedConfig != undefined) {
            this.config = updatedConfig;
        }
        let thisRef = this,
            standardFontSize = '12px',
            standardFontFamily = 'Noto Sans, sans-serif',
            standardColor = '#5c5c5c',
            chartObj = {
                chart: {
                    zoomType: 'xy',
                    style: {
                        fontSize: standardFontSize,
                        fontFamily: standardFontFamily,
                        color: standardColor
                    },
                    animation: true
                    //type: this.config.chart.type
                },
                credits: {
                    enabled: false
                },
                colors: this.config.chartColors,
                xAxis: thisRef.config.xAxis,
                yAxis: (function () {
                    return thisRef.config.yAxis;
                }()),
                plotOptions: thisRef.config.plotOptions,
                pane: thisRef.config.pane,
                title: {
                    align: 'left',
                    verticalAlign: 'bottom',
                    style: {
                        fontSize: '12px'
                    },
                    text: (function () {
                        var data = thisRef.config.graphTitle;
                        return '';
                    }())
                },
                tooltip: (function () {
                    return thisRef.config.tooltip !== undefined ? thisRef.config.tooltip : {};
                }()),
                init: false,
                legend: this.config.legend || { enabled: false },
                series: (function () {
                    thisRef.bindEventsOnseries(thisRef.config.series);
                    return thisRef.config.series;
                }())
            };

        return this.addChartSpecificConfig(chartObj);
    }

    bindEventsOnseries(series) {
        if (series && series.length > 0) {
            let thisRef = this,
                events = {
                    // dblclick: function (event) {
                    //     thisRef.eventHandler.emit({ event: event, eventType: 'doubleClick', data: { category: this, series: series } });
                    // },
                    click: function (event) {
                        thisRef.eventHandler.emit({ event: event, eventType: DashboardConstants.EventType.Click, data: { category: this, series: series } });
                    },
                    contextmenu: function (event) {
                        thisRef.eventHandler.emit({ event: event, eventType: DashboardConstants.EventType.ContextMenu, data: { category: this, series: series } });
                    }
                };
            series.forEach((data, index) => {
                data.events = Object.assign(events);
            });
        } else {
            return;
        }

    }

    updateChart(updatedConfig: any = undefined) {

        let chartJson: any = (
            this.config.chartType == AnalyticsCommonConstants.ReportViewType.treemap
        ) ? this.getTreemapChartJson(updatedConfig) : this.getChartJson(updatedConfig);
        this._chart = Highcharts.chart(this._elementRef.nativeElement, chartJson);
        this.eventHandler.emit({ eventType: DashboardConstants.EventType.UpdateChart, event: this });
    }

    reflowChart(t) {
        this._chart.setSize(this._elementRef.nativeElement.offsetWidth, this._elementRef.nativeElement.offsetHeight, true);
        this._chart.options.chart.width = null;
        this._chart.options.chart.height = null;
        this._chart.reflow();
        this.eventHandler.emit({ eventType: 'reflow' });
    }

    private addChartSpecificConfig(chartObj: any): any {
        switch (this.config.chartType) {
            case AnalyticsCommonConstants.ReportViewType.HeatMap:
                {
                    chartObj['colorAxis'] = {
                        min:this.config.colorAxis.min,
                        max:this.config.colorAxis.max,
                         stops: this.config.chartColors
                    }
                }
                return chartObj;
            default:
                return chartObj;
        }
    }

}
