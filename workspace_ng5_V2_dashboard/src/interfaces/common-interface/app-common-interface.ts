import { ViewInfo } from "@vsViewFilterModels/view-info.model";
import { AnalyticsCommonConstants } from "@vsAnalyticsCommonConstants";
import { DashboardConstants } from "@vsDashboardConstants";
import { GlobalSliderObject } from "@vsMetaDataModels/global-slider-object.model";

/**
 *  Interface for handling the Input Custom Report Object 
 */
export interface IInputCustomReportObject {
    ReportObjectId: string;
    ReportObjectDefaultValue: number;
    ReportObjectName: string;
    ReportObjectType: number;
    CustomFormula: string;
}

/**
 *  Interface for the handling Queries related to Custom Formula
 */
export interface ICustomFormula {
    CustomReportObjectId: string;
    CustomReportFormula: Array<any>;
    CustomReportObjectName: string;
    CustomReportObjectType: number;
    CustomFormula: string;
}

/**
 * Interface for handling the Wijmo Grid Aggregated Type
 */
export interface IWijmoGridAggregatedType {
    ReportObjectId: string;
    ReportObjectName: string;
    WijmoGridAggregatedTypeId?: number;
    WijmoGridAggregatedTypeValue: string;
}

/**
 * Interface for handling the Opportunity Finder EOI Master
 */
export interface IOpportunityFinderEOIMaster {
    EaseOfImplementationObjectId: string;
    EaseOfImplementationName: string
}

/**
 * Interface for handling the Opportunity Finder Type Master
 */
export interface IOpportunityFinderTypeMaster {
    OpportunityFinderTypeObjectId: string;
    OpportunityFinderTypeName: string;
    InactiveOpportunitiesJson: string;
}

/**
 * Interface for handling the Report Properties
 */
export interface IReportProperties {
    IsActionableReport?: boolean;
}

/**
 * Interface for handling the Report Object Mapping Details
 */
export interface IReportObjectMappingDetails {
    ReportObjectId: string;
    ReportObjectLayoutArea: number | null;
    OpportunityFinder_SequenceNumber: number | null;
}


/**
 * Interface for handling the Save Opportunity Finder Details
 */
export interface ISaveOpportunityFinderDetails {
    OpportunityFinder_ObjectId: string;
    OpportunityFinderType_ObjectId: string;
    EaseOfImplementation_ObjectId: string;
    OpportunityName: string;
    OpportunityDescription: string;
    GridColumnsJSON: string;
    TotalSpend: number;
    TotalSavings: number;
    TotalEstimatedSavings: number;
    IsDeleted: boolean;
    IsFlipToProject: boolean;
    isPending: boolean;
    ReportROMappingDetails: IReportObjectMappingDetails[];
    lstDashboardFilters: Array<any>;
    CreatedBy: number;
}

/**
 * Interface for handling the Data Source Object Info
 */
export interface IDataSourceObjectInfo {
    DataSourceObjectID: string;
    DataSourceName: string;
    DataSourceType: number;
    ReportObjects: IReportObjectInfo[];
}

/**
 * Interface for handling the Report Object Info
 */
export interface IReportObjectInfo {
    ReportObjectId: string;
    ReportObjectName: string;
    ObjectGroupName: string;
    DisplayName: string;
    LayoutArea: number;
    SequenceNumber: number;
    IsFilterable: boolean;
    IsDerived: boolean;
    IsTransactional: boolean;
    IsSelectAll: boolean;
    ReportObjectType: number;
    ReportObjectDataType: number;
    IsDrillToTransactional: boolean;
    DrillTransactionOrder: number;
    FilterTypeObjectId: string;
    FilterType: number;
    FormatKey: string;
    ReportObjectWidth: number | null;
    IsDrill: boolean;
    CustomFormula: string | null;
    WijmoGridAggregatedType: number;
    OpportunityFinder_SequenceNumber: number | null;
    Is_DefaultOpportunityFinder: boolean;
    NestedReportFilterObject: any;
    SetConditionalOperator: any;
}

