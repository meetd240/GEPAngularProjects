import {
  Component, OnInit, Renderer2, ViewChild,
  ViewContainerRef, OnDestroy, Output, EventEmitter, Input, ComponentRef, ComponentFactoryResolver, TemplateRef, ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
//import {
//  IDashoardCardAction, ICardDashboardSubscription,
//  dashboardIConfig, dashboardISection, CardConfigNode
//} from "@vsDashboardInterface";
import { AppConstants } from 'smart-platform-services';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardService } from '@vsDashboardService/dashboard.service';
import { OpportunityFinderService } from '../../shared/services/opportunityFinder-service/opportunityFinder.service'
import { DashboardConstants } from '@vsDashboardConstants';
import { DashboardCommService } from '@vsDashboardCommService';
import { map, findIndex, filter, find, sortBy, keys, values, compact, each, AnyKindOfDictionary } from 'lodash';
import { ViewInfo } from '@vsViewFilterModels/view-info.model';
import { GlobalFilterService } from '@vsGlobalFilterService';
import { DashletInfo } from '@vsDashletModels/dashlet-info.model';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { BidInsightsService } from "@vsBidInsightsService/bid-insights.service";
import { GlobalFilterComponent } from '../global-filter/global-filter.component';
import { LoaderService } from '@vsLoaderService';
import { productName, productTitle, ProductLevelActionNameConstants, productConfiguration } from "configuration/productConfig";
import { ShareDashboardPopupComponent } from 'app/share-dashboard-popup/share-dashboard-popup.component';
import { IUserDetails, ISlicerFilterConfig, ITabDetail, ISectionInfo } from 'interfaces/common-interface/app-common-interface';
import { SlicerConfigurationComponent } from 'app/slicer-configuration-component/slicerConfiguration.component';
import { AnalyticsCommonMetadataService } from '@vsAnalyticsCommonService/analytics-common-metadata.service';
import { TabDetail } from '@vsDashletModels/tab-detail-model';
import { TabFilterDetails } from '@vsTabModels/tab-filter-details-model';
declare var crossProductFilters: any;
declare var supplierScorecardConfig: any;

@Component({
  selector: 'sub-header',
  templateUrl: './subHeader.component.html',
  styleUrls: ['./subHeader.component.scss'],

  preserveWhitespaces: false
})

export class SubHeaderComponent implements OnInit, OnDestroy {

  //#region <====== Sub Header Component Variable Declarartions =========>
  manageUnsubscribeObservable$: Subscription = new Subscription();
  headeractionsExport: any;
  dashboardListSelectConfig: Array<ViewInfo> = [];
  headerKebabMenu: any = {};
  saveViewToastConfig: any;
  //sub: ICardDashboardSubscription = {} as ICardDashboardSubscription;
  isFilterOpen: boolean = false;
  dashboardViewDD: boolean = false;
  dashboardViews: any = [];
  selectedViewType: any;
  showDrilledDashboard: boolean = true;
  isLinkToDashboard: boolean = false;
  showDrillDownViewCheckbox: boolean = true;
  cardId: any;
  isDrillDownViewEnabled: boolean = false;
  isBidInsights: boolean = false;
  sharedUserList: Array<IUserDetails> = [];
  addToDashboardList: any = [];
  dashboardTabList: any = [];
  showDashboardSubHeader = true;
  showViewPopupInNextGen = true;
  //#endregion

  //#region <====== Sub Header Component Decorator Declarations ==========>
  @Output() viewInfo = new EventEmitter<any>();
  //@Input("config") config: dashboardISection;
  @Input() subheaderConfig: any = {
    showDashboardOnEmptyWidget: false
  };
  //@ViewChild('sharedDashBoardPopup', { read: ViewContainerRef }) private sharedDashBoardPopupRef: ViewContainerRef;
  @ViewChild('globalFilter', { read: ViewContainerRef }) private globalFilterRef: ViewContainerRef;
  @ViewChild('viewRenamePopup', { read: ViewContainerRef }) private viewRenamePopupRef: ViewContainerRef;
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainerRef: ViewContainerRef;
  @ViewChild('outletTemplate') outletTemplateRef: TemplateRef<any>;

