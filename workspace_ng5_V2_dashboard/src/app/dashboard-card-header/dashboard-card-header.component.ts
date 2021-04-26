import { ChangeDetectorRef, Component, AfterViewInit, ChangeDetectionStrategy, OnInit, Input, ElementRef } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardCommService } from '@vsDashboardCommService';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'dashboard-card-header',
    templateUrl: './dashboard-card-header.component.html',
    styleUrls: ['./dashboard-card-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class DashboardCardHeaderComponent implements OnInit, AfterViewInit {
    @Input() config: any;
    constants = DashboardConstants;
    public uiConfig: any;
    public applySortButtonConfig: any;
    public closeSortButtonConfig: any;
    public sortTooltipConfig: any;
    public menuTooltipConfig: any;
    public fullScreenTooltipConfig: any;
    public CardTitleConfig: any;
    public graphTitle: any = { "value": '' };
    public exportOptionsHidden: boolean = true;
    public exportOptions: any;
    public fullScreenIcon: string;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _elementRef: ElementRef,
        private _cdRef: ChangeDetectorRef,
        private _commUtil: CommonUtilitiesService,
        public _dashboardCommService: DashboardCommService
    ) {
    }

    ngOnInit() {
        this.uiConfig = this.config.config.uiConfig;
        this.setBtnConfig();
        this.setTooltipConfig();
        this.CardTitleConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartCardTitleConfig);
        this.menuTooltipConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartMenuTooltipConfig);
        this.fullScreenTooltipConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartFullScreenTooltipConfig);
        this.config.config.changeDetectionMutation.setDashboardCardHeaderState = this.setState.bind(this);
        this.updateFullScreenIcon(this.config.isFullscreen);
    }

    ngAfterViewInit() {
        this._dashboardCommService.truncateDashboardCardTitle(this._elementRef, this.config.config, true, false)
    }


    public setState() {
        this._cdRef.markForCheck();
    }

    public setBtnConfig() {
        this.applySortButtonConfig = {
            title: DashboardConstants.UIMessageConstants.STRING_APPLY_TXT,
            flat: true,
            disable: true
        };

        this.closeSortButtonConfig = {
            title: DashboardConstants.UIMessageConstants.STRING_CLOSE_BTN_TEXT,
            flat: true
        };
    }

    public setTooltipConfig() {
        this.sortTooltipConfig = {
            message: "Sort",
            position: "bottom"
        };
    }
    //  rename dashboard card
    public renameCard() {
        this.graphTitle.value = this.config.config.cardTitle;
        this.config.config.showEdit = true;
        setTimeout(() => {
            let inputField = this._elementRef.nativeElement.querySelector('.editmode-container .input-field input');
            inputField.focus();
            inputField.blur();
            inputField.focus();
            inputField.value = inputField.value; //call textfield's validate on blur
        });
    }

    //  update dashboard card title
    public updateTitle() {
        if (this.graphTitle.value.trim() !== '' && this.config.config.cardTitle != this.graphTitle.value) {
            this.config.config.cardTitle = this.graphTitle.value;
            this.rename(this.graphTitle.value);
            this.config.config.showEdit = false;
        }
    }
    //Link To Dashboard
    public linkToDashboard() {
        this.config.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD, cardId: this.config.config.cardId });
    }
    //UnLink from dashboard
    public unlinkFromDashboard() {
        this.config.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD, cardId: this.config.config.cardId });
    }

    // cancel renaming dashboard card
    public cancelChanges() {
        event.preventDefault();
        this.graphTitle.value = this.config.cardTitle;
        this.config.config.showEdit = false;
    }

    // open dropdown on click on export option from kabab menu list
    public headerExportOptions(data) {
        this.exportOptions = data.types;
        let elClickedDD = this._elementRef.nativeElement.getElementsByClassName("dashboard-kebab-DD");
        let el = this._elementRef.nativeElement.getElementsByClassName("export-options-DD");
        this.exportOptionsHidden = false;

        el[0].style.left = elClickedDD[0].offsetLeft - 10 + 'px';
        el[0].style.top = elClickedDD[0].offsetTop - 10 + 'px';
        el[0].style.width = elClickedDD[0].offsetWidth + 'px';

    }

    // handles export's sub-options click
    public exportOptionsClick() {
        this.exportOptionsHidden = true;
    }

    public openReport() {
        this.config.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.OPEN_REPORT, cardId: this.config.config.cardId })
    }

    // remove card from dashboard
    public removeCard() {
        /**
     * Remove All filters in case of cross suite relation mapping having listofDistinctWidgetDataSource more than 1 and
     * filters have been applied.
    */
        let warningMsg = this._dashboardCommService.listofDistinctWidgetDataSource.length > 1 && this._dashboardCommService.appliedFilters.length >= 1 ?
            DashboardConstants.UIMessageConstants.STRING_CONFIRM_DELETE_DASHBOARD_FILTER :
            DashboardConstants.UIMessageConstants.STRING_CONFIRM_DELETE_DASHBOARD_CARD;
        this._commUtil.getConfirmMessageDialog(
            warningMsg,
            [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT,
            ],
            (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                    this.remove();
                }
            }
        )
    }

    //sort card
    public sortCard() {
        // this.closeSort();
        this.config.config.sort.showSort = true;
        this.sort();
    }

    public remove() {
        this.config.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.REMOVE, cardId: this.config.config.cardId })
    }

    public unlink() {
        this.config.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.UNLINK, cardId: this.config.config.cardId })
    }

    public rename(cardName) {
        this.config.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.RENAME, cardId: this.config.config.cardId, cardName: cardName })
    }


    public sort() {
        this.config.config.subscriptions.next({ actionId: 'SORT', cardId: this.config.config.cardId });
    }

    public moveWidgetToOtherTab(){
        this.config.config.subscriptions.next({actionId: AnalyticsCommonConstants.WidgetFunction.MoveTo, cardId: this.config.config.cardId, reportViewType: this.config.config.reportDetails.reportViewType});
    }

    // open dropdown on click on kabab menu
    public onKebabclick(data) {
        let option = data.export
        switch (option) {
            case "Export":
                this.headerExportOptions(data);
                break;
            case "Copy To":
                this._router.navigate(
                    ['',
                        {
                            outlets:
                            {
                                'copy-popup': ['copy']
                            }
                        }
                    ], {
                    relativeTo: this._activatedRoute.root,
                    skipLocationChange: true
                }
                );
                break;
            case AnalyticsCommonConstants.WidgetFunction.REMOVE:
                this.removeCard();
                break;
            case AnalyticsCommonConstants.WidgetFunction.EDIT_DATA:
                break;
            case AnalyticsCommonConstants.WidgetFunction.VIEW_DATA_SOURCE:
                this.openViewDataSourcePopup();
                break;
            case AnalyticsCommonConstants.WidgetFunction.RENAME:
                this.renameCard();
                break;
            case 'FullScreen':
                break;
            case AnalyticsCommonConstants.WidgetFunction.OPEN_REPORT:
                this.openReport();
                break;
            case AnalyticsCommonConstants.WidgetFunction.UNLINK:
                this.unlinkCard();
                break;
            case AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD:
                // this.linkToDashboard(event, data);
                this.linkToDashboard();
                break;
            case AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD:
                this.unlinkFromDashboard();
                break;
            case AnalyticsCommonConstants.WidgetFunction.MoveTo:
                this.moveWidgetToOtherTab();
                break;
            default: break;
        }

    }

    public unlinkCard() {
        this._commUtil.getConfirmMessageDialog(
            "Are you sure you want to Unlink this Report?",
            [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ],
            (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                    this.unlink();
                }
            }
        );
    }

    public openViewDataSourcePopup() {
        this._router.navigate(
            ['',
                {
                    outlets: { 'viewdatasource-popup': ['view-data-source'] }
                }
            ], {
            relativeTo: this._activatedRoute.root,
            skipLocationChange: true
        });
    }


    public setSortAsicon(checkSortByicon) {
        let sort = checkSortByicon;
        switch (sort) {
            case DashboardConstants.SortAs.Asc: return DashboardConstants.SortIconType.Asc;
            case DashboardConstants.SortAs.Desc: return DashboardConstants.SortIconType.Desc;
            case DashboardConstants.SortAs.AscDesc: return DashboardConstants.SortIconType.AscDesc;
        }
    }

    public closeSort() {
        this.applySortButtonConfig.disable = true;
        this.config.api.closeSort();
    }

    public applySort($event) {
        this.applySortButtonConfig.disable = true;
        this.config.api.applySort($event);
    }

    public toggleAscDsc(ind, sortOption) {
        this.applySortButtonConfig.disable = false;
        this.config.api.toggleAscDsc(ind, sortOption);
    }

    public fullscreen($event) {
        this.updateFullScreenIcon(!this.config.isFullscreen);
        this.config.api.fullscreen($event);

    }
    private updateFullScreenIcon(isFullscreen: any) {
        if (isFullscreen) {
            this.fullScreenIcon = "#icon_Minimise";
            this.fullScreenTooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_MINIMZE_TXT;
        }
        else {
            this.fullScreenIcon = "#icon_Fullscreen";
            this.fullScreenTooltipConfig.message = DashboardConstants.UIMessageConstants.STRING_MAXIMIZE_TXT;
        }
    }

}
