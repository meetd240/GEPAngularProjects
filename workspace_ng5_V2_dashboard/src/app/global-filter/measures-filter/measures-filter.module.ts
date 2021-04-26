import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MeasuresFilterComponent } from './measures-filter.component';
import { SmartNumericModule } from "smart-numeric";
import { SmartSelectModule } from "smart-select";
import { SmartTextfieldModule } from "smart-textfield";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import {SmartCheckboxModule} from 'smart-checkbox';

const routes: IManifestCollection = [
    {
        path: 'measure-filter',
        component: MeasuresFilterComponent,
    }
];


@NgModule({
    declarations: [MeasuresFilterComponent],

    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes),
        SmartSelectModule,
        SmartNumericModule,
        SmartTextfieldModule,
        SmartCheckboxModule,
        SmartInjectorModule.forChild(routes)

    ],
    exports: []

})

export class MeasuresFilterModule { }
