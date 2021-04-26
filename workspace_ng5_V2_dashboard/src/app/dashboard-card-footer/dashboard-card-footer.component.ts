import { ChangeDetectorRef, Component, AfterViewInit, ChangeDetectionStrategy, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { CommonUtilitiesService } from "@vsCommonUtils";
import { AppConstants } from 'smart-platform-services';
import { DashboardCommService } from '@vsDashboardCommService';
@Component({
    selector: 'dashboard-card-footer',
    templateUrl: './dashboard-card-footer.component.html',
    styleUrls: ['./dashboard-card-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class DashboardCardFooterComponent implements OnInit, AfterViewInit {
    @Input() config: any;
    constants = DashboardConstants;
    cardPagination: any;
    breadCrumbList: any;
    breadCrumbUIConfig: any;
    uiConfig: any;
    previousTooltipConfig: any;
    nextTooltipConfig: any;
    linkedReportConfig:any;
    linkedToDashboardConfig: any;
    graphTitleConfig:any;
    drillUpToolTipConfig:any;

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _commUtil: CommonUtilitiesService,
        public _appConstants: AppConstants,
        private _dashboardCommService: DashboardCommService
    ) {
        // console.log('example', this.config);
    }
 
    ngOnInit() {
        
        this.cardPagination = this.config.cardPagination;
        this.breadCrumbList = this.config.breadCrumbList;
        this.breadCrumbUIConfig = this.config.breadCrumbUIConfig;
        this.uiConfig = this.config.config.uiConfig;
        this.linkedReportConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartLinkedReportConfig);
        this.linkedToDashboardConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartLinkedToDashboardConfig)
        this.previousTooltipConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartPreviousTooltipConfig);
        this.nextTooltipConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartNextTooltipConfig);
        this.drillUpToolTipConfig = this._commUtil.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartDrillUpToolTipConfig);
        this.config.config.changeDetectionMutation.setDashboardCardFooterState = this.setState.bind(this);
        this.graphTitleConfig =  {
            message: this.config.graphTitle,
            delay: 0, 
            position: 'right', 
            html: false 
          }
        this.setState();     
    }

    

    ngAfterViewInit() {
        this.calculateBreadcrumbWidth();
    }

    public setState() {
        /**
         *  We should call the change detection events only if the chnages related JSON object 
         *  happen not for dom  manipulation.
         */    
        this.updateGraphTitle();
        this._cdRef.markForCheck();
        this.calculateBreadcrumbWidth();   
    }

    /**
     * calculate breadcrumb width
     */
    public calculateBreadcrumbWidth() {
        this._dashboardCommService.calculateBreadcrumbWidth(this.breadCrumbList,this.config,this.uiConfig,false);
    }


    public previousClick() {
        this.config.api.previousClick();
    }

    public nextClick() {
        this.config.api.nextClick();
    }

    public onBreadcrumbSelect(slicedbreadcrumb) {
        this.config.api.onBreadcrumbSelect(slicedbreadcrumb);
    }

    public onDrillUp(){
        this.config.api.onDrillUp();
    }
    public updateGraphTitle(){
        this.graphTitleConfig.message = this.config.graphTitle;
    }
}
