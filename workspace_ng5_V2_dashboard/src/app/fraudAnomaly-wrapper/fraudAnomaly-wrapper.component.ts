import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, OnDestroy } from "@angular/core";
import { ICardSubscription } from "smart-cards-shared";
import { AppConstants } from "smart-platform-services";
import { dashboardISection } from "@vsDashboardInterface";
import { DashboardService } from "@vsDashboardService/dashboard.service";
import { DashboardCommService } from "@vsDashboardCommService";
import { DashletInfo } from "@vsDashletModels/dashlet-info.model";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardConstants } from "@vsDashboardConstants";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { INextDateModel, IReportingObjectMultiDataSource, ICrossSuiteFilterMapping, IRelationObjectMapping, IFilterConditionMetadata, IRollingDateModel, IDateModel, IRollingYearsModel, INextYearsModel, IBeginningOfTheYear, IYearDropdown, ISubheaderConfig, IDataSourceByContactCodeInfo, IReportObject } from "@vsCommonInterface";
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { Subscription } from 'rxjs';
import { filter, each, uniq, findIndex } from 'lodash';
import { ViewInfo } from "@vsViewFilterModels/view-info.model";
import { GlobalFilterService } from "@vsGlobalFilterService";
import { OpportunityFinderService } from "../../shared/services/opportunityFinder-service/opportunityFinder.service";
import { StaticModuleLoaderService } from "smart-module-loader";
import { OppFinderGridComponent } from '../oppfinder-grid/oppfinder-grid.component';
import { TabDetail } from "@vsDashletModels/tab-detail-model";
// import { visionModulesManifest, LazyComponentConfiguration } from "../../../modules-manifest";
import { Title } from "@angular/platform-browser";
import { productName } from "../../configuration/productConfig";
import { LoaderService } from "@vsLoaderService";
import { stringify } from "querystring";
import { TabDashletInfo } from "@vsDashletModels/tab-dashlet-info-model";

@Component({
  selector: "fraudAnomaly-wrapper",
  templateUrl: "./fraudAnomaly-wrapper.component.html",
  styleUrls: ["./fraudAnomaly-wrapper.component.scss"],
  preserveWhitespaces: false
})
export class FraudAnomalyWrapperComponent implements OnInit, OnDestroy {

  //#region <======== Fraud and Anomaly Wrapper Component Variable Declarations ========>
  panelOpenState: boolean;
  sections: dashboardISection[];
  sub: ICardSubscription = {} as ICardSubscription;
  gridconfig: any;
  subheaderConfig: ISubheaderConfig = {
    HasUserVisionEditActivity: false,
    showDashboardOnEmptyWidget: false
  };
  ViewId: string;
  showOppContainer :boolean = true;
  cardTypeOpportunity: boolean;
  manageUnsubscribeObservable$: Subscription = new Subscription();
  dashletInfoArray: any = [];
  filterChipData: Array<IReportingObjectMultiDataSource> = [];
  dataSourceByContactCodeInfo: Array<IDataSourceByContactCodeInfo> = [];
  tabDashletInfo: TabDashletInfo
  //#endregion

  //#region <========= Dashboard Grid Wrapper Component Decorator Declarations========>
  @ViewChild('gridContainer', { read: ViewContainerRef }) gridContainerRef: ViewContainerRef;
  @ViewChild('oppFinderViewContainer', { read: ViewContainerRef }) oppFinderViewContainerRef: ViewContainerRef;
  @ViewChild("outletTemplate") outletTemplateRef: TemplateRef<any>;
  @ViewChild('gridTemplate') gridTemplateRef: TemplateRef<any>;
  //#endregion

  constructor(
    private _staticLoader: StaticModuleLoaderService,
    private _dashboardService: DashboardService,
    private _oppFinderService: OpportunityFinderService,
    public _dashboardCommService: DashboardCommService,
    private _globalFilterService: GlobalFilterService,
    private _commUtils: CommonUtilitiesService,
    private _analyticsUtilsService: AnalyticsUtilsService,
    private _loaderService: LoaderService,
    private _title: Title,
    private _appConstants: AppConstants) {
  }

  ngOnInit() {
    this.setfraudAnomalyProductConfiguration();
    this.InitializeDashboardGridWrapper();
 
  }

