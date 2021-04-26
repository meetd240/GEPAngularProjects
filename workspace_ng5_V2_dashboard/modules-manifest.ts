// declare const System;
// import { IManifestCollection } from 'smart-module-loader'
// export const LazyComponentConfiguration = {
//     SmartCardsContainer: {
//         componentName: 'SmartCardsContainerComponent',
//         moduleName: 'SmartCardsContainerModule',
//         key: 'SmartCardsContainer'
//     },
//     SmartGridstackLayout: {
//         componentName: 'SmartGridstackLayoutComponent',
//         moduleName: 'SmartGridstackLayoutModule',
//         key: 'SmartGridstackLayout'
//     },
//     SmartCardsPlaceholder: {
//         componentName: 'SmartCardsPlaceholderComponent',
//         moduleName: 'SmartCardsPlaceholderModule',
//         key: 'SmartCardsPlaceholder'

//     },
//     DashboardCard: {
//         componentName: 'DashboardCardComponent',
//         moduleName: 'DashboardCardModule',
//         key: 'DashboardCard'
//     },
//     StringFilter: {
//         componentName: 'StringFilterComponent',
//         moduleName: 'StringFilterModule',
//         key: 'stringFilter'
//     },
//     MeasuresFilter: {
//         componentName: 'MeasuresFilterComponent',
//         moduleName: 'MeasuresFilterModule',
//         key: 'measuresFilter'
//     },
//     NumberFilter: {
//         componentName: 'NumberFilterComponent',
//         moduleName: 'NumberFilterModule',
//         key: 'numberFilter'
//     },
//     PeriodFilter: {
//         componentName: 'PeriodFilterComponent',
//         moduleName: 'PeriodFilterModule',
//         key: 'periodFilter'
//     },
//     SliderWidget: {
//         componentName: 'SliderWidgetComponent',
//         moduleName: 'SliderWidgetModule',
//         key: 'periodFilter'
//     },
//     GlobalFilter: {
//         componentName: "GlobalFilterComponent",
//         moduleName: "GlobalFilterModule",
//         key: 'globalFilter'
//     },
//     SummaryCard: {
//         componentName: "SummaryCardComponent",
//         moduleName: "SummaryCardModule",
//         key: 'summaryCard'
//     },
//     ViewRenamePopup: {
//         componentName: "ViewRenamePopupComponent",
//         moduleName: "ViewRenamePopupModule",
//         key: 'viewRenamePopup'
//     },
//     ViewAppliedFilterPopup: {
//         componentName: "ViewAppliedFilterPopupComponent",
//         moduleName: "ViewAppliedFilterPopupModule",
//         key: 'viewAppliedFilterPopup'
//     },
//     SelectYearPopup: {
//         componentName: "SelectYearPopupComponent",
//         moduleName: "SelectYearPopupModule",
//         key: 'selectYearPopup'
//     },
//     DashboardViewsPopup: {
//         componentName: "DashboardViewsPopupComponent",
//         moduleName: "DashboardViewsPopupModule",
//         key: 'dashboardViewsPopup'
//     },
//     PurchasePricePopup: {
//         componentName: "PurchasePricePopupComponent",
//         moduleName: "PurchasePricePopupModule",
//         key: 'purchasePricePopup'
//     },
//     AutoPaymentTerm: {
//         componentName: "AutoPaymentTermComponent",
//         moduleName: "AutoPaymentTermModule",
//         key: 'autoPaymentTerm'
//     },
//     BestPaymentDate: {
//         componentName: "BestPaymentDateComponent",
//         moduleName: "BestPaymentDateModule",
//         key: 'bestPaymentDate'
//     },
//     UserMessage: {
//         componentName: "UserMessageComponent",
//         moduleName: "UserMessageModule",
//         key: 'userMessage'
//     },
//     SupplierListPopUp: {
//         componentName: "SupplierListPopupComponent",
//         moduleName: "SupplierListPopupModule",
//         key: 'supplierListPopUp'
//     },
//     saveAsPopup: {
//         componentName: "DashboardSaveAsPopupComponent",
//         moduleName: "SaveAsPopupModule",
//         key: 'saveAsPopup'
//     },
//     CustomSummaryCardsWrapper: {
//         componentName: "CustomSummaryCardsWrapperComponent",
//         moduleName: "CustomSummaryCardsWrapperModule",
//         key: 'customSummaryCardsWrapper'
//     },
//     addToStandardFilterPopup: {
//         componentName: "AddToStandardFilterPopupComponent",
//         moduleName: "AddToStandardFilterPopupModule",
//         key: 'addToStandardFilterPopup'
//     }
// }