/**
 * Interface for handling the Opportunity Finder Creation Object Info
 */
export interface IOpportunityFinderCreationObjectInfo {
    LstReportObjectOnRow: IReportObjectInfo[];
    LstReportObjectOnColumn: IReportObjectInfo[];
    LstReportObjectOnValue: IReportObjectInfo[];
    LstReportSortingDetails: any[];
    lstFilterReportObject: IReportObjectInfo[];
    ReportId: number;
    ReportDetailObjectId: string;
    ReportName: string;
    DisplayName: string;
    ReportDescription: string;
    ReportType: number;
    IsStandardReport: boolean;
    DataSourceObjectId: string;
    CreatedBy: number;
    CreatedOn: string;
    ModifiedOn: string;
    ReportViewType: number;
    IsTotalRequired: boolean;
    StakeholderCount: number;
    lstPinnedToViews: null;
    ReportProperties: string;
    OppFinderDetails?: ISaveOpportunityFinderDetails;

}

/**
 * Interface for handling the List of Filter Report Object
 */
export interface ILstFilterReportObject {
    ReportObject: IReportObjectInfo;
    FilterCondition: FilterCondition;
    FilterValue: string;
    FilterBy: number;
    IsSliderWidgetFilter: boolean;
}

/**
 * Interface for handling the Filter Condition
 */
export interface FilterCondition {
    FilterConditionObjectId: string;
    Name: string;
    Condition: number;
    Formulla: string;
    IsPeriodFilter: boolean;
    FilterTypeObjectId: string;
    FilterType: number;
}

/**
 * Interface for handling the Manage Column Report Objects
 */
export interface IManageColumnReportObjectInfo {
    id: number;
    title: string;
    isChecked: boolean;
    disable: boolean;
    OpportunityFinder_SequenceNumber: number;
    checkboxConfig: ICheckboxConfig;
    reportObjectInfo: IReportObjectInfo;
}

/**
 * Interface for handling the Checkbox Config
 */
export interface ICheckboxConfig {
    disable: boolean;
    isMandatory: boolean;
    isVisible: boolean;
    label: string;
    validate: boolean;
    focus: boolean;
    errorMessage: string;
    isRemovable: boolean;
}

export interface IDropdown {
    options: any[];
    selectedOption: ISelectTypeOptionClass;
    selectedRangeOptions: IMonthDropdownSelectedRangeOptions;
}

export interface ISelectTypeOptionClass {
}

export interface IMonthDropdownSelectedRangeOptions {
    from: ISelectTypeOptionClass;
    to: ISelectTypeOptionClass;
}

export interface ISource {
    displaytitle: string;
    selectTypeOption: ISelectTypeOptionClass;
    options: any[];
    selectedoption: string;
}

export interface IYearDropDown {
    options: any[];
    selectedOption: IYearDropdownSelectedOption;
    model: string;
}

export interface IYearDropdownSelectedOption {
    title: string;
}

export interface IYearDropdownSelectedRangeOptions {
    from: IYearDropdownSelectedOption;
    to: IYearDropdownSelectedOption;
}

export interface ISearchFilterLazyLoading {
    isSelectAll: boolean;
    dataSourceObjectId: string;
    dataSourceType: number;
    reportObject: IReportObject;
    isOnOrAfterTerm: string;
    searchTerm: string;
}

export interface IReportObject {
    isOnOrAfterTerm: string;
    isDrill: boolean;
    reportObjectId: string;
    reportObjectName: string;
    reportObjectType: number;
}

