import { TabDetail } from '@vsDashletModels/tab-detail-model';


export class TabDashletInfo {
    //The viewid of the current View.
    viewId: string;

    //The List of tabs present in the view.
    lstTabDetails: Array<TabDetail>;

    constructor(){
        this.viewId = '';
        this.lstTabDetails = [];
    }

    jsonToObject(tabDashletInfo: any){
        this.viewId = tabDashletInfo.ViewId;
        tabDashletInfo.LstTabDetails.forEach(tab => {
            this.lstTabDetails.push(new TabDetail().jsonToObject(tab));
        });
        return this;
    }

}