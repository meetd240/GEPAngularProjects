import { Subject, Subscription, Observable } from 'rxjs';
import { Injectable, ElementRef, Renderer2, OnDestroy } from "@angular/core";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IReportingObjectMultiDataSource, ICrossSuiteFilterMapping, IFilterConditionMetadata, IOppFinderState, IHierarchyFilterDetails, ISlicerFilterConfig, IDashboardGridBindEventRef, ITabInfo, ITabDetail, ISectionInfo, IFraudAnomalyState, IReportObjectInfo } from
    'interfaces/common-interface/app-common-interface';
import { debounce, compact, each, filter, map } from 'lodash'
import { DashboardService } from '@vsDashboardService/dashboard.service';
import { AppConstants } from 'smart-platform-services';
import { DashboardConstants } from '@vsDashboardConstants';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { ViewInfo } from '@vsViewFilterModels/view-info.model';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { FraudAnomalyMaster, OpportunityFinderMaster } from '@vsOpportunityFinderInterface';
import { ReportDetails } from '@vsDataModels/report-details.model';
import { ReportObject } from '@vsMetaDataModels/report-object.model';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { SortReportObject } from '@vsDataModels/sort-report-object.model';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { findIndex, sortBy, uniq } from 'lodash';
import { IConditionalFormattingFormula } from '@vsMetaDataModels/report-conditional-formatting.model';
import { TabDashletInfo } from '@vsDashletModels/tab-dashlet-info-model';
import { TabDetail } from '@vsDashletModels/tab-detail-model';
import { GlobalFilterService } from '@vsGlobalFilterService';
import { CardConfigNode } from '@vsDashboardInterface';
import { GlobalSliderObject } from '@vsMetaDataModels/global-slider-object.model';

@Injectable()
export class DashboardCommService implements OnDestroy {

    public appliedFilters: Array<IReportingObjectMultiDataSource> = [];
    public FilterConditionMetadata: Array<IFilterConditionMetadata> = [];
    public oppFinderMasterData: OpportunityFinderMaster = new OpportunityFinderMaster();
    public fraudAnomalyMasterData: FraudAnomalyMaster = new FraudAnomalyMaster();
    public oppFinderState: IOppFinderState = {};
    public fraudAnomalyState: IFraudAnomalyState = {};
    public listAllCrossSuiteFilterMapping: Array<ICrossSuiteFilterMapping> = [];
    public listAllReportObjectWithMultiDatasource: Array<IReportingObjectMultiDataSource> = [];
    public listofDistinctWidgetDataSource: Array<any> = [];
    public dashboardPersistenceData: any = {};
    public filterOpen: any;
    public apppliedFilterDataSource$ = new BehaviorSubject<any>({});
    public gridstackChange$ = new BehaviorSubject<any>({});
    public openFilterPop$ = new Subject<any>();
    public isFilterOpen = new Subject<any>();
    public commWrapperSubheaderEvents$ = new BehaviorSubject<any>({});
    public manageSubscription$: Subscription = new Subscription();
    public gridstackDrag = new BehaviorSubject<any>({});
    public globalFilterApplyCancel = new BehaviorSubject<any>({});
    //Used to map the relationship object for all the RO's in case of cross suite dashboard.
    public filterObjectHierarchyList: Array<IHierarchyFilterDetails> = [];
    public relationShipObjectList: any = [];
    public chartDriveFilterValue: string = "";
    public sharedUserCount: number;
    public allDataSourceInfo: any = [];
    private destroyTimeout: any;
    public filterCount: any;
    public slicerComponetRefEvent: IDashboardGridBindEventRef = {} as IDashboardGridBindEventRef;
    public removeFilter: any = {};
    //remove this
    public slicerFilterList: any = [];
    public slicerFilterConfig: Map<string, ISlicerFilterConfig> = new Map<string, ISlicerFilterConfig>();
    //This contains all the lstOfGlobalFilters including the other slicer filter.
    //We use this to apply the filters to the slicer filters.
    public lstOfGlobalFilters: Array<any> = [];
    public updateSlicerFilterData: any = {};
    public showSlicerLoader: boolean = false;
    public bindSlicerExpandCallBack: any;
    public IsFilterSidebarExpanded$ = new BehaviorSubject<any>({});
    public dashboardTabList$ = new BehaviorSubject<any>({});
    public updateKebabMenuOption$ = new BehaviorSubject<any>({});
    public globalSliderApplyFilterTabUpdate$ = new BehaviorSubject<any>({});
    public resizeSummaryCardUpdate$ = new BehaviorSubject<any>({});
    // private destroyTimeout: any;
    public oppfinderOnPaginationDataUpdate = new Subject<any>();
    //colorpalet
    public defaultColorsForAllCharts: any = [];
    public conditionalFormattingFormulas: Array<IConditionalFormattingFormula> = [];
    public dashboardTabsList: Array<ITabInfo> = [];
    public selectedTab: ITabInfo;
    public selectedViewInfo: any;
    public tabDashletInfo: TabDashletInfo;
    public previousSelectedTab: ITabInfo;
    public loadTabFilter$ = new Subject<any>();
    public removeTabLevelFilters: any;
    public showNoTabFilterMsg: boolean = false;
    public lstOfDashletSort: Map<string, any> = new Map<string, any>();
    public addToDashboardList = [
        {
            title: 'Widget',
            id: 1,
            dataAutomationID: 'AddWidget',
            showOption: true

        },
        {
            title: 'Tab',
            id: 2,
            dataAutomationID: 'AddTab',
            showOption: this._appConstants.userPreferences.moduleSettings.showMoveToTab
        }
    ];
    public HasUserVisionEditActivity: boolean = false;
    public globalFilterList: Array<IReportingObjectMultiDataSource> = [];
    public globalSliderConfigArray : Array<CardConfigNode> = new Array<CardConfigNode>();
    public assignedRows : any[] = [];

