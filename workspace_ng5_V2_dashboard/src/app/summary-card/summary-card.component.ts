import { Component, AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Renderer2, ElementRef } from '@angular/core';
import { NotificationService, AppConstants } from 'smart-platform-services';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
import { DashboardConstants } from '@vsDashboardConstants';
import { CommonUtilitiesService } from '@vsCommonUtils';
// import { LazyComponentConfiguration } from '../../../modules-manifest';
import { findIndex, filter } from 'lodash';
import { DashboardCommService } from '@vsDashboardCommService';
import { ConditionalFormatingService } from '@vsConditionalFormatingService';
const tinycolor = require("tinycolor2");

@Component({
    selector: 'summary-card',
    templateUrl: './summary-card.component.html',
    styleUrls: ['./summary-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class SummaryCardComponent implements OnInit, AfterViewInit {
    // static componentId = LazyComponentConfiguration.SummaryCard.componentName;
    appliedFilter: any;
    smartTextFieldConfig: any = {
        label: '',
        isMandatory: true,
        disabled: false,
        tabIndex: 2,
        attributes: {
            maxLength: 100
        }
    };
    graphTitle: any = { "value": '' };
    SCdescription: any = { "value": '' };
    indexInEditMode: number = null;
    CardTitleConfig: any = {
        label: '',
        isMandatory: true,
        allowEmpty: false,
        disabled: false,
        data: 'graphTitle',
        fieldKey: 'value',
        tabIndex: 2,
        attributes: {
            maxLength: 100
        }
    };
    SummarycardTitleConfig: any = {
        label: '',
        isMandatory: true,
        allowEmpty: false,
        disabled: false,
        data: 'graphTitle',
        fieldKey: 'value',
        tabIndex: 2,
        attributes: {
            maxLength: 100
        }
    };
    SummarycardDescriptionConfig: any = {
        label: '',
        isMandatory: false,
        tabIndex: 2,
        data: 'SCdescriptionst',
        fieldKey: 'value',
        attributes: { maxLength: 250 },

    };
    menuTooltipConfig = {
        message: "Menu",
        position: "bottom"
    };
    descriptionMode: any;
    backgroundColorSummaryCard: any;
    valueColorSummaryCard: any;
    // isLinkedToDashboard: boolean = false;
    summaryCardClass: any = {
        dashboardWidgetContentClass: 'dashboard-widget-content',
        summaryCardTitleClass: 'summary-card-title-',
        summaryCardPercentageValueClass: 'summary-card-percentage-value-',
        summaryCardDescClass: 'summary-card-description-',
        summaryCardValueClass: '.summery-card-value',
        summaryCardPlaceHolderClass: 'SmartCardsPlaceholderComponent-CwICCQYCCAsDDgIPBAsDBg',
        summaryCardMessagesClass: 'summery-card-container card-messages-',
        drivenClass: 'driven-title-',
        defaultColorCode: {
            darkColor: 'color:#ffffff',
            lightColor: 'color:#000000'
        }
    }
    destroyTimeout: any;
    @Input() config: any;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private notification: NotificationService,
        private _changeDetection: ChangeDetectorRef,
        private _commUtils: CommonUtilitiesService,
        public _dashboardCommService: DashboardCommService,
        private _conFormatingService: ConditionalFormatingService,
        public _appConstants: AppConstants
    ) { }

    ngOnInit() {
        this.config.changeDetectionMutation.setSummaryCardState = this.setState.bind(this);
        this.config.changeDetectionMutation.applyFormattingOnSummaryCard = this.applyFormattingOnSummaryCard.bind(this);
        this.appliedFilter = this.config.reportDetails.lstFilterReportObject;
        if (this._commUtils.isNune(this.config.config.data) &&
            this._commUtils.isNune(this.config.config.data.description) &&
            this.config.config.data.description.length > 0) {
            let index = findIndex(this.config.config.kebabMenuOptions, (_value: any) => { return _value.export === DashboardConstants.SummaryCardAction.AddDescription });
            if (index != -1) {
                this.config.config.kebabMenuOptions[index].export = DashboardConstants.SummaryCardAction.EditDescription;
            }
        }
        this.config.config.smallSummaryCard = this.config.layoutItemConfig.gridstackPosition.height == this.config.layoutItemConfig.gridstackPosition.minHeight /*&& this.config.layoutItemConfig.gridstackPosition.width == this.config.layoutItemConfig.gridstackPosition.minWidth*/;
        this.config.isLinkedToDashboard = this._commUtils.isNune(this.config.linkViewId) ? (this._commUtils.isEmptyGuid(this.config.linkViewId) ? false : true) : false;
        // this.config.config.data.titleValue = this.config.isLinkedToDashboard ? this.config.config.data.titleValue + "\n Linked to dashboard-" : this.config.config.data.titleValue;
    }

    ngAfterViewInit(): void {
        // this.applyFormattingOnSummaryCard();
        this.resizeSummayCard();
    }
    ngOnDestroy() {
        clearTimeout(this.destroyTimeout);
    }
    applyFormattingOnSummaryCard() {
        if (this.config.reportDetails.ConditionalFormattingConfigurationDetails != '' &&
            this._appConstants.userPreferences.moduleSettings.enableFormattingOnSummaryCard) {
            let color = this._conFormatingService.formatingOnSummaryCard(this.config.reportDetails, this.config.config.data.valueWithoutNumberFormatting);
            this.backgroundColorSummaryCard = color.backgroundColor;
            this.valueColorSummaryCard = color.valueColor;

            //Logic for applying background color to summary card
            let element = document.getElementsByClassName('DashboardCard-' + this.config.reportDetails.reportDetailObjectId);
            this._renderer.setStyle(element[0], "background-color", this.backgroundColorSummaryCard);
            let parent: any = [];
            parent.push(this._commUtils.findAncestor(element[0], this.summaryCardClass.dashboardWidgetContentClass));
            parent.push(this._commUtils.findAncestor(element[0], this.summaryCardClass.summaryCardPlaceHolderClass));
            if (parent.length) {
                for (let i = 0; i < parent.length; i++) {
                    this._renderer.setStyle(parent[i], "background-color", this.backgroundColorSummaryCard);
                }
            }
            this.formatTextBasedOnBackground(this.summaryCardClass.summaryCardTitleClass + this.config.cardId);
            this.formatTextBasedOnBackground(this.summaryCardClass.summaryCardPercentageValueClass + this.config.cardId);
            this.formatTextBasedOnBackground(this.summaryCardClass.summaryCardDescClass + this.config.cardId);
            this.formatTextBasedOnBackground(this.summaryCardClass.drivenClass + this.config.cardId);
            this.formatTextBasedOnBackground(this.summaryCardClass.summaryCardMessagesClass + this.config.cardId);
            // Logic for applying color to the summary card value
            let summrayCardValueEle = this._elementRef.nativeElement.querySelector(this.summaryCardClass.summaryCardValueClass);
            if (summrayCardValueEle && this.valueColorSummaryCard) {
                this._renderer.removeClass(summrayCardValueEle, 'blue-text');
                this._renderer.setProperty(summrayCardValueEle, 'style', 'color:' + this.valueColorSummaryCard + '!important');
            }
        }
    }
    formatTextBasedOnBackground(element: any) {
        // this.destroyTimeout = setTimeout(() => {
            let summaryCardClass = document.getElementById(element);
            if (summaryCardClass && this.config.reportDetails.ConditionalFormattingConfigurationDetails != '' && this._appConstants.userPreferences.moduleSettings.enableFormattingOnSummaryCard && this.backgroundColorSummaryCard) {
                if (element == this.summaryCardClass.drivenClass + this.config.cardId) {
                    this._renderer.removeClass(summaryCardClass, 'color');
                }
                if (tinycolor(this.backgroundColorSummaryCard).isDark()) {
                    this._renderer.setProperty(summaryCardClass, 'style', this.summaryCardClass.defaultColorCode.darkColor + ' !important');
                }
                else {
                    this._renderer.setProperty(summaryCardClass, 'style', this.summaryCardClass.defaultColorCode.lightColor + ' !important');
                }
            }
        // }, 100)

    }

    wrapperformatText(element: any) {
        this.destroyTimeout = setTimeout(() => {
            this.formatTextBasedOnBackground(element);
        }, 100)

    }
    resizeSummayCard() {
        this._dashboardCommService.resizeSummaryCardUpdate$.subscribe((data) => {
            this.config.config.smallSummaryCard = this.config.layoutItemConfig.gridstackPosition.height == this.config.layoutItemConfig.gridstackPosition.minHeight;
            if (this.config.config.showTitle) {
                let element = document.getElementsByClassName("summaryCardChangesForExport-" + this.config.cardId)[0] as HTMLElement;
                if (this.config.layoutItemConfig.gridstackPosition.height == this.config.layoutItemConfig.gridstackPosition.minHeight /*&& this.config.layoutItemConfig.gridstackPosition.width == this.config.layoutItemConfig.gridstackPosition.minWidth)*/) {
                    if (this._commUtils.isNune(element)) {
                        this._renderer.removeClass(element, 'summery-card-container');
                        this._renderer.addClass(element, 'small-summary-card-class');
                        if (this.config.driveConfig.isDriven) {
                            const driveElement = document.getElementById("driven-title-" + this.config.cardId);
                            if (this._commUtils.isNune(driveElement))
                                this._renderer.addClass(driveElement, 'small-summary-card-drive-class');
                        }
                        this.config.config.smallSummaryCard = true;
                    }
                }
                else {
                    if (this._commUtils.isNune(element)) {
                        this._renderer.removeClass(element, 'small-summary-card-class');
                        this._renderer.addClass(element, 'summery-card-container');
                        if (this.config.driveConfig.isDriven) {
                            const driveElement = document.getElementById("driven-title-" + this.config.cardId);
                            if (this._commUtils.isNune(driveElement))
                                this._renderer.removeClass(driveElement, 'small-summary-card-drive-class');
                        }
                        this.config.config.smallSummaryCard = false;
                    }
                }
            }
                this.setState();
        })
    }
    onSUmmaryCardKebabclick(data, event) {
        let option = data.export
        switch (option) {
            case DashboardConstants.SummaryCardAction.AddDescription: this.editSummaryCardDescription(data);
                break;
            case DashboardConstants.SummaryCardAction.EditDescription: this.editSummaryCardDescription(data);
                break;
            case DashboardConstants.SummaryCardAction.Remove: this.removeCard();
                break;
            case DashboardConstants.SummaryCardAction.ShowTitle: this.showTitle(data);
                break;
            case DashboardConstants.SummaryCardAction.HideTitle: this.hideTitle(data);
                break;
            case DashboardConstants.SummaryCardAction.UnlinkReport: this.unlinkCard(data);
                break;
            case DashboardConstants.SummaryCardAction.OpenReport: this.openReport(data);
                break;
            case AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD: this.linkToDashboard();
                break;
            case AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD: this.unlinkFromDashboard();
                break;
            case AnalyticsCommonConstants.WidgetFunction.ShowPercentageValue: this.showPercentageValue(data);
                break;
            case AnalyticsCommonConstants.WidgetFunction.HidePercentageValue: this.hidePercentageValue(data);
                break;
            case AnalyticsCommonConstants.WidgetFunction.MoveTo: this.moveWidgetToOtherTab();
                break;
            default:
                break;
        }
    }

    public moveWidgetToOtherTab(){
        this.config.subscriptions.next({actionId: AnalyticsCommonConstants.WidgetFunction.MoveTo, cardId: this.config.cardId, reportViewType: this.config.reportDetails.reportViewType});
    }
    public linkToDashboard() {
        // this.isLinkedToDashboard = true;
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.LINK_TO_DASHBOARD, cardId: this.config.cardId });
    }
    //UnLink from dashboard
    public unlinkFromDashboard() {
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.UNLINK_FROM_DASHBOARD, cardId: this.config.cardId });
    }
    //Header clicked linked to dashboard
    public headerClickedLinkedWidget() {
        if (this.config.isLinkedToDashboard && !this._commUtils.isEmptyGuid(this.config.linkViewId))
            this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.SummaryCardAction.LINKED_WIDGET_HEADING_CLICKED, cardId: this.config.cardId, redirectToLinkedViewId: this.config.linkViewId })
    }
    private unlinkReport(data: any) {
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.UNLINK, cardId: this.config.cardId })
    }
    public unlinkCard(data: any) {
        this._commUtils.getConfirmMessageDialog(
            "Are you sure you want to Unlink this Report?",
            [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ]
            , (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                    this.unlinkReport(data);
                }
            });
    }


    private openReport(data: any) {
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.OPEN_REPORT, cardId: this.config.cardId })
    }

    showTitle(item) {
        item.export = DashboardConstants.SummaryCardAction.HideTitle;
        this.config.config.showTitle = true;
        this.updateTitleAndPercentFlag('titleFlag',true);
        this.wrapperformatText(this.summaryCardClass.summaryCardTitleClass + this.config.cardId);
    }
    showPercentageValue(item) {
        item.export = DashboardConstants.SummaryCardAction.HidePercentageValue;
        this.config.config.showPercentageValue = true
        this.updateTitleAndPercentFlag('percentageFlagSummaryCard',true);
        this.wrapperformatText(this.summaryCardClass.summaryCardPercentageValueClass + this.config.cardId);
    }
    hidePercentageValue(item) {
        item.export = DashboardConstants.SummaryCardAction.ShowPercentageValue;
        this.config.config.showPercentageValue = false;
        this.updateTitleAndPercentFlag('percentageFlagSummaryCard',false);
    }
    hideTitle(item) {
        item.export = DashboardConstants.SummaryCardAction.ShowTitle;
        this.config.config.showTitle = false;
        this.updateTitleAndPercentFlag('titleFlag',false);
    }

    //  rename dashboard card
    renameCard() {
        if (this._appConstants.userPreferences.moduleSettings.showRenameReportOption) {
            this.graphTitle.value = this.config.cardTitle;
            this.config.config.showEdit = true;
            this.wrapperformatText('textfield-title-' + this.config.cardId);
        }
    }

    //  update dashboard card title
    updateTitle() {
        if (this.graphTitle.value.trim() !== '') {
            this.config.cardTitle = this.graphTitle.value;
            this.config.config.showEdit = false;
            let seletctedTab = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, {tabId: this._dashboardCommService.selectedTab.tabId})[0];
            let selectedWidget = filter(seletctedTab.lstSectionInfo[0].lstDashletInfo, {reportDetailsId: this.config.reportDetailsId})[0];
            selectedWidget.title = this.config.cardTitle;
        }
        this.wrapperformatText(this.summaryCardClass.summaryCardTitleClass + this.config.cardId);
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.RENAME, cardId: this.config.cardId, cardName: this.config.cardTitle })
    }

    // cancel renaming dashboard card
    cancelChanges() {
        event.preventDefault();
        this.graphTitle.value = this.config.cardTitle;
        this.config.config.showEdit = false;
        this.wrapperformatText(this.summaryCardClass.summaryCardTitleClass + this.config.cardId);
    }

    editSummaryCardDescription(item) {
        this.descriptionMode = item;
        this.SCdescription.value = this.config.config.data.description;
        // if (this.dashboardService.previousEditedSummaryCard != undefined && this.dashboardService.previousEditedSummaryCard.cardId != this.config.cardId) {
        // 	this.dashboardService.previousEditedSummaryCard.config.editDescription = false;
        // }
        this.config.config.editDescription = true;
        //this.dashboardService.previousEditedSummaryCard = this.config;
        this.wrapperformatText('textfield-description-' + this.config.cardId);
        // this.updateTitle();
    }

    //  update dashboard card title
    updateDescription(config) {
        if (this.SCdescription.value.trim() === '') {
            this.descriptionMode.export = DashboardConstants.SummaryCardAction.AddDescription;
        } else {
            this.descriptionMode.export = DashboardConstants.SummaryCardAction.EditDescription;
        }
        config.data.description = this.SCdescription.value;
        config.editDescription = false;
        let seletctedTab = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, {tabId: this._dashboardCommService.selectedTab.tabId})[0];
        let selectedWidget = filter(seletctedTab.lstSectionInfo[0].lstDashletInfo, {reportDetailsId: this.config.reportDetailsId})[0];
        selectedWidget.reportDetails.reportDescription = config.data.description;
        this.wrapperformatText(this.summaryCardClass.summaryCardDescClass + this.config.cardId);        
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.UPDATE_DESCRIPTION, cardId: this.config.cardId, cardDescription: config.data.description })
    }

    // cancel renaming dashboard card
    cancelDescriptionChanges(config) {
        event.preventDefault();
        if (config.data.description.trim() === '') {
            this.descriptionMode.export = DashboardConstants.SummaryCardAction.AddDescription;
        } else {
            this.descriptionMode.export = DashboardConstants.SummaryCardAction.EditDescription;
        }
        this.SCdescription.value = config.data.description;
        config.editDescription = false;
        this.wrapperformatText(this.summaryCardClass.summaryCardDescClass + this.config.cardId);
    }

    removeCard() {
        this._commUtils.getConfirmMessageDialog(
            DashboardConstants.UIMessageConstants.STRING_CONFIRM_DELETE_DASHBOARD_CARD,
            [
                DashboardConstants.UIMessageConstants.STRING_NO_BTN_TEXT,
                DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT
            ]
            , (_response: any) => {
                if (_response.result.toLowerCase() === DashboardConstants.UIMessageConstants.STRING_YES_BTN_TEXT.toLowerCase()) {
                    this.remove();
                    this.config.isRemoved = true;
                }
                else {
                    return;
                }
            });
    }

    remove() {
        this.config.subscriptions.next({ actionId: AnalyticsCommonConstants.WidgetFunction.REMOVE, cardId: this.config.cardId });
    }
  
    updateTitleAndPercentFlag(prop: string, value: boolean): void{
        let seletctedTab = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, {tabId: this._dashboardCommService.selectedTab.tabId})[0];
        let selectedWidget = filter(seletctedTab.lstSectionInfo[0].lstDashletInfo, {reportDetailsId: this.config.reportDetailsId})[0];
        selectedWidget.additionalProperties[prop] = value;
    }

    public setState() {
        this._changeDetection.markForCheck();
    }

}
