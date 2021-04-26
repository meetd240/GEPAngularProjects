import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, OnDestroy, Renderer2, ElementRef, NgZone } from "@angular/core";
import { ICardSubscription, IConfig } from "smart-cards-shared";
import { AppConstants } from "smart-platform-services";
import { dashboardISection } from "@vsDashboardInterface";
import { DashboardService } from "@vsDashboardService/dashboard.service";
import { DashboardCommService } from "@vsDashboardCommService";
import { DashletInfo } from "@vsDashletModels/dashlet-info.model";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardConstants } from "@vsDashboardConstants";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { INextDateModel, IReportingObjectMultiDataSource, ICrossSuiteFilterMapping, IRelationObjectMapping, IFilterConditionMetadata, IRollingDateModel, IDateModel, IRollingYearsModel, INextYearsModel, IBeginningOfTheYear, IYearDropdown, ISubheaderConfig, IDataSourceByContactCodeInfo, IReportObject, INextQuarterYearsModel, IRollingQuarterYearsModel, IPreviousQuarterYearsModel } from "@vsCommonInterface";
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { Subscription } from 'rxjs';
import { filter, find, each, uniq, maxBy, flatMap, some, every, findIndex, sortBy, difference, uniqBy, compact } from 'lodash';
import { SavedFilter } from "@vsMetaDataModels/saved-filter.model";
import { AnalyticsMapperService } from "@vsAnalyticsCommonService/analytics-mapper.service";
import { ReportSortingDetails } from "@vsMetaDataModels/report-sorting-details.model";
import { ReportObject } from "@vsMetaDataModels/report-object.model";
import { ViewInfo } from "@vsViewFilterModels/view-info.model";
import { GlobalFilterService } from "@vsGlobalFilterService";
import { ProductLevelActionNameConstants, productName } from 'configuration/productConfig';
import { ViewFilterDetails } from "@vsViewFilterModels/view-filter-details.model";
import { LoaderService } from "@vsLoaderService";
import { IConditionalFormattingFormula } from "@vsMetaDataModels/report-conditional-formatting.model";
import { TabDashletInfo } from "@vsDashletModels/tab-dashlet-info-model";
import { TabDetail } from "@vsDashletModels/tab-detail-model";
import { AnalyticsCommonMetadataService } from "@vsAnalyticsCommonService/analytics-common-metadata.service";
import { SectionInfo } from "@vsDashletModels/section-info-model";
declare var crossProductFilters: any;
declare var supplierScorecardConfig: any;

@Component({
  selector: "dashboard-grid-wrapper",
  templateUrl: "./dashboard-grid-wrapper.component.html",
  styleUrls: ["./dashboard-grid-wrapper.component.scss"],
  preserveWhitespaces: false
})
export class DashboardGridWrapperComponent implements OnInit, OnDestroy {

  //#region <======== Dashboard Grid Wrapper Component Variable Declarations ========>
  panelOpenState: boolean;
  sections: dashboardISection[];
  sub: ICardSubscription = {} as ICardSubscription;
  gridconfig: any;
  subheaderConfig: ISubheaderConfig = {
    HasUserVisionEditActivity: false,
    showDashboardOnEmptyWidget: false
  };
  ViewId: string;
  manageUnsubscribeObservable$: Subscription = new Subscription();
  manageUnsubscribeFilterObservable$: Subscription = new Subscription();
  dashletInfoArray: any = [];
  tabDashletInfo: TabDashletInfo;
  filterChipData: Array<IReportingObjectMultiDataSource> = [];
  dataSourceByContactCodeInfo: Array<IDataSourceByContactCodeInfo> = [];
  entireFilterTabList: Array<IReportingObjectMultiDataSource> = [];
  globalSliderConfigArray : Array<any> = new Array<any>();
  //#endregion

  //#region <========= Dashboard Grid Wrapper Component Decorator Declarations========>
  @ViewChild('gridContainer', { read: ViewContainerRef }) gridContainerRef: ViewContainerRef;
  @ViewChild('gridTemplate') gridTemplateRef: TemplateRef<any>;
  //#endregion

  constructor(
    private _renderer2: Renderer2,
    private _dashboardService: DashboardService,
    public _dashboardCommService: DashboardCommService,
    private _globalFilterService: GlobalFilterService,
    private _commUtils: CommonUtilitiesService,
    private _analyticsUtilsService: AnalyticsUtilsService,
    private _loaderService: LoaderService,
    public _appConstants: AppConstants,
    public _ngZone: NgZone,
    public _elementRef: ElementRef,
    public _analyticsMetaDataService: AnalyticsCommonMetadataService) {
  }

  ngOnInit() {
    this.subheaderConfig.HasUserVisionEditActivity = this._appConstants.userPreferences.AccessDetails.HasEditVisionDashboard;
    this.InitializeDashboardGridWrapper();
    const __handler = () => {
      // if (document.hidden) {
      each(this._commUtils._widgetCards, (value: any, key: any) => {
        if (value.componentId != DashboardConstants.GlobalSliderWidgetComponent && this._commUtils.getWidgetType(value.reportDetails.reportViewType) === DashboardConstants.WidgetDataType.Chart) {
          if (this._commUtils.isNune(value) && this._commUtils.isNune(value.config) && this._commUtils.isNune(value.config.chartAPI)) {
            setTimeout(() => { value.config.chartAPI.reflowChart(); }, 25);
          }
          // console.log('called');
        }
      });
      document.removeEventListener('visibilitychange', __handler, true);
    };
    this._ngZone.runOutsideAngular(() => {
      document.addEventListener('visibilitychange', __handler, true);
    });

  }

  ngOnDestroy() {
    this.gridContainerRef.clear();
    if (this.manageUnsubscribeObservable$)
      this.manageUnsubscribeObservable$.unsubscribe();
    if (this.manageUnsubscribeFilterObservable$)
      this.manageUnsubscribeFilterObservable$.unsubscribe();
    document.removeEventListener('visibilitychange', () => { }, true);
  }

  ngAfterViewInit() {
    //this.router.navigate(['', { outlets: { 'popup-outlet': ['popup'] } }], { relativeTo: this.route.root, skipLocationChange: true })
  }

