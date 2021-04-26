import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlexGridWidgetDirective } from '@vsFlexGridWidgetDirective';
import { FilterPipe } from "../../shared/pipes/filter.pipe";
import { LinkedViewFilterComponents } from '../linked-view-filter/linked-view-filter.component';
import { CommonModule } from '@angular/common';
import { AppConstants } from 'smart-platform-services';
import { WijmoLicenseKey } from '../../shared/configuration/configuration-keys';
import { setLicenseKey } from 'wijmo/wijmo';
import { SmartTooltipModule } from 'smart-tooltip';
import { OlapGridWidgetDirective } from '@vsOlapGridWidgetDirective';
import { ConditionalFormatingService } from '@vsConditionalFormatingService';
import { ReportIdentifierDirective } from '@vsReportIdentifierDirective';
import { MapChartWidgetDirective } from '@vsMapChartDirective';
import { AzureMapsApiLoaderService } from '@vsAzureMapsApiService';
import { WINDOW_PROVIDERS } from '@vsWindowService';
import { MapChartDirectiveService } from '@vsMapChartDirectiveService';
import { CommonPopupContainer } from '../oppfinder-common-popup-container/oppfinder-common-popup-container.component';
import { SmartTextfieldModule } from 'smart-textfield';
import { SmartNumericModule } from 'smart-numeric';
import { SmartSelectModule } from 'smart-select';
import { SmartCheckboxModule } from 'smart-checkbox';
import { SmartRadioModule } from 'smart-radio';
import { SubHeaderComponent } from 'app/sub-header/subHeader.component';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartStickyHeaderModule } from 'smart-sticky-header';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
// import { GaugeChartComponent } from '../gauge-chart/gauge-chart.component';
import { ChartWidgetDirective } from '@vsChartWidgetService';
import { DashboardDriveService } from '@vsDashboardDriveService';
import { SmartInfotipModule } from 'smart-infotip';
// import { LinkedViewFilterModule } from "../linked-view-filter/linked-view-filter.module";
const dashboardManifest: IManifestCollection = [
    { path: 'view-rename-popup',       loadChildren: '../view-rename-popup/view-rename-popup.module#ViewRenamePopupModule' },
    { path: 'dashboard-views-popup',   loadChildren: '../dashboard-views-popup/dashboard-views-popup.module#DashboardViewsPopupModule' },
    { path: 'dashboard-save-as-popup', loadChildren: '../save-as-popup/dashboard-save-as-popup.module#SaveAsPopupModule' },
    { path: 'user-message',            loadChildren: '../user-message/user-message.module#UserMessageModule' },
    { path: 'common-popup-container',  loadChildren: '../oppfinder-common-popup-container/oppfinder-common-popup-container.module#OppfindCommonPopupContainerModule' },
    { path: 'dashboard-tabs-popup',    loadChildren: '../dashboard-tab/dashboard-tabs-popup/dashboard-tabs-popup.module#DashboardTabsPopupModule'},
    { path: 'dashboard-move-to-popup', loadChildren: '../dashboard-tab/dashboard-move-to-popup/dashboard-move-to-popup.module#DashboardMoveToPopupModule'}
    // { path: 'share-dashboard-popup', loadChildren: '../share-dashboard-popup/share-dashboard-popup.module#ShareDashboardPopupModule' },
    // { path: 'linked-view-filter-popup', loadChildren: '../linked-view-filter/linked-view-filter.module#LinkedViewFilterModule' },
]


@NgModule({
    imports: [
        CommonModule,
        SmartTextfieldModule,
        SmartNumericModule,
        SmartTooltipModule,
        SmartSelectModule,
        SmartCheckboxModule,
        SmartRadioModule,
        SmartDropDownModule,
        SmartStickyHeaderModule,
        SmartInjectorModule.forChild(dashboardManifest),
        SmartInfotipModule,
    ],
    declarations: [

        ReportIdentifierDirective,
        MapChartWidgetDirective,
        FlexGridWidgetDirective,
        OlapGridWidgetDirective,
        ChartWidgetDirective,
        FilterPipe,
        LinkedViewFilterComponents,
        SubHeaderComponent,
    ],
    exports: [

        ReportIdentifierDirective,
        MapChartWidgetDirective,
        FlexGridWidgetDirective,
        OlapGridWidgetDirective,
        ChartWidgetDirective,
        FilterPipe,
        LinkedViewFilterComponents,
        SubHeaderComponent,
        SmartInfotipModule
        // CommonPopupContainer
    ],
    providers: [
        ConditionalFormatingService,
       
        DashboardDriveService
    ],
    entryComponents: [
        // ViewRenamePopupComponent,
        // DashboardViewsPopupComponent,
        // DashboardSaveAsPopupComponent,
        // UserMessageComponent
    ]
})

export class SharedModule {
    constructor(
        private _appConstants: AppConstants) {
        // var Resources = {};
        // if (eval("typeof Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")) !== 'undefined') {
        //     each(eval("Resources$" + userInfo.UserBasicDetails.Culture.replace("-", "_")), function (item, index, list) {
        //         Resources = extend(Resources, item);
        //     });
        // }
        // this._translate.setTranslation(userInfo.UserBasicDetails.Culture, Resources, true);
        // this._translate.use(userInfo.UserBasicDetails.Culture);
        //Setting the Wijmo License Key for the Flex Grid Implementation.
        setLicenseKey(this._appConstants.userPreferences.WijmoLicenseKey || WijmoLicenseKey.LicenseKey);
    }
}

