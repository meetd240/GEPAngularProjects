import { Injectable } from '@angular/core';
import { HttpService } from 'smart-platform-services';
import { ReportDetails } from '@vsMetaDataModels/report-details.model';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { SmartBaseService } from '@vsSmartBaseService';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { ITabDetail } from 'interfaces/common-interface/app-common-interface';

@Injectable()
export class AnalyticsCommonMetadataService {
    constructor(
        private _commonUrlsConstants: CommonUrlsConstants,
        private _smartBaseService: SmartBaseService) {
    }

    //#region <=================== Save Report Details Service ============================>
    saveReportDetails(reportDetails: ReportDetails, reportUrl: string, isLinked: boolean) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.saveReportDetailsUrl,
            {
                reportDetails: JSON.stringify(reportDetails),
                reportUrl: reportUrl,
                isLinked: isLinked
            }
        );
    }
    //#endregion

    //#region <=================== Rename Report Details Service ============================>
    renameDashletTitleByReportDetailObjectIdViewId(title: string, reportDetailObjectId: string,
        viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.saveReportDetailsUrl,
            {
                title: title,
                reportDetailObjectId: reportDetailObjectId,
                viewId: viewId
            }
        );
    }
    //#endregion

    //#region <=================== Delete Report Details Service ============================>
    deleteDashletByReportDetailObjectIdViewId(widgetId: string, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.deleteDashletUrl,
            {
                reportDetailObjectId: widgetId,
                viewId: viewId
            }
        );
    }
    //#endregion

    //#region <=================== Get All View Level Saved Filter ============================>
    getViewSavedFilterList() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getViewSavedFilterURL
        );
    }
    //#endregion
    //#region<=== save the tab and its corresponding tab details  ====> 
    saveTabDetails(tabDetails: ITabDetail, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.saveTabDetails, {
            tabDetails: JSON.stringify(tabDetails),
            viewId: viewId
        }
        );
    }
    //#endregion

    //#region<=== delete the tab and its corresponding tab details  ====> 
    deleteTabDetails(lstTabId: Array<string>, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.deleteTabDetails, {
            lstTabId: JSON.stringify(lstTabId),
            viewId: viewId
        }
        );
    }
    //#endregion

    //#region<=== update the tab and its corresponding tab details  ====> 
    updateTabsDetail(lstTabDetail: Array<any>, viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.updateTabDetails, {
            lstTabInfo: JSON.stringify(lstTabDetail),
            viewId: viewId
        }
        );
    }
    //#endregion

    //#region<== Move the widget from one tab to the given tab ====>
    moveWidgetToOtherTab(viewId: string, reportDetailId: string, sectionId: string, sequenceNumber: number) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.moveWidgetToOtherTab, {
            moveWidgetDetails: JSON.stringify({
                viewId,
                reportDetailId,
                sectionId,
                sequenceNumber
            })
        }
        );
    }
    //#endregion

    //#region <=== Get all tab info =======================================>
    getAllTabInfo(){
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getAllTabInfo
        );
    }

    //#region <=================== Get View Info object By Passed View ID ============================>
    getViewInfoByViewId(viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getViewInfoByViewIdURL,
            {
                // "\"" + viewId + "\""
                viewId: viewId
            }
        );
    }
    //#endregion

    ////#region  <=============Get All the Tab Filters for all the tabs of the given View ==============>
    getTabSavedFilterByTabId(viewId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.getTabSavedFilterByTabId,
            {
                viewId:viewId
            }
        )
    }
    //#endregion

    ////#region  <=============Delete the tab filters for the given tabId ==============>
    deleteTabFiltersByTabId(tabId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.deleteTabFiltersByTabId, {
            tabId: tabId
        }
        );
    }
    //#endregion
} 
