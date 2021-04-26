import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SmartPlatformServicesModule } from 'smart-platform-services';
import { SmartPopupModule } from 'smart-popup';
import { SmartTextfieldModule } from "smart-textfield";
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartTooltipModule } from 'smart-tooltip';
import { ManageViewsPopupComponent } from './manage-views-popup.component';
import { ManageViewsPopupWrapperComponent } from './manage-views-popup-wrapper.component';
import { each, extend } from 'lodash';

import { FilterPipe } from '../../shared/pipes/filter.pipe';

declare var userInfo: any;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const popupRouter: Routes = [
  {
    path: '', component: ManageViewsPopupWrapperComponent,
  }
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]

      }, isolate: true
    }),
    SmartButtonModule,
    SmartCheckboxModule,
    SmartPopupModule,
    SmartTooltipModule,
    SmartTextfieldModule,
    SmartPlatformServicesModule,
    RouterModule.forChild(popupRouter)
  ],
  declarations: [ManageViewsPopupWrapperComponent, ManageViewsPopupComponent],
  exports: [
    RouterModule
  ],
  providers: [FilterPipe],
  entryComponents: [ManageViewsPopupComponent]
})

export class ManageViewsPopupModule {
  constructor(private translate: TranslateService) {
    var Resources = {};
    if (eval("typeof Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")) !== 'undefined') {
      each(eval("Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")), function (item, index, list) {
        Resources = extend(Resources, item);
      });
    }
    this.translate.setTranslation(userInfo.UserBasicDetails.Culture, Resources);
    this.translate.use(userInfo.UserBasicDetails.Culture);
  }
}