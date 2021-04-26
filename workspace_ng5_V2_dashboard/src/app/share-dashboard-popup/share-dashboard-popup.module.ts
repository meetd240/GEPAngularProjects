import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SharedModule } from '../shared-module/shared-module.module';
import { ShareDashboardPopupComponent } from './share-dashboard-popup.component';
import { SmartTooltipModule } from 'smart-tooltip';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _shareDashboardRoute: IManifestCollection = [
    {
        path: 'share-dashboard-popup',
        component: ShareDashboardPopupComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        //  BrowserModule,
        SmartTextfieldModule,
        SmartButtonModule,
        SmartCheckboxModule,
        SharedModule,
        SmartTooltipModule,
        // SmartInjectorModule.forChild(_shareDashboardRoute)
    ],
    entryComponents: [ShareDashboardPopupComponent],
    declarations: [ShareDashboardPopupComponent],
    exports: [],
})
export class ShareDashboardPopupModule { }