import { Input, Component, OnInit } from '@angular/core';

@Component({
    selector: 'view-data-source-popup',
    templateUrl: './view-data-source-popup.component.html',
    styleUrls: ['./view-data-source-popup.component.scss'],
    preserveWhitespaces: false
    
})
export class viewDataSourcePopupComponent implements OnInit {
    
    btnCloseConfig: any={
        title:"close",
        flat:true
    }

    @Input() data: any;

    constructor() {

    }

    ngOnInit() {
    }

    datasourcebtnClose(){
        this.data.closeCallback();
    }
}