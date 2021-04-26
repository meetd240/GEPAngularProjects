import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { DashboardViewsPopupComponent } from './dashboard-views-popup.component';
import { SmartRadioModule } from 'smart-radio';
import { SmartButtonModule } from 'smart-button';
import { SmartTextfieldModule } from "smart-textfield";
import { SmartCheckboxModule } from "smart-checkbox";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartTooltipModule } from "smart-tooltip";

const _dashboardViewRoutes: IManifestCollection = [
    {
        path: 'dashboard-views-popup',
        component: DashboardViewsPopupComponent
    }
]


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartTooltipModule,
        // BrowserModule,
        SmartRadioModule,
        SmartButtonModule,
        SmartTextfieldModule,
        SmartCheckboxModule,
        SmartInjectorModule.forChild(_dashboardViewRoutes)
    ],
    declarations: [DashboardViewsPopupComponent],
    exports: [],
})
export class DashboardViewsPopupModule { } 
