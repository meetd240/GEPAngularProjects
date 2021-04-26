import { Injectable } from "@angular/core";
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardCommService } from "@vsDashboardCommService";
import { findIndex, each, filter, trimEnd, intersection,find,takeRightWhile, takeWhile,remove,dropRight, has, get, last } from "lodash";
import { AnalyticsUtilsService } from "@vsAnalyticsCommonService/analytics-utils.service";
import { IHierarchyFilterDetails, IHierarchyFilterObject, IRelationObjectMapping } from "interfaces/common-interface/app-common-interface";
import { DashboardConstants } from "@vsDashboardConstants";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { ICardDashboardSubscription, IDashoardCardAction } from "@vsDashboardInterface";
import { ReportObject } from "@vsMetaDataModels/report-object.model";

//There should only be a single instance of this service.
@Injectable()
export class DashboardDriveService {
    dbGridSubject: ICardDashboardSubscription = {} as ICardDashboardSubscription;
    private opacityMapping = new Map();
    driveState: any = {
        isDriveActive: false,
        previousClickedValue: undefined,
        prevDriveIndex: null,
        prevDriveCardId: ''
    }


    constructor(
        public _commUtil: CommonUtilitiesService,
        public _dashboardCommService: DashboardCommService
    ) {
    }
    
    public setOpacityMapping(cardId : string , opacityData : any){
      this.removeOpacityMapping(cardId);
      this.opacityMapping.set(cardId,opacityData);
    }

    public removeOpacityMapping(cardId : string){
      if(this.opacityMapping.has(cardId))
          this.opacityMapping.delete(cardId);
    }

    public clearOpacityMapping(){
      this.opacityMapping.clear();
    }
    public driveClickOnChart(action: any, _dbGridSubject: any) {
        //this.dbGridSubject = _dbGridSubject;
        //'action' is the action performed on the driver widget, this action will be propogated to 
        //all driven widgets but with reference of driver widget (action.cardId)
        this._commUtil.checkAllWidgetLoaded().then((_response: boolean) => {
            if (_response) {
                this.setDefaultAction(action);
                this.processDriveClickOnChart(action,_dbGridSubject);
            }
        });
    }