export interface IReportingObjectMultiDataSource {
    ObjectGroupName: string;
    ReportObjectName: string;
    DisplayName: string;
    ReportObjectId: string;
    GroupName: string;
    ReportObjectType: number;
    IsSelected: boolean;
    isDefault: boolean;
    isDisable: boolean;
    isFilter: boolean;
    FilterType: number;
    FilterBy?: number;
    inChip: boolean;
    FilterConditionOperator: IFilterConditionOperator;
    FromyearDropdown: IFromyearDropdown;
    ToyearDropdown: IToYearDropdown;
    FromQuarteryearDropdown: IFromyearDropdown;
    FromQuarterDropdown: IFromyearDropdown;
    ToQuarteryearDropdown: IToYearDropdown;
    ToQuarterDropdown: IToYearDropdown;
    BeginningOfTheYear: IBeginningOfTheYear;
    BeginningOfTheQuarterYear: IBeginningOfTheYear;
    BeginningOfTheQuarter: IBeginningOfTheYear;
    yearDropdown: IYearDropdown;
    QuarteryearDropdown: IYearDropdown;
    sourceYear: any[];
    sourceQuarterYear: any[];
    sourceQuarterDropDown: IYearDropdown;
    RollingYear: IRollingYear;
    RollingYearsModel: IRollingYearsModel;
    RollingQuarterYear: IRollingYear;
    RollingQuarterYearsModel: IRollingQuarterYearsModel;
    PreviousQuarterYearsModel: IPreviousQuarterYearsModel;
    NextYears: INextYears;
    NextYearsModel: INextYearsModel;
    NextQuarterYears: INextYears;
    NextQuarterYearsModel: INextQuarterYearsModel;
    PreviousQuarterYear: IRollingYear;
    DateModel: IDateModel;
    FromDateModel: IFromDateModel;
    ToDateModel: IToDateModel;
    DateRadioModel: IDateRadioModel;
    RollingDateModel: IRollingDateModel;
    NextDateModel: INextDateModel;
    FilterConditionText: IFilterConditionText;
    FilterSearchText?: { value: string };
    SelectionConfig: ISelectionConfig;
    FilterList: IFilterList[];
    FilterRadioOperator: IFilterRadioOperator;
    YearModel: IFilterRadioOperator;
    QuarterYearModel: IFilterRadioOperator;
    FilterConditionValue: string;
    FilterConditionRangeValue: IFilterConditionRangeValue;
    DataSource_ObjectId: string;
    DatasourceType: AnalyticsCommonConstants.DataSourceType;
    IsSelectAll: boolean;
    IsFilterable: boolean;
    IsMeasure: boolean;
    IsTransactional: boolean;
    IsDrillToTransactional: boolean;
    Is_DefaultOpportunityFinder: boolean;
    DrillTransactionOrder: number;
    DataType: number;
    FormatKey: string;
    ReporObjectWidth: number;
    TableName: string;
    Expression: string;
    DerivedRoType: number,
    WijmoGridAggregatedType?: number;
    OpportunityFinderSequenceNumber?: number;
    CustomFormula: string;
    IsOpportunityFinderDataSource: boolean;
    selectedFilterList: IFilterList[];
    FilterTypeObjectId: string;
    FiterTypeName: string;
    SequenceNumber: number;
    LayoutArea: number;
    IsDerived: boolean;
    ReportObjectDataType: number;
    ReportObjectWidth: number;
    IsDrill: boolean;
    ParentReportObjects: IReportObject;
    SelectAll: boolean;
    CrossSuiteFilterMapping?: ICrossSuiteFilterMapping;
    filteredList: IFilterList[];
    PartialSelect?: boolean;
    ShowSelected?: boolean;
    SelectAllTxt?: string;
    FilterTabInfo?: string;
    filterCdnSet?: boolean;
    filterValueSet?: boolean;
    appliedFilter: boolean;
    filterChipName?: string;
    IsStandardFilterRO: boolean;
    autoCompleteFilterList: any[];
    autoCompleteFilterData: string;
    filterPanelList: any[];
    FilterIdentifier: any;
    isTabFilter?: boolean;
    enabledAsGlobalSlider: boolean;
    globalSliderObject: GlobalSliderObject;
    sliderFilterPanelObject : any;
    ReportDocumentMappingField: string;
}

