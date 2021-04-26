import { Injectable } from '@angular/core';
import { ViewFilterDetails } from './view-filter-details.model';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { TabDetail } from '@vsDashletModels/tab-detail-model';
import { productName } from 'configuration/productConfig';


// Class provides instance properties for ViewDetails which will be used for .

export class ViewInfo {

    // ViewId is Unique Identifier for View.
    viewId: string;

    // Provides View Name.
    viewName: string;

    // CreatedOn : Specify when User has created View.
    createdOn: Date;

    // CreatedBy : Specify which User has created View.
    createdBy: string;

    UserName: string;

    // ModifiedOn : Specify when User has modified View. 
    modifiedOn: Date;

    // ModifiedBy : Specify which User has modified View.
    modifiedBy: string;

    // ModifiedBy : Specify which User has modified View.
    isStandard: boolean;

    // Checking is the View type is Own or Shared View.
    isOwn?: boolean;

    // lstDashboardFilters : List of filters applied on dashboard.
    lstDashboardFilters: Array<ViewFilterDetails>;

    //Number for dashlets present in view excluding summary card
    dashletCount: number;

    //Is true when maximum limit for pining dashlets in view is reached else false
    maxCountReachedForPinning: boolean;

    //Is true when the view is a drilled down view
    isDrilledDownView: boolean;

    ShareUserCount: number;

    //To identity datasource type of each view
    datasourceType: AnalyticsCommonConstants.DataSourceType;

    //To get product name of each view
    ViewProductName: string;

    iShared: boolean;
    DataSourceObjectId: string;
    IsHiddenView: boolean;

    //lst of tabs present in the given view.
    lstTabInfo: Array<any>;

    //Produt Type of the given product
    ProductName: productName = productName.defaultVisionProduct;

    constructor(viewInfo: any) {
        this.viewId = viewInfo.ViewId;
        this.viewName = viewInfo.ViewName;
        this.createdOn = viewInfo.CreatedOn;
        this.createdBy = viewInfo.CreatedBy;
        this.UserName = viewInfo.UserName;
        this.modifiedOn = viewInfo.ModifiedOn;
        this.modifiedBy = viewInfo.ModifiedBy;
        this.isStandard = viewInfo.IsStandard;
        this.lstDashboardFilters = [];
        this.dashletCount = viewInfo.dashletCount;
        this.maxCountReachedForPinning = viewInfo.maxCountReachedForPinning;
        this.datasourceType = viewInfo.DatasourceType;
        this.ViewProductName = viewInfo.ViewProductName;
        this.isDrilledDownView = viewInfo.IsDrilledDownView;
        this.iShared = viewInfo.iShared;
        this.DataSourceObjectId = viewInfo.DataSourceObjectId;
        this.ShareUserCount = viewInfo.ShareUserCount;
        this.IsHiddenView = viewInfo.IsHiddenView;
        AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstDashboardFilters, viewInfo.lstDashboardFilters, new ViewFilterDetails);
        this.lstTabInfo = [];
        this.ProductName = productName.defaultVisionProduct;
    }
}
