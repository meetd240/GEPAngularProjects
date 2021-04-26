
import { NgModule } from '@angular/core';
import { DefaultWidgetComponent } from './default-widget.component';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartNumericModule } from 'smart-numeric';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip'; 
import { SharedModule } from '../../app/shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartWidgetManagerModule } from 'smart-widget-manager';
import {SmartSelectModule} from 'smart-select';
import { appBuilderManifests, eagerlyLoad, lazilyLoad } from 'smart-widget-editor';
import {RouterModule}  from '@angular/router';
import {BasicDetailsModule} from './basic-details/basic-details.module';
import { SmartCoreModule } from 'smart-core';
import { SaveFraudAnomalyDetailsComponent } from './save-fraud-anomaly-details/save-fraud-anomaly-details.component';
import { SaveFraudAnomalyDetailsModule} from '../default-widget/save-fraud-anomaly-details/save-fraud-anomaly-details.module';

export const manifest: IManifestCollection = [
  {path: 'default-widget', component: DefaultWidgetComponent },
  { path: 'save-fraud-anomaly-details', loadChildren: './save-fraud-anomaly-details/save-fraud-anomaly-details.module#SaveFraudAnomalyDetailsModule'}
   , { path: 'basic-details', loadChildren: './basic-details/basic-details.module#BasicDetailsModule'}
  ,{ path: 'investigation-widget', loadChildren: './investigation-widget/investigation-widget.module#InvestigationWidgetModule' }

];


@NgModule({
  imports: [
    CommonModule,
    SmartCoreModule,
    SmartWidgetManagerModule,
    SaveFraudAnomalyDetailsModule,

    CommonModule,
    SmartDropDownModule,
    SmartTextfieldModule,
    SmartTooltipModule, 
    SmartCheckboxModule,
    SmartButtonModule,
    SmartNumericModule,
    SharedModule,
    SmartSelectModule,
   SmartWidgetManagerModule,
    RouterModule.forChild([{ path: '', component: DefaultWidgetComponent }]),
    SmartInjectorModule.forChild(manifest)
  ],
  declarations: [DefaultWidgetComponent]
 // exports: [DefaultWidgetComponent],
  
})
export class DefaultWidgetModule { }








