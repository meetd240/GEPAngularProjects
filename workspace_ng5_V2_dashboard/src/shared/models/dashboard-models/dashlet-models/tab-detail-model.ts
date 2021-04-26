import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { SectionInfo } from "@vsDashletModels/section-info-model";
import { TabFilterDetails } from "@vsTabModels/tab-filter-details-model";
import { IReportingObjectMultiDataSource, IReportObjectInfo } from "interfaces/common-interface/app-common-interface";

export class TabDetail {

    //This is the unique identifier to identify this particular Tab.
    tabId: string;

    //This prop specifies the name of this tab.
    tabName: string;

    //This prop specifies the position of this tab in the given view.
    tabSequence: number;

    //This prop specifies whether this tab is deleted or not.
    isDeleted: boolean;

    //This is the list of section present in the given tab.
    lstSectionInfo: Array<SectionInfo>

    //This is the list of saved tab filters for this tab.
    lstTabFilter: Array<TabFilterDetails>
    
    //This is the list of tab filters applied to this tab.
    lstAppliedTabFilters: Array<IReportingObjectMultiDataSource>

    //The FilterObjectList contains all the list of RO which belong to the datasource of this tab.
    filterTabList: Array<IReportingObjectMultiDataSource>

    constructor() {
        this.tabId = '';
        this.tabName = '';
        this.tabSequence = 0;
        this.isDeleted = false;
        this.lstSectionInfo = [];
        this.lstTabFilter = [];
        this.filterTabList = [];
        this.lstAppliedTabFilters = [];
    }

    jsonToObject(tabDetail: any) {
        this.tabId = tabDetail.TabId;
        this.tabName = tabDetail.TabName;
        this.tabSequence = tabDetail.TabSequence;
        this.isDeleted = tabDetail.IsDeleted;
        AnalyticsUtilsService.MapListOfEntityToArrayOfModel(this.lstTabFilter, tabDetail.LstTabFilter, new TabFilterDetails);
        tabDetail.LstSectionInfo.forEach(section => {
            this.lstSectionInfo.push(new SectionInfo().jsonToObject(section));
        });
        this.filterTabList = [];
        this.lstAppliedTabFilters = []
        return this;
    }

    objectToEntity(_tabDetail: TabDetail, viewId: string){
        let _listSectionInfo = [];
        _tabDetail.lstSectionInfo.forEach(section => {
            _listSectionInfo.push(new SectionInfo().objectToEntity(section, viewId))
        })
        return{
            TabId: _tabDetail.tabId,
            ViewId: viewId,
            TabName: _tabDetail.tabName,
            TabSequence: _tabDetail.tabSequence,
            IsDeleted: _tabDetail.isDeleted,
            //Update this later to set the contact code and date
            CreatedBy: undefined,
            CreatedOn: undefined,
            ModifiedBy: undefined,
            ModifiedOn: undefined,
            LstSectionInfo: _listSectionInfo,
            lstTabSavedFilters: _tabDetail.lstTabFilter
        }
    }
}