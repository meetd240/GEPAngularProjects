import { Injectable } from '@angular/core';
import { AppConstants } from "smart-platform-services";

@Injectable()
export class CommonUrlsConstants {

    public URLs: any;
    constructor(
        private _appConstants: AppConstants
    ) {       
       const baseUrl = this._appConstants.userPreferences.URLs.AppURL;
        const encryptedBPC = this._appConstants.userPreferences.EncryptedBPC;
        const oloc = this._appConstants.oloc.analytics;
        const olocEncryptedBPC = `?oloc=${oloc}&c=${encryptedBPC}`;
        const reportsApiOloc = 621;
        

        this.URLs = {
            //ThirdParty API Direct Urls
            ThirdPartyApiUrls: {
                bingMapApiUrls: 'https://www.bing.com/api/maps/mapcontrol?callback=__onBingLoaded&key='
            },
            // Dashboard Controller API Url Constants
          DashboardApiUrls: {
            getDashboardPersistenceDataUrl: `${baseUrl}getSmartActions?oloc=229&c=${this._appConstants.userPreferences.EncryptedBPC}`,
            setDashboardPersistenceDataUrl: `${baseUrl}saveSmartActions?oloc=229&c=${this._appConstants.userPreferences.EncryptedBPC}`,
            getCreateOpportunityUrl: baseUrl + `dashboard/dashboard${oloc}&vm=op&strat=SRS`,
            dashboardViewIdRedirectUrl: `${baseUrl}dashboard/dashboard/V2${olocEncryptedBPC}`,
            NotificationUrl: `dashboard/dashboard/V2${olocEncryptedBPC}`
          },
            // Opportunity Finder API Urls Constants
            OpportunityFinderApiUrls: {
                getReportDetailsByOpportunityFinderId: `${baseUrl}OpportunityFinder/OpportunityFinder/GetReportDetailsByOpportunityFinderId${olocEncryptedBPC}`,
                getMasterDataForOpportunityFinders: `${baseUrl}OpportunityFinder/OpportunityFinder/GetMasterDataForOpportunityFinders${olocEncryptedBPC}`,
                getOppFinderRedirectionViewDetails: `${baseUrl}OpportunityFinder/OpportunityFinder/GetOppFinderRedirectionViewDetails${olocEncryptedBPC}`,
                getLandingPageURLForOppFinder: baseUrl + `Smart/index?oloc=${this._appConstants.oloc.workspace}&c=${encryptedBPC}#/landing?pagefor=analyze&scope=opportunityfinder`,
                createFlexReportForOpportunityFinders: `${baseUrl}OpportunityFinder/OpportunityFinder/createFlexReportForOpportunityFinders${olocEncryptedBPC}`,
                getSaveOpportunityFinderDetailsUrl: `${baseUrl}OpportunityFinder/OpportunityFinder/SaveOpportunityFinderDetails${olocEncryptedBPC}`,
                getOpportunityFinderCurrencySign: `${baseUrl}MetaData/GetOpportunityFinderCurrencySign${olocEncryptedBPC}`,
                deleteViewFilterByOpportunityFinderId: `${baseUrl}MetaData/DeleteViewFilterByOpportunityFinderId${olocEncryptedBPC}`,
                getOppFinderGridJson: `${baseUrl}OpportunityFinder/OpportunityFinder/getOppFinderGridJson${olocEncryptedBPC}`,
                getSupplierWiseOpportunities: `${baseUrl}OpportunityFinder/OpportunityFinder/getSupplierWiseOpportunities${olocEncryptedBPC}`,
                getLevel3CategoryWiseOpportunities: `${baseUrl}OpportunityFinder/OpportunityFinder/getLevel3CategoryWiseOpportunities${olocEncryptedBPC}`,
                getLevel4CategoryWiseOpportunities: `${baseUrl}OpportunityFinder/OpportunityFinder/getLevel4CategoryWiseOpportunities${olocEncryptedBPC}`,
                getSaveOpportunityFinderStatusDetailsUrl: `${baseUrl}OpportunityFinder/OpportunityFinder/SaveOpportunityFinderStatusDetails${olocEncryptedBPC}`,
                getNextGenLandingPageURLForOppFinder: `${baseUrl}Smart/Workspace?oloc=${this._appConstants.oloc.workspace}&c=${encryptedBPC}#/workspace/documents/report;document=opportunityfinder`
            },
                 
             // Fraud Anomaly API Urls Constants
             FraudAnomalyApiUrls: {
                getMasterDataForFraudAnomaly :  `${baseUrl}api/configuration/GetFraudAndAnomalyMasterData?oloc=${reportsApiOloc}`,  
                getFraudAnomalyRedirectionViewDetails: `${baseUrl}api/configuration/GetFraudAndAnomalyViewInfo?oloc=${reportsApiOloc}`,
                saveAnomalyDetails: `${baseUrl}api/configuration/SaveCreatedAnomalyDetails?oloc=${reportsApiOloc}`,
            },

            // Administration API Urls Url Constants
            AdministrationApiUrls: {
                getAllServerListUrl: `${baseUrl}Admin/GetDatabaseInstanceDetails${olocEncryptedBPC}`,
                createTOMUrl: `${baseUrl}Admin/CreateTOM${olocEncryptedBPC}`
            },
            // Analytics Data API Urls Url Constants
            AnalyticsDataApiCommonUrls: {
                generateReportUrl: `${baseUrl}Data/GenerateReport${olocEncryptedBPC}`,
                getAllSliderFilterMinMAxValueUrl: `${baseUrl}Data/GetAllSliderFilterMinMaxValue${olocEncryptedBPC}`,
                getFilterDataUrl: `${baseUrl}Data/GetFilterData${olocEncryptedBPC}`,
                getRelatedTableDataUrl: `${baseUrl}Data/GetRelatedTableData${olocEncryptedBPC}`,
                getAnalysisResultUrl: `${baseUrl}Data/GetAnalysisResult${olocEncryptedBPC}`,
                getPageInfoUrl: `${baseUrl}Data/GetPageInfo${olocEncryptedBPC}`,
                accessDeniedUrl: `${baseUrl}Smart?oloc=200/~/#/error/accessdenied`,
                getReportByReportId: `${baseUrl}MetaData/GetReportDetailsByReportId${olocEncryptedBPC}`
            },
            //Analytics Meta Data Api CommonUrls Urls Url Constants
            AnalyticsMetaDataApiCommonUrls: {
                saveDashboardDataUrl: `${baseUrl}MetaData/saveDashboardData${olocEncryptedBPC}`,
                getAllDashletInfoByViewIdUrl: `${baseUrl}MetaData/GetAllDashletInfoByViewId${olocEncryptedBPC}`,
                getAllViewInfoUrl: `${baseUrl}MetaData/GetAllViewInfo${olocEncryptedBPC}`,
                unlinkReportFromViewUrl: `${baseUrl}MetaData/unlinkReportFromView${olocEncryptedBPC}`,
                getReportingObjectsByDataSource: `${baseUrl}MetaData/GetReportingObjectsByDataSource${olocEncryptedBPC}`,
                getReportObjectsForMultiDataSource: `${baseUrl}MetaData/GetReportObjectsForMultiDataSource${olocEncryptedBPC}`,
                getCrossSuiteReportObjectsForMultiDataSource: `${baseUrl}MetaData/GetCrossSuiteReportObjectsForMultiDataSource${olocEncryptedBPC}`,
                getFilterConditionMetadataURL: `${baseUrl}MetaData/GetFilterConditions${olocEncryptedBPC}`,
                openReportUrl: `${baseUrl}Analytics${olocEncryptedBPC}[dc]&ReportID=[ReportID]&Widget=true&ts=` + new Date().getTime() + '&b=' + (this._appConstants.userPreferences.isSupplier ? 0 : 1),
                renameDashletUrl: `${baseUrl}Metadata/RenameDashletTitleByReportDetailObjectIdViewId${olocEncryptedBPC}`,
                deleteDashletUrl: `${baseUrl}Metadata/DeleteDashletByReportDetailObjectIdViewId${olocEncryptedBPC}`,
                saveReportDetailsUrl: `${baseUrl}Metadata/SaveReportDetails${olocEncryptedBPC}`,
                editViewInfoDetailsUrl: `${baseUrl}MetaData/EditViewInfoDetails${olocEncryptedBPC}`,
                getAllDataSourcesByContactCodeUrl: `${baseUrl}MetaData/GetAllDataSourcesByContactCode${olocEncryptedBPC}`,
                openReportGenerationPageUrl: `${baseUrl}Analytics/AddWidget${olocEncryptedBPC}&DataSourceID=[DataSourceID]&ts=` + new Date().getTime() + '&b=' + (this._appConstants.userPreferences.isSupplier ? 0 : 1),
                getBidInsightsViewInfoUrl: `${baseUrl}MetaData/GetBidInsightsViewInfo${olocEncryptedBPC}`,
                getBidInsightsSourcingApi: `${baseUrl}MetaData/GetBidInsightsDashboardAccessDetails${olocEncryptedBPC}`,
                copyViewByViewIdUrl: `${baseUrl}MetaData/CopyDashboard${olocEncryptedBPC}`,
                linkWidgetToDashboardUrl: `${baseUrl}MetaData/LinkWidgetToDashboard${olocEncryptedBPC}`,
                unLinkWidgetFromDashboardUrl: `${baseUrl}MetaData/UnLinkWidgetFromDashboard${olocEncryptedBPC}`,
                fetchCrossProductFilters: `${baseUrl}MetaData/GetCrossProductAppliedFilters${olocEncryptedBPC}`,
                getAllUsers: `${baseUrl}MetaData/GetAllUsers${olocEncryptedBPC}`,
                getDashboardSharedUsers: `${baseUrl}MetaData/GetSharedDashBoardUsersList${olocEncryptedBPC}`,
                ShareView: `${baseUrl}MetaData/ShareView${olocEncryptedBPC}`,
                UnshareView: `${baseUrl}MetaData/UnshareView${olocEncryptedBPC}`,
                removeSharedViewUrl: `${baseUrl}MetaData/RemoveSharedView${olocEncryptedBPC}`,
                deleteSharedViewUrl: `${baseUrl}MetaData/DeleteSharedView${olocEncryptedBPC}`,
                getAllDataSourceInfo: `${baseUrl}MetaData/GetAllDatasourcesInfo${olocEncryptedBPC}`,
                updateIndexedElasticSearchDataUrl: `${baseUrl}ElasticSearchIndexing/SendDataToElasticSearchForIndexing${olocEncryptedBPC}`,
                getDefaultColorConfigForAllChartsUrl: `${baseUrl}MetaData/GetDefaultColorConfigForAllCharts${olocEncryptedBPC}`,
                getConditionalFormattingFormulasUrl: `${baseUrl}MetaData/GetConditionalFormattingFormulas${olocEncryptedBPC}`,                
                getViewSavedFilterURL: `${baseUrl}MetaData/GetViewSavedFilterList${olocEncryptedBPC}`,
                saveTabDetails: `${baseUrl}MetaData/saveTabDetails${olocEncryptedBPC}`,
                deleteTabDetails: `${baseUrl}MetaData/DeleteTabsForGivenView${olocEncryptedBPC}`,
                updateTabDetails: `${baseUrl}MetaData/UpdateTabDetails${olocEncryptedBPC}`,
                moveWidgetToOtherTab: `${baseUrl}MetaData/MoveWidgetToOtherTab${olocEncryptedBPC}`,
                getAllTabInfo: `${baseUrl}MetaData/GetAllTabInfo${olocEncryptedBPC}`,
                // getViewInfoByViewIdURL: `${baseUrl}api/configuration/GetViewInfoByViewID?oloc=621`
                getViewInfoByViewIdURL: `${baseUrl}MetaData/GetViewInfoByViewId${olocEncryptedBPC}`,
                getTabSavedFilterByTabId: `${baseUrl}MetaData/GetTabSavedFilterByTabId${olocEncryptedBPC}`,
                deleteTabFiltersByTabId: `${baseUrl}MetaData/DeleteTabFiltersByTabId${olocEncryptedBPC}`,
                analyticsDocumentElasticsearchUrl: `${baseUrl}api/ElasticSearch/GetAnalyticsDocumentsFromElasticsearch?oloc=621`,
                reportDocumentFieldMappingUrl: `${baseUrl}api/configuration/GetReportDocumentFieldsMappingByDocumentType?oloc=621`
            },
            //BidInsights Api CommonUrls Urls Url Constants
            BidInsightsApiUrls: {
                bidInsightsBaseApiUrl: `${baseUrl}api/DashboardIntegration/[action]/[path]?oloc=295`
            },
        }
    }
}
