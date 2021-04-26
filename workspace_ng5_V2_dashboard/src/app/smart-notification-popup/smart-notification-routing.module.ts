import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SmartNotifcationComponent } from "./smart-notification.component";
// 3rd Party
import { TranslateModule } from "@ngx-translate/core";
import { SmartNotificationModule } from "smart-notification";
import { SmartInjectorModule, IManifestCollection } from 'smart-module-injector';

const notificationManifest: IManifestCollection = [{
  path: 'smartNotification', component: SmartNotifcationComponent
}];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SmartNotificationModule,
    SmartInjectorModule.forChild(notificationManifest),
  ],
  declarations: [SmartNotifcationComponent],
  providers: [],
  entryComponents: []
})
export class SmartNotifcationPopupRoutingModule {
  constructor() { 
  }
}
