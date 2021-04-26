import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from "@angular/router";
import { SmartRadioModule } from "smart-radio";
import { SmartTooltipModule } from "smart-tooltip";
import { SmartTextfieldModule } from "smart-textfield";
import { SmartCheckboxModule } from "smart-checkbox";
import { SmartSelectModule } from "smart-select";
import { SmartInfotipModule } from "smart-infotip"
import { SmartAutocompleteModule } from "smart-autocomplete";

import { StringFilterComponent } from './string-filter.component';
import { SharedModule } from "../../shared-module/shared-module.module";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const routes: IManifestCollection = [
    {
        path: 'string-filter',
        component: StringFilterComponent,
    }
];

@NgModule({
    declarations: [StringFilterComponent],
 
    imports: [
        CommonModule,
        FormsModule,
        SmartRadioModule,
        SmartTooltipModule,
        SmartTextfieldModule,
        SmartCheckboxModule,
        SmartSelectModule,
        SharedModule,
        SmartInfotipModule,
        SmartInjectorModule.forChild(routes),
        SmartAutocompleteModule
    ],
    exports: [StringFilterComponent],
    providers: []
})

export class StringFilterModule {
}
