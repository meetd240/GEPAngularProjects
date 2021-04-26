import { Component, OnInit, ViewEncapsulation, Input, Output } from '@angular/core';
// import { LazyComponentConfiguration } from "../../../modules-manifest";
import { DashboardConstants } from '@vsDashboardConstants';

@Component({
    selector: 'save-as-popup',
    templateUrl: './dashboard-save-as-popup.component.html',
    styleUrls: ['./dashboard-save-as-popup.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class DashboardSaveAsPopupComponent implements OnInit {
    // static componentId = LazyComponentConfiguration.saveAsPopup.componentName;
    @Input() config: any;
    SaveAsNewView: any = { "value": '' };

    btnDoneConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_DONE_BTN_TXT,
        flat: true,
        disable: true
    };
    btnCancelConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
        flat: true
    }
    SaveAsPopupConfig: any = {
        label: DashboardConstants.UIMessageConstants.STRING_VIEW_NAME,
        isMandatory: true,
        data: "value",
        tabIndex: 2,
        attributes: {
            maxLength: 100,
        }
    };
    ngOnInit() {
        // this.data = this.confi
        document.getElementsByTagName('body')[0].classList.add('hide-overflow')
    }
    ngOnDestroy() {
        document.getElementsByTagName('body')[0].classList.remove('hide-overflow')
    }

    onKeyUp(e) {
        console.log(" save as key", this.SaveAsNewView.value)
        if (e.trim().length !== 0) {
            this.btnDoneConfig.disable = false;
        }
        else {
            this.btnDoneConfig.disable = true;
        }
    }

    saveAsPopupDone() {
        this.config.api.doneCallback(this.SaveAsNewView.value);
    }
    saveAsPopupCancel() {
        this.config.api.cancelCallback();
    }
}