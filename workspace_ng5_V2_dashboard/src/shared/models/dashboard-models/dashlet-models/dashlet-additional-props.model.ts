import { Injectable } from '@angular/core';

// @Injectable()
export class DashletAdditionalProps {


    //Provides height for individual dashlet.
    height: number;

    // Provides minimum width for individual dashlet.
    minWidth: number;

    // Provides width for individual dashlet.
    width: number;

    // Provides minimum height for individual dashlet.
    minHeight: number;

    // Provides x position for individual dashlet.
    x: number;

    // Provides x position for individual dashlet.
    y: number;

    //Provide the flag to whether show the option Show Title or Hide Title.
    titleFlag: boolean = false;

    //Provide the flag to whether show the option Show Percentage Value or Hide Percentage Value.
    percentageFlagSummaryCard: boolean = false;

    constructor(dashletAdditionalProps: any) {
        this.height = dashletAdditionalProps.height;
        this.minWidth = dashletAdditionalProps.minWidth;
        this.width = dashletAdditionalProps.width;
        this.minHeight = dashletAdditionalProps.minHeight;
        this.x = dashletAdditionalProps.x;
        this.y = dashletAdditionalProps.y;
        this.titleFlag = dashletAdditionalProps.titleFlag != undefined && dashletAdditionalProps.titleFlag != null && dashletAdditionalProps.titleFlag != "" ? dashletAdditionalProps.titleFlag : this.titleFlag;
        this.percentageFlagSummaryCard = dashletAdditionalProps.percentageFlagSummaryCard != undefined && dashletAdditionalProps.percentageFlagSummaryCard != null && dashletAdditionalProps.percentageFlagSummaryCard !=""? dashletAdditionalProps.percentageFlagSummaryCard : this.percentageFlagSummaryCard;
    }
}