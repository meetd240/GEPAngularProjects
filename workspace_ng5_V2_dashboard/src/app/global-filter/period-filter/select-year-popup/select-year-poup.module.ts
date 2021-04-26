import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { SelectYearPopupComponent } from './select-year-popup.component';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartNumericModule } from 'smart-numeric';
import { SmartTooltipModule } from 'smart-tooltip';
import { SharedModule } from 'app/shared-module/shared-module.module';
import { FormsModule } from '@angular/forms'
import { SmartTextfieldModule } from 'smart-textfield';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';


const _selectYearPoup: IManifestCollection = [
    { path: 'select-year-popup', component: SelectYearPopupComponent }
]

@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,
        FormsModule,
        SmartCheckboxModule,
        SmartButtonModule,
        SmartTooltipModule,
        SharedModule,
        SmartTextfieldModule,
        SmartInjectorModule.forChild(_selectYearPoup)
    ],
    declarations: [SelectYearPopupComponent],
    exports: [],
    providers: []
})
export class SelectYearPopupModule { }