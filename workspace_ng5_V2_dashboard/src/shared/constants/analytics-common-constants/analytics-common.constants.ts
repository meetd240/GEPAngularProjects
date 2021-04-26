import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageConstants } from './analytics-vision-common-message-constants';
import { productConfiguration, productName } from 'configuration/productConfig';

@Injectable()
export class AnalyticsCommonConstants {
    constructor(private _translate: TranslateService) {
        this.setMultiLingualUserCultureCode();
    }

    private setMultiLingualUserCultureCode() {
        try {
            for (var _objectKey in AnalyticsCommonConstants.UIMessageConstants) {
                AnalyticsCommonConstants.UIMessageConstants[_objectKey] = this._translate.instant(AnalyticsCommonConstants.UIMessageConstants[_objectKey]);
            }
        }
        catch (exception) {
            console.log(exception.message);
        }
    }
}

export namespace AnalyticsCommonConstants {

    export enum DataSourceType {
        Tabular,
        Cube,
        SqlTable,
        SqlView,
        SqlStoredProcedure,
        ElasticSearch
    };

    export enum ProductType {
        Reports = 0,
        OpportunityFinder = 1,
        BidInsights = 2
    };

    export enum ConditionalOperator {
        Nan,
        AND,
        OR
    };

    export enum MultiColorSet {
        '#3f67c5',
        '#cb4728',
        '#f19d39',
        '#459331',
        '#984830',
        '#8C2094'
    }

    export class PeriodData {
        public static monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        public static quarterArray = ["Q1", "Q2", "Q3", "Q4"];
        public static getQuarter = d => {
            d = d || new Date();
            //Use Below Commented Code to Financial Year Quater.
            //var m = Math.floor(d.getMonth() / 3) + 2;
            //return m > 4 ? m - 4 : m;
            return Math.floor((d.getMonth() + 3) / 3);
        };
    }

    export const HttpMethod = {
        GET: "GET",
        PUT: "PUT",
        POST: "POST",
        DELETE: "DELETE"
    };

    export const WidgetFunction = {
        RENAME: "Rename",
        UNLINK: "Unlink",
        REMOVE: "Remove",
        OPEN_REPORT: "Open Report",
        APPLY_GLOBAL_FILTER: "Apply Global Filter",
        VIEW_DATA_SOURCE: "ViewDataSource",
        EDIT_DATA: "EditData",
        SLIDER_APPLY: 'SliderApply',
        UPDATE_DESCRIPTION: 'Update Description',
        HIDE_TITLE: 'Hide Title',
        SHOW_TITLE: 'Show Title',
        ADD_DESCRIPTION: 'Add Description',
        EDIT_DESCRIPTION: 'Edit Description',
        LINK_TO_DASHBOARD: 'Link to Dashboard',
        UNLINK_FROM_DASHBOARD: 'Unlink widget from dashboard',
        LINKED_WIDGET_HEADING_CLICKED: "Linked widget heading clicked",
        ShowPercentageValue: 'Show Percentage of Value',
        HidePercentageValue: 'Hide Percentage of Value',
        MoveTo: 'Move To',
        REMOVE_TABS: 'Remove Tabs',
        REMOVE_GLOBAL_SLIDER: 'Remove Global Slider'
    };

    export enum ReportObjectType {
        Metrics = 0,
        Attribute = 1,
        Input = 2,
        Custom = 3,
        Calculated = 4,
        DerivedAttribute=5

    };

    export enum ReportObjectLayoutArea {
        Rows = 0,
        Columns = 1,
        Values = 2,
        None = -1
    };

    export const DashboardViewsTypes = {
        MY_VIEWS: "My Views",
        STANDARD_VIEW: "Standard Views",
        SHARED_VIEW: "Shared Views"
    }

    export enum ReportObjectDataType {
        String = 0,
        Int = 1,
        Float = 3,
        Decimal = 4,
        Double = 5,
        DateTime = 6,
        Boolean = 7
    };
    export enum FilterType {
        SingleSelect = 0,
        MultiSelect = 1,
        Measure = 2,
        Tree = 3,
        Date = 4,
        Month = 5,
        MonthYear = 6,
        Year = 7,
        Quarter = 8,
        QuarterYear = 9,
        Number = 10
    }