  public processDriveClickOnChart(action: any,_dbGridSubject: any) {
    this.dbGridSubject = _dbGridSubject;
    action.crossSuiteMappingMissingOnWidget = false;
    const widget = this._commUtil._widgetCards[findIndex(this._commUtil._widgetCards, { cardId: action.cardId })];
    let filterValue = "";
    let filterFormattedValue = [];
    let reportObj: any, driveFilterObject: any;
    let widgetIndex: number = this.getWidgetIndexInHierarchyList(widget.cardId);
    filterValue = this._commUtil.getDrillDriveFilterValue(action, widget);
    filterValue = typeof filterValue === 'string' && filterValue.trim() === "" ? filterValue.trim() : filterValue;
    //Construct the reportObject on which the drive filter is to be applied.
    if (widget.reportDetails.lstReportObjectOnRow.length > 0) {
      reportObj = widget.reportDetails.lstReportObjectOnRow[widget.rowIndex];
      reportObj.filterType = reportObj.FilterType || reportObj.filterType;
      filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(reportObj, filterValue);
      driveFilterObject = AnalyticsUtilsService.createDrillDriveFilterReportObj({ reportObject: reportObj, filterValue: filterFormattedValue[0], filterIdentifier: action.actionId, widgetID: action.cardId });
      if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
        this._commUtil.createDriveFilterForCrossSuiteView(widget, driveFilterObject, this._dashboardCommService.relationShipObjectList);
      }
    }
    //Check if the mapping is present for the report object on which the drive is to be applied and then proceed with the drive is present else restrict it.
    let canDrive = this.canDrive(widget, [driveFilterObject]);
    if (canDrive.isDriveValid) {
      widget.driveConfig.isDriveActive = true;
      this._commUtil._widgetCards.forEach((widget, index) => {
        widget.driveConfig.driveActive = true;
        if (action.cardId == widget.cardId) { //found drive action widget
          let removeDriveAction = this.isRemoveDriveAction(widget, driveFilterObject);
          if (widget.driveConfig.isDriver) { //found previous driver is current driver
            if (action.driveAction.actionType == DashboardConstants.EventType.DrillDown || (action.driveAction.actionType == DashboardConstants.EventType.Drive && !this.wasLastClickedFilterInHierarchyList(widget.cardId, driveFilterObject))) { // found drive on different data point
              action.removeBlueBorder = true;
              widget.driveConfig.isDriver = true;
              widget.driveConfig.isDriven = false;
              this.setPreviousClickedValue(action.driveAction.actionType, widget, filterValue, action.cardId);
              if (this._dashboardCommService.filterObjectHierarchyList.length) {
                let previousWidgetDriverFilter = this.getWidgetFromFilterInHierarchyList(widget.cardId);
                if (previousWidgetDriverFilter) {
                  let lastClickedFilter = this.getLastClickedFilterInHierarchyList(widget.cardId);
                  let driveWithNewDataPoint = lastClickedFilter.ReportObjectID == driveFilterObject.reportObject.reportObjectId;
                  this.removeDriveForSetOfWidgetForChartDriver(widget, action.driveAction.actionType, driveWithNewDataPoint, driveFilterObject);
                  this.pushFilterObject(this.getWidgetFromFilterInHierarchyList(widget.cardId), [driveFilterObject], false);
                }
              }
            }
            else { //found drive on same data point
              driveFilterObject = this.removeDriveAction(action, widget, widgetIndex, driveFilterObject);
            }
          }
          else { //found new driver
            // When new driver is found now we wont remove the drive filter if it is present on this widget.
            let previousDriverFilter = [];
            //check whether already driven
            previousDriverFilter = filter(widget.reportDetails.lstFilterReportObject, (_widgetROValue: any, _widgetROIndex: number) => {
              return _widgetROValue.FilterIdentifier == DashboardConstants.FilterIdentifierType.DriveFilter;
            });
            //We will now not call the resetValues method as this widget wont reinitalize.
            //If this widget was already being driven by some other widget then do not reset the description of the drive config.
            if (!previousDriverFilter.length) {
              widget.driveConfig.driveConfigDescription = "";
            }
            widget.driveConfig.isDriver = true;
            widget.driveConfig.isDriven = false;
            this.setPreviousClickedValue(action.driveAction.actionType, widget, filterValue, action.cardId);
            //Check drive from different data point scenario.
            this.pushMasterSalveFilter([driveFilterObject], widget.cardId, widget.cardTitle);
            action.isAlreadyDriven = false;
          }
          if ((this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource) && this._commUtil.isNune(driveFilterObject) && this._commUtil.isNune(driveFilterObject.RelationObjectTypeId))) {
            this.setOpacity(widget, action, filterValue, removeDriveAction); //written inside 'if' clause to have more control on which widget to call set opacity(considering cross suite drive)
          }
          else {
            this.setOpacity(widget, action, filterValue, removeDriveAction);
          }
          // console.log("Driver at grid:", action.cardId, filterValue);
        }
        //Check if this widget is already a driver if not than change the flag isDriver, isDriven accrdingly else dont do anything.
        else if (!this.checkIfWidgetIsDriver(widget.cardId)) { //not driver widget
          widget.driveConfig.isDriver = false;
          widget.driveConfig.isDriven = true;
          //reseting the pageIndex and ChartMinMax Value
          this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], widget);
        }
      });
      if (!widget.driveConfig.isDriveActive) { // remove drive if isDriveActive set to false                      
        driveFilterObject = undefined;
        //First we will trigger the subscription for the current drvier widget and remove the blue border.This cant be done down as this widget is not            
        this._commUtil._widgetCards.forEach((widget, index) => {
          action.cardId = widget.cardId;
          this.triggerDashboardSubject(action);
        });
      }
      else if (!this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) { // if isDriveActive is true, add driveFilterObject to all cards and refresh
        //Now instead of adding the driverfilter to all the widget we wil only add the current drivefilter to all the non driver widget. All the other drive filters will remain as it is.
        this._commUtil._widgetCards.forEach((widget, index) => {
          if (!this.checkIfWidgetIsDriver(widget.cardId) && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
            action.cardId = widget.cardId;
            //Now we wont be removing the previously applied drive filter but instead pushing this new drive filter into the lstFilterObject of all the non- driver widget.
            if (widget.driveConfig.isDriven && driveFilterObject) {
              if (this._dashboardCommService.filterObjectHierarchyList.length) {
                widget.driveConfig.driveConfigDescription = '';
                // widget.driveConfig.driveConfigDescription = driveFilterObject ?
                //   DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + driveFilterObject.filterValue[0] : '';
                widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue();
              }
              //Only push the driveFilterOBject is not undefined.
              if (this._commUtil.isNune(driveFilterObject)) {
                widget.reportDetails.lstFilterReportObject.push(driveFilterObject);
              }
            }
            else if (!this._commUtil.isNune(driveFilterObject) && this._dashboardCommService.filterObjectHierarchyList.length) {
              widget.driveConfig.driveConfigDescription = '';
              widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue();
            }
          }
          else {
            action.cardId = widget.cardId;
          }
          this.triggerDashboardSubject(action);
        });
      }
      //else if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource) && this._commUtil.isNune(driveFilterObject) && this._commUtil.isNune(driveFilterObject.RelationObjectTypeId)) {
      //Removing the driveFilterObject null check from above else case as now we will set this value as undeinfed when the user undrivers.
      else if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
        this._commUtil._widgetCards.forEach((widget, index) => {
          if (!widget.isRemoved && !this.checkIfWidgetIsDriver(widget.cardId) && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
            action.cardId = widget.cardId;
            //Now we wont be removing the previously applied drive filter but instead pushing this new drive filter into the lstFilterObject of all the non- driver widget.
            if (widget.driveConfig.isDriven && driveFilterObject) {
              let reportObject = this.getReportObjectForGivenDataSource(widget, driveFilterObject, this._dashboardCommService.relationShipObjectList);
              if (reportObject != null) {
                //Done here to handle the cross suite case when the report object mapping is missing for this datasource then do not update the drive configuration.
                if (this._dashboardCommService.filterObjectHierarchyList.length) {
                  widget.driveConfig.driveConfigDescription = '';
                  widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue(true, widget.reportDetails.dataSourceObjectId);
                }
                //Done to remove the reference from the common object driveFilterObject.
                let DriveFilterObject = this._commUtil.getDeReferencedObject(driveFilterObject);
                DriveFilterObject.reportObject = reportObject;
                widget.reportDetails.lstFilterReportObject.push(DriveFilterObject);
              }
            }
            else if (!this._commUtil.isNune(driveFilterObject) && this._dashboardCommService.filterObjectHierarchyList.length) {
              widget.driveConfig.driveConfigDescription = '';
              widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue(true, widget.reportDetails.dataSourceObjectId);
            }
          }
          else {
            action.cardId = widget.cardId;
          }
          this.triggerDashboardSubject(action);
        });
      }
      else {
        this.removeDrive();
        this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
      }
    }
    else {
      this._commUtil.getToastMessage(canDrive.cannotDriveMsg);
    }
  }

  private setPreviousClickedValue(actionType: string, widget: any, filterValue: string,cardId : string) {
    if (actionType != DashboardConstants.EventType.DrillDown && actionType != DashboardConstants.EventType.DrillUp) {
      widget.driveConfig.previousClickedValue = filterValue;
      widget.driveConfig.prevDriveCardId = cardId;
    }
  }

  private setDefaultAction(action : any){
    if(action && !action.driveAction){
      action.driveAction = {actionType : DashboardConstants.EventType.Drive};
    }
  }

    private pushFilterObject(previousWidgetDriverFilter: any, driveFilterObjects: any[],replaceFilter : boolean) {
        let orderId = previousWidgetDriverFilter.FilterObjects.length;
        each(driveFilterObjects, (_value) => {
            let filterDetailForHierarchyList: IHierarchyFilterObject = {} as IHierarchyFilterObject;
            filterDetailForHierarchyList.FilterValue = _value.filterValue;
            filterDetailForHierarchyList.ReportObjectID = _value.reportObject.reportObjectId;
            if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
                filterDetailForHierarchyList.RelationObjectID = _value.RelationObjectTypeId;
            }
            if(replaceFilter){
                previousWidgetDriverFilter.FilterObjects[previousWidgetDriverFilter.FilterObjects.length -1] = filterDetailForHierarchyList;
            }else{
                orderId++;
                filterDetailForHierarchyList.Order = orderId;
                previousWidgetDriverFilter.FilterObjects.push(filterDetailForHierarchyList);
            }
        });
    }

    private isRemoveDriveAction(widget: any, driveFilterObject: any){
      if(widget && widget.driveConfig.isDriver && driveFilterObject){
        let lastClickedFilter = this.getLastClickedFilterInHierarchyList(widget.cardId);
         return lastClickedFilter && lastClickedFilter.ReportObjectID == driveFilterObject.reportObject.reportObjectId && lastClickedFilter.FilterValue[0] == driveFilterObject.filterValue[0];
      }
      return false;
    }

    private canResetView(action: any, widget: any, widgetIndex: number, driveFilterObject: any) : boolean{
      if(widgetIndex === 0){
        if(action.driveAction.actionType == DashboardConstants.EventType.DrillUp){
          let filter = this.getClickedFilterInHierarchyList(widget.cardId,driveFilterObject);
          return filter && filter.Order == 1;
        }else{
           return this.getWidgetFromFilterInHierarchyList(widget.cardId).FilterObjects.length <= 1;
        }
      }
      return false;
    }

    public isInFilterObjectHierarchyList(widgetID: string, filterValue: string): boolean {
      let selectedWidget: IHierarchyFilterDetails = this.getWidgetFromFilterInHierarchyList(widgetID);
      if (has(selectedWidget, 'FilterObjects.length')) {
          return this._commUtil.isNune(find(selectedWidget.FilterObjects, item => get(item, 'FilterValue[0]') === filterValue));
      }
      return false;
  }

  public wasLastClickedFilterInHierarchyList(widgetID: string, driveFilterObject: any): boolean {
      let selectedWidget: IHierarchyFilterDetails = this.getWidgetFromFilterInHierarchyList(widgetID);
      if (has(selectedWidget, 'FilterObjects.length')) {
          let lastClickedFilter = last(selectedWidget.FilterObjects); 
          //we need to check for ReportObjectID ,coz two level of reports might have same filter values 
          return lastClickedFilter.ReportObjectID == driveFilterObject.reportObject.reportObjectId && lastClickedFilter.FilterValue[0] === driveFilterObject.filterValue[0];
      }
      return false;
  }

  
  public getClickedFilterInHierarchyList(widgetID: string, driveFilterObject: any): IHierarchyFilterObject {
      let selectedWidget: IHierarchyFilterDetails = this.getWidgetFromFilterInHierarchyList(widgetID);
      if (has(selectedWidget, 'FilterObjects.length')) {
          return find(selectedWidget.FilterObjects, item=> item.ReportObjectID == driveFilterObject.reportObject.reportObjectId && item.FilterValue[0] === driveFilterObject.filterValue[0]);
      }
      return null;
  }

  public getLastClickedFilterInHierarchyList(widgetID: string): IHierarchyFilterObject {
      let selectedWidget: IHierarchyFilterDetails = this.getWidgetFromFilterInHierarchyList(widgetID);
      if (has(selectedWidget, 'FilterObjects.length')) {
          return last(selectedWidget.FilterObjects);
      }
      return null;
  }

  public getWidgetFromFilterInHierarchyList(widgetID: string): IHierarchyFilterDetails {
      return this._dashboardCommService.filterObjectHierarchyList.length ? find(this._dashboardCommService.filterObjectHierarchyList, item => item.WidgetID == widgetID) : null;
  }

  private removeDriveAction(action: any, widget: any, widgetIndex: number, driveFilterObject: any) {
    action.driveRemovalId = widget.cardId;
    
    if (this.canResetView(action,widget,widgetIndex,driveFilterObject)) {
      this.removeDrive();
    }
    else {
      this.removeDriveForSetOfWidgetForChartDriver(widget, action.driveAction.actionType,false,driveFilterObject);
    }
    // this.driveState.prevDriveCardId = undefined;
    // this.driveState.previousClickedValue = undefined;
    if (!this._dashboardCommService.filterObjectHierarchyList.length) {
      widget.driveConfig.isDriveActive = false;
    }
    //Set this undefined as this is undrive scenario and no driveFilter object is to be set here.
    driveFilterObject = undefined;
    action.removeBlueBorder = true;
    return driveFilterObject;
  }

  public getWidgetIndexInHierarchyList(widgetID: string): number {
    return findIndex(this._dashboardCommService.filterObjectHierarchyList, { WidgetID: widgetID });
  }

  public canDrive(widget: any, driveFilter?: any): any {
    if (this._commUtil._widgetCards.find(x => x.componentId != DashboardConstants.GlobalSliderWidgetComponent).length < 2) {
      return {
        isDriveValid: false,
        cannotDriveMsg: AnalyticsCommonConstants.UIMessageConstants.STRING_CANNOT_DRIVE_LESS_THAN_TWO_WIDGETS
      }    
    }
    else if(widget && findIndex(widget.reportDetails.lstReportObjectOnRow, { derivedRoType: AnalyticsCommonConstants.DerivedRoType.DerivedAttributeObject })!=-1)
    {
      return {
        isDriveValid: false,
        cannotDriveMsg: AnalyticsCommonConstants.UIMessageConstants.String_Derived_Attribute_Does_Not_SupportDrive
      }
      
    }

    //Here only in case of OLAP we will not check the row count.
    else if (widget.reportDetails.lstReportObjectOnRow.length == 0 &&
        (widget.reportDetails.reportViewType != DashboardConstants.ReportViewType.Olap)) {
        return {
            isDriveValid: false,
            cannotDriveMsg: AnalyticsCommonConstants.UIMessageConstants.STRING_CANNOT_NO_OBJECTS_IN_ROW
        }
    }
    //Here if its olap view then we wont check the list of row.
    else if (widget.driveConfig.isDriver == false &&
        widget.reportDetails.reportViewType != DashboardConstants.ReportViewType.Olap &&
        this.driveROObjectCondCheck(this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource), [widget.reportDetails.lstReportObjectOnRow[widget.rowIndex]])
    ) {
        return {
            isDriveValid: false,
            cannotDriveMsg: DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS
        }
    }
    else if (widget.driveConfig.isDriver == false &&
        widget.reportDetails.reportViewType === DashboardConstants.ReportViewType.Olap &&
        this.driveROObjectCondCheck(this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource), widget.reportDetails.lstReportObjectOnRow.concat(widget.reportDetails.lstReportObjectOnColumn))) {
        return {
            isDriveValid: false,
            cannotDriveMsg: DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS
        }
    }
    //As we are checking the mapping in the card itsef here no need to check the entire mapping for all ro in case of FLEX/OLAP.
    //In case of chart we alway get single RO hence checking only the first element in the driveFilterList
    else if (!this._commUtil.isNune(driveFilter[0].RelationObjectTypeId) && this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
        return {
            isDriveValid: false,
            cannotDriveMsg: 'The Cross Suite Relation Object Mapping are Missing.'
        }
    }
    else if( this._dashboardCommService.oppFinderState.oppFinderFlag && widget.reportDetails.reportProperties.canDrive === false){
        return {
            isDriveValid: false,
            cannotDriveMsg: 'Drive feature not availaile for this widget.'
        }
    }
    else {
        return {
            isDriveValid: true,
            cannotDriveMsg: ''
        }
    }
}

  //Check remove filter
  public removeDriveForSetOfWidget(widget: any, _widgetIndex: number, _driverWithNewDataPoint: boolean = false, _driveFilterObject?: any) {
    widget.driveConfig.prevDriveCardId = undefined;
    widget.driveConfig.previousClickedValue = undefined;
    if (!_driverWithNewDataPoint) {
      widget.driveConfig.isDriver = false;
    }
    widget.driveConfig.isDriven = false;

        // First get the list of filter that you want to remove from the widgets.
        let listOfFilterToBeRemoved = this._dashboardCommService.filterObjectHierarchyList.slice(_widgetIndex, this._dashboardCommService.filterObjectHierarchyList.length);
        //Now get the listOfWidgets which are driver widgets as well as driven by this widget.
        let lstOfDriverToBeUndriven = this._dashboardCommService.filterObjectHierarchyList.slice(_widgetIndex, this._dashboardCommService.filterObjectHierarchyList.length);
        if (_driverWithNewDataPoint) {
            lstOfDriverToBeUndriven = filter(lstOfDriverToBeUndriven, (_widget: any) => {
                return _widget.WidgetID != widget.cardId;
            });
        }
        this._commUtil._widgetCards.forEach((_widget, index) => {
            //Now for all the widgets which are not the driver _widget.
            if (!this.checkIfWidgetIsDriver(_widget.cardId)) {
                let filterList = [];
                _widget.reportDetails.lstFilterReportObject = this.removeDriveFilter(_widget, listOfFilterToBeRemoved);
            }
            //We will remove the drive filter of this driver widegt from the list of above mentioned driver widgets.
            else if (findIndex(lstOfDriverToBeUndriven, { WidgetID: _widget.cardId }) != -1) {
                //If it is not the current widget then set this flag as this initalizes the widgets and for current undrive we donot require to reinitalize the widget.
                if (_widget.cardId != widget.cardId) {
                    _widget.driveConfig.isDriven = true;
                    _widget.driveConfig.isDriver = false;
                }
                //When user undrives the widget then we will remove the filters of the current widgets from all the other driver widgets.
                if (!_driverWithNewDataPoint) {
                    _widget.reportDetails.lstFilterReportObject = filter(_widget.reportDetails.lstFilterReportObject,
                        filter => (filter.FilterIdentifier != DashboardConstants.FilterIdentifierType.DriveFilter) ||
                            (filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DriveFilter &&
                                filter.WidgetID != widget.cardId)
                    );
                }
                else if (_driverWithNewDataPoint) {
                    _widget.reportDetails.lstFilterReportObject = this.removeDriveFilter(_widget, listOfFilterToBeRemoved);
                }

                if ((!_driverWithNewDataPoint) || (_driverWithNewDataPoint && widget.cardId != widget.cardId)) {
                    widget.driveConfig.isDriver = false;
                }
            }
            //Push this filter on all the widget except this current widget.
            if (_driverWithNewDataPoint && this._commUtil.isNune(_driveFilterObject) && _widget.cardId != widget.cardId) {
                _widget.reportDetails.lstFilterReportObject.concat(_driveFilterObject);
            }
        });
        //Also remove this current widget from the heierarchy list.
        if (_driverWithNewDataPoint) {
            _widgetIndex++;
        }
        this._dashboardCommService.filterObjectHierarchyList = this._dashboardCommService.filterObjectHierarchyList.slice(0, _widgetIndex);
    }


  private getFiltersToBeRemoved(widget: any,actionType : string , driveFilterObject:any,driveWithNewDataPoint:boolean){
    let listOfFilterToBeRemoved =   takeRightWhile(this._dashboardCommService.filterObjectHierarchyList ,item=>item.WidgetID != widget.cardId);
    let currentWidgetFilter : IHierarchyFilterDetails = Object.assign({},this.getWidgetFromFilterInHierarchyList(widget.cardId));
    if(actionType == DashboardConstants.EventType.DrillUp){
      let currentFilter :IHierarchyFilterObject = find(currentWidgetFilter.FilterObjects , (filter : IHierarchyFilterObject)=> filter.ReportObjectID == driveFilterObject.reportObject.reportObjectId && filter.FilterValue[0] == driveFilterObject.filterValue[0])
      currentWidgetFilter.FilterObjects = takeRightWhile(currentWidgetFilter.FilterObjects , item=>item.Order >= currentFilter.Order);
    }else{
      if(driveWithNewDataPoint || this.wasLastClickedFilterInHierarchyList(widget.cardId, driveFilterObject))
          currentWidgetFilter.FilterObjects = [this.getLastClickedFilterInHierarchyList(widget.cardId)];
      else
      currentWidgetFilter.FilterObjects = [];
    }
    listOfFilterToBeRemoved.push(currentWidgetFilter);
    return listOfFilterToBeRemoved;
  }

  
  private getCurrentWidget(widget: any,actionType : string , driveFilterObject:any,driveWithNewDataPoint : boolean) : IHierarchyFilterDetails{
    let currentWidgetFilter : IHierarchyFilterDetails = Object.assign({},this.getWidgetFromFilterInHierarchyList(widget.cardId));
    if(actionType == DashboardConstants.EventType.DrillUp){
      let currentFilter :IHierarchyFilterObject = find(currentWidgetFilter.FilterObjects , (filter : IHierarchyFilterObject)=> filter.ReportObjectID == driveFilterObject.reportObject.reportObjectId)//TODO
      currentWidgetFilter.FilterObjects = takeWhile(currentWidgetFilter.FilterObjects , item=>item.Order < currentFilter.Order);
    }else if(driveWithNewDataPoint || this.wasLastClickedFilterInHierarchyList(widget.cardId,driveFilterObject)){
      currentWidgetFilter.FilterObjects = dropRight(currentWidgetFilter.FilterObjects,1);
      //check for same data point click
    }
    return currentWidgetFilter;
  }

  private getFiltersToBeUnDrive(widget: any,actionType : string , driveFilterObject:any,driverWithNewDataPoint :boolean){
    let listOfFilterToUnDrive =   takeRightWhile(this._dashboardCommService.filterObjectHierarchyList ,item=>item.WidgetID != widget.cardId);
    let currentWidgetFilter : IHierarchyFilterDetails =Object.assign({},this.getWidgetFromFilterInHierarchyList(widget.cardId));
    if(actionType == DashboardConstants.EventType.DrillUp){
      let currentFilter :IHierarchyFilterObject = find(currentWidgetFilter.FilterObjects , (filter : IHierarchyFilterObject)=> filter.ReportObjectID == driveFilterObject.reportObject.reportObjectId &&  filter.FilterValue[0] == driveFilterObject.filterValue[0])
     if(currentFilter.Order == 1)
      listOfFilterToUnDrive.push(currentWidgetFilter);
    }else if(actionType != DashboardConstants.EventType.DrillDown && !driverWithNewDataPoint){ //actionType == DashboardConstants.EventType.Drive
      listOfFilterToUnDrive.push(currentWidgetFilter);
    }
    return listOfFilterToUnDrive;
  }

  public removeDriveFilterFromWidget(_widget: any, filtersToRemove: Array<IHierarchyFilterDetails>): void {
    remove(_widget.reportDetails.lstFilterReportObject,(item :any)=> item.FilterIdentifier === DashboardConstants.FilterIdentifierType.DriveFilter && this.isInFilterList(filtersToRemove,item))
  }

 public removeDriveForSetOfWidgetForChartDriver(widget: any,actionType : string, _driverWithNewDataPoint: boolean = false, _driveFilterObject?: any) {
  this.setPreviousClickedValue(actionType,widget,undefined,undefined);                        
  widget.driveConfig.isDriven = false;

  let currentWidgetFilter = this.getCurrentWidget(widget,actionType,_driveFilterObject,_driverWithNewDataPoint);
  // First get the list of filter that you want to remove from the widgets.
  let listOfFilterToBeRemoved = this.getFiltersToBeRemoved(widget,actionType,_driveFilterObject,_driverWithNewDataPoint);
  //Now get the listOfWidgets which are driver widgets as well as driven by this widget.
  let lstOfDriverToBeUndriven = this.getFiltersToBeUnDrive(widget,actionType,_driveFilterObject,_driverWithNewDataPoint);
 
  this._commUtil._widgetCards.forEach((_widget, index) => {
    //Now for all the widgets which are not the driver _widget.
    if (!this.checkIfWidgetIsDriver(_widget.cardId)) {
      this.removeDriveFilterFromWidget(_widget, listOfFilterToBeRemoved);
    }
    //We will remove the drive filter of this driver widegt from the list of above mentioned driver widgets.
    else if (findIndex(lstOfDriverToBeUndriven, { WidgetID: _widget.cardId }) != -1) {
      //If it is not the current widget then set this flag as this initalizes the widgets and for current undrive we donot require to reinitalize the widget.
      if (_widget.cardId != widget.cardId) {
        _widget.driveConfig.isDriven = true;
        _widget.driveConfig.isDriver = false;
      }
      //When user undrives the widget then we will remove the filters of the current widgets from all the other driver widgets.
      if (!_driverWithNewDataPoint) {
        _widget.reportDetails.lstFilterReportObject = filter(_widget.reportDetails.lstFilterReportObject,
          filter => (filter.FilterIdentifier != DashboardConstants.FilterIdentifierType.DriveFilter) ||
            (filter.FilterIdentifier == DashboardConstants.FilterIdentifierType.DriveFilter &&
              filter.WidgetID != widget.cardId)//need to think
        );
      }
      else if (_driverWithNewDataPoint) {
        this.removeDriveFilterFromWidget(_widget, listOfFilterToBeRemoved);
      }

      if ((!_driverWithNewDataPoint && !currentWidgetFilter.FilterObjects.length) || (_driverWithNewDataPoint && widget.cardId != widget.cardId)) {
        widget.driveConfig.isDriver = false;
      }
    }
  });
  this._dashboardCommService.filterObjectHierarchyList = takeWhile(this._dashboardCommService.filterObjectHierarchyList, item=>item.WidgetID != widget.cardId);
  if(currentWidgetFilter && (currentWidgetFilter.FilterObjects.length || _driverWithNewDataPoint))
  this._dashboardCommService.filterObjectHierarchyList.push(currentWidgetFilter);
}

