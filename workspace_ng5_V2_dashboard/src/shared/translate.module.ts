import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SmartPlatformServicesModule, AppConstants } from 'smart-platform-services'
import { extend, each } from 'lodash';

declare var userInfo: any;

@NgModule({
  imports: [CommonModule, TranslateModule.forRoot()],
  providers: [TranslateService],
  exports: [TranslateModule]

})
export class SharedTranslateModule {

  constructor(private appConstants: AppConstants, private translate: TranslateService) {
    //this.appConstants.userPreferences = userInfo;

    var Resources = {};
    if (eval("typeof Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")) !== 'undefined') {
      each(eval("Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")), function (item, index, list) {
        Resources = extend(Resources, item);
      });
    }
    this.translate.setTranslation(userInfo.UserBasicDetails.Culture, Resources, true);
    this.translate.use(userInfo.UserBasicDetails.Culture);
  }

}
