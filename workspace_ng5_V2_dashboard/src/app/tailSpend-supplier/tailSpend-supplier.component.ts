import{Input,Component,EventEmitter,OnInit,AfterViewInit,ElementRef,Renderer2,OnDestroy,ViewEncapsulation,ChangeDetectionStrategy,ChangeDetectorRef}
from'@angular/core';import{CommonUtilitiesService}
from'@vsCommonUtils';import{AnalyticsMapperService}
from'@vsAnalyticsCommonService/analytics-mapper.service';import{AnalyticsCommonDataService}
from'@vsAnalyticsCommonService/analytics-common-data.service';import{Subscription}
from'rxjs';import{DashboardConstants}
from'@vsDashboardConstants';import{map,find}
from'lodash';import{DashboardCommService}
from'@vsDashboardCommService';import{OpportunityFinderService}
from'@vsOppfinderService/opportunityFinder.service';import{CommonUrlsConstants}
from'@vsCommonUrlsConstants';import{CellType}
from'wijmo/wijmo.grid';import{setCss}
from'wijmo/wijmo';import{LoaderService}
from'@vsLoaderService';import{AnalyticsUtilsService}
from'@vsAnalyticsCommonService/analytics-utils.service';import{AppConstants}
from'smart-platform-services';
declare var $:any;

@Component({selector:'tailSpend-supplier',
templateUrl:'./tailSpend-supplier.component.html',
styleUrls:['./tailSpend-supplier.component.scss'],
encapsulation:ViewEncapsulation.None,
changeDetection:ChangeDetectionStrategy.OnPush,
preserveWhitespaces:false})

export class TailSpendSupplierComponent implements OnInit {
    destoryTimeout: any;
    showGrid: boolean = false;
    gridData: any;
    currentPageIndex: number = 1;
    prevSeries: any;
    manageSubscription$: Subscription = new Subscription();
    constants = DashboardConstants;

    btnCreateConfig: any = { title: "Create Opportunity", flat: true };

    btnBackConfig: any = {
        title: DashboardConstants.UIMessageConstants.STRING_BACK_BTN,
        flat: true
      };

     @ Input()config: any;
    totalSpend = 0;
    supplierList: any=[];

    constructor(
        private element: ElementRef,
        private _appConstant: AppConstants,
        private _commonUrls: CommonUrlsConstants,
        private _commUtil: CommonUtilitiesService,
        private _loaderService: LoaderService,
        public _dashboardCommService: DashboardCommService,
        private _analyticsCommonDataService: AnalyticsCommonDataService,
        private _cdRef: ChangeDetectorRef) {}

    ngOnInit() {
      this.config.api.setState();
      this.setState();
        this.setGridData().then((response) => {
            this.gridData = response;
            this.setCustomColumn();
            this.showGrid = true;
            this.flexGridPagination(response, true);
            this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
            this.destoryTimeout = setTimeout(() => {
                this.setState();
            }, 500);
        });

    }
  

