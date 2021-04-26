import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild, ViewContainerRef, Inject, Input, ElementRef, ApplicationRef, ViewEncapsulation, EmbeddedViewRef, Output, OnDestroy, Renderer2, ComponentFactoryResolver, Injector, ComponentRef, TemplateRef, ChangeDetectorRef, ChangeDetectionStrategy }
  from "@angular/core"; import { NotificationService, AppConstants }
  from 'smart-platform-services'; import { AnalyticsCommonConstants }
  from '@vsAnalyticsCommonConstants'; import { DashboardConstants }
  from '@vsDashboardConstants'; import { CommonUtilitiesService }
  from '@vsCommonUtils'; import { findIndex, find,map as _map, forEach}
  from 'lodash'; import { DashboardCommService }
  from '@vsDashboardCommService'; import { LoaderService }
  from "@vsLoaderService"; import { CellType }
  from 'wijmo/wijmo.grid';
  import { AnalyticsCommonDataService } from "@vsAnalyticsCommonService/analytics-common-data.service";
  import { Subscription } from 'rxjs';
   import { setCss } from 'wijmo/wijmo';
   import {Tooltip} from 'wijmo/wijmo'
    import { IOpportunityFinderTypeMaster, IOpportunityFinderCreationObjectInfo } from "interfaces/common-interface/app-common-interface";
import { OpportunityFinderService } from "@vsOppfinderService/opportunityFinder.service";
import { IOpportunityFinderCurrencySign } from '@vsCommonInterface';
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { AnalyticsMapperService } from "@vsAnalyticsCommonService/analytics-mapper.service";
import { CommonUrlsConstants } from "@vsCommonUrlsConstants";
import { toFixed } from "core-js/fn/number/epsilon";


declare var $:any;@Component({selector:'payment-term-rationalization-popup',templateUrl:'./payment-term-rationalization-popup.component.html',styleUrls:['./payment-term-rationalization-popup.component.scss'],host: { '(document:click)': 'onDocumentClick($event)', },encapsulation:ViewEncapsulation.None,
changeDetection: ChangeDetectionStrategy.OnPush,preserveWhitespaces:false})

export class PaymentTermRationalizationPopup implements OnInit, AfterViewInit {
  //config for payment term
    @Input() config: any;

    constants = DashboardConstants;
    netPaymntTermNames: any;
    gridData: any;
    netPaymentTermSelected:any;
    //stores all the aggregate 
    aggregatePaymntTrmNetValues:Array<any>=[];
    customNetPaymentColumnValue:any;
    selectedPaymentTermValue:any;
    optionsForNetPaymentTerms:any;
    btnDoneConfig: any;
    btnCreateOpportunityConfig : any;
    costOfCapital: any = {
        Value: DashboardConstants.OpportunityFinderConstants.DEFAULT_COST_OF_CAPITAL
    }; 
    addSpend: any = {
        Value: DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND
    }; 
    updateSaving: any = { "Value": 10 };

    editTextfieldadd : boolean =true;
    rowindex : any;
    isSelected : boolean = false;
    targetPaymentTerms : any;
    radioSavingsConfig :any  = {
        valueKey: "title",
        fieldKey: "field",
        layout: 'horizontal',
        collection: [{
                "value": "1",
                "title": "Payment Term Rationalization"
            }, {
                "value": "2",
                "title": "Cash flow improvement"
            }
        ]
    }
   radioSavingsModel = {
       field: {
           title: "Payment Term Rationalization",
           value: 1
       }
   };
    destoryTimeout: any = {};
    smartNumericConfig: any = {
        label: '',
        isMandatory: true,
        disabled: false,

        tabIndex: 2,
        data: "Value",
        placeholder: "1-20",
        attributes: {
            maxLength: 5,
            placeholder: "",
            max: 100,
            min: 0
        },
        minPrecession: 0,
        maxPrecession: 2
    }
    refreshFlexGrid:boolean=true;

    smartNumericConfigForCustomColumn: any = {
        label: '',
        isMandatory: false,
        disabled: false,

        tabIndex: 2,
        data: "Value",
        placeholder: "1-366",
        attributes: {
            maxLength: 3,
            placeholder: "",
            max: 100,
            min: 0
        },
        minPrecession: 0,
        maxPrecession: 2
    }