    export enum FilterBy {
        FilterBySelection = 1,
        FilterByCondition = 2
    }

    export enum ReportViewType {
        Olap = 0,
        column = 1,
        stColumn = 2,
        pie = 3,
        spline = 4,
        Flex = 5,
        ExportFlat = 6,
        ExportPivot = 7,
        treemap = 8,
        MultiAxisChart = 9,
        ParetoChart = 10,
        SummaryCard = 11,
        PercentStackedColumnChart = 12,
        StackedBarChart = 13,
        PercentStackedBarChart = 14,
        ClusteredStackedColumnChart = 15,
        BarChart = 16,
        DonutChart = 17,
        GaugeChart = 18,
        ColumnLineCombinationChart = 19,
        BarLineCombinationChart = 20,
        BubbleChart = 21,
        MapChart = 22,
        WaterFallChart = 23,
        HistogramChart = 24,
        HeatMap = 25
    }

    export enum DataLabelConfig {
        EnableDataLabel = 1,
        EnableFontSize = 2
    };

    export const WidgetDataType = {
        Chart: 'chart',
        Olap: 'olap',
        Flex: 'flex',
        SummaryCard: 'summary-card',
        WidgetCard: 'widget-card',
        MapChart: 'mapchart',
        GuageChart: 'gauge-chart',
        OppFinderCard: 'oppfinder-card',
        GlobalSliderWidget: 'GlobalSliderWidget'
    }

    export enum SortType {
        Asc = 0,
        Desc = 1
    }
   
    export const SortAs = {
        Asc: 'asc',
        Desc: 'desc',
        AscDesc: 'asc_desc'
    }

    export const SortIconType = {
        Asc: '#icon_SortAscending',
        Desc: '#icon_SortDescending',
        AscDesc: '#icon_Sort'
    }

    export const CommonConstants = {
        Percent: "PERCENT",
        Year: "YEAR"
    }

    export const FormatType = {
        USD: "$",
        Euro: "€",
        Yen: "¥",
        GBP: "£",
        CAD: "$",
        AUD: "$",
        CHF: "CHF",
        CNY: "¥",
        MXN: "$",
        SEK: "kr",
        SGD: "$",
        HKD: "$",
        DKK: "kr",
        INR: "₹",
        MYR: 'RM',
        IDR: "Rp",
        PERCENT: "%",
        CODE: "CODE",
        BruneiDollar: "B$"
    }

    export enum ReportObjectOperators {
        Contains = 0,
        DoesNotContains = 1,
        Is = 2,
        IsNot = 3,
        BeginsWith = 4,
        EndsWith = 5,
        In = 6,
        NotIn = 7,
        IsNull = 8,
        IsNotNull = 9,
        IsEmpty = 10,
        IsNotEmpty = 11,
        GreaterThan = 12,
        LessThan = 13,
        Between = 14,
        NotBetween = 15,
        TopNRecords = 16,
        LowestNRecords = 17,
        TopNPercentage = 18,
        LowestNPercentage = 19,
        Before = 20,
        After = 21,
        PreviousYear = 22,
        ThisYear = 23,
        NextYear = 24,
        Rolling_Years = 25,
        Next_Years = 26,
        From_YearTillToday = 27,
        PreviousMonth = 28,
        ThisMonth = 29,
        NextMonth = 30,
        Rolling_Months = 31,
        Next_Months = 32,
        From_MonthTillToday = 33,
        PreviousQuarter = 34,
        ThisQuarter = 35,
        NextQuarter = 36,
        Rolling_Quarters = 37,
        Next_Quarters = 38,
        From_QuarterTillToday = 39,
        Yesterday = 40,
        Today = 41,
        Tomorrow = 42,
        Rolling_Days = 43,
        Next_Days = 44,
        From_DateTillToday = 45,
        Previous_Quarter = 50,
      Previous_Month = 49,
      GreaterThanOrEqualTo = 46,
      LessThanOrEqualTo = 47,
    }

    export enum ReportType {
        AdhocReport = 0,
        VIDashboard = 1,
        OpportunityFinder = 2
    }

