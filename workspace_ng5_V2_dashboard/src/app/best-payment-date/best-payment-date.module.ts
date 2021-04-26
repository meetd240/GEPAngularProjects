import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BestPaymentDateComponent } from './best-payment-date.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SmartNumericModule } from 'smart-numeric';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjOlapModule } from 'wijmo/wijmo.angular2.olap';
import { SharedModule } from '../shared-module/shared-module.module';
import { SmartInfotipModule } from 'smart-infotip';
import { SmartButtonModule } from 'smart-button';
// import { CommonPopupContainer } from '../oppfinder-common-popup-container/oppfinder-common-popup-container.component'
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartSelectModule } from 'smart-select';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartRadioModule } from 'smart-radio';
import { SummaryCardModule } from '../summary-card/summary-card.module';
// import { CustomSummaryCardsWrapperModule } from '../custom-summary-cards-wrapper/custom-summary-cards-wrapper.module';
import { OppfinderFormulaPopupModule } from '../oppfinder-formula-popup/oppfinder-formula-popup.module';
import { OppfinderFormulaOverviewPopupModule } from '../oppfinder-formula-overview-popup/oppfinder-formula-overview-popup.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
// import { CustomSummaryCardsWrapperModule } from "../custom-summary-cards-wrapper/custom-summary-cards-wrapper.module";
const bestPaymentRouetes: IManifestCollection = [
  { path: 'best-payment-date', component: BestPaymentDateComponent },
  { path: 'custom-summary-card', loadChildren: '../custom-summary-cards-wrapper/custom-summary-cards-wrapper.module#CustomSummaryCardsWrapperModule' }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // BrowserModule,
    IonRangeSliderModule,
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
    // CustomSummaryCardsWrapperModule,
    OppfinderFormulaPopupModule,
    OppfinderFormulaOverviewPopupModule,
    SmartInjectorModule.forChild(bestPaymentRouetes)
  ],
  declarations: [BestPaymentDateComponent,
    //   CommonPopupContainer
  ],
  exports: [],
})
export class BestPaymentDateModule { }
