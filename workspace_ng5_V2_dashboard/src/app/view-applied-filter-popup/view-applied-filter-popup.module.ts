import { NgModule } from '@angular/core';
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { ViewAppliedFilterPopupComponent } from './view-applied-filter-popup.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _viewAppliedFilterRoute: IManifestCollection = [
    {
        path: 'view-applied-filter-popup',
        component: ViewAppliedFilterPopupComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,         
        SmartButtonModule,
        SmartInjectorModule.forChild(_viewAppliedFilterRoute)
    ],
    declarations: [ViewAppliedFilterPopupComponent],
    exports: [],
    entryComponents: [ViewAppliedFilterPopupComponent]
})
export class ViewAppliedFilterPopupModule { }
