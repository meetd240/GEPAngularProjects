import { Component, OnInit, ElementRef, Renderer2, OnDestroy, ViewEncapsulation, Input, ChangeDetectionStrategy } from '@angular/core';
// import { LazyComponentConfiguration } from '../../../modules-manifest';
import { DashboardConstants } from '@vsDashboardConstants';
import { findIndex } from 'lodash';
import { DashboardCommService } from '@vsDashboardCommService';
import { CommonUtilitiesService } from '@vsCommonUtils';

@Component({
    selector: 'add-to-standard-filter-popup',
    templateUrl: './add-to-standard-filter-popup.component.html',
    styleUrls: ['./add-to-standard-filter-popup.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
export class AddToStandardFilterPopupComponent implements OnInit, OnDestroy {
    // static componentId = LazyComponentConfiguration.addToStandardFilterPopup.componentName;



    @Input() config: any;
    selectedFilter: Array<any> = [];
    _dashboardConst = DashboardConstants;    
    btnCloseConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
        flat: true
    };
    btnAddConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_ADD_TXT,
        flat: true
    };
    searchKeyText = { "value": '' };
    searchListConfig: any = {
        label: '',
        data: 'value',
        attributes: {
            maxLength: 5000,
            placeholder: DashboardConstants.UIMessageConstants.STRING_SEARCH_TEXT,
        }
    };
    // searchSelectedKeyText = { "value": '' };

    addToStandardFilterSearchTooltipConfig: any = {
        message: DashboardConstants.UIMessageConstants.STRING_SEARCH_TEXT,
        position: 'bottom'
    }
    addToStandardFilterCloseTooltipConfig: any = {
        message: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
        position: 'bottom'
    }

    nonStandardFilterPopupConfig: any;
    filterListConfig: any;
    isActiveSearchBlock = false;
    isActiveSearch = false;
    hideClose = false;
    showMe = false;
    activeCheckBox: any;
    tooltipconfig:any={
        message: DashboardConstants.UIMessageConstants.STRING_APPLIED_AS_SLICER,
        position:  DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.RIGHT,
    }
    constructor(  
      private _dashboardCommService: DashboardCommService,
      private _commUtil: CommonUtilitiesService,
    ) {
    }
    _dashboardCommServ = this._dashboardCommService;

    ngOnInit() {        
        this.loadConfig(
            this._commUtil.isNune(this.config.title) ? this.config.title:
            DashboardConstants.UIMessageConstants.STRING_ADD_TO_STANDARD_FILTERS
        );
        if(this.config.popUpFor === DashboardConstants.PopupFor.Slicer){
            this.tooltipconfig.message = DashboardConstants.UIMessageConstants.STRING_APPLIED_AS_GLOBAL;
        }
        this.isActiveSearchBlock = !(this.nonStandardFilterPopupConfig.nonStandardFilterList.length > 0);
        this.selectedFilter = this._commUtil.getDeReferencedObject(this._dashboardCommService.slicerFilterList);
    }

    ngOnDestroy() {
    }

    loadConfig(title) {
        // this.config.nonStandardFilterList.map((value: any, key: number) => { if (!value["isChecked"]) { value["isChecked"] = false; } });
        this.nonStandardFilterPopupConfig = {
            "title": title,
            "nonStandardFilterList": this.config.nonStandardFilterList,
        }


        this.filterListConfig = {
            // disable: false,
            // isMandatory: true,
            // isVisible: false,
            // label: '',
            // validate: true,
            // focus: true,
            // data: 'isChecked',
            // fieldKey: 'isChecked',
            // errorMessage: 'Error message'

            label: '',
            data: 'isChecked'

        };

    }

    closeAddToStandardFilter() {
        this.config.api.closeClick();
    }
    addToStandardFilterClick(filterList) {
        this.config.api.addClick();
    }

    showSearch() {
        this.isActiveSearch = true;
        this.showMe = true;
        this.hideClose = true;
    }

    hideSearch() {
        this.showMe = false;
        this.isActiveSearch = false;
        this.hideClose = false;
    }
    onChangeAddToFilterList(event, flag, filter) {
        if(flag){
            this.selectedFilter.push(filter);
        }
        else{
            let ind = findIndex(this.selectedFilter,{ReportObjectId: filter.ReportObjectId});
            if(ind != -1){
                this.selectedFilter.splice(ind,1);
            }
        }
        
        
    }

    onSearchKeypress(searchKeyText) { }

    public trackByReportObjectId(index, item) {
        return item.ReportObjectId
    }

}

