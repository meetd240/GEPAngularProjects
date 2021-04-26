import { Input, Output, Component, EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';


declare var $: any;

@Component({
    selector: 'copy-widget-popup',
    templateUrl: './copy-widget-popup.component.html',
    styleUrls: ['./copy-widget-popup.component.css'],
    preserveWhitespaces: false
})
export class CopyWidgetPopupComponent implements OnInit {
    copycontentdata: any = [
        {
            title: 'Spend by Region View',
            isChecked: false
        },
        {
            title: 'Spend Breakups View',
            isChecked: false
        },
        {
            title: 'Invoice Order View',
            isChecked: false
        },
        {
            title: 'Invoice Processing View',
            isChecked: false
        },
        {
            title: 'Order Compliance View',
            isChecked: false
        }
    ];
    checkboxConfig: any = {
        disable: false,
        isMandatory: true,
        isVisible: false,
        label: '',
        validate: true,
        focus: true,
        errorMessage: 'Error message'
    };
    btnDoneConfig: any = {
        title: "Done",
        flat: true,
        disable: true
    };
    btnCancelConfig: any = {
        title: "Cancel",
        flat: true,
        disable: false
    };
    doneEnableFlg: boolean = true;
    checkboxModel: any = true;
    @Input() data: any;

    constructor(private element: ElementRef, private _renderer: Renderer2) {

    }

    ngOnInit() {
    }

    copySelection() {

        for (let item of this.copycontentdata) {
            if (item.isChecked === true) {
                return this.btnDoneConfig.disable = false;
            }
            else {
                this.btnDoneConfig.disable = true;
            }
        }
    }

    copybtnDone() {
        this.data.doneCallback();
    }
    copybtnCancel() {
        this.data.cancelCallback();
    }
}