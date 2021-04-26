import { Injectable } from '@angular/core';
import { IDAXReportFilter } from '@vsCommonInterface';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { ReportDetails } from '@vsDataModels/report-details.model';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { SmartBaseService } from '@vsSmartBaseService';


@Injectable()
export class AnalyticsCommonDataService {
    constructor(
        private _smartBaseService: SmartBaseService,
        private _commonUrlsConstants: CommonUrlsConstants,
    ) {
    }
    //#region <========= GenerateReport from DAX Query Engine =========>
    generateReport(reportDetails: ReportDetails) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsDataApiCommonUrls.generateReportUrl,
            { reportObjectDetails: JSON.stringify(reportDetails) }
        );
    }
    //#endregion

    //#region <========= GetAllSliderFilterMinMaxValue from DAX Query Engine ===============>
    // GetAllSliderFilterMinMAxValue is used for populating Min-Max on Slider Filter Widget.
    getAllSliderFilterMinMaxValue(reportDetails: ReportDetails) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsDataApiCommonUrls.getAllSliderFilterMinMAxValueUrl,
            { reportDetailsJson: JSON.stringify(reportDetails) }
        );
    }
    //#endregion

    //#region <========= GetFilterData from DAX Query Engine==============>
    getFilterData(_reportFilterObject: IDAXReportFilter) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsDataApiCommonUrls.getFilterDataUrl,
            { reportFilterObject: JSON.stringify(_reportFilterObject) }
        );
    }
    //#endregion

    //#region <========= GetFilterData from DAX Query Engine==============>
    getRelatedTableData(_reportFilterObject: IDAXReportFilter) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsDataApiCommonUrls.getRelatedTableDataUrl,
            { reportFilterObject: JSON.stringify(_reportFilterObject), ftype: _reportFilterObject.ftype }
        );
    }
    //#endregion

    //#region <========= Get Page Info from DAX Query Engine ==============>
    getPageInfo(_requestKey: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsDataApiCommonUrls.getPageInfoUrl,
            { requestKey: _requestKey }
        );
    }
    //#endregion

    //#region <========= GenerateReport by ReportId from DAX Query Engine =========>
  getReportDetailsByReportId(reportDetailId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsDataApiCommonUrls.getReportByReportId,
          { reportDetailId: reportDetailId, "reportOpenedFrom": 0 }
        );
    };
    //#endregion
} 
