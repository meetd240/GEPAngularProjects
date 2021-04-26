import {
    Directive, Input, ElementRef, Renderer2, OnInit,
    AfterViewInit, Inject, OnDestroy
} from '@angular/core';
import { AppConstants } from 'smart-platform-services';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';


@Directive({
    selector: '[report-identifier]'
})
export class ReportIdentifierDirective implements OnInit, AfterViewInit, OnDestroy {

    /* 
     *  This report identifier directive let the user know the type ofReports
     * 
     */
    @Input() config: any;

    constructor(
        private _appConstants: AppConstants,
        private _element: ElementRef,
        private _renderer: Renderer2
    ) {

    }

    ngOnInit() {

        if (this._appConstants.userPreferences.moduleSettings.showReportTypeIdentifier) {
            const identifier = this._renderer.createElement('span');
            const config: any = this.getInfofromConfig(this.config);
            identifier.id = `report-identifier-${config.elementId}`;
            // identifier.innerHTML = `<span class="infoname" title="${config.elementTitle}"><span style="padding:5px">${config.elementTitle}</span></span>`;
            if (this.config.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.SummaryCard &&
                this.config.driveConfig.isDriven
            ) {
                identifier.innerHTML += "<br/>";
            }
            this._renderer.appendChild(this._element.nativeElement, identifier);
        }
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

    private getInfofromConfig(config): any {
        return {
            elementId: this.config.cardId,
            elementTitle: this.getTitleBasedUponType(this.config.reportDetails.reportViewType)
        }
    }

    public getTitleBasedUponType(type: AnalyticsCommonConstants.ReportViewType): string {
        switch (type) {
            case AnalyticsCommonConstants.ReportViewType.SummaryCard:
                return 'Summary Card';
            case AnalyticsCommonConstants.ReportViewType.Olap:
                return 'Olap Grid';
            case AnalyticsCommonConstants.ReportViewType.column:
                return 'Column Chart';
            case AnalyticsCommonConstants.ReportViewType.stColumn:
                return 'Stack Column Chart';
            case AnalyticsCommonConstants.ReportViewType.pie:
                return 'Pie Chart';
            case AnalyticsCommonConstants.ReportViewType.spline:
                return 'Spline Chart';
            case AnalyticsCommonConstants.ReportViewType.Flex:
                return 'Flex Grid';
            case AnalyticsCommonConstants.ReportViewType.ExportFlat:
                return 'Export Flat';
            case AnalyticsCommonConstants.ReportViewType.ExportPivot:
                return 'Export Pivot';
            case AnalyticsCommonConstants.ReportViewType.treemap:
                return 'Heatmap Chart';
            case AnalyticsCommonConstants.ReportViewType.MultiAxisChart:
                return 'Multi Axis Chart';
            case AnalyticsCommonConstants.ReportViewType.ParetoChart:
                return 'Pareto Chart';
            case AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart:
                return `100% Stack Column Chart`;
            case AnalyticsCommonConstants.ReportViewType.StackedBarChart:
                return 'Stack Bar Chart';
            case AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart:
                return '100% Stack Bar Chart';
            case AnalyticsCommonConstants.ReportViewType.ClusteredStackedColumnChart:
                return 'Clustered Stacked Column Chart';
            case AnalyticsCommonConstants.ReportViewType.BarChart:
                return 'Bar Chart';
            case AnalyticsCommonConstants.ReportViewType.DonutChart:
                return 'Half Donut Chart';
            case AnalyticsCommonConstants.ReportViewType.GaugeChart:
                return 'Gauge Chart';
            case AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart:
                return 'Column Line Combination Chart';
            case AnalyticsCommonConstants.ReportViewType.BarLineCombinationChart:
                return 'Bar Line Combination Chart';
            case AnalyticsCommonConstants.ReportViewType.BubbleChart:
                return 'Bubble Chart';
            case AnalyticsCommonConstants.ReportViewType.MapChart:
                return 'Map Chart';
            case AnalyticsCommonConstants.ReportViewType.WaterFallChart:
                    return 'Waterfall Chart';
            case AnalyticsCommonConstants.ReportViewType.HistogramChart:
                    return 'Histogram Chart';
            case AnalyticsCommonConstants.ReportViewType.HeatMap:
                 return 'Heat Map';
            default:
                break;
        }
    }


}
