import { defaultManagerConfig } from '../default-manager.config';
import { mergeConfigs, stringify } from '../base/merge-configs.factory';
import { IWidgetsConfig, WidgetsManagerLayoutEnum, WidgetTypesEnum, ITextInput, IAutosuggestInput, AutosuggestInput, TextInput, BaseInput, IBaseInput, ICheckboxInput } from "../../smart-core-types";
import * as write from "write";
import * as path from "path";
import { DataModelNames } from '../../../src/modules/enums/sections.enum';
import { inputsFactory } from "../base/inputs.factory";
const tescostoresSpecificConfig = {
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
                    fieldId: 'organization',
                    label: 'P2P_Req_Organization',
                    "isVisible": false,
                    "isMandatory": true,                                
                    behaviour: {
                        listIndex: 6
                    },
                } as IAutosuggestInput,

                {
                    fieldId: 'onBehalfOf',
                    label: 'P2P_Req_OnBehalfOf',
                    isVisible: false,
                    isMandatory: true,
                    behaviour: {
                        listIndex: 7
                    },
                    showLookup: {
                        isVisible: true
                    },
                } as IAutosuggestInput,

                {
                    fieldId: 'urgent',
                    label: 'P2P_Req_Urgent',
                    isVisible: false,
                    isMandatory: true,
                    behaviour: {
                        listIndex: 8
                    }
                } as ICheckboxInput,
                {
                    fieldId: 'ContractNumberField',
                    label: 'P2P_Req_ContractNumber',
                    behaviour: {
                        listIndex: 9
                    },
                } as {} as IAutosuggestInput,
                {
                    fieldId: 'costApprover',
                    label: 'P2P_REQ_CostApprover',
                    isVisible: false,
                    isMandatory: true,                   
                } as {} as IAutosuggestInput,
            ]
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
                        ],
                        rules: []
                    }
                }),
                {

                    fieldId: "DELIVERTOAUTOCOMPLETE",
                    label: "P2P_CMN_DeliverTo",
                    isVisible: false,
                    isMandatory: true,
                } as IAutosuggestInput,
                {
                    fieldId: "DELIVERTOFREETEXT",
                    label: "P2P_CMN_DeliverTo",
                    isVisible: false,
                    isMandatory: true,
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
            isClientEnabled: true,
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
                isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_202"]
            },
            children: {
                "specificSettings": {
                    "switchToAPIM": false,
                    "HidePrintPreview": true,
                    "validateInternalCodeCombination": true,
                    "externalPaginationThreshold": 50,
                    "IsDefaultShippingMethod": "Best Available",
                    "allowGridPersistence": true,
                    "utilazationDocumentType": "Contract",
                    "enableDirtyCheck": false,
                    "disableOldGrid": false,
                    "editWithPagination": true,
                    "enableNewManageApproval": true,
                    "enableNewAddLinesFromRequisitionPopup": true,
                    "billToEditable": [],
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
                            "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
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
                                "title": "goToCatalog",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3","0_202"],
                                "id": "goToCatalog"
                            },
                            {
                                "title": "P2P_Req_AddMultipleLines",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": [],
                                "id": "add"
                            },
                            {
                                "title": "P2P_Req_Add_Lines_From",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": [],
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
                                "isShown": [],
                                "id": "duplicate"
                            },
                            {
                                "title": "P2P_Req_CopyLineDetails",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": [],
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
                                "title": "P2P_Common_DownloadErrorLog",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downLoadErrorLog"
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
                                "field": "description.desc",
                                "width": 150,
                                "displayName": "P2P_Req_PartnerItemName",
                                "isFixed": "Left",
                                "isMandatory": true,
                                "isFreeText": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck", "emptyCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "description",
                                    "filterkeys": ["desc"],
                                    "maxlength": 1000,
                                    "displayformat": "{desc}",
                                    "optionformat": "{code}:{name}:{partner}:{desc}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },
                            {	
                                "field": "buyerItemNumber.code",	
                                "width": 150,	
                                "displayName": "P2P_Req_ItemNumber",	
                                "isMandatory": false,	
                                "isFreeText": true,	
                                "isExternalValidationEnabled": true,	
                                "uiType": "editable",	
                                "enableCellEdit": true,	
                                "enableFiltering": true,	
                                "isVisible": true,	
                                "isReadOnly": "p2pValidationService.isReadOnly",	
                                "rules": ["SourceTypeCheck"],	
                                "attributes": {	
                                    "type": "autocomplete",	
                                    "model": "buyerItemNumber",	
                                    "filterkeys": ["code"],	
                                    "displayformat": "{code}",	
                                    "optionformat": "{code}:{name}:{partner}:{desc}",	
                                    "isEditable": [],	
                                    "maxlength": 50	
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
                                "isMandatory": true,
                                "uiType": "editable",
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": ["SourceTypeCheck", "emptyCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "partner",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isRegFocusCol": true
                            },                           
                            {
                                "field": "orderingLocation.name",
                                "width": 150,
                                "displayName": "P2P_Req_OrderingLocation",
                                "isMandatory": false,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": [],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "orderingLocation",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                "isReadOnly": true,
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "rules": [],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "partnerContact",
                                    "filterkeys": ["name"],
                                    "displayformat": "{name}",
                                    "optionformat": "{id}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
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
                                "isRegFocusCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "popup",
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
                                "field": "category.name",
                                "width": 150,
                                "displayName": "P2P_CMN_Category",
                                "isMandatory": true,
                                "isVisible": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "popup",
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
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["variableDisable", "emptyCheck", "SourceTypeCheck"],
                                "attributes": {
                                    "type": "autocomplete",
                                    "model": "uom",
                                    "filterkeys": ["name", "code"],
                                    "displayformat": "{name}",
                                    "optionformat": "{code}:{name}",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"]
                                },
                                "filterObject": {
                                    "enableFiltering": true
                                },
                                "isMandatory": true
                            },                           
                            {
                                "field": "unitPrice",
                                "width": 150,
                                "displayName": "P2P_Req_UnitPrice",
                                "isVisible": true,
                                "isMandatory": false,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "field": "requestedDate",
                                "width": 150,
                                "displayName": "P2P_Req_RequestedDate",
                                "isMandatory": true,
                                "isVisible": false,
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
                                "isReadOnly": true,
                                "uiType": "editable",
                                "isRegUpdateCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "rules": ["variableDisable", "needbydateCheck", "needbydateLTRDCheck", "emptyCheck"],
                                "attributes": {
                                    "type": "date",
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121", "0_202"],
                                    "format": "MM/dd/yyyy",
                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())"
                                },
                                "isMandatory": true
                            },                           
                            {
                                "field": "comments",
                                "width": 150,
                                "displayName": "comments",
                                "uiType": "popup",
                                "isVisible": false,
                                "isReadOnly": false,
                                "isRegClickCol": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "attributes": {
                                    "type": "commentsAndAttachmentsPopup",
                                    "defaultLabelCondition": "row.entity.notes && row.entity.notes.length > 0 ? \"View\" : \"Add\""
                                }
                            },
                            {
                                "field": "customAttributes",
                                "width": 170,
                                "displayName": "Additional Info",
                                "uiType": "popup",
                                "isVisible": true,
                                "isReadOnly": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isRegClickCol": true,
                                "attributes": {
                                    "type": "customAttributesPopup",
                                    "defaultTitle": "View"
                                }
                            },                            
                            {
                                "field": "OrderLink",
                                "width": 100,
                                "displayName": "P2P_REQ_OrderLink",
                                "uiType": "popup",
                                "isVisible": true,
                                "isReadOnly": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isMandatory": false,
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
                                "isShown": [],
                                "id": "applyToAll"
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
                                "title": "P2P_Common_DownloadErrorLog",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_121", "0_202"],
                                "id": "downLoadErrorLog"
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
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "isMandatory": true,
                                "_treeHeaderReadOnly": true,
                                "isVisible": true,
                                "isReadOnly": "p2pValidationService.isReadOnly",
                                "autoIncrement": true,
                                "attributes": {
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
                                "isMandatory": false,
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "isRegClickCol": true,
                                "pinnedLeft": true,
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
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
                                "uiType": "editable",
                                "enableCellEdit": true,
                                "enableFiltering": true,
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
                                    "isEditable": ["0_1", "0_23", "0_24", "0_121"]
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
                                "enableCellEdit": true,
                                "enableFiltering": true,
                                "uiType": "editable",
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



const mergedConfig = mergeConfigs(defaultManagerConfig, tescostoresSpecificConfig);

export default mergedConfig;

const scriptName = path.basename(__filename);
const fullPath = path.join('./merged', scriptName);
write.sync(fullPath, stringify(mergedConfig, `clientConfig`));



