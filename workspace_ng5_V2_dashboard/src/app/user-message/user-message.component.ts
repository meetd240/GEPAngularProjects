import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';
import { CommonUtilitiesService } from '@vsCommonUtils';
import { Subscription } from 'rxjs';
// import { LazyComponentConfiguration } from '../../../modules-manifest'



@Component({
    selector: 'user-message',
    templateUrl: './user-message.component.html',
    styleUrls: ['./user-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class UserMessageComponent implements OnInit, OnDestroy {
    // static componentId = LazyComponentConfiguration.UserMessage.componentName;
    @Input() config:any;
    constructor(
         
    ) {

    }
    btnBackConfig: any = {
        title: "Go Back",
        flat: false,
        disable:false
    };

    ngOnInit() {
        // if (this.config && this.config.selectedDashboard) {
        //     this.graphTitle.value = this.config.selectedDashboard.viewName;
        //     this.smartTextFieldConfig.attributes.placeholder = 'Please Enter the View Name';
       // }
    }

    ngOnDestroy() {
        // if (this.manageSubscription$)
        //     this.manageSubscription$.unsubscribe();
    }

    emitUserMessageResponse(){
       window.history.go(-1);
    }
     
}   
