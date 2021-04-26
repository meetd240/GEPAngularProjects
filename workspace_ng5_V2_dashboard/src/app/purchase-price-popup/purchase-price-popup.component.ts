import {
    Input, Output, Component,
    EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewContainerRef, TemplateRef, OnDestroy, EmbeddedViewRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
// import { LazyComponentConfiguration } from '../../../modules-manifest';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { AnalyticsCommonDataService } from '@vsAnalyticsCommonService/analytics-common-data.service';
import { Subscription } from 'rxjs';
import { DashboardConstants } from '@vsDashboardConstants';
import { map, find } from 'lodash';
import { DashboardCommService } from '@vsDashboardCommService';
import { ISaveOpportunityFinderDetails } from 'interfaces/common-interface/app-common-interface';
import { OpportunityFinderService } from '@vsOppfinderService/opportunityFinder.service';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { CellType } from 'wijmo/wijmo.grid';
import { setCss } from 'wijmo/wijmo';
import { LoaderService } from '@vsLoaderService';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { AppConstants } from 'smart-platform-services';

declare var $: any;

@Component({
    selector: 'purchase-price-popup',
    templateUrl: './purchase-price-popup.component.html',
    styleUrls: ['./purchase-price-popup.component.scss'],
     encapsulation: ViewEncapsulation.None,
  //  changeDetection: ChangeDetectionStrategy.Default,
    preserveWhitespaces: false
})
export class PurchasePricePopupComponent implements OnInit, OnDestroy {
    // static componentId = LazyComponentConfiguration.PurchasePricePopup.componentName;
    btnDoneConfig: any;
    btnNextConfig: any;
    btnCancelConfig: any;
    btnOkConfig:any;
    oppFinderConFlag : boolean = false;
    oppFinderPPVFlag : boolean =false;
    oppFinderokFlag : boolean = false;
    oppFinderButFlag : boolean = false;
    showGrid: boolean = false;
    gridData: any;
  currentPageIndex: number = 1;
  prevSeries: any;
    manageSubscription$: Subscription = new Subscription();
;
    constants = DashboardConstants;

    @Input() config: any = {
        changeDetectionMutation: {},
        Confidence: {
            code: "0",
            name: DashboardConstants.UIMessageConstants.STRING_Confidence_Level
        }
    };
    @ViewChild('PurchasePriceContainer', { read: ViewContainerRef }) PurchasePriceContainerRef: ViewContainerRef;
    @ViewChild('CommonTemplate') CommonTemplateRef: TemplateRef<any>;

    constructor(
        private element: ElementRef,
        private _renderer: Renderer2,
        private _appConstant: AppConstants,
        private _commonUrls: CommonUrlsConstants,
        private _commUtil: CommonUtilitiesService,
        private _loaderService: LoaderService,
        private _oppFinderService: OpportunityFinderService,
        public _dashboardCommService: DashboardCommService,
        private _analyticsCommonDataService: AnalyticsCommonDataService,
        private _cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.setUIConfig();
        this.gridData = this.setMockGridData();
        if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name ||
            this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name ||
            this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name ||
            this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.name ||
            this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.TSA.name) {
               
           
                this.oppFinderConFlag =true;
                this.oppFinderokFlag = true;
               
        }
        else{
            this.oppFinderPPVFlag = true;
        }
        switch (this.config.iconType) {
            case DashboardConstants.OpportunityFinderConstants.ICON_TYPE.icon:
                this.setGridData().then((response) => {
                  this.gridData = response;
                  // Calling this method to implement pagination on Invoice, Buyer, Plant Count
                    this.flexGridPagination(response, true);
                    this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
                    this.showGrid = true;
                    this.setState();
                });
                break
            case DashboardConstants.OpportunityFinderConstants.ICON_TYPE.text:
            default:
                this.showGrid = false;
                this.oppFinderokFlag = false;
                this.oppFinderButFlag = true;
                this.renderCommonContainer();
                break;
        }
       }

    ngOnDestroy() {
        this.PurchasePriceContainerRef.clear();
        this.manageSubscription$.unsubscribe();
    }
    renderCommonContainer() {
        this._loaderService.showGlobalLoader();
        this.config.containerConfig = {};
        this.config.containerConfig.fields = this.setConfig();
        this.config.containerConfig.Confidence = this.config.Confidence;
        this.config.containerConfig.setState = this.setState.bind(this);
        // this.PurchasePriceContainerRef.createEmbeddedView(this.CommonTemplateRef, { $implicit: this.config.containerConfig });
        this.PurchasePriceContainerRef.createEmbeddedView(this.CommonTemplateRef, {
            manifestPath: 'common-popup-container/common-popup-container',
            config: { config: this.config.containerConfig }
        });
        this._loaderService.hideGlobalLoader();
        setTimeout(() => { this.setState() }, 1000);
    }

    setUIConfig() {
        this.btnDoneConfig = {
            title: this._dashboardCommService.oppFinderState.editMode ? "Update" : "Done",
            flat: false,
            disable: false
        };
        this.btnNextConfig = {
            title: "Next",
            flat: false,
            disable: false
        };
        this.btnCancelConfig = {
            title: "Cancel",
            flat: true,
            disable: false
        };
        this.btnOkConfig = {
            title: "Ok",
            flat: true,
            disable: false
        };
        this.config.OpportunityName = {
            value: this._dashboardCommService.oppFinderState.editMode ? this.config.OpportunityName : ""
        };
        this.config.OpportunityDescription = {
            value: this._dashboardCommService.oppFinderState.editMode ? this.config.OpportunityDescription : ""
        };
        this.config.Confidence = this._dashboardCommService.oppFinderState.editMode && this.config.Confidence ? this.config.Confidence : {
            code: "0",
            name: DashboardConstants.UIMessageConstants.STRING_Confidence_Level
        };
    }

     //Adding this function to push Drill / Drive filters into the lstFilterReportObject if any.
     //By default Region filter is always present since we pass that from the grid itself.
    countPopUpFilterCreation(){
      if( this._dashboardCommService.filterObjectHierarchyList.length > 0){
        let filterValue = "";
        let reportObjId: any;
        let filterFormattedValue = [];

        this._dashboardCommService.filterObjectHierarchyList.forEach((itemFilter)=>{
            for (let filter of itemFilter.FilterObjects) {
                filterValue = filter.FilterValue[0];
               reportObjId = filter.ReportObjectID;
               let reportObject =  find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (reportObject) => {
                return reportObject.ReportObjectId.toLowerCase() == reportObjId.toLowerCase();});
                let formattedFilter = AnalyticsUtilsService.GetFormattedFilterValue(reportObject, filterValue);
                this.config.reportDetails.lstFilterReportObject.push(
                  AnalyticsUtilsService.createDrillDriveFilterReportObj(
                    { reportObject: reportObject, filterValue: formattedFilter[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
                  )
                );

                  }
        })
        }
      }

    setGridData() {
        this._loaderService.showGlobalLoader();
        return new Promise((resolve, reject) => {
            let that = this;
           //Adding this function to push drill/drive filters into the lstFilterReportObject if any.
           //By default Region filter is always present since we pass that from the grid itself.
            this.countPopUpFilterCreation();
            let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(this.config.reportDetails);
            reportDetailsMetaData.isGrandTotalRequired = false;
            reportDetailsMetaData.isSubTotalRequired = false;
            reportDetailsMetaData.isLazyLoadingRequired = true;
            reportDetailsMetaData["pageIndex"] = this.currentPageIndex = 1;
            reportDetailsMetaData.lstFilterReportObject.forEach(item => {
                        if (typeof item.filterValue === 'string')
                          item.filterValue = JSON.parse(item.filterValue);
                      }) 
            let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData)
            that.config.WidgetDataRecordLength = 0;
                      
            that.manageSubscription$.add(
                this._analyticsCommonDataService.generateReport(reportDetailsData)
                    .subscribe((response) => {
                        if (response != undefined
                            && response.Data != null
                            && response.Data.length > 0
                            && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
                            that.config.WidgetDataRecordLength = response.Data.length;
                            // that.generateGrid(reportDetailsMetaData, response);
                            // that.initDone = true;
                            // response = that.setGridData();
                            response = that.generateGrid(reportDetailsMetaData, response);
                        }
                        else {
                            if (response.Data.toString().toLowerCase() === "error".toLowerCase()) {
                                that.setDashboardCardMessage(`Report could not be loaded due to some issue(s). Please try again later.`);
                            }
                            else {
                                // if (that.widget) {
                                // 	that.widget.widgetDataType = that.config.widgetDataType;
                                // }
                                that.setDashboardCardMessage('No data returned for this condition. This might be because applied filter excludes all data.');
                            }
                        }
                        this._loaderService.hideGlobalLoader();
                        resolve(response);
                    }, (error) => {
                        that._commUtil.getMessageDialog(
                            `Status:${error.status}  Something Went wrong with ${error.message}`,
                       ()=>{});
                    })
            );
        });
    }


    private getValidatedDAXResponse(response: any): boolean {
        //               this._loaderService.hideGlobalLoader();
        this._loaderService.hideGlobalLoader();
        if (response.Data.toString().toLowerCase() == "error".toString().toLocaleLowerCase()) {
          this.setDashboardCardMessage(`Visualization could not be loaded due to some issue(s). Please try again later.`);
          return false;
        }
        else if (response.Data.length == 0) {
          this.setDashboardCardMessage('No data returned for this condition. This might be because applied filter excludes all data.');
          return false;
        }
        return true;
      }

    setDashboardCardMessage(message) {
        console.log(message)
    }

    private generateGrid(reportDetailsMetaData: any, response: any): any {
        const graphConfig = Object.assign({}, this.config);
        graphConfig.reportDetails = reportDetailsMetaData;
        let gridConfig = {
            widgetDataType: 'grid',
            enableItemFormatter: true,
            TotalRowCount : response.TotalRowCount,
            pageSize : response.PageSize,
            enableEditCell: true,
            enableCellSelection: true,
            enableUpdate: true,
            enableStickyHeader: false,
            enableFilters: false,
            enableFooter: false,
            gridAPI : {},
            iconType: DashboardConstants.OpportunityFinderConstants.ICON_TYPE.icon,
            radioConfig: {
                options: '2',
                value: []
            },
            column: [],
            series: []
        }

        if (response && response.Data && this._commUtil.isNune(response.Data[0])) {
            Object.keys(response.Data[0]).forEach((col) => {
                gridConfig.column.push({
                    aggregate: 0,
                    binding: col,
                    format: undefined,
                    header: col,
                    isReadOnly: true,
                    visible: true,
                    width: 180,
                    minWidth: 180
                    
                })
            });
            gridConfig.series = Object.assign([], response.Data);
        }
        return gridConfig;
    }

  // This is to implement pagination for the Invoice Count , Buyer Count , Plant Count Pop ups.
    private flexGridPagination(_daxResponse: any, isGridInitializing: boolean = true) {
        if (isGridInitializing) {
          this.gridData.pageData = [];
          this.gridData.pageSize = _daxResponse.pageSize;
          this.gridData.totalItems = _daxResponse.TotalRowCount;
          this.gridData.totalPages = Math.ceil(this.gridData.totalItems / this.gridData.pageSize);
          this.gridData.endPage = Math.ceil(this.gridData.totalItems / this.gridData.pageSize);
          this.gridData.currentPage = 0;
          // Checking the Current Page with +1 becuase Math.Ceil returns max value of 1 when devides with endPage
          this.gridData.isNext = (this.gridData.currentPage + 1) == this.gridData.endPage ? false : true;
          this.gridData.isPrev = this.gridData.currentPage == 0 ? false : true;
          this.gridData.startPage = 1;
          this.gridData.showPagination = this.gridData.totalItems <= this.gridData.pageSize ? false : true;
          let gridPaginatedData = isGridInitializing ? _daxResponse.series : _daxResponse.Data;
          this.gridData.pageData.push(gridPaginatedData);
          this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
        }
        else{
            let gridPaginatedData = isGridInitializing ? _daxResponse.series : _daxResponse.Data;
            this.gridData.pageData.push(gridPaginatedData);
            this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
            this.updateFlexGridData();
        }

        
      }

  // When user clicks on Next arrow inside the pagination section
      public nextClickPagination() {
        this._loaderService.showGlobalLoader();
        this.gridData.currentPage += 1;
        this.gridData.isPrev = true;
        this.gridData.isNext = (this.gridData.currentPage + 1) == this.gridData.endPage ? false : true;
        if (this.gridData.pageData[this.gridData.currentPage] != undefined) {
          this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
          this.updateFlexGridData();
        }
        else {
          this.currentPageIndex = this.currentPageIndex + 1;
          let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(this.config.reportDetails);
          reportDetailsMetaData.isGrandTotalRequired = false;
          reportDetailsMetaData.isSubTotalRequired = false;
          reportDetailsMetaData.isLazyLoadingRequired = true;
          reportDetailsMetaData["pageIndex"] = this.currentPageIndex;
          reportDetailsMetaData.lstFilterReportObject.forEach(item => {
                      if (typeof item.filterValue === 'string')
                        item.filterValue = JSON.parse(item.filterValue);
                    }) 
          let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData)

          this.manageSubscription$.add(
            this._analyticsCommonDataService
              .generateReport(reportDetailsData)
              .subscribe((response: any) => {
                if (this.getValidatedDAXResponse(response)) {
                  this.gridData.showPagination = true;
                  this.flexGridPagination(response, false);
                  this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
                  this.setState();
                  this._loaderService.hideGlobalLoader();
                  this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
                }
              }, (error: any) => {
                this._loaderService.hideGlobalLoader();
              })
          );
        }
  }

   // When user clicks on Previous arrow inside the pagination section
      public previousClick() {
        this.gridData.currentPage -= 1;
        this.currentPageIndex -= 1;
        this.gridData.isNext = !this.gridData.isNext ? !this.gridData.isNext : this.gridData.isNext;
        if (this.gridData.pageData[this.gridData.currentPage] != undefined) {
          this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
          this.updateFlexGridData();
          if (this.gridData.currentPage == 0) this.gridData.isPrev = false;
        }
        else {
          this.gridData.isPrev = false;
        }
        this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
      }

  //For updating the flex grid data on basis of selected page
      public updateFlexGridData() {
        this.gridData.gridAPI.updateFlexGrid(this.gridData.pageData[this.gridData.currentPage]);
        this._loaderService.hideGlobalLoader();
      }


    setMockGridData() {
        return {

            widgetDataType: 'grid',
            enableItemFormatter: true,
            enableEditCell: true,
            enableCellSelection: true,
            enableUpdate: true,
            enableStickyHeader: false,
            enableFilters: false,
            enableFooter: false,
            iconType: DashboardConstants.OpportunityFinderConstants.ICON_TYPE.icon,
            radioConfig: {
                options: '2',
                value: ['0', '1', '2']
            },

            column: [],
            series: []
        };
    }

    setConfig() {

        let config: any = [
            {
                type: 'text',
                modalData: this.config.OpportunityName,
                Config: {
                    label: DashboardConstants.UIMessageConstants.STRING_Opportunity_Name,
                    isMandatory: true,
                    allowEmpty: false,
                    disabled: false,
                    data: 'modalData',
                    fieldKey: 'value',
                    tabIndex: 2,
                    attributes: {
                        maxLength: 100
                    }
                }
            },
            {
                type: 'select',
                selectedConfig: { value: this.config.Confidence },
                Config: {
                    dataKey: "code",
                    displayKey: "name",
                    fieldKey: 'value',
                    label: 'Confidence Level',
                    options: map(this.config.EOI_Data, (eoi) => {
                        return {
                            code: eoi.EaseOfImplementationObjectId,
                            name: eoi.EaseOfImplementationName
                        }
                    })
                }
            },
            {
                type: 'text',
                modalData: this.config.OpportunityDescription,
                Config: {
                    label: DashboardConstants.UIMessageConstants.STRING_Description,
                    isMandatory: true,
                    allowEmpty: false,
                    disabled: false,
                    data: 'modalData',
                    fieldKey: 'value',
                    tabIndex: 2,
                    attributes: {
                        maxLength: 100
                    }
                }
            },
        ];
        for (const columnKey in this.config.opportunityRowData) {
            if (columnKey !== "" && columnKey !== "_id" && columnKey !== this.config.RONameForPopup && this.config.opportunityRowData.hasOwnProperty(columnKey)) {
                config.push({
                    type: 'read-only',
                    header: columnKey,
                    data: typeof this.config.opportunityRowData[columnKey] == 'number' ? this.config.opportunityRowData[columnKey].toFixed(2) : this.config.opportunityRowData[columnKey],
                });
            }
        }
        return config;
    }
    flexEvents(event) {
        let action = event.type;
        switch (action) {
            case "itemFormatter": this.drillGridItemformatter(event);
                break;
            case "render": this.gridRendered(event);
                break;
            case "celledit": ;
                break;
            case "slection": ;
                break;
        }
    }

    gridRendered(event) {
        event.grid.allowMerging = 'All';
        if (event.grid.columns) {
            for (let RO_cnt = 0; RO_cnt < this.config.reportDetails.lstReportObjectOnRow.length; RO_cnt++) {
                if (event.grid.columns[RO_cnt]) {
                    event.grid.columns[RO_cnt].allowMerging = true;
                }
            }
        }

    }

    drillGridItemformatter(obj) {
        //this.grid = obj.grid;
        if (obj.filter.cellType === CellType.Cell) {
            var flex = obj.filter.grid;
            var row = flex.rows[obj.r];

            if (flex.columns[obj.c].header === this.config.RONameForPopup) {
                let thisRef = this;
                obj.cell.innerHTML = '<input type="radio" [(ngModel)]="' + thisRef.gridData.radioConfig.options + '" name="' + thisRef.gridData.radioConfig.options + '" value="' + thisRef.gridData.radioConfig.value[obj.r] + '">' + thisRef.gridData.series[obj.r][this.config.RONameForPopup] + '';
                setCss(obj.cell, {
                    paddingLeft: '35px'
                });
                var cb = obj.cell.firstChild;
                cb.addEventListener('click', function (e) {
                    thisRef.handleChange(e, obj.r, thisRef.gridData.series[obj.r][thisRef.config.RONameForPopup])
                });
            };
        }
            // For highlighting the headers in the grid inside the popup
            if (obj.filter.cellType == CellType.ColumnHeader) {

                setCss(obj.cell, {
                    background: 'rgba(240, 240, 240, 1)'       
                });
        
    }
    }
    handleChange(event, rowIndex, name) {
        this.config.selectedPopupValue = name;
        this.config.opportunityRowData = this.gridData.series[rowIndex];
    }

    onCancel() {
        let opportunityFinderLandingPageUrl = this._appConstant.userPreferences.IsNextGen ?
        this._commonUrls.URLs.OpportunityFinderApiUrls.getNextGenLandingPageURLForOppFinder :
        this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;

        if (this._dashboardCommService.oppFinderState.editMode) {
            this._commUtil.getConfirmMessageDialog(DashboardConstants.UIMessageConstants.STRING_SHOW_DASHBOARD_CANCEL_CLICK,
                [
                    DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                    DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT,
                ],
                (_response: any) => {
                    if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                        window.location.href = opportunityFinderLandingPageUrl;
                    }
                }
            )
        }
        else {
            this.config.api.closePopup();
            this.ngOnDestroy();
        }
    }

    nextClick() {
        if (!this._commUtil.isNune(this.config.selectedPopupValue)) {
            this._commUtil.getMessageDialog(
                DashboardConstants.UIMessageConstants.STRING_SELECT_VALUE_TO_PROCEED,
                ()=>{},
                DashboardConstants.OpportunityFinderConstants.STRING_ERROR
            );
        }
        else if (this.showGrid == true) {
            this.showGrid = false;
            this.renderCommonContainer();
        }
    }

    doneClick() {
        this.popupValidations().then((response) => {
            if (response === true) {
                this._commUtil.getConfirmMessageDialog(DashboardConstants.UIMessageConstants.STRING_CONFIRM_SAVEOPPORTUNITY,
                    [
                        DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                        DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT,
                    ],
                    (_response: any) => {
                        if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                            this.saveOpportunityFinderDetails();
                        }
                    }
                )
            }
        });
    }

    private popupValidations() {
        return new Promise((resolve, reject) => {
            if (!this._commUtil.isNune(this.config.OpportunityName.value.trimEnd())) {
                this._commUtil.getMessageDialog(
                    DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_NAME,
                    ()=>{},
                    DashboardConstants.OpportunityFinderConstants.STRING_ERROR)
                 
            }
            else if (!this._commUtil.isNune(this.config.OpportunityDescription.value.trimEnd())) {
                this._commUtil.getMessageDialog(
                    DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_DESC,
                    ()=>{},
                    DashboardConstants.OpportunityFinderConstants.STRING_ERROR)
                 
            }
            else if (!this.config.Confidence || !this.config.Confidence.name || this.config.Confidence.name == DashboardConstants.UIMessageConstants.STRING_Confidence_Level) {
                this._commUtil.getMessageDialog(
                    DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_EOI,
                    ()=>{},
                    DashboardConstants.OpportunityFinderConstants.STRING_ERROR)
                
            }
            else if (!this._commUtil.isValidGuid(this._dashboardCommService.oppFinderState.oppFinderId)) {
                console.log('Invalid Opportunity Id : ', this._dashboardCommService.oppFinderState.oppFinderId);
                this._commUtil.getMessageDialog(
                    DashboardConstants.UIMessageConstants.STRING_SHOW_SOMETHING_WENT_WRONG,
                    ()=>{},
                    DashboardConstants.OpportunityFinderConstants.STRING_ERROR
                )
            }
            else if (!this._commUtil.isValidGuid(this.config.opportunityTypeMasterData.OpportunityFinderTypeObjectId)) {
                console.log('Invalid Opportunity type Id : ', this.config.opportunityTypeMasterData.OpportunityFinderTypeObjectId);
                this._commUtil.getMessageDialog(
                    DashboardConstants.UIMessageConstants.STRING_SHOW_SOMETHING_WENT_WRONG,
                    ()=>{},
                    DashboardConstants.OpportunityFinderConstants.STRING_ERROR)
                 
            }
            else {
                resolve(true);
            }
        })
    }

    // For saving Opportunity data in backend configuration is done here for all oppfinders.
    private saveOpportunityFinderDetails() {
        try {
            let opportunityFinderLandingPageUrl = this._appConstant.userPreferences.IsNextGen ?
                this._commonUrls.URLs.OpportunityFinderApiUrls.getNextGenLandingPageURLForOppFinder :
                this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;
            let totalEstimatedSavings: number = 0;
            let totalSavings : number = 0;
            let totalSpend : number = 0;
            this._loaderService.showGlobalLoader();
            // Making Savings and Spend Generic for all Oppfinders.
                 totalSavings = this.config.TotalEstimatedSavings
                 totalSpend = this.config.AssignableSpend;
            let gridJson: any = {
                OpportunityName: this.config.OpportunityName.value,
                OpportunityDescription: this.config.OpportunityDescription.value,
                Confidence: this.config.Confidence,
                RONameForPopup: this.config.RONameForPopup,
                RONameForSpend: this.config.RONameForSpend,
                RONameForSavings: this.config.RONameForSavings,
                selectedPopupValue: this.config.selectedPopupValue,
                selectedMaterialValue: this.config.selectedMaterialValue,
                opportunityRowData: this.config.opportunityRowData,
                EOI_Data: this.config.EOI_Data

            }
            this._dashboardCommService.oppFinderState.gridJson = gridJson;

            //Creating the Final Object to Saved the Record on Database.
            let opportunityFinderDetails = {
                OpportunityFinder_ObjectId: this._dashboardCommService.oppFinderState.oppFinderId,
                OpportunityFinderType_ObjectId: this.config.opportunityTypeMasterData.OpportunityFinderTypeObjectId,
                EaseOfImplementation_ObjectId: find(this.config.EOI_Data, (eoi) => { return eoi.EaseOfImplementationName == this.config.Confidence.name }).EaseOfImplementationObjectId,
                OpportunityName: this.config.OpportunityName.value,
                OpportunityDescription: this.config.OpportunityDescription.value,
                GridColumnsJSON: JSON.stringify(gridJson),
                TotalSpend: totalSpend,
                TotalSavings: totalSavings,
                TotalEstimatedSavings: totalEstimatedSavings,
                IsDeleted: false,
                IsFlipToProject: false,
                isPending: false,
                ReportROMappingDetails: undefined
            } as ISaveOpportunityFinderDetails;



            this._oppFinderService.saveOpportunityFinderDetails(opportunityFinderDetails)
                .toPromise()
                .then((response) => {
                    if (response !== 'error') {
                        this._loaderService.hideGlobalLoader();
                        this.config.api.closePopup();
                        this._commUtil.getMessageDialog(
                            this._dashboardCommService.oppFinderState.editMode ? DashboardConstants.UIMessageConstants.STRING_EDIT_OPP_SUCCESS_FINDER : DashboardConstants.UIMessageConstants.STRING_SHOW_CREATE_OPP_SUCCESS,
                            (_response: any) => {
                                if (_response.result.toLocaleLowerCase() == DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT.toLocaleLowerCase()) {
                                    this._loaderService.showGlobalLoader();
                                    window.location.href = opportunityFinderLandingPageUrl;
                                }
                            },
                            DashboardConstants.OpportunityFinderConstants.STRING_SUCCESS
                        );
                    }
                });
        }
        catch (e) {
            this._commUtil.getMessageDialog(e.message,()=>{});
        }
    }

    private setState() {
        this._cdRef.markForCheck();
    }
}