  private InitializeDashboardGridWrapper() {
    //Independent Service Calling
    this.getFilterConditionMetadata();
    this.getConditionalFormattingFormulas();
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

  public getSubheaderCompInfo(event) {
    this.gridContainerRef.clear();
    this._loaderService.showGlobalLoader();
    if (this.manageUnsubscribeObservable$)
      this.manageUnsubscribeObservable$.unsubscribe();
    this.manageUnsubscribeObservable$ = new Subscription();
    this.dashletInfoArray = [];
    this.gridconfig = [];
    this.ViewId = event.selectedViewInfo.viewId;
    this._dashboardCommService.selectedViewInfo = event.selectedViewInfo;
    if (this.dataSourceByContactCodeInfo.length == 0) {
      this.
        _dashboardService
        .getAllDataSourcesByContactCode(false)
        .subscribe((response) => {
          this._loaderService.hideGlobalLoader();
          this.dataSourceByContactCodeInfo = response as Array<IDataSourceByContactCodeInfo>;
          this.getTabDashletInfoByViewId(event.selectedViewInfo, event.selectedTabId, event.selectedSectionId);
        });
    }
    else {
      this.getTabDashletInfoByViewId(event.selectedViewInfo, event.selectedTabId, event.selectedSectionId);
    }

    this._dashboardService.getAllDataSourceInfo().subscribe(response => {
      this._dashboardCommService.allDataSourceInfo = response as Array<IDataSourceByContactCodeInfo>;
    });
  }

  private getTabDashletInfoByViewId(selectedViewInfo: ViewInfo, selectedTabId: string = '', selectedSectionId: string = '') {
    this._loaderService.showGlobalLoader();
    this.subheaderConfig.showDashboardOnEmptyWidget = true;
    this._dashboardService
      .getAllDashletInfoByViewIdData(selectedViewInfo.viewId)
      .toPromise()
      .then((_response: any) => {
        this._analyticsMetaDataService.getTabSavedFilterByTabId(selectedViewInfo.viewId).toPromise().then((_lstTabFilterResponse: any) => {
          this.dashletInfoArray = [];
          let currentSelectedTab: any = {};
          let currentSelectedSection: any = {};
          this._dashboardCommService.dashboardTabsList = [];
          //this.checkIfNoWidgetTabPresent(selectedViewInfo, _response);
          if (this._commUtils.isNune(_response) && _response.LstTabDetails.length === 0) {
            this.noWigetsForGivenTab();
          }
          //If no persistance data is not present. We will select the Tab who has the sequence number as 1 as selectedTabId        
          //check if does not contain any valid widget
          else {
            each(_response.LstTabDetails, (_tab: any) => {
              _tab.LstTabFilter = _lstTabFilterResponse.filter(x => { return x.TabId === _tab.TabId });
            })
            if (this._commUtils.isNune(_response)) {
              if (!this._commUtils.isNune(selectedTabId)) {
                currentSelectedTab = filter(_response.LstTabDetails, _tab => {
                  return _tab.TabSequence === 1
                })[0];
                selectedTabId = currentSelectedTab.TabId;
              }
              else {
                currentSelectedTab = filter(_response.LstTabDetails, _tab => {
                  return _tab.TabId === selectedTabId;
                })[0];
              }
              if (!this._commUtils.isNune(selectedSectionId)) {
                currentSelectedSection = currentSelectedTab.LstSectionInfo[0];
                selectedSectionId = currentSelectedSection.SectionId;
              }
              else {
                currentSelectedSection = filter(currentSelectedTab.LstSectionInfo, _section => {
                  return _section.SectionId === selectedSectionId
                })[0];
              }
              if (!this._commUtils.isNuneArray([currentSelectedTab, currentSelectedSection])) {
                this.noWigetsForGivenTab();
              }
              else if (!currentSelectedSection.LstDashletInfo.length) {
                this.noWigetsForGivenTab();
                this.tabDashletInfo = new TabDashletInfo().jsonToObject(_response);
                this.setSortingObjectForEachWidget();
                this._dashboardCommService.tabDashletInfo = this.tabDashletInfo;
                this.intializeTabComponent(selectedTabId);
                this.noWigetsForGivenTab('Tabs');
              }
              // else if (!currentSelectedSection.LstDashletInfo.length) {
              //   this.tabDashletInfo = new TabDashletInfo().jsonToObject(_response);
              //   this.intializeTabComponent(selectedTabId);
              //   this.noWigetsForGivenTab('Tabs');
              // }
              else {
                this.tabDashletInfo = new TabDashletInfo().jsonToObject(_response);
                this.setSortingObjectForEachWidget();
                this._dashboardCommService.tabDashletInfo = this.tabDashletInfo;
                this.intializeTabComponent(selectedTabId);
              }
            }
          }
          this.generateGraphConfigForTheGivenDashletInfo(selectedViewInfo, { tabId: selectedTabId, sectionId: selectedSectionId }, true, true);
        })
      })
      .catch((_error) => {
        this.displayErrorMessage(_error);
      });
  }




  //After SaveAs the method will call to set persistance for newly created widgets
  private getPersistanceDataForSaveAs(dashletConfig, selectedViewInfo, sections, tabId, sectionId) {
    if ((dashletConfig.widgetDataType == 'olap' || dashletConfig.widgetDataType == 'flex') && sections != undefined) {
      let displayNameForNewWidget, displayNameForOldWidget;
      for (var i = 0; i < this.sections["config"].cards.length; i++) {
        let oldlstReportObject = this._commUtils.getCombineColumnValueRowRO(this.sections["config"].cards[i].reportDetails);
        oldlstReportObject.forEach(displayName => {
          displayNameForOldWidget = displayName;

          let newReportObj = this._commUtils.getCombineColumnValueRowRO(dashletConfig.reportDetails);
          newReportObj.forEach(displayName => {
            displayNameForNewWidget = displayName;

            this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId] =
              this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId]) ? this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId] : {};
            this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId][sectionId] =
              this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId][sectionId]) ? this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId][sectionId] : {};

