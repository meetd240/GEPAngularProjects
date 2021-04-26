import { Injectable } from '@angular/core';
import { SmartBaseService } from '@vsSmartBaseService';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { AppConstants } from 'smart-platform-services';

@Injectable()
export class BidInsightsService {
    constructor(
        private _smartBaseService: SmartBaseService,
        private _commonUrlsConstants: CommonUrlsConstants,
        private _appConstants: AppConstants
    ){

    }

    notifyRenameBidInsightsDashboard(dashBoardId: string, newName: string) {
        this.apiCall(
          encodeURI(this._commonUrlsConstants.URLs.BidInsightsApiUrls.bidInsightsBaseApiUrl
                .replace('[action]','Rename')
                .replace('[path]', 'dashBoardId/newName')
                .replace('dashBoardId',dashBoardId)
                .replace('newName',newName)),{},'POST'
        );
    }

    notifyCopyBidInsightsDashboard(oldDashBoardId: string, newDashBoardId: string, newName: string) {
         this.apiCall(
            encodeURI(this._commonUrlsConstants.URLs.BidInsightsApiUrls.bidInsightsBaseApiUrl
                .replace('[action]','Copy')
                .replace('[path]', 'oldDashBoardId/newDashBoardId/newName')
                .replace('oldDashBoardId', oldDashBoardId)
                .replace('newDashBoardId', newDashBoardId)
                .replace('newName', newName)),{},'POST'
        );
    }

    notifyDeleteBidInsightsDashboard(dashBoardId: string) {
        this.apiCall(encodeURI(this._commonUrlsConstants.URLs.BidInsightsApiUrls.bidInsightsBaseApiUrl
            .replace('[action]','Delete')
            .replace('[path]', 'dashBoardId')
            .replace('dashBoardId',dashBoardId)),{},'DELETE'
            )
    }

    apiCall(url: string, data: any, methodtype: string) {
        $.ajax({ method: methodtype, 'url': url, 
                'headers': { 
                    'BPC': this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode 
                } }).done(function (data) {
            if (console && console.log) {
                console.log(data);
            }
        });
    }
}
