import { IWidgetsConfig, WidgetsManagerLayoutEnum, WidgetTypesEnum } from "../smart-core-types";
import { basicDetailsFields,deliveryInvoicingFields, ProcurementProfileFields } from "./widgets";

export const defaultManagerConfig: IWidgetsConfig = {
    managerId: 'default',
    layout: WidgetsManagerLayoutEnum.SingleColumn,
    widgets: [
        {
            widgetId: 'ProcurementProfileSection',
            title: 'ProcurementProfile',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'procurement-profile-wrapper/pp:procurementProfile',
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 0,
                columnIndex: 0,
                isOptionalMenuEnabled: false
            },
            children: ProcurementProfileFields
        },
        {
            widgetId: 'basicDetails',
            title: 'P2P_Sections_BasicDetails',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'bds/bdw:basicDetails', // ModuleId/ComponentId:Resolver-Params <== In this case we used dataModelId
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: true,
                listIndex: 0,
                columnIndex: 0,
                isOptionalMenuEnabled: true,
                isShown: ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202"]
            },
            children: basicDetailsFields
        },
        {
            widgetId: 'deliveryInvoicing',
            title: 'P2P_Sections_DELIVERYANDINVOICINGDETAILS',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'sdts/sdiw:deliveryInvoicing', // ModuleId/ComponentId:Resolver-Params <== In this case we used dataModelId
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 1,
                columnIndex: 0,
                isOptionalMenuEnabled: true,
                isShown: ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202"]
            },
            children: deliveryInvoicingFields
        },
        {
            widgetId: 'CustomAttributes',//<-- this is widgetId which we will be using later
            title: 'P2P_Sections_ADDITIONALINFO',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'custom-attributes-wrapper/caw:customAttributesHeader', // ModuleId/ComponentId:Resolver-Params <== In this case we used dataModelId
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 2,
                columnIndex: 0,
                isOptionalMenuEnabled: false,
                isShown: ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202"],
            },
            children: [],
            attachedConfig:{
                isEditable: ["0_1", "0_23", "0_24" , "0_121", "0_202"] 
            }
        },
        {
            widgetId: 'AdditionalAttributes',
            title: 'P2P_Sections_ADDITIONALATTRIBUTES',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'additional-attributes-wrapper/aaw:AdditionalAttributes', 
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 2,
                columnIndex: 0,
                isOptionalMenuEnabled: false
            },
            children: []
        },
        {
            widgetId: 'teamMembers',
            title: 'P2P_REQ_TeamMember_caps',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'teamMembers/tm',
            behaviour: {
                isVisible: false,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 7,
                columnIndex: 0,
                isOptionalMenuEnabled: true
            },
            children: []
        },
        {
            widgetId: 'NotesAndAttachments',
            title: 'P2P_REQ_NotesAndAttachments',
            type: WidgetTypesEnum.Standard,
            manifestPath: 'notes-and-attachments/na',
            behaviour: {
                isVisible: false,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 3,
                columnIndex: 0,
                isOptionalMenuEnabled: false
            },
            children: []
        }
    ]
}