    @ViewChild('flexGridTemplate') flexGridTemplateRef: TemplateRef<any>;
    @ ViewChild("outletTemplate")outletTemplateRef: TemplateRef < any > ;
    manageSubscription$: Subscription = new Subscription();
    showGrid: boolean;
    dateOfStandingPaymentTerm: any;
    dateOfStandingColumnDisplayName: string;
    //to differentiate in case when maximum payment term and weighted average are same.
    weightedAverageColumnBindedName:string;
    popUpHeader: string;
    formatter: Intl.NumberFormat;
    currentCostOfCapital = DashboardConstants.OpportunityFinderConstants.DEFAULT_COST_OF_CAPITAL;

   

     constructor(
        private element: ElementRef,
        private _renderer: Renderer2,
        private _commonUrls: CommonUrlsConstants,
        private _commonUtils: CommonUtilitiesService,
        private _loaderService: LoaderService,
        private _oppFinderService: OpportunityFinderService,
        public _dashboardCommService: DashboardCommService,
        private _elementRef: ElementRef,
        private _analyticsCommonDataService: AnalyticsCommonDataService,
        private _cdRef: ChangeDetectorRef)  {}

    ngOnInit() {
        this.setUIConfig();
        this.createDateOfStandingConfig().then((response) => {
            // default a extra column will appear which will show the maximum payment term values
            this.addMaximumNetPaymentTermColumn();
            this.config.gridConfig.enableFooter = true;
            this.showGrid = true;           
          /*   this.destoryTimeout = setTimeout(() => {*/ 
                this.setState();
                this._loaderService.hideGlobalLoader();
   /*          }, 1000); */
        });
        
    }
    ngAfterViewInit(): void {

    }
    apply()
    {
        this.updateSavings();
        this.editTextfieldadd = true;
    }
    applyCancel()
    {
        this.editTextfieldadd = true;
    }

    updateSavings() {

        if (this.validateAdjustableSpend(this.addSpend.Value)) {
            let adjustSepend = _map(this.gridData.series, DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND);
            adjustSepend[this.rowindex] = this.addSpend.Value / 100;
            this.gridData.series = this.recalcPTS(this.config.CustonDataForPaymentTerms.customDataForPayTerm.daxData, adjustSepend);
            this.calculateDateofStandingVal();
            //this will recalculate the custom input column value again
            this.calculateDataForCustomColumn("Net "+this.config.maxPaymentTerm["Payment Term"],this.customNetPaymentColumnValue.Value)
            setTimeout(() => {
                this.gridData.gridAPI.updateFlexGrid( this.gridData.series);
                this.setState();
            }, 500);
            let messageText = "Values on the grid updated successfully.";
            this._commonUtils.getToastMessage(messageText);
        }
    }

    onCostOfCapitalClick(value) {
        if (value == null) {
           
            this._commonUtils.getMessageDialog(  
                DashboardConstants.UIMessageConstants.STRING_COSTOFCAPITAL_BLANK_MESSAGE,
           ()=>{})
        }
        else if (parseFloat(value) < 0 || parseFloat(value) > 20) {
            this._commonUtils.getMessageDialog(
                DashboardConstants.UIMessageConstants.STRING_COSTOFCAPITAL_RANGE_MESSAGE
                ,()=>{})
        } else {
            this.currentCostOfCapital = this.costOfCapital.Value ;
            let adjustSepend = _map(this.gridData.series, DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND);
            this.gridData.series = this.recalcPTS( this.config.CustonDataForPaymentTerms.customDataForPayTerm.daxData, adjustSepend);
            this.calculateDateofStandingVal();
            this.calculateDataForCustomColumn("Net "+this.config.maxPaymentTerm["Payment Term"],this.customNetPaymentColumnValue.Value);
            setTimeout(() => {                  
                this.gridData.gridAPI.updateFlexGrid( this.gridData.series);
                this.setState();
            }, 500);
            let messageText = "Values on the grid updated successfully.";
            this._commonUtils.getToastMessage(messageText);
            return;
        }
    }

