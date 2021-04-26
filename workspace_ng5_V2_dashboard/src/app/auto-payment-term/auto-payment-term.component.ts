import {
  Input, Output, Component,
  EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewContainerRef, TemplateRef, OnDestroy, EmbeddedViewRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef, HostListener
} from '@angular/core';
//import { LazyComponentConfiguration, visionModulesManifest } from '../../../modules-manifest';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { AnalyticsMapperService } from '@vsAnalyticsCommonService/analytics-mapper.service';
import { AnalyticsCommonDataService } from '@vsAnalyticsCommonService/analytics-common-data.service';
import { Subscription } from 'rxjs';
import { DashboardConstants } from '@vsDashboardConstants';
import { map, find, filter, camelCase, each, findIndex, mapValues, extend, sumBy } from 'lodash';
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
import { CellType } from 'wijmo/wijmo.grid';
import { setCss } from 'wijmo/wijmo';
import { LoaderService } from '@vsLoaderService';


declare var $: any;

@Component({
  selector: 'auto-payment-term',
  templateUrl: './auto-payment-term.component.html',
  styleUrls: ['./auto-payment-term.component.scss'],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class AutoPaymentTermComponent implements OnInit, OnDestroy {
  // static componentId = LazyComponentConfiguration.AutoPaymentTerm.componentName;
  btnDoneConfig: any;
  btnNextConfig: any;
  btnCancelConfig: any;
  btnApplyConfig: any;
  btnFooterCloseConfig: any;
  btnFooterCancelConfig: any;
  btnFooterSaveConfig: any;
  btnPopupSaveConfig: any;
  isGlobalFilterApplied: boolean;
  showChipBar: boolean = false;
  selectedFilter: any;
  dashboardConstant: any = DashboardConstants.FilterType.MultiSelect;
  showSelectedText: any;
  supplierRo: any;
  bestPaymentTermRo: any;
  spendRo: any;
  level3CategoryRo: any;
  level4CategoryRo: any = {};
  supplierCountRo: any = {};
  supplierRoForList: any = {};
  supplierList: any = {};
  paymentTermNameRO: any = {};
  showSavePopup: boolean = false;
  selectedBestPaymentTerm: number = 0;
  selectedSupplier: string;
  effectiveAddressableSpend: number;
  addressableSpend: number = 0;
  costOfCapital: number = 10;
  totalPotentialSavings: number = 0;
  totalSpend: number = 0;
  weightedAvgAddressableSpend: number = 0;
  isCreateNewOppClicked: boolean = false;
  prevSeries: any = {};
  level4Series: any = {};
  supplierWiseOppFinderId: any = {};
  supplierNameForOpportunities: string;
  supplierNameForEdit: string;
  categoryNameForEdit: string;
  categoryLevel: number;
  refreshNewClicked: boolean = false;
  refreshNewOld = {
    text: DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_LATEST_VALUES,
    date: ""
  }
  popupHeaderText: any = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
  gridData: any = {
    gridDetailsView: {},
    opportunityDetailsView: {},
    createOpportunityView: {},
    level4OpportunityView: {}
  } // this variable will hold the grid details of whatever grid displayed on the page.
  currentPageSupplierList: Array<string>;
  currentPageLevel4List: Array<string>;
  currentPageLevel3CategoryList: Array<string>;
  level4CategoryList = {
    level3Category: "",
    level4Categories: []
  }
  supplierWiseOpportunities: any = {};
  level4WiseOpportunities: any = {};
  manageSubscription$: Subscription = new Subscription();
  // sliderManifest: IManifestCollection = {
  //   sliderWidget: visionModulesManifest.sliderWidget
  // };
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
      message: this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name ? DashboardConstants.UIMessageConstants.STRING_AUTOIMPROV_FORMULA : DashboardConstants.UIMessageConstants.STRING_AUTOPAYMENT_FORMULA,
      position: DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.RIGHT,
    }
  };
  _compSupplierListPopup: ComponentRef<any>;
  oppfinderOverviewPopupConfig: any;
  oppfinderOverviewPopupRef: any;
  rowIndex: number = 0;
  currentPageIndex: number = 1;
  oldCostofCapital: number;
  applyToAllAddressableSpend: any = { Value: DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND };
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
  @ViewChild("supplierListPopup", { read: ViewContainerRef }) supplierListPopupRef: ViewContainerRef;
  @HostListener('window:resize', ['$event'])
  onScrollResize() { this.setGridResolution(); }
  constructor(
    private _staticLoader: StaticModuleLoaderService,
    public _appConstants: AppConstants,
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
    this.initializeSliderWidget();
    this.currentPageIndex = 1;
    // this.gridData.gridDetailsView = this.setMockGridData();
    this.setUIConfig();
    if (this._dashboardCommService.oppFinderState.editMode) {
      this.sliderConfig.from = this._dashboardCommService.oppFinderState.gridJson.costOfCapital;
      this.generateCreateOppGridEditMode(this._dashboardCommService.oppFinderState.gridJson.supplierName, this._dashboardCommService.oppFinderState.gridJson.gridJson);
      this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
      this.selectedBestPaymentTerm = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
      this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_EDIT_OPPORTUNITY;
    }
    else {
      this.refreshGridDetails();
    }
    this.onApplyFilter();
  }

  ngAfterViewInit() {
    let $element = $(this._elementRef.nativeElement),
      editContainer = $element.find('.editable-div'),
      inputEle = $element.find('.editable-div .input-field input')
    if (inputEle) {
      inputEle.keyup((e) => {
        if (e.keyCode === 13) {
          inputEle.focus().blur().focus().val(inputEle.val());
          this.editTextfield = true;
          this.updateAddressableSpend();
        }
      });
    }


  }
  ngOnDestroy() {
    // this.PurchasePriceContainerRef.clear();
    this.manageSubscription$.unsubscribe();
  }

  public initializeSliderWidget() {
    // this.config.sliderConfig = {
    //     min: 0,
    //     max: 20,
    //     from: 0,
    //     to: 10
    // }
    // this.createSliderWidget(this.sliderManifest, 'sliderWidget', 'SliderWidgetComponent', this.config);
    // this.sub.subject = new Subject<IDashoardCardAction>();
    // this.sub.observer$ = this.sub.subject.asObservable();
    // this.manageSubscription$.add(
    //     this.sub.observer$.subscribe(action => {
    //         this.sliderAction(action);
    //     })
    // );
  }

  refreshGridDetails() {
    this.setGridData().then((gridConfig: any) => {
      extend(this.gridData.gridDetailsView, gridConfig);
      if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
        this.getSupplierWiseOpportunities(this.currentPageSupplierList).then((oppResponse) => {
          this.updateFlexGridData();
          this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
          this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
          this.setState();
        });
      }
      else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
        this.getLevel3CategoryWiseOpportunities(this.currentPageSupplierList).then((oppResponse) => {
          this.updateFlexGridData();
          this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
          this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
          this.setState();
        });
      }
    });

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
                () => { },
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
        if (obj.grid.columns[ht.col].header === DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT) {
          setTimeout(() => {
            // if (that.editTextfield === false) {
            //     // that.updateSavings(that);
            // }
            let $element = $(this._elementRef.nativeElement),
              editContainer = $element.find('.editable-div'),
              inputEle = $element.find('.editable-div .input-field input'),
              element = obj.grid.cells.getCellElement(ht.row, ht.col),
              left = $(element).offset().left;
            //inputEle.focus().blur().focus().val(inputEle.val());
            editContainer.css("left", left + (element.offsetWidth - 45));
            editContainer.css("top", 260 + ht.row * element.offsetHeight);
            this.rowIndex = ht.row;
            if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView)
              this.applyToAllAddressableSpend.Value = this.gridData.gridDetailsView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT]
            else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView)
              this.applyToAllAddressableSpend.Value = this.gridData.level4OpportunityView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT]
            else this.gridData.createOpportunityView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT]
            this.updateAddressableSpend();
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
      if (this.applyToAllAddressableSpend.Value != null) {
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
    // this._commUtil.showGlobalLoader();
    this._loaderService.showGlobalLoader();
    return new Promise((resolve, reject) => {
      let that = this;
      let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
      let dashletMetaData: any = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0]);
      reportDetailsMetaData.isGrandTotalRequired = false;
      reportDetailsMetaData.isSubTotalRequired = false;
      if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.shortName)
        reportDetailsMetaData.isLazyLoadingRequired = false;
      else if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.shortName)
        reportDetailsMetaData.isLazyLoadingRequired = true;
      reportDetailsMetaData["pageIndex"] = this.currentPageIndex = 1;
      reportDetailsMetaData["reportRequestKey"] = dashletMetaData.reportRequestKey;
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
            //               this._loaderService.hideGlobalLoader();
            this._loaderService.hideGlobalLoader();
            resolve(gridConfig);
            this.setGridResolution();
          }, (error) => {
            that._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`,
              () => { },
            )
          })
      );
    });


  }

  private generateGrid(reportDetailsMetaData: any, response: any): any {
    this.currentPageSupplierList = [];
    this.currentPageLevel3CategoryList = [];
    this.level4CategoryList.level3Category = "";
    this.level4CategoryList.level4Categories = [];

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
      iconType: DashboardConstants.OpportunityFinderConstants.ICON_TYPE.icon,
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
          allowSorting: false,
          allowMerging: this.supplierRo.ReportObjectName == col ? true : false
        })
      });
      // Insert custom columns for Auto Payment term strategy
      let ind = findIndex(gridConfig.column, (column) => this.spendRo.reportObjectName.toLowerCase() == column.binding.toLowerCase())
      if (ind > -1) {
        gridConfig.column.splice(ind + 1, 0, {
          aggregate: 0,
          binding: DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT,
          format: undefined,
          header: DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT,
          isReadOnly: false,
          visible: true,
          //selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
          allowSorting: false
        });
      } // push addressable spend column after the spend(usd) column :: RP-112
      gridConfig.column.push({
        aggregate: 0,
        binding: DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES,
        format: undefined,
        header: DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES,
        isReadOnly: true,
        visible: true,
        allowSorting: false
      });
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
    //if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.shortName) {
    each(_daxResponse.Data, (record) => {
      record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
      record[DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] = '';
      record[DashboardConstants.UIMessageConstants.STRING_CREATE_NEW] = DashboardConstants.UIMessageConstants.STRING_CREATE_NEW;
      this.currentPageSupplierList.push(record[this.supplierRo.ReportObjectName]);
    });
    //}
    //else if (this._dashboardCommService.oppFinderState.strategy.shortName == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.shortName) {
    //  each(_daxResponse.Data, (record) => {
    //    record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
    //    //record[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = 1000;
    //    record[DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] = '';
    //    record[DashboardConstants.UIMessageConstants.STRING_CREATE_NEW] = DashboardConstants.UIMessageConstants.STRING_CREATE_NEW;
    //    this.currentPageLevel3CategoryList.push(record[this.level3CategoryRo.ReportObjectName]);
    //  });
    //}
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
      this.gridData.gridDetailsView.pageData.push(_daxResponse.Data);
    }
    else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
      if (_daxResponse.Data.length <= _daxResponse.PageSize - 1)
        this.gridData.gridDetailsView.pageData.push(_daxResponse.Data);
      else {
        _daxResponse.Data = _daxResponse.Data.splice(0, _daxResponse.Data.length - 1);
        this.gridData.gridDetailsView.pageData.push(_daxResponse.Data);
      }
    }


    this.gridData.gridDetailsView.series = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage];
    this.updateFlexGridData();
  }

  public updateFlexGridData() {
    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      this.gridData.gridDetailsView.gridAPI.updateFlexGrid(this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage]);
    }
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView) {
      this.gridData.level4OpportunityView.gridAPI.updateFlexGrid(this.gridData.level4OpportunityView.series);
    }
    //               this._loaderService.hideGlobalLoader();
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
    // this._commUtil.showGlobalLoader();
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
      this.currentPageIndex = this.currentPageIndex + 1;
      reportDetailsMetaData["pageIndex"] = this.currentPageIndex;
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
              this.currentPageLevel3CategoryList = [];
              this.level4CategoryList.level3Category = "";
              this.level4CategoryList.level4Categories = [];
              this.flexGridPagination(response, false);
              this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
              if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
                this.getSupplierWiseOpportunities(this.currentPageSupplierList).then((oppResponse) => {
                  this.updateFlexGridData();
                  this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
                  this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
                  this.setState();
                });
              }
              else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
                this.getLevel3CategoryWiseOpportunities(this.currentPageLevel3CategoryList).then((oppResponse) => {
                  this.updateFlexGridData();
                  this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
                  this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
                  this.setState();
                });
              }
              this.setState();
              //               this._loaderService.hideGlobalLoader();
              this._loaderService.hideGlobalLoader();
              this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.gridDetailsView.series);
              //this.UpdateFlexGridOpacity();
            }
          }, (error: any) => {
            //               this._loaderService.hideGlobalLoader();
            this._loaderService.hideGlobalLoader();
          })
      );
    }
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

  private getSupplierWiseOpportunities(supplierList) {
    this._loaderService.showGlobalLoader();
    // this._commUtil.showGlobalLoader();
    return new Promise((resolve, reject) => {
      this.manageSubscription$.add(
        this._oppFinderService.getSupplierWiseOpportunities(supplierList)
          .subscribe((response) => {
            if (response != undefined) {
              Object.keys(response).forEach((supplierName) => {
                this.supplierNameForOpportunities = supplierName;
                if (!this._commUtil.isNune(this.supplierWiseOpportunities[supplierName])) {
                  this.supplierWiseOpportunities[supplierName] = [];
                }
                response[supplierName].forEach((opp) => {
                  {
                    this.supplierWiseOpportunities[supplierName].push(JSON.parse(opp));
                  }
                });
              });
              this.displayOpportunityColumn();
              resolve(true);
            }
            this._loaderService.hideGlobalLoader();
            //               this._loaderService.hideGlobalLoader();
          }, (error) => {
            this._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`
              , () => { });
          })
      );
    });
  }

  private getLevel3CategoryWiseOpportunities(level3CategoryList) {
    this._loaderService.showGlobalLoader();
    // this._commUtil.showGlobalLoader();
    return new Promise((resolve, reject) => {
      this.manageSubscription$.add(
        this._oppFinderService.getLevel3CategoryWiseOpportunities(level3CategoryList)
          .subscribe((response) => {
            if (response != undefined) {
              Object.keys(response).forEach((supplierName) => {
                if (!this._commUtil.isNune(this.supplierWiseOpportunities[supplierName])) {
                  this.supplierWiseOpportunities[supplierName] = [];
                }
                response[supplierName].forEach((opp) => {
                  this.supplierWiseOpportunities[supplierName].push(JSON.parse(opp));
                });
              });
              this.displayOpportunityColumn();
              resolve(true);
            }
            this._loaderService.hideGlobalLoader();
            //               this._loaderService.hideGlobalLoader();
          }, (error) => {
            this._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`
              , () => { });
          })
      );
    });
  }

  private getLevel4CategoryWiseOpportunities(level4CategoryList) {
    this._loaderService.showGlobalLoader();
    // this._commUtil.showGlobalLoader();
    return new Promise((resolve, reject) => {
      this.manageSubscription$.add(
        this._oppFinderService.getLevel4CategoryWiseOpportunities(level4CategoryList)
          .subscribe((response) => {
            if (response != undefined) {
              Object.keys(response).forEach((supplierName) => {
                if (!this._commUtil.isNune(this.level4WiseOpportunities[supplierName])) {
                  this.level4WiseOpportunities[supplierName] = [];
                }
                response[supplierName].forEach((opp) => {
                  this.level4WiseOpportunities[supplierName].push(JSON.parse(opp));
                });
              });
              each(Object.keys(this.level4WiseOpportunities), (_supplierName) => {
                //if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
                let index = findIndex(this.gridData.level4OpportunityView.series, (record) => {
                  return record[this.level4CategoryRo.reportObjectName] == _supplierName;
                });
                if (index > -1) {
                  this.gridData.level4OpportunityView.series[index][DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] = this.level4WiseOpportunities[_supplierName][0].opportunityName
                    + (this.level4WiseOpportunities[_supplierName].length > 1 ? (' +' + (this.level4WiseOpportunities[_supplierName].length - 1) + ' more') : '');
                }
              });
              resolve(true);
            }
            this._loaderService.hideGlobalLoader();
          }, (error) => {
            this._commUtil.getMessageDialog(
              `Status:${error.status}  Something Went wrong with ${error.message}`
              , () => { });
          })
      );
    });
  }

  private displayOpportunityColumn() {
    each(Object.keys(this.supplierWiseOpportunities), (_supplierName) => {
      let index = findIndex(this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage], (record) => {
        return record[this.supplierRo.ReportObjectName] == _supplierName;
      });
      if (index > -1) {
        this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][index][DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] = this.supplierWiseOpportunities[_supplierName][0].opportunityName
          + (this.supplierWiseOpportunities[_supplierName].length > 1 ? (' +' + (this.supplierWiseOpportunities[_supplierName].length - 1) + ' more') : '');
      }
    });
  }

  setMockGridData() {
    return {
      widgetDataType: 'grid',
      enableItemFormatter: false,
      enableEditCell: true,
      enableCellSelection: true,
      enableUpdate: true,
      enableStickyHeader: false,
      enableFilters: true,
      enableFooter: false,
      childItemsPath: ['children'],
      column: [
        {
          aggregate: 0,
          binding: "Category Level 3",
          format: undefined,
          header: "Category Level 3",
          isReadOnly: true,
          visible: true,
          allowSorting: true
        },
        {
          aggregate: 0,
          binding: "Category Level 4",
          format: undefined,
          header: "Category Level 4",
          isReadOnly: true,
          visible: true,
          allowSorting: true
        },
        {
          aggregate: 0,
          binding: "Total Spend (USD)",
          format: undefined,
          header: "Total Spend (USD)",
          isReadOnly: false,
          visible: true,
          allowSorting: false
        },
        {
          aggregate: 0,
          binding: "Addressable Spend (%)",
          format: undefined,
          header: "Addressable Spend (%)",
          isReadOnly: false,
          visible: true,
          allowSorting: false
        },
        {
          aggregate: 0,
          binding: "Count Of Payment Terms",
          format: undefined,
          header: "Count Of Payment Terms",
          isReadOnly: false,
          visible: true,
          allowSorting: true
        },
        {
          aggregate: 0,
          binding: "Count Of Suppliers",
          format: undefined,
          header: "Count Of Suppliers",
          isReadOnly: false,
          visible: true,
          allowSorting: true
        },
        {
          aggregate: 0,
          binding: "Best Payment Term",
          format: undefined,
          header: "Best Payment Term",
          isReadOnly: false,
          visible: true,
          allowSorting: true
        },
        {
          aggregate: 0,
          binding: "Potential Savings",
          format: undefined,
          header: "Potential Savings",
          isReadOnly: false,
          visible: true,
          allowSorting: true
        }
      ],
      series: [
        {
          "Category Level 3": "Fleet",
          "Category Level 4": "",
          "Total Spend (USD)": 10000,
          "Addressable Spend (%)": 70,
          "Count Of Payment Terms": 3,
          "Count Of Suppliers": 2,
          "Best Payment Term": "NET 90",
          "Potential Savings": 40000,
          "children": [
            {
              "Category Level 3": "",
              "Category Level 4": "Travel Agent",
              "Total Spend (USD)": 6000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            },
            {
              "Category Level 3": "",
              "Category Level 4": "Fleet Management",
              "Total Spend (USD)": 4000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            }
          ]

        },
        {
          "Category Level 3": "Vehcle",
          "Category Level 4": "",
          "Total Spend (USD)": 20000,
          "Addressable Spend (%)": 70,
          "Count Of Payment Terms": 3,
          "Count Of Suppliers": 3,
          "Best Payment Term": "NET 90",
          "Potential Savings": 40000,
          "children": [
            {
              "Category Level 3": "",
              "Category Level 4": "Motors LTD",
              "Total Spend (USD)": 6000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            },
            {
              "Category Level 3": "",
              "Category Level 4": "Buy Cars",
              "Total Spend (USD)": 9000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            },
            {
              "Category Level 3": "",
              "Category Level 4": "Vehcles Org",
              "Total Spend (USD)": 5000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            }
          ]
        },
        {
          "Category Level 3": "Meals",
          "Category Level 4": "",
          "Total Spend (USD)": 12000,
          "Addressable Spend (%)": 70,
          "Count Of Payment Terms": 3,
          "Count Of Suppliers": 2,
          "Best Payment Term": "NET 90",
          "Potential Savings": 40000,
          "children": [
            {
              "Category Level 3": "",
              "Category Level 4": "Meals LTD",
              "Total Spend (USD)": 9000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            },
            {
              "Category Level 3": "",
              "Category Level 4": "Buy Meals",
              "Total Spend (USD)": 3000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            }
          ]
        },
        {
          "Category Level 3": "Eatable",
          "Category Level 4": "",
          "Total Spend (USD)": 8000,
          "Addressable Spend (%)": 70,
          "Count Of Payment Terms": 3,
          "Count Of Suppliers": 1,
          "Best Payment Term": "NET 90",
          "Potential Savings": 40000,
          "children": [
            {
              "Category Level 3": "",
              "Category Level 4": "Meals LTD",
              "Total Spend (USD)": 8000,
              "Addressable Spend (%)": 70,
              "Count Of Payment Terms": 3,
              "Count Of Suppliers": 2,
              "Best Payment Term": "NET 90",
              "Potential Savings": 40000,
            }
          ]
        }
      ]
    };
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
        selectedConfig: { value: this.config.Confidence },
        Config: {
          label: 'Confidence Level',
          dataKey: "code",
          displayKey: "name",
          fieldKey: 'value',
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
          header: DashboardConstants.UIMessageConstants["STRING_" + columnKey[0].toUpperCase() + columnKey.substr(1, columnKey.length)],
          data: this.config.opportunityRowData[columnKey],
        });
      }
    }
    return config;
  }
  setUIConfig() {
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
    let reportDetailsForGrid = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
    if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
      masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
    }
    this.bestPaymentTermRo = find(reportDetailsForGrid.lstReportObjectOnValue, (rO) => {
      return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.bestPaymentTerm_reportObjectId.toLowerCase();
    });
    this.spendRo = find(reportDetailsForGrid.lstReportObjectOnValue, (rO) => {
      return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.spend_reportObjectId.toLowerCase();
    });
    let extraRO = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
      return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.paymentTermName_reportObjectId.toLowerCase();
    });
    for (var key in extraRO) {
      if (extraRO.hasOwnProperty(key)) {
        this.paymentTermNameRO[camelCase(key)] = extraRO[key];
      }
    }

    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
      this.supplierRo = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.supplier_reportObjectId.toLowerCase();
      });
    }
    else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
      this.supplierRo = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level3Category_reportObjectId.toLowerCase();
      });
      let level4CategoryRo = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.level4Category_reportObjectId.toLowerCase();
      });
      this.supplierCountRo = find(reportDetailsForGrid.lstReportObjectOnValue, (rO) => {
        return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.supplierCount_reportObjectId.toLowerCase();
      });
      let supplierRoForList = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
        return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.supplier_reportObjectId.toLowerCase();
      });
      for (var key in level4CategoryRo) {
        if (level4CategoryRo.hasOwnProperty(key)) {
          this.level4CategoryRo[camelCase(key)] = level4CategoryRo[key];
        }
      }
      for (var key in supplierRoForList) {
        if (supplierRoForList.hasOwnProperty(key)) {
          this.supplierRoForList[camelCase(key)] = supplierRoForList[key];
        }
      }
    }
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
        case stateManagement.level4DrillView:
          event.grid.allowMerging = 'All';
          gridColumns = this.gridData.level4OpportunityView.column;
          break;
        case stateManagement.createOpportunityView:
          event.grid.allowMerging = 'All';
          gridColumns = this.gridData.createOpportunityView.column;
          break;
      }
      for (let RO_cnt = 0; RO_cnt < gridColumns.length; RO_cnt++) {
        if (event.grid.columns[RO_cnt]
          && event.grid.columns[RO_cnt] === this.supplierRo.ReportObjectName) {
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
        if (flex.columns[obj.c].header === DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT) {
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
        else if (flex.columns[obj.c].header === this.supplierRo.ReportObjectName && this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name && !this.isCreateNewOppClicked) {
          setCss(obj.cell, {
            cursor: 'pointer',
            color: '#0177d6'
          });
        }
        else if (flex.columns[obj.c].header === this.supplierCountRo.reportObjectName && this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
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
      if (this.gridData.gridDetailsView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES && this.gridData.gridDetailsView.series[event.event.row][DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] != "") {
        this.generateSupplierWiseOpportunitiesGrid(event.event.row);
      }
      else if (this.gridData.gridDetailsView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_CREATE_NEW) {
        this.oldCostofCapital = this._commUtil.getDeReferencedObject(this.costOfCapital);
        this.rowIndex = event.event.row;
        this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
        if (this.validateAddressableSpend(this.gridData.gridDetailsView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
          this.isCreateNewOppClicked = true;
          this.gridData.level4OpportunityView.series = {};
          this.createNewOpp(event.event.row);
        }
      }
      else if (this.gridData.gridDetailsView.column[event.event.col].header == this.supplierRo.ReportObjectName && this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
        this.oldCostofCapital = this._commUtil.getDeReferencedObject(this.costOfCapital);
        this.rowIndex = event.event.row;
        this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
        if (this.validateAddressableSpend(this.gridData.gridDetailsView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
          this.isCreateNewOppClicked = true;
          this.level4WiseOpportunities = {};
          this.createLevel4Opportunity(event.event.row);
        }
      }
      else if (this.gridData.gridDetailsView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT) {
        this.applyToAllAddressableSpend.Value = this.gridData.gridDetailsView.series[event.event.row][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
        // if(this.validateAddressableSpend(this.applyToAllAddressableSpend.Value))
        this.enableDisableFlgs(event);
      }
      else if (this.gridData.gridDetailsView.column[event.event.col].header == this.supplierCountRo.reportObjectName) {
        this.createSupplierList(event.event.row);
      }

    }
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState === stateManagement.level4DrillView) {
      if (this.gridData.level4OpportunityView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_CREATE_NEW) {
        this.rowIndex = event.event.row;
        this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_CREATE_OPPORTUNITY;
        if (this.validateAddressableSpend(this.gridData.level4OpportunityView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
          this.isCreateNewOppClicked = true;
          this.createNewOpp(event.event.row);
        }
      }
      else if (this.gridData.level4OpportunityView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES && this.gridData.level4OpportunityView.series[event.event.row][DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] != "") {
        this.generateSupplierWiseOpportunitiesGrid(event.event.row);
      }
      else if (this.gridData.level4OpportunityView.column[event.event.col].header == this.supplierCountRo.reportObjectName) {
        this.createSupplierList(event.event.row);
      }
      else if (this.gridData.level4OpportunityView.column[event.event.col].header == DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT) {
        this.applyToAllAddressableSpend.Value = this.gridData.level4OpportunityView.series[event.event.row][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
        // if(this.validateAddressableSpend(this.applyToAllAddressableSpend.Value))
        this.enableDisableFlgs(event);
      }
    }
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState === stateManagement.opportunityDetailsView) {
      if (this.gridData.opportunityDetailsView.column[event.event.col].header == DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit) {
        let oppFinderId;
        if (this.categoryLevel == 4)
          oppFinderId = this.level4WiseOpportunities[this.categoryNameForEdit][event.event.row]["opportunityFinderObjectId"];
        else oppFinderId = this.supplierWiseOpportunities[this.supplierNameForEdit][event.event.row]["opportunityFinderObjectId"];
        this._dashboardCommService.oppFinderState.editMode = true;
        this.popupHeaderText = DashboardConstants.UIMessageConstants.STRING_POPUP_EDIT_OPPORTUNITY;
        //let index = findIndex(this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage], { "Supplier - Normalized": this.supplierNameForEdit })
        //if (index > -1) {
        //     this.createNewOpp(index);
        this._dashboardCommService.oppFinderState.oppFinderId = oppFinderId;//this._commUtil.getUrlParam('oppfinderId');
        this.generateOppFinderGridJSON().then((response) => {
          if (response) {
            this.selectedBestPaymentTerm = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
            this.generateCreateOppGridEditMode(this._dashboardCommService.oppFinderState.gridJson.supplierName, this._dashboardCommService.oppFinderState.gridJson.gridJson);
            this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
          }
        })

      }
    }
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState === stateManagement.createOpportunityView) {
      this.applyToAllAddressableSpend.Value = this.gridData.createOpportunityView.series[event.event.row][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
      // if(this.validateAddressableSpend(this.applyToAllAddressableSpend.Value))
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
              `Status:${error.status}  Something Went wrong with ${error.message}`
              , () => { });
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
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
      column: [],
      series: []
    }

    if (this.supplierWiseOpportunities && this.supplierWiseOpportunities[this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName]] && this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      this.categoryNameForEdit = this.supplierNameForEdit = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName];
      this.categoryLevel = 3;
      Object.keys(this.supplierWiseOpportunities[this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName]][0]).forEach((col) => {
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
      gridConfig.series = Object.assign([], this.supplierWiseOpportunities[this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName]]);
      gridConfig.series.forEach((record) => {
        record[DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit] = DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit;
      });
    }
    else if (this.level4WiseOpportunities && this.level4WiseOpportunities[this.gridData.level4OpportunityView.series[rowIndex][this.level4CategoryRo.reportObjectName]][0] && this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView) {
      this.categoryNameForEdit = this.gridData.level4OpportunityView.series[rowIndex][this.level4CategoryRo.reportObjectName];
      this.categoryLevel = 4;
      Object.keys(this.level4WiseOpportunities[this.gridData.level4OpportunityView.series[rowIndex][this.level4CategoryRo.reportObjectName]][0]).forEach((col) => {
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
      gridConfig.series = Object.assign([], this.level4WiseOpportunities[this.gridData.level4OpportunityView.series[rowIndex][this.level4CategoryRo.reportObjectName]]);
      gridConfig.series.forEach((record) => {
        record[DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit] = DashboardConstants.OpportunityFinderConstants.AutoPaymentTermGridColumns.edit;
      });
    }
    this.gridData.opportunityDetailsView = gridConfig;
    this._appConstants.userPreferences.moduleSettings.showFilterIconOption = false;
    this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.opportunityDetailsView;
    this.setState();
    this.setGridResolution();
  }

  createSupplierList(rowIndex) {
    this._loaderService.showGlobalLoader();
    let reportDetailsForCreateOpp = this.generateSupplierListReportDetails(rowIndex);
    reportDetailsForCreateOpp.isGrandTotalRequired = false;
    reportDetailsForCreateOpp.isSubTotalRequired = false;
    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsForCreateOpp);
    this.config.WidgetDataRecordLength = 0;
    this.manageSubscription$.add(
      this._analyticsCommonDataService.generateReport(reportDetailsData)
        .subscribe((response) => {
          if (response != undefined
            && response.Data != null
            && response.Data.length > 0
            && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
            this.supplierList = response.Data;
            this.openOppfinderOverviewPopup();
            //this.generateCreateOppGridforLevel4(rowIndex, response);
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
            `Status:${error.status}  Something Went wrong with ${error.message}`
            , () => { });
        })
    );
  }

  async openOppfinderOverviewPopup() {
    this._loaderService.showGlobalLoader();
    //const _lazySupplierListPopup: any = await this._staticLoader.resolveComponent(visionModulesManifest,LazyComponentConfiguration.SupplierListPopUp.key,LazyComponentConfiguration.SupplierListPopUp.componentName );
    // const _lazySupplierListPopup: any = await this._commUtil.getLazyComponentReferences(LazyComponentConfiguration.SupplierListPopUp);
    // this._compSupplierListPopup = this.supplierListPopupRef.createComponent(_lazySupplierListPopup);
    this.supplierListPopupRef.detach();
    this.supplierListPopupRef.clear();
    await this.createPopupConf().then((conf: any) => {
      this._compSupplierListPopup.instance.config = conf;
      this.supplierListPopupRef.createEmbeddedView(this.CommonTemplateRef, {
        manifestPath: 'supplier-list-popup/supplier-list-popup',
        config: { config: conf }
      })
    });
    this._loaderService.hideGlobalLoader();
  }
  createPopupConf() {
    return new Promise((resolve, reject) => {
      const supplierListPopupConfig: any = {
        data: this.supplierList,
        supplierName: this.supplierRoForList.reportObjectName,
        spendRO: this.spendRo.reportObjectName,
        api: {},
        changeDetectionMutation: {
          setSupplierListPopupComponentState: {}
        }
      }
      supplierListPopupConfig.api = {
        closePopup: () => { this.closeSupplierListPopup(); },
      };

      resolve(supplierListPopupConfig);
    });
  }

  closeSupplierListPopup() {
    this.supplierListPopupRef.detach();
    this.supplierListPopupRef.clear();
    this._compSupplierListPopup.destroy();
  }

  createLevel4Opportunity(rowIndex) {
    this._loaderService.showGlobalLoader();
    let reportDetailsForCreateOpp = this.generateLevel4ReportDetails(rowIndex);
    reportDetailsForCreateOpp.isGrandTotalRequired = false;
    reportDetailsForCreateOpp.isSubTotalRequired = false;
    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsForCreateOpp);
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
            //this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.level4DrillView;
            this.generateCreateOppGridforLevel4(rowIndex, response);
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
            `Status:${error.status}  Something Went wrong with ${error.message}`
            , () => { });
        })
    );
    this.setGridResolution();
    // this.config.selectedPopupValue = name;
    // this.config.opportunityRowData = this.gridData.series[rowIndex];
  }
  createNewOpp(rowIndex) {
    this._loaderService.showGlobalLoader();
    let reportDetailsForCreateOpp: any;
    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView)
      reportDetailsForCreateOpp = this.generateSupplierBasedReportDetails(rowIndex);
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.level4DrillView)
      reportDetailsForCreateOpp = this.generateLevel4BasedReportDetails(rowIndex);
    reportDetailsForCreateOpp.isGrandTotalRequired = false;
    reportDetailsForCreateOpp.isSubTotalRequired = false;
    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsForCreateOpp);
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
            this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
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
            `Status:${error.status}  Something Went wrong with ${error.message}`
            , () => { });
        })
    );
    console.log('createNew', rowIndex);
    // this.config.selectedPopupValue = name;
    // this.config.opportunityRowData = this.gridData.series[rowIndex];
  }
  createNewOppEditMode(supplierName) {
    this._loaderService.showGlobalLoader();
    let reportDetailsForCreateOpp = this.generateSupplierBasedReportDetailsEditMode(supplierName);
    reportDetailsForCreateOpp.isGrandTotalRequired = false;
    reportDetailsForCreateOpp.isSubTotalRequired = false;
    let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsForCreateOpp);
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
            this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.createOpportunityView;
            this._dashboardCommService.oppFinderState.gridJson.gridJson.forEach((item, index) => {
              if (item[this.paymentTermNameRO.reportObjectName] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT)
                response.Data[index][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
            });
            this.generateCreateOppGridEditMode(supplierName, response);
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
              this.setDashboardCardMessage(`${DashboardConstants.UIMessageConstants.STRING_NO_DATA_RETURNED_TXT}`);
            }
          }
          this._loaderService.hideGlobalLoader();
        }, (error) => {
          this._commUtil.getMessageDialog(
            `Status:${error.status}  Something Went wrong with ${error.message}`
            , () => { });
        })
    );
  }

  generateLevel4ReportDetails(rowIndex) {
    let reportDetailsForCreateOpp = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);

    this.selectedSupplier = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName];
    this.selectedBestPaymentTerm = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.bestPaymentTermRo.reportObjectName];
    reportDetailsForCreateOpp.lstReportObjectOnRow = filter(reportDetailsForCreateOpp.lstReportObjectOnRow, (_ro) => {
      return _ro.reportObjectId == this.supplierRo.ReportObjectId;
    });
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.level4CategoryRo);

    let filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.supplierRo, this.selectedSupplier)
    reportDetailsForCreateOpp.lstFilterReportObject.push(
      AnalyticsUtilsService.createDrillDriveFilterReportObj(
        { reportObject: this.supplierRo, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
      )
    );
    return reportDetailsForCreateOpp;
  }

  generateSupplierListReportDetails(rowIndex) {
    let reportDetailsForCreateOpp = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
    this.selectedSupplier = this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView ? this.gridData.level4OpportunityView.series[rowIndex][this.level4CategoryRo.reportObjectName] : this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName];
    reportDetailsForCreateOpp.lstReportObjectOnRow = [];
    reportDetailsForCreateOpp.lstReportSortingDetails = [];
    reportDetailsForCreateOpp.lstReportSortingDetails[0] = {};
    reportDetailsForCreateOpp.lstReportSortingDetails[0].reportObject = this.spendRo;
    reportDetailsForCreateOpp.lstReportSortingDetails[0].sortType = 1;
    reportDetailsForCreateOpp.lstReportSortingDetails[0].sortOrder = 1;
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.supplierRoForList);
    reportDetailsForCreateOpp.lstReportObjectOnValue = filter(reportDetailsForCreateOpp.lstReportObjectOnValue, (_ro) => {
      return _ro.reportObjectId == this.spendRo.reportObjectId;
    });
    let filterFormattedValue = this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView ? AnalyticsUtilsService.GetFormattedFilterValue(this.level4CategoryRo, this.selectedSupplier) : AnalyticsUtilsService.GetFormattedFilterValue(this.supplierRo, this.selectedSupplier);
    reportDetailsForCreateOpp.lstFilterReportObject.push(
      AnalyticsUtilsService.createDrillDriveFilterReportObj(
        { reportObject: this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView ? this.level4CategoryRo : this.supplierRo, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
      )
    );

    return reportDetailsForCreateOpp;
  }
  generateLevel4BasedReportDetails(rowIndex) {
    let reportDetailsForCreateOpp = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);

    this.selectedSupplier = this.gridData.level4OpportunityView.series[rowIndex][this.level4CategoryRo.reportObjectName];
    this.selectedBestPaymentTerm = this.gridData.level4OpportunityView.series[rowIndex][this.bestPaymentTermRo.reportObjectName];
    reportDetailsForCreateOpp.lstReportObjectOnRow = [];
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.level4CategoryRo);
    reportDetailsForCreateOpp.lstReportSortingDetails = [];
    reportDetailsForCreateOpp.lstReportSortingDetails[0] = {};
    reportDetailsForCreateOpp.lstReportSortingDetails[0].reportObject = this.level4CategoryRo;
    reportDetailsForCreateOpp.lstReportSortingDetails[0].sortType = 0;
    reportDetailsForCreateOpp.lstReportSortingDetails[0].sortOrder = 1;
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.bestPaymentTermRo);
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.paymentTermNameRO);
    reportDetailsForCreateOpp.lstReportObjectOnValue = filter(reportDetailsForCreateOpp.lstReportObjectOnValue, (_ro) => {
      return _ro.reportObjectId == this.spendRo.reportObjectId;
    });
    let filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.level4CategoryRo, this.selectedSupplier)
    reportDetailsForCreateOpp.lstFilterReportObject.push(
      AnalyticsUtilsService.createDrillDriveFilterReportObj(
        { reportObject: this.level4CategoryRo, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
      )
    );
    return reportDetailsForCreateOpp;
  }


  generateSupplierBasedReportDetails(rowIndex) {
    // let masterData: any = find(this._dashboardCommService.oppFinderMasterData.OpportunityFinderTypeMaster, { OpportunityFinderTypeName: this._dashboardCommService.oppFinderState.strategy.name });
    // if (masterData && typeof masterData.AdditionalProps == 'string' && this._commUtil.isNune(masterData.AdditionalProps)) {
    //     masterData.AdditionalProps = JSON.parse(masterData.AdditionalProps);
    // }
    let reportDetailsForCreateOpp = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
    // if (!this._commUtil.isNune(this.supplierRo)) {
    //     this.supplierRo = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (rO) => {
    //         return rO.ReportObjectId.toLowerCase() == masterData.AdditionalProps.supplier_reportObjectId.toLowerCase();
    //     });
    // }
    // let bestPaymentTermRo = find(reportDetailsForCreateOpp.lstReportObjectOnValue, (rO) => {
    //     return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.bestPaymentTerm_reportObjectId.toLowerCase();
    // });
    // let spendRO = find(reportDetailsForCreateOpp.lstReportObjectOnValue, (rO) => {
    //     return rO.reportObjectId.toLowerCase() == masterData.AdditionalProps.spend_reportObjectId.toLowerCase();
    // });
    this.selectedSupplier = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.supplierRo.ReportObjectName];
    this.selectedBestPaymentTerm = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][this.bestPaymentTermRo.reportObjectName];
    // this.addressableSpend = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
    reportDetailsForCreateOpp.lstReportObjectOnRow = filter(reportDetailsForCreateOpp.lstReportObjectOnRow, (_ro) => {
      return _ro.reportObjectId == this.supplierRo.ReportObjectId;
    });
    // logic to push 'Actual Payment Term' RO in lstReportObjectOnRow
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.bestPaymentTermRo);
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.paymentTermNameRO);
    reportDetailsForCreateOpp.lstReportObjectOnValue = filter(reportDetailsForCreateOpp.lstReportObjectOnValue, (_ro) => {
      return _ro.reportObjectId == this.spendRo.reportObjectId;
    });
    // Add Potential savings RO

    let filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.supplierRo, this.selectedSupplier)
    reportDetailsForCreateOpp.lstFilterReportObject.push(
      AnalyticsUtilsService.createDrillDriveFilterReportObj(
        { reportObject: this.supplierRo, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
      )
    );
    return reportDetailsForCreateOpp;
  }
  generateSupplierBasedReportDetailsEditMode(supplierName) {
    let reportDetailsForCreateOpp = this._commUtil.getDeReferencedObject(this.config.dashletInfoArray[0].reportDetails);
    this.selectedSupplier = supplierName;
    this.selectedBestPaymentTerm = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
    if (this._dashboardCommService.oppFinderState.gridJson['level4CategoryName'] != undefined) {
      reportDetailsForCreateOpp.lstReportObjectOnRow = filter(reportDetailsForCreateOpp.lstReportObjectOnRow, (_ro) => {
        return _ro.reportObjectId == this.level4CategoryRo.reportObjectId;
      });
    }
    else reportDetailsForCreateOpp.lstReportObjectOnRow = filter(reportDetailsForCreateOpp.lstReportObjectOnRow, (_ro) => {
      return _ro.reportObjectId == this.supplierRo.ReportObjectId;
    });
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.bestPaymentTermRo);
    // logic to push 'Actual Payment Term' RO in lstReportObjectOnRow
    reportDetailsForCreateOpp.lstReportObjectOnRow.push(this.paymentTermNameRO);
    reportDetailsForCreateOpp.lstReportObjectOnValue = filter(reportDetailsForCreateOpp.lstReportObjectOnValue, (_ro) => {
      return _ro.reportObjectId == this.spendRo.reportObjectId;
    });
    // Add Potential savings RO
    let filterFormattedValue: any;
    if (this._dashboardCommService.oppFinderState.gridJson['level4CategoryName'] != undefined) {
      filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.level4CategoryRo, this.selectedSupplier)
      reportDetailsForCreateOpp.lstFilterReportObject.push(
        AnalyticsUtilsService.createDrillDriveFilterReportObj(
          { reportObject: this.level4CategoryRo, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
        )
      );
    }
    else {
      filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(this.supplierRo, this.selectedSupplier)
      reportDetailsForCreateOpp.lstFilterReportObject.push(
        AnalyticsUtilsService.createDrillDriveFilterReportObj(
          { reportObject: this.supplierRo, filterValue: filterFormattedValue[0], filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter }
        )
      );
    }
    return reportDetailsForCreateOpp;
  }
  generateCreateOppGridforLevel4(rowIndex, response) {
    let gridConfig = this.generateGrid({}, response);
    this.currentPageLevel4List = [];

    if (response && response.Data && this._commUtil.isNune(response.Data[0])) {
      each(response.Data, (record) => {
        record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
        record[DashboardConstants.UIMessageConstants.STRING_OPPORTUNITIES] = '';
        record[DashboardConstants.UIMessageConstants.STRING_CREATE_NEW] = DashboardConstants.UIMessageConstants.STRING_CREATE_NEW;
        this.currentPageLevel4List.push(record[this.level4CategoryRo.reportObjectName]);
      });

      gridConfig.series = Object.assign([], response.Data);
      this.gridData.level4OpportunityView = gridConfig;
      this.costOfCapital = this.sliderConfig.from = 10;

      //this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.level4DrillView;
      this.getLevel4CategoryWiseOpportunities(this.currentPageLevel4List).then((oppResponse) => {
        //this.updateFlexGridData();
        this.level4Series = this._commUtil.getDeReferencedObject(this.gridData.level4OpportunityView.series);
        this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
        this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.level4DrillView;
        this.setState();
      });
    }
    //this.setState();
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
      enableFooter: false,
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
      allowSorting: false,
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
          allowMerging: this.supplierRo.ReportObjectName == col || this.bestPaymentTermRo.reportObjectName == col || this.level4CategoryRo.reportObjectName == col ? true : false,
          allowSorting: false,
          visible: true
        })
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
      gridConfig.column.push({
        aggregate: 0,
        binding: DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT,
        format: undefined,
        header: DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT,
        isReadOnly: false,
        allowMerging: false,
        //selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
        allowSorting: false,
        visible: true
      });
      // add potential savings column here
      gridConfig.column.push({
        aggregate: 0,
        binding: DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS,
        format: undefined,
        header: DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS,
        isReadOnly: true,
        allowMerging: false,
        allowSorting: false,
        visible: true
      });

      response.Data.forEach((record) => {
        let summationProductAddressableSpend: number;
        if (response.Data[0][this.supplierRo.ReportObjectName])
          record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage][rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
        else if (response.Data[0][this.level4CategoryRo.reportObjectName])
          record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.gridData.level4OpportunityView.series[rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
        // dummy data
        record[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] =
          (
            (
              (
                this.selectedBestPaymentTerm - record[this.paymentTermNameRO.reportObjectName]
              ) / 365
            )
            * this.costOfCapital * record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * record[this.spendRo.reportObjectName]
          ) / (100 * 100);
        summationProductAddressableSpend += (record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * record[this.spendRo.reportObjectName] * 0.01);
      });
      gridConfig.series = Object.assign([], response.Data);
      this.totalSpend = sumBy(gridConfig.series, this.spendRo.reportObjectName);
      this.totalSpend = Number(this.totalSpend.toFixed(2));
      this.totalPotentialSavings = sumBy(gridConfig.series, DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS);
      this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
      this.effectiveAddressableSpend = gridConfig.series[0][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * 0.01 * this.totalSpend;
      this.effectiveAddressableSpend = Number(this.effectiveAddressableSpend.toFixed(2));
      this.weightedAvgAddressableSpend = this.gridData.gridDetailsView.series[rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
      let totalRow: any = {};
      totalRow[this.supplierRo.ReportObjectName] = response.Data[0][this.supplierRo.ReportObjectName];
      if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name)
        totalRow[this.level4CategoryRo.reportObjectName] = response.Data[0][this.level4CategoryRo.reportObjectName];
      totalRow[this.bestPaymentTermRo.reportObjectName] = response.Data[0][this.bestPaymentTermRo.reportObjectName];
      totalRow[this.paymentTermNameRO.reportObjectName] = DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT;
      totalRow[this.spendRo.reportObjectName] = this.totalSpend;
      totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = "";
      totalRow[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = this.totalPotentialSavings;
      gridConfig.series.push(totalRow);

    }

    this.gridData.createOpportunityView = gridConfig;
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
      allowMerging: 'All',
      selectionMode: DashboardConstants.WijmoConfiuration.WijmoSelectionMode.CELL,
      allowSorting: false,
      enableFooter: false,
      column: [],
      series: []
    }
    if (response && this._commUtil.isNune(response) && this._dashboardCommService.oppFinderState.extraProps.currentState != stateManagement.createOpportunityView) {
      Object.keys(response[0]).forEach((col) => {
        gridConfig.column.push({
          aggregate: 0,
          binding: col,
          format: undefined,
          header: col,
          isReadOnly: col == DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT ? false : true,
          allowMerging: this.supplierRo.ReportObjectName == col || this.level4CategoryRo.reportObjectName == col || this.bestPaymentTermRo.reportObjectName == col ? true : false,
          allowSorting: false,
          visible: true
        })
      });
      gridConfig.series = Object.assign([], response);
      if (gridConfig.series[gridConfig.series.length - 1][this.paymentTermNameRO.reportObjectName] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {
        let totalRow: any = {};
        totalRow[this.supplierRo.ReportObjectName] = supplierName;
        totalRow[this.bestPaymentTermRo.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
        totalRow[this.paymentTermNameRO.reportObjectName] = DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT;
        totalRow[this.spendRo.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.spend;
        // totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this._dashboardCommService.oppFinderState.gridJson.addressableSpend;
        totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = "";
        totalRow[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = this._dashboardCommService.oppFinderState.gridJson.savings;
        gridConfig.series.push(totalRow);
      }
      this.gridData.createOpportunityView = gridConfig;
      this.sliderConfig.from = this.costOfCapital = this._dashboardCommService.oppFinderState.gridJson.costOfCapital;
      this.effectiveAddressableSpend = this._dashboardCommService.oppFinderState.gridJson.effectiveAddressableSpend;
      this.totalPotentialSavings = this._dashboardCommService.oppFinderState.gridJson.savings;
      this.refreshNewOld.date = this._dashboardCommService.oppFinderState.gridJson.dataDate;
    }
    else if (response && this._commUtil.isNune(response) && !this.refreshNewClicked) {
      this.gridData.createOpportunityView.series = response;
      let totalRow: any = {};
      totalRow[this.supplierRo.ReportObjectName] = supplierName;
      totalRow[this.bestPaymentTermRo.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm;
      totalRow[this.paymentTermNameRO.reportObjectName] = DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT;
      totalRow[this.spendRo.reportObjectName] = this._dashboardCommService.oppFinderState.gridJson.spend;
      // totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this._dashboardCommService.oppFinderState.gridJson.addressableSpend;
      totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = "";
      totalRow[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = this._dashboardCommService.oppFinderState.gridJson.savings;
      gridConfig.series.push(totalRow);
      this.setState();
      this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
      this.sliderConfig.from = this.costOfCapital = this._dashboardCommService.oppFinderState.gridJson.costOfCapital;
      this.refreshNewOld.date = this._dashboardCommService.oppFinderState.gridJson.dataDate;

    }

    else if (this.refreshNewClicked && response && response.Data && this._commUtil.isNune(response.Data[0])) {
      this.refreshNewClicked = false;
      response.Data.forEach((record) => {
        //record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
        // dummy data
        record[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] =
          (
            (
              (
                this.selectedBestPaymentTerm - record[this.paymentTermNameRO.reportObjectName]
              ) / 365
            )
            * this.costOfCapital * record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * record[this.spendRo.reportObjectName]
          ) / (100 * 100);
        // summationProductAddressableSpend += (record[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * record[this.spendRo.reportObjectName] * 0.01);
        this.totalSpend = this.totalSpend + record[this.spendRo.reportObjectName];
        this.totalSpend = Number(this.totalSpend.toFixed(2));
        //OnRefresh old value spend total was appending to itself on each refresh BUG ID:RP- 157
        this.totalSpend = this._dashboardCommService.oppFinderState.gridJson.spend
      });
      this.gridData.createOpportunityView.series = response.Data;
      this.totalPotentialSavings = sumBy(this.gridData.createOpportunityView.series, DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS);
      this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
      this.effectiveAddressableSpend = this.gridData.createOpportunityView.series[0][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * 0.01 * this.totalSpend;
      this.effectiveAddressableSpend = Number(this.effectiveAddressableSpend.toFixed(2));
      this.weightedAvgAddressableSpend = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
      let totalRow: any = {};
      totalRow[this.supplierRo.ReportObjectName] = response.Data[0][this.supplierRo.ReportObjectName];
      totalRow[this.bestPaymentTermRo.reportObjectName] = response.Data[0][this.bestPaymentTermRo.reportObjectName];
      totalRow[this.paymentTermNameRO.reportObjectName] = DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT;
      totalRow[this.spendRo.reportObjectName] = this.totalSpend;
      // totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.weightedAvgAddressableSpend;
      totalRow[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = "";
      totalRow[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = this.totalPotentialSavings;
      this.gridData.createOpportunityView.series.push(totalRow);
      this.setState();
      this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
      this.totalPotentialSavings = sumBy(this.gridData.createOpportunityView.series, DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS);
      this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
      this.effectiveAddressableSpend = this.gridData.createOpportunityView.series[0][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * 0.01 * this.totalSpend;
      this.effectiveAddressableSpend = Number(this.effectiveAddressableSpend.toFixed(2));
    }
    this.weightedAvgAddressableSpend = DashboardConstants.OpportunityFinderConstants.DEFAULT_ADDRESSABLE_SPEND;
    this.setState();
  }
  updateAddressableSpend() {
    if (this.validateAddressableSpend(this.applyToAllAddressableSpend.Value)) {
      if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
        this.gridData.gridDetailsView.series = this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage];
        this.gridData.gridDetailsView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.applyToAllAddressableSpend.Value;
        this.potentialSavingsCalculation(this.differenceCalculation());
        this.updateFlexGridData();
      }
      else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView) {
        //this.gridData.level4OpportunityView.series = this.gridData.level4OpportunityView.pageData[this.gridData.gridDetailsView.currentPage];
        this.gridData.level4OpportunityView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.applyToAllAddressableSpend.Value;
        this.potentialSavingsCalculation(this.differenceCalculation());
        this.updateFlexGridData();
      }
      else {
        this.gridData.createOpportunityView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.applyToAllAddressableSpend.Value;
        this.potentialSavingsCalculation(this.differenceCalculation());
        this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
      }
    }
    else {
      this.applyToAllAddressableSpend.Value = this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView ? this.gridData.gridDetailsView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] : this.gridData.createOpportunityView.series[this.rowIndex][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT];
    }

  }
  public onDocumentClick(event): void {
    if (this.applyToAllAddressableSpend.Value != null) {
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
  potentialSavingsCalculation(difference) {
    let summationProductAddressableSpend: number = 0;
    this.totalSpend = 0;
    this.totalPotentialSavings = 0;
    this.effectiveAddressableSpend = 0;
    this.weightedAvgAddressableSpend = 0;
    // let totalSpend: number = 0;
    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      this.gridData.gridDetailsView.series.forEach((item, index) => {
        if (this.validateAddressableSpend(item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
          // item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = (difference[index] / 365) * ((this.costOfCapital * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT]) / (100 * 100));
          item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = (difference[index] / 365) * this.costOfCapital * 0.01 * 0.01 * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName];

        }
      });
      this.updateFlexGridData();
    }
    else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView) {
      this.gridData.level4OpportunityView.series.forEach((item, index) => {
        if (this.validateAddressableSpend(item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
          // item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = (difference[index] / 365) * ((this.costOfCapital * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT]) / (100 * 100));
          item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = (difference[index] / 365) * this.costOfCapital * 0.01 * 0.01 * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName];
        }
      });
      this.updateFlexGridData();
    }
    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.createOpportunityView) {
      if (this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked) {
        this.gridData.createOpportunityView.series.forEach((item, index) => {
          if (this.validateAddressableSpend(item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
            if (item[this.paymentTermNameRO.reportObjectName] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {
              item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] =
                (
                  (
                    (
                      this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm - item[this.paymentTermNameRO.reportObjectName]
                    ) / 365
                  )
                  * this.costOfCapital * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName] * 0.01 * 0.01
                );
              summationProductAddressableSpend += (item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName] * 0.01);
              this.totalSpend += item[this.spendRo.reportObjectName];
              this.totalPotentialSavings += item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS];

            }
          }
        });

      }
      else {
        this.gridData.createOpportunityView.series.forEach((item, index) => {
          if (this.validateAddressableSpend(item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT])) {
            if (item[this.paymentTermNameRO.reportObjectName] != DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {

              item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] =
                (
                  (
                    (
                      this.selectedBestPaymentTerm - item[this.paymentTermNameRO.reportObjectName]
                    ) / 365
                  )
                  * this.costOfCapital * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName] * 0.01 * 0.01
                );
              summationProductAddressableSpend += (item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName] * 0.01);
              this.totalSpend = (this.totalSpend + item[this.spendRo.reportObjectName]);
              this.totalPotentialSavings += item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS];
            }
          }
        });
      }
      this.totalPotentialSavings = Number(this.totalPotentialSavings.toFixed(2));
      this.totalSpend = Number(this.totalSpend.toFixed(2));
      this.weightedAvgAddressableSpend = (summationProductAddressableSpend / this.totalSpend) * 100;
      this.effectiveAddressableSpend = summationProductAddressableSpend;
      this.effectiveAddressableSpend = Number(this.effectiveAddressableSpend.toFixed(2));
      this.gridData.createOpportunityView.series.forEach((item, index) => {
        if (item[this.paymentTermNameRO.reportObjectName] == DashboardConstants.UIMessageConstants.STRING_TOTAL_TEXT) {
          item[this.spendRo.reportObjectName] = this.totalSpend;
          item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = "";
          item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] = this.totalPotentialSavings;
        }
      });
      //this.totalSpend=this.totalSpend.toFixed(2);

      // (
      //     sumBy(this.gridData.createOpportunityView.series, DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS)
      //     * 365 * 100 * 100
      // ) /
      // (
      //     this.costOfCapital * sumBy(this.gridData.createOpportunityView.series, this.spendRo.reportObjectName)
      // );
      this.gridData.createOpportunityView.gridAPI.updateFlexGrid(this.gridData.createOpportunityView.series);
    }
  }
  differenceCalculation() {
    let _sigma_differenceBestActual: Array<number> = [];
    if (this.gridData.gridDetailsView.series && this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
      this.prevSeries.forEach((item) => {
        //_sigma_differenceBestActual.push((item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] * 365 * 100 * 100) / (this.costOfCapital * this.prevSeries[index][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName]));
        _sigma_differenceBestActual.push((item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] * 365 * 100 * 100) / (DashboardConstants.OpportunityFinderConstants.DEFAULT_COST_OF_CAPITAL * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName]));
      });
    }
    else if (this.gridData.level4OpportunityView.series && this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView) {
      this.level4Series.forEach((item) => {
        //_sigma_differenceBestActual.push((item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] * 365 * 100 * 100) / (this.costOfCapital * this.prevSeries[index][DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName]));
        _sigma_differenceBestActual.push((item[DashboardConstants.UIMessageConstants.STRING_POTENTIAL_SAVINGS] * 365 * 100 * 100) / (DashboardConstants.OpportunityFinderConstants.DEFAULT_COST_OF_CAPITAL * item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] * item[this.spendRo.reportObjectName]));
      });
    }
    return _sigma_differenceBestActual;
  }
  applyToAll() {
    this.editTextfield = true;
    if (this.validateAddressableSpend(this.applyToAllAddressableSpend.Value)) {
      if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.gridDetailsView) {
        this.gridData.gridDetailsView.series.forEach((item) => {
          item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.applyToAllAddressableSpend.Value;
        });
      }
      else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.level4DrillView) {
        this.gridData.level4OpportunityView.series.forEach((item) => {
          item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.applyToAllAddressableSpend.Value;
        });
      }
      else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.createOpportunityView) {
        this.gridData.createOpportunityView.series.forEach((item) => {
          item[DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT] = this.applyToAllAddressableSpend.Value;
        });
      }
      this.potentialSavingsCalculation(this.differenceCalculation());
    }
  }
  validateAddressableSpend(addressableSpend) {
    if (addressableSpend > 100 || addressableSpend < 0 || addressableSpend == null) {
      this._commUtil.getMessageDialog(
        DashboardConstants.UIMessageConstants.STRING_ADDRESSABLE_SPEND_PERCENT_MESSAGE
        , () => { });
      return false;
    }
    else {
      return true;
    }
  }
  popupConfig() {
    let popupConfig: any;
    if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
      popupConfig = {
        targetedBestPaymentTerm: this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked ? this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm : this.selectedBestPaymentTerm,
        supplier: this._dashboardCommService.oppFinderState.editMode ? this._dashboardCommService.oppFinderState.gridJson.supplierName : this.gridData.gridDetailsView.series[this.rowIndex][this.supplierRo.ReportObjectName],
        costOfCapital: this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked ? this._dashboardCommService.oppFinderState.gridJson.costOfCapital : this.costOfCapital,
        totalSpend: this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked ? this._dashboardCommService.oppFinderState.gridJson.spend : this.totalSpend,
        totalPotentialSavings: this.totalPotentialSavings,
        effectiveAddressableSpend: this.effectiveAddressableSpend,
      };
    }
    else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
      if (this._dashboardCommService.oppFinderState.editMode && !this.refreshNewClicked) {
        popupConfig = {
          targetedBestPaymentTerm: this._dashboardCommService.oppFinderState.gridJson.bestPaymentTerm,
          categoryName: this._dashboardCommService.oppFinderState.gridJson['level4CategoryName'] != undefined ? this._dashboardCommService.oppFinderState.gridJson.level4CategoryName : this._dashboardCommService.oppFinderState.gridJson.level3CategoryName,
          categoryLevel: this._dashboardCommService.oppFinderState.gridJson['level4CategoryName'] != undefined ? 4 : 3,
          costOfCapital: this._dashboardCommService.oppFinderState.gridJson.costOfCapital,
          totalSpend: this._dashboardCommService.oppFinderState.gridJson.spend,
          totalPotentialSavings: this.totalPotentialSavings,
          effectiveAddressableSpend: this.effectiveAddressableSpend,
        };
      }
      else if (this.gridData.level4OpportunityView.series.length) {
        popupConfig = {
          targetedBestPaymentTerm: this.selectedBestPaymentTerm,
          categoryName: this.gridData.level4OpportunityView.series[this.rowIndex][this.level4CategoryRo.reportObjectName],
          categoryLevel: 4,
          costOfCapital: this.costOfCapital,
          totalSpend: this.totalSpend,
          totalPotentialSavings: this.totalPotentialSavings,
          effectiveAddressableSpend: this.effectiveAddressableSpend,
        };
      }
      else popupConfig = {
        targetedBestPaymentTerm: this.selectedBestPaymentTerm,
        categoryName: this.gridData.gridDetailsView.series[this.rowIndex][this.supplierRo.ReportObjectName],
        categoryLevel: 3,
        costOfCapital: this.costOfCapital,
        totalSpend: this.totalSpend,
        totalPotentialSavings: this.totalPotentialSavings,
        effectiveAddressableSpend: this.effectiveAddressableSpend,
      };
    }
    return popupConfig;
  }
  onApply() {
    // update logi for create opp grid
    let difference = this.differenceCalculation();
    if (this._dashboardCommService.oppFinderState.editMode) {
      this._dashboardCommService.oppFinderState.gridJson.costOfCapital = this.sliderConfig.from;
    }
    this.costOfCapital = this.sliderConfig.from;
    this.potentialSavingsCalculation(difference);
    this.setState();
  }

  onRefreshClick(text: string) {
    let dateObj = new Date();
    //let index = findIndex(this.gridData.gridDetailsView.pageData[this.gridData.gridDetailsView.currentPage], { "Supplier - Normalized": this._dashboardCommService.oppFinderState.gridJson.supplierName });
    if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.createOpportunityView) {
      this.refreshNewOld.text = text == DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_OLD_VALUES ? DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_LATEST_VALUES : DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_OLD_VALUES;
      if (text == DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_LATEST_VALUES) {
        this.refreshNewClicked = true;
        if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
          if (this._dashboardCommService.oppFinderState.gridJson['level3CategoryName'] != undefined)
            this.createNewOppEditMode(this._dashboardCommService.oppFinderState.gridJson.level3CategoryName);
          else this.createNewOppEditMode(this._dashboardCommService.oppFinderState.gridJson.level4CategoryName);
        }
        else this.createNewOppEditMode(this._dashboardCommService.oppFinderState.gridJson.supplierName);
        // this.refreshNewOld.date = (dateObj.getMonth()+1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
        this.refreshNewOld.date = this._commUtil.getDateInFormat(dateObj);
      }
      else {
        this._loaderService.showGlobalLoader();
        this.generateOppFinderGridJSON().then((response) => {
          if (response) {
            if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
              if (this._dashboardCommService.oppFinderState.gridJson['level3CategoryName'] != undefined)
                this.generateCreateOppGridEditMode(this._dashboardCommService.oppFinderState.gridJson.level3CategoryName, this._dashboardCommService.oppFinderState.gridJson.gridJson);
              else this.generateCreateOppGridEditMode(this._dashboardCommService.oppFinderState.gridJson.level4CategoryName, this._dashboardCommService.oppFinderState.gridJson.gridJson);
            }
            else this.generateCreateOppGridEditMode(this._dashboardCommService.oppFinderState.gridJson.supplierName, this._dashboardCommService.oppFinderState.gridJson.gridJson);
            this.refreshNewOld.date = this._dashboardCommService.oppFinderState.gridJson.dataDate;
          }
        })
        //this._dashboardCommService.oppFinderState.oppFinderId = this._commUtil.getUrlParam('oppfinderId');
        //this.generateOppFinderGridJSON();
      }
    }
  }
  footerCancelClick() {
    this.isCreateNewOppClicked = false;
    this._appConstants.userPreferences.moduleSettings.showFilterIconOption = true;
    this.refreshNewOld.text = DashboardConstants.UIMessageConstants.STRING_REFRESH_GRID_WITH_LATEST_VALUES;
    if (this._dashboardCommService.oppFinderState.editMode) {
      this._dashboardCommService.oppFinderState.editMode = false;
      window.location.href = this._commonUrls.URLs.OpportunityFinderApiUrls.getLandingPageURLForOppFinder;
    }
    else {
      if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
        if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.createOpportunityView && this.gridData.level4OpportunityView.series != undefined && this.gridData.level4OpportunityView.series.length) {
          this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.level4DrillView;
        }
        else if (this._dashboardCommService.oppFinderState.extraProps.currentState == stateManagement.opportunityDetailsView && this.categoryLevel == 4) {
          this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.level4DrillView;
        }
        else {
          if (this.oldCostofCapital != undefined)
            this.costOfCapital = this.sliderConfig.from = this._commUtil.getDeReferencedObject(this.oldCostofCapital);
          this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
        }
      }
      else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
        if (this.oldCostofCapital != undefined)
          this.costOfCapital = this.sliderConfig.from = this._commUtil.getDeReferencedObject(this.oldCostofCapital);
        this._dashboardCommService.oppFinderState.extraProps.currentState = stateManagement.gridDetailsView;
        this.gridData.gridDetailsView.showPagination = true;
      }
      this.updateFlexGridData();

    }
    setTimeout(() => { this.setGridResolution(); }, 500);

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
          ]
          , (_response: any) => {
            if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
              this.saveOpportunityFinderDetails();
            }
          });

      }
    });
  }

  private popupValidations() {
    return new Promise((resolve, reject) => {
      if (!this._commUtil.isNune(this.config.OpportunityName.value)) {
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_NAME,
          () => { },
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        );
      }
      else if (!this._commUtil.isNune(this.config.OpportunityDescription.value)) {
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_DESC,
          () => { },
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        );
      }
      else if (!this.config.Confidence || !this.config.Confidence.name || this.config.Confidence.name == DashboardConstants.UIMessageConstants.STRING_Confidence_Level) {
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_CR_OPP_MISSING_OPP_EOI,
          () => { },
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        );
      }
      else if (!this._commUtil.isValidGuid(this._dashboardCommService.oppFinderState.oppFinderId)) {
        console.log('Invalid Opportunity Id : ', this._dashboardCommService.oppFinderState.oppFinderId);
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_SHOW_SOMETHING_WENT_WRONG,
          () => { },
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        );
      }
      else if (!this._commUtil.isValidGuid(this.config.opportunityTypeMasterData.OpportunityFinderTypeObjectId)) {
        console.log('Invalid Opportunity type Id : ', this.config.opportunityTypeMasterData.OpportunityFinderTypeObjectId);
        this._commUtil.getMessageDialog(
          DashboardConstants.UIMessageConstants.STRING_SHOW_SOMETHING_WENT_WRONG,
          () => { },
          DashboardConstants.OpportunityFinderConstants.STRING_ERROR
        );
      }
      else {
        resolve(true);
      }
    })
  }

  private saveOpportunityFinderDetails() {
    try {
      this._loaderService.showGlobalLoader();
      let totalSpend: number = this.config.opportunityRowData["totalSpend"];
      let totalEstimatedSavings: number = this.config.opportunityRowData["totalPotentialSavings"];
      let effectiveAddressableSpend: number = this.config.opportunityRowData["effectiveAddressableSpend"];
      let dateObj = new Date();
      let gridJson: any;
      if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTN.name) {
        gridJson = {
          opportunityName: this.config.OpportunityName.value,
          opportunityDescription: this.config.OpportunityDescription.value,
          spend: totalSpend,
          costOfCapital: this.costOfCapital,
          addressableSpend: this.weightedAvgAddressableSpend,
          countPaymentTerm: this.gridData.createOpportunityView.series.length,
          bestPaymentTerm: this.selectedBestPaymentTerm,
          effectiveAddressableSpend: this.effectiveAddressableSpend,
          savings: totalEstimatedSavings,
          EOI_Data: this.config.EOI_Data,
          Confidence: this.config.Confidence,
          supplierName: this.gridData.createOpportunityView.series[0][this.supplierRo.ReportObjectName],
          gridJson: this.gridData.createOpportunityView.series,
          dataDate: this._commUtil.getDateInFormat(dateObj)

        }
      }
      else if (this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.APTI.name) {
        gridJson = {
          opportunityName: this.config.OpportunityName.value,
          opportunityDescription: this.config.OpportunityDescription.value,
          spend: totalSpend,
          costOfCapital: this.costOfCapital,
          addressableSpend: this.weightedAvgAddressableSpend,
          countPaymentTerm: this.gridData.createOpportunityView.series.length,
          bestPaymentTerm: this.selectedBestPaymentTerm,
          effectiveAddressableSpend: this.effectiveAddressableSpend,
          savings: totalEstimatedSavings,
          EOI_Data: this.config.EOI_Data,
          Confidence: this.config.Confidence,
          gridJson: this.gridData.createOpportunityView.series,
          dataDate: this._commUtil.getDateInFormat(dateObj)

        }
        if (this.gridData.createOpportunityView.series[0][this.supplierRo.ReportObjectName] != undefined)
          gridJson.level3CategoryName = this.gridData.createOpportunityView.series[0][this.supplierRo.ReportObjectName]
        else gridJson.level4CategoryName = this.gridData.createOpportunityView.series[0][this.level4CategoryRo.reportObjectName]
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
        TotalSavings: totalEstimatedSavings,
        TotalEstimatedSavings: 0,
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

  setGridResolution() {
    let thisRef = this,
      windowInnerHeight = window.innerHeight,
      currentHeight = thisRef._elementRef.nativeElement.querySelector(".input-parent-container").offsetHeight,
      smartextrHeaderHeight = document.querySelector(".nav-wrapper").clientHeight,
      smartSubHeaderHeight = document.querySelector(".extra-nav-wrap").clientHeight,
      diffHeight = windowInnerHeight - (currentHeight + smartextrHeaderHeight + smartSubHeaderHeight + 140);
    setTimeout(function () {
      thisRef._elementRef.nativeElement.querySelector(".gridHeightAuto").style.height = diffHeight + "px";
    }, 1000);
    // console.log(diffHeight);
  }
  private setState() {
    this._cdRef.markForCheck();
  }
  onKeyUp() {
    
  }
}

export enum stateManagement {
  gridDetailsView = 'gridDetailsView',
  opportunityDetailsView = 'opportunityDetailsView',
  createOpportunityView = 'createOpportunityView',
  level4DrillView = 'level4DrillView'
}