    export enum ConstantString {
        Pie = "pie",
        STColumn = "stColumn",
        Spline = "spline",
        Column = "column",
        MultiAxes = "MultiAxisChart",
        ShortDot = "shortdot",
        Pointer = "pointer",
        Squarified = "squarified",
        Normal = "normal",
        ParetoChart = "pareto",
        PercentStColumn = 'percentStColumn',
        STBar = "sTBar",
        PercentSTBar = "percentSTBar",
        Bar = 'bar',
        Percent = 'percent',
        Bubble = 'bubble',
        PercentStackedBarChart = 'PercentStackedBarChart',
        WaterFallChart = "waterfall",
        GaugeChart = 'solidgauge',
        StackedBarChart = 'StackedBarChart',
        PercentStackedColumnChart = 'PercentStackedColumnChart',
        HistogramChart = 'histogram',
        HeatMap = 'heatmap'
    }

    export const FilterProperty = {
        FilterConditionOperator: 'FilterConditionOperator',
        FilterRadioOperator: 'FilterRadioOperator',
        YearModel: 'YearModel',
        FilterConditionValue: 'FilterConditionValue',
        FilterConditionRangeValue: 'FilterConditionRangeValue',
        FromyearDropdown: 'FromyearDropdown',
        ToyearDropdown: 'ToyearDropdown',
        yearDropdown: 'yearDropdown',
        BeginningOfTheYear: 'BeginningOfTheYear',
        RollingYearsModel: 'RollingYearsModel',
        NextYearsModel: 'NextYearsModel',
        FilterConditionText: 'FilterConditionText',
        DateModel: 'DateModel',
        FromDateModel: 'FromDateModel',
        ToDateModel: 'ToDateModel',
        DateRadioModel: 'IDateRadioModel',
        RollingDateModel: 'RollingDateModel',
        NextDateModel: 'NextDateModel',
        QuarterYearModel: 'QuarterYearModel',
        NextQuarterYearsModel: 'NextQuarterYearsModel',
        RollingQuarterYearsModel: 'RollingQuarterYearsModel',
        PreviousQuarterYearsModel: 'PreviousQuarterYearsModel',
        BeginningOfTheQuarterYear: 'BeginningOfTheQuarterYear',
        BeginningOfTheQuarter: 'BeginningOfTheQuarter',
        sourceQuarterDropDown: 'sourceQuarterDropDown',
        QuarteryearDropdown: 'QuarteryearDropdown',
        FromQuarterDropdown: 'FromQuarterDropdown',
        FromQuarteryearDropdown: 'FromQuarteryearDropdown',
        ToQuarteryearDropdown: 'ToQuarteryearDropdown',
        ToQuarterDropdown: 'ToQuarterDropdown'
    }

    export const SummaryCardAction = {
        AddDescription: 'Add Description',
        EditDescription: 'Edit Description',
        Remove: 'Remove',
        ShowTitle: 'Show Title',
        HideTitle: 'Hide Title',
        OpenReport: 'Open Report',
        UnlinkReport: 'Unlink',
        LINK_TO_DASHBOARD: 'Link to Dashboard',
        UNLINK_FROM_DASHBOARD: 'Unlink widget from dashboard',
        LINKED_WIDGET_HEADING_CLICKED: "Linked widget heading clicked",
        ShowPercentageValue: 'Show Percentage of Value',
        HidePercentageValue: 'Hide Percentage of Value',

    }

    export const EnableFeature = {
        Sort: 'Sort',
        Pagination: 'Pagination',
        MinMaxValue: 'MinMaxValue',
        TwentyRows: 'TwentyRows',
        NAPageSize: "NAPageSize" // Not Applicable Page Size
    }

    export const ExistingReportUrl = "Analytics?oloc=224&ReportID=[ReportID]&ts=" + new Date().getTime();

    export const chartPageSize = 20;

    export const SummaryCardFixedValue = 2;

    export const SummaryCardIntegerValue = 0;

    export const ErrorHandlerConstants = {
        HttpError: 'There was an HTTP error.',
        TypeError: 'There was an Type  error.',
        GeneralError: 'There was a General error.',
        UnexpectedError: 'Unexpected Error Occured',
    }

    export const dashboardDocumentType = -333;

