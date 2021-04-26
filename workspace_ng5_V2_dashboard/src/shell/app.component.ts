import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, Renderer2, TemplateRef, ViewContainerRef, ViewChild,Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as jquery_ from 'jquery';
import { CommonUtilitiesService } from '../shared/common-utils/common-utilities';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { startWith, tap, delay } from 'rxjs/operators';
import { DashboardConstants } from '@vsDashboardConstants';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { productName, productTitle } from 'configuration/productConfig';
import { GlobalLoaderService } from 'smart-platform-services';
import { BasicDetailsService } from '../../src/app/default-widget/basic-details/services/basicDetails.service';
import { SmartDataModelManagerService } from 'smart-core';
import * as _ from 'lodash';
const $ = jquery_;
declare var _clientSpecificConfigSettings: any;
declare var icons: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: false,
  providers: [BasicDetailsService,SmartDataModelManagerService]
})

export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'app';
  globalLoaderConfig: any = {};
  pageLoader: boolean = false;
  manageSubjectSubscription$: ISubscription = new Subscription();
  @ViewChild('renderPopupContainer', { read: ViewContainerRef }) renderPopupContainerRef: ViewContainerRef;
  @ViewChild('renderPopupTemplate') renderPopupTemplateRef: TemplateRef<any>;
  constructor(
    private _analyticsCommonConstants: AnalyticsCommonConstants,
    private _commUtil: CommonUtilitiesService,
    private _renderer: Renderer2,
    private _loaderService: GlobalLoaderService,
    private basicdetailsService: BasicDetailsService,
    @Inject(SmartDataModelManagerService) private dataModelsService: SmartDataModelManagerService,

  ) {

  }

  ngOnInit() {
    this.globalLoaderConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartGlobalLoaderConfig);
  }

  ngOnDestroy() {
    this.manageSubjectSubscription$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.manageSubjectSubscription$ =
      this._commUtil._globalLoaderbehaviorSubject$
        .pipe(
          startWith(null),
          delay(0)
        ).subscribe((_value: any) => {
          if (_value != null) {
            // this.pageLoader = _value.isLoaderVisiable as boolean;
            _value.isLoaderVisiable == true ? this._loaderService.showLoader() : this._loaderService.hideLoader();
          }
        });
    if (typeof icons != 'undefined') {
      $('body').append(icons);
    }
    if (this._commUtil.getUrlParam('mn') == productName.categoryWorkbenchProduct) {
      let crossProductFilter = document.getElementById('main-container-id');
      this._renderer.addClass(crossProductFilter, 'crossProductFilter');
    }
    this._commUtil.registerPopupOutlets(this.renderPopupContainerRef, this.renderPopupTemplateRef);

    this.basicdetailsService.getBasicDetails().subscribe(((data) => {

      this.dataModelsService.registerDataModel('basicDetails', _.cloneDeep(data), true);



  }).bind(this));

  }


}
