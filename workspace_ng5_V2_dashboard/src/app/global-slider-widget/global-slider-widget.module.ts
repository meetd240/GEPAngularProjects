import { NgModule, Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SmartPlatformServicesModule } from 'smart-platform-services';
import { GlobalSliderWidgetComponent } from './global-slider-widget.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartNumericModule } from 'smart-numeric';
import { SmartButtonModule } from 'smart-button';
import { SmartGlobalLoaderModule } from 'smart-global-loader';
import { each, extend } from 'lodash';
import { SmartInfotipModule } from 'smart-infotip';
import { SmartTooltipModule } from 'smart-tooltip';
import { SmartInjectorModule, IManifestCollection } from 'smart-module-injector';
declare var userInfo: any;

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
const _globalSliderWidget: IManifestCollection = [
    {
        path: 'GlobalSliderWidget',
        component: GlobalSliderWidgetComponent
    }
]
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        SmartPlatformServicesModule, IonRangeSliderModule, SmartTextfieldModule,
        SmartDropDownModule, SmartNumericModule, SmartButtonModule,
        SmartGlobalLoaderModule, SmartTooltipModule, SmartInjectorModule.forChild(_globalSliderWidget)

    ],
    declarations: [GlobalSliderWidgetComponent],
    exports: [GlobalSliderWidgetComponent],
    providers: [],
    entryComponents: []
})

export class GlobalSliderWidgetModule {
    constructor() {
    }
}

