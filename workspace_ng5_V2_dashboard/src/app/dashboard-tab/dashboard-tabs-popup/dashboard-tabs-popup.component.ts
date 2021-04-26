import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { filter } from 'lodash';
import { DashboardCommService } from '@vsDashboardCommService';
import { CommonUtilitiesService } from "@vsCommonUtils";

@Component({
    selector: 'dashboard-tab-popup',
    templateUrl: './dashboard-tabs-popup.component.html',
    styleUrls: ['./dashboard-tabs-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class DashboardTabsPopupComponent {

    @Input() config: any;
    smartTextFieldConfig: any;
    btnDoneConfig: any;
    tabNameModel: any = { value: '' };
    btnCancelConfig: any;
    tabNameList: any = [];
    isDoneDisabled = true;
    userEnteredValue = "";

    constructor(
        private _dashboardCommService: DashboardCommService,
        private _changeDetection: ChangeDetectorRef,
        private _commUtils: CommonUtilitiesService
    ) { }

    ngOnInit() {
        this.smartTextFieldConfig = {
            label: 'Tab Name',
            isMandatory: true,
            allowEmpty: false,
            disabled: false,
            data: 'tabNameModel',
            fieldKey: 'value',
            tabIndex: 2,
            attributes: {
                placeholder: '',
                maxLength: 30
            }
        }
        this.btnDoneConfig = {
            title: 'Done',
            flat: true,
            disable: false
        };

        this.btnCancelConfig = {
            title: 'Cancel',
            flat: true,
            disable: false
        };
    }

    OnDone() {
        this.config.api.doneClick(this.tabNameModel.value.trim())

    }

    OnCancel() {
        this.config.api.cancelClick();
    }

    onChangeValue($event) {
        this.userEnteredValue = this._commUtils.isNune($event.target) ? $event.target.value.trim().toLowerCase() : $event.trim().toLowerCase();
        //If there is already a Tab which has the same name as the user entered value for the new tab then the Done button will be disabled.
        let tab = filter(this._dashboardCommService.dashboardTabsList, (_tab) => { return _tab.title.toLocaleLowerCase() === this.userEnteredValue })[0];
        if (this._commUtils.isNune(tab) || this.userEnteredValue.length === 0) {
            //The name is already persent. Disable the done button.
            this.isDoneDisabled = true;
        }
        else {
            this.isDoneDisabled = false;
        }
        this.setState();
    }

    setState() {
        this._changeDetection.markForCheck();
    }
}