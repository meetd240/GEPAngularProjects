import {
    TextInput, ITextInput, DateInput, IDateInput,
    AutosuggestInput, IAutosuggestInput, SelectInput, ISelectInput, selectInput, NumericInput, INumericInput, CheckboxInput, ICheckboxInput, checkboxInput, IBaseInput, BaseInput
} from "smart-core-types";
import { inputsFactory } from "../base/inputs.factory";
import { DataModelNames } from '../../../src/modules/enums/sections.enum';

export const basicDetailsFields = [
    inputsFactory<TextInput, ITextInput>({
        fieldId: 'requisitionName',
        label: 'P2P_Req_Name',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'requisitionName',
        type: 'text',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-text/text',
        attributes: {
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
            disable: false,
            placeholder: "",
            maxLength: 50
         
        },
        behaviour: {
            listIndex: 0,
            isConfigEditable: false
        }
    }),inputsFactory<TextInput, ITextInput>({
        fieldId: 'requisitionNumber',
        label: 'P2P_Req_Number',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'requisitionNumber',
        type: 'text',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: true,
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: []
                            
        },
        behaviour: {
            listIndex: 1,
            isConfigEditable: false
        }
    }),inputsFactory<TextInput, ITextInput>({
        fieldId: 'createdBy',
        label: 'P2P_Req_CreatedBy',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'createdBy.name',
        type: 'text',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: true,
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: [],
        },
        behaviour: {
            listIndex: 2,
            isConfigEditable: false
        }
    }),inputsFactory<DateInput, IDateInput>({
        fieldId: 'createdOn',
        label: 'CreatedOn',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'CreatedOn',
        type: 'date',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-date/date',
        attributes: {
            disable: true,
            isEditable: [],
        },
        behaviour: {
            listIndex: 3,
            isConfigEditable: false
        }
    }),inputsFactory<AutosuggestInput, IAutosuggestInput>({
        fieldId: 'currency',
        label: 'PFM_Currency',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'currency',
        type: 'autosuggest',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-autosuggest/autosuggest',
        attributes: {
            disable: false,
            optionformat: '{CurrencyCode}',
            displayformat: '{CurrencyName}',
            options:[],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 4,
            isConfigEditable: false
        },
        events: {
            change: 'onChange_Currency',
            select : 'onSelect_Currency'
        },
        attachedConfig:{
            filterkeys: ["CurrencyCode"]
        }
    }),inputsFactory<AutosuggestInput, IAutosuggestInput>({
        fieldId: 'organization',
        label: 'P2P_Req_Organization',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'documentLOB',
        type: 'autosuggest',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-autosuggest/autosuggest',
        attributes: {
            disable: false,
            optionformat: '{entityDisplayName}',
            displayformat: '{entityDisplayName}',
            options:[],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 8,
            isConfigEditable: false
        },
        events: {
            select : 'lobOnSelect',
            change : 'lobOnChange'
        },
        attachedConfig:{
            filterkeys: ["entityDisplayName"]
        }
    }),
    
    inputsFactory<BaseInput, IBaseInput>({
        fieldId: 'suborganization',
        label: 'P2P_Req_Organization',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'documentLOB',
        type: 'custom',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'basicDetailsOrganizationInput/orgnization',
        attributes: {
            disable: false,
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 8,
            isConfigEditable: false
        },
        events: {
            select : 'lobOnSelect',
            change : 'lobOnChange',
            click: 'openOrgnizationTreePopup',
        },
        attachedConfig:{
            filterkeys: ["entityDisplayName"]
        }
    }),
    
    inputsFactory<AutosuggestInput, IAutosuggestInput>({
        fieldId: 'onBehalfOf',
        label: 'P2P_Req_OnBehalfOf',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'obo',
        type: 'autosuggest',
        isMandatory: false,
        isVisible: true,
        manifestPath: 'embedded-autosuggest/autosuggest',
        attributes: {
            disable: false,
            optionformat: '{name} ({email})',
            displayformat: '{name}',
            options:[],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 9,
            isConfigEditable: false,
            cssClasses: ["non-mandatory"]
        },
        attachedConfig:{
            rules:[],
            filterkeys: ["name"],
        },
        events: {
            select : 'onSelect_OBO',
            change : 'onChange_OBO',
            blur : 'obo_OnBlur',
            onShowLookupClick: 'onOboShowLookupClick'     
        },
        showLookup: {
            isVisible: true
        },
    }),inputsFactory<AutosuggestInput, IAutosuggestInput>({
        fieldId: 'ContractNumberField',
        label: 'P2P_Req_ContractNumber',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'contract',
        type: 'autosuggest',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-autosuggest/autosuggest',
        attributes: {
            disable: false,
            optionformat: "{code}-{name}",
            displayformat: '{code}-{name}',
            options:[],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 6,
            isConfigEditable: false
        },
        events: {
            select : 'onContractNumberSelect',
            change : 'onContractNumberChange',
            blur :   'onBlurContract',          
            onShowLookupClick: 'onContractNumberShowLookupClick'     
        },
        attachedConfig:{
            filterkeys: ["code", "name"]
        }
    }),
    inputsFactory<SelectInput, ISelectInput>({
        fieldId: 'purchaseType',
        label: 'PurchaseType',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'purchaseType',
        type: 'select',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-select/select',
        attributes: {
            disable: false,
            dataKey: 'id',
            displayKey: 'name',
            options:[],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 5,
        },
        validation: {
            enableValidation: true,
            onInitValidation: true
        },
        events: {
            ngModelChange:'onChangePurchaseType',
        }
    }),inputsFactory<CheckboxInput,ICheckboxInput>({
        fieldId: 'urgent',
        label: 'P2P_Req_Urgent',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'isUrgent',
        type: 'checkbox',
        isMandatory: false,
        isVisible: true,
        manifestPath: 'embedded-checkbox/checkbox',
        attributes: {
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
            option:[],
            disable:false
        },
        behaviour: {
            listIndex: 10,
            isConfigEditable: false
        }
    }),inputsFactory<CheckboxInput,ICheckboxInput>({
        fieldId: 'RiskForm',
        label: 'P2P_REQ_RiskForm',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'enableRiskForm',
        type: 'checkbox',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'embedded-checkbox/checkbox',
        attributes: {
            isShown: ["0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
            option:[],
            disable:false
        },
        behaviour: {
            listIndex: 21,
            isConfigEditable: false
        },
        events: {
            ngModelChange: 'onRiskFormCheckBoxChange'
        }
    }),inputsFactory<TextInput, ITextInput>({
        fieldId: 'RiskScore',
        label: 'P2P_Req_RiskScore',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'riskScore',
        type: 'text',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: true,
            isShown: ["0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: [],
        },
        behaviour: {
            listIndex: 22,
            isConfigEditable: false
        }
    }),inputsFactory<TextInput, ITextInput>({
        fieldId: 'RiskFormCategory',
        label: 'P2P_Req_RiskCategory',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'riskFormCategory',
        type: 'text',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: true,
            isShown: ["0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: [],
        },
        behaviour: {
            listIndex: 23,
            isConfigEditable: false
        }
    }),inputsFactory<TextInput,ITextInput>({
        fieldId: 'sourceSystem',
        label: 'P2P_REQ_Source_System',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'sourceSystem.name',
        type: 'text',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: true,
            isShown: ["0_1", "0_23", "0_23_4", "0_22", "0_22_4", "0_24", "0_24_4", "0_41", "0_142", "0_142_5", "0_25", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_1_10", "0_121_10", "0_78", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_21_4", "0_41_4", "0_25_4", "0_121_4", "1_121_4", "0_141", "0_141_5", "0_141_4", "0_202"],
            isEditable: []

        },
        behaviour: {
            listIndex: 11,
            isConfigEditable: false
        }
    }),inputsFactory<AutosuggestInput, IAutosuggestInput>({
        fieldId: 'buyerAssignee',
        label: 'P2P_Req_BuyerAssignee',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'buyerAssigneeName',
        type: 'autosuggest',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'embedded-autosuggest/autosuggest',
        attributes: {
            disable: false,
            optionformat: "{name} ({email})",
            displayformat: '{name}',
            options:[],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121"],
        },
        behaviour: {
            listIndex: 12,
            isConfigEditable: false
        },
        events: {
            select : 'OnSelect_Buyer',
            change : 'OnChange_Buyer',
            blur :   'OnBlur_Buyer'
        },
        attachedConfig:{
            filterkeys: ["name"]
        }
    }),inputsFactory<BaseInput,IBaseInput>({
        fieldId: 'interfaceStatus',
        label: 'P2P_REQ_InterfaceStatus',
        dataModelId: DataModelNames.BASICDETAILS,
        data: '',
        type: 'custom',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'interface-status/interfaceStatus',
        attributes: {
            disable: true,
            isShown: ["0_1", "0_23", "0_23_4", "0_22", "0_22_4", "0_24", "0_24_4", "0_41", "0_142", "0_142_5", "0_25", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_1_10", "0_121_10", "0_78", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_21_4", "0_41_4", "0_25_4", "0_121_4", "1_121_4", "0_141", "0_141_5", "0_141_4", "0_202"],
            isEditable: []
        },
        behaviour: {
            listIndex: 100,
            isConfigEditable: false
        }
    }), inputsFactory<AutosuggestInput, IAutosuggestInput>({
    fieldId: 'costApprover',
    label: 'P2P_REQ_CostApprover',
    dataModelId: DataModelNames.BASICDETAILS,
    data: 'costApprover',
    type: 'autosuggest',
    isMandatory: false,
    isVisible: false,
    manifestPath: 'embedded-autosuggest/autosuggest',
    attributes: {
        disable: false,
        optionformat: '{name} ({email})',
        displayformat: '{name}',
        options: [],
        isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
        isEditable: ["0_1", "0_23", "0_24", "0_121"]
    },
    behaviour: {
        listIndex: 12,
        isConfigEditable: false,
        cssClasses: []
    },
    attachedConfig: {
        rules: [],
        filterkeys: ["name"],
    },
    events: {
        change: 'onChange_CostApprover',
        blur : 'OnBlur_CostApprover',
        onShowLookupClick: 'onCostApproverShowLookupClick'
    },
    showLookup: {
        isVisible: true
    },
}),inputsFactory<TextInput,ITextInput>({
        fieldId: 'ERPReferenceNumber',
        label: 'P2P_REQ_ERPReferenceNumber',
        dataModelId: DataModelNames.BASICDETAILS,
        data: 'ERPReferenceNumber',
        type: 'text',
        isMandatory: true,
        isVisible: false,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: true,
            isShown: ["0_1", "0_23", "0_23_4", "0_22", "0_22_4", "0_24", "0_24_4", "0_41", "0_142", "0_142_5", "0_25", "0_42", "0_59", "0_169", "0_21", "0_121", "0_121_5", "0_1_10", "0_121_10", "0_78", "0_1_5", "0_25_10", "0_41_10", "0_169_4", "0_169_5", "0_21_5", "0_22_5", "0_23_5", "0_24_5", "0_25_5", "0_41_5", "0_42_5", "0_21_4", "0_41_4", "0_25_4", "0_121_4", "1_121_4", "0_141", "0_141_5", "0_141_4", "0_202"],
            isEditable: []

        },
        behaviour: {
            listIndex: 11,
            isConfigEditable: false
        }
    })
]	
    
