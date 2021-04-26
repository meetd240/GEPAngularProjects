import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { IReportingObjectMultiDataSource, IFilterList } from '@vsCommonInterface';
import { each } from 'lodash';
// import { LazyComponentConfiguration } from '../../../modules-manifest';

@Component({
    selector: 'view-applied-filter-popup.component',
    templateUrl: './view-applied-filter-popup.component.html',
    styleUrls: ['./view-applied-filter-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class ViewAppliedFilterPopupComponent implements OnInit {
    @Input() config: any;
    // static componentId = LazyComponentConfiguration.ViewAppliedFilterPopup.componentName;
    btnOkayConfig: any = {
        title: "Ok",
        flat: true
    };
    doneEnableFlg: boolean = true;
    checkboxModel: any = true;
    isCheckedAll: boolean = false;
    appliedFilters: Array<IReportingObjectMultiDataSource> = [];
    moduleType: any;
    constructor(
        private _cdRef: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        this.InvokeAppliedFilter();
    }

    public InvokeAppliedFilter() {
        let thisRef = this;
        this.moduleType = this.config.moduleType;
        if (this.moduleType === DashboardConstants.ModuleType.OPPFINDER) {
            this.appliedFilters = this.config.appliedFilters;
        }
        else if (this.moduleType === DashboardConstants.ModuleType.DASHBOARD) {
            this.config.appliedFilters.forEach((_appliedFilterVal: any, _appliedFilterKey: any) => {
                if (_appliedFilterVal.isGlobalFilter && 
                    _appliedFilterVal.FilterIdentifier != DashboardConstants.FilterIdentifierType.DriveFilter &&
                    _appliedFilterVal.FilterIdentifier != DashboardConstants.FilterIdentifierType.SlicerFilter) {
                    this.appliedFilters.push(_appliedFilterVal);
                }
            });
        }
        setTimeout(() => {
            thisRef.setState();
        }, 200);
    }

    public manageColumnbtnDone() {
        this.config.api.doneClick();
    }

    public manageColumnbtnCancel() {
        this.config.api.cancelClick();
    }

    public getFilterDisplayString(_appliedFilter: IReportingObjectMultiDataSource, index: number): string {
        if (_appliedFilter.FilterType === DashboardConstants.FilterBy.FilterBySelection) {
            return this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
        }
        else {
            return this.getStrByFilterConditionOperator(_appliedFilter);
        }
    }

    private getStrByFilterConditionOperator(_appliedFilter: IReportingObjectMultiDataSource): string {
        switch (_appliedFilter.FilterConditionOperator.op) {
            case DashboardConstants.ReportObjectOperators.Contains:
                return "Contains" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.DoesNotContains:
                return "Does not Contain" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.Is:
                return "Is" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);;
            case DashboardConstants.ReportObjectOperators.IsNot:
                return "Is Not" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.BeginsWith:
                return "Begins With" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.EndsWith:
                return "Ends With" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.In:
                return "In" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.NotIn:
                return "Not In" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.IsEmpty:
                return "Is Empty" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            case DashboardConstants.ReportObjectOperators.IsNotEmpty:
                return "Is Not Empty" + this.getStrBySelectedFilterList(_appliedFilter.selectedFilterList);
            default:
                break;
        }
    }

    private getStrBySelectedFilterList(_selectedFilterList: Array<IFilterList>): string {
        let _wild_character: any = ',';
        let _FilterStringToDisplay: string = DashboardConstants.OpportunityFinderConstants.STRING_EMPTY;
        each(_selectedFilterList, (_selFilterValue: IFilterList, _selFilterKey: number) => {
            if (_selFilterValue.IsSelected) {
                _FilterStringToDisplay += _selFilterValue.title + _wild_character;
            }
        })
        return _FilterStringToDisplay.substr(0, _FilterStringToDisplay.lastIndexOf(_wild_character));
    }

    public onCancel() {
        this.config.api.closePopup();
    }

    public setState() {
        this._cdRef.detectChanges();
    }
}   