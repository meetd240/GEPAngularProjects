import { IProductConfiguration } from "@vsDashboardInterface";
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

export enum productName {
  opportunityAssessmentProduct = 'opportunityAssessmentProduct',
  opportunityFinderProduct = 'opportunityFinderProduct',
  fraudAnomalyProduct = 'fraudAnomalyProduct',
  categoryWorkbenchProduct = 'categoryWorkbenchProduct',
  defaultVisionProduct = 'defaultVisionProduct',
  bidInsightsProduct = 'bidInsightsProduct',
  awardScenariosProduct = 'awardScenariosProduct',
  scorecardProduct = 'ScoreCard'
}

export const productTitle = {
  [productName.defaultVisionProduct]: 'Vision',
  [productName.opportunityFinderProduct]: 'Opportunity Finder',
  [productName.fraudAnomalyProduct] : 'Fraud and Anomaly',
  [productName.opportunityAssessmentProduct]: 'Opportunity Assessment',
  [productName.categoryWorkbenchProduct]: 'Category Workbench',
  [productName.bidInsightsProduct]: 'Bid Insights',
  [productName.awardScenariosProduct]: 'Award Scenarios',
  [productName.scorecardProduct]: 'ScoreCard'
}

/**
 *  This is for the Opportunity Assessment Product Configuration Setup Activity
 */
