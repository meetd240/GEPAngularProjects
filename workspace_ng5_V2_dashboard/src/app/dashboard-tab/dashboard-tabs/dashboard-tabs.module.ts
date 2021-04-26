import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { DashboardTabsComponent } from './dashboard-tabs.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _dashboardTabsRoutes: IManifestCollection = [
    {path: 'dashboard-tabs',component: DashboardTabsComponent},
    {path: 'manage-tabs', loadChildren: '../manage-tabs-popup/manage-tabs-popup.module#ManageTabsPopupModule'}
]


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartInjectorModule.forChild(_dashboardTabsRoutes)
    ],
    declarations: [DashboardTabsComponent],
    exports: [],
})
export class DashboardTabsModule { }