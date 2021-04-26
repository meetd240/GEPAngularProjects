
import { SmartWidgetModule } from 'smart-widget';
import { InvestigationWidgetComponent } from './investigation-widget.component';
// import { ReportDetailCardsComponent } from '../../report-detail-cards/report-detail-cards.component';
// import { BasicDetailsResolver } from './basic-details.resolver';
//import { BasicDetailsService} from '../services'
import { SmartGlobalLoaderModule } from 'smart-global-loader';
import { GlobalLoaderService } from 'smart-platform-services';
import { NgModule } from '@angular/core';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartNumericModule } from 'smart-numeric';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip'; 
import { SharedModule } from '../../../app/shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import {SmartSelectModule} from 'smart-select';



export const manifest: IManifestCollection = [
  { path: 'investigation-widget', component: InvestigationWidgetComponent}
];

@NgModule({
    imports: [
        CommonModule,
        SmartDropDownModule,
        SmartTextfieldModule,
        SmartTooltipModule, 
        SmartCheckboxModule,
        SmartButtonModule,
        SmartNumericModule,
        SharedModule,
        SmartSelectModule,
        SmartInjectorModule.forChild(manifest),
        
      ],
  declarations: [InvestigationWidgetComponent],
    providers: [  GlobalLoaderService] //BasicDetailsResolver, 
})
export class InvestigationWidgetModule { }
