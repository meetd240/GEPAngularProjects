import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ManageTabsPopupComponent } from './manage-tabs-popup.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartButtonModule } from "smart-button";
import { SmartSortableModule } from "smart-sortable";
import { SmartTooltipModule } from "smart-tooltip";
import { SmartTextfieldModule } from "smart-textfield";

const _manageTabsRoutes: IManifestCollection = [
    {
        path: 'manage-tabs',
        component: ManageTabsPopupComponent
    }
]


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartButtonModule,
        SmartSortableModule,
        SmartTooltipModule,
        SmartInjectorModule.forChild(_manageTabsRoutes),
        SmartTextfieldModule
    ],
    declarations: [ManageTabsPopupComponent],
    exports: [],
})
export class ManageTabsPopupModule { } 