    //on entering the value for custom net payment term value,the series should be updated and flex grid should be refereshed
    onCustomInputColumnClick(value)
    {
        if (value == null) {           
            this._commonUtils.getMessageDialog(  
                DashboardConstants.UIMessageConstants.STRING_CUSTOMPAYMENTTERM_BLANK_MESSAGE,
           ()=>{})
        }
        else if (parseFloat(value) < 0 || parseFloat(value) > 366) {
            this._commonUtils.getMessageDialog(
                DashboardConstants.UIMessageConstants.STRING_CUSTOMPAYMENTTERM_RANGE_MESSAGE
                ,()=>{})
        }
        else {
            let columnIndex=this.gridData.column.length-1;
            if (columnIndex>0) {
                this.refreshFlexGrid=false;                
                this.calculateDataForCustomColumn(this.gridData.column[columnIndex].binding,value)                
                this.gridData.column[columnIndex].header="Net "+value;
                this.updateInputColumnName(this.gridData.column[columnIndex].header);                             
            }
            this.gridData.gridAPI.updateFlexGrid(this.gridData.series);
            setTimeout(() => { 
                this.refreshFlexGrid=true;               
                this._cdRef.detectChanges();
                this.setState();
                
            }, 300);
            let messageText = "Values on the grid updated successfully.";
            this._commonUtils.getToastMessage(messageText);
            return;
        }
    }
    updateInputColumnName(inputColumnName:string)
    {
        if (inputColumnName!="") {
            let index=findIndex(this.netPaymntTermNames.options,{"isMaxColumn":true})            
            this.netPaymntTermNames.options[index].Value=inputColumnName;
            if(this.netPaymentTermSelected.value.isMaxColumn)
            {
                this.netPaymentTermSelected.value.Value=inputColumnName;
                this.onChangeOfNetPaymntTerm(this.netPaymentTermSelected.value);
            }
        }
    }

    applyToAll(){
        if (this.validateAdjustableSpend(this.addSpend.Value)) {
            let adjustSepend = _map(this.gridData.series, DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND);
            adjustSepend = Array(adjustSepend.length).fill(this.addSpend.Value / 100);
            this.gridData.series = this.recalcPTS(this.config.CustonDataForPaymentTerms.customDataForPayTerm.daxData, adjustSepend);
            this.calculateDateofStandingVal();
            //this will recalculate the custom input column value again
            this.calculateDataForCustomColumn("Net "+this.config.maxPaymentTerm["Payment Term"],this.customNetPaymentColumnValue.Value)
            setTimeout(() => {
                this.gridData.gridAPI.updateFlexGrid( this.gridData.series);
                this.setState();
            }, 500);
            this.editTextfieldadd = true;
            let messageText = "Values on the grid updated successfully.";
            this._commonUtils.getToastMessage(messageText);
           

        }

    }

 //This Function will help calculate the value if Date of standing Column value for all the payment term present in the row
    calculateDateofStandingVal(){
        this.calculateDataForCustomColumn(this.weightedAverageColumnBindedName,this.dateOfStandingPaymentTerm);       
    }

    //this will calculate payment values for custom column
    calculateDataForCustomColumn(columnDisplayName:string,columnNetPaymentTermName:string){
        this.gridData.series.forEach((item) => {
            item[columnDisplayName] = this.CalcualtePaymentTerm(columnNetPaymentTermName ,item["Payment Term"],item[this.config.ColumnNames.Spend],item[DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND],this.costOfCapital.Value)   
        });
    }

    validateAdjustableSpend(adjustableValue) {
        if (parseFloat(adjustableValue) < 1 || parseFloat(adjustableValue) > 100 || adjustableValue == null) {
            this._commonUtils.getMessageDialog(
                DashboardConstants.UIMessageConstants.STRING_ADJUSTABLE_RANGE_MESSAGE,
                ()=>{});
            return false;
        }
        else {
            return true;
        }
    }

    setUIConfig() {
        this.btnDoneConfig = {
            title: "Cancel",
            flat: true,
            disable: false
        };

        this.btnCreateOpportunityConfig= {
            title: "Create Opportunity",
            flat: true,
            disable: false
        };
        this.netPaymentTermSelected = {
            'value': {
              "Id":"",
              "Value": ""
            }
        };
        this.targetPaymentTerms = this.config.CustonDataForPaymentTerms.customDataForPayTerm.paymentTermAdditionalProps.TargetPaymentTerms;       
        this.netPaymntTermNames = {
            dataKey: 'Id',
            label: DashboardConstants.UIMessageConstants.STRING_TargetPamentTermSelection,
            displayKey: 'Value',
            fieldKey: 'value',
            cssClass: 'line-height-manager',
            options: _map(this.targetPaymentTerms,(obj,index)=>{
                return {"Id":index.toString(),"Value":obj["Payment Term Name -New"],"isMaxColumn":false};
            })
        }
        this.config.OpportunityName = {
            value: this._dashboardCommService.oppFinderState.editMode ? this.config.OpportunityName : ""
        };
        this.config.OpportunityDescription = {
            value: this._dashboardCommService.oppFinderState.editMode ? this.config.OpportunityDescription : ""
        };

        this.popUpHeader= DashboardConstants.UIMessageConstants.STRING_SELECTPAYMENTTERM_HEADER;
        this.formatter = new Intl.NumberFormat('en-US', {
            style: undefined,
            currency: undefined,
            minimumFractionDigits: 0,
        });
        this.customNetPaymentColumnValue={Value:this.config.maxPaymentTerm["Payment Term"]};
        setTimeout(() => { this.setState() }, 1000);
    }
    