export interface IFilterConditionRangeValue {
    from?: string;
    to?: string;
    month?: IMonth;
    year?: IMonth;
    quarter?: IMonth;
}

export interface IMonth {
    from: IFromClass;
    to: IFromClass;
}

export interface IFromClass {
    title: string;
}
export interface IFilterConditionOperator {
    FilterConditionObjectId?: string;
    op: number;
    title: string;
}
export interface IFilterConditionValue {
    value: string
    name?: string;
    month?: IFromClass;
    year?: IFromClass;
    quarter?: IFromClass;
}

export interface IFilterList {
    title: string;
    IsSelected: boolean;
}

export interface IFilterRadioOperator {
    field: IFilterConditionOperator;
    inputType?: string;
    postfix?: string;
    inputOptions?: IInputOptions;
}

export interface IInputOptions {
    type: string;
    label: string;
    model: string;
}

export interface ISelectionConfig {
    disable: boolean;
    isMandatory: boolean;
    isVisible: boolean;
    label: string;
    validate: boolean;
    focus: boolean;
    errorMessage?: string;
}


export interface IDAXReportFilter {
    isSelectAll: boolean;
    dataSourceObjectId: string;
    dataSourceType: number;
    reportObject: IDAXReportObject;
    isOnOrAfterTerm: string;
    searchTerm: string | null;
    ftype?: string | null;
}

export interface IDAXReportObject {
    isOnOrAfterTerm: string;
    isDrill: boolean;
    tableName: string;
    expression: string;
    derivedRoType: number;
    parentReportObjects: any[];
    createdBy: string;
    reportObjectId: string;
    reportObjectName: string;
    reportObjectType: number;
}

/**
 * Interface for handling the DAX Result Record
 */
export interface IDAXResultSetInfo {
    Data: any[];
    PageSize: number;
    TotalRowCount: number;
    GrandTotal: any;
    NextSetRequestData: any;
    success: boolean;
}

/**
 *  Interface for handling Cross Suite Filter Mapping
*/
export interface ICrossSuiteFilterMapping {
    RelationObject: IRelationObject;
    RelationObjectMapping: IRelationObjectMapping[];
}

export interface IRelationObject {
    RelationObjectTypeId: string;
    RelationObjectTypeName: string;
    RelationObjectDescription: string;
    RelationObjectType: string;
}

export interface IRelationObjectMapping {
    ReportObjectId: string;
    DataSourceObjectId: string;
    RelationObjectTypeId: string;
    DataSourcePriority: number;
    DataSourceName: string;
    ReportObjectName: string;
}


/**
 * Interface for handling the DAX Result Record
 */
export interface viewConfig {
    code: string;
    viewId: string;
    name: string;
    isOwn: boolean;
    userNumber: number;
    isStandard: boolean;
    lstDashboardFilters: Array<any>;
}

/**
 * Interface for handling the DAX Result Record
 */

export interface ISubheaderConfig {
    filterTabList?: Array<IReportingObjectMultiDataSource>;
    nonStandardFilterList?: Array<IReportingObjectMultiDataSource>;
    dataSourceTypeTitle?: any;
    viewInfoArray?: Array<ViewInfo>;
    dashboardName?: String;
    selectedDashboard?: ViewInfo;
    HasUserVisionEditActivity: boolean;
    showDashboardOnEmptyWidget: boolean;
}
export interface IFilterConditionMetadata {
    FilterConditionObjectId: string;
    FilterTypeObjectId: string;
    Name: string;
    Condition: number;
    Formulla: string;
    IsPeriodFilter: boolean;
}

export interface IOpportunityFinderCurrencySign {
    DataSourceObjectID: string;
    ReportObjectId: string;
    DataSourceName: string;
    ReportObjectName: string;
    FormatKey: string;
    CurrencySign: string;
    NumberFormat: number;
}

export interface IRange {
    // "From" property provides range of Slider Filter.
    from: number;

