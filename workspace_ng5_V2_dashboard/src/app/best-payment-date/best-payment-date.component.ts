import {
  Input, Output, Component,
  EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewContainerRef, TemplateRef, OnDestroy, EmbeddedViewRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactoryResolver, Injector, ApplicationRef
} from '@angular/core';
// import { LazyComponentConfiguration, visionModulesManifest } from '../../../modules-manifest';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { AnalyticsCommonDataService } from '@vsAnalyticsCommonService/analytics-common-data.service';
import { Subscription, Observable } from 'rxjs';
import { DashboardConstants } from '@vsDashboardConstants';
import { map, find, filter, each, mapValues, extend, sumBy, findIndex } from 'lodash';
import { DashboardCommService } from '@vsDashboardCommService';
import { ISaveOpportunityFinderDetails, IReportingObjectMultiDataSource, IFilterList, IRelationObjectMapping } from 'interfaces/common-interface/app-common-interface';
import { OpportunityFinderService } from '@vsOppfinderService/opportunityFinder.service';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { StaticModuleLoaderService, IManifestCollection } from 'smart-module-loader';
import { AnalyticsUtilsService } from '@vsAnalyticsCommonService/analytics-utils.service';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { SavedFilter } from '@vsMetaDataModels/saved-filter.model';
import { GlobalFilterService } from '@vsGlobalFilterService';
import { AppConstants } from 'smart-platform-services';
import { numberFormat } from "highcharts";
import { CellType } from 'wijmo/wijmo.grid';
import { setCss } from 'wijmo/wijmo';
import { OppfinderFormulaPopupComponent } from '../oppfinder-formula-popup/oppfinder-formula-popup.component';
import { OppfinderFormulaOverviewPopupComponent } from '../oppfinder-formula-overview-popup/oppfinder-formula-overview-popup.component';
import { LoaderService } from '@vsLoaderService';

