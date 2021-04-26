import {
    Directive, Input, ElementRef, Renderer2, OnInit,
    AfterViewInit, Inject, OnDestroy
} from '@angular/core';
import * as wjcOlap from 'wijmo/wijmo.olap';
import { OlapGridDirectiveService } from '@vsOlapGridDirectiveService';
import { visionCustomPivotEngine } from '@vsDashboardInterface';
import { DashboardConstants } from '@vsDashboardConstants';
import { AppConstants } from "smart-platform-services";
import { DashboardCommService } from '@vsDashboardCommService'; 
declare var $: any;




@Directive({
    selector: '[olap-grid]',
})
export class OlapGridWidgetDirective implements OnInit, AfterViewInit, OnDestroy {

    /**
     * 
     *  This grid has been written with Generic Implementation.
     *  Please do not write any code inside the Olap Grid Directive.
     *   @param config = excepting the config value to render the olap grid on dashboard card
     *   @param currentOlapId = Same as the Widget Card Id to identify the individual wijmo instances   
     * 
     */

    @Input() config: any;
    private currentOlapId: any = null;
    private pivotEngine: visionCustomPivotEngine = new visionCustomPivotEngine();
    private wijmoPivotGridInstance: wjcOlap.PivotGrid;
    private showSubtoal: boolean = true;
    private showGrandtotal: boolean = true;

