import { DashletInfo } from "@vsDashletModels/dashlet-info.model";

export class SectionInfo {

    //The id to unikely identify this section.
    sectionId: string;

    //The name of this particular section.
    sectionName: string;

    //To indicate wether this section is deleted or not.
    isDeleted: boolean;

    //The sequence of the section in the tab.
    SectionSequence: number

    //The list of dashletInfo present in this section.
    lstDashletInfo: Array<DashletInfo>

    constructor(){
        this.sectionId = '';
        this.sectionName = '';
        this.isDeleted = false;
        this.lstDashletInfo = [];
    }
    
    jsonToObject(section: any){
        this.sectionId = section.SectionId;
        this.sectionName = section.SectionName;
        this.isDeleted = section.IsDeleted;
        this.SectionSequence = section.SectionSequence;
        section.LstDashletInfo.forEach(dashletInfo => {
            this.lstDashletInfo.push(new DashletInfo().jsonToObject(dashletInfo));
        });
        return this;
    }

    objectToEntity(_sectionInfo: SectionInfo, viewId: string){
        let _lstDashletInfo = [];
        _sectionInfo.lstDashletInfo.forEach(_dashletInfo =>{
            _lstDashletInfo.push(new DashletInfo().objectToEntity(_dashletInfo, viewId));
        })
        return  {
            SectionId: _sectionInfo.sectionId,
            SectionName: _sectionInfo.sectionName,
            IsDeleted: _sectionInfo.isDeleted,
            SectionSequence: _sectionInfo.SectionSequence,
            LstDashletInfo: _lstDashletInfo
        }
    }
}