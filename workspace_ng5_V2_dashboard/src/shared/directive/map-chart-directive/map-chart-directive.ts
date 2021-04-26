import {
    Directive, Input, ElementRef, Renderer2, OnInit,
    AfterViewInit, Inject, OnDestroy, EventEmitter, Output
} from '@angular/core';
import { AzureMapsApiLoaderService } from '@vsAzureMapsApiService';
import { NumberFormatingService } from '@vsNumberFormatingService';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants'
import { CommonUtilitiesService } from '@vsCommonUtils';
declare var atlas: any;
declare var azureMapsApiKey: any;

@Directive({
    selector: '[map-chart-widget]',
})
export class MapChartWidgetDirective implements OnInit, AfterViewInit, OnDestroy {

    /* 
     *  This report identifier directive let the user know the type ofReports
     * 
     */
    @Input() config: any;
    @Output() mapChartEvents: EventEmitter<any> = new EventEmitter<any>();
    private _azureMap: any;
    private _azureSearchService;
    private _azurePopup;
    private _azureDataSource;
    private _masterMapChartRecords;
    private _mapChartData = [];
    private _assetIndex = 0;
    private _mapZoom: number = 1;
    private _mapCenterView = {
        altitude: 0,
        altitudeReference: -1,
        latitude: 12.783860736946082,
        longitude: 3.655418404982025
    };
    private _chartOptions = {
        maxHeight: 300,
        barWidth: 5,
        pieChart: {
            minRadius: 5,
            maxRadius: 60,
        },
        colors: [],
        legend: [],
        strokeThickness: 0.5,
        strokeColor: '#666666'
    };
    private isMapChartDrillDownEnabled: boolean = false;
    constructor(
        private _element: ElementRef,
        private _renderer: Renderer2,
        private _azureMapsApiLoaderService: AzureMapsApiLoaderService,
        private _numberFormatingService: NumberFormatingService,
        private _commUtils: CommonUtilitiesService
    ) {

    }

    ngOnInit() {
        if (this._chartOptions.colors.length == 0) {
            this._chartOptions.colors = this.config.config.chartColors;
        }
        this.config.config.chartAPI = {};
        this.config.config.chartAPI.initializeAzureMaps = this.initializeAzureMaps.bind(this);
        this.config.config.chartAPI.resizeMap = this.resizeMap.bind(this);
        this.isMapChartDrillDownEnabled = this.config.reportDetails.reportProperties["isMapChartDrillDownEnabled"] || false;
        // this._mapZoom = this.config.reportDetails.reportProperties["mapZoom"] || 0;
        // const _mapCenterView = this.config.reportDetails.reportProperties["mapCenterView"];
        // if (this._commUtils.isNune(_mapCenterView))
        //     this._mapCenterView = _mapCenterView;

    }

    public resizeMap(delay: number) {
        if (this._azureMap) {
            setTimeout(async() => {
                this._azureMap.resize();
            }, delay);
        }
    }

    ngAfterViewInit() {
        const identifier = this._renderer.createElement('div');
        identifier.id = `map-chart-container-${this.config.cardId}`;
        this._renderer.appendChild(this._element.nativeElement, identifier);
        // Loading the bing maps
        this._azureMapsApiLoaderService.LoadMaps().then((_response: any) => {
            if (_response) {
                this.enableDrilldownOption();
                //Creating the Container for the bing map containers
                this.initializeAzureMaps();
            }
        });
    }

    ngOnDestroy() {

    }

    private enableDrilldownOption() {
        const thisRef = this;
        const cardId = this.config.cardId;
        if (this.config.reportDetails.lstReportObjectOnRow.length > 1) {
            const enableDrilldown = this._renderer.createElement('div');
            enableDrilldown.id = `show-enabled-drilldown-${cardId}`;
            enableDrilldown.innerHTML = `
               <div id='drilldown-option-${cardId}' style='text-align:right;padding-right:5px;'>    
                    <input id='show-drilldown-checkbox-${cardId}' type='checkbox' class='filled-in'></input>
                    <label for='Enable Drill down'>Enable Drill down</label>
               </div>
            `;
            this._renderer.appendChild(this._element.nativeElement, enableDrilldown);
            thisRef.setMapChartDrillCheckboxState(cardId);
            //Adding the checkbox click event
            document.getElementById(`drilldown-option-${cardId}`)
                .addEventListener('click', function () {
                    thisRef.isMapChartDrillDownEnabled = !thisRef.isMapChartDrillDownEnabled;
                    thisRef.setMapChartDrillCheckboxState(cardId);
                });
        }
    }

