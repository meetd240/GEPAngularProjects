import {
    Directive, Input, Output,
    EventEmitter, ElementRef, Renderer2, OnInit, OnDestroy, style
} from '@angular/core';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DashboardConstants } from '@vsDashboardConstants';
import { IWijmoFlexGrid } from '@vsCommonInterface';
// import '@grapecity/wijmo.cultures/wijmo.culture.en';
@Directive({
    selector: '[flex-grid]'
})
export class FlexGridWidgetDirective implements OnInit, OnDestroy {

    /**
     * 
     *  This grid has been written with Generic Implementation.
     *  Please do not write any code inside the Flex Directive.
     * 
     */
    @Input() config: any;
    @Output() flexEvents: EventEmitter<any> = new EventEmitter<any>();

    flexGrid: wjcGrid.FlexGrid;
    flexGridConfig: any;

    constructor(
        private _element: ElementRef) {

    }

    ngOnInit() {    
        this.setConfig();
        this.renderGrid();
        this.config.gridAPI = {};
        this.config.gridAPI.updateFlexGrid = this.updateFlexGrid.bind(this);
    }

    ngOnDestroy() {
        if (this.flexGrid) this.flexGrid.removeEventListener();
    }

    public setConfig() {
        let config = this.config;
        this.flexGridConfig = {
            selectionMode: config.selectionMode || DashboardConstants.WijmoConfiuration.WijmoSelectionMode.NONE,
            autoGenerateColumns: false,
            itemsSource: config.series,
            allowSorting: config.allowSorting || false,
            stickyHeaders: config.enableStickyHeader,
            columns: config.column,
            headersVisibility: wjcGrid.HeadersVisibility.Column,
            frozenColumns:config.frozenColumns||0,
            alternatingRowStep:config.alternatingRowStep||0
        };
        // if (this.config.enableUpdate) {
        //     this.flexGridConfig.updatedView = this.updatingView.bind(this);
        // }
        // if (this.config.enableCellSelection) {
        //     this.flexGridConfig.selectionChanging = this.selectionChanging.bind(this);
        // }
        // if (this.config.enableEditCell) {
        //     this.flexGridConfig.cellEditEnded = this.cellEditEnded.bind(this);
        // }
        // if (this.config.enableItemFormatter) {
        this.flexGridConfig.itemFormatter = this.itemFormatter.bind(this);
        // }
        // if (this.config.sortingColumn)
        //     this.flexGridConfig.sortingColumn = this.sortingColumn.bind(this);
    }

    public renderGrid() {
        let thisRef = this;
        let config = this.config;
        this.flexGrid = new wjcGrid.FlexGrid(this._element.nativeElement, this.flexGridConfig);

        thisRef.flexGrid.collectionView.currentItem = null;
        this.flexGrid.selectionChanging.addHandler(function (sender, e) {
            thisRef.selectionChanging(sender, e);
            //console.log('selectionChanging')
        });
        this.flexGrid.cellEditEnded.addHandler(function (sender, e) {
            thisRef.cellEditEnded(sender, e)
            //console.log('cellEditEnded')
        });
        if (this.config.enableFilters) {
            // var filter = new wijmo.grid.filter.FlexGridFilter(this.flexGrid);
        }
        this.flexGrid.resizedColumn.addHandler(function (sender, e) {
            thisRef.resizedColumn(sender, e);
        });


        if (this.config.enableFooter) {
            this.flexGrid.columnFooters.rows.push(new wjcGrid.GroupRow());
        }
        let gridObj = {
            widgetId: config.widgetId,
            grid: this.flexGrid,
            type: DashboardConstants.EventType.FlexGrid.Render
        };
        this.flexEvents.emit(gridObj);
    }

    public updateFlexGrid(data) {
        this.config.series = data;
        this.flexGrid.itemsSource = data;
        this.flexGrid.refresh();
    }

    public updatingView(selectedObj, event) {
        let obj = {
            grid: this.flexGrid,
            selectedObj: selectedObj,
            event: event,
            type: DashboardConstants.EventType.FlexGrid.Update
        } as IWijmoFlexGrid

        this.flexEvents.emit(obj);
    }

    public selectionChanging(selectedObj, event) {
        let obj = {
            grid: this.flexGrid,
            selectedObj: selectedObj,
            event: event,
            type: DashboardConstants.EventType.FlexGrid.Selection
        } as IWijmoFlexGrid
        this.flexEvents.emit(obj);

    }

    public sortingColumn(selectedObj, event) {
        let obj = {
            grid: this.flexGrid,
            selectedObj: selectedObj,
            event: event,
            type: DashboardConstants.EventType.FlexGrid.Selection
        } as IWijmoFlexGrid
        this.flexEvents.emit(obj);

    }

    public cellEditEnded(selectedObj, event) {
        let obj = {
            grid: this.flexGrid,
            selectedObj: selectedObj,
            event: event,
            type: DashboardConstants.EventType.FlexGrid.CellEdit
        } as IWijmoFlexGrid
        this.flexEvents.emit(obj);
    }

    public itemFormatter(filter, r, c, cell) {
        let that = this;
        let obj = {
            grid: that.flexGrid,
            filter: filter,
            cell: cell,
            c: c,
            r: r,
            type: DashboardConstants.EventType.FlexGrid.ItemFormatter
        }
        this.flexEvents.emit(obj);
    }

    public resizedColumn(selectedObj, event) {
        let that = this;
        let obj = {
            grid: this.flexGrid,
            selectedObj: selectedObj,
            event: event,
            type: DashboardConstants.EventType.FlexGrid.ResizingColumn
        } as IWijmoFlexGrid
        this.flexEvents.emit(obj);
    }
}
