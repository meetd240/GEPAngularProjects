var _clientSpecificConfigSettings = {
    "header": {
        "documentType": 31,
        "sections": [
            {
                "label": "P2P_SC_BasicDetails",
                "id": "BasicDetails",
                "isMandatory": true,
                "isCollapsible": true,
                "isDraggable": true,
                "index": 0,
                "routeName": "id0/0",
                "rows": [
                    {
                        "properties": [
                            {
                                "label": "P2P_SC_ServiceConfirmationNumber",
                                "type": "textfield",
                                "isMandatory": true,
                                "data": "basicDetails.ServiceConfirmationNumber",
                                "attributes": {
                                    "disable": true,
                                    "maxlength": 100
                                }
                            },
                            {
                                "label": "P2P_SC_ServiceConfirmationName",
                                "type": "textfield",
                                "isMandatory": true,
                                "onChange": "triggerHeaderRules($event)",
                                "data": "basicDetails.DocumentName",
                                "attributes": {
                                    "maxlength": 100,
                                    "type": "textfield",
                                    "disable": true
                                },
                                "rules": ["emptyCheck"]
                            },
                            {
                                "label": "P2P_SC_SupplierServiceConfirmationNumber",
                                "type": "textfield",
                                "isMandatory": true,
                                "onChange": "triggerHeaderRules($event)",
                                "data": "basicDetails.SupplierServiceConfirmationNumber",
                                "attributes": {
                                    "type": "textfield",
                                    "disable": true
                                },
                                "rules": ["emptyCheck"]
                            },
                            {
                                "label": "P2P_SC_Description",
                                "type": "textfield",
                                "isMandatory": false,
                                "data": "basicDetails.Description",
                                "attributes": {
                                    "disable": true
                                }
                            },
                            {
                                "label": "P2P_SC_OrderNumber",
                                "type": "textfield",
                                "isMandatory": true,
                                "data": "basicDetails.OrderNumber",
                                "attributes": {
                                    "disable": true
                                }
                            },
                            {
                                "label": "P2P_SC_OrderName",
                                "type": "textfield",
                                "isMandatory": true,
                                "data": "basicDetails.OrderName",
                                "attributes": {
                                    "disable": true
                                }
                            },
                            {
                                "label": "P2P_SC_Currency",
                                "type": "textfield",
                                "isMandatory": true,
                                "data": "basicDetails.Currency",
                                "attributes": {
                                    "disable": true
                                }
                            }, {
                                "label": "P2P_SC_SupplierCode",
                                "type": "textfield",
                              "isMandatory": true,
                                "data": "basicDetails.ClientPartnerCode",
                                "attributes": {
                                    "disable": true
                                }
                            }, {
                                "label": "P2P_SC_SupplierName",
                                "type": "textfield",
                                "isMandatory": true,
                                "data": "basicDetails.SupplierName",
                                "attributes": {
                                    "disable": true
                                }
                            }, {
                                "label": "P2P_SC_CustomerContact",
                                "type": "autocomplete",
                                "isMandatory": true,
                                "onChange": "supervisorOnchange($event)",
                                "data": "basicDetails.customerContactObj",
                                "onSelect": "supervisorOnSelect($event)",
                                "attributes": {
                                    "type": "autocomplete",
                                    "isMandatory": true,
                                    "optionformat": "{Name}",
                                    "displayformat": "{Name}",
                                    "options": []
                                },
                            },
                            {
                                "label": "P2P_SC_CreatedBy",
                                "type": "textfield",
                                "isMandatory": true,
                                "data": "basicDetails.CreatedBy",
                                "attributes": {
                                    "disable": true
                                }
                            },
                            {
                                "label": "P2P_SC_CreatedOn",
                                "type": "date",
                                "isMandatory": true,
                                "data": "basicDetails.CreatedOn",
                                "attributes": {
                                    "disable": true
                                }
                            },
                            {
                                "label": "P2P_SC_SubmittedBy",
                                "type": "textfield",
                                "isMandatory": true,
                                "showInDraft": false,
                                "data": "basicDetails.SubmittedBy",
                                "attributes": {
                                    "disable": true,
                                    "readonly": true
                                }
                            },
                            {
                                "label": "P2P_SC_SubmittedOn",
                                "type": "date",
                                "isMandatory": true,
                                "showInDraft": false,
                                "data": "basicDetails.SubmittedOn",
                                "attributes": {
                                    "disable": true,
                                    "readonly": true
                                }

                            }

                        ]
                    }
                ]
            },
            {
                "label": "P2P_SC_LineDetails",
                "id": "LineDetails",
                "headerTemplate": "",
                "isMandatory": true,
                "isCollapsible": true,
                "isActive": true,
                "isDraggable": true,
                "index": 0,
                "routeName": "lds",
                "rows": [

                ]
            }
        ],
        
    }
}



window._clientSpecificConfigSettings = _clientSpecificConfigSettings;
