import { Component, Input, ElementRef, Renderer2, ViewChild, TemplateRef, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { DashboardCommService } from "@vsDashboardCommService";
import { each, find, findIndex, filter } from "lodash"; 
import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";

@Component({
    selector: 'manage-tabs',
    templateUrl: './manage-tabs-popup.component.html',
    styleUrls: ['./manage-tabs-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class ManageTabsPopupComponent {

    @ViewChild('editTabContainer', { read: ViewContainerRef }) editTabContainerRef: ViewContainerRef;
    @ViewChild('editTabTemplate') editTabTemplateRef: TemplateRef<any>;

    @Input() config;

    _tabsList: any;
    btnDoneConfig: any;
    btnCancelConfig: any;
    smartSortableConfig: any;
    editTooltipConfig: any;
    deleteTooltipConfig: any;
    strikedTabsList = [];
    dragData: any = [];
    refConfig: any;
    smartTextFieldEditConfig: any;
    editTabTitle: any = { "value": '' };
    tabActions: Map<string, any> = new Map<string, any>();
    action: any = {
        actionType: '',
        values: []
    }
    reArrangedData: Array<any> = [];
    tabNameUpdated: Array<any> = [];
    dragDataMapping: Map<string, any> = new Map<string, any>();
    disableAllOtherEditAndDoneButton: boolean = false;

    ngOnInit() {
        this.loadConfig();
        this.config.manageTabsList = [...this.config.manageTabsList];
        this._tabsList = this.config.manageTabsList.map(_tab =>{return {..._tab, isDoneDisabled: true, userEnteredValue: {value:_tab.title}}});
        // each(this._tabsList, (_tab, _index)=>{
        //     this.dragDataMapping.set(_tab.title, {
        //         startIndex: _index,
        //         endIndex: _index
        //     })
        // })

    }

    constructor(private _elementRef: ElementRef, private _changeDetection: ChangeDetectorRef,private _renderer: Renderer2, private _dashboardCommService: DashboardCommService, private _commUtils: CommonUtilitiesService) {

    }
    loadConfig() {
        let thisRef = this;
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

        this.smartSortableConfig = {
            containment: ".row-container",
            handle: ".row-uidragger",
            draggable: '.draggable',
            items: ".manage-stage-dragable",
            apis: {
                onLoad: () => { },
                onDragStart: (e) => {
                },
                onDrag: (e) => { },
                onDragStop: (e, serialize) => {
                    thisRef.dragData.push(serialize);
                },
            }
        }

        this.editTooltipConfig = {
            message: "Edit",
            position: "bottom"
        };

        this.deleteTooltipConfig = {
            message: "Delete",
            position: "bottom"
        }

        this.smartTextFieldEditConfig = {
            label: '',
            isMandatory: false,
            disabled: false,
            data: 'value',
            tabIndex: 2,
            attributes: {
                maxLength: 30,
            }
        };

    }

    // sort tabs and push the sorted list to dashbaord-tabs compoenent
    reArrangeData() {
        // this.refConfig = _.clone(this.config.manageTabsList);
        for (let data of this.dragData) {
            var element = this._tabsList[data.startIndex];
            this._tabsList.splice(data.startIndex, 1);
            this._tabsList.splice(data.endIndex, 0, element);
        }
        each(this._tabsList, (_tab: any, _index: number) => {
            this.reArrangedData.push({ tabId: _tab.tabId, tabName: _tab.title, tabSequence: _index + 1 });
        })
        // this._dashboardCommService.setDashboardTabsList(this.config.manageTabsList)
    }

    onCancel() {
        this.config.api.cancelClick();
    }

    onDone() {
        let list = [...this._tabsList];
        let deletedTabs = [];
        this.reArrangeData();
        //Check if the user has deleted any tabs if yes create the list of deleted tabs.
        for (var i = 0; i < list.length; i++) {
            if (list[i].isStriked) {
                deletedTabs.push({
                    tabId: list[i].tabId,
                    viewId: list[i].viewId
                })
                let _index = findIndex(this._tabsList, { tabId: list[i].tabId });
                let _ind = findIndex(this.reArrangedData, { tabId: list[i].tabId })
                if (_index != -1)
                    this._tabsList.splice(_index, 1);
                if (_ind != -1)
                    this.reArrangedData.splice(_ind, 1);
            }

        }
        //Here the user has deleted all the tabs so we will just reset the tab with whose tabsequence is 1 and then reset the name to Default_Tabs and not show the tabs.
        if (this.config.manageTabsList.length === deletedTabs.length) {
            let tab: any = find(this.config.manageTabsList, { tabSequence: 1 });
            this.tabActions.set(DashboardConstants.TabAction.ResetTabs, {
                tabList: [{
                    tabId: tab.tabId,
                    tabName: 'Default_Tab',
                    tabSequence: 1
                }],
                viewId: tab.viewId
            }
            )
            deletedTabs = deletedTabs.splice(1, deletedTabs.length - 1);
            this.tabActions.set(DashboardConstants.TabAction.DeleteTab, deletedTabs);
        }
        else {
            if (deletedTabs.length) {
                this.tabActions.set(DashboardConstants.TabAction.DeleteTab, deletedTabs);
                each(this.reArrangedData, (_tab: any, _index: number) => {
                   _tab.tabSequence = _index + 1;
                })
            }
            if (this.reArrangedData.length) {
                this.tabActions.set(DashboardConstants.TabAction.RearrangeTab, {
                    tabList: this.reArrangedData,
                    viewId: this.config.manageTabsList[0].viewId
                });
            }
            if (this.tabNameUpdated.length) {
                this.tabActions.set(DashboardConstants.TabAction.RenameTab, {
                    tabList: this.tabNameUpdated,
                    viewId: this.config.manageTabsList[0].viewId
                });
            }
        }
        // this._dashboardCommService.setDashboardTabsList(this.config.manageTabsList)
        this.config.api.doneClick(this.tabActions);

    }

    // delete tabs 
    deleteTab(tab, index) {
        tab.isStriked = !tab.isStriked;
        let tabEle = this._elementRef.nativeElement.querySelector("#tab-" + tab.tabId);
        let tabList = tabEle.querySelector("#tab-name-" + tab.tabId);
        let editIcon = tabEle.querySelector("#edit-tab-" + tab.tabId);
        let dragIcon = tabEle.querySelector("#iconDrag-" + tab.tabId);
        let deleteIcon = tabEle.querySelector('#delete-tab-' + tab.tabId).querySelector("use");

        if (tab.isStriked) {
            this._renderer.setStyle(tabList, 'text-decoration', 'line-through');
            deleteIcon.setAttribute('href', '#icon_Reset');
            this._renderer.addClass(editIcon, "is-hide")
            this._renderer.addClass(dragIcon, "is-hide")
        }
        else {
            this._renderer.setStyle(tabList, 'text-decoration', 'none');
            deleteIcon.setAttribute('href', '#icon_TrashCan')
            this._renderer.removeClass(editIcon, "is-hide")
            this._renderer.removeClass(dragIcon, "is-hide")
        }
    }

    editTab(tab, index) {
        tab.isEditable = !tab.isEditable;
        //this.editTabTitle.value = tab.userEnteredValue;
        tab.isDoneDisabled = false;
        this.disableAllOtherEditAndDoneButton = true;
    }

    closeEditTab(event, tab, index) {
        event.preventDefault();
        tab.isEditable = false;
        //this.editTabTitle.value = '';
        this.disableAllOtherEditAndDoneButton = false;
    }

    doneEditTab(event, tab, index, tabValue) {
        event.preventDefault();
        tab.isEditable = false;;
        tab.title = tabValue
        // this._dashboardCommService.setDashboardTabsList(this.refConfig)
        this.tabNameUpdated.push({ tabId: tab.tabId, tabName: tab.title, tabSequence: tab.tabSequence });
        this.disableAllOtherEditAndDoneButton = false;

    }

    checkIfRearrangedTab(): boolean {
        let result = false;
        each(this._dashboardCommService.dashboardTabsList, (_tab: any) => {
            let _rearrangedTab = find(this.reArrangedData, { 'tabId': _tab.tabId });
            if (_tab.tabSequence != _rearrangedTab)
                result = true;
        })
        return result
    }
    
    onChangeValue($event,list){
        let userEnteredValue = this._commUtils.isNune($event.target) ? $event.target.value.trim().toLowerCase() : $event.trim().toLowerCase();
        //If there is already a Tab which has the same name as the user entered value for the new tab then the Done button will be disabled.
        let tab = filter(this._tabsList, (_tab) => { return _tab.userEnteredValue.value.toLocaleLowerCase() === userEnteredValue && _tab.tabId != list.tabId })[0];
        list.userEnteredValue.value = list.userEnteredValue.value.trim();
        // list.title.trimEnd().toLowerCase() === list.userEnteredValue.value.trimEnd().toLowerCase() ||
        if (this._commUtils.isNune(tab) ||  list.userEnteredValue.value.length === 0) {
            //The name is already persent. Disable the done button.
            list.isDoneDisabled = true;
        }
        else {
            list.isDoneDisabled = false ;
        }
        this.setState();
    }

    setState() {
        this._changeDetection.markForCheck();
    }

}