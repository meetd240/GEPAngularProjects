import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild, ViewContainerRef, Inject, Input, ElementRef, ApplicationRef, ViewEncapsulation, EmbeddedViewRef, Output, OnDestroy, Renderer2, ComponentFactoryResolver, Injector, ComponentRef, TemplateRef, ChangeDetectorRef }
  from "@angular/core"; import { NotificationService, AppConstants }
  from 'smart-platform-services'; import { AnalyticsCommonConstants }
  from '@vsAnalyticsCommonConstants'; import { DashboardConstants }
  from '@vsDashboardConstants'; import { CommonUtilitiesService }
  from '@vsCommonUtils'; import { findIndex, find, map as _map, each, filter, mapValues, maxBy, debounce }
  from 'lodash'; import { DashboardCommService }
  from '@vsDashboardCommService'; import { LoaderService }
  from "@vsLoaderService"; import { CellType }
  from 'wijmo/wijmo.grid';
  
import * as wjcGrid from 'wijmo/wijmo.grid';
import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
import { Subscription } from 'rxjs';
import { setCss } from 'wijmo/wijmo'; import { IOpportunityFinderTypeMaster, IOpportunityFinderCreationObjectInfo, IReportingObjectMultiDataSource, IFilterList } from "interfaces/common-interface/app-common-interface";
import { OpportunityFinderService } from "@vsOppfinderService/opportunityFinder.service";
import { IOpportunityFinderCurrencySign } from '@vsCommonInterface';
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { AnalyticsMapperService } from "@vsAnalyticsCommonService/analytics-mapper.service";
import { SavedFilter } from "@vsMetaDataModels/saved-filter.model";
import { forEach } from "core-js/fn/array";
import { OlapGridDirectiveService } from "@vsOlapGridDirectiveService";
import { ICardDashboardSubscription } from "@vsDashboardInterface";
import { CommonUrlsConstants } from "@vsCommonUrlsConstants";
@Component({ selector: 'oppfinder-card', 
templateUrl: './oppfinder-card.component.html', 
styleUrls: ['./oppfinder-card.component.scss'], host: { '(document:click)': 'onDocumentClick($event)', }, encapsulation: ViewEncapsulation.None })

