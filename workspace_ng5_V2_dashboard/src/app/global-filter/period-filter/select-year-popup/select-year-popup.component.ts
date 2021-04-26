import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectionStrategy } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { remove, sortBy, each } from 'lodash';
import { CommonUtilitiesService } from "@vsCommonUtils";
// import { LazyComponentConfiguration } from '../../../../../modules-manifest';

@Component({
  selector: 'select-year-popup',
  templateUrl: './select-year-popup.component.html',
  styleUrls: ['./select-year-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})

export class SelectYearPopupComponent implements OnInit {
  // static componentId = LazyComponentConfiguration.SelectYearPopup.componentName;
  @Input() config: any;

  btnDoneConfig: any;
  btnCancelConfig: any;
  SelecYearConfig: any;
  sourceYear: Array<any>;
  selectedYearOptionsFinal: Array<any>;
  showSearchInput: boolean = false;
  searchYearConfig: any;
  searchYearModel: any = { "SearchYearValue": '' }
  IsCheckModel: any = { IsCheck: false }
  selectedYearList: any = [];
  selectedYearCount: any = 0;
  closeTooltipConfig: any;
  searchTooltipConfig: any
  selectedYear: any;
  YearfilteredList: any = [];
  doneClick: boolean = false;
  filterType: number;
  title: string;

  constructor(
    private _commUtil: CommonUtilitiesService
  ) {
  }

  ngOnInit() {

    this.sourceYear = this.config.api.sourceYear;

    this.selectedYearOptionsFinal = JSON.parse(JSON.stringify(this.config.api.appliedYearFilter));
    // this.sourceYear = this.data.sourceYear;
    // // console.log("year array",this.sourceYear)
    // this.selectedYearCount = this.data.appliedYearFilter.length;
    this.selectedYearCount = this.config.api.appliedYearFilter.length;
    this.doneClick = false;
    this.filterType = this.config.api.filterType;
    switch (this.filterType) {
      case DashboardConstants.FilterType.Quarter: {
        this.title = 'Select Quarter';
        break;
      }
      case DashboardConstants.FilterType.Year: {
        this.title = 'Select Year';
        break;
      }
      case DashboardConstants.FilterType.Month: {
        this.title = 'Select Month';
      }
      default:
        break;
    }
    this.searchYearConfig = {
      label: '',
      data: 'SearchYearValue',
      placeholder: 'Search'
    }

    this.SelecYearConfig = {
      label: '',
      data: 'IsCheck'
    }

    this.btnDoneConfig = {
      title: "Done",
      flat: true,
      // disable:true
    };

    this.btnCancelConfig = {
      title: "Cancel",
      flat: true
    }
    this.closeTooltipConfig = {
      message: "Close",
      position: "bottom"
    };
    this.searchTooltipConfig = {
      message: "Search",
      position: "bottom"
    };

  }

  selectYearCheckbox(selectedYear) {

    this.selectedYearList = this.config.api.appliedYearFilter;
    // push selected year into selectedYearList and update number of selecetd checkbox at title
    if (selectedYear.IsCheckModel.IsCheck) {
      this.selectedYearList.push(selectedYear);
      this.selectedYearCount = this.selectedYearList.length;
      // this.btnDoneConfig.disable = false;
    }
    else {
      remove(this.selectedYearList, (_value: any, _key: number) => {
        return _value.name === selectedYear.name;
      })
      this.selectedYearCount = this.selectedYearList.length;
      if (this.selectedYearCount == 0) {
      }
    }
  }

  selectYearPopupDone() {
    this.doneClick = true;
    this.selectedYearOptionsFinal = JSON.parse(JSON.stringify(this.config.api.appliedYearFilter));
    let selectedOptions: any = [];
    if (this.filterType != DashboardConstants.FilterType.Month) {
      selectedOptions = sortBy(this.selectedYearOptionsFinal, 'name');
    }
    else {
      selectedOptions = this._commUtil.sortMonthInChronologicalOrder(this.selectedYearOptionsFinal);
    }
    this.config.api.closePopup();
    this.config.api.doneClick(selectedOptions);
  }

  selectYearPopupCancel(origin: string) {
    // calls done cancelCallback function in report-filter component
    this.config.api.appliedYearFilter = JSON.parse(JSON.stringify(this.selectedYearOptionsFinal));
    let selectedOptions: any = [];
    this.config.api.appliedYearFilter.forEach((_value: any, _key: number) => {
      each(this.sourceYear, (_ele: any, _val: number) => {
        if (_value.name === _ele.name) {
          _ele.IsCheckModel.IsCheck = _value.IsCheckModel.IsCheck;
        }
      })
    })
    selectedOptions = sortBy(this.selectedYearOptionsFinal, 'name');
    this.config.api.cancelClick(this.selectedYearList);
    if (origin === DashboardConstants.EventType.Cancel) {
      this.config.api.closePopup();
    }
    //this.data.cancelCallback(this.selectedYearList);
  }

  showSearch() {
    this.showSearchInput = true;
  }

  closeSearch() {
    this.searchYearModel.SearchYearValue = '';
    this.showSearchInput = false;
  }

  onCancel() {
    this.config.api.closePopup();
  }

  ngOnDestroy(): void {
    if (!this.doneClick) {
      //To distinguish between click for cancel from Cancel button and cancel from elsewhere
      this.selectYearPopupCancel(undefined);
    }
  }
}