// export const visionModulesManifest: IManifestCollection = {
//     SmartCardsContainer: {
//         componentsExport: [LazyComponentConfiguration.SmartCardsContainer.componentName],
//         moduleExport: LazyComponentConfiguration.SmartCardsContainer.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "cards-container" */ './node_modules/smart-cards-manager') // Path where to find
//     },
//     SmartGridstackLayout: {
//         componentsExport: [LazyComponentConfiguration.SmartGridstackLayout.componentName],
//         moduleExport: LazyComponentConfiguration.SmartGridstackLayout.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "smart-gridstack-layout" */ './node_modules/smart-gridstack-layout')
//     },
//     SmartCardsPlaceholder: {
//         componentsExport: [LazyComponentConfiguration.SmartCardsPlaceholder.componentName],
//         moduleExport: LazyComponentConfiguration.SmartCardsPlaceholder.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "smart-cards-placeholder" */ './node_modules/smart-cards-placeholder')
//     },
//     DashboardCard: {
//         componentsExport: [LazyComponentConfiguration.DashboardCard.componentName],
//         moduleExport: LazyComponentConfiguration.DashboardCard.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "dashboard-card" */ './src/app/dashboard-card')
//     },
//     stringFilter: {
//         componentsExport: [LazyComponentConfiguration.StringFilter.componentName],
//         moduleExport: LazyComponentConfiguration.StringFilter.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "string-filter" */  './src/app/global-filter/string-filter/string-filter.module')
//     },
//     measuresFilter: {
//         componentsExport: [LazyComponentConfiguration.MeasuresFilter.componentName],
//         moduleExport: LazyComponentConfiguration.StringFilter.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "measures-filter" */  './src/app/global-filter/measures-filter/measures-filter.module')
//     },
//     numberFilter: {
//         componentsExport: [LazyComponentConfiguration.NumberFilter.componentName],
//         moduleExport: LazyComponentConfiguration.NumberFilter.componentName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "number-filter" */  './src/app/global-filter/number-filter/number-filter.module')
//     },
//     periodFilter: {
//         componentsExport: [LazyComponentConfiguration.PeriodFilter.componentName],
//         moduleExport: LazyComponentConfiguration.PeriodFilter.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "period-filter" */  './src/app/global-filter/period-filter/period-filter.module')
//     },
//     sliderWidget: {
//         componentsExport: [LazyComponentConfiguration.SliderWidget.componentName],
//         moduleExport: LazyComponentConfiguration.SliderWidget.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "slider-widget" */  './src/app/slider-widget/slider-widget.module')
//     },
//     globalFilter: {
//         componentsExport: [LazyComponentConfiguration.GlobalFilter.componentName],
//         moduleExport: LazyComponentConfiguration.GlobalFilter.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "global-filter" */  './src/app/global-filter/global-filter.module')
//     },
//     summaryCard: {
//         componentsExport: [LazyComponentConfiguration.SummaryCard.componentName],
//         moduleExport: LazyComponentConfiguration.SummaryCard.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "summary-card" */  './src/app/summary-card/summary-card.module')
//     },
//     viewRenamePopup: {
//         componentsExport: [LazyComponentConfiguration.ViewRenamePopup.componentName],
//         moduleExport: LazyComponentConfiguration.ViewRenamePopup.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "view-rename-popup" */  './src/app/view-rename-popup/view-rename-popup.module')
//     },
//     viewAppliedFilterPopup: {
//         componentsExport: [LazyComponentConfiguration.ViewAppliedFilterPopup.componentName],
//         moduleExport: LazyComponentConfiguration.ViewAppliedFilterPopup.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "view-applied-filter-popup" */  './src/app/view-applied-filter-popup/view-applied-filter-popup.module')
//     },
//     selectYearPopup: {
//         componentsExport: [LazyComponentConfiguration.SelectYearPopup.componentName],
//         moduleExport: LazyComponentConfiguration.SelectYearPopup.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "select-year-popup" */  './src/app/global-filter/period-filter/select-year-popup/select-year-poup.module')
//     },
//     dashboardViewsPopup: {
//         componentsExport: [LazyComponentConfiguration.DashboardViewsPopup.componentName],
//         moduleExport: LazyComponentConfiguration.DashboardViewsPopup.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "dashboard-views-popup" */  './src/app/dashboard-views-popup/dashboard-views-popup.module')
//     },
//     purchasePricePopup: {
//         componentsExport: [LazyComponentConfiguration.PurchasePricePopup.componentName],
//         moduleExport: LazyComponentConfiguration.PurchasePricePopup.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "purchase-price-popup" */  './src/app/purchase-price-popup/purchase-price-popup.module')
//     },
//     autoPaymentTerm: {
//         componentsExport: [LazyComponentConfiguration.AutoPaymentTerm.componentName],
//         moduleExport: LazyComponentConfiguration.AutoPaymentTerm.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "auto-payment-term" */  './src/app/auto-payment-term/auto-payment-term.module')
//     },
//     bestPaymentDate: {
//         componentsExport: [LazyComponentConfiguration.BestPaymentDate.componentName],
//         moduleExport: LazyComponentConfiguration.BestPaymentDate.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "best-payment-term" */  './src/app/best-payment-date/best-payment-date.module')
//     },
//     userMessage: {
//         componentsExport: [LazyComponentConfiguration.UserMessage.componentName],
//         moduleExport: LazyComponentConfiguration.UserMessage.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "user-message" */  './src/app/user-message/user-message.module')
//     },
//     supplierListPopUp: {
//         componentsExport: [LazyComponentConfiguration.SupplierListPopUp.componentName],
//         moduleExport: LazyComponentConfiguration.SupplierListPopUp.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "supplier-list-popup" */  './src/app/supplier-list-popup/supplier-list-popup.module')
//     },
//     saveAsPopup: {
//         componentsExport: [LazyComponentConfiguration.saveAsPopup.componentName],
//         moduleExport: LazyComponentConfiguration.saveAsPopup.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "dashboard-save-as-popup" */'./src/app/save-as-popup/dashboard-save-as-popup.module')
//     },
//     customSummaryCardsWrapper: {
//         componentsExport: [LazyComponentConfiguration.CustomSummaryCardsWrapper.componentName],
//         moduleExport: LazyComponentConfiguration.CustomSummaryCardsWrapper.moduleName,
//         moduleInvoke: () => System.import(/* webpackChunkName: "custom-summary-cards-wrapper" */  './src/app/custom-summary-cards-wrapper/custom-summary-cards-wrapper.module')
//     },
//     addToStandardFilterPopup: {
//         componentsExport: [LazyComponentConfiguration.addToStandardFilterPopup.componentName],
//         moduleExport: LazyComponentConfiguration.addToStandardFilterPopup.moduleName,
//         moduleInvoke: () => System.import( /* webpackChunkName: "non-standard-filter-popup" */'./src/app/add-to-standard-filter-popup/add-to-standard-filter-popup.module')
//     }
// };


