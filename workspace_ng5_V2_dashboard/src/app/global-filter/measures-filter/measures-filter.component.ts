import { Component, OnInit, Input, ChangeDetectionStrategy, AfterViewInit, ViewChild, ViewContainerRef, TemplateRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalFilterService } from "shared/services/global-filter-service/global-filter.service";
import { filter, map } from "lodash";
import { DashboardCommService } from "shared/services/dashboard-comm-service/dashboard-comm.service";
// import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardConstants } from "@vsDashboardConstants";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { AppConstants } from 'smart-platform-services';
// import { LazyComponentConfiguration } from "../../../../modules-manifest";

@Component({
    selector: 'measure-filter',
    templateUrl: './measures-filter.component.html',
    preserveWhitespaces: false,
    styleUrls: ['./measures-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MeasuresFilterComponent implements OnInit, AfterViewInit {
    // static componentId = LazyComponentConfiguration.MeasuresFilter.componentName;
    @Input() config;
    measureFilterObj: any;
    filterByMeasuresOpts: any;
    measureConditionValue: any = { 'value': '' }
    measureConditionRangeValue: any = {
        "from": '',
        "to": ''
    }
    globalSliderChecBoxConfig = {
        disable: false,
        isMandatory: false,
        isVisible: false,
        label: "Enable as global slider",
        validate: true,
        focus: true,
        errorMessage: "",
        fieldKey: "enabledAsGlobalSlider",
        data: 'enabledAsGlobalSlider'
    }
    showEnableAsGlobalSliderCheckBox = true;
    @ViewChild('recordMessageContainer', { read: ViewContainerRef }) public recordMessageContainer: ViewContainerRef;
    @ViewChild('displayRecordMessage') public displayRecordMessage: TemplateRef<any>;
    constructor(
        private _commUtils: CommonUtilitiesService,
        private _dashboardCommService: DashboardCommService,
        private filterService: GlobalFilterService,
        public _appConstants: AppConstants
    ) {

    }

    ngOnInit() {
        this.measureFilterObj = this.config;
        this.measuresFilterConfig();
        this.configureFilterConditionOperator(this.config);
        this.showEnabledAsGlobalSliderCheckBox();

    }

    onKeyUp()
    {
        
    }

    ngAfterViewInit() {
        this.measureConditionValue.value = this.measureFilterObj.FilterConditionValue;
        this.measureConditionRangeValue.from = this.measureFilterObj.FilterConditionRangeValue.from;
        this.measureConditionRangeValue.to = this.measureFilterObj.FilterConditionRangeValue.to;
        // Setting the Default FIlterBy as FilterByCondition for the Measure Filter
        this.measureFilterObj.FilterBy = DashboardConstants.FilterBy.FilterByCondition;
        if (!this._commUtils.isNune(this.measureFilterObj.FilterConditionOperator.FilterConditionObjectId)) {
            this.measureFilterObj.FilterConditionOperator = this._commUtils.getDeReferencedObject(this.filterByMeasuresOpts.options[0]);
        }

        let isFilterOpen
        isFilterOpen = this.filterService.fadeOutDashboardGrid();
        isFilterOpen = !isFilterOpen;
        if (isFilterOpen == true) {
            let dashboardWrapper = document.getElementById('dashboard-container-id'),
                mainContainer = document.getElementById('main-container-id');
            dashboardWrapper.classList.add("global-filter-fixed");
            mainContainer.classList.add("overflow-hide");
        }
        this.displayMessage();
    }
    showEnabledAsGlobalSliderCheckBox() {
        // const currentTabDetails = this._dashboardCommService.tabDashletInfo.lstTabDetails.find(x => x.tabId == this._dashboardCommService.selectedTab.tabId);
        // const isTabFilter : boolean = currentTabDetails.lstAppliedTabFilters.some(x => x.ReportObjectId == this.measureFilterObj.ReportObjectId);
        if (!this.measureFilterObj.isTabFilter) {
            this.showEnableAsGlobalSliderCheckBox = this._dashboardCommService.tabDashletInfo.lstTabDetails[0] &&
                this._dashboardCommService.tabDashletInfo.lstTabDetails[0].tabName.toLowerCase() === DashboardConstants.DefaultTab ? true : false;
        }
        else {
            this.showEnableAsGlobalSliderCheckBox = true;
        }
    }
    enabledAsGlobalSliderChange() {
        this.measureFilterObj.globalSliderObject.globalSliderMin = this.measureFilterObj.FilterConditionRangeValue.from;
        this.measureFilterObj.globalSliderObject.globalSliderMax = this.measureFilterObj.FilterConditionRangeValue.to;
        // if (!this.measureFilterObj.enabledAsGlobalSlider && this._commUtils.isNune(this._commUtils._widgetCards)) {
        //     this.measureFilterObj.FilterIdentifier = DashboardConstants.ViewFilterType.SingleSource;
        //     const index = this._commUtils._widgetCards.findIndex(x => x.cardId == this.measureFilterObj.ReportObjectId);
        //     if (index != -1) {
        //         this._commUtils._widgetCards[index].isRemoved = true;
        //         this._commUtils._widgetCards[index].subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.REMOVE_GLOBAL_SLIDER, cardId: this._commUtils._widgetCards[index].cardId })
        //     }
        // }
    }
    measuresFilterConfig() {
        this.filterByMeasuresOpts = {
            label: "",
            dataKey: 'op',
            displayKey: 'title',
            fieldKey: 'FilterConditionOperator',
            options: []
        };
    }

    onChangeFilterByOp(filterObj, op) {
        filterObj.enabledAsGlobalSlider = false;
        this.filterService.onChangeFilterByOp(filterObj, op);
        this.displayMessage();
    }

    onValueKeypress(filterObj, value) {
        this.measureFilterObj.FilterConditionValue = this.measureConditionValue.value;
        this.measureFilterObj.FilterConditionRangeValue.from = this._commUtils.isNune(this.measureConditionRangeValue.from) ? this.measureConditionRangeValue.from : '0';
        this.measureFilterObj.FilterConditionRangeValue.to = this._commUtils.isNune(this.measureConditionRangeValue.to) ?  this.measureConditionRangeValue.to : '0';
        this.measureFilterObj.globalSliderObject.globalSliderMin = this.measureFilterObj.FilterConditionRangeValue.from;
        this.measureFilterObj.globalSliderObject.globalSliderMax = this.measureFilterObj.FilterConditionRangeValue.to;
        // this.measureFilterObj.FilterConditionRangeValue.from =value;
        // this.measureFilterObj.FilterConditionRangeValue.to = value;
        this.filterService.onValueKeypress(filterObj, value);
    }

    private configureFilterConditionOperator(_reportObject: any) {

        let lstOfConditions: Array<any>;
        lstOfConditions = filter(this._dashboardCommService.FilterConditionMetadata, (filterObj, index) => {
            return (filterObj.FilterTypeObjectId == _reportObject.FilterTypeObjectId && !filterObj.IsPeriodFilter)
        });
        switch (_reportObject.FilterType) {
            case DashboardConstants.FilterType.Measure:
                this.filterByMeasuresOpts.options = map(lstOfConditions, (obj, index) => {
                    return {
                        op: obj.Condition,
                        title: obj.Name,
                        FilterConditionObjectId: obj.FilterConditionObjectId
                    }
                });
                break;
        }
    }

    public displayMessage() {
        this.recordMessageContainer.clear();
        if (
            this.measureFilterObj.FilterConditionOperator.op >= 16 &&
            this.measureFilterObj.FilterConditionOperator.op <= 19) {
            this.recordMessageContainer.createEmbeddedView(this.displayRecordMessage, {});
        }
    }
}