export class OppFinderCardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() config: any;
  dbGridSubject: ICardDashboardSubscription = {} as ICardDashboardSubscription;
  assignSpendConfig: any = {
    api: {},
    SelectedVAriables: {},
    TotalSpend: 0
  }
  tailSpendConfig: any = {
    api: {},
    reportDetails: {},
    TotalSpend: 0,
    TotalSavings :0,
    SuppliersList : ""
  }

  ptsPopUpConfig: any = {
    api: {}
  }
  widget: any;
  constants = DashboardConstants;
  rowindex: number = 0;
  totalSpend: any;
  createOpportunityEvent: any;
  hiddenDivVal: any;
  widgetConf: any;
  flexPtsGridConfig: any;
  editTextfield: boolean = true;
  editTextfieldest: boolean = true;
  gridMessage: string = "";
  flexGridEvent: any;
  invoiceCountRO: any;
  PlantCountRO: any;
  buyersCountRO: any;
  ptsSpendRO: any;
  PaymentTermNewReportObjectId: any;
  selectedPtsRow: any;
  SupplierAttrName: any;
  paymentTermreportDetailsData: any;
  TotalEstimatedSavings: any;
  assignableSpend: any;
  srsFlag: boolean = false;
  ptsFlag: boolean = false;
  concoFlg: boolean = false;
  viewPPVDetails: boolean = false;
  setSupplierData: boolean = true;
  stepCount : number = 0;  // to determine the step on which the user is 
  formatter: any;
  isChecked: boolean = false;
  nextflag: boolean = false;  // to toggle between main grid and popup grid
  btnPaymentTermConfig: any;
  manageSubscription$: Subscription = new Subscription();
  configSeries : any;   // to store the data of all the records at init time

  penaltyPercentage: any = {
    Value: DashboardConstants.OpportunityFinderConstants.DEFAULT_ESTSAVINGPER
  };
  actionTooltipConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartActionTooltipConfig);
  @ViewChild("assignSpendPopUpRef", {
    read: ViewContainerRef
  }) assignSpendPopUpRef: ViewContainerRef;

  @ViewChild("paymentTermPopUpRef", {
    read: ViewContainerRef
  }) paymentTermPopUpRef: ViewContainerRef;

  @ViewChild("ppvViewDetailsPopupRef", {
    read: ViewContainerRef
  }) ppvViewDetailsPopupRef: ViewContainerRef;

  @ViewChild("widgetContainer", {
    read: ViewContainerRef
  }) widgetContainerRef: ViewContainerRef;

  @ViewChild('olapGridTemplate') olapGridTemplateRef: TemplateRef<any>;

  @ViewChild("outletTemplate") outletTemplateRef: TemplateRef<any>;

  //Smart Numeric Config for estimated savings div div
  smartNumericConfig: any = {
    label: '',
    isMandatory: true,
    disabled: false,
    tabIndex: 2,
    data: "Value",
    placeholder: "1-100",
    attributes: {
      maxLength: 5,
      placeholder: "",
      max: 100,
      min: 0
    },
    minPrecession: 0,
    maxPrecession: 2

  }


  // Oppfinder Active/InActive Status variables declaration STARTdfg
  @ViewChild("oppfinderStatusPopup", { read: ViewContainerRef }) oppfinderStatusPopupRef: ViewContainerRef;
  ddlOppfinderStatusSelected: any;
  ddlOppfinderStatus: any;
  opportunityFinderTypeMaster: IOpportunityFinderTypeMaster;
  oppFinderMasterInactiveJsonArray: any;
  oppFinderMasterSeries: any;
  validUptoCol: any;
  gridInactiveOppfinderArray: any = [];
  isActiveKebabMenu: any = true;
  cardPagination: any;
  oppfinderDeleteIndex: any;
  oppfinderDatasubscription: Subscription;
  btnCreateConfig: { title: string; flat: boolean; disable: boolean; };
  btnAssignConfig: { title: string; flat: boolean; disable: boolean; };
  btnNextConfig : any = {
    title: DashboardConstants.UIMessageConstants.STRING_NEXT_TXT,
    flat: false
  }
  btnResetConfig: { title: string; flat: boolean; disable: boolean; };
  btnCloseConfig: any = {
    title: DashboardConstants.UIMessageConstants.STRING_Reset,
    flat: true
};
btnBackConfig: any = {
  title: DashboardConstants.UIMessageConstants.STRING_BACK_BTN,
  flat: true
};
btnCancelConfig: any = {
  title: DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
  flat: true
};
  destoryTimeout: any = {};
  SpendRO: any;
  ComplianceRo: any;
  NonComplianceRo: any;
  editableDivLeftWidth: number;
  SupplierId: any;
  currencySign: '';
  drillDriveFilters: any[];
  globalFilters: any[];
  supplierList: any = '';
  createdOppAdditionalDetails: any = { 'Savings': '0', 'Spend': '0' };
  tsaFlag: boolean = false;
  flexFlag : boolean = false;
  olapGridEvent: any;
  wijmoEvents: any;
  refreshValues: boolean = false ;
  tailsavings: number;
  transactionCount: any;

  // Oppfinder Active/InActive Status variables declaration END


  constructor(
    private notification: NotificationService,
    private _changeDetection: ChangeDetectorRef,
    private _commUtils: CommonUtilitiesService,
    private _loaderService: LoaderService,
    private _elementRef: ElementRef,
    private _commonUrls: CommonUrlsConstants,
    public _dashboardCommService: DashboardCommService,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    public _appConstants: AppConstants,
    private _oppFinderService: OpportunityFinderService,
  @Inject(OlapGridDirectiveService)
  private _olapGridDireService: OlapGridDirectiveService,
    private _commUtil: CommonUtilitiesService) { }

  ngOnInit() {
    //  this.config.config.allowSorting = true;
    this.config.config.enableStickyHeader = false;
    let title = "'"+this.config.cardTitle+"'";
    this._dashboardCommService.assignedRows = [];
    document.querySelector("[title="+title+"]").remove();
    this.setSRSCoulums();
    this.setConcoGridConfig();
    this.config.changeDetectionMutation.set = this.setState.bind(this);
    this.setOppfinderConfiguration();
    this.setFraudAnomalyConfiguration();
    this.config.createOpportunity = false;
    this.setGridMessage();
    this._dashboardCommService.filterObjectHierarchyList;
    this.config.changeDetectionMutation.setDashboardCardState();
    // this._dashboardCommService.getOppfinderData().subscribe(configSeries => {
    //   this.highlightInactiveOppfinder(configSeries);
    // })
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
    if (this.oppfinderDatasubscription) {
      this.oppfinderDatasubscription.unsubscribe();
    }

    clearTimeout(this.destoryTimeout);
  }


  setConcoGridConfig() {
    this.getOppfinderCurrencySign();
    this.formatter = new Intl.NumberFormat('en-US', {
      style: undefined,
      currency: undefined,
      minimumFractionDigits: 0,
    });

    // Setiing viewPPVDetails flag as true for PPV oppfinder inside the kebab menu in flex grid.
    if(this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name) {    
      if(this.config.widgetDataType != DashboardConstants.WidgetDataType.Olap){
      this.viewPPVDetails = true;
      this.flexFlag = true;
       this.hiddenDivVal = 950;
       this.config.config.enableCellSelection = true;
       this.config.config.enableEditCell = true;    
    }
  }
  else{
    this.viewPPVDetails = false;
  }
    this.ddlOppfinderStatusSelected = {
      'value': {
        "Id": 0,
        "Value": DashboardConstants.UIMessageConstants.STRING_ALLOPPORTUNITIES
      }
    };

    this.ddlOppfinderStatus = {
      dataKey: 'Id',
      label: 'View',
      displayKey: 'Value',
      fieldKey: 'value',
      cssClass: 'line-height-manager',
      options: [
        {
          "Id": 0,
          "Value": DashboardConstants.UIMessageConstants.STRING_ALLOPPORTUNITIES
        },
        {
          "Id": 1,
          "Value": DashboardConstants.UIMessageConstants.STRING_INACTIVEOPPORTUNITIES
        },
      ]
    }
    this.btnPaymentTermConfig = {
      title: "PAYMENT TERM",
      flat: false,
      disable: false
    }
    // Adding this code specifically for CONCO and PONPO for adding additional columns (Compliance, Non Compliance, %savings and savings)
    //Here defining a new variable concoColumns which contains the list of new columns. Will push these new columns to existing report Columns.

    if (this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name ||
      this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name) {

      let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, {
        OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name
      });
      if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
        masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
      }
      this.widgetConf = find(masterData.AdditionalProps,
        (prop) => {
          return prop.ReportDetailsObjectId.toLowerCase() === this.config.reportDetails.reportDetailObjectId.toLowerCase()
        });

      this.invoiceCountRO = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => { // finding spend in reportDetails because it is not available in all listAllReportObjectWithMultiDatasource(as measure filters not supported in dashboard till now)
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.InvoinceReportID.toLowerCase();
      });
      this.buyersCountRO = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.BuyerReportID.toLowerCase();
      });

      this.PlantCountRO = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.PlantReportID.toLowerCase();
      });

      this.SpendRO = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SpendROReportID.toLowerCase();
      });

      this.ComplianceRo = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.ComplianceRoId.toLowerCase();
      });

      this.NonComplianceRo = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.NonComplianceRoId.toLowerCase();
      });

      this.concoFlg = true;
      this.penaltyPercentage.Value = 3;
      let concoColumns = [{
        "title": AnalyticsCommonConstants.OppfinderCommonConstants.CompliantSpend,
        "width": 140
      }, {
        "title": AnalyticsCommonConstants.OppfinderCommonConstants.NonCompliantSpend,
        "width": 140
      }, {
        "title": DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER,
        "width": 180
      }, {
        "title": DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS,
        "width": 180
      }, {
        "title": "",
        "width": 50
      }
      ]

      //Running this iteration to add new columns to existing ones for the flex grid.
      if (this.config.config.column.length <= 7) {
        concoColumns.forEach(element => {
          this.config.config.column.push({
            aggregate: 0,
            binding: element.title,
            format: undefined,
            header: element.title,
            isReadOnly: true,
            visible: true,
            allowSorting: false,
            width: element.width,
            minWidth: element.width
          })
        });
      }

      this.setConcoPonpoNewColumnValues();
    }
    // Oppfinder Active/InActive Status popup/grid data setting START
    this.validUptoCol = ({
      _id: undefined,
      header: DashboardConstants.UIMessageConstants.STRING_INACTIVE_TILL,
      aggregate: "None",
      binding: DashboardConstants.UIMessageConstants.STRING_VALIDUPTO,
      format: "",
      isReadOnly: true,
      visible: true,
      width: 110,
      minWidth: 50,
      dataType: 4
    });

    try {
      if (this.config.config.column[this.config.config.column.length - 2].header != DashboardConstants.UIMessageConstants.STRING_INACTIVE_TILL) {
        this.config.config.column.splice((this.config.config.column.length - 1), 0, this.validUptoCol);
      }
    }
    catch (e) { }

    this.opportunityFinderTypeMaster = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, {
      OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name
    });

    if (this.opportunityFinderTypeMaster.InactiveOpportunitiesJson) {
      this.oppFinderMasterInactiveJsonArray = JSON.parse(this.opportunityFinderTypeMaster.InactiveOpportunitiesJson);
    }
    this.highlightInactiveOppfinder(this.config.config.series);

  }

  //Adding this function which will calculate the grid level values for the newly introduced columns specifically for conco and ponpo.
  setConcoPonpoNewColumnValues() {
    this.config.config.series.forEach((item) => {
      if (!item[this.ComplianceRo.displayName]) {
        item[this.ComplianceRo.displayName] = 0;
      }
      item[AnalyticsCommonConstants.OppfinderCommonConstants.CompliantSpend] = this.formatter.format(((item[this.SpendRO.displayName].toFixed(0) * (item[this.ComplianceRo.displayName].toFixed(0) / 100))).toFixed(0)),
        item[AnalyticsCommonConstants.OppfinderCommonConstants.NonCompliantSpend] = item[this.NonComplianceRo.displayName] ? this.formatter.format(((item[this.SpendRO.displayName].toFixed(0) * (item[this.NonComplianceRo.displayName].toFixed(0) / 100))).toFixed(0)) : 0,
        item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
        item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = this.formatter.format(((((95 - item[this.ComplianceRo.displayName].toFixed(0)) * item[this.SpendRO.displayName].toFixed(0)) * this.penaltyPercentage.Value) / 10000).toFixed(0))
    });
  }



  highlightInactiveOppfinder(series) {
    if (series) {
      if (this.oppFinderMasterInactiveJsonArray) {
        this.oppFinderMasterInactiveJsonArray.map((inactiveJsonVal: any, inactiveJsonKey: number) => {
          var comment = inactiveJsonVal.Comment;
          var validUpto = inactiveJsonVal.ValidUpto;
          delete inactiveJsonVal.Comment;
          delete inactiveJsonVal.ValidUpto;
          var ind = findIndex(series, inactiveJsonVal);
          if (ind != -1) {
            series[ind][DashboardConstants.UIMessageConstants.STRING_VALIDUPTO] = validUpto;
            series[ind][DashboardConstants.UIMessageConstants.STRING_COMMENT] = comment;
          }
          inactiveJsonVal[DashboardConstants.UIMessageConstants.STRING_COMMENT] = comment;
          inactiveJsonVal[DashboardConstants.UIMessageConstants.STRING_VALIDUPTO] = validUpto;
        });
      }
      this.oppFinderMasterSeries = series;

    }
  }

    // reseting the values of the grid according to the step on which user is
  resetGridData() {
    if(!this.stepCount){
    this.penaltyPercentage.Value = 0;
    this.supplierList = '';
    this.assignableSpend = Math.abs(Number(this.totalSpend.replace(/[^0-9.-]+/g, "")) );
    this.assignableSpend =  this.formatter.format(this.assignableSpend) || 0
    this.TotalEstimatedSavings = 0;
    this.config.config.series.forEach((item) => {
      item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
      item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0,
      // item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = 0,
        item[DashboardConstants.UIMessageConstants.STRING_ESTPERCENTAMOUNT] = 0,
        item["isSelected"] = false
    });
    this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
    this.config.changeDetectionMutation.setDashboardCardState();
  }
  else if(this.stepCount){
    if(this.stepCount===1){
      this.assignSpendPopUpRef.detach();
      this.assignSpendPopUpRef.clear();
    }
    this.penaltyPercentage.Value = 0;
    this.TotalEstimatedSavings = 0;
    this.config.config.series.forEach((item) => {
      item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
        item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = 0,
        item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0,
        item[DashboardConstants.UIMessageConstants.STRING_ESTPERCENTAMOUNT] = 0
    });
    this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
    this.config.changeDetectionMutation.setDashboardCardState();
    if(this.stepCount===1){
      this.assignSpend();
    }
  }
  }

  //for setting grid message.

  setGridMessage() {

    let gridMssg: any;
    this.gridMessage = "";
    if (this._dashboardCommService.filterObjectHierarchyList.length > 0 && this._dashboardCommService.filterCount == 0) {
      for (gridMssg of this._dashboardCommService.filterObjectHierarchyList) {

        for (let filter of gridMssg.FilterObjects) {
          if (this.gridMessage.length > 0) {
            this.gridMessage = this.gridMessage.concat(" | " + filter.FilterValue);
          } else {
            this.gridMessage = this.gridMessage.concat(filter.FilterValue);
          }
        }
      }

    }
    else {
     
      if(this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name){
        this.gridMessage = DashboardConstants.UIMessageConstants.STRING_oppFinderGridMessagePPV;
      }
      else{
        this.gridMessage = AnalyticsCommonConstants.oppFinderGridMessage;
      }
    }

  }
  //Supplier rationalization grid columns
  setSRSCoulums() {
    document.getElementById('activeinactivedropdown').style.display = 'inline';
    this.cardPagination.showPagination = true;
    this.cardPagination.currentPage = 0;
    if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
      this.config.changeDetectionMutation.setDashboardCardFooterState();
    }
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name) {
      this.formatter = new Intl.NumberFormat('en-US', {
        style: undefined,
        currency: undefined,
        minimumFractionDigits: 0,
      });
      this.getOppfinderCurrencySign();
      // saving the series of suppliers if user is on the first step 
      //else remove the checkbox column if present and also the coloumns like estimated savings
      if(this.stepCount === 0){
        if(this.config && this.config.config.column.length !=3){
          if(this.config.config.column[0].header === ""){
            this.config.config.column.shift();
          }
          while(this.config.config.column.length !=3){
            this.config.config.column.pop();
          }
        }
      this.configSeries = this.config.config.series;
      }else{
        if(this.config.config.column[0].header === ""){
          this.config.config.column.shift();
        }
        for(var i=0;i<3;i++){
          this.config.config.column.pop();
        }
        this.config.config.series = this.configSeries;
      }
      this.assignableSpend = this.formatter.format(parseFloat(this.config.config.SpendUSD.toFixed(0))) || 0;
      this.createdOppAdditionalDetails['Assigned Spend'] = 0;
      let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, {
        OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name
      });
      let spendReportObject = this.config.reportDetails.lstReportObjectOnValue.filter(e => e.reportObjectId.toLowerCase() == masterData.AdditionalProps[0].SpendUSDObjectId.toLowerCase())
      let format = this.config.config.column.filter(i => i.header == spendReportObject[0].reportObjectName)[0].format;
      this.setSupplierName();
      this.srsFlag = true;
      this.btnCreateConfig = AnalyticsCommonConstants.createBtnConfig;
      this.btnAssignConfig = AnalyticsCommonConstants.assignBtnConfig;
      this.btnResetConfig = AnalyticsCommonConstants.resetBtnConfig;
      this.config.config.selectionMode = DashboardConstants.WijmoConfiuration.WijmoSelectionMode.LISTBOX;
      this.config.config.column.filter(i => i.header == this.SupplierAttrName)[0].width = AnalyticsCommonConstants.OppfinderCommonConstants.DefultSupplierWidth;
      if (this.config.config.column.length < 7) {
        this.config.config.column.unshift({
          _id: undefined,
          binding: '',
          header: '',
          width: 45,
          isReadOnly: false,
          isRequired: false,
          visible: true,
          dataType: "Boolean"
        })
        this.config.config.column.push({
          aggregate: 0,
          binding: DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT,
          format: format,
          header: DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT,
          isReadOnly: true,
          visible: true,
          allowSorting: false,
          width: 155,
          minWidth: 155
        });
        this.config.config.column.push({
          _id: undefined,
          header: "",
          aggregate: "None",
          binding: "",
          format: "",
          isReadOnly: true,
          visible: true,
          width: 50,
          minWidth: 50
        })
        if(this.stepCount = 0){
        this.config.config.series.forEach((item) => {
          item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
          //  item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = 0,
            item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0,
            item[DashboardConstants.UIMessageConstants.STRING_ESTPERCENTAMOUNT] = 0,
            item["isSelected"] = false
        });
      }else{
        this.stepCount = 0;
      }

      }

    }
    else if (this._dashboardCommService.oppFinderState.strategy.name === DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.name) {
      this.ptsFlag = true;

      let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });
      if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
        masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
      }

      this.widgetConf = find(masterData.AdditionalProps,
        (prop) => {
          return prop.ReportDetailsObjectId.toLowerCase() === this.config.reportDetails.reportDetailObjectId.toLowerCase()
        });
      let supplierReportObject = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SupplierReportObjectId.toLowerCase();
      });
      this.SupplierAttrName = supplierReportObject.displayName;
      this.config.config.column.filter(i => i.header == this.SupplierAttrName)[0].width = AnalyticsCommonConstants.OppfinderCommonConstants.DefultSupplierWidth;
      this.config.config.column.filter(i=>{ return i.header=="" && i.binding==""})[0].width=100;
    }
  }

  flexEvents(event) {
    let action = event.type;
    switch (action) {
      case "itemFormatter":
        this.drillGridItemformatter(event);
        break;
      /*   case "celledit":
            this.selectRows(event);
            break; */
    }
  }



  cellSelected(event) {
    if (this.config.config.column[event.event.col].header.length != 0 || event.event.col == 0) {
      this.editTextfield = true;
    }
  }

  selectRows(obj) {
    let selectedRow = this.config.config.series[obj.event.row].isSelected;
    this.config.config.series[obj.event.row].isSelected = selectedRow == true ? false : true;
    setTimeout(() => {
      this.assignableSpend = parseFloat(this.calculateAssignableSpend().toFixed(2)) || 0
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
  }

  drillGridItemformatter(obj) {

    var flex = obj.filter.grid;
    if (this._dashboardCommService.oppFinderState.oppFinderFlag){
    if (obj.filter.cellType === CellType.Cell) {

      if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name ||
        this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name) {
          this.hiddenDivVal = 1720
          this.editableDivLeftWidth = 910;
        if (flex.columns[obj.c].header === this.invoiceCountRO.displayName) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
          obj.cell.addEventListener('click', (e) => {
            setTimeout(() => {
            this.createDetailsPopUp(obj, DashboardConstants.UIMessageConstants.STRING_INVOICE_COUNT,obj.r);
          },200)
            e.preventDefault();
            e.stopImmediatePropagation();    
          }, true);

        } else if (flex.columns[obj.c].header === this.buyersCountRO.displayName) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
          obj.cell.addEventListener('click', (e) => {
            setTimeout(() => {
            this.createDetailsPopUp(obj, DashboardConstants.UIMessageConstants.STRING_BUYER_COUNT,obj.r);
          },200)
            e.preventDefault();
            e.stopImmediatePropagation();    
          }, true);
        } else if (flex.columns[obj.c].header === this.PlantCountRO.displayName) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          }),
            obj.cell.addEventListener('click', (e) => {
              setTimeout(() => {
              this.createDetailsPopUp(obj, DashboardConstants.UIMessageConstants.STRING_PLANT_NAME,obj.r);
            },200)
              e.preventDefault();
              e.stopImmediatePropagation();    
            }, true);

        }

      } else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name) {
        this.hiddenDivVal = 1110;
        this.editableDivLeftWidth = 853
        this.totalSpend = this.formatter.format(parseFloat(this.config.config.SpendUSD.toFixed(0))) || 0;
        if (flex.columns[obj.c].header === null && flex.columns[obj.c].dataType == 3) {
          setCss(obj.cell, {
            left: "10px"

          });

          if (!this.config.config.series[obj.r].ValidUpto) {
            obj.cell.innerHTML = '<input type="checkbox" style=" visibility: visible !important" />';



            obj.cell.addEventListener('click', (e) => {
              if (e.target.type == "checkbox") {
                this.config.config.series[obj.r].isSelected = e.target.checked;
                if(e.target.checked){
                  let ind = this._dashboardCommService.assignedRows.indexOf(this.config.config.series[obj.r]);
                  if(ind == -1){
                    this._dashboardCommService.assignedRows.push(this.config.config.series[obj.r]);
                  }         
                }
                else{
                  let ind = this._dashboardCommService.assignedRows.indexOf(this.config.config.series[obj.r]);
                  if(ind != -1){
                    this._dashboardCommService.assignedRows.splice(ind,1);
                  }
                }
                this.assignableSpend = this.formatter.format(parseFloat(this.calculateAssignableSpend().toFixed(0))) || 0
                this.config.changeDetectionMutation.setDashboardCardState();


              }

            }, true);
          }
          else {
            obj.cell.innerHTML = '<input type="checkbox" style=" visibility: hidden !important" />';
          }

          //select checkoxes

          if (this.config.config.series[obj.r].isSelected === true) {
            obj.cell.firstChild.checked = true;
          }

        }
      }

      if (flex.columns[obj.c].header === DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER && !this.config.config.series[obj.r].ValidUpto) {

        setCss(obj.cell, {
          cursor: 'pointer',
          color: '#0177d6'
        });
        obj.cell.addEventListener('click', (e) => {
          setTimeout(() => {
            this.createOpportunityEvent = obj;
            this.rowindex = obj.r;
            this.penaltyPercentage.Value = this.config.config.series[obj.r][DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER];
            let $element = $(this._elementRef.nativeElement),
              editContainer = $element.find('.editable-div_estspend'),
              inputEle = $element.find('.editable-div .input-field input'),
              element = obj.grid.cells.getCellElement(obj.r, obj.c),
              left = $(element).offset().left;
            let top = $(element).offset().top;
            this.editTextfieldest = false;
            editContainer.css("left", this.editableDivLeftWidth);
            editContainer.css("top", obj.r * element.offsetHeight);
            this.config.changeDetectionMutation.setDashboardCardState();
          })
        }, true);
      }
      if (flex.columns[obj.c].header === null && flex.columns[obj.c].dataType != 3) {
        let icon = "#icon_Preview";
        
        // For SRSN the icon of kebab menu is replaced with new icon according to the active inactive records
        if(this._dashboardCommService.oppFinderState.strategy.shortName===DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.shortName)
        {
          this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
          if(!this.isActiveKebabMenu){
            obj.cell.innerHTML = " <a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_forecast'></use></svg></i></a>"
          }else{
            obj.cell.innerHTML = " <a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_InactiveOpprtunity'></use></svg></i></a>"
          }
        }
        else if(this._dashboardCommService.oppFinderState.strategy.shortName===DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.shortName){
          this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
          this.setIconForPtsn(obj);   
        }
        else{
          obj.cell.innerHTML = " <a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_MenuKebab'></use></svg></i></a>"
        }
        obj.cell.addEventListener('click', (e) => {
          // this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
          // If Supplier rationalization, then inside of inactive popup the function called directly
          if(e.view.location.search.includes(DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.shortName)){
            this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
            if(!this.isActiveKebabMenu){

              obj.cell.innerHTML = " <a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_forecast'></use></svg></i></a>"
              this.onOppfinderGridStatusChange(e,0);
            }
            else{
              obj.cell.innerHTML = " <a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_InactiveOpprtunity'></use></svg></i></a>"

              this.onOppfinderGridStatusChange(e,1);
            }
            setTimeout(() => {
              this.createOpportunityEvent = obj;
              this.rowindex = obj.r;
              this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
              this.config.changeDetectionMutation.setDashboardCardState();
              
            })
          }
          else if(this._dashboardCommService.oppFinderState.strategy.shortName===DashboardConstants.OpportunityFinderConstants.Strategies.PTSN.shortName){
            this.selectRowForPTSN(obj);
            if(e.target.id && e.target.id==="viewDetails")
            {   
              setTimeout(() => {
                this.paymentTermClick();
              }, 500);    
              e.preventDefault();
              e.stopImmediatePropagation();                   
            }
            else{
              this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
              this.flipActiveInactive(e,obj);
            }
                       
          }
          else{
            setTimeout(() => {
              this.createOpportunityEvent = obj;
              this.rowindex = obj.r;
              this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record              
              let $element = $(this._elementRef.nativeElement),
                editContainer = $element.find('.editable-div'),
                inputEle = $element.find('.editable-div .input-field input'),
                element = obj.grid.cells.getCellElement(obj.r, obj.c),
                left = $(element).offset().left;
              this.editTextfield = false;
              editContainer.css("left", this.hiddenDivVal);
              editContainer.css("top", -9 + obj.r * element.offsetHeight);
              this.config.changeDetectionMutation.setDashboardCardState();
              
            })
          }
    
        }, true);

      }

    }
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name) {
      if (!this.config.config.series.some(obj => obj.hasOwnProperty(DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER))) {
        this.config.config.series.forEach((item) => {
          item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
            item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = 0,
            item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0,
            item[DashboardConstants.UIMessageConstants.STRING_ESTPERCENTAMOUNT] = 0,
            item["isSelected"] = false
          this.highlightInactiveOppfinder(this.config.config.series);
        });

        setTimeout(() => {
          this.config.changeDetectionMutation.setDashboardCardState();
        }, 1000);
      }
      if(this.stepCount!==2){
      if (this.penaltyPercentage.Value > 0) {
        this.config.config.series.forEach((item) => {
          item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
            item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = Math.round(this.penaltyPercentage.Value * 0.01 * item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT])
        });
      }
    }
    }
    // Oppfinder InActive record highlight START
    flex.rows.map((_value: any, _key: any) => {
      if (_value.dataItem.ValidUpto) {
        _value.cssClass = "highlightInActiveRow";
      }
    });
  }

    if (this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag) {
      if (obj.filter.cellType === CellType.Cell) {
          if (flex.columns[obj.c].header === AnalyticsCommonConstants.FraudAnomalyCommonConstants.ActionColumn) {
              obj.cell.innerHTML = '<a>' + AnalyticsCommonConstants.FraudAnomalyCommonConstants.Investigate + '</a>';
  
              obj.cell.addEventListener('click', (e) => {
                  if (e.target.innerHTML == AnalyticsCommonConstants.FraudAnomalyCommonConstants.Investigate) {          
                    this.rowindex = obj.r;
                    this.CreateNewAnomaly(obj);
                  }
              }, true);
  
          }
      }
  }

    // Oppfinder InActive record highlight END
  }

  setIconForPtsn(obj:any)
  {
    this.isActiveKebabMenu = obj.cell.classList.contains("highlightInActiveRow") ? false : true; // Kebab menu checking for Oppfinder Active/InActive record
    if (!this.isActiveKebabMenu) {
      this.setActiveIconForPtsn(obj);
    } else {
      this.setInactiveIconForPtsn(obj);
    } 
  }
  setInactiveIconForPtsn(obj:any)
  {
    obj.cell.innerHTML="<a style='margin-left:8px' id='viewPTSN'> <i class='icon iconSmall'><svg id='viewDetails'> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_viewPaymentDetails'></use></svg></i></a>"+" "+" <a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg id='markAsInactive'> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_InactiveOpprtunity'></use></svg></i></a>";
  }

  setActiveIconForPtsn(obj:any)
  {
    obj.cell.innerHTML="<a style='margin-left:8px' id='viewPTSN'> <i class='icon iconSmall'><svg id='viewDetails'> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_viewPaymentDetails'></use></svg></i></a>"+" "+"<a style='margin-left:8px' class='dd_activator dropdown-button'> <i class='icon iconSmall'><svg id='markAsActive'> <use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon_forecast'></use></svg></i></a>";
  }

  flipActiveInactive(event:Event,obj:any)
  {    
    if(!this.isActiveKebabMenu){

      this.setActiveIconForPtsn(obj);
      this.onOppfinderGridStatusChange(event,0);
    }
    else{
      this.setInactiveIconForPtsn(obj);
      this.onOppfinderGridStatusChange(event,1);
    }
  }
   selectRowForPTSN(obj:any)
  {
    this.createOpportunityEvent = obj; 
    this.selectedPtsRow = this.config.config.series[obj.r];
    this.rowindex = obj.r;           
    this.config.changeDetectionMutation.setDashboardCardState();    
  }

  // This function is common for to calculate the savings on Flex grid on basis of value provided by user in the text field on grid.
  applyToAll() {
    this.editTextfieldest = true;
    if (this.validatePenaltyPercentage(this.penaltyPercentage.Value)) {
     let strat = this._dashboardCommService.oppFinderState.strategy.name ;
     switch(strat){
       case DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name:{this.calculateSrsSavings()}
       break
       case DashboardConstants.OpportunityFinderConstants.Strategies.TSA.name:{this.calculateTsaSavings()}
       break
       case DashboardConstants.OpportunityFinderConstants.Strategies.CONCO.name: {this.calculateConcoSavings()}
       break
       case DashboardConstants.OpportunityFinderConstants.Strategies.PONPO.name:{this.calculateConcoSavings()}
       break
     }
      this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
      this.config.changeDetectionMutation.setDashboardCardState();
    }
  }
  

  apply() {
    this.editTextfieldest = true;
    this.updateAddressableSpendRow();
    this.TotalEstimatedSavings = this.currencySign + this.calculateTotalEstimatedSavings() || 0;
    this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = this.currencySign + this.formatter.format(this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS]);
    this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
    this.config.changeDetectionMutation.setDashboardCardState();
  }
  applyCancel(){
    this.editTextfieldest = true;
      this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
      this.config.changeDetectionMutation.setDashboardCardState();
  }

  //This function is used to calculate savings on SRS grid once user click on apply all in estimated savings column
  calculateSrsSavings() {
    this.config.config.series.forEach((item) => {
      item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value;
      item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = Math.round((this.penaltyPercentage.Value * 0.01 * item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT]));
      this.TotalEstimatedSavings = this.currencySign + this.calculateTotalEstimatedSavings() || 0;
    });
  }

  //This function is used to calculate savings for Conco/Ponpo on grid once user click on apply all in estimated savings column
  calculateConcoSavings() {

    this.config.config.series.forEach((item) => {
      item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value,
        item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = this.formatter.format(((((95 - item[this.ComplianceRo.displayName].toFixed(0)) * item[this.SpendRO.displayName].toFixed(0)) * this.penaltyPercentage.Value) / 10000).toFixed(0))
      this.TotalEstimatedSavings = this.calculateTotalEstimatedSavings() || 0;
    });
  }

  validatePenaltyPercentage(addressableSpend) {
    if (addressableSpend > 100 || addressableSpend < 0 || addressableSpend == null) {
      this._commUtils.getMessageDialog(
        DashboardConstants.UIMessageConstants.STRING_PENALTY_PERCENT_MESSAGE, () => { });
      return false;
    } else {
      return true;
    }
  }

  updateAddressableSpendRow() {
    if (this.validatePenaltyPercentage(this.penaltyPercentage.Value)) {
      this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] = this.penaltyPercentage.Value;
      this._dashboardCommService.oppFinderState.strategy.name != DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name ?
        this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = ((((95 - this.config.config.series[this.rowindex][this.ComplianceRo.displayName].toFixed(0)) * this.config.config.series[this.rowindex][this.SpendRO.displayName]) * this.penaltyPercentage.Value) / 10000).toFixed(0) :
        this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = parseFloat((this.penaltyPercentage.Value * 0.01 * this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT]).toFixed(0))
      this.penaltyPercentage.Value = 0;
      this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
      this.config.changeDetectionMutation.setDashboardCardState();
    }
  }

  openPpvViewDetailsPopUp(){
    let ppvPopupViewConfig = {
      api: {},
      gridConfig: {},
      selectedRow: {},
      estimated_Savings: '',
      spend: ''
    }
    ppvPopupViewConfig.api = {
      // On click of cancel button in pop-up this will be called
      closePopup: () => {
        this.ppvViewDetailsPopupRef.detach();
        this.ppvViewDetailsPopupRef.clear();
      },
      // On click of create opportunity button in createNewOpportunity method will be called  
      createOpportunity: () => {
        this.TotalEstimatedSavings = ppvPopupViewConfig.estimated_Savings,
          this.totalSpend = ppvPopupViewConfig.spend,
          this.createNewOpportunity(this.rowindex);
        this.ppvViewDetailsPopupRef.detach();
        this.ppvViewDetailsPopupRef.clear()
      }
    },
      ppvPopupViewConfig.gridConfig = this.config;
    ppvPopupViewConfig.selectedRow = this.config.config.series[this.rowindex];
    this.config.changeDetectionMutation.setDashboardCardState();

    //Loading child component purchase-price-viewdetails-popup to show view details pop-up
    this.ppvViewDetailsPopupRef.createEmbeddedView(this.outletTemplateRef, {
      manifestPath: 'purchase-price-viewdetails-popup/purchase-price-viewdetails-popup',
      config: {
        config: ppvPopupViewConfig
      }
    });

    this.destoryTimeout = setTimeout(() => {	    this.destoryTimeout = setTimeout(() => {
           this.config.changeDetectionMutation.setDashboardCardState();	      this.config.changeDetectionMutation.setDashboardCardState();
         }, 500);	    }, 500);

  }

  assignSpend() {
    this.nextflag = true;
    this.stepCount = 1;
    document.getElementById('activeinactivedropdown').style.display = 'none';
    this.cardPagination.showPagination = false;
    if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
      this.config.changeDetectionMutation.setDashboardCardFooterState();
    }
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
    if (this._dashboardCommService.assignedRows.length > 0 && this.assignableSpend && Number(this.assignableSpend.replace(/[^0-9.-]+/g, "")) > 0 ) {
      this.assignSpendConfig.api = {
        closePopup: () => {
          this.closeAssignSRSPopup()
        },
        setState: () => {
          this.config.changeDetectionMutation.setDashboardCardState()
        }
      };
      this.assignSpendConfig.SelectedVAriables = this._dashboardCommService.assignedRows.filter(function (e) {
        return e.isSelected == true;
      });

      this.assignSpendConfig.Currency = this.currencySign;
      this.assignSpendConfig.SupplierName = this.SupplierAttrName;
      this.assignSpendConfig.TotalSpendDisplay = this.currencySign + this.assignableSpend;
      this.assignSpendConfig.TotalSpend = Number(this.assignableSpend.replace(/[^0-9.-]+/g, ""))
      this.supplierList = '';
      this._loaderService.showGlobalLoader();
      this.assignSpendPopUpRef.createEmbeddedView(this.outletTemplateRef, {

        manifestPath: 'assign-spend-popup/assign-spend-popup',
        config: {
          config: this.assignSpendConfig
        }
      });
      this._loaderService.hideGlobalLoader();
      setTimeout(() => {
        this.config.changeDetectionMutation.setDashboardCardState();
      }, 500);
    } else {
      this.nextflag = false;
      this.cardPagination.showPagination = true;
      this.stepCount--;
      document.getElementById('activeinactivedropdown').style.display = 'inline';
      this._commUtils.getMessageDialog(
        DashboardConstants.UIMessageConstants.STRING_SHOW_SELECT_ROW_MISSING,
        () => { },
        DashboardConstants.OpportunityFinderConstants.STRING_ERROR);
    }
  }

  //Open PTSN popup on click of payment term

  async paymentTermClick() {
    if (this.selectedPtsRow) {
      //setting css property dynamically
      // let  popUpClass = document.getElementsByClassName("");
      await this.setPaymentTermGridConfig(this.config, this.rowindex);
      this.ptsPopUpConfig.api = {
        closePopup: () => {
          this.paymentTermPopUpRef.detach();
          this.paymentTermPopUpRef.clear();
        },
        createOpportuity: () => {
          this.TotalEstimatedSavings = this.ptsPopUpConfig.ESTIMATED_SAVINGS

          this.totalSpend = this.formatter.format(this.ptsPopUpConfig.Spend.toFixed(0));
          //Adding these details to show in Create opportunity popup automatically.
          this.supplierList = this.ptsPopUpConfig.SupplierName;
          this.createdOppAdditionalDetails['Selected Payment Term'] = this.ptsPopUpConfig.AdditionalDetails.SelectedPaymentTerm;
          this.createdOppAdditionalDetails['Cost Of Capital'] = this.ptsPopUpConfig.AdditionalDetails.CostOfCapital + '%';
          this.createNewOpportunity(this.rowindex);
          this.selectedPtsRow = undefined;
          this.paymentTermPopUpRef.detach();
          this.paymentTermPopUpRef.clear();


        },
        setState: () => {
          this.config.changeDetectionMutation.setDashboardCardState()
        }
      };
      this.ptsPopUpConfig.RowNumber = this.rowindex;
      this.ptsPopUpConfig.Currency = this.currencySign;
      this.ptsPopUpConfig.DrillDriveFilters = this.drillDriveFilters;
      this.ptsPopUpConfig.GlobalFilters = this.globalFilters;
      this.ptsPopUpConfig.ParentGridConfig = this.config;
      this.ptsPopUpConfig.Supplier = this.selectedPtsRow;
      this.ptsPopUpConfig.SupplierName = this.config.config.series[this.rowindex][this.SupplierId.displayName];
      this.ptsPopUpConfig.ESTIMATED_SAVINGS = this.TotalEstimatedSavings,
        this.ptsPopUpConfig.ColumnNames = { Spend: this.ptsSpendRO.displayName, PaymentTermNew: this.PaymentTermNewReportObjectId[0].reportObjectName }
      this.ptsPopUpConfig.Spend = this.totalSpend,
        this.ptsPopUpConfig.AdditionalDetails = { SelectedPaymentTerm: '', CostOfCapital: 0 },
        this.ptsPopUpConfig.gridConfig = this.flexPtsGridConfig;
        this.ptsPopUpConfig.gridConfig.frozenColumns=3;
      this.ptsPopUpConfig.CustonDataForPaymentTerms = this.widget;
      this.ptsPopUpConfig.maxPaymentTerm=maxBy(this.widget.customDataForPayTerm.daxData,(o)=>{return o["Payment Term"]})
      //renaming the column name to maximumn supplier if the maximum payment term exist in the existing columns.
      let columnNoOfMaxPaymentTerm=findIndex(this.ptsPopUpConfig.gridConfig.column,{"binding":this.ptsPopUpConfig.maxPaymentTerm["Payment Term Name"]});
      if (columnNoOfMaxPaymentTerm>0) {
        this.ptsPopUpConfig.gridConfig.column[columnNoOfMaxPaymentTerm].header=this.ptsPopUpConfig.gridConfig.column[columnNoOfMaxPaymentTerm].binding+"("+"Max by Supplier"+")";
      }
      this.config.changeDetectionMutation.setDashboardCardState();


      this.paymentTermPopUpRef.createEmbeddedView(this.outletTemplateRef, {

        manifestPath: 'payment-term-rationalization-popup/payment-term-rationalization-popup',
        config: {
          config: this.ptsPopUpConfig
        }
      });
      setTimeout(() => {
        this.config.changeDetectionMutation.setDashboardCardState();
      }, 500);
      /*  this._loaderService.hideGlobalLoader();
      
  */
    }
    else {
      this._commUtils.getMessageDialog(
        DashboardConstants.UIMessageConstants.STRING_SELECTPAYMENTTERM_MESSAGE
        , () => { },
        DashboardConstants.OpportunityFinderConstants.STRING_ERROR);
    }


  }

  //Adding this function to push Drill / Drive filters into the lstFilterReportObject if any.
  countPopUpFilterCreation() {
    let lstFilterReportObject = [];

    let filterValue = "";
    let reportObjId: any;
    let filterFormattedValue = [];
    this._dashboardCommService.filterObjectHierarchyList.forEach((itemFilter) => {

      for (let filter of itemFilter.FilterObjects) {
        filterValue = filter.FilterValue[0];
        reportObjId = filter.ReportObjectID;
        let reportObject = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (reportObject) => {
          return reportObject.ReportObjectId.toLowerCase() == reportObjId.toLowerCase();
        });
        let formattedFilter = AnalyticsUtilsService.GetFormattedFilterValue(reportObject, filterValue);
        lstFilterReportObject.push(
          AnalyticsUtilsService.createDrillDriveFilterReportObj(
            { reportObject: reportObject, filterValue: formattedFilter[0], filterIdentifier: DashboardConstants.FilterIdentifierType.DriveFilter }
          )
        );
      }

    })
    this.drillDriveFilters = lstFilterReportObject;
    return lstFilterReportObject;
  }


  public async setPaymentTermGridConfig(config, rowNumber) {
    this._loaderService.showGlobalLoader();
    return new Promise((resolve, reject) => {
      const PaymentTermPopupConfig: any = {
        reportDetails: undefined,
        api: {},
      }

      let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });


      if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
        masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
      }

      this.widgetConf = find(masterData.AdditionalProps,
        (prop) => {
          return prop.ReportDetailsObjectId.toLowerCase() === config.reportDetails.reportDetailObjectId.toLowerCase()
        });

      let countReportId = this.widgetConf.PaymentTermReportObjectID.toLowerCase();

      let L1Category = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.L1CategoryReportObjectId.toLowerCase();
      });

      this.SupplierId = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SupplierReportObjectId.toLowerCase();
      });

      this.ptsSpendRO = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SpendReportObjectID.toLowerCase();
      });

      let regionCategory = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.widgetConf.RegionReportId.toLowerCase();
      });


      this.loadDataByReportObjectId(countReportId).then((reportDetailsForCreateOpp: any) => {
        PaymentTermPopupConfig.reportDetails = reportDetailsForCreateOpp;
        let supplierFilter = AnalyticsUtilsService.GetFormattedFilterValue(config.reportDetails.lstReportObjectOnRow, config.config.series[rowNumber][this.SupplierId.displayName]);
        PaymentTermPopupConfig.reportDetails.lstFilterReportObject.push(
          AnalyticsUtilsService.createDrillDriveFilterReportObj(
            { reportObject: this.SupplierId, filterValue: supplierFilter[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
          )
        );


        if (this._dashboardCommService.filterObjectHierarchyList.length > 0) {
          this.countPopUpFilterCreation().forEach((itemFilter) => {
            PaymentTermPopupConfig.reportDetails.lstFilterReportObject.push(itemFilter)
          })
        }
        //This will check whether global filters are applied before opening the pop up and push them if applied in lstfilter object
        if (this._dashboardCommService.appliedFilters.length > 0) {
          let globalFilter = this.applyGlobalFilters(PaymentTermPopupConfig.reportDetails)
          globalFilter.forEach((item) => {
            PaymentTermPopupConfig.reportDetails.lstFilterReportObject.push(this._commUtil.getDeReferencedObject(item))
          })
        }

        let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(PaymentTermPopupConfig.reportDetails);


        reportDetailsMetaData.isGrandTotalRequired = false;
        reportDetailsMetaData.isSubTotalRequired = false;
        reportDetailsMetaData.lstFilterReportObject.forEach(item => {
          if (typeof item.filterValue === 'string')
            item.filterValue = JSON.parse(item.filterValue);
        })
        this.paymentTermreportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);

        this.PaymentTermNewReportObjectId = this.paymentTermreportDetailsData.lstReportObject.filter(e => e.reportObjectId.toLowerCase() == masterData.AdditionalProps[0].PaymentTermNewReportObjectId.toLowerCase())

        this.manageSubscription$.add(
          this._analyticsCommonDataService.generateReport(this.paymentTermreportDetailsData)
            .subscribe(async (response) => {
              if (response != undefined
                && response.Data != null
                && response.Data.length > 0
                && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
                let daxData = JSON.stringify(response.Data);
                this.widget = Object.assign({}, (response.Data));
                this.widget.customDataForPayTerm = {};
                this.widget.customDataForPayTerm.daxData = JSON.parse(daxData);
                this.widget.customDataForPayTerm.paymentTermAdditionalProps = this.widgetConf;
                this.flexPtsGridConfig = Object.assign({}, this.config.config);
                this.flexPtsGridConfig.frozenColumns=3;
                this.flexPtsGridConfig.alternatingRowStep=1;
                this.flexPtsGridConfig.series = await this.getPaymentGridData(response.Data, this.config);
                PaymentTermPopupConfig.columns = await this.getGridColumns();
                resolve(PaymentTermPopupConfig);

              }

              resolve(response);
            }, (error) => {
              this._commUtils.getMessageDialog(
                `Status:${error.status}  Something Went wrong with ${error.message}`
                , () => { });
            })
        );


      })

    })
  }

  loadDataByReportObjectId(reportId) {
    return new Promise((resolve, reject) => {
      this._analyticsCommonDataService.getReportDetailsByReportId(reportId)
        .toPromise()
        .then((response) => {
          if (response != undefined
            && response != null
            && response.toString().toLowerCase() !== "error".toLowerCase()) {
          }
          resolve(this._commUtil.toCamelWrapper(response));
        })

    })
  }

  // Function to add global filters into List of filtered report objects.
  // This is common for all oppfinders 
  applyGlobalFilters(lstReportObject) {

    var lstFilterReportObject = [];

    each(this._dashboardCommService.appliedFilters, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {

      //Code is Written for the Multiselect Filters

      if (
        _appliedfilterValues.FilterType === DashboardConstants.FilterType.MultiSelect ||
        _appliedfilterValues.FilterType === DashboardConstants.FilterType.Date ||
        _appliedfilterValues.FilterType === DashboardConstants.FilterType.Year
      ) {

        //Getting the Filter Selected Values for the All the Applied Filter Objects
        let listFilterValues: any = [];
        let Operators: number
        if (!(this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType))) {
          Operators = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ? DashboardConstants.ReportObjectOperators.Is : _appliedfilterValues.FilterConditionOperator.op;
        }
        let FilterBy: number = _appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection ? DashboardConstants.FilterBy.FilterBySelection : DashboardConstants.FilterBy.FilterByCondition;
        if (!(this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType))) {
          if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            if (_appliedfilterValues.SelectAll && _appliedfilterValues.IsSelectAll) {
              // Sending -1 when user has selected all with
              listFilterValues.push(DashboardConstants.DAXQueryManipulate.AllRecords);
            }
            else {
              _appliedfilterValues.selectedFilterList.filter((_selAppliedFilter: IFilterList) => {
                if (_selAppliedFilter.IsSelected) {
                  listFilterValues.push(_selAppliedFilter.title);
                }
              });
            }
          }
          else {
            // Will split the Values only for the In and Not In Values Otherwise Not.
            if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.In || _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.NotIn) {
              listFilterValues = _appliedfilterValues.FilterConditionText.value.split(';');
              listFilterValues = listFilterValues.length > 1 ? listFilterValues.slice(0, listFilterValues.length - 1) : listFilterValues;
            }
            else {
              if (_appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsEmpty ||
                _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotEmpty ||
                _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNull ||
                _appliedfilterValues.FilterConditionOperator.op === AnalyticsCommonConstants.ReportObjectOperators.IsNotNull) {
                listFilterValues.push("");
              } else {
                listFilterValues.push(_appliedfilterValues.FilterConditionText.value);
              }
            }
          }
        }
        //Check if it is Date Period Filter
        if (_appliedfilterValues.FilterType === DashboardConstants.FilterType.Date) {
          //check if Period Filter By Dynamic Period. 
          if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.FilterRadioOperator.field.op;
            if (DashboardConstants.ReportObjectOperators.From_DateTillToday != _appliedfilterValues.FilterRadioOperator.field.op) {
              listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
            }
            else {
              listFilterValues.push.apply(listFilterValues, [new Date(_appliedfilterValues.FilterConditionValue.toString()).getFullYear().toString(),
              (new Date(_appliedfilterValues.FilterConditionValue.toString()).getMonth() + 1).toString(), new Date(_appliedfilterValues.FilterConditionValue.toString()).getDate().toString()]);
            }
          }
          //Check if Period Filter By Condition
          if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is not Between condition
            if (_appliedfilterValues.FilterConditionOperator.op != DashboardConstants.ReportObjectOperators.Between) {
              listFilterValues.push(this._commUtil.getPeriodDateValue(_appliedfilterValues.FilterConditionValue));
            }
            else {
              listFilterValues.push(this._commUtil.getPeriodDateValue(_appliedfilterValues.FilterConditionRangeValue.from));
              listFilterValues.push(this._commUtil.getPeriodDateValue(_appliedfilterValues.FilterConditionRangeValue.to));
            }
          }
        }
        //Check if it is Year PEriod Filter
        else if (this._commUtil.isPeriodFilter(_appliedfilterValues.FilterType) && _appliedfilterValues.FilterType === DashboardConstants.FilterType.Year) {
          if (_appliedfilterValues.FilterBy === DashboardConstants.FilterBy.FilterByCondition) {
            Operators = _appliedfilterValues.FilterConditionOperator.op;
            //If it is 'IS' or 'IS NOT' Condition
            if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Is || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.IsNot) {
              listFilterValues = filter(mapValues(_appliedfilterValues.FilterConditionValue, 'name'), (value, index) => {
                return value;
              });
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Between) {
              listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.from);
              listFilterValues.push(_appliedfilterValues.FilterConditionRangeValue.to);
            }
            else if (_appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.Before || _appliedfilterValues.FilterConditionOperator.op === DashboardConstants.ReportObjectOperators.After) {
              listFilterValues.push(_appliedfilterValues.FilterConditionValue);
            }
          }
          else if (_appliedfilterValues.FilterBy == DashboardConstants.FilterBy.FilterBySelection) {
            Operators = _appliedfilterValues.YearModel.field.op;
            listFilterValues.push(_appliedfilterValues.FilterConditionValue.toString());
          }
        }


        if (listFilterValues.length > 0) {

          /**
           *  Creating the Filter Report Object For the Loaded Widget.
           *
           */

          lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(lstFilterReportObject,
            this._commUtil.createFilterReportObject(
              _appliedfilterValues, false, lstReportObject, Operators, FilterBy, listFilterValues,
              DashboardConstants.ModuleType.DASHBOARD,
              DashboardConstants.ViewFilterType.SingleSource
            ), new SavedFilter);

        }
      }
    });
    this.globalFilters = lstFilterReportObject;
    return lstFilterReportObject;

  }
  async getPaymentGridData(_reportDetails: any, _config: any) {
    let TargetPaymentTerm = this.widgetConf.TargetPaymentTerms,
      TargetPaymentTermName = (Object.getOwnPropertyNames(TargetPaymentTerm[0])),
      MetricName = this.ptsSpendRO.displayName;
    for (let i = 0; i < _reportDetails.length; i++) {
      _reportDetails[i][DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND] = this.widgetConf.AdjustableSpend;
      for (let k = 0; k < TargetPaymentTerm.length; k++) {
        if (TargetPaymentTerm[k] != undefined && _reportDetails[i] != undefined)
          _reportDetails[i][TargetPaymentTerm[k][TargetPaymentTermName[0]]] = this.CalcualtePaymentTerm(TargetPaymentTerm[k][TargetPaymentTermName[1]], _reportDetails[i][TargetPaymentTermName[1]], _reportDetails[i][MetricName], _reportDetails[i][DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND], this.widgetConf.CostOfCapital);
      }
    }
    return _reportDetails;
  }

  CalcualtePaymentTerm(TargetPayTerm, ActualPayTerm, Spend, AdjSpend, CostOfCapital) {
    var output = (((TargetPayTerm - ActualPayTerm) / 365) * (CostOfCapital / 100) * Spend * AdjSpend);
    return output;
  }

  async getGridColumns() {

    return new Promise((resolve, reject) => {
      const purchasePricePopupConfig: any = {
        reportDetails: undefined,
        api: {},
      }

      let keys = [],
        keyLength = keys.length,
        columns = []

      //Adding the Report RO Objects from DAX Query Result to Keys.

      this.getOppfinderCurrencySign().then((oppfinderCurrencySign: any) => {
        keys = this.getSortedColumnInfo(this.config.reportDetails);
        if (keys != undefined) {
          keyLength = keys.length;
          if (true) {
            for (let i = 0; i < keyLength; i++) {
              let isVisible = true;
              let readOnly = true;
              let width = "*";
              let aggregateType;
              let currency;
              let header;
              let payterm = _map(this.widget.customDataForPayTerm.paymentTermAdditionalProps.TargetPaymentTerms, 'Payment Term Name -New');
              if (keys[i] == this.ptsSpendRO.displayName || payterm.indexOf(keys[i]) > -1) {
                aggregateType = DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_SUM._value;
                currency = 'C' + oppfinderCurrencySign.currencySign;
              }
              else if (keys[i] == [DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND]) {
                currency = 'P' + '%';
              }
              else {
                header = keys[i];
              }

              let _addingWijmoColumns: any = {
                header: header,
                binding: keys[i],
                visible: isVisible,
                isReadOnly: readOnly,
                width: width,
                aggregate: aggregateType || DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_NONE._value,
                format: currency || ''
              }
              //Adding the Scrollbar If the Column Size is Greater than 8
              if (keyLength > 8) {
                delete _addingWijmoColumns["width"];
              }
              columns.push(_addingWijmoColumns);
            }
            this.flexPtsGridConfig.column = columns;

          }
        }
        resolve(columns);
      });

    });
  }

  private getSortedColumnInfo(mainOpportunityFinderObjectInfo: any): Array<string> {
    if (mainOpportunityFinderObjectInfo != undefined) {
      let keys: Array<string> = [];

      // Pushing value key first
      if (mainOpportunityFinderObjectInfo.lstReportObjectOnValue != undefined && mainOpportunityFinderObjectInfo.lstReportObjectOnValue.length > 0) {
        keys.push(this.ptsSpendRO.displayName)
      }

      keys.push(DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND);

      //Pushing row key 
      if (mainOpportunityFinderObjectInfo.lstReportObjectOnValue != undefined && mainOpportunityFinderObjectInfo.lstReportObjectOnValue.length > 0) {
        keys.push(this.PaymentTermNewReportObjectId[0].reportObjectName)
      }

      //Pushing all the targeted payment terms
      this.widget.customDataForPayTerm.paymentTermAdditionalProps.TargetPaymentTerms.forEach((_values: any, _keys: any) => {
        keys.push(_values["Payment Term Name -New"]);
      });


      return keys;
    }
  }

  getOppfinderCurrencySign() {

    return new Promise((resolve, reject) => {
      this._oppFinderService.getOpportunityFinderCurrencySign()
        .toPromise()
        .then((response) => {
          if (response != undefined
            && response != null
            && response.toString().toLowerCase() !== "error".toLowerCase()) {
            this.currencySign = response.CurrencySign
            this.config.changeDetectionMutation.setDashboardCardState();

          }
          resolve(this._commUtil.toCamelWrapper(response));
        })

    })

  }


  setSupplierName() {

    let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, {
      OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name
    });
    let widgetConf: any = this.config.reportDetails.lstReportObjectOnRow.filter(e => e.reportObjectId.toLowerCase() == masterData.AdditionalProps[0].SupplierNormalizedId.toLowerCase())
    this.SupplierAttrName = widgetConf[0].reportObjectName

    let spendReportObject = this.config.reportDetails.lstReportObjectOnValue.filter(e => e.reportObjectId.toLowerCase() == masterData.AdditionalProps[0].SpendUSDObjectId.toLowerCase())
    this.ptsSpendRO = spendReportObject[0].reportObjectName
  }

  closeAssignSRSPopup() {
    this.nextflag = false;
    this.stepCount = 2;
    document.getElementById('activeinactivedropdown').style.display = 'none';
    this.cardPagination.showPagination = false;
    if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
      this.config.changeDetectionMutation.setDashboardCardFooterState();
    }
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
    this.assignSpendPopUpRef.detach();
    this.assignSpendPopUpRef.clear();

   // Removing the some columns and adding the new columns as required by the final grid
   if(this.config.config.column[0].header === ""){
    this.config.config.column.shift();
  }
  for(var i=0;i<2;i++){
    this.config.config.column.pop();
  }
   this.config.config.series = this.assignSpendConfig.SelectedVAriables;
   this.config.config.column.push({
      aggregate: 0,
      binding: DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER,
      format: undefined,
      header: DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER,
      isReadOnly: true,
      visible: true,
      allowSorting: false,
      width: 134,
      minWidth: 134
    });
    this.config.config.column.push({
      aggregate: 0,
      binding: DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS,
      format: undefined,
      header: DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS,
      isReadOnly: true,
      visible: true,
      allowSorting: false,
      width: 134,
      minWidth: 134
    });

    this.config.config.series.forEach((item) => {
      item[DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS] = (item[DashboardConstants.UIMessageConstants.STRING_ESTSAVING_PER] * 0.01 * item[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT]).toFixed(0);
    });
    var highest = this.assignSpendConfig.SelectedVAriables[Object.keys(this.assignSpendConfig.SelectedVAriables).sort().pop()];
    this.assignSpendConfig.SelectedVAriables.forEach(item => {
      if (item[this.SupplierAttrName] != highest[this.SupplierAttrName]) {
        this.supplierList = this.supplierList.concat(item[this.SupplierAttrName] + ' , ')
      }
      else {
        this.supplierList = this.supplierList.concat(item[this.SupplierAttrName])
      }
    });
    this.createdOppAdditionalDetails['Assigned Spend'] = this.currencySign + this.assignableSpend;


    setTimeout(() => {
      this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
      this.TotalEstimatedSavings = this.currencySign + this.calculateTotalEstimatedSavings() || 0;
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
  }

  calculateTotalEstimatedSavings() {
    var spend = 0;

    for (var i = 0; i < this.config.config.series.length; i++) {

      spend += parseFloat(this.config.config.series[i][DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS].toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''))
    }

    return this.formatter.format(spend.toFixed(0));
  }

  calculateAssignableSpend() {
    var assignableSpend = 0;
    if(this._dashboardCommService.oppFinderState.strategy.shortName===DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.shortName)
    {
      for (var i = 0; i < this._dashboardCommService.assignedRows.length; i++) {
      
          assignableSpend += parseFloat(this._dashboardCommService.assignedRows[i][this.ptsSpendRO])
        
      }
      assignableSpend = Math.abs(Number(this.totalSpend.replace(/[^0-9.-]+/g, "")) - assignableSpend);
    }
    else{
    for (var i = 0; i < this.config.config.series.length; i++) {
      if (this.config.config.series[i].isSelected == true) {
        assignableSpend += parseFloat(this.config.config.series[i][this.ptsSpendRO])
      }
    }
    assignableSpend = Math.abs(Number(this.totalSpend.replace(/[^0-9.-]+/g, "")) - assignableSpend);
  }
    return assignableSpend;

  }

  createDetailsPopUp(obj, countDesc,row) {
    setTimeout(() => {
      this.config.subscriptions.next({
        actionId: DashboardConstants.EventType.Selection,
        cardId: this.config.cardId,
        event: obj,
        config: this.config,
        rowNumber: row,
        cardDescription: countDesc
      });
    }, 1000)
  };

  //This method is created to set up configuration for additional properties for CONCO and PONPO
  createNewOpportunityForPonpo() {
    let RegionRO = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => {
      return reportObject.reportObjectId.toLowerCase() == this.widgetConf.RegionReportId.toLowerCase();
    });

    this.totalSpend = this.formatter.format((this.config.config.series[this.rowindex][this.SpendRO.displayName]).toFixed(0));
    this.TotalEstimatedSavings = this.currencySign + (this.config.config.series[this.rowindex][DashboardConstants.UIMessageConstants.STRING_ESTIMATED_SAVINGS]);
    this.createdOppAdditionalDetails.Region = this.config.config.series[this.rowindex][RegionRO.reportObjectName];
    this.createdOppAdditionalDetails['Non Compliant %'] = (this.config.config.series[this.rowindex][this.NonComplianceRo.displayName]).toFixed(0);
    this.createNewOpportunity(this.createOpportunityEvent)
  }

  // Generic mathod to create New opportuity for all the oppfinders.
  createNewOpportunity(event) {
    this.createdOppAdditionalDetails.Savings = this.TotalEstimatedSavings;
    this.createdOppAdditionalDetails.Spend = this.currencySign + this.totalSpend;
    this.createdOppAdditionalDetails.Hierarchy = this.gridMessage;
    if (this.supplierList.length > 0) {
      this.createdOppAdditionalDetails['Suppliers'] = this.supplierList;
    }
    this.config.config.series.unshift(
      this.createdOppAdditionalDetails);
    this.config.savings = (this.TotalEstimatedSavings) ? Number(this.TotalEstimatedSavings.replace(/[^0-9.-]+/g, "")) : 0;
    this.config.assignableSpend = (this.totalSpend) ? Number(this.totalSpend.toString().replace(/[^0-9.-]+/g, "")) : 0;
    this.config.subscriptions.next({
      actionId: 'Selection',
      cardId: this.config.cardId,
      event: this.createOpportunityEvent,
      config: this.config
    });
    this.config.config.series.shift();

  }


  // Create Opportunity from Olap grid 

  olapCreateOpportunity(tailSpendConfig){
    this.supplierList = [];
    this.totalSpend=0;
    this.transactionCount = 0;
    this.TotalEstimatedSavings = 0;
    for (var i = 0; i < tailSpendConfig.series.length; i++) {
      if (tailSpendConfig.series[i].isSelected == true) {
        this.totalSpend += parseFloat(tailSpendConfig.series[i]['Spend'])
        this.supplierList.push(tailSpendConfig.series[i]['Supplier'])
        this.transactionCount += parseFloat(tailSpendConfig.series[i]['Transaction Count'])
      }
    }
    this.TotalEstimatedSavings =  (this.totalSpend * .03)
    this.createdOppAdditionalDetails.Savings = this.currencySign + this.TotalEstimatedSavings.toFixed(0);
    this.createdOppAdditionalDetails.Spend = this.currencySign + this.totalSpend.toFixed(0);
    this.createdOppAdditionalDetails.SupplierCount = this.supplierList.length.toFixed(0); 
    this.createdOppAdditionalDetails.Hierarchy = this.gridMessage;
    this.createdOppAdditionalDetails.Suppliers = this.supplierList ;
    this.createdOppAdditionalDetails.TransactionCount = this.transactionCount.toFixed(0);
    this.createdOppAdditionalDetails.Hierarchy = this.gridMessage;
    this.config.config.series= [this.createdOppAdditionalDetails];
    this.config.savings = this.TotalEstimatedSavings
    this.config.assignableSpend = this.totalSpend;
    this.config.subscriptions.next({
      actionId: 'Selection',
      cardId: this.config.cardId,
      event: this.createOpportunityEvent,
      config: this.config
    });
  }


  public setState() {
    this._changeDetection.markForCheck();
  }

  public onDocumentClick(event): void {
    if(this.flexFlag){
    let element = this._elementRef.nativeElement;
    let hiddenele = "";
    let editContainer: any;
    editContainer = element.querySelector('.editable-div')
    if (!editContainer.contains(event.target)) {
      if (this.rowindex != undefined && this.editTextfield === false) {
        this.editTextfield = true;
      }
    }
    editContainer = element.querySelector('.editable-div_estspend')
    if (!editContainer.contains(event.target)) {
      if (this.rowindex != undefined && this.editTextfieldest === false) {
        this.editTextfieldest = true;
      }
    }
  }
  }

    // Create Opportunity from Olap grid 

    olapPpvCreateOpportunity(spend,saving){
      this.createdOppAdditionalDetails.Savings = this.currencySign + saving.toFixed(0);
      this.createdOppAdditionalDetails.Spend = this.currencySign + spend.toFixed(0);
      this.createdOppAdditionalDetails.Hierarchy = this.gridMessage;
      this.config.config.series= [this.createdOppAdditionalDetails];
      this.config.savings = saving
      this.config.assignableSpend = spend;
      this.config.subscriptions.next({
        actionId: 'Selection',
        cardId: this.config.cardId,
        event: this.createOpportunityEvent,
        config: this.config
      });
    }

  /// Oppfinder Active/InActive Status Events START
  onOppfinderStatusDropDownChange(evt) {
    if(this.ddlOppfinderStatusSelected.value.Id === 0){
      this.ddlOppfinderStatusSelected.value.Id = 1;
    }
    else{
      this.ddlOppfinderStatusSelected.value.Id = 0;
    }
    if (!evt.currentTarget.checked) {
      this.cardPagination.showPagination = true;
      this.setGridMessage();
      this.config.config.gridAPI.updateFlexGrid(this.oppFinderMasterSeries);
    }
    else {
      this.cardPagination.showPagination = false;
      this.gridMessage = "All Categories across All regions";
      this.config.config.gridAPI.updateFlexGrid(this.oppFinderMasterInactiveJsonArray ? this.oppFinderMasterInactiveJsonArray : []);
    }
    if (this.config.changeDetectionMutation.setDashboardCardFooterState) {
      this.config.changeDetectionMutation.setDashboardCardFooterState();
    }
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
  }

  onOppfinderGridStatusChange(event, statusId) {
    event.stopPropagation();
    if (statusId == 1) {
      this._loaderService.showGlobalLoader();
      this.oppfinderStatusPopupRef.detach();
      this.oppfinderStatusPopupRef.clear();
      this.oppfinderStatusPopupRef.createEmbeddedView(this.outletTemplateRef, {
        manifestPath: 'oppfinder-status-popup/oppfinder-status-popup',
        config: {
          config: {
            api: {
              closePopup: () => { this.closeOppfinderStatusPopup(); },
              donePopup: (data) => { this.oppfinderMarkAsInActive(data); }
            },
            config: this.config
          }
        }
      });
      this._loaderService.hideGlobalLoader();
      setTimeout(() => {
        this.config.changeDetectionMutation.setDashboardCardState();
      }, 500);
    }
    else {
      this.oppfinderMarkAsActive(this.ddlOppfinderStatusSelected.value.Id);
    }
  }

  closeOppfinderStatusPopup() {
    this.oppfinderStatusPopupRef.detach();
    this.oppfinderStatusPopupRef.clear();
  }

  oppfinderMarkAsInActive(popupData) {
    this._loaderService.showGlobalLoader();
    var currentDate = new Date();
    let validUpTo: any;
    if (popupData.ddlSelect.Id == 0) {
      validUpTo = new Date(currentDate.setDate(currentDate.getDate() + popupData.numOfDays)).toLocaleDateString();
    }
    else if (popupData.ddlSelect.Id == 1) {
      validUpTo = new Date(currentDate.setDate(currentDate.getDate() + (popupData.numOfDays * 7))).toLocaleDateString();
    }
    else {
      validUpTo = new Date(currentDate.setMonth(currentDate.getMonth() + popupData.numOfDays)).toLocaleDateString();
    }
    this.oppFinderMasterSeries[this.rowindex][DashboardConstants.UIMessageConstants.STRING_VALIDUPTO] = validUpTo;
    this.oppFinderMasterSeries[this.rowindex][DashboardConstants.UIMessageConstants.STRING_COMMENT] = popupData.Comment;
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.SRSN.name) {
      this.oppFinderMasterSeries[this.rowindex]["isSelected"] = false
    }
    delete this.oppFinderMasterSeries[this.rowindex]._id;
    this.gridInactiveOppfinderArray = [];
    if (this.oppFinderMasterInactiveJsonArray) {
      this.gridInactiveOppfinderArray = this._commUtil.getDeReferencedObject(this.oppFinderMasterInactiveJsonArray);
    }
    this.gridInactiveOppfinderArray.push(this.oppFinderMasterSeries[this.rowindex]);
    this.opportunityFinderTypeMaster.InactiveOpportunitiesJson = JSON.stringify(this.gridInactiveOppfinderArray);
    this.saveOppFinderStatus(this.opportunityFinderTypeMaster, 1);
  }

  oppfinderMarkAsActive(statusId) {
    this.gridInactiveOppfinderArray = [];
    this.gridInactiveOppfinderArray = this._commUtil.getDeReferencedObject(this.oppFinderMasterInactiveJsonArray);
    if (statusId == 1) {
      this.oppfinderDeleteIndex = findIndex(this.oppFinderMasterSeries, this.gridInactiveOppfinderArray[this.rowindex]);
      this.gridInactiveOppfinderArray.splice(this.rowindex, 1);
    }
    else {
      delete this.oppFinderMasterSeries[this.rowindex]["_id"];
      this.oppfinderDeleteIndex = findIndex(this.gridInactiveOppfinderArray, this.oppFinderMasterSeries[this.rowindex]);
      this.gridInactiveOppfinderArray.splice(this.oppfinderDeleteIndex, 1);
    }
    this.opportunityFinderTypeMaster.InactiveOpportunitiesJson = JSON.stringify(this.gridInactiveOppfinderArray);
    this.saveOppFinderStatus(this.opportunityFinderTypeMaster, 0);
  }



  saveOppFinderStatus(opportunityFinderTypeMaster, statusId) {
    this._oppFinderService.saveOpportunityFinderStatusDetails(opportunityFinderTypeMaster)
      .toPromise()
      .then((response) => {
        if (response && response != 'error') {

          this.oppFinderMasterInactiveJsonArray = this.gridInactiveOppfinderArray;

          if (statusId == 0) {
            if (this.ddlOppfinderStatusSelected.value.Id == 0) {
              delete this.oppFinderMasterSeries[this.rowindex][DashboardConstants.UIMessageConstants.STRING_VALIDUPTO];
              delete this.oppFinderMasterSeries[this.rowindex][DashboardConstants.UIMessageConstants.STRING_COMMENT];
            }
            else {
              if (this.oppfinderDeleteIndex != -1) {
                delete this.oppFinderMasterSeries[this.oppfinderDeleteIndex][DashboardConstants.UIMessageConstants.STRING_VALIDUPTO];
                delete this.oppFinderMasterSeries[this.oppfinderDeleteIndex][DashboardConstants.UIMessageConstants.STRING_COMMENT];
              }
            }
          }

          if (this.ddlOppfinderStatusSelected.value.Id == 0) {
            this.config.config.gridAPI.updateFlexGrid(this._commUtil.getDeReferencedObject(this.oppFinderMasterSeries));

          }
          else {
            this.config.config.gridAPI.updateFlexGrid(this._commUtil.getDeReferencedObject(this.oppFinderMasterInactiveJsonArray));
          }
          this.closeOppfinderStatusPopup();
          this._commUtil.getMessageDialog(statusId == 0 ? DashboardConstants.UIMessageConstants.STRING_OPPFINDER_STATUS_ACTIVE_SAVE_SUCCESS : DashboardConstants.UIMessageConstants.STRING_OPPFINDER_STATUS_INACTIVE_SAVE_SUCCESS, () => { },
            DashboardConstants.OpportunityFinderConstants.STRING_SUCCESS);
        }
        else {
          this.opportunityFinderTypeMaster.InactiveOpportunitiesJson = JSON.stringify(this.oppFinderMasterInactiveJsonArray);
          if (this.ddlOppfinderStatusSelected.value.Id == 0) {
            delete this.oppFinderMasterSeries[this.rowindex][DashboardConstants.UIMessageConstants.STRING_VALIDUPTO];
            delete this.oppFinderMasterSeries[this.rowindex][DashboardConstants.UIMessageConstants.STRING_COMMENT];
          }

          this._commUtil.getMessageDialog(
            DashboardConstants.UIMessageConstants.STRING_OPPFINDER_STATUS_SAVE_ERROR
            , () => { },
            DashboardConstants.OpportunityFinderConstants.STRING_ERROR
          )
        }
      });
    this._loaderService.hideGlobalLoader();
  }

