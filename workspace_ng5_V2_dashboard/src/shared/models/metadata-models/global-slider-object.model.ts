
    export class GlobalSliderObject {
    //Provides min of the global slider.
    globalSliderMin: number;
    
    //Provides max of the global slider.
    globalSliderMax: number;

    //Provides height for individual global slider.
    height: number;

    // Provides minimum width for individual global slider.
    minWidth: number;

    // Provides width for individual global slider.
    width: number;

    // Provides minimum height for individual global slider.
    minHeight: number;

    // Provides x position for individual global slider.
    x: number;

    // Provides x position for individual global slider.
    y: number;

    //Provide ReportObjectId

    reportObjectId : string;

    constructor() {
        this.globalSliderMin = 0;
        this.globalSliderMax = 0;
        this.height = 2;
        this.minWidth = 2;
        this.width = 2;
        this.minHeight = 2;
        this.x = 0;
        this.y = 0;
        this.reportObjectId = undefined;
    }
}
