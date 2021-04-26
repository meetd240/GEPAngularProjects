import { Injectable } from '@angular/core';
import { SavedFilter } from '@vsMetaDataModels//saved-filter.model';
import { ReportObject } from '@vsMetaDataModels/report-object.model';
import {
  IReportingObjectMultiDataSource, IRelationObjectMapping,

  ICrossSuiteFilterMapping, IFilterList, IFilterConditionOperator, IBeginningOfTheYear, IYearDropdown, IRollingYearsModel, IRollingYear, INextYearsModel, INextYears, IFromyearDropdown, IToYearDropdown, IFilterRadioOperator, IDateModel, IFromDateModel, IToDateModel, IDateRadioModel, IRollingDateModel, INextDateModel, IFilterConditionRangeValue, IFilterConditionMetadata, IFilterConditionValue, IFilterConditionText, IReportObjectInfo, IChartMinMaxValue, IRollingQuarterYearsModel, INextQuarterYearsModel, IPreviousQuarterYearsModel
} from '@vsCommonInterface';
import { ViewFilterDetails } from '@vsViewFilterModels/view-filter-details.model';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { DashboardConstants } from '@vsDashboardConstants';
import { AnalyticsCommonDataService } from '@vsAnalyticsCommonService/analytics-common-data.service'
import { filter, find, each } from 'lodash';
import { numberFormat } from 'highcharts';
import { NumberFormatingService } from "@vsNumberFormatingService";
import { TabFilterDetails } from '@vsTabModels/tab-filter-details-model';
import { GlobalSliderObject } from '@vsMetaDataModels/global-slider-object.model';
declare var $: any;

@Injectable()
export class AnalyticsUtilsService {
  /**
   * <=================================================================================================================>
   * 
   *  THIS IS THE ONE TIME INSTANCE I.E. SINGLE TON CLASS IT DOES NOT PERSIST ANY VALUE AFTER THE CODE EXECUTION
   *  IN FACT THE VALUE WILL GET OVERRIDDEN AND STORED THE LAST EXECUTED VALUE WIDGET CONFIG VALUE.
   *  ********************* BE CAREFUL BEFORE YOU SET ANY EXPECTATION ABOUT THE CODE *********************************
   * 
   * <==================================================================================================================>
   */
  public static _graphConfig: any;
  public static _rowIndex: number;
  public static _masterjson: any;
  public static _drilledRow: string;
  private static _filterConditionMetadata: any;
  static actualPercentageValue: string;

  constructor(
    private _analyticsCommonDataService: AnalyticsCommonDataService
  ) {
  }

  public static MapListOfEntityToArrayOfModel<T>(outputParam: Array<T>, inputParam: Array<T>, model: any): T[] {
    if (inputParam != undefined) {
      for (let i = 0; i < inputParam.length; i++) {
        outputParam.push(new model.jsonToObject(inputParam[i]));
      }
    }
    return outputParam;
  }

  public static setPageSize(dataReportDetails: any, isEligibleForTwentyRows: boolean) {
    if (isEligibleForTwentyRows && dataReportDetails && dataReportDetails.pageSize <= 0)
      dataReportDetails.pageSize = AnalyticsCommonConstants.chartPageSize + 1;
  }

