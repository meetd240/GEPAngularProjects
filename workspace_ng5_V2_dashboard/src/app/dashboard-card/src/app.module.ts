import { NgModule } from '@angular/core';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjOlapModule } from 'wijmo/wijmo.angular2.olap';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from './dashboard-card.component';
import { SmartCardsSharedModule } from 'smart-cards-shared';
import { ChartWidgetDirective } from '@vsChartWidgetService';
import { SmartTooltipModule } from 'smart-tooltip';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartNumericModule } from "smart-numeric";
import { SmartButtonModule } from "smart-button";
import { SmartGlobalLoaderModule } from 'smart-global-loader'
import { SharedModule } from '../../../app/shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartBlockLoaderModule } from 'smart-block-loader';
import { SliderWidgetComponent } from 'app/slider-widget/slider-widget.component';
import { SmartAutocompleteModule } from 'smart-autocomplete';

const _dashboardCardRoutes: IManifestCollection = [
  { path: 'DashboardCard', component: DashboardCardComponent },
  { path: 'summary-card', loadChildren: '../../summary-card/summary-card.module#SummaryCardModule' },
  { path: 'view-applied-filter-popup', loadChildren: '../../view-applied-filter-popup/view-applied-filter-popup.module#ViewAppliedFilterPopupModule' },
  { path: 'dashboard-card-footer', loadChildren: '../../dashboard-card-footer/dashboard-card-footer.module#DashboardCardFooterModule' },
  { path: 'dashboard-card-header', loadChildren: '../../dashboard-card-header/dashboard-card-header.module#DashboardCardHeaderModule' },
  { path: 'multi-gauge-chart', loadChildren: '../../gauge-chart/gauge-chart.module#GaugeChartModule' },
  { path: 'oppfinder-card', loadChildren: '../../oppfinder-card/oppfinder-card.module#OppFinderCardComponentModule' },
  { path:'default-widget', loadChildren:'../../default-widget/default-widget.module#DefaultWidgetModule'},
  { path: 'assign-spend-popup', loadChildren: '../../assign-spend-popup/assign-spend-popup.module#PurchasePricePopupModule' },
  { path: 'payment-term-rationalization-popup', loadChildren: '../../payment-term-rationalization-popup/payment-term-rationalization-popup.module#PaymentTermRationalizationPopupModule' },
  { path: 'purchase-price-viewdetails-popup', loadChildren: '../../purchase-price-viewdetails-popup/purchase-price-viewdetails-popup.module#PurchasePriceViewDetailsPopupModule' },
  { path: 'tailSpend-supplier', loadChildren: '../../tailSpend-supplier/tailSpend-supplier.module#TailSpendSupplierModule' }


];

@NgModule({
  imports: [
    CommonModule, WjGridModule, WjOlapModule, SmartCardsSharedModule, SmartTooltipModule, SmartTextfieldModule, SmartDropDownModule, SmartNumericModule, SmartButtonModule, SmartGlobalLoaderModule, SharedModule, SmartBlockLoaderModule,
    SmartInjectorModule.forChild(_dashboardCardRoutes),
    SmartAutocompleteModule
  ],
  declarations: [DashboardCardComponent],
  exports: [DashboardCardComponent],
  entryComponents: [SliderWidgetComponent],
})
export class DashboardCardModule {

}