    // This method will do a generate report call to bring the data for List of suppliers once user clicks on supplier count
    private setGridData() {

        return new Promise((resolve, reject) => {
            let that = this;
            //Adding this function to push drill/drive filters into the lstFilterReportObject if any.
            //By default Region filter is always present since we pass that from the grid itself.
            this.filterCreation();
            let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(this.config.reportDetails);
            reportDetailsMetaData.isGrandTotalRequired = false;
            reportDetailsMetaData.isSubTotalRequired = false;
            reportDetailsMetaData.isLazyLoadingRequired = true;
            reportDetailsMetaData["pageIndex"] = this.currentPageIndex = 1;
            reportDetailsMetaData.lstFilterReportObject.forEach(item  =>   {
                        if (typeof item.filterValue  ===   'string')
                          item.filterValue  =  JSON.parse(item.filterValue);
                      
            })
            let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData)
            reportDetailsData.pageSize = JSON.parse(this.config.reportDetails.reportProperties).pageSize ? JSON.parse(this.config.reportDetails.reportProperties).pageSize : 11;
              
            that.config.WidgetDataRecordLength = 0;

            that.manageSubscription$.add(
                this._analyticsCommonDataService.generateReport(reportDetailsData)
                .subscribe((response) => {
                    if (response != undefined
                         && response.Data != null
                         && response.Data.length > 0
                         && response.Data.toString().toLowerCase() !== "error".toLowerCase()) {
                        that.config.WidgetDataRecordLength = response.Data.length;
                        response = that.generateGrid(reportDetailsMetaData, response);
                    } else {
                        if (response.Data.toString().toLowerCase() === "error".toLowerCase()) {
                            that.setDashboardCardMessage(`Report could not be loaded due to some issue(s). Please try again later.`);
                        } else {
                            that.setDashboardCardMessage('No data returned for this condition. This might be because applied filter excludes all data.');
                        }
                    }
                    this._loaderService.hideGlobalLoader();
                    resolve(response);
                }, (error) => {
                    that._commUtil.getMessageDialog(
`Status:${error.status}  Something Went wrong with ${error.message}`,
                        () => {});
                }));
        });
    }

    //Adding this function to push Drill / Drive filters into the lstFilterReportObject if any.
    private filterCreation() {
        if (this._dashboardCommService.filterObjectHierarchyList.length > 0) {
            let filterValue = "";
            let reportObjId: any;

            this._dashboardCommService.filterObjectHierarchyList.forEach((itemFilter) => {
                for (let filter of itemFilter.FilterObjects) {
                    filterValue = filter.FilterValue[0];
                   reportObjId = filter.ReportObjectID;
                let reportObject = find(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (reportObject) => {
                    return reportObject.ReportObjectId.toLowerCase() == reportObjId.toLowerCase();
                });
                let formattedFilter = AnalyticsUtilsService.GetFormattedFilterValue(reportObject, filterValue);
                this.config.reportDetails.lstFilterReportObject.push(
                    AnalyticsUtilsService.createDrillDriveFilterReportObj({
                        reportObject: reportObject,
                        filterValue: formattedFilter[0],
                        filterIdentifier: DashboardConstants.FilterIdentifierType.ReportLevelFilter
                    }));
                }
            })
        }
    }

    // Flex grid configuration for supplier data in tail spend
    private generateGrid(reportDetailsMetaData: any, response: any): any {
        const graphConfig = Object.assign({}, this.config.reportDetails);
        graphConfig.reportDetails = reportDetailsMetaData;
        let gridConfig = {
            widgetDataType: 'grid',
            enableItemFormatter: true,
            TotalRowCount: response.TotalRowCount,
            pageSize: response.PageSize,
            enableEditCell: true,
            enableCellSelection: true,
            enableUpdate: true,
            enableStickyHeader: false,
            alternatingRowStep:1,
            enableFilters: false,
            enableFooter: false,
            gridAPI: {},
            iconType: DashboardConstants.OpportunityFinderConstants.ICON_TYPE.icon,
            radioConfig: {
                options: '2',
                value: []
            },
            column: [],
            series: []
        }

        if (response && response.Data && this._commUtil.isNune(response.Data[0])) {
            Object.keys(response.Data[0]).forEach((col) => {
                gridConfig.column.push({
                    aggregate: 0,
                    binding: col,
                    format: undefined,
                    header: col,
                    isReadOnly: true,
                    visible: true,
                    width: 180,
                    minWidth: 180

                })
            });
            gridConfig.series = Object.assign([], response.Data);
        }
        return gridConfig;
    }

    // Custom column to add checkbox in the flex grid //

    private setCustomColumn() {
            this.gridData.column.unshift({
              _id: undefined,
              binding: '',
              header: '',
              width: 65,
              isReadOnly: false,
              isRequired: false,
              visible: true,
              dataType: "Boolean"
            })  
            
            this.gridData.column.forEach(element => {
               if(element.header == "Supplier" ) {
                element.width = 300;
               }
            });

            this.gridData.series.forEach((item) => {
                  item["isSelected"] = false
              });
          
    }

    private setDashboardCardMessage(message) {
        console.log(message)
    }

    private setState() {
        this._cdRef.markForCheck();
    }

    //***********************************************************//
    //----------------- Pagination Section ----------------------//

    // This is to implement pagination for the supplier data grid.
    private flexGridPagination(_daxResponse: any, isGridInitializing: boolean = true) {
        if (isGridInitializing) {
            this.gridData.pageData = [];
            this.gridData.pageSize = _daxResponse.pageSize;
            this.gridData.totalItems = _daxResponse.TotalRowCount;
            this.gridData.totalPages = Math.ceil(this.gridData.totalItems / this.gridData.pageSize);
            this.gridData.endPage = Math.ceil(this.gridData.totalItems / this.gridData.pageSize);
            this.gridData.currentPage = 0;
            // Checking the Current Page with +1 becuase Math.Ceil returns max value of 1 when devides with endPage
            this.gridData.isNext = (this.gridData.currentPage + 1) == this.gridData.endPage ? false : true;
            this.gridData.isPrev = this.gridData.currentPage == 0 ? false : true;
            this.gridData.startPage = 1;
            this.gridData.showPagination = this.gridData.totalItems <= this.gridData.pageSize ? false : true;
            let gridPaginatedData = isGridInitializing ? _daxResponse.series : _daxResponse.Data;
            this.gridData.pageData.push(gridPaginatedData);
            this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
        } else {
            let gridPaginatedData = isGridInitializing ? _daxResponse.series : _daxResponse.Data;
            this.gridData.pageData.push(gridPaginatedData);
            this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
            this.updateFlexGridData();
        }

    }

    // When user clicks on Next arrow inside the pagination section
    public nextClickPagination() {
        this._loaderService.showGlobalLoader();
        this.gridData.currentPage += 1;
        this.gridData.isPrev = true;
        this.gridData.isNext = (this.gridData.currentPage + 1) == this.gridData.endPage ? false : true;
        if (this.gridData.pageData[this.gridData.currentPage] != undefined) {
            this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
            this.updateFlexGridData();
        } else {
            this.currentPageIndex = this.currentPageIndex + 1;
            let reportDetailsMetaData: any = this._commUtil.getDeReferencedObject(this.config.reportDetails);
            reportDetailsMetaData.isGrandTotalRequired = false;
            reportDetailsMetaData.isSubTotalRequired = false;
            reportDetailsMetaData.isLazyLoadingRequired = true;
            reportDetailsMetaData["pageIndex"] = this.currentPageIndex;
            reportDetailsMetaData.lstFilterReportObject.forEach(item  =>   {
                        if (typeof item.filterValue  ===   'string')
                          item.filterValue  =  JSON.parse(item.filterValue);
                      
            })
            let reportDetailsData = AnalyticsMapperService.MapReportDetailsMetadataToData(reportDetailsMetaData)

                this.manageSubscription$.add(
                    this._analyticsCommonDataService
                    .generateReport(reportDetailsData)
                    .subscribe((response: any) => {
                        if (this.getValidatedDAXResponse(response)) {
                            this.gridData.showPagination = true;
                            this.flexGridPagination(response, false);
                            this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
                            this.setState();
                            this._loaderService.hideGlobalLoader();
                            this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
                        }
                    }, (error: any) => {
                        this._loaderService.hideGlobalLoader();
                    }));
        }
    }

    // When user clicks on Previous arrow inside the pagination section
    public previousClick() {
        this.gridData.currentPage -= 1;
        this.currentPageIndex -= 1;
        this.gridData.isNext = !this.gridData.isNext ? !this.gridData.isNext : this.gridData.isNext;
        if (this.gridData.pageData[this.gridData.currentPage] != undefined) {
            this.gridData.series = this.gridData.pageData[this.gridData.currentPage];
            this.updateFlexGridData();
            if (this.gridData.currentPage == 0)
                this.gridData.isPrev = false;
        } else {
            this.gridData.isPrev = false;
        }
        this.prevSeries = this._commUtil.getDeReferencedObject(this.gridData.series);
    }

    //For updating the flex grid data on basis of selected page
    public updateFlexGridData() {
        this.gridData.gridAPI.updateFlexGrid(this.gridData.pageData[this.gridData.currentPage]);
        this._loaderService.hideGlobalLoader();
    }

    private getValidatedDAXResponse(response: any): boolean {
        this._loaderService.hideGlobalLoader();
        if (response.Data.toString().toLowerCase() == "error".toString().toLocaleLowerCase()) {
            this.setDashboardCardMessage(`Visualization could not be loaded due to some issue(s). Please try again later.`);
            return false;
        } else if (response.Data.length == 0) {
            this.setDashboardCardMessage('No data returned for this condition. This might be because applied filter excludes all data.');
            return false;
        }
        return true;
    }
    // *********************************** Pagination End **************************//


    //************************* Section for Flex events ************************//

    flexEvents(event) {
        let action = event.type;
        switch (action) {
        case "itemFormatter":
            this.drillGridItemformatter(event);
            break;
        case "render": ;
            break;
        case "celledit": ;
            break;
        case "slection": ;
            break;
        }
    }

    drillGridItemformatter(obj) {
        //this.grid = obj.grid;
        if (obj.filter.cellType === CellType.Cell) {
            var flex = obj.filter.grid;
            var row = flex.rows[obj.r];


        if (flex.columns[obj.c].header === null && flex.columns[obj.c].dataType == 3) {
            setCss(obj.cell, {
              left: "10px"
            });
            obj.cell.innerHTML = '<input type="checkbox" style=" visibility: visible !important" />';

            obj.cell.addEventListener('click', (e) => {
                if (e.target.type == "checkbox") {
                  this.gridData.series[obj.r].isSelected = e.target.checked;
                  this.setState();
                }
  
              }, true);
        }
        // For highlighting the headers in the grid 
        if (obj.filter.cellType == CellType.ColumnHeader) {
   
            setCss(obj.cell, {
                background: 'rgba(240, 240, 240, 1)'
            });

        }
    }
}

 backBtnClick(){
    this._dashboardCommService.oppFinderMasterData['TotalSpend'] =0;
    this._dashboardCommService.oppFinderMasterData['SuppliersList'] = 0;
    this.config.api.closePopup();
    this.ngOnDestroy();
}

createOppClick(){
    this.config.api.createOpportunity(this.gridData);
    this.ngOnDestroy();
}

    ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
        clearTimeout(this.destoryTimeout);
    }

}