    public showMoveToOption: boolean = false;
    constructor(
        private dashboardService: DashboardService,
        private _appConstants: AppConstants,
        private _commUtils: CommonUtilitiesService
    ) {

    }

    ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
        this.apppliedFilterDataSource$.complete();
        this.gridstackChange$.complete();
        this.openFilterPop$.complete();
        this.isFilterOpen.complete();
        this.commWrapperSubheaderEvents$.complete();
        this.gridstackDrag.complete();
        this.globalFilterApplyCancel.complete();
        this.loadTabFilter$.complete();
        clearTimeout(this.destroyTimeout);
    }

    public getAppliedFilterData(): any {
        this.apppliedFilterDataSource$.subscribe((_data) => {
            return _data;
        });
    }

    public setAppliedFilterData(data) {
        this.apppliedFilterDataSource$.next(data);
    }
    public setDashboardTabsList(data) {
        this.dashboardTabList$.next(data);
    }

    public updateKebabMenuOption(){
        this.updateKebabMenuOption$.next({});
    }

    public openGlobalFilter(isFilterOpen) {
        this.filterOpen = isFilterOpen
    }

    public globalFilterApplyCancelClick() {
        this.globalFilterApplyCancel.next('');
    }

    // fade out dashboard when filter is open
    public fadeOutDashboardGrid() {
        return this.filterOpen;
    }

    public openFilterpop(loadfilterpopup) {
        this.openFilterPop$.next(loadfilterpopup);
    }

    public commWrapperSubheaderEvents(data) {
        this.commWrapperSubheaderEvents$.next(data);
    }

    public triggerSaveDashboard() {
        this.commWrapperSubheaderEvents({ eventType: DashboardConstants.EventType.GetSaveDashboard });
    }

    public triggerSaveAsDashboard(viewName) {
        this.commWrapperSubheaderEvents({ eventType: DashboardConstants.EventType.GetSaveAsDashboard, viewName });
    }

    private cleanUnwantedReportsFromPersistence(selectedDashboard, selectedTabId, selectedSectionId) {
        if (this._commUtils.isNune(this._commUtils._widgetCards) && this._commUtils._widgetCards.length > 0) {
            //Cleaning all the Persitance Info if it is not part of the Active View.
            const _activeReportIds: Array<string> = compact(this._commUtils._widgetCards.map((_widget: any, _widgetKey: number) => {
                if (_widget.reportDetailsId && !_widget.isRemoved) return _widget.reportDetailsId
            }));
            if (_activeReportIds.length > 0 &&
                this._commUtils.isNuneArray(
                    [this.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId],
                    this.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId]])
            ) {
                for (let key in this.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId]) {
                    if (_activeReportIds.indexOf(key) === -1) {
                        delete this.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId][key];
                    }
                }
                compact(this.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId]);
            }
        }
    }

    public cleanUnwantedPersistenceViewData(viewInfoArray: any) {
        const _allViewInfoIds: Array<string> = viewInfoArray.map((_viewInfo: any, _viewKey: number) => { return _viewInfo.viewId });
        for (let key in this.dashboardPersistenceData) {

            if (_allViewInfoIds.indexOf(key) === -1 && ["lastViewed", "lastTabId", "lastSectionId"].indexOf(key) === -1) {
                delete this.dashboardPersistenceData[key];
            }
        }
        compact(this.dashboardPersistenceData);
    }

    public cleanUnwantedPersistanceTabData(selectedDashboard) {
        if (this._commUtils.isNune(this.dashboardTabsList) && this.dashboardTabsList.length > 0) {
            const _activeTabIds: Array<string> = compact(map(this.dashboardTabsList, (_tab) => { return _tab.tabId }));
            if (_activeTabIds.length > 0 && this._commUtils.isNuneArray([
                this.dashboardPersistenceData[selectedDashboard.viewId]
            ])) {
                for (var key in this.dashboardPersistenceData[selectedDashboard.viewId]) {
                    if (_activeTabIds.indexOf(key) === -1) {
                        delete this.dashboardPersistenceData[selectedDashboard.viewId][key];
                    }
                }
                compact(this.dashboardPersistenceData[selectedDashboard.viewId]);
            }
        }
    }




    public setReportObjectWidthForPersistance(item: any, reportDetailId: string) {

        let persistenceData = this.dashboardPersistenceData;
        const lastVieweId = persistenceData.lastViewed;
        let checkForIsOwn = this._commUtils._widgetCards.find(x => x.cardId == reportDetailId)
        if (checkForIsOwn.isOwn) {
            if (persistenceData[lastVieweId] == undefined) {
                persistenceData[lastVieweId] = {};
            }
            if (!this._commUtils.isNune(persistenceData[lastVieweId][this.selectedTab.tabId])) {
                persistenceData[lastVieweId][this.selectedTab.tabId] = {};
            }
            if (!this._commUtils.isNune(persistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId])) {
                persistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId] = {};
            }
            if (persistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId] == undefined) {
                persistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId] = {};
            }
            if (persistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId][item.reportObjectId] == undefined) {
                this.dashboardPersistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId][item.reportObjectId] = {};
            }
            if (persistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId][item.reportObjectId]["columnWidth"] == undefined) {
                this.dashboardPersistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId][item.reportObjectId] = { "columnWidth": item.reportObjectWidth }
            }
            else {
                this.dashboardPersistenceData[lastVieweId][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailId][item.reportObjectId]["columnWidth"] = item.reportObjectWidth;
            }
            this.manageSubscription$.add(
                this.dashboardService.setDashboardPersistenceJson(
                    this._appConstants.userPreferences.UserBasicDetails.ContactCode,
                    DashboardConstants.dashboardDocumentType,
                    this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
                    JSON.stringify(this.dashboardPersistenceData)
                ).subscribe()
            );
        }
    }

    public getReportObjectWidthForPersistance = function (reportObjId: string, reportDetailsObjectId: string) {
        let persistenceData = this.dashboardPersistenceData;
        if (persistenceData[persistenceData.lastViewed] == undefined) {
            return AnalyticsCommonConstants.defaultWidthForReportObject;
        }
        if (!this._commUtils.isNune(persistenceData[persistenceData.lastViewed][this.selectedTab.tabId]))
            return AnalyticsCommonConstants.defaultWidthForReportObject;
        if (!this._commUtils.isNune(persistenceData[persistenceData.lastViewed][this.selectedTab.tabId][this.selectedTab.sectionId]))
            return AnalyticsCommonConstants.defaultWidthForReportObject;
        if (persistenceData[persistenceData.lastViewed][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailsObjectId] == undefined) {
            return AnalyticsCommonConstants.defaultWidthForReportObject;
        }
        if (persistenceData[persistenceData.lastViewed][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailsObjectId][reportObjId] == undefined) {
            return AnalyticsCommonConstants.defaultWidthForReportObject;
        }
        if (persistenceData[persistenceData.lastViewed][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailsObjectId][reportObjId]["columnWidth"] == undefined) {
            return AnalyticsCommonConstants.defaultWidthForReportObject;
        }

        return persistenceData[persistenceData.lastViewed][this.selectedTab.tabId][this.selectedTab.sectionId][reportDetailsObjectId][reportObjId].columnWidth;
    }

    public setPersistenceData = debounce((selectedDashboard, items, event, selectedTabId, selectedSectionId) => {
        let thisRef = this;
        /**
         *  The Code has written to  implement the same and save as for My View and Stadard Views.
         *  This code is common because we want to save this info in as report configuration instead of persistence api
         */
        if (items) {
            items.forEach(element => {
                let id: string = element.el.context.querySelector('.dashboard-card-container').getAttribute('id');
                if (id !== null && id != undefined) {
                    const widgetIndex: number = findIndex(thisRef._commUtils._widgetCards, ["cardId", id]);
                    if (widgetIndex >= 0) {
                        thisRef._commUtils._widgetCards[widgetIndex].layoutItemConfig.gridstackPosition.x = element.x;
                        thisRef._commUtils._widgetCards[widgetIndex].layoutItemConfig.gridstackPosition.y = element.y;
                        thisRef._commUtils._widgetCards[widgetIndex].layoutItemConfig.gridstackPosition.height = element.height;
                        thisRef._commUtils._widgetCards[widgetIndex].layoutItemConfig.gridstackPosition.width = element.width;
                        //Incase of global slider keeping the global slider object in sync so that persistance data is saved properly
                            thisRef.updateGlobalSliderObjectPersistance(element,id)
                    }
                }
            });
        }
        thisRef.cleanUnwantedReportsFromPersistence(selectedDashboard, selectedTabId, selectedSectionId);


        if (selectedDashboard.isOwn && items && thisRef._appConstants.userPreferences.moduleSettings.enablePersistanceOption) {
            if (selectedDashboard.viewId) {
                thisRef.dashboardPersistenceData.lastViewed = selectedDashboard.viewId;
            }
            //If the user click on change view and the selectedTabId and selectedSectionId is empty here we will check if the persistance api has the lastTab and lastSection data.
            //If data present use that data for the newly opened view.
            //If data not presenet set the selectedTabId and selectedSectionId as the id whose's sequence is 1
            if (thisRef.dashboardPersistenceData[selectedDashboard.viewId] && !this._commUtils.isNune(selectedTabId)) {
                selectedTabId = thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastTabId'];
                if (!selectedTabId) {
                    selectedTabId = this.getFirstTabInSequence(selectedDashboard);
                    thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastTabId'] = selectedTabId;
                }
            }
            if (thisRef.dashboardPersistenceData[selectedDashboard.viewId] && !this._commUtils.isNune(selectedSectionId)) {
                selectedSectionId = thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastSectionId'];
                if (!selectedSectionId) {
                    selectedSectionId = this.getFirstTabInSequence(selectedDashboard);
                    thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastSectionId'] = selectedSectionId;
                }
            }
            //If no data is present for this view create the data and store it.
            if (!thisRef.dashboardPersistenceData[selectedDashboard.viewId]) {
                thisRef.dashboardPersistenceData[selectedDashboard.viewId] = {};
                if (!this._commUtils.isNune(selectedTabId)) selectedTabId = this.getFirstTabInSequence(selectedDashboard);
                thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastTabId'] = selectedTabId;
                if (!this._commUtils.isNune(selectedSectionId)) selectedSectionId = this.getFirstSectionInFirstTab(selectedDashboard);
                thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastSectionId'] = selectedSectionId;
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId] = {};
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId] = {};

            }
            // set the data if the sectinoId and tabId is updated i.e. user clicks on new tab store it in persistance api.
            thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastTabId'] = selectedTabId;
            thisRef.dashboardPersistenceData[selectedDashboard.viewId]['lastSectionId'] = selectedSectionId;
            if (!thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId]) {
                let _dashboardPersistanceData = thisRef.dashboardPersistenceData[selectedTabId];
                _dashboardPersistanceData = this._commUtils.isNune(_dashboardPersistanceData) ? _dashboardPersistanceData : {};
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId] = {};
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId] = _dashboardPersistanceData;
            }

            items.forEach(element => {

                let id: string = element.el.context.querySelector('.dashboard-card-container').getAttribute('id');
                if (!(thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId].hasOwnProperty(id))) {
                    thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId] = {};
                    thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId] = {};
                    thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId][id] = {};
                }
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId][id].x = element.x;
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId][id].y = element.y;
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId][id].height = element.height;
                thisRef.dashboardPersistenceData[selectedDashboard.viewId][selectedTabId][selectedSectionId][id].width = element.width;
                thisRef.updateGlobalSliderObjectPersistance(element, id);
            });
            thisRef.manageSubscription$.add(
                thisRef.dashboardService.setDashboardPersistenceJson(
                    thisRef._appConstants.userPreferences.UserBasicDetails.ContactCode,
                    DashboardConstants.dashboardDocumentType,
                    thisRef._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
                    JSON.stringify(thisRef.dashboardPersistenceData)
                ).subscribe()
            );
            // this.gridstackChange$.next({event: event, items: items})
            if (selectedDashboard.isStandard) {
                thisRef._commUtils.getToastMessage(DashboardConstants.UIMessageConstants.STRING_SAVE_VIEW_TO_REFLECT_CHANGES);
            }
        }
        else if ((selectedDashboard.isStandard || selectedDashboard.iShared) && items && thisRef._appConstants.userPreferences.moduleSettings.enablePersistanceOption
            && event == null) {

            if (selectedDashboard.viewId) {
                thisRef.dashboardPersistenceData.lastViewed = selectedDashboard.viewId;
            }
            thisRef.manageSubscription$.add(
                thisRef.dashboardService.setDashboardPersistenceJson(
                    thisRef._appConstants.userPreferences.UserBasicDetails.ContactCode,
                    DashboardConstants.dashboardDocumentType,
                    thisRef._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
                    JSON.stringify(thisRef.dashboardPersistenceData)
                ).subscribe()
            );

        }
    },
        250,
        {
            'leading': false,
            'trailing': true
        });
    public updateGlobalSliderObjectPersistance(element, id) {
        const widgetIndex: number = findIndex(this._commUtils._widgetCards, ["cardId", id]);
        if (widgetIndex >=0 && this._commUtils._widgetCards[widgetIndex].componentId == DashboardConstants.GlobalSliderWidgetComponent) {
            let index = findIndex(this.appliedFilters, { ReportObjectId: id });
            if (index != -1) {
                this.appliedFilters[index].globalSliderObject.x = element.x;
                this.appliedFilters[index].globalSliderObject.y = element.y;
                this.appliedFilters[index].globalSliderObject.height = element.height;
                this.appliedFilters[index].globalSliderObject.width = element.width;
            }
            if (this._commUtils.isNune(this.tabDashletInfo)) {
                let _currentTabDetail: TabDetail = filter(this.tabDashletInfo.lstTabDetails, { tabId: this.selectedTab.tabId })[0];
                let index = findIndex(_currentTabDetail.lstAppliedTabFilters, { ReportObjectId: id });
                if (index != -1) {
                    _currentTabDetail.lstAppliedTabFilters[index].globalSliderObject.x = element.x;
                    _currentTabDetail.lstAppliedTabFilters[index].globalSliderObject.y = element.y;
                    _currentTabDetail.lstAppliedTabFilters[index].globalSliderObject.height = element.height;
                    _currentTabDetail.lstAppliedTabFilters[index].globalSliderObject.width = element.width;
                }
                else {
                    index = findIndex(_currentTabDetail.lstTabFilter,(x)=>{return x.reportObject.reportObjectId == id});
                    if (index != -1) {
                        _currentTabDetail.lstTabFilter[index].globalSliderObject.x = element.x;
                        _currentTabDetail.lstTabFilter[index].globalSliderObject.y = element.y;
                        _currentTabDetail.lstTabFilter[index].globalSliderObject.height = element.height;
                        _currentTabDetail.lstTabFilter[index].globalSliderObject.width = element.width;
                    }
                }
            }
        }

    }
    public applySavedFilters(_selectedView: ViewInfo, isInitializeWidget: boolean = true) {
        if (isInitializeWidget) {
            this.appliedFilters = [];
            //For global saved view filter
            if (_selectedView.lstDashboardFilters != undefined && _selectedView.lstDashboardFilters.length !== 0) {
                _selectedView.lstDashboardFilters.forEach((savedFilter) => {
                    this.appliedFilters.push(AnalyticsUtilsService.savedViewFilterToAppliedFilter(savedFilter, {
                        listAllCrossSuiteFilterMapping: this.listAllCrossSuiteFilterMapping,
                        listAllReportObjectWithMultiDatasource: this.listAllReportObjectWithMultiDatasource
                    },
                        this.FilterConditionMetadata)
                    );
                });
                // To create the slicer config.
                let lstOfSlicerFilter = filter(this.appliedFilters, { FilterIdentifier: DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource as any } );
                this.generateReportDetailForSlicerFilters(lstOfSlicerFilter);
                each(lstOfSlicerFilter, (_val: any) => {
                    this.slicerFilterConfig.get(_val.ReportObjectId).SelectedFilterList = map(_val.selectedFilterList, (_value: any) => {
                        return { Title: _value.title, IsPresentInData: true };
                    });
                });
                this.slicerFilterList.push(...lstOfSlicerFilter);
            }
        }
        this.mapTabAppliedFiltersToListTabFilters();
        //Creating global slider config
        this.createGlobalSliderConfig(this.appliedFilters,false,false,false);
        
        if (this._commUtils.isNune(this.tabDashletInfo)) {
            const index = findIndex(this.tabDashletInfo.lstTabDetails, { tabId: this.selectedTab.tabId });
            if(index !=-1)
            this.createGlobalSliderConfig(this.tabDashletInfo.lstTabDetails[index].lstAppliedTabFilters,false,false,true);
        }

    }
    public mapTabAppliedFiltersToListTabFilters() {
        //For individual tabs filters for all the tabs in the given selected View.
        each(this.tabDashletInfo.lstTabDetails, (_tabDetail: TabDetail) => {
            if (_tabDetail.lstTabFilter != undefined && _tabDetail.lstTabFilter.length !== 0) {
                each(_tabDetail.lstTabFilter, (savedFilter: any) => {
                    //We will check if this filter is not already present in lstAppliedTabFilter if not only then we will push it in lstAppliedTabFitlers
                    let index = findIndex(_tabDetail.lstAppliedTabFilters, (_tabFilter: any) => { return _tabFilter.ReportObjectId === savedFilter.reportObject.reportObjectId })
                    if (index === -1) {
                        _tabDetail.lstAppliedTabFilters.push(AnalyticsUtilsService.savedViewFilterToAppliedFilter(savedFilter, {
                            listAllCrossSuiteFilterMapping: this.listAllCrossSuiteFilterMapping,
                            listAllReportObjectWithMultiDatasource: this.listAllReportObjectWithMultiDatasource,
                        },
                            this.FilterConditionMetadata, true)
                        );
                    }
                });
            }
        });
    }
    public addHighchartLegendCSS(_elementRef: ElementRef, _renderer: Renderer2) {
        let legend_pagination = _elementRef.nativeElement.getElementsByClassName('highcharts-legend-navigation')
        let legend_item = _elementRef.nativeElement.getElementsByClassName('highcharts-legend-item')
        if (legend_pagination.length > 0) {
            _renderer.addClass(legend_pagination[0].parentElement, 'highcharts-custom-pagination');
            _renderer.addClass(legend_item[0].parentElement.parentElement, 'highcharts-custom-legends-items')
        }
        //let pagination_class = this._elementRef.nativeElement.getElementsByClassName('highcharts-custom-pagination')
    }

    public triggerGridstackDrag() {
        this.gridstackDrag.next('');
    }
    public updateSharedUserCount(sharedUserCount) {
        this.sharedUserCount = sharedUserCount;
        if (this.sharedUserCount == null) {
            this.sharedUserCount = 0;
        }
        else {
            this.sharedUserCount = sharedUserCount;
        }
    }
    // setGlobalFilterFlag(isFilterOpen) {
    //     this.isFilterOpen.next(isFilterOpen)
    // }

    // getGlobalFilterFlag(): Observable<boolean> {
    //     return this.isFilterOpen.asObservable();
    // }

    /**
     * The function is completely works on the Pure Functions,replacing attribute and sequence should be same
     * @param _attrName List of Attributes would like to replace from Main Object
     * @param _attrValue List of Values would like to replace from Main Value
     * @param _mainObjToReset Main Object to Replace
     */
    public resetValues(_attrName: Array<string>, _attrValue: Array<any>, _mainObjToReset: any) {
        _attrName.forEach((_atrName: string, _atrKey: any) => {
            _mainObjToReset[_atrName] = _attrValue[_atrKey]
        });
    }

    public openCellLinkInNewTab(cellData: string) {
        let DocumentLink = typeof (cellData) == 'string' && cellData.split('^').length > 1 ? cellData.split('^')[1] : "";
        if (DocumentLink.length > 0) {
            window.open(DocumentLink, '_blank');
        }
    }

    public disableSaveWhenCrossProductFilter(_renderer2: Renderer2) {
        //Not allowed to save the view when cross product filters have been applied on view.
        const headerMenuSaveBtn = document.getElementById('header-menu-save-btn');
        _renderer2.addClass(headerMenuSaveBtn, 'disableSave');
    }

    public fillFilterPanelList(isTabFilter: boolean = false) {
        let lstFilter = isTabFilter ?
            filter(this.tabDashletInfo.lstTabDetails, { tabId: this.selectedTab.tabId })[0].lstAppliedTabFilters : this.appliedFilters;
        lstFilter = filter(lstFilter, { enabledAsGlobalSlider: false });
        this.setFilterPanelList(lstFilter);
    }

    public fillFilterPanelListOnOpenView() {
        this.setFilterPanelList(this.appliedFilters);
        this.setFilterPanelList(filter(this.tabDashletInfo.lstTabDetails, { tabId: this.selectedTab.tabId })[0].lstAppliedTabFilters);
    }

    public getOppfinderData(): Observable<any> {
        return this.oppfinderOnPaginationDataUpdate.asObservable();
    }

    public setOppfinderData(oppfinderData): void {
        this.oppfinderOnPaginationDataUpdate.next(oppfinderData);
    }

    public truncateDashboardCardTitle(elementRef: ElementRef, cardData, isCardHeaderComp, isFromSubHeader) {
        let dashboardCardHeaderListEleWidth;
        if (isCardHeaderComp) {
            dashboardCardHeaderListEleWidth = elementRef.nativeElement.querySelector('#dashboard-card-header-' + cardData.cardId).offsetWidth;
            if (dashboardCardHeaderListEleWidth)
                document.getElementById('dashboard-card-title-' + cardData.cardId).style.maxWidth = this.calcDashbaordCardTitleHeightOnDrive(dashboardCardHeaderListEleWidth, cardData);
        }
        else if (isFromSubHeader) {
            dashboardCardHeaderListEleWidth = document.getElementById('dashboard-card-header-' + cardData.cardId).offsetWidth;
            if (dashboardCardHeaderListEleWidth)
                document.getElementById('dashboard-card-title-' + cardData.cardId).style.maxWidth = this.calcDashbaordCardTitleHeightOnDrive(dashboardCardHeaderListEleWidth, cardData);;
        }
        else {
            dashboardCardHeaderListEleWidth = document.getElementById('dashboard-card-header-' + cardData.cardId).offsetWidth;
            if (dashboardCardHeaderListEleWidth)
                elementRef.nativeElement.querySelector('#dashboard-card-title-' + cardData.cardId).style.maxWidth = this.calcDashbaordCardTitleHeightOnDrive(dashboardCardHeaderListEleWidth, cardData);
        }
    }

    public calcDashbaordCardTitleHeightOnDrive(cardHeaderHeight, cardData) {
        let cardTitleWidth;
        if (cardData.driveConfig.isDriver) {
            cardTitleWidth = 'calc(100% - ' + (cardHeaderHeight + 100) + 'px' + ')';
        }
        else {
            cardTitleWidth = 'calc(100% - ' + (cardHeaderHeight + 40) + 'px' + ')';
        }
        return cardTitleWidth;
    }

    // function to calculate breadcrumb list width
    public calcBreadcrumbWidth(cardId, breadcrumbConfig) {
        setTimeout(function () {
            let cardID = cardId;
            let dashboardCardContainerEle = document.querySelector('.dashboard-container');
            if (dashboardCardContainerEle) {
                let breadCrumbContainerEle = dashboardCardContainerEle.querySelector("#breadCrumb-container-" + cardID) as HTMLElement;
                if (breadCrumbContainerEle) {
                    let breadcrumbListItemContainer = breadCrumbContainerEle.querySelector('#breadcrumb-list-container-' + cardID)
                    if (breadcrumbListItemContainer) {

                        let breadcrumbListItem: NodeListOf<Element> = breadcrumbListItemContainer.querySelectorAll('.breadcrumb')
                        if (breadcrumbListItem.length == 1) {
                            let maxWidth = ((breadCrumbContainerEle.offsetWidth / breadcrumbConfig.activeBreadCrumbList.length) - 130) + 'px';
                            for (let list of breadcrumbListItem as any) {
                                list.style.maxWidth = maxWidth;
                            }
                        } else {
                            let maxWidth = ((breadCrumbContainerEle.offsetWidth / breadcrumbConfig.activeBreadCrumbList.length) - 80) + 'px';
                            for (let list of breadcrumbListItem as any) {
                                list.style.maxWidth = maxWidth;
                            }
                        }
                    }
                }
            }
        }, 500);
    }

    public calculateBreadcrumbWidth(breadCrumbList: Array<any>, config: any, uiConfig: any, isFullscreenMode: boolean) {
        // this.destroyTimeout = setTimeout(() => {
        if (breadCrumbList.length > 0 && uiConfig.showCurrentlyViewing) {
            if (!isFullscreenMode) {
                this.calcBreadcrumbWidth(config.config.cardId, config.config.breadCrumbUIConfig)
            }
            else {
                this.calcBreadcrumbWidth(config.cardId, config.breadCrumbUIConfig)
            }

        }
        // }, 200);
    }

    public generateReportDetailForSlicerFilters(filterTabList): void {
        let lstOfSlicerFilter = [];
        if (this.slicerFilterConfig.size) {
            this.slicerFilterConfig.forEach((value, key) => {
                if (this.slicerFilterConfig.get(key).FilterObject.values.length)
                    lstOfSlicerFilter.push(this.slicerFilterConfig.get(key).FilterObject);
            });
        }
        let listOfReportDetails: Array<ReportDetails> = [];
        each(filterTabList, (_filterObject: any, _index: number) => {
            //Only create for those slicer which are not already present in the slicerConfig.
            if (!this._commUtils.isNune(this.slicerFilterConfig.get(_filterObject.ReportObjectId))) {
                let reportObject = new ReportObject();
                let lstReportObject = [];
                let lstSortReportObject = [];
                let reportDetails = new ReportDetails();

                reportObject = {
                    reportObjectId: _filterObject.ReportObjectId,
                    reportObjectName: _filterObject.ReportObjectName,
                    displayName: _filterObject.DisplayName,
                    layoutArea: AnalyticsCommonConstants.ReportObjectLayoutArea.Rows,
                    reportObjectType: _filterObject.ReportObjectType,
                    reportObjectDataType: _filterObject.ReportObjectDataType,
                    filterType: _filterObject.FilterType,
                    isDrill: _filterObject.IsDrill,
                    expression: _filterObject.Expression,
                    parentReportObjects: _filterObject.ParentReportObjects,
                    dataSource_ObjectId: _filterObject.DataSource_ObjectId,
                    isLinkActive: false,
                    isStandardFilterRO: false,

                } as ReportObject


                lstReportObject.push(reportObject);

                lstSortReportObject.push(this.getSortReportObject(reportObject));

                reportDetails = {
                    ConditionalFormattingConfigurationDetails: "",
                    ReportColorConfigurationDetails: '',
                    dataSourceType: AnalyticsCommonConstants.DataSourceType.Tabular,
                    isGNG: false,
                    isGrandTotalRequired: false,
                    isPercentageEnabledSummaryCard: false,
                    isSubTotalRequired: false,
                    dataSourceObjectId: _filterObject.DataSource_ObjectId,
                    pageIndex: 1,
                    pageSize: 7,
                    reportRequestKey: this._commUtils.getGUID(),
                    lstReportObject: lstReportObject,
                    lstSortReportObject: lstSortReportObject,
                    lstFilterReportObject: [],
                    reportViewType: AnalyticsCommonConstants.ReportViewType.Flex,
                    isLazyLoadingRequired: true,
                } as ReportDetails

                reportDetails.lstFilterReportObject.push(...this.lstOfGlobalFilters);
                let slicerFilterObject: any = {
                    FilterIdentifierType: DashboardConstants.FilterIdentifierType.SlicerFilter,
                    NestedReportFilterObject: null,
                    SetConditionalOperator: DashboardConstants.ConditionalOperator.Nan,
                    operators: _filterObject.FilterType === DashboardConstants.FilterType.Year ? DashboardConstants.ReportObjectOperators.Is :
                        DashboardConstants.ReportObjectOperators.In,
                    reportObject: reportObject,
                    values: [],

                }
                //let tempFilterList = reportDetails.lstFilterReportObject;
                let tempFilterList = filter(reportDetails.lstFilterReportObject, (_val: any) => {
                    return _val.filterValue != "-1";
                });
                reportDetails.lstFilterReportObject = [];
                //We wil first map the globalfilter metadata from data. and then push it into the reportDetails of this slicer filer.
                AnalyticsMapperService.MapFilterObjectMetaDataToData(reportDetails, tempFilterList);
                //Then we will push the slicerFilters which are already in data format.
                //reportDetails.lstFilterReportObject.push(...lstOfSlicerFilter);
                let slicerFilter: ISlicerFilterConfig = {
                    ReportDetail: reportDetails,
                    SelectedFilterList: [],
                    FilterObject: slicerFilterObject,
                    SlicerLoaderConfig: this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardLoaderConfig),
                    SearchConfig: {
                        IsSearchActive: false,
                        ShowSearchClose: false,
                        SearchText: ''
                    },
                    SlicerSubscription: '',
                    Message: DashboardConstants.UIMessageConstants.STRING_SLICER_NO_DATA_RETURNED_TXT,
                    SlicerFilterExpanded: true,
                }
                this.slicerFilterConfig.set(reportObject.reportObjectId, slicerFilter);
                // listOfReportDetails.push(reportDetails);
            }
        });
        // return listOfReportDetails;
    }

    public getSortReportObject(reportObject: ReportObject) {
        let reportSort = new SortReportObject();
        reportSort.reportObject = reportObject;
        return reportSort;
    }

    public getNewTabObject(value, sectionDetail): ITabDetail {
        return {
            tabId: this._commUtils.getGUID(),
            tabName: value,
            tabSequence: this.dashboardTabsList.length + 1,
            isDeleted: false,
            lstSectionInfo: [sectionDetail]
        };
    }

    public getNewSectionObject(): ISectionInfo {
        return {
            sectionId: this._commUtils.getGUID(),
            sectionName: 'Default_Section',
            isDeleted: false,
            sectionSequence: 1
        };
    }

    public updateAddToDashboardList() {
        if (this.listofDistinctWidgetDataSource.length > 1) {
            this.addToDashboardList = [
                {
                    title: 'Tab',
                    id: 2,
                    dataAutomationID: 'AddTab',
                    showOption: this._appConstants.userPreferences.moduleSettings.showMoveToTab
                }
            ];
        }
        else if (this.listofDistinctWidgetDataSource.length === 1) {
            this.addToDashboardList = [
                {
                    title: 'Widget',
                    id: 1,
                    dataAutomationID: 'AddWidget',
                    showOption: true

                },
                {
                    title: 'Tab',
                    id: 2,
                    dataAutomationID: 'AddTab',
                    showOption: this._appConstants.userPreferences.moduleSettings.showMoveToTab
                }
            ];
        }
    }
    /* This function updates listOfWidgetDistinctDataSource when a card or tab  is removed */
    public updateListDistinctDataSourceWhenCardOrTabRemoved() {
        each(
            this.tabDashletInfo.lstTabDetails, _tab => {
                each(_tab.lstSectionInfo, _section => {
                    each(_section.lstDashletInfo, _dashletInfo => {
                        if (!_dashletInfo.isRemoved) {
                            this.listofDistinctWidgetDataSource.push(_dashletInfo.reportDetails.dataSourceObjectId);
                        }
                    });
                });
            }
        );
        this.listofDistinctWidgetDataSource = uniq(this.listofDistinctWidgetDataSource).sort();
        this.updateAddToDashboardList();
    }

    getFirstTabInSequence(selectedDashboard) {
        let selectedTabId: any = filter(selectedDashboard.lstTabInfo, { tabSequence: 1 })[0];
        selectedTabId = selectedTabId.tabId;
        return selectedTabId;
    }

    getFirstSectionInFirstTab(selectedDashboard) {
        let selectedSectionId: any = filter(selectedDashboard.lstTabInfo, { tabSequence: 1 })[0];
        selectedSectionId = selectedSectionId.sectionId;
        return selectedSectionId;
    }

    public getDataSourceListForGivenTab(tab: TabDetail) {
        let lstOfDataSource = [];
        each(tab.lstSectionInfo, _section => {
            each(_section.lstDashletInfo, _dashletInfo => {
                if (!_dashletInfo.isRemoved) {
                    lstOfDataSource.push(_dashletInfo.reportDetails.dataSourceObjectId);
                }
            });
        });
        return uniq(lstOfDataSource).sort();;
    }

    public setFilterPanelList(lstFilter) {
        for (let item of lstFilter) {
            item.filterPanelList = [];
            if (item.FilterType.toString() == DashboardConstants.DAXQueryManipulate.AllRecords) {
                item.filterPanelList.push({ "title": item.filterChipName, "isStriked": false })
            }
            else {
                if (item.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
                    if (item.selectedFilterList.length > 0) {
                        for (let list of item.selectedFilterList) {
                            if (list.IsSelected) {
                                if (list.title == DashboardConstants.DAXQueryManipulate.AllRecords) {
                                    item.filterPanelList.push({ "title": "All Selected", "isStriked": false })
                                }
                                else if (list.title == '') {
                                    item.filterPanelList.push({ "title": DashboardConstants.DAXQueryManipulate.EmptyFiltersData, "isStriked": false })
                                }
                                else {
                                    item.filterPanelList.push({ "title": list.title, "isStriked": false })
                                }

                            }
                        }
                    }
                    else {
                        //Added fo period RO's
                        item.filterPanelList.push({ "title": item.filterChipName, "isStriked": false })
                    }
                }

                else if (item.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
                    item.filterPanelList.push({ "title": item.filterChipName, "isStriked": false })
                }

            }

        }
    }
    public createGlobalSliderConfig(validatedTabs,applyGlobalFilter: boolean = false, applyFilterPanel: boolean = false,isTabFilter:boolean = false) {
        // let globalSliderConfigArray: Array<any> = new Array<any>();
        let enabledGlobalSliderObject: any = !applyFilterPanel ? filter(validatedTabs, { 'enabledAsGlobalSlider': true }) : filter(validatedTabs, { 'enabledAsGlobalSlider': false });
        let sliderFilterDetailsObj: any;
        this.globalSliderConfigArray = [];
        enabledGlobalSliderObject.forEach((itemFilterobj) => {
            let globalSliderFilterArray = new Array<any>();
            itemFilterobj.FilterIdentifier = itemFilterobj.enabledAsGlobalSlider ? DashboardConstants.ViewFilterType.GlobalSliderFilterSingleDataSource : itemFilterobj.FilterIdentifier;
            if (applyGlobalFilter && !applyFilterPanel) {
                itemFilterobj.globalSliderObject.globalSliderMin = this._commUtils.isNune(itemFilterobj.FilterConditionRangeValue) && itemFilterobj.FilterConditionRangeValue.from != "" ? parseInt(itemFilterobj.FilterConditionRangeValue.from
                ) : 0;
                itemFilterobj.globalSliderObject.globalSliderMax = this._commUtils.isNune(itemFilterobj.FilterConditionRangeValue) && itemFilterobj.FilterConditionRangeValue.to != "" ? parseInt(itemFilterobj.FilterConditionRangeValue.to
                ) : 0;
            }
            sliderFilterDetailsObj = {
                reportObjectName: itemFilterobj.DisplayName,//'Spend(USD)',
                reportObjectId: itemFilterobj.ReportObjectId, //'4b984748-1cbe-4ced-836a-17163c58f874',
                min: this._commUtils.isNune(itemFilterobj.globalSliderObject) && itemFilterobj.globalSliderObject.globalSliderMin != "" ? parseInt(itemFilterobj.globalSliderObject.globalSliderMin
                ) : 0,
                max: this._commUtils.isNune(itemFilterobj.globalSliderObject) && itemFilterobj.globalSliderObject.globalSliderMax != "" ? parseInt(itemFilterobj.globalSliderObject.globalSliderMax) : 100,
                range: {
                    // from: minValue,
                    // to: maxValue
                    from: this._commUtils.isNune(itemFilterobj.FilterConditionRangeValue) && itemFilterobj.FilterConditionRangeValue.from != ""? parseInt(itemFilterobj.FilterConditionRangeValue.from
                    ) : 0,
                    to: this._commUtils.isNune(itemFilterobj.FilterConditionRangeValue) && itemFilterobj.FilterConditionRangeValue.to != ""? parseInt(itemFilterobj.FilterConditionRangeValue.to) : 100
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
                    message: (itemFilterobj.FilterConditionOperator.op == 14 ? "Between" :"Not between")+" filter applied",
                    position: "top"
                },
                enabledAsGlobalSlider: itemFilterobj.enabledAsGlobalSlider,
                isTabFilter: isTabFilter
            };
            // let index: number = findIndex(this.appliedFilters, { ReportObjectId: itemFilterobj.ReportObjectId });
            // if (index != -1) {
            //     this.appliedFilters[index].globalSliderObject.globalSliderMin = sliderFilterDetailsObj.min;
            //     this.appliedFilters[index].globalSliderObject.globalSliderMax = sliderFilterDetailsObj.max;        

            // }
            globalSliderFilterArray.push(sliderFilterDetailsObj);
            this.globalSliderConfigArray.push(
                this.generateGlobalSliderCardConfig(itemFilterobj,globalSliderFilterArray)
            );

        });     
    }
    public generateGlobalSliderCardConfig(obj, sliderFilterArray) {
        if (!this._commUtils.isNune(obj.globalSliderObject)) {
            obj.globalSliderObject = new GlobalSliderObject();
        }
        // let globalSliderObject: GlobalSliderObject = new GlobalSliderObject(JSON.parse(obj.globalSliderObject));
        const cardConfig: CardConfigNode =
        {
            isAccessibleReport: true,
            cardId: obj.ReportObjectId,
            cardTitle: obj.DisplayName,
            manifestId: DashboardConstants.GlobalSliderWidgetComponent,
            componentId: DashboardConstants.GlobalSliderWidgetComponent,
            classId: obj.ReportObjectId,
            widgetDataType: '',
            cardType: DashboardConstants.WidgetDataType.GlobalSliderWidget,
            showEdit: false,
            sliderFilterArray: sliderFilterArray,
            breadCrumb: [],
            showSliderWidget: false,
            showSliderLoader: false,
            isExpandedGraph: false,
            isRemoved: false,
            rowIndex: 0,
            linkViewId: '',
            sort: {
                items: [],
                isActive: false,
                showSort: false,
                selectedIndex: 0,
                appliedSort: []
            },
            btnRangeApplyConfig: this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartButtonConfig),
            layoutItemConfig: {
                gridstackPosition: {
                    x: this._commUtils.isNune(obj.globalSliderObject.x) ? obj.globalSliderObject.x : 0,
                    y: this._commUtils.isNune(obj.globalSliderObject.y) ? obj.globalSliderObject.y : 0,
                    width: this._commUtils.isNune(obj.globalSliderObject.width) ? obj.globalSliderObject.width : 2,
                    height: this._commUtils.isNune(obj.globalSliderObject.height) ? obj.globalSliderObject.height : 2,
                    minWidth: this._commUtils.isNune(obj.globalSliderObject.minWidth) ? obj.globalSliderObject.minWidth : 2,
                    minHeight: this._commUtils.isNune(obj.globalSliderObject.minHeight) ? obj.globalSliderObject.minHeight : 2
                }
            },
            config: {},
            sliderConfig: [
            ],
            reportDetails: obj.reportDetails,
            uiConfig: {
                showBreadCrumOption: false,
                showSortOption: false,
                showFilterOption: false,
                showFullScreenOption: false,
                showKebabMenusOption: false,
                showTitle: false,
                showPercentageSummaryCard: false,
                kebabMenuOptions: false,
              showCurrentlyViewing: false
            },
            reportRequestKey: '',
            pageIndex: 1,
            chartMinMax: [],
            driveConfig: {
                isDriver: false,
                isDriven: false,
                driveConfigDescription: '',
                driveActive: false
                //isCrosssSuiteFilterApplied: false
            }
        };


        return cardConfig;
    }
    public loadTabFilter() {
        this.loadTabFilter$.next(true);
    }
}
