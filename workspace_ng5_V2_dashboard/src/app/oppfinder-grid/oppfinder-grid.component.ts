import { Component, OnInit, EventEmitter, ViewChild, ViewContainerRef, Inject, Input, ElementRef, ApplicationRef, EmbeddedViewRef, Output, OnDestroy, Renderer2, ComponentFactoryResolver, Injector, ComponentRef, TemplateRef } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { StaticModuleLoaderService } from "smart-module-loader";
import {
  IDashoardCardAction, ICardDashboardSubscription,
  dashboardIConfig, dashboardISection
} from "@vsDashboardInterface";
import { DashboardCommService } from "@vsDashboardCommService";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalFilterService } from "@vsGlobalFilterService";
import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";
//import { DashboardCardComponent } from "app/dashboard-card";
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { SavedFilter } from "@vsMetaDataModels/saved-filter.model";
import { IReportingObjectMultiDataSource, IRelationObjectMapping, IFilterList, IDAXReportFilter } from "@vsCommonInterface";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
// import { visionModulesManifest, LazyComponentConfiguration } from "../../../modules-manifest";
import { each, filter, mapValues, find, camelCase, some, findIndex } from 'lodash';
import { CommonUrlsConstants } from "@vsCommonUrlsConstants";
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { AnalyticsMapperService } from "@vsAnalyticsCommonService/analytics-mapper.service";
import { CellType } from 'wijmo/wijmo.grid';
import { LoaderService } from "@vsLoaderService";
import { DashboardDriveService } from "@vsDashboardDriveService";
import { AppConstants } from "smart-platform-services";

@Component({
  selector: 'oppfinder-grid',
  templateUrl: './oppfinder-grid.component.html',
  styleUrls: ['./oppfinder-grid.component.scss'],
  preserveWhitespaces: false
})

export class OppFinderGridComponent implements OnInit, OnDestroy {

  //#region <========= Dashboard Grid Component Variable Decalarations =========>
  dashboardConfig: dashboardIConfig;
  driveState: any = {
    isDriveActive: false,
    previousClickedValue: undefined,
    prevDriveIndex: null,
    prevDriveCardId: ''
  }
  clicks: number = 0;
  dashboardCard: any;
  sub: ICardDashboardSubscription = {} as ICardDashboardSubscription;
  dbGridSubject: ICardDashboardSubscription = {} as ICardDashboardSubscription;
  gridstackAPI: any;
  // appliedFilters: any = [];
  showChipBar: boolean = false;
  hideHeaderNotification: boolean = false;
  infoBarText: string;
  staleWidgetCard = [];
  isGlobalFilterApplied: boolean;
  opacityData: any;
  selectedFilter: any;
  filterchipName: any;
  showSelectedText: any;
  dashboardConstant: any = DashboardConstants.FilterType.MultiSelect;
  // purchasePricePopupRef: any;
  purchasePricePopupConfig: any;
  grid: any;
  oppfinderCountVar : any
  createNewOpportunity : boolean = false;
  // supplierReportObjectDetails: any;
  _resOppReportDetails: any;
  supplierRo: any;
  _compPurchasePricePopup: ComponentRef<any>;
  filterPanelHeight: any;
  isFilterSidebarExpand: boolean = false;
  globalFilterContainerConfig: any;
  applierFilterConfig: any = {};
  distoryTimeout: any = {};
  //#endregion

  //#region <========= Dashboard Grid Component Decorator Declarations =========>
  @Input("config") config: any;
  @Output() cardEvents: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("oppfinderContainer", { read: ViewContainerRef }) oppfinderContainerRef: ViewContainerRef;
  @ViewChild("purchasePricePopupRef", { read: ViewContainerRef }) purchasePricePopupRef: ViewContainerRef;
  @ViewChild("investigateModeRef", { read: ViewContainerRef }) investigateModeRef: ViewContainerRef;
  @ViewChild("outletTemplate") outletTemplateRef: TemplateRef<any>;
  @ViewChild("globalFilterContainer", { read: ViewContainerRef }) globalFilterContainerRef: ViewContainerRef;
  @ViewChild("globalfilterTemplate") globalfilterTemplateRef: TemplateRef<any>;
  @ViewChild('globalSliderWidget', { read: ViewContainerRef }) globalSliderContainerRef: ViewContainerRef;
  supplierList: any = [];
  constants = DashboardConstants;
  // @Input("listAllReportObjectWithMultiDatasource") listAllReportObjectWithMultiDatasource;
  // @Input("listofDistinctWidgetDataSource") listofDistinctWidgetDataSource;
  // @Input("listAllCrossSuiteFilterMapping") listAllCrossSuiteFilterMapping;

  // @ViewChildren(DashboardCardComponent) listDashboardCardComponents: QueryList<DashboardCardComponent>;
  //#endregion

  constructor(
    @Inject(StaticModuleLoaderService)
    private _staticLoader: StaticModuleLoaderService,
    private _elementRef: ElementRef,
    public _dashboardCommService: DashboardCommService,
    private _globalFilterService: GlobalFilterService,
    private _commUtil: CommonUtilitiesService,
    private _appConstant: AppConstants,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _renderer: Renderer2,
    private _commonUrlsConstants: CommonUrlsConstants,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    private _loaderService: LoaderService,
    private _dashboardDriveService: DashboardDriveService
  ) {

  }