    //Keeping the Chart and Flex Related Events together
    export const EventType = {
        RecordNotFound: 'RecordNotFound',
        ErrorOccured: 'ErrorOccured',
        Click: 'click',
        DoubleClick: 'dblclick',
        ContextMenu: 'contextMenu',
        Render: 'render',
        SetOpacity: 'setOpacity',
        Selection: 'Selection',
        RemoveDrive: 'removeDrive',
        Drive: 'Drive',
        DrillDown: 'DrillDown',
        DrillUp: 'DrillUp',
        ResizeCard: 'Resizecard',
        UpdateChart: "update",//Keeping the Update Flag for Widget to Re Render the Chart in DOM with Updated json
        Cancel: 'Cancel',
        GetSaveDashboard: 'getGlobalFilterSaveDashboard',
        SetSaveDashboard: 'setGlobalFilterSaveDashboard',
        GetSaveAsDashboard: 'GetFilterSaveAsDashboard',
        SetSaveAsDashboard: 'SetFilterSaveAsDashboard',
        FlexGrid: {
            Render: 'render',
            Update: 'update',
            Selection: 'selection',
            CellEdit: 'celledit',
            ItemFormatter: 'itemFormatter',
            SortingColumn: 'sortingColumn',
            FlexEvents: 'Flex-Events',
            ResizingColumn: 'resizedColumn',
        },
        AutoScrollEvents: {
            AutoKeyUp: 'keyup',
            OnSelect: 'onSelect'
        },
        Olap: {
            OlapEvent: {
                ResizedRow: 'resizedRow',
                resizingColumn: 'resizingColumn',
                ResizedColumn: 'resizedColumn',
                RowEditStarted: 'rowEditStarted',
                RowEditStarting: 'rowEditStarting',
                ScrollPositionChanged: 'scrollPositionChanged',
                SelectionChangeded: 'SelectionChangeded',
                SelectionChanging: 'selectionChanging',
                UpdatedLayout: 'updatedLayout',
                UpdatedView: 'updatedView',
                UpdatingLayout: 'updatingLayout',
                UpdatingView: 'updatingView',
                SortingColumn: 'sortingColumn',
                SortedColumn: 'sortedColumn',
                FormatItem: 'formatItem',
                ShowSubTotal: 'showSubtotal',
                CollapseClick: 'collapseClick'
            },
            OlapHttpStatus: {
                Success: 'success',
                Error: 'error'
            }
        },
        ReflowChart: 'Reflow Chart',
        MeasureFilterApplied: 'MeasureFilterApplied'
    }

    export enum VisionUserActivites {
        VIEW_VISION_DASHBOARD = "10600030",
        EDIT_VISION_DASHBOARD = "10600031",
        INSIGHT_VISION_ADMIN = "10600029"
    }

    export enum FilterIdentifierType {
        GlobalLevelFilter = 'GlobalLevelFilter',
        ReportLevelFilter = 'ReportLevelFilter',
        DrillFilter = 'DrillFilter',
        DriveFilter = 'DriveFilter',
        SlicerFilter = 'SlicerFilter',
        TabFilter = 'TabFilter',
        GlobalSlider = 'GlobalSlider'
    }

    export enum FilterObjectConditionID {
        MultiselectIs = '8E56AACB-A0C7-4CA2-BFE3-C27A55CE35D2',
        MultiselectIn = '63d9bae8-94c5-4adc-afb5-d53e28f117e9'
    }

    export enum ViewFilterType {
        SingleSource = 0,
        MultiSource = 1,
        DriveFilter = 2,
        SlicerFilterSingleDataSource = 3,
        SlicerFilterMultiDataSource = 4,
        GlobalSliderFilterSingleDataSource = 5,
        GlobalSliderFilterMultiDataSource = 6
    }

    export const ModuleType = {
        DASHBOARD: 'dashboard',
        OPPFINDER: 'oppFinder',
        FRAUDANOMALY : 'fraudAnomaly'
    }

    export enum FilterAppliedAs {
        ReportFilter = 0,
        DrillFilter = 1
    }


