import { defaultManagerConfig } from '../default-manager.config';

import { mergeConfigs,stringify } from '../base/merge-configs.factory';

import { IWidgetsConfig, WidgetsManagerLayoutEnum, WidgetTypesEnum, ITextInput, IAutosuggestInput, ICheckboxInput, customInput,BaseInput,IBaseInput } from "../../smart-core-types";

import * as write from "write";

import * as path from "path";

import { DataModelNames } from '../../../src/modules/enums/sections.enum';

const alnylamSpecificConfig = {

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

					fieldId: 'onBehalfOf',

					label: 'P2P_Req_OnBehalfOf',

					behaviour: {

						listIndex: 6

					}

                } as IAutosuggestInput,

                

                {

					fieldId: 'urgent',

					label: 'P2P_Req_Urgent',

					behaviour: {

						listIndex: 7

					}

					// dataModelId: Sections.BASIC_DETAILS,

					// data: 'InvoiceName',

                } as ICheckboxInput,



                {

					fieldId: 'sourceSystem',

					label: 'P2P_REQ_Source_System',

					isVisible: false

                } as ITextInput,

                

				{

					fieldId: 'contractValue',

					label: 'P2P_Req_ContractNumber',

					isVisible: false

                } as IAutosuggestInput,



                {

					fieldId: 'organization',

					label: 'P2P_Req_Organization',

					isVisible: false,

                } as IAutosuggestInput,

                

                {

                    fieldId: 'SupplierName',

                    label: 'P2P_Req_SupplierName',

                    isVisible: false,

                } as ITextInput,

                

			]

        },
        {
            widgetId: 'deliveryInvoicing',
            children: [
                {
                    fieldId: 'SHIPTOSUBSECTION',
                    label: 'P2P_CMN_ShipTo',
                    isClientEnabled: false
                } as {} as IBaseInput
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

            isClientEnabled:true,

			behaviour: {

				isVisible: true,

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

                    "disableOverallLimitOnBlanket": true,


                    "validateInternalCodeCombination": false,

            

                    "externalPaginationThreshold": 50,

            

                    "IsDefaultShippingMethod": "Best Available",

            

                    "allowGridPersistence": false,

            

                    "disableOldGrid": false,

            

                    "enableNewManageApproval": true,

            

                    "columnDefTemplate": {

            

                        "field": "{{name}}",

            

                        "width": 150,

            

                        "displayName": "{{displayName}}",

            

                        "isVisible": true,

            

                        "isReadOnly": "p2pValidationService.isReadOnly",

            

                        "isRegFocusCol": true,

            

                        "type": "editable",

            

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

                        //

                        "key": "Lines",

            

                        "gridActions": [

            

                            {

            

                                "title": "P2P_Req_AddMultipleLines",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "add"

                            },

            

                            {

            

                                "title": "P2P_Req_Add_Lines_From",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "addFrom"

            

                            },

            

                            {

            

                                "title": "P2P_Req_Managed_Column",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "manageColumns"

            

                            },

            

                            {

            

                                "title": "P2P_CMN_Delete",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "delete"

            

                            },

            

                            {

            

                                "title": "P2P_Req_Duplicate_Line",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "duplicate"

            

                            },

            

                            {

            

                                "title": "P2P_Req_CopyLineDetails",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "applyToAll"

            

                            },

            

                            {

            

                                "title": "P2P_Common_DownloadTemplate",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "downloadTemplate"

            

                            },

            

                            {

            

                                "title": "P2P_Common_UploadTemplate",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "uploadTemplate"

            

                            },

            

                            {

            

                                "title": "P2P_Common_ExportTemplate",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                //

                                "id": "exportTemplate"

            

                            },

            

                            {

            

                                "title": "P2P_Common_DownloadErrorLog",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202"],

                                //

                                "id": "downLoadErrorLog"

                            },

            

                            {

            

                                "title": "P2P_Common_ShowFilters",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],

                                //

                                "id": "showFilters"

            

                            },

            

                            {

            

                                "title": "P2P_Common_HideFilters",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],

                                //

                                "id": "hideFilters"

            

                            },
                            {
                                "title": "Download_Master_Template",
                                "isVisible": "p2pValidationService.isVisibleForGrid",
                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],
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

            

                                "Changereq": "Changereq",

            

                                "autoIncrement": true,

            

                                //

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

            

                                "field": "lineReferenceNumber",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_LineReferenceNumber",

            

                                "isFixed": "Left",

            

                                "isMandatory": false,

            

                                "isVisible": false,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "autoIncrement": false,

            

                                "uiType": "editable",

                                //

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isRegUpdateCol": true,

            

                                "enableTranslation": true,

            

                                "rules": ["SourceTypeCheck"],

            

                                "attributes": {

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

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

            

                                        }

            

                                    ]

            

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

                                //

                                "pinnedLeft": true,

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "rules": ["SourceTypeCheck", "emptyCheck"],

            

                                "attributes": {

            

                                    "filterkeys": ["desc"],

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "rules": ["SourceTypeCheck"],

            

                                "attributes": {

            

                                    "type": "autocomplete",

            

                                    "model": "partner",

            

                                    "filterkeys": ["name", "code"],

            

                                    "displayformat": "{name}",

            

                                    "optionformat": "{code}:{name}",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

                                    "populateListOnFocus": true,

            

                                    "minchars": 0

            

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

                                //

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

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["transmissionValueEmptyCheck"],

            

                                "isRegClickCol": true,

            

                                "attributes": {

            

                                    "type": "dispatchModePopup",

            

                                    "defaultTitle": "select",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

                                },

            

                                "filterObject": {

            

                                    "enableFiltering": true

            

                                }

            

                            },

            

                            {

            

                                "field": "partnerItemNumber",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_PartnerItemNumber",

            

                                "isMandatory": true,

            

                                "isFreeText": true,

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "rules": ["SourceTypeCheck"],

            

                                "attributes": {

            

                                    "filterkeys": ["partnerItemNumber"],

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

                                },

            

                                "filterObject": {

            

                                    "enableFiltering": true

            

                                },

            

                                "isRegFocusCol": true

            

                            },

            

                            {

            

                                "field": "category.name",

            

                                "width": 150,

            

                                "displayName": "P2P_CMN_Category",

            

                                "isMandatory": true,

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "isCatalogCategoryEditable": true,

            

                                "uiType": "popup",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["variableTypeMandatory", "categoryDisableCheck", "emptyCheck"],

            

                                "isRegClickCol": true,

            

                                "attributes": {

            

                                    "type": "categoryPopup",

            

                                    "defaultTitle": "select",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["quantityFixedDisable", "uomQuantityRelation", "quantityNegativeCheck"],

            

                                "isRegUpdateCol": true,

            

                                "attributes": {

            

                                    "type": "number",

            

                                    "minValue": 0,

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["variableDisable", "emptyCheck", "SourceTypeCheck"],

            

                                "attributes": {

            

                                    "type": "autocomplete",

            

                                    "model": "uom",

            

                                    "filterkeys": ["code", "name"],

            

                                    "displayformat": "{name}",

            

                                    "optionformat": "{code}:{name}",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

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

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "startDateGreatedED"],

            

                                "attributes": {

            

                                    "type": "date",

            

                                    "format": "MM/dd/yyyy",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())",

            

            

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "endDateLessThanSD"],

            

                                "attributes": {

            

                                    "type": "date",

            

                                    "format": "MM/dd/yyyy",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())",

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["NumberFormatCheck", "SourceTypeCheck", "AllowZeroForUnitPrice"],

            

                                "isRegUpdateCol": true,

            

                                "attributes": {

            

                                    "type": "number",

            

                                    "minValue": 0,

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

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

            

                                "field": "subTotal",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_SubTotal",

            

                                "isVisible": true,

            

                                "isMandatory": false,

            

                                "isReadOnly": true,

            

                                "uiType": "calculated",

                                //

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

            

                                "field": "taxes",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_Taxes",

            

                                "uiType": "popup",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isMandatory": false,

            

                                "isReadOnly": false,

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isRegUpdateCol": true,

            

                                "_readonlyForCharge": true,

            

                                "attributes": {

            

                                    "type": "number",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

                                }

            

                            },

            

                            {

            

                                "field": "shippingCharges",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_ShippingCharges",

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "_readonlyForCharge": true,

            

                                "rules": ["variableDisable"],

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isRegUpdateCol": true,

            

                                "attributes": {

            

                                    "type": "number",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

                                }

            

                            },

            

                            {

            

                                "field": "total",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_LineTotal",

            

                                "isVisible": true,

            

                                "isReadOnly": true,

            

                                "uiType": "calculated",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

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

                                // no "uiType"

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

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["variableDisable"],

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isRegUpdateCol": true,

            

                                "rules": ["variableDisable", "needbydateCheck", "needbydateLTRDCheck", "emptyCheck"],

            

                                "attributes": {

            

                                    "type": "date",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

                                    "format": "MM/dd/yyyy",

                                    "min": "new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())",

            

                                },

            

                                "isMandatory": true

            

                            }, {

            

                                "field": "shippingMethod.name",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_ShippingMethod",

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "uiType": "dropdown",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "rules": ["variableDisable"],

            

                                "attributes": {

            

                                    "model": "shippingMethod",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

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

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "rules": ["emptyCheck"],

            

                                "adhocpopup": "adhocpopup",

                                

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "attributes": {

            

                                    "isShippingChanges": true,

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

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

            

                            },

            

                            {

            

                                "field": "shipTo.address",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_ShipToAddress",

            

                                "isMandatory": true,

            

                                "isVisible": true,

            

                                "isReadOnly": true,

            

                                "rules": ["emptyCheck"],

                                

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "attributes": {

            

                                    "isEditable": []

            

                                },

            

                                "filterObject": {

            

                                    "enableFiltering": true

            

                                },

            

                                

            

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

            

                                "field": "deliverToStr",

            

                                "width": 150,

            

                                "displayName": "P2P_CMN_DeliverTo",

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isRegFocusCol": true,

            

                                "data": "deliverToStr",

            

                                "attributes": {

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"]

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "rules": ["ManufacturerCheckDisable"],

            

                                "appendedLabels": ["manufacturer", "manufacturerPartNumber", "ManufacturerModel"],

            

                                "isRegClickCol": true,

            

                                "attributes": {

            

                                    "type": "manufacturerPopup",

            

                                    "defaultTitle": "add",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],

            

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

                                //

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

            

                                "field": "comments",

            

                                "width": 150,

            

                                "displayName": "P2P_Common_Comments",

            

                                "uiType": "popup",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isReadOnly": false,

            

                                "isRegClickCol": true,

            

                                "attributes": {

            

                                    "type": "commentsAndAttachmentsPopup",

            

                                    "defaultLabelCondition": "row.entity.notes && row.entity.notes.length > 0 ? \"View\" : \"Add\""

            

                                }

            

                            },

            

                            {

            

                                "field": "customAttributes",

            

                                "width": 170,

            

                                "displayName": "P2P_AssetNumber",

            

                                "uiType": "popup",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "isVisible": true,

            

                                "isReadOnly": false,

            

                                "isRegClickCol": true,

            

                                "attributes": {

            

                                    "type": "customAttributesPopup",

            

                                    "defaultTitle": "view"

            

                                }

            

                            },

            

                            {

            

                                "field": "source.name",

            

                                "width": 150,

            

                                "displayName": "P2P_REQ_ItemSource",

            

                                "isMandatory": false,

            

                                "isVisible": false,

            

                                "isReadOnly": true,

            

                                "uiType": "textfield",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

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

            

                                "field": "incoTermCode.name",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_incoTermCode",

            

                                "isVisible": true,

            

                                "isReadOnly": true,

            

                                "isMandatory": false,

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

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

            

                                "isMandatory": false,

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

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

                        //

                        "key": "Accounting",

            

                        "gridAccountingActions": [

            

                            {

            

                                "title": "P2P_Req_EditMultipleLines",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_202", "0_21", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3"],

                                

                                "id": "applyToAll"

            

                            },

            

                            {

            

                                "title": "P2P_Req_Managed_Column",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_23_3", "0_24_3", "0_202"],

                                 

                                "id": "manageColumns"

                                

                            },

            

                            {

        

                                "title": "P2P_CMN_Delete",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],



                                "id": "delete"



                            },

            

                            {

            

                                "title": "P2P_Common_DownloadTemplate",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],



                                "id": "downloadTemplate"

            

                            },

            

                            {

            

                                "title": "P2P_Common_UploadTemplate",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],



                                "id": "uploadTemplate"

            

                            },

            

                            {

            

                                "title": "P2P_Common_ExportTemplate",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3", "0_202"],



                                "id": "exportTemplate"

            

                            },

                            {

            

                                "title": "P2P_Common_DownloadErrorLog",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_202"],

                               

                                "id": "downLoadErrorLog"

            

                            },

            

                            {

            

                                "title": "P2P_Common_ShowFilters",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],



                                "id": "showFilters"

                            },

            

                            {

            

                                "title": "P2P_Common_HideFilters",

            

                                "isVisible": "p2pValidationService.isVisibleForGrid",

            

                                "isShown": ["1_1", "0_1", "0_23", "0_24" , "0_121", "0_21", "0_22", "0_62", "0_61", "0_254", "0_56", "0_1_3", "0_202"],

                                

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

            

                                "_treeHeaderReadOnly": true,

            

                                "autoIncrement": true,

                                // no "uiType"

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

            

                                "width": 150,

            

                                "displayName": "P2P_Req_LineNo",

            

                                "isFixed": "Left",

            

                                "isMandatory": true,

            

                                "_treeHeaderReadOnly": true,

            

                                "isVisible": true,

            

                                //

                                "pinnedLeft": true,

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "Changereq": "Changereq",

            

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

            

                                "isReadOnly": "p2pValidationService.isReadOnly",

            

                                "autoIncrement": false,

            

                                "uiType": "editable",

                                //

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

            

                                },

            

                                "isTree": true

            

                            },

            

                            {

            

                                "field": "description.desc",

            

                                "width": 150,

            

                                "displayName": "P2P_Req_PartnerItemName",

            

                                "isFixed": "Left",

            

                                "isMandatory": true,

            

                                "_treeHeaderReadOnly": true,

            

                                "isVisible": true,

                                

            

                                "isReadOnly": true,

                                //

                                "pinnedLeft": true,

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "attributes": {

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3"],

            

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

                                //

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

            

                                "field": "otherCharges",

            

                                "width": 150,

            

                                "_treeHeaderReadOnly": true,

            

                                "displayName": "P2P_Req_OtherCharges",

            

                                "isVisible": true,

            

                                "isReadOnly": true,

            

                                "uiType": "editable",

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "attributes": {

            

                                    "type": "number",

            

                                    "isEditable": ["0_1", "0_23", "0_24" , "0_121", "0_1_3", "0_23_3", "0_24_3"],

            

                                }

            

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

                                //

                                "enableCellEdit": true,

                                "enableFiltering": true,

            

                                "attributes": {

            

                                    "type": "autocomplete",

            

                                    "model": "requester",

            

                                    "filterkeys": ["name"],

            

                                    "displayformat": "{name}",

            

                                    "optionformat": "{name}",

            

                                    "isEditable": [],

            

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











const mergedConfig = mergeConfigs(defaultManagerConfig, alnylamSpecificConfig);



export default mergedConfig;



const scriptName = path.basename(__filename);

const fullPath = path.join('./merged', scriptName); 

write.sync(fullPath, stringify(mergedConfig,`clientConfig`)); 