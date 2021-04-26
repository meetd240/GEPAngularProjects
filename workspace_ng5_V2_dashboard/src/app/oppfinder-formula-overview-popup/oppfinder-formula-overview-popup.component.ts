import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';


@Component({
    selector: 'oppfinder-formula-oevrview-popup',
    templateUrl: './oppfinder-formula-overview-popup.component.html',
    styleUrls: ['./oppfinder-formula-overview-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
    
})

export class OppfinderFormulaOverviewPopupComponent implements OnInit {

    @Input() config: any;

   //btnContinueConfig: any;
    oppfinderOverviewList: any = [];

    ngOnInit() {
        
        this.oppfinderOverviewList = ['In the Opportunity Finder, the user gets to see the suggested best paymnet dates for Invoice under different Suppliers',
        'User also gets to see the Highest Potential Savings considering payments of invoices on the suggested Best Payment Dates',
        'The Potential Savings are based on the consideration of payment of the Invoice either on the Last Discount Date or on The Invoice due date',
        'User gets to see the invoice which were paid On-Time and the invoices which were paid late',
        'User gets to see the Penalties which were incurred on Late paid Invoices',
        'User can feed the desired Cost of Capital % and the Late Payment Penalty % to see the Best Payment Dates, Potential Savings and incurred Penalties accordingly',
        'User can Create and Save Invoice Payment Savings Opportunities for different Suppliers',
        'The Suppliers and Invoices with the Highest Potential Savings are displayed on top in the grid'
        ]
        // this.btnContinueConfig = {
        //     title: "continue",
        //     flat: true
        // }
       
    }
 
       
    btnContinueClick() {
        this.config.api.closePopup();
    }

    onCancel() {
        this.config.api.closePopup();
    }

}