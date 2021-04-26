import { ISelectInput, SelectInput } from "smart-core-types";
import { inputsFactory } from "../base/inputs.factory";


export const ProcurementProfileFields = [
    inputsFactory<SelectInput, ISelectInput>({
        fieldId: 'procurementDropDown',
        label: 'ProcurementProfile',
        dataModelId: 'procurementProfile',
        data: 'defaultProcurementProfile',
        type: 'select',
        isMandatory: true,
        isVisible: true,
        manifestPath: 'embedded-select/select',
        attributes: {
            disable: false,
            dataKey: 'id',
            displayKey: 'name',
            options:[],
            isShown: [],
            isEditable: [],
        },
        behaviour: {
            listIndex: 5,
        },
        validation: {
            enableValidation: true,
            onInitValidation: true
        },
        events: {
            ngModelChange: 'onChangeOfProcurmentProfile'
        }
    })
]
