import { NgModule } from '@angular/core';

import { SmartDropDownModule } from 'smart-dropdown';
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip';
import { SharedModule } from '../shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { DashboardCardHeaderComponent } from './dashboard-card-header.component';
import { SmartButtonModule } from 'smart-button';

const _dashboardHeader: IManifestCollection = [
  { path: 'dashboard-card-header', component: DashboardCardHeaderComponent }
];


@NgModule({
  imports: [
    CommonModule,
    SmartDropDownModule,
    SmartTextfieldModule,
    SmartTooltipModule,
    SmartButtonModule,
    SharedModule,
    SmartInjectorModule.forChild(_dashboardHeader)
  ],
  declarations: [DashboardCardHeaderComponent],
  exports: [DashboardCardHeaderComponent],
  entryComponents: []
})
export class DashboardCardHeaderModule { }