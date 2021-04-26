import {
  Component, OnInit, EventEmitter, ViewChild, ViewContainerRef, Inject,
  Input, ElementRef, Output, OnDestroy, Renderer2, TemplateRef, NgZone
} from "@angular/core";
import { Subject, Observable, Subscription, BehaviorSubject } from "rxjs";
import { StaticModuleLoaderService } from "smart-module-loader";
import {
  IDashoardCardAction, ICardDashboardSubscription,
  dashboardIConfig, dashboardISection, CardConfigNode
} from "@vsDashboardInterface";
import { DashboardCommService } from "@vsDashboardCommService";
import { GlobalFilterService } from "@vsGlobalFilterService";
import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { SavedFilter } from "@vsMetaDataModels/saved-filter.model";
import { IReportingObjectMultiDataSource, IRelationObjectMapping, IFilterList, IDashboardGridBindEventRef } from "@vsCommonInterface";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { ViewFilterDetails } from "@vsViewFilterModels/view-filter-details.model";
// import { visionModulesManifest } from "../../../modules-manifest";
import { each, filter, findIndex, map, mapValues, trimEnd, compact, sortBy, find, keys, cloneDeep, some } from 'lodash';
import { CommonUrlsConstants } from "@vsCommonUrlsConstants";
import { LoaderService } from "@vsLoaderService";
import { DashboardDriveService } from "@vsDashboardDriveService";
import { AppConstants } from "smart-platform-services";
import { productName, productTitle } from 'configuration/productConfig';
import { TabDetail } from "@vsDashletModels/tab-detail-model";
import { SectionInfo } from "@vsDashletModels/section-info-model";
import { TabFilterDetails } from "@vsTabModels/tab-filter-details-model";
// import { DashboardSlicerComponent } from '../dashboard-slicer/dashboard-slicer.component';
// import { analyzeAndValidateNgModules } from "@angular/compiler";


@Component({
  selector: 'dashboard-grid',
  templateUrl: './dashboard-grid.component.html',
  styleUrls: ['./dashboard-grid.component.scss'],
  preserveWhitespaces: false
})

export class DashboardGridComponent implements OnInit, OnDestroy {

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
  gridstackAPI: any;
  // appliedFilters: any = [];
  showChipBar: boolean = false;
  hideHeaderNotification: boolean = false;
  staleWidgetCard = [];
  isGlobalFilterApplied: boolean;
  //opacityData: any;
  selectedFilter: any;
  filterChipName: any;
  showSelectedText: any;
  dashboardConstant: any = DashboardConstants.FilterType.MultiSelect;
  constants = DashboardConstants;
  dbGridSubject: ICardDashboardSubscription = {} as ICardDashboardSubscription;
  filterPanelHeight: any;
  isFilterSidebarExpand: boolean = false;
  isSlicerFilterSidebarExpand: boolean = false;
  globalFilterContainerConfig: any;
  applierFilterConfig: any = {};
  distoryTimeout: any = {};
  applyGlobalFilter: boolean = false;
  isGlobalFltApplied: boolean = false;
  testSubject$: Subscription = new Subscription();
  // filterObjectForHierarchy: IHierarchyFilterObject = {} as IHierarchyFilterObject;
  //#endregion

  //#region <========= Dashboard Grid Component Decorator Declarations =========>
  @Input("config") config: dashboardISection;
  @Output() cardEvents: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("dashboardContainer", { read: ViewContainerRef }) dashboardContainerRef: ViewContainerRef;
  @ViewChild("outletTemplate") outletTemplateRef: TemplateRef<any>;
  @ViewChild('dashboardTabsContainer', { read: ViewContainerRef }) dashboardTabsContainerRef: ViewContainerRef;
  @ViewChild("globalFilterContainer", { read: ViewContainerRef }) globalFilterContainerRef: ViewContainerRef;
  @ViewChild("globalfilterTemplate") globalfilterTemplateRef: TemplateRef<any>;
  @ViewChild('slicerContainer', { read: ViewContainerRef }) slicerContainerRef: ViewContainerRef;
  @ViewChild("dashboardMoveToContainer", { read: ViewContainerRef }) dashboardMoveToContinerRef: ViewContainerRef;
  @ViewChild('globalSliderWidget', { read: ViewContainerRef }) globalSliderContainerRef: ViewContainerRef;
  //#endregion

  constructor(
    @Inject(StaticModuleLoaderService)
    private _staticLoader: StaticModuleLoaderService,
    private _elementRef: ElementRef,
    public _appConstant: AppConstants,
    public _dashboardCommService: DashboardCommService,
    private _globalFilterService: GlobalFilterService,
    private _commUtil: CommonUtilitiesService,
    private _renderer: Renderer2,
    private _commonUrlsConstants: CommonUrlsConstants,
    private _loaderService: LoaderService,
    private _dashboardDriveService: DashboardDriveService,
    private _ngZone: NgZone
  ) {

  }


  ngOnInit() {
    this._dashboardCommService.slicerComponetRefEvent = {
      createSlicerComponent: this.createSlicerWidgetComponent.bind(this),
      destroySlicerComponentRef: this.destroySlicerComponentRef.bind(this)
    } as IDashboardGridBindEventRef;
    this._dashboardCommService.bindSlicerExpandCallBack = this.slicerSidebarCallback.bind(this);
    // this.createSlicerWidgetComponent(config);
    if (this.staleWidgetCard.length == 0) {
      this.staleWidgetCard = cloneDeep(this.config.config.cards);
    }

    this.config.config.cards.forEach(element => {
      element.driveConfig.isDriver = false;
    });
    this.config.config.cards = each(this.config.config.cards, (_value, _key) => {
      return !_value.isRemoved;
    });
    if (!this.config.config.cards.length) {
      this.dashboardContainerRef.clear();
      this.noCardsForGivenTab();
    }
    this.dashboardConfig = this.config.config;
    this.toggleFilterPanelCss();
    this._dashboardCommService.removeFilter = this.removeCurrentChip.bind(this);

    // Subject is the way to make cards communicate with the document level;
    // When you click full screen, or sort inside the card.
    // The function below will trigger and provide you with the action
    // Action is an object that contain actionId and cardId
    this.setSubjectForCardOption();
    // this.dbGridSubject.subject = new Subject<IDashoardCardAction>();
    // this.dbGridSubject.observer$ = this.dbGridSubject.subject.asObservable();
    // this.dashboardConfig.cards.forEach(card => {
    //   card.dataCallback = this.getWidgetData.bind(this);
    //   card.subscriptions = this.sub.subject;
    //   card.dbGridSubject = this.dbGridSubject.observer$;
    // });

    // this.dashboardConfig.layout.config.callback = this.gridCallback.bind(this);
    this._dashboardCommService.removeTabLevelFilters = () => { this.removeTabFilter() };
    this.setDashboardGridSubject();
    this.loadSection().then((_response) => {
      // this.appliedFilters = this._dashboardCommService.appliedFilters;
      this.onApplyFilter();
      this.onSaveDashboard();
      //this.saveAsDashboard();
      this.CalcFilterPanelHeight(false);
      this.resizeDashboardContainer();
      this.loadDashboardTabsContainer();
      this.updateKebabMenuOptionForEachCard();
      //this.loadTabFilter();
    });

    this._commUtil._widgetCards = this.config.config.cards;

    // We need to chnage this code
    // this code is giving performance hit
    window.addEventListener('scroll', () => {
      this.calculateFilterPanelTop();
    });
  }


  CalcFilterPanelHeight(isWindowScroll) {
    const isNextGenHeader: boolean = this._appConstant.userPreferences.IsNextGen;
    const extraNavElement = document.getElementsByClassName("extra-nav-wrap")[0] as HTMLElement;
    let subHeaderEle = document.getElementById('subheader-element');
    let headerTemp = !isNextGenHeader ? document.getElementsByClassName('extraHeader')[0] as HTMLElement : document.getElementsByClassName('frame-container')[0] as HTMLElement;
    // Category Workbench Specific offset calculation 
    if (this._appConstant.userPreferences.moduleSettings.productTitle == productTitle[productName.categoryWorkbenchProduct]) {
      headerTemp = { offsetHeight: 56 } as HTMLElement;
    }
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
    // let subHeaderEle = document.getElementById('subheader-element');
    // let headerTemp = document.getElementsByClassName('extraHeader')[0] as HTMLElement;
    // if (subHeaderEle && headerTemp) {
    //   if (isWindowScroll) {
    //     let headerHeight = subHeaderEle.offsetHeight;
    //     this.filterPanelHeight = 'calc(100% - ' + headerHeight + 'px' + ')'
    //     this._elementRef.nativeElement.querySelector('.filter-panel-container').style.height = this.filterPanelHeight
    //   }
    //   else {
    //     let headerHeight = headerTemp.offsetHeight + subHeaderEle.offsetHeight;
    //     this.filterPanelHeight = 'calc(100% - ' + headerHeight + 'px' + ')'
    //     this._elementRef.nativeElement.querySelector('.filter-panel-container').style.height = this.filterPanelHeight
    //   }
    // }
  }

  public openReport(eventType: string, cardId: string) {
    const documentCode = isNaN(Number.parseInt(this._commUtil.getUrlParam('dc'))) ? 0 : Number.parseInt(this._commUtil.getUrlParam('dc'));
    window.open(this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.openReportUrl.replace('[ReportID]', cardId).replace('[dc]', (documentCode == 0 ? '' : '&dc=' + documentCode + '&viewId=' + this.config.subheaderConfig.selectedDashboard.viewId)), '_blank');
  }

  updatecall(e) {
    this._dashboardDriveService.setOpacityMapping(e.cardId, Object.assign({}, e.event.event._chart.series[0].data));
  }

  ngOnDestroy() {
    //Avoid and Managing the Memeory leaks to be happened.
    if (this.sub.subscription)
      this.sub.subscription.unsubscribe();
    clearTimeout(this.distoryTimeout);
  }

  onDeinitialize(event) {

  }
  onActivate(event) {

  }

  onInitialize(event) {

  }

