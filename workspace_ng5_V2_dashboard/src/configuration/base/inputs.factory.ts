import { TextInput, NumericInput, ITextInput, IDateInput, DateInput, SelectInput, ISelectInput, AutosuggestInput, IAutosuggestInput } from "smart-core-types";
import { IBaseInput, BaseInput } from "smart-core-types";
import * as _ from "lodash";

//#region => Types Factory
export const inputsFactory = <T extends BaseInput, I extends IBaseInput>(args: I): T => _.merge({}, new inputTypes[args.type](inputDefaults[args.type]), args);
//#endregion

//#region => Tab Index Generator
var tabIndex = 0;
export const nextTabIndex = () => { tabIndex += 100; return tabIndex; }
//#endregion

//#region => Input Types Lookup
export const inputTypes = {
    text: TextInput,
    numeric: NumericInput,
    date:DateInput,
    select:SelectInput,
    autosuggest:AutosuggestInput, 
    custom: BaseInput
}
//#endregion

//#region => Input Defaults Lookup
export const inputDefaults = { 
    text: {
        managerId: '',
        widgetId: '',
        fieldId: '',
        dataModelId: '',
        label: '',
        type: 'text',
        manifestPath: '',
        data: '',
        isMandatory: true,
        isVisible: true,
        attributes: {
            disable: false,
            minLength: 0,
            maxLength: 100,
            isEditable: [],
            isShown: [],
            placeholder: '',
            textAlign: 'left'
        },
        behaviour: {
            subType: 'text',
            colspan: 1,
            cssClasses: [],
            isConfigEditable: false,
            rowIndex: 0,
            listIndex: 0,
            tabIndex: nextTabIndex(),
            isDocked: false,
            autoRender: false
        },
        events: {
            focus: '',
            blur: '',
            keydown: '',
            keyup: '',
            ngModelChange: '',
            onModelChange: ''
        }
    } as ITextInput,
    date: {
        managerId: '',
        widgetId: '',
        fieldId: '',
        dataModelId: '',
        label: '',
        type: 'date',
        manifestPath: '',
        data: '',
        isMandatory: true,
        isVisible: true,
        attributes: {
            disable: false,
            minLength: 0,
            maxLength: 100,
            isEditable: [],
            isShown: [],
            placeholder: '',
            textAlign: 'left'
        },
        behaviour: {
            subType: 'text',
            colspan: 1,
            cssClasses: [],
            isConfigEditable: false,
            rowIndex: 0,
            listIndex: 0,
            tabIndex: nextTabIndex(),
            isDocked: false,
            autoRender: false
        },
        events: {
            focus: '',
            blur: '',
            keydown: '',
            keyup: '',
            ngModelChange: '',
            onModelChange: ''
        }
    } as IDateInput,
    select: {
        managerId: '',
        widgetId: '',
        fieldId: '',
        dataModelId: '',
        label: '',
        type: 'select',
        manifestPath: '',
        data: '',
        isMandatory: true,
        isVisible: true,
        attributes: {
            disable: false,
            isEditable: [],
            isShown: [],
            placeholder: '',
            textAlign: 'left',
            dataKey: '',
            displayKey: '',
            options: []
        },
        behaviour: {
            subType: 'text',
            colspan: 1,
            cssClasses: [],
            isConfigEditable: false,
            rowIndex: 0,
            listIndex: 0,
            tabIndex: nextTabIndex(),
            isDocked: false,
            autoRender: false
        },
        events: {
            focus: '',
            blur: '',
            keydown: '',
            keyup: '',
            ngModelChange: '',
            onModelChange: ''
        }
    } as ISelectInput,
    autosuggest: {
        managerId: '',
        widgetId: '',
        fieldId: '',
        dataModelId: '',
        label: '',
        type: 'autosuggest',
        manifestPath: '',
        data: '',
        isMandatory: true,
        isVisible: true,
        attributes: {
            disable: false,
            isEditable: [],
            isShown: [],
            placeholder: '',
            textAlign: 'left',
            displayformat: '',
            optionformat: '',
            options: []
        },
        behaviour: {
            colspan: 1,
            cssClasses: [],
            isConfigEditable: false,
            rowIndex: 0,
            listIndex: 0,
            tabIndex: nextTabIndex(),
            isDocked: false,
            autoRender: false
        },
        events: {
            focus: '',
            blur: '',
            keydown: '',
            keyup: '',
            ngModelChange: '',
            onModelChange: ''
        }
    } as IAutosuggestInput, 
    custom: {
        managerId: '',
        widgetId: '',
        fieldId: '',
        dataModelId: '',
        label: '',
        type: 'custom',
        manifestPath: '',
        data: '',
        isMandatory: true,
        isVisible: true,
        attributes: {
            disable: false,
            isEditable: [],
            isShown: [],
        },
        behaviour: {
            colspan: 1,
            cssClasses: [],
            isConfigEditable: false,
            rowIndex: 0,
            listIndex: 0,
            tabIndex: 0,
            isDocked: false,
            autoRender: true
        },
        events: {}
    } as IBaseInput
 
}
//#endregion
