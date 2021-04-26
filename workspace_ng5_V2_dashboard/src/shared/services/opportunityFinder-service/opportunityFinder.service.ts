import { Injectable } from '@angular/core';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { SmartBaseService } from '@vsSmartBaseService';

@Injectable()
export class OpportunityFinderService {
    //TODO Transalation Service for Multilingual
    constructor(
        private _smartBaseService: SmartBaseService,
        private _commonUrlsConstants: CommonUrlsConstants) {
    }

    //#region<============== Get Opportunity Finder report details. =========>    
    getReportDetailsByOpportunityFinderId(opportunityFinderObjectId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getReportDetailsByOpportunityFinderId,
            { opportunityFinderObjectId: opportunityFinderObjectId }
        );
    }
    //#endregion

      //Get Currency Format for the Opportunity Finder Data Scource
  
    getOpportunityFinderCurrencySign() {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getOpportunityFinderCurrencySign,{}
        );
    }

    //#region<============== Get Opportunity Finder view details. =========>    
    getOppFinderGridJson(opportunityFinderObjectId: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getOppFinderGridJson,
            { opportunityFinderObjectId: opportunityFinderObjectId }
        );
    }
    //#endregion

    //#region<============== Get Opportunity Finder view details. =========>    
    getOppFinderRedirectionViewDetails(strategy: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getOppFinderRedirectionViewDetails,
            { strategy: strategy }
        );
    }
    //#endregion

   
    //#region<============== Get Opportunity Finder Master details. =========>    
    getOppFinderMasterData() {
        return this._smartBaseService.getMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getMasterDataForOpportunityFinders
        );
    }
    //#endregion

    //#region<============== create dummy Opportunity Finder details. =========>    
    createFlexReportForOpportunityFinder(viewId: string, strategy: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.createFlexReportForOpportunityFinders,
            {
                viewId: viewId,
                strategy: strategy
            }
        );
    }
    //#endregion

    //#region<============== create dummy Opportunity Finder details. =========>    
    saveOpportunityFinderDetails(_oppDetails: any) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getSaveOpportunityFinderDetailsUrl,
            {
                _opportunityFinderDet: _oppDetails
            }
        );
    }
    //#endregion

    //#region<============== create dummy Opportunity Finder Status details. =========>    
    saveOpportunityFinderStatusDetails(_oppFinderTypeMaster: any) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getSaveOpportunityFinderStatusDetailsUrl,
            {
                _opportunityFinderTypeMaster: _oppFinderTypeMaster
            }
        );
    }
    //#endregion

    //#region <=================== Get opportunity list for suppliers ============================>
    getSupplierWiseOpportunities(supplierList) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getSupplierWiseOpportunities,
            {
                supplierList : supplierList
            }
        );
    }
    //#endregion

    //#region <=================== Get opportunity list for Level 3 category ============================>
    getLevel3CategoryWiseOpportunities(level3CategoryList) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getLevel3CategoryWiseOpportunities,
            {
                level3CategoryList : level3CategoryList
            }
        );
    }
    //#endregion

    //#region <=================== Get opportunity list for Level 4 category ============================>
    getLevel4CategoryWiseOpportunities(level4CategoryList) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.OpportunityFinderApiUrls.getLevel4CategoryWiseOpportunities,
            {
                level4CategoryList : level4CategoryList
            }
        );
    }
    //#endregion


        //#region<============== Get Fraud Anomaly Master details. =========>    
        getFraudAnomalyMasterData(strategy) {
            return this._smartBaseService.postMethod(
              this._commonUrlsConstants.URLs.FraudAnomalyApiUrls.getMasterDataForFraudAnomaly,
               JSON.stringify(strategy)
            );
        }
        //#endregion

         //#region<============== Get Fraud Anomaly view details. =========>    
     getFraudAnomalyViewDetails(strategy: string) {
        return this._smartBaseService.postMethod(
          this._commonUrlsConstants.URLs.FraudAnomalyApiUrls.getFraudAnomalyRedirectionViewDetails,
            JSON.stringify(strategy)
        );
    }


    saveFraudAnomalyDetails(saveDetails: string) {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.FraudAnomalyApiUrls.saveAnomalyDetails,
            saveDetails
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
}
