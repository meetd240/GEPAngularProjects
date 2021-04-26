import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { OppFinderGridComponent } from '../oppfinder-grid/oppfinder-grid.component';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { SharedModule } from 'app/shared-module/shared-module.module';
import { GlobalFilterModule } from 'app/global-filter/global-filter.module';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const oppFinderGrid: IManifestCollection = [
    { path: 'oppfinder-grid', component: OppFinderGridComponent }
]


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    GlobalFilterModule,
    SmartInjectorModule.forChild(oppFinderGrid)

  ],
  declarations: [
    OppFinderGridComponent
  ],
  exports: [
    RouterModule,
    OppFinderGridComponent    
  ],
  providers: [
    AnalyticsUtilsService
  ]
})
export class OppFinderGridModule {
  constructor() {
  }

}
