import { NgModule, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { SmartButtonModule } from 'smart-button';
import { AssignSpendPopUpComponent } from './assign-spend-popup.component';
import { SmartNumericModule } from 'smart-numeric';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const purchasePrice: IManifestCollection = [
    { path: 'assign-spend-popup', component: AssignSpendPopUpComponent }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        SmartTextfieldModule,
        SmartButtonModule,
        SmartNumericModule,
        SmartInjectorModule.forChild(purchasePrice)
    ],
    declarations: [AssignSpendPopUpComponent],
    exports: [],
})
export class PurchasePricePopupModule { }