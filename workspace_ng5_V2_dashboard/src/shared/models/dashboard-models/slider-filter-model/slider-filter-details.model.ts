import { Injectable } from '@angular/core';
import { IRange } from '@vsCommonInterface';


// Class provides instance properties for DashletInfo which will be used for Slider Widget.

// @Injectable()
export class SliderFilterDetails {

    // ReportObjectId is Unique Identifier for Reporting Object.
    reportObjectId: string;

    // ReportObjectName provides reporting Object Name.
    reportObjectName: string;

    ///
    range: IRange;

    // "min" property provides minimum range of Slider Filter.
    min: number;

    // "max" property provides minimum range of Slider Filter.
    max: number;

    // "defaultRangeFrom" property provides default range of Slider Filter.
    defaultRangeFrom: number;

    // "defaultRangeTo" property provides default range of Slider Filter.
    defaultRangeTo: number;

    // "sliderTooltipConfig" property provides tooltip message and position for slider filter information icon
    sliderTooltipConfig: any;

}
