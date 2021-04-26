import {Input, Component,EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsCommonDataService } from '@vsAnalyticsCommonService/analytics-common-data.service';
import { DashboardCommService } from '@vsDashboardCommService';
import { OpportunityFinderService } from '@vsOppfinderService/opportunityFinder.service';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { LoaderService } from '@vsLoaderService';
import { find } from 'lodash';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { DashboardConstants } from '@vsDashboardConstants';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { Subscription } from 'rxjs/Subscription';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

declare var $: any;

@Component({
    selector: 'purchase-price-viewdetails-popup',
    templateUrl: './purchase-price-viewdetails-popup.component.html',
     styleUrls: ['./purchase-price-viewdetails-popup.component.scss'], 
     encapsulation: ViewEncapsulation.None,
     changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class PurchasePriceViewDetailsPopupComponent implements OnInit {

    @ Input() config: any;
   flexPpvGridConfig: any;
   partName: any;
   flexSeries: any;
   formatter: any;
   saving1ReportObject: any;
   saving2ReportObject : any;
   spendReportObject :any;
   any;
   radioSavingsConfig: any;
   radioSavingsModel = {
       field: {
           title: "",
           value: 1
       }
   };
   showGrid: boolean = false;
   gridData: any;
   btnDoneConfig: any;
   btnCreateOpportunityConfig: any;
   reportDataReq: any;
   reportDetailsObject: any;
   destoryTimeout: any = {};
   manageSubscription$: Subscription = new Subscription();

   constructor(
       private element: ElementRef,
       private _renderer: Renderer2,
       private _commonUrls: CommonUrlsConstants,
       private _commUtil: CommonUtilitiesService,
       private _loaderService: LoaderService,
       private _oppFinderService: OpportunityFinderService,
       public _dashboardCommService: DashboardCommService,
       private _analyticsCommonDataService: AnalyticsCommonDataService,
       private _cdRef: ChangeDetectorRef) {}

   ngOnInit() {
 

    // Used for formatting Data in dollars format.
       this.formatter = new Intl.NumberFormat('en-US', {
               style: undefined,
               currency: undefined,
               minimumFractionDigits: 0,
           });

  
       this.createViewReportDetailsConfig().then((response) => {
           this.gridData = response;
           this.showGrid = true;
           this.destoryTimeout = setTimeout(() => {
            this.setState();
        }, 500);
           this._loaderService.hideGlobalLoader();
       });



   }
  // Called for generating report config, ui config and showing details of a part on grid
   createViewReportDetailsConfig() {
    // Smart Button config for cancel and create opportunity 
       this.btnDoneConfig = {
           title: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN,
           flat: true,
           disable: false
       };

       this.btnCreateOpportunityConfig = {
           title: DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY,
           flat: true,
           disable: false
       };

       // Settng of Ui  data labels
       document.getElementById("infoMessage").innerHTML=  DashboardConstants.UIMessageConstants.STRING_PPVPOPUP_INFO_MSSG ;
       document.getElementById("labelPartNo").innerHTML= "Part No / Name :";
       document.getElementById("labelPartDesc").innerHTML= "Item Description :";
       document.getElementById("popUpHeader").innerHTML=this._dashboardCommService.oppFinderState.strategy.name; 

       let ppvViewDetailsReportsData: any;
       const PpvPopupConfig: any = {
           reportDetails: undefined,
           api: {},
       }
       this._loaderService.showGlobalLoader();

       // This section is used to fetch Required Ro's that we need to send for filters and showing on UI.
       // RO Data is pulled on basis of assitional properties saved in Master table for Oppfinders
       let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, {
               OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name
           });

       if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
           masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
       }

       let widgetConf = find(masterData.AdditionalProps,
               (prop) => {
               return prop.ReportDetailsObjectId.toLowerCase() === this.config.gridConfig.reportDetails.reportDetailObjectId.toLowerCase();
           });

       let viewPartDetailReportId = widgetConf.ViewPartReportDetailId.toLowerCase();

       let L1Category = find(this.config.gridConfig.reportDetails.lstReportObjectOnRow, (reportObject) => {
               return reportObject.reportObjectId.toLowerCase() == widgetConf.L1CategoryReportObjectId.toLowerCase();
           });

       let PartId = find(this.config.gridConfig.reportDetails.lstReportObjectOnRow, (reportObject) => {
               return reportObject.reportObjectId.toLowerCase() == widgetConf.PartNo_reportObjectId.toLowerCase();
           });

       document.getElementById("partName").innerHTML = this.config.selectedRow[PartId.displayName]
       
           let Region = find(this.config.gridConfig.reportDetails.lstReportObjectOnRow, (reportObject) => {
               return reportObject.reportObjectId.toLowerCase() == widgetConf.RegionReportObjectID.toLowerCase();
           });

       this.saving1ReportObject = find(this.config.gridConfig.reportDetails.lstReportObjectOnValue, (reportObject) => {
               return reportObject.reportObjectId.toLowerCase() == widgetConf.Savings1ReportObjectID.toLowerCase();
           });

       this.saving2ReportObject = find(this.config.gridConfig.reportDetails.lstReportObjectOnValue, (reportObject) => {
               return reportObject.reportObjectId.toLowerCase() == widgetConf.Savings2ReportObjectID.toLowerCase();
           });

       this.spendReportObject = find(this.config.gridConfig.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == widgetConf.SpendReportObjectID.toLowerCase();
           });    

 
    // Calling loadDataByReportObjectId method to fetch meta data for view details report id

       return new Promise((resolve, reject) => {
           this.loadDataByReportObjectId(viewPartDetailReportId).then((reportDetailsForCreateOpp: any) => {
               PpvPopupConfig.reportDetails = reportDetailsForCreateOpp;
     // Adding of filters (Part no , L1 category and region for generating report)
               let l1CategoryFilter = AnalyticsUtilsService.GetFormattedFilterValue(this.config.gridConfig.reportDetails.lstReportObjectOnRow, this.config.selectedRow[L1Category.displayName]);
               PpvPopupConfig.reportDetails.lstFilterReportObject.push(
                   AnalyticsUtilsService.createDrillDriveFilterReportObj({
                       reportObject: L1Category,
                       filterValue: l1CategoryFilter[0],
                       filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
                   }));
               let partNoFilter = AnalyticsUtilsService.GetFormattedFilterValue(this.config.gridConfig.reportDetails.lstReportObjectOnRow, this.config.selectedRow[PartId.displayName]);
               PpvPopupConfig.reportDetails.lstFilterReportObject.push(
                   AnalyticsUtilsService.createDrillDriveFilterReportObj({
                       reportObject: PartId,
                       filterValue: partNoFilter[0],
                       filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
                   }));
               let regionFilter = AnalyticsUtilsService.GetFormattedFilterValue(this.config.gridConfig.reportDetails.lstReportObjectOnRow, this.config.selectedRow[Region.displayName]);
               PpvPopupConfig.reportDetails.lstFilterReportObject.push(
                   AnalyticsUtilsService.createDrillDriveFilterReportObj({
                       reportObject: Region,
                       filterValue: regionFilter[0],
                       filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
                   }));
               this.reportDataReq = PpvPopupConfig.reportDetails;
               let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(PpvPopupConfig.reportDetails);
               reportDetailsMetaData.isGrandTotalRequired = false;
               reportDetailsMetaData.isSubTotalRequired = false;
               reportDetailsMetaData.lstFilterReportObject.forEach(item  =>   {
                           if (typeof item.filterValue  ===   'string')
                             item.filterValue  =  JSON.parse(item.filterValue);
                         
               })
               ppvViewDetailsReportsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);
               this.reportDetailsObject = ppvViewDetailsReportsData;
         // Call for generate report      
               this.manageSubscription$.add(
                   this._analyticsCommonDataService.generateReport(ppvViewDetailsReportsData)
                   .subscribe(async(response) => {
                       if (response != undefined
                            && response.Data != null
                            && response.Data.length > 0
                            && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
                           this.flexSeries = response.Data;
                           response = this.createGridConfig();

                       }

                       resolve(response);
                   }, (error) => {
                       this._commUtil.getMessageDialog(
`Status:${error.status}  Something Went wrong with ${error.message}`,()=>{});
                   }));

           })

       })
   }

   // Method call getReportDetailsByReportId service to fetch meta data for viewDetails reportid
   loadDataByReportObjectId(reportId) {
       return new Promise((resolve, reject) => {
           this._analyticsCommonDataService.getReportDetailsByReportId(reportId)
           .toPromise()
           .then((response) => {
               if (response != undefined
                    && response != null
                    && response.toString().toLowerCase() !== "error".toLowerCase()) {}
               resolve(this._commUtil.toCamelWrapper(response));
           })

       })
   }

   // Passing columns and series for grid here.
   createGridConfig() {
       this.flexPpvGridConfig = Object.assign({}, this.config.gridConfig.config);
       this.flexPpvGridConfig.series = this.flexSeries;
       this.flexPpvGridConfig.column = this.getGridColumns();
       this.radioSavingsConfig = {
           valueKey: "title",
           fieldKey: "field",
           layout: 'horizontal',
           collection: [{
                   "value": "1",
                   "title": this.calcTotalSavings1(this.saving1ReportObject.displayName)
               }, {
                   "value": "2",
                   "title": this.calcTotalSavings1(this.saving2ReportObject.displayName)
               }
           ]
       }
       return this.flexPpvGridConfig;
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

   // Calculation of total savings that we need to show below view details grid.
   calcTotalSavings1(roName) {

       var spend = 0;
       for (var i = 0; i < this.flexSeries.length; i++) {
           spend += parseFloat(this.flexSeries[i][roName])
       }

       return this.formatter.format(spend.toFixed(0)) || 0;

   }

   // Fetch column Names on basis of reporting objects of grid
   getColumnKeys() {
       let keys: Array < string >  = [];
       for (let columnInfo = 0; columnInfo < this.reportDetailsObject.lstReportObject.length; columnInfo++) {

           keys.push(this.reportDetailsObject.lstReportObject[columnInfo].reportObjectName)
       }
       return keys;
   }


   // On click of create opportunity savings and spend are passed to parent component
   createOppClick() {

    this.config.estimated_Savings = this.radioSavingsModel.field.title;
    this.config.spend = this.formatter.format(this.config.selectedRow[this.spendReportObject.displayName].toFixed(0)) 
    this.config.api.createOpportunity();
   }
   onCancel() {
       this.config.api.closePopup();

   }

   public setState() {
    this._cdRef.markForCheck();
}

ngOnDestroy() {
    this.manageSubscription$.unsubscribe();
     clearTimeout(this.destoryTimeout);
}



}