  ngOnInit() {
    if (this.staleWidgetCard.length == 0) {
      this.staleWidgetCard = this._commUtil.getDeReferencedObject(this.config.config.cards);
    }
    if (this._dashboardCommService.oppFinderState.editMode) {
      this.openPurchasePricePopup(undefined, undefined);
    }

    this.dashboardConfig = this.config.config;
    this.toggleFilterPanelCss();

    // Subject is the way to make cards communicate with the document level;
    // When you click full screen, or sort inside the card.
    // The function below will trigger and provide you with the action
    // Action is an object that contain actionId and cardId
    this.sub.subject = new Subject<IDashoardCardAction>();
    this.sub.observer$ = this.sub.subject.asObservable();
    this.sub.subscription = this.sub.observer$.subscribe(action => {

      let eventType = action.actionId;
      let cardId = action.cardId;
      let event = action.event;
      if (eventType === 'Selection') {


        if(this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name ||
          this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name) {
          this.oppfinderCountVar = action.cardDescription ;
          if(action.event.grid.columns[action.event.c].header === null){this.createNewOpportunity = true;} else(this.createNewOpportunity = false)
          this.openPurchasePricePopup(action.config, action.event.r);
        }
        else {
          this.createNewOpportunity = true;
          this.openPurchasePricePopup(action.config,0);
        }
      }
      if (action.event && action.event.type === 'itemFormatter') {
        this.purchasePriceItemFormatter(action.event, action.config);
      }
      if (action.event && action.event.type === DashboardConstants.EventType.AutoScrollEvents.AutoKeyUp) {
        this.autocompleteKeyUp(action.event, action.config);
      }
      if (action.actionId === DashboardConstants.EventType.AutoScrollEvents.OnSelect) {
        this.autocompleteSelection(action.event, action.config);
      }
      if (action.actionId === DashboardConstants.EventType.AutoScrollEvents.OnSelect) {
        this.autocompleteSelection(action.event, action.config);
      }
      if (action.actionId === DashboardConstants.FilterIdentifierType.DriveFilter) {
        if (
          //this._dashboardCommService.listofDistinctWidgetDataSource.length == 1 &&
          this.config.config.cards.filter((widget) => { return !widget.isRemoved && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent }).length > 1
        ) {
          if (action.widgetDataType === DashboardConstants.WidgetDataType.Chart || action.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
            this._dashboardDriveService.driveClickOnChart(action,this.dbGridSubject);
          }
          else if (action.widgetDataType === DashboardConstants.WidgetDataType.MapChart) {
            // Preparing only event object for map charts.
            action["event"] = { event: { event: action.event.event } };
            this._dashboardDriveService.driveClickOnChart(action,this.dbGridSubject);
          }
          else if (action.widgetDataType === DashboardConstants.WidgetDataType.Flex) {
            this._dashboardDriveService.driveClickOnFlexGrid(action,this.dbGridSubject);
          }
          else {
            this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_NOT_SUPPORTED_CROSSSUITE);
          }
        }
      }
      //Adding this action here to enable Drive on Drill featue for oppfinder as well
      if (action.actionId === DashboardConstants.FilterIdentifierType.DrillFilter){
        this.drillFilterClick(action);
      }
      if(action.actionId === DashboardConstants.EventType.RemoveDrive){
        this.removeDrive_cardAction(action);
      }

      // This will be used to load investigate page 
      // This is common on all Modules for investigate
      
      if(action.actionId === DashboardConstants.FraudAnomalyCommonConstants.EventInvestigate){
        this.CreateAnomaly(action.config, action.event.r);
      }
  


    });
    this.dbGridSubject.subject = new Subject<IDashoardCardAction>();
    this.dbGridSubject.observer$ = this.dbGridSubject.subject.asObservable();
    this.dashboardConfig.cards.forEach(card => {
      card.dataCallback = this.getWidgetData.bind(this);
      card.subscriptions = this.sub.subject;
      card.dbGridSubject = this.dbGridSubject.observer$;
    });


    this.dashboardConfig.layout.config.callback = this.gridCallback.bind(this);
    this.loadSection().then((_response) => {
      // this.appliedFilters = this._dashboardCommService.appliedFilters;
      this.onApplyFilter();
      //this.onSaveDashboard();
      this.CalcFilterPanelHeight(false);
      this.resizeDashboardContainer();
    });

    this._commUtil._widgetCards = this.config.config.cards;

