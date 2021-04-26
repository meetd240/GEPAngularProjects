import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SmartDropDownModule } from 'smart-dropdown'
import { FraudAnomalyWrapperComponent } from "./fraudAnomaly-wrapper.component";
import { SmartStickyHeaderModule } from 'smart-sticky-header';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { SmartNumericModule } from 'smart-numeric';
import { SmartDateModule } from 'smart-date';
import { SmartSelectModule } from 'smart-select';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartButtonModule } from 'smart-button';
import { SmartTooltipModule } from 'smart-tooltip';
import { SharedModule } from '../../app/shared-module/shared-module.module';
import { SmartTextfieldModule } from 'smart-textfield';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { GlobalFilterModule } from '../global-filter/global-filter.module';
import { ShareDashboardPopupModule } from 'app/share-dashboard-popup/share-dashboard-popup.module';
import { SlicerConfigurationModule } from '../slicer-configuration-component/slicerConfiguration.module';
import { OppFinderGridModule } from '../oppfinder-grid/oppfinder-grid.module';

const routes: Routes = [
  {
    path: '',
    component: FraudAnomalyWrapperComponent
  }
];


const dashboardManifest: IManifestCollection = [
  // { path: 'SmartCard-WidgetView', component: DashboardGridWrapperComponent },
  { path: 'SmartCardsContainer', loadChildren: 'smart-cards-manager#SmartCardsContainerModule' },
  { path: 'GridStackContainer', loadChildren: 'smart-gridstack-layout#SmartGridstackLayoutModule' },
  { path: 'SmartCardPlaceholder', loadChildren: 'smart-cards-placeholder#SmartCardsPlaceholderModule' },
  { path: 'DashboardCard', loadChildren: '../dashboard-card/src/app.module#DashboardCardModule' },
  {path: 'GlobalFilterContainer', loadChildren: '../global-filter-container/global-filter-container.module#GlobalFilterContainerModule'},
  {path: 'DashboardSlicer', loadChildren: '../dashboard-slicer/dashboard-slicer.module#DashboardSlicerModule'},
  {path: 'DefaultWidget', loadChildren: '../default-widget/default-widget.module#DefaultWidgetModule'},
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
    SharedModule,
    SmartStickyHeaderModule,
    GlobalFilterModule,
    ShareDashboardPopupModule,
    SlicerConfigurationModule,
    SmartInjectorModule.forRoot(dashboardManifest),

  ],
  declarations: [
    FraudAnomalyWrapperComponent
    
  ],
  exports: [
    RouterModule    
  ],
  providers: [
    AnalyticsUtilsService
    
  ],
  entryComponents: [

  ]
})
export class FraudAnomalyWrapperModule {
  constructor() {
  }

}