  public static GetWidgetForChart(graphConfig: any, data: any, rowIndex: number) {

    let that = this;
    let widget: any = {};
    let actualPercentageValue: any;
    that._graphConfig = graphConfig;
    that._rowIndex = rowIndex;
    let defaultChartPageSize = that.getChartPageSize(that._graphConfig.reportDetails);
    let metricObjects = that._graphConfig.reportDetails.lstReportObjectOnValue.map(o => o.reportObjectName);
    that._masterjson = this.GenerateChartJson(that._graphConfig.reportDetails.lstReportObjectOnRow, that._graphConfig.reportDetails.lstReportObjectOnColumn, data, defaultChartPageSize);
    widget = {
      xAxis: [],
      graphTitle: "",
      graphSubtitle: "",
      series: [],
      chartType: "",
      yAxis: {},
      chartColors: this.GetChartColors(),
      tooltip: {},
      legend: {},
      pane: {}
    };
    if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.treemap) {
      widget.graphTitle = this.CreateGraphTitle();
      widget.series = this.GetTreeMapSeriesData(metricObjects);
      widget.chartType = graphConfig.reportDetails.reportViewType;
    }
    else if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ParetoChart) {
      let tempSeriesData: Array<any> = this.GetSeriesData(metricObjects, data, defaultChartPageSize);
      widget.xAxis = this.CreateXaxis();
      widget.graphTitle = this.CreateGraphTitle();
      widget.graphSubtitle = this.ShowMessage();
      widget.chartType = graphConfig.reportDetails.reportViewType;
      widget.widgetAPI = graphConfig.config.widgetAPI || {};
      widget.plotOptions = this.getPlotOptions(graphConfig.reportDetails.reportViewType, metricObjects);
      widget.yAxis = this.CreateYaxis(metricObjects, null, null);// Not Sending the tempSeriesdata becasue doesnt required for the pareto charts yAxis Configration
      widget.series = this.CreateParetoSeriesChartData(metricObjects, tempSeriesData);
      widget.tooltip = this.CreateParetoChartTooltip(metricObjects);
      widget.legend = this.getLegendForChart();
      widget.pane = this.getWidgetPane(graphConfig.reportDetails.reportViewType);
    }
    else {
      let tempSeriesData: Array<any> = this.GetSeriesData(metricObjects, data, defaultChartPageSize);
      widget.xAxis = this.CreateXaxis();
      widget.graphTitle = this.CreateGraphTitle();
      widget.graphSubtitle = this.ShowMessage();
      widget.series = tempSeriesData;
      widget.chartType = graphConfig.reportDetails.reportViewType;
      widget.yAxis = this.CreateYaxis(metricObjects, tempSeriesData, data);
      widget.widgetAPI = graphConfig.config.widgetAPI || {};
      widget.plotOptions = this.getPlotOptions(graphConfig.reportDetails.reportViewType, metricObjects);
      widget.tooltip = this.getChartTooltip(graphConfig, metricObjects, data);
      widget.legend = this.getLegendForChart()
      widget.pane = this.getWidgetPane(graphConfig.reportDetails.reportViewType);
      widget.colorAxis = this.getChartColorAxis();
    }
    widget.chartAPI = graphConfig.config.chartAPI;
    return widget;
  }


  private static getWidgetPane(reportViewType: any): any {
    if (reportViewType === AnalyticsCommonConstants.ReportViewType.GaugeChart) {
      return {
        center: ['50%', '75%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      }
    }
    return {};
  }


  private static getChartTooltip(graphConfig: any, metricObjects: any, data: any): any {
    if (this.formattingEnableFor(graphConfig) ||
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart ||
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart
    ) {

      const _numberFormatingService = new NumberFormatingService();
      if (this.formattingEnableFor(graphConfig)) {
        let currentObj: any = this.GetChartReportTooltipFormatting(metricObjects);
        return this.GetDateFormattingTooltip(currentObj, graphConfig);
      }
      else {
        return {
          formatter: function () {
            let columnList = graphConfig.reportDetails.lstReportObjectOnColumn;
            return this.series.name + '<br/>' +
              (columnList.length > 0 ? columnList[0].reportObjectName + ': ' + this.series.name + '<br/>' : "") +
              'Percentage ' + ': <b>' + this.point.percentage.toFixed(2) + '%' + '</b>';
          }
        }
      }
    }

    else if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart) {
      return this.createBubbleChartTooltip();
    }
    else if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart && graphConfig.reportDetails.lstReportObjectOnColumn.length == 1) {
      return this.createWaterfallChartColumnTooltip(graphConfig, metricObjects);
    }
    else if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.GaugeChart) {
      return this.getGuageChartTooltip(metricObjects, data);
    }
    else if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart) {
      return this.CreateMultiAxisChartTooltip(graphConfig, metricObjects);
    }
    else {
      return {};
    }
  }

  public static getLegendForChart() {
    let that = this;
    let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
      columnList = that._graphConfig.reportDetails.lstReportObjectOnColumn,
      rowList = that._graphConfig.reportDetails.lstReportObjectOnRow;

    if ((that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart ||
      that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart)
      && columnList.length == 0) {
      return {
        enabled: false
      }
    }
    if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HeatMap) {
      return {

        align: 'right',
        useHTML: true,
        layout: 'vertical',
        itemStyle: {
          textOverflow: 'clip'
        },
        verticalAlign: 'top',
        symbolHeight: 150,
      }
    }
    else { //Modified By: Sumit Kumar, ModifiedDate: 03/06/2020, Modified Reason: CLI-151471 and Display Lengend full text value dynamically control by highchart only.
      return {
        //align: 'center',
        maxHeight: 40,
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 6,
        //itemWidth: 140,
        itemDistance: 8,
        alignColumns: false,
        layout: 'horizontal',
        navigation: {
          arrowSize: 9,
          style: {
            fontWeight: 'bold',
            color: '#333',
            fontSize: '12px'
          }
        },
        labelFormatter: function () {
          return this.name;
        }
      }
    }
  }

  private static CreateParetoChartTooltip(metricObjects) {
    const currentObj: any =
      find<IReportObjectInfo>(this._graphConfig.reportDetails.lstReportObjectOnValue, { reportObjectName: metricObjects[0] });
    const _numberFormatingService = new NumberFormatingService();
    let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(currentObj.ConfigurationValue, currentObj.filterType);
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    const formatKey: any = (
      currenyBeforeAmount
        && currentObj.formatKey != ""
        && currentObj.formatKey != null
        && currentObj.formatKey != AnalyticsCommonConstants.CommonConstants.Percent ?
        AnalyticsCommonConstants.FormatType[currentObj.formatKey] : ''
    );
    const cumulativePercentage: any = '<br/>' +
      AnalyticsCommonConstants.ParetoChartConfig.CumulativePercentage;
    const percentageWithBold = '<b>' + AnalyticsCommonConstants.FormatType[AnalyticsCommonConstants.CommonConstants.Percent] + '<b/>';

    return {
      shared: this._graphConfig.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.ParetoChart,
      format: configFormat,
      formatter: function () {
        var y = '<b>' + numberFormat(this.y, AnalyticsCommonConstants.ParetoChartConfig.DecimalCumulativePlace) + '</b>';
        var x = this.x;
        if (this.points[1] == undefined) {
          if (this.points[0].series.name == AnalyticsCommonConstants.ParetoChartConfig.CumulativePercentage) {
            return x + cumulativePercentage + y + percentageWithBold;
          }
          else {
            //num formatting
            return x + `<br/>${metricObjects}:` + '<b>' + (this.y, this.points[0].series.tooltipOptions.format != '' ? AnalyticsUtilsService.FormatChartTooltip(this.points[0].y, this.points[0].series.tooltipOptions.format) : (formatKey + numberFormat(this.points[0].y, 0, '.', ',')) + '</b>' + '</b>');
          }
        }
        else {
          // num formatting

          return x + cumulativePercentage + ': <b>' + y + '% </b>' +
            `<br/> ${metricObjects}: ` + '<b>' +
            (this.y, this.points[0].series.tooltipOptions.format != '' ? AnalyticsUtilsService.FormatChartTooltip(this.points[1].y, this.points[0].series.tooltipOptions.format) : (formatKey + numberFormat(this.points[1].y, 0, '.', ',')) + '</b>' + '</b>')
        }
      }
    }
  }

  private static getGuageChartTooltip(metricObjects: any, data: any): any {
    let that = this;
    const _numberFormatingService = new NumberFormatingService();
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue;
    let format = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);
    let colorFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[1].ConfigurationValue, valueList[1].filterType);
    if (valueList.length == 2) {
      let actualValue = data[metricObjects[0]];
      if (format != undefined && format[0] == 'p') {
        actualValue = actualValue * 100;
      }
      return {
        useHTML: true,
        headerFormat: '<span style="font-size:10px">',
        pointFormatter: function () {
          return (valueList[0].displayName + ':' + '<b>'
            + (valueList[0].formatKey != "" && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + _numberFormatingService.FormatChartTooltip(actualValue, format)
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && format == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + '</b><br>'
          )
        },
        footerFormat: '</span>',
        positioner: function (labelWidth, labelHeight, point) {
          var tooltipX = point.plotX - 50;
          var tooltipY = point.plotY - 70;
          return {
            x: tooltipX,
            y: tooltipY
          };
        }
      }
    }
    else {
      let actualValue = data[metricObjects[1]];
      if (colorFormat != undefined && colorFormat[0] == 'p') {
        actualValue = actualValue * 100;
      }
      return {
        useHTML: true,
        headerFormat: '<span style="font-size:10px">',
        pointFormatter: function () {
          return (valueList[1].displayName + ':'
            + ' <b> '
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '' + _numberFormatingService.FormatChartTooltip(actualValue, colorFormat)
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '</b>')
        },
        footerFormat: '</span>',
        positioner: function (labelWidth, labelHeight, point) {
          var tooltipX = point.plotX - 50;
          var tooltipY = point.plotY - 70;
          return {
            x: tooltipX,
            y: tooltipY
          };
        }
      }
    }
  }

  private static getPlotOptions(ReportViewType: AnalyticsCommonConstants.ReportViewType, metricObjects) {
    let that = this;
    const _isDataLabelEnabled: boolean = that.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
    const _selectedFontSize: number = that.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);

    switch (ReportViewType) {
      case AnalyticsCommonConstants.ReportViewType.pie:
        return {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            size: '80%',
            point: {
              events: {
                legendItemClick: function () {
                  const chart = this.series.chart;
                  const series = chart.series;
                  const actualPoint = this.x;
                  series.forEach(series => {
                    series.data.forEach(point => {
                      if (point.x === actualPoint) {
                        if (point.visible) {
                          point.setVisible(false);
                        } else {
                          point.setVisible(true);
                        }
                      }
                    })
                  })
                  return false;
                }
              }
            }
          }
        }
      case AnalyticsCommonConstants.ReportViewType.DonutChart:
        return {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            startAngle: -90,
            endAngle: 90
          },
        }
      case AnalyticsCommonConstants.ReportViewType.ParetoChart: {
        const cumROName: string = metricObjects[0];
        return {
          series: {
            dataLabels: {
              enabled: _isDataLabelEnabled,
              allowOverlap: true,
              crop: false,
              overflow: 'none',
              cursor: 'pointer',
              style: {
                fontWeight: 'normal',
                textShadow: 'none',
                fontSize: _selectedFontSize,
                textOutline: 0
              },
              color: '#000000',
              formatter: function () {
                return AnalyticsUtilsService.FormatChartTooltip(this.y, this.series.tooltipOptions.format)
              }
            },
            events: {
              legendItemClick: function (event) {
                if (this.visible && this.name === cumROName) {
                  this.chart.yAxis[0].update({
                    opposite: true,
                    title: {
                      text: ''
                    }
                  });
                  this.chart.yAxis[1].update({
                    opposite: false
                  });
                }
                else if (!this.visible && this.name === cumROName) {
                  this.chart.yAxis[0].update({
                    opposite: false,
                    title: {
                      text: metricObjects
                    }
                  });
                  this.chart.yAxis[1].update({
                    opposite: true
                  });
                }
              }
            },

          },
        }
      }
      case AnalyticsCommonConstants.ReportViewType.WaterFallChart: {
        if (this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 1) {
          return {
            series: {
              stacking: 'normal',
            },
            WaterFallChart: {
              dataLabels: {
                enabled: _isDataLabelEnabled,
                allowOverlap: true,
                crop: false,
                overflow: 'none',
                cursor: 'pointer',
                style: {
                  fontWeight: 'normal',
                  textShadow: 'none',
                  fontSize: _selectedFontSize,
                  textOutline: 0
                },
                color: '#000000',
              },
              size: '80%'
            }
          }
        }
        else {
          return {
            WaterFallChart: {
              dataLabels: {
                enabled: _isDataLabelEnabled,
                allowOverlap: true,
                crop: false,
                overflow: 'none',
                cursor: 'pointer',
                style: {
                  fontWeight: 'normal',
                  textShadow: 'none',
                  fontSize: _selectedFontSize,
                  textOutline: 0
                },
                color: '#000000',
              },
              size: '80%'
            }
          }
        }

      }

      case AnalyticsCommonConstants.ReportViewType.GaugeChart: {
        return {
          series: {
            cursor: 'pointer'
          },
          solidgauge: {
            dataLabels: {
              y: -40,
              borderWidth: 0,
              useHTML: true
            }
          }
        }
      }
      case AnalyticsCommonConstants.ReportViewType.HistogramChart: {
        return {
          chart: {
            type: "column"
          },
          column: {
            grouping: false,
            shadow: false,
            borderWidth: 0
          },
        }
      }
      case AnalyticsCommonConstants.ReportViewType.HeatMap: {
        return {
          series: {
            turboThreshold: 0,
            dataLabels: {
              overflow: 'none',
              crop: true,
              enabled: true,
              textOutline: 0,
              style: {
                fontWeight: 'normal'
              }
            }
          }

        }
      }
      default:
        return {};
    }
  }
  public static GenerateChartJson(rowList: any, columnList: any, data: any, defaultChartPageSize: number): any {
    if (Array.isArray(data)) {
      if (rowList.length == 0 && columnList.length == 0) {
        return data;
      }
      let that = this;
      let colObjects = [];
      let rowObjects = [];
      let rowOrColumnName = columnList.length && rowList.length == 0 ? columnList[that._rowIndex].reportObjectName : rowList[that._rowIndex].reportObjectName;
      for (var i in data) {
        let series = {};
        if (columnList.length)
          colObjects = data.map(item => item[columnList[0].reportObjectName])
            .filter((value, index, self) => self.indexOf(value) === index);
        if (rowList.length > 0 && rowList[0].reportObjectName != "") {
          rowObjects = data.map(item => item[rowList[0].reportObjectName])
            .filter((value, index, self) => self.indexOf(value) === index);
          if (
            (
              that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.treemap &&
              that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.ParetoChart &&
              that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.pie &&
              that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.WaterFallChart
            ) &&
            rowObjects.length > defaultChartPageSize
          )
            rowObjects.length = rowObjects.length - 1;
        }
        series = { columnObject: colObjects, rowObjects: rowObjects, item: rowOrColumnName }
        data.push(series);
        return data;
      }
    }
    return {};
  }

  private static CreateXaxis() {
    let that = this;
    let xAxis: any = {};
    let data = [],
      currentPage = that._masterjson[that._masterjson.length - 1];
    //TODO - Need to Optimize if-else
    if (that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.MapChart &&
      that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.GaugeChart) {
      if (currentPage.columnObject &&
        (currentPage.columnObject.length && currentPage.rowObjects.length == 0
          && (
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.STColumn ||
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.Spline)
        )
      ) {
        data.push("");
      }
      else if (currentPage.columnObject && currentPage.columnObject.length
        && that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.BubbleChart) {
        if (currentPage.rowObjects.length == 0) {
          data = currentPage.columnObject;
        }
        data = data.concat(currentPage.rowObjects);
        if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
          data.push("Total");
        }
      }
      else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart) {
        if (
          this._graphConfig.reportDetails.lstReportObjectOnRow.length == 1 &&
          this._graphConfig.reportDetails.lstReportObjectOnValue.length == 2 &&
          this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0
        ) {
          data = that._masterjson[that._masterjson.length - 1].rowObjects
        }
        else {
          data = undefined;
          if (this._graphConfig.reportDetails.lstReportObjectOnValue.length == 3) {
            // Adding the x axis specific label for the Bubble chart
            // It will display the first metric value every time because it plots values in x axis
            xAxis.title = { text: this._graphConfig.reportDetails.lstReportObjectOnValue[0].displayName };
          }
        }

      }
      else {
        data = currentPage.rowObjects;
        if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
          data.push("Total");
        }
      }

      this.GetFormattedDateValue(data);

      xAxis.categories = data;

      xAxis.crosshair = { color: 'none' };
      xAxis.gridLineWidth = (
        that._graphConfig.reportDetails.reportProperties &&
        that._graphConfig.reportDetails.reportProperties["gridLineWidth"]
      ) || 0;

      if (that._graphConfig.reportDetails.reportViewType != AnalyticsCommonConstants.ReportViewType.BubbleChart ||
        (
          this._graphConfig.reportDetails.lstReportObjectOnRow.length == 1 &&
          this._graphConfig.reportDetails.lstReportObjectOnValue.length == 2 &&
          this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0
        )
      )
        if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HeatMap) {
          xAxis.startOnTick = false,
            xAxis.endOnTick = false
        }
      xAxis.labels = {
        formatter: function () {
          if (typeof this.value === 'string') {
            return (this.value.length < AnalyticsCommonConstants.chartLabelSize) ? this.value : this.value.substring(0, AnalyticsCommonConstants.chartLabelSize - 1) + '...'
          }

          if( that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart && (typeof this.value == 'number'))
          {
            return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
            ? parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1)) + "B"
            : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
              ? parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1)) + "M"
              : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+3
                ? parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1)) + "K"
                : this.value;
          }
          return this.value;
        }
      }

      return xAxis;
    }
    else {
      return {};
    }
  }

  // This is to handle date timestamp issue on x-axis
  private static GetFormattedDateValue(data: any) {
    let that = this;
    let reportObjects = that._graphConfig.reportDetails.lstReportObjectOnRow.concat(that._graphConfig.lstReportObjectOnColumn);
    let dateObjects = reportObjects.filter((obj: any) => {
      if (obj != undefined)
        return obj.reportObjectDataType === DashboardConstants.ReportObjectDataType.DateTime
    })
    if (dateObjects.length > 0) {
      data.forEach((dObj, index) => {
        if (!isNaN(Date.parse(dObj))) {
          data[index] = new Date(dObj).toLocaleDateString();
        }
      })
    }
  }

  private static GetChartColors(): Array<any> {
    if (this._graphConfig.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.treemap || this._graphConfig.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.HeatMap) {
      return (this._graphConfig.reportDetails.reportProperties.isRangeRedToGreenColor) ? [
        [0, '#8B0707'],
        [0.1, '#ac5200'],
        [0.2, '#b96f00'],
        [0.3, '#e67300'],
        [0.4, '#d58100'],
        [0.5, '#ce9e00'],
        [0.6, '#af9700'],
        [0.7, '#9b9f00'],
        [0.8, '#659c00'],
        [0.9, '#109618']
      ] : [
          [0, '#109618'],
          [0.1, '#659c00'],
          [0.2, '#9b9f00'],
          [0.3, '#af9700'],
          [0.4, '#ce9e00'],
          [0.5, '#d58100'],
          [0.6, '#e67300'],
          [0.7, '#b96f00'],
          [0.8, '#ac5200'],
          [0.9, '#8B0707']
        ];
    }

    else if (this._graphConfig.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.ParetoChart) {
      return ['#f44336', '#2196f3'];
    }
    else if (this._graphConfig.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.HistogramChart) {
      // Storing the index of the Historgram CHart Colors based upon its index Value.
      return [
        [0, 'rgba(165,170,217,1)'],
        [1, 'rgba(126,86,134,.9)'],
        [2, '	rgba(255,165,0,.5)'],
      ];
    }
    else {
      return [
        '#2196f3', '#f44336', '#ff9800', '#4caf50', '#9c27b0', '#3f51b5', '#00bcd4', '#e91e63', '#8bc34a', '#c62828', '#ef6c00', '#795548', '#9e9e9e', '#607d8b', '#1565c0', '#ad1457', '#4527a0', '#00838f', '#4e342e', '#37474f'
      ]
    }
  }

  private static setChartSeriesPointConfig(): Array<any> {
    // Pointpadding and point pointPlacement for Histogram
    if (this._graphConfig.reportDetails.reportViewType === AnalyticsCommonConstants.ReportViewType.HistogramChart) {
      return [
        [1, [0.44, -0.15]],
        [2, [0.44, -0.25]],
        [3, [0.3, -0.2]],
      ];
    }

  }

  private static CreateParetoSeriesChartData(metricObjects, tempSeriesData) {
    /**
     *  The Series Chart data is getting geenrated as the same we are doing for the Pie,Cloumn and 
     *  other charts.So Instead of writing the Seprate Code Making Use of the Same SeriesData function for "Data"
     *  Used in data value of series charts.
     */
    const _isDataLabelEnabled: boolean = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
    const _selectedFontSize: number = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);
    const currentObj: any =
      find<IReportObjectInfo>(this._graphConfig.reportDetails.lstReportObjectOnValue, { reportObjectName: metricObjects[0] });
    const _numberFormatingService = new NumberFormatingService();
    let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(currentObj.ConfigurationValue, currentObj.filterType);
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    const formatKey: any = (
      currenyBeforeAmount
        && currentObj.formatKey != ""
        && currentObj.formatKey != null
        && currentObj.formatKey != AnalyticsCommonConstants.CommonConstants.Percent ?
        AnalyticsCommonConstants.FormatType[currentObj.formatKey] : ''
    );

    const paretoSeriesChartData: any = [
      {
        name: AnalyticsCommonConstants.ParetoChartConfig.CumulativePercentage,
        type: DashboardConstants.ConstantString.ParetoChart,
        yAxis: 1,
        zIndex: 10,
        baseSeries: 1,
        dataLabels: {
          enabled: _isDataLabelEnabled,
          style: {
            fontSize: _selectedFontSize
          },
          formatter: function () {
            return (this.y.toFixed(2) + '%');
          }

        },
        color: this.getSeriesColor(AnalyticsCommonConstants.ParetoChartConfig.CumulativePercentage)

      },
      {
        name: metricObjects[0],
        type: DashboardConstants.ConstantString.Column,
        zIndex: 2,
        data: tempSeriesData[0].data,
        dataLabels: {
          enabled: _isDataLabelEnabled,
          style: {
            fontSize: _selectedFontSize
          },
          formatter: function () {
            return AnalyticsUtilsService.getDatalabelForCommon(configFormat, this.y, formatKey);
          }
        },
        color: this.getSeriesColor(metricObjects[0], 1)
      }
    ];
    return paretoSeriesChartData;
  }
  private static CreateYaxis(metricObjects: any, tempSeriesData: any, data: any) {
    let that = this;
    this.GetFormattedDateValue(tempSeriesData);
    if (
      that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.MultiAxisChart
      && that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.ParetoChart
      && that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.BubbleChart
      && that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.GaugeChart
      && that._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.HeatMap) {
      const yAxisConfig = {
        labels: {
          formatter: function () {
            if (tempSeriesData[0].chartType != AnalyticsCommonConstants.ConstantString.Pie)
              return that.GetChartMetricFormttedValue(this.value)
          }
        },
        title: {
          text: metricObjects[i],//metricObjects.toString().split(',').join('<br/>'),
        }
      }
      this.GetChartMinMaxValue(yAxisConfig, metricObjects[0], data);
      return yAxisConfig;
    }
    else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ParetoChart) {
      //Pareto Chart Yaxis Config Creation inside the CreateYAxis Method
      const yAxisConfig = [
        {
          title: {
            text: metricObjects
          },
          opposite: false,
        }, {
          title: {
            text: AnalyticsCommonConstants.ParetoChartConfig.CumulativePercentage
          },
          minPadding: 0,
          maxPadding: 0,
          opposite: true,
          labels: {
            format: "{value}%"
          },
          min: 0,
          max: 100,
          startOnTick: false,
          gridLineWidth: 0
        }];
      this.GetChartMinMaxValue(yAxisConfig[0], metricObjects[0], data);
      return yAxisConfig;
    }
    else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart) {
      return {
        gridLineWidth: (
          that._graphConfig.reportDetails.reportProperties &&
          that._graphConfig.reportDetails.reportProperties["gridLineWidth"]) || 0,
        title: {
          text: (
            that._graphConfig.reportDetails.lstReportObjectOnRow.length == 1
            && that._graphConfig.reportDetails.lstReportObjectOnValue.length == 2
            && that._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0
          ) ? metricObjects[0] : metricObjects[1]
          }
      }
    }
    else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.GaugeChart) {
      const _numberFormatingService = new NumberFormatingService();
      let Minformat, Maxformat, valueList = this._graphConfig.reportDetails.lstReportObjectOnValue;
      let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
      if (this._graphConfig.reportDetails.lstReportObjectOnValue.length == 2) {
        Maxformat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[1].ConfigurationValue, valueList[1].filterType);
      }
      else {
        Minformat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);
        Maxformat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[2].ConfigurationValue, valueList[2].filterType);
      }
      const yAxisConfig = {
        stops: (this._graphConfig.reportDetails.reportProperties.isRangeRedToGreenColor) ? [
          [0.1, '#8B0707'],
          [0.49, '#8B0707'],
          [0.5, '#55BF3B'],
          [0.9, '#55BF3B']
        ] : [
            [0.1, '#55BF3B'],
            [0.49, '#55BF3B'],
            [0.5, '#8B0707'],
            [0.9, '#8B0707']
          ],
        title: {
          text: tempSeriesData[0]["name"],
          align: 'high',
          offset: 0,
          rotation: 0,
          x: 25,
          y: -10,
          style: {
            width: "100%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }
        },
        labels: this.getYaxisLabelsFormat(),
        tickPositioner: function () {
          return [
            this.min, this.max
          ];
        },
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2
      };
      this.GetChartMinMaxValue(yAxisConfig, metricObjects, data);
      return yAxisConfig;
    }
    else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HeatMap) {
      let currentPage = this._masterjson[this._masterjson.length - 1];
      let countOfCategories = currentPage.columnObject.length;
      const yAxisConfig =
      {
        //visible : false,
        startOnTick: false,
        endOnTick: false,
        categories: this.GetYaxisDataForHeatMap(),
        title: null,
        min: 0,
        max: countOfCategories > 5 ? 5 : countOfCategories - 1,
        scrollbar: {
          enabled: countOfCategories > 6 ? true : false
        }
      }
      return yAxisConfig;
    }
    else {
      let yAxis_Color;
      const temp = [];
      for (var i = 0; i < metricObjects.length; i++) {
        if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart &&
          that._graphConfig.reportDetails.lstReportObjectOnColumn.length > 0)
          yAxis_Color = '#000000';

        else
          yAxis_Color = this.getSeriesColor(metricObjects[i], i);
        temp[i] = {};
        temp[i].labels = {
          style: {
            color: yAxis_Color
          }
        };
        temp[i].labels.formatter = function () {

          return parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+9
            ? parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+9).toFixed(1)) + "B"
            : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+6
              ? parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+6).toFixed(1)) + "M"
              : parseFloat(Math.abs(this.value).toFixed(1)) >= 1.0e+3
                ? parseFloat((Math.sign(this.value) * Math.abs(this.value) / 1.0e+3).toFixed(1)) + "K"
                : this.value;
        };
        temp[i].title = {
          text: metricObjects[i],
          style: {
            color: yAxis_Color
          }
        };
        temp[i].opposite = i % 2;
        this.GetChartMinMaxValue(temp[i], metricObjects[i], data);
      }
      return temp;
    }
  }

  private static GetYaxisDataForHeatMap() {
    let currentPage = this._masterjson[this._masterjson.length - 1];
    var data = [];
    if ((this._graphConfig.reportDetails.lstReportObjectOnColumn.length >= 1 && this._graphConfig.reportDetails.lstReportObjectOnRow.length >= 1
      && (this._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HeatMap))
    ) {
      for (var i = 0; i < currentPage.columnObject.length; i++) {
        data.push(currentPage.columnObject[i]);
      }
    }
    return data;
  }

  private static GetChartMinMaxValue(yAxisConfig, metricObjects: any, data: any) {
    /**
     *  In case of the MultiAxisChart the chartMinMax should expects multi values for different axis
     *  else it should be the only one elemtn in chartMinMax array i.e. chartMinMax[0]
     */
    if (this._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.PercentStackedColumnChart ||
      this._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.PercentStackedBarChart) {

      yAxisConfig.max = 100;
      yAxisConfig.min = 0;
    }
    else if (this._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.MultiAxisChart && this._graphConfig.chartMinMax[0]) {
      const _findMinValue: IChartMinMaxValue = this._graphConfig.chartMinMax.find((x: IChartMinMaxValue) => {
        return x.reportObjectName === metricObjects
      });
      yAxisConfig.max = parseFloat(_findMinValue.max.toString());
      yAxisConfig.min = parseFloat(_findMinValue.min.toString()) < 0 ? parseFloat(_findMinValue.min.toString()) : 0;
    }
    else if (this._graphConfig.reportDetails.reportViewType !== DashboardConstants.ReportViewType.BubbleChart && this._graphConfig.reportDetails.reportViewType !== DashboardConstants.ReportViewType.HeatMap && this._graphConfig.chartMinMax[0]) {
      const chartMinMax: any = this._graphConfig.chartMinMax[0];
      yAxisConfig.max = parseFloat(chartMinMax.max.toString());
      yAxisConfig.min = parseFloat(chartMinMax.min.toString()) < 0 ? parseFloat(chartMinMax.min.toString()) : 0;
    }

    else if (this._graphConfig.reportDetails.reportViewType == DashboardConstants.ReportViewType.HeatMap) {
      const chartMinMax: any = this._graphConfig.chartMinMax[0];
      return {
        max: parseFloat(chartMinMax.max.toString()),
        min: parseFloat(chartMinMax.min.toString()) < 0 ? parseFloat(chartMinMax.min.toString()) : 0,
      }
    }
    else if (this._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.GaugeChart) {
      if (this._graphConfig.reportDetails.lstReportObjectOnValue.length == 3) {
        yAxisConfig.min = data[metricObjects[0]];
        yAxisConfig.max = data[metricObjects[2]];
      }
      else {
        yAxisConfig.min = 0;
        yAxisConfig.max = data[metricObjects[1]];
      }
    }
    /**
        if (this._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.StackedBarChart) {
            yAxisConfig.startOnTick = false;
            yAxisConfig.endOnTick = false;
            temp.gridLineWidth = 0; 
        }
    */
  }

  // In case of heatmap this method will call to set min and max value for coloraxis.
  private static getChartColorAxis() {
    if (this._graphConfig.reportDetails.reportViewType == DashboardConstants.ReportViewType.HeatMap) {
      const chartMinMax: any = this._graphConfig.chartMinMax[0];
      return {
        max: parseFloat(chartMinMax.max.toString()),
        min: parseFloat(chartMinMax.min.toString()) < 0 ? parseFloat(chartMinMax.min.toString()) : 0,
      }
    }
  }

  private static CreateGraphTitle() {
    let that = this;
    let data = "",
      rowList = that._graphConfig.reportDetails.lstReportObjectOnRow,
      columnList = that._graphConfig.reportDetails.lstReportObjectOnColumn,
      valueList = that._graphConfig.reportDetails.lstReportObjectOnValue;
    for (var i = 0; i < valueList.length; i++) {
      data += i != valueList.length - 1 ? (valueList[i].displayName + " and ") : (valueList[i].displayName);
    }
    if (rowList.length >= 1 && columnList.length == 0 && valueList.length == 0) {
      data = "";
    }
    else {
      if (rowList.length > 0 || columnList.length > 0) {
        data += ' by ';
      }
    }
    if (this._graphConfig.reportDetails.reportViewType !== AnalyticsCommonConstants.ReportViewType.ParetoChart) {
      if (rowList.length)
        data += rowList[that._rowIndex].displayName;
      if (columnList.length)
        if (rowList.length == 0)
          data += (columnList[0].displayName);
        else
          data += (' and ' + columnList[0].displayName);
    }
    else {
      data += AnalyticsCommonConstants.ParetoChartConfig.CumulativePercentage;
    }
    return data;
  }

  private static ShowMessage() {
    let that = this;
    let data = "";
    switch (that._graphConfig.reportDetails.lstReportObjectOnRow.filterType) {
      case AnalyticsCommonConstants.FilterType.SingleSelect:
      case AnalyticsCommonConstants.FilterType.MultiSelect:
      case AnalyticsCommonConstants.FilterType.Measure:
      case AnalyticsCommonConstants.FilterType.Tree:
        data = that._graphConfig.reportDetails.lstReportObjectOnValue[0].displayName;
        break;
      default:
        break;
    }
    return data;
  }

  private static GetSeriesData(metricObjects: any, data: any, defaultChartPageSize: number) {
    const that = this;
    const seriesDataConfig = [];

    // Added the code to get the series data if its not type of Bubble Chart type 
    // the intention to do so make if generic code so that reset of the features should be avialble .
    if (that._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.BubbleChart) {
      return this.getBubbleChartSeriesData();
    }
    else if (that._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.MapChart) {
      //Sending the master json record as a series data for Map Chart Type
      return this.getMapChartSeriesData();
    }
    else if (that._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.WaterFallChart && that._graphConfig.reportDetails.lstReportObjectOnColumn.length == 1) {
      return this.getWaterFallSeriesData();
    }
    else if (that._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.GaugeChart) {
      return this.getGaugeChartSeriesData(data);
    }
    else if (that._graphConfig.reportDetails.reportViewType === DashboardConstants.ReportViewType.HeatMap) {
      return this.getHeatMapSeriesData(data);
    }
    else if (that._graphConfig.reportDetails.reportViewType !== DashboardConstants.ReportViewType.BubbleChart) {
      let currentPage = that._masterjson[that._masterjson.length - 1],
        legendNames = null,
        valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
        columnList = that._graphConfig.reportDetails.lstReportObjectOnColumn,
        rowList = that._graphConfig.reportDetails.lstReportObjectOnRow,
        series = [];
      if (

        (currentPage.columnObject.length > 0 && currentPage.rowObjects.length == 0
          && (
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.STColumn ||
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.Spline ||
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.StackedBarChart ||
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.PercentStackedBarChart ||
            that._graphConfig.type == AnalyticsCommonConstants.ConstantString.PercentStackedColumnChart))
      ) {
        legendNames = currentPage.columnObject;
      }
      else if (currentPage.rowObjects.length != 0)
        legendNames = currentPage.columnObject.length ? currentPage.columnObject : metricObjects;
      else if (currentPage.rowObjects.length == 0)
        legendNames = metricObjects;

      //Multi Axis Chart with column    
      if (that._graphConfig.type == AnalyticsCommonConstants.ConstantString.MultiAxes && columnList.length == 1) {
        this.getSeriesArrayForMultiAxisCrossTab(seriesDataConfig, rowList, columnList, valueList, metricObjects, currentPage)
      }
      else {
        let currentObj;

        for (var i = 0; i < legendNames.length; i++) {
          if ((currentPage.columnObject.length > 0 && currentPage.rowObjects.length == 0
            && (
              that._graphConfig.type == AnalyticsCommonConstants.ConstantString.STColumn ||
              that._graphConfig.type == AnalyticsCommonConstants.ConstantString.Spline ||
              that._graphConfig.type == AnalyticsCommonConstants.ConstantString.StackedBarChart ||
              that._graphConfig.type == AnalyticsCommonConstants.ConstantString.PercentStackedBarChart ||
              that._graphConfig.type == AnalyticsCommonConstants.ConstantString.PercentStackedColumnChart))
            || valueList.length == 1)
            currentObj = valueList.find(function (item) { return item.reportObjectName == metricObjects; });
          else
            currentObj = valueList.find(function (item) { return item.reportObjectName == legendNames[i]; });


          seriesDataConfig[i] = {};
          const _numberFormatingService = new NumberFormatingService();
          let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
          let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(currentObj.ConfigurationValue, currentObj.filterType);

          /**
           *  Adding the report view type in series type config to get the report view during dynamic report config preparation
           *  becasue the service is singleton and does not persist the value
          */
          seriesDataConfig[i].reportViewType = that._graphConfig.reportDetails.reportViewType;


          seriesDataConfig[i].tooltip = {
            headerFormat: (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart) ?
              '<span style="font-size:10px">' + (rowList.length > 0 ? rowList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>'
              : '<span style="font-size:10px">' + (columnList.length > 0 ? columnList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
            format: configFormat,
            formatKey: currentObj.formatKey,
            currenyBeforeAmount: currenyBeforeAmount,

            //Pointer formating for charts when user hovers on charts
            pointFormatter: function () {
              return that.getSeriesPointFormatter(this);
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          };


          seriesDataConfig[i].cursor = AnalyticsCommonConstants.ConstantString.Pointer;
          seriesDataConfig[i].type = that.getSeriesChartType(seriesDataConfig[i], that._graphConfig);
          if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.DonutChart) {
            seriesDataConfig[i].innerSize = '50%'
          }
          if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.pie) {
            AnalyticsUtilsService.getCommonForMultilevelPiechart(seriesDataConfig, i, metricObjects)
          }
          else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.DonutChart) {
            seriesDataConfig[0].showInLegend = true;
          }
          if (that._graphConfig.type == AnalyticsCommonConstants.ConstantString.MultiAxes) {

            if (i < metricObjects.length) {
              seriesDataConfig[i].yAxis = i;
            }
            seriesDataConfig[i].type = AnalyticsCommonConstants.ConstantString.Column;
            if (i > 0) {
              seriesDataConfig[i].type = AnalyticsCommonConstants.ConstantString.Spline;
              seriesDataConfig[i].dashStyle = i > 1 ? AnalyticsCommonConstants.ConstantString.ShortDot : "";
            }
          };
          if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart ||
            that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarLineCombinationChart) {
            if (that._graphConfig.reportDetails.reportProperties.columnCount > i) {
              seriesDataConfig[i].type = that.getSeriesChartType(seriesDataConfig[i], that._graphConfig);
            }
            else {
              seriesDataConfig[i].type = AnalyticsCommonConstants.ConstantString.Spline;
            }

          }
          seriesDataConfig[i].data = that.CreateSeriesData(legendNames, i, metricObjects, defaultChartPageSize);
          //seriesDataConfig[i].color = AnalyticsCommonConstants.MultiColorSet[i];//AnalyticsCommonConstants.MultiColorSet[i];

          seriesDataConfig[i].name = legendNames[i];

          // Modifying the Chart Placement Point and Padding based upon chart series records.
          this.setChartSeriesPaddingPlacement(i, seriesDataConfig);
          seriesDataConfig[i].color = this.getSeriesColor(legendNames[i], i);//AnalyticsCommonConstants.MultiColorSet[i];
          seriesDataConfig[i].upColor = this.getSeriesColor(legendNames[i], i);

          seriesDataConfig[i].events = {
            click: function (e) {
              that._drilledRow = "";
              that._drilledRow = e.point.name == undefined ? e.point.category : e.point.name;
            }
          }
          //creating the datalabel for the chart series data 
          this.getChartSeriesDataLabel(configFormat, seriesDataConfig[i], i);
          seriesDataConfig[i].turboThreshold = 0;
        }
      }
      return seriesDataConfig;
    }
  }
  //This method is for multilevel-pie chart JS configuration
  private static getCommonForMultilevelPiechart(seriesDataConfig, i, metricObjects) {
    seriesDataConfig[0].showInLegend = true;
    if (metricObjects.length > 1) {
      seriesDataConfig[i].innerSize = ['80%', '75%', '70%', '65%'][i];
      seriesDataConfig[i].size = ['100%', '80%', '60%', '40%'][i];
    }
    seriesDataConfig[i].events = {
      click:
      {

        zoomType: 'x',
        allowPointSelect: false,
        allowOverlap: true,
        events: function () {

          let chart = this,
            yoyValue,
            x,
            y;

          chart.series[1].points.forEach((p, i) => {

            if (chart['label' + i]) {
              chart['label' + i].destroy();
            }

            yoyValue = Math.floor(((p.y - chart.series[0].points[i].y) / p.y) * 100);
            x = p.dataLabel.translateX - (p.shapeArgs.end == 0 ? -40 : 30);
            y = p.dataLabel.translateY;

            chart['label' + i] = chart.renderer.text(yoyValue + '%', x, y).attr({
              zIndex: 100,
            }).css({
              fontWeight: 'bold',
              color: 'white',
              textOutline: '1px contrast'
            }).add();
          })

        }
      }
    }

  }

  private static getSeriesArrayForMultiAxisCrossTab(seriesDataConfig, rowList, columnList, valueList, metricObjects, currentPage) {
    const that = this;
    let currentObj, k = 0;
    let rowName = rowList[this._rowIndex].reportObjectName;
    let columnName = columnList[0].displayName;
    const _numberFormatingService = new NumberFormatingService();
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();

    for (var i = 0; i < metricObjects.length; i++) {

      currentObj = valueList.find(function (item) { return item.reportObjectName == metricObjects[i]; });
      let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(currentObj.ConfigurationValue, currentObj.filterType);

      for (var j = 0; j < currentPage.columnObject.length; j++) {

        seriesDataConfig[k] = {};
        seriesDataConfig[k].reportViewType = that._graphConfig.reportDetails.reportViewType;

        seriesDataConfig[k].tooltip = {
          headerFormat: '<span style="font-size:10px">' + (rowList.length > 0 ? rowList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
          format: configFormat,
          formatKey: currentObj.formatKey,
          currenyBeforeAmount: currenyBeforeAmount,

          //Pointer formating for charts when user hovers on charts
          pointFormatter: function () {
            return that.getSeriesPointFormatter(this);
          },
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        };

        seriesDataConfig[k].cursor = AnalyticsCommonConstants.ConstantString.Pointer;
        seriesDataConfig[k].type = that.getSeriesChartType(seriesDataConfig[k], that._graphConfig);

        if (i < metricObjects.length) {
          seriesDataConfig[k].yAxis = i;
        }

        seriesDataConfig[k].type = AnalyticsCommonConstants.ConstantString.Column;
        if (i > 0) {
          seriesDataConfig[k].type = AnalyticsCommonConstants.ConstantString.Spline;
          seriesDataConfig[k].dashStyle = i > 1 ? AnalyticsCommonConstants.ConstantString.ShortDot : "";
        }

        //seriesDataConfig[k].color = AnalyticsCommonConstants.MultiColorSet[j];
        seriesDataConfig[k].color = this.getSeriesColor(currentPage.columnObject[j], j);
        seriesDataConfig[k].name = currentPage.columnObject[j] + "-" + metricObjects[i];

        let dataArr = [];
        for (let l = 0; l < currentPage.rowObjects.length; l++) {
          let searchObject = {}
          searchObject[columnName] = currentPage.columnObject[j];
          searchObject[rowName] = currentPage.rowObjects[l];
          let filteredcolumnJson = this._masterjson.filter(obj => obj[columnName] == searchObject[columnName] && obj[rowName] == currentPage.rowObjects[l]);
          if (filteredcolumnJson.length > 0)
            dataArr.push(filteredcolumnJson[0][metricObjects[i]]);
          else
            dataArr.push(null);
        }

        if ((configFormat != undefined && configFormat[0] == 'p') || currentObj.formatKey == DashboardConstants.CommonConstants.Percent) {
          each(dataArr, function (value, index) {
            if (value != null) {
              if (value.hasOwnProperty('y')) {
                value.y = value.y * 100;
              }
              //Condition added to handle the total column for waterfall chart
              else if (value.hasOwnProperty('name') && value.name != "Total") {
                dataArr[index] = value * 100;
              }
              else {
                dataArr[index] = value * 100;
              }
            }
          });
        }
        seriesDataConfig[k].data = dataArr;

        // Modifying the Chart Placement Point and Padding based upon chart series records.
        this.setChartSeriesPaddingPlacement(i, seriesDataConfig);
        seriesDataConfig[k].events = {
          click: function (e) {
            that._drilledRow = "";
            that._drilledRow = e.point.name == undefined ? e.point.category : e.point.name;
          }
        }
        //creating the datalabel for the chart series data 
        this.getChartSeriesDataLabel(configFormat, seriesDataConfig[k], i);
        seriesDataConfig[k].turboThreshold = 0;
        k++;

      }
    }

    return seriesDataConfig;

  }

  private static getSeriesPointFormatter(thisRefSeries) {
    let that = this;
    if (thisRefSeries.series.userOptions.reportViewType === DashboardConstants.ReportViewType.HistogramChart) {
      var obj = "";
      for (let i = 0; i < thisRefSeries.series.chart.series.length; i++) {
        var histoSeriesInfo = thisRefSeries.series.chart.series;
        obj += this.createSeriesPointFormatter({ series: histoSeriesInfo[i] }, histoSeriesInfo[i].data[thisRefSeries.index].y) + "<br/>";
      }
      return obj;
    }

    else {
      return this.createSeriesPointFormatter(thisRefSeries, thisRefSeries.y);
    }
  }

  private static createSeriesPointFormatter(seriesInfo: any, displayHighchartY: any): string {
    return '<table><tr><td style="padding:0">' + seriesInfo.series.name + ':</td>' +
      (
        seriesInfo.series.userOptions.tooltip.formatKey != "" &&
          seriesInfo.series.userOptions.tooltip.formatKey != null &&
          seriesInfo.series.userOptions.tooltip.formatKey != DashboardConstants.CommonConstants.Percent &&
          seriesInfo.series.userOptions.tooltip && seriesInfo.series.userOptions.tooltip.format == "" ?
          '<td><b>' + DashboardConstants.FormatType[seriesInfo.series.userOptions.tooltip.formatKey] + '</b></td>' : ""
      ) +
      '<td style="padding:0"><b>'
      + AnalyticsUtilsService.FormatChartTooltip(displayHighchartY, seriesInfo.series.userOptions.tooltip.format) + '</b></td></tr>' +
      (
        seriesInfo.series.userOptions.tooltip.formatKey != "" &&
          seriesInfo.series.userOptions.tooltip.formatKey != null &&
          seriesInfo.series.userOptions.tooltip.formatKey && seriesInfo.series.userOptions.tooltip.format == ""
          && (
            seriesInfo.series.userOptions.tooltip.formatKey == DashboardConstants.CommonConstants.Percent ||
            !seriesInfo.series.userOptions.tooltip.currenyBeforeAmount
          ) ? '<td><b>' + DashboardConstants.FormatType[seriesInfo.series.userOptions.tooltip.formatKey] + '</b></td>' : ""
      );
  }
  private static getChartForDataLabelPosition(thisRef) {
    var series = thisRef;
    if (series.chart.series.length == 2) {
      let data = series.chart.series[0].points;
      if (series.chart.series[1].points != undefined) {
        let data1 = series.chart.series[1].points;
        if (series != undefined) {
          for (var i = 0; i < data.length; i++) {
            var first = data1[i].plotY < data[i].plotY ? data[i].plotY - data1[i].plotY : data1[i].plotY - data[i].plotY
            if (Math.abs(first) < 4) {
              if (data[i].dataLabel != undefined) {
                data[i].dataLabel.attr({
                  translateY: data[i].dataLabel.y + 20
                });
              }
            }
          }
        }

      }
    }

    if (series.chart.series.length == 3) {

      let data = series.chart.series[0].points;
      if (series.chart.series[2].points != undefined) {
        let data1 = series.chart.series[1].points;
        let data2 = series.chart.series[2].points;
        if (series != undefined) {
          for (var i = 0; i < data.length; i++) {
            var first = data1[i].plotY < data[i].plotY ? data[i].plotY - data1[i].plotY : data1[i].plotY - data[i].plotY
            var second = data2[i].plotY < data[i].plotY ? data[i].plotY - data2[i].plotY : data2[i].plotY - data[i].plotY
            var third = data2[i].plotY < data1[i].plotY ? data1[i].plotY - data2[i].plotY : data2[i].plotY - data1[i].plotY
            if (Math.abs(first) < 6) {
              if (data1[i].dataLabel != undefined) {
                data[i].dataLabel.attr({
                  translateY: data1[i].dataLabel.y + 20
                });
              }
            }

            if (Math.abs(second) < 6) {
              if (data2[i].dataLabel != undefined) {
                data1[i].dataLabel.attr({
                  translateY: data2[i].dataLabel.y - 10
                });
              }
            }

            if (Math.abs(third) < 6) {
              if (data2[i].dataLabel != undefined) {
                data2[i].dataLabel.attr({
                  translateY: data2[i].dataLabel.y - 20
                });
              }
            }
          }
        }
      }
    }
  }
  private static getChartSeriesDataLabel(configFormat: any, seriesDataConfig: any, i: any) {
    let that = this;
    const _isDataLabelEnabled: boolean = that.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
    const _selectedFontSize: number = that.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);

    if (_isDataLabelEnabled) {
      if (
        that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart ||
        that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart) {
        seriesDataConfig.dataLabels = {
          enabled: _isDataLabelEnabled,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          shadow: false,
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize
          },
          color: '#FFFFFF',
          useHTML: true,
          formatter: function () {
            return "<span style='font-weight:normal;font-size:" + _selectedFontSize + "; color: black'>" + numberFormat(this.point.percentage, AnalyticsCommonConstants.ParetoChartConfig.DecimalCumulativePlace) + ' %</span>';
          }
        }
      }
      else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HistogramChart) {
        seriesDataConfig.dataLabels = {
          enabled: _isDataLabelEnabled,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },
          color: '#000000',
          formatter: function () {
            return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configFormat, this.y, seriesDataConfig);
          }
        }
      }
      else if (
        that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart ||
        that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn ||
        that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.StackedBarChart
      ) {
        seriesDataConfig.dataLabels = {
          enabled: _isDataLabelEnabled,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          shadow: false,
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },
          color: '#FFFFFF',
          useHTML: true,
          formatter: function () {
            return "<span style='font-weight:normal;font-size:" + _selectedFontSize + "; color: black'>" + AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configFormat, this.y, seriesDataConfig) + '</span>';
          }
        }
      }
      else {
        seriesDataConfig.dataLabels = {
          enabled: _isDataLabelEnabled,
          distance: that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.pie ? AnalyticsUtilsService.GetDistanceForPieChart(this._graphConfig.reportDetails.lstReportObjectOnValue)[i] : '30%',
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },
          color: '#000000',
          formatter: function () {
            return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configFormat, this.y, seriesDataConfig, this.series);
          }
        }
      }

    }
    else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.pie ||
      that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.DonutChart) {
      seriesDataConfig.dataLabels = {
        distance: that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.pie ? AnalyticsUtilsService.GetDistanceForPieChart(this._graphConfig.reportDetails.lstReportObjectOnValue)[i] : '30%',
        enabled: true,
        allowOverlap: true,
        crop: false,
        overflow: 'none',
        cursor: 'pointer',
        style: {
          fontWeight: 'normal',
          textShadow: 'none',
          fontSize: _selectedFontSize,
          textOutline: 0
        },
        color: '#000000',
        'format': (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.pie || that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.DonutChart) ? '{point.percentage:.2f} %' : '{point.name} : {point.percentage:.2f} %'
      }
    }
  }

  public static GetDistanceForPieChart(metricObjects) {

    var distance = [];
    switch (metricObjects.length) {
      case 1:
        return distance = ['30%']
      case 2:
        return distance = ['50%', '30%']
      case 3:
        return distance = ['50%', '30%', '10%']
      case 4:
        return distance = ['70%', '50%', '30%', '10%']
    }
  }
  public static GetFormattedFilterValue(selectedRo, filterData) {
    let values = new Array<string>();
    let selectedDate = new Date();
    switch (selectedRo.filterType) {
      case AnalyticsCommonConstants.FilterType.Date:
        selectedDate = new Date(filterData);
        values.push(
          selectedDate.getFullYear().toString() +
          ((selectedDate.getMonth() + 1).toString().length == 1
            ? "0" + (selectedDate.getMonth() + 1).toString()
            : (selectedDate.getMonth() + 1).toString()) +
          (selectedDate.getDate().toString().length == 1
            ? "0" + selectedDate.getDate().toString()
            : selectedDate.getDate().toString())
        );
        break;

      case AnalyticsCommonConstants.FilterType.Month:
        values.push((new Date(filterData + '-01-01').getMonth() + 1).toString());
        break;

      case AnalyticsCommonConstants.FilterType.Quarter:
        values.push(filterData.substr(filterData.length - 1));
        break;

      case AnalyticsCommonConstants.FilterType.QuarterYear:
        let qtrYearData = filterData.split('-');
        values.push(qtrYearData[1].toString() + (AnalyticsCommonConstants.PeriodData.quarterArray.indexOf(qtrYearData[0].toString()) + 1));
        break;
      case AnalyticsCommonConstants.FilterType.MonthYear:
        let monYearData = filterData.split('-');
        let monthName = (Number(AnalyticsCommonConstants.PeriodData.monthArray.indexOf(monYearData[0])) + 1).toString().length == 1
          ? '0' + (Number(AnalyticsCommonConstants.PeriodData.monthArray.indexOf(monYearData[0])) + 1).toString()
          : (Number(AnalyticsCommonConstants.PeriodData.monthArray.indexOf(monYearData[0]) + 1)).toString();

        selectedDate = new Date(monYearData[1] + '-' + monthName + '-01');
        values.push(selectedDate.getFullYear().toString() + ((selectedDate.getMonth() + 1).toString().length == 1
          ? "0" + (selectedDate.getMonth() + 1).toString()
          : (selectedDate.getMonth() + 1).toString()));
        break;

      default:
        values.push(filterData.toString());
        break;
    }

    return values;
  }

  private static CreateSeriesData(legendNames: Array<any>, i: number, metricObjects: any, defaultPageSize: number) {
    let that = this;
    const _numberFormatingService = new NumberFormatingService();
    let masterDetailObject = that._masterjson[that._masterjson.length - 1],
      columnObjects = masterDetailObject.columnObject,
      rowObjects = masterDetailObject.rowObjects,
      lstdata = [],
      data = [],
      valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
      reportObject,
      combineRO = that._graphConfig.reportDetails.lstReportObjectOnRow.concat(that._graphConfig.reportDetails.lstReportObjectOnColumn).concat(that._graphConfig.reportDetails.lstReportObjectOnValue);
    if (that._graphConfig.reportDetails.lstReportObjectOnColumn.length && that._graphConfig.reportDetails.lstReportObjectOnRow.length && that._graphConfig.reportDetails.reportViewType != AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
      reportObject = find(combineRO, { displayName: valueList[0].reportObjectName });
      for (var j = 0; j < that._masterjson.length - 1; j++) {
        if (that._masterjson[j][that._graphConfig.reportDetails.lstReportObjectOnColumn[0].reportObjectName] == legendNames[i]) {
          for (var x = 0; x < that._masterjson[that._masterjson.length - 1].rowObjects.length; x++) {
            if (lstdata.length < that._masterjson[that._masterjson.length - 1].rowObjects.length) lstdata.push(null);
            if (that._masterjson[that._masterjson.length - 1].rowObjects[x] == that._masterjson[j][that._graphConfig.reportDetails.lstReportObjectOnRow[that._rowIndex].reportObjectName]) {
              lstdata[x] = (that._masterjson[j][that._graphConfig.reportDetails.lstReportObjectOnValue[0].reportObjectName]);
            }
          }
        }
      }
      data = lstdata;
    }
    else if ((columnObjects.length > 0 && rowObjects.length == 0
      && (
        that._graphConfig.type == AnalyticsCommonConstants.ConstantString.STColumn ||
        that._graphConfig.type == AnalyticsCommonConstants.ConstantString.Spline ||
        that._graphConfig.type == AnalyticsCommonConstants.ConstantString.StackedBarChart ||
        that._graphConfig.type == AnalyticsCommonConstants.ConstantString.PercentStackedBarChart ||
        that._graphConfig.type == AnalyticsCommonConstants.ConstantString.PercentStackedColumnChart))
    ) {
      data.push(that._masterjson[i][metricObjects[0]]);
      reportObject = find(combineRO, { displayName: metricObjects[0] });
    }
    else if (that._graphConfig.type == AnalyticsCommonConstants.ConstantString.MultiAxes) {
      for (var j = 0; j < that._masterjson.length - 1; j++) {
        data.push(that._masterjson[j][metricObjects[i]]);
      }
      reportObject = find(combineRO, { displayName: metricObjects[i] });
    }
    else if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
      reportObject = find(combineRO, { displayName: metricObjects[0] });
      if (that._graphConfig.reportDetails.lstReportObjectOnRow.length >= 1 && that._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0 && that._graphConfig.reportDetails.lstReportObjectOnValue.length == 1) {
        let totalObjects = {};
        for (let i = 0; i < rowObjects.length; i++) {
          let temp = {};
          temp['name'] = rowObjects[i];
          temp['y'] = parseFloat((that._masterjson[i][metricObjects[0]] == null ? 0 : that._masterjson[i][metricObjects[0]]).toFixed(2));
          data.push(temp);
        }
        totalObjects['name'] = 'Total';
        totalObjects['isSum'] = true;
        totalObjects['color'] = "#0067b0";
        data.push(totalObjects);
      }
    }
    else {
      reportObject = find(combineRO, { displayName: legendNames[i] });
      for (let j = 0; j < that._masterjson.length - 1; j++) {
        let obj = {};
        //TODO : Check below if clause, is now usable or not.
        if (that._graphConfig.reportDetails.lstReportObjectOnColumn.length) {
          obj["name"] = that._masterjson[that._masterjson.length - 1].columnObject[j];
        }
        else {
          obj["name"] = that._masterjson[that._masterjson.length - 1].rowObjects[j];
          if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.pie ||
            that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.DonutChart)
            obj["color"] = that.getSeriesColor(obj["name"], j);
        }
        obj["y"] = that._masterjson[j][metricObjects[i]];
        data.push(obj);
      }
      if (data[defaultPageSize] && data[defaultPageSize].name == undefined) {
        data = data.splice(0, defaultPageSize);
      }
    }
    // Removing this part as highchart provides the percentage for pie and  donut chart.
    // if (that._graphConfig.type == AnalyticsCommonConstants.ConstantString.Pie) {
    //   let totalSum = 0;
    //   each(data, function (obj) { totalSum = totalSum + obj.y });
    //   each(data, function (obj) { obj.name = obj.name + ': ' + ((obj.y / totalSum) * 100).toFixed(2) + '%' });
    // }


    let configVal = _numberFormatingService.GetWijmoConfigurationFormat(reportObject.ConfigurationValue, reportObject.filterType);
    if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == DashboardConstants.CommonConstants.Percent) {
      each(data, function (value, index) {
        if (value != null) {
          if (value.hasOwnProperty('y')) {
            value.y = value.y * 100;
          }
          //Condition added to handle the total column for waterfall chart
          else if (value.hasOwnProperty('name') && value.name != "Total") {
            data[index] = value * 100;
          }
          else {
            data[index] = value * 100;
          }
        }
      });
    }
    return data;
  }

  private static getChartPageSize(reportDetails: any): number {
    let pageSize = reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.GaugeChart ? 0 : AnalyticsCommonConstants.chartPageSize;
    if (reportDetails && reportDetails.reportProperties && reportDetails.reportProperties.pageSize && reportDetails.reportProperties.pageSize > 1 && reportDetails.reportViewType != AnalyticsCommonConstants.ReportViewType.GaugeChart)
      pageSize = reportDetails.reportProperties.pageSize - 1;
    return pageSize;
  }

  private static getSeriesChartType(_stacking: any, _graphConfig: any): string {
    if (_graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.StackedBarChart ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarChart ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarLineCombinationChart ||
      _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
      _stacking.stacking = this.getStacking(_graphConfig);
      return (_graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn ||
        _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart ||
        _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart ||
        _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart) ?
        DashboardConstants.ConstantString.Column :
        _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.StackedBarChart ||
          _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarChart ||
          _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart ||
          _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarLineCombinationChart
          ? DashboardConstants.ConstantString.Bar : '';
    }
    else if (_graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.GaugeChart) {
      return _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.GaugeChart
        ? DashboardConstants.ConstantString.GaugeChart
        : this._graphConfig.type;
    }
    else if (_graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HistogramChart) {
      return DashboardConstants.ConstantString.Column;
    }
    else if (_graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
      return DashboardConstants.ConstantString.WaterFallChart;
    }
    else {
      return _graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.DonutChart
        ? DashboardConstants.ConstantString.Pie
        : this._graphConfig.type;
    }
  }

  private static getStacking(graphConfig: any) {
    return (
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn
      || graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.StackedBarChart
      || graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart
    ) ? DashboardConstants.ConstantString.Normal
      : (
        graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart
        || graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart
      ) ? DashboardConstants.ConstantString.Percent : '';
  }


  private static createTreeMapSeriesData(metricObjects: any, attributeName: any) {
    const _numberFormatingService = new NumberFormatingService();
    let that = this,
      reportObject,
      colorReportObject,
      data = [];
    const _isDataLabelEnabled: boolean = that.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
    const _selectedFontSize: number = that.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);

    for (let j = 0; j < that._masterjson.length - 1; j++) {
      let tempObject = {} as any;
      tempObject.name = that._masterjson[j][attributeName] != "" ? that._masterjson[j][attributeName] : " ";
      tempObject.value = that._masterjson[j][metricObjects[0]];
      tempObject.colorValue = that._masterjson[j][metricObjects[0 + 1]];


      let combineRO = that._graphConfig.reportDetails.lstReportObjectOnRow.concat(that._graphConfig.reportDetails.lstReportObjectOnColumn).concat(that._graphConfig.reportDetails.lstReportObjectOnValue);
      reportObject = find(combineRO, { displayName: metricObjects[0] });
      let configVal = _numberFormatingService.GetWijmoConfigurationFormat(reportObject.ConfigurationValue, reportObject.filterType);
      colorReportObject = find(combineRO, { displayName: metricObjects[0 + 1] });
      let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
        rowList = that._graphConfig.reportDetails.lstReportObjectOnRow
      let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);


      let colorConfigVal = _numberFormatingService.GetWijmoConfigurationFormat(colorReportObject.ConfigurationValue, colorReportObject.filterType);
      if (configVal != undefined && configVal[0] == 'p') {
        tempObject.value = tempObject.value * 100;
      }
      if (colorConfigVal != undefined && colorConfigVal[0] == 'p') {
        tempObject.colorValue = tempObject.colorValue * 100;
      }
      if (_isDataLabelEnabled) {
        tempObject.dataLabels = {
          enabled: true,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },

          formatter: function () {
            return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configVal, this.point.value);
          }
        }
      }

      tempObject.events = {
        click: function (e) {
          that._drilledRow = "";
          that._drilledRow = e.point.name == undefined ? e.point.category : e.point.name;
        }
      }
      data.push(tempObject);
    }
    return data;
  }

  private static GetTreeMapSeriesData(metricObjects: any) {

    const _numberFormatingService = new NumberFormatingService();
    let that = this;

    let treemapSeriesDataConfig = [] as any;
    let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
      rowList = that._graphConfig.reportDetails.lstReportObjectOnRow
    let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);
    let colorConfigFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[1].ConfigurationValue, valueList[1].filterType);
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();

    treemapSeriesDataConfig.tooltip = {
      headerFormat: '<span style="font-size:10px">' + (rowList.length > 0 ? rowList[that._rowIndex].displayName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',

      displayName: valueList[0].displayName,
      colordisplayName: valueList[1].displayName,
      currenyBeforeAmount: currenyBeforeAmount,
      format: configFormat,
      colorFormat: colorConfigFormat,
      //Number Formatting

      pointFormatter: function () {
        return (valueList[0].displayName + ':' + '<b>'
          + (valueList[0].formatKey != "" && valueList[0].formatKey != null && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
          + AnalyticsUtilsService.FormatChartTooltip(this.value, configFormat)
          + (valueList[0].formatKey != "" && valueList[0].formatKey != null && configFormat == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
          + '</b><br>'
          + valueList[1].displayName + ':'
          + ' <b> '
          + (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
          + '' + AnalyticsUtilsService.FormatChartTooltip(this.colorValue, colorConfigFormat)
          + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorConfigFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
          + '</b>')
      },

    };

    treemapSeriesDataConfig.cursor = 'pointer';
    treemapSeriesDataConfig.type = that._graphConfig.type;
    treemapSeriesDataConfig.layoutAlgorithm = AnalyticsCommonConstants.ConstantString.Squarified;
    treemapSeriesDataConfig.data = this.createTreeMapSeriesData(metricObjects, rowList[0].displayName);
    treemapSeriesDataConfig.turboThreshold = 0;
    return treemapSeriesDataConfig;
  }

  // This method is for Heat-Map chart graphConfig
  private static getHeatMapSeriesData(data) {
    const _numberFormatingService = new NumberFormatingService();
    let metricObjects = this._graphConfig.reportDetails.lstReportObjectOnValue;
    let configVal = _numberFormatingService.GetWijmoConfigurationFormat(metricObjects[0].ConfigurationValue, metricObjects[0].filterType);
    let valueList = this._graphConfig.reportDetails.lstReportObjectOnValue;
    let columnList = this._graphConfig.reportDetails.lstReportObjectOnColumn;
    let rowList = this._graphConfig.reportDetails.lstReportObjectOnRow;
    let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);

    let series = [];
    let heatMapSeriesData: any = [];
    var columnName = this._graphConfig.reportDetails.lstReportObjectOnColumn[0].reportObjectName;
    let currentPage = this._masterjson[this._masterjson.length - 1];
    let reportObject: any =
      find(this._graphConfig.reportDetails.lstReportObjectOnValue, { displayName: metricObjects[0].reportObjectName });

    series[0] = {};
    for (var j = 0; j < data.length - 1; j++) {
      var indexReportObjectOnRow = currentPage.rowObjects.indexOf(data[j][this._graphConfig.reportDetails.lstReportObjectOnRow[0].reportObjectName])
      var indexReportObjectOnColumn = currentPage.columnObject.indexOf(data[j][columnName]);
      var value = data[j][this._graphConfig.reportDetails.lstReportObjectOnValue[0].reportObjectName]
      if (value != null) {
        if (configVal != undefined && configVal[0] == 'p' || reportObject.formatKey == AnalyticsCommonConstants.CommonConstants.Percent) {
          value = value * 100;
        }
        let item = [indexReportObjectOnRow, indexReportObjectOnColumn, value];
        heatMapSeriesData.push(item);
      }

    }

    series[0].data = heatMapSeriesData,
      series[0].name = currentPage.rowObjects,
      series[0].type = 'heatmap',
      series[0].plotBorderWidth = 1,
      series[0].borderColor = '#add8e6',
      series[0].borderWidth = 1,
      series[0].tooltip = {
        headerFormat: (rowList.length > 0 ? rowList[this._rowIndex].displayName : "") + ':',
        format: configFormat,
        formatKey: valueList[0].formatKey,
        currenyBeforeAmount: _numberFormatingService.GetCurrencySymbolLocation(),
        displayName: valueList[0].displayName,
        colordisplayName: columnList[0].displayName,
        colorFormatKey: columnList[0].formatKey,
        colorFormat: configFormat,
        pointFormatter: function () {
          return (this.series.xAxis.categories[this.options.x] + '<br>'
            + valueList[0].displayName + ':'
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && this.series.tooltipOptions.currenyBeforeAmount && this.series.tooltipOptions.format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + AnalyticsUtilsService.FormatChartTooltip(this.value, configFormat)
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && configFormat == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !this.series.tooltipOptions.currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + '</b><br>'
            + this.series.tooltipOptions.colordisplayName + ':' + this.series.yAxis.categories[this.options.y]
            + '</b>');
        }

      },
      series[0].events = {
        click: function (e) {
          console.log(e);
          this._drilledRow = "";
          this._drilledRow = e.point.name == undefined ? e.point.category : e.point.name;
        }

      },
      series[0].cursor = 'pointer',
      series[0].dataLabels = {
        enabled: true,
        color: '#000000',
        style: {
          fontWeight: 'normal',
          textShadow: 'none',
          textOutline: 0,
          fontSize: '9px'
        },
        formatter: function () {
          if (this.point.value != null)
            return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configVal, this.point.value);
        }

      }
    return series;

  }
  private static getWaterFallSeriesData(): any {
    let metricObjects = this._graphConfig.reportDetails.lstReportObjectOnValue;
    const _isDataLabelEnabled: boolean = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
    const _selectedFontSize: number = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);
    const _numberFormatingService = new NumberFormatingService();
    let masterDetailObject = this._masterjson[this._masterjson.length - 1],
      columnObjects = masterDetailObject.columnObject,
      rowObjects = masterDetailObject.rowObjects,
      combineRO = this._graphConfig.reportDetails.lstReportObjectOnRow.concat(this._graphConfig.reportDetails.lstReportObjectOnColumn).concat(this._graphConfig.reportDetails.lstReportObjectOnValue);
    let seriesData = [];
    let reportObject: any =
      find(this._graphConfig.reportDetails.lstReportObjectOnValue, { displayName: metricObjects[0].reportObjectName });
    const formatKey: any = (
      reportObject.formatKey != ""
        && reportObject.formatKey != null
        && reportObject.formatKey != AnalyticsCommonConstants.CommonConstants.Percent ?
        AnalyticsCommonConstants.FormatType[reportObject.formatKey] : ''
    );
    let configVal = _numberFormatingService.GetWijmoConfigurationFormat(reportObject.ConfigurationValue, reportObject.filterType);
    columnObjects.forEach((item, index) => {
      let key = this._graphConfig.reportDetails.lstReportObjectOnColumn[0].displayName;
      let filtered_rows = filter(this._masterjson, { [key]: item });
      let temp = { data: [], name: item }
      rowObjects.forEach((itemColumnValue) => {
        let keyColumn = this._graphConfig.reportDetails.lstReportObjectOnRow[this._rowIndex].displayName;
        let obj = find(filtered_rows, { [keyColumn]: itemColumnValue })
        // Multiplying the values by 100 if percentage number formatting is applied
        if ((configVal != undefined && configVal[0] == 'p') || reportObject.formatKey == DashboardConstants.CommonConstants.Percent) {
          temp.data.push(obj != undefined ? parseFloat((obj[metricObjects[0].reportObjectName] == null ? 0 : 100 * obj[metricObjects[0].reportObjectName]).toFixed(2)) : 0);
        } else {
          temp.data.push(obj != undefined ? parseFloat((obj[metricObjects[0].reportObjectName] == null ? 0 : obj[metricObjects[0].reportObjectName]).toFixed(2)) : 0);
        }

      });
      temp['data'].push({ isSum: true });
      temp['type'] = AnalyticsCommonConstants.ConstantString.WaterFallChart;
      temp["dataLabels"] = {
        enabled: _isDataLabelEnabled,
        allowOverlap: true,
        crop: false,
        overflow: 'none',
        cursor: 'pointer',
        style: {
          fontWeight: 'normal',
          textShadow: 'none',
          fontSize: _selectedFontSize,
          textOutline: 0
        },
        color: '#000000',
        formatter: function () {
          return AnalyticsUtilsService.getDatalabelForCommon(configVal, this.y, formatKey);

        }
      };
      if (index != 0) {
        temp['lineWidth'] = 0;
      }
      temp['color'] = this.getSeriesColor(item, index);
      seriesData.push(temp)
    });
    return seriesData;
  }

  // private static getDataByIndex(i: number, metricObjects) {
  //     let that = this;
  //     let data = [];
  //     let seriesObject;
  //     let columnList = that._graphConfig.reportDetails.lstReportObjectOnColumn;
  //     seriesObject = columnList.length ? columnList : metricObjects;
  //     for (let j = 0; j < this._masterjson.length - 1; j++) {
  //         let obj = {};
  //         obj["y"] = this._masterjson[j][metricObjects[i]];
  //         data.push(obj);
  //     }
  //     return data
  // }

  private static setChartSeriesPaddingPlacement(index: number, histrogramSeries: any) {
    let columnList = this._graphConfig.reportDetails.lstReportObjectOnColumn;
    const reportViewType: number = this._graphConfig.reportDetails.reportViewType;
    if (reportViewType === DashboardConstants.ReportViewType.HistogramChart) {
      let _chartPlacementConfig: Array<any> = this.setChartSeriesPointConfig()[index];
      // histrogramSeries[index].name = seriesObject[index];
      //histrogramSeries[index].color = this.GetChartColors()[index][1];
      // histrogramSeries[index].data = AnalyticsUtilsService.getDataByIndex(index, metricObjects);
      histrogramSeries[index].pointPadding = _chartPlacementConfig[1][0]; //should be point padding 
      histrogramSeries[index].pointPlacement = _chartPlacementConfig[1][1]; //should be point placement 
      // histrogramSeries[index].type = "column";
    }
    else if (reportViewType === AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
      if (columnList.length == 0) {
        histrogramSeries[index].upColor = "#4caf50";
        histrogramSeries[index].color = "#cb4728";
        histrogramSeries[index].type = AnalyticsCommonConstants.ConstantString.WaterFallChart;
      }
    }
  }

  //private static getHistogramSeriesData(): any {
  //  let that = this;
  //  let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
  //    columnList = that._graphConfig.reportDetails.lstReportObjectOnColumn,
  //    rowList = that._graphConfig.reportDetails.lstReportObjectOnRow;

  //  const _numberFormatingService = new NumberFormatingService();
  //  const _isDataLabelEnabled: boolean = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
  //  const _selectedFontSize: number = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);
  //  let metricObjects = that._graphConfig.reportDetails.lstReportObjectOnValue.map(o => o.reportObjectName);
  //  var series = [];
  //  var seriesObject
  //  if (rowList.length != 0)
  //    seriesObject = columnList.length ? columnList : metricObjects;
  //  else if (rowList.length == 0 && columnList.length != 0)
  //    seriesObject = metricObjects;
  //  for (var i = 0; i < seriesObject.length; i++) {
  //    series[i] = {};

  //    let currentObj;
  //    if (columnList.length > 0 && rowList.length == 0)
  //      currentObj = valueList.find(function (item) { return item.reportObjectName == metricObjects[0]; });
  //    else
  //      currentObj = valueList.find(function (item) { return item.reportObjectName == seriesObject[i]; });
  //    let configFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);
  //    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
  //    series[i].tooltip = {
  //      headerFormat: '<span style="font-size:10px">' + (columnList > 0 ? columnList[0].reportObjectName + '<br/>' : "") + '<span style="font-size:10px">{point.key}<br/></span></span>',
  //      footerFormat: '</table>',
  //      shared: true,
  //      useHTML: true,
  //      format: configFormat,
  //      formatKey: currentObj.formatKey,
  //      currenyBeforeAmount: currenyBeforeAmount,
  //      pointFormatter: function () {
  //        return '<table><tr><td style="padding:0">' + this.series.name + ':</td>' +
  //          (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + DashboardConstants.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
  //          '<td style="padding:0"><b>' + AnalyticsUtilsService.FormatChartTooltip(this.y, this.series.userOptions.tooltip.format) + '</b></td></tr>' +
  //          (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (!this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + DashboardConstants.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "")
  //      }
  //    };

  //    series[i].dataLabels = {
  //      enabled: _isDataLabelEnabled,
  //      allowOverlap: true,
  //      crop: false,
  //      overflow: 'none',
  //      useHTML: true,
  //      color: '#000000',
  //      style: {
  //        fontWeight: 'normal',
  //        textShadow: 'none',
  //        fontSize: _selectedFontSize
  //      },
  //      states: {
  //        inactive: {
  //          opacity: 1
  //        }
  //      },
  //      formatter: function () {
  //        if ((_isDataLabelEnabled)) {
  //          return (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey != DashboardConstants.CommonConstants.Percent && this.series.userOptions.tooltip && this.series.userOptions.tooltip.format == "" ? '<td><b>' + DashboardConstants.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "") +
  //            AnalyticsUtilsService.FormatChartTooltip(this.y, configFormat) +
  //            (this.series.userOptions.tooltip.formatKey != "" && this.series.userOptions.tooltip.formatKey != null && this.series.userOptions.tooltip.formatKey && this.series.userOptions.tooltip.format == "" && (this.series.userOptions.tooltip.formatKey == DashboardConstants.CommonConstants.Percent || !this.series.userOptions.tooltip.currenyBeforeAmount) ? '<td><b>' + DashboardConstants.FormatType[this.series.userOptions.tooltip.formatKey] + '</b></td>' : "")
  //        }
  //      }
  //    }
  //  }
  //  return series;
  //}
  private static getBubbleChartSeriesData(): any {
    let that = this;
    let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
      columnList = that._graphConfig.reportDetails.lstReportObjectOnColumn,
      rowList = that._graphConfig.reportDetails.lstReportObjectOnRow,
      mode: string = '';
    let series = {};

    if (rowList.length == 0 && valueList.length == 3 && columnList.length == 0)
      mode = 'SingleBubble';
    else if (rowList.length == 1 && valueList.length == 2 && columnList.length == 0)
      mode = 'GroupedBubbles';
    else if (rowList.length == 0 && valueList.length == 3 && columnList.length >= 0)
      mode = 'MultiSeries';
    else if (rowList.length >= 0 && valueList.length == 3 && columnList.length == 0)
      mode = 'SingleSeries';

    series = this.createBubbleChartSeriesData(mode, rowList, valueList);

    return series
  }

  private static getGaugeChartSeriesData(data: any): any {
    let that = this;
    let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue,
      rowList = that._graphConfig.reportDetails.lstReportObjectOnRow;

    var series = {};
    series = this.createGaugeChartSeriesData(rowList, valueList, data);
    return series
  }

  private static getYaxisLabelsFormat(): any {
    let that = this;
    const _numberFormatingService = new NumberFormatingService();
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    let valueList = that._graphConfig.reportDetails.lstReportObjectOnValue;
    let format, colorFormat;
    if (valueList.length == 2) {
      colorFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[1].ConfigurationValue, valueList[1].filterType);
      return {
        y: 18,
        align: 'center',
        style: {
          fontSize: 10,
          color: 'black'
        },
        formatter: function () {
          return this.isFirst ? this.axis.min :
            ((valueList[1].formatKey != "" && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
              + '' + _numberFormatingService.FormatChartTooltip(this.axis.max, colorFormat)
              + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : ''))
        }
      }
    }
    else {
      format = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);
      colorFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[2].ConfigurationValue, valueList[2].filterType);
      return {
        y: 18,
        align: 'center',
        style: {
          fontSize: 10,
          color: 'black'
        },
        formatter: function () {
          return this.isFirst ?
            ((valueList[0].formatKey != "" && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
              + '' + _numberFormatingService.FormatChartTooltip(this.axis.min, format)
              + (valueList[0].formatKey != "" && valueList[0].formatKey != null && format == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : ''))
            :
            ((valueList[2].formatKey != "" && valueList[2].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '' + _numberFormatingService.FormatChartTooltip(this.axis.max, colorFormat)
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && colorFormat == "" && (valueList[2].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[2].formatKey] : ''))
        }
      }
    }
  }

  public static createGaugeChartSeriesData(rowList: Array<any>, metricObjects: Array<any>, data: any): Array<any> {
    const _numberFormatingService = new NumberFormatingService();
    let series = [];
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    let actualValue,
      format;
    if (metricObjects.length == 2) {
      let temp = {};
      actualValue = data[metricObjects[0].reportObjectName];
      format = _numberFormatingService.GetWijmoConfigurationFormat(metricObjects[0].ConfigurationValue, metricObjects[0].filterType);
      if (format != undefined && format[0] == 'p') {
        actualValue = actualValue * 100;
      }
      temp = {
        'name': data[rowList[0].displayName],
        'type': 'solidgauge',
        'data': [actualValue],
        'dataLabels': {

          formatter: function () {
            return '<div style="text-align:center;margin-top: -17%;">' +
              '<span style="font-size:14px">'
              + ((this.y / this.series.yAxis.max) * 100).toFixed(2)
              + '%</span><br/>'
              + '<span style="font-size:10px;padding-top: 3%;font-weight: normal">'
              + (metricObjects[0].formatKey != "" && metricObjects[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[metricObjects[0].formatKey] : '')
              + _numberFormatingService.FormatChartTooltip(actualValue, format)
              + (metricObjects[0].formatKey != "" && metricObjects[0].formatKey != null && format == "" && (metricObjects[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[metricObjects[0].formatKey] : '')
              + '</span>'
              + '</div>';
          }
        }
      }
      series.push(temp);
    }
    else if (metricObjects.length == 3) {
      let temp = {};
      actualValue = data[metricObjects[1].reportObjectName];
      format = _numberFormatingService.GetWijmoConfigurationFormat(metricObjects[1].ConfigurationValue, metricObjects[1].filterType);
      if (format != undefined && format[0] == 'p') {
        actualValue = actualValue * 100;
      }
      temp = {
        'name': data[rowList[0].displayName],
        'type': 'solidgauge',
        'data': [actualValue],
        'dataLabels': {
          formatter: function () {

            return '<div style="text-align:center;margin-top: -17%;">' +
              '<span style="font-size:14px">'
              + (((actualValue - this.series.yAxis.min) / (this.series.yAxis.max - this.series.yAxis.min)) * 100).toFixed(2)
              + '%</span><br/>'
              + '<span style="font-size:10px;padding-top: 3%;font-weight: normal">'
              + (metricObjects[1].formatKey != "" && metricObjects[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[metricObjects[1].formatKey] : '')
              + _numberFormatingService.FormatChartTooltip(actualValue, format)
              + (metricObjects[1].formatKey != "" && metricObjects[1].formatKey != null && format == "" && (metricObjects[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[metricObjects[1].formatKey] : '')
              + '</span>'
              + '</div>';
          }
        }
      }
      series.push(temp);
    }
    return series;
  }

  //This method is for DataLabels Formatting  for Chart
  public static getSeriesChartDatalabelsFormat(configVal, y, seriesDataConfig?, con?) {
    let that = this;
    if (that._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart && con.chart.series.length <= 3) {
      this.getChartForDataLabelPosition(con);

    }
    let valueList = this._graphConfig.reportDetails.lstReportObjectOnValue;
    const _numberFormatingService = new NumberFormatingService();
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    let metricObjects = this._graphConfig.reportDetails.lstReportObjectOnValue.map(o => o.reportObjectName);
    if (that._graphConfig.reportDetails.reportViewType != AnalyticsCommonConstants.ReportViewType.treemap && seriesDataConfig != null && seriesDataConfig != undefined && seriesDataConfig.tooltip != undefined) {
      for (var i = 0; i < metricObjects.length; i++) {
        return (
          seriesDataConfig.tooltip.formatKey != "" &&
            seriesDataConfig.tooltip.formatKey != null &&
            seriesDataConfig.tooltip.formatKey != DashboardConstants.CommonConstants.Percent &&
            seriesDataConfig.tooltip &&
            seriesDataConfig.tooltip.format == "" ? DashboardConstants.FormatType[seriesDataConfig.tooltip.formatKey] : ""
        ) +
          AnalyticsUtilsService.FormatChartTooltip(y, configVal) +
          (
            seriesDataConfig.tooltip.formatKey != "" &&
              seriesDataConfig.tooltip.formatKey != null &&
              seriesDataConfig.tooltip.formatKey &&
              seriesDataConfig.tooltip.format == "" &&
              (
                seriesDataConfig.tooltip.formatKey == DashboardConstants.CommonConstants.Percent ||
                !seriesDataConfig.tooltip.currenyBeforeAmount
              ) ? DashboardConstants.FormatType[seriesDataConfig.tooltip.formatKey] : ""
          )
      }
    }
    else {
      return (
        valueList[0].formatKey != "" &&
          valueList[0].formatKey != null &&
          valueList[0].formatKey != DashboardConstants.CommonConstants.Percent &&
          currenyBeforeAmount && configVal == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : ''
      )
        + AnalyticsUtilsService.FormatChartTooltip(y, configVal)
        + (
          valueList[0].formatKey != "" &&
            valueList[0].formatKey != null &&
            configVal == "" &&
            (
              valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount
            ) ? DashboardConstants.FormatType[valueList[0].formatKey] : ''
        )
    }
  }
  public static getDatalabelForCommon(configVal, y, formatKey) {
    return (configVal != '' ? (AnalyticsUtilsService.FormatChartTooltip(y, configVal)) : ((formatKey + numberFormat(y, 0, '.', ','))))
  }
  public static createBubbleChartSeriesData(mode: string, rowObjects: Array<any>, metricObjects: Array<any>): Array<any> {
    const _numberFormatingService = new NumberFormatingService();
    let reportObject: any =
      find(this._graphConfig.reportDetails.lstReportObjectOnValue, { displayName: metricObjects[0].reportObjectName });
    let configVal = _numberFormatingService.GetWijmoConfigurationFormat(reportObject.ConfigurationValue, reportObject.filterType);
    const _isDataLabelEnabled: boolean = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableDataLabel);
    const _selectedFontSize: number = this.getDataLabelConfig(DashboardConstants.DataLabelConfig.EnableFontSize);
    let valueList = this._graphConfig.reportDetails.lstReportObjectOnValue;
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    let configFormatArray ={};
    this._graphConfig.reportDetails.lstReportObjectOnValue.forEach(valueRO => {
      configFormatArray[valueRO.reportObjectName] = { formatKey: valueRO.formatKey, configurationValue:  _numberFormatingService.GetWijmoConfigurationFormat(valueRO.ConfigurationValue, valueRO.filterType) }
    });

    let series = [];
    switch (mode) {
      case 'SingleSeries': {
        series[0] = {};
        let temp = [];
        for (let i = 0; i < this._masterjson[this._masterjson.length - 1].rowObjects.length; i++) {
          let tempSingleSeries = {};
          tempSingleSeries['x'] =   (configFormatArray[metricObjects[0].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[0].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[0].reportObjectName].configurationValue[0] == 'p')) ? ((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[0].reportObjectName]) * 100 )) : parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[0].reportObjectName])).toFixed(2))
          tempSingleSeries['y'] =   (configFormatArray[metricObjects[1].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[1].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[1].reportObjectName].configurationValue[0] == 'p')) ? ((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[1].reportObjectName]) * 100 )) : parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[1].reportObjectName])).toFixed(2))
          tempSingleSeries['z'] =   (configFormatArray[metricObjects[2].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[2].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[2].reportObjectName].configurationValue[0] == 'p')) ? ((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[2].reportObjectName]) * 100 )) : parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[2].reportObjectName])).toFixed(2))
          tempSingleSeries['header'] = this._masterjson[this._masterjson.length - 1].rowObjects[i]
          temp.push(tempSingleSeries)
        }

        series[0].data = temp;
        series[0].marker = {
          fillColor: {
            radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
            stops: [
              [0, '#7fb2d7']
            ]
          }
        };
        series[0].name = metricObjects[0].reportObjectName;
        series[0].type = AnalyticsCommonConstants.ConstantString.Bubble;
        series[0]["dataLabels"] = {
          enabled: _isDataLabelEnabled,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },
          color: '#000000',
          formatter: function () {
            return (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && configVal == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
              + AnalyticsUtilsService.FormatChartTooltip(this.y, configVal)
              + (valueList[1].formatKey != "" && valueList[1].formatKey != null && configVal == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')

          }
        }
      };
        break;

      case 'SingleBubble': {
        series[0] = {};
        let temp = [];
        let temp2 = [];
        let seriesValue = 0;
        for (let i = 0; i < metricObjects.length; i++) {
          seriesValue = parseFloat((_numberFormatingService.isNumber(this._masterjson[0][metricObjects[i].reportObjectName])).toFixed(2));
          if(configFormatArray[metricObjects[i].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[i].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[i].reportObjectName].configurationValue[0] == 'p'))
          seriesValue = _numberFormatingService.isNumber(this._masterjson[0][metricObjects[i].reportObjectName]) * 100;
          temp2.push(seriesValue);
        }
        temp.push(temp2);
        series[0].data = temp;
        series[0].marker = {
          fillColor: {
            radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
            stops: [
              [0, '#7fb2d7']
            ]
          }
        };
        series[0].type = AnalyticsCommonConstants.ConstantString.Bubble;
        series[0].name = metricObjects[0].reportObjectName;
        series[0]["dataLabels"] = {
          enabled: _isDataLabelEnabled,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },
          color: '#000000',
          formatter: function () {
            return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configVal, this.y);
          }
        }
      }
        break;

      case 'GroupedBubbles': {
        series[0] = {};
        var temp = [];
        for (var i = 0; i < this._masterjson[this._masterjson.length - 1].rowObjects.length; i++) {
          var b = [];
          let seriesValue = 0;
          b.push(this._masterjson[this._masterjson.length - 1].rowObjects.indexOf(this._masterjson[i][rowObjects[0].reportObjectName]))
          for (var j = 0; j < metricObjects.length; j++) {
          seriesValue = parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[j].reportObjectName])).toFixed(2))
          if(configFormatArray[metricObjects[j].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[j].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[j].reportObjectName].configurationValue[0] == 'p'))
          seriesValue = _numberFormatingService.isNumber(this._masterjson[i][metricObjects[j].reportObjectName]) * 100;
          b.push(seriesValue);
          }
          temp.push(b);
        }
        series[0].data = temp;
        series[0].marker = {
          fillColor: {
            radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
            stops: [
              [0, '#7fb2d7']
            ]
          }
        };
        series[0].name = metricObjects[0].reportObjectName;
        series[0].type = AnalyticsCommonConstants.ConstantString.Bubble;
        series[0]["dataLabels"] = {
          enabled: _isDataLabelEnabled,
          allowOverlap: true,
          crop: false,
          overflow: 'none',
          cursor: 'pointer',
          style: {
            fontWeight: 'normal',
            textShadow: 'none',
            fontSize: _selectedFontSize,
            textOutline: 0
          },
          color: '#000000',
          formatter: function () {
            return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configVal, this.y);
          }

        }
      }
        break;

      case 'MultiSeries': {
        for (var i = 0; i < this._masterjson.length - 1; i++) {
          let temp = [];
          series[i] = {};
          series[i].data = [];
          temp.push((configFormatArray[metricObjects[0].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[0].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[0].reportObjectName].configurationValue[0] == 'p')) ? ((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[0].reportObjectName]) * 100 )) : parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[0].reportObjectName])).toFixed(2)))
          temp.push((configFormatArray[metricObjects[1].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[1].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[1].reportObjectName].configurationValue[0] == 'p')) ? ((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[1].reportObjectName]) * 100 )) : parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[1].reportObjectName])).toFixed(2)))
          temp.push((configFormatArray[metricObjects[2].reportObjectName].formatKey == DashboardConstants.CommonConstants.Percent || (configFormatArray[metricObjects[2].reportObjectName].configurationValue != undefined && configFormatArray[metricObjects[2].reportObjectName].configurationValue[0] == 'p')) ? ((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[2].reportObjectName]) * 100 )) : parseFloat((_numberFormatingService.isNumber(this._masterjson[i][metricObjects[2].reportObjectName])).toFixed(2)))
          series[i].data.push(temp);
          series[i]['name'] = this._masterjson[this._masterjson.length - 1].columnObject[i] == undefined ? 'NULL' : this._masterjson[this._masterjson.length - 1].columnObject[i]
          series[i]['type'] = AnalyticsCommonConstants.ConstantString.Bubble;
          series[i]["dataLabels"] = {
            enabled: _isDataLabelEnabled,
            allowOverlap: true,
            crop: false,
            overflow: 'none',
            cursor: 'pointer',
            style: {
              fontWeight: 'normal',
              textShadow: 'none',
              fontSize: _selectedFontSize,
              textOutline: 0
            },
            color: '#000000',
            formatter: function () {
              return AnalyticsUtilsService.getSeriesChartDatalabelsFormat(configVal, this.y);
            }
          }
          series[i]["color"] = this.getSeriesColor(series[i]['name'], i);
        }
      }
        break;
    }

    return series;
  }
  public static createWaterfallChartColumnTooltip(graphConfig, metricObjects) {
    const currentObj: any =
      find<IReportObjectInfo>(graphConfig.reportDetails.lstReportObjectOnValue, { reportObjectName: metricObjects[0] });
    const _numberFormatingService = new NumberFormatingService();
    const configFormat: any = _numberFormatingService.GetWijmoConfigurationFormat(currentObj.ConfigurationValue, currentObj.filterType);
    const formatKey: any = `<br/>${metricObjects}:` + '<b>' + (
      currentObj.formatKey != ""
        && currentObj.formatKey != null
        && currentObj.formatKey != AnalyticsCommonConstants.CommonConstants.Percent ?
        AnalyticsCommonConstants.FormatType[currentObj.formatKey] : ''
    );
    return {
      formatter: function () {
        let columnList = graphConfig.reportDetails.lstReportObjectOnColumn;
        var x = this.x
        var y = this.y
        return x + '<br/>' +
          (
            (columnList.length > 0 ? (columnList[0].reportObjectName + ':' + this.series.name + '<br/>') : "")
            //+ metricObjects[0] + ': <b>'
            + (configFormat != '' ? ('<b>' + AnalyticsUtilsService.FormatChartTooltip(y, configFormat) + '</b>') : ("<b>" + (formatKey + numberFormat(y, 0, '.', ',')) + '</b>'))
          );
      }
    }
  }
  public static createBubbleChartTooltip() {
    let valueList = this._graphConfig.reportDetails.lstReportObjectOnValue;
    const _numberFormatingService = new NumberFormatingService();
    let currenyBeforeAmount = _numberFormatingService.GetCurrencySymbolLocation();
    let format = _numberFormatingService.GetWijmoConfigurationFormat(valueList[0].ConfigurationValue, valueList[0].filterType);
    let colorFormat = _numberFormatingService.GetWijmoConfigurationFormat(valueList[1].ConfigurationValue, valueList[1].filterType);
    let colorConfigFormat = (valueList.length > 2) ? _numberFormatingService.GetWijmoConfigurationFormat(valueList[2].ConfigurationValue, valueList[2].filterType) : '';
    if (
      this._graphConfig.reportDetails.lstReportObjectOnRow.length == 1 &&
      this._graphConfig.reportDetails.lstReportObjectOnValue.length == 2 &&
      this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0
    ) {
      return {
        useHTML: true,
        headerFormat: '<span>',
        // pointFormat: valueList[0].reportObjectName + ' : <b>{point.y:,.2f}</b>' + '<br>' + valueList[1].reportObjectName + ' : <b>{point.z:,.2f}</b>',
        pointFormatter: function () {
          return (valueList[0].displayName + ':' + '<b>'
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + AnalyticsUtilsService.FormatChartTooltip(this.y, format)
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && format == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + '</b><br>'
            + (valueList[1].displayName + ':'
              + ' <b> '
              + (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
              + '' + AnalyticsUtilsService.FormatChartTooltip(this.z, colorFormat)
              + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
              + '</b>'))
        },
        footerFormat: '</span>'
      }
    }
    else if (
      this._graphConfig.reportDetails.lstReportObjectOnRow.length >= 1 &&
      this._graphConfig.reportDetails.lstReportObjectOnValue.length == 3 &&
      this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0
    ) {
      return {
        useHTML: true,
        headerFormat: '<span>',
        // pointFormat: '{point.header}' + '<br>' + valueList[0].reportObjectName + ' : <b>{point.x}</b>' + '<br>' + valueList[1].reportObjectName + ' : <b>{point.y}</b>' + '<br>' + valueList[2].reportObjectName + ' : <b>{point.z}</b>',
        pointFormatter: function () {
          return (
            this.header + '<br>'
            + valueList[0].displayName + ':' + '<b>'
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + AnalyticsUtilsService.FormatChartTooltip(this.x, format)
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && format == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + '</b><br>'
            + valueList[1].displayName + ':'
            + ' <b> '
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '' + AnalyticsUtilsService.FormatChartTooltip(this.y, colorFormat)
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '</b><br>'
            + (valueList[2].displayName + ':'
              + ' <b> '
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && valueList[2].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorConfigFormat == "" ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '' + AnalyticsUtilsService.FormatChartTooltip(this.z, colorConfigFormat)
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && colorConfigFormat == "" && (valueList[2].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '</b>'))
        },
        footerFormat: '</span>'
      }
    }
    else if (
      this._graphConfig.reportDetails.lstReportObjectOnRow.length == 0 &&
      this._graphConfig.reportDetails.lstReportObjectOnValue.length == 3 &&
      this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0
    ) {
      return {
        useHTML: true,
        headerFormat: '<span>',
        // pointFormat: valueList[0].reportObjectName + ' : <b>{point.x}</b>' + '<br>' + valueList[1].reportObjectName + ' : <b>{point.y}</b>' + '<br>' + valueList[2].reportObjectName + ' : <b>{point.z}</b>',
        pointFormatter: function () {
          return (
            valueList[0].displayName + ':' + '<b>'
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + AnalyticsUtilsService.FormatChartTooltip(this.x, format)
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && format == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + '</b><br>'
            + valueList[1].displayName + ':'
            + ' <b> '
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '' + AnalyticsUtilsService.FormatChartTooltip(this.y, colorFormat)
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '</b><br>'
            + (valueList[2].displayName + ':'
              + ' <b> '
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && valueList[2].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorConfigFormat == "" ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '' + AnalyticsUtilsService.FormatChartTooltip(this.z, colorConfigFormat)
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && colorConfigFormat == "" && (valueList[2].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '</b>'))
        },
        footerFormat: '</span>'
      }
    }
    else {
      return {
        headerFormat: '{series.name}',
        // pointFormat: '<br>' + valueList[0].reportObjectName + ' : <b>{point.x:,.2f}</b>' + '<br>' + valueList[1].reportObjectName + ' : <b>{point.y:,.2f}</b>' + '<br>' + valueList[2].reportObjectName + ' : <b>{point.z:,.2f}</b>'
        pointFormatter: function () {
          return ('<br>'
            + valueList[0].displayName + ':' + '<b>'
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && valueList[0].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && format == "" ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + AnalyticsUtilsService.FormatChartTooltip(this.x, format)
            + (valueList[0].formatKey != "" && valueList[0].formatKey != null && format == "" && (valueList[0].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[0].formatKey] : '')
            + '</b><br>'
            + valueList[1].displayName + ':'
            + ' <b> '
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && valueList[1].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorFormat == "" ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '' + AnalyticsUtilsService.FormatChartTooltip(this.y, colorFormat)
            + (valueList[1].formatKey != "" && valueList[1].formatKey != null && colorFormat == "" && (valueList[1].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[1].formatKey] : '')
            + '</b><br>'
            + (valueList[2].displayName + ':'
              + ' <b> '
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && valueList[2].formatKey != DashboardConstants.CommonConstants.Percent && currenyBeforeAmount && colorConfigFormat == "" ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '' + AnalyticsUtilsService.FormatChartTooltip(this.z, colorConfigFormat)
              + (valueList[2].formatKey != "" && valueList[2].formatKey != null && colorConfigFormat == "" && (valueList[2].formatKey == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[valueList[2].formatKey] : '')
              + '</b>'))
        }
      }
    }
  }

  public getAllSliderFilterMinMaxValue(reportDetailsData: any, config: any, currentDashletConfig: any, sliderFilterReportObj: any) {
    if (typeof config.changeDetectionMutation.setSliderState !== "undefined") config.changeDetectionMutation.setSliderState();
    return this._analyticsCommonDataService.getAllSliderFilterMinMaxValue(reportDetailsData)
      .map((response: any) => {
        config.sliderFilterArray = [];
        if (response != null && response.length > 0) {
          // Fill min Max Values of respective Slider Filter.
          // for (let i = 0; i < config.length; i++) {
          if (config.reportDetails.reportDetailObjectId == currentDashletConfig.reportDetailsId &&
            sliderFilterReportObj != null && sliderFilterReportObj.length > 0) {
            sliderFilterReportObj.forEach((savedFilter, index) => {

              let sliderFilterDetailsObj = {};

              // New Slider Filter Details Config

              // sliderFilterDetailsObj["reportObjectId"] = savedFilter.reportObject.reportObjectId;
              // sliderFilterDetailsObj['reportObjectName'] = savedFilter.reportObject.displayName;



              let minValue = parseInt(response.find(x => x.reportObjectName === savedFilter.reportObject.reportObjectName).min);
              let maxValue = parseInt(response.find(x => x.reportObjectName === savedFilter.reportObject.reportObjectName).max);


              sliderFilterDetailsObj = {
                reportObjectName: savedFilter.reportObject.displayName,
                reportObjectId: savedFilter.reportObject.reportObjectId,
                min: minValue,
                max: maxValue,
                range: {
                  // from: minValue,
                  // to: maxValue
                  from: savedFilter.filterValue.length > 0 ? parseInt(savedFilter.filterValue[0]) : minValue,
                  to: savedFilter.filterValue.length > 0 ? parseInt(savedFilter.filterValue[1]) : maxValue
                },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                },
                sliderTooltipConfig: {
                  message: savedFilter.reportObject.displayName,
                  position: "top"
                }

              };


              // sliderFilterDetailsObj["from"] = savedFilter.filterValue.length > 0 ? parseInt(savedFilter.filterValue[0]) : minValue;
              // sliderFilterDetailsObj["to"] = savedFilter.filterValue.length > 0 ? parseInt(savedFilter.filterValue[1]) : maxValue;
              // sliderFilterDetailsObj["defaultRangeFrom"] = minValue;
              // sliderFilterDetailsObj["defaultRangeTo"] = maxValue;
              // sliderFilterDetailsObj["reportObjectName"]
              // sliderFilterDetailsObj["min"] = minValue;
              // sliderFilterDetailsObj["max"] = maxValue;
              // sliderFilterDetailsObj["sliderTooltipConfig"] = {
              //     message: savedFilter.reportObject.displayName,
              //     position: "top"
              // }

              config.sliderFilterArray.push(sliderFilterDetailsObj);
            });
          }
        }
        // }
        if (typeof config.changeDetectionMutation.setSliderState !== "undefined") config.changeDetectionMutation.setSliderState();
      });
  }

  public static savedViewFilterToAppliedFilter(savedViewFilter: any, CrossSuiteFilterConf: any, filterConditionMetadata: Array<IFilterConditionMetadata>, isTabFilter: boolean = false) {
    let appliedFilter: IReportingObjectMultiDataSource;
    let appliedFilterList: Array<IFilterList> = [];
    let filterPanelList: any = [];
    this._filterConditionMetadata = filterConditionMetadata; // Since we can't use this._dashboardCommService.filterConditionMetadata in this static method, we bind that data to a static variable whenever we call this mehod.
    let FilterType = isTabFilter ? 'TabFilterType' : 'ViewFilterType';

    if (typeof savedViewFilter.filterValue === 'string') {
      savedViewFilter.filterValue = JSON.parse(savedViewFilter.filterValue);
    }
    if ((savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MultiSelect ||
      savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.SingleSelect ||
      savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Number) &&
      savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterBySelection) {
      savedViewFilter.filterValue.forEach((appliedFilter) => {
        appliedFilterList.push({
          title: appliedFilter,
          IsSelected: true
        } as IFilterList);

        filterPanelList.push({
          title: appliedFilter,
          isStriked: false
        });
      });
    }
    else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
      savedViewFilter[FilterType] === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
      savedViewFilter.filterValue.forEach((appliedFilter) => {
        appliedFilterList.push({
          title: appliedFilter,
          IsSelected: true
        } as IFilterList);

        filterPanelList.push({
          title: appliedFilter,
          isStriked: false
        });
      });
    }

    let crossSuiteFilterMapping: ICrossSuiteFilterMapping = undefined;
    if (savedViewFilter[FilterType] == DashboardConstants.ViewFilterType.MultiSource) {
      crossSuiteFilterMapping = filter(CrossSuiteFilterConf.listAllCrossSuiteFilterMapping, (_crossSuiteFilterValue: ICrossSuiteFilterMapping, _crossSuiteFilterKey: any) => {
        return _crossSuiteFilterValue.RelationObject.RelationObjectTypeId == savedViewFilter.ObjectId;
      })[0];
    }
    //If the filter is cross suite
    if (crossSuiteFilterMapping) {
      let dataSourcePriority: Array<IRelationObjectMapping> = filter(
        crossSuiteFilterMapping.RelationObjectMapping, (
          _relMapValue: IRelationObjectMapping, _relMapKey: any) => {
        return _relMapValue.DataSourcePriority == 1 // Getting the top priority DataSource Reporting Object
      });


      if (dataSourcePriority == undefined || dataSourcePriority.length == 0) {
        dataSourcePriority.push(crossSuiteFilterMapping.RelationObjectMapping[0]);
      }
      else if (dataSourcePriority.length >= 2) {
        //If user mapping consist of the Same Priority for the Filter Mapping.
        dataSourcePriority = [];
        dataSourcePriority.push(crossSuiteFilterMapping.RelationObjectMapping[0]);
      }

      //Filter Search Logic Implementation, get applied filter based on mapping and priority
      appliedFilter = this.createCrossSuiteFilterReportObject(filter(
        CrossSuiteFilterConf.listAllReportObjectWithMultiDatasource,
        (_allfilterROValue: IReportingObjectMultiDataSource, _allfilterROKey: any) => {
          return _allfilterROValue.ReportObjectId === dataSourcePriority[0].ReportObjectId;
        })[0],
        {
          CrossSuiteFilterMapping: crossSuiteFilterMapping,
          IsCrossSuiteFilter: true
        }
      ) as IReportingObjectMultiDataSource;

      savedViewFilter.reportObject.reportObjectId = appliedFilter.ReportObjectId;
      savedViewFilter.reportObject.filterType = appliedFilter.FilterType;
      savedViewFilter.reportObject.filterTypeObjectId = appliedFilter.FilterTypeObjectId;
    }
    return {
      DisplayName: appliedFilter && appliedFilter.DisplayName ? appliedFilter.DisplayName : savedViewFilter.reportObject.displayName,
      DrillTransactionOrder: appliedFilter && appliedFilter.DrillTransactionOrder ? appliedFilter.DrillTransactionOrder : savedViewFilter.reportObject.drillTransactionOrder,
      Expression: appliedFilter && appliedFilter.Expression ? appliedFilter.Expression : savedViewFilter.reportObject.expression,
      DerivedRoType: appliedFilter && appliedFilter.DerivedRoType ? appliedFilter.DerivedRoType : savedViewFilter.reportObject.derivedRoType,
      FilterType: appliedFilter && appliedFilter.FilterType ? appliedFilter.FilterType : savedViewFilter.reportObject.filterType,
      FilterTypeObjectId: appliedFilter && appliedFilter.FilterTypeObjectId ? appliedFilter.FilterTypeObjectId : savedViewFilter.reportObject.filterTypeObjectId,
      FormatKey: appliedFilter && appliedFilter.FormatKey ? appliedFilter.FormatKey : savedViewFilter.reportObject.formatKey,
      IsDerived: appliedFilter && appliedFilter.IsDerived ? appliedFilter.IsDerived : savedViewFilter.reportObject.isDerived,
      IsDrill: appliedFilter && appliedFilter.IsDrill ? appliedFilter.IsDrill : savedViewFilter.reportObject.isDrill,
      IsDrillToTransactional: appliedFilter && appliedFilter.IsDrillToTransactional ? appliedFilter.IsDrillToTransactional : savedViewFilter.reportObject.isDrillToTransactional,
      IsFilterable: appliedFilter && appliedFilter.IsFilterable ? appliedFilter.IsFilterable : savedViewFilter.reportObject.isFilterable,
      IsSelectAll: appliedFilter && appliedFilter.IsSelectAll ? appliedFilter.IsSelectAll : savedViewFilter.reportObject.isSelectAll,
      IsTransactional: appliedFilter && appliedFilter.IsTransactional ? appliedFilter.IsTransactional : savedViewFilter.reportObject.isTransactional,
      LayoutArea: appliedFilter && appliedFilter.LayoutArea ? appliedFilter.LayoutArea : savedViewFilter.reportObject.layoutArea,
      ObjectGroupName: appliedFilter && appliedFilter.ObjectGroupName ? appliedFilter.ObjectGroupName : savedViewFilter.reportObject.objectGroupName,
      ParentReportObjects: appliedFilter && appliedFilter.ParentReportObjects ? appliedFilter.ParentReportObjects : savedViewFilter.reportObject.parentReportObjects,
      ReportObjectDataType: appliedFilter && appliedFilter.ReportObjectDataType ? appliedFilter.ReportObjectDataType : savedViewFilter.reportObject.reportObjectDataType,
      ReportObjectId: appliedFilter && appliedFilter.ReportObjectId ? appliedFilter.ReportObjectId : savedViewFilter.reportObject.reportObjectId,
      ReportObjectName: appliedFilter && appliedFilter.ReportObjectName ? appliedFilter.ReportObjectName : savedViewFilter.reportObject.reportObjectName,
      ReportObjectType: appliedFilter && appliedFilter.ReportObjectType ? appliedFilter.ReportObjectType : savedViewFilter.reportObject.reportObjectType,
      ReportObjectWidth: appliedFilter && appliedFilter.ReportObjectWidth ? appliedFilter.ReportObjectWidth : savedViewFilter.reportObject.reportObjectWidth,
      SequenceNumber: appliedFilter && appliedFilter.SequenceNumber ? appliedFilter.SequenceNumber : savedViewFilter.reportObject.sequenceNumber,
      TableName: appliedFilter && appliedFilter.TableName ? appliedFilter.TableName : savedViewFilter.reportObject.tableName,
      FilterBy: savedViewFilter.filterBy,
      GroupName: "",
      IsSelected: true,
      isDefault: false,
      isDisable: false,
      isFilter: false,
      inChip: false,
      FilterList: appliedFilterList,
      FilterSearchText: { value: "" },
      SelectionConfig: {
        disable: true,
        isMandatory: true,
        isVisible: false,
        label: '',
        validate: true,
        focus: true,
        errorMessage: 'Error message'
      },
      FilterConditionText: this.getFilterModelProperties(DashboardConstants.FilterProperty.FilterConditionText, savedViewFilter),
      FilterConditionOperator: this.getFilterModelProperties(DashboardConstants.FilterProperty.FilterConditionOperator, savedViewFilter),
      FilterRadioOperator: this.getFilterModelProperties(DashboardConstants.FilterProperty.FilterRadioOperator, savedViewFilter),
      YearModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.YearModel, savedViewFilter),
      FilterConditionValue: this.getFilterModelProperties(DashboardConstants.FilterProperty.FilterConditionValue, savedViewFilter),
      FilterConditionRangeValue: this.getFilterModelProperties(DashboardConstants.FilterProperty.FilterConditionRangeValue, savedViewFilter),
      FromyearDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.FromyearDropdown, savedViewFilter),
      ToyearDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.ToyearDropdown, savedViewFilter),
      yearDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.yearDropdown, savedViewFilter),
      sourceYear: [],
      sourceQuarterYear: [],
      BeginningOfTheYear: this.getFilterModelProperties(DashboardConstants.FilterProperty.BeginningOfTheYear, savedViewFilter),
      RollingYearsModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.RollingYearsModel, savedViewFilter),
      NextYearsModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.NextYearsModel, savedViewFilter),
      DateModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.DateModel, savedViewFilter),
      FromDateModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.FromDateModel, savedViewFilter),
      ToDateModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.ToDateModel, savedViewFilter),
      DateRadioModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.DateRadioModel, savedViewFilter),
      RollingDateModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.RollingDateModel, savedViewFilter),
      NextDateModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.NextDateModel, savedViewFilter),
      NextQuarterYearsModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.NextQuarterYearsModel, savedViewFilter),
      QuarterYearModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.QuarterYearModel, savedViewFilter),
      RollingQuarterYearsModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.RollingQuarterYearsModel, savedViewFilter),
      PreviousQuarterYearsModel: this.getFilterModelProperties(DashboardConstants.FilterProperty.PreviousQuarterYearsModel, savedViewFilter),
      BeginningOfTheQuarterYear: this.getFilterModelProperties(DashboardConstants.FilterProperty.BeginningOfTheQuarterYear, savedViewFilter),
      BeginningOfTheQuarter: this.getFilterModelProperties(DashboardConstants.FilterProperty.BeginningOfTheQuarter, savedViewFilter),
      QuarteryearDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.QuarteryearDropdown, savedViewFilter),
      sourceQuarterDropDown: this.getFilterModelProperties(DashboardConstants.FilterProperty.sourceQuarterDropDown, savedViewFilter),
      FromQuarteryearDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.FromQuarteryearDropdown, savedViewFilter),
      FromQuarterDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.FromQuarterDropdown, savedViewFilter),
      ToQuarteryearDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.ToQuarteryearDropdown, savedViewFilter),
      ToQuarterDropdown: this.getFilterModelProperties(DashboardConstants.FilterProperty.ToQuarterDropdown, savedViewFilter),
      RollingYear: {
        label: "",
        attributes: { maxLength: 0 },
        data: ""
      },
      NextYears: {
        label: "",
        attributes: { maxLength: 0 },
        data: "",
      },
      appliedFilter: false,
      SelectAll: false,
      DataSource_ObjectId: appliedFilter && appliedFilter.DataSource_ObjectId ? appliedFilter.DataSource_ObjectId : savedViewFilter.reportObject.dataSource_ObjectId,
      IsMeasure: false,
      Is_DefaultOpportunityFinder: appliedFilter && appliedFilter.Is_DefaultOpportunityFinder ? appliedFilter.Is_DefaultOpportunityFinder : savedViewFilter.reportObject.is_DefaultOpportunityFinder,
      DataType: undefined,
      ReporObjectWidth: undefined,
      WijmoGridAggregatedType: appliedFilter && appliedFilter.WijmoGridAggregatedType ? appliedFilter.WijmoGridAggregatedType : savedViewFilter.reportObject.wijmoGridAggregatedType,
      OpportunityFinderSequenceNumber: appliedFilter && appliedFilter.OpportunityFinderSequenceNumber ? appliedFilter.OpportunityFinderSequenceNumber : savedViewFilter.reportObject.opportunityFinder_SequenceNumber,
      CustomFormula: appliedFilter && appliedFilter.CustomFormula ? appliedFilter.CustomFormula : savedViewFilter.reportObject.customFormula,
      IsOpportunityFinderDataSource: false,
      selectedFilterList: appliedFilterList,
      FiterTypeName: undefined,
      filteredList: appliedFilterList,
      CrossSuiteFilterMapping: crossSuiteFilterMapping,
      filterPanelList: filterPanelList,
      FilterIdentifier: savedViewFilter[FilterType] === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ?
        DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource : savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ? DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : DashboardConstants.ViewFilterType.SingleSource,
      FilterTabInfo: savedViewFilter.FilterConditionText,
      enabledAsGlobalSlider: savedViewFilter.ViewFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource || savedViewFilter.TabFilterType == DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource,
      globalSliderObject: typeof (savedViewFilter.globalSliderObject) == "string" ? JSON.parse(savedViewFilter.globalSliderObject) : savedViewFilter.globalSliderObject
    } as IReportingObjectMultiDataSource;
  }

  public static createCrossSuiteFilterReportObject(_reportObject: IReportingObjectMultiDataSource, _crossSuiteInfo: any, datasourceType: AnalyticsCommonConstants.DataSourceType = AnalyticsCommonConstants.DataSourceType.Tabular) {
    return {
      FilterTypeObjectId: _reportObject.FilterTypeObjectId,
      DataSource_ObjectId: _reportObject.DataSource_ObjectId,
      DatasourceType: datasourceType,
      ReportObjectName: _reportObject.ReportObjectName,
      DisplayName: _crossSuiteInfo.IsCrossSuiteFilter ? _crossSuiteInfo.CrossSuiteFilterMapping.RelationObject.RelationObjectTypeName : _reportObject.DisplayName,
      ReportObjectId: _reportObject.ReportObjectId,
      BeginningOfTheYear: {} as IBeginningOfTheYear,
      yearDropdown: {} as IYearDropdown,
      RollingYearsModel: {} as IRollingYearsModel,
      RollingYear: {} as IRollingYear,
      NextYearsModel: {} as INextYearsModel,
      NextYears: {} as INextYears,
      FromyearDropdown: {} as IFromyearDropdown,
      ToyearDropdown: {} as IToYearDropdown,
      sourceYear: [],
      sourceQuarterYear: [],
      YearModel: {} as IFilterRadioOperator,
      BeginningOfTheQuarterYear: {} as IBeginningOfTheYear,
      BeginningOfTheQuarter: {} as IBeginningOfTheYear,
      RollingQuarterYear: {} as IRollingYear,
      RollingQuarterYearsModel: {} as IRollingQuarterYearsModel,
      PreviousQuarterYear: {} as IRollingYear,
      PreviousQuarterYearsModel: {} as IPreviousQuarterYearsModel,
      FromQuarteryearDropdown: {} as IFromyearDropdown,
      FromQuarterDropdown: {} as IFromyearDropdown,
      ToQuarteryearDropdown: {} as IToYearDropdown,
      ToQuarterDropdown: {} as IToYearDropdown,
      QuarteryearDropdown: {} as IYearDropdown,
      sourceQuarterDropDown: {} as IYearDropdown,
      QuarterYearModel: {} as IFilterRadioOperator,
      NextQuarterYears: {} as INextYears,
      NextQuarterYearsModel: {} as INextQuarterYearsModel,
      DateModel: {} as IDateModel,
      FromDateModel: {} as IFromDateModel,
      ToDateModel: {} as IToDateModel,
      DateRadioModel: {} as IDateRadioModel,
      RollingDateModel: {} as IRollingDateModel,
      NextDateModel: {} as INextDateModel,
      GroupName: _reportObject.GroupName,
      ReportObjectType: _reportObject.ReportObjectType,
      IsSelected: _reportObject.IsSelected,
      appliedFilter: false,
      isDefault: true,
      isDisable: false,
      isFilter: false,
      FilterType: _reportObject.FilterType,
      FilterBy: _reportObject.FilterBy || 1,
      FilterTabInfo: "",
      inChip: _reportObject.inChip || false,
      FilterConditionOperator: this.mapFilterConditions(_reportObject.FilterConditionOperator),
      FilterRadioOperator: {} as IFilterRadioOperator,
      FilterConditionRangeValue: {} as IFilterConditionRangeValue,
      FilterConditionText: { value: _reportObject.FilterConditionText || '' },
      FilterSearchText: { value: _reportObject.FilterSearchText || '' },
      FilterConditionValue: _reportObject.FilterConditionValue || '',
      IsSelectAll: _reportObject.IsSelectAll,
      DrillTransactionOrder: _reportObject.DrillTransactionOrder,
      SelectionConfig: {
        disable: true,
        isMandatory: true,
        isVisible: false,
        label: '',
        validate: true,
        focus: true,
        errorMessage: 'Error message'
      },
      FilterList: _reportObject.selectedFilterList || [],
      selectedFilterList: _reportObject.selectedFilterList || [],
      ObjectGroupName: _reportObject.ObjectGroupName,
      LayoutArea: _reportObject.LayoutArea,
      IsTransactional: _reportObject.IsTransactional,
      FormatKey: _reportObject.FormatKey,
      CustomFormula: _reportObject.CustomFormula,
      Expression: _reportObject.Expression,
      DerivedRoType: _reportObject.DerivedRoType,
      Is_DefaultOpportunityFinder: _reportObject.Is_DefaultOpportunityFinder,
      OpportunityFinderSequenceNumber: _reportObject.OpportunityFinderSequenceNumber,
      WijmoGridAggregatedType: _reportObject.WijmoGridAggregatedType,
      SequenceNumber: _reportObject.SequenceNumber,
      IsFilterable: _reportObject.IsFilterable,
      IsDerived: _reportObject.IsDerived,
      ReportObjectDataType: _reportObject.ReportObjectDataType,
      IsDrillToTransactional: _reportObject.IsDrillToTransactional,
      ReportObjectWidth: _reportObject.ReportObjectWidth,
      IsDrill: _reportObject.IsDrill,
      ParentReportObjects: _reportObject.ParentReportObjects,
      filteredList: _reportObject.selectedFilterList || [],
      CrossSuiteFilterMapping: _crossSuiteInfo.IsCrossSuiteFilter ? _crossSuiteInfo.CrossSuiteFilterMapping : undefined,
      IsStandardFilterRO: _reportObject.IsStandardFilterRO,
      autoCompleteFilterList: [],
      autoCompleteFilterData: '',
      filterPanelList: [],
      enabledAsGlobalSlider: false,
      globalSliderObject: typeof (_crossSuiteInfo.globalSliderObject) == "string" ? JSON.parse(_crossSuiteInfo.globalSliderObject) : new GlobalSliderObject(),
      FilterIdentifier: !_crossSuiteInfo.IsCrossSuiteFilter ? DashboardConstants.ViewFilterType.SingleSource : DashboardConstants.ViewFilterType.MultiSource
    };
  }

  public static createDrillDriveFilterReportObj(filterDetails: any) {
    let filterReportObj = new SavedFilter();
    //console.log(AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetails));
    //AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetails);
    filterReportObj.FilterIdentifier = filterDetails.filterIdentifier;
    filterReportObj.NestedReportFilterObject = null;
    filterReportObj.SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
    filterReportObj.filterBy = DashboardConstants.FilterBy.FilterBySelection;
    filterReportObj.Operators = DashboardConstants.ReportObjectOperators.Is;
    filterReportObj.filterCondition.FilterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIs;
    filterReportObj.filterCondition.condition = DashboardConstants.ReportObjectOperators.Is;
    filterReportObj.filterCondition.isPeriodFilter = false;
    filterReportObj.filterCondition.name = "";
    filterReportObj.reportObject = filterDetails.reportObject && filterDetails.reportObject.reportObjectId ? filterDetails.reportObject : new ReportObject().jsonToObject(filterDetails.reportObject);
    filterReportObj.filterValue.push(filterDetails.filterValue);
    filterReportObj.isGlobalFilter = true;
    filterReportObj.isSliderWidgetFilter = false;
    filterReportObj.WidgetID = filterDetails.widgetID;
    //new SavedFilter().jsonToObject(filterReportObj);
    return filterReportObj;
  }

  private static getFilterModelProperties(_propertyName: any, savedViewFilter: any) {
    let _emptyString: string = DashboardConstants.OpportunityFinderConstants.STRING_EMPTY;
    let filterConditionValue: string = _emptyString;
    let listFilterCdnValue = [];
    let filterConditionText = { value: _emptyString };
    let filterConditionRangeValue: IFilterConditionRangeValue = {
      from: _emptyString,
      to: _emptyString
    } as IFilterConditionRangeValue;

    if (savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterBySelection) {
      if (savedViewFilter.reportObject.filterType == DashboardConstants.FilterType.Date) {
        if (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.From_DateTillToday) {
          filterConditionValue = savedViewFilter.filterValue[1] + "/" + savedViewFilter.filterValue[2] + "/" + savedViewFilter.filterValue[0];
        }
        else if (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Rolling_Days ||
          savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Next_Days) {
          filterConditionValue = savedViewFilter.filterValue[0];
        }
        else if (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Tomorrow ||
          savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Today ||
          savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Yesterday) {
          filterConditionValue = _emptyString;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year) {
        if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_YearTillToday) {
          filterConditionValue = savedViewFilter.filterValue[0];
        }
        else if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Rolling_Years ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Years) {
          filterConditionValue = savedViewFilter.filterValue[0];
        }
        else if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.PreviousYear ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.ThisYear ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.NextYear) {
          filterConditionValue = _emptyString;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.ThisQuarter:
          case DashboardConstants.ReportObjectOperators.NextQuarter:
          case DashboardConstants.ReportObjectOperators.PreviousQuarter:
            filterConditionValue = _emptyString;
            break;
          case DashboardConstants.ReportObjectOperators.Next_Quarters:
            filterConditionValue = savedViewFilter.filterValue[0];
            break;
          default:
            break;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.ThisQuarter:
          case DashboardConstants.ReportObjectOperators.PreviousQuarter:
          case DashboardConstants.ReportObjectOperators.NextQuarter:
            filterConditionValue = _emptyString;
            break;
          case DashboardConstants.ReportObjectOperators.Rolling_Quarters:
          case DashboardConstants.ReportObjectOperators.Next_Quarters:
          case DashboardConstants.ReportObjectOperators.Previous_Quarter:
            filterConditionValue = savedViewFilter.filterValue[0];
            break;
          case DashboardConstants.ReportObjectOperators.From_QuarterTillToday:
            listFilterCdnValue = [...savedViewFilter.filterValue];
            break;
          default:
            break;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.ThisMonth:
          case DashboardConstants.ReportObjectOperators.PreviousMonth:
          case DashboardConstants.ReportObjectOperators.NextMonth:
            filterConditionValue = _emptyString;
            break;
          case DashboardConstants.ReportObjectOperators.Rolling_Months:
          case DashboardConstants.ReportObjectOperators.Next_Months:
          case DashboardConstants.ReportObjectOperators.Previous_Month:
            filterConditionValue = savedViewFilter.filterValue[0];
            break;
          case DashboardConstants.ReportObjectOperators.From_MonthTillToday:
            listFilterCdnValue = [...savedViewFilter.filterValue];
            break;
          default:
            break;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.ThisMonth:
          case DashboardConstants.ReportObjectOperators.NextMonth:
          case DashboardConstants.ReportObjectOperators.PreviousMonth:
            filterConditionValue = _emptyString;
            break;
          case DashboardConstants.ReportObjectOperators.Next_Months:
            filterConditionValue = savedViewFilter.filterValue[0];
            break;
          default:
            break;
        }
      }
    }

    if (savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterByCondition) {
      //Filter Condition Value
      if (savedViewFilter.reportObject.filterType == DashboardConstants.FilterType.Date) {
        if (savedViewFilter.filterCondition.condition != DashboardConstants.ReportObjectOperators.Between &&
          savedViewFilter.filterCondition.condition != DashboardConstants.ReportObjectOperators.NotBetween) {
          if (filterConditionValue.indexOf("/") == -1) {
            filterConditionValue = this.getDAXDateFormattedValue(savedViewFilter.filterValue[0]);
          }
        }
        else if (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Between ||
          savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.NotBetween) {
          if (filterConditionRangeValue.from.indexOf("/") == -1) {
            filterConditionRangeValue.from = this.getDAXDateFormattedValue(savedViewFilter.filterValue[0]);
          }
          if (filterConditionRangeValue.to.indexOf("/") == -1) {
            filterConditionRangeValue.to = this.getDAXDateFormattedValue(savedViewFilter.filterValue[1]);
          }

        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year) {
        if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot) {
          savedViewFilter.filterValue.forEach((appliedFilter) => {
            listFilterCdnValue.push({
              name: appliedFilter,
              check: false,
              IsCheckModel: {
                IsCheck: true
              }
            });
          });
        }
        else if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.NotBetween) {
          filterConditionRangeValue.from = savedViewFilter.filterValue[0];
          filterConditionRangeValue.to = savedViewFilter.filterValue[1];
        }
        else if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Before ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.After) {
          filterConditionValue = savedViewFilter.filterValue[0];
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.Is:
          case DashboardConstants.ReportObjectOperators.IsNot:
            listFilterCdnValue = savedViewFilter.filterValue;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.Is:
          case DashboardConstants.ReportObjectOperators.IsNot:
          case DashboardConstants.ReportObjectOperators.After:
          case DashboardConstants.ReportObjectOperators.Before:
            filterConditionValue = savedViewFilter.filterValue[0];
            break;
          case DashboardConstants.ReportObjectOperators.Between:
            filterConditionRangeValue.from = savedViewFilter.filterValue[0];
            filterConditionRangeValue.to = savedViewFilter.filterValue[1];
            break;
          default:
            break;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.Is:
          case DashboardConstants.ReportObjectOperators.IsNot:
          case DashboardConstants.ReportObjectOperators.After:
          case DashboardConstants.ReportObjectOperators.Before:
            filterConditionValue = savedViewFilter.filterValue[0];
            break;
          case DashboardConstants.ReportObjectOperators.Between:
            filterConditionRangeValue.from = savedViewFilter.filterValue[0];
            filterConditionRangeValue.to = savedViewFilter.filterValue[1];
            break;
          default:
            break;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month) {
        switch (savedViewFilter.filterCondition.condition) {
          case DashboardConstants.ReportObjectOperators.Is:
          case DashboardConstants.ReportObjectOperators.IsNot:
            listFilterCdnValue = savedViewFilter.filterValue;
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Measure) {
        if ([DashboardConstants.ReportObjectOperators.Between,
        DashboardConstants.ReportObjectOperators.NotBetween].indexOf(savedViewFilter.filterCondition.condition) === -1) {
          filterConditionValue = savedViewFilter.filterValue[0];
        }
        else {
          filterConditionRangeValue.from = savedViewFilter.filterValue[0];
          filterConditionRangeValue.to = savedViewFilter.filterValue[1];
        }
      }
      else if (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Number) {
        if ([DashboardConstants.ReportObjectOperators.Between,
        DashboardConstants.ReportObjectOperators.NotBetween,
        DashboardConstants.ReportObjectOperators.In,
        DashboardConstants.ReportObjectOperators.NotIn].indexOf(savedViewFilter.filterCondition.condition) === -1) {
          filterConditionValue = savedViewFilter.filterValue[0];
        }
        else if ([DashboardConstants.ReportObjectOperators.Between,
        DashboardConstants.ReportObjectOperators.NotBetween].indexOf(savedViewFilter.filterCondition.condition) === -1) {
          filterConditionText.value = '';
          each(savedViewFilter.filterValue, (_value) => {
            filterConditionText.value = filterConditionText.value + _value + ';';
          });
        }
        else {
          filterConditionRangeValue.from = savedViewFilter.filterValue[0];
          filterConditionRangeValue.to = savedViewFilter.filterValue[1];
        }
      }
      if (savedViewFilter.reportObject.filterType == DashboardConstants.FilterType.MultiSelect) {
        filterConditionValue = savedViewFilter.filterValue[0];
      }
    }

    switch (_propertyName) {
      case DashboardConstants.FilterProperty.FilterConditionOperator:
        return savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterByCondition ?
          {
            op: savedViewFilter.filterCondition.condition,
            title: savedViewFilter.filterCondition.name || _emptyString,
            FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
          } as IFilterConditionOperator :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date ?
            {
              op: DashboardConstants.ReportObjectOperators.Between,
              title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Between],
              FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Between &&
                  filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
              })[0].FilterConditionObjectId
            } as IFilterConditionOperator :
            savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year ?
              {
                op: DashboardConstants.ReportObjectOperators.Is,
                title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
                FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                  return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                    filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                })[0].FilterConditionObjectId
              } as IFilterConditionOperator :
              savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter ?
                {
                  op: DashboardConstants.ReportObjectOperators.Is,
                  title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
                  FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                    return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                      filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                  })[0].FilterConditionObjectId
                } as IFilterConditionOperator :
                savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear ?
                  {
                    op: DashboardConstants.ReportObjectOperators.Is,
                    title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
                    FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                      return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                        filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                    })[0].FilterConditionObjectId
                  } as IFilterConditionOperator :
                  savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear ?
                    {
                      op: DashboardConstants.ReportObjectOperators.Is,
                      title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
                      FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                        return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                          filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                      })[0].FilterConditionObjectId
                    } as IFilterConditionOperator :
                    savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month ?
                      {
                        op: DashboardConstants.ReportObjectOperators.Is,
                        title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Is],
                        FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                          return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Is &&
                            filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                        })[0].FilterConditionObjectId
                      } as IFilterConditionOperator :
                      (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Measure ||
                        savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Number) ? {
                          op: DashboardConstants.ReportObjectOperators.GreaterThan,
                          title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.GreaterThan],
                          FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.GreaterThan &&
                              filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                          })[0].FilterConditionObjectId
                        } as IFilterConditionOperator :
                        {
                          op: DashboardConstants.ReportObjectOperators.In,
                          title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.In],
                          FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.In &&
                              filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                          })[0].FilterConditionObjectId
                        } as IFilterConditionOperator
      case DashboardConstants.FilterProperty.FilterRadioOperator:
        return savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterBySelection &&
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date ?
          {
            field: {
              op: savedViewFilter.filterCondition.condition,
              title: _emptyString,
              FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
            }
          } as IFilterRadioOperator :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MultiSelect ?
            {
              field: {
                op: 0,
                title: _emptyString,
                FilterConditionObjectId: _emptyString
              }
            } as IFilterRadioOperator :
            savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year ?
              {
                field: {
                  op: DashboardConstants.ReportObjectOperators.ThisYear,
                  title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisYear],
                  FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                    return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisYear &&
                      filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                  })[0].FilterConditionObjectId
                }
              } as IFilterRadioOperator :
              savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter ?
                {
                  field: {
                    op: DashboardConstants.ReportObjectOperators.ThisQuarter,
                    title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter],
                    FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                      return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter &&
                        filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                    })[0].FilterConditionObjectId
                  }
                } as IFilterRadioOperator :
                savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear ?
                  {
                    field: {
                      op: DashboardConstants.ReportObjectOperators.ThisQuarter,
                      title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisQuarter],
                      FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                        return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisQuarter &&
                          filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                      })[0].FilterConditionObjectId
                    }
                  } as IFilterRadioOperator :
                  savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear ?
                    {
                      field: {
                        op: DashboardConstants.ReportObjectOperators.ThisMonth,
                        title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth],
                        FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                          return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth &&
                            filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                        })[0].FilterConditionObjectId
                      }
                    } as IFilterRadioOperator :
                    savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month ?
                      {
                        field: {
                          op: DashboardConstants.ReportObjectOperators.ThisMonth,
                          title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisMonth],
                          FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                            return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisMonth &&
                              filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                          })[0].FilterConditionObjectId
                        }
                      } as IFilterRadioOperator :
                      savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Measure ? {} as IFilterRadioOperator :
                        savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Number ? {} as IFilterRadioOperator :
                          {
                            field: {
                              op: DashboardConstants.ReportObjectOperators.Today,
                              title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Today],
                              FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Today &&
                                  filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                              })[0].FilterConditionObjectId
                            }
                          } as IFilterRadioOperator
      case DashboardConstants.FilterProperty.YearModel:
        return savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterBySelection &&
          savedViewFilter.reportObject.filterType == DashboardConstants.FilterType.Year ?
          {
            field: {
              op: savedViewFilter.filterCondition.condition,
              title: _emptyString,
              FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
            }
          } as IFilterRadioOperator :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MultiSelect ?
            {
              field: {
                op: 0,
                title: _emptyString,
                FilterConditionObjectId: _emptyString
              }
            } as IFilterRadioOperator :
            savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date ?
              {
                field: {
                  op: DashboardConstants.ReportObjectOperators.Today,
                  title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.Today],
                  FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                    return filterCdn.Condition == DashboardConstants.ReportObjectOperators.Today &&
                      filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                  })[0].FilterConditionObjectId
                }
              } as IFilterRadioOperator :
              savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter ? {} as IFilterRadioOperator :
                savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear ? {} as IFilterRadioOperator :
                  savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear ? {} as IFilterRadioOperator :
                    savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month ? {} as IFilterRadioOperator :
                      savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Measure ? {} as IFilterRadioOperator :
                        savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Number ? {} as IFilterRadioOperator :
                          {
                            field: {
                              op: DashboardConstants.ReportObjectOperators.ThisYear,
                              title: DashboardConstants.ReportObjectOperators[DashboardConstants.ReportObjectOperators.ThisYear],
                              FilterConditionObjectId: filter(this._filterConditionMetadata, (filterCdn, index) => {
                                return filterCdn.Condition == DashboardConstants.ReportObjectOperators.ThisYear &&
                                  filterCdn.FilterTypeObjectId == savedViewFilter.reportObject.filterTypeObjectId
                              })[0].FilterConditionObjectId
                            }
                          } as IFilterRadioOperator
      case DashboardConstants.FilterProperty.FilterConditionValue:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year ||
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter ||
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month) &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot) ?
          listFilterCdnValue :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_QuarterTillToday ?
            listFilterCdnValue :
            savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_MonthTillToday ?
              listFilterCdnValue :
              filterConditionValue //should be the value
      case DashboardConstants.FilterProperty.FilterConditionRangeValue:
        return savedViewFilter.filterBy == DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Between ||
            savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.NotBetween) ?
          {
            from: filterConditionRangeValue.from,
            to: filterConditionRangeValue.to,
          } as IFilterConditionRangeValue : {
            from: _emptyString,
            to: _emptyString,
          } as IFilterConditionRangeValue;
      case DashboardConstants.FilterProperty.FromyearDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Between ||
            savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.NotBetween) ?
          {
            label: _emptyString,
            dataKey: _emptyString,
            displayKey: _emptyString,
            options: [],
            selectedRangeOptions: {
              from: {
                title: filterConditionRangeValue.from,
              }
            }
          } as IFromyearDropdown : {
            label: _emptyString,
            dataKey: _emptyString,
            displayKey: _emptyString,
            options: [],
            selectedRangeOptions: {
              from: {
                title: _emptyString
              }
            }
          } as IFromyearDropdown;
      case DashboardConstants.FilterProperty.ToyearDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Between ||
            savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.NotBetween) ? {
              selectedRangeOptions: {
                to: {
                  title: filterConditionRangeValue.to,
                }
              }
            } as IToYearDropdown : {
              selectedRangeOptions: {
                to: {
                  title: _emptyString
                }
              }
            } as IToYearDropdown;
      case DashboardConstants.FilterProperty.yearDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.Before
            || savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.After) ?
          {
            selectedOption: {
              title: filterConditionValue,
            }
          } as IYearDropdown : {
            selectedOption: {
              title: _emptyString
            }
          } as IYearDropdown
      case DashboardConstants.FilterProperty.BeginningOfTheYear:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection && (
            savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.From_YearTillToday) ?
          {
            selectedOption: {
              title: filterConditionValue,
            }
          } as IBeginningOfTheYear : {
            selectedOption: {
              title: _emptyString
            }
          } as IBeginningOfTheYear;
      case DashboardConstants.FilterProperty.RollingYearsModel:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Rolling_Years) ?
          {
            rollingYearValue: filterConditionValue,
          } as IRollingYearsModel : {
            rollingYearValue: _emptyString
          } as IRollingYearsModel;
      case DashboardConstants.FilterProperty.NextYearsModel:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Year &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Years) ?
          {
            nextYearValue: filterConditionValue,
          } as INextYearsModel : {
            nextYearValue: _emptyString
          } as INextYearsModel;
      case DashboardConstants.FilterProperty.FilterConditionText:
        if ([DashboardConstants.FilterType.Quarter,
        DashboardConstants.FilterType.QuarterYear,
        DashboardConstants.FilterType.MonthYear,
        DashboardConstants.FilterType.Month,
        DashboardConstants.FilterType.Measure].indexOf(savedViewFilter.filterCondition.filterType) != -1) {
          filterConditionText.value = savedViewFilter.FilterConditionText;
        }
        else if (savedViewFilter.filterCondition.filterType === DashboardConstants.FilterType.Number && savedViewFilter.filterCondition.condition != DashboardConstants.ReportObjectOperators.In &&
          savedViewFilter.filterCondition.condition != DashboardConstants.ReportObjectOperators.NotIn) {
          filterConditionText.value = savedViewFilter.FilterConditionText;
        }
        else if (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.In ||
          savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.NotIn) {
          filterConditionText.value = savedViewFilter.filterValue.join(';');
        }
        else if (savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.IsEmpty ||
          savedViewFilter.filterCondition.condition == DashboardConstants.ReportObjectOperators.IsNotEmpty) {
          filterConditionText.value = _emptyString;
        }
        else if (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot) {
          filterConditionText.value = savedViewFilter.filterValue.join(';');
        }
        else {
          filterConditionText.value = savedViewFilter.filterValue.join();
        }
        return filterConditionText as IFilterConditionText;
      case DashboardConstants.FilterProperty.DateModel:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date &&
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Before ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.After) ?
          {
            DateValue: new Date(filterConditionValue),
          } as IDateModel : {} as IDateModel
      case DashboardConstants.FilterProperty.FromDateModel:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date &&
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.NotBetween) ?
          {
            FromDateValue: new Date(filterConditionRangeValue.from),
          } as IFromDateModel : {} as IFromDateModel;
      case DashboardConstants.FilterProperty.ToDateModel:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date &&
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between ||
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.NotBetween) ?
          {
            ToDateValue: new Date(filterConditionRangeValue.to),
          } as IToDateModel : {} as IToDateModel;
      case DashboardConstants.FilterProperty.RollingDateModel:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date &&
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Rolling_Days) ?
          {
            rollingDateValue: filterConditionValue,
          } as IRollingDateModel : {} as IRollingDateModel;
      case DashboardConstants.FilterProperty.NextDateModel:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date &&
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Days) ?
          {
            nextDateValue: filterConditionValue,
          } as INextDateModel : {} as INextDateModel;
      case DashboardConstants.FilterProperty.DateRadioModel:
        return (savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Date &&
          savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_DateTillToday) ?
          {
            DateRadioValue: new Date(filterConditionValue),
          } as IDateRadioModel : {} as IDateRadioModel;
      case DashboardConstants.FilterProperty.QuarterYearModel:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter ? {
          field: {
            op: savedViewFilter.filterCondition.condition,
            title: _emptyString,
            FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
          }
        } as IFilterRadioOperator :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear ? {
            field: {
              op: savedViewFilter.filterCondition.condition,
              title: _emptyString,
              FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
            }
          } as IFilterRadioOperator :
            savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear ? {
              field: {
                op: savedViewFilter.filterCondition.condition,
                title: _emptyString,
                FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
              }
            } as IFilterRadioOperator :
              savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month ? {
                field: {
                  op: savedViewFilter.filterCondition.condition,
                  title: _emptyString,
                  FilterConditionObjectId: savedViewFilter.filterCondition.FilterConditionObjectId
                }
              } as IFilterRadioOperator :
                {} as IFilterRadioOperator
      case DashboardConstants.FilterProperty.NextQuarterYearsModel:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Quarters) ?
          {
            nextQuarterYearValue: filterConditionValue,
          } as INextQuarterYearsModel :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Quarters) ? {
              nextQuarterYearValue: filterConditionValue,
            } as INextQuarterYearsModel :
            savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Quarter &&
              savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
              (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Quarters) ?
              {
                nextQuarterYearValue: filterConditionValue,
              } as INextQuarterYearsModel :
              savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
                savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
                (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Months) ? {
                  nextQuarterYearValue: filterConditionValue,
                } as INextQuarterYearsModel :
                savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.Month &&
                  savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
                  (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Next_Months) ? {
                    nextQuarterYearValue: filterConditionValue,
                  } as INextQuarterYearsModel :
                  {
                    nextQuarterYearValue: _emptyString
                  } as INextQuarterYearsModel;
      case DashboardConstants.FilterProperty.RollingQuarterYearsModel:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Rolling_Quarters) ?
          {
            rollingQuarterYearValue: filterConditionValue,
          } as IRollingQuarterYearsModel :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Rolling_Months) ?
            {
              rollingQuarterYearValue: filterConditionValue,
            } as IRollingQuarterYearsModel :
            {
              rollingQuarterYearValue: _emptyString
            } as IRollingQuarterYearsModel;
      case DashboardConstants.FilterProperty.PreviousQuarterYearsModel:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Previous_Quarter) ?
          {
            previousQuarterYearValue: filterConditionValue,
          } as IPreviousQuarterYearsModel :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Previous_Month) ?
            {
              previousQuarterYearValue: filterConditionValue,
            } as IPreviousQuarterYearsModel :
            {
              previousQuarterYearValue: _emptyString,
            } as IPreviousQuarterYearsModel
      case DashboardConstants.FilterProperty.BeginningOfTheQuarterYear:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_QuarterTillToday) ?
          {
            selectedOption: {
              title: filterConditionValue.substr(0, 4),
            }
          } as IBeginningOfTheYear :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_MonthTillToday) ?
            {
              selectedOption: {
                title: listFilterCdnValue[1],
              }
            } as IBeginningOfTheYear : {
              selectedOption: {
                title: _emptyString
              }
            } as IBeginningOfTheYear;
      case DashboardConstants.FilterProperty.BeginningOfTheQuarter:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterBySelection &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.From_QuarterTillToday) ?
          {
            selectedOption: {
              title: listFilterCdnValue[0],
            }
          } as IBeginningOfTheYear : {
            selectedOption: {
              title: _emptyString
            }
          } as IBeginningOfTheYear;
      case DashboardConstants.FilterProperty.QuarteryearDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Before ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.After) ?
          {
            selectedOption: {
              title: filterConditionValue.substr(0, 4),
            }
          } as IYearDropdown :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot ||
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Before ||
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.After) ?
            {
              selectedOption: {
                title: filterConditionValue.substr(0, 4),
              }
            } as IYearDropdown :
            {
              selectedOption: {
                title: _emptyString,
              }
            } as IYearDropdown
      case DashboardConstants.FilterProperty.sourceQuarterDropDown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Before ||
            savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.After) ?
          {
            selectedOption: {
              title: filterConditionValue.substr(4),
            }
          } as IYearDropdown :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Is ||
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.IsNot ||
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Before ||
              savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.After) ?
            {
              selectedOption: {
                title: filterConditionValue.substr(4),
              }
            } as IYearDropdown :
            {
              selectedOption: {
                title: _emptyString,
              }
            } as IYearDropdown
      case DashboardConstants.FilterProperty.FromQuarteryearDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
          {
            selectedRangeOptions: {
              from: {
                title: filterConditionRangeValue.from.substr(0, 4),
              }
            }
          } as IFromyearDropdown :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
            {
              selectedRangeOptions: {
                from: {
                  title: filterConditionRangeValue.from.substr(0, 4),
                }
              }
            } as IFromyearDropdown :
            {
              selectedRangeOptions: {
                from: {
                  title: _emptyString
                }
              }
            } as IFromyearDropdown
      case DashboardConstants.FilterProperty.FromQuarterDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
          {
            selectedRangeOptions: {
              from: {
                title: filterConditionRangeValue.from.substr(4),
              }
            }
          } as IFromyearDropdown :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
            {
              selectedRangeOptions: {
                from: {
                  title: filterConditionRangeValue.from.substr(4),
                }
              }
            } as IFromyearDropdown :
            {
              selectedRangeOptions: {
                from: {
                  title: _emptyString
                }
              }
            } as IFromyearDropdown
      case DashboardConstants.FilterProperty.ToQuarteryearDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
          {
            selectedRangeOptions: {
              to: {
                title: filterConditionRangeValue.to.substr(0, 4),
              }
            }
          } as IToYearDropdown :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
            {
              selectedRangeOptions: {
                to: {
                  title: filterConditionRangeValue.to.substr(0, 4),
                }
              }
            } as IToYearDropdown :
            {
              selectedRangeOptions: {
                to: {
                  title: _emptyString
                }
              }
            } as IToYearDropdown
      case DashboardConstants.FilterProperty.ToQuarterDropdown:
        return savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.QuarterYear &&
          savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
          (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
          {
            selectedRangeOptions: {
              to: {
                title: filterConditionRangeValue.to.substr(4),
              }
            }
          } as IToYearDropdown :
          savedViewFilter.reportObject.filterType === DashboardConstants.FilterType.MonthYear &&
            savedViewFilter.filterBy === DashboardConstants.FilterBy.FilterByCondition &&
            (savedViewFilter.filterCondition.condition === DashboardConstants.ReportObjectOperators.Between) ?
            {
              selectedRangeOptions: {
                to: {
                  title: filterConditionRangeValue.to.substr(4),
                }
              }
            } as IToYearDropdown :
            {
              selectedRangeOptions: {
                to: {
                  title: _emptyString
                }
              }
            } as IToYearDropdown
    }
  }

  private static getDAXDateFormattedValue(_dateValue: string) {
    return _dateValue.slice(4, 6) + "/" + _dateValue.slice(6, 8) + "/" + _dateValue.slice(0, 4);
  }


  public static mapFilterConditions(_filterConditionOperator): IFilterConditionOperator {
    switch (_filterConditionOperator) {
      case 1:
        return { "title": "Contains", "op": 1 }
      case 2:
        return { "title": "Does not Contain", "op": 2 }
      case 3:
        return { "title": "Is", "op": 3 }
      case 4:
        return { "title": "Is not", "op": 4 }
      case 5:
        return { "title": "Begins With", "op": 5 }
      case 6:
        return { "title": "Ends With", "op": 6 }
      case 7:
        return { "title": "In", "op": 7 }
      case 8:
        return { "title": "Not In", "op": 8 }
      case 9:
        return { "title": "Is Null", "op": 7 }
      case 10:
        return { "title": "Is Not Null", "op": 8 }
      case 11:
        return { "title": "Is Empty", "op": 9 }
      case 12:
        return { "title": "Is Not Empty", "op": 10 }
      case 13:
        return { "title": "Greater than", "op": 1 }
      case 14:
        return { "title": "Less than", "op": 2 }
      case 15:
        return { "title": "Between", "op": 3 }
      case 16:
        return { "title": "Not Between", "op": 3 }
      case 17:
        return { "title": "Top N Records", "op": 4 }
      case 18:
        return { "title": "Lowest N Records", "op": 5 }
      case 19:
        return { "title": "Top N %", "op": 6 }
      case 20:
        return { "title": "Lowest N %", "op": 7 }
      case 21:
        return { "title": "Between", "op": 14 }
      case 22:
        return { "title": "Before", "op": 1 }
      case 23:
        return { "title": "After", "op": 2 }
      default:
        return { "title": "Contains", "op": 1 };
    }
  }

  public static GetChartMetricFormttedValue(chartMetricValue, toFixedValue?: number) {
    let setDecimalPoint = function (n) {
      switch (toFixedValue) {
        case DashboardConstants.SummaryCardFixedValue:
          return Math.abs(n).toFixed(toFixedValue);
        case DashboardConstants.SummaryCardIntegerValue:
          return Math.abs(n).toFixed(toFixedValue);
        default:
          return n;
      }
    }
    // Nine Zeroes for Billions
    let getSign = function (n) {
      if (n == 0) { return 0 } else { return n / Math.abs(n); }
    }
    return Math.abs(chartMetricValue) >= 1.0e+9

      ? setDecimalPoint(getSign(chartMetricValue) * Math.abs(chartMetricValue) / 1.0e+9) + " B"
      // Six Zeroes for Millions 
      : Math.abs(chartMetricValue) >= 1.0e+6

        ? setDecimalPoint(getSign(chartMetricValue) * Math.abs(chartMetricValue) / 1.0e+6) + " M"
        // Three Zeroes for Thousands
        : Math.abs(chartMetricValue) >= 1.0e+3

          ? setDecimalPoint(getSign(chartMetricValue) * Math.abs(chartMetricValue) / 1.0e+3) + " K"

          : setDecimalPoint(chartMetricValue);
  }

  public static FormatChartTooltip(tooltipValue, configurationValue) {
    const _numberFormatingService: any = new NumberFormatingService();
    return _numberFormatingService.FormatChartTooltip(tooltipValue, configurationValue);
  }

  private static getMapChartSeriesData(): any {
    const _masterMapChartRecords = [];
    const _valueList: any = this._graphConfig.reportDetails.lstReportObjectOnValue,
      _columnList: any = this._graphConfig.reportDetails.lstReportObjectOnColumn,
      _rowList: any = this._graphConfig.reportDetails.lstReportObjectOnRow;
    this._masterjson[this._masterjson.length - 1].rowObjects.map((value: any, key: number) => {
      if (_columnList.length == 0 && _valueList.length == 0) {
        _masterMapChartRecords.push({
          name: value,
          legend: [_rowList[this._rowIndex].reportObjectName]
        });
      }
      else if (_columnList.length == 0 && _rowList.length != 0 && _valueList.length != 0) {
        _masterMapChartRecords.push({
          name: value,
          values: [this._masterjson[key][_valueList[0].reportObjectName]],
          legend: [_valueList[0].reportObjectName]
        });
      }
      else if (_columnList.length != 0 && _rowList.length != 0 && _valueList.length != 0) {
        var findAll = filter(this._masterjson, { [_rowList[this._rowIndex].reportObjectName]: value });
        _masterMapChartRecords.push({
          name: value,
          values: [],
          legend: []
        });
        if (findAll) {
          findAll.forEach(function (_searchValue1, _searchKey1) {
            var metricValue = _searchValue1[_valueList[0].reportObjectName];
            var columnValue = _searchValue1[_columnList[0].reportObjectName];

            _masterMapChartRecords[_masterMapChartRecords.length - 1].values.push(metricValue);
            _masterMapChartRecords[_masterMapChartRecords.length - 1].legend.push(columnValue);
          });
        }
      }
    });
    return _masterMapChartRecords;
  }

  public static getDataLabelConfig(_dataLabelConfig: any) {
    switch (_dataLabelConfig) {
      case DashboardConstants.DataLabelConfig.EnableDataLabel:
        return this._graphConfig.reportDetails.reportProperties['showDataLabels'] || false;
      case DashboardConstants.DataLabelConfig.EnableFontSize:
        return this._graphConfig.reportDetails.reportProperties['selectedFontSize'] || 11;
    }
  }


  public static CreateMultiAxisChartTooltip(graphConfig: any, metricObjects: any) {
    let currentObj: any = this.GetChartReportTooltipFormatting(metricObjects);
    return this.GetDateFormattingTooltip(currentObj, graphConfig);
  }

  public static GetDateFormattingTooltip(currentObj: any, graphConfig: any) {
    let columnList = graphConfig.reportDetails.lstReportObjectOnColumn;
    let rowList = graphConfig.reportDetails.lstReportObjectOnRow;
    let valueList = graphConfig.reportDetails.lstReportObjectOnValue;
    let strTooltip: any;
    let metricName: any;
    return {
      formatter: function () { //Modifed By: Sumit Kumar, Modified Date: 06/17/2020, Reason: Tooltip is not working on cross suite report. CLI-172863.        

        if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart)
          metricName = currentObj.currentObjReportDetails[this.series.userOptions.yAxis].reportObjectName;

        else if ((columnList.length == 0 || rowList.length == 0) && valueList.length > 0)
          metricName = currentObj.currentObjReportDetails[this.series.index].reportObjectName;

        else if (columnList.length > 0)
          metricName = currentObj.currentObjReportDetails[0].reportObjectName;

        strTooltip = columnList.length > 0 ? (valueList.length > 1 ? rowList[0].reportObjectName : columnList[0].displayName) + '<br/>' + this.x + '<br/>' + this.series.name + ': ' + AnalyticsUtilsService.formatChartDateTooltip(columnList, this.y, metricName, currentObj)
          : this.x + '<br/>' + AnalyticsUtilsService.formatChartDateTooltip(columnList, this.y, this.series.name, currentObj);

        if (graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart) {
          strTooltip = columnList.length > 0 ? strTooltip : rowList[0].reportObjectName + '<br/>' + strTooltip;
        }
        return strTooltip;
      }

    }
  }
  public static formatChartDateTooltip(columnList: any, y: any, SeriesName: any, currentObj: any): String {
    let tooltipstr: String = "";
    let valueList = this._graphConfig.reportDetails.lstReportObjectOnValue;
    let defaultFormat: any;
    let userDefinedFormat;
    let metricObj: any;
    let percentSymbol = "";

    if (columnList.length > 0 && valueList.length > 1)
      metricObj = currentObj.currentObjReportDetails.find(x => x.displayName == SeriesName);

    else
      metricObj = currentObj.currentObjReportDetails[0];

    defaultFormat = AnalyticsCommonConstants.FormatType[metricObj.formatKey] == null ? "" : AnalyticsCommonConstants.FormatType[metricObj.formatKey];
    userDefinedFormat = currentObj.configFormat.find(x => x.reportObjectName == SeriesName).format;
    if (userDefinedFormat && userDefinedFormat != '')
      defaultFormat = '';

    if (defaultFormat == AnalyticsCommonConstants.FormatType.PERCENT) {
      defaultFormat = "";
      percentSymbol = AnalyticsCommonConstants.FormatType.PERCENT
    }

    //Modifed By: Sumit Kumar, Modified Date: 06/17/2020, Reason: Tooltip is not working on cross suite report. CLI-172863.    
    tooltipstr = (columnList.length > 0 ? '<b>' + defaultFormat + AnalyticsUtilsService.FormatChartTooltip(y, userDefinedFormat) + percentSymbol + '</b>'
      : (currentObj.configFormat.find(x => x.reportObjectName == SeriesName).format != '' ? (SeriesName + ': <b>' + AnalyticsUtilsService.FormatChartTooltip(y, currentObj.configFormat.find(x => x.reportObjectName == SeriesName).format) + '</b>') : ("<b>" + (currentObj.formatKeyObj.find(x => x.reportObjectName == SeriesName).format + numberFormat(y, 0, '.', ',')) + '</b>')));

    return tooltipstr;
  }


  public static GetChartReportTooltipFormatting(metricObjects) {

    let currentObj: any = {
      formatKeyObj: [],
      configFormat: [],
      currentObjReportDetails: []
    };

    metricObjects.forEach((element) => {
      currentObj.currentObjReportDetails.push(find<IReportObjectInfo>(this._graphConfig.reportDetails.lstReportObjectOnValue, { reportObjectName: element }));
    });
    const _numberFormatingService = new NumberFormatingService();
    currentObj.currentObjReportDetails.forEach((element, index) => {
      currentObj.configFormat.push({ 'reportObjectName': element.reportObjectName, 'format': _numberFormatingService.GetWijmoConfigurationFormat(element.ConfigurationValue, element.filterType) });
      currentObj.formatKeyObj.push({
        'reportObjectName': element.reportObjectName, 'format': `<br/>${metricObjects[index]}:` + '<b> ' + (
          element.formatKey != ""
            && element.formatKey != null
            && element.formatKey != AnalyticsCommonConstants.CommonConstants.Percent ?
            AnalyticsCommonConstants.FormatType[element.formatKey] : ''
        )
      });

    });
    return currentObj;
  }

  public static formattingEnableFor(graphConfig: any): Boolean {
    return (
      // graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn ||
      // graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.StackedBarChart ||
      // graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.column ||
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart ||
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarLineCombinationChart ||
      // graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BarChart ||
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ClusteredStackedColumnChart ||
      graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.spline);



  }

  //#region colorpalet
  public static getSeriesColor(legendName: any, legendIndex = 0) {
    //let colorset =  ['#2196f3', '#f44336', '#ff9800', '#4caf50', '#9c27b0', '#3f51b5', '#00bcd4', '#e91e63', '#8bc34a', '#c62828', '#ef6c00', '#795548', '#9e9e9e', '#607d8b', '#1565c0', '#ad1457', '#4527a0', '#00838f', '#4e342e', '#37474f'];
    let legend: any;
    let reportColorDetails = [];
    let reportObjectId: any;

    reportObjectId = this.getLegendReportObjectId(legendIndex);

    //Now fetch the colors stored for the report
    if (this._graphConfig.reportDetails.ReportColorConfigurationDetails != undefined &&
      this._graphConfig.reportDetails.ReportColorConfigurationDetails != '')
      reportColorDetails = JSON.parse(this._graphConfig.reportDetails.ReportColorConfigurationDetails);

    const repoObj = find(reportColorDetails, { 'reportObjectId': reportObjectId });
    if (repoObj != undefined) {
      legend = repoObj.reportObjectColors.find(ele => ele.reportObjectId == reportObjectId && ele.legendName.toString().trim() == legendName.toString().trim());
      if (legend != undefined && legend.appliedColor != undefined && legend.appliedColor != "")
        return legend.appliedColor;
    }
    if (this._graphConfig.chartDefaultColors != undefined && this._graphConfig.chartDefaultColors.length > 0) {
      return this._graphConfig.chartDefaultColors[legendIndex];
    }
    return AnalyticsCommonConstants.MultiColorSet[legendIndex];
  }

  public static getLegendReportObjectId(legendIndex) {
    if ([AnalyticsCommonConstants.ReportViewType.pie, AnalyticsCommonConstants.ReportViewType.DonutChart].indexOf(this._graphConfig.reportDetails.reportViewType) != -1)
      return this._graphConfig.reportDetails.lstReportObjectOnRow[this._rowIndex].reportObjectId;

    else if (this._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ParetoChart && legendIndex == 0)
      return '0';

    else if (this._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.ParetoChart && legendIndex == 1)
      return this._graphConfig.reportDetails.lstReportObjectOnValue[0].reportObjectId

    else if ((this._graphConfig.reportDetails.lstReportObjectOnColumn.length > 0 &&
      this._graphConfig.reportDetails.lstReportObjectOnRow.length > 0) || this._graphConfig.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart)
      return this._graphConfig.reportDetails.lstReportObjectOnColumn[0].reportObjectId;

    else if ((this._graphConfig.reportDetails.lstReportObjectOnColumn.length == 0 ||
      this._graphConfig.reportDetails.lstReportObjectOnRow.length == 0) && legendIndex < this._graphConfig.reportDetails.lstReportObjectOnValue.length)
      return this._graphConfig.reportDetails.lstReportObjectOnValue[legendIndex].reportObjectId;
  }
  //#endregion

  public static validateReportConditions(reportViewType: AnalyticsCommonConstants.ReportViewType, rowCount: number, columnCount: number, valueCount: number) {
    let isNotValid = false;
    switch (reportViewType) {
      case AnalyticsCommonConstants.ReportViewType.Olap: {
        //Cross tab without measure
        isNotValid = (columnCount > 0 && valueCount == 0) || (valueCount == 0 && columnCount == 0 && rowCount == 0);
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.Flex: {
        isNotValid = rowCount == 0 && columnCount == 0 && valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.column: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.stColumn: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.pie: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.spline: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.treemap: {
        isNotValid = valueCount != 2;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.ParetoChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.SummaryCard: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.StackedBarChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.ClusteredStackedColumnChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.BarChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.DonutChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.GaugeChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.ColumnLineCombinationChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.BarLineCombinationChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.BubbleChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.MapChart: {
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.WaterFallChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.HistogramChart: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.HeatMap: {
        isNotValid = valueCount == 0;
        break;
      }
      case AnalyticsCommonConstants.ReportViewType.MultiAxisChart: {
        isNotValid = valueCount < 2;
        break;
      }
    }
    return !isNotValid;
  }
}