    // let _this = this;
    window.addEventListener('scroll', () => {
      this.calculateFilterPanelTop();
    });

  }
  
  async CreateAnomaly(config: any, rowNumber) {
    this._loaderService.showGlobalLoader();
    this.setInvestigateGridConfig(config, rowNumber).then((config: any) => {
    this.investigateModeRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'default-widget/default-widget',
      config: {
        config: config
      }
    });
  });
  }

  // This method will create the config required for the grid section inside the investigate
  setInvestigateGridConfig(config , rowNumber ) {
    this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'] = {};
    return new Promise((resolve, reject) => {
    const investigateSectionConfig: any = {
      reportDetails: undefined,
      api: {closePopup: () => { this.closeWidgetPopup(); }}
    }

    let additionalProps = JSON.parse(this._dashboardCommService.fraudAnomalyMasterData['AdditionalProperties']);

    this.loadDataByReportObjectId(additionalProps.InvestigateReportDetailsId).then((reportDetailsForCreateOpp: any) => {
      investigateSectionConfig.reportDetails = reportDetailsForCreateOpp;

    // Grid level filter on level 4 category 
     var level4ro = find(config.reportDetails.lstReportObjectOnRow, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == additionalProps.L4CategoryROID.toLowerCase();
      });
      let filterLevel4Value = AnalyticsUtilsService.GetFormattedFilterValue(config.reportDetails.lstReportObjectOnRow, config.config.series[rowNumber][level4ro.reportObjectName]);
      investigateSectionConfig.reportDetails.lstFilterReportObject.push(
        AnalyticsUtilsService.createDrillDriveFilterReportObj(
          { reportObject: level4ro, filterValue: filterLevel4Value[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
        )
      );

      if (config.drillDriveFilters.length > 0){
      investigateSectionConfig.reportDetails.lstFilterReportObject = investigateSectionConfig.reportDetails.lstFilterReportObject.concat(config.drillDriveFilters);
      }
      this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].investigateDetails = investigateSectionConfig;
      this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].flexGidConfig = config.config;
     
      let spendRo = find(config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == additionalProps.SpendRoID.toLowerCase();
      });
  
      this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].spendValue = config.config.series[rowNumber][spendRo.reportObjectName];
      
      resolve(investigateSectionConfig);
    });

    })

  }

  //Replicated this method from Dashboard Grid to enable drive on drill functionality in Oppfinder.
  public drillFilterClick(action) {
    action.actionId = action.driveAction.actionType == DashboardConstants.EventType.DrillDown ? DashboardConstants.FilterIdentifierType.DriveFilter : DashboardConstants.EventType.RemoveDrive;
    if (this.config.config.cards.filter((widget) => { return !widget.isRemoved && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent }).length > 1) {
      switch (action.widgetDataType) {
        case DashboardConstants.WidgetDataType.Chart:
        case DashboardConstants.WidgetDataType.GuageChart:
          action.driveAction.actionType == DashboardConstants.EventType.DrillDown ? this._dashboardDriveService.driveClickOnChart(action, this.dbGridSubject) : this._dashboardDriveService.processDriveClickOnChart(action, this.dbGridSubject);
          break;
        case DashboardConstants.WidgetDataType.MapChart:
          if (action.driveAction.actionType == DashboardConstants.EventType.DrillDown) {
            action["event"] = { event: action.event.event };
            this._dashboardDriveService.driveClickOnChart(action, this.dbGridSubject);
          } else
            this._dashboardDriveService.processDriveClickOnChart(action, this.dbGridSubject);
          break;
      }
    }
  }

  CalcFilterPanelHeight(isWindowScroll) {
    const isNextGenHeader: boolean = this._appConstant.userPreferences.IsNextGen;
    const extraNavElement = document.getElementsByClassName("extra-nav-wrap")[0] as HTMLElement;
    let subHeaderEle = document.getElementById('subheader-element');
    let headerTemp = !isNextGenHeader ? document.getElementsByClassName('extraHeader')[0] as HTMLElement : document.getElementsByClassName('frame-container')[0] as HTMLElement;
    if (subHeaderEle && headerTemp) {
      if (isWindowScroll) {
        let headerHeight = subHeaderEle.offsetHeight;
        this.filterPanelHeight = 'calc(100% - ' + headerHeight + 'px' + ')'
        this._elementRef.nativeElement.querySelector('.filter-panel-container').style.height = this.filterPanelHeight
      }
      else {
        let headerHeight = headerTemp.offsetHeight + subHeaderEle.offsetHeight;
        this.filterPanelHeight = 'calc(100% - ' + headerHeight + 'px' + ')'
        this._elementRef.nativeElement.querySelector('.filter-panel-container').style.height = this.filterPanelHeight
      }
    }
    // Making filter panel calculation if and only if the smart-next-gen header loader 

    if (isNextGenHeader) {
      this.distoryTimeout = setTimeout(() => {
        this.calculateFilterPanelTop();
      }, 250);
      extraNavElement.style.height = "47px";
      extraNavElement.classList.add('addNextGenbackground');

    }
    else {
      extraNavElement.style.height = "57px";
    }

  }

  ngOnDestroy() {
    //Avoid and Managing the Memeory leaks to be happened.
    if (this.sub.subscription)
      this.sub.subscription.unsubscribe();
    clearTimeout(this.distoryTimeout);
  }

  purchasePriceItemFormatter(obj, config) {
    this.grid = obj.grid;
    if (obj.filter.cellType == CellType.Cell) {
      var flex = obj.filter.grid;
      var row = flex.rows[obj.r];

      if (flex.columns[obj.c].header === null && config.uiConfig.iconType === 'text') {
        let icon = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
        obj.cell.innerHTML = '<span class="fontSize12 blue-text cursorPointer">' + icon + '</span>';
      };
      if (flex.columns[obj.c].header === null && config.uiConfig.iconType === 'icon') {
        let icon = "#icon_Preview";
        obj.cell.innerHTML = '<i class="icon small from-to-icon blue-text purchase-price-preview"><svg class="from-to-icon"><use xlink:href=' + icon + '></use></svg></i>'
      };

    }

  }

  async openPurchasePricePopup(config, rowNumber) {
    this._loaderService.showGlobalLoader();
    // const _lazyPurchasePricePopup: any = await this._commUtil.getLazyComponentReferences(LazyComponentConfiguration.PurchasePricePopup);
    this.createPopupConf(config, rowNumber).then((conf: any) => {
      this.purchasePricePopupRef.detach();
      this.purchasePricePopupRef.clear();
      // this._compPurchasePricePopup = this.purchasePricePopupRef.createComponent(_lazyPurchasePricePopup);
      conf.changeDetectionMutation = {};
      // this._compPurchasePricePopup.instance.config = conf;
      this.purchasePricePopupRef.createEmbeddedView(this.outletTemplateRef, {
        manifestPath: 'purchase-price-popup/purchase-price-popup',
        config: {
          config: conf
        }
      });
      this._loaderService.hideGlobalLoader();
    });
  }

  private createPopupConf(config, rowNumber) {
    // code to create report details with filter applied based on the row clicked by the user
    return new Promise((resolve, reject) => {
      const purchasePricePopupConfig: any = {
        reportDetails: undefined,
        api: {},
      }

      let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });


      if (this._dashboardCommService.oppFinderState.editMode) {
        purchasePricePopupConfig.iconType = DashboardConstants.OpportunityFinderConstants.ICON_TYPE.text;
        purchasePricePopupConfig.OpportunityName = this._dashboardCommService.oppFinderState.gridJson.OpportunityName;
        purchasePricePopupConfig.OpportunityDescription = this._dashboardCommService.oppFinderState.gridJson.OpportunityDescription;
        purchasePricePopupConfig.Confidence = this._dashboardCommService.oppFinderState.gridJson.Confidence;
        purchasePricePopupConfig.TotalEstimatedSavings = Number(this._dashboardCommService.oppFinderState.gridJson.opportunityRowData.Savings.replace(/[^0-9.-]+/g,""))
        purchasePricePopupConfig.AssignableSpend = Number(this._dashboardCommService.oppFinderState.gridJson.opportunityRowData.Spend.replace(/[^0-9.-]+/g,""))
        purchasePricePopupConfig.opportunityRowData = this._dashboardCommService.oppFinderState.gridJson.opportunityRowData;
        purchasePricePopupConfig.EOI_Data = this._dashboardCommService.oppFinderMasterData.OpportunityFinderEOIMaster;
        purchasePricePopupConfig.opportunityTypeMasterData = masterData;

        purchasePricePopupConfig.api = {
          closePopup: () => { console.log('Popup cannot be closed in edit mode') }
        };
        resolve(purchasePricePopupConfig);
      }
      else {
        let reportDetailsForPopup = this._commUtil.getDeReferencedObject(config.reportDetails);
        let popupRO: any = {};
        let materialRO: any = {};
        let countReportId :any;
        let widgetConf: any
        if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
          masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
        }

       // For opening the Buyer / Plant / Invoice Count on Conco and Ponpo Grid report configuration is generated from here and popup is opened.

        if ((this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name ||
          this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name
        ) && this.createNewOpportunity != true) {

          widgetConf = find(masterData.AdditionalProps,
            (prop) =>
            {
              return prop.ReportDetailsObjectId.toLowerCase() === config.reportDetails.reportDetailObjectId.toLowerCase()
            });
            if(this.oppfinderCountVar == DashboardConstants.UIMessageConstants.STRING_INVOICE_COUNT){ countReportId =  widgetConf.InvoinceCountReportID.toLowerCase();}
            if(this.oppfinderCountVar == DashboardConstants.UIMessageConstants.STRING_BUYER_COUNT){ countReportId =  widgetConf.BuyerCountReportID.toLowerCase();}
            if(this.oppfinderCountVar == DashboardConstants.UIMessageConstants.STRING_PLANT_NAME){ countReportId =  widgetConf.PlantCountReportID.toLowerCase();}
            this.loadDataByReportObjectId(countReportId).then((reportDetailsForCreateOpp: any) => {
              purchasePricePopupConfig.reportDetails = reportDetailsForCreateOpp;

              var RegionRO = find(config.reportDetails.lstReportObjectOnRow, (reportObject) => {
                return reportObject.reportObjectId.toLowerCase() == widgetConf.RegionReportId.toLowerCase();
              });

           

              let filterRegionValue = AnalyticsUtilsService.GetFormattedFilterValue(config.reportDetails.lstReportObjectOnRow, config.config.series[rowNumber][RegionRO.reportObjectName]);
              purchasePricePopupConfig.reportDetails.lstFilterReportObject.push(
                AnalyticsUtilsService.createDrillDriveFilterReportObj(
                  { reportObject: RegionRO, filterValue: filterRegionValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
                )
              );

              purchasePricePopupConfig.iconType = DashboardConstants.OpportunityFinderConstants.ICON_TYPE.icon;
              resolve(purchasePricePopupConfig);
            })
          purchasePricePopupConfig.api = {
            closePopup: () => { this.closePurchasePricePopup(); },
          };

        }

       // For creating new opportunity for all oppfinders.
       //Made this generic for all. Included conco and ponpo into this as well.

        else {
          if(this.createNewOpportunity == true){
            purchasePricePopupConfig.iconType = DashboardConstants.OpportunityFinderConstants.ICON_TYPE.text;
            purchasePricePopupConfig.opportunityRowData = config.config.series[0];   
            purchasePricePopupConfig.EOI_Data = this._dashboardCommService.oppFinderMasterData.OpportunityFinderEOIMaster;
            purchasePricePopupConfig.opportunityTypeMasterData = masterData;
            purchasePricePopupConfig.TotalEstimatedSavings = config.savings;
            purchasePricePopupConfig.AssignableSpend = config.assignableSpend;
            resolve(purchasePricePopupConfig);
            purchasePricePopupConfig.api = {
              closePopup: () => { this.closePurchasePricePopup(); },
            };
          }

        }    

      }
    });

  }

  closePurchasePricePopup() {
    this.purchasePricePopupRef.detach();
    this.purchasePricePopupRef.clear();
  }


  closeWidgetPopup() {
    this.investigateModeRef.detach();
    this.investigateModeRef.clear();
  }

  loadDataByReportObjectId(invoiceCountReportId){
    return new Promise((resolve, reject) => {
      this._analyticsCommonDataService.getReportDetailsByReportId(invoiceCountReportId)
        .toPromise()
        .then((response) => {
          if (response != undefined
            && response != null
            && response.toString().toLowerCase() !== "error".toLowerCase()) {
          }
          resolve(this._commUtil.toCamelWrapper(response));
        })

    })
  }


  private removeDrive_cardAction(action: any) {
    let card = this.config.config.cards.find(c => c.cardId === action.cardId && c.driveConfig.isDriver);
    if (card) {
      action.driveRemovalId = card.cardId;
      //This is so that when sort is applied the blue border from all the driver widgets should be remvoed.
      action.removeBlueBorder = true;
      this._dashboardDriveService.removeDrive();
      this.config.config.cards.forEach((widget) => {
        if (widget.cardId != card.cardId && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
          action.cardId = widget.cardId;
          action.actionId = DashboardConstants.EventType.RemoveDrive;
          this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], widget);
          this.triggerDashboardSubject(action);
        }
      });
    }
  }

  async loadSection() {
    if (this._commUtil.isNune(this.oppfinderContainerRef)) {
      this.oppfinderContainerRef.clear();
      this.dashboardConfig["manifest"] = this.dashboardConfig.container;
      let config = {
        config: this.dashboardConfig,
      }
      this.oppfinderContainerRef.createEmbeddedView(this.outletTemplateRef, {
        manifestPath: 'SmartCardsContainer/smartcardscontainer',
        config: config
      });
      return Promise.resolve(true);
    }
  }
  async loadGlobalFilterContainer() {
    if (this.globalFilterContainerRef) {
      this.globalFilterContainerRef.detach();
      this.globalFilterContainerRef.clear();
    }
    this.applierFilterConfig = {
      config: filter(this._dashboardCommService.appliedFilters, { enabledAsGlobalSlider: false }),
      api: {
        openGlobalFilter: (filter) => { this.openGlobalFilter(filter) },
        removeCurrentFilterChip: (e, obj, reportObjectId) => { this.removeCurrentChip(e, obj, reportObjectId) },
        applyFilterChanges: () => { this.onApplyFilter() },
        isFilterSidebarExpand: this.isFilterSidebarExpand,
        changeDetectionMutation: {}
      }
    }

    this.globalFilterContainerRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'GlobalFilterContainer/global-filter-container',
      config: {
        config: this.applierFilterConfig,

      }
    })
  }

  public getWidgetData(cardId): Observable<any> {
    let card = this.dashboardConfig.cards.find(c => c.cardId === cardId);
    return Observable.of(card.config);
  }
  setGridWidth() {
    if ($(window).width() > 1366) {
      this.gridstackAPI.setGridWidth(6);
    } else if ($(window).width() <= 1366) {
      this.gridstackAPI.setGridWidth(6);
    }
  }
  onWindowResize() {
    $(window).on('resize', function () {
      let thisRef = this;
      setTimeout(function () {
        thisRef.setGridWidth();
      }, 400);

    }.bind(this));
  }
  public gridCallback(param) {
    this.gridstackAPI = param.gridstack.data('gridstack');
    this.setGridWidth();
    this.onWindowResize();
    this.bindGridstackEvents(param.gridstack);
  }

  public bindGridstackEvents(gridstackInstance) {
    let thisRef = this;

    //change(event, items)
    //Occurs when adding/removing widgets or existing widgets change their position/size
    gridstackInstance.on('change', function (event, items) {
      //fix this soon.
      //Since we do not save the persistance data for opportunity finder we will not set the tabId and sectionId to the setPersistance service call.
      thisRef._dashboardCommService.setPersistenceData(thisRef.config.subheaderConfig.selectedDashboard, items, event, "", "");
    });

    //gsresizestop(event, ui)
    gridstackInstance.on('resizestop', function (event, elem) {
      event.actionId = DashboardConstants.EventType.ResizeCard;
      thisRef.triggerDashboardSubject(event);
    });

    gridstackInstance.on('dragstop', function (event, ui) {
      thisRef.triggerDashboardSubject(event);
      thisRef._dashboardCommService.triggerGridstackDrag();
    });
  }

  public triggerDashboardSubject(event) {
    switch (event.actionId) {
      case DashboardConstants.EventType.RemoveDrive:
      case DashboardConstants.FilterIdentifierType.DriveFilter: {
        this.dbGridSubject.subject.next(event);
        break;
      }
      case DashboardConstants.WidgetFunction.APPLY_GLOBAL_FILTER:
        this.dbGridSubject.subject.next(event)
        break;
      case DashboardConstants.EventType.ReflowChart:
          this.dbGridSubject.subject.next(event);
          break;
      case DashboardConstants.EventType.ResizeCard: {
        let element = event.target,
          cardId = element.querySelector('.dashboard-card-container').getAttribute('id');
        this.dbGridSubject.subject.next({
          actionId: event.type, cardId: cardId, event: event
        });
      }
    }

    setTimeout(() => {
      this._dashboardCommService.addHighchartLegendCSS(this._elementRef, this._renderer);
    }, 500);

  }

  onApplyFilter() {
    let thisRef = this;
    this.sub.subscription =
      this._dashboardCommService.apppliedFilterDataSource$.subscribe((data) => {
        this.selectedFilter = [];
        if (data !== undefined) {
          for (let filter of data.validatedTabs) {
            if (filter.FilterType === DashboardConstants.FilterType.MultiSelect && filter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
              for (let i of filter.selectedFilterList) {
                if (filter.selectedFilterList.length > 1) {
                  filter.filterchipName = filter.selectedFilterList[0].title + ' +' + (filter.selectedFilterList.length - 1) + 'more'
                }
                else {
                  filter.filterchipName = filter.selectedFilterList[0].title;
                }
                if (filter.selectedFilterList.length > 20) {
                  this.showSelectedText = DashboardConstants.UIMessageConstants.STRING_SHOWALLSELECTED.replace('@', '20').replace('~', filter.selectedFilterList.length)
                }
                else {
                  this.showSelectedText = DashboardConstants.UIMessageConstants.STRING_SHOWALL
                }
              }
            }
            else if (filter.FilterBy == DashboardConstants.FilterBy.FilterByCondition || filter.FilterType != DashboardConstants.FilterType.MultiSelect) {
              if (filter.FilterTabInfo) {
                filter.filterChipName = filter.FilterTabInfo;
              }
              else if (filter.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                this.getfilterChipName(filter);
              }
            }
          }

          // apply the previously saved filters as already applied on loading view
          // if (data.savedFilters != undefined && data.savedFilters.length !== 0) {
          //   data.savedFilters.forEach((savedFilter) => {
          //     this._dashboardCommService.appliedFilters.push(AnalyticsUtilsService.savedViewFilterToAppliedFilter(savedFilter, {
          //       listAllCrossSuiteFilterMapping: this._dashboardCommService.listAllCrossSuiteFilterMapping,
          //       listAllReportObjectWithMultiDatasource: this._dashboardCommService.listAllReportObjectWithMultiDatasource
          //     }));
          //   });
          //   data.validatedTabs = this._dashboardCommService.appliedFilters;
          //   // //making a dirty copy of filters which will be used to maintain the current state of filters, user iteractions will be saved in this copy and original clean filters will be replaced by this dirty object on saving the view
          //   // this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty = Object.assign([], this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters);
          // }
          if (data.validatedTabs != undefined && data.validatedTabs.length !== 0) {
            if (data.validatedTabs.length > 5) {
              
                this._commUtil.getMessageDialog("You can add only 5 Global Filters",
                  ()=>{},
                  DashboardConstants.OpportunityFinderConstants.STRING_INFORM);
              
            }
            else {
              //this.removeDrive();
              this.isGlobalFilterApplied = true;
              this.showChipBar = true;
              if (data.applyGlobalFilter && !data.applyGlobalSlider && !data.applyFilterPanelSlider) {
                this.removeGlobalSliderCardOnApply(data.validatedTabs)
              }

              if ((some(data.validatedTabs, { 'enabledAsGlobalSlider': true }) /*|| some(data.validatedFilterForTabs, { 'enabledAsGlobalSlider': true })*/) && !data.applyGlobalSlider) {

                this._dashboardCommService.createGlobalSliderConfig(data.validatedTabs, data.applyGlobalFilter,data.applyFilterPanelSlider);
                this.createGlobalSliderCardConfig();
                // if (data.isOpenView) {
                //   this._dashboardCommService.createGlobalSliderConfig(data.validatedFilterForTabs, data.applyGlobalFilter, data.applyFilterPanelSlider);
                //   this.createGlobalSliderCardConfig();
                // }
                this.setDashboardGridSubject();
                this.loadSection().then(resp => {
                });
              }
              this._dashboardCommService.appliedFilters = data.validatedTabs;
              // this._dashboardCommService.appliedFilters = data.applyGlobalSlider && !data.applyFilterPanelSlider ? this._dashboardCommService.appliedFilters : data.validatedTabs;
              this._dashboardCommService.fillFilterPanelList();
              if (this._dashboardCommService.appliedFilters.length > 0) {
                // this.refreshGlobalFiltersList();
                if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
                  this.renderWidgetForGlobalFilter();
                }
                // else if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {
                //   this.renderWidgetForCrossSuiteFilter();
                // }
              }
            }
          }
          else if (data.validatedTabs.length == 0 && this.isGlobalFilterApplied) {
            this.showChipBar = false;
            this.isGlobalFilterApplied = false;
            each(this.config.config.cards, (_values: any, _key: any) => {
              if(_values.componentId != DashboardConstants.GlobalSliderWidgetComponent){
              _values.reportDetails.lstFilterReportObject = this._commUtil.getDeReferencedObject(
                this.staleWidgetCard[_key].reportDetails.lstFilterReportObject);
              }
            });
            this.refreshLoadedWidget();
            //Incase when only one chip was present and it has been completely deselected from global filters syncing the filterPanelList container as well
            this._dashboardCommService.appliedFilters = data.validatedTabs;
            this._dashboardCommService.fillFilterPanelList();
            this.loadGlobalFilterContainer();


          }
          else {
            this.showChipBar = false;
          }
          if (this._dashboardCommService.appliedFilters.length > 0  &&  !data.applyFilterPanelSlider) {
            this.applierFilterConfig.config = filter(this._dashboardCommService.appliedFilters, { enabledAsGlobalSlider: false }); 
            setTimeout(() => {
              if (thisRef._commUtil.isNune(thisRef.applierFilterConfig.api)) {
                if (thisRef._commUtil.isNune(thisRef.applierFilterConfig.api.changeDetectionMutation))
                  thisRef.applierFilterConfig.api.changeDetectionMutation.setGlobalFilterContainerState();
              }
            }, 100);
          }
        }
      });
  }
  private setDashboardGridSubject() {
    this.dbGridSubject.subject = new Subject<IDashoardCardAction>();
    this.dbGridSubject.observer$ = this.dbGridSubject.subject.asObservable();
    this.dashboardConfig.cards.forEach(card => {
      card.dataCallback = this.getWidgetData.bind(this);
      card.subscriptions = this.sub.subject;
      card.dbGridSubject = this.dbGridSubject.observer$;
    });

    this.dashboardConfig.layout.config.callback = this.gridCallback.bind(this);
  }
  removeGlobalSliderCardOnApply(filterItem) {
    each(filterItem, (itemTabs) => {
      if (!itemTabs.enabledAsGlobalSlider) {
        let _widgetIndex = findIndex(this._commUtil._widgetCards, { cardId: itemTabs.ReportObjectId });
        if (_widgetIndex != -1) {
          itemTabs.enabledAsGlobalSlider = false;
          itemTabs.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
          this._commUtil._widgetCards[_widgetIndex].isRemoved = true;
          this._commUtil._widgetCards[_widgetIndex].subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.REMOVE_GLOBAL_SLIDER, cardId: this._commUtil._widgetCards[_widgetIndex].cardId })
        }
      }
    })
  }

  createGlobalSliderCardConfig(){
    if (this._dashboardCommService.globalSliderConfigArray.length) {
      this._dashboardCommService.globalSliderConfigArray.forEach((item) => {
        const index = findIndex(this._commUtil._widgetCards, { cardId: item.cardId });
        if (index < 0) {
          item.layoutItemConfig = {
            gridstackPosition: {
              x: 0,
              y: 0,
              width: 2,
              height: 4,
              minWidth: 2,
              minHeight: 2
            }
          }
          this._commUtil._widgetCards.push(item);
        }
        else {
          this._commUtil._widgetCards[index].sliderFilterArray[0].min = item.sliderFilterArray[0].min;
          this._commUtil._widgetCards[index].sliderFilterArray[0].max = item.sliderFilterArray[0].max;
          this._commUtil._widgetCards[index].sliderFilterArray[0].range.from = item.sliderFilterArray[0].range.from;
          this._commUtil._widgetCards[index].sliderFilterArray[0].range.to = item.sliderFilterArray[0].range.to;
        }
      });
    }
  }
  private getfilterChipName(filter: any) {
    if (filter.FilterType === DashboardConstants.FilterType.MultiSelect && filter.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
      filter.filterChipName = filter.FilterConditionOperator.title + " '" + filter.FilterConditionText.value + "'";
    }
    else if (filter.FilterType === DashboardConstants.FilterType.Date) {
      if (filter.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
        if (filter.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
          filter.filterChipName = filter.FilterConditionOperator.title + " '" + filter.FilterConditionRangeValue.from + " to " +
            filter.FilterConditionRangeValue.to + "'";
        }
        else {
          filter.filterChipName = filter.FilterConditionOperator.title + " '" + filter.FilterConditionValue + "'";
        }
      }
      else if (filter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
        if (filter.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.Rolling_Days || filter.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.Next_Days) {
          filter.filterChipName = DashboardConstants.ReportObjectOperators[filter.FilterRadioOperator.field.op] +
            " '" + filter.FilterConditionValue + "'";
        }
        else if (filter.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.From_DateTillToday) {
          filter.filterChipName = DashboardConstants.ReportObjectOperators[filter.FilterRadioOperator.field.op] +
            " '" + filter.FilterConditionValue + "'";
        }
        else {
          filter.filterChipName = DashboardConstants.ReportObjectOperators[filter.FilterRadioOperator.field.op];
        }
      }
    }
    else if (filter.FilterType === DashboardConstants.FilterType.Year) {
      if (filter.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
        if (filter.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
          filter.filterChipName = filter.FilterConditionOperator.title + " '" + filter.FilterConditionRangeValue.from + " to " +
            filter.FilterConditionRangeValue.to + "'";
        }
        else {
          filter.filterChipName = filter.FilterConditionOperator.title + " '" + filter.FilterConditionText.value + "'";
        }
      }
      else if (filter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
        if (filter.YearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Years || filter.YearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Years) {
          filter.filterChipName = DashboardConstants.ReportObjectOperators[filter.YearModel.field.op] +
            " '" + filter.FilterConditionText.value + "'";
        }
        else if (filter.YearModel.field.op === DashboardConstants.ReportObjectOperators.From_YearTillToday) {
          filter.filterChipName = DashboardConstants.ReportObjectOperators[filter.YearModel.field.op] +
            " '" + filter.FilterConditionText.value + "'";
        }
        else {
          filter.filterChipName = DashboardConstants.ReportObjectOperators[filter.YearModel.field.op];
        }
      }
    }
  }
  onMouseEnterChip(e, filterObj, index) {
    var findEle = this._elementRef.nativeElement.querySelector("#filteredChip" + index);
    if (findEle != undefined) {
      if (filterObj.FilterBy === DashboardConstants.FilterBy.FilterBySelection && (filterObj.FilterType === DashboardConstants.FilterType.MultiSelect)) {
        this._renderer.addClass(findEle, 'filters-upfront');
        this._renderer.setStyle(findEle, 'top', '158px');
      }
      else {
        this._renderer.removeClass(findEle, 'filters-upfront');
      }
    }
  }