private isInFilterList(listOfFilterToBeRemoved: Array<IHierarchyFilterDetails>, item: any): boolean {    
  if (!this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
    return listOfFilterToBeRemoved && listOfFilterToBeRemoved.length > 0 && listOfFilterToBeRemoved.some(hierarchyFilterDetails => {
      return  hierarchyFilterDetails.WidgetID == item.WidgetID
        && hierarchyFilterDetails.FilterObjects.length > 0
        && findIndex(hierarchyFilterDetails.FilterObjects, filter => filter.ReportObjectID == item.reportObject.reportObjectId) > -1
    });
  }
  else {    
    let releationShipObjectId: any = find(this._dashboardCommService.relationShipObjectList, {
      ReportObjectId: item.reportObject.reportObjectId, 
      DataSourceObjectId: item.reportObject.dataSource_ObjectId
    });
    return listOfFilterToBeRemoved && listOfFilterToBeRemoved.length > 0 && listOfFilterToBeRemoved.some(hierarchyFilterDetails => {
      return hierarchyFilterDetails.WidgetID == item.WidgetID && hierarchyFilterDetails.FilterObjects.length > 0
        && findIndex(hierarchyFilterDetails.FilterObjects, filter => filter.RelationObjectID == releationShipObjectId.RelationObjectTypeId) > -1
    });
  }
}
  //Use this method to add remove the filter from filterObjectsHeirarchyList.
  public pushMasterSalveFilter(_driveFilterObject: any, widgetID: string, widgetName: string, replaceFilterOBject: boolean = false, _widgetIndex?: number): void {
    let filterObjectForHierarchy: IHierarchyFilterDetails = {
      FilterObjects: [],
      WidgetID: '',
      WidgetName: '',
    } as IHierarchyFilterDetails;
    filterObjectForHierarchy.WidgetID = widgetID;
    filterObjectForHierarchy.WidgetName = widgetName;
    let orderId : number = 0;
    each(_driveFilterObject, (_value) => {
      let filterDetailForHierarchyList: IHierarchyFilterObject = {} as IHierarchyFilterObject;
      filterDetailForHierarchyList.FilterValue = _value.filterValue;
      filterDetailForHierarchyList.ReportObjectID = _value.reportObject.reportObjectId;
      if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
        filterDetailForHierarchyList.RelationObjectID = _value.RelationObjectTypeId;
      }
      orderId++;
      filterDetailForHierarchyList.Order = orderId;
      filterObjectForHierarchy.FilterObjects.push(filterDetailForHierarchyList);
    });
    if (replaceFilterOBject) {
        filterObjectForHierarchy.Order =  this._dashboardCommService.filterObjectHierarchyList[_widgetIndex].Order;
      this._dashboardCommService.filterObjectHierarchyList[_widgetIndex] = filterObjectForHierarchy;
    }
    else {
        filterObjectForHierarchy.Order = this._dashboardCommService.filterObjectHierarchyList.length +1;
      this._dashboardCommService.filterObjectHierarchyList.push(filterObjectForHierarchy);
    }
  }

  //This method is used to remove the entire drive from the dashboard when the user undrives from the widget that is the master for the current dashboard.
  public removeDrive(_widgetIndex?: number, _driverWithNewDataPoint: boolean = false) {

    this.clearOpacityMapping();
    //Remove this as per the logic of getting the previousClickedValue from the widget's drive config.
    this.driveState.prevDriveCardId = undefined;
    this.driveState.previousClickedValue = undefined;
    this.driveState.isDriveActive = false;
    this._commUtil._widgetCards.forEach((widget, index) => {
      if(widget.cardType != DashboardConstants.WidgetDataType.GlobalSliderWidget)
      {
        widget.reportDetails.lstFilterReportObject = filter(widget.reportDetails.lstFilterReportObject,
          filter => filter.FilterIdentifier != DashboardConstants.FilterIdentifierType.DriveFilter);
        widget.driveConfig.isDriver = false;
        widget.driveConfig.isDriven = false;
        widget.driveConfig.driveActive = false;
        widget.driveConfig.isDriveActive = false;
        widget.driveConfig.driveConfigDescription = "";
      }
    });
    this._dashboardCommService.filterObjectHierarchyList = [];
  }

    public setOpacity(widget: any, action: any, filterValue: string,removeDrive:boolean = false) {
        const thisRef = this;
        if (!action.driveAction || (action.driveAction.actionType != DashboardConstants.EventType.DrillDown && action.driveAction.actionType != DashboardConstants.EventType.DrillUp)) {
            if (widget.widgetDataType === DashboardConstants.WidgetDataType.Chart && action.event) {
                if (widget.driveConfig.isDriver && !removeDrive) {
                    if (this.opacityMapping.has(action.cardId) && !action.crossSuiteMappingMissingOnWidget) {
                        action.event.data.category.data = Object.assign({}, this.opacityMapping.get(action.cardId));
                    }
                    else if (action.crossSuiteMappingMissingOnWidget) {
                        this.setOpacityMapping(action.cardId, Object.assign({}, action.event.data.category.data));
                    }
                    let indexForYaxis;
                    $.each(action.event.data.category.data, function (i, point) {
                      if(widget.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HeatMap)
                      {
                        indexForYaxis=action.event.event.point.series.yAxis.categories[action.event.event.point.y]
                      }
                        this.series.chart.series.map((sr) => {
                            sr.points.map((point, i) => {
                                if (point.graphic != undefined) {
                                    if (thisRef.getChartPointValue(widget, point.name) == filterValue || ( widget.reportDetails.reportViewType == AnalyticsCommonConstants.ReportViewType.HeatMap && thisRef.getChartPointValue(widget, point.series.xAxis.categories[point.x]) == filterValue && point.series.yAxis.categories[point.y]== indexForYaxis)
                                      || thisRef.getChartPointValue(widget, point.category) == filterValue) {
                                      $(point.graphic.element).css('opacity', 1);
                                    }
                                    else {
                                        $(point.graphic.element).css('opacity', 0.3);
                                    }
                                }
                            })
                        });
                    });
                }
                else {
                    $.each(action.event.data.category.data, function (i, point) {
                        this.series.chart.series.map((sr) => {
                            sr.points.map((point, i) => {
                                if (point.graphic != undefined) {
                                    $(point.graphic.element).css('opacity', 1);
                                }
                            })
                        });
                    });
                }
            }
            else if (widget.widgetDataType === DashboardConstants.WidgetDataType.Flex) {

            }
            else if (widget.widgetDataType === DashboardConstants.WidgetDataType.GuageChart) {
                thisRef._commUtil._widgetCards.forEach(function (gaugeObj) {
                    if (gaugeObj.reflowMultipleGaugeChart != undefined) {
                        setTimeout(() => {
                            gaugeObj.reflowMultipleGaugeChart();
                        }, 500);
                    }
                })
            }
        }
    }

  public getChartPointValue(widget: any, _highchartPointValue: string): any {
    switch (widget.reportDetails.reportViewType) {
      case AnalyticsCommonConstants.ReportViewType.pie || AnalyticsCommonConstants.ReportViewType.DonutChart:
        {
          return _highchartPointValue ? _highchartPointValue.split(':')[0] : _highchartPointValue;
        }
      default:
        {
          return _highchartPointValue;
        }

    }
  }

  //Can also use the driveConfig property of widget to determine whether the widget is Driver or not.
  //To do that later once we are sure that those properties are properly being updated.
  public checkIfWidgetIsDriver(widgetID: string): boolean {
    return findIndex(this._dashboardCommService.filterObjectHierarchyList, { 'WidgetID': widgetID }) != -1;
  }

  public triggerDashboardSubject(event) {
    switch (event.actionId) {
      case DashboardConstants.EventType.RemoveDrive:
      case DashboardConstants.FilterIdentifierType.DriveFilter: {
        this.dbGridSubject.subject.next(event);
        break;
      }
      case DashboardConstants.WidgetFunction.APPLY_GLOBAL_FILTER:
        this.dbGridSubject.subject.next(event)
        break;
      case DashboardConstants.EventType.ResizeCard: {
        let element = event.target,
          cardId = element.querySelector('.dashboard-card-container').getAttribute('id');
        this.dbGridSubject.subject.next({
          actionId: event.type, cardId: cardId, event: event
        });
      }
    }
  }

  public getReportObjectForGivenDataSource(widget: any, driveFilter: any, relationShipObjectList: Array<any>) {
    let _dsReportObject: any = this.getDataSourceReportObject(relationShipObjectList, widget.reportDetails.dataSourceObjectId, driveFilter.RelationObjectTypeId);

    if (this._commUtil.isNune(_dsReportObject)) {
      let _reportObjectInfo = filter(this._dashboardCommService.listAllReportObjectWithMultiDatasource, (
        _alldsROValues: any, _alldsROKeys: any) => {
        return _alldsROValues.DataSource_ObjectId === _dsReportObject.DataSourceObjectId
          && _alldsROValues.ReportObjectId === _dsReportObject.ReportObjectId;
      })[0];
      _reportObjectInfo = new ReportObject().jsonToObject(_reportObjectInfo);
      return _reportObjectInfo;
    }
    return null;
  }

    public getDataSourceReportObject(relationShipObjectList: Array<any>, dataSourceObjectId: string, relationObjectTypeID: string): any {
        let _dsReportObejct: IRelationObjectMapping = filter(relationShipObjectList,
            (_relValues: IRelationObjectMapping, _relKeys: any) => {
                return _relValues.DataSourceObjectId === dataSourceObjectId &&
                    _relValues.RelationObjectTypeId === relationObjectTypeID;
            })[0];
        return _dsReportObejct;
    }

  public removeDriveFilter(_widget: any, _filterList: Array<any>): Array<any> {
    let filterList = [];
    each(_widget.reportDetails.lstFilterReportObject, (_value: any, _index: number) => {
      //Check if the filterType applied is Drive Filter and if its present in the listOfRemoveFilter then remove it from the widget.
      if (_value.FilterIdentifier === DashboardConstants.FilterIdentifierType.DriveFilter &&
        findIndex(_filterList, { WidgetID: _value.WidgetID }) === -1) {
        filterList.push(_value);
      }
      //If the filterType is not Drive filter dont do anything to that filter.
      else if (_value.FilterIdentifier != DashboardConstants.FilterIdentifierType.DriveFilter) {
        filterList.push(_value);
      }
    });
    return filterList;
  }

    //Drive should only be done on Multiselect value and not on any other filterType.
    public driveROObjectCondCheck(multisource: boolean, reportObjects: any) {
        let flag = false;
        if (multisource) {
            each(reportObjects, (_value: any, _index: number) => {
                if (_value.filterType != DashboardConstants.FilterType.MultiSelect) {
                    flag = true;
                }
            })
            return flag;
        }
        else {
            each(reportObjects, (_value: any, _index: number) => {
                if (_value.filterType != DashboardConstants.FilterType.MultiSelect &&
                    _value.filterType != DashboardConstants.FilterType.Date &&
                    _value.filterType != DashboardConstants.FilterType.Year) {
                    flag = true;
                }
            });
            return flag;
        }
    }

  public getDriveFilterStringValue(crossSuiteView: boolean = false, dataSourceObjectId: string = ''): string {
    let driveFilterValue: string = '';
    each(this._dashboardCommService.filterObjectHierarchyList, (_value: IHierarchyFilterDetails, _index: number) => {
      each(_value.FilterObjects, (_val: IHierarchyFilterObject, _index: number) => {
        if (crossSuiteView) {
          if (this._commUtil.isNune(this.getDataSourceReportObject(this._dashboardCommService.relationShipObjectList, dataSourceObjectId, _val.RelationObjectID))) {
            driveFilterValue = driveFilterValue + _val.FilterValue + ', ';
          }
        }
        else {
          driveFilterValue = driveFilterValue + _val.FilterValue + ', ';
        }
      });
    });
    driveFilterValue = trimEnd(driveFilterValue, ', ');
    return driveFilterValue;
  }


    public driveClickOnFlexGrid(action: any, _dbGridSubject: any) {
        this.dbGridSubject = _dbGridSubject;
        //'action' is the action performed on the driver widget, this action will be propogated to 
        // all driven widgets but with reference of driver widget (action.cardId)
        // this._commUtil.checkAllWidgetLoaded().then((_response: boolean) => {
        //     if (_response) {
        //Remove Link info from Data on grid
        action.event = this.removeLinkInfoFromData(action.event);
        const widget = this._commUtil._widgetCards[findIndex(this._commUtil._widgetCards, { cardId: action.cardId })];
        let widgetIndex: number = this.getWidgetIndexInHierarchyList(widget.cardId);
        //action.event[0].reportObjectDriveValue = this.openCellLinkInNewTab(action.event[0].reportObjectDriveValue);    
        let filterValue = "";
        let driveFilterObjects: Array<any> = [];
        driveFilterObjects = this.driveFlexGridFilterCreation(action, widget);
        let canDrive = this.canDrive(widget, driveFilterObjects);
        if (canDrive.isDriveValid) {
            widget.driveConfig.isDriveActive = true;
            this._commUtil._widgetCards.forEach((widget, index) => {
                widget.driveConfig.driveActive = true;
                if (action.cardId == widget.cardId) { //found drive action widget
                    if (widget.driveConfig.isDriver) { //found previous driver is current driver
                        if (!this.IsPreviousClickedValue(widget.driveConfig.previousClickedValue, action.event)) {
                            // found drive on different data point
                            //code for extracting new drive filter                                   
                            this.removeDriveForSetOfWidget(widget, widgetIndex, true, driveFilterObjects);
                            widget.driveConfig.isDriver = true;
                            widget.driveConfig.isDriven = false;
                            widget.driveConfig.previousClickedValue = action.event;
                            widget.driveConfig.prevDriveCardId = action.cardId;
                            if (this._dashboardCommService.filterObjectHierarchyList.length) {
                                this.pushMasterSalveFilter(driveFilterObjects, widget.cardId, widget.cardTitle, true, widgetIndex);
                            }
                            action.removeBlueBorder = true;
                        }
                        else { //found drive on same data point
                            //code for removing all previous drive                                    
                            action.driveRemovalId = widget.cardId;
                            if (widgetIndex === 0) {
                                this.removeDrive();
                            }
                            else {
                                this.removeDriveForSetOfWidget(widget, widgetIndex);
                            }
                            //Only when the length of filterObjectHierarchyList length is zero will the isDriveActive flag be set to false.
                            if (!this._dashboardCommService.filterObjectHierarchyList.length) {
                                widget.driveConfig.isDriveActive = false;
                            }
                            //Set this undefined as this is undrive scenario and no driveFilter object is to be set here.
                            driveFilterObjects = undefined;
                            action.removeBlueBorder = true;
                        }
                    }
                    else { //found new driver
                        let previousDriverFilter = [];
                        //check whether already driven
                        previousDriverFilter = filter(
                            widget.reportDetails.lstFilterReportObject, (_widgetROValue: any, _widgetROIndex: number) => {
                                return _widgetROValue.FilterIdentifier == DashboardConstants.FilterIdentifierType.DriveFilter
                            });
                        //Check if the previousDriveFilter is present is not then set the driveConfig to empty string
                        if (!previousDriverFilter.length && this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
                            action.crossSuiteMappingMissingOnWidget = true;
                            widget.driveConfig.driveConfigDescription = '';
                        }
                        //We will now not call the resetValues method as this widget wont reinitalize.
                        //If this widget was already being driven by some other widget then do not reset the description of the drive config.
                        else if (!previousDriverFilter.length) {
                            widget.driveConfig.driveConfigDescription = "";
                        }
                        widget.driveConfig.isDriver = true;
                        widget.driveConfig.isDriven = false;
                        widget.driveConfig.previousClickedValue = action.event;
                        widget.driveConfig.prevDriveCardId = action.cardId;
                        this.pushMasterSalveFilter(driveFilterObjects, widget.cardId, widget.cardTitle);
                        //So that no previous driver widgets are reinialized we will set isAlreadyDriven as false.
                        action.isAlreadyDriven = false;
                    }
                    //Now we will chk the relationObjectID from dashboard-card itself and if missing we will restrict this entire call.
                    this.setOpacity(widget, action, filterValue);
                }
                //Check if this widget is already a driver if not than change the flag isDriver, isDriven accrdingly else dont do anything.
                else if (!this.checkIfWidgetIsDriver(widget.cardId)) { //not driver widget
                    widget.driveConfig.isDriver = false;
                    widget.driveConfig.isDriven = true;
                    //reseting the pageIndex and ChartMinMax Value
                    this._dashboardCommService.resetValues(['pageIndex', 'chartMinMax'], [1, []], widget);
                    //reset
                    //We will now not set the driveDescription here.

                    //Remove this and use this accrodingly.
                }
            });

            if (!widget.driveConfig.isDriveActive && this._dashboardCommService.filterObjectHierarchyList.length === 0) { // remove drive if isDriveActive set to false
                this.removeDrive();
                driveFilterObjects = undefined;
                this._commUtil._widgetCards.forEach((widget, index) => {
                    action.cardId = widget.cardId;
                    if (!widget.isRemoved) {
                        this.triggerDashboardSubject(action);
                    }
                });
            }
            else if (!this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) { // if isDriveActive is true, add driveFilterObject to all cards and refresh
                this._commUtil._widgetCards.forEach((widget, index) => {
                    //We will chk if this widget is already a driver widget if so do nothing.
                    if (!this.checkIfWidgetIsDriver(widget.cardId) && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
                        action.cardId = widget.cardId;
                        //Now we wont be removing the previously applied drive filter but instead pushing this new drive filter into the lstFilterObject of all the non- driver widget.
                        if (widget.driveConfig.isDriven && driveFilterObjects) {
                            if (this._dashboardCommService.filterObjectHierarchyList.length) {
                                widget.driveConfig.driveConfigDescription = '';
                                widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue();
                                //Only push the driveFilterObject if not undefined.
                                if (this._commUtil.isNune(driveFilterObjects)) {
                                    each(driveFilterObjects, (_driveValue: any, _driveKey: any) => {
                                        widget.reportDetails.lstFilterReportObject.push(_driveValue);
                                    });
                                }
                            }
                        }
                        else if (!this._commUtil.isNune(driveFilterObjects) && this._dashboardCommService.filterObjectHierarchyList.length) {
                            widget.driveConfig.driveConfigDescription = '';
                            widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue();
                        }
                    }
                    //If it is a driver widget then just update the cardID in action and then trigger the dashboardSubject.
                    else {
                        action.cardId = widget.cardId;
                    }
                    this.triggerDashboardSubject(action);
                });
            }
            else if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource) && this.checkIfROMappingPresentForFLEX(driveFilterObjects)) {
                this._commUtil._widgetCards.forEach((widget, index) => {
                    if (!widget.isRemoved && !this.checkIfWidgetIsDriver(widget.cardId) && widget.componentId != DashboardConstants.GlobalSliderWidgetComponent) {
                        action.cardId = widget.cardId;
                        widget.driveConfig.driveConfigDescription = '';
                        //Now we wont be removing the previously applied drive filter but instead pushing this new drive filter into the lstFilterObject of all the non- driver widget.
                        if (widget.driveConfig.isDriven && driveFilterObjects) {
                            if (this._dashboardCommService.filterObjectHierarchyList.length) {
                                widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue();
                            }
                            each(driveFilterObjects, (_driveFilterObject: any, _index: number) => {
                                let reportObject = this.getReportObjectForGivenDataSource(widget, _driveFilterObject, this._dashboardCommService.relationShipObjectList);
                                if (reportObject != null) {
                                    _driveFilterObject.reportObject = reportObject;
                                    //Done to remove the reference from the common object driveFilterObject.
                                    let DriveFilterObject: any = this._commUtil.getDeReferencedObject(_driveFilterObject);
                                    DriveFilterObject.reportObject = reportObject;
                                    widget.reportDetails.lstFilterReportObject.push(DriveFilterObject);
                                }
                            });
                        }
                        else if (!this._commUtil.isNune(driveFilterObjects) && this._dashboardCommService.filterObjectHierarchyList.length) {
                            widget.driveConfig.driveConfigDescription = DashboardConstants.UIMessageConstants.STRING_DRIVEN_BY + this.getDriveFilterStringValue(true, widget.reportDetails.dataSourceObjectId);
                        }
                    }
                    else {
                        action.cardId = widget.cardId;
                    }
                    this.triggerDashboardSubject(action);
                });
            }
            else {
                this.removeDrive();
                this._commUtil.getToastMessage(DashboardConstants.UIMessageConstants.STRING_DRIVE_RESTRICTIONS);
            }

        }
        else {
            this._commUtil.getToastMessage(canDrive.cannotDriveMsg);
        }
        //     }
        // });
    }

  public removeLinkInfoFromData(data: Array<any>) {
    data.forEach(d => {
      if (this._commUtil.isNune(d.reportObjectDriveValue) && typeof (d.reportObjectDriveValue) == 'string')
        d.reportObjectDriveValue = d.reportObjectDriveValue.split('^')[0];
    });
    return data;
  }

  public driveFlexGridFilterCreation(action, widget) {
    let filterValue = "";
    let reportObj: any;
    let driveFilterObjects: Array<any> = [];
    let filterFormattedValue = [];
    each(action.event, (_value: any, _key: number) => {
      filterValue = _value.reportObjectDriveValue;
      if (filterValue !== "(null)") {
        filterValue = typeof filterValue === 'string' && filterValue.trim() === "" ? filterValue.trim() : filterValue;
        reportObj = filter(this._commUtil.getCombineColumnValueRowRO(widget.reportDetails), { reportObjectName: _value.reportObjectName })[0];
        filterFormattedValue = AnalyticsUtilsService.GetFormattedFilterValue(reportObj, filterValue);
        driveFilterObjects.push(
          AnalyticsUtilsService.createDrillDriveFilterReportObj(
            { reportObject: reportObj, filterValue: filterFormattedValue[0], filterIdentifier: action.actionId, widgetID: action.cardId })
        );
        if (this._commUtil.isCrossSuiteView(this._dashboardCommService.listofDistinctWidgetDataSource)) {
          this._commUtil.createDriveFilterForCrossSuiteView(widget, driveFilterObjects[driveFilterObjects.length - 1], this._dashboardCommService.relationShipObjectList);
        }
      }
    });
    return driveFilterObjects;
  }

  public IsPreviousClickedValue(previousClickedValue: any, _newClickedValue: any): boolean {
    let IsPreviousValue: boolean = true;
    if (previousClickedValue.length != _newClickedValue.length) {
      return false;
    }
    else {
      each(previousClickedValue, (_value: any, _key: any) => {
        if (_value.reportObjectName !== _newClickedValue[_key].reportObjectName ||
          _value.reportObjectDriveValue !== _newClickedValue[_key].reportObjectDriveValue) {
          IsPreviousValue = false;
        }
      });
    }
    return IsPreviousValue;
  }

  public checkIfROMappingPresentForFLEX(driveFilters: Array<any>): boolean {
    each(driveFilters, (_driveFilter: any, _index: number) => {
      if (!this._commUtil.isNune(_driveFilter.RelationObjectTypeId)) {
        return false;
      }
    })
    return true;
  }

  public getColumnHeaderValue(_wijmoObject: any, config: any): any {
    //Here instead of the clicked row we will always use the last element of the _wijmoObject.grid._rows.
    let _wijmoColumnList = Object.keys(_wijmoObject.grid._rows[_wijmoObject.grid._rows.length - 1]._data)
    _wijmoColumnList = filter(_wijmoColumnList, (_value: any, _index: number) => { return _value != '$rowKey'; });
    let _val = _wijmoObject.cellType === DashboardConstants.WijmoCellType.Cell ? config.reportDetails.lstReportObjectOnColumn.length :
      _wijmoObject.row + 1;
    let currentColumnValue = _wijmoColumnList[_wijmoObject.col].split(";");
    let currentSelectedColumn = currentColumnValue.slice(0, _val);
    let _selectObjOnCol: any = { fields: [], values: [] };
    each(currentSelectedColumn, (_value: any, _index: number) => {
      _selectObjOnCol.fields.push(_value.split(':')[0]);
      _selectObjOnCol.values.push(_value.split(':')[1]);
    });
    return _selectObjOnCol;
  }

  public checkTotalSignature(wijmoObject: any, selectedObjOnRow: any, config?: any, _elementRef?: any, selectedObjOnCol?: any): boolean {
    // let isTotalSignaturePresent: boolean = false;
    let measureList = [];
    each(config.reportDetails.lstReportObjectOnValue, (_value: any, _index: number) => {
      measureList.push(_value.reportObjectName);
    });
    if (wijmoObject.panel.getCellElement(wijmoObject._row, wijmoObject._col).innerText == DashboardConstants.OLAPTotalsSignature.Subtotal ||
      wijmoObject.panel.getCellElement(wijmoObject._row, wijmoObject._col).innerText == DashboardConstants.OLAPTotalsSignature.Grandtotal) {
      return true;
    }
    else if (wijmoObject.cellType === DashboardConstants.WijmoCellType.ColumnHeader
      && (selectedObjOnCol.fields.length != selectedObjOnCol.values.length
        || intersection(measureList, [wijmoObject.panel.getCellData(wijmoObject.row, wijmoObject.col)]).length > 0)) {
      return true;
    }
    else if (wijmoObject.cellType === DashboardConstants.WijmoCellType.RowHeader
      && selectedObjOnRow.fields.length != selectedObjOnRow.values.length) {
      return true;
    }
    else if (wijmoObject.cellType === DashboardConstants.WijmoCellType.Cell
      && (selectedObjOnCol.fields.length != selectedObjOnCol.values.length
        || selectedObjOnRow.fields.length != selectedObjOnRow.values.length)) {
      return true;
    }
    else if (wijmoObject.cellType === DashboardConstants.WijmoCellType.Cell) {
      if (intersection(measureList, selectedObjOnCol.fields).length > 0) {
        return true;
      }
      let _listOfRow = _elementRef.nativeElement.querySelector(".widget-wrapper .wj-rowheaders");
      if (_listOfRow.children[wijmoObject.row].innerText === DashboardConstants.OLAPTotalsSignature.Subtotal
        || _listOfRow.children[wijmoObject.row].innerText === DashboardConstants.OLAPTotalsSignature.Grandtotal) {
        return true;
      }
    }
    return false;
  }
}
