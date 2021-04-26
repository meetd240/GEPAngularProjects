import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSlicerComponent } from './dashboard-slicer.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartButtonModule } from "smart-button";
import { SmartTextfieldModule } from "smart-textfield";
import { SharedModule } from "../shared-module/shared-module.module";
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartBlockLoaderModule } from 'smart-block-loader';
import { FormsModule } from '@angular/forms';
export const _slicerPopUp: IManifestCollection = [
  {
    path: 'dashboard-slicer',
    component: DashboardSlicerComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    SmartButtonModule,
    SmartTextfieldModule,
    SharedModule,
    SmartCheckboxModule,
    SmartInjectorModule.forChild(_slicerPopUp),
    SmartBlockLoaderModule,
    FormsModule
  ],
  declarations: [DashboardSlicerComponent],
  providers: [
  ],
  entryComponents: [
    DashboardSlicerComponent,
  ],
  exports: [
    DashboardSlicerComponent
  ]
})
export class DashboardSlicerModule { }