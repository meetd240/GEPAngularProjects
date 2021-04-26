import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

// import {  } from "../header/smart-header/";

import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

export const coreManifest: IManifestCollection = [
    // Header
    { path: 'smart-header', loadChildren: '../header/smart-header/header-routing.module#HeaderModule' },
    { path: 'smart-nextgen-header', loadChildren: '../header/smart-nextgen-header/header-routing.module#HeaderModule' }
];


@NgModule({
    imports: [
        CommonModule,
        SmartInjectorModule.forRoot(coreManifest)
    ],
    exports: [
        SmartInjectorModule
    ],
    providers: []
})
export class ManifestModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ManifestModule,
            providers: []
        };
    }
}