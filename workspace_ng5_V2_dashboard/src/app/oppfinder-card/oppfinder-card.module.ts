import { NgModule } from '@angular/core';
import { OppFinderCardComponent } from './oppfinder-card.component';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartNumericModule } from 'smart-numeric';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { CommonModule } from '@angular/common';
import { SmartTooltipModule } from 'smart-tooltip';
import { SharedModule } from '../../app/shared-module/shared-module.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartSelectModule } from 'smart-select';

const _oppFinderCardRoutes: IManifestCollection = [
  {
    path: 'oppfinder-card',
    component: OppFinderCardComponent
  }
  , { path: 'oppfinder-status-popup', loadChildren: '../oppfinder-status-popup/oppfinder-status-popup.module#OppfinderStatusPopupModule' },
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
    SmartInjectorModule.forChild(_oppFinderCardRoutes)
  ],
  declarations: [OppFinderCardComponent],
  exports: [OppFinderCardComponent],

})
export class OppFinderCardComponentModule { }
