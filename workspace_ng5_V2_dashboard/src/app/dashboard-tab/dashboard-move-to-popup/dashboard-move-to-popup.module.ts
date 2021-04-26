import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SmartButtonModule } from 'smart-button';
import { SmartInfotipModule } from 'smart-infotip';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartRadioModule } from 'smart-radio';
import { DashboardMoveToPopupComponent } from './dashboard-move-to-popup.component';

const _dashboardMoveToRoutes: IManifestCollection = [
    {
        path: 'dashboard-move-to-popup',
        component: DashboardMoveToPopupComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartRadioModule,  
        SmartButtonModule,
        SmartInfotipModule,
        SmartInjectorModule.forChild(_dashboardMoveToRoutes)        
    ],
    declarations: [
        DashboardMoveToPopupComponent
    ]
})


export class DashboardMoveToPopupModule { }