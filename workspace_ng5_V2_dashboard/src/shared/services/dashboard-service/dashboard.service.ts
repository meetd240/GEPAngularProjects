import { Injectable } from '@angular/core';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { SmartBaseService } from '@vsSmartBaseService';
import { CommonUtilitiesService } from '../../common-utils/common-utilities';
import { UserInfo } from 'shared/models/userDetails/user-details';

@Injectable()
export class DashboardService {

    //TODO Transalation Service for Multilingual
    constructor(
        private _smartBaseService: SmartBaseService,
        private _commonUrlsConstants: CommonUrlsConstants,
        private _commonUtilitiesService: CommonUtilitiesService,


    ) {
    }


    //#region<============== Get all Dashlets/Portlets corresponding to requested View. =========>    
    getAllDashletInfoByViewIdData(viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getAllDashletInfoByViewIdUrl,
            { viewId: viewId }
        );
    }
    //#endregion

    //#region<============== Get All View List, to populate View Name on Dropdown. ================>    
    getAllViewInfoData() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getAllViewInfoUrl
        );
    }
    //#endregion
    //#region<============== Get Dashboard Persistence Data to get all the dashboard layout / card ================>    
    getDashboardPersistenceData(contactCode: number, docType: number, bpc: number) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.DashboardApiUrls.getDashboardPersistenceDataUrl,
            {
                contactCode: contactCode,
                documentType: docType,
                partnerCode: bpc
            }
        );
    }
    //#endregion

    //#region<============== Get Dashboard Persistence Data to get all the dashboard layout / card ================>    
    setDashboardPersistenceJson(contactCode: number, docType: number, bpc: number, persistenceJson: String) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.DashboardApiUrls.setDashboardPersistenceDataUrl,
            {
                contactCode: contactCode,
                documentType: docType,
                partnerCode: bpc,
                events: "{ \"dashboardLayout\" : " + persistenceJson + " }"
            }
        );
    }
    //#endregion

    //#region<============== Remove dashboard-card from the view. ================>    
    deleteDashletByReportDetailObjectIdViewId(widgetId: string, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.deleteDashletUrl,
            { reportDetailObjectId: widgetId, viewId: viewId }
        );
    }
    //#endregion

    //#region<============== Unlink dashboard-card from the view. ================>    
    unlinkReportFromView(widgetId: string, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.unlinkReportFromViewUrl,
            { reportDetailObjectId: widgetId, viewId: viewId }
        );
    }
    //#endregion

    /**
     * Author: Vignesh Reddy.
     * @param title : Widget Title when isEditDescription is False and is Report Description when isEditDescription is True.
     * @param reportDetailObjectId : Widget Object Id.
     * @param viewId : View Id.
     * @param isEditDescription : To identify whether to update Title or Description.
     */
    editDashletInfoByReportDetailObjectIdViewId(title: string, reportDetailObjectId: string, viewId: string, sectionId: string, isEditDescription: boolean = false) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.renameDashletUrl,
            {
                dashletRenameInfo:
                    JSON.stringify({
                        title: title,
                        reportDetailObjectId: reportDetailObjectId,
                        viewId: viewId,
                        sectionId: sectionId,
                        isEditDescription: isEditDescription
                    })
            }
        );
    }
    //#endregion


    //#region<============== Get All Report Objects for Multi DataSource, to populate in filter ================>    
    getReportObjectsForMultiDataSource(dataSourceObjectIds: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getReportObjectsForMultiDataSource,
            { dataSourceObjectIds: dataSourceObjectIds }
        );
    }
    //#endregion

    //#region<============== Get All Filter Condition for Metadata, to populate in filter ================>    
    getFilterConditionMetadata() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getFilterConditionMetadataURL
        );
    }
    //#endregion

    //#region<=== Get All Reporting Object based Upon the Multiple Datasource with Comma Seprated Datasource objects for Cross Suite  ====> 
    getCrossSuiteReportObjectsForMultiDataSource(dataSourceObjectIds: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getCrossSuiteReportObjectsForMultiDataSource,
            { dataSourceObjectIds: dataSourceObjectIds }
        );
    }
    //#endregion

    //#region<=== Get All Reporting Object based Upon the Multiple Datasource with Comma Seprated Datasource objects for Cross Suite  ====> 
    saveDashboard(viewInfo: any, lstDashletInfo: any) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.saveDashboardDataUrl,
            {
                viewInfo: JSON.stringify(viewInfo),
                lstDashletInfo: JSON.stringify(lstDashletInfo)
            }
        );
    }

    saveAsDashboard(viewInfo: any, lstDashletInfo: any) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.copyViewByViewIdUrl,
            {
                viewInfo: JSON.stringify(viewInfo),
                lstDashletInfo: JSON.stringify(lstDashletInfo)
            }
        );


    }
    //#endregion

    //#region<=== Performing the Dashboard View Level Editing Option to User  ====> 
    editViewInfoDetails(viewId: string, viewName: string, OP: number) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.editViewInfoDetailsUrl,
            {
                viewId: viewId,
                ViewName: viewName,
                operation: OP
            }
        );
    }
    //#endregion

    //#region<=== Get All DataSource Info By Contact Code   ====> 
    getAllDataSourcesByContactCode(isVisible: boolean) {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getAllDataSourcesByContactCodeUrl + '&filterByIsVisible=' + isVisible,
        );
    }
    //#endregion

    //#region<=== Get All DataSource Info By Contact Code   ====> 
    getAllDataSourceInfo() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getAllDataSourceInfo,
        );
    }
    //#endregion

    checkForIE(): boolean {
        let ua = window.navigator.userAgent,
            msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            //alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
            return true;
        }
        else  // If another browser, return 0
        {
            return false;
        }
    }

    //#region<=== Open report generation page with selected datasource and pass view details ===>
    openReportGenerationPage(dataSourceId: string, viewId: string, tabId: string, sectionId: string, documentCode: number): void {
        const url: string = this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.openReportGenerationPageUrl.replace('[DataSourceID]', dataSourceId);
        const inputParam: Array<{}> = [{ 'viewId': viewId }, { 'tabId': tabId }, { 'sectionId': sectionId }, { 'documentCode': documentCode }];
        this._commonUtilitiesService.formSubmitMethod(url, '_self', inputParam);
    }
    //#endregion

    //#region Get all bid insights views
    getBidInsightsViewInfo(documentCode: number) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getBidInsightsViewInfoUrl,
            {
                eventCode: documentCode
            }
        );
    }


    GetBidInsigtsDashboardSourcingApi(documentCode: number, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getBidInsightsSourcingApi,
            {
                eventCode: documentCode,
                viewId: viewId
            }
        )
    }

    //#endregion
    //#region Copy dashboard
    copyDashboardView(viewId: string, selectedDashboardPersistanceData: any, viewName: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.copyViewByViewIdUrl,
            {
                viewId: viewId,
                dashboardPersistanceData: JSON.stringify(selectedDashboardPersistanceData),
                viewName: viewName
            }
        );
    }

    //#endregion
    //#region Link to dashboard
    linkWidgetToDashboard(linkedViewId: string, widgetId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.linkWidgetToDashboardUrl,
            {
                linkedViewId: linkedViewId,
                widgetId: widgetId
            }
        );
    }
    //#endregion
    unLinkFromDashboard(widgetId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.unLinkWidgetFromDashboardUrl,
            {
                widgetId: widgetId
            }
        );
    }

    fetchCrossProductFilters(crossProductDashboardFiltersList) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.fetchCrossProductFilters, crossProductDashboardFiltersList
        );
    }

    //#region<=== Get All User Info By Contact Code   ====> 
    getAllUser(searchText: string, pageIndex: string, pageSize: string, activities: string, dataSourceObjectId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getAllUsers,
            {
                searchText: searchText,
                pageIndex: pageIndex,
                pageSize: pageSize,
                dataSourceObjectId: dataSourceObjectId,
                activities: activities
            });
    }
    //#endregion

    //#region<=== Get All User Info By Contact Code   ====> 
    getSharedUsers(viewID: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getDashboardSharedUsers,
            {
                ViewID: viewID,

            });
    }
    //#endregion

    //#region<===For sharing view   ====> 
    shareView(userInfo: UserInfo[], viewID: string, viewName: string) {
        const viewUrl = `${this._commonUrlsConstants.URLs.DashboardApiUrls.NotificationUrl}&viewId=${viewID}`;
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.ShareView,
            {
                ViewID: viewID,
                UserInfo: JSON.stringify(userInfo),
                viewName: viewName,
                viewURl: viewUrl
            });
    }
    //#endregion



    //#region<=== unshare view code   ====> 
    unshareDashboard(usersInfo: UserInfo[], viewID: string, viewName?: string) {
        const viewUrl = `${this._commonUrlsConstants.URLs.DashboardApiUrls.NotificationUrl}&viewId=${viewID}/dashboard`;
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.UnshareView,
            {
                ViewID: viewID,
                UserInfo: JSON.stringify(usersInfo),
                viewName: viewName,
                viewURl: viewUrl
            });

    }

    removeSharedView(viewId: string, viewName: string, contactCode: number) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.removeSharedViewUrl,
            {
                ViewID: viewId,
                ViewName: viewName,
                ContactCode: contactCode
            });
    }

    deleteSharedView(viewId: string, viewName: string, contactCode: number) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.deleteSharedViewUrl,
            {
                ViewID: viewId,
                ViewName: viewName,
                ContactCode: contactCode,
            });

    }
    updateIndexedElasticSearchData(actionType: string, viewInfo: string, viewId: any, indexingUpdateObject: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.updateIndexedElasticSearchDataUrl, {
            actionType: actionType,
            viewInfoDetails: viewInfo,
            viewId: viewId,
            indexingUpdateObject: indexingUpdateObject
        }
        );
    }
    //#endregion

    //#region<=== get default colors for charts   ====> 
    getDefaultColorsForAllCharts() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getDefaultColorConfigForAllChartsUrl,
        );
    }
    //#endregion

    //#region<=== Get All conditional formatting formulas  ====> 
    getConditionalFormattingFormulas() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getConditionalFormattingFormulasUrl
        );
    }
    //#endregion
} 
