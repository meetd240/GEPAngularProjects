import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { SlicerConfigurationComponent } from './slicerConfiguration.component';

import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
const slicerConfigurationRoute: IManifestCollection = [
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SmartInjectorModule.forChild(slicerConfigurationRoute)
  ],
  declarations: [SlicerConfigurationComponent],
  exports: [
  ],
  entryComponents: [
    SlicerConfigurationComponent,
  ]
})

export class SlicerConfigurationModule {
  constructor() {

  }
}