  slicerToolTip: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartSlicerTooltipConfig);
  fullScreenTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartFilterTooltipConfig);
  actionTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartActionTooltipConfig);
  addWidgetTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartAddWidgetTooltipConfig)
  refreshWidgetTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartRefreshWidgetTooltipConfig)
  copyDashboardViewUrlConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCopyDashboardViewUrlConfig)
  shareTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.shareDashBoardShareTooltipConfig);

  //#endregion



  constructor(
    private _renderer: Renderer2,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dashboardService: DashboardService,
    private _oppfinderService: OpportunityFinderService,
    private _dashboardCommService: DashboardCommService,
    private _globalFilterService: GlobalFilterService,
    private _commUtils: CommonUtilitiesService,
    public _appConstants: AppConstants,
    private _commonUrls: CommonUrlsConstants,
    private _BidInsightsService: BidInsightsService,
    private _comFactResolver: ComponentFactoryResolver,
    private _loaderService: LoaderService,
    private _elementRef: ElementRef,
    private _aCommMetaDataServ: AnalyticsCommonMetadataService
  ) {

  }

  ngOnInit() {
    // Add all subscriptions here
    if (this._commUtils.getUrlParam('vm') === 'op' || this._commUtils.isValidGuid(this._commUtils.getUrlParam('oppfinderId') || "")) {
      if (this._commUtils.getUrlParam('oppfinderId')) {
        this._dashboardCommService.oppFinderState.editMode = true;
        this._dashboardCommService.oppFinderState.oppFinderId = this._commUtils.getUrlParam('oppfinderId');
      }
      this._dashboardCommService.oppFinderState.oppFinderFlag = true;
      this.showDashboardSubHeader = false;
      this._dashboardCommService.oppFinderState.strategy = DashboardConstants.OpportunityFinderConstants.Strategies[this._commUtils.getUrlParam('strat')];
      this.getOppFinderViewDetails();
    }
    else if (this._commUtils.getUrlParam('vm') === 'fa' || this._commUtils.isValidGuid(this._commUtils.getUrlParam('fraudAnomalyId') || "")) {
      if (this._commUtils.getUrlParam('fraudAnomalyId')) {
        this._dashboardCommService.fraudAnomalyState.editMode = true;
        this._dashboardCommService.fraudAnomalyState.fraudAnomalyId = this._commUtils.getUrlParam('oppfinderId');
      }
      this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag = true;
      this.showDashboardSubHeader = false;
      this.getFraudAnomalyViewDetails();
    }

    else {
      this.onCommWrapperSubheaderEvents();
      this.getAllViewInfoData().then(() => {
        this.setHeaderOptions();
      });
    }

    this.openFilterPopUp();
    this._dashboardCommService.openGlobalFilter(this.isFilterOpen);
    this.manageUnsubscribeObservable$.add(
      this._dashboardCommService.gridstackDrag.subscribe(() => {
        this.closeDD();
      })
    );
    this.manageUnsubscribeObservable$.add(
      this._dashboardCommService.globalFilterApplyCancel.subscribe(() => {
        this.isFilterOpen = false;
      })
    );
    this.initDashboardViewPopup();
    this.isBidInsights = !!this._commUtils.getUrlParam('dc');
    this.getDefaultColorsForAllCharts();
    this.globalSliderApplyUpdateFilterTabInfo();
    this.showViewPopupInNextGen = this._commUtils.getUrlParam('nextGen') != 'True';
  }

  initDashboardViewPopup() {
    // initializing the default view for the dashboard
    this.dashboardViews = [
      {
        title: DashboardConstants.DashboardViewsTypes.MY_VIEWS,
        isActive: true,
        type: "myView"
      },
      {
        title: DashboardConstants.DashboardViewsTypes.STANDARD_VIEW,
        isActive: false,
        type: "standardView"
      },
      {
        title: DashboardConstants.DashboardViewsTypes.SHARED_VIEW,
        isActive: false,
        type: "sharedView"
      }
    ];
    this.addToDashboardList = [
      {
        title: 'Widget',
        id: 1,
        dataAutomationID: 'AddWidget'

      },
      {
        title: 'Tab',
        id: 2,
        dataAutomationID: 'AddTab'
      },
      {
        title: 'Section',
        id: 3,
        dataAutomationID: 'AddSection'
      },
    ];

    // Default Selected View Type Will be My View if user has not choosen any view
    const _myViewIndex: number = findIndex(this.dashboardViews, (viewType: any) => {
      return viewType.type == AnalyticsCommonConstants.UIMessageConstants.STRING_MY_VIEW
    });
    this.selectedViewType = this.dashboardViews[_myViewIndex];

  }

  ngOnDestroy() {
    if (this.manageUnsubscribeObservable$)
      this.manageUnsubscribeObservable$.unsubscribe();
    this._dashboardCommService.gridstackChange$.unsubscribe();
    this._dashboardCommService.globalSliderApplyFilterTabUpdate$.unsubscribe();
    this.cleanContainer([this.globalFilterRef, this.viewRenamePopupRef, this.popupContainerRef, this.popupContainerRef]);
  }

  public cleanContainer(_component: Array<any>) {
    _component.map((value: any) => {
      value.detach();
      value.clear();
    })
  }

  //dashboard view-list change action handler, updates the new view
  public onChange(_selectedValue: ViewInfo, _viewIndex: number) {
    this.getDashboardPersistenceData(_selectedValue.viewId).then((_response: any) => {
      let viewIndexToShow = _response.viewIndexToShow;
      let tabId = _response.tabId;
      let sectionId = _response.sectionId;
      //Emitting the Event to Parent to get Selected View Info
      this.setSelectedViewInfo(_selectedValue, tabId, sectionId);
      //Fix this properly
      this._dashboardCommService.setPersistenceData(_selectedValue, [], null, tabId, sectionId);
      this.dashboardViewDD = false;
      this.setHeaderOptions();
      this._dashboardCommService.filterObjectHierarchyList = [];
      this._dashboardCommService.lstOfDashletSort = new Map<string, any>();
      // this._dashboardCommService.dashboardTabsList = [];
      // this._dashboardCommService.setDashboardTabsList(this._dashboardCommService.dashboardTabsList);
      //making the forcefully empty array in order to work persitance api properly
      this._commUtils._widgetCards = [];
      //clearing out the slicer filter config on changing the view.
      this._dashboardCommService.slicerFilterConfig = new Map<string, ISlicerFilterConfig>();
      // for(let _key in this._dashboardCommService.slicerFilterConfig){
      //   delete this._dashboardCommService.slicerFilterConfig[_key];
      // }
      this._dashboardCommService.slicerFilterList = [];
      this._dashboardCommService.lstOfGlobalFilters = [];
    });
  }

  private setBidInsightsProductConfiguration(currentproductName: productName, viewID, isMyView) {
    const documentCode = !isNaN(Number.parseInt(this._commUtils.getUrlParam('dc'))) ? Number.parseInt(this._commUtils.getUrlParam('dc')) : 0;
    let isDefaultDashboard: boolean;

    if (currentproductName == productName.bidInsightsProduct) {
      if (!isMyView) {
        this._dashboardService.GetBidInsigtsDashboardSourcingApi(documentCode, viewID)
          .toPromise()
          .then((response) => {
            if (response != undefined && response.isDefault != null) {
              isDefaultDashboard = response.isDefault;
              productConfiguration[currentproductName].showDeleteViewOption = !isDefaultDashboard;
            }
            else {
              productConfiguration[currentproductName].showDeleteViewOption = false;
            }
            this.setHeaderOptions();
          })
      }
      else {
        productConfiguration[currentproductName].showDeleteViewOption = true;
      }

    }



    this._appConstants.userPreferences.moduleSettings = this._commUtils.getProductConfiguration(
      currentproductName
    );
  }

  openDashboardViewDD() {
    this.dashboardViewDD = true;
  }

  closeDD() {
    this.dashboardViewDD = false;
  }

  //sub-header kebab memu actions handler
  public subHeaderMenuClick(item) {
    switch (item.export) {
      case DashboardConstants.UIMessageConstants.STRING_SAVE_BTN_TXT:
        this.saveDashBoardView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_RENAME_BTN_TXT:
        this.renameDashboardView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_DELETE_BTN_TXT:
        this.deleteDashboardView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_ADD_STANDARD_VIEW_BTN_TXT:
        this.addStandardDashboardView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT:
        this.removeStandardDashboardView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT:
        this.openSaveAsPopup();
        break;
      case DashboardConstants.UIMessageConstants.STRING_MARK_AS_DRILLED_DOWN_DASHBOARD:
        this.addAsDrilledDownView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD:
        this.removeAsDrilledDownView();
        break;
      case DashboardConstants.UIMessageConstants.STRING_Export_TO_PDF:
        this.exportToPdf();
        break;
      default:
        break;
    }
  }

  public exportToPdf() {
    let lstOfAppliedFilter = [];
    lstOfAppliedFilter.push(...this._dashboardCommService.appliedFilters);
    let _tabFilterList = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails,{tabId: this._dashboardCommService.selectedTab.tabId})[0].lstAppliedTabFilters;
    if(_tabFilterList.length>0){
      lstOfAppliedFilter.push(..._tabFilterList);
    }
    this._commUtils.exportToPdf(
      this.subheaderConfig.selectedDashboard.viewName,
      lstOfAppliedFilter,
      this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerName,
      this._dashboardCommService.dashboardTabsList);
  }
  public clickLinkToDashboard(cardId) {
    this.cardId = cardId;
    this.isLinkToDashboard = true;
    this.showDrillDownViewCheckbox = false;
    this.openDashboardViewsPopup();
  }

  public clickHeadingLinkedWidget(viewId) {
    const thisRef = this;
    const linkedViewInfo: any = find(this.subheaderConfig.viewInfoArray, { viewId: viewId });
    if (!this._commUtils.isNune(linkedViewInfo)) {
      window.location.href = this._commonUrls.URLs.AnalyticsDataApiCommonUrls.accessDeniedUrl;
    }
    else {
      const myViewIndex: number = findIndex(this.dashboardViews, (viewType: any) => {
        return viewType.type == "myView"
      });
      const standardViewIndex: number = findIndex(this.dashboardViews, (viewType: any) => {
        return viewType.type == "standardView"
      })
      if (linkedViewInfo.createdBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode) {
        this.dashboardViews[myViewIndex].isActive = true;
        this.selectedViewType = this.dashboardViews[myViewIndex];
        this.dashboardViews[standardViewIndex].isActive = false;
      }
      else {
        this.dashboardViews[standardViewIndex].isActive = true;
        this.selectedViewType = this.dashboardViews[standardViewIndex];
        this.dashboardViews[myViewIndex].isActive = false;
      }
      const viewUrl: string = this._commonUrls.URLs.DashboardApiUrls.dashboardViewIdRedirectUrl + '&viewId=' + linkedViewInfo.viewId
      //Instead of checking the complete appliedFitler list we fill first filter the GlobalFilter from applied filter then pass those filters ahead.
      let listOfGlobalFilters = filter(this._dashboardCommService.appliedFilters, (_val: any) => {
        return (_val.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource)
      });
      if (listOfGlobalFilters.length == 0) {
        window.open(viewUrl, '_blank');
      }
      else {
        //Making the Linked to dashboard filter ready to pass to another view
        const _prepareFilter = [];
        let _crossSuiteRelationMapping = [];
        const isCrossSuiteView: boolean = this._commUtils.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource);
        listOfGlobalFilters.map((_appFilter: any, _appKey: any) => {
          let filterConditionObjectID = ''
          const { listFilterValues, Operators, FilterBy } = this._globalFilterService.getFilterValueWithOperator(_appFilter, _appKey);
          _crossSuiteRelationMapping = [];
          if (isCrossSuiteView) {
            _appFilter.CrossSuiteFilterMapping.RelationObjectMapping.map((_relValue: any, _relKey: number) => {
              _crossSuiteRelationMapping.push({
                DataSourceObjectId: _relValue.DataSourceObjectId,
                ReportObjectId: _relValue.ReportObjectId
              });
            });
          }
          if (this._commUtils.isPeriodFilter(_appFilter.FilterType)) {
            if (_appFilter.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
              filterConditionObjectID = _appFilter.FilterConditionOperator.FilterConditionObjectId
            }
            else if (_appFilter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
              switch (_appFilter.FilterType) {
                case DashboardConstants.FilterType.Year: {
                  filterConditionObjectID = _appFilter.YearModel.field.FilterConditionObjectId;
                  break;
                }
                case DashboardConstants.FilterType.Quarter:
                case DashboardConstants.FilterType.QuarterYear:
                case DashboardConstants.FilterType.MonthYear:
                case DashboardConstants.FilterType.Month: {
                  filterConditionObjectID = _appFilter.QuarterYearModel.field.FilterConditionObjectId;
                  break;
                }
                case DashboardConstants.FilterType.Date: {
                  filterConditionObjectID = _appFilter.FilterRadioOperator.field.FilterConditionObjectId;
                  break;
                }
              }
            }
          }
          else {
            filterConditionObjectID = _appFilter.FilterConditionOperator.FilterConditionObjectId;
          }
          let filterConditionText = this._commUtils.isNune(_appFilter.FilterTabInfo) ? _appFilter.FilterTabInfo :
            _appFilter.FilterConditionText.value;
          _prepareFilter.push({
            ViewName: this.subheaderConfig.selectedDashboard.viewName,
            ReportObjectID: _appFilter.ReportObjectId,
            ISMultiSource: isCrossSuiteView ? DashboardConstants.ViewFilterType.MultiSource : DashboardConstants.ViewFilterType.SingleSource,
            FilterConditionObjectID: filterConditionObjectID,
            FilterValue: JSON.stringify(listFilterValues),
            FilterBy: _appFilter.FilterBy,
            dataSourceObjectId: _appFilter.DataSource_ObjectId,
            crossSuiteRelationMapping: _crossSuiteRelationMapping,
            FilterConditionText: filterConditionText
          });
        });
        const inputParam: Array<{}> = [{ 'crossPrdouctDashboardFiltersInput': JSON.stringify(_prepareFilter) }];
        this._commUtils.formSubmitMethod(viewUrl, '_blank', inputParam);
      }
      // this.redirectToLinkedView(linkedViewInfo, this.selectedViewType);
    }
  }
  public renameDashboardView() {
    this.openRenameViewPopup();
  }

  public async openRenameViewPopup() {
    this._loaderService.showGlobalLoader();
    const viewRenamePopupConfig: any = {
      api: {
        closePopup: () => { this.viewRenamePopupClose(); },
        doneClick: (modifiedViewName) => { this.viewRenamePopupDone(modifiedViewName); },
        cancelClick: () => { this.viewRenamePopupCancel(); },
      },
      selectedDashboard: this.subheaderConfig.selectedDashboard
    };
    this.loadModule('view-rename-popup/view-rename-popup', viewRenamePopupConfig);
  }

  public viewRenamePopupClose() {
    this.popupContainerRef.detach();
    this.popupContainerRef.clear();
    // _compViewRenamePopup.destroy();
  }

  public viewRenamePopupDone(modifiedViewName: any) {
    this.renameSelectedViewInfo(modifiedViewName);
  }

  public viewRenamePopupCancel() {
    this.viewRenamePopupClose();
  }

  public deleteDashboardView() {

    const _checkIfStandardView = find(this.subheaderConfig.viewInfoArray, {
      viewId: this.subheaderConfig.selectedDashboard.viewId,
      isStandard: true
    });

    const _confirmMessage = _checkIfStandardView != undefined && _checkIfStandardView != null ? `${DashboardConstants.UIMessageConstants.STRING_REMOVE_DELETE_BTN_TXT}` :
      `${DashboardConstants.UIMessageConstants.STRING_VIEW_DELETE_MSG_OPTION.replace('$VR@', this.subheaderConfig.selectedDashboard.viewName)}`;

    let popupMessage: any;
    if (this._dashboardCommService.sharedUserCount == null || this._dashboardCommService.sharedUserCount == 0) {
      popupMessage = _confirmMessage;
    }
    else
      popupMessage = DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Delete_Confimation__message;
    this._commUtils.getConfirmMessageDialog(popupMessage, [
      DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
      DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
    ], (_response: any) => {
      if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
        this._loaderService.hideGlobalLoader();
        this.manageUnsubscribeObservable$.add(
          this._dashboardService.editViewInfoDetails(
            this.subheaderConfig.selectedDashboard.viewId,
            this.subheaderConfig.selectedDashboard.viewName,
            DashboardConstants.EditViewOperation.DELETE_VIEW
          ).subscribe((_response: any) => {
            if (_response != null) {
              const _deletedViewIdIndex = findIndex(this.subheaderConfig.viewInfoArray, {
                viewId: this.subheaderConfig.selectedDashboard.viewId

              });
              if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                this.manageUnsubscribeObservable$.add(
                  this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Delete, null, this.subheaderConfig.selectedDashboard.viewId, null).subscribe(async (_response: any) => { })
                );
              }
              if (this.subheaderConfig.selectedDashboard.sharedUserCount != 0)
                this.deleteSharedView();

              if (this.isBidInsights)
                this._BidInsightsService.notifyDeleteBidInsightsDashboard(this.subheaderConfig.selectedDashboard.viewId);
              this._commUtils.getToastMessage(`${this.subheaderConfig.selectedDashboard.viewName} ${DashboardConstants.UIMessageConstants.STRING_VIEW_DELETED_SUCCESS}`);

              this.subheaderConfig.viewInfoArray.splice(_deletedViewIdIndex, 1);
              if (this.subheaderConfig.viewInfoArray.length > 0) {
                //Explicitly Passing the Zero Index Value from Options 0th Index
                this.onChange(this.subheaderConfig.viewInfoArray[0], 0);
              } else {
                this._commUtils.getMessageDialog(
                  DashboardConstants.UIMessageConstants.STRING_DASHBOARD_NOT_CONTAIN_ANY_VIEWS,
                  () => { },
                  DashboardConstants.OpportunityFinderConstants.STRING_INFORM
                );
              }
              this._loaderService.hideGlobalLoader();
            }
          })
        );
      }
    });
  }

  public addStandardDashboardView() {
    let popupMessage: any;
    if (this._dashboardCommService.sharedUserCount == null || this._dashboardCommService.sharedUserCount == 0) {
      popupMessage = `${DashboardConstants.UIMessageConstants.STRING_ADDING_STANDARD_VIEW}`
    }
    else
      popupMessage = popupMessage = `${DashboardConstants.UIMessageConstants.STRING__Share_Dashboard_AddTo_Standard_Confirmation_message}`

    this._commUtils.getConfirmMessageDialog(popupMessage, [
      DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
      DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
    ], (_response: any) => {
      if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
        this._loaderService.showGlobalLoader();
        this.manageUnsubscribeObservable$.add(
          this._dashboardService.editViewInfoDetails(
            this.subheaderConfig.selectedDashboard.viewId,
            this.subheaderConfig.selectedDashboard.viewName,
            DashboardConstants.EditViewOperation.ADD_STANDARD_VIEW
          ).subscribe((_response: any) => {
            if (_response != null) {
              this.subheaderConfig.selectedDashboard.isStandard = true;
              if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                const updateIngestionObject = {
                  IsStandard: this.subheaderConfig.selectedDashboard.isStandard
                }
                this.manageUnsubscribeObservable$.add(
                  this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                );
              }
              this.setAsStandardView(true);
              this.setHeaderOptions();
              if (this.subheaderConfig.selectedDashboard.ShareUserCount != 0 || this.subheaderConfig.selectedDashboard.ShareUserCount != null)
                this.removeSharedView();
              this._commUtils.getToastMessage(`${this.subheaderConfig.selectedDashboard.viewName} ${DashboardConstants.UIMessageConstants.STRING_ADDED_STD_SUCCESS}`);
              this._loaderService.hideGlobalLoader();
            }
          })
        );
      }
    });
  }

  public removeStandardDashboardView() {
    this._commUtils.getConfirmMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_REMOVE_STD_CONFIRM_MSG}`, [
      DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
      DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
    ], (_response: any) => {
      if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
        this._loaderService.showGlobalLoader();
        this.manageUnsubscribeObservable$.add(
          this._dashboardService.editViewInfoDetails(
            this.subheaderConfig.selectedDashboard.viewId,
            this.subheaderConfig.selectedDashboard.viewName,
            DashboardConstants.EditViewOperation.REMOVE_ADD_STANDARD_VIEW
          ).subscribe((_response: any) => {
            if (_response != null) {
              this.subheaderConfig.selectedDashboard.isStandard = false;
              if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                const updateIngestionObject = {
                  IsStandard: this.subheaderConfig.selectedDashboard.isStandard
                }
                this.manageUnsubscribeObservable$.add(
                  this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                );
              }
              this.setAsStandardView(false);
              this.setHeaderOptions();
              this._commUtils.getToastMessage(`${this.subheaderConfig.selectedDashboard.viewName} ${DashboardConstants.UIMessageConstants.STRING_VIEW_NOLONGER_STDVIEW}`);
              this._loaderService.hideGlobalLoader();
            }
          })
        );
      }
    });
  }

  private renameSelectedViewInfo(renameView: any) {
    if (renameView.viewName.trim() !== '' &&
      renameView.viewName.trim() != this.subheaderConfig.selectedDashboard.viewName.trim()) {
      this._loaderService.showGlobalLoader();
      const _tempName = this.subheaderConfig.selectedDashboard.viewName;
      this.manageUnsubscribeObservable$.add(
        this._dashboardService.editViewInfoDetails(
          this.subheaderConfig.selectedDashboard.viewId,
          renameView.viewName,
          DashboardConstants.EditViewOperation.RENAME_VIEW
        ).subscribe((_response: any) => {
          if (_response != null) {
            const _deletedViewIdIndex = findIndex(this.subheaderConfig.viewInfoArray, {
              viewId: this.subheaderConfig.selectedDashboard.viewId
            });
            if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
              const updateIngestionObject = {
                ViewName: renameView.viewName
              }
              this.manageUnsubscribeObservable$.add(
                this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
              );
            }
            if (this.isBidInsights)
              this._BidInsightsService.notifyRenameBidInsightsDashboard(this.subheaderConfig.selectedDashboard.viewId, _response);
            this.subheaderConfig.viewInfoArray[_deletedViewIdIndex].viewName = _response;
            this.subheaderConfig.selectedDashboard.viewName = _response;
            this.subheaderConfig.dashboardName = _response;
            this.subheaderConfig.viewInfoArray = sortBy(this.subheaderConfig.viewInfoArray, (viewInfo) => {
              return viewInfo.viewName.toUpperCase();
            });
            this._commUtils.getToastMessage(`${_tempName} ${DashboardConstants.UIMessageConstants.STRING_VIEW_RENAME_SUCCESS} ${_response}`);
            this.viewRenamePopupClose();
            this._loaderService.hideGlobalLoader();
          }
        })
      );
    }
    else {
      this.viewRenamePopupClose();
    }
  }
  public addAsDrilledDownView() {
    this._commUtils.getConfirmMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_WARNING_MSG_ADD_TO_DRILLED_VIEW}`, [
      DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
      DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
    ], (_response: any) => {
      if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
        this._loaderService.showGlobalLoader();
        this.manageUnsubscribeObservable$.add(
          this._dashboardService.editViewInfoDetails(
            this.subheaderConfig.selectedDashboard.viewId,
            this.subheaderConfig.selectedDashboard.viewName,
            DashboardConstants.EditViewOperation.ADD_DRILLED_VIEW
          ).subscribe((_response: any) => {
            if (_response != null) {
              this.subheaderConfig.selectedDashboard.isDrilledDownView = true;
              if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                const updateIngestionObject = {
                  IsDrilledDownView: this.subheaderConfig.selectedDashboard.isDrilledDownView
                }
                this.manageUnsubscribeObservable$.add(
                  this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                );
              }
              this.setHeaderOptions();
              this._commUtils.getToastMessage(`${this.subheaderConfig.selectedDashboard.viewName} ${DashboardConstants.UIMessageConstants.STRING_SUCCESS_ADDED_TO_DRILLED_VIEW}`);
              this._loaderService.hideGlobalLoader();
            }
          })
        );
      }
    });
  }
  public removeAsDrilledDownView() {
    this._commUtils.getConfirmMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_SUCCESS_REMOVED_FROM_DRILLED_VIEW}`, [
      DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
      DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
    ], (_response: any) => {
      if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
        this._loaderService.showGlobalLoader();
        this.manageUnsubscribeObservable$.add(
          this._dashboardService.editViewInfoDetails(
            this.subheaderConfig.selectedDashboard.viewId,
            this.subheaderConfig.selectedDashboard.viewName,
            DashboardConstants.EditViewOperation.REMOVE_DRILLED_VIEW
          ).subscribe((_response: any) => {
            if (_response != null) {
              this.subheaderConfig.selectedDashboard.isDrilledDownView = false;
              if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                const updateIngestionObject = {
                  IsDrilledDownView: this.subheaderConfig.selectedDashboard.isDrilledDownView
                }
                this.manageUnsubscribeObservable$.add(
                  this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                );
              }
              this.setHeaderOptions();
              this._commUtils.getToastMessage(`${this.subheaderConfig.selectedDashboard.viewName} ${DashboardConstants.UIMessageConstants.STRING_SUCCESS_REMOVED_FROM_DRILLED_VIEW}`);
              this._loaderService.hideGlobalLoader();
            }
          })
        );
      }
    });
  }
  //Export action handler in sub-header kebab menu, it will open a dropdown with option
  // public headerExportOptions(data) {
  //   this.exportOptions = data.types;
  //   let elClickedDD = document.getElementById("sub-header-kebab-DD");
  //   let el = document.getElementById("exportDD");
  //   this.exportOptionsFlg = false;
  //   el.style.left = elClickedDD.getBoundingClientRect().left + 'px';
  //   el.style.top = elClickedDD.getBoundingClientRect().top + 'px';
  //   el.style.width = elClickedDD.getBoundingClientRect().width + 'px';
  // }

  //will provide actions for export options dropdown
  // public exportOptionsClick(item) {
  //   this.headerKebabMenu.expanded = true;
  // }

  //route navigation to open saveas popup
  // public openSaveAsPopup() {
  //   this._router.navigate(['', { outlets: { 'saveas-popup': ['saveas'] } }], { relativeTo: this._route.root, skipLocationChange: false });
  // }

  private onCommWrapperSubheaderEvents() {
    this.manageUnsubscribeObservable$.add(
      this._dashboardCommService.commWrapperSubheaderEvents$.subscribe((data) => {
        if (data != undefined) {
          if (
            data.eventType == DashboardConstants.EventType.SetSaveDashboard ||
            data.eventType == DashboardConstants.EventType.SetSaveAsDashboard) {
            let viewInfo = {
              ViewId: this.subheaderConfig.selectedDashboard.viewId,
              ViewName: (data.eventType == DashboardConstants.EventType.SetSaveDashboard ? this.subheaderConfig.selectedDashboard.viewName : data.viewName),
              CreatedOn: undefined,
              CreatedBy: undefined,
              ModifiedOn: undefined,
              ModifiedBy: this.subheaderConfig.selectedDashboard.isOwn ? this.subheaderConfig.selectedDashboard.ModifiedBy : undefined,
              lstDashboardFilters: Object.assign([], data.dashboardFilters),
              lstTabInfo: undefined,
              ProductName: this._commUtils.getProductName()            
            }
            let _tabDashletArray = this._commUtils.getDeReferencedObject(this._dashboardCommService.tabDashletInfo.lstTabDetails);
            each(_tabDashletArray, (_tab: TabDetail) => {
              _tab.lstSectionInfo[0].lstDashletInfo = [];
              _tab.lstSectionInfo[0].lstDashletInfo = data.tabDashletArray.get(_tab.tabId);
              map(_tab.lstTabFilter, (_tabFilter: TabFilterDetails) => {
                _tabFilter.TabId = _tab.tabId;
              });
            });
            viewInfo.lstTabInfo = map(_tabDashletArray, (_tabDashlet: TabDetail) => {
              return new TabDetail().objectToEntity(_tabDashlet, this.subheaderConfig.selectedDashboard.viewId)
            });



            viewInfo.lstDashboardFilters.forEach(filter => {
              //Done this to handle the case of slicer filter in which even if the user does not select and filterValue we have to save that filterObj.
              if (filter.filterValue.length === 0 && filter.ViewFilterType === DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource) {
                filter.filterValue = "[]";
              }
              else if (typeof filter.filterValue !== 'string')
                //filter.filterValue = '["' + filter.filterValue.join('","') + '"]';
                filter.filterValue = filter.filterValue.join();
            });

            let dashletArray = map(data.dashletArray, (dashlet) => {
              return new DashletInfo().objectToEntity(dashlet, this.subheaderConfig.selectedDashboard.viewId);
            });
            /**
             *  This block of code should do ONLY the Save Dashboard When SaveAsDashboard is Triggereed 
            */
            if (data.eventType == DashboardConstants.EventType.SetSaveAsDashboard) {
              this.saveAsDashboard(viewInfo, dashletArray);
            }
            else if (data.eventType == DashboardConstants.EventType.SetSaveDashboard) {
              /**
               *  This block of code should do ONLY the Save Dashboard When SaveDashboard is Triggereed 
              */
              this._dashboardService.saveDashboard(viewInfo, dashletArray).toPromise().then((response) => {
                this._loaderService.hideGlobalLoader();
                if (response.toLowerCase() == "true") {
                  //Overwriting previously saved Filters with new saved Filters
                  if (this._appConstants.userPreferences.moduleSettings.enableIngestion)
                    this.mapViewInfoForIngestion(DashboardConstants.EventType.SetSaveDashboard, null);
                  this.subheaderConfig.selectedDashboard.lstDashboardFilters = Object.assign([], data.dashboardFilters);
                  // if (!this.oppFinderFlg)
                  this._commUtils.getToastMessage(`'${this.subheaderConfig.dashboardName.toUpperCase()}' ${DashboardConstants.UIMessageConstants.STRING_VIEW_SAVED_SUCCESSFULLY}`);
                }
                else {
                  this._commUtils.getMessageDialog(this._commUtils.getServiceErrorMessage(DashboardConstants.UIMessageConstants.STRING_SHOW_SOMETHING_WENT_WRONG), () => { });
                }
              });
            }
          }
          else if (data.eventType == AnalyticsCommonConstants.WidgetFunction.LINKED_WIDGET_HEADING_CLICKED) {
            this.clickHeadingLinkedWidget(data.data);
          }
          else if (data.eventType == AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD) {
            this.clickLinkToDashboard(data.data);
          }
        }
      })
    );
  }
  public async mapViewInfoForIngestion(eventType, viewInfoSaveAs) {
    const currentDataSources = this._dashboardCommService.listofDistinctWidgetDataSource.length ? this._dashboardCommService.listofDistinctWidgetDataSource.join(',') : null;
    const selectDashboard = this.subheaderConfig.selectedDashboard;
    const viewInfo = {
      ViewId:  eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.viewId : viewInfoSaveAs.viewId,
      ViewName: (eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.viewName : viewInfoSaveAs.viewName),
      CreatedOn: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.createdOn : viewInfoSaveAs.createdOn,
      CreatedBy: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.createdBy : this._appConstants.userPreferences.UserBasicDetails.ContactCode,
      ModifiedOn: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.modifiedOn : viewInfoSaveAs.modifiedOn,
      ModifiedBy: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.modifiedBy : this._appConstants.userPreferences.UserBasicDetails.ContactCode,
      UserName: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.UserName : this._appConstants.userPreferences.UserBasicDetails.ClientName,
      IsStandard: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.isStandard : false,
      DataSourceObjectId: currentDataSources,
      maxCountReachedForPinning: selectDashboard.maxCountReachedForPinning,
      dashletCount: selectDashboard.dashletCount,
      DatasourceType: selectDashboard.datasourceType,
      IsDrilledDownView: eventType == DashboardConstants.EventType.SetSaveDashboard ? selectDashboard.isDrilledDownView : false,
      ShareUserCount: eventType == DashboardConstants.EventType.SetSaveDashboard ? this._dashboardCommService.sharedUserCount : null,
      ViewProductName: selectDashboard.ViewProductName,
      IsHiddenView: selectDashboard.IsHiddenView,
      lstDashboardFilters: [],
    }
    this.manageUnsubscribeObservable$.add(
      this._dashboardService.updateIndexedElasticSearchData(eventType == DashboardConstants.EventType.SetSaveDashboard ? AnalyticsCommonConstants.IngestionActionType.Update : AnalyticsCommonConstants.IngestionActionType.Index, JSON.stringify([viewInfo]), viewInfo.ViewId, null).subscribe(async (_response: any) => { })
    );
    if (viewInfo.ShareUserCount != null && viewInfo.ShareUserCount != 0) {
      this.manageUnsubscribeObservable$.add(this._dashboardService.getSharedUsers(viewInfo.ViewId).subscribe((_response: any) => { }));
    }

  }
  public saveAsDashboard(viewInfo, dashletArray) {
    this._dashboardCommService.previousSelectedTab = this._commUtils.getDeReferencedObject(this._dashboardCommService.selectedTab);
    this._dashboardService.saveAsDashboard(viewInfo, dashletArray).toPromise().then((response) => {
      this._loaderService.hideGlobalLoader();
      if (response != null && response.Data != 'Error') {
        this.getAllViewInfoData(false).then((obj) => {
          const viewInfo: ViewInfo = this.subheaderConfig.viewInfoArray.filter(v => v.viewId == response);
          if (this._appConstants.userPreferences.moduleSettings.enableIngestion)
            this.mapViewInfoForIngestion(DashboardConstants.EventType.SetSaveAsDashboard, viewInfo[0]);
          //This code has been added the bid insight specific to achieve the custom notification to the user according to the viewId, ViewName
          if (this.isBidInsights)
            this._BidInsightsService.notifyCopyBidInsightsDashboard(this.subheaderConfig.selectedDashboard.viewId, viewInfo[0].viewId, viewInfo[0].viewName);
          this.onChange(viewInfo[0], this.subheaderConfig.viewInfoArray.indexOf(viewInfo[0]));
          //when user open view and make it as save as then share user count should be 0
          this._dashboardCommService.updateSharedUserCount(0);
          this.setShareCount();
          this._loaderService.hideGlobalLoader();

          /**
           *  Reseting the dashboad View Types as default the Save As has been opted
           */
          this.initDashboardViewPopup();
        })
      } else {
        this._loaderService.hideGlobalLoader();
        this._commUtils.getToastMessage(`Error occured while coping dashboard`);
      }

    });

  }

  public saveDashBoardView() {
    if (this._commUtils.isDrillDriveActiveOnView()) {
      this._commUtils.getConfirmMessageDialog(
        "Currently, Drill with drive has been applied to Widget.Drill & Drive Filter Will not be saved. Would you like to proceed further ?",
        [
          DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
          DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
        ]
        , (_response: any) => {
          if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
            this.invokeSaveDashboardView();
          }
        });
    }
    else {
      this.invokeSaveDashboardView();
    }
  }


  public invokeSaveAsDashboardView(viewName) {
    this._dashboardCommService.triggerSaveAsDashboard(viewName);
  }

  public invokeSaveDashboardView() {
    crossProductFilters = '';
    if ((crossProductFilters.length == 0) || !this._appConstants.userPreferences.moduleSettings.enableCarryOverFilterOption) {
      this._dashboardCommService.triggerSaveDashboard();
    }
  }

  //route navigation for manage views popup
  public openManageViewsPopup() {
    this._router.navigate(['', { outlets: { 'manageviews-popup': ['manageviews'] } }], { relativeTo: this._route.root, skipLocationChange: true });
  }

  public openFilter(TabFilter: boolean = false) {
    if (this._commUtils.checkForCrossSuiteRelationMapping(
      this._dashboardCommService.listofDistinctWidgetDataSource.length <= 1 ?
        {
          type: DashboardConstants.ViewFilterType.SingleSource,
          array: this._dashboardCommService.listAllReportObjectWithMultiDatasource
        } :
        {
          type: DashboardConstants.ViewFilterType.MultiSource,
          array: this._dashboardCommService.listAllCrossSuiteFilterMapping
        }
    )) {
      // this.isFilterOpen = !this.isFilterOpen;
      // this._dashboardService1.setGlobalFilterFlag(this.isFilterOpen)
      // let dashboardWrapper = document.getElementById('dashboard-container-id');
      let dashboardWrapper = document.getElementById('dashboard-container-id'),
        mainContainer = document.getElementById('main-container-id');
      this.isFilterOpen = this._dashboardCommService.fadeOutDashboardGrid();
      this.isFilterOpen = !this.isFilterOpen;
      this._dashboardCommService.openGlobalFilter(this.isFilterOpen);
      if (this.isFilterOpen) {
        this._renderer.addClass(dashboardWrapper, "global-filter-fixed");
        this._renderer.addClass(mainContainer, "overflow-hide");
      }
      else {
        this._renderer.removeClass(dashboardWrapper, "global-filter-fixed");
        this._renderer.removeClass(mainContainer, "overflow-hide");
      }
      let thisRef = this;
      if (!this.isFilterOpen) {
        setTimeout(() => {
          thisRef.globalFilterRef.clear();
        }, 300);
        //this.globalFilterRef.clear();
      }
      else {
        this.loadGlobalFilter(TabFilter);
      }
    }
    // if (this.isFilterOpen) {
    //   this._renderer.addClass(dashboardWrapper, "global-filter-fixed");
    // }
    // else {
    //   this._renderer.removeClass(dashboardWrapper, "global-filter-fixed");
    // }
  }

  public openSlicerConfiguration() {
    //Check if in normal case this array are not getting duplicate values pushed in them. this.subheaderConfig.nonStandardFilterList.
    const slicerFilterCompRef: any = this._comFactResolver.resolveComponentFactory(SlicerConfigurationComponent);
    const slicerComponentRef: ComponentRef<any> = this.popupContainerRef.createComponent(slicerFilterCompRef);
    slicerComponentRef.instance.config = {
      setFilterTabList: (filterTabList) => { this.setFilterTabList(filterTabList) },
      filterTabList: this.subheaderConfig.filterTabList,
      selectedView: this.subheaderConfig.dashboardName,
      nonStandardFilterList: this.subheaderConfig.nonStandardFilterList,
      closePopup: () => {
        slicerComponentRef.destroy();
      }
    };
  }

  // Get Fraud and Anomaly View Info based on the strategy
  getFraudAnomalyViewDetails() {
    this._loaderService.hideGlobalLoader();
    return new Promise((resolve) => {
      if (this._dashboardCommService.fraudAnomalyState.editMode) {
        switch (this._dashboardCommService.fraudAnomalyState.strategy.name) {
          case DashboardConstants.FraudAnomalyConstants.Strategies.HCN.name:

        default:
          // Have to implement edit mode code here.
          break;
      }
    }
    else {
    this._oppfinderService.getFraudAnomalyViewDetails(this._dashboardCommService.fraudAnomalyState.strategy.name)
      .toPromise().then((response) => {
        if (response.length > 0) {
          this.subheaderConfig.viewInfoArray = [];
          let lstViewFilters = [];
          let lstTabInfo = [];
          let promiseArray = [
            this._aCommMetaDataServ.getViewSavedFilterList(),
            this._aCommMetaDataServ.getAllTabInfo()
          ]
          response = JSON.parse(response);
  
          this.manageUnsubscribeObservable$.add(
            Observable.forkJoin(
              ...promiseArray
            ).subscribe((_response: any) => {
              if (_response[0] != null) {
                lstViewFilters = _response[0];
              }
              if (_response[1] != null) {
                lstTabInfo = _response[1]
              }
          response.map(viewInfo => {
            viewInfo.lstDashboardFilters = lstViewFilters.filter(x => { return x.ViewId === viewInfo.ViewId });
            viewInfo.lstTabInfo = lstTabInfo.filter(x => { return x.ViewId === viewInfo.ViewId });
            let viewInfoObj: ViewInfo = new ViewInfo(viewInfo);
            viewInfoObj.lstTabInfo = this.mapLstTabInfo(viewInfo.lstTabInfo);
            this.subheaderConfig.viewInfoArray.push(viewInfoObj);
          });
          this.setSelectedViewInfo(this.subheaderConfig.viewInfoArray[0], "", "");
          this._loaderService.hideGlobalLoader();
          resolve(true);
          })
          );
        }
        });
      }
    });
  
  }

  // Get Opportunity FInder View Info based on strategy
  getOppFinderViewDetails() {
    this._loaderService.hideGlobalLoader();
    return new Promise((resolve) => {
      if (this._dashboardCommService.oppFinderState.editMode) {
        switch (this._dashboardCommService.oppFinderState.strategy.name) {
          case DashboardConstants.OpportunityFinderConstants.Strategies.SRS.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.PTS.name:
            break;
          case DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.BPDC.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name:
          case DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.name:

          default:
            this.getOppFinderGridJson();
            break;
        }

        // this._oppfinderService.getReportDetailsByOpportunityFinderId(this._dashboardCommService.oppFinderState.oppFinderId)
        //   .toPromise()
        //   .then((response: IOpportunityFinderCreationObjectInfo) => {
        //     console.log(JSON.parse(response.OppFinderDetails.GridColumnsJSON));
        //   })
      }
      this._oppfinderService.getOppFinderRedirectionViewDetails(this._commUtils.getUrlParam('strat'))
        .toPromise().then((response: Array<ViewInfo>) => {
          this.subheaderConfig.viewInfoArray = [];
          //this.subheaderConfig.viewInfoArray = response;
          response.map(viewInfo => {
            let viewInfoObj: ViewInfo = new ViewInfo(viewInfo);
            viewInfoObj.lstTabInfo = this.mapLstTabInfo(viewInfo.lstTabInfo);
            this.subheaderConfig.viewInfoArray.push(viewInfoObj);
          });
          //Check this case for setting the tabId, and sectionId
          this.setSelectedViewInfo(this.subheaderConfig.viewInfoArray[0], "", "");
          this._loaderService.hideGlobalLoader();
          resolve(true);
        });
    });
  }


  //Get All View Info data for User dashboard has craeted.
  public getAllViewInfoData(getDashletDetailsOfSelectedView: boolean = true) {
    const documentCode = !isNaN(Number.parseInt(this._commUtils.getUrlParam('dc'))) ? Number.parseInt(this._commUtils.getUrlParam('dc')) : 0;
    this._loaderService.showGlobalLoader();

    return new Promise((resolve) => {
      (documentCode > 0 ?
        this._dashboardService.getBidInsightsViewInfo(documentCode) :
        this._dashboardService.getAllViewInfoData()
      ).toPromise()
        .then(async (response: Array<ViewInfo>) => {
          if (response.length > 0) {
            this.subheaderConfig.viewInfoArray = [];
            let lstViewFilters = [];
            let lstTabInfo = [];
            let promiseArray = [
              this._aCommMetaDataServ.getViewSavedFilterList(),
              this._aCommMetaDataServ.getAllTabInfo()
            ]
            this.manageUnsubscribeObservable$.add(
              Observable.forkJoin(
                ...promiseArray
              ).subscribe((_response: any) => {
                if (_response[0] != null) {
                  lstViewFilters = _response[0];
                }
                if (_response[1] != null) {
                  lstTabInfo = _response[1]
                }
                response.map((viewInfo: any) => {
                  viewInfo.lstDashboardFilters = lstViewFilters.filter(x => { return x.ViewId === viewInfo.ViewId });
                  viewInfo.lstTabInfo = lstTabInfo.filter(x => { return x.ViewId === viewInfo.ViewId });
                  let viewInfoObj: ViewInfo = new ViewInfo(viewInfo);
                  viewInfoObj.isOwn = viewInfoObj.createdBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode,

                    viewInfoObj.DataSourceObjectId = viewInfo.DataSourceObjectId;
                  viewInfoObj.lstTabInfo = this.mapLstTabInfo(viewInfo.lstTabInfo);
                  //  viewInfoObj.iShared = viewInfoObj.createdBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode,
                  if (viewInfoObj.ShareUserCount > 0 && viewInfoObj.ShareUserCount != null)
                    viewInfoObj.iShared = true
                  else
                    viewInfoObj.iShared = false;

                  this.subheaderConfig.viewInfoArray.push(viewInfoObj);
                });
                this.subheaderConfig.viewInfoArray = sortBy(this.subheaderConfig.viewInfoArray, (viewInfo) => {
                  return viewInfo.viewName.toUpperCase();
                });
                this.getDashboardPersistenceData().then((_response: any) => {
                  let viewIndexToShow = _response.viewIndexToShow;
                  let tabId = _response.tabId;
                  let sectionId = _response.sectionId;
                  if (getDashletDetailsOfSelectedView) {
                    this.setSelectedViewInfo(this.subheaderConfig.viewInfoArray[viewIndexToShow], tabId, sectionId);
                    this._dashboardCommService.updateSharedUserCount(this.subheaderConfig.viewInfoArray[viewIndexToShow].ShareUserCount);
                  }
                  this._loaderService.hideGlobalLoader();
                  if (this.subheaderConfig.viewInfoArray.length == 0) {
                    this._commUtils.getMessageDialog(
                      DashboardConstants.UIMessageConstants.STRING_DASHBOARD_NOT_CONTAIN_ANY_VIEWS,
                      (_response: any) => {
                        this._loaderService.hideGlobalLoader();
                        return;
                      },
                      DashboardConstants.OpportunityFinderConstants.STRING_INFORM
                    );
                  }
                  resolve(true);
                });
              })
            );
          }
          else if (supplierScorecardConfig != null && supplierScorecardConfig['ProductType'] == productName.scorecardProduct
            && supplierScorecardConfig['ViewId'] != undefined) {
            this.getViewInfoByViewID(supplierScorecardConfig['ViewId']).then(() => {
              resolve(true);
            });
          }
          else {
            this.loadModule('user-message/user-message', {});
          }
        });
    });
  }

  private getOppFinderGridJson() {
    this._oppfinderService.getOppFinderGridJson(this._dashboardCommService.oppFinderState.oppFinderId)
      .toPromise()
      .then((response) => {
        console.log(response);
        if (this._commUtils.isNune(response) && typeof response === 'string') {
          this._dashboardCommService.oppFinderState.gridJson = JSON.parse(response);
        }
        this._loaderService.hideGlobalLoader();
      })
  }

  private removeSharedView() {
    if (this.subheaderConfig.selectedDashboard.sharedUserCount != 0) {
      this._loaderService.showGlobalLoader();
      this._dashboardService.removeSharedView(this.subheaderConfig.selectedDashboard.viewId, this.subheaderConfig.selectedDashboard.viewName, this.subheaderConfig.selectedDashboard.createdBy)
        .toPromise()
        .then((response) => {
          if (this._commUtils.isNune(response) && typeof response === 'string' && response.toLowerCase() === 'true') {
            this._dashboardCommService.updateSharedUserCount(0);
            this.setShareCount();
            if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
              const updateIngestionObject = {
                ShareUserCount: this._dashboardCommService.sharedUserCount,
                ViewStakeHolders: []
              }
              this.manageUnsubscribeObservable$.add(
                this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
              );
            }
          }
          this._loaderService.hideGlobalLoader();
        })
    }
  }

  private deleteSharedView() {
    this._dashboardService.deleteSharedView(this.subheaderConfig.selectedDashboard.viewId, this.subheaderConfig.selectedDashboard.viewName, this.subheaderConfig.selectedDashboard.createdBy)
      .toPromise()
      .then((response) => {

        if (this._commUtils.isNune(response) && typeof response === 'string' && response.toLowerCase() === 'true') {
          this._dashboardCommService.updateSharedUserCount(0);
          this.setShareCount();
          if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
            let updateIngestionObject = {
              ShareUserCount: this._dashboardCommService.sharedUserCount,
              ViewStakeHolders: []
            }
            this.manageUnsubscribeObservable$.add(
              this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
            );
          }
        }
        this._loaderService.hideGlobalLoader();
      })
  }

  //When the user chagnes the view at that time we will pick the viewId of the newly changed view or else continue the flow as it is.
  public getDashboardPersistenceData(changedViewId: string = '') {
    return new Promise((resolve) => {
      this._dashboardService.getDashboardPersistenceData(
        this._appConstants.userPreferences.UserBasicDetails.ContactCode,
        DashboardConstants.dashboardDocumentType,
        this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode
      )
        .toPromise()
        .then((_response: any) => {
          if (_response && _response[0] && _response[0].events && _response[0].events["dashboardLayout"]) {
            this._dashboardCommService.dashboardPersistenceData = {};
            this._dashboardCommService.dashboardPersistenceData = JSON.parse(JSON.stringify(_response[0].events["dashboardLayout"]));
            this._dashboardCommService.cleanUnwantedPersistenceViewData(this.subheaderConfig.viewInfoArray);
          }

          let viewId: string = this._commUtils.isNune(changedViewId) ? changedViewId : this._commUtils.getUrlParam('viewId') != undefined ? this._commUtils.getUrlParam('viewId') :
            (supplierScorecardConfig != null && supplierScorecardConfig['ProductType'] == productName.scorecardProduct
              && supplierScorecardConfig['ViewId'] != undefined) ? supplierScorecardConfig['ViewId'] :
              (this._dashboardCommService.dashboardPersistenceData.lastViewed ? this._dashboardCommService.dashboardPersistenceData.lastViewed : undefined);
          let viewIndexToShow: number = findIndex(this.subheaderConfig.viewInfoArray, { viewId: viewId });
          viewIndexToShow = viewIndexToShow > -1 ? viewIndexToShow : 0;
          let tabId, sectionId = undefined;
          //Check if we have the persistance data for tab and section.
          if (this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.viewInfoArray[viewIndexToShow].viewId])) {
            tabId = this._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.viewInfoArray[viewIndexToShow].viewId]['lastTabId'];
            sectionId = this._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.viewInfoArray[viewIndexToShow].viewId]['lastSectionId'];
          }
          //If we have persistance data then check if that tab exsists in the given view. 
          if (this._commUtils.isNune(tabId)) {
            let tabIndex = findIndex(this.subheaderConfig.viewInfoArray[viewIndexToShow].lstTabInfo, { tabId });
            //If tab does not exsists select the tab whose sequence is 1 to be shown.
            if (tabIndex === -1) {
              let tabDetail = filter(this.subheaderConfig.viewInfoArray[viewIndexToShow].lstTabInfo, (_tab) => { return _tab.tabSequence === 1 })[0];
              tabId = tabDetail.tabId;
              sectionId = tabDetail.sectionId;
            }
            //If tab is present than show that tab to the user.
            resolve({ viewIndexToShow, tabId, sectionId });
          }
          //If tab and section info is not present in the persistance data then first update it there with the tab whose sequnce is  1 and then pass that as selectedTab and selectedSection.
          else {
            this.checkIfTabInfoPresent(viewIndexToShow).subscribe(_response => {
              resolve(
                {
                  viewIndexToShow,
                  tabId: this._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.viewInfoArray[viewIndexToShow].viewId]['lastTabId'],
                  sectionId: this._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.viewInfoArray[viewIndexToShow].viewId]['lastSectionId']
                })
            });
          }
        })
    });
  }

  public getViewInfoByViewID(viewId: string) {
    let promiseArray = [
      this._aCommMetaDataServ.getViewInfoByViewId(viewId),
      this._aCommMetaDataServ.getAllTabInfo()
    ]
    return Observable.forkJoin(
      promiseArray
    ).toPromise()
      .then((_response: any) => {
        if (_response != null) {
          let _viewInfo = _response[0];
          let lstTabInfo = _response[1];
          this.subheaderConfig.viewInfoArray = [];
          _viewInfo.lstTabInfo = lstTabInfo.filter(x => { return x.ViewId === _viewInfo.ViewId });
          let viewInfoObj: ViewInfo = new ViewInfo(_viewInfo);
          this.subheaderConfig.viewInfoArray.push(viewInfoObj);
          this.subheaderConfig.viewInfoArray = sortBy(this.subheaderConfig.viewInfoArray, (viewInfo) => {
            return viewInfo.viewName.toUpperCase();
          });

          viewInfoObj.isOwn = viewInfoObj.createdBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode;
          this.subheaderConfig.selectedDashboard = viewInfoObj;
          this.subheaderConfig.dashboardName = viewInfoObj.viewName;
          this.viewInfo.emit({
            selectedViewInfo: viewInfoObj,
            selectedTabId: '',
            selectedSectionId: ''
          });
        }
      })
  }

  public setHeaderOptions() {
    this.headerKebabMenu = {
      options: [
        {
          id: 'header-menu-save-btn',
          export: DashboardConstants.UIMessageConstants.STRING_SAVE_BTN_TXT,
          expand: false,
          show: this.enableSubheaderActionMenuItems(ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_BTN_TXT)
        },
        {
          id: 'header-menu-rename-btn',
          export: DashboardConstants.UIMessageConstants.STRING_RENAME_BTN_TXT,
          expand: false,
          show: this.enableSubheaderActionMenuItems(ProductLevelActionNameConstants.UIMessageConstants.STRING_RENAME_BTN_TXT)
        },
        {
          id: 'header-menu-standard-btn',
          export: this.subheaderConfig.selectedDashboard.isStandard ? DashboardConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT : DashboardConstants.UIMessageConstants.STRING_ADD_STANDARD_VIEW_BTN_TXT,
          expand: false,
          show: this.enableSubheaderActionMenuItems(ProductLevelActionNameConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT)
        },
        {
          id: 'header-menu-delete-btn',
          export: DashboardConstants.UIMessageConstants.STRING_DELETE_BTN_TXT,
          expand: false,
          show: this.enableSubheaderActionMenuItems(ProductLevelActionNameConstants.UIMessageConstants.STRING_DELETE_BTN_TXT)
        },
        {
          id: 'header-menu-saveas-btn',
          export: DashboardConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT,
          expand: false,
          show: this.enableSubheaderActionMenuItems(ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT)
        },
        {
          id: 'header-menu-isdrillview-btn',
          export: this.subheaderConfig.selectedDashboard.isDrilledDownView ? DashboardConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD : DashboardConstants.UIMessageConstants.STRING_MARK_AS_DRILLED_DOWN_DASHBOARD,
          expand: false,
          show: this.enableSubheaderActionMenuItems(ProductLevelActionNameConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD)
        },
        {
          id: 'header-menu-exportpdf-btn',
          export: DashboardConstants.UIMessageConstants.STRING_Export_TO_PDF,
          expand: false,
          show: true
        }
      ],
      showKebabMenu: true,
      expanded: false
    };

    this.headerKebabMenu.options = filter(this.headerKebabMenu.options, function (item) {
      if (item.show) return item;
    });
    this.headerKebabMenu.showKebabMenu = this.headerKebabMenu.options.length > 0;
  }

  private enableSubheaderActionMenuItems(actionName: string) {
    return (() => { return new Function('DashboardConstants', this._commUtils.enableFeatureByProductType(this._appConstants.userPreferences.moduleSettings.productTitle, AnalyticsCommonConstants.ActionMenuType.SubHeaderMenu, actionName)).bind(this) })()(DashboardConstants)
  }

  public setSelectedViewInfo(_selectedView: ViewInfo, _tabId: string, _sectionId: string) {
    if (this.globalFilterRef) {
      this.globalFilterRef.clear();
      this._globalFilterService.setActiveFilter(undefined);
    }
    if (_selectedView.isOwn && _selectedView.isStandard) {
      this._commUtils.getToastMessage(DashboardConstants.UIMessageConstants.STRING_SAVE_VIEW_TO_REFLECT_CHANGES);
    }
    //If bidInsights and module product name is awardScenarioInsight and vice versa
    if ((this._appConstants.userPreferences.moduleSettings.productTitle != productTitle[_selectedView.ViewProductName as productName]
      && _selectedView.ViewProductName != productName.defaultVisionProduct) || _selectedView.ViewProductName == productName.bidInsightsProduct) {
      let isMyView = _selectedView.isOwn && !_selectedView.isStandard ? true : false;
      this.setBidInsightsProductConfiguration(_selectedView.ViewProductName as productName, _selectedView.viewId, isMyView);
    }
    this.subheaderConfig.selectedDashboard = _selectedView;
    this.subheaderConfig.dashboardName = _selectedView.viewName;
    this.viewInfo.emit({
      selectedViewInfo: _selectedView,
      selectedTabId: _tabId,
      selectedSectionId: _sectionId
    });

  }

  public async loadGlobalFilter(TabFilter) {
    const _globalFilterCompRef: any = this._comFactResolver.resolveComponentFactory(GlobalFilterComponent);
    const _dynGlobalFilterComRef: ComponentRef<any> = this.globalFilterRef.createComponent(_globalFilterCompRef);
    // _dynGlobalFilterComRef.instance.globalFilterRef = this.globalFilterRef;
    // _dynGlobalFilterComRef.instance.filterTabList = this.filterTabList;
    // _dynGlobalFilterComRef.instance.dataSourceTypeTitle = this.dataSourceTypeTitle;
    // _dynGlobalFilterComRef.instance.selectedView = this.dashboardName;
    // _dynGlobalFilterComRef.instance.FilterConditionMetadata = this.FilterConditionMetadata;
    if (TabFilter) {
      let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
      _dynGlobalFilterComRef.instance.config = {
        globalFilterRef: this.globalFilterRef,
        filterTabList: _currentTabDetail.filterTabList,
        dataSourceTypeTitle: this._dashboardCommService.getDataSourceListForGivenTab(_currentTabDetail).length > 1 ?
          DashboardConstants.ViewFilterType.MultiSource : DashboardConstants.ViewFilterType.SingleSource,
        selectedView: this.subheaderConfig.dashboardName,
        nonStandardFilterList: this.subheaderConfig.nonStandardFilterList,
        api: {},
        isTabFilter: true
      };
    }
    else {
      _dynGlobalFilterComRef.instance.config = {
        globalFilterRef: this.globalFilterRef,
        filterTabList: this.subheaderConfig.filterTabList,
        dataSourceTypeTitle: this.subheaderConfig.dataSourceTypeTitle,
        selectedView: this.subheaderConfig.dashboardName,
        nonStandardFilterList: this.subheaderConfig.nonStandardFilterList,
        api: {}
      };
    }
    this._dashboardCommService.globalFilterList = this.subheaderConfig.filterTabList;
    _dynGlobalFilterComRef.instance.config.api = {
      setFilterTabList: (filterTabList) => { this.setFilterTabList(filterTabList) }
    }
  }
  //Here we update the global filter list whenever the user adds the filter to standard filter.
  public setFilterTabList(filterTabList) {
    this.subheaderConfig.filterTabList = filterTabList;
    this._globalFilterService.setFilterReportingObjects(this.subheaderConfig.filterTabList);
  }
  public openFilterPopUp() {
    this._dashboardCommService.openFilterPop$.subscribe((_data) => {
      if (_data != null && _data != undefined && _data.LoadFilterPopup) {
        this.openFilter(_data.TabFilter);
      }
    });
  }

  public async openDashboardViewsPopup() {
    this.closeFilter();
    if (this._appConstants.userPreferences.moduleSettings.showViewSelectionOption) {
      this.subheaderConfig.selectedDashboard.sharedUserCount = this._dashboardCommService.sharedUserCount;
      this.setShareCount();
      const dashboardViewsPopupConfig: any = {
        api: {
          doneClick: (selectedView, selectedViewType, isDrillDownViewEnabled) => {
            this.dashboardViewsPopupDone(selectedView, selectedViewType, isDrillDownViewEnabled);
          },
          cancelClick: () => { this.closeDashboardViewsPopup(); },
          linkClick: (currentViewId) => { this.linkWidgetToDashboard(currentViewId, this.cardId) },
          unShareView: (viewId) => { this.onUnShareView(viewId) }
        },
        dashboardViewList: this.subheaderConfig.viewInfoArray,
        viewType: this.dashboardViews,
        currentView: this.subheaderConfig.selectedDashboard,
        selectedViewType: this.selectedViewType,
        isLinkToDashboard: this.isLinkToDashboard,
        showDrillDownViewCheckbox: this.showDrillDownViewCheckbox,
        isDrillDownViewEnabled: this.isDrillDownViewEnabled,

      }

      this.loadModule('dashboard-views-popup/dashboard-views-popup', dashboardViewsPopupConfig);
    }

  }

  private onUnShareView(viewId: string) {
    if (viewId && this.subheaderConfig.viewInfoArray && this.subheaderConfig.viewInfoArray.length > 0) {
      this.subheaderConfig.viewInfoArray = this.subheaderConfig.viewInfoArray.filter(view => view.viewId != viewId);
    }
  }
  private setShareCount(): void {
    if (this.subheaderConfig.viewInfoArray && this.subheaderConfig.viewInfoArray.length > 0) {
      let selectedView: ViewInfo = this.subheaderConfig.viewInfoArray.find((item: ViewInfo) => item.viewId == this.subheaderConfig.selectedDashboard.viewId);
      if (selectedView) {
        selectedView.ShareUserCount = this._dashboardCommService.sharedUserCount;//this.sharedUserCount;
      }
    }
  }

  closeDashboardViewsPopup() {
    this.popupContainerRef.detach();
    this.popupContainerRef.clear();
    this.showDrillDownViewCheckbox = true;
    this.isLinkToDashboard = false;
  }

  dashboardViewsPopupDone(view, selectedViewType, isDrillDownViewEnabled) {
    this.onChange(view, 0);
    this.isDrillDownViewEnabled = isDrillDownViewEnabled;
    this.selectedViewType = selectedViewType;
    this._dashboardCommService.updateSharedUserCount(view.ShareUserCount);
    this.closeDashboardViewsPopup();
  }
  redirectToLinkedView(view, selectedViewType) {
    this.onChange(view, 0);
    this.selectedViewType = selectedViewType;
  }
  linkWidgetToDashboard(viewId, cardId) {
    this._commUtils.getConfirmMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_WARNING_MSG_LINK_FROM_DASHBOARD}`, [
      DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
      DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
    ], (_response: any) => {
      if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
        this._dashboardService.linkWidgetToDashboard(viewId, cardId)
          .subscribe((_response: any) => {
            let index = findIndex(this._commUtils._widgetCards, { cardId: cardId });
            this._commUtils._widgetCards[index].linkViewId = viewId;
            this._commUtils._widgetCards[index].isLinkedToDashboard = true;
            let kebabMenuLinkedOptionIndex = findIndex(this._commUtils._widgetCards[index].uiConfig.kebabMenuOptions, { export: AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD });
            this._commUtils._widgetCards[index].uiConfig.kebabMenuOptions[kebabMenuLinkedOptionIndex].export = AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD;
            this.isLinkToDashboard = false;
            let DashboardCardFooterState = this._commUtils._widgetCards[index].changeDetectionMutation.setDashboardCardFooterState;
            let DashboardCardHeaderState = this._commUtils._widgetCards[index].changeDetectionMutation.setDashboardCardHeaderState
            // let viewInfoTemp: any = find(this.subheaderConfig.viewInfoArray, { viewId: viewId });
            if (this._commUtils._widgetCards[index].changeDetectionMutation.setSummaryCardState) {
              this._commUtils._widgetCards[index].changeDetectionMutation.setSummaryCardState();
            }
            // if (this._commUtils._widgetCards[index].changeDetectionMutation.setLinkedViewFilterState) {
            //   this._commUtils._widgetCards[index].changeDetectionMutation.setLinkedViewFilterState();
            // }

            if (DashboardCardFooterState) {
              DashboardCardFooterState();
            }
            if (DashboardCardHeaderState) {
              DashboardCardHeaderState();
              setTimeout(() => {
                this._dashboardCommService.truncateDashboardCardTitle(this._elementRef, this._commUtils._widgetCards[index], false, true);
              }, 500)
            }
            // if(this._commUtils._widgetCards[index].reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard)
            // {
            //   this._commUtils._widgetCards[index].config.data.titleValue = this._commUtils._widgetCards[index].config.data.titleValue + "\n Linked to dashboard-"+viewInfoTemp.viewName;
            // }else{
            //   this._commUtils._widgetCards[index].title = this._commUtils._widgetCards[index].title + "\n Linked to dashboard-"+viewInfoTemp.viewName;
            // }
            this._commUtils.getToastMessage(`${DashboardConstants.UIMessageConstants.STRING_SUCCESS_LINKED_WIDGET_TO_DASHBOARD}`);
          });
      }
    });
    this.closeDashboardViewsPopup();
    this.isLinkToDashboard = false;

  }
  public openReportGenerationPage() {
    this._loaderService.hideGlobalLoader();
    if (this.subheaderConfig.selectedDashboard.maxCountReachedForPinning)
      this._commUtils.getMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_WARN_MAX_WIDGET_ALLOWED}`, (_response) => {
        this._loaderService.hideGlobalLoader();
      }, DashboardConstants.OpportunityFinderConstants.STRING_WARNNING)
    else {
      this._loaderService.hideGlobalLoader();
      const documentCode = isNaN(Number.parseInt(this._commUtils.getUrlParam('dc'))) ? null : Number.parseInt(this._commUtils.getUrlParam('dc'));
      this._dashboardService.openReportGenerationPage(this._dashboardCommService.listofDistinctWidgetDataSource[0], this.subheaderConfig.selectedDashboard.viewId,
        this._dashboardCommService.selectedTab.tabId, this._dashboardCommService.selectedTab.sectionId, documentCode);
    }
  }

  public async openSaveAsPopup() {
    if (this._appConstants.userPreferences.moduleSettings.showSaveAsOption) {
      const dashboardSaveAsPopupConfig: any = {
        api: {
          doneCallback: (viewName) => { this.copyDashboardView(viewName); },
          cancelCallback: () => { this.closeDashboardViewsPopup(); }
        }
      }
      this.loadModule('dashboard-save-as-popup/dashboard-save-as-popup', dashboardSaveAsPopupConfig);
    }
  }


  public copyDashboardView(viewName: string): void {
    this.closeDashboardViewsPopup();
    this._loaderService.showGlobalLoader();
    this.invokeSaveAsDashboardView(viewName);
  }

  public copyDashboardUrl() {
    const documentCode = isNaN(Number.parseInt(this._commUtils.getUrlParam('dc'))) ? null : Number.parseInt(this._commUtils.getUrlParam('dc'));
    const _viewUrl: string = this._commonUrls.URLs.DashboardApiUrls.dashboardViewIdRedirectUrl + '&viewId=' + this.subheaderConfig.selectedDashboard.viewId + (documentCode == null ? '' : '&dc=' + documentCode);
    if (this._commUtils.copyToClipboard(_viewUrl)) {
      this._commUtils.getToastMessage('Dashboard View Url has been copied successfully !');
    }
  }
  public async openShareDashboardPopup() {
    const _sharedDashBoardPopupRefCompRef: any = this._comFactResolver.resolveComponentFactory(ShareDashboardPopupComponent);
    const _sharedDashBoardComRef: ComponentRef<any> = this.popupContainerRef.createComponent(_sharedDashBoardPopupRefCompRef);

    _sharedDashBoardComRef.instance.data = {
      currentView: this.subheaderConfig.selectedDashboard,
      api: {
        cancelCallback: () => { this.shareDashboardClose(); },

      }
    };

  }


  public shareDashboardClose() {
    this.popupContainerRef.detach();
    this.popupContainerRef.clear();
  }

  public shareDashboardCancel() {
    this.shareDashboardClose();
  }

  public trackByMenuOptions(index) {
    return index;
  }

  public loadModule(manifestPath: string, config: any) {
    this._loaderService.showGlobalLoader();
    this.popupContainerRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: manifestPath,
      config: { config: config }
    });

  }

  public onInitialize($event) {
    //console.log('onIntialize')
  }
  public onActivate($event) {
    this._loaderService.hideGlobalLoader();
  }
  public onDeinitialize($event) {
    //console.log('onDeinitialize')
  }
  private closeFilter() {
    if (this.isFilterOpen) {
      let dashboardWrapper = document.getElementById('dashboard-container-id'),
        mainContainer = document.getElementById('main-container-id');
      this.isFilterOpen = this._dashboardCommService.fadeOutDashboardGrid();
      this.isFilterOpen = !this.isFilterOpen;
      this._dashboardCommService.openGlobalFilter(this.isFilterOpen);
      this._renderer.removeClass(dashboardWrapper, "global-filter-fixed");
      this._renderer.removeClass(mainContainer, "overflow-hide");
      let thisRef = this;
      if (!this.isFilterOpen) {
        setTimeout(() => {
          this.globalFilterRef.clear();
        }, 300);
      }
    }
  }

  private setAsStandardView(isStandard: boolean): void {
    if (this.subheaderConfig.viewInfoArray && this.subheaderConfig.viewInfoArray.length > 0) {
      let selectedView: ViewInfo = this.subheaderConfig.viewInfoArray.find((item: ViewInfo) => item.viewId == this.subheaderConfig.selectedDashboard.viewId);
      if (selectedView) {
        selectedView.isStandard = isStandard;
      }
    }
  }

  public refreshWidget() {
    this._commUtils.checkAllWidgetLoaded().then((_response: any) => {
      if (_response) {
        // Remove applied Filter
        this._dashboardCommService.appliedFilters = [];
        this.onChange(this.subheaderConfig.selectedDashboard, 0);
      }
    })
  }

  public addToDashoard(list) {
    switch (list.title) {
      case 'Widget':
        this.openReportGenerationPage();
        break;
      case 'Tab':
        this.loadDashboardTabs();
        break;
      case 'Section':
        break;

    }
  }

  loadDashboardTabs() {
    const dashboardTabsPopupConfig: any = {
      api: {
        doneClick: (value) => { this.onDashboardTabsPopupDone(value) },
        cancelClick: () => { this.onDashboardTabsPopupCancel(); },
      },
    };
    this.loadModule('dashboard-tabs-popup/dashboard-tabs-popup', dashboardTabsPopupConfig);
  }

  onDashboardTabsPopupDone(value) {
    if (value) {
      this._loaderService.showGlobalLoader();
      this.saveTabDetails(value);
      this.popupContainerRef.detach();
      this.popupContainerRef.clear();
    }
  }

  onDashboardTabsPopupCancel() {
    this.popupContainerRef.detach();
    this.popupContainerRef.clear();
  }

  //#region colorpalet  
  public getDefaultColorsForAllCharts() {
    this.manageUnsubscribeObservable$.add(
      this._dashboardService.getDefaultColorsForAllCharts().subscribe(response => {
        if (response != "error") {
          this._dashboardCommService.defaultColorsForAllCharts = response;
        }
      }));
  }
  //#endregion

  public saveTabDetails(value) {
    if (this._dashboardCommService.dashboardTabsList.length === 1 &&
      this._dashboardCommService.dashboardTabsList[0].title.toLowerCase() === DashboardConstants.DefaultTab) {
      let tab = this._dashboardCommService.dashboardTabsList[0];
      let tabDetail = { tabId: tab.tabId, tabName: value, tabSequence: tab.tabSequence }
      this.manageUnsubscribeObservable$.add(
        this._aCommMetaDataServ.updateTabsDetail([tabDetail], tab.viewId).subscribe(_response => {
          if (this._commUtils.isNune(_response) && _response.toLowerCase() != 'false') {
            this._dashboardCommService.dashboardTabsList[0].title = value;
            this._dashboardCommService.tabDashletInfo.lstTabDetails[0].tabName = value;
            this._commUtils.getToastMessage(tabDetail.tabName + " tab was created successfully.");
            this._dashboardCommService.setDashboardTabsList(this._dashboardCommService.dashboardTabsList);
            this._dashboardCommService.loadTabFilter();
            this._dashboardCommService.HasUserVisionEditActivity = this.subheaderConfig.HasUserVisionEditActivity;
          }
        })
      );
    }
    else {
      let sectionDetail: ISectionInfo = this._dashboardCommService.getNewSectionObject();
      let tabDetail: ITabDetail = this._dashboardCommService.getNewTabObject(value, sectionDetail);
      this.manageUnsubscribeObservable$.add(
        this._aCommMetaDataServ.saveTabDetails(tabDetail, this.subheaderConfig.selectedDashboard.viewId).subscribe(_response => {
          if (this._commUtils.isNune(_response) && _response.toLowerCase() === 'true') {
            this._dashboardCommService.dashboardTabsList.push(
              {
                "title": tabDetail.tabName,
                'isActive': false,
                isStriked: false,
                isEditable: false,
                tabId: tabDetail.tabId,
                sectionId: tabDetail.lstSectionInfo[0].sectionId,
                viewId: this.subheaderConfig.selectedDashboard.viewId,
                tabSequence: this._dashboardCommService.dashboardTabsList.length + 1
              }
            );
            this._commUtils.getToastMessage(tabDetail.tabName + " tab was created successfully.");
            this.pushTabDetailInTabDashletInfoArray(tabDetail);
            this._dashboardCommService.HasUserVisionEditActivity = this.subheaderConfig.HasUserVisionEditActivity;
            this._dashboardCommService.showMoveToOption = true;
            this._dashboardCommService.updateKebabMenuOption();
            this._dashboardCommService.setDashboardTabsList(this._dashboardCommService.dashboardTabsList);
          }
          else {
            this._commUtils.getToastMessage("Error Occured. Please try again");
          }
        })
      );
    }
  }


  private checkIfTabInfoPresent(viewIndexToShow) {
    let lastView = this.subheaderConfig.viewInfoArray[viewIndexToShow];
    let lastTabId = filter(lastView.lstTabInfo, (_tabInfo) => { return _tabInfo.tabSequence === 1 })[0].tabId;
    let lastSectionId = filter(lastView.lstTabInfo, (_tabInfo) => { return _tabInfo.tabSequence === 1 })[0].sectionId;
    let _dashboardPersistanceData = this._dashboardCommService.dashboardPersistenceData[lastView.viewId];
    _dashboardPersistanceData = this._commUtils.isNune(_dashboardPersistanceData) ? _dashboardPersistanceData : {};
    this._dashboardCommService.dashboardPersistenceData[lastView.viewId] = {};
    this._dashboardCommService.dashboardPersistenceData[lastView.viewId][lastTabId] = {};
    this._dashboardCommService.dashboardPersistenceData[lastView.viewId][lastTabId][lastSectionId] = _dashboardPersistanceData;
    this._dashboardCommService.dashboardPersistenceData[lastView.viewId]['lastTabId'] = lastTabId;
    this._dashboardCommService.dashboardPersistenceData[lastView.viewId]['lastSectionId'] = lastSectionId;
    return this._dashboardService.setDashboardPersistenceJson(
      this._appConstants.userPreferences.UserBasicDetails.ContactCode,
      DashboardConstants.dashboardDocumentType,
      this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
      JSON.stringify(this._dashboardCommService.dashboardPersistenceData)
    )
  }

  private pushTabDetailInTabDashletInfoArray(tabDetail: any) {
    let _tabDetail = new TabDetail();
    _tabDetail.isDeleted = false;
    _tabDetail.tabId = tabDetail.tabId;
    _tabDetail.tabName = tabDetail.tabName;
    _tabDetail.tabSequence = tabDetail.tabSequence;
    _tabDetail.lstSectionInfo = tabDetail.lstSectionInfo;
    _tabDetail.lstSectionInfo[0].lstDashletInfo = [];
    this._dashboardCommService.tabDashletInfo.lstTabDetails.push(tabDetail);
  }

  private mapLstTabInfo(lstTabInfo) {
    let _lstTabInfo = [];
    map(lstTabInfo, (_tab) => {
      _lstTabInfo.push({
        tabId: _tab.TabId,
        tabSequence: _tab.TabSequence,
        tabName: _tab.TabName,
        isDeleted: _tab.IsDeleted,
        maxCountReachedForPinning: _tab.maxCountReachedForPinning,
        dashletCount: _tab.dashletCount,
        //Chagne this when implementing multiple sections for each tab.
        sectionId: _tab.LstSectionInfo[0].SectionId
      });
    });
    return _lstTabInfo;
  }
  private globalSliderApplyUpdateFilterTabInfo() {
    let thisRef = this
    this.manageUnsubscribeObservable$.add(
      this._dashboardCommService.globalSliderApplyFilterTabUpdate$.subscribe((data) => {
        if (thisRef._commUtils.isNune(thisRef.subheaderConfig.filterTabList)) {
          let globalSliderFilterRO = thisRef.subheaderConfig.filterTabList
            .find(x => x.ReportObjectId == data.ReportObjectId);
          if (!this._commUtils.isNune(globalSliderFilterRO) || data.isTabFilter) {
            const index = thisRef._dashboardCommService.tabDashletInfo.lstTabDetails.findIndex(x => x.tabId == this._dashboardCommService.selectedTab.tabId);
            globalSliderFilterRO = thisRef._dashboardCommService.tabDashletInfo.lstTabDetails[index].filterTabList.find(x => x.ReportObjectId == data.ReportObjectId);
          }
          globalSliderFilterRO.FilterConditionRangeValue.from = thisRef._commUtils.isNune(data.FilterConditionRangeValue.from) ? data.FilterConditionRangeValue.from : '';
          globalSliderFilterRO.FilterConditionRangeValue.to = thisRef._commUtils.isNune(data.FilterConditionRangeValue.to) ? data.FilterConditionRangeValue.to : '';
        }
      })
    )
  }
}
