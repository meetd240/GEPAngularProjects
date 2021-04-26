import { Component, OnInit ,ViewChild , Input, AfterViewInit, Inject, ChangeDetectionStrategy} from '@angular/core';
import {  ChangeDetectorRef} from '@angular/core';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { DashboardCommService } from '@vsDashboardCommService';
import { LoaderService } from '@vsLoaderService';
import { OpportunityFinderService } from '@vsOppfinderService/opportunityFinder.service';
import { Subscription } from 'rxjs/Subscription';
import { SmartDataModelManagerService, SmartWidgetUtilityManagerService } from 'smart-core';
import { DashboardConstants } from '@vsDashboardConstants';
import { AppConstants } from 'smart-platform-services';
@Component({
  changeDetection : ChangeDetectionStrategy.OnPush,
  selector: 'save-fraud-anomaly-details',
  templateUrl: './save-fraud-anomaly-details.component.html',
  styleUrls: ['./save-fraud-anomaly-details.component.scss']
})
export class SaveFraudAnomalyDetailsComponent implements OnInit , AfterViewInit{
 // @Input('config') @DetectChanges() config: IWidget;
  @ViewChild('widget') widgetRef: any;
  @Input() config: any;
  saveButtonConfig : any ={
    title: 'Submit',
    allignRight: true,
    flat: true
   }
   
  cancelButtonConfig : any ={
    title: 'Cancel',
    allignRight: true,
    flat: true
   }

  radioSavingsConfig : any = {
    valueKey: "title",
    fieldKey: "field",
    layout: 'vertical',
    collection: [{
            "value": "1",
            "title": "Is An Anomaly"
        }, {
            "value": "2",
            "title": "Not An Anomaly"
        },
        {
          "value": "3",
          "title": "Further Investigation needed"
      }
    ]
}
radioSavingsModel : any = {
  field: {
      title: "Is An Anomaly",
      value: 1
  }
}


influencingFactorsConfig:any = {
  //label: 'Influencing Factors',
  isMandatory: true,
  tabIndex: 4,
  data: 'description',
  characterCounter: true,
  attributes: {maxLength: 4000}, 
  rows:"4" ,
  cols:"50"
};
influencingFactors:any = { 'description': '' };
manageSubscription$: Subscription = new Subscription();
destoryTimeout: any = {};
  constructor( private _cdRef: ChangeDetectorRef,
    private _commonUrls: CommonUrlsConstants,
    private _appConstant: AppConstants,
    private _commUtil: CommonUtilitiesService,
    public _dashboardCommService: DashboardCommService,
    private _oppFinderService: OpportunityFinderService,
    private _loaderService: LoaderService,
  
    @Inject(SmartDataModelManagerService) private smartDataModelManagerService: SmartDataModelManagerService,) {
   }

  ngOnInit() {
    console.log(this.config);
    this._loaderService.hideGlobalLoader();
    this.setState();
  }

  ngAfterViewInit()
  {
    console.log('after')
  }
  onCancelClick()
  {
    this.config.api.closePopup();
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {  
    this.manageSubscription$.unsubscribe(); 
    clearTimeout(this.destoryTimeout);
  }

 onSaveClick(){

  let anomalyLandingPageUrl = this._appConstant.userPreferences.IsNextGen ?
  this._commonUrls.URLs.OpportunityFinderApiUrls.getNextGenLandingPageURLForOppFinder :
  this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;

  let FraudAnomalyDetails = {
    Anomaly_ObjectId: this._dashboardCommService.fraudAnomalyState.fraudAnomalyId,
    AnomalyType_ObjectId: this._dashboardCommService.fraudAnomalyMasterData['AnomalyType_ObjectId'],
    AnomalyName : this.smartDataModelManagerService.getById('basicDetails').reportName,
    Description: this.smartDataModelManagerService.getById('basicDetails').modelDescription,
    GridColumnJson: JSON.stringify(this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].investigateGridJson),
    Spend: parseFloat(this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].spendValue),
    IsDeleted: false,
    Status: this.radioSavingsModel.field.title,
    Remark : this.influencingFactors.description
} ;

this.setState();
console.log(JSON.stringify(FraudAnomalyDetails));
  this._oppFinderService.saveFraudAnomalyDetails(JSON.stringify(FraudAnomalyDetails))
  .toPromise()
  .then((response) => { if (response !== 'error') {
          this._loaderService.hideGlobalLoader();
          this.config.api.closePopup();
          this._commUtil.getMessageDialog(
              this._dashboardCommService.fraudAnomalyState.editMode ? DashboardConstants.UIMessageConstants.STRING_EDIT_OPP_SUCCESS_FINDER : DashboardConstants.UIMessageConstants.STRING_SHOW_CREATE_OPP_SUCCESS,
              (_response: any) => {
                  if (_response.result.toLocaleLowerCase() == DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT.toLocaleLowerCase()) {
                      this._loaderService.showGlobalLoader();
                      window.location.href = anomalyLandingPageUrl;
                  }
              },
              DashboardConstants.OpportunityFinderConstants.STRING_SUCCESS
          );
      } 
  }); 
 }

  onChange()
  {
this.setState();
  }

  public setState() {
    this._cdRef.markForCheck();
  }
}
