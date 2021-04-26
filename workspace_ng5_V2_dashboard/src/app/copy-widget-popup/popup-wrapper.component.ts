import { Component, OnInit } from '@angular/core';
import { SmartPopupModel } from 'smart-popup';
import { CopyWidgetPopupComponent } from './copy-widget-popup.component';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
    template: `<smart-popup [(show)]="showCopyWidgetPopup" [componentData]="copyWidgetPopupComponent" [isDismissible]="isDismissible"></smart-popup>`
})

export class PopupWrapperComponent implements OnInit {
    copyWidgetPopupComponent: SmartPopupModel;
    showCopyWidgetPopup: boolean = true;
    isDismissible: boolean = true;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.copyWidgetPopupComponent = new SmartPopupModel(CopyWidgetPopupComponent, {
            'doneCallback': this.copybtndone.bind(this),
            'cancelCallback': this.copybtncancel.bind(this)
        });
    }
    copybtndone() {
        this.router.navigate(['', { outlets: { 'copy-popup': null } }], { relativeTo: this.activatedRoute, skipLocationChange: false });
    }
    copybtncancel() {
        this.router.navigate(['', { outlets: { 'copy-popup': null } }], { relativeTo: this.activatedRoute, skipLocationChange: false });
    }
}