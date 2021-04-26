import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardCommService } from '@vsDashboardCommService';
import { DashboardConstants } from '@vsDashboardConstants';
import { TabDetail } from '@vsDashletModels/tab-detail-model';
import { LoaderService } from '@vsLoaderService';
import { map, sortBy } from 'lodash';

@Component({
    selector: "dashboard-move-to-popup",
    templateUrl: "./dashboard-move-to-popup.html",
    styleUrls: ["./dashboard-move-to-popup.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DashboardMoveToPopupComponent {

    constructor(
        private _dashboardCommService: DashboardCommService,
        private _loaderService: LoaderService
    ) { }

    @Input() config: any;
    btnDoneConfig: any;
    btnCancelConfig: any;
    lstTabs: Array<{ tabName: string, tabId: string, tabSequence: number, disableTab: boolean }> = [];
    lstTabsRadioConfig: any;
    tabModel: any;
    tabId: any = '';
    cardViewType: any;
    msgTab: any = {
        tabToolTip: {
            delay: 100,
            html: false,
            message: DashboardConstants.UIMessageConstants.STRING_WARN_MAX_WIDGET_ALLOWED,
            position: DashboardConstants.OpportunityFinderConstants.TOAST_POSITION.RIGHT
        }
    };

    ngOnInit() {
        this._loaderService.hideGlobalLoader();
        this.cardViewType = this.config.cardViewType;
        this.lstTabsRadioConfig = {
            valueKey: "tabName",
            fieldKey: "tab",
            layout: 'vertical',
            collection: [],
        }
        this.lstTabsRadioConfig.collection = map(this._dashboardCommService.tabDashletInfo.lstTabDetails, (_tab: TabDetail) => {
            if (this._dashboardCommService.selectedTab.tabId != _tab.tabId) {
                this.lstTabs.push({
                    tabName: _tab.tabName,
                    tabId: _tab.tabId,
                    tabSequence: _tab.tabSequence,
                    disableTab: _tab.lstSectionInfo[0].lstDashletInfo.length === 23 && this.cardViewType != DashboardConstants.ReportViewType.SummaryCard
                });
            }
        });

        sortBy(this.lstTabs, 'tabSequence');
        this.tabId = this.lstTabs[0].tabId;
        this.btnDoneConfig = {
            title: 'Done',
            flat: true,
            disable: false,
        }

        this.btnCancelConfig = {
            title: 'Cancel',
            flat: true,
            disabled: false,
        }
    }

    onDone() {
        //If the user tries to move the widget into the current selected tab we will show him the popup message.
        if (this.tabId === this._dashboardCommService.selectedTab.tabId) {
            this.config.api.doneClick(false);
        }
        else {
            this.config.api.doneClick(this.tabId, this.config.cardId);
        }
    }

    onCancel() {
        this.config.api.cancelClick();
    }

    onTabSelect(tab) {
        this.tabId = tab.tabId;
    }


}
