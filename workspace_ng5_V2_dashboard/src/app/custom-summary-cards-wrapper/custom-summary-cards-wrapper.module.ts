import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CustomSummaryCardsWrapperComponent } from './custom-summary-cards-wrapper.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SmartNumericModule } from 'smart-numeric';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjOlapModule } from 'wijmo/wijmo.angular2.olap';
import { SharedModule } from '../shared-module/shared-module.module';
// import { SmartFlexGridModule } from 'smart-flex-grid';
import { SmartInfotipModule } from 'smart-infotip';
import { SmartButtonModule } from 'smart-button';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartSelectModule } from 'smart-select';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartRadioModule } from 'smart-radio';
import { SummaryCardModule } from '../summary-card/summary-card.module';
import { IManifestCollection, SmartModuleInjector, SmartInjectorModule } from 'smart-module-injector';
const customRoutes: IManifestCollection = [
  { path: 'custom-summary-card', component: CustomSummaryCardsWrapperComponent }
];

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
    SummaryCardModule,
    SmartInjectorModule.forChild(customRoutes)

  ],
  declarations: [CustomSummaryCardsWrapperComponent,

  ],
  exports: [],
  entryComponents: [
  ],
})
export class CustomSummaryCardsWrapperModule { }
