//angular Modules
import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule, ErrorHandler, Inject } from "@angular/core";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  SmartPlatformServicesModule, AppConstants, SelectivePreloadingStrategy,
  SmartDateService, CommonUtilsService
} from "smart-platform-services";
import { SmartSlidingMenuModule } from "smart-sliding-menu";
import { SmartNotificationModule } from "smart-notification";
import { SmartGlobalLoaderModule } from "smart-global-loader";
import { SmartButtonModule } from "smart-button";
import { SmartDropDownModule } from "smart-dropdown";
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartToasterModule } from "smart-toast";
import { SmartTooltipModule } from 'smart-tooltip';
// import { SmartLiteSideNavModule } from "smart-lite-sidenav";
import { SmartLoaderModule } from "smart-module-loader";
import { dashboardRoute } from './app.routes';
import { AppComponent } from "./app.component";
import { HeaderContComponent } from "../app/header/header.component";
// import { ProxyComponent } from "./proxy-component/proxy.component";
import { SmartBaseService } from "../shared/services/smart-base-service/smart-base.service";
import { GlobalErrorHandler } from "../shared/error-handling/global-error-handler";
import { ErrorLoggerService } from "../shared/error-handling/error-logger";
import { chartWidgetService } from "@vsChartWidgetService";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardService } from "@vsDashboardService/dashboard.service";
import { OpportunityFinderService } from "@vsOppfinderService/opportunityFinder.service";
import { DashboardCommService } from "@vsDashboardCommService";
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { CommonUrlsConstants } from "@vsCommonUrlsConstants";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { SmartBaseInterceptService } from "@vsSmartBaseInterceptor";
import { GlobalFilterService } from '@vsGlobalFilterService';
import { SmartDateModule } from 'smart-date';
import { SmartInfotipModule } from "smart-infotip";
import { each, extend } from 'lodash';
import * as jquery from "jquery";
import { BidInsightsService } from "@vsBidInsightsService/bid-insights.service";
import { NumberFormatingService } from "@vsNumberFormatingService";
import { SubHeaderComponent } from "../app/sub-header/subHeader.component";
import { FilterPipe } from "shared/pipes/filter.pipe";
import { SmartModuleInjectorState, SmartModuleInjector, SmartModuleLoader, SmartInjectorModule } from "smart-module-injector";
import { SmartStickyHeaderDirective } from "smart-sticky-header";
import { CoreModule } from '../core';
import { SharedTranslateModule } from '../shared/translate.module';
import { LoaderService } from "@vsLoaderService";
import {
  ThemeModule, defaultTheme, greenTheme, redTheme, purpleTheme,
  yellowTheme, greyTheme
} from 'smart-assets/smart-theme';
import { OlapGridDirectiveService } from "@vsOlapGridDirectiveService";
import { ManifestModule } from "../app/header/manifest.service";
import { coreManifest } from "shell";
import { MapChartDirectiveService } from "@vsMapChartDirectiveService";
import { WINDOW_PROVIDERS } from "@vsWindowService";
import { AzureMapsApiLoaderService } from "@vsAzureMapsApiService";
import { AnalyticsCommonMetadataService } from "@vsAnalyticsCommonService/analytics-common-metadata.service";
import { productName } from "configuration/productConfig";
import { RecommendationService } from "shared/services/opportunityFinder-service/recommendation.service";
var $ = jquery;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
declare var userInfo;
declare var timeZoneOffset;
declare var requestverificationtoken: any;

