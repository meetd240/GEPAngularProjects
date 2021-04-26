import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodFilterComponent } from './period-filter.component';
import { FormsModule } from '@angular/forms';

import { SmartRadioModule } from "smart-radio";
import { SmartNumericModule } from "smart-numeric";
import { SmartDateModule } from "smart-date";
import { SmartSelectModule } from "smart-select";
import { SmartCheckboxModule } from "smart-checkbox";
import { SmartButtonModule } from "smart-button";
import { SmartTooltipModule } from "smart-tooltip";
import { SharedModule } from 'app/shared-module/shared-module.module';
import { SmartTextfieldModule } from 'smart-textfield';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const routes: IManifestCollection = [
    { path: 'period-filter', component: PeriodFilterComponent },
    { path: 'select-year-popup', loadChildren: '../period-filter/select-year-popup/select-year-poup.module#SelectYearPopupModule' }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartRadioModule,
        SmartNumericModule,
        SmartTextfieldModule,
        SmartDateModule,
        SmartSelectModule,
        SmartCheckboxModule,
        SmartButtonModule,
        SmartTooltipModule,
        SharedModule,
        SmartInjectorModule.forChild(routes)
    ],
    declarations: [PeriodFilterComponent],
    exports: [PeriodFilterComponent],

})

export class PeriodFilterModule { }
