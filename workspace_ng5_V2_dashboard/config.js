var _clientSpecificConfigSettings = {
  "header": {
    "documentType": 28,
    "sections": [
      {
        "label": "CW_lblBasicDetails",
        "id": "BasicDetails",
        "isMandatory": true,
        "headerTemplate": '',
        "isCollapsible": true,
        "isActive": true,
        "isDraggable": true,
        "index": 0,
        "routeName": "bds",
        "rows": [{
          "properties": [
            {
              "label": "CW_lblCategoryWorkbenchNumber",
              "type": "textfield",
              "isMandatory": true,
              "data": "basicDetails.documentNumber",
              "attributes": {
                "disable": true,
                "maxlength": 100
              }
            },
            {
              "label": "CW_lblCategoryWorkbenchName",
              "type": "textfield",
              "isMandatory": true,
              "data": "basicDetails.documentName",
              "attributes": {
                "disable": false,
                "placeholder":" ",
                "maxlength": 100
              }
            },
            {
              "label": "CW_lblOwnershipLevel",
              "type": "select",
              "isMandatory": true,
              "data": "basicDetails.ownershipLevel",
              "dataKey":"dataID",
              "displayKey":"title",
              options:[],
              "attributes": {
                "disable": false
              }
            },
            {
              "label": "CW_lblExecutionLevel",
              "type": "select",
              "isMandatory": true,
              "data": "basicDetails.executionLevel",
              "dataKey":"dataID",
              "displayKey":"title",
              options:[],
              "attributes": {
                "disable": false
              }
            },
            
            {
              "label": "CW_lblCategoryManager",
              "placeholder": "",
              "type": "autocomplete",
              "isMandatory": true,
              "onChange": "onCategoryManagerChange($event)",
              "onLookupOpen":"onCategoryManagerLookupOpen($event)",
              "onLookupCancel":"onCategoryManagerLookupCancel($event)",
              "data": "basicDetails.categoryManager",
              //"onSelect": "onCurrencySelect($event)",
              //"subText":"contactCode",
              "attributes": {
                "type": "autocomplete",
                "isMandatory": true,
                "optionformat": "{value}",
                "displayformat": "{value}",
                "options": [],
                "lookupConfig":{
                  "showLookup":true,
                  "filterKey":["value"],
                  "titleofmodel":"CW_lblSelectCategoryManager",
                  //"descKey":"contactCode"
                }
              }
            },
            {
              "label": "CW_lblCategoryLead",
              "placeholder": "",
              "type": "autocomplete",
              "isMandatory": true,
              "onChange": "onCategoryLeadChange($event)",
              "onLookupOpen":"onCategoryLeadLookupOpen($event)",
              "onLookupCancel":"onCategoryLeadLookupCancel($event)",
              "data": "basicDetails.categoryLead",
              //"onSelect": "onCurrencySelect($event)",
              //"subText":"contactCode",
              "attributes": {
                "type": "autocomplete",
                "isMandatory": true,
                "optionformat": "{contactName}",
                "displayformat": "{contactName}",
                
                "options": [],
                "lookupConfig":{
                  "showLookup":true,
                  "filterKey":["contactName"],
                  "titleofmodel":"CW_lblSelectCategoryLead",
                  //"descKey":"contactCode"
                }
              }
            },
            {
              "label": "CW_lblCurrency",
              "type": "select",
              "isMandatory": true,
              "data": "basicDetails.currency",
              "dataKey":"currencyID",
              "displayKey":"currencyCode",
              options:[],
              "attributes": {
                "disable": false
              }
            },
            {
              "label": "CW_CategoryClassification",
              "type": "select",
              "isMandatory": true,
              "data": "basicDetails.categoryClassification",
              "dataKey":"CategoryClassificationId",
              "displayKey":"CategoryClassificationName",
              options:[],
              "attributes": {
                "disable": false
              }
            },
            {
              "label": "CW_lblDescription",
              "type": "textfield",
              "isMandatory": false,
              "data": "basicDetails.description",
              "attributes": {
                "disable": false,
                "placeholder": " ",
                "isVisible":true,
                "maxlength": 1000
              }
            },
            
          ]
        }
      ]
      },
      {
        "label": "CW_lblScope",
        "id": "CBRDetails",
        "isMandatory": true,
        "headerTemplate": '',
        "isCollapsible": true,
        "isActive": true,
        "isDraggable": true,
        "index": 0,
        "routeName": "cbr",
        "rows": [{
          "properties": [
            // {
            //   "label": "CW_lblCategory",
            //   "type": "custom",
            //   "isMandatory": true,
            //   "isVisible":true,
            //   "data": "cbrDetails.categoryCode",
            //   "attributes": {
            //     "disabled": false,
            //     "hasLabel": true,
            //     "label": "CW_lblCategory",
            //     "maxlength": 100
            //   }
            // },
            // {
            //   "label": "CW_lblRegion",
            //   "type": "custom",
            //   "isMandatory": true,
            //   "isVisible":true,
            //   "data": "cbrDetails.regionCode",
            //   "attributes": {
            //     "disabled": false,
            //     "hasLabel": true,
            //     "label": "CW_lblRegion",
            //     "maxlength": 100
            //   }
            // },
            // {
            //   "label": "CW_lblBusinessUnit",
            //   "type": "custom",
            //   "isMandatory": true,
            //   "isVisible":true,
            //   "data": "cbrDetails.businessUnitCode",
            //   "attributes": {
            //     "disabled": false,
            //     "hasLabel": true,
            //     "label": "CW_lblBusinessUnit",
            //     "maxlength": 100
            //   }
            // },
          ]
        }
      ]
      },
       {
        "label": "CW_lblDefineBudget",
        "id": "smart-table",
        "isMandatory": true,
        "headerTemplate": '',
        "isCollapsible": true,
        "isActive": true,
        "isDraggable": true,
        "index": 0,
        "routeName": "tbl",
        "rows": []
      },
    ]
  },
}

window._clientSpecificConfigSettings = _clientSpecificConfigSettings;
