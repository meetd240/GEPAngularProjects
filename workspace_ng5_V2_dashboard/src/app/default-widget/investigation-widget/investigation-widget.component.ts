


import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, Input, ElementRef, OnDestroy, TemplateRef, ChangeDetectorRef, ChangeDetectionStrategy }
  from "@angular/core"; import { AppConstants }
  from 'smart-platform-services'; import { AnalyticsCommonConstants }
  from '@vsAnalyticsCommonConstants'; import { DashboardConstants }
  from '@vsDashboardConstants';
import { map as _map }
  from 'lodash'; import { DashboardCommService }
  from '@vsDashboardCommService';
import { Subscription } from 'rxjs';
import { forEach } from "core-js/fn/array";
import { ActivatedRoute } from "@angular/router";
import { LoaderService } from "@vsLoaderService";
import { AnalyticsMapperService } from "@vsAnalyticsCommonService/analytics-mapper.service";
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { CommonUtilitiesService } from "@vsCommonUtils";

@Component({
  selector: 'app-investigation-widget',
  templateUrl: './investigation-widget.component.html',
  styleUrls: ['./investigation-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InvestigationWidgetComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() config: any;
  rowindex: number = 0;
  editTextfieldest: boolean = true;
  formatter: any;
  
  @ViewChild("outletTemplate2") outletTemplateRef2: TemplateRef<any>;
  @ViewChild("defaultWidget", { read: ViewContainerRef }) oppfinderStatusPopupRef2: ViewContainerRef;
  @ViewChild("reportDetailCards", { read: ViewContainerRef }) WE: ViewContainerRef;

  oppfinderDatasubscription: Subscription;
  destoryTimeout: any = {};
  currencySign: '';
  statusArray : any = [];
  private _commUtil: CommonUtilitiesService;
  staticMessage : string = AnalyticsCommonConstants.staticMessageForFraudAnomaly;
  sub: Subscription;
  gridData: any;
  manageSubscription$: Subscription = new Subscription();
  showGrid: boolean = false;
  investigateDetailsReportsData: any


  constructor(
    private _elementRef: ElementRef,
    public _dashboardCommService: DashboardCommService,
    public _appConstants: AppConstants,
    private _cdRef: ChangeDetectorRef,
    private _loaderService: LoaderService,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    private route : ActivatedRoute) { }

  ngOnInit() {      
    this.setInvestigationConfig().then((response) => {
      this.gridData = response;
      this.showGrid = true;
      this.destoryTimeout = setTimeout(() => {
       this.setState();
   }, 500);
      this._loaderService.hideGlobalLoader();
  });

  }

  ngAfterViewInit() {

  }
  ngOnDestroy() {
    if (this.oppfinderDatasubscription) {
      this.oppfinderDatasubscription.unsubscribe();
    }

    clearTimeout(this.destoryTimeout);
  }

  public setState() {
    this._cdRef.markForCheck();
  }

  setInvestigationConfig() {
    let gridConfig : any;
    //this for for load Report-details crads in investigation-widget for fraud anomaly.

   return new Promise((resolve, reject) => {
   this.investigateDetailsReportsData = AnalyticsMapperService.MapReportDetailsMetadataToData(this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].investigateDetails.reportDetails);
   // Call for generate report      
    this.manageSubscription$.add(
        this._analyticsCommonDataService.generateReport(this.investigateDetailsReportsData)
        .subscribe(async(response) => {
            if (response != undefined
                 && response.Data != null
                 && response.Data.length > 0
                 && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
                  gridConfig = this.createGridConfig(response.Data);
                  this.setChipsInfo();
                  this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].investigateGridJson = this.statusArray;

            }
            resolve(gridConfig);
        }, (error) => {
            this._commUtil.getMessageDialog(
`Status:${error.status}  Something Went wrong with ${error.message}`,()=>{});
        }));

  })



  }
  createGridConfig(series : any): any {
    let flexGridConfig = Object.assign({}, this._dashboardCommService.fraudAnomalyMasterData['investigateGridConfig'].flexGidConfig);
    flexGridConfig.series = series;
    flexGridConfig.column = this.getGridColumns();
    return flexGridConfig ;
  }

  // Getting column values
  getColumnKeys() {
    let keys: Array < string >  = [];
    for (let columnInfo = 0; columnInfo < this.investigateDetailsReportsData.lstReportObject.length; columnInfo++) {

        keys.push(this.investigateDetailsReportsData.lstReportObject[columnInfo].reportObjectName)
    }
    return keys;
}


// Creation of view details grid columns on basis of report objects
getGridColumns() {
  let keys = this.getColumnKeys(),
  columns = [];

  if (keys != undefined) {
      let keyLength = keys.length;
      if (true) {
          for (let i = 0; i < keyLength; i++) {
              let isVisible = true;
              let readOnly = true;
              let width = 180;
              let aggregateType;
              let currency;
              let header;
              header = keys[i];

              let _addingWijmoColumns: any = {
                  header: header,
                  binding: keys[i],
                  visible: isVisible,
                  isReadOnly: readOnly,
                  width: width,
                  aggregate: aggregateType || DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._value,
                  format: currency || ''
              }

              columns.push(_addingWijmoColumns);
          }
      }
  }
  return columns;
}

setChipsInfo(){
  this.investigateDetailsReportsData.lstFilterReportObject.forEach(filterObject => {
    this.statusArray.push({name :filterObject.reportObject.reportObjectName , value : filterObject.values});
  });
  }

}

