import { NgModule } from '@angular/core';
import { SummaryCardComponent } from './summary-card.component';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip'; 
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../app/shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _summaryCardRoutes: IManifestCollection = [
  {
    path: 'summary-card',
    component: SummaryCardComponent
  }
];
 

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    SmartDropDownModule,
    SmartTextfieldModule,
    SmartTooltipModule, 
    SharedModule ,
    SmartInjectorModule.forChild(_summaryCardRoutes)
  ],
  declarations: [SummaryCardComponent],
  exports: [SummaryCardComponent],
  entryComponents:[]
})
export class SummaryCardModule { }