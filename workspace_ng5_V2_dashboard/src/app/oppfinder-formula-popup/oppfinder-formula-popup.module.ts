import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { OppfinderFormulaPopupComponent } from '../oppfinder-formula-popup/oppfinder-formula-popup.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule,
        SmartButtonModule,
       ],
  declarations: [OppfinderFormulaPopupComponent],
    exports: [],
    entryComponents: [],
})
export class OppfinderFormulaPopupModule { }
