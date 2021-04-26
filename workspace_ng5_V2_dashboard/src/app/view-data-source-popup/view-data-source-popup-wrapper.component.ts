import { Component, OnInit } from '@angular/core';
import { SmartPopupModel } from 'smart-popup';
import { viewDataSourcePopupComponent } from './view-data-source-popup.component';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
    template: `<smart-popup [(show)]="showViewDataPopup" [componentData]="viewDataSourcePopupComponent" [isDismissible]="isDismissible"></smart-popup>`
})

export class ViewDataSourcePopupWrapperComponent implements OnInit {
    viewDataSourcePopupComponent: SmartPopupModel;
    showViewDataPopup: boolean = true;
    isDismissible: boolean = true;

    constructor(private router: Router,private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.viewDataSourcePopupComponent = new SmartPopupModel(viewDataSourcePopupComponent, {
            'closeCallback': this.closeViewDataSource.bind(this)
        });
    }
   
    closeViewDataSource() {
        this.router.navigate(['', { outlets: { 'viewdatasource-popup': null } }], { relativeTo: this.activatedRoute, skipLocationChange: true });

    }
}