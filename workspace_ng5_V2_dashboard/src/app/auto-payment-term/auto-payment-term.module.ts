import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AutoPaymentTermComponent } from './auto-payment-term.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SmartNumericModule } from 'smart-numeric';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjOlapModule } from 'wijmo/wijmo.angular2.olap';
import { SharedModule } from '../shared-module/shared-module.module';
// import { SmartFlexGridModule } from 'smart-flex-grid';
import { SmartInfotipModule } from 'smart-infotip';
import { SmartButtonModule } from 'smart-button';
// import { CommonPopupContainer } from '../oppfinder-common-popup-container/oppfinder-common-popup-container.component'
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartSelectModule } from 'smart-select';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartRadioModule } from 'smart-radio';
import { SmartTooltipModule } from 'smart-tooltip';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
 
const autoRouetes: IManifestCollection = [
    { path: 'auto-payment-term', component: AutoPaymentTermComponent },
    { path: 'supplier-list-popup', loadChildren: '../supplier-list-popup/supplier-list-popup.module#SupplierListPopupModule' }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule,
        IonRangeSliderModule,
        // SmartFlexGridModule,
        WjGridModule,
        WjOlapModule,
        SmartInfotipModule,
        SmartTextfieldModule,
        SmartButtonModule,
        SmartSelectModule,
        SmartCheckboxModule,
        SmartNumericModule,
        SmartRadioModule,
        SharedModule,
        SmartTooltipModule,
        SmartInjectorModule.forChild(autoRouetes)
    ],
    declarations: [AutoPaymentTermComponent],
    exports: []
})
export class AutoPaymentTermModule { }
