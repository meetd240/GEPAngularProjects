import { Component, Input, ViewChild, ViewContainerRef, TemplateRef, ElementRef, Renderer2, ChangeDetectionStrategy } from "@angular/core";
import { DashboardService } from "@vsDashboardService/dashboard.service";
import { each, find, findIndex, map, sortBy, filter } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardCommService } from "@vsDashboardCommService";
import { DashboardConstants } from "@vsDashboardConstants";
import { ITabInfo } from "interfaces/common-interface/app-common-interface";
import { LoaderService } from "@vsLoaderService";
import { AnalyticsCommonMetadataService } from "@vsAnalyticsCommonService/analytics-common-metadata.service";

@Component({
    selector: 'dashboard-tabs',
    templateUrl: './dashboard-tabs.component.html',
    styleUrls: ['./dashboard-tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class DashboardTabsComponent {

    @Input() config: any;
    @Input() api: any;

    @ViewChild("popupContainer", { read: ViewContainerRef }) popupContainerRef: ViewContainerRef;
    @ViewChild("manageTabsTemplate") manageTabsTemplateRef: TemplateRef<any>;
    manageSubscription$: Subscription = new Subscription();
    showManageTabsIcon: boolean = true;

    ngOnInit() {
        this._loaderService.hideGlobalLoader();
        this.showManageTabsIcon = this._dashboardCommService.HasUserVisionEditActivity && this._dashboardCommService.selectedViewInfo.isOwn;
    }

    constructor(
        private _elementRef: ElementRef,
        private _analyticsMetaDataService: AnalyticsCommonMetadataService,
        private _commutils: CommonUtilitiesService,
        private _dashboardCommService: DashboardCommService,
        private _loaderService: LoaderService
    ) {
    }

    onDeinitialize(event) {

    }
    onActivate(event) {

    }

    onInitialize(event) {

    }

    //open manage tabs popup
    openManageTabsPopup() {
        if (this.config.length > 0) {
            this.popupContainerRef.clear();
            this.popupContainerRef.createEmbeddedView(this.manageTabsTemplateRef, {
                manifestPath: 'manage-tabs/manage-tabs',
                config: {
                    config: {
                        api: {
                            doneClick: (value) => { this.manageTabsDoneCallback(value) },
                            cancelClick: () => { this.manageTabsCancelCallback(); }
                        },
                        manageTabsList: this.config
                    }
                }
            });
        }

    }

    manageTabsCancelCallback() {
        this.popupContainerRef.detach();
        this.popupContainerRef.clear();

    }

    // set active true of tab on click 
    onDashboardTabChange(tab) {
        let activeTab: ITabInfo;
        let tabEle = this._elementRef.nativeElement.querySelector('#dashboard-tab-' + tab.id)
        for (var i = 0; i < this.config.length; i++) {
            if (tab.title === this.config[i].title) {
                this.config[i].isActive = true;
                activeTab = this.config[i];
            }
            else {
                this.config[i].isActive = false;
            }
        }
        this.api.onTabChange(activeTab);

    }

    deleteTabs(values) {
        let lstTabId = [];
        each(values, _tab => { lstTabId.push(_tab.tabId) });
        return this._analyticsMetaDataService.deleteTabDetails(lstTabId, values[0].viewId);
    }

    updateTabSequenceAndName(values) {
        return this._analyticsMetaDataService.updateTabsDetail(values.tabList, values.viewId);
    }

    deleteTabFiltersByTabId(tabId) {
        return this._analyticsMetaDataService.deleteTabFiltersByTabId(tabId);
    }

    manageTabsDoneCallback(value: Map<string, any>) {
        let promiseArray = [];
        this._loaderService.showGlobalLoader();
        if (this._commutils.isNune(value.get(DashboardConstants.TabAction.ResetTabs))) {
            this.resetTheTabsValueToDefault(value.get(DashboardConstants.TabAction.ResetTabs), value.get(DashboardConstants.TabAction.DeleteTab));
        }
        else if (this._commutils.isNune(value.get(DashboardConstants.TabAction.DeleteTab))) {
            this.deleteTabDetails(value.get(DashboardConstants.TabAction.DeleteTab), value.get(DashboardConstants.TabAction.RearrangeTab));
        }
        else if (
            this._commutils.isNune(value.get(DashboardConstants.TabAction.RearrangeTab)) ||
            this._commutils.isNune(value.get(DashboardConstants.TabAction.RenameTab))
        ) {
            let updateDetails = this._commutils.isNune(value.get(DashboardConstants.TabAction.RearrangeTab)) ? value.get(DashboardConstants.TabAction.RearrangeTab) :
                value.get(DashboardConstants.TabAction.RenameTab);
            this.updateTabDetails(updateDetails);
        }
        this.popupContainerRef.detach();
        this.popupContainerRef.clear();
    }


    resetTheTabsValueToDefault(updateTabDetails, deleteTabsDetails) {
        if (deleteTabsDetails.length) {
            this._commutils.getConfirmMessageDialog(`Deleting this tab can't be undone. Are you willing to continue?`,
                [
                    DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
                    DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
                ], (_response: any) => {
                    if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
                        this.manageSubscription$.add(
                            this.deleteTabs(deleteTabsDetails).subscribe(_resp => {
                                if (this._commutils.isNune(_resp) && _resp.toLowerCase() === 'true') {
                                    this.resetTabValsToDefault(updateTabDetails);
                                }
                            })
                        );
                    }
                    else {
                        this._loaderService.hideGlobalLoader();
                    }
                });
        }
        else {
            this.resetTabValuesToDefaultValue(updateTabDetails);
        }
    }


    deleteTabDetails(deleteTabDetails, updateTabSequence) {
        this._commutils.getConfirmMessageDialog(`Deleting this tab can't be undone. Are you willing to continue?`,
            [
                DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ], (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
                    this.manageSubscription$.add(
                        this.deleteTabs(deleteTabDetails).subscribe(_response => {
                            if (this._commutils.isNune(_response) && _response.toLowerCase() === 'true') {
                                each(deleteTabDetails, (_tab) => {
                                    let _index = findIndex(this._dashboardCommService.dashboardTabsList, { 'tabId': _tab.tabId });
                                    this._dashboardCommService.dashboardTabsList.splice(_index, 1);
                                    _index = findIndex(this._dashboardCommService.tabDashletInfo.lstTabDetails, { 'tabId': _tab.tabId });
                                    this._dashboardCommService.tabDashletInfo.lstTabDetails.splice(_index, 1);
                                });
                                // this._dashboardCommService.listofDistinctWidgetDataSource = [];
                                // this._dashboardCommService.updateListDistinctDataSourceWhenCardOrTabRemoved();
                                this._commutils.getToastMessage('Tab(s) were deleted sucessfully.');
                                this.api.onTabDelete();
                                this.updateTabSequenceAndName(updateTabSequence).subscribe(_res => {
                                    this.resetTabValuesAndUpdateTheComponent(updateTabSequence);
                                    //this._dashboardCommService.triggerSaveDashboard();
                                });
                            }
                        })
                    );
                }
                else {
                    this._loaderService.hideGlobalLoader();
                }
            });
    }

    updateTabDetails(updateDetails) {
        this.manageSubscription$.add(
            this.updateTabSequenceAndName(updateDetails).subscribe(_response => {
                if (
                    this._commutils.isNune(_response) && _response.toLowerCase() != 'false'
                ) {
                    this.resetTabValuesAndUpdateTheComponent(updateDetails);
                }
                else {
                    this._loaderService.hideGlobalLoader();
                    this._commutils.getToastMessage('Error occurred. Please try again. ');
                }
            })
        );
    }

    resetTabValuesAndUpdateTheComponent(updateTabSequence) {
        each(updateTabSequence.tabList, (_tab) => {
            let _index = findIndex(this._dashboardCommService.dashboardTabsList, { 'tabId': _tab.tabId });
            if (_index != -1) {
                this._dashboardCommService.dashboardTabsList[_index].tabSequence = _tab.tabSequence;
                this._dashboardCommService.dashboardTabsList[_index].title = _tab.tabName;
            }
            _index = findIndex(this._dashboardCommService.selectedViewInfo.lstTabInfo, { 'tabId': _tab.tabId });
            if (_index != -1) {
                this._dashboardCommService.selectedViewInfo.lstTabInfo[_index].tabSequence = _tab.tabSequence;
                this._dashboardCommService.selectedViewInfo.lstTabInfo[_index].tabName = _tab.tabName;
            }
            _index = findIndex(this._dashboardCommService.tabDashletInfo.lstTabDetails, { tabId: _tab.tabId });
            if (_index != -1) {
                this._dashboardCommService.tabDashletInfo.lstTabDetails[_index].tabSequence = _tab.tabSequence;
                this._dashboardCommService.tabDashletInfo.lstTabDetails[_index].tabName = _tab.tabName;
            }
        });
        let _isActiveTabPresent = filter(this._dashboardCommService.dashboardTabsList, { tabId: this._dashboardCommService.selectedTab.tabId })[0];
        //When the user deletes the tab which is currenlty the active tab then we will reset the active tab and set the active tab to the
        //tab whose sequence is 1 and call the onTabChange for this newly active tab.
        if (!this._commutils.isNune(_isActiveTabPresent)) {
            this._dashboardCommService.selectedTab = filter(this._dashboardCommService.dashboardTabsList, { tabSequence: 1 })[0];
            this._dashboardCommService.selectedTab.isActive = true;
            this.api.onTabChange(this._dashboardCommService.selectedTab, true);
        }
        this._dashboardCommService.dashboardTabsList = sortBy(this._dashboardCommService.dashboardTabsList, ['tabSequence']);
        this._dashboardCommService.setPersistenceData(
            {
                isOwn: this._dashboardCommService.selectedViewInfo.isOwn,
                viewId: this._dashboardCommService.selectedViewInfo.viewId,
                isStandard: this._dashboardCommService.selectedViewInfo.isStandard,
                iShared: this._dashboardCommService.selectedViewInfo.iShared
            }, [], null, this._dashboardCommService.selectedTab.tabId, this._dashboardCommService.selectedTab.sectionId);
        this._dashboardCommService.setDashboardTabsList(this._dashboardCommService.dashboardTabsList);
        this._loaderService.hideGlobalLoader();
    }


    resetTabValuesToDefaultValue(updateTabDetails) {
        this._commutils.getConfirmMessageDialog(`Deleting this tab can't be undone. Are you willing to continue?`,
            [
                DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ], (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
                    this.resetTabValsToDefault(updateTabDetails);
                }
                else{
                    this._loaderService.hideGlobalLoader();
                }
            });
    }

    public resetTabValsToDefault(updateTabDetails: Array<any>) {
        let promiseArray = [
            this.updateTabSequenceAndName(updateTabDetails),
            this.deleteTabFiltersByTabId(this._dashboardCommService.dashboardTabsList[0].tabId)
        ]
        this.manageSubscription$.add(
            Observable.forkJoin(
                promiseArray
            ).subscribe((_response) => {
                if (this._commutils.isNune(_response[0]) && _response[0].toLowerCase() != 'false' &&
                    this._commutils.isNune(_response[1]) && _response[1].toLowerCase() != 'false'
                ) {
                    this._commutils.getToastMessage('Tab(s) were deleted sucessfully.');
                    this._dashboardCommService.dashboardTabsList = this._dashboardCommService.dashboardTabsList.slice(0, 1);
                    this._dashboardCommService.dashboardTabsList[0].title = 'Default_Tab';
                    this._dashboardCommService.dashboardTabsList[0].isStriked = false;
                    this._dashboardCommService.dashboardTabsList[0].tabSequence = 1;
                    this._dashboardCommService.showMoveToOption = false;
                    this._dashboardCommService.updateKebabMenuOption();
                    if (this._dashboardCommService.dashboardTabsList.length === 1) {
                        this._dashboardCommService.tabDashletInfo.lstTabDetails[0].tabName = 'Default_Tab';
                        this._dashboardCommService.tabDashletInfo.lstTabDetails[0].tabSequence = 1;
                        this._dashboardCommService.tabDashletInfo.lstTabDetails = [this._dashboardCommService.tabDashletInfo.lstTabDetails[0]];
                        this._dashboardCommService.removeTabLevelFilters();
                        this._dashboardCommService.loadTabFilter();
                    }
                    this._dashboardCommService.setDashboardTabsList(this._dashboardCommService.dashboardTabsList);
                    //this._dashboardCommService.triggerSaveDashboard();
                    this._loaderService.hideGlobalLoader();
                }
            })
        )
    }

    ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
    }

    trackByTabId(index: number, tab: any) {
        return tab.tabId;
    }

}
