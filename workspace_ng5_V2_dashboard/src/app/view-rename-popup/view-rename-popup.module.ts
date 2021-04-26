import { NgModule } from '@angular/core';
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { ViewRenamePopupComponent } from './view-rename-popup.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _renameDashboardRoute: IManifestCollection = [
    {
        path: 'view-rename-popup',
        component: ViewRenamePopupComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,
        SmartTextfieldModule,
        SmartButtonModule,
        SmartInjectorModule.forChild(_renameDashboardRoute)
    ],
    declarations: [ViewRenamePopupComponent],
    exports: [],
})
export class ViewRenamePopupModule { }