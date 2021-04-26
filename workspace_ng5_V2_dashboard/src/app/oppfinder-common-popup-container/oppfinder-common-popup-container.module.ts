import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SmartRadioModule } from 'smart-radio';
import { SmartButtonModule } from 'smart-button';
import { SmartTextfieldModule } from "smart-textfield";
import { SmartCheckboxModule } from "smart-checkbox";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartNumericModule } from 'smart-numeric';
import { SmartSelectModule } from 'smart-select';
import { CommonPopupContainer } from './oppfinder-common-popup-container.component';

const _dashboardViewRoutes: IManifestCollection = [
    {
        path: 'common-popup-container',
        component: CommonPopupContainer
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // BrowserModule,
        SmartRadioModule,
        SmartButtonModule,
        SmartTextfieldModule,
        SmartCheckboxModule,
        SmartNumericModule,
        SmartSelectModule,
        SmartInjectorModule.forChild(_dashboardViewRoutes)
    ],
    declarations: [CommonPopupContainer],
    exports: [],
})
export class OppfindCommonPopupContainerModule { } 