            if (displayNameForOldWidget.displayName == displayNameForNewWidget.displayName && displayNameForOldWidget.sequenceNumber == displayNameForNewWidget.sequenceNumber && this.sections["config"].cards[i].cardTitle == dashletConfig.cardTitle) {
              if (
                selectedViewInfo.isOwn &&
                this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[this.sections["viewId"]])&&
                this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[this.sections["viewId"]][this._dashboardCommService.previousSelectedTab.tabId])&&
                this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[this.sections["viewId"]][this._dashboardCommService.previousSelectedTab.tabId][this._dashboardCommService.previousSelectedTab.sectionId])
              ) {
                this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId][sectionId][dashletConfig.reportDetailsId] = this._dashboardCommService.dashboardPersistenceData[this.sections["viewId"]][this._dashboardCommService.previousSelectedTab.tabId][this._dashboardCommService.previousSelectedTab.sectionId][this.sections["config"].cards[i].reportDetails.reportDetailObjectId]
              }
              else {
                this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][tabId][sectionId][dashletConfig.reportDetailsId][displayNameForOldWidget.reportObjectId] = { "columnWidth": displayNameForOldWidget.reportObjectWidth }
              }
            }
          })
        })
      }
    }
  }

  private modifyCrossProductFilters(_appFilVal: any, _appFilKey: number): boolean {
    for (let i = 0; i < _appFilVal.crossSuiteRelationMapping.length; i++) {
      if (this._dashboardCommService.listofDistinctWidgetDataSource[0] === _appFilVal.crossSuiteRelationMapping[i].DataSourceObjectId) {
        _appFilVal.ReportObjectID = _appFilVal.crossSuiteRelationMapping[i].ReportObjectId;
        _appFilVal.dataSourceObjectId = _appFilVal.crossSuiteRelationMapping[i].DataSourceObjectId;
        _appFilVal.ISMultiSource = DashboardConstants.ViewFilterType.SingleSource;
        return true;
      }
      else {
        return false;
      }
    }
  }


  private fetchCrossProductDashboardFilters(crossProductFilters, _response, selectedViewInfo, initializeGrid, isOpenView = false) {
    return new Promise((resolve, reject)=>{
    const thisRef = this;
    this._dashboardService.fetchCrossProductFilters(crossProductFilters)
      .toPromise()
      .then((_data) => {
        selectedViewInfo.lstDashboardFilters = [];
        if (_data && _data.length > 0) {
          selectedViewInfo.lstDashboardFilters = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(
            [], _data, new ViewFilterDetails);
        }
        //Since we are only using Filter By Selection in Cross Product Filter we are not setting the FilterConditionText here.
        /*
        each(selectedViewInfo.lstDashboardFilters, (_filterValue: any) => {
          let _index = findIndex(crossProductFilters, { ReportObjectID: _filterValue.reportObject.reportObjectId });
          _filterValue.FilterConditionText = crossProductFilters[_index].FilterConditionText;
        });
        */
        this.DistinctDataSourceInAllWidget(_response, selectedViewInfo, initializeGrid, isOpenView);
        resolve(true);
        // making the Save View Option off becasue User can not Save the View in case of carry over filter.
        this._commUtils.getToastMessage(`The Carry Over filters from ${crossProductFilters[0].ViewName} View 
        have been applied successfully !`);

        if (crossProductFilters.length > 0
          && this._appConstants.userPreferences.moduleSettings.enableCarryOverFilterOption) {
          setTimeout(() => thisRef._dashboardCommService.disableSaveWhenCrossProductFilter(thisRef._renderer2), 300);
        }
      }).catch((_error) => {
        this.displayErrorMessage(_error);
        resolve(_error);
      });
      });
  }

  private DistinctDataSourceInAllWidget(_response, selectedViewInfo, isInitializeWidget: boolean = true, isOpenView: boolean = false) {
    this._dashboardCommService.applySavedFilters(selectedViewInfo, isInitializeWidget);
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
     this.manageUnsubscribeFilterObservable$.add(
        this._dashboardCommService.setAppliedFilterData(
          {
            validatedTabs: this._dashboardCommService.appliedFilters,
            validatedFilterForTabs: filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0].lstAppliedTabFilters,
            appliedFilterData: [],
            createSlicerComponent: true,
            componentToCreate: DashboardConstants.Component.SlicerComponent,
            isOpenView: true,
            isInitializeWidget: isInitializeWidget,
          }
     ));
    this.createFilterTabChipData(_response.filterList);
    this._dashboardCommService.fillFilterPanelList();
    if (isInitializeWidget) {
      this.gridContainerRef.createEmbeddedView(this.gridTemplateRef, {
        $implicit:
        {
          config: this.sections,
          listofDistinctWidgetDataSource: this._dashboardCommService.listofDistinctWidgetDataSource,
          listAllReportObjectWithMultiDatasource: this._dashboardCommService.listAllReportObjectWithMultiDatasource
        }
      });
    }
    this._commUtils.hideLoader();
  }

  /**
    //Get configuration for each dashlet based onn view Id.
    */
  private getAllSliderFilterMinMAxValue(currentDashletConfig: DashletInfo, currentViewId: string, sliderFilterReportObj: Array<SavedFilter>) {
    // currentDashletConfig.showSliderWidget = true;
    let that = this;
    this._loaderService.showSliderLoader(currentDashletConfig.reportDetailsId);
    currentDashletConfig.reportDetails.isGrandTotalRequired = false;
    currentDashletConfig.reportDetails.isSubTotalRequired = false;
    currentDashletConfig.reportDetails.isLazyLoadingRequired = false;
    currentDashletConfig.reportDetails.lstReportObjectOnValue = new Array<ReportObject>();
    //currentDashletConfig.reportDetails.lstFilterReportObject = new Array<SavedFilter>();
    currentDashletConfig.reportDetails.lstReportSortingDetails = new Array<ReportSortingDetails>();

    currentDashletConfig.reportDetails.lstReportObjectOnColumn.forEach(reporObjOnColumn => {
      // Considering it as a Flat Grid and fetching out Min Max Value.
      reporObjOnColumn.layoutArea = AnalyticsCommonConstants.ReportObjectLayoutArea.Rows;
    })

    //TODO : Not Supporting Slider Filter on Drill
    currentDashletConfig.reportDetails.lstReportObjectOnColumn.length =
      currentDashletConfig.reportDetails.lstReportObjectOnColumn.length > 0 ? 1 : 0;
    // If Saved Drill down is present, change the row object to drilled level
    if (filter(currentDashletConfig.reportDetails.lstFilterReportObject, function (filter) {
      return filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DrillFilter;
    }).length) {
      let lstReportObjectOnRow = [];
      lstReportObjectOnRow.push(currentDashletConfig.reportDetails.lstReportObjectOnRow[
        filter(currentDashletConfig.reportDetails.lstFilterReportObject, function (filter) {
          return filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DrillFilter;
        }).length
      ]);
      currentDashletConfig.reportDetails.lstReportObjectOnRow = lstReportObjectOnRow;
    }
    else {
      currentDashletConfig.reportDetails.lstReportObjectOnRow.length =
        currentDashletConfig.reportDetails.lstReportObjectOnRow.length > 0 ? 1 : 0;
    }

    //Fill Filter list for Min/Max: Excluding between filter
    var filterListWithoutBetween = new Array<SavedFilter>();
    currentDashletConfig.reportDetails.lstFilterReportObject.forEach(repoFilterObj => {
      // To exclude the Drill Level filter from the filterListWithoutBetween
      if (!repoFilterObj.isSliderWidgetFilter && repoFilterObj.filterCondition.condition != AnalyticsCommonConstants.ReportObjectOperators.Between) {
        filterListWithoutBetween.push(repoFilterObj);
      }
    });
    currentDashletConfig.reportDetails.lstFilterReportObject = filterListWithoutBetween;

    // Fill Slider Filder's Report Object in Sort-list and in Value-List.
    sliderFilterReportObj.forEach(savedFilter => {
      //As Measure is only applicable for Slider Filter setting Layout Area to Value.
      savedFilter.reportObject.layoutArea = AnalyticsCommonConstants.ReportObjectLayoutArea.Values;
      let reportSortingDetails = new ReportSortingDetails();
      reportSortingDetails.reportObject = savedFilter.reportObject;
      reportSortingDetails.sortType = AnalyticsCommonConstants.SortType.Asc;
      currentDashletConfig.reportDetails.lstReportSortingDetails.push(reportSortingDetails);
      currentDashletConfig.reportDetails.lstReportObjectOnValue.push(savedFilter.reportObject);
    });

    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(currentDashletConfig.reportDetails);
    let widget: any = find(that.gridconfig.config.cards, { cardId: currentDashletConfig.reportDetailsId });
    this.manageUnsubscribeObservable$.add(
      this._analyticsUtilsService.getAllSliderFilterMinMaxValue(reportDetailsData, widget, currentDashletConfig, sliderFilterReportObj)
        .subscribe((_response) => {
          widget.showSliderLoader = false;
          this._loaderService.hideSliderLoader(currentDashletConfig.reportDetailsId);
        })
    );
    // currentDashletConfig.showSliderWidget = false;
  }

  private GetCardType(reportViewType: any) {
    if (reportViewType === AnalyticsCommonConstants.ReportViewType.SummaryCard)
      return DashboardConstants.WidgetDataType.SummaryCard
    else if (reportViewType === AnalyticsCommonConstants.ReportViewType.GaugeChart)
      return DashboardConstants.WidgetDataType.GuageChart
    else return DashboardConstants.WidgetDataType.WidgetCard
  }

  private GetChartDefaultColors(reportViewType: any) {

    const chartColorConfig: any = find(this._dashboardCommService.defaultColorsForAllCharts, { ChartType: reportViewType });
    if (chartColorConfig != undefined && chartColorConfig.DefaultColorSet != '')
      return JSON.parse(chartColorConfig.DefaultColorSet);

  }

  private getDistinctDataSourceInAllWidget() {
    return new Promise((resolve, reject) => {
      this._dashboardCommService.listofDistinctWidgetDataSource = [];
      this.subheaderConfig.filterTabList = [];
      this.filterChipData = [];
      let filtersList = Array<IReportingObjectMultiDataSource>();
      this._dashboardCommService.updateListDistinctDataSourceWhenCardOrTabRemoved();

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
              }, this.subheaderConfig.selectedDashboard.datasourceType) as IReportingObjectMultiDataSource);
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
                // To map the property in and only add the RelationObjectMapping to the list.
                this._dashboardCommService.listAllCrossSuiteFilterMapping.forEach((_object: any, _index: number) => {
                  each(_object.RelationObjectMapping, (_obj: any, _index: number) => {
                    this._dashboardCommService.relationShipObjectList.push(_obj);
                  })
                });
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
                    }, this.subheaderConfig.selectedDashboard.datasourceType) as IReportingObjectMultiDataSource);
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
    let _globalFilterList = this._commUtils.getDeReferencedObject(filtersList);
    let _tabFilterList = this._commUtils.getDeReferencedObject(filtersList);
    each(this._dashboardCommService.appliedFilters, (_value, key) => {
      this.createFilterTab(_value, _globalFilterList);
    });

    this.subheaderConfig.filterTabList = this._commUtils.getDeReferencedObject(_globalFilterList.filter((item) => {
      const index = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: item.ReportObjectId })
      if (index != -1) {
        item.enabledAsGlobalSlider = this._dashboardCommService.appliedFilters[index].enabledAsGlobalSlider;
        item.globalSliderObject = this._dashboardCommService.appliedFilters[index].globalSliderObject;
      }
      if (item.isDefault === true) {
        return item;
      }
    }));
    //Here we will go one tab at a time and map the filter applied on that tab.
    each(this.tabDashletInfo.lstTabDetails, (_tab: TabDetail) => {
      _tab.filterTabList = [];
      each(_tab.lstAppliedTabFilters, (_filter: any) => {
        this.createFilterTab(_filter, _tabFilterList);
        _filter.isTabFilter = true;
      })
      let lstDataSourceObjectId = this._dashboardCommService.getDataSourceListForGivenTab(_tab);
      each(_tabFilterList, (_filterObject) => {
        if (lstDataSourceObjectId.indexOf(_filterObject.DataSource_ObjectId) != -1) {
          if (_tab.lstAppliedTabFilters.length) {
            const indexTabFilter = findIndex(_tab.lstAppliedTabFilters, { ReportObjectId: _filterObject.ReportObjectId });
            if (indexTabFilter != -1)
            {
              _filterObject.enabledAsGlobalSlider = _tab.lstAppliedTabFilters[indexTabFilter].enabledAsGlobalSlider;
              _filterObject.globalSliderObject = _tab.lstAppliedTabFilters[indexTabFilter].globalSliderObject;
            }
          }
          _tab.filterTabList.push({ ..._filterObject });
        }
      })
      //No once we have set the filterList for one tab we reset the TabfilterList to original state and do the complete process again.
      _tabFilterList = this._commUtils.getDeReferencedObject(filtersList);
    });

    this.filterChipData = this._commUtils.getDeReferencedObject(_globalFilterList.filter((item) => {
      if (item.isDefault === true) {
        return item;
      }
    }));
    this.entireFilterTabList = this._commUtils.getDeReferencedObject(this.subheaderConfig.filterTabList);
    if (!this._commUtils.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
      this.subheaderConfig.filterTabList =
        filter(this.entireFilterTabList, { IsStandardFilterRO: true }).length > 0 ?
          filter(this.entireFilterTabList, { IsStandardFilterRO: true }) :
          this.entireFilterTabList;
      //If we have the carry over filters applied to this view and also favourite filters on this datasource, then we will push all the
      // filter report objects of the lstDashboardFilter in the global filter list irrespective of it being cross product or not.
      if (
        this.subheaderConfig.selectedDashboard.lstDashboardFilters.length > 0 &&
        filter(this.entireFilterTabList, { IsStandardFilterRO: true }).length > 0
      ) {
        this.subheaderConfig.selectedDashboard.lstDashboardFilters.forEach(item => {
          //Here we will only push those filters which are not slicerFilter.
          if (item.FilterIdentifier != DashboardConstants.FilterIdentifierType.SlicerFilter) {
            this.subheaderConfig.filterTabList.push(filter(this.entireFilterTabList, { ReportObjectId: item.reportObject.reportObjectId })[0]);
          }
          else {
            //We will update the filterIdentifier type of the reporObject to slicer.
            this.entireFilterTabList[findIndex(this.entireFilterTabList, { ReportObjectId: item.reportObject.reportObjectId })].FilterIdentifier = DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource;
          }
        });
      }
      this.subheaderConfig.filterTabList = uniqBy(this.subheaderConfig.filterTabList, 'ReportObjectId');

    }
    this.subheaderConfig.nonStandardFilterList = this._commUtils.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource) ? [] : difference(this.entireFilterTabList, this.subheaderConfig.filterTabList);

    this._globalFilterService.setFilterReportingObjects(this.subheaderConfig.filterTabList);
  }

  private displayErrorMessage(error: Error) {
    console.log(error);
  }

  public removeCard(cardId) {
    this._dashboardService.deleteDashletByReportDetailObjectIdViewId(cardId, this.ViewId)
      .toPromise()
      .then((_response: any) => {
        if (_response && _response != "error") {
          let card = find(this.gridconfig.config.cards, (x: any) => {
            return x.reportDetailsId == cardId
          });
          let _removedDashlet = filter(
            filter
              (this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0].
              lstSectionInfo[0].lstDashletInfo,
            { reportDetailsId: cardId })[0];
          _removedDashlet.isRemoved = true;
          card.isRemoved = true;

          let messageText: string = "Widget : '" + card.title + "' has been removed from VIEW : '" + this.subheaderConfig.selectedDashboard.viewName + "'";
          //Removing the deleted widget from the tabDashletInfo object as well;
          let lstDashletInfoForSelectedTab = filter(this.tabDashletInfo.lstTabDetails, { tabId: this._dashboardCommService.selectedTab.tabId })[0].lstSectionInfo[0].lstDashletInfo;
          let cardIndex = findIndex(lstDashletInfoForSelectedTab, { reportDetailsId: cardId });
          if (cardIndex != -1) {
            lstDashletInfoForSelectedTab.splice(cardIndex, 1);
          }
          this._commUtils.getToastMessage(messageText);
          // that.dashletInfoArray.splice(index, 1);
          // this.config.splice(index, 1);
          if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {
            this._dashboardCommService.triggerSaveDashboard();
            this.getDistinctDataSourceInAllWidget().then((_response: any) => {
              this.createFilterTabChipData(_response.filterList);
            });
          }
          else {
            if (this.gridconfig.config.cards.length > 0 && every(this.gridconfig.config.cards, ['isRemoved', true])) {
              this.subheaderConfig.selectedDashboard.lstDashboardFilters = [];
              // this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty = [];
              this._dashboardCommService.appliedFilters = [];
              this._dashboardCommService.listofDistinctWidgetDataSource = [];
              this._dashboardCommService.updateListDistinctDataSourceWhenCardOrTabRemoved();
              this._dashboardCommService.triggerSaveDashboard();
            }
          }
          //Updating the datasource object id in elastic search when a pinned report is removed
          if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
            const updateIngestionObject: any = {
            };
            if (!this._dashboardCommService.listofDistinctWidgetDataSource.length) {
              updateIngestionObject["DataSourceObjectId"] = [AnalyticsCommonConstants.EmptyGuid];
            }
            else {
              updateIngestionObject["DataSourceObjectId"] = this._dashboardCommService.listofDistinctWidgetDataSource;
            }
            this.manageUnsubscribeObservable$.add(
              this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
            );
          }
          //After removing wigdet from view reducing dashletcount by 1 and setting maxCountReachedForPinning property to false
          --this.subheaderConfig.selectedDashboard.dashletCount;
          this.subheaderConfig.selectedDashboard.maxCountReachedForPinning = false;
          this._loaderService.hideGlobalLoader();
        }
      });
  }

  public unlinkCard(cardId) {
    this._loaderService.showGlobalLoader();
    this._dashboardService.unlinkReportFromView(cardId, this.ViewId)
      .toPromise()
      .then((_response: any) => {
        var status = _response.split("$#")[0];
        var reportName = _response.split("$#")[1];
        var widgetName = _response.split("$#")[2];
        var newReportId = _response.split("$#")[3].toLowerCase();
        let message = "";
        if (status.toLowerCase() == "success") {
          this.gridconfig.config.cards.forEach((obj, index) => {
            if (obj.cardId === cardId) {
              find(obj.uiConfig.kebabMenuOptions, function (x) {
                return x.export === AnalyticsCommonConstants.WidgetFunction.UNLINK
              }).showOption = false;
              //Reseting the following flags in main objects i.e. isLinkReport,reportDetailsId,cardId & reportDetailObjectId
              this._dashboardCommService.resetValues(['isLinkReport', 'reportDetailsId', 'cardId'], [false, newReportId, newReportId], obj);
              this._dashboardCommService.resetValues(['reportDetailObjectId'], [newReportId], obj.reportDetails);
              if (obj.changeDetectionMutation.setLinkedViewFilterState) {
                obj.changeDetectionMutation.setLinkedViewFilterState();
              }
              if (obj.changeDetectionMutation.setDashboardCardFooterState) {
                obj.changeDetectionMutation.setDashboardCardFooterState();
              }
            }
          });

          message = "Widget '" + widgetName + "' unlinked successfully with Report '" + reportName + "'";
        }
        else if (status.toLowerCase() == "unauthorized") {
          message = "You are not authorized to unlink this report from Widget '" + widgetName + "'";
        }
        else if (status.toLowerCase() == "error") {
          message = "Some error occured while unlinking the report Or the report does not exist on this view";
        }
        else {
          message = "Some error occured"
        }
        this._commUtils.getToastMessage(message);
        this._loaderService.hideGlobalLoader();

        if (this._dashboardCommService.dashboardPersistenceData[this.ViewId].hasOwnProperty(cardId)) {
          var data = this._dashboardCommService.dashboardPersistenceData[this.ViewId][cardId];
          this._dashboardCommService.dashboardPersistenceData[this.ViewId][newReportId] = {};
          this._dashboardCommService.dashboardPersistenceData[this.ViewId][newReportId]['x'] = data.x;
          this._dashboardCommService.dashboardPersistenceData[this.ViewId][newReportId]['y'] = data.y;
          this._dashboardCommService.dashboardPersistenceData[this.ViewId][newReportId]['width'] = data.width;
          this._dashboardCommService.dashboardPersistenceData[this.ViewId][newReportId]['height'] = data.height;
          delete this._dashboardCommService.dashboardPersistenceData[this.ViewId][cardId];
        }
        this.manageUnsubscribeObservable$.add(
          this._dashboardService.setDashboardPersistenceJson(
            this._appConstants.userPreferences.UserBasicDetails.ContactCode,
            DashboardConstants.dashboardDocumentType,
            this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
            JSON.stringify(this._dashboardCommService.dashboardPersistenceData)
          ).subscribe());

      });

  }

  public renameCard(cardId, cardName) {
    let _thisRef = this;
    this._loaderService.showGlobalLoader();
    this.manageUnsubscribeObservable$.add(
      this._dashboardService.editDashletInfoByReportDetailObjectIdViewId(cardName, cardId, this.ViewId, this._dashboardCommService.selectedTab.sectionId)
        .subscribe((_response: any) => {
          this.gridconfig.config.cards.forEach((obj, index) => {
            if (obj.cardId === cardId) {
              obj.cardTitle = _response;
              obj.title = _response;
              let seletctedTab = filter(_thisRef._dashboardCommService.tabDashletInfo.lstTabDetails, {tabId: _thisRef._dashboardCommService.selectedTab.tabId})[0];
              let selectedWidget = filter(seletctedTab.lstSectionInfo[0].lstDashletInfo, {reportDetailsId : cardId})[0];
              selectedWidget.title = _response;
               if (this._commUtils.isNune(selectedWidget.reportDetails)) {
                selectedWidget.reportDetails.reportName = _response;
              }
              obj.showEdit = false;
            }
          });
          this._loaderService.hideGlobalLoader();
        })
    );

  }


  public updateDescription(cardId, cardDescription) {
    this._loaderService.showGlobalLoader();
    this.manageUnsubscribeObservable$.add
      (
        this._dashboardService.editDashletInfoByReportDetailObjectIdViewId(cardDescription, cardId, this.ViewId, this._dashboardCommService.selectedTab.sectionId, true)
          .subscribe((_response: any) => {
            this.gridconfig.config.cards.forEach((obj, index) => {
              if (obj.cardId === cardId) {
                obj.config.data.description = _response;
                obj.showEdit = false;
              }
            });
            this._loaderService.hideGlobalLoader();
          })
      );


  }
  linkToDashboard(cardId) {
    this._dashboardCommService.commWrapperSubheaderEvents({

      data: cardId,
      eventType: AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD
    });
  }
  clickHeadingLinkedWidget(linkedViewId) {
    this._dashboardCommService.commWrapperSubheaderEvents({

      data: linkedViewId,
      eventType: AnalyticsCommonConstants.WidgetFunction.LINKED_WIDGET_HEADING_CLICKED
    });
  }
  unlinkFromDashboard(cardId) {
    this._commUtils.getConfirmMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_WARNING_MSG_UNLINK_FROM_DASHBOARD}`,
      [
        DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
        DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
      ], (_response: any) => {
        if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
          this._dashboardService.unLinkFromDashboard(cardId).subscribe((_response: any) => {
            let index = findIndex(this.gridconfig.config.cards, { cardId: cardId });
            this.gridconfig.config.cards[index].linkViewId = "00000000-0000-0000-0000-000000000000";
            this.gridconfig.config.cards[index].isLinkedToDashboard = false;
            let kebabMenuIndexLinked = findIndex(this.gridconfig.config.cards[index].uiConfig.kebabMenuOptions, { export: AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD });
            this.gridconfig.config.cards[index].uiConfig.kebabMenuOptions[kebabMenuIndexLinked].export = AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD;
            this._commUtils.getToastMessage(`${DashboardConstants.UIMessageConstants.STRING_SUCCESS_UNLINKED_WIDGET_FROM_DASHBOARD}`);
            if (this.gridconfig.config.cards[index].changeDetectionMutation.setSummaryCardState) {
              this.gridconfig.config.cards[index].changeDetectionMutation.setSummaryCardState();
            }
            // if (this.gridconfig.config.cards[index].changeDetectionMutation.setLinkedViewFilterState) {
            //   this.gridconfig.config.cards[index].changeDetectionMutation.setLinkedViewFilterState();
            // }
            let DashboardCardHeaderState = this.gridconfig.config.cards[index].changeDetectionMutation.setDashboardCardHeaderState;
            if (DashboardCardHeaderState) {
              DashboardCardHeaderState();

              setTimeout(() => {
                this._dashboardCommService.truncateDashboardCardTitle(this._elementRef, this._commUtils._widgetCards[index], false, true);
              }, 500)
            }
            this._loaderService.hideGlobalLoader();
          });
        }
      });
  }
  public cardEvents($event) {
    switch ($event.eventType) {
      case AnalyticsCommonConstants.WidgetFunction.REMOVE:
        this.removeCard($event.cardId);
        break;
      case AnalyticsCommonConstants.WidgetFunction.UNLINK:
        this.unlinkCard($event.cardId);
        break;
      case AnalyticsCommonConstants.WidgetFunction.RENAME:
        this.renameCard($event.cardId, $event.cardName);
        break;
      case AnalyticsCommonConstants.WidgetFunction.UPDATE_DESCRIPTION:
        this.updateDescription($event.cardId, $event.cardDescription);
        break;
      case AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD:
        this.linkToDashboard($event.cardId);
        break;
      case AnalyticsCommonConstants.WidgetFunction.LINKED_WIDGET_HEADING_CLICKED:
        this.clickHeadingLinkedWidget($event.redirectToLinkedViewId);
        break;
      case AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD:
        this.unlinkFromDashboard($event.cardId);
        break;
      case AnalyticsCommonConstants.WidgetFunction.MoveTo:
        this.moveToAnotherTab($event.cardId, $event.sectionId);
        break;
      case AnalyticsCommonConstants.WidgetFunction.REMOVE_TABS:
        this.removeTabsForGivenView($event.eventType);
        break;
    }
  }

  public cardKebabMenuConfig(_obj: any) {
    this._dashboardCommService.showMoveToOption = this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.MoveTo);
    if (_obj.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard) {
      return [
        {
          export: _obj.additionalProperties.titleFlag ? AnalyticsCommonConstants.WidgetFunction.HIDE_TITLE : AnalyticsCommonConstants.WidgetFunction.SHOW_TITLE,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.SHOW_TITLE)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.REMOVE,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.REMOVE)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.OPEN_REPORT,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.UNLINK,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.UNLINK)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.ADD_DESCRIPTION,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.ADD_DESCRIPTION)
        },
        {
          export: this._commUtils.isEmptyGuid(_obj.linkViewId) ? AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD : AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD)
        },
        {
          export: _obj.additionalProperties.percentageFlagSummaryCard ? AnalyticsCommonConstants.WidgetFunction.HidePercentageValue : AnalyticsCommonConstants.WidgetFunction.ShowPercentageValue,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.SummaryCard, ProductLevelActionNameConstants.WidgetFunction.HidePercentageValue)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.MoveTo,
          expand: false,
          showOption: this._dashboardCommService.showMoveToOption
        }
      ]
    }
    else {
      return [
        {
          export: 'Export',
          expand: true,
          types: ['PNG Image', 'PDF Image', 'SVG Vector', 'Excel'],
          showOption: false
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.RENAME,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.DashboardCard, ProductLevelActionNameConstants.WidgetFunction.RENAME)
        },
        {
          export: 'Copy_To',
          expand: false,
          showOption: false
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.REMOVE,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.DashboardCard, ProductLevelActionNameConstants.WidgetFunction.REMOVE)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.OPEN_REPORT,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.DashboardCard, ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT)
        },
        {
          export: 'View_Data_Source',
          expand: false,
          showOption: false
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.UNLINK,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.DashboardCard, ProductLevelActionNameConstants.WidgetFunction.UNLINK)
        },
        {
          export: this._commUtils.isEmptyGuid(_obj.linkViewId) ? AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD : AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD,
          expand: false,
          showOption: this.enableDashboardCardActionMenuItems(_obj, AnalyticsCommonConstants.ActionMenuType.DashboardCard, ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD)
        },
        {
          export: AnalyticsCommonConstants.WidgetFunction.MoveTo,
          expand: false,
          showOption: this._dashboardCommService.showMoveToOption
        }
      ]
    }
  }

  private enableDashboardCardActionMenuItems(_obj: any, actionMenuType: AnalyticsCommonConstants.ActionMenuType, ActionName: string) {
    return ((_obj) => { return new Function('_obj', this._commUtils.enableFeatureByProductType(this._appConstants.userPreferences.moduleSettings.productTitle, actionMenuType, ActionName)).bind(this) })()(_obj)
  }

  private setshowCurrentlyViewing(_reportDetails: any): boolean {
    return _reportDetails.reportViewType != 5 && _reportDetails.lstReportObjectOnRow.length > 0 || _reportDetails.lstReportObjectOnColumn.length > 0;
  }

  private getConditionalFormattingFormulas() {
    this._dashboardService.getConditionalFormattingFormulas()
      .toPromise()
      .then((_response: Array<any>) => {
        _response.forEach(element => {
          let res = {} as IConditionalFormattingFormula;
          res.formulaId = element.FormulaId;
          res.formulaName = element.FormulaName;
          res.expression = element.Expression;
          res.disabledProducts = element.DisabledProducts;
          this._dashboardCommService.conditionalFormattingFormulas.push(res);
        });
      }).catch((_error) => {
        console.log(_error);
      });
  }
  private mapSavedDataToAppliedFiltersByCondition(appliedSelectedFilter: any, _value: any) {
    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
    // appliedSelectedFilter.QuarterYearModel = _value.QuarterYearModel;
    appliedSelectedFilter.filterValueSet = true;
    appliedSelectedFilter.FilterConditionOperator = _value.FilterConditionOperator;
    appliedSelectedFilter.FilterConditionOperator.title = filter(this._dashboardCommService.FilterConditionMetadata, (filterConfig, index) => { return filterConfig.FilterConditionObjectId == _value.FilterConditionOperator.FilterConditionObjectId })[0].Name
    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
    appliedSelectedFilter.FilterConditionRangeValue.from = _value.FilterConditionRangeValue.from;
    appliedSelectedFilter.FilterConditionRangeValue.to = _value.FilterConditionRangeValue.to;
    appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
    appliedSelectedFilter.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
  }

  private mapSavedDataToAppliedFiltersBySelection(appliedSelectedFilter, _value) {
    appliedSelectedFilter.selectedFilterList = _value.selectedFilterList;
    appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
  }

  private noWigetsForGivenTab(type: string = '') {
    let msg = type === 'Tabs' ? 'No widgets present in the selected tab' : DashboardConstants.UIMessageConstants.STRING_DASHBOARD_NOT_CONTAIN_ANY_VIEWS;
    this._commUtils.getMessageDialog(
      msg,
      (_response: any) => {
        this.subheaderConfig.showDashboardOnEmptyWidget = false;
        this._loaderService.hideGlobalLoader();
        return;
      },
      DashboardConstants.OpportunityFinderConstants.STRING_INFORM)
  }

  private checkIfNoWidgetTabPresent(selectedViewInfo: any, response: any) {
    each(selectedViewInfo.lstTabInfo, (_tab) => {
      if (findIndex(response.LstTabDetails, { TabId: _tab.tabId }) === -1) {
        response.LstTabDetails.push({
          TabId: _tab.tabId,
          IsDeleted: _tab.isDeleted,
          TabName: _tab.tabName,
          TabSequence: _tab.tabSequence,
          LstSectionInfo: [{
            IsDeleted: _tab.isDeleted,
            SectionId: _tab.sectionId,
            SectionName: 'Default_Section',
            SectionSequence: 1,
            LstDashletInfo: []
          }]
        });
      }
    });
  }

  private intializeTabComponent(selectedTabId) {
    this.tabDashletInfo.lstTabDetails = sortBy(this.tabDashletInfo.lstTabDetails, ['tabSequence']);
    //Intialize the tabs for this view.
    this._dashboardCommService.dashboardTabsList = [];
    each(this.tabDashletInfo.lstTabDetails, (_tab: TabDetail, _index: number) => {
      this._dashboardCommService.dashboardTabsList.push({
        title: _tab.tabName,
        tabId: _tab.tabId,
        isActive: _tab.tabId === selectedTabId,
        isStriked: false,
        isEditable: false,
        sectionId: _tab.lstSectionInfo[0].sectionId,
        viewId: this.tabDashletInfo.viewId,
        tabSequence: _tab.tabSequence
      });
      if (this._dashboardCommService.dashboardTabsList[_index].isActive)
        this._dashboardCommService.selectedTab = this._dashboardCommService.dashboardTabsList[_index];
    });
    this._dashboardCommService.HasUserVisionEditActivity = this.subheaderConfig.HasUserVisionEditActivity;
    this._dashboardCommService.setDashboardTabsList(this._dashboardCommService.dashboardTabsList);
  }


  public generateGraphConfigForTheGivenDashletInfo(selectedViewInfo, selectedTabDetail, initializeGrid: boolean = true, isOpenView: boolean = false) {
    return new Promise((resolve, reject)=>{
    this.dashletInfoArray = [];
    this.manageUnsubscribeFilterObservable$.unsubscribe()
    this.tabDashletInfo.lstTabDetails.filter(_tab => _tab.tabId === selectedTabDetail.tabId)[0].
      lstSectionInfo.filter(_section => _section.sectionId === selectedTabDetail.sectionId)[0].
      lstDashletInfo.map(_dashletInfo => {
        this.dashletInfoArray.push(_dashletInfo);
      });
    this.gridconfig = [];
    this.gridconfig.viewId = selectedViewInfo.viewId;
    this.gridconfig.api = {
      generateGraphConfigForTheGivenDashletInfo: (selectedTabDetail, initializeGrid, isOpenView: boolean = false) => { return this.generateGraphConfigForTheGivenDashletInfo(this._dashboardCommService.selectedViewInfo, selectedTabDetail, initializeGrid, isOpenView).then(resp =>{
        return resp; 
      }) 
                                                                                                                     },
      addWidgetToGivenTab: (reportDetailId, fromTab, toTab) => { this.addWidgetToGivenTab(reportDetailId, fromTab, toTab) },
      mapDashletToCardConfig: (dashletInfo, selectedViewInfo, selectedTabDetail, isSaveDashboard: boolean = false) => { return this.mapDashletToCardConfig(dashletInfo, selectedViewInfo, selectedTabDetail, isSaveDashboard) }
    };
    this.gridconfig.config = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartVisionGridConfig);
    this.gridconfig.subheaderConfig = this.subheaderConfig;
    if ($(window).width() > 1366) {
      this.gridconfig.config.layout.config.width = 6;
    } else if ($(window).width() <= 1366) {
      this.gridconfig.config.layout.config.width = 6;
    }
    let dashletConfigArray: Array<any> = new Array<any>();
    this.dashletInfoArray.forEach((obj, index) => {
      dashletConfigArray.push(this.mapDashletToCardConfig(obj, selectedViewInfo, selectedTabDetail));
    });
    //pushing dashboard layout to persistance service
    this._dashboardCommService.setPersistenceData(selectedViewInfo, [], null, selectedTabDetail.tabId, selectedTabDetail.sectionId);
    // Sorting dashletInfoArray by gridstackPosition.y so that widget with 0th y position is loaded first to occupy top layer on dashboard 
    dashletConfigArray = sortBy(dashletConfigArray, [d => d.layoutItemConfig.gridstackPosition['y'], d => d.layoutItemConfig.gridstackPosition['x']]);
    this.gridconfig.config.cards = dashletConfigArray;
    this.sections = this.gridconfig;
    this._dashboardCommService.listofDistinctWidgetDataSource = [];
    this._dashboardCommService.updateListDistinctDataSourceWhenCardOrTabRemoved();
    if (this._dashboardCommService.listofDistinctWidgetDataSource.length) {
      this.getDistinctDataSourceInAllWidget().then((_response: any) => {
        if (_response) {

          if (this._appConstants.userPreferences.moduleSettings.enableCarryOverFilterOption) {
            /**
             *  Handling the Carry Over Filter to Send View Filters
             * and Code will only execute if and only if the enable Carry Over Filter Option is enabled.
            **/
            if (crossProductFilters && crossProductFilters.length > 0) {
              const isCarryOverCrossSuiteView: boolean =
                crossProductFilters[0].ISMultiSource === DashboardConstants.ViewFilterType.MultiSource;
              const isCurrentViewCrossSuiteView: boolean =
                this._commUtils.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource);
              // Cross View to Cross View
              if (isCurrentViewCrossSuiteView && isCarryOverCrossSuiteView) {
                crossProductFilters.map((_appFilVal: any, _appFilKey: number) => {
                  let _mockDriveFilter = { reportObject: { reportObjectId: _appFilVal.ReportObjectID }, RelationObjectTypeId: undefined };
                  const _mockWidget = { reportDetails: { dataSourceObjectId: _appFilVal.dataSourceObjectId } };
                  this._commUtils.createDriveFilterForCrossSuiteView(_mockWidget, _mockDriveFilter, this._dashboardCommService.relationShipObjectList);
                  if (_mockDriveFilter.RelationObjectTypeId !== undefined)
                    _appFilVal.ReportObjectID = _mockDriveFilter.RelationObjectTypeId;
                  else
                    delete crossProductFilters[_appFilKey];
                });
                crossProductFilters = compact(crossProductFilters);
              }
              // Cross View to Single View
              else if (isCarryOverCrossSuiteView && !isCurrentViewCrossSuiteView) {
                crossProductFilters.map((_appFilVal: any, _appFilKey: number) => {
                  if (!this.modifyCrossProductFilters(_appFilVal, _appFilKey)) {
                    delete crossProductFilters[_appFilKey];
                  }
                });
                crossProductFilters = compact(crossProductFilters);
              }
              // Single View  to Cross View
              else if (!isCarryOverCrossSuiteView && isCurrentViewCrossSuiteView) {
                crossProductFilters.map((_appFilVal: any, _appFilKey: number) => {
                  let _mockDriveFilter = { reportObject: { reportObjectId: _appFilVal.ReportObjectID }, RelationObjectTypeId: undefined };
                  const _mockWidget = { reportDetails: { dataSourceObjectId: _appFilVal.dataSourceObjectId } };
                  this._commUtils.createDriveFilterForCrossSuiteView(_mockWidget, _mockDriveFilter, this._dashboardCommService.relationShipObjectList);
                  if (_mockDriveFilter.RelationObjectTypeId !== undefined) {
                    _appFilVal.ReportObjectID = _mockDriveFilter.RelationObjectTypeId;
                    _appFilVal.ISMultiSource = DashboardConstants.ViewFilterType.MultiSource
                  }
                  else
                    delete crossProductFilters[_appFilKey];
                });
                crossProductFilters = compact(crossProductFilters);
              }
              // Single View to Single View
              else if (!isCarryOverCrossSuiteView && !isCurrentViewCrossSuiteView) {
                // Removing the cross Product Filters if the Send Datasource is different from Current View Data Source
                // Becuase mapping could not be found and it may break.
                if (crossProductFilters[0].dataSourceObjectId !== this._dashboardCommService.listofDistinctWidgetDataSource[0]) {
                  crossProductFilters = [];
                }
              }
            }
          }

          if (crossProductFilters && crossProductFilters.length > 0) {
            this.fetchCrossProductDashboardFilters(crossProductFilters, _response, selectedViewInfo, initializeGrid, isOpenView).then(resp =>{
              if(resp){
                 if (!initializeGrid) {
                    resolve(this.sections);
                 }
              }
            })
          }
          else {
            this.DistinctDataSourceInAllWidget(_response, selectedViewInfo, initializeGrid, isOpenView);
             if (!initializeGrid) {
                    resolve(this.sections);
             }
          }
          
        }
      });
    }
    else if (initializeGrid) {
      this.gridContainerRef.createEmbeddedView(this.gridTemplateRef, {
        $implicit:
        {
          config: this.sections,
          listofDistinctWidgetDataSource: this._dashboardCommService.listofDistinctWidgetDataSource,
          listAllReportObjectWithMultiDatasource: this._dashboardCommService.listAllReportObjectWithMultiDatasource
        }
      });
      resolve(false)
    }
   })
  }

  addWidgetToGivenTab(reportDetailId, fromTab, toTab) {
    let toMoveDashletInfo;
    let _lstDashletInfo = this.tabDashletInfo.lstTabDetails.filter(_tab => _tab.tabId === fromTab.tabId)[0].
      lstSectionInfo.filter(_section => _section.sectionId === fromTab.sectionId)[0].
      lstDashletInfo;
    let _index = findIndex(_lstDashletInfo, { reportDetailsId: reportDetailId });
    if (_index != -1) {
      toMoveDashletInfo = _lstDashletInfo.splice(_index, 1);
    }
    toMoveDashletInfo[0].additionalProperties.x = undefined
    toMoveDashletInfo[0].additionalProperties.y = undefined
    switch (toMoveDashletInfo[0].reportDetails.reportType) {
      case DashboardConstants.ReportViewType.SummaryCard:
        {
          toMoveDashletInfo[0].additionalProperties.height = 2;
          toMoveDashletInfo[0].additionalProperties.width = 1;
          break;
        }
      case DashboardConstants.ReportViewType.GaugeChart:
        {
          toMoveDashletInfo[0].additionalProperties.height = 4;
          toMoveDashletInfo[0].additionalProperties.width = 6;
          break;
        }
      default:
        {
          toMoveDashletInfo[0].additionalProperties.height = 4;
          toMoveDashletInfo[0].additionalProperties.width = 2;
          break;
        }
    }
    this.tabDashletInfo.lstTabDetails.filter(_tab => _tab.tabId === toTab.tabId)[0].
      lstSectionInfo.filter(_section => _section.sectionId === toTab.sectionId)[0].
      lstDashletInfo.push(toMoveDashletInfo[0]);
  }

  private moveToAnotherTab(cardId, sectionId) {
    let _thisRef = this;
    let card = find(this.gridconfig.config.cards, (x: any) => {
      return x.reportDetailsId == cardId
    });
    let targetTab = filter(this._dashboardCommService.dashboardTabsList, { sectionId: sectionId })[0];
    //Set the sequnece number of this report as the last report in that tab.
    let sequenceNumber = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, _tab => { return _tab.tabId == targetTab.tabId })[0].lstSectionInfo[0].lstDashletInfo.length;
    this._analyticsMetaDataService.moveWidgetToOtherTab(this._dashboardCommService.selectedViewInfo.viewId, cardId, sectionId, sequenceNumber).subscribe((_response: any) => {
      if (_response != 'error' && _response.toLowerCase() != 'false') {
        card.isRemoved = true;
        let messageText: string = "Widget : '" + card.title + "' has been moved to : '" + targetTab.title + "'";
        _thisRef._commUtils.getToastMessage(messageText);
        if (_thisRef._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {
          _thisRef._dashboardCommService.triggerSaveDashboard();
          _thisRef.getDistinctDataSourceInAllWidget().then((_response: any) => {
            _thisRef.createFilterTabChipData(_response.filterList);
          });
        }
        else {
          if (_thisRef.gridconfig.config.cards.length > 0 && every(_thisRef.gridconfig.config.cards, ['isRemoved', true])) {
            _thisRef.subheaderConfig.selectedDashboard.lstDashboardFilters = [];
            // _thisRef.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty = [];
            _thisRef._dashboardCommService.appliedFilters = [];
            _thisRef._dashboardCommService.listofDistinctWidgetDataSource = [];
            _thisRef._dashboardCommService.updateListDistinctDataSourceWhenCardOrTabRemoved();
            _thisRef._dashboardCommService.triggerSaveDashboard();
          }
        }
        //Delete the persistance data from of this widget from the source tab.
        if (this._commUtils.isNuneArray([
          _thisRef._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.selectedDashboard.viewId],
          _thisRef._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.selectedDashboard.viewId][this._dashboardCommService.selectedTab.tabId],
          _thisRef._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.selectedDashboard.viewId][this._dashboardCommService.selectedTab.tabId][this._dashboardCommService.selectedTab.sectionId]
        ])) {
          delete _thisRef._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.selectedDashboard.viewId][this._dashboardCommService.selectedTab.tabId][this._dashboardCommService.selectedTab.sectionId][cardId];
          compact(_thisRef._dashboardCommService.dashboardPersistenceData[this.subheaderConfig.selectedDashboard.viewId][this._dashboardCommService.selectedTab.tabId][this._dashboardCommService.selectedTab.sectionId]);
        }
        _thisRef._dashboardService.setDashboardPersistenceJson(
          _thisRef._appConstants.userPreferences.UserBasicDetails.ContactCode,
          DashboardConstants.dashboardDocumentType,
          _thisRef._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
          JSON.stringify(_thisRef._dashboardCommService.dashboardPersistenceData)
        ).subscribe();
        //Updating the datasource object id in elastic search when a pinned report is removed
        if (_thisRef._appConstants.userPreferences.moduleSettings.enableIngestion) {
          const updateIngestionObject: any = {
          };
          if (!_thisRef._dashboardCommService.listofDistinctWidgetDataSource.length) {
            updateIngestionObject["DataSourceObjectId"] = [AnalyticsCommonConstants.EmptyGuid];
          }
          else {
            updateIngestionObject["DataSourceObjectId"] = _thisRef._dashboardCommService.listofDistinctWidgetDataSource;
          }
          _thisRef.manageUnsubscribeObservable$.add(
            _thisRef._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, _thisRef.subheaderConfig.selectedDashboard.viewId, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
          );
        }
        //After removing wigdet from view reducing dashletcount by 1 and setting maxCountReachedForPinning property to false
        --_thisRef.subheaderConfig.selectedDashboard.dashletCount;
        _thisRef.subheaderConfig.selectedDashboard.maxCountReachedForPinning = false;
        _thisRef._loaderService.hideGlobalLoader();
      }
    });
  }


  public mapDashletToCardConfig(obj, selectedViewInfo, selectedTabDetail, isSaveDashboard: boolean = false) {
    //User Activity based Code Modification for Edit Vision Dashboard but not For Open Report.
    const isAccessibleReport: boolean = some(this.dataSourceByContactCodeInfo,
      { DataSourceObjectId: obj.reportDetails.dataSourceObjectId }) || obj.reportDetails.dataSourceType == AnalyticsCommonConstants.DataSourceType.ElasticSearch
      || (supplierScorecardConfig['ProductType'] != undefined && supplierScorecardConfig['ProductType'] == productName.scorecardProduct);
    const dashletConfig =
    {
      title: obj.title,
      isDriveEnabled: false,
      driveConfig: {
        isDriver: false,
        isDriven: false,
        driveConfigDescription: '',
        //isCrosssSuiteFilterApplied: false
      },
      isAccessibleReport: isAccessibleReport,
      cardId: obj.reportDetailsId,
      cardTitle: this._commUtils.isNune(obj.title) ? obj.isLinkReport ? obj.reportDetails.reportName : obj.title : obj.reportDetails.lstReportObjectOnValue[0].reportObjectName,
      manifestId: 'DashboardCard',
      componentId: 'DashboardCard',
      classId: obj.reportDetailsId,
      widgetDataType: obj.widgetDataType,
      // cardType: obj.reportDetails.reportViewType === DashboardConstants.ReportViewType.SummaryCard ? DashboardConstants.WidgetDataType.SummaryCard : 
      // DashboardConstants.WidgetDataType.WidgetCard,
      cardType: this.GetCardType(obj.reportDetails.reportViewType),
      chartDefaultColors: this.GetChartDefaultColors(obj.reportDetails.reportViewType),
      // height: obj.additionalProperties.height,
      // minWidth: obj.additionalProperties.minWidth,
      // width: obj.additionalProperties.width,
      // minHeight: obj.additionalProperties.minHeight,
      // x: obj.additionalProperties.x,
      // y: obj.additionalProperties.y,
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
      linkViewId: obj.linkViewId,
      sort: {
        items: [],
        isActive: this._commUtils.enableFeatureFor(obj.reportDetails.reportViewType, DashboardConstants.EnableFeature.Sort),
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
          minWidth: this._commUtils.getWidgetType(obj.reportDetails.reportViewType)
            === DashboardConstants.WidgetDataType.Chart || this._commUtils.getWidgetType(obj.reportDetails.reportViewType)
            === DashboardConstants.WidgetDataType.SummaryCard ? 2 : 1,
          minHeight: this._commUtils.getWidgetType(obj.reportDetails.reportViewType)
            === DashboardConstants.WidgetDataType.Chart ? 4 : this._commUtils.getWidgetType(obj.reportDetails.reportViewType)
              === DashboardConstants.WidgetDataType.SummaryCard ? 1 : 2
        }
      },
      config: {},
      sliderConfig: [
      ],
      reportDetails: obj.reportDetails,
      type: AnalyticsCommonConstants.ReportViewType[obj.reportDetails.reportViewType],
      uiConfig: {
        showBreadCrumOption: true,
        showSortOption: true && this._appConstants.userPreferences.moduleSettings.showSortOption,
        showFilterOption: false && this._appConstants.userPreferences.moduleSettings.showFilterIconOption,
        showFullScreenOption: isAccessibleReport && this._appConstants.userPreferences.moduleSettings.showFullScreenOption,
        showKebabMenusOption: false,
        showTitle: JSON.parse(obj.additionalProperties.titleFlag) === true,
        showPercentageSummaryCard: JSON.parse(obj.additionalProperties.percentageFlagSummaryCard) === true,
        kebabMenuOptions: this.cardKebabMenuConfig(obj),
        showCurrentlyViewing: this.setshowCurrentlyViewing(obj.reportDetails)
      },
      reportRequestKey: this._commUtils.generateReportRequestKey(obj.reportDetailsId, obj.addedBy),
      pageIndex: 1,
      chartMinMax: []
    };

    // Added the condition specifically to show the record related to persistenace in case of standard view and created by current user
    if (this._dashboardCommService.dashboardPersistenceData && selectedViewInfo.createdBy === this._appConstants.userPreferences.UserBasicDetails.ContactCode) {

      if (!this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId])) {
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId] = {};
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId] = {};
      }
      if (!this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId])) {
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId] = {};
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId] = {};
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId] = {};
      }
      //If there is no persistance data for the given tab then we create a new one.
      if (!this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId])) {
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId] = {};
        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId] = {};
      }
      //if persistence data for that view exists then only apply layout according to persistence, otherwise default behaviour of dashboard grid
      if (!this._commUtils.isNune(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId])
        || this._commUtils.isEmptyObject(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId])) {

        this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId] = {};
        if (obj.additionalProperties && this._commUtils.isNune(obj.additionalProperties) && !this._commUtils.isEmptyObject(obj.additionalProperties)
          && this._commUtils.isNune(obj.additionalProperties.x) && this._commUtils.isNune(obj.additionalProperties.y)) {
          //inert widget layout details from additional properties object of widget in persistence data
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['x'] = obj.additionalProperties.x;
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['y'] = obj.additionalProperties.y;
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['width'] = obj.additionalProperties.width;
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['height'] = obj.additionalProperties.height;
        } else {
          //will come to this block only if persistence data is present for that view and not present for one of the widgets (in case a new report is pinned)
          var dashboardGridLastWidgetLayout = maxBy(flatMap(this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId]), 'y');
          dashletConfig.layoutItemConfig.gridstackPosition.y = dashboardGridLastWidgetLayout ? (dashboardGridLastWidgetLayout['y'] + dashboardGridLastWidgetLayout['height']) : 0; //get max y and assign to latest widget.
          //insert new widget layout details in persistence data
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['x'] = dashletConfig.layoutItemConfig.gridstackPosition.x;
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['y'] = dashletConfig.layoutItemConfig.gridstackPosition.y;
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['width'] = dashletConfig.layoutItemConfig.gridstackPosition.width;
          this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['height'] = dashletConfig.layoutItemConfig.gridstackPosition.height;
        }
        if ((dashletConfig.widgetDataType == "olap" || dashletConfig.widgetDataType == "flex") && this.sections != undefined && this._commUtils.isNune(this._dashboardCommService.previousSelectedTab)) {
          this.getPersistanceDataForSaveAs(dashletConfig, selectedViewInfo, this.sections, selectedTabDetail.tabId, selectedTabDetail.sectionId);
          this._dashboardCommService.previousSelectedTab = undefined;
        }
      }
      if (this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]) {
        dashletConfig.layoutItemConfig.gridstackPosition.x = this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['x'];
        dashletConfig.layoutItemConfig.gridstackPosition.y = this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['y'];
        dashletConfig.layoutItemConfig.gridstackPosition.width = this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['width'];
        dashletConfig.layoutItemConfig.gridstackPosition.height = this._dashboardCommService.dashboardPersistenceData[selectedViewInfo.viewId][selectedTabDetail.tabId][selectedTabDetail.sectionId][dashletConfig.reportDetailsId]['height'];
      }
    }
    dashletConfig.uiConfig.showKebabMenusOption = (
      filter(dashletConfig.uiConfig.kebabMenuOptions, (itemValue: any, itemKey: number) => {
        return itemValue.showOption == true
      })).length > 0;

    let sliderFilterReportObjArray = obj.reportDetails.lstFilterReportObject.filter((item, index, array) => {
      return item.isSliderWidgetFilter &&
        item.filterCondition.condition == AnalyticsCommonConstants.ReportObjectOperators.Between &&
        item.reportObject.reportObjectType == AnalyticsCommonConstants.ReportObjectType.Metrics;
    });
    dashletConfig.showSliderWidget = sliderFilterReportObjArray != null && sliderFilterReportObjArray.length > 0 ? true : false;
    let dashletInfoCloneObj = new DashletInfo();
    let jsonDashletConfig = JSON.stringify(dashletConfig);
    dashletInfoCloneObj = JSON.parse(jsonDashletConfig);
    dashletConfig.isExpandedGraph = dashletConfig.isAccessibleReport ? dashletConfig.showSliderWidget && (dashletConfig.layoutItemConfig.gridstackPosition.width > 4) ? true : false : false;
    if (!isSaveDashboard)
      this.gridconfig.config.cards.push(dashletConfig);
    if (sliderFilterReportObjArray != null && sliderFilterReportObjArray.length > 0 && dashletConfig.isAccessibleReport)
      this.getAllSliderFilterMinMAxValue(dashletInfoCloneObj, selectedViewInfo.viewId, sliderFilterReportObjArray);
    return dashletConfig;
  }

  public removeTabsForGivenView(eventType) {
    if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {
      this.getDistinctDataSourceInAllWidget().then((_response: any) => {
        this.createFilterTabChipData(_response.filterList);
      });
    }
  }

  public createFilterTab(_value: any, FilterList) {
    let _thatRef = this;
    let appliedSelectedFilter: IReportingObjectMultiDataSource = filter(FilterList, { ReportObjectId: _value.ReportObjectId })[0] as IReportingObjectMultiDataSource;
    appliedSelectedFilter.IsSelected = true;
    appliedSelectedFilter.inChip = true;
    appliedSelectedFilter.FilterBy = _value.FilterBy;
    switch (appliedSelectedFilter.FilterType) {
      case DashboardConstants.FilterType.MultiSelect:
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.Date:
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.Year:
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.Quarter:
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.QuarterYear:
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.MonthYear:
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.Month:
        appliedSelectedFilter.FilterConditionValue = _value.FilterConditionValue;
        appliedSelectedFilter.FilterConditionText.value = _value.FilterConditionText.value;
        _thatRef._globalFilterService.createFilterTabChip(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.Measure:
        _thatRef.mapSavedDataToAppliedFiltersByCondition(appliedSelectedFilter, _value);
        break;
      case DashboardConstants.FilterType.Number:
        if (appliedSelectedFilter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
          _thatRef.mapSavedDataToAppliedFiltersBySelection(appliedSelectedFilter, _value);
        }
        else {
          _thatRef.mapSavedDataToAppliedFiltersByCondition(appliedSelectedFilter, _value)
        }
        break;
      default:
        break;
    }
  }

  setSortingObjectForEachWidget() {
    each(this.tabDashletInfo.lstTabDetails, (_tab: TabDetail) => {
      each(_tab.lstSectionInfo, (_section: SectionInfo) => {
        each(_section.lstDashletInfo, (_dashletInfo: DashletInfo) => {
          let _sortObject = this._commUtils.isNune(_dashletInfo.reportDetails.lstReportSortingDetails[0]) ? _dashletInfo.reportDetails.lstReportSortingDetails[0] : [];
            this._dashboardCommService.lstOfDashletSort.set(_dashletInfo.reportDetails.reportDetailObjectId, _sortObject);
        });
      });
    });
  }
}
