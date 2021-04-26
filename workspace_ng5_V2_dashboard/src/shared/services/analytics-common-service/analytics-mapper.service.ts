import { Injectable } from '@angular/core';
import { ReportDetails as ReportDetails_Data } from '@vsDataModels/report-details.model';
import { ReportObject as ReportObject_Data } from '@vsDataModels/report-object.model';
import { SortReportObject as SortReportObject_Data } from '@vsDataModels/sort-report-object.model';
import { ReportFilter as ReportFilter_Data } from '@vsDataModels/report-filter.model';
import { DashboardConstants } from '@vsDashboardConstants';
import { findIndex, compact } from 'lodash';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';



@Injectable()
export class AnalyticsMapperService {
    constructor() {
    }

    public static MapReportDetailsMetadataToData(metadataReportDetails: any) {

        let dataReportDetails = new ReportDetails_Data();
        dataReportDetails.dataSourceObjectId = metadataReportDetails.dataSourceObjectId;
        dataReportDetails.reportViewType = metadataReportDetails.reportViewType;
        dataReportDetails.isSubTotalRequired = metadataReportDetails.isSubTotalRequired;
        dataReportDetails.isGrandTotalRequired = metadataReportDetails.isGrandTotalRequired;
        dataReportDetails.isLazyLoadingRequired = metadataReportDetails.isLazyLoadingRequired;
        dataReportDetails.reportRequestKey = metadataReportDetails.reportRequestKey;
        dataReportDetails.pageIndex = metadataReportDetails.pageIndex;
        dataReportDetails.pageSize = metadataReportDetails.reportProperties && metadataReportDetails.reportProperties.pageSize && metadataReportDetails.reportViewType != AnalyticsCommonConstants.ReportViewType.GaugeChart ? metadataReportDetails.reportProperties.pageSize : 0;//Sending the 0 for default Page Size.The loic has been written in api.
        dataReportDetails.isPercentageEnabledSummaryCard = metadataReportDetails.isPercentageEnabledSummaryCard;
        dataReportDetails.EnableGlobalSliderFiltering = metadataReportDetails.EnableGlobalSliderFiltering;
        if (metadataReportDetails.dataSourceType) {
            dataReportDetails.dataSourceType = metadataReportDetails.dataSourceType;
        }
        // Mapping the Layout Area in case of the Flex Grid Report Objects
        if (metadataReportDetails.reportViewType === DashboardConstants.ReportViewType.Flex) {
            if (metadataReportDetails.lstReportObjectOnColumn != undefined && metadataReportDetails.lstReportObjectOnColumn != null) {
                metadataReportDetails.lstReportObjectOnColumn.map(roColumn =>
                    roColumn.layoutArea = DashboardConstants.ReportObjectLayoutArea.Rows);
            } else metadataReportDetails.lstReportObjectOnColumn = [];
            metadataReportDetails.lstReportObjectOnRow.map(roRow =>
                roRow.layoutArea = DashboardConstants.ReportObjectLayoutArea.Rows);
        }
        else if (metadataReportDetails.reportViewType === DashboardConstants.ReportViewType.MapChart) {
            metadataReportDetails.lstReportObjectOnColumn.map(roColumn =>
                roColumn.layoutArea = DashboardConstants.ReportObjectLayoutArea.Columns);
            metadataReportDetails.lstReportObjectOnRow.map(roRow =>
                roRow.layoutArea = DashboardConstants.ReportObjectLayoutArea.Rows);
        }

        //Fill Select List.
        let metaDataReportObjectsList = [];
        if (metadataReportDetails.lstReportObjectOnRow != undefined && metadataReportDetails.lstReportObjectOnRow != null)
            metaDataReportObjectsList =
                metadataReportDetails.lstReportObjectOnRow
                    .concat(metadataReportDetails.lstReportObjectOnColumn)
                    .concat(metadataReportDetails.lstReportObjectOnValue);

        metaDataReportObjectsList = compact(metaDataReportObjectsList);
        // Fill Report Object Details
        metaDataReportObjectsList.forEach(reportObjectMetadata => {
            let reportObjectData = new ReportObject_Data();
            reportObjectData.reportObjectId = reportObjectMetadata.reportObjectId;
            reportObjectData.reportObjectName = reportObjectMetadata.reportObjectName;
            reportObjectData.reportObjectType = reportObjectMetadata.reportObjectType;
            reportObjectData.reportObjectDataType = reportObjectMetadata.reportObjectDataType;
            reportObjectData.layoutArea = reportObjectMetadata.layoutArea;
            reportObjectData.filterType = reportObjectMetadata.filterType;
            reportObjectData.isDrill = reportObjectMetadata.isDrill;

            reportObjectData.expression = reportObjectMetadata.expression;
            reportObjectData.tableName = reportObjectMetadata.tableName;
            reportObjectData.parentReportObjects = reportObjectMetadata.parentReportObjects
            reportObjectData.isLinkActive = reportObjectMetadata.isLinkActive;
            reportObjectData.isStandardFilterRO = reportObjectMetadata.isStandardFilterRO;
            reportObjectData.derivedRoType = reportObjectMetadata.derivedRoType;
            dataReportDetails.lstReportObject.push(reportObjectData);
        });

        //Fill Filter Object List
        this.MapFilterObjectMetaDataToData(dataReportDetails, metadataReportDetails.lstFilterReportObject);


        //Fill Sort Object List
        metadataReportDetails.lstReportSortingDetails.forEach(reportSortMetadata => {

            let sortReportObjectData = new SortReportObject_Data()

            sortReportObjectData.reportObject = new ReportObject_Data();
            sortReportObjectData.reportObject.reportObjectId = reportSortMetadata.reportObject.reportObjectId;
            sortReportObjectData.reportObject.reportObjectName = reportSortMetadata.reportObject.reportObjectName;
            sortReportObjectData.reportObject.reportObjectType = reportSortMetadata.reportObject.reportObjectType;
            sortReportObjectData.reportObject.reportObjectDataType = reportSortMetadata.reportObject.reportObjectDataType;
            sortReportObjectData.reportObject.layoutArea = reportSortMetadata.reportObject.layoutArea;
            sortReportObjectData.reportObject.filterType = reportSortMetadata.reportObject.filterType;
            sortReportObjectData.reportObject.isDrill = reportSortMetadata.reportObject.isDrill;

            sortReportObjectData.sortOrder = reportSortMetadata.sortOrder;
            sortReportObjectData.sortType = reportSortMetadata.sortType;

            sortReportObjectData.reportObject.expression = reportSortMetadata.reportObject.expression;
            sortReportObjectData.reportObject.derivedRoType = reportSortMetadata.reportObject.derivedRoType;
            sortReportObjectData.reportObject.tableName = reportSortMetadata.reportObject.tableName;
            sortReportObjectData.reportObject.parentReportObjects = reportSortMetadata.reportObject.parentReportObjects;
            dataReportDetails.lstSortReportObject.push(sortReportObjectData);
        });


        return dataReportDetails;
    }