// Determine the function of back button according to the step on which user is
backBtnClick(){
  switch(this.stepCount){
    case 0:
      break;
    case 1:
      this.assignSpendPopUpRef.detach();
    this.assignSpendPopUpRef.clear();
    this.nextflag = false;
    this.createDataForGrid();  
      break;
    case 2:
      this.stepCount = 1;
      this.assignSpend();
      break;
    default:
      break;
  }
}

// Determine the function of stepper according to the user clicked
stepperClick(step:number){
if(step == 1){
  this.backBtnClick();
}
else if(step == 0){
  if(this.stepCount == 2){
    this.nextflag = !this.nextflag;
this.createDataForGrid();
    this.config.config.gridAPI.updateFlexGrid(this.config.config.series);
    this.config.changeDetectionMutation.setDashboardCardState();
    setTimeout(() => {
   this.nextflag = !this.nextflag;
   this._changeDetection.detectChanges();
    }, 500);
    
  }else{
  this.stepCount = 1;
  this.backBtnClick();
  }
}
}
// Determine which suppliers have already selected
checkItems(){

  for(var i=0;i<this.config.config.series.length;i++){
    let ind = findIndex(this.assignSpendConfig.SelectedVAriables,this.config.config.series[i]);
    if(ind != -1){
      this.config.config.series[i].isSelected = true;
    }
  }

}