    export enum ParetoChartConfig {
        CumulativePercentage = 'Cumulative Percentage',
        DecimalCumulativePlace = 2
    }
    export const EditViewOperation = {
        DELETE_VIEW: 1,
        RENAME_VIEW: 2,
        ADD_STANDARD_VIEW: 3,
        REMOVE_ADD_STANDARD_VIEW: 4,
        ADD_DRILLED_VIEW: 5,
        REMOVE_DRILLED_VIEW: 6

    }
    export const WijmoConfiuration = {
        WijmoGridMinWidth: 50,
        WijmoSelectionMode: {
            NONE: 'None',
            CELL: 'Cell',
            CELLRANGE: 'CellRange',
            ROW: 'Row',
            ROWRANGE: 'RowRange',
            LISTBOX: 'ListBox'
        },
        WijmoColumnAggregation: {
            WIJMO_NONE: {
                _id: 0,
                _value: 'None'
            },
            WIJMO_SUM: {
                _id: 1,
                _value: 'Sum'
            },
            WIJMO_CNT: {
                _id: 2,
                _value: 'Cnt'
            },
            WIJMO_AVG: {
                _id: 3,
                _value: 'Avg'
            },
            WIJMO_MAX: {
                _id: 4,
                _value: 'Max'
            },
            WIJMO_MIN: {
                _id: 5,
                _value: 'Min'
            },
            WIJMO_RNG: {
                _id: 6,
                _value: 'Rng'
            },
            WIJMO_STD: {
                _id: 7,
                _value: 'Std'
            },
        }
    }

    export const FraudAnomalyConstants = {
        /***
         * Fraud and Anomaly Strategy names
         */
        Strategies: {
            HCN :{
                name: 'High Concentration',
                shortName: 'HCN'
            }
        }
    }