    public static MapFilterObjectMetaDataToData(dataReportDetails, lstFilterReportObject) {
        //Fill Filter Object List
        lstFilterReportObject.forEach(reportFilterMetadata => {
            let reportFilterData = new ReportFilter_Data()

            reportFilterData.reportObject = new ReportObject_Data();
            reportFilterData = {
                operators: reportFilterMetadata.filterCondition.condition,
                values: reportFilterMetadata.filterValue,
                NestedReportFilterObject: reportFilterMetadata.NestedReportFilterObject,
                SetConditionalOperator: reportFilterMetadata.SetConditionalOperator,
                FilterIdentifierType: reportFilterMetadata.FilterIdentifier,
            } as ReportFilter_Data;
            reportFilterData.reportObject = {
                reportObjectId: reportFilterMetadata.reportObject.reportObjectId,
                reportObjectName: reportFilterMetadata.reportObject.reportObjectName,
                reportObjectType: reportFilterMetadata.reportObject.reportObjectType,
                reportObjectDataType: reportFilterMetadata.reportObject.reportObjectDataType,
                layoutArea: reportFilterMetadata.reportObject.layoutArea,
                filterType: reportFilterMetadata.reportObject.filterType,
                isDrill: reportFilterMetadata.reportObject.isDrill,
                isStandardFilterRO: reportFilterMetadata.reportObject.isStandardFilterRO,


                expression: reportFilterMetadata.reportObject.expression,
                tableName: reportFilterMetadata.reportObject.tableName,
                parentReportObjects: reportFilterMetadata.reportObject.parentReportObjects,
                derivedRoType: reportFilterMetadata.reportObject.derivedRoType
            } as ReportObject_Data;            

            //Code written to handle nested filters in data if multiple filters applied on same RO
            let existingDataFilterIndex = findIndex(dataReportDetails.lstFilterReportObject, (dataFilterRO: any) => {
                return dataFilterRO.reportObject.reportObjectId == reportFilterData.reportObject.reportObjectId;
            });
            if (existingDataFilterIndex > -1) {
                reportFilterData.NestedReportFilterObject = dataReportDetails.lstFilterReportObject[existingDataFilterIndex];
                reportFilterData.SetConditionalOperator = DashboardConstants.ConditionalOperator.AND;
                dataReportDetails.lstFilterReportObject.splice(existingDataFilterIndex, 1);
            }

            dataReportDetails.lstFilterReportObject.push(reportFilterData);
        });
    }
}