// Create the data for the grid when comes to initial step from any other step
createDataForGrid(){
  this.setSRSCoulums();
  this.setConcoGridConfig();
  this.checkItems();
  setTimeout(() => {
    this.assignableSpend = parseFloat(this.calculateAssignableSpend().toFixed(2)) || 0;
    this.assignableSpend = this.formatter.format(parseFloat(this.assignableSpend.toFixed(0))) || 0;
    this.config.changeDetectionMutation.setDashboardCardState();
  }, 500);
  this.config.changeDetectionMutation.set = this.setState.bind(this);
  this.config.createOpportunity = false;
  this.setGridMessage();
  this._dashboardCommService.filterObjectHierarchyList;
  this.config.changeDetectionMutation.setDashboardCardState();
  this._dashboardCommService.getOppfinderData().subscribe(configSeries => {
    this.highlightInactiveOppfinder(configSeries);
  })
}

//Cancel button action: goes to landing page
cnclBtnClick(){
  let opportunityFinderLandingPageUrl = this._appConstants.userPreferences.IsNextGen ?
  this._commonUrls.URLs.OpportunityFinderApiUrls.getNextGenLandingPageURLForOppFinder :
  this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;
  window.location.href = opportunityFinderLandingPageUrl;

}

  // Oppfinder Active/InActive Status Events END

  private olapEvents() {
    const thisRef = this;
    
    this.manageSubscription$.add(
      this._olapGridDireService.olapGridService$
        .subscribe((wijmoEvents: any) => {
          if (
            this.config.widgetDataType === DashboardConstants.WidgetDataType.Olap &&
            this.config.cardId === wijmoEvents.PivotEngineId
          ) {
            thisRef.catchOlapGridEvent(wijmoEvents);
          }
        })
    );
  }

  onKeyUp() {
   
  }

  // This is a common method to set oppfinder based configuration inside flex grid.
  setOppfinderConfiguration(){
    if(this._dashboardCommService.oppFinderState.oppFinderFlag && this.config.widgetDataType != DashboardConstants.WidgetDataType.Olap){   
        this.flexFlag  = true;   
   {    
    this.config.createOpportunity = false;
    this.setSRSCoulums();
    this.setConcoGridConfig();
    this._dashboardCommService.getOppfinderData().subscribe(configSeries => {
      this.highlightInactiveOppfinder(configSeries);      
    })}
}
    else {
      this.flexFlag  = false;   
     this.setTailSpendVaribales();
     this.setOlapInitialConfig();
    }
  }

  setOlapInitialConfig(){
    this.config.config.olapGridInstanceConfig.stickyHeaders = false;
    this.tsaFlag = true;
    document.getElementById('oppFindertoggle').style.display = 'none';
    this.olapEvents();
    this.widgetContainerRef.createEmbeddedView(this.olapGridTemplateRef, {
      $implicit: {
        config: this.config,
        cardData: {}
      }
    });
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
  }

  setTailSpendVaribales(){
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.TSA.name) {    
    let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });

    if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
      masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
    }

    this.widgetConf = find(masterData.AdditionalProps,
      (prop) => {
        return prop.TailSpendReport.toLowerCase() === this.config.reportDetails.reportDetailObjectId.toLowerCase()
      });


      this._dashboardCommService.oppFinderMasterData['Level3RO']  = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => { // finding spend in reportDetails because it is not available in all listAllReportObjectWithMultiDatasource(as measure filters not supported in dashboard till now)
      return reportObject.reportObjectId.toLowerCase() == this.widgetConf.Level3Id.toLowerCase();
    });

    this._dashboardCommService.oppFinderMasterData['SpendBucket']  = find(this.config.reportDetails.lstReportObjectOnColumn, (reportObject) => { // finding spend in reportDetails because it is not available in all listAllReportObjectWithMultiDatasource(as measure filters not supported in dashboard till now)
      return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SpendBucketId.toLowerCase();
    });

    this._dashboardCommService.oppFinderMasterData['EstSavingsPercentRo']  = find(this.config.reportDetails.lstReportObjectOnRow, (reportObject) => { // finding spend in reportDetails because it is not available in all listAllReportObjectWithMultiDatasource(as measure filters not supported in dashboard till now)
      return reportObject.reportObjectId.toLowerCase() == this.widgetConf.EstSavingPercent.toLowerCase();
    });

    this._dashboardCommService.oppFinderMasterData['SpendRo']  = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
      return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SpendUSDObjectId.toLowerCase();
    });
    
    this._dashboardCommService.oppFinderMasterData['SupplierCountRo']  = find(this.config.reportDetails.lstReportObjectOnValue, (reportObject) => {
      return reportObject.reportObjectId.toLowerCase() == this.widgetConf.SupplierCountReportId.toLowerCase();
    });
    
    this._dashboardCommService.oppFinderMasterData['SupplierReport']  = this.widgetConf.SupplierReport.toLowerCase();
  }
  }

    setFraudAnomalyConfiguration(){
      if(this._dashboardCommService.fraudAnomalyState.fraudAnomalyFlag){
        let gridAnomalyColumns = [{
          "title": AnalyticsCommonConstants.FraudAnomalyCommonConstants.ActionColumn,
          "width": 200
        }
        ]
           //Running this iteration to add new columns to existing ones for the flex grid.
           if (this.config.config.column.length <= 5) {
            gridAnomalyColumns.forEach(element => {
              this.config.config.column.push({
                aggregate: 0,
                binding: element.title,
                format: undefined,
                header: element.title,
                isReadOnly: true,
                visible: true,
                allowSorting: false,
                width: element.width,
                minWidth: element.width
              })
            });
          }
  
    }
  }

    // Generic method to create a new anomaly
    CreateNewAnomaly(flexGridObject : any ) {
      this.config.drillDriveFilters= [];
      if (this._dashboardCommService.filterObjectHierarchyList.length > 0) {
        this.countPopUpFilterCreation().forEach((itemFilter) => {
          this.config.drillDriveFilters.push(itemFilter)
        })
      }
      this.config.subscriptions.next({
        actionId:  DashboardConstants.FraudAnomalyCommonConstants.EventInvestigate,
        cardId: this.config.cardId,
        event: flexGridObject,
        config: this.config
      });
    }

    calculateTsaSavings() {
      this.wijmoEvents.EventType = DashboardConstants.EventType.Olap.OlapEvent.FormatItem;
      this.refreshValues = true;
      this._loaderService.showCardLoader(this.config.cardId);
      this.config.config.refreshOlapGrid();
    }
    
    catchOlapGridEvent(wijmoEvents: any) {
      const thisRef = this;
      this.wijmoEvents  = wijmoEvents;
      switch (wijmoEvents.EventType) {
        case DashboardConstants.EventType.Olap.OlapHttpStatus.Success:
          {
            //Methods handle if the Olap Service Call gets Executed Successfully
            
          
           this.config.config.Subscriptions.next(wijmoEvents);
           document.getElementById(`show-subtoal-${this.config.cardId}`).style.display = 'none' ;
          }
          break;
        case DashboardConstants.EventType.Olap.OlapHttpStatus.Error:
          {
            //Methods handle if the Olap Service Call get Executed with Errors.
           // this.setDashboardCardMessage(this.getMessageStrings(DashboardConstants.EventType.ErrorOccured));
            this._loaderService.hideCardLoader(this.config.cardId);
          }
          break;
        case DashboardConstants.EventType.Olap.OlapEvent.FormatItem:
          {
            let e = wijmoEvents.e, s = wijmoEvents.s;
            let ng = s.engine;
            if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.PPV.name) {
              if( e.panel.cellType === wjcGrid.CellType.RowHeader){
                if (ng.rowFields[e.col % ng.rowFields.length].header == 'Material Number'){
                  e.cell.innerHTML ="<a id='Material Number:"+e.row+"'>"+e.cell.innerText ;e.row +"</a>";
                  let e1 = wijmoEvents.e;
                  e.cell.addEventListener('click',  debounce((p) => {
                    let rowSubtotalData = s.rows[parseInt(p.target.id.split(":")[1])].dataItem;
                      this.olapPpvCreateOpportunity(rowSubtotalData['Spend:0;'],rowSubtotalData['Saving Opportunity:0;'])                
              }, 250, {
                    leading: false,
                    trailing: true
                  }), true);
                }
              }
            }
            else{
            if (e.panel == s.cells && ng.valueFields.length) {
             let field = ng.valueFields[e.col % ng.valueFields.length],
              item = s.rows[e.row].dataItem,
             binding = s.columns[e.col].binding;


             if(field.header == this._dashboardCommService.oppFinderMasterData['SupplierCountRo'].displayName )
             {
              e.cell.innerHTML = "<a id='viewDetails'>" + e.cell.innerText + "</a>"
              e.cell.addEventListener('click',  debounce((p) => {
                if ( p.target.id === "viewDetails" ) {
            this.supplierCountClick(binding,item);
    
          p.preventDefault();                            
              } 
          
          }, 250, {
                leading: false,
                trailing: true
              }), true);
          }
            }
          }
          }
    }
  }
 async supplierCountClick(binding,item) {
                 
    let pagination =  document.getElementsByClassName("pagination-container")[0] as HTMLElement;
    if(pagination){ pagination.style.display = 'none';}
    document.getElementById('olapGrid').style.display = 'none';            
    let headers = binding.split(";");
    this._loaderService.showGlobalLoader();

  
    await this.setSupplierGridConfig(headers, pagination ,binding ,item);
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
    
  
  }

   public async setSupplierGridConfig(headers, pagination ,binding ,item) {
    this.loadDataByReportObjectId(this._dashboardCommService.oppFinderMasterData['SupplierReport']).then((reportDetailsForCreateOpp: any) => {

      if (item.$rowKey.values.length > 0){
      let categoryFilter = AnalyticsUtilsService.GetFormattedFilterValue(this.config.reportDetails.lstReportObjectOnRow, item.$rowKey.values[0]);
      reportDetailsForCreateOpp.lstFilterReportObject.push(
          AnalyticsUtilsService.createDrillDriveFilterReportObj({
              reportObject: this._dashboardCommService.oppFinderMasterData['Level3RO'],
              filterValue: categoryFilter[0],
              filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
          }));
        }
      if (headers[0].split(":")[1] != 0) {
          let spendBucketFilter = AnalyticsUtilsService.GetFormattedFilterValue(this.config.reportDetails.lstReportObjectOnRow, headers[0].split(":")[1]);
          reportDetailsForCreateOpp.lstFilterReportObject.push(
              AnalyticsUtilsService.createDrillDriveFilterReportObj({
                  reportObject: this._dashboardCommService.oppFinderMasterData['SpendBucket'],
                  filterValue: spendBucketFilter[0],
                  filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
              }));
      }
   
      this.tailSpendConfig.reportDetails = reportDetailsForCreateOpp;
      this.tailSpendConfig.api = {
          closePopup: () => {
              document.getElementById('olapGrid').style.display = 'block';
              if(pagination){pagination.style.display = 'block';}
              this.assignSpendPopUpRef.detach();
              this.assignSpendPopUpRef.clear();
          },
          createOpportunity: (gridData) => {
            
              this.olapCreateOpportunity(gridData);
          },
          setState: () => {
            this.config.changeDetectionMutation.setDashboardCardState()
          }
      };
      this.config.changeDetectionMutation.setDashboardCardState();
     if(this.assignSpendPopUpRef){
      this.assignSpendPopUpRef.detach();
      this.assignSpendPopUpRef.clear();
      }
      this.assignSpendPopUpRef.createEmbeddedView(this.outletTemplateRef, {
    
        manifestPath: 'tailSpend-supplier/tailSpend-supplier',
        config: {
            config: this.tailSpendConfig
        }
    });  
    
    setTimeout(() => {
      this.config.changeDetectionMutation.setDashboardCardState();
    }, 500);
     
  });



  }

 
}
    
  
 