// Commenting this method since this was required for older PPV. Now filters are not loading due to this method
/*   private clearAutoComplete(dashletInfoObject) {
    if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.PPV.shortName && dashletInfoObject.reportDetails.reportDetailObjectId == this._resOppReportDetails.reportDetails.reportDetailObjectId) {
      dashletInfoObject.autocompleteModalData = { selected: { name: DashboardConstants.UIMessageConstants.STRING_SELECTSUPPLIER } }
      dashletInfoObject.reportDetails.lstFilterReportObject = dashletInfoObject.reportDetails.lstFilterReportObject.filter((filter) => { return filter.reportObject.reportObjectId !== this.supplierRo.ReportObjectId });
    }
  } */

  onMouseLeaveChip(index) {
    var findEle = this._elementRef.nativeElement.querySelector("#filteredChip" + index);
    if (findEle != undefined) {
      this._renderer.removeClass(findEle, 'filters-upfront');
    }
  }

  // This method is called when you click on Apply button in Global Filter panel 
  // This method is similar to Dashboard-Grid Component 
  private renderWidgetForGlobalFilter(isWidgetInitialized: boolean = true) {
    this._dashboardCommService.filterCount = 1;
    this.config.config.cards.forEach((dashletInfoObject: any) => {
      
      if (!dashletInfoObject.isRemoved && dashletInfoObject.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
        var lstFilterReportObject = [];
        /**
        *  Removing Report Objfect from lstFilterReportObject other than contains has isGlobalFilter = 1
        */
        dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_globalWidgetFilter: any, _golbalWidgetFilterKey: any) => {
          each(this._dashboardCommService.appliedFilters, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {
            if (_globalWidgetFilter.reportObject.reportObjectId !== _appliedfilterValues.ReportObjectId &&
              _globalWidgetFilter.reportObject.reportObjectName !== _appliedfilterValues.ReportObjectName
            ) {
              if (_globalWidgetFilter.isGlobalFilter) {
                dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
              }
            }
          });
        });


        each(this._dashboardCommService.appliedFilters, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {

          //Code is Written for the Multiselect Filters
          if (
            _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ||
            ([
              DashboardConstants.FilterType.MultiSelect,
              DashboardConstants.FilterType.Date,
              DashboardConstants.FilterType.Year,
              DashboardConstants.FilterType.QuarterYear,
              DashboardConstants.FilterType.Quarter,
              DashboardConstants.FilterType.MonthYear,
              DashboardConstants.FilterType.Month,
              DashboardConstants.FilterType.Measure,
              DashboardConstants.FilterType.Number
            ].indexOf(_appliedfilterValues.FilterType) != - 1)
          ) {
            const { listFilterValues, Operators, FilterBy } = this._globalFilterService.getFilterValueWithOperator(
              _appliedfilterValues, _appliedfilterKeys
            );

            if (listFilterValues.length > 0) {
              /**
              * Removing the Earlier Applied Global Filters
              */
              dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_globalWidgetFilter: any, _golbalWidgetFilterKey: any) => {
                if (_globalWidgetFilter.reportObject.reportObjectId === _appliedfilterValues.ReportObjectId &&
                  _globalWidgetFilter.reportObject.reportObjectName === _appliedfilterValues.ReportObjectName
                ) {
                  if (_globalWidgetFilter.isGlobalFilter) {
                    dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                  }
                  else if (!_globalWidgetFilter.isGlobalFilter) {
                    dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].NestedReportFilterObject = null;
                    // dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].filterValue = [];
                    dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
                  }
                }
              });

              let _checkfilterAlreadyExists = this.isFilterAlreadyExistInWidget(dashletInfoObject.reportDetails.lstFilterReportObject, _appliedfilterValues);
              _checkfilterAlreadyExists.IsPresent = false;
              _checkfilterAlreadyExists.filterObjectIndex = -1;
              /**
               *  Creating the Filter Report Object For the Loaded Widget.
               *
               */

              lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(lstFilterReportObject,
                this._commUtil.createFilterReportObject(
                  _appliedfilterValues, _checkfilterAlreadyExists, dashletInfoObject, Operators, FilterBy, listFilterValues,
                  DashboardConstants.ModuleType.DASHBOARD,
                  DashboardConstants.ViewFilterType.SingleSource
                ), new SavedFilter);

              if (!_checkfilterAlreadyExists.IsPresent) {
                if (_checkfilterAlreadyExists.filterObjectIndex != -1) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(_checkfilterAlreadyExists.filterObjectIndex);
                }
                dashletInfoObject.reportDetails.lstFilterReportObject.push(lstFilterReportObject[0]);
              }
              else {
                if (_checkfilterAlreadyExists.filterObjectIndex != -1) {
                  dashletInfoObject.reportDetails.lstFilterReportObject[_checkfilterAlreadyExists.filterObjectIndex] = lstFilterReportObject[0];
                }
              }
              lstFilterReportObject = [];
            }

            else if (_appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {

              for (let i = 0; i < dashletInfoObject.reportDetails.lstFilterReportObject.length; i++) {
                if (dashletInfoObject.reportDetails.lstFilterReportObject[i].reportObject.reportObjectId === _appliedfilterValues.ReportObjectId &&
                  dashletInfoObject.reportDetails.lstFilterReportObject[i].reportObject.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(i, 1);
                  break;
                }
              }
            }
          }
        });
      }
    });

    if (isWidgetInitialized) {
      this.refreshLoadedWidget();
    }
  }

  private isFilterAlreadyExistInWidget(
    _lstWidgetFilterReportObject: Array<SavedFilter>,
    _selectedReportingObject: IReportingObjectMultiDataSource): any {
    for (let intCheck = 0; intCheck < _lstWidgetFilterReportObject.length; intCheck++) {
      if (_lstWidgetFilterReportObject[intCheck].reportObject.reportObjectName === _selectedReportingObject.ReportObjectName &&
        _lstWidgetFilterReportObject[intCheck].reportObject.reportObjectId === _selectedReportingObject.ReportObjectId) {
        return { filterObjectIndex: intCheck, IsPresent: true };
      }
    }
    return { filterObjectIndex: -1, IsPresent: false };
  }

  private refreshLoadedWidget() {

    this.opacityData = undefined;
    this.triggerDashboardSubject({
      actionId: DashboardConstants.WidgetFunction.APPLY_GLOBAL_FILTER
    });
  }


  public removeCurrentChip(e, obj, reportObjectId) {
    // this._commUtil.checkAllWidgetLoaded().then((_response: boolean) => {
    //   if (_response) {
    this.removefilterCurrentChip(e, obj, reportObjectId, true);
    this.applierFilterConfig.api.loadFilterPanel();
    //   }
    // });
  }

  private removefilterCurrentChip(e, obj: IReportingObjectMultiDataSource, reportObjectId: string, isWidgetReload: boolean) {
    //When the Global is removed then Drive is getting removed irrespective of Dashboard View Type
    //this.removeDrive();
    
    let index = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: reportObjectId });

    let _removedGlobalFilter = this._dashboardCommService.appliedFilters[index];
    this.config.config.cards.forEach((dashletInfoObject) => {
      if (!dashletInfoObject.isRemoved && dashletInfoObject.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
      // Commenting this method since this was required for older PPV. Now filters are not loading due to this method  
      //  this.clearAutoComplete(dashletInfoObject);
        if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
          /***
           *  Code for Removing the Applied Global Filter from dashlet Info Array based Upon IsGlobalFilter flag. ( Pretty Straight Forward).
           */
          dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_removeListFilterValue: any, _removeListFilterkey: any) => {
            if (_removeListFilterValue.reportObject.reportObjectId === _removedGlobalFilter.ReportObjectId &&
              _removeListFilterValue.reportObject.reportObjectName === _removedGlobalFilter.ReportObjectName) {
              if (_removeListFilterValue.isGlobalFilter) {
                dashletInfoObject.reportDetails.lstFilterReportObject.splice(_removeListFilterkey, 1);
              }
              else if (!_removeListFilterValue.isGlobalFilter) {
                dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].NestedReportFilterObject = null;
                // dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].filterValue = [];
                dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
              }
            }
          });
          // dashletInfoObject.sliderFilterArray = [];
          // this._commUtil._globalSilderBehaviorSubject$.next({
          //   objDashletInfo: dashletInfoObject,
          //   isWidgetInitialized: true
          // });
          // this.getSlider(dashletInfoObject, true);
        }
        else {
          /**
           * Code for Removing the Applied Cross Suite Global Filter from dashlet Info Array
           * basd upon the applied from datasource priorty level and removing the datasource object.
           * Flow diagram for removal of applied filter from chip in case of Cross Suite.
           * -----------------------------------------------------------------------------------------------------------
           *  Find DataSourcePriorty RO ===> Find DataSource RO from Mapping ===> Delete RO from Dashlet Info Array.
           * -----------------------------------------------------------------------------------------------------------
           * Getting the Cross Suite Reporting Mapping for the Removed Filter.
           */
          let _dsReportObject: IRelationObjectMapping = filter(_removedGlobalFilter.CrossSuiteFilterMapping.RelationObjectMapping,
            (_relValues: IRelationObjectMapping, _relKeys: any) => {
              return _relValues.DataSourceObjectId === dashletInfoObject.reportDetails.dataSourceObjectId;
            })[0];

          if (_dsReportObject != undefined) {
            //Getting the Specific Report Object Information from Multi Data Source to remove applied filter
            let _reportObjectInfo: IReportingObjectMultiDataSource = filter(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (
              _alldsROValues: IReportingObjectMultiDataSource, _alldsROKeys: any) => {
              return _alldsROValues.DataSource_ObjectId === _dsReportObject.DataSourceObjectId
                && _alldsROValues.ReportObjectId === _dsReportObject.ReportObjectId
            })[0];

            // deleting the Reporting object from DashletInfo Object Array.
            dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_removeListFilterValue: any, _removeListFilterkey: any) => {
              if (_removeListFilterValue.reportObject.reportObjectId === _reportObjectInfo.ReportObjectId &&
                _removeListFilterValue.reportObject.reportObjectName === _reportObjectInfo.ReportObjectName) {
                if (_removeListFilterValue.isGlobalFilter) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(_removeListFilterkey, 1);
                }
                else if (!_removeListFilterValue.isGlobalFilter) {
                  dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].NestedReportFilterObject = null;
                  // dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].filterValue = [];
                  dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
                }
              }
            });
          }
        }
      }
    });
    if (isWidgetReload) {
      //Commenting refreshLoadedWidget to avoid dashboard subject being triggered multiple times when multiple chips are removed togethere
     // this.refreshLoadedWidget();
      this._globalFilterService.clearFilter(obj);
      this._dashboardCommService.appliedFilters.splice(index, 1);
      this._globalFilterService.removeFilter(obj);
      this.applierFilterConfig.config = filter(this._dashboardCommService.appliedFilters, { enabledAsGlobalSlider: false });
      setTimeout(() => {
        if (this._commUtil.isNune(this.applierFilterConfig.api))
        {
          if (this._commUtil.isNune(this.applierFilterConfig.api.changeDetectionMutation))
          this.applierFilterConfig.api.changeDetectionMutation.setGlobalFilterContainerState();
        }
      }, 100);
    if (this._dashboardCommService.appliedFilters.length == 0) {
        this.showChipBar = false;
      }
    }
  }

  openGlobalFilter(filter, viewAll: boolean = false) {
    let isFilterOpen;
    if (viewAll) {
      filter.IsShowSelected = true;
    }
    isFilterOpen = this._globalFilterService.fadeOutDashboardGrid();
    this._dashboardCommService.openGlobalFilter(isFilterOpen);
    let dashboardWrapper = document.getElementById('dashboard-container-id'),
      mainContainer = document.getElementById('main-container-id');
    if (isFilterOpen) {
      dashboardWrapper.classList.add("global-filter-fixed");
      mainContainer.classList.add("overflow-hide");
    }
    else {
      dashboardWrapper.classList.remove("global-filter-fixed");
      mainContainer.classList.remove("overflow-hide");
    }
    this._dashboardCommService.openFilterpop({
      LoadFilterPopup: true
    })
    this._globalFilterService.setActiveFilter(filter);

  }

  private autocompleteKeyUp(event, config) {
    let filteredData: any;
    if (event.target.value != '') {
      filteredData = this.supplierList.filter(function (item) {
        if (item.name.toLowerCase().indexOf(event.target.value.toLowerCase()) === -1) {
          return false;
        } else {
          return true;
        }
      });
      this._resOppReportDetails.autoCompleteConfig.attributes.options = filteredData;
    }
    else {
      this._resOppReportDetails.autoCompleteConfig.attributes.options = this.supplierList;
    }
  }
  private async autocompleteSelection(event, config) {
    let filterIndex = this._resOppReportDetails.reportDetails.lstFilterReportObject.findIndex((fl) => { return fl.reportObject.reportObjectId == this.supplierRo.ReportObjectId });
    if (filterIndex > -1 && this._resOppReportDetails.reportDetails.lstFilterReportObject[filterIndex].FilterIdentifier === DashboardConstants.FilterIdentifierType.ReportLevelFilter) {
      this._resOppReportDetails.reportDetails.lstFilterReportObject.splice(filterIndex, 1);
    }
    this._resOppReportDetails.reportDetails.lstFilterReportObject = this._resOppReportDetails.reportDetails.lstFilterReportObject ? this._resOppReportDetails.reportDetails.lstFilterReportObject : [];
    this._resOppReportDetails.reportDetails.lstFilterReportObject.push(
      AnalyticsUtilsService.createDrillDriveFilterReportObj(
        { reportObject: this.supplierRo, filterValue: event.name, filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
      )
    );
    this._resOppReportDetails.reportDetails.isSubTotalRequired = false;
    this._resOppReportDetails.reportDetails.isGrandTotalRequired = false;
    this._resOppReportDetails.reportDetails.isLazyLoadingRequired = false;
    AnalyticsMapperService.MapReportDetailsMetadataToData(this._resOppReportDetails.reportDetails);
  }
  filterSidebarCallback() {

    this.isFilterSidebarExpand = !this.isFilterSidebarExpand;
    let filterContainerELe = this._elementRef.nativeElement.querySelector('.filter-panel-container');
    if (this.isFilterSidebarExpand) {
      this._renderer.addClass(filterContainerELe, 'filter-panel-toggle');
    }
    else {
      this._renderer.removeClass(filterContainerELe, 'filter-panel-toggle');

    }
    this.toggleFilterPanelCss();
    this.resizeDashboardContainer();
    this.loadGlobalFilterContainer();
    //On expand collapse of filter panel the chart should also reflow accordingly
    this.triggerDashboardSubject({
      actionId: DashboardConstants.EventType.ReflowChart
    });
  }

  resizeDashboardContainer() {
    let dashboardCardContainerEle = this._elementRef.nativeElement.querySelector('.dashboard-container')
    if (this.isFilterSidebarExpand) {
      this._renderer.addClass(dashboardCardContainerEle, 'paddingRight250');
      this._renderer.removeClass(dashboardCardContainerEle, 'paddingRight50')
    }
    else {
      this._renderer.addClass(dashboardCardContainerEle, 'paddingRight50')
      this._renderer.removeClass(dashboardCardContainerEle, 'paddingRight250')
    }
  }

  calculateFilterPanelTop() {
    let filterContainerELe = this._elementRef.nativeElement.querySelector('.filter-panel-container');
    let WindowYOffset = window.pageYOffset;
    if (window.pageYOffset <= 64) {
      filterContainerELe.style.position = 'fixed';
      filterContainerELe.style.top = 114 - window.pageYOffset + 'px';
    }
    else {
      filterContainerELe.style.top = 50 + 'px';
      filterContainerELe.style.position = 'fixed';
    }

    this.CalcFilterPanelHeight(true);

  }
  toggleFilterPanelCss() {
    //let filterPanelListEle = this._elementRef.nativeElement.querySelector('.filters-panel-list')
    //let filterPanelSearchEle = this._elementRef.nativeElement.querySelector('.filters-panel-search')
    let clearAllFilterEle = this._elementRef.nativeElement.querySelector('.clear-all-filter')
    let filterIconEle = this._elementRef.nativeElement.querySelector('.filter-panel-icon')
    let footerCLs = this._elementRef.nativeElement.querySelector('.footercls')
    if (clearAllFilterEle) {
      if (!this.isFilterSidebarExpand) {
        //this._renderer.addClass(filterPanelListEle, 'is-hide');
        //this._renderer.addClass(filterPanelSearchEle, 'is-hide');
        this._renderer.addClass(clearAllFilterEle, 'is-hide')
        this._renderer.setStyle(filterIconEle, 'margin-left', '-26px')
          if(document.getElementsByClassName("footercls").length){
            this._renderer.setStyle(footerCLs, 'width', '100%')
          }
      }
      else {
        //this._renderer.removeClass(filterPanelListEle, 'is-hide');
        //this._renderer.removeClass(filterPanelSearchEle, 'is-hide');
        this._renderer.removeClass(clearAllFilterEle, 'is-hide')
        this._renderer.setStyle(filterIconEle, 'margin-left', '-15px')
        if(document.getElementsByClassName("footercls").length){
          this._renderer.setStyle(footerCLs, 'width', 'calc(100% - 224px)')
        }
      }
    }
  }
}


