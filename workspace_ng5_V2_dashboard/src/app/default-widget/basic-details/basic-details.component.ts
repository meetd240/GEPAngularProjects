import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, Optional, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { InjectionContext } from 'smart-module-injector';
import { Subscription } from 'rxjs';
import { HooksInterceptor, SmartDataModelManagerService,SmartValidationManagerService,DetectChanges, cdColor, GenericPipe } from 'smart-core';
import { IWidget, IChangeDetector } from 'smart-core-types';
import { BasicDetailsService } from './services'
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { CommonUtilitiesService } from '../../../shared/common-utils/common-utilities';
import { CommonUrlsConstants } from '../../../shared/constants/common-url-constants/common-urls.constants';
//import { SharedService } from '../../shared/shared.Service';
import { GlobalLoaderService } from 'smart-platform-services';
import { Observable } from 'rxjs';
import { AppConstants } from 'smart-platform-services';
import * as _ from 'lodash';


@Component({
  selector: 'app-basic-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
  providers: [SmartDataModelManagerService,SmartValidationManagerService,GenericPipe]
})
@HooksInterceptor()
export class BasicDetailsComponent implements OnInit, OnDestroy, IChangeDetector {
  //globalLoaderConfig = AnalyticsCommonConstants.GlobalLoader;
  @Input('config') @DetectChanges() config: IWidget;
  @ViewChild('widget') widgetRef: any;
  saveConfig: any = {
    title: 'basic details',
    allignRight: true,
    flat: true
  }

  private streamSubscription: Subscription = new Subscription();
  dependentFrequency : string = "";

  constructor(
    @Inject(SmartDataModelManagerService) private dataModelsService: SmartDataModelManagerService,
    @Inject(SmartDataModelManagerService) public smartDataModelManagerService: SmartDataModelManagerService,
    @Inject(InjectionContext) @Optional() private injectionContext: InjectionContext,
    public cdRef: ChangeDetectorRef,
    public basicDetailsService: BasicDetailsService,
    private commonUrlsConstants: CommonUrlsConstants,
   private appConstants: AppConstants,
    private globalLoaderService: GlobalLoaderService
  ) { }

  ngOnInit() {
    this.bindDataModel();
    this.setState();
  }

  ngOnDestroy(): void {
    this.streamSubscription && this.streamSubscription.unsubscribe();
  }

  bindDataModel(): Observable<any> {

    //Register datamodel for basic detail service
    this.basicDetailsService.getBasicDetails().subscribe(((data) => {

      this.dataModelsService.registerDataModel('basicDetails', _.cloneDeep(data), true);

    }).bind(this));
    let manifestPath: string, dataModelId: string;
    
    //manifestpath and datamodelId retrive from config
    [manifestPath, dataModelId] = this.injectionContext.paths.injectionPath.split(':');
    if (this.smartDataModelManagerService.has(dataModelId))
      return Observable.of(this.smartDataModelManagerService.getById(dataModelId));
    else {​​​​ // See example below for dynamic fetch
      this.smartDataModelManagerService.registerDataModel(dataModelId, this.appConstants.userPreferences.modelData['basicDetails']);
      return Observable.of(this.smartDataModelManagerService.getById(dataModelId));
    }
   

  }  

  public setState() {
    this.cdRef.markForCheck();
  }
  // Configured Events <-> Scope
  onFocus(a, b, c, d, e, f) {
    console.log('SCOPE: focus');
    console.log('---------------------');
  }
  onBlur(a, b, c, d, e, f) {
    console.log('SCOPE: blur');
    console.log('---------------------');
  }
  onKeydown(a, b, c, d, e, f) {
    console.log('SCOPE: keydown');
    console.log('---------------------');
  }
  onKeyup(a, b, c, d, e, f) {
    console.log('SCOPE: keyup');
    console.log('---------------------');
  }
  onModelChange(a, b, c, d, e, f) {
    console.log('SCOPE: onModelChange');
    console.log('---------------------');
  }
  ngModelChange(a, b, c, d, e, f) {
    console.log('SCOPE: ngModelChange');
    console.log('---------------------');
  }

  get changeDetector(): string { return cdColor(); }

  save() {
   }
}