    private setMapChartDrillCheckboxState(cardId: any) {
        const showDrillDownOption = document.getElementById(`show-drilldown-checkbox-${cardId}`);
        if (this._commUtils.isNune(showDrillDownOption)) {
            if (this.isMapChartDrillDownEnabled) {
                showDrillDownOption.setAttribute('checked', 'checked');
            }
            else {

                showDrillDownOption.removeAttribute('checked');
            }
            this.config.reportDetails.reportProperties["isMapChartDrillDownEnabled"] = this.isMapChartDrillDownEnabled;
        }
    }

    //Preparing the map chart container for the bing maps.
    public initializeAzureMaps() {
        const _mapChartContainer = document.getElementById(`map-chart-container-${this.config.cardId}`);
        const thisRef = this;
        if (_mapChartContainer != null) {
            var serviceCallCount = 0;
            _mapChartContainer.style.zIndex = "2";
            _mapChartContainer.style.height = '100%';
            _mapChartContainer.style.backgroundColor = 'whitesmoke';
            var plottingLocations = [];
            if (!this._azureMap) {
                this._azureMap = new atlas.Map(`map-chart-container-${this.config.cardId}`, {
                    view: 'Auto',
                    zoom: thisRef._mapZoom,
                    center: [this._mapCenterView.longitude, this._mapCenterView.latitude],
                    authOptions: {
                        authType: 'subscriptionKey',
                        subscriptionKey: azureMapsApiKey
                    }
                });
            
                thisRef._azureMap.events.add('ready', function(event) {

                    // console.log("Map Ready");
                    thisRef._azureMap.imageSprite.createFromTemplate('simple-point', 'pin-round', 'blue', '#fff').then(() => {
                
                        thisRef._azureMap.events.add('zoomend', onMapZoomChanged);

                        thisRef._azureMap.controls.add(
                            [
                                new atlas.control.StyleControl({
                                    mapStyles: ['road', 'satellite', 'grayscale_light']
                                }),
                                new atlas.control.ZoomControl()
                            ], {
                                position: 'top-right'
                            });  
        
                        //Use MapControlCredential to share authentication between a map control and the service module.
                        var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(thisRef._azureMap));
        
                        thisRef._azurePopup = new atlas.Popup();
                        
                        thisRef._azureDataSource = new atlas.source.DataSource();
        
                        thisRef._azureMap.sources.add(thisRef._azureDataSource);
        
                        //Create an instance of the SearchURL client.
                        thisRef._azureSearchService = new atlas.service.SearchURL(pipeline);
        
                        mapChartSeriesDataPreparation();
                        prepareDataAndPlot();
        
                    });

                });

            } else {
                thisRef._azureDataSource.clear();
                thisRef._azurePopup.close();
                mapChartSeriesDataPreparation();
                prepareDataAndPlot();
            }
        }

        function mapChartSeriesDataPreparation() {
            thisRef._masterMapChartRecords = thisRef.config.config.series;
        }

        function onMapZoomChanged() {
            thisRef.config.reportDetails.reportProperties["mapZoom"] = thisRef._azureMap.getCamera().zoom;
            thisRef.config.reportDetails.reportProperties["mapCenterView"] = thisRef._azureMap.getCamera().center;
        }

        function prepareDataAndPlot() {
            //'Italy', 'Maharashtra', 'nepal', 'iraq', 'Africa', 'Australia', 'karachi', 'Hyderabad', 'Chile', 'North America', 'Russia', 'Hubei', 'South Africa'
            plottingLocations = [];
            thisRef._mapChartData = [];
            thisRef._chartOptions.legend = [];
            if (thisRef._masterMapChartRecords) {
                thisRef._masterMapChartRecords.map(function (value, index) {
                    if (thisRef._chartOptions.legend.length == 0 && value.legend) {
                        thisRef._chartOptions.legend = value.legend;
                    }
                    plottingLocations.push(value.name);
                    thisRef._mapChartData.push({
                        name: value.name,
                        mainName: value.name,
                        values: value.values,
                        legends: thisRef.config.config.series[index].legend
                    });
                });

                plottingLocations.forEach(function (location) {
                    thisRef._azureSearchService.searchAddress(atlas.service.Aborter.timeout(10000), location)
                        .then(response => {
                            if (response.results.length != 0) {
                                getSuccessBoundaryForCharts(response, location);    
                            } else {
                                getErrorBoundaryForCharts();
                            }
                        })
                });
            }
        }