    export const OpportunityFinderConstants = {
        /***
         * Opportunity Finder Strategy names
         */
        Strategies: {
            SRS: {
                name: 'Supplier Rationalization',
                shortName: 'SRS'
            },
            SRSN: {
                name: 'Supplier Rationalization New',
                shortName: 'SRSN'
            },
            PTS: {
                name: 'Payment Term Rationalization',
                shortName: 'PTS'
            },
            PTSN: {
                name: 'Payment Term Rationalization New',
                shortName: 'PTSN'
            },
            PPV: {
                name: 'Purchase Price Variance',
                shortName: 'PPV'
            },
            PONPO: {
                name: 'PO Vs Non PO',
                shortName: 'PONPO'
            },
            CONCO: {
                name: 'Contract Vs Non Contract',
                shortName: 'CONCO'
            },
            APTN: {
                name: 'Auto Payment Term Normalization',
                shortName: 'APTN'
            },
            APTI: {
                name: 'Auto Payment Term Improvement',
                shortName: 'APTI'
            },
            BPDS: {
                name: 'Best Payment Date For Suppliers',
                shortName: 'BPDS'
            },
            BPDC: {
                name: 'Best Payment Date For Categories',
                shortName: 'BPDC'
            },
            TSA: {
                name: 'Tail Spend Analyzer',
                shortName: 'TSA'
            },
        },

        /*
        *   Auto Payment Term opportunity grid columns
        */
        AutoPaymentTermGridColumns: {
            opportunityName: "Opportunities",
            spend: "Total Spend(USD)",
            costOfCapital: "Cost Of Capital(%)",
            addressableSpend: "Addressable Spend(%)",
            countPaymentTerm: "Count of Payment Terms",
            bestPaymentTerm: "Best Payment Term",
            savings: "Potential Savings(USD)",
            dataDate: "Creation Date",
            edit: "Edit Opportunity"
        },
        BestPaymentTermGridColumns: {
            actualInvoiceClearingDate: "Actual Invoice Clearing Date",
            bestPaymentDate: "Best Payment Date",
            discountPercent: "Discount %",
            discountDays: "Discount Days",
            discountLastDate: "Discount Last Date",
            incurredPenalties: "Incurred Penalties",
            invoiceAmount: "Invoice Amount",
            invoiceDueDate: "Invoice Due Date",
            invoiceNumber: "Invoice Number",
            paymentStatus: "Payment Status",
            paymentTerm: "Payment Term",
            penaltyPercent: "Penalty %",
            potentialSaving: "Potential Saving"
        },

        DEFAULT_ADDRESSABLE_SPEND: 100,
        DEFAULT_COST_OF_CAPITAL: 4,
        DATEOFSTANDING_ADDRESSABLE_SPEND: 100,
        DATEOFSTANDING_COST_OF_CAPITAL: 100,
        DEFAULT_PENALTY: 3,
        DEFAULT_ESTSAVINGPER: 4,
        /*
        *
        *   Create Opportunity Component Constants used during programing please dont change it. 
        *
        */
        UNIQUEDATA_ROWID: 'UniqueDataRowId',
        PAYMENTTERM_ADJUSTABLE_SPEND: 'Addressable Spend',
        OPPFINDER_ID: 'oppfinderId',
        ORIGIN: 'origin',
        INSCOPE: 'inscope',
        ISCHECKED: 'isChecked',
        ID: 'id',
        ACTIVE: 'Active',
        ASC: 'asc',
        DESC: 'desc',
        OPPORTUNITY_FINDER_SEQUENCE_NUMBER: 'OpportunityFinder_SequenceNumber',
        ACTIVESTATE: {
            ALL: 'All',
            IN_SCOPE: 'In Scope',
            NOT_IN_SCOPE: 'Not In Scope',
        },
        ICON_TYPE: {
            icon: 'icon',
            text: 'text'
        },
        /***
         * 
         * WIJMO Column Level Configuration please dont change it. 
         * 
         */
        WIJMO: WijmoConfiuration.WijmoColumnAggregation,
        OBJECT_CUSTOM_FORMULA: 'ObjectCustomFormula',
        OBJECT_STALE_INPUT_VALUES: 'StaleInputCustomValues',
        OBJECT_MAIN_OPPORTUNITY_FINDER_REPORT_DATA: 'MainOpportunityFinderReportData',
        REPORT_OBJECT_DEFAULT_VALUE: 0,
        STRING_EMPTY: '',
        STRING_STRATEGY_NAME: 'SRS',
        STRING_SUPPLIER_RATION_NAME: 'Supplier Rationalization',
        /*
        *
        *   Message Box Buttons String Constants please dont change it. 
        *
        */
        STRING_ERROR: 'error',
        STRING_SUCCESS: 'success',
        STRING_WARNNING: 'warning',
        STRING_CONFIRM: 'confirm',
        STRING_INFORM: 'inform',
        BOOLEAN_BTN_FLAT: true,
        /*
        *
        *   Toast Message Constants 
        *
        */
        TOAST_LENTH: 3500,
        TOAST_POSITION: {
            TOP: 'top',
            RIGHT: 'right',
            BOTTOM: 'bottom',
            LEFT: 'left',
            START: 'start'
        }


    }
    export const UIMessageConstants = MessageConstants;

    export enum DAXQueryManipulate {
        AllRecords = "-1",
        EmptyFiltersData = "Empty"
    }

    export const SmartComponentConfig = {
        SmartGlobalLoaderConfig: 'SmartGlobalLoader',
        SmartVisionGridConfig: 'SmartVisionGrid',
        SmartButtonConfig: 'SmartButton',
        SmartDashboardCardConfig: 'SmartDashboardCard',
        SmartTextFieldConfig: 'smartTextField',
        SmartCardTitleConfig: 'SmartCardTitle',
        SmartMenuTooltipConfig: 'SmartMenuTooltip',
        SmartCardLoaderConfig: 'SmartCardLoader',
        SmartFullScreenTooltipConfig: 'SmartFullScreenTooltipConfig',
        SmartFilterTooltipConfig: 'SmartFilterTooltipConfig',
        SmartSlicerTooltipConfig: 'SmartSlicerTooltipConfig',
        SmartActionTooltipConfig: 'SmartActionTooltipConfig',
        SmartPreviousTooltipConfig: 'SmartPreviousTooltipConfig',
        SmartNextTooltipConfig: 'SmartNextTooltipConfig',
        SmartLinkedReportConfig: 'SmartLinkedReportConfig',
        SmartViewAppliedFilterConfig: 'SmartViewAppliedFilterConfig',
        SmartAddWidgetTooltipConfig: 'SmartAddWidgetTooltipConfig',
        SmartRefreshWidgetTooltipConfig: 'SmartRefreshWidgetTooltipConfig',
        SmartLinkedToDashboardConfig: 'SmartLinkedToDashboardConfig',
        SmartCopyDashboardViewUrlConfig: 'SmartCopyViewUrlConfig',
        shareDashBoardAddTooltipConfig: 'shareDashBoardAddTooltipConfig',
        shareDashBoardSearchTooltipConfig: 'shareDashBoardSearchTooltipConfig',
        shareDashBoardCloseTooltipConfig: 'shareDashBoardCloseTooltipConfig',
        shareDashBoardUnShareTooltipConfig: 'shareDashBoardUnShareTooltipConfig',
        shareDashBoardShareTooltipConfig: 'shareDashBoardShareTooltipConfig',
        SmartAutoCompleteConfig: 'SmartAutoCompleteConfig',
        SmartDrillUpToolTipConfig: 'SmartDrillUpToolTipConfig'
    }