export function GetUserInfo() {
  return (<any>window).userInfo;
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderContComponent,
    // ProxyComponent,
    // SubHeaderComponent
    // SmartStickyHeaderDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // SmartLiteSideNavModule,
    SmartSlidingMenuModule,
    // SmartHeaderModule,
    SmartButtonModule,
    SmartCheckboxModule,
    SmartDropDownModule,
    SmartTooltipModule,
    SmartNotificationModule,
    SmartGlobalLoaderModule,
    SmartDateModule,
    SmartInfotipModule,
    SmartToasterModule.forRoot(),
    SmartPlatformServicesModule.forRoot(GetUserInfo().UserBasicDetails.Culture),
    SmartLoaderModule,
    ManifestModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   },
    //   isolate: true
    // }),
    RouterModule.forRoot(dashboardRoute, {
      useHash: true,
      enableTracing: false,
      preloadingStrategy: SelectivePreloadingStrategy,
    }),
    SharedTranslateModule,
    ThemeModule.forRoot({
      themes: [greenTheme, defaultTheme, redTheme, yellowTheme, purpleTheme, greyTheme],
      active: GetUserInfo().UserTheme || 'defaultTheme'
    }),
    SmartInjectorModule.forRoot(coreManifest)
  ],
  providers: [
    DatePipe,
    TranslateService,
    CommonUrlsConstants,
    CommonUtilsService,
    chartWidgetService,
    CommonUtilitiesService,
    NumberFormatingService,
    SmartBaseService,
    AnalyticsCommonDataService,
    AnalyticsCommonMetadataService,
    DashboardService,
    BidInsightsService,
    OpportunityFinderService,
    ErrorLoggerService,
    AnalyticsCommonConstants,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SmartBaseInterceptService,
      multi: true
    },
    DashboardCommService,
    LoaderService,
    GlobalFilterService,
    OlapGridDirectiveService,
    FilterPipe,
    SmartModuleInjectorState,
    SmartModuleInjector,
    SmartModuleLoader,
    AzureMapsApiLoaderService,
    WINDOW_PROVIDERS,
    MapChartDirectiveService,
    RecommendationService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
  constructor(
    private _appConstants: AppConstants,
    private _translate: TranslateService,
    private _dateService: SmartDateService,
    private _commUtil: CommonUtilitiesService,
    @Inject(Title) private _title: Title
  ) {
    this._appConstants.userPreferences = userInfo;
    // var Resources = {};
    // if (
    //   eval(
    //     "typeof Resources$" +
    //     this._appConstants.userPreferences.UserBasicDetails.Culture.replace(
    //       "-",
    //       "_"
    //     )
    //   ) !== "undefined"
    // ) {
    //   each(
    //     eval(
    //       "Resources$" +
    //       this._appConstants.userPreferences.UserBasicDetails.Culture.replace(
    //         "-",
    //         "_"
    //       )
    //     ),
    //     function (item, index, list) {
    //       Resources = extend(Resources, item);
    //     }
    //   );
    // }
    // this._translate.setTranslation(
    //   this._appConstants.userPreferences.UserBasicDetails.Culture,
    //   Resources
    // );
    requestverificationtoken = requestverificationtoken;
    // this._translate.use(GetUserInfo().UserBasicDetails.Culture);
    this._dateService.setUserCountryCultureInfo(GetUserInfo().UserBasicDetails.Culture, "en-US");
    this._dateService.setLocaleOffset(timeZoneOffset);
    this.setProductConfiguration();
    this.c2pPlatformSpecificAttributes();
  }

  private setProductConfiguration() {
    this._appConstants.userPreferences.moduleSettings = this._commUtil.getProductConfiguration(
      this._commUtil.getUrlParam('mn') as productName
    );
    this._title.setTitle(this._appConstants.userPreferences.moduleSettings.productTitle)
  }

  private c2pPlatformSpecificAttributes() {
    //This is needed for autosugest on header bar search. (Bearer should not be in this)
    // since platfrom API has been written with AccessToken thats why adding it.
    this._appConstants.userPreferences.AccessToken = userInfo.JWToken.toString().split("Bearer ")[1];
    this._appConstants.userPreferences.URLs.WorkspaceBaseUrl = userInfo.URLs.AppURL + "Smart?oloc=" + this._appConstants.oloc.workspace + "&c=" + userInfo.EncryptedBPC;
  }
}
