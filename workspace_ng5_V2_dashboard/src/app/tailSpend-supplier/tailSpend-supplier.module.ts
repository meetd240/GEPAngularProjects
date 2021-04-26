import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { TailSpendSupplierComponent } from './tailSpend-supplier.component';
// import { CommonPopupContainer } from '../oppfinder-common-popup-container/oppfinder-common-popup-container.component'
import { SmartNumericModule } from 'smart-numeric';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartSelectModule } from 'smart-select';
import { SmartRadioModule } from 'smart-radio'
import { SharedModule } from '../shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const purchasePrice: IManifestCollection = [
    { path: 'tailSpend-supplier', component: TailSpendSupplierComponent }
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
        SmartInjectorModule.forChild(purchasePrice)
    ],
    declarations: [TailSpendSupplierComponent],
    exports: [],
})
export class TailSpendSupplierModule { }