    export const PeriodFilterPropsConfig = {
        BeginningOfTheQuarterYear: 'BeginningOfTheQuarterYear'
    }

    export enum OppfinderCommonConstants {
        ReportBySupplier = 'By Supplier',
        NonCompliantSpend = 'Non Compliant Spend',
        CompliantSpend = 'Compliant Spend',
        DefultSupplierWidth = 300,
        OppfinderDocumentTypeCode = -4,
        RecommendationDocumentTypeCode = 1062
    }

    export enum CellFormatConditions {
        GreaterThan,
        LessThan,
        Between,
        EqualTo,
        NotEqualTo,
        TopN,
        LowestN,
        TopNPercent,
        LowestNPercent,
        GreaterThanOrEqualTo,
        LessThanOrEqualTo,
        contains,
        doesNotContain,
        isEmpty,
        isNotEmpty,
        isNull,
        isNotNull,
        beginsWith,
        endsWith,
        betweenRowLevelFormula,
        None
    }

    export var NumberConfigurationType = {
        Automatic: { id: 0, value: "Automatic" },
        Number: { id: 1, value: "Number" },
        Currency: { id: 2, value: "Currency" },
        Percentage: { id: 3, value: "Percentage" }
    }

    export var DecimalNumberOptions = {
        zero: { id: 0, value: 0, text: '0' },
        one: { id: 1, value: 1, text: '1' },
        two: { id: 2, value: 2, text: '2' },
        three: { id: 3, value: 3, text: '3' },
        four: { id: 4, value: 4, text: '4' }
    }

    export var NegativeFormatOptions = {
        option1: { id: 1, value: '-1234' },
        option2: { id: 2, value: '(1234)' }
    }

    export var DisplayUnitOptions = {
        None: { id: 0, value: 'None', unit: '' },
        Thousands: { id: 1, value: 'Thousands(K)', unit: 'K' },
        Millions: { id: 2, value: 'Millions(M)', unit: 'M' },
        Billions: { id: 3, value: 'Billions(B)', unit: 'B' }
    }

    export var CurrencySymbolOptions = {
        USD: { id: 0, value: 'USD - $', unit: '$' },
        EUR: { id: 1, value: 'EUR - €', unit: '€' },
        GBP: { id: 2, value: 'GBP - £', unit: '£' },
        Yen: { id: 3, value: 'Yen - ¥', unit: '¥' },
        SEK: { id: 4, value: 'SEK - kr', unit: 'kr' },
        INR: { id: 5, value: 'INR - ₹', unit: '₹' },
        CAD: { id: 6, value: 'CAD - $', unit: '$' },
        AUD: { id: 7, value: 'AUD - $', unit: '$' },
        CHF: { id: 8, value: 'CHF - CHF', unit: 'CHF' },
        CNY: { id: 9, value: 'CNY - ¥', unit: '¥' },
        SGD: { id: 10, value: 'SGD - $', unit: '$' },
        MXN: { id: 11, value: 'MXN - $', unit: '$' },
        HKD: { id: 12, value: 'HKD - $', unit: '$' },
        DKK: { id: 13, value: 'DKK - kr', unit: 'kr' },
        MYR: { id: 14, value: 'MYR - RM', unit: 'RM' },
        IDR: { id: 15, value: 'IDR - Rp', unit: 'Rp' },
        PERCENT: { id: 16, value: 'PERCENT', unit: "%" },
        CODE: { id: 17, value: 'CODE', unit: "CODE" },
        BruneiDollar: { id: 18, value: 'BND - B$', unit: "B$" }
    }

