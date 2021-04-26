import { NgModule, Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SmartPlatformServicesModule } from 'smart-platform-services';
import { SliderWidgetComponent } from './slider-widget.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartNumericModule } from 'smart-numeric';
import { SmartButtonModule } from 'smart-button';
import { SmartGlobalLoaderModule } from 'smart-global-loader';
import { each, extend } from 'lodash';
import { SmartInfotipModule } from 'smart-infotip';
import { SmartTooltipModule } from 'smart-tooltip';
declare var userInfo: any;

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

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
        SmartPlatformServicesModule, IonRangeSliderModule, SmartTextfieldModule,
        SmartDropDownModule, SmartNumericModule, SmartButtonModule,
        SmartGlobalLoaderModule, SmartTooltipModule
    ],
    declarations: [SliderWidgetComponent],
    exports: [],
    providers: [],
    entryComponents: [
    ]
})

export class SliderWidgetModule {
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

