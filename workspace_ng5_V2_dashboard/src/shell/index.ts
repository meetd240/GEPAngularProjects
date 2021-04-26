
// export * from './header/header.component';
// export * from './layout/layout.component';
// export * from './wrapper/wrapper.component';
export * from './app.routes';
export * from './app.component';
export * from './app.module';
import { IManifestCollection } from 'smart-module-injector';

export const coreManifest: IManifestCollection =
    [
        {
            path: "smartNotification",
            loadChildren: "../app/smart-notification-popup/smart-notification-routing.module#SmartNotifcationPopupRoutingModule"
        }
    ];
