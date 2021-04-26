import { IWidgetsConfig, WidgetsManagerLayoutEnum, WidgetTypesEnum } from "smart-core-types";
import { basicDetailsFields } from "../widgets/basic-details.config";
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';

export const defaultManagerConfig: IWidgetsConfig = {

    managerId: 'default',
    layout: WidgetsManagerLayoutEnum.SingleColumn,
    // behaviour :{advancedSectionTrail :false},
    widgets: [
    
        {
            widgetId: 'BasicDetails',
            title: "BasicDetails",
            type: WidgetTypesEnum.Standard,
            manifestPath: 'basic-details/bdw:basicDetails', // ModuleId/ComponentId:Resolver-Params <== In this case we used dataModelId
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: false,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: true,
                listIndex: 0,
                columnIndex: 0,
                isOptionalMenuEnabled: true
            },
            children: basicDetailsFields
        },
        {
            widgetId: 'Investigation',
            title: 'Investigation',
            type: WidgetTypesEnum.Lines,
            manifestPath: 'investigation-widget/investigation-widget',
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: false,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: true,
                listIndex: 0,
                columnIndex: 0,
                isOptionalMenuEnabled: true
            },
            children:null
        }


    ]
}