    flexEvents(event) {
        let action = event.type;
        switch (action) {
        case "itemFormatter":
             this.itemFormatter(event);
            break;

        }
    }

 

     itemFormatter(obj) {
        var flex = obj.filter.grid;
        if (obj.filter.cellType === CellType.ColumnFooter)
        {
            if (typeof(obj.grid.columnFooters.getCellData(obj.r,obj.c)) == "number" && flex.columns[obj.c].header != (DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND)) {

                let savingsFooter =   parseFloat(obj.grid.columnFooters.getCellData(obj.r,obj.c).toFixed(0));
                if(savingsFooter == -0){savingsFooter = 0}
                obj.cell.innerHTML = this.config.Currency+this.formatter.format(savingsFooter);
                //it will store all the aggregate values.
                let indexOfHeader=findIndex(this.aggregatePaymntTrmNetValues,{"title":flex.columns[obj.c].header});
                if (indexOfHeader==-1) {
                    this.aggregatePaymntTrmNetValues.push({"title":flex.columns[obj.c].header,"value":obj.grid.columnFooters.getCellData(obj.r,obj.c,1),"numberValue":savingsFooter});
                }
                else{
                    this.aggregatePaymntTrmNetValues[indexOfHeader].value=obj.grid.columnFooters.getCellData(obj.r,obj.c,1);
                    this.aggregatePaymntTrmNetValues[indexOfHeader].numberValue=savingsFooter;
                    //in case when user changes the cost of capital and the same payment term is selected in the dropDown then it's values has to be updated as well.
                    if (this.netPaymentTermSelected.value.Value===flex.columns[obj.c].header) {
                        this.onChangeOfNetPaymntTerm(this.netPaymentTermSelected.value);
                    }
                    
                    
                } 
                
                
               if (flex.columns[obj.c].binding!==this.weightedAverageColumnBindedName) {
                    setCss(obj.cell, {
                        background: "#daedf4"        
                    });
                }
               else{
                    this.setColorToWeightedAverageColumn(flex.columns[obj.c].binding,obj.cell);
                }
               
               
            }
            else{
                setCss(obj.cell, {
                    background: "#daedf4"        
                });
            }
           
        }
        ;
        if (obj.filter.cellType === CellType.Cell) {
            setCss(obj.cell, {
                background: "#fff"        
            });         
             
            if (typeof(obj.grid.getCellData(obj.r, obj.c)) == "number" && flex.columns[obj.c].header != (DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND)) {
                let savingsCell =   parseFloat(obj.grid.getCellData(obj.r,obj.c).toFixed(0));
                if(savingsCell == -0){savingsCell = 0}
                obj.cell.innerHTML = this.config.Currency+this.formatter.format(savingsCell);
                this.setColorToWeightedAverageColumn(flex.columns[obj.c].binding,obj.cell);
            }                        
            if (flex.columns[obj.c].header === DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND) { 
                setCss(obj.cell, {
                    color: "#0177d6",
                    cursor: "pointer"

                });           
                obj.cell.addEventListener('click', (e) => {
                    setTimeout(() => {
                        this.rowindex = obj.r;
                        let $element = $(this._elementRef.nativeElement),
                        editContainer = $element.find('.editable-div_addspend'),
                        parentContainerScrollTop=$element.find('.scrollableModel.modal-popup1.overflowAuto').scrollTop(),
                        inputEle = $element.find('.editable-div .input-field input'),
                        element = obj.grid.cells.getCellElement(obj.r, obj.c),
                        left = $(element).offset().left;
                        let top = $(element).offset().top;
                        this.editTextfieldadd = false;
                        editContainer.css("left",left-220-$(element).width()/1.45);  
                        editContainer.css("top", element.getBoundingClientRect().y+$(element).height()/2+parentContainerScrollTop);            
                        this.setState();
                    }, )
                }, true);                                               
            }                            
        }
        if (obj.filter.cellType == CellType.ColumnHeader) {            
            //displaying from-to-icon 
            if(flex.columns[obj.c].header === this.config.ColumnNames.PaymentTermNew ){ 
                obj.cell.innerHTML = '<i class="icon small from-to-icon"><svg class="from-to-icon"><use xlink:href="#icon_FromTo"></use></svg></i>'

            }
            this.setToolTipIconOnWeightedAverageColumn(flex.columns[obj.c].binding,obj); 
            setCss(obj.cell, {
                background: "#efefef"        
            });

        }
        setTimeout(() => { this.setState() }, 1000);
    };

//recalculating grid values  again
     public recalcPTS(_reportDetails: any, adjustSepend: Array<any>): Array<any> {
        let TargetPaymentTermName = (Object.getOwnPropertyNames(this.targetPaymentTerms[0])),
            MetricName = this.config.ColumnNames.Spend;
        for (let i = 0; i < _reportDetails.length; i++) {
            _reportDetails[i][DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND] = adjustSepend[i];
            for (let k = 0; k < this.targetPaymentTerms.length; k++) {
                if (this.targetPaymentTerms[k] != undefined && _reportDetails[i] != undefined)
                    _reportDetails[i][this.targetPaymentTerms[k][TargetPaymentTermName[0]]] = this.CalcualtePaymentTerm(this.targetPaymentTerms[k][TargetPaymentTermName[1]], _reportDetails[i][TargetPaymentTermName[1]], _reportDetails[i][MetricName], _reportDetails[i][DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND], this.costOfCapital.Value);
            }
        }
        return _reportDetails;
    }