    export var DecimalConfigurationOptions = {
        ConfigurationType: 0,
        DecimalOptions: 1,
        NegativeFormatOptions: 2,
        DisplayUnitOptions: 3,
        CurrencySymbolOptions: 4
    }
    /* Constant string for percentage enabled summary - used to match column name from dax response*/
    export var PercentageEnabledSummaryCard = {
        STRING_PERCENTAGE_FOR_SUMMARY_CARD: 'Percentage of '
    }
    export var NullIndicator = {
        NullIndicator: "(null)"
    }

    export enum FormatTypeCODE {
        FormatTypeForCode = "f0||1"
    }

    export enum ActionMenuType {
        SubHeaderMenu,
        DashboardCard,
        SummaryCard
    }


    //Constants for OLAP 
    export enum WijmoCellType {
        Cell = 1,           // Regular Cell Data. 
        TopLeft = 4,        //Top-left cell (intersection between row headers and column headers).
        ColumnHeader = 2,   //Column header cell.
        RowHeader = 3       //Row header cell.
    }

    export const OLAPTotalsSignature = {
        Subtotal: 'Subtotal',
        Grandtotal: 'Grand Total'
    }

    export const oppFinderGridMessage = "All Categories across All regions";



    export const OLAPDriveColor = {
        DriveColor: '#ADD8E6'
    }

    export const chartLabelSize = 50;

    /* Adding the enum for the loader to load for Block Loader or global loader */
    export enum LoaderType {
        CardLoader = 1,
        BlockLoader = 2
    }
    export const pageIndex = "1";
    export const pageSize = "50";

    export const evalPageIndex = "this.config.pageIndex @sign 1;"

    export const createBtnConfig = {
        title: "Create Opportunity",
        flat: false,
        disable: false
    }
    export const assignBtnConfig = {
        title: "Assign",
        flat: false,
        disable: false
    }
    export const nextBtnConfig = {
        title: MessageConstants.STRING_NEXT_TXT,
        flat: false,
        disable: false
    }

    export const resetBtnConfig = {
        title: "Reset",
        flat: false,
        disable: false
    }
    export enum trendMeasureReportViewOptions {
        DisplayPercentageChangeOnly = 0,
        DisplayPercentageChangeAndValueColumn = 1
    }
    export enum DerivedRoType {
        TrendMeasureType = 2,
        DerivedAttributeObject=4
    }      

    export const SummaryCardColors = {
        backgroundColor: '#ffffff',
        valueColor: '#0073dc'
    }
    export const PopupFor = {
        Slicer: 'Slicer'
    }

    export const Component = {
        SlicerComponent: 'SlicerComponent'
    }
    export const IngestionActionType = {
        Index: 'index',
        Update: 'update',
        Delete: 'delete'
    }
    export const EmptyGuid = "00000000-0000-0000-0000-000000000000";
    export enum AggregateFunction {
        Average = "Average",
        Count = "Count",
        DistinctCount = "DistinctCount",
        Min = "Min",
        Max = "Max",
        Sum = "Sum"
    }

    export const TabAction = {
        DeleteTab : "DELETE_TAB",
        RenameTab : "RENAME_TAB",
        RearrangeTab : "REARRANGE_TAB",
        ResetTabs: "RESET_TABS"
    }

    export const AppliedFilterType = {
        isTabFilter: "isTabFilter",
        isGlobaFilter: "isGlobalFilter"
    }

    export const DefaultTab = 'default_tab';

    export const defaultWidthForReportObject = 150;

    export const staticMessageForFraudAnomaly = "This a default report generated based on below parameters.in order to prob in detail. you can edit report in insights";
    
    export enum FraudAnomalyCommonConstants {
        ActionColumn = 'Action',
        Investigate = 'Investigate',
        EventInvestigate = 'InvestigateEvent' ,
    }
    export const GlobalSliderWidgetComponent = "GlobalSliderWidget";
}