  async loadSection() {

      if (this._commUtil.isNune(this.dashboardContainerRef)) {
        this.dashboardContainerRef.clear();
        this.dashboardConfig["manifest"] = this.dashboardConfig.container;
        let config = {
          config: this.dashboardConfig,
        }
        this.dashboardContainerRef.createEmbeddedView(this.outletTemplateRef, {
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
    let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
    this.applierFilterConfig = {
      config: filter(this._dashboardCommService.appliedFilters, { enabledAsGlobalSlider: false }),
      tabFilter: this._commUtil.isNune(_currentTabDetail) ? filter(_currentTabDetail.lstAppliedTabFilters, { enabledAsGlobalSlider: false }) : [],
      api: {
        openGlobalFilter: (filter) => { this.openGlobalFilter(filter) },
        removeCurrentFilterChip: (e, obj, reportObjectId, isTabFilter) => { this.removeCurrentChip(e, obj, reportObjectId, isTabFilter) },
        applyFilterChanges: () => { this.onApplyFilter() },
        isFilterSidebarExpand: this.isFilterSidebarExpand,
        changeDetectionMutation: {},
        openTabFilter: (filter) => { this.openTabFilter(filter) }
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
      thisRef._dashboardCommService.setPersistenceData(thisRef.config.subheaderConfig.selectedDashboard, items, event, thisRef._dashboardCommService.selectedTab.tabId, thisRef._dashboardCommService.selectedTab.sectionId);
    });

    //gsresizestop(event, ui)
    gridstackInstance.on('resizestop', function (event, elem) {
      event.actionId = DashboardConstants.EventType.ResizeCard;
      thisRef.triggerDashboardSubject(event);
      let element = event.target,
        cardId = element.querySelector('.dashboard-card-container').getAttribute('id');
      let breadcrumbUIConfig;
      for (let card of thisRef.config.config.cards) {
        if (cardId == card.cardId) {
          breadcrumbUIConfig = card.breadCrumbUIConfig
          if (breadcrumbUIConfig)
            thisRef._dashboardCommService.calcBreadcrumbWidth(cardId, breadcrumbUIConfig);
        }
      }

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

  public createSlicerWidgetComponent(config) {
    if (this.slicerContainerRef) {
      this.slicerContainerRef.clear();
    }
    if (config.config.length === 0) {
      return;
    }
    else {
      config.config.config = sortBy(config.config.config, 'DisplayName');
      this.resizeDashboardContainer();
      this.resizeDashbaordTabsContainer();
      config.config.isSlicerFilterSidebarExpand = this.isSlicerFilterSidebarExpand;
      this.slicerContainerRef.createEmbeddedView(this.outletTemplateRef, {
        manifestPath: 'DashboardSlicer/dashboard-slicer',
        config: config
      });
    }
  }

  public destroySlicerComponentRef() {
    this.resetTheTabContainer();
    if (this.slicerContainerRef) {
      this.slicerContainerRef.detach();
      this.slicerContainerRef.clear();
      this.slicerContainerRef.remove();
    }
  }

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

  public removeDashboardCard(eventType, cardId) {
    this.removeDashboardWidget(eventType, cardId);
    // //let el = this._elementRef.nativeElement.querySelector('#' + cardId);
    // let el = document.getElementById(cardId);
    // this.gridstackAPI.removeWidget(this.findAncestor(el, 'grid-stack-item'));
    // // remove drive
    // let card = this.config.config.cards.find(c => c.cardId === cardId && c.driveConfig.isDriver);
    // if (card) {
    //   let event: any = {};
    //   event.eventType = eventType;
    //   event.cardId = cardId;
    //   this.removeDrive_cardAction(event);
    //   this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_REMOVED);
    // }

    // // Remove Dashboard Filters if Cross Suite View and filters are applied while removing the card
    // if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1 && this._dashboardCommService.appliedFilters.length >= 1) {
    //   (
    //     this._commUtil.getDeReferencedObject(this._dashboardCommService.appliedFilters) as Array<IReportingObjectMultiDataSource>
    //   ).forEach((_appfilterValue: IReportingObjectMultiDataSource, _appfilterKey: any) => {
    //     this.removefilterCurrentChip(null, _appfilterValue, _appfilterKey, false);
    //     this._globalFilterService.clearFilter(_appfilterValue);
    //     this._globalFilterService.removeFilter(_appfilterValue);
    //   });

    //   this._dashboardCommService.appliedFilters = [];
    //   this.config.subheaderConfig.selectedDashboard.lstDashboardFilters = [];
    //   this.showChipBar = false;
    //   this.refreshLoadedWidget();
    // }
    // // TODO : remove dashboard filters if cross suite view.
    // // this.config.config.cards.splice(this.config.config.cards.findIndex(c => c.cardId === cardId), 1);
      this.cardEvents.emit({ eventType: eventType, cardId: cardId });
  }
  public removeGlobalSliderCard(eventType, cardId) {
    //This will remove the global slider card from grid stack
    this.removeDashboardWidget(eventType, cardId);
    //  Now we also need to update the widget cards 
    if (this._commUtil.isNune(this._commUtil._widgetCards)) {
      const index = findIndex(this._commUtil._widgetCards, { cardId: cardId });
      if (index != -1) {
        this._commUtil._widgetCards.splice(index,1);
      }
    }
  }
  public unlinkDashboardCard(eventType, cardId) {
    this.cardEvents.emit({ eventType: eventType, cardId: cardId })
  }

  public renameDashboardCard(eventType, cardId, cardName) {
    this.cardEvents.emit({ eventType: eventType, cardId: cardId, cardName: cardName })
  }

  public updateDescription(eventType: string, cardId: string, cardDescription: any) {
    this.cardEvents.emit({ eventType: eventType, cardId: cardId, cardDescription: cardDescription })
  }
  public linkToDashboard(eventType: string, cardId: string) {
    this.cardEvents.emit({ eventType: eventType, cardId: cardId })
  }
  public unlinkFromDashboard(eventType: string, cardId: string) {
    this.cardEvents.emit({ eventType: eventType, cardId: cardId })
  }
  public headingClickedLinkedWidget(eventType: string, cardId: string, redirectToLinkedViewId: string) {
    this.cardEvents.emit({ eventType: eventType, cardId: cardId, redirectToLinkedViewId: redirectToLinkedViewId })
  }
  public findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  public drillUpHandler(action) {
    this.config.config.cards.forEach(element => {
      if (element.cardId === action.cardId) {
        let seriesData = [];
        for (let i = 1; i < 15; i++) {
          let randomNum = Math.floor(Math.random() * 100);
          seriesData.push(randomNum);
        }
        element.config.series.forEach(element => {
          element.data = seriesData;
        });
        element.config.chartAPI.updateChart();
        element.driveConfig.isDriver = false;
      }
    });
  }


  public sort() {

  }

  public onApplyFilter(refreshWidget: boolean = true) {
    let thisRef = this;
    this.sub.subscription.add(this._dashboardCommService.apppliedFilterDataSource$.subscribe((data) => {
      //If its openView then if the refreshWidget is false we wont do anything if not then if refreshWidget is false the we set it true
      if (!data.isOpenView) {
        refreshWidget = true
      }
      //When we open a view with a tab but no widget at that time we will not get any listOfDataSource and we will also not get filterLIst hence checking the length of key in the data object.
      if (keys(data).length > 0) {
        // if(data.filterType == 'slicer') {
        //   //If slicer filter than append the validatedTabs to the appliedFilters list.
        //   this._dashboardCommService.appliedFilters.push(...data.validatedTabs);
        //  this.renderWidgetForGlobalFilter();
        // }
        // else  {
        /**
         * We will select the tab from the tabDashletInfo and set the applied filters in its listOfAppliedFilter.
         */
        let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
        let isOpenView = data.isOpenView ? true : false;
        let isInitializeWidget = data.isInitializeWidget ? true : false;
        /** In case of slicerfilter we will have to create the component when the user opens the view with saved slicerFilter.
         * So we will check if this observable is triggered at the open report case and create the slicerComponent ref here based
         * on the flag sent by the data from the dashboard-grid-wrapper component.
         * In this case i.e. openDashboard the filterList and selectedFilterList will be updated in
         * the dashboard-slicer component and not in the renderWidgetForGlobalFilters.
         */
        switch (data.componentToCreate) {
          case DashboardConstants.Component.SlicerComponent:
            if (thisRef._dashboardCommService.slicerFilterList.length > 0) {
              let config = {
                config: {
                  config: this._dashboardCommService.slicerFilterList,
                  createSlicerComponent: true
                }
              };
              if (isInitializeWidget)
                this._dashboardCommService.slicerComponetRefEvent.createSlicerComponent(config);
              break;
            }
          default:
            break;
        }
        /* ValidatedTabs only contains those filters which are applied throught the GlobalFilter drop down list but 
        the dashboardCommService.applied filters contains all the global as well as the slicerFilter list. 
        So we update here the ValidatedTabs by adding all the slicerFilters from the 
        dashboardCommService.applied filters list this is only done in case of applying filter from the global filter component i.e
        applying global filters.
        */
        this.applyGlobalFilter = data.applyGlobalFilter;
        //If this is not openView i.e. now user is in the view applying or removing the filters we set the validatedFilterTabs to empty list.
        if (!data.isOpenView)
          data.validatedFilterForTabs = [];
        if (data.isRemoveAllSlicer ||
          (data.filterType === DashboardConstants.PopupFor.Slicer && !this._dashboardCommService.slicerFilterList.length)) {
          this._dashboardCommService.slicerComponetRefEvent.destroySlicerComponentRef();
          this.isSlicerFilterSidebarExpand = false;
          let filterContainerELe = this._elementRef.nativeElement.querySelector('.dashboard-slicer');
          let slicerContainerEle = this._elementRef.nativeElement.querySelector('.dashboard-slicer-wrapper');
          this._renderer.removeClass(filterContainerELe, 'slicer-panel-toggle');
          this._renderer.addClass(slicerContainerEle, 'is-hide')
          this.resizeDashboardContainer();
          setTimeout(() => {
            for (let card of this.config.config.cards) {
              if (card.breadCrumbUIConfig)
                this._dashboardCommService.calcBreadcrumbWidth(card.cardId, card.breadCrumbUIConfig);
            }
          }, 1000);
          //On expand collapse of filter panel the chart should also reflow accordingly
          this.triggerDashboardSubject({
            actionId: DashboardConstants.EventType.ReflowChart
          });
        }
        //In case of open view with saved view filter and tab filter we will reset both the appiledFilters and the tabFilters for the current active tab.
        if (data.isOpenView || (this.applyGlobalFilter && !data.isTabFilter)) {
          this.updateSlicerFilterInAppliedFilterList(this._dashboardCommService.appliedFilters, data.validatedTabs);
        }

        this.selectedFilter = [];
        if (data !== undefined) {
          this.setFilterChipName(data.validatedTabs);
          if (data.isOpenView) {
            this.setFilterChipName(data.validatedFilterForTabs);
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
          //In case of open view or change tab the validatedFilterForTabs will also be there hence checking the length of either the 
          //Global or tab level filter here.
          if (data.validatedTabs != undefined && (data.validatedTabs.length !== 0 || data.validatedFilterForTabs.length != 0)) {
            let lstOFGlobalFilters = filter(data.validatedTabs, (_val) => { return _val.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource && _val.FilterIdentifier != DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource })
            let msg = data.isTabFilter ? "You can add only 5 Tab Filters" : "You can add only 5 Global Filters";
            let maxFilterAllowed = data.isOpenView ? 10 : 5;
            if (data.isOpenView) {
              let tabFilters = filter(data.validatedFilterForTabs, (_val) => { return _val.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource && _val.FilterIdentifier != DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource });
              lstOFGlobalFilters = [...lstOFGlobalFilters, ...tabFilters];
            }
            if (lstOFGlobalFilters.length > maxFilterAllowed) {
              this.sub.subscription.add(
                this._commUtil.getMessageDialog(msg,
                  () => { },
                  DashboardConstants.OpportunityFinderConstants.STRING_INFORM)
              );
            }
            else {
              this._dashboardDriveService.removeDrive();
              this.isGlobalFilterApplied = true;
              this.showChipBar = true;
              if (data.applyGlobalFilter && !data.applyGlobalSlider && !data.applyFilterPanelSlider) {
                this.removeGlobalSliderCardOnApply(data.validatedTabs)
                if (data.isOpenView) {
                  this.removeGlobalSliderCardOnApply(data.validatedFilterForTabs);
                }
              }
              if ((some(data.validatedTabs, { 'enabledAsGlobalSlider': true }) || some(data.validatedFilterForTabs, { 'enabledAsGlobalSlider': true })) && !data.applyGlobalSlider) {

                this._dashboardCommService.createGlobalSliderConfig(data.validatedTabs, data.applyGlobalFilter,data.applyFilterPanelSlider,data.isTabFilter);
                this.createGlobalSliderCardConfig();
                if (data.isOpenView) {
                  this._dashboardCommService.createGlobalSliderConfig(data.validatedFilterForTabs, data.applyGlobalFilter, data.applyFilterPanelSlider, true);
                  this.createGlobalSliderCardConfig();
                }
                this.setDashboardGridSubject();
                this.loadSection().then(resp => {
                });
              }
              if (data.isOpenView) {
                this._dashboardCommService.appliedFilters = data.validatedTabs;
                _currentTabDetail.lstAppliedTabFilters = data.validatedFilterForTabs;
                this._dashboardCommService.showNoTabFilterMsg = filter(_currentTabDetail.lstAppliedTabFilters, { enabledAsGlobalSlider: false }).length === 0;
              }
              else if (data.isTabFilter) {
                //Here if this is tabFilter we will update the applied Filter list of this particular tab.
                _currentTabDetail.lstAppliedTabFilters = data.validatedTabs;
                this._dashboardCommService.showNoTabFilterMsg = filter(_currentTabDetail.lstAppliedTabFilters, { enabledAsGlobalSlider: false }).length === 0;

              }
              else {
                this._dashboardCommService.appliedFilters = data.applyGlobalSlider && !data.applyFilterPanelSlider ? this._dashboardCommService.appliedFilters : data.validatedTabs;
              }
              if (data.isOpenView) {
                this._dashboardCommService.fillFilterPanelListOnOpenView();
              }
              else {
                this._dashboardCommService.fillFilterPanelList(data.isTabFilter);
              }
              if (this._dashboardCommService.appliedFilters.length > 0 ||
                _currentTabDetail.lstAppliedTabFilters.length > 0) {
                // this.refreshGlobalFiltersList();
                if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
                  this.renderWidgetForGlobalFilter(data.isRemoveAllSlicer, data.isTabFilter, isOpenView, isInitializeWidget, refreshWidget);
                }
                else if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {
                  this.renderWidgetForCrossSuiteFilter(refreshWidget);
                }
              }
            }
          }
          //If the current validated tabs length is zero.
          else if (data.validatedTabs.length == 0 && this.isGlobalFilterApplied) {
            //IF all the filters are removed that is all the view level and the tabs filter.
            if (this.checkIfNoFilterApplied(data.isTabFilter, _currentTabDetail)) {
              this.showChipBar = false;
              this.isGlobalFilterApplied = false;
              each(this.config.config.cards, (_values: any, _key: any) => {
                if(_values.componentId != DashboardConstants.GlobalSliderWidgetComponent)
                {
                  _values.reportDetails.lstFilterReportObject = this._commUtil.getDeReferencedObject(
                  this.staleWidgetCard[_key].reportDetails.lstFilterReportObject);
                }
              });
            }
            //If only tab level or view level filter is removed. We will remove only that filters from the widgets.
            else if (!this.checkIfNoFilterApplied(data.isTabFilter, _currentTabDetail)) {
              this.isGlobalFilterApplied = true;
              this.showChipBar = true;
              //If this is tab filter applied and user removes all the filter values then we will store only the globalFilter and vice versa.
              let isGlobalOrTabFilter = data.isTabFilter ? 'isGlobalFilter' : 'isTabFilter';
              let lstAppliedFilter = [];
              each(this.config.config.cards, (_values: any, _key: any) => {
                if (_values.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
                  each(_values.reportDetails.lstFilterReportObject, (_appliedFilterValue: any, _appliedfilterKey: number) => {
                    //In case of this being the scenario where the user removes the tab filter here we will still get the isGlobalFilter flag true for tabFilter so we also check that not only isGlobalFilter true but also 
                    //that this is not tab filter i.e. isTabFilter false
                    if (data.isTabFilter) {
                      if (_appliedFilterValue[isGlobalOrTabFilter] && !_appliedFilterValue['isTabFilter']) {
                        lstAppliedFilter.push(_appliedFilterValue);
                      }
                    }
                    //If this is not the tab fitler remove then we directly get all the isTabFilter and remove the rest of the global filters.
                    else {
                      lstAppliedFilter.push(_appliedFilterValue);
                    }

                  });
                  _values.reportDetails.lstFilterReportObject = [...lstAppliedFilter];
                  lstAppliedFilter = [];
                }
              });
            }
            this.refreshLoadedWidget();
            if (data.isTabFilter) {
              _currentTabDetail.lstAppliedTabFilters = data.validatedTabs;
              this._dashboardCommService.showNoTabFilterMsg = _currentTabDetail.lstAppliedTabFilters.length === 0;
            }
            else {
              //Incase when only one chip was present and it has been completely deselected from global filters syncing the filterPanelList container as well
              this._dashboardCommService.appliedFilters = data.validatedTabs;
              this._dashboardCommService.lstOfGlobalFilters = [];
            }
            this._dashboardCommService.fillFilterPanelList(data.isTabFilter);
            this.loadGlobalFilterContainer();
            //If the slicer filters are present we will reloaded them as well
            if (isOpenView && isInitializeWidget) {
              if (
                this.applyGlobalFilter &&
                this._dashboardCommService.slicerFilterConfig.size
              ) {
                this._dashboardCommService.updateSlicerFilterData(undefined);
              }
            }
            else if (!data.isTabFilter && !isOpenView) {
              if (
                this.applyGlobalFilter &&
                this._dashboardCommService.slicerFilterConfig.size
              ) {
                this._dashboardCommService.updateSlicerFilterData(undefined);
              }
            }

          }
          else {
            this.showChipBar = false;
          }
          if (this._dashboardCommService.appliedFilters.length > 0 ||
            _currentTabDetail.lstAppliedTabFilters.length > 0 &&  !data.applyFilterPanelSlider) {
            this.applierFilterConfig.config = filter(this._dashboardCommService.appliedFilters, { enabledAsGlobalSlider: false });
            this.applierFilterConfig.tabFilter = filter(_currentTabDetail.lstAppliedTabFilters, { enabledAsGlobalSlider: false });
            setTimeout(() => {
              if (thisRef._commUtil.isNune(thisRef.applierFilterConfig.api)) {
                if (thisRef._commUtil.isNune(thisRef.applierFilterConfig.api.changeDetectionMutation))
                  thisRef.applierFilterConfig.api.changeDetectionMutation.setGlobalFilterContainerState();
              }
            }, 100);
          }
        }
        // }

        //Check if global filter is applied.
        this.checkIsGlobalFilterApplied(data.isTabFilter, data.isOpenView);
      }
    }));
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
              height: 2,
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
  onMouseEnterChip(e, filterObj, index) {
    let selectedChipEle = this._elementRef.nativeElement.querySelector(".selected-list-chip-container");
    let calcTop = (Math.abs(selectedChipEle.getBoundingClientRect().top) + 20) + 'px';

    var findEle = this._elementRef.nativeElement.querySelector("#filteredChip" + index);

    if (findEle != undefined) {
      if (filterObj.FilterBy === DashboardConstants.FilterBy.FilterBySelection && (filterObj.FilterType === DashboardConstants.FilterType.MultiSelect)) {
        this._renderer.addClass(findEle, 'filters-upfront');
        this._renderer.setStyle(findEle, 'top', calcTop);
      }
      else {
        this._renderer.removeClass(findEle, 'filters-upfront');
      }
    }
  }

  onMouseLeaveChip(index) {
    var findEle = this._elementRef.nativeElement.querySelector("#filteredChip" + index);
    if (findEle != undefined) {
      this._renderer.removeClass(findEle, 'filters-upfront');
    }
  }

  private onSaveDashboard() {
    this.sub.subscription.add(
      this._dashboardCommService.commWrapperSubheaderEvents$.subscribe((data) => {
        if (data != undefined && data.eventType != null) {

          if (data.eventType == DashboardConstants.EventType.GetSaveDashboard) {
            /**
            *  This code has been written for the Save As Dashboard Implemnetation. It will invoke the on the SetSaveDashboard Event
            */
            const { savedFilters, dashletArray, tabDashletArray } = this.crateSaveDashboardDetails();
            this._dashboardCommService.commWrapperSubheaderEvents$.next(
              {
                dashboardFilters: savedFilters,
                dashletArray: dashletArray,
                tabDashletArray,
                eventType: DashboardConstants.EventType.SetSaveDashboard
              }
            );
          }
          else if (data.eventType == DashboardConstants.EventType.GetSaveAsDashboard) {
            /**
             *  This code has been written for the Save As Dashboard Implemnetation. It will invoke the on the SetSaveAsDashboard Event
             */
            const { savedFilters, dashletArray, tabDashletArray } = this.crateSaveDashboardDetails();
            this._dashboardCommService.commWrapperSubheaderEvents$.next(
              {
                dashboardFilters: savedFilters,
                dashletArray: dashletArray,
                tabDashletArray,
                viewName: data.viewName,
                eventType: DashboardConstants.EventType.SetSaveAsDashboard
              }
            );
          }
        }
      })
    );
  }

  private crateSaveDashboardDetails(): any {
    /**
     *  This will create the object details for the Global Filter List and Card Details for the Save Objects
     *  in case of SaveDashboard & SaveAsDashboard. And Seprated the code to avoid the duplication of the code and 
     *  calling it.
     */
    this._loaderService.showGlobalLoader();
    const savedFilters = this.refreshGlobalFiltersList(this._dashboardCommService.appliedFilters);
    //const dashletArray = this.getCardsForSaveDahboard();
    // const tabDashletInfo = this.getTabsForSaveDahboard();
    each(this._dashboardCommService.tabDashletInfo.lstTabDetails, (_tab: TabDetail, _tabIndex: number) => {
      _tab.lstTabFilter = [];
      _tab.lstTabFilter = this.refreshGlobalFiltersList(_tab.lstAppliedTabFilters, true);
    });
    const { tabDashletArray, dashletArray } = this.getTabDashletArray();
    return { savedFilters, dashletArray, tabDashletArray };
  }


  private getTabDashletArray() {
    let dashletArray = [];
    let tempArray = [];
    let tabDashletArray = new Map<string, Array<any>>();
    let thisRef = this;
    each(this._dashboardCommService.tabDashletInfo.lstTabDetails, (_tab: TabDetail) => {
      each(_tab.lstSectionInfo, (_section: SectionInfo) => {
        each(_section.lstDashletInfo, (widget: any) => {
          //The dashletInfo needs to be converted to the card config format even if the tabs was not open.
          widget = this.config.api.mapDashletToCardConfig(widget, this._dashboardCommService.selectedViewInfo, this._dashboardCommService.selectedTab,true);
          widget.sort.appliedSort[0] = this._dashboardCommService.lstOfDashletSort.get(widget.reportDetails.reportDetailObjectId);
          tempArray.push(thisRef.getDashletCardDetailForSaveDashboard(widget));
        });
      });
      compact(tempArray);
      tabDashletArray.set(_tab.tabId, tempArray);
      dashletArray.push(...tempArray);
      tempArray = [];
    });
    compact(dashletArray);
    return { tabDashletArray, dashletArray };
  }

  private getDashletCardDetailForSaveDashboard(widget: any) {
    if (!widget.isRemoved) {
      let saveWidgetObj: any = {
        title: widget.cardTitle,
        reportDetailsId: this._commUtil.getDeReferencedObject(widget.reportDetails.reportDetailObjectId),
        // AdditionalProperties: '{"height":5,"minWidth":1,"width":1,"minHeight":5,"x":0,"y":0}',
        reportDetails: this._commUtil.getDeReferencedObject(widget.reportDetails),

        x: widget.layoutItemConfig.gridstackPosition.x,
        y: widget.layoutItemConfig.gridstackPosition.y,
        height: widget.layoutItemConfig.gridstackPosition.height,
        width: widget.layoutItemConfig.gridstackPosition.width,
        minHeight: widget.layoutItemConfig.gridstackPosition.minHeight,
        minWidth: widget.layoutItemConfig.gridstackPosition.minWidth,
        titleFlag: widget.uiConfig.showTitle,
        percentageFlagSummaryCard: widget.uiConfig.showPercentageSummaryCard,
        isLinkReport: widget.reportDetails.isLinkReport
      }
      saveWidgetObj.reportDetails.displayName = widget.cardTitle;
      saveWidgetObj.reportDetails.reportName = widget.cardTitle;
      if (saveWidgetObj.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard) {
        saveWidgetObj.AdditionalProperties = `{"x":${saveWidgetObj.x},"y":${saveWidgetObj.y},"width":${saveWidgetObj.width},"height":${saveWidgetObj.height},"minWidth":"1","minHeight":"2","titleFlag":${widget.config.showTitle},"percentageFlagSummaryCard":${widget.config.showPercentageValue}}`;
      }
      else {
        saveWidgetObj.AdditionalProperties = `{"x":${saveWidgetObj.x},"y":${saveWidgetObj.y},"width":${saveWidgetObj.width},"height":${saveWidgetObj.height},"minWidth":"2","minHeight":"4"}`;
      }
      // JSON.parse(JSON.stringify(widget));
      saveWidgetObj.reportDetails.lstFilterReportObject = Object.assign([], filter(saveWidgetObj.reportDetails.lstFilterReportObject, (appliedFilter) => {
        if (appliedFilter.NestedReportFilterObject && appliedFilter.NestedReportFilterObject.isGlobalFilter) {
          appliedFilter.NestedReportFilterObject = null;
        }
        return !appliedFilter.isGlobalFilter;
      }));
      // fixing the save issue for ANLT-7460 i.e to reportProperties.
      saveWidgetObj.reportDetails.reportProperties = saveWidgetObj.reportDetails.reportProperties ? JSON.stringify(saveWidgetObj.reportDetails.reportProperties) : '';
      if (widget.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard
        && this._commUtil.isNune(widget.config)
        && this._commUtil.isNune(widget.config.data)
        && this._commUtil.isNune(widget.config.data.description)) {
        saveWidgetObj.reportDetails.reportDescription = widget.config.data.description;
      }

      //Sorting Code has been written to Save the 0th Level of Sorting the written code should not get executed for the olap and flex
      // i.e. Code should be executed only for CHARTS
      if (this._commUtil.getWidgetType(widget.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.Chart) {
        const _widgetSort = widget.sort.appliedSort[0] || undefined;
        saveWidgetObj.reportDetails.LstReportSortingDetails = _widgetSort && _widgetSort.reportObject ? [_widgetSort] : undefined;
        saveWidgetObj.reportDetails.lstReportSortingDetails = saveWidgetObj.reportDetails.LstReportSortingDetails
      }
      // Sorting Saving empty incase of map charts becuase sorting is not provied on map charts
      // and on open reports sort is getting filled in insight application in fillsort object method.
      else if (this._commUtil.getWidgetType(widget.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.MapChart) {
        saveWidgetObj.reportDetails.LstReportSortingDetails = [];
        saveWidgetObj.reportDetails.lstReportSortingDetails = []
      }


      this.removeDrillFilterFromSavedReportDetails(saveWidgetObj);

      return saveWidgetObj;
    }
  }

  // private getCardsForSaveDahboard() {
  //   let thisRef = this;
  //   let dashletArray = this._commUtil.getDeReferencedObject(map(this.config.config.cards, (widget) => {
  //     if (!widget.isRemoved) {
  //       let saveWidgetObj: any = {
  //         title: widget.cardTitle,
  //         reportDetailsId: thisRef._commUtil.getDeReferencedObject(widget.reportDetails.reportDetailObjectId),
  //         // AdditionalProperties: '{"height":5,"minWidth":1,"width":1,"minHeight":5,"x":0,"y":0}',
  //         reportDetails: thisRef._commUtil.getDeReferencedObject(widget.reportDetails),

  //         x: widget.layoutItemConfig.gridstackPosition.x,
  //         y: widget.layoutItemConfig.gridstackPosition.y,
  //         height: widget.layoutItemConfig.gridstackPosition.height,
  //         width: widget.layoutItemConfig.gridstackPosition.width,
  //         minHeight: widget.layoutItemConfig.gridstackPosition.minHeight,
  //         minWidth: widget.layoutItemConfig.gridstackPosition.minWidth,
  //         titleFlag: widget.config.showTitle,
  //         percentageFlagSummaryCard: widget.config.showPercentageValue,
  //         isLinkReport: widget.reportDetails.isLinkReport
  //       }
  //       saveWidgetObj.reportDetails.displayName = widget.cardTitle;
  //       saveWidgetObj.reportDetails.reportName = widget.cardTitle;
  //       if (saveWidgetObj.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard) {
  //         saveWidgetObj.AdditionalProperties = `{"x":${saveWidgetObj.x},"y":${saveWidgetObj.y},"width":${saveWidgetObj.width},"height":${saveWidgetObj.height},"minWidth":"1","minHeight":"2","titleFlag":${widget.config.showTitle},"percentageFlagSummaryCard":${widget.config.showPercentageValue}}`;
  //       }
  //       else {
  //         saveWidgetObj.AdditionalProperties = `{"x":${saveWidgetObj.x},"y":${saveWidgetObj.y},"width":${saveWidgetObj.width},"height":${saveWidgetObj.height},"minWidth":"2","minHeight":"4"}`;
  //       }
  //       // JSON.parse(JSON.stringify(widget));
  //       saveWidgetObj.reportDetails.lstFilterReportObject = Object.assign([], filter(saveWidgetObj.reportDetails.lstFilterReportObject, (appliedFilter) => {
  //         if (appliedFilter.NestedReportFilterObject && appliedFilter.NestedReportFilterObject.isGlobalFilter) {
  //           appliedFilter.NestedReportFilterObject = null;
  //         }
  //         return !appliedFilter.isGlobalFilter;
  //       }));
  //       // fixing the save issue for ANLT-7460 i.e to reportProperties.
  //       saveWidgetObj.reportDetails.reportProperties = saveWidgetObj.reportDetails.reportProperties ? JSON.stringify(saveWidgetObj.reportDetails.reportProperties) : '';
  //       if (widget.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard
  //         && this._commUtil.isNune(widget.config)
  //         && this._commUtil.isNune(widget.config.data)
  //         && this._commUtil.isNune(widget.config.data.description)) {
  //         saveWidgetObj.reportDetails.reportDescription = widget.config.data.description;
  //       }

  //       //Sorting Code has been written to Save the 0th Level of Sorting the written code should not get executed for the olap and flex
  //       // i.e. Code should be executed only for CHARTS
  //       if (this._commUtil.getWidgetType(widget.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.Chart) {
  //         const _widgetSort = widget.sort.appliedSort[0] || undefined;
  //         saveWidgetObj.reportDetails.LstReportSortingDetails = _widgetSort && _widgetSort.reportObject ? [_widgetSort] : undefined;
  //         saveWidgetObj.reportDetails.lstReportSortingDetails = saveWidgetObj.reportDetails.LstReportSortingDetails
  //       }
  //       // Sorting Saving empty incase of map charts becuase sorting is not provied on map charts
  //       // and on open reports sort is getting filled in insight application in fillsort object method.
  //       else if (this._commUtil.getWidgetType(widget.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.MapChart) {
  //         saveWidgetObj.reportDetails.LstReportSortingDetails = [];
  //         saveWidgetObj.reportDetails.lstReportSortingDetails = []
  //       }


  //       this.removeDrillFilterFromSavedReportDetails(saveWidgetObj);

  //       return saveWidgetObj;
  //     }
  //   }));
  //   return compact(dashletArray);
  // }

  private removeDrillFilterFromSavedReportDetails(saveWidgetObj: any) {
    if (this._commUtil.isDrillDriveActiveOnView()) {
      //deletginthe drill filter from main reporting object details
      saveWidgetObj.reportDetails.lstFilterReportObject.map((_filValue: any, _filKey: number) => {
        if (
          _filValue.FilterIdentifier === DashboardConstants.FilterIdentifierType.DrillFilter ||
          _filValue.FilterAppliedAs === DashboardConstants.FilterIdentifierType.DrillFilter
        ) {
          delete saveWidgetObj.reportDetails.lstFilterReportObject[_filKey];
        }
      });
      saveWidgetObj.reportDetails.lstFilterReportObject = compact(saveWidgetObj.reportDetails.lstFilterReportObject);
    }
  }

  //Here instead of directly using the appliedFilterLIst from dashboardCommservice we will pass the list for 
  //Global filter and each of the tab filter and use that to generate the saveFilterObject.  
  private refreshGlobalFiltersList(lstAppliedFilter: Array<IReportingObjectMultiDataSource>, isTabFilter: boolean = false, isOpenView: boolean = true, isInitializeWidget: boolean = true) {
    let viewFilters = [];
    //this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty = [];
    //this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty = Object.assign([], this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters);
    //this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters = [];
    each(lstAppliedFilter, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {
      if (([
        DashboardConstants.FilterType.MultiSelect,
        DashboardConstants.FilterType.Date,
        DashboardConstants.FilterType.Year,
        DashboardConstants.FilterType.QuarterYear,
        DashboardConstants.FilterType.Quarter,
        DashboardConstants.FilterType.MonthYear,
        DashboardConstants.FilterType.Month,
        DashboardConstants.FilterType.Measure,
        DashboardConstants.FilterType.Number].indexOf(_appliedfilterValues.FilterType) != -1) ||
        _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource
      ) {
        //Getting the Filter Selected Values for the All the Applied Filter Objects
        let listFilterValues: any = [];
        let Operators: number;
        let FilterBy: number = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ?
          DashboardConstants.FilterBy.FilterBySelection : DashboardConstants.FilterBy.FilterByCondition;
        if (!(this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType))) {
          if (_appliedfilterValues.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {

            Operators = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ?
              _appliedfilterValues.FilterType === DashboardConstants.FilterType.Number ? DashboardConstants.ReportObjectOperators.In :
                DashboardConstants.ReportObjectOperators.Is : _appliedfilterValues.FilterConditionOperator.op;
          }
          else if (_appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
            Operators = DashboardConstants.ReportObjectOperators.In;
          }
        }
        else if (this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType) &&
          _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
          Operators = DashboardConstants.ReportObjectOperators.Is;
        }
        if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection &&
          (!(this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType)) ||
            _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource)) {
          if (_appliedfilterValues.SelectAll && _appliedfilterValues.IsSelectAll) {
            // Sending -1 when user has selected all with
            listFilterValues.push(DashboardConstants.DAXQueryManipulate.AllRecords);
          }
          else {
            _appliedfilterValues.selectedFilterList.filter((_selAppliedFilter: IFilterList) => {
              if (_selAppliedFilter.IsSelected) {
                listFilterValues.push(_selAppliedFilter.title);
              }
            });
          }
        }
        else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterByCondition
          && !(this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType))) {
          // Will split the Values only for the In and Not In Values Otherwise Not.
          if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.In ||
            _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.NotIn) {
            listFilterValues = _appliedfilterValues.FilterConditionText.value.split(';');
          }
          else {
            if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsEmpty ||
              _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotEmpty ||
              _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNull ||
              _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotNull) {
              listFilterValues.push("");
            }
            else if ([AnalyticsCommonConstants.ReportObjectOperators.GreaterThan,
            AnalyticsCommonConstants.ReportObjectOperators.LessThan,
            AnalyticsCommonConstants.ReportObjectOperators.TopNRecords,
            AnalyticsCommonConstants.ReportObjectOperators.LowestNRecords,
            AnalyticsCommonConstants.ReportObjectOperators.TopNPercentage,
            AnalyticsCommonConstants.ReportObjectOperators.LowestNPercentage,
            AnalyticsCommonConstants.ReportObjectOperators.GreaterThanOrEqualTo,
            AnalyticsCommonConstants.ReportObjectOperators.LessThanOrEqualTo].indexOf(_appliedfilterValues.FilterConditionOperator.op) != -1) {
              listFilterValues.push(_appliedfilterValues.FilterConditionValue)
            }
            else if ([AnalyticsCommonConstants.ReportObjectOperators.Between,
            AnalyticsCommonConstants.ReportObjectOperators.NotBetween].indexOf(_appliedfilterValues.FilterConditionOperator.op) != -1) {
              listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.from);
              listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.to);
            }
            else {
              listFilterValues.push(_appliedfilterValues.FilterConditionText.value);
            }
          }
        }
        //Check if it is Date Period Filter
        if (this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType) &&
          _appliedfilterValues.FilterType === DashboardConstants.FilterType.Date) {
          //check if Period Filter By Dynamic Period. 
          if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.FilterRadioOperator.field.op;
            if (DashboardConstants.ReportObjectOperators.From_DateTillToday != _appliedfilterValues.FilterRadioOperator.field.op) {
              listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
            }
            else {
              //Done to handle the format required for From_DateTillToday
              listFilterValues.push.apply(listFilterValues, [new Date(_appliedfilterValues.FilterConditionValue.toString()).getFullYear().toString(),
              (new Date(_appliedfilterValues.FilterConditionValue.toString()).getMonth() + 1).toString(), new Date(_appliedfilterValues.FilterConditionValue.toString()).getDate().toString()]);
            }
          }
          //Check if Period Filter By Condition
          if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is not Between condition
            if (_appliedfilterValues.FilterConditionOperator.op != DashboardConstants.ReportObjectOperators.Between) {
              listFilterValues.push(this._commUtil.getPeriodDateValue(_appliedfilterValues.FilterConditionValue));
            }
            else {
              listFilterValues.push(this._commUtil.getPeriodDateValue(_appliedfilterValues.FilterConditionRangeValue.from));
              listFilterValues.push(this._commUtil.getPeriodDateValue(_appliedfilterValues.FilterConditionRangeValue.to));
            }
          }
        }
        else if (this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType) &&
          _appliedfilterValues.FilterType === DashboardConstants.FilterType.Year &&
          _appliedfilterValues.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
          if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is 'IS' or 'IS NOT' Condition
            if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
              listFilterValues = filter(mapValues(_appliedfilterValues.FilterConditionValue, 'name'), (value, index) => {
                return value;
              });
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
              listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.from);
              listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.to);
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
              listFilterValues.push(_appliedfilterValues.FilterConditionValue);
            }
          }
          else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.YearModel.field.op;
            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
          }
        }
        else if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.Quarter) {
          if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is 'IS' or 'IS NOT' Condition
            if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
              listFilterValues = _appliedfilterValues.FilterConditionValue;
            }
          }
          else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.QuarterYearModel.field.op;
            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
          }
        }

        else if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.QuarterYear) {
          if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is 'IS' or 'IS NOT' Condition
            if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionValue;
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionRangeValue.from;
              listFilterValues[1] = _appliedfilterValues.FilterConditionRangeValue.to;
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionValue;
            }
          }
          else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.QuarterYearModel.field.op;
            if (Operators != DashboardConstants.ReportObjectOperators.From_QuarterTillToday) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionValue.toString();
            }
            else {
              each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val));
            }
          }
        }
        else if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.Month) {
          if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is 'IS' or 'IS NOT' Condition
            if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
              listFilterValues = _appliedfilterValues.FilterConditionValue;
            }
          }
          else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.QuarterYearModel.field.op;
            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
          }
        }
        else if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.MonthYear) {
          if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is 'IS' or 'IS NOT' Condition
            if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionValue;
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionRangeValue.from;
              listFilterValues[1] = _appliedfilterValues.FilterConditionRangeValue.to;
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionValue;
            }
          }
          else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.QuarterYearModel.field.op;
            if (Operators != DashboardConstants.ReportObjectOperators.From_MonthTillToday) {
              listFilterValues[0] = _appliedfilterValues.FilterConditionValue.toString();
            }
            else {
              each(_appliedfilterValues.FilterConditionValue, _val => listFilterValues.push(_val));
            }
          }
        }

        let lstFilterReportObject = [];
        let filterRo;
        let ViewFilterSource: number = this._dashboardCommService.listofDistinctWidgetDataSource.length > 1 ? DashboardConstants.ViewFilterType.MultiSource : DashboardConstants.ViewFilterType.SingleSource;
        if (isTabFilter) {
          lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(
            lstFilterReportObject, this._commUtil.createFilterReportObject(
              _appliedfilterValues, { IsPresent: false }, {}, Operators, FilterBy, listFilterValues,
              DashboardConstants.ModuleType.DASHBOARD,
              ViewFilterSource),
            new TabFilterDetails);
          filterRo = this._commUtil.getDeReferencedObject(lstFilterReportObject[0]);
          filterRo.TabFilterType = _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ?
            DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource :  _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ?
            DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : ViewFilterSource;
            filterRo.globalSliderObject = this._commUtil.isNune(filterRo.globalSliderObject) ? typeof (filterRo.globalSliderObject) != "string" ? JSON.stringify(filterRo.globalSliderObject): filterRo.globalSliderObject : '{}';
          }
        else {
          lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(
            lstFilterReportObject, this._commUtil.createFilterReportObject(
              _appliedfilterValues, { IsPresent: false }, {}, Operators, FilterBy, listFilterValues,
              DashboardConstants.ModuleType.DASHBOARD,
              ViewFilterSource),
            new ViewFilterDetails);
          filterRo = this._commUtil.getDeReferencedObject(lstFilterReportObject[0]);
          filterRo.ViewFilterType = _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource ?
            DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource : _appliedfilterValues.FilterIdentifier === DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource ?
              DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : ViewFilterSource;

              filterRo.globalSliderObject = this._commUtil.isNune(filterRo.globalSliderObject) ? typeof (filterRo.globalSliderObject) != "string" ? JSON.stringify(filterRo.globalSliderObject): filterRo.globalSliderObject : '{}';
            }

        filterRo.ObjectId = this._dashboardCommService.listofDistinctWidgetDataSource.length > 1 ? _appliedfilterValues.CrossSuiteFilterMapping.RelationObject.RelationObjectTypeId : lstFilterReportObject[0].reportObject.reportObjectId;
        if ((_appliedfilterValues.FilterType == DashboardConstants.FilterType.MultiSelect) ||
          (this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType)) ||
          (_appliedfilterValues.FilterType === DashboardConstants.FilterType.Measure) ||
          (_appliedfilterValues.FilterType === DashboardConstants.FilterType.Number) ||
          _appliedfilterValues.FilterIdentifier == DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
          // this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty.push(filterRo);
          viewFilters.push(filterRo);
        }
      }
    });
    /** In case of slicer filter is might happen that the user does not select even a single filter value in that case 
        the listFilterValues will be empty list.Those filters are also not present in the dashboardCommserivce.appliedFilters.
        To save those filters we will first iterate over the slicerFilterConfig and check if any filterObject is not present in the
        viewFilters and push those filter here.
    */

    //We will create the slicer filter savedFilterObject only when we are creating the global filter list.
    //When we are creating the tabs filters savedFilterObject we will not generate the slicer filter again.
    if (this._dashboardCommService.slicerFilterConfig.size && !isTabFilter) {
      this._dashboardCommService.slicerFilterConfig.forEach((value, key) => {
        if (this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(key).FilterObject &&
          this._commUtil.isNune(this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail))) {
          if (findIndex(viewFilters,
            { ObjectId: this._dashboardCommService.slicerFilterConfig.get(key).FilterObject.reportObject.reportObjectId }) === -1) {
            let filterRo: any = {};
            filterRo.ViewFilterType = DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource;
            filterRo.ObjectId = this._dashboardCommService.slicerFilterConfig.get(key).FilterObject.reportObject.reportObjectId;
            filterRo.FilterIdentifier = DashboardConstants.FilterIdentifierType.GlobalLevelFilter;
            filterRo.NestedReportFilterObject = null;
            filterRo.Operators = DashboardConstants.ReportObjectOperators.In;
            filterRo.SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
            filterRo.filterValue = [];
            filterRo.FilterConditionText = '';
            filterRo.filterCondition = {
              FilterConditionObjectId: DashboardConstants.FilterObjectConditionID.MultiselectIn,
              condition: DashboardConstants.ReportObjectOperators.In,
              isPeriodFilter: false,
              name: ""
            }
            filterRo.filterBy = DashboardConstants.FilterBy.FilterBySelection;
            filterRo.isGlobalFilter = true;
            filterRo.reportObject = this._dashboardCommService.slicerFilterConfig.get(key).ReportDetail.lstReportObject[0];
            filterRo.globalSliderObject = this._commUtil.isNune(filterRo.globalSliderObject) ? typeof (filterRo.globalSliderObject) != "string" ? JSON.stringify(filterRo.globalSliderObject): filterRo.globalSliderObject : '{}';
            viewFilters.push(filterRo);
          }
        }
      });
    }


    return viewFilters;
  }

  private renderWidgetForGlobalFilter(isRemoveAllSlicer = false, tabFiltersApply = false, isOpenView = false, isInitializeWidget = false, refreshWidget: boolean = true, isWidgetInitialized = true) {
    let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
    let isGlobalOrTabFilterApplied: string = isOpenView ? DashboardConstants.AppliedFilterType.isGlobaFilter : tabFiltersApply ? DashboardConstants.AppliedFilterType.isTabFilter : DashboardConstants.AppliedFilterType.isGlobaFilter;
    let lstOfFilterToBeApplied: Array<IReportingObjectMultiDataSource>;
    if (isOpenView) {
      lstOfFilterToBeApplied = this._dashboardCommService.appliedFilters;
      lstOfFilterToBeApplied = [...lstOfFilterToBeApplied, ..._currentTabDetail.lstAppliedTabFilters];
    }
    else {
      lstOfFilterToBeApplied = tabFiltersApply ? _currentTabDetail.lstAppliedTabFilters : this._dashboardCommService.appliedFilters;
    }
    this._dashboardCommService.lstOfGlobalFilters = [];
    this.config.config.cards.forEach((dashletInfoObject) => {
      if (!dashletInfoObject.isRemoved && dashletInfoObject.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
        var lstFilterReportObject = [];
        /**
        *  Removing Report Objfect from lstFilterReportObject other than contains has isGlobalFilter = 1
        */
        dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_globalWidgetFilter: any, _golbalWidgetFilterKey: any) => {
          //We will remove all the filters which where perviously applied as Tab Filter
          each(lstOfFilterToBeApplied, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {
            if (_globalWidgetFilter.reportObject.reportObjectId !== _appliedfilterValues.ReportObjectId &&
              _globalWidgetFilter.reportObject.reportObjectName !== _appliedfilterValues.ReportObjectName
            ) {
              //In case of open view we decide if this is global of tab level based on the filter itself;
              let _isGlobalOrTabFilterApplied: string = isOpenView ? _appliedfilterValues.isTabFilter ? DashboardConstants.AppliedFilterType.isTabFilter : DashboardConstants.AppliedFilterType.isGlobaFilter : isGlobalOrTabFilterApplied;
              if (_globalWidgetFilter[_isGlobalOrTabFilterApplied]) {
                if (_isGlobalOrTabFilterApplied === DashboardConstants.AppliedFilterType.isGlobaFilter && !_globalWidgetFilter[DashboardConstants.AppliedFilterType.isTabFilter]) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                }
                else if (_isGlobalOrTabFilterApplied === DashboardConstants.AppliedFilterType.isTabFilter) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                }
              }
            }
          });
        });
        /**
         * If the user removes all the Slicer Filter then we will remove all the slicerFilter from the 
         * lstFilterReportObject.
         */

        if (isRemoveAllSlicer) {
          dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_filterValue: any, _filterKey: number) => {
            if (_filterValue.FilterIdentifier === DashboardConstants.FilterIdentifierType.SlicerFilter) {
              dashletInfoObject.reportDetails.lstFilterReportObject.splice(_filterKey, 1);
            }
          })
        }


        each(lstOfFilterToBeApplied, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {

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
                  //In case of open view we decide if this is global of tab level based on the filter itself;
                  let _isGlobalOrTabFilterApplied: string = isOpenView ? _appliedfilterValues.isTabFilter ? DashboardConstants.AppliedFilterType.isTabFilter : DashboardConstants.AppliedFilterType.isGlobaFilter : isGlobalOrTabFilterApplied;
                  if (_globalWidgetFilter[_isGlobalOrTabFilterApplied]) {
                    if (_isGlobalOrTabFilterApplied === DashboardConstants.AppliedFilterType.isGlobaFilter && !_globalWidgetFilter[DashboardConstants.AppliedFilterType.isTabFilter]) {
                      dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                    }
                    else if (_isGlobalOrTabFilterApplied === DashboardConstants.AppliedFilterType.isTabFilter) {
                      dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                    }
                  }
                  // if (_globalWidgetFilter[_isGlobalOrTabFilterApplied]) {
                  //   dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                  // }
                  // else if (!_globalWidgetFilter[_isGlobalOrTabFilterApplied]) {
                  //   dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].NestedReportFilterObject = null;
                  //   // dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].filterValue = [];
                  //   dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
                  // }
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
              if (isOpenView) {
                let _filterRO = filter(_currentTabDetail.lstAppliedTabFilters, { ReportObjectId: lstFilterReportObject[0].reportObject.reportObjectId })[0];
                if (this._commUtil.isNune(_filterRO) && _appliedfilterValues.isTabFilter)
                  lstFilterReportObject[0].isTabFilter = true;
                lstFilterReportObject[0].FilterIdentifierType = DashboardConstants.FilterIdentifierType.TabFilter;
              }
              if (tabFiltersApply) {
                lstFilterReportObject[0].isTabFilter = true;
                lstFilterReportObject[0].FilterIdentifierType = DashboardConstants.FilterIdentifierType.TabFilter;
              }
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
        //console.log("Applied", dashletInfoObject.reportDetails.displayName, dashletInfoObject.reportDetails.lstFilterReportObject);
        //dashletInfoObject.sliderFilterArray = [];
        // this.getSlider(dashletInfoObject, isWidgetInitialized);
        // this._commUtil._globalSilderBehaviorSubject$.next({
        //   objDashletInfo: dashletInfoObject,
        //   isWidgetInitialized: isWidgetInitialized
        // });
      }
    });

    this._dashboardCommService.lstOfGlobalFilters = [];
    if (this._commUtil.isNune(this.config.config.cards[0]) && this.config.config.cards[0].componentId != DashboardConstants.GlobalSliderWidgetComponent) {
      each(this.config.config.cards[0].reportDetails.lstFilterReportObject, (_val) => {
        if ((_val.FilterIdentifier === DashboardConstants.FilterIdentifierType.GlobalLevelFilter ||
          _val.FilterIdentifier === DashboardConstants.FilterIdentifierType.SlicerFilter ||  _val.FilterIdentifier === DashboardConstants.FilterIdentifierType.GlobalSlider) &&
          !_val.isTabFilter) {
          this._dashboardCommService.lstOfGlobalFilters.push(_val);
        }
      })
    }
    //** Here we will set the lstGlobalFilters only when the user applies global filter and then sub sequently update the slicer filter's data. If is Tab filter we wont do any of that.
    if (isOpenView && isInitializeWidget) {
      if (
        this.applyGlobalFilter &&
        this._dashboardCommService.slicerFilterConfig.size
      ) {
        this._dashboardCommService.updateSlicerFilterData(undefined);
      }
    }
    else if (!tabFiltersApply && !isOpenView) {
      if (
        this.applyGlobalFilter &&
        this._dashboardCommService.slicerFilterConfig.size
      ) {
        this._dashboardCommService.updateSlicerFilterData(undefined);
      }
    }
    if (isWidgetInitialized && refreshWidget) {
      this.testSubject$.add(
        this.refreshLoadedWidget());

    }
  }

  private renderWidgetForCrossSuiteFilter(refreshWidget: boolean = true, isWidgetInitialized: boolean = true) {

    this.config.config.cards.forEach((dashletInfoObject) => {
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

          //Get the reporting object from report's datasource to reporting object datasource.
          let _dsReportObject: IRelationObjectMapping = filter(_appliedfilterValues.CrossSuiteFilterMapping.RelationObjectMapping,
            (_relValues: IRelationObjectMapping, _relKeys: any) => {
              return _relValues.DataSourceObjectId === dashletInfoObject.reportDetails.dataSourceObjectId;
            })[0];

          if (_dsReportObject != undefined) {
            let _reportObjectInfo: IReportingObjectMultiDataSource = filter(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (
              _alldsROValues: IReportingObjectMultiDataSource, _alldsROKeys: any) => {
              return _alldsROValues.DataSource_ObjectId === _dsReportObject.DataSourceObjectId
                && _alldsROValues.ReportObjectId === _dsReportObject.ReportObjectId
            })[0];

            _reportObjectInfo.FilterConditionOperator = _appliedfilterValues.FilterConditionOperator;

            //Code is Written for the Multiselect Filters
            if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.MultiSelect) {

              const { listFilterValues, Operators, FilterBy } = this._globalFilterService.getFilterValueWithOperator(
                _appliedfilterValues, _appliedfilterKeys
              );

              if (listFilterValues.length > 0) {
                /**
                * Removing the Earlier Applied Global Filters
                */
                dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_globalWidgetFilter: any, _golbalWidgetFilterKey: any) => {
                  if (_globalWidgetFilter.reportObject.reportObjectId === _reportObjectInfo.ReportObjectId &&
                    _globalWidgetFilter.reportObject.reportObjectName === _reportObjectInfo.ReportObjectName
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

                let _checkfilterAlreadyExists = this.isFilterAlreadyExistInWidget(dashletInfoObject.reportDetails.lstFilterReportObject, _reportObjectInfo);


                lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(lstFilterReportObject,
                  this._commUtil.createFilterReportObject(_reportObjectInfo, _checkfilterAlreadyExists, dashletInfoObject, Operators, FilterBy, listFilterValues, DashboardConstants.ModuleType.DASHBOARD, DashboardConstants.ViewFilterType.MultiSource),
                  new SavedFilter);

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
            }
          }
        });
        //console.log("Applied", dashletInfoObject.reportDetails.displayName, dashletInfoObject.reportDetails.lstFilterReportObject);
      }
    });

    if (isWidgetInitialized && refreshWidget) {
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
    this._dashboardDriveService.clearOpacityMapping();
    this.triggerDashboardSubject({
      actionId: DashboardConstants.WidgetFunction.APPLY_GLOBAL_FILTER
    });
  }


  public removeCurrentChip(e, obj, reportObjectId, isTabFilter) {
    // this._commUtil.checkAllWidgetLoaded().then((_response: boolean) => {
    //   if (_response) {
    this.removefilterCurrentChip(e, obj, reportObjectId, true, isTabFilter);
    this.applierFilterConfig.api.loadFilterPanel();
    //   }
    // });
  }

  private removefilterCurrentChip(e, obj: IReportingObjectMultiDataSource, reportObjectId: string, isWidgetReload: boolean, isTabFilter: boolean = false) {
    let index: number = -1;
    //When the Global is removed then Drive is getting removed irrespective of Dashboard View Type
    this._dashboardDriveService.removeDrive();
    let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
    if (isTabFilter) {
      index = findIndex(_currentTabDetail.lstAppliedTabFilters, { ReportObjectId: reportObjectId });
    }
    else {
      index = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: reportObjectId });
    }
    let _removedGlobalFilter = isTabFilter ? _currentTabDetail.lstAppliedTabFilters[index]
      : this._dashboardCommService.appliedFilters[index];
    let isGlobalOrTabFilter = isTabFilter ? 'isTabFilter' : 'isGlobalFilter';
    this.config.config.cards.forEach((dashletInfoObject) => {
      if (!dashletInfoObject.isRemoved && dashletInfoObject.componentId != DashboardConstants.GlobalSliderWidgetComponent) {

        if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
          /***
           *  Code for Removing the Applied Global Filter from dashlet Info Array based Upon IsGlobalFilter flag. ( Pretty Straight Forward).
           */
          dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_removeListFilterValue: any, _removeListFilterkey: any) => {
            if (_removeListFilterValue.reportObject.reportObjectId === _removedGlobalFilter.ReportObjectId &&
              _removeListFilterValue.reportObject.reportObjectName === _removedGlobalFilter.ReportObjectName) {
              if (_removeListFilterValue[isGlobalOrTabFilter]) {
                dashletInfoObject.reportDetails.lstFilterReportObject.splice(_removeListFilterkey, 1);
              }
              else if (!_removeListFilterValue[isGlobalOrTabFilter]) {
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
                if (_removeListFilterValue[isGlobalOrTabFilter]) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(_removeListFilterkey, 1);
                }
                else if (!_removeListFilterValue[isGlobalOrTabFilter]) {
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
      //this.refreshLoadedWidget();
      this._globalFilterService.clearFilter(obj);
      if (isTabFilter) {
        _currentTabDetail.lstAppliedTabFilters.splice(index, 1)
        this._globalFilterService.removeFilter(obj, _currentTabDetail.filterTabList);
      }
      else {
        this._dashboardCommService.appliedFilters.splice(index, 1);
        this._globalFilterService.removeFilter(obj);
      }
      this.applierFilterConfig.config = filter(this._dashboardCommService.appliedFilters, { enabledAsGlobalSlider: false });
      this.applierFilterConfig.tabFilter = filter(_currentTabDetail.lstAppliedTabFilters, {enabledAsGlobalSlider : false});
      setTimeout(() => {
        if (this._commUtil.isNune(this.applierFilterConfig.api)) {
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

  openTabFilter(filter) {
    let isFilterOpen;
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
      LoadFilterPopup: true,
      TabFilter: true
    })
    this._globalFilterService.setActiveFilter(filter);
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
    this.resizeDashbaordTabsContainer();
    this.loadGlobalFilterContainer();
    // setTimeout(() => {
    for (let card of this.config.config.cards) {
      if (card.breadCrumbUIConfig)
        this._dashboardCommService.calcBreadcrumbWidth(card.cardId, card.breadCrumbUIConfig);
    }
    // }, 1000);
    // if(this.isFilterSidebarExpand) {

    // }



    //On expand collapse of filter panel the chart should also reflow accordingly
    this.triggerDashboardSubject({
      actionId: DashboardConstants.EventType.ReflowChart
    });
  }

  resizeDashboardContainer() {
    let dashboardCardContainerEle = this._elementRef.nativeElement.querySelector('.dashboard-container')
    var breadCrumbList = dashboardCardContainerEle.querySelectorAll('.breadcrumb-list-container .breadcrumb-list .breadcrumb-list-item')
    let maxWidth;
    if (this.isFilterSidebarExpand) {
      this._renderer.addClass(dashboardCardContainerEle, 'paddingRight250');
      this._renderer.removeClass(dashboardCardContainerEle, 'paddingRight50');
      maxWidth = '60px';
    }
    else {
      this._renderer.addClass(dashboardCardContainerEle, 'paddingRight50');
      this._renderer.removeClass(dashboardCardContainerEle, 'paddingRight250');
      maxWidth = '130px';
    }
    if (this.isSlicerFilterSidebarExpand) {
      this._renderer.addClass(dashboardCardContainerEle, 'paddingLeft250');
      this._renderer.removeClass(dashboardCardContainerEle, 'paddingLeft50');
      maxWidth = '60px';
    }
    else {
      if (this._dashboardCommService.slicerFilterList.length > 0) {
        this._renderer.addClass(dashboardCardContainerEle, 'paddingLeft50');
      }
      this._renderer.removeClass(dashboardCardContainerEle, 'paddingLeft250');
      maxWidth = '130px';
    }
    if (breadCrumbList) {
      for (let list of breadCrumbList) {
        this._renderer.setStyle(list, 'max-width', maxWidth)
      }
    }
  }

  calculateFilterPanelTop() {
    let filterContainerELe = this._elementRef.nativeElement.querySelector('.filter-panel-container');
    const WindowYOffset = document.documentElement.scrollTop;
    // let WindowYOffset = window.pageYOffset;
    if (WindowYOffset <= 64) {
      filterContainerELe.style.position = 'fixed';
      filterContainerELe.style.top = 114 - WindowYOffset + 'px';
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
    if (clearAllFilterEle) {
      if (!this.isFilterSidebarExpand) {
        //this._renderer.addClass(filterPanelListEle, 'is-hide');
        //this._renderer.addClass(filterPanelSearchEle, 'is-hide');
        this._renderer.addClass(clearAllFilterEle, 'is-hide')
        this._renderer.setStyle(filterIconEle, 'margin-left', '-26px')
      }
      else {
        //this._renderer.removeClass(filterPanelListEle, 'is-hide');
        //this._renderer.removeClass(filterPanelSearchEle, 'is-hide');
        this._renderer.removeClass(clearAllFilterEle, 'is-hide')
        this._renderer.setStyle(filterIconEle, 'margin-left', '-15px')
      }
    }
  }

  slicerSidebarCallback() {
    if (!this._dashboardCommService.showSlicerLoader) {
      this.isSlicerFilterSidebarExpand = !this.isSlicerFilterSidebarExpand;
      let filterContainerELe = this._elementRef.nativeElement.querySelector('.dashboard-slicer');
      let slicerContainerEle = this._elementRef.nativeElement.querySelector('.dashboard-slicer-wrapper')
      if (this.isSlicerFilterSidebarExpand) {
        this._renderer.addClass(filterContainerELe, 'slicer-panel-toggle');
        this._renderer.removeClass(slicerContainerEle, 'is-hide')
      }
      else {
        this._renderer.removeClass(filterContainerELe, 'slicer-panel-toggle');
        this._renderer.addClass(slicerContainerEle, 'is-hide')
      }
      this.resizeDashboardContainer();
      this.resizeDashbaordTabsContainer();
      this.loadSlicerFilterContainer();
      setTimeout(() => {
        for (let card of this.config.config.cards) {
          if (card.breadCrumbUIConfig)
            this._dashboardCommService.calcBreadcrumbWidth(card.cardId, card.breadCrumbUIConfig);
        }
      }, 1000);
      //On expand collapse of filter panel the chart should also reflow accordingly
      this.triggerDashboardSubject({
        actionId: DashboardConstants.EventType.ReflowChart
      });
    }
  }
  async loadSlicerFilterContainer() {
    let config = {
      config: {
        config: this._dashboardCommService.slicerFilterList,
        lstOfSlicerFilterToRemove: []
      }
    }
    this.createSlicerWidgetComponent(config);

  }

  checkIsGlobalFilterApplied(isTabFilter = false, isOpenView = false) {
    let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
    let lstAppliedFilter = [];
    if (isOpenView) {
      lstAppliedFilter.push(..._currentTabDetail.lstAppliedTabFilters);
      lstAppliedFilter.push(...this._dashboardCommService.appliedFilters);
    }
    else if (isTabFilter) {
      lstAppliedFilter = _currentTabDetail.lstAppliedTabFilters
    }
    else {
      lstAppliedFilter = this._dashboardCommService.appliedFilters;
    }
    if (!lstAppliedFilter.length) {
      this.isGlobalFltApplied = false;
    }
    else {
      for (let i = 0; i < lstAppliedFilter.length; i++) {
        if (lstAppliedFilter[i].FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource && lstAppliedFilter[i].FilterIdentifier != DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource) {
          this.isGlobalFltApplied = true;
          break;
        }
        else {
          this.isGlobalFltApplied = false;
        }
      }
    }
  }

  updateKebabMenuOptionForEachCard() {
    this.sub.subscription.add(
      this._dashboardCommService.updateKebabMenuOption$.subscribe((data) => {
        each(this.config.config.cards, (_card: any) => {
          let moveToOption: any = filter(_card.uiConfig.kebabMenuOptions, { export: AnalyticsCommonConstants.WidgetFunction.MoveTo })[0];
          if (this._commUtil.isNune(moveToOption)) {
            if (this._commUtil.isNune(_card.changeDetectionMutation) &&
              this._commUtil.isNune(_card.changeDetectionMutation.setDashboardCardHeaderState)) {
              moveToOption.showOption = this._dashboardCommService.showMoveToOption;
              _card.changeDetectionMutation.setDashboardCardHeaderState();
            }
          }
        })
      })
    );
  }

  //load dashbaord tabs container whenever a new tab is added
  loadDashboardTabsContainer() {
    this.sub.subscription.add(
      this._dashboardCommService.dashboardTabList$.subscribe((data) => {
        this.dashboardTabsContainerRef.clear();
        let config = {
          config: data,
          api: {
            onTabChange: (tabDetail, isDeletePreviousTab = false) => { this.onTabChange(tabDetail, isDeletePreviousTab) },
            onTabDelete: () => { this.onTabDelete() }
          }
        }
        if (data.length > 0) {
          this.dashboardTabsContainerRef.clear();
          if (data.length === 1 && data[0].title.toLowerCase() === DashboardConstants.DefaultTab) {
            return;
          }
          else {
            this.dashboardTabsContainerRef.createEmbeddedView(this.outletTemplateRef, {
              manifestPath: 'DashboardTabs/dashboard-tabs',
              config: config
            });
            setTimeout(() => {
              this.resizeDashbaordTabsContainer();
            }, 700);
          }
        }
        else {
          this.dashboardTabsContainerRef.detach();
          this.dashboardTabsContainerRef.clear();
        }
      })
    );
  }

  // resize dashbaord tab container on filter panel expand collapse
  resizeDashbaordTabsContainer() {
    let dashboardTabsCardContainerEle = document.querySelector('.dashboard-tabs-container-wrapper')
    if (this._commUtil.isNune(dashboardTabsCardContainerEle)) {
      if (this.isFilterSidebarExpand) {
        this._renderer.addClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-expand');
        this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse')
      }
      else {
        this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-expand')
        this._renderer.addClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse')
      }
      if (this.isSlicerFilterSidebarExpand) {
        this._renderer.addClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-slicer-expand');
        this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-slicer-collapse');
        this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse-no-slicerFilter');
      }
      else {
        this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-slicer-expand');
        if (this._dashboardCommService.slicerFilterList.length) {
          this._renderer.addClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-slicer-collapse');
          this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse-no-slicerFilter');
        }
        else {
          this._renderer.addClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse-no-slicerFilter');
          this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-slicer-collapse');
        }
      }
    }
  }


  private onTabChange(tabDetail, isDeletePreviousTab) {
    if ((this._dashboardCommService.selectedTab.tabId != tabDetail.tabId || isDeletePreviousTab)) {
      this._loaderService.showGlobalLoader();
      let card = this.config.config.cards.find(c => c.driveConfig.isDriver);
      if (card) {
        this.removeDriveOnTab(card);
      }
      if (this.isFilterSidebarExpand)
        this.filterSidebarCallback();
      const index = findIndex(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: tabDetail.tabId });
      this._dashboardCommService.createGlobalSliderConfig(this._dashboardCommService.tabDashletInfo.lstTabDetails[index].lstAppliedTabFilters,false,false,true);
      //Once the saved tab filter is applied on the tab we can reset the lstTabFilter as all the current state filters applied as tab fitler is present in lstAppliedTabFilters
      let _currentTabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
      _currentTabDetail.lstTabFilter = [];
      this._dashboardCommService.apppliedFilterDataSource$.unsubscribe();
      this._dashboardCommService.apppliedFilterDataSource$ = new BehaviorSubject<any>({});
      this._dashboardCommService.selectedTab = tabDetail;
      this.config.api.generateGraphConfigForTheGivenDashletInfo(tabDetail, false, false).then(resp=>{
      let section = resp; 
      this.dashboardContainerRef.clear();
      this.config = { ...section };
      this.dashboardConfig = { ...this.config.config };
        if (this._dashboardCommService.globalSliderConfigArray.length) {
          this._dashboardCommService.globalSliderConfigArray.forEach((item) => {
            if (item.sliderFilterArray[0].enabledAsGlobalSlider) {
              const index = findIndex(this.config.config.cards, { cardId: item.cardId });
              if (index == -1) {
                this.config.config.cards.push(...this._dashboardCommService.globalSliderConfigArray);
              }
            }
          });
        }
      this.sub.subscription.unsubscribe();
      this.testSubject$.unsubscribe();
      // this.dbGridSubject.subscription.unsubscribe();
      this.setSubjectForCardOption();
      this.setDashboardGridSubject();
      this._commUtil._widgetCards = this.config.config.cards;
      this.onApplyFilter(false);
      if (this.config.config.cards.length) {
        this.loadSection().then(resp => {
          //Since now on tab changes we will always be reseting the tab filter list and the applied tab filter calling the onApplyFIlter from the dashbaord-grid-wrapper
          this.onSaveDashboard();
          this.CalcFilterPanelHeight(false);
          this.resizeDashboardContainer();
          this.loadDashboardTabsContainer();
          this.updateKebabMenuOptionForEachCard();
          this.checkIsGlobalFilterApplied(false, true);
          this._loaderService.hideGlobalLoader();
        });
      }
      else {
        this.checkIsGlobalFilterApplied(false, true);
        this.dashboardContainerRef.clear();
        this.onSaveDashboard();
        this.loadDashboardTabsContainer();
        this.noCardsForGivenTab();
      }
     })
    }
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


  private moveWidgetToOtherTab(eventType, cardId, cardViewType) {

    this.dashboardMoveToContinerRef.clear();
    const dashboardMoveToPopupConfig: any = {
      api: {
        doneClick: (value, cardId) => { this.onDashboardMoveToPopupDone(value, cardId) },
        cancelClick: () => { this.onDashboardMoveToPopupCancel() }
      },
      cardId,
      cardViewType
    };
    this._loaderService.showGlobalLoader();
    this.dashboardMoveToContinerRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'dashboard-move-to-popup/dashboard-move-to-popup',
      config: { config: dashboardMoveToPopupConfig }
    });


  }

  onDashboardMoveToPopupDone(value, cardId) {
    if (!value) {
      this._commUtil.getToastMessage("Widget is already present in this tab.");
    }
    else {
      let card = this.config.config.cards.find(c => c.cardId === cardId);
      //Here we will remove all the tab level filter present in this card.
      let lstViewLevelFilter = [];
      each(card.reportDetails.lstFilterReportObject, (_appliedFilter: any, _appliedfilterKey: number) => {
        if (!_appliedFilter.isTabFilter) {
          lstViewLevelFilter.push(_appliedFilter);
        }
      });
      card.reportDetails.lstFilterReportObject = lstViewLevelFilter;
      let targetTabDetail = filter(this._dashboardCommService.dashboardTabsList, (_tab) => { return _tab.tabId.toLowerCase() === value.toLowerCase() })[0];
      this.config.api.addWidgetToGivenTab(card.reportDetails.reportDetailObjectId, this._dashboardCommService.selectedTab, targetTabDetail);
      this.removeDashboardWidget(AnalyticsCommonConstants.WidgetFunction.MoveTo, cardId);
      this.cardEvents.emit({ eventType: DashboardConstants.WidgetFunction.MoveTo, cardId: cardId, sectionId: targetTabDetail.sectionId });
    }
    this.dashboardMoveToContinerRef.detach();
    this.dashboardMoveToContinerRef.clear();
  }

  onDashboardMoveToPopupCancel() {
    this.dashboardMoveToContinerRef.detach();
    this.dashboardMoveToContinerRef.clear();
  }

  private removeDashboardWidget(eventType, cardId) {
    //let el = this._elementRef.nativeElement.querySelector('#' + cardId);
    let el = document.getElementById(cardId);
    this.gridstackAPI.removeWidget(this.findAncestor(el, 'grid-stack-item'));
    // remove drive
    let card = this.config.config.cards.find(c => c.cardId === cardId && c.driveConfig.isDriver);
    if (card) {
      let event: any = {};
      event.eventType = eventType;
      event.cardId = cardId;
      this.removeDrive_cardAction(event);
      this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_REMOVED);
    }

    // Remove Dashboard Filters if Cross Suite View and filters are applied while removing the card
    if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1 && this._dashboardCommService.appliedFilters.length >= 1) {
      (
        this._commUtil.getDeReferencedObject(this._dashboardCommService.appliedFilters) as Array<IReportingObjectMultiDataSource>
      ).forEach((_appfilterValue: IReportingObjectMultiDataSource, _appfilterKey: any) => {
        this.removefilterCurrentChip(null, _appfilterValue, _appfilterKey, false);
        this._globalFilterService.clearFilter(_appfilterValue);
        this._globalFilterService.removeFilter(_appfilterValue);
      });

      this._dashboardCommService.appliedFilters = [];
      this.config.subheaderConfig.selectedDashboard.lstDashboardFilters = [];
      this.showChipBar = false;
      this.refreshLoadedWidget();
    }
    // TODO : remove dashboard filters if cross suite view.
    // this.config.config.cards.splice(this.config.config.cards.findIndex(c => c.cardId === cardId), 1);
  }

  private onTabDelete() {
    this.cardEvents.emit({ eventType: AnalyticsCommonConstants.WidgetFunction.REMOVE_TABS })
  }

  private noCardsForGivenTab() {
    let msg = '';
    if (this._dashboardCommService.dashboardTabsList.length === 1 && this._dashboardCommService.dashboardTabsList[0].title.toLowerCase() === DashboardConstants.DefaultTab) {
      msg = DashboardConstants.UIMessageConstants.STRING_DASHBOARD_NOT_CONTAIN_ANY_VIEWS;
    }
    else {
      msg = 'No widgets present in the  selected tab'
    }
    this._commUtil.getMessageDialog(
      msg,
      (_response: any) => {
        this.config.subheaderConfig.showDashboardOnEmptyWidget = false;
        this._loaderService.hideGlobalLoader();
        return;
      },
      DashboardConstants.OpportunityFinderConstants.STRING_INFORM)
  }

  public removeDriveOnTab(card) {
    let action: any = {};
    action.driveRemovalId = card.cardId;
    //This is so that when sort is applied the blue border from all the driver widgets should be remvoed.
    action.removeBlueBorder = true;
    this._dashboardDriveService.removeDrive();
    this.config.config.cards.forEach((widget) => {
      if (widget.cardId != card.cardId) {
        action.cardId = widget.cardId;
        action.actionId = DashboardConstants.EventType.RemoveDrive;
        this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], widget);
        this.triggerDashboardSubject(action);
      }
    });
  }

  /**
   * To check if no tabs and view level filter is applied on the given view.
   * Here if onApplyFilter the validated tab length is zero we check if this is tab Filter being applied and the view level filter are empty then no filter is applied.
   * Else if this is view level filter being applied and the validated tab length is zero we check the tab applied filter in the currentTabDetail
   * and if its length is zero we conculde that no global filter is being applied.
   * @param isTabFilter 
   * @param currentTabDetail 
   */
  public checkIfNoFilterApplied(isTabFilter: boolean = false, currentTabDetail: TabDetail) {
    return (isTabFilter && this._dashboardCommService.appliedFilters.length === 0) ||
      (!isTabFilter && currentTabDetail.lstAppliedTabFilters.length === 0);
  }

  public updateSlicerFilterInAppliedFilterList(appliedFilterList: Array<IReportingObjectMultiDataSource>, filterList: Array<IReportingObjectMultiDataSource>): void {
    each(appliedFilterList, (_val: any) => {
      if (_val.FilterIdentifier === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
        let _ind = findIndex(filterList, { ReportObjectId: _val.ReportObjectId });
        if (_ind != -1) {
          filterList.splice(_ind, 1);
        }
        filterList.push(_val);
      }
    });
  }

  public setFilterChipName(appliedFilterList: any): void {
    for (let filter of appliedFilterList) {
      if (filter.FilterType === DashboardConstants.FilterType.MultiSelect && filter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
        for (let i of filter.selectedFilterList) {
          if (filter.selectedFilterList.length > 1) {
            filter.filterChipName = filter.selectedFilterList[0].title + ' + ' + (filter.selectedFilterList.length - 1) + ' more'
          }
          else {
            filter.filterChipName = filter.selectedFilterList[0].title;
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
  }

  //public loadTabFilter(): void{
  //   this._dashboardCommService.loadTabFilter$.subscribe((data)=>{
  //     let thisRef = this;
  //     let _currentTabDetail: TabDetail = filter(thisRef._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: thisRef._dashboardCommService.selectedTab.tabId })[0];
  //     thisRef.applierFilterConfig.config = thisRef._dashboardCommService.appliedFilters;
  //     thisRef.applierFilterConfig.tabFilter = _currentTabDetail.lstAppliedTabFilters;
  //     setTimeout(() => {
  //       if (thisRef._commUtil.isNune(thisRef.applierFilterConfig.api)) {
  //         if (thisRef._commUtil.isNune(thisRef.applierFilterConfig.api.changeDetectionMutation))
  //           thisRef.applierFilterConfig.api.changeDetectionMutation.setGlobalFilterContainerState();
  //       }
  //     }, 100);
  //   });
  // }

  public removeTabFilter() {
    let apply = ({
      validatedTabs: [],
      applyGlobalFilter: true,
      isTabFilter: true
    });
    let _currentTabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
    each(_currentTabDetail.lstAppliedTabFilters, (_appliedFilter) => {
      this._globalFilterService.clearFilter(_appliedFilter);
      this._globalFilterService.removeFilter(_appliedFilter, _currentTabDetail.filterTabList);
    });
    this._dashboardCommService.setAppliedFilterData(apply);
  }

  public setSubjectForCardOption() {
    this.sub.subject = new Subject<IDashoardCardAction>();
    this.sub.observer$ = this.sub.subject.asObservable();
    this.sub.subscription = new Subscription();
    this.sub.subscription = this.sub.observer$.subscribe(action => {
      let eventType = action.actionId;
      let cardId = action.cardId;
      let redirectToLinkedViewId = action.redirectToLinkedViewId;
      switch (eventType) {
        case DashboardConstants.FilterIdentifierType.DrillFilter:
          this.drillFilterClick(action);
          break;
        case DashboardConstants.FilterIdentifierType.DriveFilter:
          {
            if (
              //this._dashboardCommService.listofDistinctWidgetDataSource.length == 1 &&
              this.config.config.cards.filter((widget) => { return !widget.isRemoved && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent }).length > 1
            ) {
              if (
                action.widgetDataType === DashboardConstants.WidgetDataType.Chart ||
                action.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
                this._dashboardDriveService.driveClickOnChart(action, this.dbGridSubject);
              }
              else if (action.widgetDataType === DashboardConstants.WidgetDataType.MapChart) {
                // Preparing only event object for map charts.
                action["event"] = { event: { event: action.event.event } };
                this._dashboardDriveService.driveClickOnChart(action, this.dbGridSubject);
              }
              else if (action.widgetDataType === DashboardConstants.WidgetDataType.Flex) {
                this._dashboardDriveService.driveClickOnFlexGrid(action, this.dbGridSubject);
              }
              else if (action.widgetDataType === DashboardConstants.WidgetDataType.Olap) {
                this._dashboardDriveService.driveClickOnFlexGrid(action, this.dbGridSubject);
              }
              else {
                this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_NOT_SUPPORTED_CROSSSUITE);
              }
            }
          }
          break;
        case DashboardConstants.EventType.SetOpacity:
          {
            //Removing the check to validate whether the View is CrossSuite view or Single source view.
            let widget = filter(this.config.config.cards, (card) => { return card.cardId === cardId })[0];
            if (widget.driveConfig.isDriver && widget.driveConfig.isDriveActive && widget) {
              this._dashboardDriveService.setOpacity(widget, action, widget.driveConfig.previousClickedValue);
            }
            break;
          }
        case DashboardConstants.EventType.RemoveDrive: {
          this.removeDrive_cardAction(action);
          break;
        }
        case DashboardConstants.WidgetFunction.REMOVE: this.removeDashboardCard(eventType, cardId);
          break;
        case DashboardConstants.WidgetFunction.UNLINK: this.unlinkDashboardCard(eventType, cardId);
          break;
        case DashboardConstants.WidgetFunction.RENAME: this.renameDashboardCard(eventType, cardId, action.cardName);
          break;
        case DashboardConstants.EventType.UpdateChart: this.updatecall(action);
          break;
        case DashboardConstants.WidgetFunction.UPDATE_DESCRIPTION: this.updateDescription(eventType, cardId, action.cardDescription);
          break;
        case DashboardConstants.WidgetFunction.OPEN_REPORT: this.openReport(eventType, cardId);
          break;
        case DashboardConstants.WidgetFunction.LINK_TO_DASHBOARD: this.linkToDashboard(eventType, cardId);
          break;
        case DashboardConstants.WidgetFunction.LINKED_WIDGET_HEADING_CLICKED: this.headingClickedLinkedWidget(eventType, cardId, redirectToLinkedViewId);
          break;
        case DashboardConstants.WidgetFunction.UNLINK_FROM_DASHBOARD: this.unlinkFromDashboard(eventType, cardId);
          break;
        case DashboardConstants.WidgetFunction.MoveTo: this.moveWidgetToOtherTab(eventType, cardId, action.reportViewType);
          break;
        case DashboardConstants.WidgetFunction.REMOVE_GLOBAL_SLIDER: this.removeGlobalSliderCard(eventType, cardId);
          break;

        // case 'REMOVE': this.removeDashboardCard(cardId);
        //   break;
        // case 'SORT': this.sort();
        //   break;
      }
    });
  }

  public resetTheTabContainer() {
    let dashboardTabsCardContainerEle = document.querySelector('.dashboard-tabs-container-wrapper')
    if (this._commUtil.isNune(dashboardTabsCardContainerEle)) {
      this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-slicer-expand');
      this._renderer.addClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse-no-slicerFilter');
      this._renderer.removeClass(dashboardTabsCardContainerEle, 'dashboard-tabs-container-on-collapse');
    }
  }
}