    constructor(
        @Inject(OlapGridDirectiveService)
        private _olapGridDirectiveService: OlapGridDirectiveService,
        public _dashboardCommService: DashboardCommService,
        private _element: ElementRef,
        private _renderer: Renderer2,
        private _appConstants: AppConstants) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.showSubtoal = this.config.config.reportDetails.isTotalRequired;
        this.showGrandtotal = this._appConstants.userPreferences.moduleSettings.grandTotalAlwaysOn || this.config.config.reportDetails.isTotalRequired;
        this.currentOlapId = this.config.config.cardId;
        if (this.config.config.isAccessibleReport) this.initiateOlapGrid()
    }

    ngOnDestroy() {
        // console.log('getting called');
        if (this.wijmoPivotGridInstance) this.wijmoPivotGridInstance.removeEventListener()
    }

    private initiateOlapGrid() {
        const olapGridInstanceConfig = this.config.config.config.olapGridInstanceConfig;
        this.getOlapPivotEngineInstance(olapGridInstanceConfig);
        this._olapGridDirectiveService.getWijmoOverrideMethodsinstance(this.config.config);
        this.getOlapPivotGridInstance(olapGridInstanceConfig);
    }

    private getOlapPivotGridInstance(olapGridInstanceConfig: any) {
        const visionWijmoParent = this._renderer.createElement('div');
        visionWijmoParent.id = `wijmo-olap-parent-${this.currentOlapId}`;
        visionWijmoParent.innerHTML = `
            <div id='wijmo-${this.currentOlapId}'>
            </div>
        `;

        //Below code will add styles to main div i.e. visionWijmoParent
        this._renderer.setStyle(visionWijmoParent, 'overflow', 'auto');
        this._renderer.setStyle(visionWijmoParent, 'padding', '5px');
        this._renderer.setStyle(visionWijmoParent, 'height', 'calc(100% - 45px)');
        this._renderer.appendChild(this._element.nativeElement, visionWijmoParent);

        this.wijmoPivotGridInstance = new wjcOlap.PivotGrid(
            document.getElementById(`wijmo-${this.currentOlapId}`), {
            itemsSource: this.pivotEngine,
            showDetailOnDoubleClick: olapGridInstanceConfig.showDetailOnDoubleClick,
            allowSorting: olapGridInstanceConfig.allowSorting,
            autoScroll: olapGridInstanceConfig.autoScroll,
            customContextMenu: olapGridInstanceConfig.customContextMenu,
            selectionMode: olapGridInstanceConfig.selectionMode,
            autoSizeMode: olapGridInstanceConfig.autoSizeMode,
            collapsibleSubtotals: olapGridInstanceConfig.collapsibleSubtotals,
            stickyHeaders: olapGridInstanceConfig.stickyHeaders,
            showValueFieldHeaders: olapGridInstanceConfig.showValueFieldHeaders,
            showRowFieldHeaders: olapGridInstanceConfig.showRowFieldHeaders,
        });

        this._olapGridDirectiveService.bindingEventsWijmoGrid({
            wijmoPivotGridInstance: this.wijmoPivotGridInstance,
            olapGridInstanceConfig: olapGridInstanceConfig,
            currentOlapId: this.currentOlapId
        });
    }

    private getOlapPivotEngineInstance(olapGridInstanceConfig: any) {
        //Binding the events for dashboard card to refresh and update page data
        this.config.config.config.updateOlapPagination = this.updateOlapPagination.bind(this);
        this.config.config.config.refreshOlapGrid = this.refreshOlapGrid.bind(this);
        this.config.config.config.collapseClickEvent = this.collapseClickEvent.bind(this);
        this.setGrandTotalForOppFinder();
        this._olapGridDirectiveService.preparePrivotEngine(
            this.pivotEngine,
            this.config.config, {
            showSubtoal: this.showSubtoal,
            showGrandtotal: this.showGrandtotal
        });
        if (olapGridInstanceConfig.showSubtotalOption)
            this.createOlapCollapsable();
    }

    private createOlapCollapsable() {
        const olapGridthisRef = this;
        const wijmoShowSubtoal = this._renderer.createElement('div');
        wijmoShowSubtoal.id = `show-subtoal-${this.currentOlapId}`;
        wijmoShowSubtoal.innerHTML = `           
               <div id='wijmoButton-${this.currentOlapId}' style='float:left;width:calc(100% - 50%);'>
               </div>
               <div id='showSubtoal-${this.currentOlapId}' style='text-align:right;padding-right:5px;'>    
                    <input checked id='showSubtoalCheckBox-${this.currentOlapId}' type='checkbox' class='filled-in'></input>
                    <label for='Show Totals'>Show Totals</label>
               </div>         
        `;
        this._renderer.appendChild(this._element.nativeElement, wijmoShowSubtoal);

        const wijmoButtonElement = document.getElementById(`wijmoButton-${this.currentOlapId}`);
        wijmoButtonElement.classList.add(`wijmo-button-cont`);
        wijmoButtonElement.innerHTML = '';
        if (this.pivotEngine.rowFields && this.pivotEngine.rowFields.length > 1) {
            for (var i = 0; i < this.pivotEngine.rowFields.length; i++) {
                var btn = document.createElement(`button`);
                btn.id = `btn-${i}-${this.currentOlapId}`;
                btn.classList.add(`wijmo-button`);
                btn.textContent = (i + 1).toString();
                btn.setAttribute('data-level', (i + 1).toString());
                wijmoButtonElement.appendChild(btn);
            }
        }

        //Adding the Mousedown event to wijmo button
        wijmoButtonElement.addEventListener('mousedown', function (e) {
            var btn = document.elementFromPoint(e.clientX, e.clientY),
                level = btn ? btn.getAttribute('data-level') : null;
            if (level) {
                e.preventDefault();
                olapGridthisRef.collapseClickEvent(parseInt(level));
            }
        });

        //Adding the checkbox click event
        document.getElementById(`showSubtoal-${olapGridthisRef.currentOlapId}`)
            .addEventListener('click', function () {
                olapGridthisRef.showSubtoal = !olapGridthisRef.showSubtoal;
                olapGridthisRef.toggleShowSubtoalCheckbox();
            });

        olapGridthisRef.setShowSubtoalCheckbox();

    }

    private collapseClickEvent(collapseLevel: number = undefined) {
        if (collapseLevel === undefined) {
            collapseLevel = this.pivotEngine.rowFields.length;
        }
        $(`#wijmoButton-${this.currentOlapId}`).find(`.wijmo-button`).removeClass('selected-custom-wijmo');
        $(`#wijmoButton-${this.currentOlapId}`).find(`.wijmo-button`).eq(collapseLevel - 1).addClass('selected-custom-wijmo');
        this.wijmoPivotGridInstance.collapseRowsToLevel(collapseLevel);
        this._olapGridDirectiveService.wijmoOlapGridEvent({
            EventType: DashboardConstants.EventType.Olap.OlapEvent.CollapseClick,
            PivotEngineId: this.currentOlapId
       });
    }

    private setGrandTotalForOppFinder(){
        if (this._dashboardCommService.oppFinderState.oppFinderFlag){
            this.showGrandtotal = true;
        }
    }

    private setShowSubtoalCheckbox() {
        const showSubtoalCheckBox = document.getElementById(`showSubtoalCheckBox-${this.currentOlapId}`);
        if (this.showSubtoal) {
            showSubtoalCheckBox.setAttribute('checked', 'checked');
            this._renderer.setStyle(document.getElementById(`wijmoButton-${this.currentOlapId}`), 'display', 'block');
        }
        else {
            this._renderer.setStyle(document.getElementById(`wijmoButton-${this.currentOlapId}`), 'display', 'none');
            showSubtoalCheckBox.removeAttribute('checked');
        }

    }

    private toggleShowSubtoalCheckbox() {
        this.setShowSubtoalCheckbox();
        if (this.wijmoPivotGridInstance) {
            this.config.config.cardLoader = true;
            this.config.config.config.olapGridInstanceConfig.olapCardLoader.showCardLoader();
            const customData = JSON.parse(this.pivotEngine.customData);;
            this.getReportSortingObject(customData);

            customData.isGrandTotalRequired = this._appConstants.userPreferences.moduleSettings.grandTotalAlwaysOn || this.showSubtoal;
            customData.isSubTotalRequired = this.showSubtoal;
            this.wijmoPivotGridInstance.collapsibleSubtotals = this.showSubtoal;

            this.pivotEngine.showColumnTotals = !this.showSubtoal ? wjcOlap.ShowTotals.None : wjcOlap.ShowTotals.GrandTotals;
            this.pivotEngine.showRowTotals = !this.showSubtoal ? wjcOlap.ShowTotals.None : wjcOlap.ShowTotals.Subtotals;

            this.pivotEngine.customData = JSON.stringify(customData);
            this.pivotEngine.refresh();
            this.config.config.reportDetails.isTotalRequired = this.showSubtoal;
        }
        this._olapGridDirectiveService.wijmoOlapGridEvent({
             EventType: DashboardConstants.EventType.Olap.OlapEvent.ShowSubTotal,
             PivotEngineId: this.currentOlapId
        });
    }


    private updateOlapPagination() {
        var customData = JSON.parse(this.pivotEngine.customData);
        customData.pageIndex = this.config.config.pageIndex;
        this.pivotEngine.customData = JSON.stringify(customData);
        this.refreshOlapGrid();
    }

    private refreshOlapGrid() {
        this.pivotEngine.refresh();
    }

    private getReportSortingObject(customData: any) {
        customData.pageIndex = 1;
        this.config.config.pageIndex = 1;
        let _sortOrderCount: number = 0;
        if (!this.showSubtoal) {
            if (this.config.config.reportDetails.lstReportObjectOnColumn.length == 0) {
                customData.lstSortReportObject.map((_value: any, _key_number) => {
                    if (_value.reportObject.layoutArea === DashboardConstants.ReportObjectLayoutArea.Values) {
                        _value.sortOrder = ++_sortOrderCount;
                    }
                });
                customData.lstSortReportObject.map((_value: any, _key_number) => {
                    if (_value.reportObject.layoutArea !== DashboardConstants.ReportObjectLayoutArea.Values) {
                        _value.sortOrder = ++_sortOrderCount;
                    }
                });
            }
            else {
                customData.lstSortReportObject.map((_value: any, _key_number) => {
                    _value.sortOrder = ++_sortOrderCount;
                });
            }
        }
        else {
            customData.lstSortReportObject.map((_value: any, _key_number) => {
                if (_value.reportObject.layoutArea !== DashboardConstants.ReportObjectLayoutArea.Values) {
                    _value.sortOrder = ++_sortOrderCount;
                }
            });
            customData.lstSortReportObject.map((_value: any, _key_number) => {
                if (_value.reportObject.layoutArea === DashboardConstants.ReportObjectLayoutArea.Values) {
                    _value.sortOrder = ++_sortOrderCount;
                }
            });
        }
    }
}
