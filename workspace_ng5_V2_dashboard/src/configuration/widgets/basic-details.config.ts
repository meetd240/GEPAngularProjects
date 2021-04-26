import { Optional } from '@angular/core';
import {
    TextInput, ITextInput, DateInput, IDateInput,
    AutosuggestInput, IAutosuggestInput, SelectInput, ISelectInput, selectInput, baseInput, IBaseInput, BaseInput
} from "smart-core-types";
import { inputsFactory } from "../base/inputs.factory";
import { AnalyticsCommonConstants }  from '@vsAnalyticsCommonConstants';

export const basicDetailsFields = [
    inputsFactory<TextInput, ITextInput>({
        fieldId: 'reportNameId',
        label: "ReportName",
        dataModelId: 'basicDetails',
        data: 'reportName',
        type: 'text',
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: false,
            maxLength: 100
        },
        behaviour: {
            colspan: 1
        },
        events: {

        }

    }),
    inputsFactory<TextInput, ITextInput>({
        fieldId: 'anomalyTypeId',
        label: "AnomalyType",
        dataModelId: 'basicDetails',
        data: 'anomalyType',
        type: 'text',
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: false,
            maxLength: 100
        },
        behaviour: {
            colspan: 1
        },
        events: {

        }

    }),
    inputsFactory<TextInput, ITextInput>({
        fieldId: 'modelDescriptionId',
        label: "ModelDescription",
        dataModelId: 'basicDetails',
        data: 'modelDescription',
        type: 'text',
        manifestPath: 'embedded-text/text',
        attributes: {
            disable: false,
            maxLength: 200
        },
        behaviour: {
            colspan: 3
        },
        events: {

        }

        
    })

]	