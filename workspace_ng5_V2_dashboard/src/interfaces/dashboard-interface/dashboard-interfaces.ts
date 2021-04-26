
import { Subject, Observable, Subscription } from 'rxjs';
import { IConfigNode, IDataEndpoint } from 'smart-cards-shared';
import { ISubheaderConfig, IChartMinMaxValue } from '@vsCommonInterface';
import * as wjcOlap from 'wijmo/wijmo.olap';
import * as wjcGrid from 'wijmo/wijmo.grid';

export interface IDashoardCardAction {
  actionId: string;
  cardId: string;
  event?: any;
  cardName?: string;
  cardDescription?: string;
  widgetDataType?: string;
  config?: any;
  redirectToLinkedViewId?: string;
  driveAction?: IDriveAction;
  reportViewType?:string;
}

export interface IDriveAction {
  clickedCardId?: string;
  filterValue?: any;
  actionType?: string;
}

export interface ICardDashboardSubscription {
  subject: Subject<IDashoardCardAction>;
  observer$: Observable<IDashoardCardAction>;
  subscription: Subscription;
}
/**
 * Mock Data interface 
 */
export class dashboardCardConfigNode implements IConfigNode {
  cardId: string;
  cardTitle?: string;
  manifestId: string;
  componentId: string;
  classId?: string;
  driveConfig?: IDriveConfig;
  layoutItemConfig?: any;
  config?: any;
  isExpandedGraph?: boolean;
  showEdit?: boolean;
  isRemoved?: boolean;
  breadCrumb?: any = [];
  classes?: string[];
  subscriptions?: Subject<IDashoardCardAction>;
  dataCallback?: any;
  dataEndPoint?: IDataEndpoint;
  dbGridSubject?: Observable<IDashoardCardAction>;
  sort?: any;
  reportDetails?: any;
  rowIndex?: number;
  sliderFilterArray?: any;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  title?: string;
  chartMinMax?: Array<IChartMinMaxValue>;
  pageIndex?: number;
  linkViewId?: string;
  isLinkedToDashboard?: boolean;
  reflowMultipleGaugeChart?: any;
  breadCrumbUIConfig?: any;
}


export interface dashboardIConfig {
  container: IConfigNode;
  layout: IConfigNode;
  placeholder: IConfigNode;
  cards: dashboardCardConfigNode[];
}

/**
 * 
 */
export interface dashboardISection {
  viewId: string;
  title: string;
  subheaderConfig: ISubheaderConfig;
  config: dashboardIConfig;
  api: any
}

/**
 * Dashboard Card Component interface
 */
export class CardConfigNode implements IConfigNode {
  cardId: string;
  cardTitle?: string;
  manifestId: string;
  componentId: string;
  classId?: string;
  driveConfig?: IDriveConfig;
  layoutItemConfig?: any;
  config?: any;
  classes?: string[];
  subscriptions?: Subject<IDashoardCardAction>;
  dataCallback?: any;
  dataEndPoint?: IDataEndpoint;
  sliderSubscriptions?: Subject<IDashoardCardAction>;
  sliderRenderCallback?: any;
  isExpandedGraph?: boolean;
  showEdit?: boolean;
  isRemoved?: boolean;
  isAccessibleReport?: boolean;
  breadCrumb?: any = [];
  dbGridSubject?: Subject<IDashoardCardAction>;
  sort?: any;
  uiConfig: any;
  widgetDataType?: string;
  reportDetails?: any;
  sliderConfig?: any;
  rowIndex?: number;
  cardLoader?: boolean;
  WidgetDataRecordLength?: number;
  btnRangeApplyConfig?: any;
  sliderFilterArray?: any;
  showSliderLoader?: boolean;
  showSliderWidget?: boolean;
  sliderResetMode?: boolean;
  changeDetectionMutation?: IChangeDetectionMutation;
  cardType: string;
  reportRequestKey: string;
  chartMinMax?: Array<IChartMinMaxValue>;
  pageIndex: number;
  linkViewId?: string;
  isLinkedToDashboard?: boolean;
  renderMultiGuageChart?: any;
  reflowMultipleGaugeChart?: any;
  breadCrumbUIConfig?:any;
  chartDefaultColors?:any;
}
export interface IChangeDetectionMutation {
  setSliderState(): any;
  setGlobalFilterState(): any;
  setSummaryCardState(): any;
  setOppFinderCardState(): any;
  setLinkedViewFilterState(): any;
  setDashboardCardFooterState(): any;
  setDashboardCardHeaderState(): any;
  setMultiGaugeChartComponentState(): any;
  setDashboardCardState(): any;
  applyFormattingOnSummaryCard(): any;
}

export interface IBreadCrumb {
  ro_data: string;
  key: number;
}

export interface IDriveConfig {
  driveActive: boolean;
  isDriver: boolean;
  isDriven: boolean;
  driveConfigDescription?: string;
  isCrosssSuiteFilterApplied?: boolean;
  isDriveActive?: boolean,
  previousClickedValue?: any,
  prevDriveCardId?: string;
  isDrillAndDrive?: boolean;
}

/**
 *  Do not make any option of nullable i.e. ? in this interface
 */
export interface IProductConfiguration {
  productTitle: string;
  showViewSelectionOption: boolean,
  showFilterIconOption: boolean,
  showSaveViewOption: boolean,
  showRenameViewOption: boolean,
  showAddToStandardViewOption: boolean,
  showDeleteViewOption: boolean,
  showUnlinkLinkReportOption: boolean,
  showRenameReportOption: boolean,
  showRemoveReportOption: boolean,
  showOpenReportOption: boolean,
  showFullScreenOption: boolean,
  showSliderWidgetOption: boolean,
  showSummaryTitleOption: boolean,
  showAddDescriptionOption: boolean,
  enablePersistanceOption: boolean,
  showAppliedViewFilterOption: boolean,
  showSaveAsOption: boolean,
  showLinkToDashboardption: boolean,
  showAddToDrilledViewOption: boolean,
  enableFormattingOnSummaryCard: boolean,
  showSlicerFilter: boolean,
  grandTotalAlwaysOn: boolean,
  enableIngestion: boolean
}
/**
 *  Extending the Wijmo Olap Class Interface fpr Custom Pivot Engine
 */
export class visionCustomPivotEngine extends wjcOlap.PivotEngine {
  engineId: any;
  allowSorting: boolean;
  customData: any;
  old_success: any;
}

/**
 *  Creating the Filter Value List for Cross Suite and GLobal Filter List
*/
export interface IFilterValueList {
  Operators: number;
  FilterBy: number;
  listFilterValues: Array<string>;
}