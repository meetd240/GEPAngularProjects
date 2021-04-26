import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SharedModule } from '../shared-module/shared-module.module';
import { AddToStandardFilterPopupComponent } from './add-to-standard-filter-popup.component';
import { SmartTooltipModule } from 'smart-tooltip';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
const addToStandard: IManifestCollection = [
    { path: 'add-to-standard-filter', component: AddToStandardFilterPopupComponent }
]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule, 
        SmartTextfieldModule,
        SmartButtonModule,
        SmartCheckboxModule,
        SharedModule,
        SmartTooltipModule,
        SmartInjectorModule.forChild(addToStandard)
    ],
    declarations: [AddToStandardFilterPopupComponent],
    exports: [AddToStandardFilterPopupComponent],
})
export class AddToStandardFilterPopupModule { }