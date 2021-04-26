import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { DashboardTabsPopupComponent } from './dashboard-tabs-popup.component';
import { SmartButtonModule } from 'smart-button';
import { SmartTextfieldModule } from "smart-textfield";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _dashboardTabsRoutes: IManifestCollection = [
    {
        path: 'dashboard-tabs-popup',
        component: DashboardTabsPopupComponent
    }
]


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartButtonModule,
        SmartTextfieldModule,
        SmartInjectorModule.forChild(_dashboardTabsRoutes)
    ],
    declarations: [DashboardTabsPopupComponent],
    exports: [],
})
export class DashboardTabsPopupModule { } 