        function getSuccessBoundaryForCharts(response, value) {
            serviceCallCount++;
            plottingCall(response, value).then((_response: any) => {
                if (_response) {
                    if (serviceCallCount == plottingLocations.length) {
                        //console.log('Success Resolved Request');
                        thisRef.plotDataOnAzureMaps();
                    }
                }
            });
        }

        function getErrorBoundaryForCharts() {
            serviceCallCount++;
            if (serviceCallCount == plottingLocations.length) {
                // console.log('Error Resolved Request');
                thisRef.plotDataOnAzureMaps();
            }
        }

        function plottingCall(response, value) {
            return new Promise((resolve, reject) => {
                if (response.results.length == 0) reject();
                var _locationInfo = response.results[0].position;

                thisRef._mapChartData.map((mapChartRecValue, key) => {
                    if (mapChartRecValue.name.toLowerCase() == value.toLowerCase()) {
                        thisRef._mapChartData[key]['loc'] = { latitude: _locationInfo.lat, longitude: _locationInfo.lon };
                        resolve(true);
                    }
                });
            });
        }
    }

    // Plotting data on Azure maps dynamically based on the JSON data.
    private async plotDataOnAzureMaps() {
        const thisRef = this;
        const reportDetails: any = thisRef.config.reportDetails;
        const _bingMapChartType: any = reportDetails.reportProperties;
        const _valueList: any = reportDetails.lstReportObjectOnValue,
            _columnList: any = reportDetails.lstReportObjectOnColumn,
            _rowList: any = reportDetails.lstReportObjectOnRow;

        // console.log("Loading Map");
        var i, maxValue = 0;
        //Loop through the data and calculate the max total value so that markers can be scaled relatively.
        if (_valueList.length != 0) {
            for (i = 0; i < thisRef._mapChartData.length; i++) {
                var val = thisRef._mapChartData[i].values.reduce(function (sum, value) {
                    return sum + value;
                });
                //While we are at it, lets cache the total value of each group for faster calculations later.
                thisRef._mapChartData[i].total = val;
                if (val > maxValue) {
                    maxValue = val;
                }
            }
        }

        //Loop through the mock data and create data points
        for (i = 0; i < thisRef._mapChartData.length; i++) {
            if (thisRef._mapChartData[i].loc) {
                if (_columnList.length == 0 && _valueList.length == 0) {
                    addSimplePointToDataSource(thisRef._mapChartData[i], maxValue);
                }
                else {
                    if (_bingMapChartType && _bingMapChartType != "null" && _bingMapChartType.bingMapChartType == "2") {
                        addColumnChartPointToDataSource(thisRef._mapChartData[i], i, maxValue);
                    } else {
                        addPieChartPointToDataSource(thisRef._mapChartData[i], i, maxValue);
                    }
                }
            }
        }

        
        var layer = new atlas.layer.SymbolLayer(thisRef._azureDataSource, null, {
            iconOptions: {
                image: ['get', 'image-reference']
            }
        });

        thisRef._azureMap.layers.add(layer);

        // Close Popup once mouse moves on the map
        thisRef._azureMap.events.add('mousemove', closePopup);
        // Display Popup once mouse moves on a symbol
        thisRef._azureMap.events.add('mousemove',layer, displayPopupOnMouseOver);
        thisRef._azureMap.events.add('touchstart',layer, displayPopupOnMouseOver);
        thisRef._azureMap.events.add('click', layer, displayInfoboxClick);
        thisRef._azureMap.events.add('dblclick', layer, displayInfoboxDoubleClick);

        this._azureMap.setCamera({
            zoom: thisRef._mapZoom,
            center: [thisRef._mapCenterView.longitude, thisRef._mapCenterView.latitude]
        });

        function getRandomArbitrary(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function addSimplePointToDataSource(data, maxValue) {
            var dataPoint = new atlas.data.Feature(new atlas.data.Point([data.loc.longitude, data.loc.latitude]), {
                'image-reference': 'simple-point',
                'metadata': data
            });

            thisRef._azureDataSource.add(dataPoint);    
        }

        function getCountOfNonNullIndices(data) {
            var __validEleCount = 0;
            data.values.forEach((_datValue: any, _datKey: any) => {
                if (thisRef._commUtils.isNune(_datValue)) {
                    __validEleCount++;
                }
            });
            return __validEleCount > 1 && data.values.length > 1;
        }

        function addPieChartPointToDataSource(data, id, maxValue) {
            // thisRef._chartOptions.maxRadius = 30;
            // thisRef._chartOptions.maxRadius = thisRef._chartOptions.maxRadius * data.values.length;
            var startAngle = 0, angle = 0;
            var radius = Math.round(Math.max(data.total / maxValue * thisRef._chartOptions.pieChart.maxRadius, thisRef._chartOptions.pieChart.minRadius));
            var diameter = 2 * (radius + thisRef._chartOptions.strokeThickness);
            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', diameter, 'px" height="', diameter, 'px">'];
            var cx = radius + thisRef._chartOptions.strokeThickness,
                cy = radius + thisRef._chartOptions.strokeThickness;

            if (_valueList.length != 0 && getCountOfNonNullIndices(data)) {
                for (var i = 0; i < data.values.length; i++) {
                    angle = (Math.PI * 2 * (data.values[i] / data.total));
                    svg.push(createArc(cx, cy, radius, startAngle, angle, thisRef._chartOptions.colors[i]));
                    startAngle += angle;
                }
            }
            else {
                for (var i = 0; i < data.values.length; i++) {
                    svg.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="' +
                        thisRef._chartOptions.colors[getRandomArbitrary(0, thisRef._chartOptions.colors.length - 1)] + '" />');
                }
            }
            svg.push('</svg>');

            thisRef._azureMap.imageSprite.add(`reference-${id}`, svg.join('')).then(function () {
                var dataPoint = new atlas.data.Feature(new atlas.data.Point([data.loc.longitude, data.loc.latitude]), {
                    'image-reference': `reference-${id}`,
                    'metadata': data
                });
                
                thisRef._azureDataSource.add(dataPoint);    
            });
        }

        function addColumnChartPointToDataSource(data, id, maxValue) {
            // thisRef._chartOptions.maxHeight = 250;
            // thisRef._chartOptions.maxHeight = thisRef._chartOptions.maxHeight * thisRef._masterMapChartRecords.length;
            var width = data.values.length * thisRef._chartOptions.barWidth;
            var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', width, 'px" height="', thisRef._chartOptions.maxHeight, 'px">'];
            var x, y, h;
            for (var i = 0; i < data.values.length; i++) {
                //Calculate the height of the bar in pixels.
                h = Math.min(data.values[i] / maxValue * thisRef._chartOptions.maxHeight, thisRef._chartOptions.maxHeight);
                //Calculate the x offset of the bar.
                x = i * thisRef._chartOptions.barWidth;
                //Calculate the y offset of the bar such that the bottom aligns correctly.
                y = thisRef._chartOptions.maxHeight - h;
                if (data.values.length == 1) {
                    i = getRandomArbitrary(0, thisRef._chartOptions.colors.length - 1);
                }
                svg.push('<rect x="', x, 'px" y="', y, 'px" width="', thisRef._chartOptions.barWidth, 'px" height="', h, 'px" fill="', thisRef._chartOptions.colors[i], '"/>');
            }
            svg.push('</svg>');

            thisRef._azureMap.imageSprite.add(`reference-${id}`, svg.join('')).then(function () {
                var dataPoint = new atlas.data.Feature(new atlas.data.Point([data.loc.longitude, data.loc.latitude]), {
                    'image-reference': `reference-${id}`,
                    'metadata': data
                });
                
                thisRef._azureDataSource.add(dataPoint);    
            });
        }

        function createArc(cx, cy, r, startAngle, angle, fillColor) {
            var x1 = cx + r * Math.sin(startAngle);
            var y1 = cy - r * Math.cos(startAngle);
            var x2 = cx + r * Math.sin(startAngle + angle);
            var y2 = cy - r * Math.cos(startAngle + angle);
            //Flag for when arcs are larger than 180 degrees in radians.
            var big = 0;
            if (angle > Math.PI) {
                big = 1;
            }
            var path = ['<path d="M ', cx, ' ', cy, ' L ', x1, ' ', y1, ' A ', r, ',', r, ' 0 ', big, ' 1 ', x2, ' ', y2,
                ' Z" style="fill:', fillColor,
                ';stroke:', thisRef._chartOptions.strokeColor,
                ';stroke-width:', thisRef._chartOptions.strokeThickness,
                'px;"'];
            path.push('/>');
            return path.join('');
        }

        function closePopup(e) {
            thisRef._azurePopup.close();
        }

        function displayPopupOnMouseOver(e) {
            if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Point') {
                var data = e.shapes[0].getProperties().metadata;
                var description = [''];
                var minHieght = data.values ? data.values.length >= 2 ? '100px' : '65px' : '45px';
                var infoboxTemplate = '<div id="infoboxText" style="background-color:White; border-style:solid; border-width:medium; border-color:DarkOrange; min-height:' + minHieght + '; width: 240px; border-width:2px;border-radius:5px;">' +
                    '<b id="infoboxTitle" style="position: absolute; top: 10px; left: 10px; width: 220px;">{title}</b>' +
                    '<a id="infoboxDescription" style="height: calc(100% - 40px); overflow: auto; position: absolute; top: 30px; left: 16px; width: 220px;">{description}</a></div>';

                if (data.values) {
                    var currencyBeforeAmount = thisRef._numberFormatingService.GetCurrencySymbolLocation();
                    var configFormat = thisRef._numberFormatingService.GetWijmoConfigurationFormat(
                        _valueList[0].ConfigurationValue, _valueList[0].filterType);
                    for (var i = 0; i < data.values.length; i++) {
                        var formatedValue = (
                            _valueList[0].formatKey != "" &&
                                _valueList[0].formatKey != AnalyticsCommonConstants.CommonConstants.Percent &&
                                currencyBeforeAmount && configFormat == "" ?
                                AnalyticsCommonConstants.FormatType[_valueList[0].formatKey] : ''
                        )
                            + ''
                            + thisRef._numberFormatingService.FormatChartTooltip(data.values[i], configFormat)
                            + (
                                _valueList[0].formatKey != "" &&
                                    configFormat == "" &&
                                    (
                                        _valueList[0].formatKey == AnalyticsCommonConstants.CommonConstants.Percent || !currencyBeforeAmount) ? AnalyticsCommonConstants.FormatType[_valueList[0].formatKey] : ''
                            );
                        description.push('<span style="font-weight:bold;font-size: 8pt;color:', thisRef._chartOptions.colors[i], '">', data.legends[i], '</span><span style="font-size: 8pt;font-weight:bold;color:black;"> : ', formatedValue, '<span></br>');
                    }
                }
                // description.push('</table>');
                if (thisRef._azurePopup.getOptions().position !== e.shapes[0].getCoordinates()) {
                    thisRef._azurePopup.setOptions({
                        position: e.shapes[0].getCoordinates(),
                        content: infoboxTemplate.replace('{title}', data.name).replace('{description}', description.join('')),
                        closeButton: true,
                        showPointer: false,
                        pixelOffset: [0, -20]
                    });
                    thisRef._azurePopup.open(thisRef._azureMap);    
                }
            }
        }

        function displayInfoboxDoubleClick(e) {
            if (e.type == "dblclick" && thisRef.isMapChartDrillDownEnabled) {
                if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Point') {
                    let obj = {
                        eventType: AnalyticsCommonConstants.EventType.DoubleClick,
                        event: { event: e.shapes[0].getProperties().metadata }
                    };
                    thisRef.mapChartEvents.emit(obj);    
                }
            }
            else {
                thisRef._commUtils.getToastMessage('Drill will not faciliate becuase drilldown mode is enabled on chart.\nPlease uncheck the checkbox if you would like to do drive on widget');
            }
        }

        function displayInfoboxClick(e) {
            if (e.type == "click" && !thisRef.isMapChartDrillDownEnabled) {
                if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Point') {
                    let obj = {
                        eventType: AnalyticsCommonConstants.EventType.Click,
                        event: e.shapes[0].getProperties().metadata, // e.originalEvent?
                    };
                    thisRef.mapChartEvents.emit(obj);    
                }
            }
            else {
                thisRef._commUtils.getToastMessage('Drive will not faciliate becuase drilldown mode is enabled on chart.\nPlease uncheck the checkbox if you would like to do drive on widget');
            }

        }


    }
}

