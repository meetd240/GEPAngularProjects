import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { OppfinderStatusPopupComponent } from '../oppfinder-status-popup/oppfinder-status-popup.component';
import { FormsModule } from '@angular/forms'
import { SmartButtonModule } from 'smart-button';
import { SmartSelectModule } from 'smart-select';
import { SmartNumericModule } from 'smart-numeric';
import { SmartTextfieldModule } from 'smart-textfield'

const _oppFinderCardRoutes: IManifestCollection = [
  {
    path: 'oppfinder-status-popup',
    component: OppfinderStatusPopupComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SmartButtonModule,
    SmartSelectModule,
    SmartNumericModule,
    SmartTextfieldModule,
    SmartInjectorModule.forChild(_oppFinderCardRoutes)
  ],
  declarations: [OppfinderStatusPopupComponent],
  exports: [],
  entryComponents: [],
})

export class OppfinderStatusPopupModule { }