    // "To" property provides range of Slider Filter.
    to: number;
}

/**
 * Interface for Between fitler condition From dropdown
 */

export interface IFromyearDropdown {
    label: string;
    dataKey: string;
    displayKey: string;
    options: any[];
    fieldKey?: string;
    type?: string;
    cssClass?: string;
    values?: any[];
    selectedRangeOptions: IFrom;
}

/**
 * Interface for Between fitler condition From value
 */

export interface IFrom {
    from: { title: string },
}


/**
 * Interface for Between fitler condition To dropdown
 */
export interface IToYearDropdown {
    label: string;
    dataKey: string;
    displayKey: string;
    options: any[];
    fieldKey?: string;
    type?: string;
    cssClass?: string;
    values?: any[];
    selectedRangeOptions: ITo;
}

/**
 * Interface for Between fitler condition To value
 */
export interface ITo {
    to: { title: string },
}

/**
 * Interface for From_YearToCurrentDate fitler condition drodown
 */

export interface IBeginningOfTheYear {
    dataKey: string;
    displayKey: string;
    options: any[];
    label?: string;
    selectedOption: { title: string },

}
/**
 * Interface for Is,IsNot,Before,After fitler condition 
 */
export interface IYearDropdown {
    dataKey: string;
    displayKey: string;
    options: any[];
    label?: string;
    cssClass?:string;
    fieldKey?: string;
    type?: string;
    selectedOption: { title: string },
    values?: any[];
}

/**
 * Interface for Rolling fitler condition 
 */

export interface IRollingYear {
    label: string;
    attributes: { maxLength: number };
    data: string,
}

/**
 * Interface for Rolling fitler condition rollin_years value
 */
export interface IRollingYearsModel {
    rollingYearValue: string;
}

/**
 * Interface for Next Years fitler condition 
 */
export interface INextYears {
    label: string;
    attributes: { maxLength: number },
    data: string;
}

/**
 * Interface for Next_Years fitler condition Next_Years value
 */
export interface INextYearsModel {
    nextYearValue: string;
}

/**
 * Interface for Date selection for conditions Is,IsNot,Before,After
 */
export interface IDateModel {
    DateValue: Date;
}

/**
 * Interface for Date selection for conditions Between 
 */
export interface IFromDateModel {
    FromDateValue: Date;
}

/**
 * Interface for Date selection for conditions Between 
 */
export interface IToDateModel {
    ToDateValue: Date;
}

/**
 * Interface for Date selection for conditions From_DateTillToday 
 */
export interface IDateRadioModel {
    DateRadioValue: Date;
}

/**
 * Interface for Date selection for conditions Rolling_Days 
 */
export interface IRollingDateModel {
    rollingDateValue: string;
}

/**
 * Interface for Date selection for conditions Next_Days
 */
export interface INextDateModel {
    nextDateValue: string;
}

/**
 * Interface for the Data Source Info Objects
 */
export interface IDataSourceByContactCodeInfo {
    Id: number;
    DataSourceObjectId: string;
    SchemaObjectId: string;
    DataSourceName: string;
    DisplayName: string;
    ActivityCodes: string;
    showTabs: boolean;
    DataSourceProperties: string;
    IsVisible: boolean;
    ModuleId: number;
}
/**
* Interface for Date selection for conditions FilterConditionText
*/
export interface IFilterConditionText {
    value?: string
}

/**
 *  Interface for Wijmo Flex Grid Directive Objects
 */
export interface IWijmoFlexGrid {
    grid: any;
    event: any;
    type: any;
    selectedObj: any
}

/**
 *   Interface for the Wijmo Flex Grid Columns
 */
export interface IWijmoFlexGridColumns {
    _id?: any;
    aggregate: string,
    binding: string,
    format: string,
    header: string,
    isReadOnly: boolean,
    visible: boolean,
    width: number,
    minWidth: number,
    dataType?: number
}