    CalcualtePaymentTerm(TargetPayTerm, ActualPayTerm, Spend, AdjSpend, CostOfCapital) {
        var output = (((TargetPayTerm - ActualPayTerm) / 365) * (CostOfCapital/100) * Spend * AdjSpend);
        return output;
        
    }

    setColorToWeightedAverageColumn(columnName:string,flexGridCell:any)
    {
        if (columnName && columnName===this.weightedAverageColumnBindedName) { 
            flexGridCell.classList.remove("wj-alt");
            flexGridCell.classList.add("borderBottomWhite"); 
            setCss(flexGridCell,{
                background:"#FFFACD"
            });           
        }
    }

    setToolTipIconOnWeightedAverageColumn(columnName:string,obj:any)
    {
        let  tooltip = new Tooltip();
        if (columnName && columnName===this.weightedAverageColumnBindedName) {            
            obj.cell.innerHTML = obj.cell.innerHTML+" "+'<i class="icon iconSmall" style="color:blue;"><svg> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon_Info"></use></svg></i>';
            obj.cell.addEventListener('mouseover', (e:MouseEvent) => {
                if (obj.filter.cellType == CellType.ColumnHeader) {
                    tooltip.show(obj.cell,DashboardConstants.UIMessageConstants.STRING_WeightedAverageToolTip);
                }
                else{
                    tooltip.dispose();
                }
                this.stopEventPropagation(e);
            }, true);
            obj.cell.addEventListener('mouseout', (e:MouseEvent) => {
                tooltip.dispose();
                this.stopEventPropagation(e);
            }, true);
        }
    }
    stopEventPropagation(e:MouseEvent)
    {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    doneClick() {
        this.config.api.closePopup();
        this.ngOnDestroy();
    }
    createOppClick(){
        if(this.isSelected){
        this.config.AdditionalDetails.CostOfCapital = this.currentCostOfCapital;         
        this.config.api.createOpportuity();
        this.ngOnDestroy();
        }
        else{
            this._commonUtils.getMessageDialog(
            DashboardConstants.UIMessageConstants.STRING_SELECT_VALUE_TO_PROCEED,
            ()=>{},
            DashboardConstants.OpportunityFinderConstants.STRING_ERROR)
            
        }
         

    }

/* Adding this method on change of Radio selection Inside the grid.
Value inside the grid will be updated on basis of this formula. */

onChangePaymentTermRadioOption() {

    let adjSpend: number;
    let costOfCaplital: number;

    this.radioSavingsModel.field.value == 2 ? (adjSpend = DashboardConstants.OpportunityFinderConstants.DATEOFSTANDING_COST_OF_CAPITAL,
        costOfCaplital = DashboardConstants.OpportunityFinderConstants.DATEOFSTANDING_COST_OF_CAPITAL,
        document.getElementById("costOfCapital").style.display = "none"):
    (adjSpend = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND,
    costOfCaplital = DashboardConstants.OpportunityFinderConstants.DEFAULT_COST_OF_CAPITAL,
    document.getElementById("costOfCapital").style.display = "block")

        let adjustSepend = _map(this.gridData.series, DashboardConstants.OpportunityFinderConstants.PAYMENTTERM_ADJUSTABLE_SPEND);
    adjustSepend = Array(adjustSepend.length).fill(adjSpend / 100);
    
        this.costOfCapital.Value = costOfCaplital;
    this.gridData.series = this.recalcPTS(this.config.CustonDataForPaymentTerms.customDataForPayTerm.daxData, adjustSepend);
    this.calculateDateofStandingVal();
    //this will recalculate the custom input column value again
    this.calculateDataForCustomColumn("Net "+this.config.maxPaymentTerm["Payment Term"],this.customNetPaymentColumnValue.Value)

    setTimeout(() => {
        this.gridData.gridAPI.updateFlexGrid(this.gridData.series);
        this.setState();
    }, 500);
    let messageText = "Values on the grid updated successfully.";
    this._commonUtils.getToastMessage(messageText);
    return;
}




 /* This method will generate report for finding date of standing on basis of
 filter from row - Supplier , Level 1 category, Region and will append the result in config  payment term grid*/

 createDateOfStandingConfig() {

    this.gridData = this.config.gridConfig;
    const DateOfStandingConfig: any = {
        reportDetails: undefined
    }
    let rowNumber = this.config.RowNumber
        //Fetching report ids from additional props which are to be passed as filters while generatig report
        let viewPartDetailReportId = this.config.CustonDataForPaymentTerms.customDataForPayTerm.paymentTermAdditionalProps.DateOfStandingReportId.toLowerCase();

    let SupplierId = find(this.config.ParentGridConfig.reportDetails.lstReportObjectOnRow, (reportObject) => {
        return reportObject.reportObjectId.toLowerCase() == this.config.CustonDataForPaymentTerms.customDataForPayTerm.paymentTermAdditionalProps.SupplierReportObjectId.toLowerCase();
    });

  

    return new Promise((resolve, reject) => {
        this.loadDataByReportObjectId(viewPartDetailReportId).then((reportDetailsForCreateOpp: any) => {

            DateOfStandingConfig.reportDetails = reportDetailsForCreateOpp;

            let supplierFilter = AnalyticsUtilsService.GetFormattedFilterValue(this.config.ParentGridConfig.reportDetails.lstReportObjectOnRow, this.config.ParentGridConfig.config.series[rowNumber][SupplierId.displayName]);
            DateOfStandingConfig.reportDetails.lstFilterReportObject.push(
                AnalyticsUtilsService.createDrillDriveFilterReportObj({
                    reportObject: SupplierId,
                    filterValue: supplierFilter[0],
                    filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
                }));

             //This will check whether drill/drive filters are applied before generating the report and push them if applied in lstfilter object
         
                if( this._dashboardCommService.filterObjectHierarchyList.length > 0){
                    this.config.DrillDriveFilters.forEach(element => {
                        DateOfStandingConfig.reportDetails.lstFilterReportObject.push(element);
                    });  
                  }

                    //This will check whether global filters are applied before opening the pop up and push them if applied in lstfilter object
              if (this._dashboardCommService.appliedFilters.length > 0) {
                    this.config.GlobalFilters.forEach((item) => {
                        DateOfStandingConfig.reportDetails.lstFilterReportObject.push(this._commonUtils.getDeReferencedObject(item))
                })
              }


           


            // Adding of filters (Supplier , L1 category and region for generating report)
            // this.reportDataReq = PpvPopupConfig.reportDetails;
            let reportDetailsMetaData: any = this._commonUtils.getDeReferencedObject(DateOfStandingConfig.reportDetails);
            reportDetailsMetaData.isGrandTotalRequired = false;
            reportDetailsMetaData.isSubTotalRequired = false;
            reportDetailsMetaData.lstFilterReportObject.forEach(item  =>   {
                        if (typeof item.filterValue  ===   'string')
                          item.filterValue  =  JSON.parse(item.filterValue);
                      
            })
            let ReportsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);
            ReportsData.lstReportObject = reportDetailsMetaData.lstReportObjectOnValue;

            let DateOfStandingObject = find(reportDetailsMetaData.lstReportObjectOnValue, (reportObject) => {
                return reportObject.reportObjectId.toLowerCase() == this.config.CustonDataForPaymentTerms.customDataForPayTerm.paymentTermAdditionalProps.DateOfStandingReportObject.toLowerCase();
            });
            // Call for generate report
            this.manageSubscription$.add(
                this._analyticsCommonDataService.generateReport(ReportsData)
                .subscribe(async(response) => {
                    if (response != undefined
                         && response.Data != null
                         && response.Data.length > 0
                         && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
                        this.dateOfStandingPaymentTerm = response.Data[0][DateOfStandingObject.displayName].toFixed(0);
                        this.dateOfStandingColumnDisplayName ="Net "+ this.dateOfStandingPaymentTerm.toString() ;
                        this.weightedAverageColumnBindedName=this.dateOfStandingColumnDisplayName+"Weighted Average";
                        this.gridData.column.push({
                            aggregate: DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_SUM._value,
                            binding:this.weightedAverageColumnBindedName ,
                            format: 'C' + this.config.Currency || ',',
                            header: this.dateOfStandingColumnDisplayName,
                            isReadOnly: true,
                            visible: true,
                            allowSorting: false
                        });
                        this.addNetPaymntTermName( this.dateOfStandingColumnDisplayName);                
                        this.calculateDateofStandingVal();
                        //   this.flexSeries = response.Data;
                        //   response = this.createGridConfig();

                    }

                    resolve(response);
                }, (error) => {
                    this._commonUtils.getMessageDialog(
        `Status:${error.status}  Something Went wrong with ${error.message}`,()=>{});
                }));

        })

    })
    

}
addNetPaymntTermName(paymentTermName:string,isMaxColumn:boolean=false)
{

    let optionsArray=[];
    optionsArray=this.netPaymntTermNames.options;
    optionsArray.push({"Id":optionsArray.length.toString(),"Value":paymentTermName,"isMaxColumn":isMaxColumn});   
    this.netPaymntTermNames.options=optionsArray;
}


addMaximumNetPaymentTermColumn()
{
    this.gridData.column.push({
        aggregate: DashboardConstants.OpportunityFinderConstants.WIJMO.WIJMO_SUM._value,
        binding:"Net "+this.config.maxPaymentTerm["Payment Term"],
        format: 'C' + this.config.Currency || ',',
        header: "Net "+this.config.maxPaymentTerm["Payment Term"],
        isReadOnly: true,
        visible: true,
        allowSorting: false
    });
    this.addNetPaymntTermName("Net "+this.config.maxPaymentTerm["Payment Term"],true);                
    this.calculateDataForCustomColumn("Net "+this.config.maxPaymentTerm["Payment Term"],this.config.maxPaymentTerm["Payment Term"]);

}

onChangeOfNetPaymntTerm(selectedPymtTerm:any){
    if(selectedPymtTerm.Value!="" && selectedPymtTerm.Id!=""){
        this.isSelected=true;                       
        this.selectedPaymentTermValue=find(this.aggregatePaymntTrmNetValues,(obj)=>{
            return obj.title.replace(" ",'').toLowerCase().trim()===selectedPymtTerm.Value.replace(" ",'').toLowerCase().trim();
        }).value;
        this.config.ESTIMATED_SAVINGS =this.selectedPaymentTermValue ;
        this.config.Spend = this.aggregatePaymntTrmNetValues[0].numberValue;
        this.config.AdditionalDetails.SelectedPaymentTerm =selectedPymtTerm.Value;
    }
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
            resolve(this._commonUtils.toCamelWrapper(response));
        })

    })
}


    onCancel(){
        this.config.api.closePopup();
        this.ngOnDestroy();
    }
    ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
         clearTimeout(this.destoryTimeout);
    }

    public onDocumentClick(event): void {
        let element = this._elementRef.nativeElement;
        let hiddenele = "";
        let editContainer: any;
          editContainer = element.querySelector('.editable-div_addspend')
          if (!editContainer.contains(event.target)) {
            if (this.rowindex != undefined && this.editTextfieldadd === false) {
              this.editTextfieldadd = true;
            }
          }
        
    
      }

      onKeyUp() {
       
    }

    private setState() {
        this._cdRef.markForCheck();
    }

}
