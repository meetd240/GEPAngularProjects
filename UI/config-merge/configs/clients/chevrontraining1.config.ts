import { defaultManagerConfig } from '../default-manager.config';
import { mergeConfigs, stringify } from '../base/merge-configs.factory';
import { IWidgetsConfig, WidgetsManagerLayoutEnum, WidgetTypesEnum, ITextInput, IAutosuggestInput, AutosuggestInput, TextInput, BaseInput, IBaseInput, ICheckboxInput } from "../../smart-core-types";
import * as write from "write";
import * as path from "path";
import { DataModelNames } from '../../../src/modules/enums/sections.enum';
import { inputsFactory } from "../base/inputs.factory";
const chevrontraining1SpecificConfig = {
    managerId: 'default',
    layout: WidgetsManagerLayoutEnum.SingleColumn,
    behaviour: {
        enablePersistence: true,
    },
    widgets: [
        {
            widgetId: 'basicDetails',
            type: WidgetTypesEnum.Standard,
            children: [
                {
                    fieldId: 'buyerAssignee',
                    label: "P2P_Req_BuyerAssignee",
                    isVisible: true,
                    isMandatory: false,
                    behaviour: {
                        listIndex: 6
                    }
                } as IAutosuggestInput,
                
                {
                    fieldId: 'organization',
                    label: 'P2P_Req_Organization',
                    behaviour: {
                        listIndex: 7
                    },
                } as IAutosuggestInput,

                {
                    fieldId: 'onBehalfOf',
                    label: 'P2P_Req_OnBehalfOf',
                    behaviour: {
                        listIndex: 8
                    },
                    showLookup: {
                        isVisible: true
                    },
                } as IAutosuggestInput,

                {
                    fieldId: 'urgent',
                    label: 'P2P_Req_Urgent',
                    behaviour: {
                        listIndex: 9
                    }
                } as ICheckboxInput,

                {
                    fieldId: 'sourceSystem',
                    label: 'P2P_REQ_Source_System',
                    isVisible: false,
                    isClientEnabled: false
                } as {} as ITextInput,
            ]
        },
        {
            widgetId: "deliveryInvoicing",
            title: "P2P_Sections_DELIVERYANDINVOICINGDETAILS",
            type: WidgetTypesEnum.Standard,
            children: [
                {

                    fieldId: "DELIVERTOAUTOCOMPLETE",
                    label: "P2P_CMN_DeliverTo",
                    isVisible: false,
                } as IAutosuggestInput,
                {
                    fieldId: "DELIVERTOFREETEXT",
                    label: "P2P_CMN_DeliverTo",
                    isVisible: true,
                } as ITextInput
            ]
        },
        {
            widgetId: 'CustomAttributes',
            title: 'P2P_Sections_ADDITIONALINFO',
            type: WidgetTypesEnum.Standard,
            behaviour: {
                isOptionalMenuEnabled: false,
            }
        },
        {
            widgetId: 'NotesAndAttachments',
            title: 'P2P_REQ_NotesAndAttachments',
            type: WidgetTypesEnum.Standard,
            isClientEnabled: false,
            behaviour: {
                isVisible: false,
            }
        },
        {
            widgetId: 'LineDetails',
            title: 'P2P_Sections_LINEDETAILS',
            type: WidgetTypesEnum.Lines,
            manifestPath: 'lds/ldw',
            behaviour: {
                isVisible: true,
                isOptional: false,
                isCollapsible: true,
                isExpanded: true,
                isDraggable: true,
                isEagerlyLoaded: false,
                isSelected: false,
                listIndex: 6,
                columnIndex: 0,
                isOptionalMenuEnabled: true,
                isShown: ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_202"]
            },
            children: {
                "specificSettings": {
                    "getUserMappedEntitiesByObo": true,
                    "validateInternalCodeCombination": true,
                    "externalPaginationThreshold": 300,
                    "IsDefaultShippingMethod": "Best Available",
                    "allowGridPersistence": true,
                    "utilazationDocumentType": "Contract",
                    "enableDirtyCheck": false,
                    "disableOldGrid": false,
                    "enableNewManageApproval": true,
                    "enableNewAddLinesFromRequisitionPopup": true,
                    "columnDefTemplate": {
                        "field": "{{name}}",
                        "width": 150,
                        "displayName": "{{displayName}}",
                        "isVisible": true,
                        "isReadOnly": "p2pValidationService.isReadOnly",
                        "isRegFocusCol": true,
                        "uiType": "editable",
                        "isCustomError": true,
                        "isMandatory": "{{isMandatory}}",
                        "rules": [],
                        "attributes": {
                            "type": "autocomplete",
                            "model": "{{modelKey}}",
                            "filterkeys": ["EntityDisplayName", "EntityCode"],
                            "displayformat": "{{displayformat}}",
                            "optionformat": "{{optionformat}}",
                            "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202"],
                            "populateListOnFocus": true,
                            "minchars": 0
                        },
                        "filterObject": { "enableFiltering": true }
                    },
                    "columnDefLineTemplate": {
                        "field": "{{name}}",
                        "width": 150,
                        "displayName": "{{displayName}}",
                        "isVisible": true,
                        "isReadOnly": "p2pValidationService.isReadOnly",
                        "isRegUpdateCol": true,
                        "uiType": "editable",
                        "isCustomError": true,
                        "isMandatory": "{{isMandatory}}",
                        "rules": [],
                        "attributes": {
                            "model": "{{modelKey}}",
                            "filterkeys": [],
                            "displayformat": "{{displayformat}}",
                            "optionformat": "{{optionformat}}",
                            "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202"],
                            "populateListOnFocus": true,
                            "minchars": 0
                        },
                        "filterObject": { "enableFiltering": true }
                    },
                    "contractNumberValidationCheckOnSubmit": {
                        "key": false
                    },
                    "contractNumberType": {
                        "controlType": 3 //1--Auto suggest only,2--Free text only,3--	Auto suggest and free text 
                    },
                    "manageColumnsByPurchaseType":
                    {
                        "Service": ["buyerItemNumber.code", 'partnerItemNumber', 'OrderingStatus', 'inventory', 'needByDate', 'manufacturer', 'requestedDate'],
                        "Stock": ['startDate', 'endDate', 'OverallItemLimit'],
                        "Non Stock": ['startDate', 'endDate', 'OverallItemLimit'],
                    }
                },
                "header": {
                    "documentType": 7,
                    "MappingPurchaseTypeListForCharge": [],
                    "accountingSplitMode": 1,
                },
                "grid": [
                    {
                        "title": "P2P_Common_Lines",
                        "enableTranslation": true,
                        "isVisible": true,
                        "key": "Lines",
                        "gridActions": [
                            {
                                "title": "P2P_AddLinesFromContractButton",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3"],
                                "id": "contractLines",
                            },
                            {
                                "title": "P2P_Req_AddMultipleLines",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "add",
                            },
                            {
                                "title": "P2P_Req_Add_Lines_From",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": [],
                                "id": "addFrom",
                            },
                            {
                                "title": "P2P_Req_Managed_Column",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_202", "0_1_3", "0_202_3"],
                                "id": "manageColumns",
                            },
                            {
                                "title": "P2P_CMN_Delete",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "delete",
                            },
                            {
                                "title": "P2P_Req_Duplicate_Line",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "duplicate",
                            },
                            {
                                "title": "P2P_Req_CopyLineDetails",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "applyToAll",
                            },
                            {
                                "title": "P2P_Common_DownloadTemplate",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "downloadTemplate"
                            },
                            {
                                "title": "P2P_Common_UploadTemplate",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "uploadTemplate",
                            },
                            {
                                "title": "P2P_Common_ExportTemplate",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "exportTemplate",
                            },
                            {
                                "title": "P2P_Common_DownloadErrorLog",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "downLoadErrorLog",
                            },
                            {
                                "title": "Download_Master_Template",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "downloadMasterTemplate"
                            }
                        ],
                        "columnDefs": [
                            {
                                "field": "lineNumber",
                                "width": 75,
                                "displayName": "P2P_Req_LineNo_Riteaid",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "autoIncrement": true,
                                "Changereq": "Changereq",
                                "enableCellEdit": false,
                                "pinnedLeft": true,
                                "enableFiltering": false,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "lineReferenceNumber",
                                "width": 150,
                                "displayName": "P2P_Req_LineReferenceNumber",
                                "isFixed": "Left",
                                "isMandatory": false,
                                "isVisible": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "autoIncrement": false,
                                "uiType": "editable",
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "Changereq": "Changereq",
                                "attributes": {
                                    "isShown": ["0_1", "0_23", "0_24", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_121_10", "0_1_10", "0_78", "0_1_4", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_121_4", "1_121_4", "0_141", "0_141_4", "0_1_3", "0_23_3", "0_24_3", "0_202", "0_202_3"],
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "type.name",
                                "width": 150,
                                "displayName": "P2P_Req_LineType",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "dropdown",
                                "isRegUpdateCol": true,
                                "enableTranslation": true,
                                "rules": ["SourceTypeCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "model": "type",
                                    "dataKey": "name",
                                    "idKey": "id",
                                    "options": [
                                        {
                                            "id": 1,
                                            "name": "P2P_REQ_Material"
                                        },
                                        {
                                            "id": 2,
                                            "name": "P2P_REQ_FixedService"
                                        },
                                        {
                                            "id": 3,
                                            "name": "P2P_REQ_VarService"
                                        },
                                        {
                                            "id": 10,
                                            "name": "P2P_REQ_Expenses"
                                        },
                                        {
                                            "id": 9,
                                            "name": "P2P_REQ_ContingentWorker"
                                        }
                                    ]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "buyerItemNumber.code",
                                "width": 150,
                                "displayName": "P2P_Req_ItemNumber",
                                "isMandatory": false,
                                "isFreeText": false,
                                "isExternalValidationEnabled": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "filterkeys": ["code"],
                                    "displayformat": "{code}",
                                    "optionformat": "{code}:{partnerItemNumber}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "populateListOnFocus": true,
                                    "minchars": 0,
                                    "maxlength": 50,
                                    "showLookup": true,
                                    "disableSearchFilter": true
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "description.desc",
                                "width": 300,
                                "displayName": "P2P_Req_PartnerItemName",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isFreeText": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck", "emptyCheck"],
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "filterkeys": ["desc"],
                                    "displayformat": "{desc}",
                                    "optionformat": "{code}:{name}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "partner.name",
                                "width": 300,
                                "displayName": "P2P_Req_SupplierName",
                                "isMandatory": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck", "emptyCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "partner",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "populateListOnFocus": true,
                                    "showLookup": true,
                                    "minchars": 0,
                                    "disableSearchFilter": true
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "PriceType.name",
                                "width": 150,
                                "displayName": "P2P_Common_PriceType",
                                "uiType": "dropdown",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isMandatory": false,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "rules": ["expensesCheckDisable"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "dropdown",
                                    "model": "PriceType.name",
                                    "dataKey": "name",
                                    "idKey": "id",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3", "0_202_3"],
                                    "options": []
                                }
                            },
                            {
                                "field": "ContingentWorker.name",
                                "width": 150,
                                "displayName": "P2P_Common_ContingentWorkerName",
                                "uiType": "editable",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "isRegFocusCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "ContingentWorker.name",
                                    "filterkeys": ["name", "code"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}:{id}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3", "0_202_3"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                }
                            },
                            {
                                "field": "JobTitle.name",
                                "width": 150,
                                "displayName": "P2P_Common_JobTitle",
                                "uiType": "dropdown",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isMandatory": false,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "dropdown",
                                    "model": "JobTitle.name",
                                    "dataKey": "name",
                                    "idKey": "id",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3", "0_202_3"],
                                    "options": []
                                }
                            },
                            {
                                "field": "ReportingManager.name",
                                "width": 150,
                                "displayName": "P2P_Common_ReportingManagerName",
                                "uiType": "editable",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "isRegFocusCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "ReportingManager.name",
                                    "dataKey": "name",
                                    "filterkeys": ["name", "ContactCode"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}:{ContactCode}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3", "0_202_3"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },

                            {
                                "field": "orderingLocation.name",
                                "width": 300,
                                "displayName": "P2P_Req_OrderingLocation",
                                "isMandatory": false,
                                "uiType": "editable",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["emptyCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "orderingLocation",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "populateListOnFocus": true,
                                    "showLookup": true,
                                    "minchars": 0,
                                    "disableSearchFilter": true
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "partnerItemNumber",
                                "width": 150,
                                "displayName": "P2P_Req_PartnerItemNumber",
                                "isMandatory": false,
                                "isFreeText": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "filterkeys": ["partnerItemNumber"],
                                    "displayformat": "{partnerItemNumber}",
                                    "optionformat": "{code}:{partnerItemNumber}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    //     "populateListOnFocus": true,
                                    // "showLookup": true,
                                    // "minchars": 0,
                                    // "disableSearchFilter": true    
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                             {
                                "field": "supplierDispatchMode.name",
                                "width": 150,
                                "displayName": "P2P_CMN_DispatchMode",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "type": "popup",
                                "rules": [],
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "dispatchModePopup",
                                    "defaultTitle": "Select",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                               "field": "TransmissionValue",
                               "width": 150,
                               "displayName": "P2P_Req_DispatchModeValue",
                               "isVisible": true,
                               "isReadOnly": true,
                               "type": "editable",
                               "isRegFocusCol": true,
                               "data": "TransmissionValue",
                               "attributes": {
                                   "isEditable": []
                               },
                               "filterObject": {
                                   "enableFiltering": false
                               }
                           },
                            {
                                "field": "category.name",
                                "width": 150,
                                "displayName": "P2P_CMN_Category",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "popup",
                                "rules": ["variableTypeMandatory", "categoryDisableCheck", "emptyCheck"],
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "categoryPopup",
                                    "defaultTitle": "Select",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "quantity",
                                "width": 150,
                                "displayName": "P2P_Quantity_Riteaid",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["quantityFixedDisable", "uomQuantityRelation", "quantityNegativeCheck"],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"]
                                }
                            },
                            {
                                "field": "uom.name",
                                "width": 150,
                                "displayName": "P2P_CMN_UOM",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegFocusCol": true,
                                "uiType": "editable",
                                "rules": ["variableDisable", "emptyCheck", "SourceTypeCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "uom",
                                    "filterkeys": ["code", "name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "showLookup": true,
                                    "disableSearchFilter": true,
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "matching.name",
                                "displayName": "P2P_Req_Matching",
                                "width": 150,
                                "uiType": "dropdown",
                                "isMandatory": false,
                                "isVisible": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "enableTranslation": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "model": "matching",
                                    "dataKey": "name",
                                    "idKey": "id",
                                    "disable": "p2pValidationService.isReadOnly",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"]
                                }
                            },
                            {
                                "field": "startDate",
                                "width": 150,
                                "displayName": "P2P_Req_StartDate",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "startDateGreatedED"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"

                                }
                            },
                            {
                                "field": "endDate",
                                "width": 150,
                                "displayName": "P2P_Req_EndDate",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "endDateLessThanSD"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"
                                }
                            },
                            {
                                "field": "unitPrice",
                                "width": 150,
                                "displayName": "P2P_Req_UnitPrice",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["NumberFormatCheck", "unitPriceNegativeCheck", "SourceTypeCheck"],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"]
                                }
                            },
                            {
                                "field": "PricePer",
                                "width": 150,
                                "displayName": "P2P_PricePer",
                                "isVisible": false,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["NumberFormatCheck", "SourceTypeCheck", "pricePerQtyNegativeCheck"],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": [ 
                                    "0_1",
                                    "0_23",
                                    "0_24",
                                    "0_121",
                                    "0_1_3",
                                    "0_23_3",
                                    "0_24_3",
                                    "0_202"
                                    ]
                                }
                            },
                            {
                                "field": "PricePerQuantity",
                                "width": 150,
                                "displayName": "P2P_PricePerQuantity",
                                "isVisible": false,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["NumberFormatCheck", "SourceTypeCheck", "pricePerQtyNegativeCheck"],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                "type": "number",
                                "minValue": 0,
                                    "isEditable": [
                                    "0_1",
                                    "0_23",
                                    "0_24",
                                    "0_121",
                                    "0_1_3",
                                    "0_23_3",
                                    "0_24_3",
                                    "0_202"
                                    ]
                                }
                            },
                            {
                                "field": "AllowFlexiblePrice",
                                "width": 150,
                                "displayName": "P2P_Req_AllowFlexiblePrice",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": true,
                                "type": "editable",
                                "isRegFocusCol": true,
                                "data": "AllowFlexiblePrice",
                                "attributes": {
                                 "isEditable": []
                                },
                                "filterObject": {
                                 "enableFiltering": false
                                }
                            },
                            {
                                "field": "Margin",
                                "width": 150,
                                "displayName": "P2P_Common_Margin",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": [
                                    "NumberFormatCheck",
                                    "negativeCheck",
                                    "quantityUnitpriceBothNegative",
                                    "lessThan100Check"
                                ],
                                "isRegUpdateCol": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "minmaxprecision": "[2,4]",
                                    "minmaxprecisionfilter": "2:4",
                                    "model": "Margin",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3", "0_202_3"]
                                }
                            },
                            {
                                "field": "BaseRate",
                                "width": 150,
                                "displayName": "P2P_Common_BasedRate",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": [
                                    "NumberFormatCheck",
                                    "negativeCheck",
                                    "quantityUnitpriceBothNegative"
                                ],
                                "isRegUpdateCol": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "minmaxprecision": "[2,4]",
                                    "minmaxprecisionfilter": "2:4",
                                    "model": "BaseRate",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3", "0_202_3"]
                                }
                            },
                            {
                                "field": "OrderingStatus",
                                "width": 150,
                                "displayName": "P2P_Req_OrderingStatus",
                                "isMandatory": false,
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isReadOnly": true,
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "OrderingStatus",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isShown": ["0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3"],
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "subTotal",
                                "width": 150,
                                "displayName": "P2P_Req_SubTotal",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": true,
                                "uiType": "calculated",
                                "rules": ["grayOutDisabled"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "rule": "(parseFloat(row.entity.unitPrice) * parseFloat(row.entity.quantity))",
                                    "isEditable": []
                                }
                            },
                            {
                                "field": "AllowAdvances.name",
                                "width": 150,
                                "displayName": "P2P_Req_AllowAdvances",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "dropdown",
                                "isRegUpdateCol": true,
                                "rules": ["allowAdvanceDisableOnNegativeTotal"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": [
                                        "0_1",
                                        "0_23",
                                        "0_24" , "0_121",
                                        "0_202",
                                        "0_1_3",
                                        "0_202_3"
                                    ],
                                    "model": "AllowAdvances",
                                    "dataKey": "name",
                                    "idKey": "id",
                                    "options": [
                                        {
                                            "id": 0,
                                            "name": "notificationButtonNo"
                                        },
                                        {
                                            "id": 1,
                                            "name": "notificationButtonYes"
                                        }
                                    ]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "AdvancePercentage",
                                "width": 150,
                                "displayName": "P2P_Req_AdvancePercentage",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": [
                                    "advanceFieldsDisableCheck", "advancePercentageValidationCheck"
                                ],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "maxValue": 100,
                                    "isEditable": [
                                        "0_1",
                                        "0_23",
                                        "0_24" , "0_121",
                                        "0_202",
                                        "0_1_3",
                                        "0_202_3"
                                    ]
                                }
                            },
                            {
                                "field": "AdvanceAmount",
                                "width": 150,
                                "displayName": "P2P_Req_AdvanceAmount",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": [
                                    "advanceFieldsDisableCheck", "advanceAmountValidationCheck"
                                ],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": [
                                        "0_1",
                                        "0_23",
                                        "0_24" , "0_121",
                                        "0_202",
                                        "0_1_3",
                                        "0_202_3"
                                    ]
                                }
                            },
                            {
                                "field": "AdvanceReleaseDate",
                                "width": 150,
                                "displayName": "P2P_Req_AdvanceReleaseDate",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": [
                                    "advanceFieldsDisableCheck", "advanceDateEmptyCheck", "AdvanceDateMinValue"
                                ],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": [
                                        "0_1",
                                        "0_23",
                                        "0_24" , "0_121",
                                        "0_202",
                                        "0_1_3",
                                        "0_202_3"
                                    ],
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"
                                }
                            },
                            {
                                "field": "TaxCode.code",
                                "width": 150,
                                "displayName": "CMN_TaxCode",
                                "uiType": "dropdown",
                                "isVisible": false,
                                "isMandatory": false,
                                "isReadOnly": 'p2pValidationService.isReadOnly',
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "taxesPopup",
                                    "model": "TaxCode",
                                    "dataKey": "displayName",
                                    "options": [],
                                    "idKey": "id",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202", "0_202_3"]
                                }
                            },
                            {
                                "field": "TaxCode.percent",
                                "width": 150,
                                "displayName": "CMN_TaxRate",
                                "isVisible": false,
                                "isMandatory": false,
                                "isReadOnly": true,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "taxesPopup",
                                    "model": "TaxCode",
                                    "isEditable": []
                                }
                            },
                            {
                                "field": "taxes",
                                "width": 150,
                                "displayName": "P2P_Req_Taxes",
                                "uiType": "popup",
                                "isVisible": false,
                                "isMandatory": false,
                                "isReadOnly": false,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "rules": ["catalogTaxesCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "taxesPopup",
                                    "defaultLabelCondition": "row.entity.isTaxExempt?\"Exempt\":row.entity.taxes",
                                    "defaultTitle": "0"
                                }
                            },
                            {
                                "field": "total",
                                "width": 150,
                                "displayName": "P2P_Req_LineTotal",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "calculated",
                                "rules": ["grayOutDisabled"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "rule": "(((isNaN(parseFloat(row.entity.unitPrice)) ? 0 :parseFloat(row.entity.unitPrice)) * (isNaN(parseFloat(row.entity.quantity)) ? 0 :parseFloat(row.entity.quantity)))) + (isNaN(parseFloat(row.entity.taxes)) ? 0 : parseFloat(row.entity.taxes)) + (isNaN(parseFloat(row.entity.otherCharges)) ? 0 : parseFloat(row.entity.otherCharges)) + (isNaN(parseFloat(row.entity.shippingCharges)) ? 0 : parseFloat(row.entity.shippingCharges))",
                                    "isEditable": []
                                }
                            },
                            {
                                "field": "currency.CurrencyCode",
                                "width": 150,
                                "displayName": "PFM_Currency",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegFocusCol": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["emptyCheck", "SourceTypeCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "currency",
                                    "filterkeys": ["CurrencyCode"],
                                    "displayformat": "{CurrencyCode}",
                                    "optionformat": "{CurrencyCode}-{CurrencyName}",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "inventory",
                                "width": 150,
                                "displayName": "P2P_Req_InventoryType",
                                "isMandatory": false,
                                "isVisible": false,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "text",
                                    "isEditable": []
                                }
                            },
                            {
                                "field": "requestedDate",
                                "width": 150,
                                "displayName": "P2P_Req_RequestedDate",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
                                "rules": ["variableDisable", "grayOutDisabled"],
                                "attributes": {
                                    "disable": true,
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": []
                                }
                            },
                            {
                                "field": "needByDate",
                                "width": 150,
                                "displayName": "P2P_Req_NeedByDate",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "isRegUpdateCol": true,
                                "rules": ["variableDisable", "needbydateCheck", "needbydateLTRDCheck", "emptyCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "date",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "format": "MM/dd/yyyy",
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "shipTo.name",
                                "width": 150,
                                "displayName": "P2P_CMN_ShipTo",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["emptyCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isShippingChanges": true,
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "type": "autocomplete",
                                    "model": "shipTo",
                                    "filterkeys": ["name", "address"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}",
                                    "populateListOnFocus": true,
                                    "minchars": 0,
                                    "showLookup": true,
                                    "disableSearchFilter": true
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true,
                                "uiType": "editable",
                            },
                            {
                                "field": "shipTo.address",
                                "width": 150,
                                "displayName": "P2P_Req_ShipToAddress",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "rules": ["emptyCheck", "grayOutDisabled"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "uiType": "editable"
                            },
                            {
                                "field": "TaxJurisdiction",
                                "width": 150,
                                "displayName": "P2P_TaxJurisdiction",
                                "isMandatory": false,
                                "isVisible": false,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "data": "TaxJurisdiction",
                                "rules": [],
                                "attributes": {
                                    "maxlength": 100
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "contractNumber",
                                "width": 150,
                                "displayName": "P2P_Req_ContractNumber",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "contractNumber",
                                "rules": ["contractNumberInternalItemEditableCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "type": "autocomplete",
                                    "filterkeys": ["contractNumber", "contractName"],
                                    "optionformat": "{contractNumber}-{contractName}",
                                    "displayformat": "{contractNumber}",
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "contractName",
                                "width": 150,
                                "displayName": "P2P_Req_ContractName",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "contractNumber",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "contractValue",
                                "width": 150,
                                "displayName": "P2P_Req_ContractValue",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "isEditable": []
                                }
                            },
                            {
                                "field": "deliverToStr",
                                "width": 150,
                                "displayName": "P2P_CMN_DeliverTo",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "deliverToStr",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "deliverTo.address",
                                "width": 150,
                                "displayName": "p2p_deliverToAddress",
                                "isVisible": true,
                                "isReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true,
                                "uiType": "editable"
                            },
                            {
                                "field": "manufacturer",
                                "width": 150,
                                "displayName": "P2P_Req_Manufacturer_Details",
                                "isMandatory": false,
                                "uiType": "popup",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["ManufacturerCheckDisable"],
                                "appendedLabels": ["manufacturer", "manufacturerPartNumber", "ManufacturerModel"],
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "manufacturerPopup",
                                    "defaultTitle": "ADD",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "contractExpiryDate",
                                "width": 150,
                                "displayName": "P2P_Req_ContractExpiryDate",
                                "isMandatory": false,
                                "isVisible": false,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": false
                                }
                            },
                            {
                                "field": "ContractItems.name",
                                "width": 150,
                                "displayName": "P2P_Req_Contractitems",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                //"rules": ["ContractSourceTypeCheck", "ContractItemDisableCheck", "emptyCheck"],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                    "type": "autocomplete",
                                    "model": "ContractItems",
                                    "filterkeys": ["name"],
                                    "optionformat": "{name}",
                                    "displayformat": "{name}",
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true,
                                "uiType": "editable"
                            },
                            {
                                "field": "comments",
                                "width": 150,
                                "displayName": "P2P_Common_Comments",
                                "uiType": "popup",
                                "isVisible": true,
                                "isReadOnly": false,
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "commentsAndAttachmentsPopup",
                                    "defaultLabelCondition": 'row.entity.notes && row.entity.notes.length > 0 ? "View" : "Add"',
                                }
                            },
                            {
                                "field": "customAttributes",
                                "width": 170,
                                "displayName": "P2P_Req_AdditionalInfo",
                                "uiType": "popup",
                                "isVisible": true,
                                "isReadOnly": false,
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "customAttributesPopup",
                                    "defaultTitle": "view"
                                }
                            },
                            {
                                "field": "source.name",
                                "width": 150,
                                "displayName": "P2P_REQ_ItemSource",
                                "isFixed": "Left",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "textfield",
                                "enableTranslation": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "model": "source",
                                    "dataKey": "name"
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "RFXDetails.documentnumber",
                                "width": 150,
                                "displayName": "P2P_RFXLINK",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "textfield",
                                "enableTranslation": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "model": "RFXDetails",
                                    "dataKey": "documentnumber"
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "OrderLink",
                                "width": 100,
                                "displayName": "P2P_REQ_OrderLink",
                                "uiType": "popup",
                                "isVisible": true,
                                "isReadOnly": false,
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "linkToOrderPopup",
                                    "defaultLabelCondition": "View"
                                }
                            },

                        ]
                    },
                    {
                        "title": "P2P_Common_Accounting",
                        "enableTranslation": true,
                        "isVisible": true,
                        "modelKey": "splits",
                        "key": "Accounting",
                        "gridAccountingActions": [
                            {
                                "title": "P2P_Req_EditMultipleLines",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "applyToAll",
                            },
                            {
                                "title": "P2P_Req_Managed_Column",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_202", "0_1_3", "0_202_3"],
                                "id": "manageColumns",
                            },
                            {
                                "title": "P2P_CMN_Delete",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                "id": "delete",
                            }
                        ],
                        "columnDefs": [
                            {
                                "field": "splitIndex",
                                "width": 150,
                                "displayName": "Index",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isVisible": false,
                                "isReadOnly": true,
                                "_treeHeaderReadOnly": true,
                                "autoIncrement": true,
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "lineNumber",
                                "width": 75,
                                "displayName": "P2P_Req_LineNo",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "_treeHeaderReadOnly": true,
                                "isVisible": true,
                                "Changereq": "Changereq",
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "autoIncrement": false,
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isTree": true
                            },
                            {
                                "field": "lineReferenceNumber",
                                "width": 150,
                                "displayName": "P2P_Req_LineReferenceNumber",
                                "isFixed": "Left",
                                "isMandatory": false,
                                "_treeHeaderReadOnly": true,
                                "isVisible": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "autoIncrement": false,
                                "uiType": "editable",
                                "Changereq": "Changereq",
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isShown": ["0_1", "0_23", "0_24", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_121_10", "0_1_10", "0_78", "0_1_4", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_121_4", "1_121_4", "0_141", "0_141_4", "0_1_3", "0_23_3", "0_24_3", "0_202", "0_202_3"],
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isTree": true
                            },
                            {
                                "field": "description.desc",
                                "width": 400,
                                "displayName": "P2P_Req_PartnerItemName",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "_treeHeaderReadOnly": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3"],
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "splitNumber",
                                "width": 150,
                                "displayName": "P2P_Req_SplitNumber",
                                "isVisible": true,
                                "isReadOnly": true,
                                "isMandatory": false,
                                "_treeHeaderReadOnly": true,
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3"],
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "splitType",
                                "width": 150,
                                "displayName": "split",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegClickCol": true,
                                "isMandatory": true,
                                "_treeHeaderReadOnly": true,
                                "uiType": "popup",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isFixed": "Left",
                                "attributes": {
                                    "type": "splitsPopup",
                                    "defaultLabelCondition": "row.entity.splitType===0?(row.entity.type.id===1?\"Quantity\":\"Amount\"):\"Percentage\"",
                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_202", "0_1_3", "0_202_3"],
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "Splitquantity",
                                "width": 150,
                                "displayName": "quantity",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "_treeHeaderReadOnly": true,
                                "rules": [],
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "splitValue",
                                "width": 150,
                                "displayName": "P2P_Req_SplitValue",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "_treeHeaderReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "Splittax",
                                "width": 150,
                                "displayName": "P2P_Req_Taxes",
                                "_treeHeaderReadOnly": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "attributes": {
                                    "type": "number",
                                    "isEditable": []
                                },
                                "pinnedLeft": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "splitItemTotal",
                                "width": 150,
                                "_treeHeaderReadOnly": true,
                                "displayName": "P2P_Req_TotalSplitValue",
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "number",
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isVisible": true,
                                "isReadOnly": true
                            },
                            {
                                "field": "requester.name",
                                "width": 150,
                                "_treeHeaderReadOnly": true,
                                "displayName": "P2P_REQ_Requester",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegFocusCol": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "requester",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}",
                                    "isEditable": ["0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "period.name",
                                "width": 150,
                                "displayName": "P2P_REQ_Period",
                                "isVisible": true,
                                "isReadOnly": true,
                                "isRegFocusCol": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "period",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}",
                                    "isEditable": []
                                },
                                "filterObject": { "enableFiltering": true }
                            }
                        ]
                    }
                ]
            }
        },
    ]
} as IWidgetsConfig;



const mergedConfig = mergeConfigs(defaultManagerConfig, chevrontraining1SpecificConfig);

export default mergedConfig;

const scriptName = path.basename(__filename);
const fullPath = path.join('./merged', scriptName);
write.sync(fullPath, stringify(mergedConfig, `clientConfig`));



