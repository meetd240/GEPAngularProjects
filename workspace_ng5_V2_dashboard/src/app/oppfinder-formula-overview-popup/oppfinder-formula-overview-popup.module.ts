import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { OppfinderFormulaOverviewPopupComponent } from '../oppfinder-formula-overview-popup/oppfinder-formula-overview-popup.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule,
        SmartButtonModule,
       ],
  declarations: [OppfinderFormulaOverviewPopupComponent],
    exports: [],
    entryComponents: [],
})
export class OppfinderFormulaOverviewPopupModule { }
