import { Component, OnInit, Input, ViewContainerRef, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
// import { LazyComponentConfiguration } from '../../../modules-manifest';
import { DashboardConstants } from '@vsDashboardConstants';
import { find } from 'lodash';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { ViewInfo } from '@vsViewFilterModels/view-info.model';
import { AppConstants } from 'smart-platform-services';
import { UserInfo } from 'shared/models/userDetails/user-details';
import { IUserDetails } from 'interfaces/common-interface/app-common-interface';
import { DashboardService } from '@vsDashboardService/dashboard.service';
import { Subscription } from 'rxjs';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';


@Component({
    selector: 'dashboard-view-popup',
    templateUrl: './dashboard-views-popup.component.html',
    styleUrls: ['./dashboard-views-popup.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
export class DashboardViewsPopupComponent implements OnInit, OnDestroy {
    // static componentId = LazyComponentConfiguration.DashboardViewsPopup.componentName;
    @Input() config: any;
    @ViewChild('dashboardViewContainer', { read: ViewContainerRef }) dashboardViewContainerRef: ViewContainerRef;
    @ViewChild('dashboardViewsListTemplate') dashboardViewsListTemplateRef: TemplateRef<any>;
    @ViewChild('dashboardViewsListEmptyTemplate') dashboardViewsListEmptyTemplate: TemplateRef<any>;
    shareDashBoardUnShareTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.shareDashBoardUnShareTooltipConfig);
    dashboardViewsTypes = DashboardConstants.DashboardViewsTypes;
    dashboardViews: any;
    myViews = [];
    standardViews = [];
    sharedViews = [];
    dashboardViewsList: any = [];
    selectedView: any;
    currentSelectedViewType: any;
    serachMyViewFilterList: any = [];
    serachStandardViewFilterList: any = [];
    serachShareViewFilterList: any = [];
    serachViewFilterList: any = [];
    ViewID: any;
    isSelectedView: boolean;
    standardViewText: any;
    readonly sharedViewText: string = `${DashboardConstants.UIMessageConstants.STRING__Share_Dashboard_Created} ${DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_BY}`;
    lastSelectedView: any;
    searchKeyText = { "value": '' };
    currentSelectedView: any;
    sharedUserList: any;
    allUserList: Array<IUserDetails> = [];
    unShareUser: Array<UserInfo> = [];
    selecatedSharedView: any;
    isSharedWithMeViewSelecated: any;
    shareDashboardPopupConfig: any;
    doneBtnConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_OK_BTN_TEXT,
        flat: true,
    };
    cancelBtnConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
        flat: true,
    };
    linkBtnConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_LINK_BTN_TEXT,
        flat: true,
    }
    currentViewCollection: any = [];
    searchListConfig: any = {
        label: '',
        data: 'value',
    };
    isDrillDownViewEnabled: boolean = false;
    tempDashboardViewList: any;
    constants = DashboardConstants;
    manageSubscription$: Subscription = new Subscription();
    constructor(
        private _commUtils: CommonUtilitiesService,
        private _dashboardService: DashboardService,
        public _appConstants: AppConstants,
        private changeDetectorRef: ChangeDetectorRef,
    ) {

    }

    public ngOnInit() {
        this.filterDashboardViewfromProductName();
        this.dashboardViews = this.config.viewType
        this.dashboardViewsList = this.config.dashboardViewList
        this.ViewID = this.config.currentView.viewId
        //this.userName=this.config.ViewInfo.userName
        this.lastSelectedView = this.config.selectedViewType;
        let viewModel = Object.assign({}, this.config.currentView);
        this.currentSelectedView = viewModel;
        this.selectedView = this.config.currentView;
        this.tempDashboardViewList = this._commUtils.getDeReferencedObject(this.dashboardViewsList);
        this.isDrillDownViewEnabled = this.config.isDrillDownViewEnabled;
        this.pushtoViewList();
        this.addStandardText();
        this.lastSelectedViewType(viewModel);
    }

    public ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
    }

    public showDrillDownViewChecboxCallback(isDrillDownViewEnabled) {
        this.isDrillDownViewEnabled = isDrillDownViewEnabled;
        this.config.isDrillDownViewEnabled = isDrillDownViewEnabled;
        let viewModel = Object.assign({}, this.config.currentView);
        this.myViews = [];
        this.standardViews = [];
        this.sharedViews = [];
        this.pushtoViewList();
        this.addStandardText();
        this.lastSelectedView = find(this.dashboardViews, { isActive: true });
        this.lastSelectedViewType(viewModel);
    }

    public pushtoViewList() {
        if (!this.isDrillDownViewEnabled && this.config.showDrillDownViewCheckbox) {
            let viewConfig: any = [];
            this.tempDashboardViewList.forEach(viewListObj => {
                if (!viewListObj.isDrilledDownView) {
                    viewConfig.push(viewListObj);
                }
            });
            this.tempDashboardViewList = viewConfig;
            this.dashboardViewsList = this.tempDashboardViewList;
        }
        for (let viewList of this.dashboardViewsList) {
            if (viewList.isOwn && !viewList.isStandard) {
                this.myViews.push(viewList);
                this.currentViewCollection = this.myViews;
                this.searchKeyText.value = '';
            }
            else if (!viewList.isOwn && viewList.isStandard == false) {
                this.sharedViews.push(viewList);
                this.currentViewCollection = this.sharedViews;
                this.searchKeyText.value = '';

            }
            else if (viewList.isStandard == true) {
                this.standardViews.push(viewList);
                this.currentViewCollection = this.standardViews;
                this.searchKeyText.value = '';
            }
        }
        this.dashboardViewContainerRef.clear();
        this.dashboardViewContainerRef.createEmbeddedView(this.dashboardViewsListTemplateRef, { $implicit: '' });
        this.tempDashboardViewList = this._commUtils.getDeReferencedObject(this.config.dashboardViewList);
        this.dashboardViewsList = this.tempDashboardViewList;
    }
    public lastSelectedViewType(viewModel) {
        if (this.lastSelectedView == undefined) {
            if (viewModel.isOwn) {
                this.onViewTabChange({
                    title: DashboardConstants.DashboardViewsTypes.MY_VIEWS,
                    isActive: true,
                })
            }
            else if (!viewModel.isOwn && viewModel.isStandard == true) {
                this.onViewTabChange({
                    title: DashboardConstants.DashboardViewsTypes.STANDARD_VIEW,
                    isActive: true,
                })
            }
            else {
                this.onViewTabChange({
                    title: DashboardConstants.DashboardViewsTypes.SHARED_VIEW,
                    isActive: true,
                })
            }
        }
        else {
            this.onViewTabChange(this.lastSelectedView)
        }
    }

    public onViewTabChange(view) {
        this.currentSelectedViewType = view;
        this.dashboardViews.map(values => (values.title == view.title) ? values.isActive = true : values.isActive = false);

        if (view.title == DashboardConstants.DashboardViewsTypes.MY_VIEWS) {
            this.loadMyViews();
        }
        else if (view.title == DashboardConstants.DashboardViewsTypes.STANDARD_VIEW) {
            this.loadstandardViews();
        }
        else {
            (view.title == DashboardConstants.DashboardViewsTypes.SHARED_VIEW)
            this.loadsharedViews();
        }

    }

    public loadMyViews() {
        if (this.myViews.length !== 0) {
            this.currentViewCollection = this.myViews;
            if (!this.isSelectedView && this.searchKeyText.value != "") {
                this.ViewID = this.config.currentView.viewId;
            }
            this.searchKeyText.value = '';


            this.dashboardViewContainerRef.detach();
            this.dashboardViewContainerRef.clear();
            this.dashboardViewContainerRef.createEmbeddedView(this.dashboardViewsListTemplateRef, { $implicit: '' });
        }
        else {
            this.loadEmptyView();
        }
    }

    public loadstandardViews() {
        if (this.standardViews.length !== 0) {
            this.currentViewCollection = this.standardViews;
            if (!this.isSelectedView && this.searchKeyText.value != "") {
                this.ViewID = this.config.currentView.viewId;
            }
            this.searchKeyText.value = '';
            this.dashboardViewContainerRef.detach();
            this.dashboardViewContainerRef.clear();
            this.dashboardViewContainerRef.createEmbeddedView(this.dashboardViewsListTemplateRef, { $implicit: '' });
        }
        else {
            this.loadEmptyView();
        }
    }

    public loadsharedViews() {
        if (this.sharedViews.length !== 0) {

            this.currentViewCollection = this.sharedViews;
            if (!this.isSelectedView && this.searchKeyText.value != "") {
                this.ViewID = this.config.currentView.viewId;
            }
            this.searchKeyText.value = '';
            this.dashboardViewContainerRef.detach();
            this.dashboardViewContainerRef.clear();
            this.dashboardViewContainerRef.createEmbeddedView(this.dashboardViewsListTemplateRef, { $implicit: '' });
        }
        else {
            this.loadEmptyView();
        }
    }

    private loadEmptyView() {
        this.dashboardViewContainerRef.detach();
        this.dashboardViewContainerRef.clear();
        this.dashboardViewContainerRef.createEmbeddedView(this.dashboardViewsListEmptyTemplate, { $implicit: '' })
    }

    public onViewChange(view) {
        this.selectedView = view;
        this.ViewID = this.selectedView.viewId;
        this.isSelectedView = true;
        this.selectedView.viewName = view.viewName.replace("(Added to standard View)", "").trim();
        this.selectedView.viewName = view.viewName.replace("view.cretedBy");


    }

    public onCancel() {
        this.config.api.cancelClick();
    }

    public addStandardText() {
        for (let i of this.dashboardViewsList) {
            if (i.isOwn && i.isStandard) {
                this.standardViewText = ' ' + '(' + "Created by" + ' ' + i.UserName + ')'

            }
        }
    }

    public onDone() {
        this.config.isLinkToDashboard ? this.config.api.linkClick(this.selectedView.viewId) : this.config.api.doneClick(this.selectedView || this.currentSelectedView, this.currentSelectedViewType, this.isDrillDownViewEnabled);
        let mainContainer = document.getElementById('main-container-id');
        mainContainer.classList.remove("overflow-hide");
    }

    public onSearchKeypress(searchTxtValue) {
        if (this.currentSelectedViewType != undefined) {
            if (this.currentSelectedViewType.title == DashboardConstants.DashboardViewsTypes.MY_VIEWS) {
                this.serachMyViewFilterList = this.myViews.filter(
                    item => (item.viewName) ? item.viewName.toLowerCase().indexOf(searchTxtValue.value.toLowerCase()) > -1 : item.viewName
                );
                this.currentViewCollection = Object.assign([], this.serachMyViewFilterList);
            }
            else if (this.currentSelectedViewType.title == DashboardConstants.DashboardViewsTypes.STANDARD_VIEW) {
                this.serachStandardViewFilterList = this.standardViews.filter(
                    item => (item.viewName) ? item.viewName.toLowerCase().indexOf(searchTxtValue.value.toLowerCase()) > -1 : item.viewName
                );
                this.currentViewCollection = Object.assign([], this.serachStandardViewFilterList);
            }
            else if (this.currentSelectedViewType.title == DashboardConstants.DashboardViewsTypes.SHARED_VIEW) {
                this.serachShareViewFilterList = this.sharedViews.filter(
                    item => (item.viewName) ? item.viewName.toLowerCase().indexOf(searchTxtValue.value.toLowerCase()) > -1 : item.viewName
                );
                this.currentViewCollection = Object.assign([], this.serachShareViewFilterList);
            }
            this.ViewID = "";
            if (searchTxtValue.value == "") {
                this.ViewID = this.config.currentView.viewId;
            }
        }
    }



    unShareViewFromList(view: ViewInfo): void {

        this._commUtils.getConfirmMessageDialog(
            DashboardConstants.UIMessageConstants.VISION_STRING_UnShare_Confirmation_sharedViews,
            [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ],
            (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                    this.unshareView(view);
                }
            }
        );


    }

    unshareView(view: ViewInfo) {

        if (view && !view.isOwn && !view.isStandard) {
            let user = new UserInfo('', '', Number(this._appConstants.userPreferences.UserBasicDetails.ContactCode), false, '', '', 0);
            this._commUtils.showLoader();
            this.manageSubscription$.add(
                this._dashboardService.unshareDashboard([user], view.viewId,view.viewName).
                    subscribe((res: any) => {
                        if (res.toLowerCase() == "true") {

                            this.removeUserFromSharedUserList(view.viewId);
                            this.config.api.unShareView(view.viewId);
                            if (this.sharedViews && this.sharedViews.length > 0)
                                this.changeDetectorRef.detectChanges();
                            else
                                this.loadEmptyView();
                            this._commUtils.getToastMessage(DashboardConstants.UIMessageConstants.STRING_UnshareDashboard_Toast_Message);
                            if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                                this.manageSubscription$.add(this._dashboardService.getSharedUsers(this.ViewID).subscribe((_response: any) => { }));
                                const updateIngestionObject = {
                                    ShareUserCount: view.ShareUserCount - [user].length
                                }
                                this.manageSubscription$.add(
                                    this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.ViewID, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                                );
                              }

                        }
                        this._commUtils.hideLoader();
                    })
            );
        }

    }

    public clearSearch() {
        this.searchKeyText.value = '';
        //ANLT-8878 On clear search or cancel the current view is not properly set in the popup 
        this.ViewID = this.config.currentView.viewId;
        if (this.currentSelectedViewType.title === DashboardConstants.DashboardViewsTypes.MY_VIEWS) {
            this.currentViewCollection = this.myViews
        }
        else {
            this.currentViewCollection = this.standardViews
        }
    }

    public trackByViewName(index) {
        return index;
    }

    public trackByCollection(item) {
        return item.viewId;
    }

    public filterDashboardViewfromProductName() {
        this.config.dashboardViewList = this.config.dashboardViewList.filter(item =>
            item.IsHiddenView == false
        )
    }

    private removeUserFromSharedUserList(viewId: string): void {
        let sharedViesAfterUnShare: Array<ViewInfo> = [];
        let thisRef: DashboardViewsPopupComponent = this;
        this.sharedViews.forEach(sharedUser => {
            if (sharedUser.viewId != viewId) {
                sharedViesAfterUnShare.push(sharedUser);
                thisRef.currentViewCollection = sharedViesAfterUnShare;
            }
        });
        this.sharedViews = sharedViesAfterUnShare;

    }


} 
