import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { SmartPopupModel } from 'smart-popup';
import { ManageViewsPopupComponent } from './manage-views-popup.component';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
    template: `<smart-popup [(show)]="showManageViewsPopup" [componentData]="manageViewsPopupComponent" [isDismissible]="isDismissible"></smart-popup>`
})

export class ManageViewsPopupWrapperComponent implements OnInit,OnChanges {
    manageViewsPopupComponent: SmartPopupModel;
    showManageViewsPopup: boolean = true;
    isDismissible: boolean = true;

    constructor(private router: Router,private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.manageViewsPopupComponent = new SmartPopupModel(ManageViewsPopupComponent, {
            'doneCallback': this.manageViewsbtndone.bind(this),
            'cancelCallback': this.manageViewsbtncancel.bind(this)
        });
    }
    manageViewsbtndone() {

    }
    manageViewsbtncancel() {
        this.router.navigate(['', { outlets: { 'manageviews-popup': null } }], { relativeTo: this.activatedRoute, skipLocationChange: true });

    }

    ngOnChanges(changes:SimpleChanges){
    }
}