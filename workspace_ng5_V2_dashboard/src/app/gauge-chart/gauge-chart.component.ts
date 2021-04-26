import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardConstants } from '@vsDashboardConstants';
import { filter } from 'lodash';
import { DashboardCommService } from '@vsDashboardCommService';


@Component({
    selector: 'gauge-chart',
    templateUrl: './gauge-chart.component.html',
    styleUrls: ['./gauge-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})

export class GaugeChartComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() config: any;
    gaugeChartConfigList: any = [];
    // @Output() gaugeCharteventHandler: EventEmitter<any>;
    constructor(
        private _commUtils: CommonUtilitiesService,
        private _cdRef: ChangeDetectorRef,
        private _dashboardCommService: DashboardCommService
    ) { }

    ngOnInit() {
        this.config.config.renderMultiGuageChart = this.renderMultiGuageChart.bind(this);
        this.config.config.reflowMultipleGaugeChart = this.reflowMultipleGaugeChart.bind(this);
        this.config.config.changeDetectionMutation.setMultiGaugeChartComponentState = this.setMultiGaugeChartComponentState.bind(this);
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

    eventHandlerCallback(event) {
        if (event.eventType === DashboardConstants.EventType.Click) {
            this._dashboardCommService.chartDriveFilterValue = event.event.point.series.name;
        }
        this.config.api.eventHandler(event);
    }

    private renderMultiGuageChart() {
        if (!this._commUtils.isEmptyObject(this.config.config)) {
            this.gaugeChartConfigList = this.config.config.config;
            this.gaugeChartConfigList.map(obj => obj.graphTitle = "")
            this.config.config.config.forEach(obj => {
                if (obj.chartAPI) {
                    obj.chartAPI.updateChart(obj);
                }
            });
            this.setMultiGaugeChartComponentState();
        }
    }

    private reflowMultipleGaugeChart() {
        const thisRef = this;
        if (!this._commUtils.isEmptyObject(this.config.config.config)) {
            this.gaugeChartConfigList = this.config.config.config;
            this.performMultiGuageAction(this.gaugeChartConfigList).then((response: boolean) => {
                if (response) {
                    let widget: any = filter(this._commUtils._widgetCards, (card) => { return card.driveConfig.isDriver })[0];
                    if (widget && widget.driveConfig.isDriver) {
                        let element = document.getElementsByClassName('DashboardCard-' + widget.cardId)[0].getElementsByClassName('gaugeChart');
                        for (let i = 0; i < element.length; i++) {
                            let _chartConfigName: string = ($(element[i]).highcharts() as any).series[0].name;
                            if (_chartConfigName != thisRef._dashboardCommService.chartDriveFilterValue) {
                                element[i]['style']['opacity'] = 0.3;
                            }
                            else {
                                element[i]['style']['opacity'] = 1;
                            }
                        }
                    }
                    else {
                        this._commUtils._widgetCards.forEach((widget, index) => {
                            let element = document.getElementsByClassName('DashboardCard-' + widget.cardId)[0].getElementsByClassName('gaugeChart');
                            for (let i = 0; i < element.length; i++) {
                                element[i]['style']['opacity'] = 1;
                            }
                        })
                    }
                }
            })
        }
    }

    private performMultiGuageAction(list: any): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            list.forEach(obj => {
                if (obj.chartAPI) {
                    obj.chartAPI.reflowChart(obj);
                }
            });
            this.setMultiGaugeChartComponentState();
            resolve(true);
        })
    }

    private setMultiGaugeChartComponentState() {
        this._cdRef.markForCheck();
    }
}
