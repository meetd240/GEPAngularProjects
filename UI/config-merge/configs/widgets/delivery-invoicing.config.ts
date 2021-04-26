import {
    TextInput, ITextInput, DateInput, IDateInput,
    AutosuggestInput, IAutosuggestInput, SelectInput, ISelectInput, selectInput, NumericInput, INumericInput, CheckboxInput, ICheckboxInput, BaseInput, IBaseInput
} from "smart-core-types";
import { inputsFactory } from "../base/inputs.factory";
import { DataModelNames } from '../../../src/modules/enums/sections.enum';
export const deliveryInvoicingFields = [
    inputsFactory<BaseInput, IBaseInput>({
        fieldId: 'SHIPTOSUBSECTION',
        label: 'P2P_CMN_ShipTo',
        dataModelId: DataModelNames.DELIVERYINVOICING,
        data: 'shipTo',
        type: 'custom',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'DI-shipTo/shipTo',
        attributes: {
            disable: false,

        },
        behaviour: {
            listIndex: 0,
            rowIndex: 0,
            colspan: 5
        },
        attachedConfig: {
            childConfig: [
                inputsFactory<AutosuggestInput, IAutosuggestInput>({
                    fieldId: 'ShipTo',
                    label: 'P2P_Common_ShipToOrServiceTo',
                    dataModelId: DataModelNames.DELIVERYINVOICING,
                    data: 'shipTo',
                    type: 'autosuggest',
                    isMandatory: true,
                    isVisible: true,
                    manifestPath: 'embedded-autosuggest/autosuggest',
                    attributes: {
                        // filterkeys: ['name', 'nameandnumber', 'address'],
                        optionformat: '{name}',
                        displayformat: '{name}',
                        options: [],
                        disable: false,
                        //    lookupConfig: {
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
                        change: 'shipTo_OnChange',
                        blur: 'shipTo_OnBlur',
                        select: 'shipTo_OnSelect',
                        openCustomPopup: "openAdHocShipToPopup",
                        onShowLookupClick: 'onShowLookupClick'
                    },
                    showLookup: {
                        isVisible: true
                    },
                    IButtonConfig: {
                        attributes: {

                            iButtonIcon: '#icon_addLocation',
                            iButtonType: 'custom',
                            tooltipMsg: "P2P_Common_AddAdhocLocation",
                            iButtonMsg: 'P2P_Common_AddAdhocLocation'
                        },

                        behaviour: {
                            isVisible: true,
                        },
                    },
                }),
                inputsFactory<TextInput, ITextInput>({
                    fieldId: 'ShipToAddress',
                    label: 'P2P_Common_ShipToAddressOrServiceAddress',
                    dataModelId: DataModelNames.DELIVERYINVOICING,
                    data: 'shipTo.address',
                    type: 'text',
                    isMandatory: true,
                    isVisible: true,
                    manifestPath: 'embedded-text/text',
                    attributes: {
                        // filterkeys: ['name', 'nameandnumber', 'address'],
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
            rules: ["shiptoMandatoryCheck"],
        }
    }),
    inputsFactory<TextInput, ITextInput>({
        fieldId: 'TAXJURISDICTION',
        label: 'P2P_TaxJurisdiction',
        dataModelId: DataModelNames.DELIVERYINVOICING,
        data: 'TaxJurisdiction',
        type: 'text',
        isMandatory: false,
        isVisible: false,
        manifestPath: 'embedded-text/text',
        validation: {
            enableValidation: false,
            onInitValidation: true
        },
        attributes: {
            disable: false,
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202","0_21", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121", "0_21"]
        },
        behaviour: {
            colspan: 1,
            isConfigEditable: false,
            rowIndex: 0,
            listIndex: 1,
        },
        events: {
            ngModelChange: 'taxJurisdiction_onChange'
        }
    }),
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
                    label: 'P2P_Common_ContactEmailOrPhone',
                    dataModelId: DataModelNames.DELIVERYINVOICING,
                    data: 'billTo.contact',
                    type: 'text',
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
            ],
            rules: []
        }
    }),
    inputsFactory<AutosuggestInput, IAutosuggestInput>({
        fieldId: 'DELIVERTOAUTOCOMPLETE',
        label: 'P2P_CMN_DeliverTo',
        dataModelId: DataModelNames.DELIVERYINVOICING,
        data: 'deliverTo',
        type: 'autosuggest',
        isMandatory: false,
        isVisible: true,
        manifestPath: 'embedded-autosuggest/autosuggest',
        attributes: {
            disable: false,
            optionformat: '{name}',
            displayformat: '{name}',
            options: [],
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121", "0_202"],
        },
        behaviour: {
            listIndex: 3,
            isConfigEditable: false
        },
        events: {
            change: 'deliverTo_onChange',
            select: 'deliverTo_onSelect',
            keyup: 'deliverTo_onBlur',
            keydown: 'deliverTo_onBlur'
        },
        attachedConfig: {
            filterkeys: ["name"],
        }
    }),
    inputsFactory<TextInput, ITextInput>({
        fieldId: 'DELIVERTOFREETEXT',
        label: 'P2P_CMN_DeliverTo',
        dataModelId: DataModelNames.DELIVERYINVOICING,
        data: 'deliverToStr',
        type: 'text',
        isMandatory: false,
        isVisible: true,
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: false,
            isShown: ["1_1", "0_1", "0_23", "0_24", "0_121", "0_21", "0_22", "0_62", "0_61", "0_56", "0_202", "0_254"],
            isEditable: ["0_1", "0_23", "0_24", "0_121", "0_202"]
        },
        behaviour: {
            listIndex: 4,
            isConfigEditable: false
        },
        events: {
            ngModelChange: 'deliverToFreeText_onChange'
        }
    })
]	
