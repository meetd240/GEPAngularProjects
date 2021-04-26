import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SmartRadioModule } from 'smart-radio';
import { SmartButtonModule } from 'smart-button';
import { SmartTextfieldModule } from "smart-textfield";
import { SmartCheckboxModule } from "smart-checkbox";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { GaugeChartComponent } from './gauge-chart.component';
import { ChartWidgetDirective } from '@vsChartWidgetService';
import { SharedModule } from 'app/shared-module/shared-module.module';

const _gaugeChartRoutes: IManifestCollection = [
    {
        path: 'multi-gauge-chart',
        component: GaugeChartComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule,
        // SmartRadioModule,
        // SmartButtonModule,
        // SmartTextfieldModule,
        // SmartCheckboxModule,
        SharedModule,        
        SmartInjectorModule.forChild(_gaugeChartRoutes)
    ],
    declarations: [GaugeChartComponent],
    exports: [],
})
export class GaugeChartModule { } 