  ngOnDestroy() {
    this.gridContainerRef.clear();
    if (this.manageUnsubscribeObservable$)
      this.manageUnsubscribeObservable$.unsubscribe();
  }

  // This method will load fraud and anomaly specific product configuration.
  private setfraudAnomalyProductConfiguration() {
    this._appConstants.userPreferences.moduleSettings = this._commUtils.getProductConfiguration(
      productName.fraudAnomalyProduct
    );
    this._title.setTitle(this._appConstants.userPreferences.moduleSettings.productTitle)
  }

  // This method will load the standard view created for FRaud anomaly on basis of anomaly type from Master table 
  private loadview() {
    switch (this._dashboardCommService.fraudAnomalyState.strategy.shortName) {
      case DashboardConstants.FraudAnomalyConstants.Strategies.HCN.shortName: {
        this.cardTypeOpportunity = true;
        this.gridContainerRef.createEmbeddedView(this.gridTemplateRef, {
          $implicit:
          {
            config: this.sections,
            listofDistinctWidgetDataSource: this._dashboardCommService.listofDistinctWidgetDataSource,
            listAllReportObjectWithMultiDatasource: this._dashboardCommService.listAllReportObjectWithMultiDatasource
          }
        });
        break;
      }
      
    }
  }

  private InitializeDashboardGridWrapper() {
    //Independent Service Calling
    this.getFilterConditionMetadata();
    this.getfraudAnomalyMasterData();
  }

  //This method will fetch the master data required for Fraud Anomaly on basis of anomaly type
  private getfraudAnomalyMasterData() {
    this._dashboardCommService.fraudAnomalyState.strategy = DashboardConstants.FraudAnomalyConstants.Strategies[this._commUtils.getUrlParam('strat')];   
    this._oppFinderService.getFraudAnomalyMasterData(this._dashboardCommService.fraudAnomalyState.strategy.name)
      .toPromise()
      .then((_response) => {
        this._dashboardCommService.fraudAnomalyMasterData = JSON.parse(_response);
      });
  }

 
  private getFilterConditionMetadata() {
    this._loaderService.showGlobalLoader();
    this._dashboardService.getFilterConditionMetadata()
      .toPromise()
      .then((_response) => {
        this._dashboardCommService.FilterConditionMetadata = _response as Array<IFilterConditionMetadata>;
        this._loaderService.hideGlobalLoader();

      }).catch((_error) => {
        this._loaderService.hideGlobalLoader();
        this.displayErrorMessage(_error);
      });
  }

  // Get sub header Info , will load the details on Sub header
  public getSubheaderCompInfo(event) {
    this.gridContainerRef.clear();
    this._loaderService.showGlobalLoader();
    if (this.manageUnsubscribeObservable$)
      this.manageUnsubscribeObservable$.unsubscribe();
    this.manageUnsubscribeObservable$ = new Subscription();
    this.dashletInfoArray = [];
    this.gridconfig = [];
    this.ViewId = event.selectedViewInfo.viewId;
    if (this.dataSourceByContactCodeInfo.length == 0) {
      this.
        _dashboardService
        .getAllDataSourcesByContactCode(false)
        .subscribe((response) => {
          this._loaderService.hideGlobalLoader();
          this.dataSourceByContactCodeInfo = response as Array<IDataSourceByContactCodeInfo>;
          this.getAllDashletInfoByViewIdData(event.selectedViewInfo);
        });
    }
    else {
      this.getAllDashletInfoByViewIdData(event.selectedViewInfo);
    }

    this._dashboardService.getAllDataSourceInfo().subscribe(response => {
      this._dashboardCommService.allDataSourceInfo = response as Array<IDataSourceByContactCodeInfo>;
    });
  }