@Component({
  selector: 'best-paymenOppfinderFormulaPopupComponentt-date',
  templateUrl: './best-payment-date.component.html',
  styleUrls: ['./best-payment-date.component.scss'],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  encapsulation: ViewEncapsulation.None,
  entryComponents: [OppfinderFormulaPopupComponent, OppfinderFormulaOverviewPopupComponent],
  preserveWhitespaces: false
})
export class BestPaymentDateComponent implements OnInit {
  // static componentId = LazyComponentConfiguration.BestPaymentDate.componentName;
  summaryCardConfig: any;
  mainconfig: any;
  btnDoneConfig: any;
  btnNextConfig: any;
  btnCancelConfig: any;
  btnApplyConfig: any;
  btnFinderOverViewConfig: any;
  btnFooterCloseConfig: any;
  btnFooterCancelConfig: any;
  btnFooterSaveConfig: any;
  btnPopupSaveConfig: any;
  isGlobalFilterApplied: boolean;
  showChipBar: boolean = false;
  selectedFilter: any;
  dashboardConstant: any = DashboardConstants.FilterType.MultiSelect;
  showSelectedText: any;
  costOfCapitalRO: any;
  invoiceNumberRO: any;
  paymentStatusRO: any;
  invoiceDateRO: any;
  paymentTermRO: any;
  invoiceAmountRO: any;
  penaltyPercentageRO: any;
  incurredPenaltiesRO: any;
  discountDaysRO: any;
  discountPercentageRO: any;
  discountLastDate: any;
  actualInvoiceClearingDate: any;
  invoiceDueDate: any;
  potentialSavingRO: any;
  supplierRO: any;
  level1categoryRO: any;
  level2categoryRO: any;
  level3categoryRO: any;
  level4categoryRO: any;
  bestPaymentDateRO: any;
  categorylevel: any;
  btnContinueConfig: any;
  oppfinderFormulaPopupRef: any;
  oppfinderFormulaPopupConfig: any;
  oppfinderFormulaOverviewPopupRef: any;
  oppfinderFormulaOverviewPopupConfig: any;
  opportunityCreationreportDetailId: any;
  invoiceCountSummaryCardId: any;
  invoiceOnTimeSummaryCardId: any;
  invoiceLateSummaryCardId: any;
  // bestPaymentTermRo: any;
  // spendRo: any;
  // level3CategoryRo: any;
  // level4CategoryRo: any;
  // paymentTermNameRO: any = {};
  showSavePopup: boolean = false;
  // selectedBestPaymentTerm: number = 0;
  selectedSupplier: string;
  // effectiveAddressableSpend: number;
  addressableSpend: number = 0;
  costOfCapital: number = 10;
  totalPotentialSavings: number = 0;
  totalSpend: number = 0;
  weightedAvgAddressableSpend: number = 0;
  prevSeries: any = {};
  supplierWiseOppFinderId: any = {};
  supplierNameForOpportunities: string;
  supplierNameForEdit: string;
  // refreshNewClicked: boolean = false;
  // refreshNewOld = {
  //   text: DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_LATEST_VALUES,
  //   date: ""
  // }
  popupHeaderText: any = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
  gridData: any = {
    gridDetailsView: {},
    opportunityDetailsView: {},
    createOpportunityView: {}
  } // this variable will hold the grid details of whatever grid displayed on the page.
  currentPageSupplierList: Array<string>;
  // currentPageLevel3CategoryList: Array<string>;
  // level4CategoryList = {
  //   level3Category: "",
  //   level4Categories: []
  // }
  supplierWiseOpportunities: any = {};
  manageSubscription$: Subscription = new Subscription();
  // sliderManifest: IManifestCollection = {
  //   sliderWidget: visionModulesManifest.sliderWidget
  // };
  numberFilterObj = { "title": "Select Category level", "op": 0 }
  filterByNumberOpts = {
    label: 'Select Category level',
    dataKey: 'op',
    fieldKey: 'value',
    displayKey: 'title',
    type: 'select',
    options: []
  };
  flexGrid = {
    showPagination: false,
    currentPage: 0,
    startPage: 1,
    endPage: 0,
    isNext: true,
    isPrev: false,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
    pageData: []
  };
  sliderConfig = {
    min: 0,
    max: 20,
    from: 10,
    to: 20,
    sliderTooltipConfig: {
      delay: 100,
      html: true,
      message: DashboardConstants.UIMessageConstants.STRING_AUTOPAYMENT_FORMULA,
      position: DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.RIGHT,
    }
  };
  rowIndex: number = 0;
  currentPageIndex: number = 1;
  penaltyPercentage: any = { Value: DashboardConstants.OpportunityFinderConstants.DEFAULT_PENALTY };
  editTextfield: boolean = true;
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

  };
  constants = DashboardConstants;
  @Input() config: any = {
    changeDetectionMutation: {},
    Confidence: {
      code: "0",
      name: DashboardConstants.UIMessageConstants.STRING_Confidence_Level
    }
  };
  @ViewChild('sliderContainer', { read: ViewContainerRef }) sliderContainerRef: ViewContainerRef;
  @ViewChild('CommonTemplate') CommonTemplateRef: TemplateRef<any>;
  @ViewChild('autoPaymentTermPopupRef', { read: ViewContainerRef }) autoPaymentTermPopupRef: ViewContainerRef;
  @ViewChild('cardTypeContainer', { read: ViewContainerRef }) cardTypeContainerRef: ViewContainerRef;


  constructor(
    private _staticLoader: StaticModuleLoaderService,
    public _appConstants: AppConstants,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _commonUrls: CommonUrlsConstants,
    private _commUtil: CommonUtilitiesService,
    private _oppFinderService: OpportunityFinderService,
    private _globalFilterService: GlobalFilterService,
    public _dashboardCommService: DashboardCommService,
    private _analyticsCommonDataService: AnalyticsCommonDataService,
    private _loaderService: LoaderService,
    private _cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('init');
    this.currentPageIndex = 1;
    this.setUIConfig();
    if (this._dashboardCommService.oppFinderState.editMode) {
      this.sliderConfig.from = this._dashboardCommService.oppFinderState.gridJson.costOfCapital;
      if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.shortName)
        this.selectedSupplier = this.supplierNameForEdit = this._dashboardCommService.oppFinderState.gridJson.supplierName;
      else if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.BPDC.shortName) {
        this.selectedSupplier = this.supplierNameForEdit = this._dashboardCommService.oppFinderState.gridJson.categoryName;
        this.categorylevel = this._dashboardCommService.oppFinderState.gridJson.categoryLevel;
      }
      this.generateCreateOppGridEditMode(this._dashboardCommService.oppFinderState.gridJson.supplierName, this._dashboardCommService.oppFinderState.gridJson.gridJson);
      this._appConstants.userPreferences.moduleSettings.showFilterIconOption = false;
      this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
      // this.selectedBestPaymentTerm = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
      this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_EDIT_OPPORTUNITY;
    }
    else {
      this.refreshSummaryCards();
      this.refreshGridDetails();
    }
    this.onApplyFilter();
  }

  ngAfterViewInit() {
    if (!this._dashboardCommService.oppFinderState.editMode) {
      setTimeout(() => {
        this.openOppfinderFormulaOverviewPopup();
      });
    }
    // this.loadSummaryCard();

    let $element = $(this._elementRef.nativeElement),
      editContainer = $element.find('.editable-div'),
      inputEle = $element.find('.editable-div .input-field input')
    if (inputEle) {
      inputEle.keyup((e) => {
        if (e.keyCode === 13) {
          inputEle.focus().blur().focus().val(inputEle.val());
          this.editTextfield = true;
          this.updatePenaltyPercentage();
        }
      });
    }
  }

  public async loadSummaryCard() {
    this.cardTypeContainerRef.clear();
    // let _summaryCardComponent: any = await this._commUtil.getLazyComponentReferences(LazyComponentConfiguration.CustomSummaryCardsWrapper);
    // if (_summaryCardComponent) {
    //   let _summaryCardComponentInstace: any = this.cardTypeContainerRef.createComponent(_summaryCardComponent);
    //   _summaryCardComponentInstace.instance.config = this.summaryCardConfig;
    // }
    this.cardTypeContainerRef.createEmbeddedView(this.CommonTemplateRef, {
      manifestPath: 'custom-summary-card/custom-summary-card',
      config: { config: this.summaryCardConfig }
    });
  }
  ngOnDestroy() {
    // this.PurchasePriceContainerRef.clear();
    this.manageSubscription$.unsubscribe();
  }

  refreshGridDetails() {
    this.setGridData().then((gridConfig: any) => {
      extend(this.gridData.gridDetailsView, gridConfig);
      this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
    });
  }

  refreshSummaryCards() {
    this._loaderService.showGlobalLoader();
    let that = this;
    this.summaryCardConfig = [];

    // setting the sequence in which summary Cards should be displayed as index in the config array
    let summarySequence = {}, summaryDataCalls = [];
    summarySequence[this.invoiceCountSummaryCardId.toString().toLowerCase()] = 0;
    summarySequence[this.invoiceOnTimeSummaryCardId.toString().toLowerCase()] = 1;
    summarySequence[this.invoiceLateSummaryCardId.toString().toLowerCase()] = 2;

    this.config.dashletInfoArray.forEach(dashletInfo => {
      if (dashletInfo.widgetDataType === DashboardConstants.WidgetDataType.SummaryCard) {
        let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(dashletInfo.reportDetails);
        let dashletMetaData: any = this._commUtil.getDeReferencedObject(dashletInfo);
        reportDetailsMetaData.isGrandTotalRequired = false;
        reportDetailsMetaData.isSubTotalRequired = false;
        reportDetailsMetaData.isLazyLoadingRequired = true;
        reportDetailsMetaData["pageIndex"] = this.currentPageIndex = 1;
        reportDetailsMetaData["reportRequestKey"] = dashletMetaData.reportRequestKey;
        let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);
        that.config.WidgetDataRecordLength = 0;
        // that.manageSubscription$.add(
        summaryDataCalls[summarySequence[reportDetailsMetaData.reportDetailObjectId.toString().toLowerCase()]] = this._analyticsCommonDataService.generateReport(reportDetailsData);
        // );
      }
    });

    Observable.forkJoin(summaryDataCalls).subscribe(([invoiceCountResponse, invoiceOnTimeResponse, invoiceLateResponse]) => {
      if (invoiceCountResponse != undefined
        && invoiceOnTimeResponse != undefined
        && invoiceLateResponse != undefined) {
        // that.config.WidgetDataRecordLength = response.Data.length;
        // // that.generateGrid(reportDetailsMetaData, response);
        // // that.initDone = true;
        // // response = that.setGridData();
        // gridConfig = that.generateGrid(reportDetailsMetaData, response);
        // this.flexGridPagination(response, true);
        // this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
        let invoiceCountReportDetails: any = find(this.config.dashletInfoArray, (dashlet) => { return dashlet.reportDetailsId.toString().toLowerCase() == this.invoiceCountSummaryCardId.toString().toLowerCase() }).reportDetails;
        let invoiceOnTimeReportDetails: any = find(this.config.dashletInfoArray, (dashlet) => { return dashlet.reportDetailsId.toString().toLowerCase() == this.invoiceOnTimeSummaryCardId.toString().toLowerCase() }).reportDetails;
        let invoiceLateReportDetails: any = find(this.config.dashletInfoArray, (dashlet) => { return dashlet.reportDetailsId.toString().toLowerCase() == this.invoiceLateSummaryCardId.toString().toLowerCase() }).reportDetails;

        this.summaryCardConfig.push({
          cardId: this.invoiceCountSummaryCardId,
          cardTitle: invoiceCountReportDetails.lstReportObjectOnValue[0].reportObjectName,
          reportDetails: invoiceCountReportDetails,
          changeDetectionMutation: {},
          driveConfig: {
            driveConfigDescription: '',
          },
          isRemoved: false,
          subscriptions: this.config.subscriptions,
          config: this.setSummaryCardConfig(invoiceCountResponse, invoiceCountReportDetails)
        });
        this.summaryCardConfig.push({
          cardId: this.invoiceOnTimeSummaryCardId,
          cardTitle: invoiceOnTimeReportDetails.lstReportObjectOnValue[0].reportObjectName,
          reportDetails: invoiceOnTimeReportDetails,
          changeDetectionMutation: {},
          driveConfig: {
            driveConfigDescription: '',
          },
          isRemoved: false,
          subscriptions: this.config.subscriptions,
          config: this.setSummaryCardConfig(invoiceOnTimeResponse, invoiceOnTimeReportDetails)
        });
        this.summaryCardConfig.push({
          cardId: this.invoiceLateSummaryCardId,
          cardTitle: invoiceLateReportDetails.lstReportObjectOnValue[0].reportObjectName,
          reportDetails: invoiceLateReportDetails,
          changeDetectionMutation: {},
          driveConfig: {
            driveConfigDescription: '',
          },
          isRemoved: false,
          subscriptions: this.config.subscriptions,
          config: this.setSummaryCardConfig(invoiceLateResponse, invoiceLateReportDetails)
        });
        this.loadSummaryCard();
        this._loaderService.hideGlobalLoader();
      }
      else {
        if (invoiceCountResponse['Data'].toString().toLowerCase() === "error"
          || invoiceOnTimeResponse['Data'].toString().toLowerCase() === "error"
          || invoiceLateResponse['Data'].toString().toLowerCase() === "error") {
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
    }, (error) => {
      that._commUtil.getMessageDialog(
        `Status:${error.status}  Something Went wrong with ${error.message}`,
        ()=>{}
      );
    })
  }

  onApplyFilter() {
    let thisRef = this;
    this.manageSubscription$.add(
      this._dashboardCommService.apppliedFilterDataSource$.subscribe((data) => {
        this.selectedFilter = [];
        if (data !== undefined) {
          for (let filter of data.validatedTabs) {
            if (filter.FilterType === DashboardConstants.FilterType.MultiSelect && filter.FilterBy === DashboardConstants.FilterBy.FilterBySelection) {
              for (let i of filter.selectedFilterList) {
                if (filter.selectedFilterList.length > 1) {
                  filter.filterchipName = filter.selectedFilterList[0].title + ' +' + (filter.selectedFilterList.length - 1) + 'more'
                }
                else {
                  filter.filterchipName = filter.selectedFilterList[0].title;
                }
                if (filter.selectedFilterList.length > 20) {
                  this.showSelectedText = DashboardConstants.UIMessageConstants.STRING_SHOWALLSELECTED.replace('@', '20').replace('~', filter.selectedFilterList.length)
                }
                else {
                  this.showSelectedText = DashboardConstants.UIMessageConstants.STRING_SHOWALL
                }
              }
            }
            else if (filter.FilterBy == DashboardConstants.FilterBy.FilterByCondition || filter.FilterType != DashboardConstants.FilterType.MultiSelect) {
              filter.filterchipName = filter.FilterTabInfo;
            }
          }

          // apply the previously saved filters as already applied on loading view
          // if (data.savedFilters != undefined && data.savedFilters.length !== 0) {
          //   data.savedFilters.forEach((savedFilter) => {
          //     this._dashboardCommService.appliedFilters.push(AnalyticsUtilsService.savedViewFilterToAppliedFilter(savedFilter, {
          //       listAllCrossSuiteFilterMapping: this._dashboardCommService.listAllCrossSuiteFilterMapping,
          //       listAllReportObjectWithMultiDatasource: this._dashboardCommService.listAllReportObjectWithMultiDatasource
          //     }));
          //   });
          //   data.validatedTabs = this._dashboardCommService.appliedFilters;
          //   // //making a dirty copy of filters which will be used to maintain the current state of filters, user iteractions will be saved in this copy and original clean filters will be replaced by this dirty object on saving the view
          //   // this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters_dirty = Object.assign([], this.dashboardConfig.viewListConfig.selectedDashboard.lstDashboardFilters);
          // }
          if (data.validatedTabs != undefined && data.validatedTabs.length !== 0) {
            if (data.validatedTabs.length > 5) {
              
                this._commUtil.getMessageDialog("You can add only 5 Global Filters",
                ()=>{},
                  DashboardConstants.OpportunityFinderConstants.STRING_INFORM);
               
            }
            else {
              //this.removeDrive();
              this.isGlobalFilterApplied = true;
              this.showChipBar = true;
              this._dashboardCommService.appliedFilters = data.validatedTabs;
              if (this._dashboardCommService.appliedFilters.length > 0) {
                // this.refreshGlobalFiltersList();
                if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
                  this.renderWidgetForGlobalFilter();
                }
                // else if (this._dashboardCommService.listofDistinctWidgetDataSource.length > 1) {
                //   this.renderWidgetForCrossSuiteFilter();
                // }
              }
            }
          }
          else if (data.validatedTabs.length == 0 && this.isGlobalFilterApplied) {
            this.showChipBar = false;
            this.isGlobalFilterApplied = false;
            this.refreshSummaryCards();
            this.refreshGridDetails();
          }
          else {
            this.showChipBar = false;
          }
        }
      })
    );
  }
  enableDisableFlgs(obj) {
    let s = obj.selectedObj,
      e = obj.event;
    //this.oppfinderCreationData = this.grid.collectionView._view;
    if (s === undefined) {
      setTimeout(() => {
      }, 0);
      return;
    }
    s.hostElement.addEventListener('click', (e) => {
      var ht = s.hitTest(e);
      if (ht.panel == s.cells) {
        s.panel;
        if (obj.grid.columns[ht.col].header === DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent) {
          setTimeout(() => {
            // if (that.editTextfield === false) {
            //     // that.updateSavings(that);
            // }
            let $element = $(this._elementRef.nativeElement),
              editContainer = $element.find('.editable-div'),
              inputEle = $element.find('.editable-div .input-field input'),
              element = obj.grid.cells.getCellElement(ht.row, ht.col),
              left = $(element).offset().left;
            let top = $(element).offset().top;
            //inputEle.focus().blur().focus().val(inputEle.val());
            editContainer.css("left", left + (element.offsetWidth - 45));
            //editContainer.css("top", 260 + ht.row * element.offsetHeight);
            editContainer.css("top", top - (element.offsetHeight / 1.8));
            this.rowIndex = ht.row;
            this.penaltyPercentage.Value = this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView ? this.gridData.gridDetailsView.series[this.rowIndex][DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] : this.gridData.createOpportunityView.series[this.rowIndex][DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent];
            //this.updatePenaltyPercentage();
            this.editTextfield = false;
          }, 0);

        } else if (this.rowIndex != undefined && this.editTextfield === false) {
          this.editTextfield = true;
          // that.updateSavings(that);
        }
      }
      this.editTextfield = true;
      e.stopImmediatePropagation();
    }, true);

    if (e.col === 0) {
      if (this.penaltyPercentage.Value != null) {
        this.editTextfield = true;
      } else {
        this.editTextfield = true;
      }

    }

  }
  private renderWidgetForGlobalFilter(isWidgetInitialized: boolean = true) {
    this.config.dashletInfoArray.forEach((dashletInfoObject: any) => {
      if (!dashletInfoObject.isRemoved) {
        var lstFilterReportObject = [];
        /**
        *  Removing Report Objfect from lstFilterReportObject other than contains has isGlobalFilter = 1
        */
        dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_globalWidgetFilter: any, _golbalWidgetFilterKey: any) => {
          each(this._dashboardCommService.appliedFilters, (_appliedfilterValues: IReportingObjectMultiDataSource, _appliedfilterKeys: any) => {
            if (_globalWidgetFilter.reportObject.reportObjectId !== _appliedfilterValues.ReportObjectId &&
              _globalWidgetFilter.reportObject.reportObjectName !== _appliedfilterValues.ReportObjectName
            ) {
              if (_globalWidgetFilter.isGlobalFilter) {
                dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
              }
            }
          });
        });

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
              * Removing the Earlier Applied Global Filters
              */
              dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_globalWidgetFilter: any, _golbalWidgetFilterKey: any) => {
                if (_globalWidgetFilter.reportObject.reportObjectId === _appliedfilterValues.ReportObjectId &&
                  _globalWidgetFilter.reportObject.reportObjectName === _appliedfilterValues.ReportObjectName
                ) {
                  if (_globalWidgetFilter.isGlobalFilter) {
                    dashletInfoObject.reportDetails.lstFilterReportObject.splice(_golbalWidgetFilterKey, 1);
                  }
                  else if (!_globalWidgetFilter.isGlobalFilter) {
                    dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].NestedReportFilterObject = null;
                    // dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].filterValue = [];
                    dashletInfoObject.reportDetails.lstFilterReportObject[_golbalWidgetFilterKey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
                  }
                }
              });

              let _checkfilterAlreadyExists = this.isFilterAlreadyExistInWidget(dashletInfoObject.reportDetails.lstFilterReportObject, _appliedfilterValues);
              _checkfilterAlreadyExists.IsPresent = false;
              _checkfilterAlreadyExists.filterObjectIndex = -1;
              /**
               *  Creating the Filter Report Object For the Loaded Widget.
               *
               */

              lstFilterReportObject = AnalyticsUtilsService.MapListOfEntityToArrayOfModel(lstFilterReportObject,
                this._commUtil.createFilterReportObject(
                  _appliedfilterValues, _checkfilterAlreadyExists, dashletInfoObject, Operators, FilterBy, listFilterValues,
                  DashboardConstants.ModuleType.DASHBOARD,
                  DashboardConstants.ViewFilterType.SingleSource
                ), new SavedFilter);

              if (lstFilterReportObject[0].filterValue[0] != DashboardConstants.DAXQueryManipulate.AllRecords) {
                if (!_checkfilterAlreadyExists.IsPresent) {
                  if (_checkfilterAlreadyExists.filterObjectIndex != -1) {
                    dashletInfoObject.reportDetails.lstFilterReportObject.splice(_checkfilterAlreadyExists.filterObjectIndex);
                  }
                  dashletInfoObject.reportDetails.lstFilterReportObject.push(lstFilterReportObject[0]);
                }
                else {
                  if (_checkfilterAlreadyExists.filterObjectIndex != -1) {
                    dashletInfoObject.reportDetails.lstFilterReportObject[_checkfilterAlreadyExists.filterObjectIndex] = lstFilterReportObject[0];
                  }
                }
              }
              lstFilterReportObject = [];
            }
          }
        });
        //console.log("Applied", dashletInfoObject.reportDetails.displayName, dashletInfoObject.reportDetails.lstFilterReportObject);
        //dashletInfoObject.sliderFilterArray = [];
        // this.getSlider(dashletInfoObject, isWidgetInitialized);
        // this._commUtil._globalSilderBehaviorSubject$.next({
        //   objDashletInfo: dashletInfoObject,
        //   isWidgetInitialized: isWidgetInitialized
        // });
      }
    });
    if (isWidgetInitialized) {
      this.refreshSummaryCards();
      this.refreshGridDetails();
    }
  }

  private isFilterAlreadyExistInWidget(
    _lstWidgetFilterReportObject: Array<SavedFilter>,
    _selectedReportingObject: IReportingObjectMultiDataSource): any {
    for (let intCheck = 0; intCheck < _lstWidgetFilterReportObject.length; intCheck++) {
      if (_lstWidgetFilterReportObject[intCheck].reportObject.reportObjectName === _selectedReportingObject.ReportObjectName &&
        _lstWidgetFilterReportObject[intCheck].reportObject.reportObjectId === _selectedReportingObject.ReportObjectId) {
        return { filterObjectIndex: intCheck, IsPresent: true };
      }
    }
    return { filterObjectIndex: -1, IsPresent: false };
  }

  setGridData() {
    this._loaderService.showGlobalLoader();
    return new Promise((resolve, reject) => {
      let that = this;
      let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
      reportDetailsMetaData.lstReportObjectOnRow[0] = this._commUtil.toCamelWrapper(this.supplierRO);
      reportDetailsMetaData.lstReportSortingDetails[1].reportObject = this._commUtil.toCamelWrapper(this.supplierRO);
      reportDetailsMetaData.lstReportSortingDetails[1].sortOrder = 2;
      reportDetailsMetaData.lstReportSortingDetails[1].sortType = 0;
      reportDetailsMetaData.isGrandTotalRequired = false;
      reportDetailsMetaData.isSubTotalRequired = false;
      reportDetailsMetaData.isLazyLoadingRequired = true;
      reportDetailsMetaData["pageIndex"] = this.currentPageIndex = 1;
      reportDetailsMetaData["reportRequestKey"] = reportDetailsMetaData.dataSourceObjectId;
      let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);
      that.config.WidgetDataRecordLength = 0;
      that.manageSubscription$.add(
        this._analyticsCommonDataService.generateReport(reportDetailsData)
          .subscribe((response) => {
            let gridConfig: any;
            if (response != undefined
              && response.Data != null
              && response.Data.length > 0
              && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
              that.config.WidgetDataRecordLength = response.Data.length;
              // that.generateGrid(reportDetailsMetaData, response);
              // that.initDone = true;
              // response = that.setGridData();
              gridConfig = that.generateGrid(reportDetailsMetaData, response);
              this.flexGridPagination(response, true);
              this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
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
            resolve(gridConfig);
          }, (error) => {
            that._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`,
              ()=>{}
              );
          })
      );
    });
  }

  public setSummaryCardConfig(_response: any, _reportDetailsMetaData: any) {
    return {
      changeDetectionMutation: {},
      showKebabMenusOption: false,
      showTitle: true,
      editDescription: false,
      showEdit: false,
      data: {
        cardValueSign: _response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName] < 0 ? '-' : '',
        value: this.getSummaryCardValue(_response, _reportDetailsMetaData),
        measure: _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === AnalyticsCommonConstants.CommonConstants.Percent || _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === "" ? "" : AnalyticsCommonConstants.FormatType[_reportDetailsMetaData.lstReportObjectOnValue[0].formatKey],
        description: "", // _reportDetailsMetaData.reportDescription,
        titleValue: this.getSummaryToolTipTilte(_response, _reportDetailsMetaData)
      },
      message: '',
      kebabMenuOptions: undefined,
    };
  }

  private generateGrid(reportDetailsMetaData: any, response: any): any {
    this.currentPageSupplierList = [];

    let gridConfig = {
      widgetDataType: 'grid',
      enableItemFormatter: true,
      enableEditCell: true,
      enableCellSelection: true,
      enableUpdate: true,
      enableStickyHeader: false,
      enableFilters: false,
      enableFooter: false,
      allowSorting: false,
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
      iconType: DashboardConstants.OpportunityFinderConstants.ICON_TYPE.text,
      radioConfig: {
        options: '2',
        value: []
      },
      column: []
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
          allowSorting: false
        })
      });
      // Insert custom columns for Best Payment date strategy

      gridConfig.column.push({
        aggregate: 0,
        binding: DashboardConstants.UIMessageConstants.STRING_CREATE_NEW,
        format: undefined,
        header: DashboardConstants.UIMessageConstants.STRING_CREATE_NEW,
        isReadOnly: true,
        visible: true,
        allowSorting: false
      });
    }
    return gridConfig;
  }
  private flexGridPagination(_daxResponse: any, isGridInitializing: boolean = true) {
    if (isGridInitializing) {
      this.gridData.gridDetailsView.pageData = [];
      this.gridData.gridDetailsView.pageSize = _daxResponse.PageSize;
      this.gridData.gridDetailsView.totalItems = _daxResponse.TotalRowCount;
      this.gridData.gridDetailsView.totalPages = Math.ceil(this.gridData.gridDetailsView.totalItems / this.gridData.gridDetailsView.pageSize);
      this.gridData.gridDetailsView.endPage = Math.ceil(this.gridData.gridDetailsView.totalItems / this.gridData.gridDetailsView.pageSize);
      this.gridData.gridDetailsView.currentPage = 0;
      // Checking the Current Page with +1 becuase Math.Ceil returns max value of 1 when devides with endPage
      this.gridData.gridDetailsView.isNext = (this.gridData.gridDetailsView.currentPage + 1) == this.gridData.gridDetailsView.endPage ? false : true;
      this.gridData.gridDetailsView.isPrev = this.gridData.gridDetailsView.currentPage == 0 ? false : true;
      this.gridData.gridDetailsView.startPage = 1;
      this.gridData.gridDetailsView.showPagination = this.gridData.gridDetailsView.totalItems <= this.gridData.gridDetailsView.pageSize ? false : true;
    }
    // _daxResponse = this.getWijmoFlexGridData(null, _daxResponse);
    //if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.shortName) {
    each(_daxResponse.Data, (record) => {
      record[DashboardConstants.UIMessageConstants.STRING_PENALTY_PERCENT] = DashboardConstants.OpportunityFinderConstants.DEFAULT_PENALTY;
      record[DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] = '';
      record[DashboardConstants.UIMessageConstants.STRING_CREATE_NEW] = DashboardConstants.UIMessageConstants.STRING_CREATE_NEW;
      this.currentPageSupplierList.push(record[this.supplierRO.ReportObjectName]);
    });
    //}

    if (_daxResponse.Data.length <= _daxResponse.PageSize - 1)
      this.gridData.gridDetailsView.pageData.push(_daxResponse.Data);
    else {
      _daxResponse.Data = _daxResponse.Data.splice(0, _daxResponse.Data.length - 1);
      this.gridData.gridDetailsView.pageData.push(_daxResponse.Data);
    }

    this.gridData.gridDetailsView.series = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage];
    this.updateFlexGridData();
  }

  public updateFlexGridData() {
    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      this.gridData.gridDetailsView.gridAPI.updateFlexGrid(this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage]);
    }
    this._loaderService.hideGlobalLoader();
  }
  public previousClick() {
    this.gridData.gridDetailsView.currentPage -= 1;
    this.currentPageIndex -= 1;
    this.gridData.gridDetailsView.isNext = !this.gridData.gridDetailsView.isNext ? !this.gridData.gridDetailsView.isNext : this.gridData.gridDetailsView.isNext;
    if (this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage] != undefined) {
      this.gridData.gridDetailsView.series = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage];
      this.updateFlexGridData();
      //this.UpdateFlexGridOpacity();
      if (this.gridData.gridDetailsView.currentPage == 0) this.gridData.gridDetailsView.isPrev = false;
    }
    else {
      this.gridData.gridDetailsView.isPrev = false;
    }
    this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
  }

  public nextClickPagination() {
    this._loaderService.showGlobalLoader();
    this.gridData.gridDetailsView.currentPage += 1;
    this.gridData.gridDetailsView.isPrev = true;
    this.gridData.gridDetailsView.isNext = (this.gridData.gridDetailsView.currentPage + 1) == this.gridData.gridDetailsView.endPage ? false : true;
    if (this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage] != undefined) {
      this.gridData.gridDetailsView.series = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage];
      this.updateFlexGridData();
      //this.UpdateFlexGridOpacity();
    }
    else {
      let reportDetailsMetaData = Object.assign({}, this.config.dashletInfoArray[0].reportDetails);
      this.currentPageIndex += 1;
      reportDetailsMetaData["pageIndex"] = this.currentPageIndex;
      reportDetailsMetaData["reportRequestKey"] = reportDetailsMetaData.dataSourceObjectId;
      reportDetailsMetaData.lstReportObjectOnRow[0] = this._commUtil.toCamelWrapper(this.supplierRO);
      reportDetailsMetaData.lstReportSortingDetails[1].reportObject = this._commUtil.toCamelWrapper(this.supplierRO);
      reportDetailsMetaData.lstReportSortingDetails[1].sortOrder = 2;
      reportDetailsMetaData.lstReportSortingDetails[1].sortType = 0;
      //this.generateReportDetailMetaData(reportDetailsMetaData);
      let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData);
      reportDetailsData.isGrandTotalRequired = false;
      reportDetailsData.isSubTotalRequired = false;
      reportDetailsData.isLazyLoadingRequired = true;
      this.manageSubscription$.add(
        this._analyticsCommonDataService
          .generateReport(reportDetailsData)
          .subscribe((response: any) => {
            if (this.getValidatedDAXResponse(response)) {
              this.gridData.gridDetailsView.showPagination = true;
              this.currentPageSupplierList = [];
              // this.currentPageLevel3CategoryList = [];
              // this.level4CategoryList.level3Category = "";
              // this.level4CategoryList.level4Categories = [];
              this.flexGridPagination(response, false);
              this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
              this.setState();
              this._loaderService.hideGlobalLoader();
              //this.UpdateFlexGridOpacity();
            }
          }, (error: any) => {
            this._loaderService.hideGlobalLoader();
          })
      );
    }
    this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
  }
  private getValidatedDAXResponse(response: any): boolean {
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

  onValueKeypress() {
    this.setState();
  }
  onFinish(event) {
    this.sliderConfig.from = event.from;
  }
  rangeOnChange(event) {

  }
  rangeOnUpdate(event) {

  }
  onFromRangeBlur(index, slider) {
    let sliderEntry = slider;
  }
  renderCommonContainer() {
    this.config.containerConfig = {};
    this.config.containerConfig.fields = this.setConfig();
    this.config.containerConfig.Confidence = this.config.Confidence;
    this.config.containerConfig.setState = this.setState.bind(this);
    //this.autoPaymentTermPopupRef.createEmbeddedView(this.CommonTemplateRef, { $implicit: this.config.containerConfig });
    this.autoPaymentTermPopupRef.createEmbeddedView(this.CommonTemplateRef, {
      manifestPath: 'common-popup-container/common-popup-container',
      config: { config: this.config.containerConfig }
    });
  }
  setConfig() {
    let masterData = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });
    this.config.EOI_Data = this._dashboardCommService.oppFinderMasterData.OpportunityFinderEOIMaster;
    this.config.opportunityTypeMasterData = masterData;
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
        selectedConfig: this.config.Confidence,
        Config: {
          label: DashboardConstants.UIMessageConstants.STRING_Confidence_Level,
          dataKey: "code",
          displayKey: "name",
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
      if (columnKey !== "" && columnKey !== "_id" && columnKey !== this.config.RONameForPopup
        && this.config.opportunityRowData.hasOwnProperty(columnKey)) {
        config.push({
          type: 'read-only',
          header: DashboardConstants.UIMessageConstants["STRING_" + columnKey[0].toUpperCase() + columnKey.substr(1, columnKey.length)],
          data: this.config.opportunityRowData[columnKey],
        });
      }
    }
    return config;
  }
  setUIConfig() {
    this.btnContinueConfig = {
      title: "continue",
      flat: false,
      disable: false
    }
    this.btnFinderOverViewConfig = {
      title: "Opportunity Finder Overview",
    };
    this.btnApplyConfig = {
      title: DashboardConstants.UIMessageConstants.STRING_APPLY_BTN_TEXT,
      flat: true,
      disable: false
    };
    this.btnFooterCancelConfig = {
      title: DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
      flat: true
    };
    this.btnPopupSaveConfig = {
      title: DashboardConstants.UIMessageConstants.STRING_SAVE_BTN,
      flat: true
    }
    this.btnFooterSaveConfig = {
      title: DashboardConstants.UIMessageConstants.STRING_SAVE_BTN,
      flat: false
    };
    this.btnFooterCloseConfig = {
      title: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN,
      flat: false
    }
    this._dashboardCommService.oppFinderState.extraProps = {
      currentState: undefined
    };

    // logic to get the supplier RO from additional props
    let masterData: any = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });
    if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
      masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
    }
    // this.bestPaymentTermRo = find(reportDetailsForGrid.lstReportObjectOnValue, (rO) => {
    //   return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.bestPaymentTerm_reportObjectId.toLowerCase();
    // });
    // this.spendRo = find(reportDetailsForGrid.lstReportObjectOnValue, (rO) => {
    //   return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.spend_reportObjectId.toLowerCase();
    // });
    // let extraRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
    //   return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.paymentTermName_reportObjectId.toLowerCase();
    // });
    // for (var key in extraRO) {
    //   if (extraRO.hasOwnProperty(key)) {
    //     this.paymentTermNameRO[camelCase(key)] = extraRO[key];
    //   }
    // }

    this.costOfCapitalRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.costOfCapital_reportObjectId.toLowerCase();
    });
    this.invoiceNumberRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.invoiceNumber_reportObjectId.toLowerCase();
    });
    this.paymentStatusRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.paymentStatus_reportObjectId.toLowerCase();
    });
    this.invoiceDateRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.invoiceDate_reportObjectId.toLowerCase();
    });
    this.paymentTermRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.paymentTerm_reportObjectId.toLowerCase();
    });
    this.penaltyPercentageRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.penaltyPercentage_reportObjectId.toLowerCase();
    });
    this.incurredPenaltiesRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.incurredPenalties_reportObjectId.toLowerCase();
    });
    this.potentialSavingRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.potentialSaving_reportObjectId.toLowerCase();
    });
    this.bestPaymentDateRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.bestPaymentDate_reportObjectId.toLowerCase();
    });
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.name)
      this.supplierRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.supplier_reportObjectId.toLowerCase();
      });
    else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDC.name) {
      this.supplierRO = this.level1categoryRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level1category_reportObjectId.toLowerCase();
      });
      this.level2categoryRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level2category_reportObjectId.toLowerCase();
      });
      this.level3categoryRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level3category_reportObjectId.toLowerCase();
      });
      this.level4categoryRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level4category_reportObjectId.toLowerCase();
      });
      let option1 = { "title": this.level1categoryRO.ReportObjectName, "op": 1 },
        option2 = { "title": this.level2categoryRO.ReportObjectName, "op": 2 },
        option3 = { "title": this.level3categoryRO.ReportObjectName, "op": 3 },
        option4 = { "title": this.level4categoryRO.ReportObjectName, "op": 4 }
      this.filterByNumberOpts.options.push(option1);
      this.filterByNumberOpts.options.push(option2);
      this.filterByNumberOpts.options.push(option3);
      this.filterByNumberOpts.options.push(option4);
      this.numberFilterObj = { "title": this.level1categoryRO.ReportObjectName, "op": 1 };
      this.categorylevel = this.numberFilterObj.title;
    }
    this.opportunityCreationreportDetailId = masterData.AdditionalProps.opportunityCreation_reportDetailId;
    this.invoiceCountSummaryCardId = masterData.AdditionalProps.invoiceCount_summaryCardId;
    this.invoiceOnTimeSummaryCardId = masterData.AdditionalProps.invoiceOnTime_summaryCardId;
    this.invoiceLateSummaryCardId = masterData.AdditionalProps.invoiceLate_summaryCardId;
    // else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
    //   this.level3CategoryRo = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
    //     return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level3Category_reportObjectId.toLowerCase();
    //   });
    //   this.level4CategoryRo = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
    //     return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level4Category_reportObjectId.toLowerCase();
    //   });
    // }
    //     this.btnDoneConfig = {
    //         title: this._dashboardCommService.oppFinderState.editMode ? "Update" : "Done",
    //         flat: false,
    //         disable: false
    //     };
    //     this.btnNextConfig = {
    //         title: "Next",
    //         flat: false,
    //         disable: false
    //     };
    //     this.btnCancelConfig = {
    //         title: "Cancel",
    //         flat: true,
    //         disable: this._dashboardCommService.oppFinderState.editMode ? true : false
    //     };
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


  openGlobalFilter(filter) {
    let isFilterOpen;
    isFilterOpen = this._globalFilterService.fadeOutDashboardGrid();
    let dashboardWrapper = document.getElementById('dashboard-container-id'),
      mainContainer = document.getElementById('main-container-id');
    if (isFilterOpen) {
      dashboardWrapper.classList.add("global-filter-fixed");
      mainContainer.classList.add("overflow-hide");
    }
    else {
      dashboardWrapper.classList.remove("global-filter-fixed");
      mainContainer.classList.remove("overflow-hide");
    }
    this._dashboardCommService.openFilterpop({
      LoadFilterPopup: true
    })
    this._globalFilterService.setActiveFilter(filter);
  }

  onMouseEnterChip(e, filterObj, index) {
    var findEle = this._elementRef.nativeElement.querySelector("#filteredChip" + index);
    if (findEle != undefined) {
      if (filterObj.FilterBy === DashboardConstants.FilterBy.FilterBySelection && (filterObj.FilterType === DashboardConstants.FilterType.MultiSelect)) {
        this._renderer.addClass(findEle, 'filters-upfront');
        this._renderer.setStyle(findEle, 'top', '158px');
      }
      else {
        this._renderer.removeClass(findEle, 'filters-upfront');
      }
    }
  }

  onMouseLeaveChip(index) {
    var findEle = this._elementRef.nativeElement.querySelector("#filteredChip" + index);
    if (findEle != undefined) {
      this._renderer.removeClass(findEle, 'filters-upfront');
    }
  }

  public removeCurrentChip(e, obj, reportObjectId) {
    this._commUtil.checkAllWidgetLoaded().then((_response: boolean) => {
      if (_response) {
        this.removefilterCurrentChip(e, obj, reportObjectId, true);
      }
    });
  }

  private removefilterCurrentChip(e, obj: IReportingObjectMultiDataSource, reportObjectId: string, isWidgetReload: boolean) {
    //When the Global is removed then Drive is getting removed irrespective of Dashboard View Type
    //this.removeDrive();
    let index = findIndex(this._dashboardCommService.appliedFilters, { ReportObjectId: reportObjectId });
    let _removedGlobalFilter = this._dashboardCommService.appliedFilters[index];
    this.config.dashletInfoArray.forEach((dashletInfoObject) => {
      if (!dashletInfoObject.isRemoved) {
        if (this._dashboardCommService.listofDistinctWidgetDataSource.length == 1) {
          /***
           *  Code for Removing the Applied Global Filter from dashlet Info Array based Upon IsGlobalFilter flag. ( Pretty Straight Forward).
           */
          dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_removeListFilterValue: any, _removeListFilterkey: any) => {
            if (_removeListFilterValue.reportObject.reportObjectId === _removedGlobalFilter.ReportObjectId &&
              _removeListFilterValue.reportObject.reportObjectName === _removedGlobalFilter.ReportObjectName) {
              if (_removeListFilterValue.isGlobalFilter) {
                dashletInfoObject.reportDetails.lstFilterReportObject.splice(_removeListFilterkey, 1);
              }
              else if (!_removeListFilterValue.isGlobalFilter) {
                dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].NestedReportFilterObject = null;
                // dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].filterValue = [];
                dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
              }
            }
          });
          // dashletInfoObject.sliderFilterArray = [];
          // this._commUtil._globalSilderBehaviorSubject$.next({
          //   objDashletInfo: dashletInfoObject,
          //   isWidgetInitialized: true
          // });
          // this.getSlider(dashletInfoObject, true);
        }
        else {
          /**
           * Code for Removing the Applied Cross Suite Global Filter from dashlet Info Array
           * basd upon the applied from datasource priorty level and removing the datasource object.
           * Flow diagram for removal of applied filter from chip in case of Cross Suite.
           * -----------------------------------------------------------------------------------------------------------
           *  Find DataSourcePriorty RO ===> Find DataSource RO from Mapping ===> Delete RO from Dashlet Info Array.
           * -----------------------------------------------------------------------------------------------------------
           * Getting the Cross Suite Reporting Mapping for the Removed Filter.
           */
          let _dsReportObject: IRelationObjectMapping = filter(_removedGlobalFilter.CrossSuiteFilterMapping.RelationObjectMapping,
            (_relValues: IRelationObjectMapping, _relKeys: any) => {
              return _relValues.DataSourceObjectId === dashletInfoObject.reportDetails.dataSourceObjectId;
            })[0];

          if (_dsReportObject != undefined) {
            //Getting the Specific Report Object Information from Multi Data Source to remove applied filter
            let _reportObjectInfo: IReportingObjectMultiDataSource = filter(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (
              _alldsROValues: IReportingObjectMultiDataSource, _alldsROKeys: any) => {
              return _alldsROValues.DataSource_ObjectId === _dsReportObject.DataSourceObjectId
                && _alldsROValues.ReportObjectId === _dsReportObject.ReportObjectId
            })[0];

            // deleting the Reporting object from DashletInfo Object Array.
            dashletInfoObject.reportDetails.lstFilterReportObject.forEach((_removeListFilterValue: any, _removeListFilterkey: any) => {
              if (_removeListFilterValue.reportObject.reportObjectId === _reportObjectInfo.ReportObjectId &&
                _removeListFilterValue.reportObject.reportObjectName === _reportObjectInfo.ReportObjectName) {
                if (_removeListFilterValue.isGlobalFilter) {
                  dashletInfoObject.reportDetails.lstFilterReportObject.splice(_removeListFilterkey, 1);
                }
                else if (!_removeListFilterValue.isGlobalFilter) {
                  dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].NestedReportFilterObject = null;
                  // dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].filterValue = [];
                  dashletInfoObject.reportDetails.lstFilterReportObject[_removeListFilterkey].SetConditionalOperator = DashboardConstants.ConditionalOperator.Nan;
                }
              }
            });
          }
        }
      }
    });
    if (isWidgetReload) {
      this.refreshSummaryCards();
      this.refreshGridDetails();
      this._globalFilterService.clearFilter(obj);
      this._dashboardCommService.appliedFilters.splice(index, 1);
      this._globalFilterService.removeFilter(obj);
      if (this._dashboardCommService.appliedFilters.length == 0) {
        this.showChipBar = false;
      }
    }
  }

  flexEvents(event) {
    let action = event.type;
    switch (action) {
      case "itemFormatter":
        this.drillGridItemformatter(event);
        break;
      case "render":
        this.gridRendered(event);
        break;
      case "celledit":
        break;
      case "selection":
        this.cellSelected(event);
        break;
    }
  }

  gridRendered(event) {
    if (event.grid.columns) {
      let gridColumns = [];
      switch (this._dashboardCommService.oppFinderState.extraProps.currentState) {
        case stateManagement.gridDetailsView:
          event.grid.allowMerging = 'All';
          gridColumns = this.gridData.gridDetailsView.column;
          break;
        case stateManagement.createOpportunityView:
          event.grid.allowMerging = 'All';
          gridColumns = this.gridData.createOpportunityView.column;
          break;
      }
      for (let RO_cnt = 0; RO_cnt < gridColumns.length; RO_cnt++) {
        if (event.grid.columns[RO_cnt]
          && event.grid.columns[RO_cnt] === this.supplierRO.ReportObjectName) {
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
      if (this._dashboardCommService.oppFinderState.extraProps.currentState != stateManagement.opportunityDetailsView) {
        if (flex.columns[obj.c].header === DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
        }
        else if (flex.columns[obj.c].header === DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
        }
        else if (flex.columns[obj.c].header === DashboardConstants.UIMessageConstants.STRING_CREATE_NEW) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
        }
      }
      else {
        if (flex.columns[obj.c].header === DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
        }
      }
    }
  }

  setDashboardCardMessage(message) {
    console.log(message)
  }

  cellSelected(event) {
    if (this._dashboardCommService.oppFinderState.extraProps.currentState === stateManagement.gridDetailsView) {
      // if (this.gridData.gridDetailsView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES && this.gridData.gridDetailsView.series[event.event.row][DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] != "") {
      //   this.generateSupplierWiseOpportunitiesGrid(event.event.row);
      // }
      // else
      if (this.gridData.gridDetailsView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_CREATE_NEW) {
        this.rowIndex = event.event.row;
        this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
        this.createNewOpp(event.event.row);
      }
      else if (this.gridData.gridDetailsView.column[event.event.col].header == DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent) {
        this.penaltyPercentage.Value = this.gridData.gridDetailsView.series[event.event.row][DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent];
        // if(this.validatePenaltyPercentage(this.penaltyPercentage.Value))
        this.enableDisableFlgs(event);
      }
    }
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState === stateManagement.createOpportunityView) {
      this.penaltyPercentage.Value = this.gridData.createOpportunityView.series[event.event.row][DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent];
      // if(this.validatePenaltyPercentage(this.penaltyPercentage.Value))
      this.enableDisableFlgs(event);
    }
  }
  generateOppFinderGridJSON() {
    return new Promise((resolve, reject) => {
      this.manageSubscription$.add(
        this._oppFinderService.getOppFinderGridJson(this._dashboardCommService.oppFinderState.oppFinderId)
          .subscribe((response) => {
            if (this._commUtil.isNune(response) && typeof response === 'string') {
              this._dashboardCommService.oppFinderState.gridJson = JSON.parse(response);
              // this.setState();
              // this.updateFlexGridData();
              this._loaderService.hideGlobalLoader();
            }
            resolve(true);
            this._loaderService.hideGlobalLoader();
          }, (error) => {
            this._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`,
              ()=>{}
              );
          })
      );
    });
  }
  generateSupplierWiseOpportunitiesGrid(rowIndex) {
    let gridConfig = {
      widgetDataType: 'grid',
      enableItemFormatter: true,
      enableEditCell: false,
      enableCellSelection: true,
      enableUpdate: true,
      enableStickyHeader: false,
      enableFilters: false,
      allowMerging: 'All',
      enableFooter: false,
      allowSorting: false,
      column: [],
      series: []
    }

    if (this.supplierWiseOpportunities && this.supplierWiseOpportunities[this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRO.ReportObjectName]]) {
      this.supplierNameForEdit = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRO.ReportObjectName];
      Object.keys(this.supplierWiseOpportunities[this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRO.ReportObjectName]][0]).forEach((col) => {
        if (DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns[col]) {
          gridConfig.column.push({
            aggregate: 0,
            binding: col,
            format: undefined,
            header: DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns[col],
            isReadOnly: true,
            allowMerging: true,
            allowSorting: false,
            visible: true
          });
        }
      });

      gridConfig.column.push({
        aggregate: 0,
        binding: DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit,
        format: undefined,
        header: DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit,
        isReadOnly: true,
        allowMerging: true,
        allowSorting: false,
        visible: true
      });
      gridConfig.series = Object.assign([], this.supplierWiseOpportunities[this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRO.ReportObjectName]]);
      gridConfig.series.forEach((record) => {
        record[DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit] = DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit;
      });
    }
    this.gridData.opportunityDetailsView = gridConfig;
    this._appConstants.userPreferences.moduleSettings.showFilterIconOption = false;
    this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.opportunityDetailsView;
    this.setState();
  }

  createNewOpp(rowIndex) {
    this._loaderService.showGlobalLoader();

    this.generateSupplierBasedReportDetails(rowIndex).then((reportDetailsForCreateOpp: any) => {

      let masterData: any = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });
      reportDetailsForCreateOpp.isGrandTotalRequired = false;
      reportDetailsForCreateOpp.isSubTotalRequired = false;
      reportDetailsForCreateOpp.isLazyLoadingRequired = false;
      reportDetailsForCreateOpp["pageIndex"] = this.currentPageIndex = 1;
      reportDetailsForCreateOpp["reportRequestKey"] = "6407b14b-0007-4fc4-bf6b-db648ea8b0ab1466240040000370146624";
      reportDetailsForCreateOpp.lstFilterReportObject.forEach(item => {
        if (typeof item.filterValue === 'string')
          item.filterValue = JSON.parse(item.filterValue);
      })
      let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsForCreateOpp);

      this.invoiceAmountRO = find(reportDetailsForCreateOpp.lstReportObjectOnValue, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.invoiceAmount_reportObjectId.toLowerCase();
      });
      this.invoiceNumberRO = find(reportDetailsForCreateOpp.lstReportObjectOnRow, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.invoiceNumber_reportObjectId.toLowerCase();
      });
      this.potentialSavingRO = find(reportDetailsForCreateOpp.lstReportObjectOnValue, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.potentialSaving_reportObjectId.toLowerCase();
      });
      this.penaltyPercentageRO = find(reportDetailsForCreateOpp.lstReportObjectOnValue, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.penaltyPercentage_reportObjectId.toLowerCase();
      });
      this.incurredPenaltiesRO = find(reportDetailsForCreateOpp.lstReportObjectOnValue, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.incurredPenalties_reportObjectId.toLowerCase();
      });
      this.discountPercentageRO = find(reportDetailsForCreateOpp.lstReportObjectOnRow, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.discountPercentage_reportObjectId.toLowerCase();
      });
      this.discountDaysRO = find(reportDetailsForCreateOpp.lstReportObjectOnRow, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.discountDays_reportObjectId.toLowerCase();
      });
      this.actualInvoiceClearingDate = find(reportDetailsForCreateOpp.lstReportObjectOnRow, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.invoiceClearingDate_reportObjectId.toLowerCase();
      });
      this.invoiceDueDate = find(reportDetailsForCreateOpp.lstReportObjectOnRow, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.invoiceDueDate_reportObjectId.toLowerCase();
      });
      this.discountLastDate = find(reportDetailsForCreateOpp.lstReportObjectOnRow, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.discountLastDate_reportObjectId.toLowerCase();
      });


      this.config.WidgetDataRecordLength = 0;
      this.manageSubscription$.add(
        this._analyticsCommonDataService.generateReport(reportDetailsData)
          .subscribe((response) => {
            if (response != undefined
              && response.Data != null
              && response.Data.length > 0
              && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
              this.config.WidgetDataRecordLength = response.Data.length;
              // this.generateGrid(reportDetailsMetaData, response);
              // this.initDone = true;
              // response = this.setGridData();
              this._appConstants.userPreferences.moduleSettings.showFilterIconOption = false;
              //this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
              this.generateCreateOppGrid(rowIndex, response);
              this._loaderService.hideGlobalLoader();
            }
            else {
              if (response.Data.toString().toLowerCase() === "error".toLowerCase()) {
                this.setDashboardCardMessage(`Report could not be loaded due to some issue(s). Please try again later.`);
              }
              else {
                // if (this.widget) {
                // 	this.widget.widgetDataType = this.config.widgetDataType;
                // }
                this.setDashboardCardMessage('No data returned for this condition. This might be because applied filter excludes all data.');
              }
            }
            this._loaderService.hideGlobalLoader();
          }, (error) => {
            this._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`,()=>{}
              );
          })
      );
    });
    console.log('createNew', rowIndex);
    // this.config.selectedPopupValue = name;
    // this.config.opportunityRowData = this.gridData.series[rowIndex];
  }

  generateSupplierBasedReportDetails(rowIndex) {
    return new Promise((resolve, reject) => {
      let reportDetailsForCreateOpp: any = {};
      this.selectedSupplier = this.supplierNameForEdit = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRO.ReportObjectName];

      //this.manageSubscription$.add(
      this._analyticsCommonDataService.getReportDetailsByReportId(this.opportunityCreationreportDetailId)
        .toPromise()
        .then((response) => {
          if (response != undefined
            && response != null
            && response.toString().toLowerCase() !== "error".toLowerCase()) {
            // for (var key in response) {
            //   if (response.hasOwnProperty(key)) {
            //     reportDetailsForCreateOpp[camelCase(key)] = response[key];
            //   }
            // }
            reportDetailsForCreateOpp = this._commUtil.toCamelWrapper(response);

            let filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.supplierRO, this.selectedSupplier);
            reportDetailsForCreateOpp.lstFilterReportObject.push(
              AnalyticsUtilsService.createDrillDriveFilterReportObj(
                { reportObject: this.supplierRO, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
              )
            );

            let costOfCapital = AnalyticsUtilsService.GetFormattedFilterValue(this.costOfCapitalRO, this.costOfCapital * 0.01);
            reportDetailsForCreateOpp.lstFilterReportObject.push(
              AnalyticsUtilsService.createDrillDriveFilterReportObj(
                { reportObject: this.costOfCapitalRO, filterValue: costOfCapital[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
              )
            );
          }
          else {
            if (response.toString().toLowerCase() === "error".toLowerCase()) {
              this.setDashboardCardMessage(`Report could not be loaded due to some issue(s). Please try again later.`);
            }
            else {
              this.setDashboardCardMessage('No data returned for this condition. This might be because applied filter excludes all data.');
            }
          }
          resolve(reportDetailsForCreateOpp);
        })

    })


    //);
  }
  generateSupplierBasedReportDetailsEditMode(supplierName) {
    let reportDetailsForCreateOpp = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
    this.selectedSupplier = supplierName;
    // this.selectedBestPaymentTerm = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
    reportDetailsForCreateOpp.lstReportObjectOnRow = filter(reportDetailsForCreateOpp.lstReportObjectOnRow, (_ro) => {
      return _ro.reportObjectId == this.supplierRO.ReportObjectId;
    });

    let filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.supplierRO, this.selectedSupplier)
    reportDetailsForCreateOpp.lstFilterReportObject.push(
      AnalyticsUtilsService.createDrillDriveFilterReportObj(
        { reportObject: this.supplierRO, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
      )
    );
    return reportDetailsForCreateOpp;
  }
  generateCreateOppGrid(rowIndex, response) {
    let gridConfig = {
      widgetDataType: 'grid',
      enableItemFormatter: true,
      enableEditCell: true,
      enableCellSelection: true,
      enableUpdate: true,
      enableStickyHeader: false,
      enableFilters: false,
      enableSorting: false,
      allowMerging: 'All',
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
      enableFooter: false,
      allowSorting: false,
      column: [],
      series: []
    }

    if (response && response.Data && this._commUtil.isNune(response.Data[0])) {
      Object.keys(response.Data[0]).forEach((col) => {
        if (col != 'Discount Days' && col != 'Discount %') {
          gridConfig.column.push({
            aggregate: 0,
            binding: col,
            format: undefined,
            header: col,
            isReadOnly: true,
            allowMerging: false,
            allowSorting: false,
            visible: true
          })
        }
      });

      gridConfig.series = Object.assign([], response.Data);
      this.totalSpend = sumBy(gridConfig.series, this.invoiceAmountRO.reportObjectName);
      this.totalSpend = Number(this.totalSpend.toFixed(2));
      this.totalPotentialSavings = sumBy(gridConfig.series, this.potentialSavingRO.reportObjectName);
      this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
      // this.effectiveAddressableSpend = gridConfig.series.length * gridConfig.series[0][this.penaltyPercentageRO.reportObjectName] * 0.01 * this.totalSpend;
      // this.effectiveAddressableSpend = Number(this.effectiveAddressableSpend.toFixed(2));
      //this.weightedAvgAddressableSpend = this.gridData.gridDetailsView.series[rowIndex][this.penaltyPercentageRO.reportObjectName];
      let totalRow: any = {};
      totalRow[this.supplierRO.ReportObjectName] = response.Data[0][this.supplierRO.ReportObjectName];
      // totalRow[this.bestPaymentTermRo.reportObjectName] = response.Data[0][this.bestPaymentTermRo.reportObjectName];
      totalRow[this.invoiceNumberRO.reportObjectName] = DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT;
      totalRow[this.invoiceAmountRO.reportObjectName] = this.totalSpend;
      // totalRow[this.penaltyPercentageRO.reportObjectName] = this.weightedAvgAddressableSpend;
      totalRow[this.penaltyPercentageRO.reportObjectName] = "";
      totalRow[this.potentialSavingRO.reportObjectName] = this.totalPotentialSavings;
      gridConfig.series.push(totalRow);

    }

    this.gridData.createOpportunityView = gridConfig;
    this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
    this.setState();
  }
  generateCreateOppGridEditMode(supplierName, response) {
    let gridConfig = {
      widgetDataType: 'grid',
      enableItemFormatter: true,
      enableEditCell: true,
      enableCellSelection: true,
      enableUpdate: true,
      enableStickyHeader: false,
      enableFilters: false,
      enableSorting: false,
      allowMerging: 'All',
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
      enableFooter: false,
      allowSorting: false,
      column: [],
      series: []
    }

    if (response && this._commUtil.isNune(response[0])) {
      Object.keys(response[0]).forEach((col) => {
        if (col != DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.discountDays
          && col != DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.discountPercent
          && col != DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.discountLastDate) {
          gridConfig.column.push({
            aggregate: 0,
            binding: col,
            format: undefined,
            header: col,
            isReadOnly: DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent == col ? false : true,
            // allowMerging: this.supplierRO.ReportObjectName == col || this.bestPaymentTermRo.reportObjectName == col ? true : false,
            allowMerging: false,
            allowSorting: false,
            visible: true
          })
        }
      });
      // Insert custom columns for Auto Payment term strategy
      // gridConfig.column.push({
      //     aggregate: 0,
      //     binding: DashboardConstants.UIMessageConstants.STRING_BEST_PAYMENT_TERM,
      //     format: undefined,
      //     header: DashboardConstants.UIMessageConstants.STRING_BEST_PAYMENT_TERM,
      //     isReadOnly: false,
      //     allowMerging: false,
      //     visible: true
      // });
      // gridConfig.column.push({
      //   aggregate: 0,
      //   binding: this.penaltyPercentageRO.reportObjectName,
      //   format: undefined,
      //   header: this.penaltyPercentageRO.reportObjectName,
      //   isReadOnly: false,
      //   allowMerging: false,
      //   allowSorting: false,
      //   visible: true
      // });
      // add potential savings column here
      // gridConfig.column.push({
      //   aggregate: 0,
      //   binding: DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS,
      //   format: undefined,
      //   header: DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS,
      //   isReadOnly: true,
      //   allowMerging: false,
      //   allowSorting: false,
      //   visible: true
      // });

      // response.Data.forEach((record) => {
      //   let summationProductAddressableSpend: number;
      //   record[this.penaltyPercentageRO.reportObjectName] = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.penaltyPercentageRO.reportObjectName];
      //   // dummy data
      //   record[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = 0;
      //   // (
      //   //   (
      //   //     (
      //   //       this.selectedBestPaymentTerm - record[this.paymentTermNameRO.reportObjectName]
      //   //     ) / 365
      //   //   )
      //   //   * this.costOfCapital * record[this.penaltyPercentageRO.reportObjectName] * record[this.spendRo.reportObjectName]
      //   // ) / (100 * 100);
      //   summationProductAddressableSpend += (record[this.penaltyPercentageRO.reportObjectName] * record[this.invoiceAmountRO.reportObjectName] * 0.01);
      // });
      gridConfig.series = Object.assign([], response);
      this.gridData.createOpportunityView = gridConfig;
      this.sliderConfig.from = this.costOfCapital = this._dashboardCommService.oppFinderState.gridJson.costOfCapital;
      // this.refreshNewOld.date = this._dashboardCommService.oppFinderState.gridJson.dataDate;
    }
    else if (response && this._commUtil.isNune(response)) {
      this.gridData.createOpportunityView.series = response;
      let totalRow: any = {};
      totalRow[this.supplierRO.ReportObjectName] = supplierName;
      // totalRow[this.bestPaymentTermRo.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
      // totalRow[this.paymentTermNameRO.reportObjectName] = DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT;
      // totalRow[this.spendRo.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.spend;
      // totalRow[this.penaltyPercentageRO.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.addressableSpend;
      totalRow[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] = "";
      totalRow[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.potentialSaving] = this._dashboardCommService.oppFinderState.gridJson.savings;
      gridConfig.series.push(totalRow);
      this.setState();
      this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
      this.sliderConfig.from = this.costOfCapital = this._dashboardCommService.oppFinderState.gridJson.costOfCapital;
      // this.refreshNewOld.date = this._dashboardCommService.oppFinderState.gridJson.dataDate;

    }

    this.totalSpend = find(this.gridData.createOpportunityView.series, (row) => row[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceNumber] == DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT)[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount];
    this.totalSpend = Number(this.totalSpend.toFixed(2));
    this.totalPotentialSavings = find(this.gridData.createOpportunityView.series, (row) => row[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceNumber] == DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT)[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.potentialSaving];
    this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
    // this.effectiveAddressableSpend = this.gridData.createOpportunityView.series.length * this.gridData.createOpportunityView.series[0]['Penalty %'] * 0.01 * this.totalSpend;
    // this.effectiveAddressableSpend = Number(this.effectiveAddressableSpend.toFixed(2));
    this.weightedAvgAddressableSpend = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
    this.setState();
  }
  updatePenaltyPercentage() {
    if (this.validatePenaltyPercentage(this.penaltyPercentage.Value)) {
      // if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      //   this.gridData.gridDetailsView.series = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage];
      //   this.gridData.gridDetailsView.series[this.rowIndex][this.penaltyPercentageRO.reportObjectName] = this.penaltyPercentage.Value;
      //   this.potentialSavingsCalculation();
      //   this.updateFlexGridData();
      // }
      // else {
      this.gridData.createOpportunityView.series[this.rowIndex][DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] = this.penaltyPercentage.Value;
      this.potentialSavingsCalculation();
      this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
      //}
    }
    else this.penaltyPercentage.Value = this.gridData.createOpportunityView.series[this.rowIndex][DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent];
    //}
  }
  // }
  public onDocumentClick(event): void {
    if (this.penaltyPercentage.Value != null) {
      let element = this._elementRef.nativeElement,
        editContainer = element.querySelector('.editable-div');
      if (!editContainer.contains(event.target)) {
        if (this.rowIndex != undefined && this.editTextfield === false) {
          this.editTextfield = true;
          // this.updateSavings(this);
        }

      }
    } else {
      let element = this._elementRef.nativeElement,
        editContainer = element.querySelector('.editable-div');
      if (!editContainer.contains(event.target)) {
        this.editTextfield = true;
      }
    }

  }
  calcualteSavingsOnPaymentTerm(item) {
    let savings1 = ((item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.discountPercent] * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount]) + (item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount]) - (this.costOfCapital * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount] * (this.calculateDays(item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.actualInvoiceClearingDate], item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.discountLastDate])))),

      savings2 = (((item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount])) - (this.costOfCapital * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount] * (this.calculateDays(item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.actualInvoiceClearingDate], item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceDueDate]))))

    return savings1 >= savings2 ? savings1 : savings2
  }
  calculateDays(date1, date2) {
    let days,
      higherDate = new Date(date1),
      lowerDate = new Date(date2);

    days = ((higherDate.getTime() - lowerDate.getTime()) / (1000 * 3600 * 24)) / 365;

    return days
  }
  potentialSavingsCalculation() {
    //let summationProductAddressableSpend: number = 0,difference;
    this.totalSpend = 0;
    this.totalPotentialSavings = 0;
    // this.effectiveAddressableSpend = 0;
    // this.weightedAvgAddressableSpend = 0;
    // let totalSpend: number = 0;
    // if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
    //   this.gridData.gridDetailsView.series.forEach((item, index) => {
    //     if (this.validatePenaltyPercentage(item[this.penaltyPercentageRO.reportObjectName])) {
    //       // item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = (difference[index] / 365) * ((this.costOfCapital * item[this.penaltyPercentageRO.reportObjectName]) / (100 * 100));
    //       item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = (difference[index] / 365) * this.costOfCapital * 0.01 * 0.01 * item[this.penaltyPercentageRO.reportObjectName] * item[this.invoiceAmountRO.reportObjectName];
    //     }
    //   });
    //   this.updateFlexGridData();
    // }


    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.createOpportunityView) {
      if (this._dashboardCommService.oppFinderState.editMode) {
        this.gridData.createOpportunityView.series.forEach((item) => {
          if (this.validatePenaltyPercentage(item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent])) {
            if (item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceNumber] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {
              //item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] =
              if (item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.discountPercent] != "") {
                item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.potentialSaving] = this.calcualteSavingsOnPaymentTerm(item);
              }
              else {
                item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.potentialSaving] = ((item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] * 0.01) * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount]) - (this.costOfCapital * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount] * (this.calculateDays(item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.actualInvoiceClearingDate], item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceDueDate])));
              }

              this.totalSpend += item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount];
              this.totalPotentialSavings += item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.potentialSaving];
              item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.incurredPenalties] = item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] * 0.01 * item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount];
            }
          }
        });

      }
      else {
        this.gridData.createOpportunityView.series.forEach((item, index) => {
          if (this.validatePenaltyPercentage(item[this.penaltyPercentageRO.reportObjectName])) {
            if (item[this.invoiceNumberRO.reportObjectName] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {

              if (item[this.discountPercentageRO.reportObjectName] != "") {
                item[this.potentialSavingRO.reportObjectName] = this.calcualteSavingsOnPaymentTerm(item);
              }
              else {
                item[this.potentialSavingRO.reportObjectName] = ((item[this.penaltyPercentageRO.reportObjectName] * 0.01) * item[this.invoiceAmountRO.reportObjectName]) - (this.costOfCapital * 0.01 * item[this.invoiceAmountRO.reportObjectName] * (this.calculateDays(item[this.actualInvoiceClearingDate.reportObjectName], item[this.invoiceDueDate.reportObjectName])));
              }
              this.totalSpend = (this.totalSpend + item[this.invoiceAmountRO.reportObjectName]);
              this.totalPotentialSavings += item[this.potentialSavingRO.reportObjectName];
              item[this.incurredPenaltiesRO.reportObjectName] = item[this.penaltyPercentageRO.reportObjectName] * 0.01 * item[this.invoiceAmountRO.reportObjectName];
            }
          }
        });
      }
      this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
      this.totalSpend = Number(this.totalSpend.toFixed(2));

      this.gridData.createOpportunityView.series.forEach((item, index) => {
        if (item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceNumber] == DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {
          item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceAmount] = this.totalSpend;
          item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] = "";
          item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.incurredPenalties] = "";
          item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.potentialSaving] = this.totalPotentialSavings;
        }
      });
      this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
    }
  }

  applyToAll() {
    this.editTextfield = true;
    if (this.validatePenaltyPercentage(this.penaltyPercentage.Value)) {
      // if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      //   this.gridData.gridDetailsView.series.forEach((item) => {
      //     item[this.penaltyPercentageRO.reportObjectName] = this.penaltyPercentage.Value;
      //   });
      // }
      if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.createOpportunityView) {
        this.gridData.createOpportunityView.series.forEach((item) => {
          if (item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] != 0 && item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.invoiceNumber] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT)
            item[DashboardConstants.OpportunityFinderConstants.BestPaymentTermGridColumns.penaltyPercent] = this.penaltyPercentage.Value;
        });
      }
      this.potentialSavingsCalculation();
    }
  }
  validatePenaltyPercentage(addressableSpend) {
    if (addressableSpend > 100 || addressableSpend < 0 || addressableSpend == null) {
      this._commUtil.getMessageDialog(
        DashboardConstants.UIMessageConstants.STRING_PENALTY_PERCENT_MESSAGE,
        ()=>{}
        );
      return false;
    }
    else {
      return true;
    }
  }
  popupConfig() {
    let popupConfig: any
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.name) {
      popupConfig = {
        // targetedBestPaymentTerm: this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked ? this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm : this.selectedBestPaymentTerm,      
        supplier: this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.supplierName : this.supplierNameForEdit,
        //costOfCapital: this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked ? this._dashboardCommService.oppFinderState.gridJson.costOfCapital : this.costOfCapital,
        totalInvoiceAmount: this.totalSpend,
        totalPotentialSavings: this.totalPotentialSavings,
        //totalInvoiceAmount: this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked ? this._dashboardCommService.oppFinderState.gridJson.totalInvoiceAmount : this.totalSpend,
      };
    } else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDC.name) {
      popupConfig = {
        categoryName: this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.categoryName : this.supplierNameForEdit,
        categoryLevel: this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.categoryLevel : this.categorylevel,
        totalInvoiceAmount: this.totalSpend,
        totalPotentialSavings: this.totalPotentialSavings
      }
    }
    return popupConfig;
  }
  onApply() {
    // let difference = this.differenceCalculation();
    if (this._dashboardCommService.oppFinderState.editMode) {
      this._dashboardCommService.oppFinderState.gridJson.costOfCapital = this.sliderConfig.from;
    }
    this.costOfCapital = this.sliderConfig.from;
    // this.potentialSavingsCalculation(difference);
    this.config.dashletInfoArray.forEach((dashletInfoObject: any) => {
      let _costOfCapitalFilterRO = find(dashletInfoObject.reportDetails.lstFilterReportObject, (filterObj) => {
        return filterObj.reportObject.reportObjectId.toLowerCase() == this.costOfCapitalRO.ReportObjectId.toLowerCase();
      });

      if (this._commUtil.isNune(_costOfCapitalFilterRO)) {
        _costOfCapitalFilterRO.filterValue = [this.costOfCapital * 0.01];
      }
      console.log(_costOfCapitalFilterRO);
    });
    this.refreshGridDetails();
    // update logi for create opp grid
    this.potentialSavingsCalculation();
    this.setState();
  }

  private getSummaryToolTipTilte(_response: any, _reportDetailsMetaData: any) {
    const _formatKeySign: string =
      _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === AnalyticsCommonConstants.CommonConstants.Percent || _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === "" ? "" : AnalyticsCommonConstants.FormatType[_reportDetailsMetaData.lstReportObjectOnValue[0].formatKey];

    return _reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName + ":" + _formatKeySign + numberFormat(_response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName], 2) + (
      _reportDetailsMetaData.lstReportObjectOnValue[0].formatKey === AnalyticsCommonConstants.CommonConstants.Percent ? AnalyticsCommonConstants.FormatType[_reportDetailsMetaData.lstReportObjectOnValue[0].formatKey] : ''
    )
  }

  private getSummaryCardValue(_response: any, _reportDetailsMetaData: any): string {
    switch (_reportDetailsMetaData.lstReportObjectOnValue[0].formatKey) {
      //For percent value multiply the value by 100.
      case AnalyticsCommonConstants.CommonConstants.Percent:
        return ((AnalyticsUtilsService.GetChartMetricFormttedValue((_response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName]) * 100, DashboardConstants.SummaryCardFixedValue))) + AnalyticsCommonConstants.FormatType.PERCENT;
      //For integer value there should be no decimal place.
      case '':
        return AnalyticsUtilsService.GetChartMetricFormttedValue(_response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName], DashboardConstants.SummaryCardIntegerValue);
      //this is the default case for all the rest of the values.
      default:
        return AnalyticsUtilsService.GetChartMetricFormttedValue(_response.GrandTotal[_reportDetailsMetaData.lstReportObjectOnValue[0].reportObjectName], DashboardConstants.SummaryCardFixedValue);
    }
  }


  footerCancelClick() {
    this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
    // this.refreshNewOld.text = DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_LATEST_VALUES;
    if (this._dashboardCommService.oppFinderState.editMode) {
      this._dashboardCommService.oppFinderState.editMode = false;
      window.location.href = this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;
    }
    else {
      this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
      this.gridData.gridDetailsView.showPagination = true;
      this.updateFlexGridData();
    }
  }
  footerSaveClick() {
    this.config.opportunityRowData = this.popupConfig();
    this.config.OpportunityName.value = this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.opportunityName : "";
    this.config.OpportunityDescription.value = this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.opportunityDescription : "";
    this.config.Confidence = this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.Confidence : this.config.Confidence;
    this.gridData.gridDetailsView.showPagination = false;
    this.showSavePopup = true;
    this.renderCommonContainer();
  }
  onCancel() {
    this.showSavePopup = false;
    this.autoPaymentTermPopupRef.detach();
  }
  onSaveClick() {
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
      if (!this._commUtil.isNune(this.config.OpportunityName.value)) {
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_NAME,
          ()=>{},
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        ) 
      }
      else if (!this._commUtil.isNune(this.config.OpportunityDescription.value)) {
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_DESC,
          ()=>{},
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        )
      }
      else if (!this.config.Confidence || !this.config.Confidence.name || this.config.Confidence.name == DashboardConstants.UIMessageConstants.STRING_Confidence_Level) {
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_EOI,
          ()=>{},
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        ) 
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
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        )
      }
      else {
        resolve(true);
      }
    })
  }

  private saveOpportunityFinderDetails() {
    try {
      this._loaderService.showGlobalLoader();
      let totalSpend: number = this.config.opportunityRowData["totalInvoiceAmount"],
        totalSavings: number = this.config.opportunityRowData["totalPotentialSavings"],
        totalEstimatedSavings: number = this.config.opportunityRowData["totalPotentialSavings"];
      let dateObj = new Date(),
        gridJson: any;
      if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.name) {
        gridJson = {
          opportunityName: this.config.OpportunityName.value,
          opportunityDescription: this.config.OpportunityDescription.value,
          spend: totalSpend,
          costOfCapital: this.costOfCapital,
          addressableSpend: this.weightedAvgAddressableSpend,
          //countPaymentTerm: this.gridData.createOpportunityView.series.length,
          // bestPaymentTerm: this.selectedBestPaymentTerm,
          //effectiveAddressableSpend: this.effectiveAddressableSpend,
          savings: totalEstimatedSavings,
          EOI_Data: this.config.EOI_Data,
          Confidence: this.config.Confidence,
          supplierName: this.supplierNameForEdit,
          gridJson: this.gridData.createOpportunityView.series,
          dataDate: this._commUtil.getDateInFormat(dateObj)

        }
      }
      else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDC.name) {
        gridJson = {
          opportunityName: this.config.OpportunityName.value,
          opportunityDescription: this.config.OpportunityDescription.value,
          spend: totalSpend,
          costOfCapital: this.costOfCapital,
          addressableSpend: this.weightedAvgAddressableSpend,
          savings: totalEstimatedSavings,
          EOI_Data: this.config.EOI_Data,
          Confidence: this.config.Confidence,
          categoryName: this.supplierNameForEdit,
          categoryLevel: this.categorylevel,
          gridJson: this.gridData.createOpportunityView.series,
          dataDate: this._commUtil.getDateInFormat(dateObj)

        }
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
            this.showSavePopup = false;
            this._commUtil.getMessageDialog(
              this._dashboardCommService.oppFinderState.editMode ? DashboardConstants.UIMessageConstants.STRING_EDIT_OPP_SUCCESS : DashboardConstants.UIMessageConstants.STRING_SHOW_CREATE_OPP_SUCCESS,
              (_response: any) => {
                if (_response.result.toLocaleLowerCase() == DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT.toLocaleLowerCase()) {
                  this._loaderService.showGlobalLoader();
                  window.location.href = this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;
                }
              },
              DashboardConstants.OpportunityFinderConstants.STRING_SUCCESS
            )
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


  openOppfinderFormulaPopup() {
    this.oppfinderFormulaPopupRef = this.componentFactoryResolver.resolveComponentFactory(OppfinderFormulaPopupComponent).create(this.injector);
    this.appRef.attachView(this.oppfinderFormulaPopupRef.hostView);
    const domElem = (this.oppfinderFormulaPopupRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this._renderer.appendChild(document.body, domElem);
    this.oppfinderFormulaPopupConfig = { api: {} };
    this.oppfinderFormulaPopupConfig.api.closePopup = () => {
      this.closeOppfinderFormulaPopup();
    };
    this.oppfinderFormulaPopupRef.instance.config = this.oppfinderFormulaPopupConfig;
  };

  closeOppfinderFormulaPopup() {
    this.appRef.detachView(this.oppfinderFormulaPopupRef.hostView);
    this.oppfinderFormulaPopupRef.destroy();
  };


  openOppfinderFormulaOverviewPopup() {
    this.oppfinderFormulaOverviewPopupRef = this.componentFactoryResolver.resolveComponentFactory(OppfinderFormulaOverviewPopupComponent).create(this.injector);
    this.appRef.attachView(this.oppfinderFormulaOverviewPopupRef.hostView);
    const domElem = (this.oppfinderFormulaOverviewPopupRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this._renderer.appendChild(document.body, domElem);
    this.oppfinderFormulaOverviewPopupConfig = { api: {} };
    this.oppfinderFormulaOverviewPopupConfig.btnContinueConfig = this.btnContinueConfig;
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDS.name)
      this.oppfinderFormulaOverviewPopupConfig.api.opportunityType = 'Suppliers'
    else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.BPDC.name)
      this.oppfinderFormulaOverviewPopupConfig.api.opportunityType = 'Categories'
    this.oppfinderFormulaOverviewPopupConfig.api.closePopup = () => {
      this.closeOppfinderFormulaOverviewPopup();
    };
    this.oppfinderFormulaOverviewPopupRef.instance.config = this.oppfinderFormulaOverviewPopupConfig;
  };
  closeOppfinderFormulaOverviewPopup() {
    this.appRef.detachView(this.oppfinderFormulaOverviewPopupRef.hostView);
    this.oppfinderFormulaOverviewPopupRef.destroy();
  };

  categorychange(e) {
    this.supplierRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectName == this.numberFilterObj.title;
    });
    this.categorylevel = this.numberFilterObj.title;
    this._dashboardCommService.oppFinderState.extraProps.currentState = undefined;
    this.gridData.gridDetailsView = {};
    this.refreshGridDetails();
    this.onApplyFilter();
    console.log(e.selectedValue.title);
    console.log(e.selectedValue.op);
  }
  onKeyUp() {
    
  }
}


export enum stateManagement {
  gridDetailsView = 'gridDetailsView',
  opportunityDetailsView = 'opportunityDetailsView',
  createOpportunityView = 'createOpportunityView'
}



