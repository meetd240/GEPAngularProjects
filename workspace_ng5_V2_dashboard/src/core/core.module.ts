import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartSlidingMenuModule } from 'smart-sliding-menu';
import { SmartNG5HeaderModule } from 'smart-ng5-header';
import { SmartButtonModule } from 'smart-button';
import { SmartDropDownModule } from 'smart-dropdown';
import { SmartNotificationModule } from 'smart-notification';
import { SmartGlobalLoaderModule } from 'smart-global-loader';
import { SmartToasterModule } from 'smart-toast';
import { SmartStickyHeaderModule } from 'smart-sticky-header';
import { SmartSelectModule } from 'smart-select';


@NgModule({
  imports: [
    CommonModule,
    SmartSlidingMenuModule,
    SmartNG5HeaderModule,
    SmartButtonModule,
    SmartSelectModule,
    SmartDropDownModule,
    SmartNotificationModule,
    SmartGlobalLoaderModule,
    SmartToasterModule.forRoot(),
    SmartStickyHeaderModule
  ],
  exports: [
    SmartSlidingMenuModule,
    SmartNG5HeaderModule,
    SmartButtonModule,
    SmartDropDownModule,
    SmartNotificationModule,
    SmartGlobalLoaderModule,
    SmartToasterModule,
    SmartStickyHeaderModule
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        // DMConstants,
        // DMService,
        // BaseService,
        // // LoggerService,
        // { provide: HTTP_INTERCEPTORS, useClass: BaseInterceptService, multi: true },
        // { provide: LoggerService, useClass: ConsoleLoggerService }
      ]
    };
  }
}
