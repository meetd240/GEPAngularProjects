
var _clientSpecificConfigSettings = {
    "specificSettings": {
        enableGridRowsPerPage: false,
        externalPaginationThreshold: 300,
        allowGridPersistence: false,
        enableDirtyCheck: false,
        useExternalPagination: false,
        accountingTemplateFirst: false,
        IsDefaultShippingMethod: "Best Available",
        allowGridPersistence: false,
        columnDefHeaderTemplate:  {
            "label": "",
            "type": "autocomplete",
            "isMandatory": true,
            "isVisible": true,
            "data": "",
            "onChange": "",
            "onSelect": "",
            "onFocus": "",
            "onBlur": "",
            "IsAccountingEntity": "",
            "attributes": {
                "disable": "p2pValidationService.isReadOnly",
                "validateOn": "change",
                "isShown": ["1_1", "0_1", "0_23", "0_24", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202"],
                "isEditable": ["0_1", "0_23", "0_24"],
                "filterkeys": ["EntityDisplayName", "EntityCode"],
                "optionformat": "{EntityCode}-{EntityDisplayName}",
                "displayformat": "{EntityCode}-{EntityDisplayName}",
                "options": []
            }
        },
        columnDefTemplate: {
            "label": "{{label}}",
            // "type": "textfield",
            "uiType": "editable",
            "sort": 2,
            "isMandatory": false,
            "isEditable": true,
            "isVisible": true,
            "data": "{{name}}",
            "isRegFocusCol": true,
            "onSelect": "onSelectDelValueAttr(row.entity.{{name}})",
            "onChange": "changeSplitAccounting($event, grid.appScope.itemCatalog[row.entity.lineId], " + "{{EntityTypeId}}" + ", row.entity.{{name}}.splitEntityId,row.entity.splitNumber, undefined, row.entity.{{name}}, row.entity)",
            "columnWidth": 150,
            "enableSorting": false,
            "customAttribVal": "{{name}}",
            "attributes": {
                "readonly": false,
                "model": "{{modelKey}}",
                "options": "itemCatalog[row.entity.lineId].accountingOptions",
                "filterkeys": ["name", "entityCode"],
                "optionformat": "{entityCode}-{name}",
                "displayformat": "{entityCode}-{name}",
                "enableFiltering": true,
                "show-no-suggestion": false,
                "removable": false,
                "type": "autocomplete",
                "showLookup":false
            }
        },
        contractNumberType: { controlType: 3 },
        contractNumberValidationCheckOnSubmit: { key: false },
        disableOldGrid: false,
        enableDirtyCheck: false,
        enableNewAddLinesFromRequisitionPopup: true,
        externalPaginationThreshold: 300,
        utilazationDocumentType: "Blanket",
        validateInternalCodeCombination: true
    },
    "header": {
    "accountingSplitMode": 1,
    "documentType": 31,
    "sections": [
            {
                "id": "BasicDetails",
                "label": "P2P_DM_BasicDetails",
                "isMandatory": true,
                "type": "section",
                "data": "",
                "headerTemplate": '',
                "isCollapsible": true,
                "isVisible": true,
                "isActive": true,
                "isDraggable": true,
                "index": 0,
                "routeName": "bds",
                "rows": [
                    {
                        "properties": [
                            {
                                "label": "Requisition Name",
                                "type": "textfield",
                                "isMandatory": true,
                                "isVisible": true,
                                "data": "basicDetails.requisitionName",
                                "attributes": {
                                    "disable": false,
                                    "placeholder": "",
                                }
                            },
                            {
                                "label": "Requsition Number",
                                "type": "textfield",
                                "isMandatory": true,
                                "isVisible": true,
                                "data": "basicDetails.requisitionNumber",
                                "attributes": {
                                    "disable": false,
                                    "placeholder": "",
                                }
                            },
                            {
                                "label": "CreatedBy",
                                "type": "textfield",
                                "isMandatory": true,
                                "isVisible": true,
                                "data": "basicDetails.createdBy.name",
                                "attributes": {
                                    "disable": true,
                                    "placeholder": "",
                                }
                            },
                            {
                                "label": "CreatedOn",
                                "type": "textfield",
                                "isMandatory": true,
                                "isVisible": true,
                                "isReadOnly": true,
                                "data": "basicDetails.createdOn",
                                "attributes": {
                                    "disable": true,
                                    "type": "date",
                                    "format": "MM/dd/yyyy"
                                }
                            },
                            {
                                "label": "PFM_Currency",
                                "type": "autocomplete",
                                "isMandatory": true,
                                "isVisible": true,
                                "data": "basicDetails.currency",
                                "onChange": "onChange_Currency($event)",
                                "attributes": {
                                    "type": "autocomplete",
                                    "optionformat": "{code}",
                                    "displayformat": "{name}",
                                    "options": [],
                                    "filterkeys": ["code"]
                                }
                            },

                            {
                                "label": "P2P_Req_BuyerAssignee",
                                "type": "textfield",
                                "isMandatory": false,
                                "isVisible": true,
                                "data": "basicDetails.buyerAssigneeName.name",
                                "attributes": {
                                    "disable": true
                                }
                            },
                            {
                                "label": "P2P_Req_Organization",
                                "type": "autocomplete",
                                "id": "documentLOB",
                                "isMandatory": true,
                                "isVisible": true,
                                "data": "basicDetails.documentLOB",
                                "onSelect": "lobOnSelect($event)",
                                "attributes": {
                                    "type": "autocomplete",
                                    "optionformat": " {entityDisplayName}",
                                    "displayformat": "{entityDisplayName}",
                                    "disable": false,
                                    "placeholder": "",
                                    "options": []
                                }
                            },
                            {
                                "label": "P2P_Req_OnBehalfOf",
                                "type": "autocomplete",
                                "isMandatory": true,
                                "isVisible": true,
                                "id": "Id_OBO",
                                "data": "basicDetails.obo",
                                "onChange": "onChange_OBO($event)",
                                "onSelect": "onSelect_OBO($event)",
                                "onBlur": "obo_OnBlur($event)",
                                "attributes": {
                                    "type": "autocomplete",
                                    "filterkeys": ["name"],
                                    "optionformat": "{name} ({email})",
                                    "displayformat": "{name}",
                                    "options": [],
                                    "lookupConfig": {
                                        "showLookup": true,
                                        "filterKey": ['name'],
                                        "titleofmodel": 'Select OBO',
                                        "descKey": "name"
                                    }
                                }
                            },
                            {
                                "label": "P2P_REQ_Source_System",
                                "type": "autocomplete",
                                "isMandatory": true,
                                "isVisible": false,
                                "id": "Id_SourceSystem",
                                "data": "basicDetails.sourceSystem.name",
                                "attributes": {
                                    "disable": true,
                                    "readonly": true,
                                    "isShown": ["0_1", "0_23", "0_23_4", "0_22", "0_22_4", "0_24", "0_24_4", "0_41", "0_142", "0_142_5", "0_25", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_1_10", "0_121_10", "0_78", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_21_4", "0_41_4", "0_25_4", "0_121_4", "1_121_4", "0_141", "0_141_5", "0_141_4", "0_202"],
                                    "isEditable": []
                                }
                            },
                            {
                                "label": "P2P_Req_ContractNumber",
                                "isMandatory": true,
                                "id": "contractNumber",
                                "isVisible": true,
                                "type": "autocomplete",
                                "data": "basicDetails.contract",
                                //"onChange": "onContractNumberChange($event)",
                                //"onSelect": "onContractNumberSelect($event)",
                                "onBlur": "Contract_OnBlur($event)",
                                "attributes": {
                                    "isShown": [],
                                    "showLookup": true,
                                    "isEditable": [],
                                    "filterkeys": ["code", "name"],
                                    "optionformat": "{code}-{name}",
                                    "options": [],
                                    "displayformat": "{code}-{name}",
                                }
                            },
                            {
                                "id": "PurchaseType",
                                "label": "P2P_REQ_PurchaseType",
                                "type": "dropdown",
                                "isMandatory": true,
                                "isVisible": true,
                                "data": "basicDetails.purchaseType",
                                //"onChange": "onPurchaseTypeChange($event)",
                                "dataKey": "id",
                                "displayKey": "name",
                                "options": [],
                                "attributes": {
                                  "disable": false,
                                  "datakey": "name",
                                  "displayformat": "{name}",
                                  "optionformat": "{name}",
                                  "isShown": ["1_1", "0_1", "0_23", "0_42", "0_67", "0_68", "0_70", "0_77", "0_101", "0_102", "0_103", "0_104", "0_105", "0_151", "0_152", "0_153", "0_167", "0_177"],
                                  "isEditable": ["0_1", "0_23", "0_24", "0_202"]
                                }
                            } 
                        ]
                    }
                ]
            },
            {
                "id": "DeliveryAndInvoicingDetails",
                "label": "P2P_Sections_DELIVERYANDINVOICINGDETAILS",
                "isMandatory": true,
                "data": '',
                "headerTemplate": '',
                "isCollapsible": true,
                "isActive": true,
                "isDraggable": true,
                "isVisible": true,
                "index": 1, 
                "routeName": "daid",
                "type":"section",
                "rows": [
                  {
                    "properties": [
                      {
                        "label": "P2P_CMN_ShipTo",
                        "id":"SHIPTOLOCATIONSUBSECTION",
                        "type": "custom",
                        "isMandatory": true,
                        "isVisible": true, 
                        "renderElement": true,
                        "data": "dNIDetails.shipTo",
                        "attributes": {
                            "disable": false,
                            "placeholder":"",
                            "isEditable": ["0_1", "0_23", "0_24", "0_202"]
                          }
                      },
                    ]
                  },
                  {
                      "colspan": 12,
                    "properties": [
                      {
                        "label": "P2P_CMN_BillTo",
                        "id":"BILLTOSUBSECTION",
                        "type": "custom",
                        "isMandatory": true,
                        "isVisible": true, 
                        "colspan": 4,
                        "data": "dNIDetails.billTo",
                        "attributes": {
                            "disable": false,
                            "placeholder":"",
                            "isEditable": ["0_1", "0_23", "0_24", "0_202"]
                          }
                      },
                      {
                        "label": "P2P_CMN_DeliverTo",
                        "id": "DELIVERTOFREETEXT",
                        "type": "textfield",
                        "isMandatory": true,
                        "isVisible": true,
                        "data": "dNIDetails.deliverToStr",
                        "onChange": "deliverToFreeText_onChange($event)",
                        "attributes": {
                          "disable": false,
                          "placeholder":"",
                        }
                      },
                      {
                        "label": "P2P_CMN_DeliverTo",
                        "id": "DELIVERTOAUTOCOMPLETE",
                        "type": "autocomplete",
                        "isMandatory": true,
                        "isVisible": true,
                        "data": "dNIDetails.deliverTo",
                        "onChange": "deliverTo_onChange($event)",
                        "onSelect": "deliverTo_onSelect(dNIDetails.deliverTo)",
                        "onBlur": "deliverTo_onBlur($event)",
                        "attributes": {
                            "disable": false,
                            "type": "autocomplete",
                            "options": [],
                            "optionformat": " {name}",
                            "displayformat": "{name}"
                        }
                      }
                    ]
                  }          
                ]
              },
            //   {
            //     "id": "ADDITIONALINFO",
            //     "label": "P2P_Sections_ADDITIONALINFO",
            //     "isMandatory": true,
            //     "data": '',
            //     "headerTemplate": '',
            //     "isCollapsible": true,
            //     "isActive": true,
            //     "isDraggable": true,
            //     "isVisible": true,
            //     "index": 1, 
            //     "routeName": "daid",
            //     "type":"section",
            //     "rows": [
            //       {
            //         "properties": [
            //             {
            //                 "colspan": 6,
            //                 "type": "custom",
            //                 "isMandatory": true,
            //                 "data": "ReqData",
            //                 "templateUrl": "p2p/shared/views/customAttributes.html"
            //             },
            //             {
            //                 "label": "P2P_REQ_ERPOrderType",
            //                 "type": "dropdown",
            //                 "id": "Id_ERPOrderType",
            //                 "isMandatory": false,
            //                 "isVisible": true,
            //                 "data": "dNIDetails.erpOrderType",
            //                 "attributes": {
            //                     "disable": "p2pValidationService.isReadOnly",
            //                     "isShown": ["1_1", "0_1", "0_23", "0_24", "0_21", "0_22", "0_62", "0_61", "0_56"],
            //                     "isEditable": ["0_1", "0_23", "0_24"],
            //                     "options": [],
            //                     "datakey": "name"
            //                 }
            //             },
            //             {
            //                 "label": "P2P_REQ_WorkOrder",
            //                 "type": "textfield",
            //                 "id": "Id_WorkOrder",
            //                 "isMandatory": false,
            //                 "isVisible": true,
            //                 "data": "dNIDetails.workOrder",
            //                 "attributes": {
            //                     "disable": "p2pValidationService.isReadOnly",
            //                     "maxlength": 50,
            //                     "isShown": ["1_1", "0_1", "0_23", "0_24", "0_21", "0_22", "0_62", "0_61", "0_56"],
            //                     "isEditable": ["0_1", "0_23", "0_24"]
            //                 }
            //             }
            //         ]
            //       }                          
            //     ]
            //   },
            {
                "label": "P2P_DM_LineDetails",
                "id": "lineDetailsDetails",
                "isMandatory": true,
                "headerTemplate": '',
                "isCollapsible": true,
                "isVisible": true,
                "isActive": true,
                "isDraggable": true,
                "index": 0,
                "routeName": "lds",
                "rows": [{
                    "properties": []
                }
                ]
            }
        ]
    },
    "grid": [
        {
            "title": "P2P_SC_Lines",
            "key": "Lines",
            "enableTranslation": true,
            "gridActions": [
                {
                    "title": "P2P_SC_DeleteButton"
                }
            ],
            "columnDefs": [
                {
                    "field": "lineNumber",
                    "displayName": "No.",
                    "width": 50,
                    "enableCellEdit": false,
                    "visible": true,
                    "pinnedLeft": true,
                    "_treeHeaderReadOnly": true,
                    "enableFiltering": false,
                    "autoIncrement": true,
                    "maxWidth": 260,
                    "attributes": {
                        "isEditable": []
                    },
                },
                {
                    "field": "lineReferenceNumber",
                    "width": 150,
                    "maxWidth": 260,
                    "pinnedLeft": true,
                    "displayName": "P2P_Req_LineReferenceNumber",
                    "isFixed": "Left",
                    "isMandatory": false,
                    "isVisible": false,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "autoIncrement": false,
                    "uiType": "editable",
                    "attributes": {
                        "isEditable": [],
                        "type": "text"
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "field": "description.desc",
                    "displayName": "P2P_SC_Description",
                    "width": 150,
                    "visible": true,
                    "attributes": {
                        "type": "text"
                    },
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "maxWidth": 260
                },
                 {
                     "pinnedLeft": false,
                     "enableCellEdit": true,
                     "enableFiltering": true,
                     "field": "type.name",
                     "fieldId": "Id_LineType",
                     "width": 150,
                     "displayName": "P2P_Req_LineType",
                     "isMandatory": true,
                     "isVisible": true,
                     "isReadOnly": "p2pValidationService.isReadOnly",
                     "uiType": "dropdown",
                     "isRegUpdateCol": true,
                     "enableTranslation": true,
                     "rules": ["SourceTypeCheck"],
                     "attributes": {
                         "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "buyerItemNumber.code",
                    "width": 150,
                    "displayName": "P2P_Req_ItemNumber",
                    "isMandatory": false,
                    //  "isFreeText": true,
                    "isExternalValidationEnabled": true,
                    "uiType": "editable",
                    "type": "editable",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": ["SourceTypeCheck"],
                    "attributes": {
                        type: "autocomplete",
                        model: "buyerItemNumber",
                        "filterkeys": ["code"],
                        "displayformat": "{code}",
                        "optionformat": "{code}:{name}:{partner}:{desc}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
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
                    // "isFreeText": true,
                    "uiType": "editable",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": ["SourceTypeCheck", "emptyCheck"],
                    "attributes": {
                        "type": "text",
                        "filterkeys": ["desc"],
                        "displayformat": "{desc}",
                        "optionformat": "{code}:{name}:{partner}:{desc}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "isRegFocusCol": true
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "partner.name",
                    "width": 150,
                    "displayName": "P2P_Req_SupplierName",
                    "isMandatory": false,
                    "uiType": "editable",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": ["SourceTypeCheck"],
                    "attributes": {
                        "type": "autocomplete",
                        "model": "partner",
                        "filterkeys": ["name"],
                        "displayformat": "{name}",
                        "optionformat": "{code}:{name}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "populateListOnFocus": true,
                        "minchars": 0
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "isRegFocusCol": true
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "orderingLocation.name",
                    "width": 150,
                    "displayName": "P2P_Req_OrderingLocation",
                    "isMandatory": false,
                    "uiType": "editable",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": [],
                    "attributes": {
                        "type": "autocomplete",
                        "model": "orderingLocation",
                        "filterkeys": ["name"],
                        "displayformat": "{name}",
                        "optionformat": "{code}:{name}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "populateListOnFocus": true,
                        "minchars": 0
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
                    "type": "editable",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": ["SourceTypeCheck"],
                    "attributes": {
                        type: "autocomplete",
                        model: "partnerItemNumber",
                        "filterkeys": ["partnerItemNumber"],
                        "displayformat": "{partnerItemNumber}",
                        "optionformat": "{code}:{partnerItemNumber}:{partner}:{desc}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "isRegFocusCol": true
                },
                {
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "supplierDispatchMode.name",
                    "width": 150,
                    "displayName": "P2P_CMN_DispatchMode",
                    "isMandatory": false,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "popup",
                    "rules": [],
                    "isRegClickCol": true,
                    "attributes": {
                        "type": "dispatchModePopup",
                        "defaultTitle": "Select",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_23_3", "0_24_3", "0_202"]
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "category.name",
                    "width": 150,
                    "displayName": "P2P_CMN_Category",
                    "isMandatory": true,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "popup",
                    "rules": ["variableTypeMandatory", "categoryDisableCheck", "emptyCheck"],
                    "isRegClickCol": true,
                    "attributes": {
                        "type": "categoryPopup",
                        "defaultTitle": "select",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "quantity",
                    "width": 150,
                    "displayName": "P2P_Quantity_Riteaid",
                    "isMandatory": false,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "rules": ["quantityFixedDisable", "uomQuantityRelation", "quantityNegativeCheck"],
                    "isRegUpdateCol": true,
                    "attributes": {
                        "type": "number",
                        "minValue": 0,
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "uom.name",
                    "width": 150,
                    "displayName": "P2P_CMN_UOM",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "isRegFocusCol": true,
                    "uiType": "editable",
                    "rules": ["variableDisable", "emptyCheck", "SourceTypeCheck"],
                    "attributes": {
                        "type": "autocomplete",
                        "model": "uom",
                        "filterkeys": ["code", "name"],
                        "displayformat": "{name}",
                        "optionformat": "{code}:{name}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "populateListOnFocus": true,
                        "minchars": 0
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "isMandatory": true
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "startDate",
                    "width": 150,
                    "displayName": "P2P_Req_StartDate",
                    "isMandatory": true,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "startDateGreatedED"],
                    "attributes": {
                        "type": "date",
                        "format": "MM/dd/yyyy",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "min": new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())

                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "endDate",
                    "width": 150,
                    "displayName": "P2P_Req_EndDate",
                    "isMandatory": true,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "rules": ["materialCheckDisable", "variableTypeMandatory", "DateFormatCheck", "endDateLessThanSD"],
                    "attributes": {
                        "type": "date",
                        "format": "MM/dd/yyyy",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "min": new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "unitPrice",
                    "width": 150,
                    "displayName": "P2P_Req_UnitPrice",
                    "isVisible": true,
                    "isMandatory": false,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "rules": ["NumberFormatCheck", "quantityNegativeCheck", "SourceTypeCheck"],
                    "isRegUpdateCol": true,
                    "attributes": {
                        "type": "number",
                        "minValue": 0,
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "OrderingStatus",
                    "width": 150,
                    "displayName": "P2P_Req_OrderingStatus",
                    "isMandatory": false,
                    "isVisible": "p2pValidationService.isVisibleForGrid",
                    "isReadOnly": true,
                    "uiType": "editable",
                    "isRegFocusCol": true,
                    "data": "OrderingStatus",
                    "attributes": {
                        "type": "text",
                        "isShown": ["0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_1_3"],
                        "isEditable": []
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                // {
                //   "pinnedLeft": false,
                //     "enableCellEdit": true,
                //     "enableFiltering": true,
                //     "field": "subTotal",
                //     "width": 150,
                //     "displayName": "P2P_Req_SubTotal",
                //     "isVisible": true,
                //     "isMandatory": false,
                //     "isReadOnly": true,
                //     "type": "calculated",
                //     "rules": ["grayOutDisabled"],
                //     "attributes": {
                //         "rule": "(parseFloat(row.entity.unitPrice) * parseFloat(row.entity.quantity))",
                //         "isEditable": []
                //     }
                // },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "taxes",
                    "width": 150,
                    "displayName": "P2P_Req_Taxes",
                    "uiType": "popup",
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "otherCharges",
                    "width": 150,
                    "displayName": "P2P_Req_OtherCharges",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "isRegUpdateCol": true,
                    "_readonlyForCharge": true,
                    "attributes": {
                        "type": "number",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "shippingCharges",
                    "width": 150,
                    "displayName": "P2P_Req_ShippingCharges",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "_readonlyForCharge": true,
                    "rules": ["variableDisable"],
                    "uiType": "editable",
                    "isRegUpdateCol": true,
                    "attributes": {
                        "type": "number",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    }
                },
                // {
                //   "pinnedLeft": false,
                //     "enableCellEdit": true,
                //     "enableFiltering": true,
                //     "field": "total",
                //     "width": 150,
                //     "displayName": "P2P_Req_LineTotal",
                //     "isVisible": true,
                //     "isReadOnly": true,
                //     "type": "calculated",
                //     "rules": ["grayOutDisabled"],
                //     "attributes": {
                //         "rule": "(((isNaN(parseFloat(row.entity.unitPrice)) ? 0 :parseFloat(row.entity.unitPrice)) * (isNaN(parseFloat(row.entity.quantity)) ? 0 :parseFloat(row.entity.quantity)))) + (isNaN(parseFloat(row.entity.taxes)) ? 0 : parseFloat(row.entity.taxes)) + (isNaN(parseFloat(row.entity.otherCharges)) ? 0 : parseFloat(row.entity.otherCharges)) + (isNaN(parseFloat(row.entity.shippingCharges)) ? 0 : parseFloat(row.entity.shippingCharges))",
                //         "isEditable": []
                //     }
                // },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "inventory",
                    "width": 150,
                    "displayName": "P2P_Req_InventoryType",
                    "isMandatory": false,
                    "isVisible": false,
                    "isReadOnly": true,
                    "uiType": "editable",
                    "attributes": {
                        "type": "text",
                        "isEditable": []
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "requestedDate",
                    "width": 150,
                    "displayName": "P2P_Req_RequestedDate",
                    "isMandatory": true,
                    "isVisible": true,
                    "isReadOnly": true,
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "needByDate",
                    "width": 150,
                    "displayName": "P2P_Req_NeedByDate",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "isRegUpdateCol": true,
                    "rules": ["variableDisable", "needbydateCheck", "needbydateLTRDCheck", "emptyCheck"],
                    "attributes": {
                        "type": "date",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "format": "MM/dd/yyyy",
                        "min": new Date(((new Date()).getMonth() + 1) + '/' + (new Date()).getDate() + '/' + (new Date()).getFullYear())
                    },
                    "isMandatory": true
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "shippingMethod.name",
                    "width": 150,
                    "displayName": "P2P_Req_ShippingMethod",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    //"type": "dropdown",
                    "uiType": "dropdown",
                    "rules": ["variableDisable"],
                    "attributes": {
                        "model": "shippingMethod",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                        "idKey": "id",
                        "dataKey": "name",
                        "options": []
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "shipTo.name",
                    "width": 150,
                    "displayName": "P2P_CMN_ShipTo",
                    "isMandatory": true,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": ["emptyCheck"],
                    "attributes": {
                        "isShippingChanges": true,
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
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
                    "uiType": "editable",
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "shipTo.address",
                    "width": 150,
                    "displayName": "P2P_Req_ShipToAddress",
                    "isMandatory": true,
                    "isVisible": true,
                    "isReadOnly": true,
                    "rules": ["emptyCheck", "grayOutDisabled"],
                    "attributes": {
                        "type": "text",
                        "isEditable": []
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "uiType": "editable",
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "deliverToStr",
                    "width": 150,
                    "displayName": "P2P_CMN_DeliverTo",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "isRegFocusCol": true,
                    "data": "deliverToStr",
                    "attributes": {
                        "type": "text",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"]
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "deliverTo.address",
                    "width": 150,
                    "displayName": "p2p_deliverToAddress",
                    "isVisible": true,
                    "isReadOnly": true,
                    "attributes": {
                        "type": "text",
                        "isEditable": []
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "isRegFocusCol": true,
                    "uiType": "editable"
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "isProcurable.name",
                    "width": 150,
                    "displayName": "P2P_Req_ProcumentOption",
                    "isMandatory": false,
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    // "type": "dropdown",
                    "uiType": "dropdown",
                    "isRegUpdateCol": true,
                    "enableTranslation": true,
                    "rules": [],
                    "attributes": {
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "manufacturer",
                    "width": 150,
                    "displayName": "P2P_Req_Manufacturer_Details",
                    "isMandatory": false,
                    // "type": "popup",
                    "uiType": "popup",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "rules": ["ManufacturerCheckDisable"],
                    "appendedLabels": ["manufacturer", "manufacturerPartNumber", "ManufacturerModel"],
                    "isRegClickCol": true,
                    "attributes": {
                        "type": "manufacturerPopup",
                        "defaultTitle": "add",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "contractNumber",
                    "width": 150,
                    "displayName": "P2P_Req_ContractNumber",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "uiType": "editable",
                    "isRegFocusCol": true,
                    "data": "contractNumber",
                    "rules": ["ContractSourceTypeCheck", "contractNumberDisableCheck"],
                    "attributes": {
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "contractName",
                    "width": 150,
                    "displayName": "P2P_Req_ContractName",
                    "isVisible": true,
                    "isReadOnly": true,
                    "uiType": "editable",
                    "isRegFocusCol": true,
                    "data": "contractNumber",
                    "attributes": {
                        "type": "text",
                        "isEditable": []
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "contractValue",
                    "width": 150,
                    "displayName": "P2P_Req_ContractValue",
                    "isVisible": true,
                    "isReadOnly": true,
                    "uiType": "editable",
                    "attributes": {
                        "type": "number",
                        "isEditable": []
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "contractExpiryDate",
                    "width": 150,
                    "displayName": "P2P_Req_ContractExpiryDate",
                    "isMandatory": false,
                    "isVisible": false,
                    "isReadOnly": true,
                    "uiType": "editable",
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "ContractItems.name",
                    "width": 150,
                    "displayName": "P2P_Req_Contractitems",
                    "isMandatory": false,
                    "isVisible": true,
                    "uiType": "editable",
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    //"rules": ["ContractSourceTypeCheck", "ContractItemDisableCheck", "emptyCheck"],
                    "attributes": {
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3", "0_202"],
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
                    "type": "editable"
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "comments",
                    "width": 150,
                    "displayName": "P2P_Common_Comments",
                    "uiType": "popup",
                    "isVisible": true,
                    "isReadOnly": false,
                    "isRegClickCol": true,
                    "attributes": {
                        "type": "commentsAndAttachmentsPopup",
                        "defaultLabelCondition": "row.entity.notes && row.entity.notes.length > 0 ? \"View\" : \"Add\""
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "source.name",
                    "width": 150,
                    "displayName": "P2P_REQ_ItemSource",
                    "isMandatory": false,
                    "isVisible": false,
                    "isReadOnly": true,
                    // "type": "textfield",
                    "uiType": "editable",
                    "enableTranslation": true,
                    "attributes": {
                        "type": "text",
                        "model": "source",
                        "dataKey": "name"
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                }
            ]
        },
        {
            "title": "P2P_SC_Accounting",
            "key": "Accounting",
            "modelKey": "splits",
            "enableTranslation": true,
            "gridActions": [
                {
                    "title": "P2P_SC_DeleteButton"
                }
            ],
            "columnDefs": [
                {
                    "field": "splitIndex",
                    "width": 150,
                    "displayName": "P2P_REQ_Index",
                    "isFixed": "Left",
                    "isMandatory": true,
                    "pinnedLeft": true,
                    "Visible": false,
                    "isReadOnly": true,
                    "_treeHeaderReadOnly": true,
                    "autoIncrement": true,
                    "attributes": {
                        "isEditable": []
                    },
                    "filterObject": {
                        "enableFiltering": true
                    },
                    "maxWidth": 260
                },
                {
                    "field": "lineNumber",
                    "width": 150,
                    "displayName": "P2P_Req_LineNo",
                    "isFixed": "Left",
                    "pinnedLeft": true,
                    "isMandatory": true,
                    "_treeHeaderReadOnly": true,
                    "isVisible": true,
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
                    "pinnedLeft": true,
                    "isMandatory": false,
                    "isVisible": false,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "autoIncrement": false,
                    "uiType": "editable",
                    "attributes": {
                        "isEditable": [],
                        "type": "text"
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "description.desc",
                    "width": 150,
                    "displayName": "P2P_Req_PartnerItemName",
                    "isFixed": "Left",
                    "isMandatory": true,
                    "_treeHeaderReadOnly": true,
                    "isVisible": true,
                    "isReadOnly": true,
                    "attributes": {
                        "type": "text",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3"],
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "splitNumber",
                    "width": 150,
                    "displayName": "P2P_Req_SplitNumber",
                    "isVisible": true,
                    "isReadOnly": true,
                    "isMandatory": false,
                    "_treeHeaderReadOnly": true,
                    "isRegClickCol": true,
                    "attributes": {
                        "type": "text",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3"],
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },

                // {
                //   "field": "splitType",
                //   "width": 150,
                //   "displayName": "split",
                //   "isVisible": true,
                //   "isReadOnly": "p2pValidationService.isReadOnly",
                //   "isFixed": "Left",
                //   "isRegClickCol": true,
                //   "isMandatory": true,
                //   "_treeHeaderReadOnly": true,
                //   "type": "popup",
                //   "attributes": {
                //       "type": "splitsPopup",
                //       "defaultLabelCondition": "row.entity.splitType===0?(row.entity.type.id===1?\"Quantity\":\"Amount\"):\"Percentage\"",
                //       "isEditable": ["0_1", "0_23", "0_24", "0_1_3"],
                //   },
                //   "filterObject": {
                //       "enableFiltering": true
                //   }
                // },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "Splitquantity",
                    "width": 150,
                    "displayName": "quantity",
                    "isVisible": true,
                    "isReadOnly": true,
                    "type": "editable",
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "splitValue",
                    "width": 150,
                    "displayName": "P2P_Req_SplitValue",
                    "isVisible": true,
                    "isReadOnly": true,
                    "type": "editable",
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "Splittax",
                    "width": 150,
                    "displayName": "P2P_Req_Taxes",
                    "_treeHeaderReadOnly": true,
                    "isVisible": true,
                    "isReadOnly": true,
                    "type": "editable",
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "otherCharges",
                    "width": 150,
                    "_treeHeaderReadOnly": true,
                    "displayName": "P2P_Req_OtherCharges",
                    "isVisible": true,
                    "isReadOnly": true,
                    "type": "editable",
                    "uiType": "editable",
                    "attributes": {
                        "type": "number",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3"],
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "splitItemTotal",
                    "width": 150,
                    "_treeHeaderReadOnly": true,
                    "displayName": "P2P_Req_TotalSplitValue",
                    "type": "editable",
                    "uiType": "editable",
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
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "requester.name",
                    "width": 150,
                    "_treeHeaderReadOnly": true,
                    "displayName": "P2P_REQ_Requester",
                    "isVisible": true,
                    "isReadOnly": "p2pValidationService.isReadOnly",
                    "isRegFocusCol": true,
                    "type": "editable",
                    "uiType": "editable",
                    "attributes": {
                        "type": "autocomplete",
                        "model": "requester",
                        "filterkeys": ["name"],
                        "displayformat": "{name}",
                        "optionformat": "{name}",
                        "isEditable": ["0_1", "0_23", "0_24", "0_1_3"],
                        "populateListOnFocus": true,
                        "minchars": 0
                    },
                    "filterObject": {
                        "enableFiltering": true
                    }
                },
                {
                    "pinnedLeft": false,
                    "enableCellEdit": true,
                    "enableFiltering": true,
                    "field": "period.name",
                    "width": 150,
                    "displayName": "P2P_REQ_Period",
                    "isVisible": true,
                    "isReadOnly": true,
                    "isRegFocusCol": true,
                    "type": "editable",
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

window._clientSpecificConfigSettings = _clientSpecificConfigSettings;
