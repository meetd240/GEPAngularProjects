import {
  Component, OnInit, ViewChild, ElementRef, Input, ViewContainerRef, TemplateRef,
  Renderer2, ViewEncapsulation, OnDestroy, Injector, ApplicationRef, ComponentFactoryResolver, Inject, NgZone, EmbeddedViewRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { InjectableComponent } from 'smart-cards-shared';
import { IManifestCollection } from 'smart-module-loader';
import { Subject, Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { SavedFilter } from '@vsMetaDataModels/saved-filter.model';
import { SortReportObject } from '@vsDataModels/sort-report-object.model';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { AnalyticsCommonDataService } from '@vsAnalyticsCommonService/analytics-common-data.service';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { ICardDashboardSubscription, IDashoardCardAction, dashboardCardConfigNode, IBreadCrumb, CardConfigNode, IDriveAction } from '@vsDashboardInterface';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { DashboardConstants } from '@vsDashboardConstants';
import { DashboardCommService } from '@vsDashboardCommService';
import { ReportSortingDetails } from '@vsMetaDataModels/report-sorting-details.model'
import { debounce, find, findIndex, some, union, each, concat, sum, filter, intersection, indexOf, get, countBy } from 'lodash';
import { ReportObject } from '@vsMetaDataModels/report-object.model';
import { IReportingObjectMultiDataSource, IWijmoFlexGridColumns, IReportObjectInfo } from 'interfaces/common-interface/app-common-interface';
import { OlapGridDirectiveService } from '@vsOlapGridDirectiveService';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { ConditionalFormatingService } from '@vsConditionalFormatingService';


import { numberFormat } from "highcharts";
import { SelectionMode, AutoSizeMode } from 'wijmo/wijmo.grid';
import { ShowTotals } from 'wijmo/wijmo.olap';
// import { LazyComponentConfiguration, visionModulesManifest } from '../../../../modules-manifest';
import { ViewAppliedFilterPopupComponent } from '../../../app/view-applied-filter-popup/view-applied-filter-popup.component';
import { NumberFormatingService } from "@vsNumberFormatingService";
import { DataType } from 'wijmo/wijmo';
import { SliderWidgetComponent } from '../../../app/slider-widget/slider-widget.component';
import { LoaderService } from '@vsLoaderService';
import { DashboardDriveService } from '@vsDashboardDriveService';
// import * as wjcCore from 'wijmo/wijmo';
import { CellType } from 'wijmo/wijmo.grid';

@Component({
  selector: '[dashboard-card]',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  entryComponents: [
    ViewAppliedFilterPopupComponent
  ]
})

export class DashboardCardComponent implements OnInit, OnDestroy, InjectableComponent<dashboardCardConfigNode, IManifestCollection> {

  //#region <======  Dashbaord Card Component Variable Decaltations ========>
  // static componentId = LazyComponentConfiguration.DashboardCard.componentName;
  uiConfig: any = {};
  isFullscreen = false;
  indexInEditMode: number = null;
  previosIndex: any;

  selectedIndex: any;
  prevIndexForSort: number;
  sortTooltipConfig: any;
  initDone: boolean = false;
  clicks: number = 0;
  drillUp: boolean;
  drillDown: boolean;
  breadCrumbList: Array<IBreadCrumb> = [];
  breadCrumbUIConfig: any = { activeBreadCrumbList: [], slicedBreadcrumbList: [] };
  actionID: any;
  cardLoaderConfig: any;
  sub: ICardDashboardSubscription = {} as ICardDashboardSubscription;
  manageSubscription$: Subscription = new Subscription();
  staleWidgetConfig: any = undefined;
  sliderLoader: boolean = true;
  sliderLoaderConfig: any;
  public oppfinderOlapService$ = new Subject<any>();
  viewAppliedFilterPopupConfig: any;
  flexDriveEvent: any = undefined;
  flexGridEvent: any;
  OppSpendSRS: any;
  olapGridEvent: any;
  OppStatusConfig: any;
  isOppfinder: boolean = false;
  selectedOppStatus: any;
  cardPagination = {
    showRowCountIndicator: false,
    showPagination: true,
    currentPage: 0,
    startPage: 1,
    endPage: 0,
    isNext: true,
    isPrev: false,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
    pageData: []
  }
  constants = DashboardConstants;
  //For OLAP drive uncomment when doing DRIVE ON OLAP
  olapDrivePreviousClick = {
    row: undefined,
    col: undefined,
    filterValue: '',
    cellType: undefined,
    filterValuOnRow: [],
    filterValueOnColumn: []
  }


  //#endregion

  //#region <======  Dashboard Card Component Slider Chunk Configuration ===>
  // sliderManifest: IManifestCollection = {
  //   sliderWidget: visionModulesManifest.sliderWidget
  // };
  //#endregion

  //#region <======  Dashboard Card Component Smart Element Configuration ==>
  smartTextFieldConfig: any = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartTextFieldConfig);
  CardTitleConfig: any = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardTitleConfig);
  onlyValueMeasureFilterApplied: boolean = false;
  // previousTooltipConfig: any = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartPreviousTooltipConfig);
  // nextTooltipConfig: any = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartNextTooltipConfig);
  //#endregion

  //#region <====== Dashboard Card  Component Decorator Declarations ======>
  @Input() config: CardConfigNode;
  @Input() manifest: IManifestCollection;
  @ViewChild('widgetContainer', { read: ViewContainerRef }) widgetContainerRef: ViewContainerRef;
  @ViewChild('dashboardCardFooter', { read: ViewContainerRef }) dashboardCardFooterRef: ViewContainerRef;
  @ViewChild('dashboardCardHeader', { read: ViewContainerRef }) dashboardCardHeaderRef: ViewContainerRef;
  @ViewChild('chartTemplate') chartTemplateRef: TemplateRef<any>;
  @ViewChild('widgetMessage') widgetMessageRef: TemplateRef<any>;
  @ViewChild('sliderContainer', { read: ViewContainerRef }) sliderContainerRef: ViewContainerRef;
  @ViewChild('flexGridTemplate') flexGridTemplateRef: TemplateRef<any>;
  @ViewChild('olapGridTemplate') olapGridTemplateRef: TemplateRef<any>;
  @ViewChild('mapChartTemplate') mapChartTemplate: TemplateRef<any>;
  @ViewChild('cardTypeContainer', { read: ViewContainerRef }) cardTypeContainerRef: ViewContainerRef;
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainerRef: ViewContainerRef;
  @ViewChild('widgetCardTemplate') widgetCardTemplateRef: TemplateRef<any>;
  @ViewChild('outletTemplate') outletTemplateRef: TemplateRef<any>;
  @ViewChild('autoSuggestContainerRef', { read: ViewContainerRef }) autoSuggestContainerRef: ViewContainerRef;
  @ViewChild('autoSuggestTemplateRef') autoSuggestTemplateRef: TemplateRef<any>;
  // @ViewChild('gaugeChartTemplate') gaugeChartTemplateRef: TemplateRef<any>;


  //@ViewChild('summaryMessage') summaryMessageRef: TemplateRef<any>;

  tmpdashboardCardFooterRef: EmbeddedViewRef<any>;
  tmpdashboardCardHeaderRef: EmbeddedViewRef<any>;
  //#endregion

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    private _commUtil: CommonUtilitiesService,
    private _analyticsUtilsService: AnalyticsUtilsService,
    public _dashboardCommService: DashboardCommService,
    private _conFormatingService: ConditionalFormatingService,
    private _comFactResolver: ComponentFactoryResolver,
    @Inject(OlapGridDirectiveService)
    private _olapGridDireService: OlapGridDirectiveService,
    private _numberFormating: NumberFormatingService,
    private _commonUrl: CommonUrlsConstants,
    private _loaderService: LoaderService,
    private _cdRef: ChangeDetectorRef,
    private _dashboardDriveService: DashboardDriveService,

  ) {
  }

  get appliedFilter(): Array<IReportingObjectMultiDataSource> {
    return this._dashboardCommService.appliedFilters;
  }

  ngOnInit() {
    let thisRef = this;
    this.cardLoaderConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardLoaderConfig);
    this.sliderLoaderConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardLoaderConfig);
    //this.setBtnConfig();
    // this.setTooltipConfig();
    this.config.reportDetails.preserveSortList = Object.assign([], this.config.reportDetails.lstReportSortingDetails);
    this.config.reportDetails.preserveFilterList = Object.assign([], this.config.reportDetails.lstFilterReportObject);
    //always apply the 0 level sort and save it in sort variable
    this.registerLoaderForDashboardCard();
    if (
      this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.Flex &&
      this.config.reportDetails.lstReportSortingDetails[0]) {
      this.config.sort.appliedSort[0] = Object.assign({}, this.config.reportDetails.lstReportSortingDetails[0]);
    }
    if (
      this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart ||
      this.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart || this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
      this.applySavedDrill();
      this.updateSortMenu(Object.assign({}, this.config.reportDetails)); // added in ngOnInit to update the appliedSort variable to the applied sort at report level(only for the first time).
    }
    //Check if report is valid before generate Report Call
    if (!AnalyticsUtilsService.validateReportConditions(this.config.reportDetails.reportViewType,
      this.config.reportDetails.lstReportObjectOnRow.length,
      this.config.reportDetails.lstReportObjectOnColumn.length,
      this.config.reportDetails.lstReportObjectOnValue.length)) {
      this._loaderService.showCardLoader(this.config.cardId);
      this.setDashboardCardMessage(DashboardConstants.UIMessageConstants.STRING_VISUALIZATION_COULD_NOT_BE_LOADED);
      setTimeout(() => {
        this._loaderService.hideCardLoader(this.config.cardId);
      }, 50);

    } else {
      if ([DashboardConstants.ReportViewType.Olap,
      DashboardConstants.ReportViewType.Flex,
      DashboardConstants.ReportViewType.SummaryCard].indexOf(this.config.reportDetails.reportViewType) != -1) {
        let isMeasureFilterApplied = this.isMeasureFilterApplied();
        if (this._commUtil.isNune(isMeasureFilterApplied.true) && isMeasureFilterApplied.true > 0) {
          if (
            this.enableOnlyMeasureFilteringConditions()
          ) {
            this.onlyValueMeasureFilterApplied = false;
            this.initializeWidgetOnInit();
          }
          else {
            this.onlyValueMeasureFilterApplied = true;
            this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.SummaryCard ?
              this.setDashboardCardMessage(DashboardConstants.UIMessageConstants.STRING_MEASURE_FILTER_NOT_ALLOWED) :
              this.setSummaryCardMessage(false, true);
            this.hideCardLoader();
          }
        }
        else {
          this.initializeWidgetOnInit();
        }
      }
      else {
        this.initializeWidgetOnInit();
      }
    }
    /**
     * 	This is the base method initialization for the Dashboard Card Events initalization.
     *  Request you to think 1M time before changing it becuase it's pain to debug Observables and Subscription.
     */
    this.manageSubscription$.add(
      this.config.dbGridSubject.subscribe(event => {
        switch (event.actionId) {
          case DashboardConstants.EventType.RemoveDrive:
          case DashboardConstants.FilterIdentifierType.DriveFilter: {
            // if (event.mappingMissing) {
            //   this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
            //   this.removeBorderBlue();
            //   this.olapDrivePreviousClick.row = undefined;
            //   this.olapDrivePreviousClick.col = undefined;
            //   this.olapDrivePreviousClick.cellType = undefined;
            // }
            if (this.config.cardId === event.cardId) {
              if ([DashboardConstants.ReportViewType.Olap,
              DashboardConstants.ReportViewType.Flex,
              DashboardConstants.ReportViewType.SummaryCard].indexOf(this.config.reportDetails.reportViewType) != -1) {
                let isMeasureFilterApplied = this.isMeasureFilterApplied();
                if (this._commUtil.isNune(isMeasureFilterApplied.true) && isMeasureFilterApplied.true > 0) {
                  if (
                    this.enableOnlyMeasureFilteringConditions()
                  ) {
                    this.onlyValueMeasureFilterApplied = false;
                    this.onDrive(event);
                  }
                  else {
                    this.onlyValueMeasureFilterApplied = true;
                    if (this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.SummaryCard) {
                      this.setDashboardCardMessage(DashboardConstants.UIMessageConstants.STRING_MEASURE_FILTER_NOT_ALLOWED);
                    }
                    else {
                      this.setSummaryCardMessage(false, true);
                    }
                    this._loaderService.hideCardLoader(this.config.cardId);
                  }
                }
                else {
                  this.onDrive(event);
                }
              }
              else {
                this.onDrive(event);
              }

              // this.onDrive(event);
            }
            break;
          }
          case DashboardConstants.WidgetFunction.APPLY_GLOBAL_FILTER: {
            this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], this.config);
            this.removeBorderBlue();
            this.getSlider(this.config.reportDetails);
            if ([DashboardConstants.ReportViewType.Olap,
            DashboardConstants.ReportViewType.Flex,
            DashboardConstants.ReportViewType.SummaryCard].indexOf(this.config.reportDetails.reportViewType) != -1) {
              let isMeasureFilterApplied = this.isMeasureFilterApplied();
              if (this._commUtil.isNune(isMeasureFilterApplied.true) && isMeasureFilterApplied.true > 0) {
                if (
                  this.enableOnlyMeasureFilteringConditions()
                ) {
                  this.onlyValueMeasureFilterApplied = false;
                  this.initializeWidget(Object.assign({}, this.config.reportDetails));
                }
                else {
                  this.onlyValueMeasureFilterApplied = true;
                  if (this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.SummaryCard) {
                    this.setDashboardCardMessage(DashboardConstants.UIMessageConstants.STRING_MEASURE_FILTER_NOT_ALLOWED);
                  }
                  else {
                    this.setSummaryCardMessage(false, true);
                  }
                  this._loaderService.hideCardLoader(this.config.cardId);
                }
              }
              else {
                this.initializeWidget(Object.assign({}, this.config.reportDetails));
              }
            }
            else {
              this.initializeWidget(Object.assign({}, this.config.reportDetails));
            }
            break;
          }

          case DashboardConstants.EventType.ReflowChart: {
            this.reflowChartOnFilterPanelExpand();
          }
            break;
          default: {
            if (this.config.cardId === event.cardId) {
              this.gridEvents(event);
            }
            break;
          }
        }
      })
    );
    this.cardPagination.showRowCountIndicator =
      (
        this._commUtil.getWidgetType(this.config.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.Flex ||
        this._commUtil.getWidgetType(this.config.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.Olap
      );
    if (!this._dashboardCommService.oppFinderState.oppFinderFlag) { this.olapEvents() }
    this.config.isLinkedToDashboard = this._commUtil.isNune(this.config.linkViewId) ? (this._commUtil.isEmptyGuid(this.config.linkViewId) ? false : true) : false;
    // this.config.title = this.config.isLinkedToDashboard ? this.config.title + "\n Linked to dashboard-" : this.config.title;
    setTimeout(() => {
      this.config.isAccessibleReport ? this.cardLoaderConfig.api.showLoader(!this.onlyValueMeasureFilterApplied) : this.cardLoaderConfig.api.showLoader(false);
      this.config.isAccessibleReport ? this.sliderLoaderConfig.api.showLoader(!this.onlyValueMeasureFilterApplied) : this.sliderLoaderConfig.api.showLoader(false);
    }, 50);

    this.loadDashboardCardFooter();
    this.config.changeDetectionMutation.setDashboardCardState = this.setState.bind(this);
  }
  public enableOnlyMeasureFilteringConditions(): boolean {
    return this.config.reportDetails.lstReportObjectOnRow.length > 0 ||
      this.config.reportDetails.lstReportObjectOnColumn.length > 0 ||
      this._dashboardCommService.oppFinderState.oppFinderFlag ||
      (this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag && this.config.reportDetails.EnableGlobalSliderFiltering);

  }
  public loadDashboardCardFooter() {
    if (this.tmpdashboardCardFooterRef == undefined && this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.SummaryCard) {
      if (this.dashboardCardFooterRef) {
        this.dashboardCardFooterRef.detach();
        this.dashboardCardFooterRef.clear();
      }
      this.tmpdashboardCardFooterRef = this.dashboardCardFooterRef.createEmbeddedView(this.outletTemplateRef, {
        manifestPath: 'dashboard-card-footer/dashboard-card-footer',
        config: {
          config: {
            api: {
              previousClick: () => { this.previousClick(); },
              nextClick: () => { this.nextClick(); },
              onDrillUp: () => { this.onDrillUp() },
              onBreadcrumbSelect: (_slicedBreadCrumbList: any) => { this.onBreadcrumbSelect(_slicedBreadCrumbList); }
            },
            breadCrumbList: this.breadCrumbList,
            cardPagination: this.cardPagination,
            config: this.config,
            breadCrumbUIConfig: this.breadCrumbUIConfig,
            isFullscreen: this.isFullscreen,
            graphTitle: '',
            component: 'dashboard-card-footer'
          }
        }
      });
    }
  }


  public loadDashboardCardHeader() {
    if (this.dashboardCardHeaderRef) {
      this.dashboardCardHeaderRef.detach();
      this.dashboardCardHeaderRef.clear();
    }
    this.tmpdashboardCardHeaderRef = this.dashboardCardHeaderRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'dashboard-card-header/dashboard-card-header',
      config: {
        config: {
          api: {
            fullscreen: (event: any) => { this.fullscreen(event); },
            toggleAscDsc: (ind: any, sortOption: any) => { this.toggleAscDsc(ind, sortOption); },
            applySort: (event: any) => { this.applySort(event); },
            closeSort: () => { this.closeSort(); }
          },
          config: this.config,
          isFullscreen: this.isFullscreen
        }
      }
    });

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.sub.subscription)
      this.sub.subscription.unsubscribe();
    if (this.widgetContainerRef) { this.widgetContainerRef.clear(); }
    else if (this.cardTypeContainerRef) { this.cardTypeContainerRef.clear(); }
    else if (this.sliderContainerRef) { this.sliderContainerRef.clear(); }
    else if (this.popupContainerRef) { this.popupContainerRef.clear(); }
    else if (this.autoSuggestContainerRef) { this.autoSuggestContainerRef.clear(); }
    else if (this.dashboardCardHeaderRef) { this.dashboardCardHeaderRef.clear(); }
    else if (this.dashboardCardFooterRef) { this.dashboardCardFooterRef.clear(); }
    this.manageSubscription$.unsubscribe();
  }

  public initiate() {
    this.createWidgetContainerView();
    this.initializeSliderWidget();
  }

  public async createWidgetContainerView() {
    let thisRef = this;
    this.cardTypeContainerRef.clear();
    this.manageSubscription$.add(
      this.config.dataCallback(this.config.cardId).subscribe(async (cardData) => {
        if (!this._commUtil.isEmptyObject(cardData) ||
          thisRef.config.widgetDataType === DashboardConstants.WidgetDataType.Olap
        ) {
          if (
            this.config.cardType === DashboardConstants.WidgetDataType.WidgetCard ||
            this.config.cardType === DashboardConstants.WidgetDataType.GuageChart
          ) {
            this.cardTypeContainerRef.createEmbeddedView(this.widgetCardTemplateRef, { $implicit: this.config });
            setTimeout(async () => {
              // Creating the Chart Template from chartTemplateRef Object
              if (thisRef.config.widgetDataType === DashboardConstants.WidgetDataType.Chart)
                thisRef.widgetContainerRef.createEmbeddedView(thisRef.chartTemplateRef, { $implicit: cardData });

              // Creating the Chart Template from gridTemplateRef Object
              if (thisRef.config.widgetDataType === DashboardConstants.WidgetDataType.Flex &&
                !this._commUtil.isEmptyObject(thisRef.config.config)) {

                //Added by Akash ::  For new oppfinders flex grid is loaded inside this Oppfinder and fraud anomaly component    
                if (this._dashboardCommService.oppFinderState.oppFinderFlag ||
                  this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag) {
                  this.isOppfinder = true;
                  this.config.driveConfig.driveConfigDescription = '';
                  await this.loadOppFinderCard();
                }
                else thisRef.widgetContainerRef.createEmbeddedView(thisRef.flexGridTemplateRef, { $implicit: cardData });
              }

              // Creating the Olap Chart Widget Directive from olapGridTemplateRef
              if (thisRef.config.widgetDataType === DashboardConstants.WidgetDataType.Olap) {

                //Added by Akash ::  For Tail and spend olap grid is loaded inside this Oppfinder and fraud anomaly component    
                if (this._dashboardCommService.oppFinderState.oppFinderFlag) {
                  this.config.driveConfig.driveConfigDescription = '';
                  this.olapOppfinderEvents();
                  this.config.config.Subscriptions = this.oppfinderOlapService$;
                  await this.loadOppFinderCard();
                }
                else {
                  thisRef.widgetContainerRef.createEmbeddedView(thisRef.olapGridTemplateRef, {
                    $implicit: {
                      config: this.config,
                      cardData: cardData
                    }
                  });
                }
              }

              // Creating the Olap Chart Widget Directive from mapChartTemplateRef
              if (thisRef.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart) {
                thisRef.widgetContainerRef.createEmbeddedView(thisRef.mapChartTemplate, {
                  $implicit: this.config
                });
              }

              if (thisRef.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
                const _multiGaugeRef: EmbeddedViewRef<any> = this.widgetContainerRef.createEmbeddedView(thisRef.outletTemplateRef, {
                  manifestPath: 'multi-gauge-chart/multi-gauge-chart',
                  config: {
                    config: {
                      api: {
                        eventHandler: (event) => this.eventHandler(event)
                      },
                      config: this.config
                    }
                  }
                });
              }
              if (!this._dashboardCommService.oppFinderState.oppFinderFlag ||
                !this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag) thisRef.loadDashboardCardHeader();
              thisRef.setState();
            }, 100);
          } else if (this.config.cardType === DashboardConstants.WidgetDataType.SummaryCard &&
            !this._commUtil.isEmptyObject(thisRef.config.config)) {
            await this.loadSummaryCard();
          }
        }
      })
    );
  }

  public async loadSummaryCard() {
    this.cardTypeContainerRef.clear();
    this.cardTypeContainerRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'summary-card/summary-card',
      config: { config: this.config, }
    });
    this.setState();
  }

  public async loadOppFinderCard() {

    if (this.OppSpendSRS) { this.config.config.SpendUSD = this.OppSpendSRS }

    this.widgetContainerRef.clear();
    this.widgetContainerRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'oppfinder-card/oppfinder-card',
      config: { config: this.config, cardPagination: this.cardPagination }
    });
    this.positioning();
    this.setState();
  }


  public initializeSliderWidget() {
    this.sub.subject = new Subject<IDashoardCardAction>();
    this.sub.observer$ = this.sub.subject.asObservable();
    this.createSliderWidget(this.config);
    this.manageSubscription$.add(
      this.sub.observer$.subscribe(action => {
        this.sliderAction(action);
      })
    );
  }

  public async createSliderWidget(config) {
    this.sliderContainerRef.clear();
    const _comFactory: any = this._comFactResolver.resolveComponentFactory(SliderWidgetComponent);
    config.sliderRenderCallback = this.sliderRenderCallback.bind(this);
    config.sliderSubscriptions = this.sub.subject;
    const _sliderComponent: any = this.sliderContainerRef.createComponent(_comFactory);
    _sliderComponent.instance.config = config;

  }

  public async positioning() {
    if (!this.isFullscreen) {
      let height = "100%";
      let cardParent = this._commUtil.findAncestor(this._elementRef.nativeElement, 'grid-stack-item');
      this._renderer.setStyle(cardParent, 'z-index', '');
      this._renderer.setStyle(cardParent, 'width', '');
      this._renderer.setStyle(cardParent, 'height', '');
      this._renderer.setStyle(cardParent, 'top', '');
      this._renderer.setStyle(cardParent, 'left', '');
      this._renderer.setStyle(document.querySelector('body'), 'overflow', '');

      let $gridtackItem = cardParent.querySelector('[smart-gridstack-item]');
      this._renderer.setStyle($gridtackItem, 'height', height);


      let $placeholderWrapper = $gridtackItem.querySelector('.placeholder-wrapper')
      this._renderer.setStyle($placeholderWrapper, 'height', height);

      let $cardPlaceholder = $placeholderWrapper.querySelector('[cards-placeholder]')
      let $widgetWrapper = $cardPlaceholder.querySelector('.widget-wrapper');
      this._renderer.setStyle($cardPlaceholder, 'height', height);

      this._renderer.setStyle($cardPlaceholder, 'height', height);

      this._renderer.setStyle($cardPlaceholder.querySelector('div'), 'height', height);
      this._renderer.setStyle($cardPlaceholder.querySelector('div').querySelector('[dashboard-card]'), 'height', height);

      if (this._commUtil.isNune($cardPlaceholder.querySelector('.widgetTopBar')) && this._commUtil.isNune($widgetWrapper)) {
        let wrapperHeight = 'calc(100% - (80px+(linkedBarHeight+"px")))';
        this._renderer.setStyle($widgetWrapper, 'height', wrapperHeight);
      }
      let chartWidgetElement = $cardPlaceholder.querySelector('[chartWidget]');
      let flexWidgetElement = $cardPlaceholder.querySelector('[flex-grid]');
      let olapWidgetElement = $cardPlaceholder.querySelector('[olap-grid]');
      let mapChartWidgetElement = $cardPlaceholder.querySelector('[map-chart-widget]');
      if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart &&
        this._commUtil.isNune(chartWidgetElement)) {
        if (this.config.driveConfig.isDriven) {
          let wrapperHeight = 'calc(100% - 80px)';
          this._renderer.setStyle($widgetWrapper, 'height', wrapperHeight);
        }
        // Setting the height of the report is as 100% when its Accessible else making as 0%
        height = this.config.isAccessibleReport ? "100%" : "0%";
        this._renderer.setStyle(chartWidgetElement, 'height', height);
        const timeOut = [DashboardConstants.ReportViewType.treemap,
        DashboardConstants.ReportViewType.HeatMap].indexOf(this.config.reportDetails.reportViewType) != -1 ? 300 : 250;
        await setTimeout(async () => {
          if (this.config.config.chartAPI) {
            this.config.config.chartAPI.reflowChart();
          }
        }, timeOut);
      } else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex
        && this._commUtil.isNune(flexWidgetElement)) {
        this._renderer.setStyle($widgetWrapper, 'height', this.config.driveConfig.isDriven ? 'calc(100% - 103px)' : 'calc(100% - 80px)');
        this._renderer.setStyle(flexWidgetElement, 'height', height);
      }
      else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap &&
        this._commUtil.isNune(olapWidgetElement)) {
        this._renderer.setStyle($widgetWrapper, 'height', this.config.driveConfig.isDriven ? 'calc(100% - 78px)' : 'calc(100% - 60px)');
        this._renderer.setStyle(olapWidgetElement, 'height', height);
      }
      else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart &&
        this._commUtil.isNune(mapChartWidgetElement)) {
        this._renderer.setStyle($widgetWrapper, 'height', this.config.driveConfig.isDriven ? 'calc(100% - 78px)' : 'calc(100% - 65px)');
        this._renderer.setStyle(mapChartWidgetElement, 'height', this.config.reportDetails.lstReportObjectOnRow.length > 1 ? "86%" : "95%");
      }
      else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
        this.setGuageChartPosition();
        if (this.config.driveConfig.isDriven) {
          let wrapperHeight = 'calc(100% - 80px)';
          this._renderer.setStyle($widgetWrapper, 'height', wrapperHeight);
        }
      }
      else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex
        && this._dashboardCommService.oppFinderState.oppFinderFlag) {
        this._renderer.setStyle($widgetWrapper, 'height', 'calc(100% - 85px)');
      }
      //Calcaluting height after adding or removing filter chip
      if (this.isFullscreen) {
        let ele = this._elementRef.nativeElement.querySelector("#card-fullscreen-icon-" + this.config.cardId);
        // passsing fullscreen icon's svg as ele to 'makeWidgetFullscreen' as it requires it to find it's parent element.
        this.makeWidgetFullscreen(ele, this.isFullscreen);
      }
    }
  }


  private applyPersistedSort(reportDetails: any) {
    reportDetails.lstReportSortingDetails = [];
    if (this.config.sort.appliedSort && this.config.sort.appliedSort[this.config.rowIndex]) {
      let sortReportObject = new SortReportObject();
      sortReportObject.reportObject = this.config.sort.appliedSort[this.config.rowIndex].reportObject;
      sortReportObject.sortType = this.config.sort.appliedSort[this.config.rowIndex].sortType;
      sortReportObject.sortOrder = 0;
      reportDetails.lstReportSortingDetails.push(sortReportObject);
    }
    else {
      // if (reportDetails.lstReportObjectOnColumn.length > 0) {
      // 	let sortReportObject = new SortReportObject();
      // 	sortReportObject.reportObject = this.config.reportDetails.lstReportObjectOnRow[this.config.rowIndex];
      // 	sortReportObject.sortType = AnalyticsCommonConstants.SortType.Asc;
      // 	sortReportObject.sortOrder = 0;

      // 	reportDetails.lstReportSortingDetails.push(sortReportObject);

      // 	//update applied sort object on current (drill) level in case saved sort is not available/applicable and default sort is applied
      // 	this.config.sort.appliedSort[this.config.rowIndex] = (Object.assign({}, sortReportObject));
      // }
      // else {
      this.fillSortObject(reportDetails, this.config.reportDetails.lstReportObjectOnRow[this.config.rowIndex]);
      this.config.sort.appliedSort[this.config.rowIndex] = (Object.assign({}, reportDetails.lstReportSortingDetails[0]));
      // }
    }
  }

  private fillSortObject(reportObjDetails, repoObj) {
    if (repoObj && repoObj.hasOwnProperty('filterType')) {
      const sortReportObject = new SortReportObject();
      switch (repoObj.filterType) {
        case AnalyticsCommonConstants.FilterType.SingleSelect:
        case AnalyticsCommonConstants.FilterType.MultiSelect:
        case AnalyticsCommonConstants.FilterType.Measure:
        case AnalyticsCommonConstants.FilterType.Number:
        case AnalyticsCommonConstants.FilterType.Tree:
          {
            if (reportObjDetails.lstReportObjectOnValue.length == 0) {
              sortReportObject.reportObject = reportObjDetails.lstReportObjectOnRow[this.config.rowIndex];
              sortReportObject.sortType = AnalyticsCommonConstants.SortType.Desc;
              sortReportObject.sortOrder = 0;
              reportObjDetails.lstReportSortingDetails.push(sortReportObject);
            }
            else {
              sortReportObject.reportObject = reportObjDetails.lstReportObjectOnValue[0];
              sortReportObject.sortType = AnalyticsCommonConstants.SortType.Desc;
              sortReportObject.sortOrder = 0;
              reportObjDetails.lstReportSortingDetails.push(sortReportObject);

            }
            break;
          }
        case AnalyticsCommonConstants.FilterType.MonthYear:
        case AnalyticsCommonConstants.FilterType.Quarter:
        case AnalyticsCommonConstants.FilterType.QuarterYear:
        case AnalyticsCommonConstants.FilterType.Date:
        case AnalyticsCommonConstants.FilterType.Month:
        case AnalyticsCommonConstants.FilterType.Year:
          sortReportObject.reportObject = repoObj;
          sortReportObject.sortType = AnalyticsCommonConstants.SortType.Asc;
          sortReportObject.sortOrder = 0;
          reportObjDetails.lstReportSortingDetails.push(sortReportObject);
          break;
        default:
          break;
      }
    }
  }
  highChartRender: any;
  public eventHandler(event: any) {
    switch (event.eventType) {
      case DashboardConstants.EventType.Click: {
        this.clicks++;
        this.clickHandler(event);
        break;
      }
      case DashboardConstants.EventType.Render: {
        setTimeout(async () => {
          this.positioning();
          this._dashboardCommService.addHighchartLegendCSS(
            this._elementRef, this._renderer
          );
        });
        break;
      }
      case DashboardConstants.EventType.UpdateChart: {
        this.updatecall(event);
      }
        break;
    }
  }

  public updatecall(_updatedHighchartConfig) {
    //update is setting only opacity and set opacity only when driver has previousClickedValue 
    if (this.config.driveConfig.isDriver && this.config.driveConfig.previousClickedValue) {
      this.config.subscriptions.next(
        {
          actionId: DashboardConstants.EventType.UpdateChart,
          cardId: this.config.cardId,
          event: _updatedHighchartConfig
        });
    }
  }
  private clickHandler = debounce((event: any) => {
    let actionId: string = "";
    switch (this.clicks) {
      case 1: {
        actionId = DashboardConstants.FilterIdentifierType.DriveFilter;
        this.triggerDashboardGridEvent(actionId, event, DashboardConstants.EventType.Drive);
        break;
      }
      case 2: {
        actionId = DashboardConstants.FilterIdentifierType.DrillFilter;
        this.onOptionSelect(event, actionId);
        break;
      }
      default: {
        this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_CHART_CLICK_HELP_MSG);
        break;
      }
    }
    this.clicks = 0;
  },
    250,
    {
      'leading': false,
      'trailing': true
    }
  );

  private triggerDashboardGridEvent(actionId: string, event: any, actionType: string, filterValue: string = null, config: any = this.config) {
    config.subscriptions.next(<IDashoardCardAction>{
      actionId: actionId,
      cardId: config.cardId,
      widgetDataType: config.widgetDataType,
      event: event,
      driveAction: <IDriveAction>{
        filterValue: filterValue,
        actionType: actionType,
        clickedCardId: config.cardId,
      }
    });
  }

  public updateFlexGridData() {
    if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex && this.config.config.gridAPI) {
      if (this._dashboardCommService.oppFinderState.oppFinderFlag) {
        if (this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name ||
          this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name ||
          this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name ||
          this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.name) {
          this._dashboardCommService.setOppfinderData(this.cardPagination.pageData[this.cardPagination.currentPage]);
        }
      }
      this.config.config.gridAPI.updateFlexGrid(this.cardPagination.pageData[this.cardPagination.currentPage]);
    }
  }

  private UpdateFlexGridOpacity() {
    if (this.flexDriveEvent && this.config.driveConfig.isDriver) {
      this.flexGridEvent.grid.rows.map((_value: any, _key: any) => {
        if (this.flexDriveEvent === _value._data._id) {
          _value.cssClass = "selected-grid-cell";
        }
        else {
          _value.cssClass = 'sel-grid-cell-opacity'
        }
      });
    }
  }

  private onDrive(event: any) {
    //this.removeBorderBlue();
    if (event.removeBlueBorder) {
      this.removeBorderBlue();
    }
    if (this.isFullscreen) {
      this._renderer.setStyle(document.querySelector('body'), 'overflow', 'hidden');
    }
    if (this.config.driveConfig.isDriver) {
      this._renderer.addClass(this.removeBorderBlue(), 'border-blue');
      if (event.driveAction && event.driveAction.actionType === DashboardConstants.EventType.DrillDown && this.config.cardId === event.driveAction.clickedCardId)
        this.applyDrillDown(event.event);
      if (event.isAlreadyDriven) {
        this.getSlider(this.config.reportDetails);
        this.initializeWidget(this.config.reportDetails)
          .then((_response) => {
            if (_response) {
              this.config.subscriptions.next(
                {
                  actionId: DashboardConstants.EventType.SetOpacity,
                  cardId: this.config.cardId,
                  event: event.event
                });
              this.updateFlexGridData();
              this.UpdateFlexGridOpacity();
              if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex &&
                this.cardPagination.pageSize - 1 < this.cardPagination.totalItems) {
                this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_CELL_DASHBOARD);
              }
            }
          });
      }
      //When driving is to be done when the current widget is not driven in case of crosssuite widget cause of relationship object missing.
      else if (event.crossSuiteMappingMissingOnWidget) {
        this.config.subscriptions.next(
          {
            actionId: DashboardConstants.EventType.SetOpacity,
            cardId: this.config.cardId,
            event: event.event
          });
      }
    }
    else if (this.config.driveConfig.isDriven || (!this.config.driveConfig.isDriven && event.driveRemovalId != this.config.cardId)) {
      this.flexDriveEvent = undefined;
      this.getSlider(this.config.reportDetails);
      this.initializeWidget(this.config.reportDetails)
        .then((_response) => {
          this.updateFlexGridData();
        });
    }
    if (this.config.changeDetectionMutation.setDashboardCardHeaderState) {
      this.config.changeDetectionMutation.setDashboardCardHeaderState();
      setTimeout(async () => {
        this._dashboardCommService.truncateDashboardCardTitle(this._elementRef, this.config, false, false);
      }, 100);
    }
    if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
      this.config.changeDetectionMutation.setDashboardCardFooterState();
    }

    if (this._dashboardCommService.oppFinderState.oppFinderFlag || this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag) {
      this._dashboardCommService.filterCount = 0;
    }
  }

  private removeDrive_cardAction(event) {
    this.removeBorderBlue();
    this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], this.config);
    this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_REMOVED);
    this.config.subscriptions.next({ actionId: DashboardConstants.EventType.RemoveDrive, cardId: this.config.cardId, event: event });
  }

  private removeBorderBlue() {
    let element = this._commUtil.findAncestor(this._elementRef.nativeElement, 'grid-stack-item-content');
    this._renderer.removeClass(element, 'border-blue');
    return element;
  }

  // Drill down
  public onOptionSelect(event, actionId) {
    if (this.breadCrumbList.length < this.config.reportDetails.lstReportObjectOnRow.length && this.config.reportDetails.lstReportObjectOnRow[this.breadCrumbList.length - 1].derivedRoType != AnalyticsCommonConstants.DerivedRoType.DerivedAttributeObject) {

      if (this._commUtil.hasMinimumActiveWidgetInView()) // in this senario drill down will after drive complete
        this.triggerDashboardGridEvent(actionId, event, DashboardConstants.EventType.DrillDown.toString());
      else
        this.applyDrillDown(event);
    }

    else {
      this.config.reportDetails.lstReportObjectOnRow[this.breadCrumbList.length - 1].derivedRoType != AnalyticsCommonConstants.DerivedRoType.DerivedAttributeObject ? this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_CANNOT_DRILL_FURTHER) : this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_CANNOT_DRILL_DerivedAttribute);
    }
  }

  private applyDrillDown(event) {
    let reportDetailsMetaData;
    // this.config.currentChartContainer = event.chartContainer;
    //Making the generic logic for both drill and drive filter value
    event["event"] = { event: event.event };
    let _drilledRow = this._commUtil.getDrillDriveFilterValue(event, this.config);
    _drilledRow = typeof _drilledRow === 'string' && _drilledRow.trim() === "" ? _drilledRow.trim() : _drilledRow;
    this.pushToBreadcrumb(_drilledRow);

    reportDetailsMetaData = this.config.reportDetails;
    //reportDetailsMetaData = this.JumpToState(_drilledRow, 0);

    // Add current selection as a filter for drill down
    let metaDatafilterObject = new SavedFilter();
    let values =
      AnalyticsUtilsService.GetFormattedFilterValue(
        this.config.reportDetails.lstReportObjectOnRow[this.config.rowIndex - 1], _drilledRow);
    reportDetailsMetaData.lstReportObjectOnRow[this.config.rowIndex - 1].isDrill = true;
    metaDatafilterObject.reportObject = reportDetailsMetaData.lstReportObjectOnRow[this.config.rowIndex - 1];
    metaDatafilterObject.Operators = !metaDatafilterObject.Operators ? AnalyticsCommonConstants.ReportObjectOperators.Is : null;
    metaDatafilterObject.filterCondition.FilterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIs;
    metaDatafilterObject.filterCondition.isPeriodFilter = false;
    metaDatafilterObject.filterCondition.name = "";
    metaDatafilterObject.filterCondition.FilterTypeObjectId = metaDatafilterObject.reportObject.filterTypeObjectId;
    metaDatafilterObject.filterCondition.condition = AnalyticsCommonConstants.ReportObjectOperators.Is;
    metaDatafilterObject.filterValue = values;
    metaDatafilterObject.filterBy = reportDetailsMetaData.lstReportObjectOnRow[this.config.rowIndex - 1].filterBy;
    metaDatafilterObject.SetConditionalOperator = reportDetailsMetaData.lstReportObjectOnRow[this.config.rowIndex - 1].SetConditionalOperator;
    metaDatafilterObject.FilterIdentifier = DashboardConstants.FilterIdentifierType.DrillFilter;
    metaDatafilterObject.FilterAppliedAs = DashboardConstants.FilterAppliedAs.DrillFilter;

    // Commenting code to remove previously applied filter on same RO and making it nested filter in metadata to data mapper service
    // if (reportObjDetails.lstFilterReportObject.find(function (f) { return f.reportObject.reportObjectId == metaDatafilterObject.reportObject.reportObjectId })) {
    //     reportObjDetails.lstFilterReportObject.splice(reportObjDetails.lstFilterReportObject.indexOf(reportObjDetails.lstFilterReportObject.find(function (f) { return f.reportObject.reportObjectId == metaDatafilterObject.reportObject.reportObjectId; })), 1)

    // }
    reportDetailsMetaData.lstFilterReportObject.push(metaDatafilterObject);
    this.applyPersistedSort(reportDetailsMetaData);
    //Removing between filter from the ReportDetails on drill down and drill up
    let filterObjList = JSON.parse(JSON.stringify(reportDetailsMetaData.lstFilterReportObject));
    reportDetailsMetaData.lstFilterReportObject = new Array<SavedFilter>();
    filterObjList.forEach(tempFilterObj => {
      if (tempFilterObj.isSliderWidgetFilter != true && tempFilterObj.filterCondition.condition != AnalyticsCommonConstants.ReportObjectOperators.Between)
        reportDetailsMetaData.lstFilterReportObject.push(tempFilterObj);
    });
    this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], this.config);
    this.getSlider(reportDetailsMetaData);
    this.initializeWidget(reportDetailsMetaData);
    // this.drillDown = false;
  }

  public getSlider(reportDetailsMetaData) {
    // Reseting the Slider based upon the condition if it contains the slider widgets.
    if (this.config.showSliderWidget) {
      //this.truncateBreadcrumb();
      let graphConfig = Object.assign({}, this.config);
      graphConfig.reportDetails = reportDetailsMetaData;

      //Keep array of slider Filter for min/max
      let sliderFilterReportObjArray =
        JSON.parse(JSON.stringify(graphConfig.reportDetails.preserveFilterList.filter(function (item) {
          return item.isSliderWidgetFilter && item.filterCondition.condition == AnalyticsCommonConstants.ReportObjectOperators.Between;
        })));

      let reportDetailsDataForMinMax = this.SetReportDetailMetaDataForMinMax(reportDetailsMetaData, sliderFilterReportObjArray);
      //Assigning filterValue as null, So that slider will reset
      sliderFilterReportObjArray.forEach(element => {
        element.filterValue = [];
      });

      let graphConfigArray = this.config;
      // //Emptying SliderFilterArray from main Config so as to replace with new values
      graphConfigArray.sliderFilterArray = new Array<SavedFilter>();
      //graphConfigArray.sliderFilterArray = new Array<SavedFilter>();
      // //Splice all the drill filter before getting the min max for slider
      // reportDetailsDataForMinMax.lstFilterReportObject.forEach((filterObject, index) => {
      //     if (filterObject.FilterIdentifierType == DashboardConstants.FilterIdentifierType.DrillFilter) {
      //         reportDetailsDataForMinMax.lstFilterReportObject.splice(index, 1);
      //     }
      // });
      //Call for min/max service
      this._loaderService.showSliderLoader(this.config.cardId);
      this.config.sliderResetMode = true;
      this.manageSubscription$.add(
        this._analyticsUtilsService.getAllSliderFilterMinMaxValue
          (reportDetailsDataForMinMax, graphConfigArray, graphConfig, sliderFilterReportObjArray)
          .subscribe((_response) => {
            this._loaderService.hideSliderLoader(this.config.cardId);
            this.config.sliderResetMode = false;
          })
      );
    }
  }

  private applyDrillUp(reportDetailsMetaData): any {
    if (this.breadCrumbList.length > 1 && this.config.rowIndex > 0) { //If chart is in drill down state
      this.popFromBreadCrumb();
      const drilledUpFilter = find(reportDetailsMetaData.lstFilterReportObject, (filter: any) => {
        return filter.reportObject.reportObjectId == reportDetailsMetaData.lstReportObjectOnRow[this.config.rowIndex].reportObjectId
          && filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DrillFilter;
      });
      if (drilledUpFilter) {
        const drillFilterIndex = indexOf(reportDetailsMetaData.lstFilterReportObject, drilledUpFilter);
        if (drillFilterIndex > -1) {
          reportDetailsMetaData.lstFilterReportObject.splice(drillFilterIndex, 1);
          this._dashboardCommService.resetValues(['chartMinMax'], [[]], this.config);
        }
      }
      return drilledUpFilter;
    }
    return null;
  }

  public onDrillUp() {
    this.canDrillUp().then(response => {
      if (response) {
        let reportDetailsMetaData = this.config.reportDetails;
        let drilledUpFilter = this.applyDrillUp(reportDetailsMetaData);
        let filterValue = get(drilledUpFilter, 'filterValue[0]');
        if (this.config.driveConfig.isDriver && filterValue && this._dashboardDriveService.isInFilterObjectHierarchyList(this.config.cardId, filterValue)) {
          this.triggerDashboardGridEvent(DashboardConstants.FilterIdentifierType.DrillFilter, null, DashboardConstants.EventType.DrillUp, drilledUpFilter.filterValue[0])
        }
        this.getSlider(reportDetailsMetaData);
        this.applyPersistedSort(reportDetailsMetaData);
        this.initializeWidget(reportDetailsMetaData);
      }
    })
  }

  private canDrillUp(): Promise<boolean> {
    return this._commUtil.checkAllWidgetLoaded();
  }

  public onBreadcrumbSelect(selectedBreadcrumb) {
    this.canDrillUp().then(response => {
      if (response) {
        if (this.breadCrumbList.length > 1) {
          let reportDetailsMetaData = this.config.reportDetails;
          let filterToUnDrive = this.getFilterToUnDrive(selectedBreadcrumb);
          for (let index = this.config.rowIndex; index > selectedBreadcrumb.key; index--) {
            this.applyDrillUp(reportDetailsMetaData);
          }
          if (filterToUnDrive && this.config.driveConfig.isDriver) {
            this.triggerDashboardGridEvent(DashboardConstants.FilterIdentifierType.DrillFilter, null, DashboardConstants.EventType.DrillUp, filterToUnDrive)
          }
          this.applyPersistedSort(reportDetailsMetaData);
          this.getSlider(reportDetailsMetaData);
          this.initializeWidget(reportDetailsMetaData);
        }
      }
    })
  }

  //find the filter which has lowest order in drive filter Hierarchy beacause we can undrive only those filter which are in  drive Hierarchy
  private getFilterToUnDrive(selectedBreadcrumb: IBreadCrumb) {
    if (this.config.driveConfig.isDriver) {
      for (let index = selectedBreadcrumb.key + 1; index < this.breadCrumbList.length; index++) {
        let filterValue = this.breadCrumbList[index].ro_data;
        if (this._dashboardDriveService.isInFilterObjectHierarchyList(this.config.cardId, filterValue))
          return filterValue;
      }
    }
    return null;
  }

  private popFromBreadCrumb() {
    this.breadCrumbList.pop();
    this.updateUIBreadCrumb()
    this.config.rowIndex = this.breadCrumbList.length - 1;
  }

  private pushToBreadcrumb(ro_data: string) {
    let obj: IBreadCrumb = { ro_data: ro_data, key: this.breadCrumbList.length }
    this.breadCrumbList.push(obj);
    this.updateUIBreadCrumb();
    this.config.rowIndex = this.breadCrumbList.length - 1;
  }

  private updateUIBreadCrumb() { // Assuming this.breadCrumbList is already updated.
    this.config.breadCrumbUIConfig = [];
    if (this.breadCrumbList.length > 2) {
      this.breadCrumbUIConfig.slicedBreadcrumbList = this.breadCrumbList.slice(0, this.breadCrumbList.length - 2);
      this.breadCrumbUIConfig.activeBreadCrumbList = this.breadCrumbList.slice(this.breadCrumbList.length - 2);
    }
    else {
      this.breadCrumbUIConfig.slicedBreadcrumbList = [];
      this.breadCrumbUIConfig.activeBreadCrumbList = this._commUtil.getDeReferencedObject(this.breadCrumbList);
    }
    this.config.breadCrumbUIConfig.slicedBreadcrumbList = this.breadCrumbUIConfig.slicedBreadcrumbList;
    this.config.breadCrumbUIConfig.activeBreadCrumbList = this.breadCrumbUIConfig.activeBreadCrumbList;

  }

  private setFirstBreadCrumbName() {
    let crumb = "";
    if (this.breadCrumbList.length == 0 &&
      (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart ||
        this.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart || this.config.widgetDataType == DashboardConstants.WidgetDataType.GuageChart)) {
      if (this.config.reportDetails.lstReportObjectOnRow.length == 0 &&
        this.config.reportDetails.lstReportObjectOnColumn.length > 0)
        crumb = "All " + this.config.reportDetails.lstReportObjectOnColumn[0].displayName;
      else if (this.config.reportDetails.lstReportObjectOnRow.length > 0)
        crumb = "All " + this.config.reportDetails.lstReportObjectOnRow[0].displayName;
      this.pushToBreadcrumb(crumb);
    }
  }

  private applySavedDrill() {
    this.config.rowIndex = 0;
    this.setFirstBreadCrumbName();
    each(this.config.reportDetails.lstFilterReportObject, (filterObj) => {
      if (filterObj.FilterAppliedAs == DashboardConstants.FilterAppliedAs.DrillFilter) {
        filterObj.FilterIdentifier = DashboardConstants.FilterIdentifierType.DrillFilter;
      }
    });
    let drillDown = true;
    while (drillDown) {
      drillDown = false;
      let RO_id = this.config.reportDetails.lstReportObjectOnRow[this.config.rowIndex] ?
        this.config.reportDetails.lstReportObjectOnRow[this.config.rowIndex].reportObjectId : '';
      let drillFilterIndex = findIndex(this.config.reportDetails.lstFilterReportObject, (filter: any) => {
        return filter.reportObject.reportObjectId == RO_id && filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DrillFilter;
      });
      // If drill found on current row, then push in breadcrum
      if (drillFilterIndex > -1) {
        drillDown = true;
        this.pushToBreadcrumb(this.config.reportDetails.lstFilterReportObject[drillFilterIndex].filterValue[0]);
      }
      //If drill not on current row, then remove all further drill down filters
      else {
        for (let index = this.config.rowIndex; index < this.config.reportDetails.lstReportObjectOnRow.length; index++) {
          const element = this.config.reportDetails.lstReportObjectOnRow[index];
          let drillFilterIndex = findIndex(this.config.reportDetails.lstFilterReportObject, (filter: any) => {
            return filter.reportObject.reportObjectId == element.reportDetailObjectId && filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DrillFilter;
          });
          if (drillFilterIndex > -1) {
            this.config.reportDetails.lstFilterReportObject.splice(drillFilterIndex, 1);
          }
        }
      }
    }
  }


  public filter() {
    this.config.subscriptions.next({ actionId: 'FILTER', cardId: this.config.cardId });
  }

  public fullscreen(event) {
    this.isFullscreen = !this.isFullscreen;
    this.makeWidgetFullscreen(event, this.isFullscreen);
    this.config.subscriptions.next({ actionId: 'FULLSCREEN', cardId: this.config.cardId });
  }

  public maximizeFindAncestor(el, cls) {
    while ((el = el.parentNode) && !el.classList.contains(cls));
    return el;
  }


  public async expandCollapseClick() {
    let thisRef = this;
    this.config.isExpandedGraph = !thisRef.config.isExpandedGraph;
    await setTimeout(async () => {
      if (this.config.config.chartAPI) {
        thisRef.config.config.chartAPI.reflowChart();
      }
    }, 500);
  }

  //added reflowChartOnFilterPanelExpand function to reflow chart on filter panel expand collapse
  public async reflowChartOnFilterPanelExpand() {
    let thisRef = this;
    await setTimeout(async () => {
      if (this.config.config.chartAPI) {
        if (thisRef.config.config.chartAPI.reflowChart) {
          thisRef.config.config.chartAPI.reflowChart();
        }
      }
    }, 500);
  }
  public async makeWidgetFullscreen(event: Event, isFullscreen: boolean) {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let mainContainer = document.getElementById('main-container-id');
    let fullScreenEle
    if (event && event.target) {
      fullScreenEle = event.target
    }
    else {
      fullScreenEle = event
    }
    let cardParent = this.maximizeFindAncestor(fullScreenEle, 'grid-stack-item'),
      zIndex = '',
      width = '',
      height = '100%',
      overflow = '',
      top = '',
      left = '',
      calculatedHeight = '',
      // fullscreenHeight = '100%',
      wrapperHeight = 'calc(100% - 60x)';
    if (isFullscreen) {
      zIndex = '950';
      width = '100%';
      height = 'calc(100% - 20px)';
      if (document.querySelector('.filter-chip-wrapper')) {
        let filterHeight = (document.querySelector('.filter-chip-wrapper').clientHeight - 25 + 'px')
        height = `calc(100% - ${filterHeight} )`;
      }

      if (!document.querySelector('#single-source-info-bar')) {
        height = 'calc(100% - 15px)'
      }
      overflow = 'hidden';
      // fullscreenHeight = 'calc(100% - 60px)';
      // calculatedHeight = screen.height - 230 + 'px';//'calc(100% - 230px)';
      let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        calculatedHeight = screen.height - 190 + 'px';
      } else {
        calculatedHeight = screen.height - 230 + 'px';
      }
      wrapperHeight = 'calc(100% - 60px)';
      top = '0';
      left = '0';
    }

    isFullscreen ? this._renderer.addClass(cardParent, 'fullscreen-card') : this._renderer.removeClass(cardParent, 'fullscreen-card');

    this._renderer.setStyle(cardParent, 'z-index', zIndex);
    this._renderer.setStyle(cardParent, 'width', width);
    this._renderer.setStyle(cardParent, 'height', calculatedHeight);
    this._renderer.setStyle(cardParent, 'top', top);
    this._renderer.setStyle(cardParent, 'left', left);
    this._renderer.setStyle(document.querySelector('body'), 'overflow', overflow);
    (overflow == 'hidden') ? mainContainer.classList.add("overflow-hide") : mainContainer.classList.remove("overflow-hide");

    let $gridtackItem = cardParent.querySelector('[smart-gridstack-item]');
    this._renderer.setStyle($gridtackItem, 'height', height);

    let $placeholderWrapper = $gridtackItem.querySelector('.placeholder-wrapper')
    this._renderer.setStyle($placeholderWrapper, 'height', height);

    let $cardPlaceholder = $placeholderWrapper.querySelector('[cards-placeholder]')
    this._renderer.setStyle($cardPlaceholder, 'height', height);
    let $widgetWrapper = $cardPlaceholder.querySelector('.widget-wrapper');
    // let $dashboardcardcontainer = $cardPlaceholder.querySelector('.dashboard-card-container')
    // this._renderer.setStyle($dashboardcardcontainer, 'height', fullscreenHeight)

    this._renderer.setStyle($cardPlaceholder.querySelector('div'), 'height', height);
    this._renderer.setStyle($cardPlaceholder.querySelector('div').querySelector('[dashboard-card]'), 'height', height);
    this._renderer.setStyle($cardPlaceholder.querySelector('.widget-wrapper'), 'height', wrapperHeight);

    const chartWidgetElement = $cardPlaceholder.querySelector('[chartWidget]');
    const flexWidgetElement = $cardPlaceholder.querySelector('[flex-grid]');
    const olapWidgetElement = $cardPlaceholder.querySelector('[olap-grid]');
    if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart &&
      this._commUtil.isNune(chartWidgetElement)) {
      if (this.config.driveConfig.isDriven) {
        let wrapperHeight = 'calc(100% - 80px)';
        this._renderer.setStyle($widgetWrapper, 'height', wrapperHeight);
      }
      // Setting the height of the report is as 100% when its Accessible else making as 0%
      height = this.config.isAccessibleReport ? "100%" : "0%";
      this._renderer.setStyle(chartWidgetElement, 'height', height);
      await setTimeout(async () => {
        if (this.config.config.chartAPI) {
          this.config.config.chartAPI.reflowChart();
        }
      }, 900);
    } else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex
      && this._commUtil.isNune(flexWidgetElement)) {
      const flexwrapperheight: any = isFullscreen ? 'calc(100% - 90px)' : 'calc(100% - 103px)';
      this._renderer.setStyle($widgetWrapper, 'height', this.config.driveConfig.isDriven ? flexwrapperheight : 'calc(100% - 80px)');
      this._renderer.setStyle(flexWidgetElement, 'height', height);
      // this.updateFlexGridData();
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap &&
      this._commUtil.isNune(olapWidgetElement)) {
      const olapwrapperheight: any = isFullscreen ? 'calc(100% - 30px)' : 'calc(100% - 78px)';
      this._renderer.setStyle($widgetWrapper, 'height', this.config.driveConfig.isDriven ? olapwrapperheight : 'calc(100% - 60px)');
      this._renderer.setStyle(olapWidgetElement, 'height', height);
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
      this.setGuageChartPosition();
    } else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart) {
      this.config.config.chartAPI.resizeMap(500);
    }
    // if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
    //   this.tmpdashboardCardFooterRef.context.config.config.isFullscreen = isFullscreen;
    //   this.config.changeDetectionMutation.setDashboardCardFooterState();
    // }
    // if (this.config.changeDetectionMutation.setDashboardCardHeaderState) {
    //   this.tmpdashboardCardHeaderRef.context.config.config.isFullscreen = isFullscreen;
    //   this.config.changeDetectionMutation.setDashboardCardHeaderState();
    // }
    this.updateDashboardCardFooterRefObj("isFullscreen", isFullscreen);
    this.updateDashboardCardHeaderRefObj("isFullscreen", isFullscreen);
  }



  //Header clicked linked to dashboard
  public headerClickedLinkedWidget() {
    if (this.config.isLinkedToDashboard && !this._commUtil.isEmptyGuid(this.config.linkViewId))
      this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.LINKED_WIDGET_HEADING_CLICKED, cardId: this.config.cardId, redirectToLinkedViewId: this.config.linkViewId })
  }


  public sliderRenderCallback(): Observable<any> {
    return Observable.of(null);
  }

  public sliderAction(param) {
    switch (param.actionId) {
      case DashboardConstants.WidgetFunction.SLIDER_APPLY:
        {
          if (
            this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart ||
            this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart ||
            this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex) {
            this.initializeWidget(this.config.reportDetails)
              .then((_response) => {
                this.config.changeDetectionMutation.setSliderState();
              });
          }
          else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap) {
            this._dashboardCommService.resetValues(['pageIndex', 'cardLoader'], [1, true], this.config);
            this.createWidgetContainerView();
          }
        }
        break;
      default:
    };
  }

  public gridEvents(event) {
    if (event.actionId === "resizestop") {
      setTimeout(async () => {
        if (
          this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.MapChart &&
          this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.SummaryCard &&
          this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.GaugeChart &&
          this.config.config.chartAPI)
          this.config.config.chartAPI.reflowChart();

        if (this.config.widgetDataType == DashboardConstants.WidgetDataType.GuageChart) {
          this.setGuageChartPosition();
        }
        if (this.config.reportDetails.reportViewType == DashboardConstants.ReportViewType.MapChart) {
          this.config.config.chartAPI.resizeMap(200);
        }
        if (this.config.widgetDataType == DashboardConstants.WidgetDataType.SummaryCard) {
          this._dashboardCommService.resizeSummaryCardUpdate$.next('');
        }
        this.updateFlexGridData();
      }, 500);

    }
  }

  public setGuageChartPosition() {
    let thisRef = this;
    var element = document.getElementsByClassName('DashboardCard-' + this.config.reportDetails.reportDetailObjectId)
    var parent = this._commUtil.findAncestor(element[0], 'grid-stack-item');
    var gaugeHeight = parent.offsetHeight;
    var gaugeWidth = parent.offsetWidth;
    let gaugeChartWidth, gaugeChartHeight;
    this._renderer.setStyle(this._elementRef.nativeElement.querySelector('.widget-wrapper'), 'overflow-y', 'auto');
    var i = 0;
    for (let gaugeChartObj of this.config.config) {
      gaugeChartWidth = 185;
      gaugeChartHeight = 185;
      var gaugeChartEle = this._elementRef.nativeElement.querySelector("#gaugeChart-" + i);
      var _tempHeight = gaugeHeight;
      var _tempWidth = gaugeWidth;
      if (!this.isFullscreen) {
        if (this._commUtil.isNune(gaugeChartEle)) {
          if (
            (_tempHeight <= 200 && _tempWidth >= 1200) ||
            (_tempHeight >= 620 && _tempWidth <= 250) ||
            (_tempHeight >= 550 && _tempWidth <= 200) ||
            _tempWidth <= 250 || _tempHeight <= 200) {
            if (_tempWidth < 400)
              this._renderer.setStyle(this._elementRef.nativeElement.querySelector('.widget-wrapper'), 'overflow-x', 'hidden')
          }
          else {
            gaugeChartWidth = gaugeChartWidth * 1.5;
            gaugeChartHeight = gaugeChartHeight * 1.5;
          }
          this._renderer.setStyle(gaugeChartEle, 'width', gaugeChartWidth + 'px');
          this._renderer.setStyle(gaugeChartEle, 'height', gaugeChartHeight + 'px');
        }
      }
      else {
        gaugeChartWidth = gaugeChartWidth * 1.5;
        gaugeChartHeight = gaugeChartHeight * 1.5;
        this._renderer.setStyle(gaugeChartEle, 'width', gaugeChartWidth + 'px');
        this._renderer.setStyle(gaugeChartEle, 'height', gaugeChartHeight + 'px');
      }
      i++;
    }
    if (thisRef.config.reflowMultipleGaugeChart != undefined) {
      setTimeout(async () => {
        thisRef.config.reflowMultipleGaugeChart();
      }, 200);
    }
  }


  //   toggle sort ascending descending
  public toggleAscDsc(index, currentItem) {
    currentItem.isActive = true;
    this.config.sort.selectedIndex = index;
    this.selectedIndex = index;
    // this.applySortButtonConfig.disable = false;
    if (this.prevIndexForSort != index && this.prevIndexForSort != undefined) {
      this.config.sort.items[this.prevIndexForSort].sortas = DashboardConstants.SortAs.AscDesc;
      this.config.sort.items[this.prevIndexForSort].tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP;
    }
    this.config.sort.isActive = true;
    this.prevIndexForSort = index;
    let checkcurrentSortas = currentItem.sortas;
    if (checkcurrentSortas == DashboardConstants.SortAs.AscDesc) {
      currentItem.sortas = DashboardConstants.SortAs.Asc;
      currentItem.tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_DESCENDING_TOOLTIP;
    }
    else if (checkcurrentSortas == DashboardConstants.SortAs.Asc) {
      currentItem.sortas = DashboardConstants.SortAs.Desc;
      currentItem.tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP;
    }
    else if (checkcurrentSortas == DashboardConstants.SortAs.Desc) {
      currentItem.sortas = DashboardConstants.SortAs.Asc;
      currentItem.tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_DESCENDING_TOOLTIP;
    }
  }

  public updateSortMenu(reportDetailsMetaData) {
    let that = this;
    let sortOption = {};
    let widget = that.config;
    if (that.config.sort.isActive) {
      widget.sort.items = [];

      if (widget.reportDetails.lstReportObjectOnRow.length > 0) {
        let sortOption = {
          name: widget.reportDetails.lstReportObjectOnRow[widget.rowIndex] ? widget.reportDetails.lstReportObjectOnRow[widget.rowIndex].displayName : '',
          sortas: DashboardConstants.SortAs.AscDesc,
          tooltipConfig: { message: DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP, position: 'bottom' },
          reportObjectId: widget.reportDetails.lstReportObjectOnRow[widget.rowIndex] ? widget.reportDetails.lstReportObjectOnRow[widget.rowIndex].reportObjectId : ''
        };
        widget.sort.items.push(sortOption);
      }
      widget.reportDetails.lstReportObjectOnValue.forEach(value => {
        sortOption = {
          name: value.displayName,
          sortas: DashboardConstants.SortAs.AscDesc,
          tooltipConfig: { message: DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP, position: 'bottom' },
          reportObjectId: value.reportObjectId
        }
        widget.sort.items.push(sortOption);
      });

      if (reportDetailsMetaData.lstReportSortingDetails.length > 0 && some(widget.sort.items, { reportObjectId: reportDetailsMetaData.lstReportSortingDetails[0].reportObject.reportObjectId })) {
        if (widget.sort.appliedSort && widget.sort.appliedSort[widget.rowIndex] && widget.sort.appliedSort[widget.rowIndex].reportObject.reportObjectId) {
          widget.sort.selectedIndex = findIndex(widget.sort.items, { reportObjectId: widget.sort.appliedSort[widget.rowIndex].reportObject.reportObjectId }); // assuming the widget.sort.appliedSort variable is always up to date with the current level applied sort, if not sort menu will not be updated with applied/default sort.
          if (typeof widget.sort.selectedIndex !== 'undefined' && widget.sort.selectedIndex > -1) {
            if (widget.sort.appliedSort[widget.rowIndex].sortType == DashboardConstants.SortType.Asc) {
              widget.sort.items[widget.sort.selectedIndex].sortas = DashboardConstants.SortAs.Asc;
              widget.sort.items[widget.sort.selectedIndex].tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_DESCENDING_TOOLTIP;
            }
            else {
              widget.sort.items[widget.sort.selectedIndex].sortas = DashboardConstants.SortAs.Desc;
              widget.sort.items[widget.sort.selectedIndex].tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP;
            }
          }
        }
      }

    }
  }

  public closeSort() {
    this.config.sort.showSort = false;
    let widget = this.config;
    widget.sort.showSort = false;
    if (widget.sort.appliedSort && widget.sort.appliedSort[widget.rowIndex]) {
      widget.sort.selectedIndex = findIndex(widget.sort.items, { reportObjectId: widget.sort.appliedSort[widget.rowIndex].reportObject.reportObjectId });
      this.selectedIndex = widget.sort.selectedIndex;
      if (widget.sort.selectedIndex > -1) {
        widget.sort.items.forEach((option, index) => {
          if (index == widget.sort.selectedIndex) {
            if (widget.sort.appliedSort[widget.rowIndex].sortType == DashboardConstants.SortType.Asc) {
              option.sortas = DashboardConstants.SortAs.Asc;
              option.tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_DESCENDING_TOOLTIP;
            }
            else {
              option.sortas = DashboardConstants.SortAs.Desc;
              option.tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP;
            }
          }
          else {
            option.sortas = DashboardConstants.SortAs.AscDesc;
            option.tooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_SORT_BY_ASCENDING_TOOLTIP;
          }
        });
      }
      //this.applySortButtonConfig.disable = true;
      this.prevIndexForSort = findIndex(this.config.sort.items, { reportObjectId: this.config.sort.appliedSort[this.config.rowIndex].reportObject.reportObjectId });

    }

  }

  public applySort(event) {
    this.config.sort.showSort = false;
    this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], this.config);
    let widget = this.config;
    if (widget.driveConfig.isDriver) {
      this.removeDrive_cardAction(event);
    }
    let listROsForSort = union(widget.reportDetails.lstReportObjectOnRow, widget.reportDetails.lstReportObjectOnValue);
    let sortObject = new ReportSortingDetails();
    sortObject.reportObject = find(listROsForSort, { reportObjectId: widget.sort.items[widget.sort.selectedIndex].reportObjectId }) as ReportObject;
    sortObject.sortType = widget.sort.items[widget.sort.selectedIndex].sortas == DashboardConstants.SortAs.Asc ? DashboardConstants.SortType.Asc : DashboardConstants.SortType.Desc;
    sortObject.sortOrder = 0;
    widget.sort.appliedSort[widget.rowIndex] = sortObject;
    widget.reportDetails.lstReportSortingDetails = [];
    widget.reportDetails.lstReportSortingDetails.push(sortObject);
    this._dashboardCommService.lstOfDashletSort.set(widget.reportDetails.reportDetailObjectId, sortObject);
    let graphConfig = Object.assign({}, widget);
    //graphConfig.reportDetails = this.onOptionSelect(event);
    this.getReportData(graphConfig.reportDetails);
    // //reportObjDetails.lstReportSortingDetails.push(sortReportObject);
    widget.sort.showSort = false;
    //this.applySortButtonConfig.disable = true;
  }

  public async initializeWidget(reportDetailsObj) {
    this._loaderService.showCardLoader(this.config.cardId);
    this.uiConfig = this.config.uiConfig;
    let thisRef = this;

    // Commented by Akash since this code in no longer required for new ppv since we dont have to load any dropdown with suppliers in it.
    // Will remove this code after dev testing.

    /*   if (
        this._dashboardCommService.oppFinderState.oppFinderFlag &&
        this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name &&
        this.uiConfig.showAutoSuggest) {
        setTimeout(() => {
          thisRef.autoSuggestContainerRef.createEmbeddedView(thisRef.autoSuggestTemplateRef, { $implicit: thisRef.config });
        }, 200);// lazy load autosuggest here
      } */

    if (
      this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart ||
      this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart ||
      this.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart) {
      this.applyPersistedSort(reportDetailsObj);
      this.selectedIndex = findIndex(this.config.sort.items,
        { reportObjectId: this.config.sort.appliedSort[this.config.rowIndex].reportObject.reportObjectId }
      );
      this.prevIndexForSort = this.selectedIndex;
    }
    return await this.getReportData(reportDetailsObj);
  }

  private generateReportDetailMetaData(reportDetailsMetaData: any) {
    reportDetailsMetaData.reportRequestKey = this.config.reportRequestKey;
    reportDetailsMetaData.pageIndex = this.config.pageIndex;
    let isChart: boolean =
      this._commUtil.getWidgetType(reportDetailsMetaData.reportViewType) === DashboardConstants.WidgetDataType.Chart ||
      reportDetailsMetaData.reportViewType === DashboardConstants.ReportViewType.MapChart || reportDetailsMetaData.reportViewType === DashboardConstants.ReportViewType.GaugeChart;
    if (isChart) {
      if (reportDetailsMetaData.lstReportObjectOnRow.length > 1) {
        let rowListForDrill = reportDetailsMetaData.lstReportObjectOnRow.filter(
          (o: any) => o.layoutArea == 0)[this.config.rowIndex];
        reportDetailsMetaData.lstReportObjectOnRow = new Array();
        reportDetailsMetaData.lstReportObjectOnRow.push(rowListForDrill);
      }
      if (reportDetailsMetaData.lstReportObjectOnColumn.length > 1) {
        let columnListForDrill = reportDetailsMetaData.lstReportObjectOnRow.filter(
          (o: any) => o.layoutArea == 1)[this.config.rowIndex];
        reportDetailsMetaData.lstReportObjectOnColumn = new Array();
        reportDetailsMetaData.lstReportObjectOnColumn.push(columnListForDrill);
      }
    }
    else if (reportDetailsMetaData.reportViewType == AnalyticsCommonConstants.ReportViewType.Olap) {
      if (reportDetailsMetaData.isTotalRequired) {
        reportDetailsMetaData.isGrandTotalRequired = true;
        reportDetailsMetaData.isSubTotalRequired = true;
      }
      else {
        reportDetailsMetaData.isGrandTotalRequired = false;
        reportDetailsMetaData.isSubTotalRequired = false;
      }
    }
    else if (reportDetailsMetaData.reportViewType == AnalyticsCommonConstants.ReportViewType.Flex) {
      reportDetailsMetaData.isGrandTotalRequired = false;
      reportDetailsMetaData.isSubTotalRequired = false;
    }
    if (
      reportDetailsMetaData.reportViewType != AnalyticsCommonConstants.ReportViewType.pie
      && reportDetailsMetaData.reportViewType != AnalyticsCommonConstants.ReportViewType.treemap &&
      reportDetailsMetaData.reportViewType != AnalyticsCommonConstants.ReportViewType.WaterFallChart) {
      reportDetailsMetaData.isLazyLoadingRequired = true;
    }
    if (reportDetailsMetaData.reportViewType == AnalyticsCommonConstants.ReportViewType.SummaryCard && ((reportDetailsMetaData.lstReportObjectOnColumn.length == 1 && reportDetailsMetaData.lstReportObjectOnValue.length == 1 && reportDetailsMetaData.lstReportObjectOnRow.length == 0) || (reportDetailsMetaData.lstReportObjectOnRow.length == 1 && reportDetailsMetaData.lstReportObjectOnValue.length == 1 && reportDetailsMetaData.lstReportObjectOnColumn.length == 0))) {
      reportDetailsMetaData.isPercentageEnabledSummaryCard = true;
    }
    if (isChart)
      this.generateChartReportSortingMetaData(reportDetailsMetaData)
    else
      this.generateFlexReportSortingMetaData(reportDetailsMetaData)
  }

  private generateChartReportSortingMetaData(reportDetailsMetaData: any) {
    // This block is only requires for the Chart Object Peraption
    this.updateSortMenu(reportDetailsMetaData);
    /*Pushing row sort object into lstSortObject when sorting is applied on value
    Fix for issue when value is same for a metric CLI-122945*/
    let sortObjectForReportGeneration = new ReportSortingDetails();
    if (
      this.config.sort.appliedSort[0].reportObject.reportObjectType === DashboardConstants.ReportObjectType.Metrics || DashboardConstants.ReportObjectType.Calculated) {
      if (
        reportDetailsMetaData.lstReportObjectOnRow.length > 0 &&
        reportDetailsMetaData.lstReportObjectOnRow != undefined &&
        (findIndex(reportDetailsMetaData.lstReportSortingDetails, [
          'reportObject.reportObjectName', reportDetailsMetaData.lstReportObjectOnRow[0].reportObjectName]) == -1)
      ) {
        sortObjectForReportGeneration.reportObject = reportDetailsMetaData.lstReportObjectOnRow[0];
        sortObjectForReportGeneration.sortType = DashboardConstants.SortType.Asc;
        sortObjectForReportGeneration.sortOrder = 1;
        reportDetailsMetaData.lstReportSortingDetails.push(sortObjectForReportGeneration);
      }
    }
  }

  private generateReportFilterMetaData(reportDetailsMetaData: any) {
    if (reportDetailsMetaData.lstFilterReportObject != null) {
      let cleanFilterList = new Array<SavedFilter>();
      let filterListJson = JSON.stringify(reportDetailsMetaData.lstFilterReportObject);
      cleanFilterList = JSON.parse(filterListJson);

      cleanFilterList.forEach((value: any, key: number) => {
        if (
          (
            value.filterValue.length == 0 &&
            value.filterCondition.condition == AnalyticsCommonConstants.ReportObjectOperators.Between &&
            value.isSliderWidgetFilter
          )
          || (
            value.filterCondition.condition == AnalyticsCommonConstants.ReportObjectOperators.Between && value.isSliderWidgetFilter &&
            this.config.sliderResetMode
          )
          || value.filterValue[0] == DashboardConstants.DAXQueryManipulate.AllRecords
          || value.NestedReportFilterObject != null
        ) {
          // let index = reportDetailsMetaData.lstFilterReportObject.indexOf(reportDetailsMetaData.lstFilterReportObject.find(function (f) { return f.reportObject.reportObjectId == value.reportObject.reportObjectId; }));
          let index = findIndex(reportDetailsMetaData.lstFilterReportObject, (filter: any) => {
            return value.reportObject.reportObjectId == filter.reportObject.reportObjectId;
          }, key);
          if (index > -1) {
            // Splicing the NestedReportFilterObject and filtervalue if it contains -1
            if (
              value.NestedReportFilterObject != null &&
              value.NestedReportFilterObject.Values[0] == DashboardConstants.DAXQueryManipulate.AllRecords) {
              reportDetailsMetaData.lstFilterReportObject[index].NestedReportFilterObject = null;
            }
            else if (reportDetailsMetaData.lstFilterReportObject[index].filterValue[0] == DashboardConstants.DAXQueryManipulate.AllRecords) {
              reportDetailsMetaData.lstFilterReportObject.splice(index, 1);
            }
            else if (
              value.filterCondition.condition == AnalyticsCommonConstants.ReportObjectOperators.Between && value.isSliderWidgetFilter &&
              this.config.sliderResetMode) {
              reportDetailsMetaData.lstFilterReportObject.splice(index, 1);
            }
          }
        }
      });
    }
  }

  public getReportData(reportDetails) {
    this.createWidgetContainerView();
    let that = this,
      reportDetailsMetaData = Object.assign({}, reportDetails);
    let filterRepoObjModified = reportDetailsMetaData.lstFilterReportObject.find((x: any) => x.reportObject.isDashletModified == true);
    if (filterRepoObjModified != null && filterRepoObjModified.reportObject.isDashletModified) {
      let currentWidget = $('#' + reportDetailsMetaData.reportDetailObjectId + ' .widget-container');
      currentWidget.trigger('click');
    }
    else that = this;
    this.showCardLoader();
    this.generateReportDetailMetaData(reportDetailsMetaData);
    // //Reset sort list if dashlet modified on drilled level
    // if (filterRepoObjModified != null && filterRepoObjModified.reportObject.isDashletModified) {
    // 	reportDetailsMetaData.lstReportSortingDetails = [];
    // 	if (reportDetailsMetaData.lstReportObjectOnColumn.length > 0) {
    // 		let sortReportObject = new SortReportObject();
    // 		sortReportObject.reportObject = that.config.reportDetails.lstReportObjectOnRow[that.config.rowIndex];
    // 		sortReportObject.sortType = AnalyticsCommonConstants.SortType.Asc;
    // 		sortReportObject.sortOrder = 0;
    // 		reportDetailsMetaData.lstReportSortingDetails.push(sortReportObject);
    // 	}
    // }
    this.generateReportFilterMetaData(reportDetailsMetaData);
    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);
    // setting the default pageSize where pagination not applicable as well handling 
    // it using the reportProperties from reportDetail Metadata
    this.setPageSizeForMetaDetails(reportDetailsData);
    return new Promise((resolve) => {
      if (this.config.isAccessibleReport) {
        if (
          this.config.widgetDataType === DashboardConstants.WidgetDataType.MapChart ||
          this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex ||
          this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart ||
          this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart ||
          (this.config.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard)
        ) {
          that.config.WidgetDataRecordLength = 0;
          this.manageSubscription$.add(
            Observable.forkJoin(
              this.getChartMinMaxValue(reportDetailsData),
              this._analyticsCommonDataService.generateReport(reportDetailsData)
            ).subscribe((response: any) => {

              //Setting the Min & Max Value for the Charts on YAxis
              this.generateChartYAxisMinMax(response[0]);
              if (
                response != undefined
                && response[1].Data != null
                && (
                  response[1].Data.length > 0 ||
                  (
                    response[1].Data.length === 0 &&
                    this._commUtil.isNune(response[1].GrandTotal) &&
                    !this._commUtil.isEmptyObject(response[1].GrandTotal)
                  )
                )
                && response[1].Data.toString().toLowerCase() !== "error".toLowerCase()) {
                that.config.WidgetDataRecordLength = response[1].Data.length;
                if (that.config.hasOwnProperty('btnRangeApplyConfig')) {
                  that.config.btnRangeApplyConfig.disable =
                    that.config.WidgetDataRecordLength != undefined ? that.config.WidgetDataRecordLength > 0
                      ? false : true : false;
                }
                const dataLimit: number = this.getChartDataLimit(reportDetailsData);
                if (
                  (
                    reportDetailsData.reportViewType == AnalyticsCommonConstants.ReportViewType.treemap ||
                    reportDetailsData.reportViewType == AnalyticsCommonConstants.ReportViewType.pie ||
                    reportDetailsData.reportViewType == AnalyticsCommonConstants.ReportViewType.ParetoChart ||
                    reportDetailsData.reportViewType == AnalyticsCommonConstants.ReportViewType.WaterFallChart ||
                    reportDetailsData.reportViewType == AnalyticsCommonConstants.ReportViewType.BubbleChart ||
                    reportDetailsData.reportViewType == AnalyticsCommonConstants.ReportViewType.MapChart
                  ) && response[1].Data.length > (dataLimit - 10)
                ) {
                  that.setDashboardCardMessage('This chart supports displaying upto ' + (dataLimit - 10) + ' values only. Since there are more values in this case, please apply filters or choose a different chart type.');
                  this._loaderService.hideCardLoader(this.config.cardId);
                }
                else {
                  if (that.initDone == false) { // If first time, first generate chart and then set initDone to true.
                    that.generateChart(reportDetailsMetaData, response[1]);
                    that.initDone = true;
                  }
                  else { // If not first time, set initDone to true first and then generate chart(which will internally update chart).
                    that.initDone = true;
                    that.generateChart(reportDetailsMetaData, response[1]);
                  }
                }
              }
              else {
                if (response[1].Data.toString().toLowerCase() === "error".toLowerCase()) {
                  that.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.ErrorOccured));
                  that.setSummaryCardMessage(true);
                  this._loaderService.hideSliderLoader(this.config.cardId);
                }
                else if (that.config.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard) {
                  this.setSummaryCardMessage();
                }
                else {
                  that.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.RecordNotFound));
                }
                that.initializeSliderWidget();
                that.config.btnRangeApplyConfig.disable = false;
              }
              this._loaderService.hideCardLoader(this.config.cardId);
              if (this.config.changeDetectionMutation.setDashboardCardHeaderState) {
                this.config.changeDetectionMutation.setDashboardCardHeaderState();
              }
              this.setState();
              resolve(true);
            }, (error) => {
              this._commUtil.getMessageDialog(
                `Status:${error.status}  Something Went wrong with ${error.message}`, () => { }
              )
            })
          );
        }
        else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap) {
          //Making true for the Olap becuase it will be hidden in directive
          this.showCardLoader();
          this.config.config = this.generateWijmoOlapGridConfig();
          that.initializeSliderWidget();
          //this.setDashboardCardMessage(DashboardConstants.UIMessageConstants.STRING_DOESNOT_SUPPORT_GRID_TYPE);
        }
      }
      else {
        this.hideCardLoader();
        this.config.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard ?
          this.setSummaryCardMessage() : this.setDashboardCardMessage("<b>" + DashboardConstants.UIMessageConstants.STRING_WIDGET_ACCESS_DENIED_MSG + "</b>");
      }
    });
  }

  private setPageSizeForMetaDetails(reportDetailsData: any) {
    const enableFeatureForTwentyRows: boolean =
      this._commUtil.enableFeatureFor(reportDetailsData.reportViewType, DashboardConstants.EnableFeature.TwentyRows);
    AnalyticsUtilsService.setPageSize(reportDetailsData, enableFeatureForTwentyRows);

    // Check whether the page size is not applicable for rport view type
    const isNAsetPageSize: boolean =
      this._commUtil.enableFeatureFor(reportDetailsData.reportViewType, DashboardConstants.EnableFeature.NAPageSize);
    if (isNAsetPageSize) {
      /**
       *  Will set the pageSize=0 when the reportViewType is not set for the not applicable page size.
       */
      reportDetailsData.pageSize = 0;
    }
  }

  private async setSummaryCardMessage(IsError: boolean = false, IsMeasureFilterApplied: boolean = false) {
    if (this.config.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard) {
      this.config.config = {
        showKebabMenusOption: true,
        showTitle: this.config.uiConfig.showTitle,
        editDescription: false,
        showEdit: false,
        kebabMenuOptions: this.config.uiConfig.kebabMenuOptions,
        data: this._commUtil.isNune(this.config.config) && this._commUtil.isNune(this.config.config.data) ? this.config.config.data : "",
        message: IsError ? this.getMessageStrings(DashboardConstants.EventType.ErrorOccured) :
          IsMeasureFilterApplied ? this.getMessageStrings(DashboardConstants.EventType.MeasureFilterApplied) :
            this.config.isAccessibleReport ? this.getMessageStrings(DashboardConstants.EventType.RecordNotFound) :
              "<b>" + DashboardConstants.UIMessageConstants.STRING_WIDGET_ACCESS_DENIED_MSG + "<b>"
      }
      await this.loadSummaryCard();
    }
  }

  private getChartMinMaxValue(reportDetailsData: any): Observable<any> {
    const reportDetailsDataRemoveRef = this._commUtil.getDeReferencedObject(reportDetailsData);
    const reportDetails = this._commUtil.getDeReferencedObject(this.config.reportDetails);
    const currReportObject = [reportDetails.lstReportObjectOnRow[this.config.rowIndex]];
    // reportDetails.lstReportObjectOnColumn.forEach((_value, _key) => {
    //   _value.layoutArea = DashboardConstants.ReportObjectLayoutArea.Rows;
    // });
    if (
      this._commUtil.enableFeatureFor(reportDetailsData.reportViewType, DashboardConstants.EnableFeature.MinMaxValue)
      && this.config.chartMinMax.length == 0 &&
      //Disabling the chartMinMax for the Stack Column Chart and Stack Bar Chart in case When user has created the report
      //with Constraint as i.e. 1 Column,1 Value and 0 Rows
      // Otherwise chartMinMax should be displayed on the graph
      !(
        (
          reportDetailsData.reportViewType == DashboardConstants.ReportViewType.stColumn ||
          reportDetailsData.reportViewType == DashboardConstants.ReportViewType.StackedBarChart
        )
        && reportDetails.lstReportObjectOnColumn.length == 1
        && reportDetails.lstReportObjectOnValue.length == 1
        && reportDetails.lstReportObjectOnRow.length == 0
      )
    ) {
      if (
        reportDetails.lstReportObjectOnColumn.length >= 1 &&
        reportDetails.lstReportObjectOnValue.length >= 1 &&
        reportDetails.lstReportObjectOnRow.length >= 1
      ) {
        reportDetailsDataRemoveRef.lstSortReportObject = [];
        reportDetailsDataRemoveRef.lstReportObject = [];
        let minMaxReqObj = [] as any;
        if (reportDetailsData.reportViewType === DashboardConstants.ReportViewType.stColumn ||
          reportDetailsData.reportViewType === DashboardConstants.ReportViewType.StackedBarChart
        ) {
          minMaxReqObj = currReportObject.concat(reportDetails.lstReportObjectOnValue);
        }
        else {
          minMaxReqObj = reportDetails.lstReportObjectOnColumn
            .concat(currReportObject)
            .concat(reportDetails.lstReportObjectOnValue);
        }
        reportDetailsDataRemoveRef.lstReportObject = minMaxReqObj;
        const sortObject = new ReportSortingDetails();
        sortObject.reportObject = reportDetails.lstReportObjectOnValue[0];
        sortObject.sortType = DashboardConstants.SortType.Asc
        sortObject.sortOrder = 0;
        reportDetailsDataRemoveRef.lstSortReportObject.push(sortObject);
      } else {
        reportDetailsDataRemoveRef.lstSortReportObject = [];
        reportDetails.lstReportObjectOnValue.forEach((_value, _key) => {
          const sortObject = new ReportSortingDetails();
          sortObject.reportObject = reportDetails.lstReportObjectOnValue[_key];
          sortObject.sortType = DashboardConstants.SortType.Asc
          sortObject.sortOrder = _key + 1;
          reportDetailsDataRemoveRef.lstSortReportObject.push(sortObject);
        });
      }
      return this._analyticsCommonDataService.getAllSliderFilterMinMaxValue(reportDetailsDataRemoveRef)
    }
    else {
      return Observable.of(this.config.chartMinMax || []);
    }
  }

  private getValidatedDAXResponse(response: any): boolean {
    this._loaderService.hideCardLoader(this.config.cardId);
    if (response.Data.toString().toLowerCase() == "error".toString().toLocaleLowerCase()) {
      this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.ErrorOccured));
      return false;
    }
    else if (response.Data.length == 0) {
      this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.RecordNotFound));
      return false;
    }
    return true;
  }

  //#region<============================ Wijmo Flex Grid Implemenation =======================================>



  /**
   *  Get the Wijmo Sepecific Record Id for the each individual records
   * @param _graphConfig = Dashboard Card Config for Entire Card
   * @param _daxResponseData = DAX Related Response Data
   */
  private getWijmoFlexGridData(_graphConfig: any, _daxResponseData: any): Array<any> {
    if (_graphConfig == null) {
      _graphConfig = Object.assign({}, this.config);
    }
    if (_daxResponseData.Data) {
      const __EXCLUDE_METRICS__: Array<string> =
        _graphConfig.reportDetails.lstReportObjectOnValue.map((_value: any, _key: any) => { return _value.reportObjectName });
      const __CARDID__: string = _graphConfig.cardId;
      _daxResponseData.Data.map((_value: any, _key: any) => {
        _value._id = this._commUtil.generateUniqueDataRowIdFromResponse(_value, __EXCLUDE_METRICS__, __CARDID__);
        if (this._dashboardCommService.oppFinderState.oppFinderFlag) _value[""] = "";
      });
    }
    return _daxResponseData;
  }

  /**
   * Preparing the Wijmo Grid Related Column JSON from the Report Objects
   * @param _graphConfig = Dashboard Card Config for Entire Card
   * @param _daxResponseData = DAX Related Response Data
   */
  private getWijmoFlexGridColumnNames(_graphConfig: any, _daxResponseData: any): Array<IWijmoFlexGridColumns> {
    if (_graphConfig != undefined) {
      const _wijmoFlexGridColumn: Array<IWijmoFlexGridColumns> = [];
      //Adding the Reporting Objects based Upon Specific Sequnce Column,Value,Row for WIJMO Flex Grid Render.
      const CombinedReportObjects: Array<IReportObjectInfo> =
        concat(
          _graphConfig.reportDetails.lstReportObjectOnColumn || [],
          _graphConfig.reportDetails.lstReportObjectOnRow || [],
          _graphConfig.reportDetails.lstReportObjectOnValue || []
        );
      let trendMeasureNames = [];
      each(CombinedReportObjects,
        (_values: any, _keys: any) => {
          const _prepareWijmoObj: IWijmoFlexGridColumns = {
            _id: _values._id,
            header: _values.displayName || _values.reportObjectName,
            aggregate: _values.wijmoGridAggregatedType || DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._value,
            binding: _values.reportObjectName,
            format: this._commUtil.getFlexWijmoFormat(_values.formatKey, _values.filterType, _values.ConfigurationValue),
            isReadOnly: true,
            visible: true,
            width: this._dashboardCommService.getReportObjectWidthForPersistance(_values.reportObjectId, _graphConfig.cardId),
            minWidth: DashboardConstants.WijmoConfiuration.WijmoGridMinWidth,
            dataType: _values.filterType === DashboardConstants.FilterType.Date ? DataType.Date : DataType.String
          };
          _wijmoFlexGridColumn.push(_prepareWijmoObj);

          //this will push the extra two columns when trend measure with percentage change along with value column is pinned here
          if (_values.derivedRoType == AnalyticsCommonConstants.DerivedRoType.TrendMeasureType) {
            let trendMeasureExpression = JSON.parse(_values.expression);
            if (trendMeasureExpression.TrendMeasureDisplayOptions == AnalyticsCommonConstants.trendMeasureReportViewOptions.DisplayPercentageChangeAndValueColumn) {
              if (trendMeasureNames.indexOf(trendMeasureExpression.CurrentSpendName) == -1) {
                let currentSpendObject = {
                  _id: _values._id,
                  header: trendMeasureExpression.CurrentSpendName,
                  aggregate: _values.wijmoGridAggregatedType || DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._value,
                  binding: trendMeasureExpression.CurrentSpendName,
                  format: "",
                  isReadOnly: true,
                  visible: true,
                  width: _values.reportObjectWidth,
                  minWidth: DashboardConstants.WijmoConfiuration.WijmoGridMinWidth,
                  dataType: _values.filterType === DashboardConstants.FilterType.Date ? DataType.Date : DataType.String
                }
                _wijmoFlexGridColumn.push(currentSpendObject);
                trendMeasureNames.push(trendMeasureExpression.CurrentSpendName);
              }
              if (trendMeasureNames.indexOf(trendMeasureExpression.PreviousSpendName) == -1) {
                let previousSpendObject = {
                  _id: _values._id,
                  header: trendMeasureExpression.PreviousSpendName,
                  aggregate: _values.wijmoGridAggregatedType || DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._value,
                  binding: trendMeasureExpression.PreviousSpendName,
                  format: "",
                  isReadOnly: true,
                  visible: true,
                  width: _values.reportObjectWidth,
                  minWidth: DashboardConstants.WijmoConfiuration.WijmoGridMinWidth,
                  dataType: _values.filterType === DashboardConstants.FilterType.Date ? DataType.Date : DataType.String
                }

                _wijmoFlexGridColumn.push(previousSpendObject);
                trendMeasureNames.push(trendMeasureExpression.PreviousSpendName);

              }


            }

          }

        });
      if (this._dashboardCommService.oppFinderState.oppFinderFlag) {
        if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name ||
          this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.name) {
          _wijmoFlexGridColumn.push({
            _id: undefined,
            header: "",
            aggregate: "None",
            binding: "",
            format: "",
            isReadOnly: true,
            visible: true,
            width: 50,
            minWidth: DashboardConstants.WijmoConfiuration.WijmoGridMinWidth
          })
        }
      }
      return _wijmoFlexGridColumn;
    }

  }

  /**
   * 	Setting the first time configuration in for the columns,series & grid api records.
   *  and next time onnwards setting the same value given in the config.
   *  The intention is to avoid recalculation of the Columns Name and Grid Data and rest values
   * @param _graphConfig = get the Widget config related data to work upon - Reference type working
   * @param _daxResponseData =get the Widget config related data to work upon - No Linkage
   */
  public generateWijmoFlexGridConfig(_graphConfig: any, _daxResponseData: any) {
    return {
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.NONE,
      widgetDataType: DashboardConstants.WidgetDataType.Flex,
      enableItemFormatter: _graphConfig.config.enableItemFormatter || true,
      enableResizedColumn: _graphConfig.config.enableResizedColumn || true,
      enableEditCell: _graphConfig.config.enableEditCell || false,
      enableCellSelection: _graphConfig.config.enableCellSelection || false,
      enableUpdate: _graphConfig.config.enableUpdate || false,
      enableStickyHeader: _graphConfig.config.enableStickyHeader || true,
      enableFilters: _graphConfig.config.enableFilters || false,
      enableFooter: _graphConfig.config.enableFooter || false,
      allowSorting: _graphConfig.config.allowSorting || false,
      column: _graphConfig.config.column || this.getWijmoFlexGridColumnNames(_graphConfig, _daxResponseData),
      series: _graphConfig.config.series || this.getWijmoFlexGridData(_graphConfig, _daxResponseData),
      gridAPI: _graphConfig.config.gridAPI || {},
      iconType: 'icon'
    };
  }

  /**
   * @param _daxResponse = Getting the Dax Query Response and Making the default Pagonation Configuration
   */
  private setDefaultPaginationConfig(_daxResponse: any) {
    this.cardPagination.pageData = [];
    this.cardPagination.pageSize = _daxResponse.PageSize;
    this.cardPagination.totalItems = _daxResponse.TotalRowCount;
    this.cardPagination.totalPages = Math.ceil(this.cardPagination.totalItems / (this.cardPagination.pageSize - 1));
    this.cardPagination.endPage = Math.ceil(this.cardPagination.totalItems / (this.cardPagination.pageSize - 1));
    this.cardPagination.currentPage = 0;
    // Checking the Current Page with +1 becuase Math.Ceil returns max value of 1 when devides with endPage
    this.cardPagination.isNext = (this.cardPagination.currentPage + 1) == this.cardPagination.endPage ? false : true;
    this.cardPagination.isPrev = this.cardPagination.currentPage == 0 ? false : true;
    this.cardPagination.startPage = 1;
    this.cardPagination.showPagination =
      this._commUtil.enableFeatureFor(this.config.reportDetails.reportViewType, DashboardConstants.EnableFeature.Pagination) &&
        !((this.config.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn ||
          this.config.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.StackedBarChart ||
          this.config.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedBarChart ||
          this.config.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.PercentStackedColumnChart) &&
          this.config.reportDetails.lstReportObjectOnColumn.length > 0
          && this.config.reportDetails.lstReportObjectOnRow.length == 0
          && this.config.reportDetails.lstReportObjectOnValue.length > 0) ?
        (this._commUtil.getWidgetType(this.config.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.Chart ?
          (this.cardPagination.totalItems > 2 || !(this.cardPagination.totalItems <= this.cardPagination.pageSize)) :
          !(this.cardPagination.totalItems <= this.cardPagination.totalPages)) : false;
    if (this.config.changeDetectionMutation.setDashboardCardFooterState)
      this.config.changeDetectionMutation.setDashboardCardFooterState();
  }

  /**
   * Author : Sachin Mishra
   * @param _daxResponse = Impure function working as the reference for the Flex Grid Page data
   * @param isGridInitializing  = boolean value to determine the Grid is Initializing,The motive is to use
   * 	when we would like to know the First time Grid Intialization.Please use variable causally becasue
   * 	lots of pagination is handling is based upon that.
   */

  private flexGridPagination(_daxResponse: any, isGridInitializing: boolean = true) {
    if (isGridInitializing) {
      this.setDefaultPaginationConfig(_daxResponse);
    }
    _daxResponse = this.getWijmoFlexGridData(null, _daxResponse);
    if (_daxResponse.Data.length <= _daxResponse.PageSize - 1)
      this.cardPagination.pageData.push(_daxResponse.Data);
    else
      this.cardPagination.pageData.push(_daxResponse.Data.splice(0, _daxResponse.Data.length - 1));
    this.updateFlexGridData();
  }

  /**
   * Author : Sachin Mishra
   * @param _daxResponse = Impure function working as the reference for the Flex Grid Page data
   */
  private chartPagination(_daxResponse: any) {
    this.setDefaultPaginationConfig(_daxResponse);
  }

  /**
   * The Code has been written only for the click event attaching using ItemFormatte for the
   * Flex Directive.I request you make the seperate method for the other events such as mousedown,mouseover.
   * @param _wijmoHTEvent = This basically reading the Wijmo Hit Test Event
   */
  public driveOnFlex(_wijmoHTEvent: any) {
    if (this.config.reportDetails.lstReportObjectOnRow.length === 0
      && this.config.reportDetails.lstReportObjectOnColumn.length === 0
      && this.config.reportDetails.lstReportObjectOnValue.length !== 0) {
      this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_NOT_FACILITATE);
    }
    else {
      this._commUtil.checkAllWidgetLoaded().then((_response) => {
        if (_response) {
          let mappingPresentForRO: boolean = true;
          const _driveROConfig: Array<any> = [];
          //Variable to check whether the user has cliked on some other RO than multiselect/year/date
          let checkDriveClickOnSupportedDriveRO: boolean = false;
          // const _selectObj = event.grid.collectionView._view[event.event.row];
          const _selectObj = this.cardPagination.pageData[this.cardPagination.currentPage][_wijmoHTEvent.row];
          const metadataReportDetails = Object.assign({}, this.config.reportDetails);
          //Removing the check of Single data source to facilitate drive in Cross suite view.
          if (this._commUtil.hasMinimumActiveWidgetInView()) {
            each(this._commUtil.getCombineColumnValueRowRO(metadataReportDetails), (_value: any, _key: any) => {
              if (_value.reportObjectType === DashboardConstants.ReportObjectType.Attribute) {
                let _roObj: any = {
                  reportObjectType: _value.reportObjectType,
                  reportObjectId: _value.reportObjectId,
                  reportObjectName: _value.reportObjectName,
                  reportObjectDriveValue: _selectObj[_value.reportObjectName]
                }
                _driveROConfig.push(_roObj);
              }
            });
            //Checking if the mapping object is present for all the RO on which driving is being done.
            if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
              for (let i = 0; i < _driveROConfig.length; i++) {
                this._commUtil.createDriveFilterForCrossSuiteView(this.config, _driveROConfig[i], this._dashboardCommService.relationShipObjectList);
                if (!this._commUtil.isNune(_driveROConfig[i].RelationObjectTypeId)) {
                  mappingPresentForRO = false;
                  break;
                }
              }
            }
            //Check filterType of the RO.
            each(this.config.reportDetails.lstReportObjectOnRow, (_value: any, _index: number) => {
              checkDriveClickOnSupportedDriveRO = this._dashboardDriveService.driveROObjectCondCheck(this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource), [_value])
            });
            //If mapping is present for all the RO proceed with drive.
            if (mappingPresentForRO && !checkDriveClickOnSupportedDriveRO) {
              if (this.flexDriveEvent == undefined) {
                this.flexDriveEvent = _wijmoHTEvent.grid.rows[_wijmoHTEvent.row]._data._id;
                _wijmoHTEvent.grid.rows.map((_value: any, _key: any) => {
                  if (this.flexDriveEvent === _value._data._id) {
                    _value.cssClass = 'selected-grid-cell';
                  }
                  else {
                    _value.cssClass = 'sel-grid-cell-opacity'
                  }
                });
              }
              else {
                _wijmoHTEvent.grid.rows.map((_value: any, _key: any) => { _value.cssClass = '' });
                if (this.flexDriveEvent == _wijmoHTEvent.grid.rows[_wijmoHTEvent.row]._data._id) {
                  this.flexDriveEvent = undefined;
                }
                else {
                  //event.grid.rows[event.row].cssClass = "selected-grid-cell";
                  this.flexDriveEvent = _wijmoHTEvent.grid.rows[_wijmoHTEvent.row]._data._id;
                }
              }
              this.UpdateFlexGridOpacity();
              this.config.subscriptions.next(
                {
                  actionId: DashboardConstants.FilterIdentifierType[DashboardConstants.FilterIdentifierType.DriveFilter],
                  cardId: this.config.cardId,
                  event: _driveROConfig,
                  widgetDataType: this.config.widgetDataType
                }
              );
            }
            //Now here we show the toast message and not in the service for flex.
            else if (!mappingPresentForRO && this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
              this._commUtil.getToastMessage('The Cross Suite Relation Object Mapping are Missing.');
            }
            //If mapping is not present for any one of the RO restrict the drive.
            else {
              this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
            }
          }
        }
      });
    }
  }


  /**
   * This beasically reading the flex directive events invoked by Wijmo Flex Grid
   * @param event  = Flex Directive Emiting the Events
   */
  public flexEvents(event: any) {
    let that = this;
    if (event.type === DashboardConstants.EventType.FlexGrid.ItemFormatter) {
      that.flexGridEvent = event;
    }

    switch (event.type) {
      case DashboardConstants.EventType.FlexGrid.Render:
        this.positioning();
        break;
      case DashboardConstants.EventType.FlexGrid.Selection:
        if (this._dashboardCommService.oppFinderState.oppFinderFlag ||
          this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag)
          this.config.subscriptions.next({
            actionId: DashboardConstants.EventType.FlexGrid.FlexEvents,
            cardId: this.config.cardId,
            event: event,
            config: this.config
          });
        break;
      case DashboardConstants.EventType.FlexGrid.Update:
        break;
      case DashboardConstants.EventType.FlexGrid.ItemFormatter:
        {
          //START: adding link in grid
          var flex = event.grid;
          var col = flex.columns[event.c];
          var row = flex.columns[event.r];
          if (event.grid.cells.cellType == CellType.Cell) {
            if (col.dataType == DashboardConstants.FilterType.Date) {
              if (!isNaN(Date.parse(event.cell.innerHTML)) && !event.cell.className.includes('wj-header')) {
                event.cell.innerHTML = new Date(event.cell.innerHTML).toLocaleDateString();
              }
            }
          }

          var res = event.cell.innerHTML.split("^");

          if (res.length > 1) {
            event.cell.innerHTML = `<a href="#">` + res[0] + `</a>`;
          }
          //END: adding link in grid
          this.config.reportDetails.reportRequestKey = this.config.reportRequestKey;
          this.config.reportDetails.pageIndex = this.config.pageIndex;
          this._conFormatingService.formatingOnFlexGrid(event, this.config.reportDetails);
          event.cell.addEventListener('click', (e) => {
            var _wijHitTest = that.flexGridEvent.grid.hitTest(e);
            if (!that._dashboardCommService.oppFinderState.oppFinderFlag)
              this._dashboardCommService.openCellLinkInNewTab(_wijHitTest.panel.getCellData(_wijHitTest.row, _wijHitTest.col));
            if (_wijHitTest.panel == that.flexGridEvent.grid.cells) {

              if (!that._dashboardCommService.oppFinderState.oppFinderFlag)
                that.driveOnFlex(_wijHitTest);
              else that.config.subscriptions.next(
                {
                  actionId: DashboardConstants.EventType.Selection,
                  cardId: that.config.cardId, event: event, config: that.config
                });
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          }, true);
          if (that._dashboardCommService.oppFinderState.oppFinderFlag || that._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag)
            this.config.subscriptions.next({
              actionId: DashboardConstants.EventType.FlexGrid.FlexEvents,
              cardId: this.config.cardId,
              event: event,
              config: this.config
            });
        }
        break;
      case DashboardConstants.EventType.FlexGrid.SortingColumn:
        break;
      case DashboardConstants.EventType.AutoScrollEvents.AutoKeyUp:
        break;
      case DashboardConstants.EventType.FlexGrid.ResizingColumn: {
        let resizedColumnName: string = "",
          resizedColumnWidth: number = -1;
        let minWidth: number = AnalyticsCommonConstants.WijmoConfiuration.WijmoGridMinWidth;

        let panel = event.event.panel, col = event.event.col;
        resizedColumnName = panel.columns[col].binding;
        if (panel.columns[col].width > minWidth) {
          resizedColumnWidth = panel.columns[col].width;
        } else {
          resizedColumnWidth = panel.columns[col].width = minWidth;
        }
        this.columnResize(resizedColumnName, resizedColumnWidth);
      }
        break;
      default:
        break;
    }
  }
  //#endregion

  public generateChart(reportDetailsMetaData: any, response: any): void {
    const graphConfig = Object.assign({}, this.config);
    graphConfig.reportDetails = reportDetailsMetaData;
    switch (this.config.widgetDataType) {
      case DashboardConstants.WidgetDataType.Chart:
        {
          this.chartPagination(response);
          this.config.config = AnalyticsUtilsService.GetWidgetForChart(graphConfig, response.Data, 0);
          if (this.config.config.chartAPI) {
            this.config.config.chartAPI.updateChart(this.config.config);
          }
        }
        break;
      case DashboardConstants.WidgetDataType.Flex:
        {
          this.flexGridPagination(response, true);
          this.config.config = this.generateWijmoFlexGridConfig(graphConfig,
            this.cardPagination.pageData[this.cardPagination.currentPage]);
        }
        break;
      case DashboardConstants.WidgetDataType.Olap:
        this.setDashboardCardMessage(DashboardConstants.UIMessageConstants.STRING_DOESNOT_SUPPORT_GRID_TYPE);
        break;
      case DashboardConstants.WidgetDataType.SummaryCard:
        this.config.config = this.summaryCardConfig(response, reportDetailsMetaData)
        break;
      case DashboardConstants.WidgetDataType.MapChart:
        {
          this.chartPagination(response);
          this.config.config = AnalyticsUtilsService.GetWidgetForChart(graphConfig, response.Data, 0);
          if (this.config.config.chartAPI) {
            setTimeout(async () => {
              this.config.config.chartAPI
                .initializeAzureMaps()
                .then((_response: any) => {
                  if (_response) this.positioning();
                });
            }, 100);

          }
        }
        break;
      case DashboardConstants.WidgetDataType.GuageChart:
        {
          this.chartPagination(response);
          var _resMultiGuage = [];
          response.Data.forEach(obj => {
            _resMultiGuage.push(AnalyticsUtilsService.GetWidgetForChart(graphConfig, obj, 0));
          })
          this.config.config = _resMultiGuage;
          this.config["config"]["graphTitle"] = this.config.config[0] ? this.config.config[0].graphTitle : "";
          this.config.config.map(obj => obj.graphTitle = "")
          //setTimeout(() => {
          //  if (this.config.reflowMultipleGaugeChart)
          //    this.config.reflowMultipleGaugeChart();
          //}, 600);
        }
        break;
    }
    this.initiateGenerateChart();
    this.setOpportuntiyFinderSpecificData(response);
  }

  private initiateGenerateChart() {
    if (!this.initDone) {
      this.initiate();
    }
    /**
     *  This is the specific condition handling for the CONCO stragtegy for  Opportunity Finder to implement Drive and Drill
     *  when Change Detection is off for the Dashboard Card Component.
     */
    else if (this.initDone && this._dashboardCommService.oppFinderState.oppFinderFlag) {
      this.initiate();
    }
    else if (this.initDone && this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag) {
      this.initiate();
    }
    else {
      //Invoking the Change Detection and Update Chart Options for the Components
      if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart) {
        this.config.config.chartAPI.updateChart(this.config.config);
      }
      else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
        this.config.changeDetectionMutation.setMultiGaugeChartComponentState();
      }
      else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard
        && this.config.reportDetails.lstReportObjectOnValue.length === 1) {
        this.config.changeDetectionMutation.setSummaryCardState();
        setTimeout(async () => {
          if (this.config.changeDetectionMutation.applyFormattingOnSummaryCard)
            this.config.changeDetectionMutation.applyFormattingOnSummaryCard();
          // this.config.renderMultiGuageChart();
        }, 20);
      }
    }
    this._loaderService.hideCardLoader(this.config.cardId);
    this.updateDashboardCardFooterRefObj("graphTitle", this.config.config.graphTitle);
  }

  /**
   * This is most opportunity finder data specific data manipulation not including in generic service call
   * @param response = Method is expecting the first level of response from generate report
   * 
   */
  private setOpportuntiyFinderSpecificData(response: any) {

    if (
      this._dashboardCommService.oppFinderState.oppFinderFlag &&
      this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name &&
      this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex) {

      let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, {
        OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name
      });
      if (masterData) {
        if (!masterData.AdditionalProps[0].SpendUSDObjectId) {
          masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps)
        }
        let widgetConf: any =
          this.config.reportDetails.lstReportObjectOnValue.filter(e => e.reportObjectId.toLowerCase() == masterData.AdditionalProps[0].SpendUSDObjectId.toLowerCase())
        let SpendUsd = response.GrandTotal[widgetConf[0].reportObjectName] || null;
        if (SpendUsd) {
          this.OppSpendSRS = SpendUsd;
        }
      }
    }
  }

  public updateDashboardCardFooterRefObj(propertyName: string, propertyValue: any) {
    if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
      this.tmpdashboardCardFooterRef.context.config.config[propertyName] = propertyValue;
      setTimeout(async () => {
        this._dashboardCommService.calculateBreadcrumbWidth(this.breadCrumbList, this.config, this.uiConfig, true)
      }, 100);
      this.config.changeDetectionMutation.setDashboardCardFooterState();
    }
  }

  public updateDashboardCardHeaderRefObj(propertyName: string, propertyValue: any) {
    if (this.config.changeDetectionMutation.setDashboardCardHeaderState) {
      this.tmpdashboardCardHeaderRef.context.config.config[propertyName] = propertyValue;
      this.config.changeDetectionMutation.setDashboardCardHeaderState();
    }
  }

  private generateChartYAxisMinMax(sliderResponse: any) {

    const thisConfigRef = this;
    if (sliderResponse.toString().toLowerCase() !== "error".toLowerCase()) {
      const reportDetails: any = thisConfigRef.config.reportDetails;
      this._dashboardCommService.resetValues(['chartMinMax'], [[]], this.config);

      if (this._commUtil.enableFeatureFor(reportDetails.reportViewType, DashboardConstants.EnableFeature.MinMaxValue)
        && this.config.chartMinMax.length == 0 &&
        //Disabling the chartMinMax for the Stack Column Chart and Stack Bar Chart in case When user has created the report
        //with Constraint as i.e. 1 Column,1 Value and 0 Rows
        // Otherwise chartMinMax should be displayed on the graph
        !(
          (
            reportDetails.reportViewType == DashboardConstants.ReportViewType.stColumn ||
            reportDetails.reportViewType == DashboardConstants.ReportViewType.StackedBarChart
          )
          && reportDetails.lstReportObjectOnColumn.length == 1
          && reportDetails.lstReportObjectOnValue.length == 1
          && reportDetails.lstReportObjectOnRow.length == 0
        )
      ) {
        if (reportDetails.reportViewType !== DashboardConstants.ReportViewType.MultiAxisChart) {
          const _tempChartMinMax = {
            minYaxis: [],
            maxYaxis: [],
            reportObjectName: ''
          };

          sliderResponse.forEach(element => {
            const reportObject: any = find(this._commUtil.getCombineColumnValueRowRO(reportDetails), { displayName: element.reportObjectName });
            const configVal = reportObject != undefined ? this._numberFormating.GetWijmoConfigurationFormat(reportObject.ConfigurationValue, reportObject.filterType) : undefined;
            if ((configVal != undefined && configVal[0] == 'p') || reportObject && reportObject.formatKey == DashboardConstants.CommonConstants.Percent) {
              _tempChartMinMax.minYaxis.push(parseFloat(element.min) * 100);
              _tempChartMinMax.maxYaxis.push(parseFloat(element.max) * 100);
              _tempChartMinMax.reportObjectName = element.reportObjectName;
            }
            else {
              _tempChartMinMax.minYaxis.push(Math.floor(parseFloat(element.min)));
              _tempChartMinMax.maxYaxis.push(Math.ceil(parseFloat(element.max)));
              _tempChartMinMax.reportObjectName = element.reportObjectName;
            }
          });
          // finding the min and max out of multiple Y-axis
          _tempChartMinMax.minYaxis[0] = Math.min.apply(Math, _tempChartMinMax.minYaxis);
          _tempChartMinMax.maxYaxis[0] = (this.config.reportDetails.reportViewType == DashboardConstants.ReportViewType.stColumn || this.config.reportDetails.reportViewType == DashboardConstants.ReportViewType.StackedBarChart) ? sum(_tempChartMinMax.maxYaxis) : Math.max.apply(Math, _tempChartMinMax.maxYaxis);
          this.config.chartMinMax.push({
            min: _tempChartMinMax.minYaxis[0],
            max: _tempChartMinMax.maxYaxis[0],
            reportObjectName: _tempChartMinMax.reportObjectName
          })
        }
        else {
          //updating min and max on Y axis for Percent Reporting objects and report objects with format Key 'p'
          this._dashboardCommService.resetValues(['chartMinMax'], [sliderResponse], this.config);
          thisConfigRef.config.chartMinMax.forEach(element => {
            const reportObject: any = find(this._commUtil.getCombineColumnValueRowRO(reportDetails), {
              displayName: element.reportObjectName as any
            });
            const configVal = reportObject != undefined ? this._numberFormating.GetWijmoConfigurationFormat(reportObject.ConfigurationValue, reportObject.filterType) : undefined;
            if ((configVal != undefined && configVal[0] == 'p') || reportObject && reportObject.formatKey == DashboardConstants.CommonConstants.Percent) {
              element.max = element.max * 100;
              element.min = element.min * 100;
            }
          });
        }
      }
    }
    else {
      this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.ErrorOccured));
      this._loaderService.hideSliderLoader(this.config.cardId);
    }
  }

  public previousClick() {
    this.cardPagination.currentPage -= 1;
    this.cardPagination.isNext = !this.cardPagination.isNext ? !this.cardPagination.isNext : this.cardPagination.isNext;
    if (
      this.cardPagination.pageData[this.cardPagination.currentPage] !== undefined &&
      this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex
    ) {
      this.updateFlexGridData();
      this.UpdateFlexGridOpacity();
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart) {
      this.config.pageIndex -= 1;
      this.getPaginatedRecords();
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap) {
      this.setPageIndexForOLAP('-');
      this.generateOLAPPagination();
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
      this.config.pageIndex -= 1;
      this.getPaginatedRecords();
    } else {
      this.cardPagination.isPrev = false;
    }
    if (this.cardPagination.currentPage == 0) this.cardPagination.isPrev = false;
  }

  public nextClick() {
    this.cardPagination.currentPage += 1;
    this.cardPagination.isPrev = true;
    this.cardPagination.isNext = (this.cardPagination.currentPage + 1) == this.cardPagination.endPage ? false : true;
    if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex) {
      if (this.cardPagination.pageData[this.cardPagination.currentPage] != undefined) {
        this.updateFlexGridData();
        this.UpdateFlexGridOpacity();
      }
      else {
        this.config.pageIndex += 1;
        this.getPaginatedRecords();
      }
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart) {
      this.config.pageIndex += 1;
      this.getPaginatedRecords();
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap) {
      this.setPageIndexForOLAP('+');
      this.generateOLAPPagination();
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
      this.config.pageIndex += 1;
      this.getPaginatedRecords();
    }
  }

  private getPaginatedRecords() {
    const thisRef = this;
    this._loaderService.showCardLoader(this.config.cardId);
    const reportDetailsMetaData = Object.assign({}, this.config.reportDetails);
    const graphConfig = Object.assign({}, this.config);
    this.generateReportDetailMetaData(reportDetailsMetaData);
    graphConfig.reportDetails = reportDetailsMetaData;
    const reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData)
    reportDetailsData.pageIndex = this.config.pageIndex;
    let enableFeatureForTwentyRows = this._commUtil.enableFeatureFor(reportDetailsData.reportViewType, DashboardConstants.EnableFeature.TwentyRows);
    AnalyticsUtilsService.setPageSize(reportDetailsData, enableFeatureForTwentyRows);
    this.manageSubscription$.add(
      this._analyticsCommonDataService
        .generateReport(reportDetailsData)
        .subscribe((response: any) => {
          if (this.getValidatedDAXResponse(response)) {
            if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Chart) {
              this.config.config = AnalyticsUtilsService.GetWidgetForChart(graphConfig, response.Data, 0);
              if (this.config.config.chartAPI) {
                this.config.config.chartAPI.updateChart(this.config.config);
              }
              if (this.config.driveConfig.isDriver) {
                thisRef.config.subscriptions.next(
                  {
                    actionId: DashboardConstants.EventType.SetOpacity,
                    cardId: thisRef.config.cardId,
                    event: {
                      data: {
                        category: {
                          data: []
                        }
                      }
                    }
                  });
              }
            }
            else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.Flex) {
              this.cardPagination.showPagination = true;
              this.flexGridPagination(response, false);
              this.UpdateFlexGridOpacity();
            }
            else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
              var _resMultiGuage = [];
              response.Data.forEach(obj => {
                _resMultiGuage.push(AnalyticsUtilsService.GetWidgetForChart(graphConfig, obj, 0));
              })
              thisRef.config.config = _resMultiGuage;
              thisRef.config["config"]["graphTitle"] = thisRef.config.config[0] ? thisRef.config.config[0].graphTitle : "";
              thisRef.config.config.map(obj => obj.graphTitle = "")
              setTimeout(() => {
                this.config.renderMultiGuageChart();
              }, 500);
              if (this.config.driveConfig.isDriver) {
                thisRef.config.subscriptions.next(
                  {
                    actionId: DashboardConstants.EventType.SetOpacity,
                    cardId: thisRef.config.cardId,
                    event: {
                      data: {
                        category: {
                          data: []
                        }
                      }
                    }
                  });
              }
            }
          }
        }, (error: any) => {
          this.config.cardLoader = false;
        })
    );
  }

  public getSliderWidgetConfig() {
    let sliderConfig = [{
      name: "Category Spend",
      min: -1000,
      max: 90000,
      range: { from: -1000, to: 90000 },
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
      }
    },
    {
      name: "Supplier Count",
      min: 1,
      max: 100,
      range: { from: 1, to: 100 },
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
      }
    }];
    return sliderConfig;
  }

  public setDashboardCardMessage(msg) {
    if (this.config.reportDetails.reportViewType != DashboardConstants.ReportViewType.SummaryCard) {
      this.cardTypeContainerRef.clear();
      this.cardTypeContainerRef.createEmbeddedView(this.widgetCardTemplateRef, { $implicit: this.config });
      let thisRef = this;
      setTimeout(async () => {
        if (thisRef.widgetContainerRef) {
          thisRef.widgetContainerRef.clear();
          thisRef.widgetContainerRef.createEmbeddedView(thisRef.widgetMessageRef, {
            $implicit: msg
          });
          thisRef.loadDashboardCardHeader();
          thisRef.setState();
        }
      }, 100);
      this.cardPagination.showPagination = false;
      if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
        this.config.changeDetectionMutation.setDashboardCardFooterState();
      }
      this.positioning();
    }
  }

  //Configure report details object to get min/max value
  public SetReportDetailMetaDataForMinMax(reportDetailsMetaData: any, sliderFilterReportObj) {
    let reportDetailClone = JSON.parse(JSON.stringify(reportDetailsMetaData))
    reportDetailClone.isGrandTotalRequired = false;
    reportDetailClone.isSubTotalRequired = false;
    reportDetailClone.isLazyLoadingRequired = false;
    reportDetailClone.lstReportObjectOnValue = new Array<ReportObject>();
    reportDetailClone.lstReportSortingDetails = new Array<ReportSortingDetails>();
    reportDetailClone.lstReportObjectOnRow = [];
    reportDetailClone.lstReportObjectOnRow.push(this.config.reportDetails.lstReportObjectOnRow[this.config.rowIndex]);;

    // reportDetailClone.lstReportObjectOnColumn.forEach(reporObjOnColumn => {
    //   // Considering it as a Flat Grid and fetching out Min Max Value.
    //   reporObjOnColumn.layoutArea = AnalyticsCommonConstants.ReportObjectLayoutArea.Rows;
    // })

    reportDetailClone.lstReportObjectOnColumn.length = reportDetailClone.lstReportObjectOnColumn.length > 0 ? 1 : 0;
    reportDetailClone.lstReportObjectOnRow.length = reportDetailClone.lstReportObjectOnRow.length > 0 ? 1 : 0;

    //Fill Filter list for Min/Max: Excluding between filter
    var filterListWithoutBetween = new Array<SavedFilter>();
    reportDetailClone.lstFilterReportObject.forEach(repoFilterObj => {
      if (!repoFilterObj.isSliderWidgetFilter && repoFilterObj.filterCondition.condition != AnalyticsCommonConstants.ReportObjectOperators.Between) {
        filterListWithoutBetween.push(repoFilterObj);
      }
    });
    reportDetailClone.lstFilterReportObject = filterListWithoutBetween;

    // Fill Slider Filder's Report Object in Sort-list and in Value-List.
    sliderFilterReportObj.forEach(savedFilter => {
      //As Measure is only applicable for Slider Filter setting Layout Area to Value.
      savedFilter.reportObject.layoutArea = AnalyticsCommonConstants.ReportObjectLayoutArea.Values;
      let reportSortingDetails = new ReportSortingDetails();
      reportSortingDetails.reportObject = savedFilter.reportObject;
      reportSortingDetails.sortType = AnalyticsCommonConstants.SortType.Asc;
      reportDetailClone.lstReportSortingDetails.push(reportSortingDetails);
      reportDetailClone.lstReportObjectOnValue.push(savedFilter.reportObject);
    });

    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailClone);
    let enableFeatureForTwentyRows = this._commUtil.enableFeatureFor(reportDetailsData.reportViewType, DashboardConstants.EnableFeature.TwentyRows);
    AnalyticsUtilsService.setPageSize(reportDetailsData, enableFeatureForTwentyRows);
    return reportDetailsData;
  }

  public openViewAppliedFilter(widgetConfig) {
    this.viewAppliedFilterPopupConfig = {
      api: {
        closePopup: () => { this.viewAppliedFilterPopupClose(); },
        doneClick: () => { this.viewAppliedFilterPopupDone(); },
        cancelClick: () => { this.viewAppliedFilterPopupCancel(); }
      },
      moduleType: DashboardConstants.ModuleType.DASHBOARD,
      appliedFilters: widgetConfig.reportDetails.lstFilterReportObject
    };
    this.popupContainerRef.clear();
    this.popupContainerRef.createEmbeddedView(this.outletTemplateRef, {
      manifest: 'view-applied-filter-popup/view-applied-filter-popup',
      config: { config: this.viewAppliedFilterPopupConfig }
    });
  }

  public viewAppliedFilterPopupClose() {
    this.popupContainerRef.detach();
    this.popupContainerRef.clear();
  }

  public viewAppliedFilterPopupDone() {
    this.viewAppliedFilterPopupClose();
  }

  public viewAppliedFilterPopupCancel() {
    this.viewAppliedFilterPopupClose();
  }

  public summaryCardConfig(_response: any, _reportDetailsMetaData: any) {
    let percentage = "";
    if (_reportDetailsMetaData.lstReportObjectOnRow.length)
      percentage = _response.Data.length ? (this._commUtil.isNune(_response.Data[0][AnalyticsCommonConstants.PercentageEnabledSummaryCard.STRING_PERCENTAGE_FOR_SUMMARY_CARD + _reportDetailsMetaData.lstReportObjectOnRow[0].reportObjectName]) && this._commUtil.isNune(_response.Data) ? (_response.Data[0][AnalyticsCommonConstants.PercentageEnabledSummaryCard.STRING_PERCENTAGE_FOR_SUMMARY_CARD + _reportDetailsMetaData.lstReportObjectOnRow[0].reportObjectName]).toFixed(2) : "") : "";
    else if (_reportDetailsMetaData.lstReportObjectOnColumn.length)
      percentage = _response.Data.length ? (this._commUtil.isNune(_response.Data[0][AnalyticsCommonConstants.PercentageEnabledSummaryCard.STRING_PERCENTAGE_FOR_SUMMARY_CARD + _reportDetailsMetaData.lstReportObjectOnColumn[0].reportObjectName]) && this._commUtil.isNune(_response.Data) ? (_response.Data[0][AnalyticsCommonConstants.PercentageEnabledSummaryCard.STRING_PERCENTAGE_FOR_SUMMARY_CARD + _reportDetailsMetaData.lstReportObjectOnColumn[0].reportObjectName]).toFixed(2) : "") : "";
    let cardValueSign = _response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName] < 0 ? '-' : '';
    return {
      showKebabMenusOption: this.config.uiConfig.showKebabMenusOption,
      showTitle: this.config.uiConfig.showTitle,
      showPercentageValue: this.config.uiConfig.showPercentageSummaryCard && this.IsEnablePercantageValue(_reportDetailsMetaData),
      editDescription: false,
      showEdit: false,
      configFormat: this._numberFormating.GetWijmoConfigurationFormat(_reportDetailsMetaData.lstReportObjectOnValue[0].ConfigurationValue, _reportDetailsMetaData.lstReportObjectOnValue[0].filterType),
      data: {
        cardValueSign: cardValueSign,
        valueWithoutNumberFormatting: _response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName],
        value: this.getSummaryCardValue(_response, _reportDetailsMetaData),
        measure: _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === AnalyticsCommonConstants.CommonConstants.Percent || _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === "" ? "" : AnalyticsCommonConstants.FormatType[_reportDetailsMetaData.lstReportObjectOnValue[0].formatKey],
        description: (!this._commUtil.isEmptyObject(this.config.config) && this._commUtil.isNune(this.config.config.data
        ) && this._commUtil.isNune(this.config.config.data.description)) ? this.config.config.data.description : _reportDetailsMetaData.reportDescription,
        titleValue: _reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName + ": " + cardValueSign + this.getSummaryCardValue(_response, _reportDetailsMetaData),
        percentageOutOfName: _reportDetailsMetaData.lstReportObjectOnValue[0].displayName,
        percentage: percentage
      },
      message: this.config.reportDetails.lstReportObjectOnValue.length != 1 ?
        DashboardConstants.UIMessageConstants.STRING_DATANOT_SUMMARYCARD : '',
      kebabMenuOptions: this.config.uiConfig.kebabMenuOptions,
      smallSummaryCard: false
    };
  }
  private IsEnablePercantageValue(_reportDetailsMetaData: any): boolean {
    return (
      _reportDetailsMetaData.lstReportObjectOnValue.length == 1 &&
      _reportDetailsMetaData.lstReportObjectOnRow.length == 1 &&
      _reportDetailsMetaData.lstReportObjectOnColumn.length == 0
    ) || (
        _reportDetailsMetaData.lstReportObjectOnValue.length == 1 &&
        _reportDetailsMetaData.lstReportObjectOnColumn.length == 1 &&
        _reportDetailsMetaData.lstReportObjectOnRow.length == 0
      );
  }
  public onKeyupAutocomplete($event) {
    this.config.subscriptions.next({
      actionId: DashboardConstants.EventType.AutoScrollEvents.AutoKeyUp,
      cardId: this.config.cardId,
      event: $event,
      config: this.config
    });
  }

  public onSelectAutocomplete($event) {
    this.config.subscriptions.next({
      actionId: DashboardConstants.EventType.AutoScrollEvents.OnSelect,
      cardId: this.config.cardId,
      event: $event,
      config: this.config
    });
    setTimeout(async () => {
      this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], this.config);
      this.initializeWidget(this.config.reportDetails);
    }, 100);
  }

  private getSummaryCardValue(_response: any, _reportDetailsMetaData: any): string {
    let format = this._numberFormating.GetWijmoConfigurationFormat(_reportDetailsMetaData.lstReportObjectOnValue[0].ConfigurationValue, _reportDetailsMetaData.lstReportObjectOnValue[0].filterType);
    const _formatKeySign: string = _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey;
    let currenyBeforeAmount = this._numberFormating.GetCurrencySymbolLocation();
    let reportObjectValue = ((format != undefined && format[0] == 'p') || _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey == AnalyticsCommonConstants.CommonConstants.Percent) ? (_response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName]) * 100 : _response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName], value;
    // Multiplying by -1 to avoid negative sign in summary card widget
    reportObjectValue = reportObjectValue < 0 ? reportObjectValue * -1 : reportObjectValue;
    value = (_formatKeySign != "" && _formatKeySign != null && _formatKeySign != DashboardConstants.CommonConstants.Percent && format == "" ? DashboardConstants.FormatType[_reportDetailsMetaData.lstReportObjectOnValue[0].formatKey] : "")
      + AnalyticsUtilsService.FormatChartTooltip(reportObjectValue, format)
      + (_formatKeySign != "" && _formatKeySign != null && _formatKeySign && format == "" && (_formatKeySign == DashboardConstants.CommonConstants.Percent || !currenyBeforeAmount) ? DashboardConstants.FormatType[_formatKeySign] : "");
    return value;
  }
  private generateFlexReportSortingMetaData(reportDetailsMetaData: any) {
    /**
     *  applying the sort in case of flex grid
     *  Sequnce of Sorting Objects Code Written : Metric RO ==> Without Metric RO ==> Period RO
     */
    if (this.config.reportDetails.reportViewType === DashboardConstants.ReportViewType.Flex) {
      // preparing the default sort in case does not cointain any sorting details
      if (reportDetailsMetaData.lstReportSortingDetails.length == 0) {
        const _combineROObjects = this._commUtil.getCombineColumnValueRowRO(reportDetailsMetaData);
        let sortOrder = reportDetailsMetaData.lstReportSortingDetails.length > 0 ?
          reportDetailsMetaData.lstReportSortingDetails[reportDetailsMetaData.lstReportSortingDetails.length - 1].sortOrder : 0;
        // Extracting the Metric Extraction from the Combined Objects
        const _allMetricExtraction = _combineROObjects.filter((_value: any, _key: any) => {
          return _value.layoutArea === DashboardConstants.ReportObjectLayoutArea.Values
        });
        // Extracting the Period RO List from Combined Objects
        const periodROList = _combineROObjects.filter((_wPROVal: any, _wPROKey: any) => {
          return _wPROVal.filterType >= DashboardConstants.FilterType.Date && _wPROVal.filterType <= DashboardConstants.FilterType.QuarterYear;
        });
        // Extracting the All Reporting Objects aprt from Period RO List
        const roWithOutPeriodObjects = _combineROObjects.filter((_woPROVal: any, _woPROKey: any) => {
          return _woPROVal.layoutArea !== DashboardConstants.ReportObjectLayoutArea.Values
            && (_woPROVal.filterType < DashboardConstants.FilterType.Date || _woPROVal.filterType > DashboardConstants.FilterType.QuarterYear)
        });

        // Extracting the Metric Extraction from the Combined Objects
        _allMetricExtraction.forEach((_allMVal: any, __allMKey: any) => {
          const sortObject = new ReportSortingDetails();
          sortObject.reportObject = _allMVal;
          sortObject.sortOrder = ++sortOrder;
          sortObject.sortType = DashboardConstants.SortType.Desc
          reportDetailsMetaData.lstReportSortingDetails.push(sortObject);
        });

        // Making the Insertion of sorting without Period RO i.e. Common RO
        roWithOutPeriodObjects.forEach((_woPROVal: any, _woPROKey: any) => {
          const sortObject = new ReportSortingDetails();
          sortObject.reportObject = _woPROVal;
          sortObject.sortOrder = ++sortOrder;
          sortObject.sortType = DashboardConstants.SortType.Asc
          reportDetailsMetaData.lstReportSortingDetails.push(sortObject);
        });

        // Making the Insertion of sorting Period RO i.e. Non Common RO
        periodROList.forEach((_wPROVal: any, _wPROKey: any) => {
          const sortObject = new ReportSortingDetails();
          sortObject.reportObject = _wPROVal;
          sortObject.sortOrder = ++sortOrder;
          sortObject.sortType = DashboardConstants.SortType.Asc
          reportDetailsMetaData.lstReportSortingDetails.push(sortObject);
        });
      }
    }
  }


  private olapEvents() {
    const thisRef = this;
    this.manageSubscription$.add(
      this._olapGridDireService.olapGridService$
        .subscribe((wijmoEvents: any) => {
          if (
            this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap &&
            this.config.cardId === wijmoEvents.PivotEngineId
          ) {
            thisRef.catchOlapGridEvent(wijmoEvents);
          }
        })
    );
  }

  private olapOppfinderEvents() {
    const thisRef = this;
    this.manageSubscription$.add(
      this.oppfinderOlapService$
        .subscribe((wijmoEvents: any) => {
          this.olapSuccessService(wijmoEvents)
        })
    );
  }

  private catchOlapGridEvent(wijmoEvents: any) {
    const thisRef = this;
    if (wijmoEvents.EventType === DashboardConstants.EventType.Olap.OlapEvent.FormatItem) {
      thisRef.olapGridEvent = wijmoEvents.e;
    }
    switch (wijmoEvents.EventType) {
      case DashboardConstants.EventType.Olap.OlapHttpStatus.Success:
        {
          //Methods handle if the Olap Service Call gets Executed Successfully
          this.olapSuccessService(wijmoEvents);
        }
        break;
      case DashboardConstants.EventType.Olap.OlapHttpStatus.Error:
        {
          //Methods handle if the Olap Service Call get Executed with Errors.
          this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.ErrorOccured));
          this._loaderService.hideCardLoader(this.config.cardId);
        }
        break;
      case DashboardConstants.EventType.Olap.OlapEvent.FormatItem:
        {
          //START: adding link in grid
          var res = wijmoEvents.e.cell.innerText.split("^");

          if (res.length > 1) {

            //   //Disable Link on Olap grid
            wijmoEvents.e.cell.innerHTML = `<div style="display:table-cell;vertical-align:middle"><a href="#">` + res[0] + `</a></div>`;
            //   wijmoEvents.e.cell.innerHTML = res[0];
          }
          //END: adding link in grid
          //Performing the Formatting releated task on Format Items
          this._conFormatingService.formatingOnOlapGrid(wijmoEvents.s, wijmoEvents.e, this.config.reportDetails);
          wijmoEvents.e.cell.addEventListener('click', function (e) {
            let _wijHitTest: any = {};
            _wijHitTest = thisRef.olapGridEvent.panel.grid.hitTest(e);
            if (!thisRef._dashboardCommService.oppFinderState.oppFinderFlag)
              thisRef._dashboardCommService.openCellLinkInNewTab(_wijHitTest.panel.getCellData(_wijHitTest.row, _wijHitTest.col));
            if (thisRef.config.reportDetails.lstReportObjectOnColumn.length === 0) {
              thisRef.driveOnOLAP(_wijHitTest);
            }
            else {
              thisRef.driveOnCrossTabOLAP(_wijHitTest, thisRef.olapGridEvent);
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            // }
          }, true);
        }
        break;
      case DashboardConstants.EventType.Olap.OlapEvent.ShowSubTotal:
      case DashboardConstants.EventType.Olap.OlapEvent.CollapseClick:
        {
          if (this.config.driveConfig.isDriver) {
            this.removeDrive_cardAction(event);
            this.resetOLAPDriveValues();
            this.config.changeDetectionMutation.setDashboardCardHeaderState();
          }
        }
        break;
      case DashboardConstants.EventType.Olap.OlapEvent.ResizedColumn:
        {
          let resizedColumnName: string = "",
            resizedColumnWidth: number = -1;
          let minWidth: number = AnalyticsCommonConstants.WijmoConfiuration.WijmoGridMinWidth;
          let e = wijmoEvents.e, s = wijmoEvents.s;
          if (e.panel.cellType != AnalyticsCommonConstants.WijmoCellType.Cell) {
            resizedColumnName = e.panel.grid.collectionView.items[e.col]["$rowKey"].fieldNames[e.col];
          } else {
            var binding = e.panel.columns[e.col].binding.split(";");
            if (binding.length > s.engine.columnFields.length + 1) {
              resizedColumnName = binding[binding.length - 2].split(":")[0];
            }
            else {
              resizedColumnName = binding[0].split(":")[0];
            }
          }
          if (e.panel.columns[e.col].width > minWidth) {
            resizedColumnWidth = e.panel.columns[e.col].width;
          } else {
            resizedColumnWidth = e.panel.columns[e.col].width = minWidth;
            e.panel.grid.engine.fields.getField(resizedColumnName).width = minWidth;

          }
          this.columnResize(resizedColumnName, resizedColumnWidth)
        }
        break;
      default:
        return;
    }
  }

  public columnResize(resizedColumnName, resizedColumnWidth) {
    let lstReportObject = this._commUtil.getCombineColumnValueRowRO(this.config.reportDetails);
    let reportObject = lstReportObject.find((x: any) => x.displayName == resizedColumnName);
    if (reportObject != undefined) {
      reportObject.reportObjectWidth = resizedColumnWidth;
      this._dashboardCommService.setReportObjectWidthForPersistance(reportObject, this.config.reportDetails.reportDetailObjectId)
    }
  }
  //This is for driving on Non cross tab OLAP.

  public driveOnOLAP(wijmoObject: any) {
    if (this.config.reportDetails.lstReportObjectOnRow.length === 0
      && this.config.reportDetails.lstReportObjectOnColumn.length === 0
      && this.config.reportDetails.lstReportObjectOnValue.length !== 0) {
      this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_NOT_FACILITATE);
    }
    else {
      this._commUtil.checkAllWidgetLoaded().then((_response) => {
        if (_response) {
          //Verify if that the measure value can never be of any other type than number.
          if (//wijmoObject.cellType != DashboardConstants.WijmoCellType.Cell &&
            wijmoObject.cellType != DashboardConstants.WijmoCellType.TopLeft &&
            wijmoObject.cellType != DashboardConstants.WijmoCellType.ColumnHeader &&
            wijmoObject.panel.getCellElement(wijmoObject._row, wijmoObject._col).innerText != DashboardConstants.OLAPTotalsSignature.Subtotal &&
            wijmoObject.panel.getCellElement(wijmoObject._row, wijmoObject._col).innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal) {
            const _driveROConfig: Array<any> = [];
            // const _selectObj = event.grid.collectionView._view[event.event.row];
            let _selectObjOnRow: any = {};
            _selectObjOnRow.fields = [];
            _selectObjOnRow.values = [];
            let _fliterValueOnRow: Array<string> = [];
            let _filterValueOnColumn: Array<string> = [];
            let canDriveOnOLAP: boolean = true;
            //Variable to check whether the user has cliked on some other RO than multiselect/year/date
            let checkDriveClickOnSupportedDriveRO: boolean = false;
            let _filterValue: string = ''
            let _clickedOnTotal: boolean = this.checkTotalSignatureForOLAP(wijmoObject);
            if (!_clickedOnTotal) {
              each(wijmoObject.grid._rows[wijmoObject.row].dataItem.$rowKey.fields, (_val) => {
                _selectObjOnRow.fields.push(_val._header);
                _selectObjOnRow.values.push(wijmoObject.grid._rows[wijmoObject.row].dataItem.$rowKey._item[_val._header]);
              });
              let _selectObjOnCol: any = wijmoObject.grid.getKeys(wijmoObject.row, wijmoObject.col).colKey;
              if (_selectObjOnRow.fields.length >= wijmoObject.col && _selectObjOnRow.values.length >= wijmoObject.col && wijmoObject.cellType != DashboardConstants.WijmoCellType.Cell) {
                _selectObjOnRow.fields = _selectObjOnRow.fields.splice(0, wijmoObject.col + 1);
                _selectObjOnRow.values = _selectObjOnRow.values.splice(0, wijmoObject.col + 1);
              }
              const metadataReportDetails = Object.assign({}, this.config.reportDetails);
              //Removing the check of Single data source to facilitate drive in Cross suite view.
              if (this._commUtil.hasMinimumActiveWidgetInView()) {
                each(this._commUtil.getCombineColumnValueRowRO(metadataReportDetails), (_value: any, _key: any) => {
                  let _index: number = -1;
                  if (_value.reportObjectType === DashboardConstants.ReportObjectType.Attribute) {
                    let reportObjectDriveValue: string = '';
                    if (_value.layoutArea === DashboardConstants.ReportObjectLayoutArea.Rows) {
                      _index = findIndex(_selectObjOnRow.fields, (_val) => { return _val === _value.reportObjectName });
                      if (_index != -1) {
                        reportObjectDriveValue = _selectObjOnRow.values[_index];
                        _fliterValueOnRow.push(reportObjectDriveValue);
                      }
                    }
                    else if (_value.layoutArea === DashboardConstants.ReportObjectLayoutArea.Columns) {
                      _index = findIndex(_selectObjOnCol.fields, (_val) => { return _val === _value.reportObjectName });
                      if (_index != -1) {
                        reportObjectDriveValue = _selectObjOnCol.values[_index];
                      }
                    }
                    if (_index != -1) {
                      let _roObj: any = {
                        reportObjectType: _value.reportObjectType,
                        reportObjectId: _value.reportObjectId,
                        reportObjectName: _value.reportObjectName,
                        reportObjectDriveValue: reportObjectDriveValue
                      }
                      _filterValue = _filterValue.concat(_roObj.reportObjectDriveValue);
                      _driveROConfig.push(_roObj);
                    }
                  }
                });
              }
              if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
                for (let i = 0; i < _driveROConfig.length; i++) {
                  this._commUtil.createDriveFilterForCrossSuiteView(this.config, _driveROConfig[i], this._dashboardCommService.relationShipObjectList);
                  if (!this._commUtil.isNune(_driveROConfig[i].RelationObjectTypeId)) {
                    canDriveOnOLAP = false;
                    break;
                  }
                }
              }
              each(this.config.reportDetails.lstReportObjectOnRow, (_value: any, _index: number) => {
                checkDriveClickOnSupportedDriveRO = this._dashboardDriveService.driveROObjectCondCheck(this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource), [_value])
              });
              if (canDriveOnOLAP && !checkDriveClickOnSupportedDriveRO) {
                if (this.olapDrivePreviousClick.filterValue == _filterValue &&
                  this.config.driveConfig.isDriver) {
                  this.removeOLAPDriveColor(wijmoObject, this.olapDrivePreviousClick.filterValuOnRow);
                }
                else if (this.olapDrivePreviousClick.filterValue != _filterValue) {
                  this.removeOLAPDriveColor(wijmoObject, this.olapDrivePreviousClick.filterValuOnRow);
                  this.setOLAPColor(wijmoObject, _fliterValueOnRow, _filterValueOnColumn);
                  this.olapDrivePreviousClick.row = this._commUtil.getDeReferencedObject(wijmoObject._row);
                  this.olapDrivePreviousClick.col = this._commUtil.getDeReferencedObject(wijmoObject._col);
                  this.olapDrivePreviousClick.filterValue = _filterValue;
                  this.olapDrivePreviousClick.cellType = wijmoObject.cellType;
                  this.olapDrivePreviousClick.filterValuOnRow = _fliterValueOnRow;
                  this.olapDrivePreviousClick.filterValueOnColumn = _filterValueOnColumn;
                }
                this.config.subscriptions.next(
                  {
                    actionId: DashboardConstants.FilterIdentifierType[DashboardConstants.FilterIdentifierType.DriveFilter],
                    cardId: this.config.cardId,
                    event: _driveROConfig,
                    widgetDataType: this.config.widgetDataType
                  }
                );
              }
              //Now here we show the toast message and not in the service for flex.
              else if (!canDriveOnOLAP && this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
                this._commUtil.getToastMessage('The Cross Suite Relation Object Mapping are Missing.');
              }
              else {
                this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
              }
            }
          }
        }
      });
    }
  }
  //This is for driving on Cross Tab OLAP.
  public driveOnCrossTabOLAP(wijmoObject: any, wijmoEvent: any) {
    if (this.config.reportDetails.lstReportObjectOnRow.length === 0
      && this.config.reportDetails.lstReportObjectOnColumn.length === 0
      && this.config.reportDetails.lstReportObjectOnValue.length !== 0) {
      this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_NOT_FACILITATE);
    }
    else {
      this._commUtil.checkAllWidgetLoaded().then((_response) => {
        if (_response) {
          if (wijmoObject.cellType != DashboardConstants.WijmoCellType.TopLeft) {
            let canDriveOnOLAP: boolean = true;
            //let _selectObjOnCol: any = wijmoObject.grid.getKeys(wijmoObject.row, wijmoObject.col).colKey;
            let _filterValue: string = '';
            let _selectObjOnCol: any = {};
            let _selectObjOnRow: any = {};
            let _fliterValueOnRow: Array<string> = [];
            let _filterValueOnColumn: Array<string> = [];
            //Variable to check whether the user has cliked on some other RO than multiselect/year/date
            let checkDriveClickOnSupportedDriveRO = false;
            _selectObjOnRow.fields = [];
            _selectObjOnRow.values = [];
            if (wijmoObject.cellType != DashboardConstants.WijmoCellType.RowHeader) {
              _selectObjOnCol = this._dashboardDriveService.getColumnHeaderValue(wijmoObject, this.config);
            }
            if (wijmoObject.cellType != DashboardConstants.WijmoCellType.ColumnHeader) {
              each(wijmoObject.grid._rows[wijmoObject.row].dataItem.$rowKey.fields, (_val) => {
                _selectObjOnRow.fields.push(_val._header);
                _selectObjOnRow.values.push(wijmoObject.grid._rows[wijmoObject.row].dataItem.$rowKey._item[_val._header]);
              });
            }
            let _clickedOnTotal: boolean = this._dashboardDriveService.checkTotalSignature(wijmoObject, _selectObjOnRow, this.config, this._elementRef, _selectObjOnCol);
            //Verify if that the measure value can never be of any other type than number.
            if (
              !_clickedOnTotal
            ) {
              let cellType: number = wijmoObject.cellType;
              const _driveROConfig: Array<any> = [];
              switch (cellType) {
                case DashboardConstants.WijmoCellType.Cell:
                  {
                    each(wijmoObject.grid._rows[wijmoObject.row].dataItem.$rowKey.fields, (_val) => {
                      _selectObjOnRow.fields.push(_val._header);
                      _selectObjOnRow.values.push(wijmoObject.grid._rows[wijmoObject.row].dataItem.$rowKey._item[_val._header]);
                    });
                  }
                  break;
                case DashboardConstants.WijmoCellType.RowHeader:
                  {
                    if (_selectObjOnRow.fields.length >= wijmoObject.col && _selectObjOnRow.values.length >= wijmoObject.col) {
                      _selectObjOnRow.fields = _selectObjOnRow.fields.slice(0, wijmoObject.col + 1);
                      _selectObjOnRow.values = _selectObjOnRow.values.slice(0, wijmoObject.col + 1);
                    }
                    _selectObjOnCol.fields = [];
                    _selectObjOnCol.values = [];
                  }
                  break;
                case DashboardConstants.WijmoCellType.ColumnHeader:
                  {
                    console.log(_selectObjOnCol);
                    if (_selectObjOnCol.fields.length === 0 || _selectObjOnCol.values.length === 0)
                      if (_selectObjOnCol.fields.length >= wijmoObject.row && _selectObjOnCol.values.length >= wijmoObject.row) {
                        _selectObjOnCol.fields = _selectObjOnCol.fields.slice(0, wijmoObject.row + 1);
                        _selectObjOnCol.values = _selectObjOnCol.values.slice(0, wijmoObject.row + 1);
                      }
                    console.log(_selectObjOnCol);
                    _selectObjOnRow.fields = [];
                    _selectObjOnRow.values = [];
                  }
                  break;
              }
              const metadataReportDetails = Object.assign({}, this.config.reportDetails);
              //Removing the check of Single data source to facilitate drive in Cross suite view.
              if (this._commUtil.hasMinimumActiveWidgetInView()) {
                each(this._commUtil.getCombineColumnValueRowRO(metadataReportDetails), (_value: any, _key: any) => {
                  let _index: number = -1;
                  if (_value.reportObjectType === DashboardConstants.ReportObjectType.Attribute) {
                    let reportObjectDriveValue: string = '';
                    if (_value.layoutArea === DashboardConstants.ReportObjectLayoutArea.Rows) {
                      _index = findIndex(_selectObjOnRow.fields, (_val) => { return _val === _value.reportObjectName });
                      if (_index != -1) {
                        reportObjectDriveValue = _selectObjOnRow.values[_index];
                        _fliterValueOnRow.push(reportObjectDriveValue);
                      }
                    }
                    else if (_value.layoutArea === DashboardConstants.ReportObjectLayoutArea.Columns) {
                      _index = findIndex(_selectObjOnCol.fields, (_val) => { return _val === _value.reportObjectName });
                      if (_index != -1) {
                        reportObjectDriveValue = _selectObjOnCol.values[_index];
                        _filterValueOnColumn.push(reportObjectDriveValue);
                      }
                    }
                    if (_index != -1) {
                      let _roObj: any = {
                        reportObjectType: _value.reportObjectType,
                        reportObjectId: _value.reportObjectId,
                        reportObjectName: _value.reportObjectName,
                        reportObjectDriveValue: reportObjectDriveValue,
                        layoutArea: _value.layoutArea
                      }
                      _filterValue = _filterValue.concat(_roObj.reportObjectDriveValue);
                      _driveROConfig.push(_roObj);
                    }
                  }
                });
              }
              if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
                if (_driveROConfig.length > 0) {
                  for (let i = 0; i < _driveROConfig.length; i++) {
                    this._commUtil.createDriveFilterForCrossSuiteView(this.config, _driveROConfig[i], this._dashboardCommService.relationShipObjectList);
                    if (!this._commUtil.isNune(_driveROConfig[i].RelationObjectTypeId)) {
                      canDriveOnOLAP = false;
                      break;
                    }
                  }
                }
                else {
                  canDriveOnOLAP = false;
                }
              }
              //Check filterType of the RO.
              each(this.config.reportDetails.lstReportObjectOnRow, (_value: any, _index: number) => {
                checkDriveClickOnSupportedDriveRO = this._dashboardDriveService.driveROObjectCondCheck(this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource), [_value])
              });
              //For column we will only do this check when filterType not supported are not pulled in the row and if its pulled in the row we wont drive
              if (!checkDriveClickOnSupportedDriveRO) {
                each(this.config.reportDetails.lstReportObjectOnColumn, (_value: any, _index: number) => {
                  checkDriveClickOnSupportedDriveRO = this._dashboardDriveService.driveROObjectCondCheck(this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource), [_value])
                });
              }
              if (canDriveOnOLAP && !checkDriveClickOnSupportedDriveRO) {
                if (this.olapDrivePreviousClick.filterValue == _filterValue &&
                  this.config.driveConfig.isDriver) {
                  this.removeOLAPDriveColor(wijmoObject, this.olapDrivePreviousClick.filterValuOnRow);
                }
                else if (this.olapDrivePreviousClick.filterValue != _filterValue) {
                  this.removeOLAPDriveColor(wijmoObject, this.olapDrivePreviousClick.filterValuOnRow);
                  this.setOLAPColor(wijmoObject, _fliterValueOnRow, _filterValueOnColumn);
                  this.olapDrivePreviousClick.row = this._commUtil.getDeReferencedObject(wijmoObject._row);
                  this.olapDrivePreviousClick.col = this._commUtil.getDeReferencedObject(wijmoObject._col);
                  this.olapDrivePreviousClick.filterValue = _filterValue;
                  this.olapDrivePreviousClick.cellType = wijmoObject.cellType;
                  this.olapDrivePreviousClick.filterValuOnRow = _fliterValueOnRow;
                  this.olapDrivePreviousClick.filterValueOnColumn = _filterValueOnColumn;
                }
                this.config.subscriptions.next(
                  {
                    actionId: DashboardConstants.FilterIdentifierType[DashboardConstants.FilterIdentifierType.DriveFilter],
                    cardId: this.config.cardId,
                    event: _driveROConfig,
                    widgetDataType: this.config.widgetDataType
                  }
                );
              }
              //Now here we show the toast message and not in the service for flex.
              else if (!canDriveOnOLAP && this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
                this._commUtil.getToastMessage('The Cross Suite Relation Object Mapping are Missing.');
              }
              else if (this.config.driveConfig.isDriver || this.config.driveConfig.isDriven) {
                this.removeOLAPDriveColor(wijmoObject, this.olapDrivePreviousClick.filterValuOnRow);
                this.config.subscriptions.next(
                  {
                    actionId: DashboardConstants.EventType.RemoveDrive,
                    cardId: this.config.cardId,
                    event: _driveROConfig,
                    widgetDataType: this.config.widgetDataType,
                    //mappingMissing: true
                  }
                );
              }
              else {
                formatItem => {
                  console.log("Format Item called");
                }
                wijmoObject.grid.invalidate();
                this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
              }
            }
            else {
              if (!_clickedOnTotal) {
                this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
              }
            }
          }
        }
      });
    }
  }


  private olapSuccessService(wijmoHttpResponse: any) {
    this.positioning();
    if (wijmoHttpResponse.DataLength !== 0) {
      //Calling if and only if the config.pageIndex is 1
      if (this.config.pageIndex === 1) {
        this.manageSubscription$.add(
          this._analyticsCommonDataService
            .getPageInfo(this.config.reportRequestKey)
            .subscribe((resPageData: any) => {
              this.setDefaultPaginationConfig(resPageData);
              //console.log("====Page Data===", resPageData, wijmoHttpResponse);
              this._loaderService.hideCardLoader(this.config.cardId);
              this.config.config.collapseClickEvent();
            }, () => {
              this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.ErrorOccured));
              this._loaderService.hideCardLoader(this.config.cardId);
            })
        );
      }
      else {
        this._loaderService.hideCardLoader(this.config.cardId);
      }
    }
    else {
      this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.RecordNotFound));
      this._loaderService.hideCardLoader(this.config.cardId);
    }

    if (this.config.changeDetectionMutation && this.config.changeDetectionMutation.setSliderState) {
      this.config.btnRangeApplyConfig.disable = false;
      this.config.changeDetectionMutation.setSliderState()
    }
    this.config.WidgetDataRecordLength = wijmoHttpResponse.DataLength;
  }


  private generateOLAPPagination() {
    this._loaderService.showCardLoader(this.config.cardId);
    this.config.config.updateOlapPagination();
  }

  private getMessageStrings(message: string) {
    switch (message) {
      case DashboardConstants.EventType.ErrorOccured:
        return DashboardConstants.UIMessageConstants.STRING_VISUALIZATION_COULD_NOT_BE_LOADED;
      case DashboardConstants.EventType.RecordNotFound:
        return DashboardConstants.UIMessageConstants.STRING_NO_DATA_RETURNED_TXT;
      case DashboardConstants.EventType.MeasureFilterApplied:
        return DashboardConstants.UIMessageConstants.STRING_MEASURE_FILTER_NOT_ALLOWED;
    }
  }

  private generateWijmoOlapGridConfig() {
    const cardId = this.config.cardId;
    return {
      olapGridInstanceConfig: {
        showSubtotalOption: this.config.reportDetails.lstReportObjectOnValue.length !== 0 && findIndex(this.config.reportDetails.lstReportObjectOnRow, (rowObj: any) => { return rowObj.derivedRoType == AnalyticsCommonConstants.DerivedRoType.DerivedAttributeObject }) == -1,
        showDetailOnDoubleClick: false,
        allowSorting: false,
        autoScroll: false,
        customContextMenu: false,
        stickyHeaders: true,
        showValueFieldHeaders: true,
        showRowFieldHeaders: true,
        selectionMode: SelectionMode.Cell,
        autoSizeMode: AutoSizeMode.None,
        collapsibleSubtotals: this.config.reportDetails.isTotalRequired,
        olapEvents: {
          resizedRow: false,
          resizingColumn: false,
          resizedColumn: true,
          rowEditStarted: false,
          rowEditStarting: false,
          scrollPositionChanged: false,
          selectionChanged: false,
          selectionChanging: false,
          updatedLayout: false,
          updatedView: false,
          updatingLayout: false,
          updatingView: false,
          sortingColumn: false,
          sortedColumn: false,
          formatItem: true,
        },
        olapCardLoader: {
          showCardLoader: () => { this._loaderService.showCardLoader(cardId); },
          hideCardLoader: () => { this._loaderService.hideCardLoader(cardId); },
        }
      },
      olapPivotEngineConfig: {
        engineId: cardId,
        autoGenerateFields: false,
        sortOnServer: true,
        allowSorting: false,
        showZeros: true,
        showColumnTotals: ShowTotals.GrandTotals,
        showRowTotals: ShowTotals.Subtotals,
        old_success: {} as any,
        totalsBeforeData: true,
        itemsSource: this._commUtil.noCacheUrl(this._commonUrl.URLs.AnalyticsDataApiCommonUrls.getAnalysisResultUrl),
      }
    };

  }

  public mapChartEvents(events) {
    this.eventHandler(events);
    if (events.eventType === DashboardConstants.EventType.Click) {
      this.config.subscriptions.next(
        {
          actionId: events.eventType,
          cardId: this.config.cardId,
          widgetDataType: this.config.widgetDataType,
          event: events
        });
    }
    else if (events.eventType === DashboardConstants.EventType.DoubleClick) {
      this.onOptionSelect(events, DashboardConstants.FilterIdentifierType.DrillFilter);
    }

  }

  private setOLAPColor(_wijmoObject: any, _fliterValueOnRow?: Array<any>, _fitlerValueOnColumn?: Array<any>): void {
    let col = _wijmoObject.col
    let row = _wijmoObject.row
    switch (_wijmoObject.cellType) {
      case DashboardConstants.WijmoCellType.RowHeader:
        {
          do {
            if (_wijmoObject.panel.getCellElement(_wijmoObject._row, col).innerText != DashboardConstants.OLAPTotalsSignature.Subtotal
              && _wijmoObject.panel.getCellElement(_wijmoObject._row, col).innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal) {
              _wijmoObject.panel.getCellElement(_wijmoObject._row, col).className += ' driveAddClass';
            }
            col--;
          } while (col >= 0);
        }
        break;
      case DashboardConstants.WijmoCellType.ColumnHeader:
        {
          do {
            if (_wijmoObject.panel.getCellElement(_wijmoObject._row, col).innerText != DashboardConstants.OLAPTotalsSignature.Subtotal
              && _wijmoObject.panel.getCellElement(_wijmoObject._row, col).innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal) {
              _wijmoObject.panel.getCellElement(row, _wijmoObject._col).className += ' driveAddClass';
            }
            row--;
          } while (row >= 0);
        }
        break;
      case DashboardConstants.WijmoCellType.Cell:
        {
          let _listOfRow = this._elementRef.nativeElement.querySelector(".widget-wrapper .wj-rowheaders");
          let _listOfColumn = this._elementRef.nativeElement.querySelector(".widget-wrapper .wj-colheaders");
          let rowROCount = this.config.reportDetails.lstReportObjectOnRow.length;
          this.colorOLAPRow(_fliterValueOnRow, _listOfRow, this.config.reportDetails.lstReportObjectOnRow.length, row);
          this.colorOLAPColumn(_listOfColumn, _wijmoObject, col);
        }
    }
  }

  private removeOLAPDriveColor(_wijmoObject: any, _fliterValueOnRow: any): void {
    if (this._commUtil.isNune(this.olapDrivePreviousClick.row) && this._commUtil.isNune(this.olapDrivePreviousClick.col)) {
      let _listOfRow = this._elementRef.nativeElement.querySelector(".widget-wrapper .wj-rowheaders");
      let _listOfColumn = this._elementRef.nativeElement.querySelector(".widget-wrapper .wj-colheaders");
      let _row: number = this.olapDrivePreviousClick.row;
      let _column: number = this.olapDrivePreviousClick.col;
      if (this.olapDrivePreviousClick.cellType === DashboardConstants.WijmoCellType.RowHeader) {
        this.colorOLAPRow(_fliterValueOnRow, _listOfRow, this.config.reportDetails.lstReportObjectOnRow.length, _row, false);
        // do {
        //   _wijmoObject.panel.getCellElement(this.olapDrivePreviousClick.row, _column).style.background = '';
        //   _column--;
        // } while (_column >= 0);
        // do {
        //   _wijmoObject.panel.getCellElement(_row, this.olapDrivePreviousClick.col).style.background = '';
        //   _row--;
        // } while (_row >= 0);

      }
      else if (this.olapDrivePreviousClick.cellType === DashboardConstants.WijmoCellType.ColumnHeader) {
        this.colorOLAPColumn(_listOfColumn, _wijmoObject, _column, false);
      }
      else {
        this.colorOLAPRow(_fliterValueOnRow, _listOfRow, this.config.reportDetails.lstReportObjectOnRow.length, _row, false);
        this.colorOLAPColumn(_listOfColumn, _wijmoObject, _column, false);
      }
      //Resetting the previous clicked value in when the user undrive on this report.
      this.resetOLAPDriveValues();
    }
  }

  public onInitialize($event) {
    // if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
    //   console.log('render',this._elementRef.nativeElement.querySelector('#gaugeChart-1'));
    // }
  }

  public onDeinitialize($event) {

  }

  public onActivate($event, config) {
    if (this.config.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
      setTimeout(async () => {
        if (this.config.renderMultiGuageChart)
          this.config.renderMultiGuageChart();
      }, 20);
    }
    else if (this.config.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard) {
      setTimeout(async () => {
        if (this.config.changeDetectionMutation.applyFormattingOnSummaryCard)
          this.config.changeDetectionMutation.applyFormattingOnSummaryCard();
        // this.config.renderMultiGuageChart();
      }, 20);
    }
  }

  public showCardLoader() {
    this.config.cardLoader = true;
    if (this.cardLoaderConfig.api["showLoader"]) this.cardLoaderConfig.api.showLoader(true);
  }

  public hideCardLoader() {
    this.config.cardLoader = false;
    if (this.cardLoaderConfig.api["showLoader"]) {
      setTimeout(async () => {
        this.cardLoaderConfig.api.showLoader(false);
      }, 50);
    }
  }

  public showSliderLoader() {
    this.config.showSliderLoader = true;
    if (this.sliderLoaderConfig.api["showLoader"]) this.sliderLoaderConfig.api.showLoader(true);
  }

  public hideSliderLoader() {
    this.config.showSliderLoader = false;
    if (this.sliderLoaderConfig.api["showLoader"]) this.sliderLoaderConfig.api.showLoader(false);
  }


  public registerLoaderForDashboardCard() {
    this.manageSubscription$.add(
      this._loaderService._sliderLoaderbehaviorSubject$.subscribe((_value: any) => {
        if (!this._commUtil.isEmptyObject(_value) && _value.cardId === this.config.cardId) {
          if (_value.LoaderType === DashboardConstants.LoaderType.BlockLoader) {
            _value.showLoader ? this.showSliderLoader() : this.hideSliderLoader();
          }
          else if (_value.LoaderType === DashboardConstants.LoaderType.CardLoader) {
            _value.showLoader ? this.showCardLoader() : this.hideCardLoader();
          }
        }
      })
    )
  }

  public setState() {
    this._cdRef.markForCheck();
  }

  public getChartDataLimit(reportDetailsData: any): number {
    const allDataSourceInfo = this._dashboardCommService.allDataSourceInfo;
    const selectedDataSource = allDataSourceInfo.find(dataSource => dataSource.DataSourceObjectId == reportDetailsData.dataSourceObjectId)
    let dataLimit = 260;
    switch (reportDetailsData.reportViewType) {
      case AnalyticsCommonConstants.ReportViewType.treemap:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).TreeChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).TreeChart
        }
        break;
      case AnalyticsCommonConstants.ReportViewType.pie:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).PieChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).PieChart
        }
        break;
      case AnalyticsCommonConstants.ReportViewType.ParetoChart:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).ParetoChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).ParetoChart
        }
        break;
      case AnalyticsCommonConstants.ReportViewType.DonutChart:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).DonutChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).DonutChart
        }

        break;
      case AnalyticsCommonConstants.ReportViewType.BubbleChart:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).BubbleChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).BubbleChart
        }
        else {
          dataLimit = 1010;
        }
        break;
      case AnalyticsCommonConstants.ReportViewType.MapChart:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).MapChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).MapChart
        }
        else {
          dataLimit = 1010;
        }
        break;
      case AnalyticsCommonConstants.ReportViewType.WaterFallChart:
        if (selectedDataSource.DataSourceProperties && parseInt(JSON.parse(selectedDataSource.DataSourceProperties).WaterFallChart)) {
          dataLimit = JSON.parse(selectedDataSource.DataSourceProperties).WaterFallChart
        }
        break;
    }
    return dataLimit;
  }

  private colorOLAPRow(_fliterValueOnRow: any, _listOfRow: any, rowROCount: number, row: number, drive: boolean = true) {
    //first we highlight the lowest level RO in the row.
    each(_listOfRow.children[row].children, (_value: any, _index: number) => {
      if (_value.innerText != DashboardConstants.OLAPTotalsSignature.Subtotal
        && _value.innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal) {
        if (drive) {
          _value.className += " driveAddClass";
        }
        else {
          this.removeDriveClassForOlap(_value, null);
        }
      }
    });
    let currentRo = _fliterValueOnRow.length == 1 ? _fliterValueOnRow.length - 1 :
      _listOfRow.children[row].children[_listOfRow.children[row].children.length - 1].innerText.trim() == _fliterValueOnRow[_fliterValueOnRow.length - 1].trim() ?
        _fliterValueOnRow.length - 2 : _fliterValueOnRow.length - 1;
    //let currentRo = _fliterValueOnRow.length - 1 ;
    //Here we set the length of the children of the current clicked cell which will always be 1 incase the spend value is clicked.
    let j = _listOfRow.children[row].children.length;
    if (j < rowROCount) {
      for (let i = row - 1; i >= 0; i--) {
        //Here we go up until we find the parent of the current RO i.e the value of Level 2 Categry if in Grid L2C is pulled and then L3C we go from L3C to L2C if its children length is greater than this length.
        if (_listOfRow.children[i].children.length > j) {
          let _temp = _listOfRow.children[i].children.length - j;
          //Here we check if the div is the not the second element in the RO list i.e we only find one div then set background.               
          //Here we start highlighting the parent level row RO's.
          for (let k = 0; k <= _temp; k++) {
            if (_listOfRow.children[i].children[k].innerText != DashboardConstants.OLAPTotalsSignature.Subtotal
              && _listOfRow.children[i].children[k].innerText.innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal &&
              (_fliterValueOnRow.indexOf(_listOfRow.children[i].children[k].innerText.trim()) > -1)) {
              //_listOfRow.children[i].children[k].style.background = drive ? DashboardConstants.OLAPDriveColor.DriveColor : '';
              if (drive) {
                _listOfRow.children[i].children[k].className += " driveAddClass";
              }
              else {
                this.removeDriveClassForOlap(_listOfRow.children[i].children[k], null);
              }
            }
          }
        }
      }
    }
  }


  private colorOLAPColumn(_listOfColumn: any, _wijmoObject: any, col: number, drive: boolean = true) {
    for (let i = 0; i < _listOfColumn.children.length - 1; i++) {
      if (_wijmoObject.grid.columnHeaders.getCellElement(i, col).innerText != DashboardConstants.OLAPTotalsSignature.Subtotal
        && _wijmoObject.grid.columnHeaders.getCellElement(i, col).innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal)
        //_wijmoObject.grid.columnHeaders.getCellElement(i, col).style.background = drive ? DashboardConstants.OLAPDriveColor.DriveColor : '';
        if (drive) {
          _wijmoObject.grid.columnHeaders.getCellElement(i, col).className += " driveAddClass";
        }
        else {
          if (_listOfColumn.children[i].children[col] != undefined)
            this.removeDriveClassForOlap(_listOfColumn.children[i].children[col], _wijmoObject.grid.columnHeaders.getCellElement(i, col));
          else
            this.removeDriveClassForOlap(_wijmoObject.grid.columnHeaders.getCellElement(i, col), null);
        }
    }
  }
  private removeDriveClassForOlap(element: any, columnHeaderElement: any) {
    let classArray = element.className.split(' ');
    let indexCFClass = findIndex(classArray, (item) => { return item == "driveAddClass" });
    let columHeaderClassArray: any; let indexCFClassColumnHeader: number = -1;

    if (columnHeaderElement != null) {
      columHeaderClassArray = columnHeaderElement.className.split(' ');
      indexCFClassColumnHeader = findIndex(columHeaderClassArray, (item) => { return item == "driveAddClass" });
      if (indexCFClassColumnHeader != -1) {
        columHeaderClassArray.splice(indexCFClassColumnHeader, 1);
        columnHeaderElement.className = "";
        for (let x = 0; x < columHeaderClassArray.length; x++) {
          columnHeaderElement.className = columnHeaderElement.className.concat(columHeaderClassArray[x]).concat(" ");
        }
        columnHeaderElement.className = columnHeaderElement.className.trimEnd();
      }
    }
    if (indexCFClass != -1) {
      classArray.splice(indexCFClass, 1);
    }
    element.className = ""
    for (let x = 0; x < classArray.length; x++) {
      element.className = element.className.concat(classArray[x]).concat(" ");
    }
    element.className = element.className.trimEnd();
  }
  private resetOLAPDriveValues() {
    this.olapDrivePreviousClick.row = undefined;
    this.olapDrivePreviousClick.col = undefined;
    this.olapDrivePreviousClick.filterValue = '';
    this.olapDrivePreviousClick.cellType = undefined;
    this.olapDrivePreviousClick.filterValuOnRow = [];
    this.olapDrivePreviousClick.filterValueOnColumn = [];
  }

  private checkTotalSignatureForOLAP(wijmoObject: any): boolean {
    let _listOfRow: any = this._elementRef.nativeElement.querySelector(".widget-wrapper .wj-rowheaders");
    if (wijmoObject.cellType === DashboardConstants.WijmoCellType.Cell) {
      if (_listOfRow.children[wijmoObject.row].children[_listOfRow.children[wijmoObject.row].children.length - 1].innerText != DashboardConstants.OLAPTotalsSignature.Subtotal &&
        _listOfRow.children[wijmoObject.row].children[_listOfRow.children[wijmoObject.row].children.length - 1].innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal) {
        return false;
      }
    }
    else {
      if (wijmoObject.panel.getCellElement(wijmoObject.row, wijmoObject.col).innerText != DashboardConstants.OLAPTotalsSignature.Subtotal &&
        wijmoObject.panel.getCellElement(wijmoObject.row, wijmoObject.col).innerText != DashboardConstants.OLAPTotalsSignature.Grandtotal) {
        return false;
      }
    }
    return true;
  }

  private setPageIndexForOLAP(sign: string) {
    let tempOLAPPageSize = eval(DashboardConstants.evalPageIndex.replace('@sign', sign));
    if (this.config.driveConfig.isDriver) {
      this.removeDrive_cardAction(event);
      this.resetOLAPDriveValues();
      this.config.changeDetectionMutation.setDashboardCardHeaderState();
    }

    this.config.pageIndex = tempOLAPPageSize;
  }

  private initializeWidgetOnInit() {
    this.initializeWidget(Object.assign({}, this.config.reportDetails))
      .then((_response) => {
        // Commented by Akash since this code in no longer required for new ppv since we dont have to load any autosuggest dropdown with suppliers in it.
        // Will remove this code after dev testing.   

        /*        if (this._dashboardCommService.oppFinderState.oppFinderFlag &&
                 this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name &&
                 this.uiConfig.showAutoSuggest) {
                 setTimeout(() => {
                   thisRef.autoSuggestContainerRef.createEmbeddedView(thisRef.autoSuggestTemplateRef, { $implicit: thisRef.config });
                   thisRef.setState();
                 }, 200);// lazy load autosuggest here
               }  */
        this.positioning();
      });
  }

  private isMeasureFilterApplied() {
    return countBy(this.config.reportDetails.lstFilterReportObject, (_filterVal) => { return _filterVal.reportObject.filterType === DashboardConstants.FilterType.Measure });
  }
}