/**
 *   Interface for the Opp Finder State
 */
export interface IOppFinderState {
    oppFinderFlag?: boolean;
    strategy?: IOppFinderStrategy;
    editMode?: boolean;
    oppFinderId?: string;
    gridJson?: any;
    extraProps?: any;
    commonData ?:any;
}

/**
 *   Interface for the Opp Finder Strategy
 */
export interface IOppFinderStrategy {
    name: string;
    shortName: string;
}

/**
 *   Interface for the Fraud and Anomaly State
 */
export interface IFraudAnomalyState {
    fraudAnomalyFlag?: boolean;
    strategy?: IFraudAnomalyStrategy;
    editMode?: boolean;
    fraudAnomalyId?: string;
    gridJson?: any;
    extraProps?: any;
}

/**
 *   Interface for the Fraud and Anomaly Strategy
 */
export interface IFraudAnomalyStrategy {
    name: string;
    shortName: string;
}

/**
 * Interface for handling the Save Opportunity Finder Details
 */
export interface ISaveOpportunityFinderDetails {
    OpportunityFinder_ObjectId: string;
    OpportunityFinderType_ObjectId: string;
    EaseOfImplementation_ObjectId: string;
    OpportunityName: string;
    OpportunityDescription: string;
    GridColumnsJSON: string;
    TotalSpend: number;
    TotalSavings: number;
    TotalEstimatedSavings: number;
    IsDeleted: boolean;
    IsFlipToProject: boolean;
    isPending: boolean;
    ReportROMappingDetails: IReportObjectMappingDetails[];
    lstDashboardFilters: Array<any>;
    CreatedBy: number;
}

/**
 * Interface for handling the Chart Min Max Value
 */
export interface IChartMinMaxValue {
    min: number;
    max: number;
    reportObjectName: string;
}

/**
 * Interface for handling User details 
 */
export interface IUserDetails {

    userName: string;
    firstName: string,
    lastName: string;
    emailAddress: string;
    fullName: string
    userID: number;
    isOwner: boolean;
    isShared: boolean;
    contactCode: number;
    IsCheckModel: any;
}


export interface IHierarchyFilterDetails {
    WidgetID: string;
    FilterObjects: Array<IHierarchyFilterObject>;
    WidgetName: string
    Order?: number;
}


export interface IHierarchyFilterObject {
    ReportObjectID: string;
    FilterValue: string;
    RelationObjectID?: string;
    Order?: number;
}


export interface ISlicerFilterConfig {
    ReportDetail: any;
    SelectedFilterList: Array<ISlicerFitlerValue>;
    FilterObject: any;
    SlicerLoaderConfig: any;
    SearchConfig: {
        IsSearchActive: boolean,
        ShowSearchClose: boolean,
        SearchText: string
    },
    SlicerSubscription: any;
    Message:String
    SlicerFilterExpanded: boolean;
}

export interface ISlicerFitlerValue {
    Title: string;
    IsPresentInData: boolean;
}

export interface IDashboardGridBindEventRef {
    createSlicerComponent: Function;
    destroySlicerComponentRef: Function;
}

export interface IRollingQuarterYearsModel {
    rollingQuarterYearValue: string;
}

export interface IPreviousQuarterYearsModel {
    previousQuarterYearValue: string;
}

export interface INextQuarterYearsModel {
    nextQuarterYearValue: string;
}

export interface ITabInfo {
    tabId: string;
    title: string;
    isActive: boolean;
    isStriked: boolean;
    isEditable: boolean;
    sectionId: string;
    viewId: string;
    tabSequence: number
}


export interface ITabDetail {
    tabId: string;
    tabName: string;
    tabSequence: number;
    isDeleted: boolean;
    lstSectionInfo: Array<ISectionInfo>;
}

export interface ISectionInfo{
    sectionId: string;
    sectionName: string;
    isDeleted: boolean;
    sectionSequence: number;
}


export interface ITabAction{
    type: string;
    values: any;
}
