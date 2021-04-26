import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { LazyComponentConfiguration } from '../../../modules-manifest';

@Component({
    selector: 'supplier-list-popup',
    templateUrl: './supplier-list-popup.component.html',
    styleUrls: ['./supplier-list-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class SupplierListPopupComponent implements OnInit {
    // static componentId = LazyComponentConfiguration.SupplierListPopUp.componentName;

    @Input() config: any;

    btnCloseConfig: any;
    suppliersList: any = [];
    showSearchInput: boolean = false;
    supplierListConfig: any;
    searchSupplierModel: any = { "SearchSupplierValue": '' }
    closeTooltipConfig: any;
    searchTooltipConfig: any;

    /**
     *
     */
    constructor(
        private _cdRef: ChangeDetectorRef
    ) {
        
        this.setState();
    }

    ngOnInit() {
        for (var i = 0; i < this.config.data.length; i++) {
            this.suppliersList.push({ "name": this.config.data[i][this.config.supplierName], "amount": this.config.data[i][this.config.spendRO].toFixed(2) })
        }
        this.supplierListConfig = {
            label: '',
            fieldKey: 'SearchSupplierValue',
            placeholder: 'Search'
        }


        this.btnCloseConfig = {
            title: "close",
            flat: true
        }
        this.closeTooltipConfig = {
            message: "Close",
            position: "bottom"
        };
        this.searchTooltipConfig = {
            message: "Search",
            position: "bottom"
        };
        //this.config.ChangeDetectionStrategy.setSupplierListPopupComponentState = this.setState.bind(this);
        //console.log(this.config);
    }

    supplierListPopupClose() {
        this.config.api.closePopup();
    }

    showSearch() {
        this.showSearchInput = true;
    }

    closeSearch() {
        this.searchSupplierModel.SearchSupplierValue = '';
        this.showSearchInput = false;
    }

    onCancel() {
        this.config.api.closePopup();
    }

    public setState() {
        this._cdRef.markForCheck();
    }

}
