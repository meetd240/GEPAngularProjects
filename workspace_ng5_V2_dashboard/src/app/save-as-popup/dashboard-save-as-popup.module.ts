import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SmartTextfieldModule } from "smart-textfield";
import { SmartButtonModule } from 'smart-button';
import { DashboardSaveAsPopupComponent } from './dashboard-save-as-popup.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _saveAsPopup: IManifestCollection = [
  {
    path: 'dashboard-save-as-popup',
    component: DashboardSaveAsPopupComponent,
  }
]

@NgModule({
  imports: [ 
    CommonModule,
    SmartButtonModule, 
    SmartTextfieldModule, 
    SmartInjectorModule.forChild(_saveAsPopup)
  ],
  declarations: [DashboardSaveAsPopupComponent],
  exports: [],
  providers: [],
  entryComponents: []
})

export class SaveAsPopupModule {
  constructor() {


  }
}
