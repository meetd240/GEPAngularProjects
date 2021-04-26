import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { GlobalFilterComponent } from './global-filter.component';


import { SmartButtonModule } from "smart-button";
import { SmartPlatformServicesModule } from 'smart-platform-services';
import { SmartRadioModule } from "smart-radio";
import { SmartSelectModule } from "smart-select";
import { SmartTooltipModule } from "smart-tooltip";
import { SmartInfotipModule } from "smart-infotip";
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { SmartTextfieldModule } from 'smart-textfield';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
const _globalFilter: IManifestCollection = [
  { path: 'string-filter', loadChildren: '../global-filter/string-filter/string-filter.module#StringFilterModule' },
  { path: 'number-filter', loadChildren: '../global-filter/number-filter/number-filter.module#NumberFilterModule' },
  { path: 'period-filter', loadChildren: '../global-filter/period-filter/period-filter.module#PeriodFilterModule' },
  { path: 'measure-filter', loadChildren: '../global-filter/measures-filter/measures-filter.module#MeasuresFilterModule' },
  { path: 'add-to-standard-filter', loadChildren: '../add-to-standard-filter-popup/add-to-standard-filter-popup.module#AddToStandardFilterPopupModule' }
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SmartButtonModule,
    SmartRadioModule,
    SmartSelectModule,
    SmartTooltipModule,
    SmartInfotipModule,
    SmartTextfieldModule,
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]

    //   }, isolate: true
    // }),
    SmartPlatformServicesModule,
    SmartInjectorModule.forChild(_globalFilter)

  ],
  declarations: [GlobalFilterComponent],
  exports: [
  ],
  providers: [
    FilterPipe
  ],
  entryComponents: [
    GlobalFilterComponent,
    // StringFilterComponent,
    // MeasuresFilterComponent,
    // PeriodFilterComponent,
    // NumberFilterComponent
  ]
})

export class GlobalFilterModule {
  constructor() {
    // var Resources = {};
    // if (eval("typeof Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")) !== 'undefined') {
    //   each(eval("Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")), function (item, index, list) {
    //     Resources = extend(Resources, item);
    //   });
    // }
    // this.translate.setTranslation(userInfo.UserBasicDetails.Culture, Resources);
    // this.translate.use(userInfo.UserBasicDetails.Culture);

  }
}

