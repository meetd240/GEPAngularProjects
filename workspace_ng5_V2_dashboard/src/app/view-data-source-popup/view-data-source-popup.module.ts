import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SmartPlatformServicesModule } from 'smart-platform-services';
import { SmartPopupModule } from 'smart-popup';
import { SmartButtonModule } from 'smart-button';;
import { viewDataSourcePopupComponent } from './view-data-source-popup.component';
import { ViewDataSourcePopupWrapperComponent } from './view-data-source-popup-wrapper.component';
import { each, extend } from 'lodash';
declare var userInfo: any;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const popupRouter: Routes = [
  {
    path: '', component: ViewDataSourcePopupWrapperComponent,
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
    SmartPopupModule,
    SmartPlatformServicesModule,
    RouterModule.forChild(popupRouter)
  ],
  declarations: [ViewDataSourcePopupWrapperComponent, viewDataSourcePopupComponent],
  exports: [
    RouterModule
  ],
  providers: [],
  entryComponents: [viewDataSourcePopupComponent]
})

export class viewDataSourcePopupModule {
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