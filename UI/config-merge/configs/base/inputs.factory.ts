import { IBaseInput, BaseInput, TextInput, NumericInput, CheckboxInput, ICheckboxInput, ITextInput, IDateInput, DateInput, SelectInput, ISelectInput, AutosuggestInput, IAutosuggestInput, INumericInput } from "../../smart-core-types";
import * as _ from "lodash";

//#region => Types Factory
export const inputsFactory = <T extends BaseInput, I extends IBaseInput>(args: I): T => {
 let config = _.merge({}, new inputTypes[args.type](inputDefaults[args.type]), args);
 if(config.attributes && config.attributes.disable){
	 config.behaviour['tabIndex'] = -1;
 }
 return config;
}
//#endregion

//#region => Tab Index Generator
var tabIndex = 0;
export const nextTabIndex = () => { return tabIndex; }
//#endregion

//#region => Input Types Lookup
export const inputTypes = {
	text: TextInput,
	numeric: NumericInput,
	date: DateInput,
	select: SelectInput,
	autosuggest: AutosuggestInput,
	checkbox: CheckboxInput,
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
		},
		validation: {
			enableValidation: true,
			onInitValidation: true
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
		},
		validation: {
			enableValidation: true,
			onInitValidation: true
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
		},
		validation: {
			enableValidation: true,
			onInitValidation: true
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
		},
		validation: {
			enableValidation: true,
			onInitValidation: true
		}
	} as IAutosuggestInput,
	numeric: {
		managerId: '',
		widgetId: '',
		fieldId: '',
		dataModelId: '',
		label: '',
		type: 'numeric',
		manifestPath: '',
		data: '',
		isMandatory: true,
		isVisible: true,
		attributes: {
			disable: false,
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
		},
		validation: {
			enableValidation: true,
			onInitValidation: true
		}
	} as INumericInput,
	checkbox: {
		managerId: '',
		widgetId: '',
		fieldId: '',
		dataModelId: '',
		label: '',
		type: 'checkbox',
		manifestPath: '',
		data: '',
		isMandatory: true,
		isVisible: true,
		attributes: {
			disable: true,
			option: '',
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
	} as ICheckboxInput,
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
		events: {},
		validation: {
			enableValidation: true,
			onInitValidation: true
		}
	} as IBaseInput,
}
//#endregion
