import { NgModule } from '@angular/core';
import { DashboardCardFooterComponent } from './dashboard-card-footer.component';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip';
import { SharedModule } from '../shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartInfotipModule } from "smart-infotip";

const _summaryCardRoutes: IManifestCollection = [
  {
    path: 'dashboard-card-footer',
    component: DashboardCardFooterComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    SmartDropDownModule,
    SmartTextfieldModule,
    SmartTooltipModule,
    SharedModule,
    SmartInfotipModule,
    SmartInjectorModule.forChild(_summaryCardRoutes)
  ],
  declarations: [DashboardCardFooterComponent],
  exports: [DashboardCardFooterComponent],
  entryComponents: []
})
export class DashboardCardFooterModule { }