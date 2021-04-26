import { Injectable } from "@angular/core";
import { CommonUrlsConstants } from "@vsCommonUrlsConstants";
import { SmartBaseService } from '@vsSmartBaseService';
import { forkJoin } from "rxjs/observable/forkJoin";
import { DashboardCommService } from "@vsDashboardCommService"
import { ViewFilterDetails } from "@vsViewFilterModels/view-filter-details.model";
import { ReportObject } from "@vsMetaDataModels/report-object.model";
import { DashboardConstants } from "@vsDashboardConstants";
import { FilterCondition } from "@vsMetaDataModels/filter-condition.model";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";

@Injectable()
export class RecommendationService {
    private RecommendationConfigObj: any;
    private FieldMappingConfig: Array<any>;
    private ElasticsearchRecommPayload = {
        "searchKeyword": "",
        "globalSearchText": "",
        "Filters": [
            "moduleScope:recommendedopportunities",
            "pageNumber:1",
            "noOfRecords:1",
            "isSeeAllResult:true",
            "sortField:",
            "fieldkey:"
        ],
        "docType": AnalyticsCommonConstants.OppfinderCommonConstants.RecommendationDocumentTypeCode
    }
    constructor(
        private _smartBaseService: SmartBaseService,
        private _commonUrlsConstants: CommonUrlsConstants,
        private _dashboardCommService: DashboardCommService,
        private _commUtils: CommonUtilitiesService
    ) {
        this.init();
    }
    init() {
        let recId = this._commUtils.getUrlParam('rec');
        if (recId != undefined) {
            let recObservable = this.getOppFinderRecommendationDetailsByRecId(recId);
            let oppFinderFieldsObservable = this.getOppFinderFieldMapping();
            forkJoin(recObservable, oppFinderFieldsObservable).subscribe(res => {
                this.RecommendationConfigObj = res[0]['DataSearchResult']['Value'][0];
                this.FieldMappingConfig = res[1];
            })
        }
    }

    getRecommendedFilterList(): Array<ViewFilterDetails> {
        let filterList: Array<ViewFilterDetails> = new Array<ViewFilterDetails>();
        if (this.FieldMappingConfig != undefined && this.FieldMappingConfig.length > 0) {
            let appliedFilterRoList = this._dashboardCommService.listAllReportObjectWithMultiDatasource.filter(ro => ro.ReportDocumentMappingField != null && ro.ReportDocumentMappingField.length > 0);
            this.FieldMappingConfig.forEach(field => {

                let ro = appliedFilterRoList.find(item => item.ReportDocumentMappingField == field.reportMappingField);
                if (ro != undefined) {
                    let filterObj = new ViewFilterDetails();
                    filterObj.reportObject = new ReportObject().jsonToObject(ro);
                    filterObj.filterBy = DashboardConstants.FilterBy.FilterByCondition;
                    filterObj.filterCondition = new FilterCondition();
                    filterObj.filterCondition.FilterConditionObjectId = DashboardConstants.FilterObjectConditionID.MultiselectIs;
                    filterObj.filterCondition.condition = DashboardConstants.ReportObjectOperators.Is;
                    filterObj.filterCondition.isPeriodFilter = false;
                    filterObj.filterCondition.name = "";
                    filterObj.isGlobalFilter = true;
                    filterObj.filterValue.push(this.RecommendationConfigObj[field.documentField]);
                    filterObj.FilterConditionText = "Is '" + this.RecommendationConfigObj[field.documentField] + "'";
                    filterList.push(filterObj);
                }
            });
        }
        return filterList;
    }
    //#region API calls
    getOppFinderRecommendationDetailsByRecId(recId: string) {
        this.ElasticsearchRecommPayload["AdvanceSearchInput"] = [
            {
                "FieldType": "Autosuggest",
                "IsCustAttr": false,
                "SearchKey": "RecommendationId",
                "Value": recId
            }
        ]
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.analyticsDocumentElasticsearchUrl,
            this.ElasticsearchRecommPayload
        );
    }
    getOppFinderFieldMapping() {
        return this._smartBaseService.postMethod(
            this._commonUrlsConstants.URLs.AnalyticsMetaDataApiCommonUrls.reportDocumentFieldMappingUrl,
            AnalyticsCommonConstants.OppfinderCommonConstants.OppfinderDocumentTypeCode
        );
    }
    //#endregion
}
