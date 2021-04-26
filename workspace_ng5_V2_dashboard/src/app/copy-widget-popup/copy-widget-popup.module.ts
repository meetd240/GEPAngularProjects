import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SmartPlatformServicesModule } from 'smart-platform-services';
import { PopupWrapperComponent } from './popup-wrapper.component';
import { SmartPopupModule } from 'smart-popup';
import { CopyWidgetPopupComponent } from './copy-widget-popup.component';
import { SmartButtonModule } from 'smart-button';
import { SmartCheckboxModule } from 'smart-checkbox';
import { each, extend } from 'lodash';

declare var userInfo: any;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const popupRouter: Routes = [
  {
    path: '', component: PopupWrapperComponent,
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
    SmartPlatformServicesModule,
    RouterModule.forChild(popupRouter)
  ],
  declarations: [PopupWrapperComponent, CopyWidgetPopupComponent],
  exports: [
    RouterModule
  ],
  providers: [],
  entryComponents: [CopyWidgetPopupComponent]
})

export class CopyWidgetPopupModule {
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