import { Component, OnInit, ElementRef, Renderer2, OnDestroy, ViewEncapsulation, ViewChild, ViewContainerRef, TemplateRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { IDataSourceByContactCodeInfo } from 'interfaces/common-interface/app-common-interface';
import { DashboardService } from '@vsDashboardService/dashboard.service';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { uniq, join, each, includes, split, findIndex, find, sortBy, filter, map, debounce, uniqBy, compact, without } from 'lodash';
import { AppConstants } from 'smart-platform-services';
import { IUserDetails } from 'interfaces/common-interface/app-common-interface';
import { UserInfo } from 'shared/models/userDetails/user-details';
import { DashboardCommService } from '@vsDashboardCommService';
import { Subscription } from 'rxjs';

@Component({
    selector: 'share-dashboard-popup',
    templateUrl: './share-dashboard-popup.component.html',
    styleUrls: ['./share-dashboard-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
export class ShareDashboardPopupComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('shareDashboardContainer', { read: ViewContainerRef }) shareDashboardContainerRef: ViewContainerRef;
    @ViewChild('addMemberTemplate') addMemberTemplateRef: TemplateRef<any>;
    @ViewChild('allUserTemplate') allUserTemplateTemplateRef: TemplateRef<any>;
    @ViewChild('sharedWithUserTemplate') sharedWithUserTemplateRef: TemplateRef<any>;
    @ViewChild('emptyUserTempalte') emptyUserRef: TemplateRef<any>;


    shareDashBoardAddTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.shareDashBoardAddTooltipConfig);
    shareDashBoardUnShareTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.shareDashBoardUnShareTooltipConfig);
    shareDashBoardSearchTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.shareDashBoardSearchTooltipConfig);
    shareDashBoardCloseTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.shareDashBoardCloseTooltipConfig);
    manageSubscription$: Subscription = new Subscription();
    @Input() data: any;
    btnCloseConfig: any = {
        //title: "Close",
        title: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
        flat: true
    };
    btnBackConfig: any = {
        //title: "Back",
        title: DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Back_Button_Text,
        flat: true
    };
    btnShareConfig: any = {
        //title: "Back",
        title: DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Share_Button_Text,
        flat: true
    };
    searchKeyText = { "value": '' };
    searchListConfig: any = {
        label: '',
        data: 'value',
        attributes: {
            maxLength: 5000,
            //placeholder: 'search',
            placeholder: DashboardConstants.UIMessageConstants.STRING_SEARCH_TEXT
        }
    };
    searchSelectedKeyText = { "value": '' };
    searchSelectedListConfig: any = {
        label: '',
        data: 'value',
        attributes: {
            maxLength: 5000,
            //  placeholder: 'search',
            placeholder: DashboardConstants.UIMessageConstants.STRING_SEARCH_TEXT
        }
    };
    //ANLT
    ViewID: any;
    shareDashboardPopupConfig: any;
    shareDashboardPopupTitle: any;
    addNewMember: any;
    userListConfig: any;
    selectedCheckBox: any;
    selectedShareList: any = [];
    selectedCheckBoxLength: any = 0;
    isActiveSearchBlock = false;
    isActiveSearch = false;
    isAnyUserSelected = false;
    hideClose = false;
    showMe = false;
    slectedMember: any
    totalMember: any;
    activeCheckBox: any;
    unSelectedCheckBox: any;
    displaySharedList: any;
    public readonly allUserTemplate: string = "allUserTemplate";
    public readonly addMemberTemplate: string = "addMemberTemplate";
    public readonly sharedWithUserTemplate: string = "sharedWithUserTemplate";
    public readonly emptyUserTemplate: string = "emptyUserTempalte";
    public currentViewType: string;
    dataSourceByContactCodeInfo: Array<IDataSourceByContactCodeInfo> = [];
    datasorceObjectID: string;
    datasorceObjectsIDsList: any[] = [];
    activitiesCode: any[] = [];
    seperatedActivitesCodes: any[];
    commaseperatedActivitesCode: string;
    allUserList: Array<IUserDetails> = [];
    sharedUserList: Array<IUserDetails> = [];
    unShareuserInfo: Array<UserInfo> = [];
    selectedSharedUserCheckBoxLength: any;
    isShareUserSelecated: boolean = false;
    constants = DashboardConstants;
    private shareMode: boolean = false;
    sharedwithTitle: any;
    PageIndex: number = 1;
    selectedUserForShareDashboard: Array<any> = [];
    LazyLoadingCalled: boolean = false;
    constructor(
        private _renderer: Renderer2,
        private _appConstants: AppConstants,
        private _dashboardService: DashboardService,
        private _commUtils: CommonUtilitiesService,
        private _dashboardCommanService: DashboardCommService,
        private _cdRef: ChangeDetectorRef,

    ) {
    }

    ngOnInit() {
        this._commUtils.showLoader();
        var thisRef = this;
        thisRef.ViewID = thisRef.data.currentView.viewId;
        thisRef.datasorceObjectID = thisRef.data.currentView.DataSourceObjectId;
        if (thisRef.datasorceObjectID.indexOf(',') > -1) {
            let dataSource = thisRef.datasorceObjectID.split(',');
            dataSource.map(a =>
                thisRef.datasorceObjectsIDsList.push(a.toUpperCase()));
        }
        else {
            thisRef.datasorceObjectsIDsList.push(thisRef.datasorceObjectID.toUpperCase());
        }
        this.manageSubscription$.add(
            thisRef._dashboardService.getSharedUsers(thisRef.ViewID)
                .subscribe((_response: any) => {
                    if (_response != null && _response.length > 0) {
                        this.sharedUserList = this.getUserListOtherthenLoggedIn(_response);
                        this._dashboardCommanService.updateSharedUserCount(this.sharedUserList.length);
                        setTimeout(() => this.setState(), 100);
                    }

                })
        );

        this.manageSubscription$.add(
            this._dashboardService
                .getAllDataSourcesByContactCode(false)
                .subscribe((response) => {

                    thisRef.dataSourceByContactCodeInfo = response as Array<IDataSourceByContactCodeInfo>;

                    thisRef.dataSourceByContactCodeInfo.forEach(a => {
                        if (includes(thisRef.datasorceObjectsIDsList, a.DataSourceObjectId.toUpperCase())) {

                            if (a.ActivityCodes.indexOf(',') > -1) { //for splitting the activites code if multiple

                                let activitecodes = split(a.ActivityCodes, ',');

                                activitecodes.forEach(element => {
                                    thisRef.activitiesCode.push(element)
                                });

                            }
                            else
                                thisRef.activitiesCode.push(a.ActivityCodes)
                        }
                    })
                    thisRef.seperatedActivitesCodes = uniq(thisRef.activitiesCode);
                    thisRef.commaseperatedActivitesCode = join(thisRef.seperatedActivitesCodes, '&');

                    this.manageSubscription$.add(
                        this._dashboardService.getAllUser("", DashboardConstants.pageIndex, DashboardConstants.pageSize, thisRef.commaseperatedActivitesCode, thisRef.datasorceObjectID)
                            .subscribe((_response: any) => {
                                if (_response != null) {
                                    if (_response.length == DashboardConstants.pageSize) {
                                        thisRef.PageIndex++;
                                        thisRef.LazyLoadingCalled = true;
                                    }
                                    else {
                                        thisRef.LazyLoadingCalled = false;
                                    }
                                    this.allUserList = this.getUserListOtherthenLoggedIn(_response);
                                    this.shareDashboardPopupConfig = {
                                        //"title": "Share Dashboard",
                                        "title": DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Popup_Title,
                                        "allUserDetailList": thisRef.allUserList,
                                        "sharedUserDetailList": thisRef.sharedUserList
                                    }
                                    this._commUtils.hideLoader();
                                    this.loadData();
                                }
                                else {
                                    this._commUtils.hideLoader();
                                    this.setState();
                                    this.createTempleteDynamic(this.emptyUserRef, this.emptyUserTemplate);
                                }
                            })
                    );
                })
        );

        this.loadConfig();
        setTimeout(() => {
            this.addingScrollEndEvent();
        }, 200);
    }
    ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
    }

    ngAfterViewInit() {
        this.setState();
        this.addingScrollEndEvent();
    }

    loadConfig() {

        this.shareDashboardPopupConfig = {
            //"title": "Share Dashboard",
            "title": DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Popup_Title,
            "allUserDetailList":
                [],

        }

        this.userListConfig = {
            isMandatory: true,
            isVisible: false,
            focus: true,
            data: 'checked'
        };
    }

    loadExtraData() {
        this.totalMember = this.shareDashboardPopupConfig.allUserDetailList.length;
        this.slectedMember = DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Select_Member_Title + "(" + this.selectedCheckBoxLength + "/" + this.totalMember + ")";
        this.shareDashboardPopupConfig.title = this.slectedMember;
    }
    setCloseButtonTitle(obj?: any) {
        this.isShareUserChecked();
        if (obj && obj.IsCheckModel && obj.contactCode) {
            if (obj.IsCheckModel.checked) {
                this.selectedUserForShareDashboard.push(obj);
            } else {
                //case 1:when user selects a user without searching and then searches for the same user and over there if he unselects the user then it is not reflected in the alluserList
                let indexInAllUserList = this.allUserList.findIndex(item => item.contactCode == obj.contactCode);
                if (indexInAllUserList >= 0) {
                    this.allUserList[indexInAllUserList].IsCheckModel.checked = false;
                }
                this.selectedUserForShareDashboard = without(this.selectedUserForShareDashboard, find(this.selectedUserForShareDashboard, { contactCode: obj.contactCode }));
            }
        }
        if (this.isItemChecked()) {
            this.isAnyUserSelected = true;
        }
        else {

            this.isAnyUserSelected = false;
        }
        if (this.currentViewType == "ALL")
            this.loadExtraData();

    }
    loadData() {

        if (this.sharedUserList.length > 0) {
            this.isActiveSearchBlock = true;
            this.setSharedWithTitle();
            this.setState();
            this.createTempleteDynamic(this.sharedWithUserTemplateRef, this.sharedWithUserTemplate);

        } else
            this.createTempleteDynamic(this.addMemberTemplateRef, this.addMemberTemplate);
        setTimeout(() => this.setState(), 100);
    }

    createTempleteDynamic(tempRef: any, tempTitle: any) {
        switch (tempTitle) {

            case "allUserTemplate":
                this.currentViewType = 'ALL';
                this.loadExtraData();
                break;


            case "sharedWithUserTemplate":

                this.shareDashboardPopupConfig.title = DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Popup_Title;
                this.currentViewType = 'SHARE';
                break;

            case "addMemberTemplate":

                this.shareDashboardPopupConfig.title = DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Popup_Title;
                this.btnCloseConfig.title = DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT;
                this.currentViewType = 'AddMember';
                break;

            default:

                this.shareDashboardPopupConfig.title = DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Popup_Title;
                this.currentViewType = 'SHARE';
                break;


        }
        this.shareDashboardContainerRef.clear();
        this.shareDashboardContainerRef.createEmbeddedView(tempRef, { $implicit: '' });
    }


    public onCloseDashboard() {
        this.data.api.cancelCallback();
    }



    public onShareClick(): void {
        let userInfo = [];
        if (this.isAnyUserSelected) {
            this._commUtils.getConfirmMessageDialog(
                //"Are you sure you want to share this View?",
                DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Confirmation_message,
                [
                    DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                    DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
                ],
                (_response: any) => {
                    if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                        this.shareDashboardPopupConfig.allUserDetailList.forEach((item) => {
                            if (item.IsCheckModel.checked == true) {
                                item.IsCheckModel.checked = false;
                                item.isShared = true;
                                userInfo.push(new UserInfo(item.userName, item.emailAddress, item.contactCode, true, item.firstName, item.lastName, item.userID));
                            }
                        });
                        if (userInfo.length > 0) {
                            this.selectedUserForShareDashboard.length = 0;
                        }
                        this.shareview(userInfo);
                    }
                }
            );

        }
    }
    removeSharedUserfromAllUser(): void {
        //for unsharing users
        let thisRef = this;
        this.shareDashboardPopupConfig.allUserDetailList = this.allUserList = this.allUserList.filter(user => {
            return thisRef.sharedUserList.findIndex(x => x.contactCode == user.contactCode) < 0;
        });
        this.setState();

    }
    unshareview(): void {
        this._commUtils.showLoader();
        this._dashboardService.unshareDashboard(this.unShareuserInfo, this.ViewID, this.data.currentView.viewName).
            subscribe((res: any) => {
                if (res.toLowerCase() == "true") {
                    this._commUtils.getToastMessage(DashboardConstants.UIMessageConstants.STRING_UnshareDashboard_Toast_Message);
                    this.removeUserFromSharedUserList(this.unShareuserInfo);
                    this._dashboardCommanService.updateSharedUserCount(this.sharedUserList.length);
                    if (this.sharedUserList.length == 0) {   //this will load all user list in this template
                        this.createTempleteDynamic(this.addMemberTemplateRef, this.addMemberTemplate);
                    }
                    this._dashboardCommanService.updateSharedUserCount(this.shareDashboardPopupConfig.sharedUserDetailList.length);
                    this.setSharedWithTitle();
                    this.isActiveSearchBlock = true;
                    this.btnCloseConfig.title = DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT;
                    this.isShareUserSelecated = false;
                    if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                        this.manageSubscription$.add(this._dashboardService.getSharedUsers(this.ViewID).subscribe((_response: any) => { }));
                        const updateIngestionObject = {
                            ShareUserCount: this._dashboardCommanService.sharedUserCount
                        }
                        this.manageSubscription$.add(
                            this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.ViewID, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                        );
                    }
                    this.setState();
                }

                this._commUtils.hideLoader();
            });
    }

    shareview(usersToShare: Array<UserInfo>): void {
        this._commUtils.showLoader();
        const updatedShareUserCount: number = usersToShare.length + this._dashboardCommanService.sharedUserCount;
        this._dashboardService.shareView(usersToShare, this.ViewID, this.data.currentView.viewName).
            subscribe((res: any) => {
                //if (res) {
                if (res.toLowerCase() == "true") {
                    this.searchKeyText.value = "";//if user is searched and shared
                    this.hideSearch();
                    this.removeSharedUserfromAllUser();
                    this.showSharedUserList();
                    this.setState();
                    this.createTempleteDynamic(this.sharedWithUserTemplateRef, this.sharedWithUserTemplate);
                    this._commUtils.getToastMessage(DashboardConstants.UIMessageConstants.STRING_Share_Toast_message);
                    this.isActiveSearchBlock = true;
                    this.btnCloseConfig.title = DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT;
                    if (this._appConstants.userPreferences.moduleSettings.enableIngestion) {
                        const updateIngestionObject = {
                            ShareUserCount: updatedShareUserCount
                        }
                        this.manageSubscription$.add(
                            this._dashboardService.updateIndexedElasticSearchData(AnalyticsCommonConstants.IngestionActionType.Update, null, this.ViewID, JSON.stringify(updateIngestionObject)).subscribe(async (_response: any) => { })
                        );
                    }

                }

                this._commUtils.hideLoader();
            });
    }

    backShareDashboard() {
        if (this.currentViewType == "SHARE" || this.shareDashboardPopupConfig.sharedUserDetailList.length > 0) {
            this.isActiveSearchBlock = true;
            this.btnCloseConfig.title = DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT;
            this.createTempleteDynamic(this.sharedWithUserTemplateRef, this.sharedWithUserTemplate);
        }
        else {

            this.createTempleteDynamic(this.addMemberTemplateRef, this.addMemberTemplate);
        }

    }
    addNewShareDashboard() {
        if (this.allUserList.length > 0) {
            this.removeSharedUserfromAllUser();
            this.createTempleteDynamic(this.allUserTemplateTemplateRef, this.allUserTemplate);// This tempplate is for all user
            this.isActiveSearchBlock = false;
            this.setCloseButtonTitle();
            this.addingScrollEndEvent();
        }
    }
    showSearch() {
        this.isActiveSearch = true;
        this.showMe = true;
        this.hideClose = true;
    }

    hideSearch() {
        this.showMe = false;
        this.isActiveSearch = false;
        this.hideClose = false;
    }

    isItemChecked(): boolean {
        //when user selects a user from lazyLoaded data then its count is not being shown properly
        // this.selectedCheckBoxLength = this.shareDashboardPopupConfig.allUserDetailList.filter(item => {
        //     return item.IsCheckModel.checked == true;
        // }).length;
        this.selectedCheckBoxLength = this.selectedUserForShareDashboard.length;
        return this.selectedCheckBoxLength > 0
    }
    backWith() {
        this.removeSharedUserfromAllUser();
        this.currentViewType = 'ALL';
        this.setCloseButtonTitle();
        this.searchKeyText.value = "";//if user is searched and return back to Select Member Screen
        this.hideSearch();
        this.createTempleteDynamic(this.allUserTemplateTemplateRef, this.allUserTemplate);

    }
    removeUser() {
        this._commUtils.getConfirmMessageDialog(
            DashboardConstants.UIMessageConstants.STRING_UnshareDashboard_Message,
            [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ],
            (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                    this.unShareuserInfo = [];
                    this.shareDashboardPopupConfig.sharedUserDetailList.forEach(item => {
                        if (item.IsCheckModel.checked == true) {
                            item.isShared = true;
                            item.IsCheckModel.checked = false;
                            let user = new UserInfo(item.userName, item.emailAddress, item.contactCode, true, item.firstName, item.lastName, item.userID);
                            this.unShareuserInfo.push(user);
                        }
                    });
                    this.unshareview();
                }
            }
        );
    }
    onSearchKeypress(searchTxtValue) {
        this._dashboardService.getAllUser(searchTxtValue.value, DashboardConstants.pageIndex, DashboardConstants.pageSize, this.commaseperatedActivitesCode, this.datasorceObjectID)
            .subscribe((_response: any) => {
                if (_response != null) {
                    this.shareDashboardPopupConfig.allUserDetailList = this.getUserListOtherthenLoggedIn(_response).filter(user => {
                        if (this.selectedUserForShareDashboard.length > 0) {
                            let obj = find(this.selectedUserForShareDashboard, (sharedDashBoardUser) => { return sharedDashBoardUser.contactCode === user.contactCode });
                            if (obj) {
                                user.IsCheckModel.checked = true;
                            }
                        }
                        return this.shareDashboardPopupConfig.sharedUserDetailList.findIndex(x => x.contactCode == user.contactCode) < 0;
                    });

                    if (this.searchKeyText.value == '') {
                        this.LazyLoadingHandler(true);
                        this.shareDashboardPopupConfig.allUserDetailList = this.allUserList;
                    }

                    this.setState();

                }
                else {
                    this.setState();

                }
            });

    }
    removeUserFromSharedUserList(unshareUserList: UserInfo[]) {

        this.sharedUserList = this.shareDashboardPopupConfig.sharedUserDetailList = this.sharedUserList.filter(user => {
            if (unshareUserList.findIndex(x => x.contactCode == user.contactCode) < 0) {
                return true;
            } else {
                if (this.allUserList.findIndex(item => item.contactCode == user.contactCode) < 0)
                    this.allUserList.push(user);
                return false;
            }

        });

        this.shareDashboardPopupConfig.allUserDetailList = this.allUserList;//for updating on UI
        this.setState();
    }
    showSharedUserList() {
        this._dashboardService.getSharedUsers(this.ViewID)
            .subscribe((_response: any) => {
                if (_response != null) {
                    this.sharedUserList = this.getUserListOtherthenLoggedIn(_response);
                }

                setTimeout(() => this.setState(), 100);
                this.shareDashboardPopupConfig.sharedUserDetailList = this.sharedUserList;
                this._dashboardCommanService.updateSharedUserCount(this.shareDashboardPopupConfig.sharedUserDetailList.length);
                this.setSharedWithTitle();
                this.createTempleteDynamic(this.sharedWithUserTemplateRef, this.sharedWithUserTemplate);
            });
    }

    isShareUserChecked(): void {
        if (this.isShareUserItemChecked()) {
            this.isShareUserSelecated = true;
        }
        else {
            this.isShareUserSelecated = false;
        }
    }
    isShareUserItemChecked(): boolean {
        this.selectedSharedUserCheckBoxLength = this.shareDashboardPopupConfig.sharedUserDetailList.filter(item => {
            return item.IsCheckModel.checked == true;
        }).length;
        return this.selectedSharedUserCheckBoxLength > 0
    }
    public setState() {
        this._cdRef.markForCheck();
    }
    public trackByContactCode(index, item) {
        return item.contactCode;
    }
    public setSharedWithTitle() {
        this.sharedwithTitle = DashboardConstants.UIMessageConstants.STRING__Share_Dashboard_SharedWith + " " + this._dashboardCommanService.sharedUserCount + " " + DashboardConstants.UIMessageConstants.STRING_Share_Dashboard_Members;

    }
    public clearSearch() {
        this.searchKeyText.value = '';
        if (this.currentViewType === 'ALL') {
            this.selectedCheckBoxLength = this.selectedUserForShareDashboard.length;
            this.LazyLoadingHandler(true);
            //setting isCheckedModel to true of all those user that were selected            
            this.shareDashboardPopupConfig.allUserDetailList = this.allUserList;
            this.selectedUserForShareDashboard.forEach(selectedObject => {
                let obj: any = find(this.shareDashboardPopupConfig.allUserDetailList, { "contactCode": selectedObject.contactCode });
                if (obj) {
                    obj.IsCheckModel.checked = true;
                }

            });
        }

    }

    public getUserListOtherthenLoggedIn(_response: any): Array<IUserDetails> {
        return compact(_response.map(_element => {
            if (_element.ContactCode !== this._appConstants.userPreferences.UserBasicDetails.ContactCode) {
                return <IUserDetails>{
                    emailAddress: _element.EmailAddress,
                    firstName: _element.FirstName,
                    lastName: _element.LastName,
                    fullName: _element.FirstName + " " + _element.LastName,
                    contactCode: _element.ContactCode,
                    userID: _element.userID,
                    IsCheckModel: { checked: false }
                }
            }
        }));
    }

    private LazyLoadingHandler = debounce((IsSearchKeyPressEvent: boolean) => {
        var thisRef = this;
        thisRef._dashboardService.getAllUser("", thisRef.PageIndex.toString(), DashboardConstants.pageSize, thisRef.commaseperatedActivitesCode, thisRef.datasorceObjectID)
            .subscribe((_response: any) => {
                if (_response != null) {
                    if (_response.length == DashboardConstants.pageSize) {
                        thisRef.PageIndex++;
                        thisRef.LazyLoadingCalled = true;
                    }
                    else {
                        thisRef.LazyLoadingCalled = false;
                    }

                    this.getUserListOtherthenLoggedIn(_response).forEach(a => {
                        if (thisRef.allUserList.filter(x => x.contactCode == a.contactCode).length < 1) {
                            thisRef.allUserList.push(a);
                        }
                    });
                    thisRef.shareDashboardPopupConfig.allUserDetailList = thisRef.allUserList;
                    this._commUtils.hideLoader();
                    thisRef.loadExtraData();
                    this.setState();
                }
                else {
                    this._commUtils.hideLoader();
                    this.setState();
                    this.createTempleteDynamic(this.emptyUserRef, this.emptyUserTemplate);
                }
            });

    }, 500, {
        'leading': false,
        'trailing': true
    }
    )

    addingScrollEndEvent() {
        let scrolledEle = document.getElementById('filterlist');
        if (scrolledEle != undefined) {
            if (scrolledEle.scrollTop != 0) { scrolledEle.scrollTop = scrolledEle.scrollTop - 20 };
            this._renderer.listen(scrolledEle, 'scroll', (event) => {
                if (event.target.scrollTop && ((event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight)) {
                    if (this.LazyLoadingCalled) {
                        this.LazyLoadingHandler(false);
                    }

                }
            });
        }
    }


}

