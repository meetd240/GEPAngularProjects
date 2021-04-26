import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { SupplierListPopupComponent } from './supplier-list-popup.component';
//import { CommonPopupContainer } from '../oppfinder-common-popup-container/oppfinder-common-popup-container.component'
import { SmartNumericModule } from 'smart-numeric';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartSelectModule } from 'smart-select';
import { SmartRadioModule } from 'smart-radio'
import { SharedModule } from '../shared-module/shared-module.module';
import { SmartTooltipModule } from 'smart-tooltip';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const routes: IManifestCollection = [
    { path: 'supplier-list-popup', component: SupplierListPopupComponent }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule,         
        SmartTextfieldModule,
        SmartButtonModule,
        SmartSelectModule,
        SmartCheckboxModule,
        SmartNumericModule,
        SmartRadioModule,
        SharedModule,
        SmartTooltipModule,
        SmartInjectorModule.forChild(routes)
    ],
    declarations: [SupplierListPopupComponent],
    exports: [],
})
export class SupplierListPopupModule { }