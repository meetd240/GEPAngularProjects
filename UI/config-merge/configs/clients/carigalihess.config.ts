import { defaultManagerConfig } from '../default-manager.config';
import { mergeConfigs, stringify } from '../base/merge-configs.factory';
import { IWidgetsConfig, WidgetsManagerLayoutEnum, WidgetTypesEnum, ITextInput, IAutosuggestInput, ICheckboxInput, customInput, BaseInput, IBaseInput, inputsFactory, AutosuggestInput, TextInput, ISelectInput } from "../../smart-core-types";
import * as write from "write";
import * as path from "path";
import { DataModelNames } from '../../../src/modules/enums/sections.enum';
const carigalihessSpecificConfig = {
    managerId: 'default',
    layout: WidgetsManagerLayoutEnum.SingleColumn,
    behaviour: {
        enablePersistence: true,
    },
    widgets: [
        {
            widgetId: 'basicDetails',
            title: 'P2P_Sections_BasicDetails',
            type: WidgetTypesEnum.Standard,
            children: [

                {
                    fieldId: 'organization',
                    label: 'P2P_Req_Organization',
                    isVisible: true,
                    behaviour: {
                        listIndex: 6
                    },
                } as IAutosuggestInput,
                {
                    fieldId: 'onBehalfOf',
                    label: 'P2P_Req_OnBehalfOf',
                    behaviour: {
                        listIndex: 7
                    },
                } as IAutosuggestInput,
                {
                    fieldId: 'sourceSystem',
                    label: 'P2P_REQ_Source_System',
                    isMandatory: false,
                    isVisible: false,
		    isClientEnabled: false,
                    behaviour: {
                        listIndex: 8
                    },
                } as ITextInput,
                {
                    fieldId: 'urgent',
                    label: 'P2P_Req_Urgent',
                    behaviour: {
                        listIndex: 9
                    },
                } as ICheckboxInput,

            ]
        },
        {
            widgetId: 'NotesAndAttachments',
            title: 'P2P_REQ_NotesAndAttachments',
            type: WidgetTypesEnum.Standard,
            isClientEnabled: true,
            behaviour: {
                isVisible: true,
            }
        },
        {
            widgetId: 'CustomAttributes',
            title: 'P2P_Sections_ADDITIONALINFO',
            isClientEnabled: false,
            type: WidgetTypesEnum.Standard,
            behaviour: {
                isOptionalMenuEnabled: false,
            }
        },
        {
            widgetId: "deliveryInvoicing",
            title: "P2P_Sections_DELIVERYANDINVOICINGDETAILS",
            type: WidgetTypesEnum.Standard,
            children: [
                inputsFactory<BaseInput, IBaseInput>({
                    fieldId: 'BILLTOSUBSECTION',
                    label: 'P2P_CMN_BillTo',
                    dataModelId: DataModelNames.DELIVERYINVOICING,
                    data: 'billTo',
                    type: 'custom',
                    isMandatory: false,
                    isVisible: true,
                    manifestPath: 'DI-billTo/billTo',
                    attributes: {
                        disable: false,

                    },
                    behaviour: {
                        listIndex: 2,
                        rowIndex: 0,
                        colspan: 5
                    },
                    attachedConfig: {
                        childConfig: [
                            inputsFactory<AutosuggestInput, IAutosuggestInput>({
                                fieldId: 'BillTo',
                                label: 'P2P_Common_BillTo',
                                dataModelId: DataModelNames.DELIVERYINVOICING,
                                data: 'billTo',
                                type: 'autosuggest',
                                isMandatory: true,
                                isVisible: true,
                                manifestPath: 'embedded-autosuggest/autosuggest',
                                attributes: {
                                    // filterkeys: ['name'],
                                    optionformat: '{name}',
                                    displayformat: '{name}',
                                    options: [],
                                    disable: false
                                    //   lookupConfig: {
                                    //   showLookup: true,
                                    //   filterkey: ['name'],
                                    //   titleofmodel: "shipToLookUp",
                                    //   desckey: "name"
                                    // }
                                },
                                behaviour: {
                                    listIndex: 0,
                                    rowIndex: 0,
                                    colspan: 2,
                                    isConfigEditable: false
                                },
                                events: {
                                    change: 'billTo_OnChange',
                                    onShowLookupClick: 'onShowLookupClick'
                                },
                                showLookup: {
                                    isVisible: true
                                },
                            }),
                            inputsFactory<TextInput, ITextInput>({
                                fieldId: 'BillToAddress',
                                label: 'P2P_Common_BilltoAddress',
                                dataModelId: DataModelNames.DELIVERYINVOICING,
                                data: 'billTo.address',
                                type: 'text',
                                manifestPath: 'embedded-text/text',
                                attributes: {
                                    disable: true
                                },
                                behaviour: {
                                    listIndex: 1,
                                    rowIndex: 0,
                                    colspan: 2,
                                    isConfigEditable: false
                                }
                            }),
                            inputsFactory<TextInput, ITextInput>({
                                fieldId: 'ContactEmailPhone',
                                label: 'P2P_Common_ContactEmail',
                                dataModelId: DataModelNames.DELIVERYINVOICING,
                                data: 'billTo.contact',
                                type: 'text',
                                isMandatory: false,
                                manifestPath: 'embedded-text/text',
                                attributes: {
                                    disable: true
                                },
                                behaviour: {
                                    listIndex: 2,
                                    rowIndex: 0,
                                    colspan: 1,
                                    isConfigEditable: false
                                }
                            })
                        ]
                    }
                }),
                {
                    fieldId: 'DELIVERTOAUTOCOMPLETE',
                    isVisible: false,

                } as IAutosuggestInput,
                {
                    fieldId: 'DELIVERTOFREETEXT',
                    isVisible: true,

                } as ITextInput
            ]

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
                isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"]
            },
            children: {
                "specificSettings": {

                    "validateInternalCodeCombination": false,
                    "externalPaginationThreshold": 300,
                    "IsDefaultShippingMethod": "Best Available",
                    "disableOldGrid": false,
                    "allowGridPersistence": false,
                    "enableSuppliersAutoSuggestAPI": true,
                    "enableNewManageApproval": true,
                    "columnDefHeaderTemplate": {
                        "label": "{{fieldName}}",
                        "type": "textfield",
                        "isMandatory": true,
                        "isVisible": true,
                        "data": "{{ReqData}}",
                        "onChange": "HeaderEntity_OnChange($event,'{{headerKey}}')",
                        "onSelect": "HeaderEntity_OnSelect($event,'{{headerKey}}')",
                        "onFocus": "HeaderEntity_OnFocus($event)",
                        "onBlur": "HeaderEntity_OnBlur($event,'{{headerKey}}')",
                        "IsAccountingEntity": "{{IsAccountingEntity}}",
                        "attributes": {
                            "disable": "p2pValidationService.isReadOnly",
                            "validateOn": "change",
                            "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56"],
                            "isEditable": ["0_1", "0_23", "0_24", "0_121"],
                            "type": "autocomplete",
                            "filterkeys": ["EntityDisplayName", "EntityCode"],
                            "optionformat": "{EntityCode}-{EntityDisplayName}",
                            "displayformat": "{EntityCode}-{EntityDisplayName}",
                            "options": []
                        }
                    },

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

                            "isEditable": ["0_1", "0_23", "0_24", "0_121"],

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
                            "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
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
                                "title": "P2P_Req_AddMultipleLines",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "add"
                            },
                            {
                                "title": "P2P_Req_Add_Lines_From",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "addFrom"
                            },
                            {
                                "title": "P2P_Req_Managed_Column",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_202"],
                                "id": "manageColumns"
                            },
                            {
                                "title": "P2P_CMN_Delete",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "delete"
                            },
                            {
                                "title": "P2P_Req_Duplicate_Line",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "duplicate"
                            },
                            {
                                "title": "P2P_Req_CopyLineDetails",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "applyToAll"
                            },
                            {
                                "title": "P2P_Common_DownloadTemplate",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downloadTemplate"
                            },
                            {
                                "title": "P2P_Common_UploadTemplate",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "uploadTemplate"
                            },
                            {
                                "title": "P2P_Common_ExportTemplate",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "exportTemplate"
                            },
                            {
                                "title": "DP2P_Common_DownloadErrorLog",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downLoadErrorLog"
                            },
                            {
                                "title": "P2P_Common_ShowFilters",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],
                                "id": "showFilters"
                            },
                            {
                                "title": "P2P_Common_HideFilters",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],
                                "id": "hideFilters"
                            },
                            {
                                "title": "Download_Master_Template",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downloadMasterTemplate"
                            } 
                        ],

                        "columnDefs": [
                            {
                                "field": "lineNumber",
                                "width": 150,
                                "displayName": "P2P_Req_LineNo_Riteaid",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "autoIncrement": true,
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
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "Changereq": "Changereq",
                                "attributes": {
                                    "isShown": ["0_1", "0_23", "0_24", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_121_10", "0_1_10", "0_78", "0_1_4", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_121_4", "1_121_4", "0_141", "0_141_4", "0_1_3", "0_23_3", "0_24_3", "0_202"],
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["SourceTypeCheck"],
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "model": "type",
                                    "dataKey": "name",
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
                                "isFreeText": true,
                                "isExternalValidationEnabled": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "buyerItemNumber",
                                    "filterkeys": ["code"],
                                    "displayformat": "{code}",
                                    "optionformat": "{code}:{name}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0,
                                    "maxlength": 50
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "description.desc",
                                "width": 150,
                                "displayName": "P2P_Req_PartnerItemName",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isFreeText": true,
                                "uiType": "editable",
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck", "emptyCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "description",
                                    "filterkeys": ["desc"],
                                    "maxlength": 1000,
                                    "displayformat": "{desc}",
                                    "optionformat": "{code}:{name}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "partner.name",
                                "width": 150,
                                "displayName": "P2P_Req_SupplierName",
                                "isMandatory": false,
                                "uiType": "editable",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "partner",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "rules": ["expensesCheckDisable"],
                                "attributes": {
                                    "type": "dropdown",
                                    "model": "PriceType.name",
                                    "dataKey": "name",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3"],

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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "isRegFocusCol": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "ContingentWorker.name",
                                    "filterkeys": ["name", "code"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}:{id}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3"],
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isMandatory": false,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "attributes": {
                                    "type": "dropdown",
                                    "model": "JobTitle.name",
                                    "dataKey": "name",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3"],
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "isRegFocusCol": true,
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "ReportingManager.name",
                                    "dataKey": "name",
                                    "filterkeys": ["name", "ContactCode"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}:{ContactCode}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },

                            {
                                "field": "orderingLocation.name",
                                "width": 150,
                                "displayName": "P2P_Req_OrderingLocation",
                                "isMandatory": false,
                                "uiType": "editable",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": [],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "orderingLocation",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "orderingLocationAdress",
                                "width": 150,
                                "displayName": "P2P_Req_OrderingLocAddress",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "orderingLocationAdress",
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "partnerContact.name",
                                "width": 150,
                                "displayName": "P2P_Req_SupplierContact",
                                "isMandatory": false,
                                "uiType": "editable",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": [],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "partnerContact",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{id}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {
                                "field": "partnerContactEmail",
                                "width": 150,
                                "displayName": "P2P_Req_ContactEmail",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegFocusCol": true,
                                "data": "partnerContactEmail",
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "partnerContactNumber",
                                "width": 150,
                                "displayName": "P2P_Req_ContactNumber",
                                "isVisible": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegFocusCol": true,
                                "data": "partnerContactNumber",
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "supplierDispatchMode.name",
                                "width": 150,
                                "displayName": "P2P_CMN_DispatchMode",
                                "isMandatory": false,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "popup",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": [],
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "dispatchModePopup",
                                    "defaultTitle": "Select",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },

                            {
                                "field": "partnerItemNumber",
                                "width": 150,
                                "displayName": "P2P_Req_PartnerItemNumber",
                                "isMandatory": false,
                                "isFreeText": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "partnerItemNumber",
                                    "filterkeys": ["partnerItemNumber"],
                                    "displayformat": "{partnerItemNumber}",
                                    "optionformat": "{code}:{partnerItemNumber}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
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
                                "uiType": "popup",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": [],
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "dispatchModePopup",
                                    "defaultTitle": "Select",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "matching.name",
                                "displayName": "P2P_Req_Matching",
                                "width": 150,
                                "uiType": "dropdown",
                                "isMandatory": false,
                                "isVisible": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "enableTranslation": true,
                                "attributes": {
                                    "model": "matching",
                                    "dataKey": "name",
                                    "disable": "p2pValidationService.isReadOnly",
                                    "isShown": ["0_1", "0_23", "0_24", "0_121", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_121_10", "0_1_10", "0_78", "0_1_4", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_121_4", "1_121_4", "0_141", "0_141_4", "0_202"],
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_1_3", "0_23_3", "0_24_3", "0_59", "0_169", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_202"]
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["variableTypeMandatory", "categoryDisableCheck", "emptyCheck"],
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "categoryPopup",
                                    "defaultTitle": "Select",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["quantityFixedDisable", "uomQuantityRelation", "quantityNegativeCheck"],
                                "isRegUpdateCol": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                }
                            },
                            {
                                "field": "uom.name",
                                "width": 150,
                                "displayName": "P2P_CMN_UOM",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "isRegFocusCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
                                "rules": ["variableDisable", "emptyCheck", "SourceTypeCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "uom",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "startDate",
                                "width": 150,
                                "displayName": "P2P_Req_StartDate",
                                "isMandatory": true,
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "startDateGreatedED"],
                                "attributes": {
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"

                                }
                            },
                            {
                                "field": "endDate",
                                "width": 150,
                                "displayName": "P2P_Req_EndDate",
                                "isMandatory": true,
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "endDateLessThanSD"],
                                "attributes": {
                                    "type": "date",
                                    "format": "MM/dd/yyyy",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"
                                }
                            },
                            {
                                "field": "unitPrice",
                                "width": 150,
                                "displayName": "P2P_Req_UnitPrice",
                                "isVisible": true,
                                "isMandatory": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "rules": ["NumberFormatCheck", "quantityNegativeCheck", "SourceTypeCheck"],
                                "isRegUpdateCol": true,
                                "attributes": {
                                    "type": "number",
                                    "minValue": 0,
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
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
                                    "model": "Margin",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3"]

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
                                    "model": "BaseRate",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202", "0_59", "0_169", "0_1_4", "1_1_6", "0_1_5", "0_25_10", "0_41_10", "0_1_10", "0_169_4", "0_169_5", "0_1_3"]

                                }
                            },
                            {
                                "field": "OrderingStatus",
                                "width": 150,
                                "displayName": "P2P_Req_OrderingStatus",
                                "isMandatory": false,
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "OrderingStatus",
                                "attributes": {
                                    "isShown": ["0_21", "0_22", "0_62", "0_61", "0_254", "0_56"],
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "calculated",
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
                                  "0_24", "0_121",
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
                                    "advanceFieldsDisableCheck","advancePercentageValidationCheck"
                                ],
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                 "type": "number",
                                 "minValue": 0,
                                 "maxValue":100,
                                 "isEditable": [
                                  "0_1",
                                  "0_23",
                                  "0_24", "0_121",
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
                                    "advanceFieldsDisableCheck","advanceAmountValidationCheck"
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
                                  "0_24", "0_121",
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
                                  "0_24", "0_121",
                                  "0_202",
                                  "0_1_3",
                                  "0_202_3"
                                 ],
                                 "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"
                                }
                            },
                            {
                                "field": "taxes",
                                "width": 150,
                                "displayName": "P2P_Req_Taxes",
                                "uiType": "popup",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegClickCol": true,
                                "isRegUpdateCol": true,
                                "rules": ["catalogTaxesCheck"],
                                "attributes": {
                                    "type": "taxesPopup",
                                    "defaultLabelCondition": "row.entity.isTaxExempt?\"Exempt\":row.entity.taxes",
                                    "defaultTitle": "0"
                                }
                            },
                            {
                                "field": "otherCharges",
                                "width": 150,
                                "displayName": "P2P_Req_OtherCharges",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegUpdateCol": true,
                                "_readonlyForCharge": true,
                                "attributes": {
                                    "type": "number",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                }
                            },
                            {
                                "field": "shippingCharges",
                                "width": 150,
                                "displayName": "P2P_Req_ShippingCharges",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "_readonlyForCharge": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["variableDisable"],
                                "uiType": "editable",
                                "isRegUpdateCol": true,
                                "attributes": {
                                    "type": "number",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                }
                            },
                            {
                                "field": "total",
                                "width": 150,
                                "displayName": "P2P_Req_LineTotal",
                                "isVisible": true,
                                "isReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "calculated",
                                "attributes": {
                                    "rule": "(((isNaN(parseFloat(row.entity.unitPrice)) ? 0 :parseFloat(row.entity.unitPrice)) * (isNaN(parseFloat(row.entity.quantity)) ? 0 :parseFloat(row.entity.quantity)))) + (isNaN(parseFloat(row.entity.taxes)) ? 0 : parseFloat(row.entity.taxes)) + (isNaN(parseFloat(row.entity.otherCharges)) ? 0 : parseFloat(row.entity.otherCharges)) + (isNaN(parseFloat(row.entity.shippingCharges)) ? 0 : parseFloat(row.entity.shippingCharges))"
                                }
                            },
			    {
                                "field": "ConversionFactor",           
                                "width": 150,            
                                "displayName": "P2P_Req_LineTotal",            
                                "isVisible": true,           
                                "isReadOnly": true,            
                                "uiType": "calculated",            
                                "rules": ["grayOutDisabled"],
                                "enableCellEdit": true,
                                "enableFiltering": true,            
                                "attributes": {           
                                    "isEditable": [],           
                                    "rule": "((((isNaN(parseFloat(row.entity.unitPrice)) ? 0 :parseFloat(row.entity.unitPrice)) * (isNaN(parseFloat(row.entity.quantity)) ? 0 :parseFloat(row.entity.quantity)))) + (isNaN(parseFloat(row.entity.taxes)) ? 0 : parseFloat(row.entity.taxes)) + (isNaN(parseFloat(row.entity.otherCharges)) ? 0 : parseFloat(row.entity.otherCharges)) + (isNaN(parseFloat(row.entity.shippingCharges)) ? 0 : parseFloat(row.entity.shippingCharges))) * (isNaN(parseFloat(row.entity.ConversionFactor)) ? 0 : parseFloat(row.entity.ConversionFactor))"            
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
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "SentForBidding",
                                "width": 150,
                                "displayName": "P2P_SendForBidding",
                                "isVisible": false,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "data": "SentForBidding",
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "inventory",
                                "width": 150,
                                "displayName": "P2P_Req_InventoryType",
                                "isMandatory": false,
                                "isVisible": false,
                                "isReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
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
                                "rules": ["variableDisable", "materialCheckDisable"],
                                "attributes": {
                                    "disable": true,
                                    "type": "date",
                                    "format": "MM/dd/yyyy"
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["variableDisable", "needbydateCheck", "needbydateLTRDCheck", "emptyCheck"],
                                "attributes": {
                                    "type": "date",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "format": "MM/dd/yyyy",
                                    "min": "new Date()"
                                },
                                "isMandatory": true
                            },
                            {
                                "field": "shippingMethod.name",
                                "width": 150,
                                "displayName": "P2P_Req_ShippingMethod",
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "dropdown",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["variableDisable"],
                                "attributes": {
                                    "model": "shippingMethod",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "idKey": "id",
                                    "dataKey": "name",
                                    "options": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "shipTo.name",
                                "width": 150,
                                "displayName": "P2P_CMN_ShipTo",
                                "isMandatory": true,
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["emptyCheck"],
                                "attributes": {
                                    "isShippingChanges": true,
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "type": "autocomplete",
                                    "model": "shipTo",
                                    "filterkeys": ["name", "address"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}",
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
                                "field": "shipTo.address",
                                "width": 150,
                                "displayName": "P2P_Req_ShipToAddress",
                                "isMandatory": true,
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": true,
                                "rules": ["emptyCheck"],
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "uiType": "editable"
                            },
                            {
                                "field": "deliverToStr",
                                "width": 150,
                                "displayName": "P2P_CMN_DeliverTo",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": false,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegFocusCol": true,
                                "data": "deliverToStr",
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                "field": "isProcurable.name",
                                "width": 150,
                                "displayName": "P2P_Req_ProcumentOption",
                                "isMandatory": false,
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "dropdown",
                                "isRegUpdateCol": true,
                                "enableTranslation": true,
                                "rules": ["emptyCheck"],
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "model": "isProcurable",
                                    "dataKey": "name",
                                    "options": [{
                                        "id": 0,
                                        "name": "P2P_Req_Procurable",
                                        "key": "P2P_Req_Procurable"
                                    }, {
                                        "id": 1,
                                        "name": "P2P_Req_Inventory",
                                        "key": "P2P_Req_Inventory"
                                    }]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "manufacturer",
                                "width": 150,
                                "displayName": "P2P_Req_Manufacturer_Details",
                                "isMandatory": false,
                                "uiType": "popup",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["ManufacturerCheckDisable"],
                                "appendedLabels": ["manufacturer", "manufacturerPartNumber", "ManufacturerModel"],
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "manufacturerPopup",
                                    "defaultTitle": "ADD",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "data": "contractNumber",
                                "rules": ["isNeedByDateGreaterThanContractExpiryDate"],
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "data": "contractNumber",
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
                                "attributes": {
                                    "type": "number",
                                    "isEditable": []
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["ContractSourceTypeCheck", "ContractItemDisableCheck"],
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "type": "autocomplete",
                                    "model": "ContractItems",
                                    "filterkeys": ["name"],
                                    "optionformat": "{id}:{name}",
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "commentsAndAttachmentsPopup",
                                    "defaultLabelCondition": "row.entity.notes && row.entity.notes.length > 0 ? \"View\" : \"Add\""
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
                                    "defaultTitle": "View"
                                }
                            },
                            {
                                "field": "source.name",
                                "width": 150,
                                "displayName": "P2P_REQ_ItemSource",
                                "isMandatory": false,
                                "isVisible": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": true,
                                "uiType": "textfield",
                                "enableTranslation": true,
                                "attributes": {
                                    "model": "source",
                                    "dataKey": "name"
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isVisible": true,
                                "isReadOnly": false,
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "linkToOrderPopup",
                                    "defaultLabelCondition": "View"
                                }
                            },
                            {
                                "field": "incoTermCode.name",
                                "width": 150,
                                "displayName": "P2P_Req_incoTermCode",
                                "isVisible": true,
                                "isReadOnly": true,
                                "isMandatory": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "data": "incoTermCode",
                                "rules": ["grayOutNonEditable"],
                                "attributes": {
                                    "isEditable": []
                                }

                            },
                            {
                                "field": "incoTermLocation",
                                "width": 150,
                                "displayName": "P2P_Req_incoTermLocation",
                                "isVisible": true,
                                "isReadOnly": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isMandatory": false,
                                "uiType": "editable",
                                "isRegFocusCol": true,
                                "rules": ["grayOutNonEditable"],
                                "data": "incoTermLocation",
                                "attributes": {
                                    "isEditable": []
                                }
                            }

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
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "applyToAll"
                            },
                            {
                                "title": "P2P_Req_Managed_Column",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_202"],
                                "id": "manageColumns"
                            },
                            {
                                "title": "delete",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "delete"
                            },
                            {
                                "title": "Download Template",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downloadTemplate"
                            },
                            {
                                "title": "Upload Template",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "uploadTemplate"
                            },
                            {
                                "title": "Export Template",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "exportTemplate"
                            },
                            {
                                "title": "Download Error Log",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downLoadErrorLog"
                            },
                            {
                                "title": "P2P_Common_ShowFilters",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],
                                "id": "showFilters"
                            },
                            {
                                "title": "P2P_Common_HideFilters",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],
                                "id": "hideFilters"
                            }
                        ],

                        "columnDefs": [

                            {
                                "field": "splitIndex",
                                "width": 150,
                                "displayName": "P2P_REQ_Index",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isVisible": false,
                                "isReadOnly": true,
                                "pinnedLeft": true,
								"enableCellEdit": true,
								"enableFiltering": true,
                                "_treeHeaderReadOnly": true,
                                "autoIncrement": true,
                                "attributes": {
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "lineNumber",
                                "width": 150,
                                "displayName": "P2P_Req_LineNo",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "_treeHeaderReadOnly": true,
                                "pinnedLeft": true,
								"enableCellEdit": true,
								"enableFiltering": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "autoIncrement": false,
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
                                "pinnedLeft": true,
								"enableCellEdit": true,
								"enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "autoIncrement": false,
                                "uiType": "editable",
                                "Changereq": "Changereq",
                                "attributes": {
                                    "isShown": ["0_1", "0_23", "0_24", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_121_10", "0_1_10", "0_78", "0_1_4", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_121_4", "1_121_4", "0_141", "0_141_4", "0_1_3", "0_23_3", "0_24_3", "0_202"],
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isTree": true
                            },
                            {
                                "field": "description.desc",
                                "width": 150,
                                "displayName": "P2P_Req_PartnerItemName",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "pinnedLeft": true,
								"enableCellEdit": true,
								"enableFiltering": true,
                                "_treeHeaderReadOnly": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121"],
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
								"enableCellEdit": true,
								"enableFiltering": true,
                                "isMandatory": false,
                                "_treeHeaderReadOnly": true,
                                "isRegClickCol": true,
                                "attributes": {
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121"],
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
                                "isFixed": "Left",
                                "pinnedLeft": true,
								"enableCellEdit": true,
								"enableFiltering": true,
                                "isRegClickCol": true,
                                "isMandatory": true,
                                "_treeHeaderReadOnly": true,
                                "uiType": "popup",
                                "attributes": {
                                    "type": "splitsPopup",
                                    "defaultLabelCondition": "row.entity.splitType===0?(row.entity.type.id===1?\"Quantity\":\"Amount\"):\"Percentage\"",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121"],
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
								"enableCellEdit": true,
								"enableFiltering": true,
                                "_treeHeaderReadOnly": true,
                                "rules": [],
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
                                "enableCellEdit": true,
								"enableFiltering": true,
                                "uiType": "editable",
                                "_treeHeaderReadOnly": true,
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
                                "enableCellEdit": true,
								"enableFiltering": true,
                                "isReadOnly": true,
                                "uiType": "editable",
                                "attributes": {
                                    "type": "number",
                                    "isEditable": []
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            },
                            {
                                "field": "otherCharges",
                                "width": 150,
                                "_treeHeaderReadOnly": true,
                                "displayName": "P2P_Req_OtherCharges",
                                "isVisible": true,
                                "isReadOnly": true,
                                "enableCellEdit": true,
								"enableFiltering": true,
                                "uiType": "editable",
                                "attributes": {
                                    "type": "number",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121"],
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
                                "enableCellEdit": true,
								"enableFiltering": true,
                                "uiType": "editable",
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "requester",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121"],
                                    "populateListOnFocus": true,
                                    "minchars": 0
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                }
                            }
                           

                        ]

                    }

                ],
            }
        }
    ]
} as IWidgetsConfig;





const mergedConfig = mergeConfigs(defaultManagerConfig, carigalihessSpecificConfig);

export default mergedConfig;

const scriptName = path.basename(__filename);
const fullPath = path.join('./merged', scriptName);
write.sync(fullPath, stringify(mergedConfig, `clientConfig`)); 