  private getAllDashletInfoByViewIdData(selectedViewInfo: ViewInfo) {
    this._loaderService.showGlobalLoader();
    this.subheaderConfig.showDashboardOnEmptyWidget = true;
    this._dashboardService
      .getAllDashletInfoByViewIdData(selectedViewInfo.viewId)
      .toPromise()
      .then((_response: any) => {
        this.dashletInfoArray = [];
        //check if does not contain any valid widget
        if (_response.LstTabDetails.length >= 1) {
          let hasAnyValidWidget: any = _response.LstTabDetails[0].LstSectionInfo[0].LstDashletInfo;
          if (this._commUtils.isEmptyGuid(hasAnyValidWidget[0].ViewId)) {
             this._commUtils.getMessageDialog(
              DashboardConstants.UIMessageConstants.STRING_DASHBOARD_NOT_CONTAIN_ANY_VIEWS,
              (_response: any) => {
                this.subheaderConfig.showDashboardOnEmptyWidget = false;
                this._loaderService.hideGlobalLoader();
                return;
              },
              DashboardConstants.OpportunityFinderConstants.STRING_INFORM);
               
          }
          else {
            this.tabDashletInfo = new TabDashletInfo().jsonToObject(_response);
            this.tabDashletInfo.lstTabDetails[0].lstSectionInfo[0].lstDashletInfo.map((_dashletInfo)=>{
              this.dashletInfoArray.push(_dashletInfo);
            });
            this._dashboardCommService.tabDashletInfo = this.tabDashletInfo;
            each(this.tabDashletInfo.lstTabDetails, (_tab: TabDetail, _index: number) => {
              this._dashboardCommService.dashboardTabsList.push({
                title: _tab.tabName,
                tabId: _tab.tabId,
                isActive: true,
                isStriked: false,
                isEditable: false,
                sectionId: _tab.lstSectionInfo[0].sectionId,
                viewId: this.tabDashletInfo.viewId,
                tabSequence: _tab.tabSequence
              });
            });
            this._dashboardCommService.selectedTab = this._dashboardCommService.dashboardTabsList[0];
          }
        }

        this.gridconfig = [];
        this.gridconfig.viewId = selectedViewInfo.viewId;
        this.gridconfig.config = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartVisionGridConfig);
        this.gridconfig.subheaderConfig = this.subheaderConfig;
        if ($(window).width() > 1366) {
          this.gridconfig.config.layout.config.width = 6;
        } else if ($(window).width() <= 1366) {
          this.gridconfig.config.layout.config.width = 6;
        }
        this.dashletInfoArray.forEach((obj, index) => {

          //User Activity based Code Modification for Edit Vision Dashboard but not For Open Report.
          let dashletConfig =
          {
            title: obj.title,
            isDriveEnabled: false,
            driveConfig: {
              isDriver: false,
              isDriven: false,
              driveConfigDescription: '',

            },
            isAccessibleReport: true, //some(this.dataSourceByContactCodeInfo, { DataSourceObjectId: obj.reportDetails.dataSourceObjectId }),
            cardId: obj.reportDetailsId,
            cardTitle: this._commUtils.isNune(obj.title) ? obj.title : obj.reportDetails.lstReportObjectOnValue[0].reportObjectName,
            manifestId: 'DashboardCard',
            componentId: 'DashboardCard',
            classId: obj.reportDetailsId,
            widgetDataType: obj.widgetDataType,
            cardType: obj.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard ? DashboardConstants.WidgetDataType.SummaryCard : "widget-card",
            height: obj.additionalProperties.height,
            minWidth: obj.additionalProperties.minWidth,
            width: obj.additionalProperties.width,
            minHeight: obj.additionalProperties.minHeight,
            x: obj.additionalProperties.x,
            y: obj.additionalProperties.y,
            showEdit: obj.showEdit,
            reportDetailsId: obj.reportDetailsId,
            sliderFilterArray: [],
            breadCrumb: [],
            showSliderWidget: obj.showSliderWidget,
            showSliderLoader: true,
            isExpandedGraph: false,
            isRemoved: obj.isRemoved,
            isLinkReport: obj.isLinkReport,
            isOwn: obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode,
            rowIndex: 0,
            sort: {
              items: [],
              isActive:
                obj.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.column ||
                  obj.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.MultiAxisChart ||
                  obj.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.spline ||
                  obj.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.stColumn ? true : false,
              showSort: false,
              selectedIndex: 0,
              appliedSort: []
            },
            btnRangeApplyConfig: this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartButtonConfig),
            changeDetectionMutation: {},
            layoutItemConfig: {
              gridstackPosition: {

                x: obj.additionalProperties.x,
                y: obj.additionalProperties.y,
                width: obj.additionalProperties.width,
                height: obj.additionalProperties.height,
                minWidth: obj.additionalProperties.minWidth,
                minHeight: obj.additionalProperties.minHeight
              }
            },
            config: {},
            sliderConfig: [
            ],
            reportDetails: obj.reportDetails,
            type: AnalyticsCommonConstants.ReportViewType[obj.reportDetails.reportViewType],
            uiConfig: {
              showBreadCrumOption: true,
              showSortOption: true,
              showFilterOption: false,
              showFullScreenOption: true,
              showKebabMenusOption: false,
              showTitle: obj.additionalProperties.titleFlag,
              showPercentageSummaryCard: obj.additionalProperties.percentageFlagSummaryCard,
              iconType: obj.reportDetails.reportProperties ? obj.reportDetails.reportProperties.iconType : '',
              showCurrentlyViewing: this.setshowCurrentlyViewing(obj.reportDetails)

              //kebabMenuOptions: this.cardKebabMenuConfig(obj)
            },
            reportRequestKey: this._commUtils.generateReportRequestKey(obj.reportDetailsId, obj.addedBy),
            pageIndex: 1,
            isAutocomplete: true,
            autoCompleteConfig: {
              placeholder: "",
              type: "autocomplete",
              data: 'autocompleteModalData',
              fieldKey: 'selected',
              // localization-Key
              maxLength: 200,
              attributes: {
                disable: false,
                displayformat: '{name}',
                optionformat: '{name}',
                options: [],
                lookupConfig: {
                  showLookup: false,
                  filterKey: ['name'],
                  titleofmodel: "Select Student",
                  descKey: "name"
                }
              }
            },
      
            autocompleteModalData: { selected: { name: DashboardConstants.UIMessageConstants.STRING_SELECTSUPPLIER } },
            chartMinMax: []
           
          };

          dashletConfig.uiConfig.showKebabMenusOption = false;
          dashletConfig.uiConfig.showFullScreenOption = false;
          dashletConfig.uiConfig.showSortOption = false;
          dashletConfig.showSliderWidget = false;
          // let sliderFilterReportObjArray = obj.reportDetails.lstFilterReportObject.filter((item, index, array) => {
          //   return item.isSliderWidgetFilter &&
          //     item.filterCondition.condition == AnalyticsCommonConstants.ReportObjectOperators.Between &&
          //     item.reportObject.reportObjectType == AnalyticsCommonConstants.ReportObjectType.Metrics;
          // });

          let dashletInfoCloneObj = new DashletInfo();
          let jsonDashletConfig = JSON.stringify(dashletConfig);
          dashletInfoCloneObj = JSON.parse(jsonDashletConfig);
          //dashletConfig.isExpandedGraph = dashletConfig.isAccessibleReport ? dashletConfig.showSliderWidget && (dashletConfig.layoutItemConfig.gridstackPosition.width > 1) ? true : false : false;
          this.gridconfig.config.cards.push(dashletConfig);
          // if (sliderFilterReportObjArray != null && sliderFilterReportObjArray.length > 0 && dashletConfig.isAccessibleReport)
          //   this.getAllSliderFilterMinMAxValue(dashletInfoCloneObj, selectedViewInfo.viewId, sliderFilterReportObjArray);
        });
        this.sections = this.gridconfig;

        this.getDistinctDataSourceInAllWidget().then((_response: any) => {
          if (_response) {
            // Enabling persistence of global filters on oppfinder if already apllied on vision
            this._dashboardCommService.applySavedFilters(selectedViewInfo);
            if (this._dashboardCommService.globalSliderConfigArray.length) {
              this._dashboardCommService.globalSliderConfigArray.forEach((item) => {
                if (item.sliderFilterArray[0].enabledAsGlobalSlider) {
                  const index = findIndex(this.gridconfig.config.cards, { cardId: item.cardId });
                  if (index == -1) {
                    this.gridconfig.config.cards.push(item);
                  }
                }
              });
            }
            this._dashboardCommService.setAppliedFilterData({
              validatedTabs: this._dashboardCommService.appliedFilters,
              appliedFilterData: []
            });
            this.createFilterTabChipData(_response.filterList);
            this._dashboardCommService.fillFilterPanelList();
            this.loadview();
            this._loaderService.hideGlobalLoader();
          }
        });
      })
      .catch((_error) => {
        this.displayErrorMessage(_error);
      });
  }
  // Gets list of all datasource info 
  private getDistinctDataSourceInAllWidget() {
    return new Promise((resolve, reject) => {
      this._dashboardCommService.listofDistinctWidgetDataSource = [];
      this.subheaderConfig.filterTabList = [];
      this.filterChipData = [];
      let filtersList = Array<IReportingObjectMultiDataSource>();


      each(
        this.gridconfig.config.cards, (_value: any, _key: any) => {
          if (!_value.isRemoved) {
            this._dashboardCommService.listofDistinctWidgetDataSource.push(_value.reportDetails.dataSourceObjectId);
          }
        });

      this._dashboardCommService.listofDistinctWidgetDataSource = uniq(this._dashboardCommService.listofDistinctWidgetDataSource).sort();

      if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
        this._dashboardService.getReportObjectsForMultiDataSource(
          this._dashboardCommService.listofDistinctWidgetDataSource.join(',')
        ).toPromise()
          .then((_response: Array<IReportingObjectMultiDataSource>) => {

            this._dashboardCommService.listAllReportObjectWithMultiDatasource = _response as Array<IReportingObjectMultiDataSource>;
            each(_response, (_value: IReportingObjectMultiDataSource, _key: any) => {
              filtersList.push(AnalyticsUtilsService.createCrossSuiteFilterReportObject(_value, {
                CrossSuiteFilterMapping: undefined,
                IsCrossSuiteFilter: false
              }) as IReportingObjectMultiDataSource);
            });

            resolve({
              viewFilterType: DashboardConstants.ViewFilterType.SingleSource,
              filterList: filtersList
            });
          });
        this.subheaderConfig.dataSourceTypeTitle = DashboardConstants.ViewFilterType.SingleSource;
      } else if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {

        //Getting the All the Reporting Object for Crosssuite Mapped in Datasource.
        this._dashboardService.getReportObjectsForMultiDataSource(
          this._dashboardCommService.listofDistinctWidgetDataSource.join(','))
          .toPromise()
          .then((_response: Array<IReportingObjectMultiDataSource>) => {
            this._dashboardCommService.listAllReportObjectWithMultiDatasource = _response as Array<IReportingObjectMultiDataSource>;

            this._dashboardService.getCrossSuiteReportObjectsForMultiDataSource(
              this._dashboardCommService.listofDistinctWidgetDataSource.join(',')
            )
              .toPromise()
              .then((_response: Array<ICrossSuiteFilterMapping>) => {

                this._dashboardCommService.listAllCrossSuiteFilterMapping = _response as Array<ICrossSuiteFilterMapping>;
                if (this._commUtils.checkForCrossSuiteRelationMapping({
                  type: DashboardConstants.ViewFilterType.MultiSource,
                  array: this._dashboardCommService.listAllCrossSuiteFilterMapping
                })
                ) {
                  each(this._dashboardCommService.listAllCrossSuiteFilterMapping, (
                    _crossSuiteFilterValue: ICrossSuiteFilterMapping, _crossSuiteFilterKey: any) => {
                    let dataSourcePriority: Array<IRelationObjectMapping> = filter(
                      _crossSuiteFilterValue.RelationObjectMapping, (
                        _relMapValue: IRelationObjectMapping, _relMapKey: any) => {
                      return _relMapValue.DataSourcePriority == 1 // Getting the top priority DataSource Reporting Object
                    });


                    if (dataSourcePriority == undefined || dataSourcePriority.length == 0) {
                      dataSourcePriority.push(_crossSuiteFilterValue.RelationObjectMapping[0]);
                    }
                    else if (dataSourcePriority.length >= 2) {
                      //If user mapping consist of the Same Priority for the Filter Mapping.
                      dataSourcePriority = [];
                      dataSourcePriority.push(_crossSuiteFilterValue.RelationObjectMapping[0]);
                    }


                    //Filter Search Logic Implementation
                    let _reporObjectHook: Array<IReportingObjectMultiDataSource> = filter(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (
                      _allfilterROValue: IReportingObjectMultiDataSource, _allfilterROKey: any) => {
                      return _allfilterROValue.ReportObjectId === dataSourcePriority[0].ReportObjectId;
                    });
                    let appliedFilter: IReportingObjectMultiDataSource = filter(this._dashboardCommService.appliedFilters, { ReportObjectId: dataSourcePriority[0].ReportObjectId })[0] as IReportingObjectMultiDataSource;
                    if (appliedFilter) {
                      _reporObjectHook[0].IsSelected = true;
                      _reporObjectHook[0].inChip = true;
                      _reporObjectHook[0].selectedFilterList = appliedFilter.selectedFilterList;
                    }
                    filtersList.push(AnalyticsUtilsService.createCrossSuiteFilterReportObject(_reporObjectHook[0], {
                      CrossSuiteFilterMapping: _crossSuiteFilterValue,
                      IsCrossSuiteFilter: true,
                    }) as IReportingObjectMultiDataSource);
                  });
                }
                resolve({
                  viewFilterType: DashboardConstants.ViewFilterType.MultiSource,
                  filterList: filtersList
                });
              }).catch((_error) => {
                this.displayErrorMessage(_error);
              });
          }).catch((_error) => {
            this.displayErrorMessage(_error);
          });
        this.subheaderConfig.dataSourceTypeTitle = DashboardConstants.ViewFilterType.MultiSource;
      }
    });
    // this.data for '+( this._dashboardAppService.listofDistinctWidgetDataSource.length > 1 ? 'Single' :'Multi') +' Data Source';

  }

  //To create filter values in the the filterTabList
  private createFilterTabChipData(filtersList: Array<IReportingObjectMultiDataSource>) {
    each(this._dashboardCommService.appliedFilters, (_value, key) => {
      let _thatRef = this;
      let appliedSelectedFilter: IReportingObjectMultiDataSource = filter(filtersList, { ReportObjectId: _value.ReportObjectId })[0] as IReportingObjectMultiDataSource;
      appliedSelectedFilter.IsSelected = true;
      appliedSelectedFilter.inChip = true;
      appliedSelectedFilter.FilterBy = _value.FilterBy;
      if (appliedSelectedFilter.FilterType == DashboardConstants.FilterType.MultiSelect) {
        if (appliedSelectedFilter.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
          appliedSelectedFilter.selectedFilterList = _value.selectedFilterList;
          appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        }
        else if (appliedSelectedFilter.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
          appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
          appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
          appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
          appliedSelectedFilter.filterValueSet = true;
        }
      }
      else if (appliedSelectedFilter.FilterType == DashboardConstants.FilterType.Date) {
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
          appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
          appliedSelectedFilter.filterCdnSet = true;
          appliedSelectedFilter.FilterRadioOperator = _value.FilterRadioOperator;
          appliedSelectedFilter.FilterRadioOperator.field.title =
            filter(
              _thatRef._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => {
                return filterConfig.FilterConditionObjectId == _value.FilterRadioOperator.field.FilterConditionObjectId
              }
            )[0].Name;

          appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
          appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
          appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
          if (_value.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.Rolling_Days) {
            appliedSelectedFilter.RollingDateModel = {
              rollingDateValue: _value.FilterConditionValue
            } as IRollingDateModel;
          }
          else if (_value.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.Next_Days) {
            appliedSelectedFilter.NextDateModel = {
              nextDateValue: _value.FilterConditionValue
            } as INextDateModel
          }
          else if (_value.FilterRadioOperator.field.op === DashboardConstants.ReportObjectOperators.From_DateTillToday) {
            appliedSelectedFilter.DateRadioModel = {
              DateRadioValue: new Date(_value.FilterConditionValue as string),
            }
          }
        }
        else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
          appliedSelectedFilter.FilterRadioOperator = _value.FilterRadioOperator;
          appliedSelectedFilter.filterValueSet = true;
          appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
          appliedSelectedFilter.FilterConditionOperator.title = filter(_thatRef._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
          appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
          appliedSelectedFilter.FilterConditionRangeValue.from = _value.FilterConditionRangeValue.from
          appliedSelectedFilter.FilterConditionRangeValue.to = _value.FilterConditionRangeValue.to;
          appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
          appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
          if (_value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
            appliedSelectedFilter.FromDateModel = {
              FromDateValue: new Date(_value.FilterConditionRangeValue.from),
            }
            appliedSelectedFilter.ToDateModel = {
              ToDateValue: new Date(_value.FilterConditionRangeValue.to),
            }
          }
          else if (_value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is ||
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot ||
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before ||
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
            appliedSelectedFilter.DateModel = {
              DateValue: new Date(_value.FilterConditionValue),
            } as IDateModel;
          }
        }
      }
      else if (appliedSelectedFilter.FilterType === DashboardConstants.FilterType.Year) {
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        if (_value.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
          appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
          appliedSelectedFilter.filterCdnSet = true;
          appliedSelectedFilter.YearModel = _value.YearModel;
          appliedSelectedFilter.YearModel.field.title = filter(_thatRef._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.YearModel.field.FilterConditionObjectId })[0].Name;
          appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
          appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
          appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterBySelection;
          if (_value.YearModel.field.op === DashboardConstants.ReportObjectOperators.Rolling_Years) {
            appliedSelectedFilter.RollingYearsModel = {
              rollingYearValue: _value.FilterConditionValue,
            } as IRollingYearsModel;
          }
          else if (_value.YearModel.field.op === DashboardConstants.ReportObjectOperators.Next_Years) {
            appliedSelectedFilter.NextYearsModel = {
              nextYearValue: _value.FilterConditionValue,
            } as INextYearsModel
          }
          else if (_value.YearModel.field.op === DashboardConstants.ReportObjectOperators.From_YearTillToday) {
            appliedSelectedFilter.BeginningOfTheYear = {
              dataKey: 'op',
              displayKey: 'title',
              options: [],
              selectedOption: { title: _value.FilterConditionValue },
            } as IBeginningOfTheYear
          }
        }
        else if (_value.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
          appliedSelectedFilter.YearModel = _value.YearModel;
          appliedSelectedFilter.filterValueSet = true;
          appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
          appliedSelectedFilter.FilterConditionOperator.title = filter(_thatRef._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
          appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
          appliedSelectedFilter.FilterConditionRangeValue.from = _value.FromyearDropdown.selectedRangeOptions.from.title;
          appliedSelectedFilter.FilterConditionRangeValue.to = _value.ToyearDropdown.selectedRangeOptions.to.title;
          appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
          appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
          if (
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between ||
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
            appliedSelectedFilter.FromyearDropdown = {
              label: 'From',
              dataKey: 'op',
              displayKey: 'title',
              options: [],
              selectedRangeOptions: {
                from: { title: _value.FromyearDropdown.selectedRangeOptions.from.title }
              },
            }
            appliedSelectedFilter.ToyearDropdown = {
              label: 'From',
              dataKey: 'op',
              displayKey: 'title',
              options: [],
              selectedRangeOptions: {
                to: { title: _value.ToyearDropdown.selectedRangeOptions.to.title }
              },
            }
          }
          else if (
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before ||
            _value.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
            appliedSelectedFilter.yearDropdown = {
              dataKey: 'op',
              displayKey: 'title',
              options: [],
              selectedOption: { title: _value.FilterConditionValue },
            } as IYearDropdown;
          }
        }
      }
    });

    this.subheaderConfig.filterTabList = this._commUtils.getDeReferencedObject(filtersList.filter((item) => {
      const index = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: item.ReportObjectId })
      if (index != -1) {
        item.enabledAsGlobalSlider = this._dashboardCommService.appliedFilters[index].enabledAsGlobalSlider;
        item.globalSliderObject = this._dashboardCommService.appliedFilters[index].globalSliderObject;
      }
      if (item.isDefault === true) {
        return item;
      }
    }));

    this.filterChipData = this._commUtils.getDeReferencedObject(filtersList.filter((item) => {
      if (item.isDefault === true) {
        return item;
      }
    }));
    this.subheaderConfig.nonStandardFilterList = [];
    this._globalFilterService.setFilterReportingObjects(this.subheaderConfig.filterTabList);
  }

  private displayErrorMessage(error: Error) {
    console.log(error);
  }

  private setshowCurrentlyViewing(_reportDetails: any): boolean {
    return _reportDetails.reportViewType != 5 && _reportDetails.lstReportObjectOnRow.length > 0 || _reportDetails.lstReportObjectOnColumn.length > 0;
  }

}
