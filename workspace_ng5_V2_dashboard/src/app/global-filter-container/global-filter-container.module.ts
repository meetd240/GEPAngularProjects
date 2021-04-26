import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { GlobalFilterContainerComponent } from './global-filter-container.component';


import { SmartButtonModule } from "smart-button";
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { SmartTextfieldModule } from "smart-textfield";
import { SharedModule } from "../shared-module/shared-module.module";
import { GlobalSliderWidgetModule } from "../global-slider-widget/global-slider-widget.module";
import { SmartTooltipModule } from 'smart-tooltip';

const _globalFilterContainer: IManifestCollection = [
    {
        path: 'global-filter-container',
        component: GlobalFilterContainerComponent
    }
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SmartButtonModule,
    SmartTextfieldModule,
    SharedModule,
    GlobalSliderWidgetModule,
    SmartTooltipModule,
    SmartInjectorModule.forChild(_globalFilterContainer)

  ],
  declarations: [GlobalFilterContainerComponent],
  exports: [
  ],
  providers: [
  ],
  entryComponents: [
    GlobalFilterContainerComponent,
  
  ]
})

export class GlobalFilterContainerModule {
  constructor() {
    
  }
}

