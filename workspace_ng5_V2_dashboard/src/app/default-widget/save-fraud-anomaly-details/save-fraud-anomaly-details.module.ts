
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartWidgetModule } from 'smart-widget';
import { IManifestCollection, SmartInjectorModule, Resolver } from 'smart-module-injector';
// import { BasicDetailsResolver } from './basic-details.resolver';
import{  SmartButtonModule} from 'smart-button';
import { SmartGlobalLoaderModule } from 'smart-global-loader';
import { SaveFraudAnomalyDetailsComponent } from '../save-fraud-anomaly-details/save-fraud-anomaly-details.component';

import { GlobalLoaderService } from 'smart-platform-services';
import { FormsModule } from '@angular/forms';
import { SmartSelectModule } from 'smart-select';
import { SmartNumericModule } from 'smart-numeric';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartRadioModule } from 'smart-radio';
import {SmartTextareaModule} from 'smart-textarea';

export const manifest: IManifestCollection = [
  { path: 'save-fraud-anomaly-details', component: SaveFraudAnomalyDetailsComponent}//, resolvers: { basicDetails: BasicDetailsResolver } }
];

@NgModule({
  imports: [
    CommonModule,
    SmartTextareaModule,
    FormsModule,
    SmartButtonModule,
    SmartSelectModule,
    SmartNumericModule,
    SmartTextfieldModule,
    SmartRadioModule,

    SmartInjectorModule.forChild(manifest),
    SmartButtonModule,
  ],
  declarations: [SaveFraudAnomalyDetailsComponent]
})
export class SaveFraudAnomalyDetailsModule { }
