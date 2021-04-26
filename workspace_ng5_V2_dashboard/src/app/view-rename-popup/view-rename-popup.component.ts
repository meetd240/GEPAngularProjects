import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { Subscription } from 'rxjs';
// import { LazyComponentConfiguration } from '../../../modules-manifest';


@Component({
    selector: 'view-rename-popup',
    templateUrl: './view-rename-popup.component.html',
    styleUrls: ['./view-rename-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
export class ViewRenamePopupComponent implements OnInit, OnDestroy {
    @Input() config: any;
    // static componentId = LazyComponentConfiguration.ViewRenamePopup.componentName;
    manageSubscription$: Subscription = new Subscription();
    btnSaveConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_SAVE_BTN_TXT,
        flat: true,
        disable: false
    };
    btnCancelConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
        flat: true,
        disable: false
    };
    graphTitle: any = { value: '' };
    smartTextFieldConfig: any = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardTitleConfig);
    constants = DashboardConstants;
    constructor(
        private _commUtil: CommonUtilitiesService
    ) {

    }

    ngOnInit() {
        if (this.config && this.config.selectedDashboard) {
            this.graphTitle.value = this.config.selectedDashboard.viewName;
            this.smartTextFieldConfig.attributes.placeholder = 'Please Enter the View Name';
        }
    }

    ngOnDestroy() {
        if (this.manageSubscription$)
            this.manageSubscription$.unsubscribe();
    }

    public manageColumnbtnDone() {
        if (this.graphTitle.value === undefined || this.graphTitle.value === '') {
            this._commUtil.getMessageDialog("View Name Can not be empty", () => { })
        }
        else if (this.graphTitle.value.length > this.smartTextFieldConfig.attributes.maxLength) {
            this._commUtil.getMessageDialog(`View Name Can not be greater than ${this.smartTextFieldConfig.attributes.maxLength}`, () => { });
        }
        else if (this.graphTitle.value !== '') {
            this._commUtil.getConfirmMessageDialog(`${DashboardConstants.UIMessageConstants.STRING_VIEW_RENAME_MSG_OPTION.replace(
                '$VR@', this.config.selectedDashboard.viewName)}`, [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ], (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLocaleLowerCase()) {
                    this.config.api.doneClick({
                        viewName: this.graphTitle.value
                    });
                }
            });
        }
    }

    public manageColumnbtnCancel() {
        this.config.api.cancelClick();
    }

    public onCancel() {
        this.config.api.closePopup();
    }

    public onTitleKeydown($event) {

    }
}   
