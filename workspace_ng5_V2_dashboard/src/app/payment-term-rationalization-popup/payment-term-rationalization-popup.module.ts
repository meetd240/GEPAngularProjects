import { NgModule } from '@angular/core';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartRadioModule } from 'smart-radio';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartNumericModule } from 'smart-numeric';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip'; 
import { SharedModule } from '../../app/shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import {SmartSelectModule} from 'smart-select';
import { PaymentTermRationalizationPopup } from './payment-term-rationalization-popup.component';

const paymentTerm: IManifestCollection = [
    { path: 'payment-term-rationalization-popup', component: PaymentTermRationalizationPopup }
]

@NgModule({
    imports: [
      CommonModule,
      SmartDropDownModule,
      SmartTextfieldModule,
      SmartTooltipModule, 
      SmartCheckboxModule,
      SmartButtonModule,
      SmartNumericModule,
      SharedModule,
      SmartSelectModule,
      CommonModule,
      SmartTextfieldModule,
      SmartButtonModule,
      SmartNumericModule,
      SmartRadioModule,
      SmartInjectorModule.forChild(paymentTerm)
    
    ],
    declarations: [PaymentTermRationalizationPopup],
    exports: [],
    
  })
/* 
//Module Declarations
@NgModule({
    imports: [
        CommonModule,
        WjGridModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        SmartTextfieldModule,
        SmartButtonModule,
        SmartNumericModule,
        SmartInjectorModule.forChild(paymentTerm)
    ],
    declarations: [PaymentTermRationalizationPopup],
    exports: [],
}) */
export class PaymentTermRationalizationPopupModule { }