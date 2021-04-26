import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SmartDropDownModule } from 'smart-dropdown'
import { OppFinderWrapperComponent } from "./oppfinder-wrapper.component";
import { OppFinderGridComponent } from '../oppfinder-grid/oppfinder-grid.component';
import { SubHeaderComponent } from '../sub-header/subHeader.component';
import { SmartStickyHeaderDirective } from 'smart-sticky-header';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { SmartNumericModule } from 'smart-numeric';
import { SmartDateModule } from 'smart-date';
import { SmartSelectModule } from 'smart-select';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartButtonModule } from 'smart-button';
import { SmartTooltipModule } from 'smart-tooltip';
import { SmartRadioModule } from 'smart-radio';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartNumericService } from 'smart-platform-services';
import { SharedModule } from 'app/shared-module/shared-module.module';
import { ViewRenamePopupComponent } from '../../app/view-rename-popup/view-rename-popup.component';
import { ViewAppliedFilterPopupComponent } from 'app/view-applied-filter-popup/view-applied-filter-popup.component';
import { SmartAutocompleteModule } from 'smart-autocomplete';
import { SmartNativeScrollModule } from 'smart-native-scroll';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { GlobalFilterModule } from 'app/global-filter/global-filter.module';
import { OppFinderGridModule } from '../oppfinder-grid/oppfinder-grid.module';
//import { PurchasePricePopupComponent } from "../purchase-price-popup/purchase-price-popup.component";
import { CommonPopupContainer } from "../oppfinder-common-popup-container/oppfinder-common-popup-container.component"
// import { PurchasePricePopupModule } from "../purchase-price-popup/purchase-price-popup.module";
// import {  BestPaymentDateModule } from "../best-payment-date/best-payment-date.module";
const routes: Routes = [
  {
    path: '',
    component: OppFinderWrapperComponent
  }
];

const dashboardManifest: IManifestCollection = [
  // { path: 'SmartCard-WidgetView', component: DashboardGridWrapperComponent },
  { path: 'SmartCardsContainer', loadChildren: 'smart-cards-manager#SmartCardsContainerModule' },
  { path: 'GridStackContainer', loadChildren: 'smart-gridstack-layout#SmartGridstackLayoutModule' },
  { path: 'SmartCardPlaceholder', loadChildren: 'smart-cards-placeholder#SmartCardsPlaceholderModule' },
  { path: 'DashboardCard', loadChildren: '../dashboard-card/src/app.module#DashboardCardModule' },
  { path: 'purchase-price-popup', loadChildren: '../purchase-price-popup/purchase-price-popup.module#PurchasePricePopupModule' },
  { path: 'auto-payment-term', loadChildren: '../auto-payment-term/auto-payment-term.module#AutoPaymentTermModule' },
  { path: 'best-payment-date', loadChildren: '../best-payment-date/best-payment-date.module#BestPaymentDateModule' },
  { path: 'GlobalFilterContainer', loadChildren: '../global-filter-container/global-filter-container.module#GlobalFilterContainerModule'},
  { path: 'GlobalSliderWidget', loadChildren: '../global-slider-widget/global-slider-widget.module#GlobalSliderWidgetModule' }
]


@NgModule({
  imports: [
    OppFinderGridModule,
    FormsModule,
    CommonModule,
    SmartDropDownModule,
    RouterModule.forChild(routes),
    SmartNumericModule,
    SmartDateModule,
    SmartSelectModule,
    SmartCheckboxModule,
    SmartButtonModule,
    SmartTooltipModule,
    SmartTextfieldModule,
    SmartRadioModule,
    SharedModule,
    SmartAutocompleteModule,
    SmartNativeScrollModule,
    GlobalFilterModule,
    SmartInjectorModule.forRoot(dashboardManifest),
  ],
  declarations: [
    OppFinderWrapperComponent
  ],
  exports: [
    RouterModule    
  ],
  providers: [
    SmartNumericService,
    AnalyticsUtilsService
  ],
  entryComponents: [
  ]
})
export class OppFinderWrapperModule {
  constructor(private translate: TranslateService) {
  }

}