const opportunityAssessmentProduct: any = {
  productTitle: productTitle[productName.opportunityAssessmentProduct],
  showViewSelectionOption: false,
  showFilterIconOption: true,
  showSaveViewOption: true,
  showRenameViewOption: true,
  showAddToStandardViewOption: false,
  showDeleteViewOption: false,
  showUnlinkLinkReportOption: false,
  showAppliedViewFilterOption: true,
  showRenameReportOption: true,
  showRemoveReportOption: false,
  showOpenReportOption: true,
  showSortOption: true,
  showFullScreenOption: true,
  enablePersistanceOption: true,
  showSliderWidgetOption: true,
  showSummaryTitleOption: true,
  showAddDescriptionOption: true,
  showSaveAsOption: false,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: false,
  showReportTypeIdentifier: false,
  showSummaryPercentageOption: true,
  showAddWidgetIconOption: false,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: false,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: false,
  showSlicerFilter: false,
  grandTotalAlwaysOn: false,
  enableIngestion: false,
  showMoveToTab: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration

/**
 *  This is for the Opportunity Assessment Product Configuration Setup Activity
 */
const opportunityFinderProduct: any = {
  productTitle: productTitle[productName.opportunityFinderProduct],
  showViewSelectionOption: false,
  showFilterIconOption: true,
  showSaveViewOption: false,
  showRenameViewOption: false,
  showAddToStandardViewOption: false,
  showDeleteViewOption: false,
  showUnlinkLinkReportOption: false,
  showAppliedViewFilterOption: false,
  showRenameReportOption: false,
  showRemoveReportOption: false,
  showOpenReportOption: false,
  showSortOption: false,
  showFullScreenOption: false,
  enablePersistanceOption: false,
  showSliderWidgetOption: false,
  showSummaryTitleOption: false,
  showAddDescriptionOption: false,
  showSaveAsOption: false,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: false,
  showReportTypeIdentifier: false,
  showSummaryPercentageOption: false,
  showAddWidgetIconOption: false,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: false,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: true,
  showSlicerFilter: false,
  grandTotalAlwaysOn: true,
  enableIngestion: false,
  showMoveToTab: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration

/**
 *  This is for the Fraud and Anomaly Product Configuration Setup Activity
 */
const fraudAnomalyProduct: any = {
  productTitle: productTitle[productName.fraudAnomalyProduct],
  showViewSelectionOption: false,
  showFilterIconOption: true,
  showSaveViewOption: false,
  showRenameViewOption: false,
  showAddToStandardViewOption: false,
  showDeleteViewOption: false,
  showUnlinkLinkReportOption: false,
  showAppliedViewFilterOption: false,
  showRenameReportOption: false,
  showRemoveReportOption: false,
  showOpenReportOption: false,
  showSortOption: false,
  showFullScreenOption: true,
  enablePersistanceOption: false,
  showSliderWidgetOption: false,
  showSummaryTitleOption: false,
  showAddDescriptionOption: false,
  showSaveAsOption: false,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: false,
  showReportTypeIdentifier: false,
  showSummaryPercentageOption: false,
  showAddWidgetIconOption: false,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: false,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: true,
  showSlicerFilter: false,
  grandTotalAlwaysOn: false,
  enableIngestion: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration

/**
 *  This is for the Default Vision Product Configuration Setup Activity
 */
const defaultVisionProduct: any = {
  productTitle: productTitle[productName.defaultVisionProduct],
  showViewSelectionOption: true,
  showFilterIconOption: true,
  showSaveViewOption: true,
  showRenameViewOption: true,
  showAddToStandardViewOption: true,
  showAppliedViewFilterOption: true,
  showDeleteViewOption: true,
  showUnlinkLinkReportOption: true,
  showRenameReportOption: true,
  showRemoveReportOption: true,
  showOpenReportOption: true,
  showSortOption: true,
  showFullScreenOption: true,
  enablePersistanceOption: true,
  showSliderWidgetOption: true,
  showSummaryTitleOption: true,
  showAddDescriptionOption: true,
  showSaveAsOption: true,
  showLinkToDashboardption: true,
  showAddToDrilledViewOption: true,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: true,
  showReportTypeIdentifier: true,
  showSummaryPercentageOption: true,
  showAddWidgetIconOption: true,
  showSharedDashboardViewPopup: true,
  enableCarryOverFilterOption: true,
  showRefreshViewOption: true,
  enableFormattingOnSummaryCard: true,
  showSlicerFilter: true,
  grandTotalAlwaysOn: true,
  enableIngestion: true,
  showMoveToTab: true,
  showEnableGlobalSliderChecbox: true
} as IProductConfiguration

/**
 *  This is for the Default Vision Product Configuration Setup Activity
 */
const categoryWorkbenchProduct: any = {
  productTitle: productTitle[productName.categoryWorkbenchProduct],
  showViewSelectionOption: true,
  showFilterIconOption: true,
  showSaveViewOption: false,
  showRenameViewOption: false,
  showAddToStandardViewOption: false,
  showAppliedViewFilterOption: true,
  showDeleteViewOption: false,
  showUnlinkLinkReportOption: false,
  showRenameReportOption: false,
  showRemoveReportOption: false,
  showOpenReportOption: true,
  showSortOption: true,
  showFullScreenOption: true,
  enablePersistanceOption: true,
  showSliderWidgetOption: true,
  showSummaryTitleOption: true,
  showAddDescriptionOption: false,
  showSaveAsOption: false,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: false,
  showCopyViewUrl: false,
  showReportTypeIdentifier: false,
  showSummaryPercentageOption: true,
  showAddWidgetIconOption: false,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: false,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: false,
  showSlicerFilter: false,
  grandTotalAlwaysOn: false,
  enableIngestion: false,
  showMoveToTab: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration

/**
 *  This is for the Bid Insights Product Configuration Setup Activity
 */
const bidInsightsProduct: any = {
  productTitle: productTitle[productName.bidInsightsProduct],
  showViewSelectionOption: true,
  showFilterIconOption: true,
  showSaveViewOption: true,
  showRenameViewOption: true,
  showAddToStandardViewOption: false,
  showAppliedViewFilterOption: true,
  showDeleteViewOption: true,
  showUnlinkLinkReportOption: false,
  showRenameReportOption: true,
  showRemoveReportOption: true,
  showOpenReportOption: true,
  showSortOption: true,
  showFullScreenOption: true,
  enablePersistanceOption: true,
  showSliderWidgetOption: true,
  showSummaryTitleOption: true,
  showAddDescriptionOption: true,
  showSaveAsOption: true,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: true,
  showReportTypeIdentifier: true,
  showSummaryPercentageOption: true,
  showAddWidgetIconOption: true,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: false,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: false,
  showSlicerFilter: false,
  grandTotalAlwaysOn: false,
  enableIngestion: false,
  showMoveToTab: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration

/**
 *  This is for the Bid Insights Product Configuration Setup Activity
 */
const awardScenariosProduct: any = {
  productTitle: productTitle[productName.awardScenariosProduct],
  showViewSelectionOption: true,
  showFilterIconOption: true,
  showSaveViewOption: true,
  showRenameViewOption: false,
  showAddToStandardViewOption: false,
  showAppliedViewFilterOption: true,
  showDeleteViewOption: false,
  showUnlinkLinkReportOption: false,
  showRenameReportOption: true,
  showRemoveReportOption: true,
  showOpenReportOption: true,
  showSortOption: true,
  showFullScreenOption: true,
  enablePersistanceOption: true,
  showSliderWidgetOption: true,
  showSummaryTitleOption: true,
  showAddDescriptionOption: true,
  showSaveAsOption: false,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: true,
  showReportTypeIdentifier: true,
  showSummaryPercentageOption: true,
  showAddWidgetIconOption: true,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: false,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: false,
  showSlicerFilter: false,
  grandTotalAlwaysOn: false,
  enableIngestion: false,
  showMoveToTab: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration

/**
 *  This is for the Default config for supplier user.
 */
export const ScoreCard: any = {
  productTitle: productTitle[productName.defaultVisionProduct],
  showViewSelectionOption: false,
  showFilterIconOption: false,
  showSaveViewOption: false,
  showRenameViewOption: false,
  showAddToStandardViewOption: false,
  showAppliedViewFilterOption: false,
  showDeleteViewOption: false,
  showUnlinkLinkReportOption: false,
  showRenameReportOption: false,
  showRemoveReportOption: false,
  showOpenReportOption: false,
  showSortOption: false,
  showFullScreenOption: true,
  enablePersistanceOption: false,
  showSliderWidgetOption: false,
  showSummaryTitleOption: false,
  showAddDescriptionOption: false,
  showSaveAsOption: false,
  showLinkToDashboardption: false,
  showAddToDrilledViewOption: false,
  showSubheaderComponent: true,
  showSmartHedaerCompponent: true,
  showCopyViewUrl: false,
  showReportTypeIdentifier: true,
  showSummaryPercentageOption: false,
  showAddWidgetIconOption: false,
  showSharedDashboardViewPopup: false,
  enableCarryOverFilterOption: true,
  showRefreshViewOption: false,
  enableFormattingOnSummaryCard: false,
  showSlicerFilter: false,
  grandTotalAlwaysOn: false,
  enableIngestion: false,
  showEnableGlobalSliderChecbox: false
} as IProductConfiguration


export const productConfiguration = {
  opportunityAssessmentProduct,
  opportunityFinderProduct,
  fraudAnomalyProduct,
  defaultVisionProduct,
  categoryWorkbenchProduct,
  bidInsightsProduct,
  awardScenariosProduct,
  ScoreCard
}

/*
-creating copy of UIMessageConstants and WidgetFunction object in ProductLevelActionNameConstants object since productConfig file is loaded before string getting translated to multilingual in AnalyticsCommonConstants object
-So instead of passing translated value from AnalyticsCommonConstants.UIMessageConstants we pass ProductLevelActionNameConstants['UIMessageConstants'/'WidgetFunction'] value to fetch respective condition
*/
export const ProductLevelActionNameConstants = {
  UIMessageConstants: JSON.parse(JSON.stringify(AnalyticsCommonConstants.UIMessageConstants)),
  WidgetFunction: JSON.parse(JSON.stringify((AnalyticsCommonConstants.WidgetFunction)))
}

export const ActionMenuConditions = { 
  [AnalyticsCommonConstants.ActionMenuType.SubHeaderMenu]: {
    [productName.defaultVisionProduct]: {
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSaveViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_RENAME_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRenameViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this._appConstants.userPreferences.Activities.indexOf(DashboardConstants.VisionUserActivites.INSIGHT_VISION_ADMIN) != -1 && this._appConstants.userPreferences.moduleSettings.showAddToStandardViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_ADD_STANDARD_VIEW_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this._appConstants.userPreferences.Activities.indexOf(DashboardConstants.VisionUserActivites.INSIGHT_VISION_ADMIN) != -1 && this._appConstants.userPreferences.moduleSettings.showAddToStandardViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_DELETE_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showDeleteViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSaveAsOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.selectedDashboard && this.subheaderConfig.HasUserVisionEditActivity &&this._appConstants.userPreferences.moduleSettings.showAddToDrilledViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_MARK_AS_DRILLED_DOWN_DASHBOARD]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.selectedDashboard && this.subheaderConfig.HasUserVisionEditActivity &&this._appConstants.userPreferences.moduleSettings.showAddToDrilledViewOption"
    },
    [productName.bidInsightsProduct]: {
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSaveViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_RENAME_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRenameViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT]: "this._appConstants.userPreferences.moduleSettings.showAddToStandardViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_ADD_STANDARD_VIEW_BTN_TXT]: "this._appConstants.userPreferences.moduleSettings.showAddToStandardViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_DELETE_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showDeleteViewOption ",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSaveAsOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD]: "this._appConstants.userPreferences.moduleSettings.showAddToDrilledViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_MARK_AS_DRILLED_DOWN_DASHBOARD]: "this._appConstants.userPreferences.moduleSettings.showAddToDrilledViewOption"
    },
    [productName.awardScenariosProduct]: {
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSaveViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_RENAME_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRenameViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT]: "this._appConstants.userPreferences.moduleSettings.showAddToStandardViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_ADD_STANDARD_VIEW_BTN_TXT]: "this._appConstants.userPreferences.moduleSettings.showAddToStandardViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_DELETE_BTN_TXT]: "this.subheaderConfig.selectedDashboard.isOwn && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showDeleteViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSaveAsOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD]: "this._appConstants.userPreferences.moduleSettings.showAddToDrilledViewOption",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_MARK_AS_DRILLED_DOWN_DASHBOARD]: "this._appConstants.userPreferences.moduleSettings.showAddToDrilledViewOption"
    },
    [productName.categoryWorkbenchProduct]: {
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_RENAME_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_REMOVE_STANDARD_VIEW_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_ADD_STANDARD_VIEW_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_DELETE_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_SAVE_AS_BTN_TXT]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_UNMARK_AS_DRILLED_DOWN_DASHBOARD]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.UIMessageConstants.STRING_MARK_AS_DRILLED_DOWN_DASHBOARD]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable"
    }
  },
  [AnalyticsCommonConstants.ActionMenuType.DashboardCard]: {
    [productName.defaultVisionProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.RENAME]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRenameReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRemoveReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "(_obj.reportDetails.createdBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode ||_obj.reportDetails.isStandardReport == true|| _obj.reportDetails.IsSharedReport==true) && this._appConstants.userPreferences.moduleSettings.showOpenReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && _obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showUnlinkLinkReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    },
    [productName.bidInsightsProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.RENAME]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRenameReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRemoveReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "this._appConstants.userPreferences.moduleSettings.showOpenReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && _obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showUnlinkLinkReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    },
    [productName.awardScenariosProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.RENAME]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRenameReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRemoveReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "this._appConstants.userPreferences.moduleSettings.showOpenReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && _obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showUnlinkLinkReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    },
    [productName.categoryWorkbenchProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.RENAME]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    }
  },
  [AnalyticsCommonConstants.ActionMenuType.SummaryCard]: {
    [productName.defaultVisionProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.HIDE_TITLE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity&& this._appConstants.userPreferences.moduleSettings.showSummaryTitleOption",
      [ProductLevelActionNameConstants.WidgetFunction.SHOW_TITLE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity&& this._appConstants.userPreferences.moduleSettings.showSummaryTitleOption",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRemoveReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "(_obj.reportDetails.createdBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode ||_obj.reportDetails.isStandardReport == true|| _obj.reportDetails.IsSharedReport==true) && this._appConstants.userPreferences.moduleSettings.showOpenReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && _obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showUnlinkLinkReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.ADD_DESCRIPTION]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showAddDescriptionOption",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.HidePercentageValue]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSummaryPercentageOption && ((_obj.reportDetails.lstReportObjectOnRow.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnColumn.length == 0) || (_obj.reportDetails.lstReportObjectOnColumn.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnRow.length == 0))",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"

    },
    [productName.bidInsightsProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.HIDE_TITLE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity&& this._appConstants.userPreferences.moduleSettings.showSummaryTitleOption",
      [ProductLevelActionNameConstants.WidgetFunction.SHOW_TITLE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity&& this._appConstants.userPreferences.moduleSettings.showSummaryTitleOption",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRemoveReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "this._appConstants.userPreferences.moduleSettings.showOpenReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && _obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showUnlinkLinkReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.ADD_DESCRIPTION]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showAddDescriptionOption",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.HidePercentageValue]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSummaryPercentageOption && ((_obj.reportDetails.lstReportObjectOnRow.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnColumn.length == 0) || (_obj.reportDetails.lstReportObjectOnColumn.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnRow.length == 0))",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    },
    [productName.awardScenariosProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.HIDE_TITLE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity&& this._appConstants.userPreferences.moduleSettings.showSummaryTitleOption",
      [ProductLevelActionNameConstants.WidgetFunction.SHOW_TITLE]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity&& this._appConstants.userPreferences.moduleSettings.showSummaryTitleOption",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showRemoveReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "this._appConstants.userPreferences.moduleSettings.showOpenReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && _obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showUnlinkLinkReportOption",
      [ProductLevelActionNameConstants.WidgetFunction.ADD_DESCRIPTION]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showAddDescriptionOption",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showLinkToDashboardption",
      [ProductLevelActionNameConstants.WidgetFunction.HidePercentageValue]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showSummaryPercentageOption && ((_obj.reportDetails.lstReportObjectOnRow.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnColumn.length == 0) || (_obj.reportDetails.lstReportObjectOnColumn.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnRow.length == 0))",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    },
    [productName.categoryWorkbenchProduct]: {
      [ProductLevelActionNameConstants.WidgetFunction.HIDE_TITLE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.SHOW_TITLE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.REMOVE]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.OPEN_REPORT]: "this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK]: "_obj.isLinkReport && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.ADD_DESCRIPTION]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.LINK_TO_DASHBOARD]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.UNLINK_FROM_DASHBOARD]: "this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.HidePercentageValue]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && ((_obj.reportDetails.lstReportObjectOnRow.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnColumn.length == 0) || (_obj.reportDetails.lstReportObjectOnColumn.length == 1 && _obj.reportDetails.lstReportObjectOnValue.length == 1 && _obj.reportDetails.lstReportObjectOnRow.length == 0)) && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.isCWEditable",
      [ProductLevelActionNameConstants.WidgetFunction.MoveTo]: "_obj.addedBy == this._appConstants.userPreferences.UserBasicDetails.ContactCode && this.subheaderConfig.HasUserVisionEditActivity && this._appConstants.userPreferences.moduleSettings.showMoveToTab && this._dashboardCommService.dashboardTabsList.length > 1"
    }
  }
}
