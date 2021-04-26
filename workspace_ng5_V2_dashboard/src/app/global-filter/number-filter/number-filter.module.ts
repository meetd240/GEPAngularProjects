import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms'; 
import { NumberFilterComponent } from './number-filter.component';

import { SmartRadioModule } from "smart-radio";
import { SmartTooltipModule } from "smart-tooltip";
import { SmartCheckboxModule } from "smart-checkbox";
import { SmartSelectModule } from "smart-select";
import { SmartNumericModule } from "smart-numeric";
import { SmartTextfieldModule } from "smart-textfield";

import { SharedModule } from "../../shared-module/shared-module.module";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const routes: IManifestCollection = [
    {
        path: 'number-filter',
        component: NumberFilterComponent,
    }
];

@NgModule({
    declarations: [NumberFilterComponent],
    imports: [
        CommonModule,
        SmartSelectModule,
        SmartCheckboxModule,
        SmartTooltipModule,
        SmartRadioModule,
        SmartInjectorModule.forChild(routes),
        FormsModule,
        SmartNumericModule,
        SharedModule,
        SmartTextfieldModule
    ],
    exports: []

})

export class NumberFilterModule { }
