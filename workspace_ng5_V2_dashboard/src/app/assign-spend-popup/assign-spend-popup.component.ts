import { Input, Output, Component, EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewContainerRef, TemplateRef, OnDestroy, EmbeddedViewRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef }
    from '@angular/core'; import { CommonUtilitiesService }
    from '@vsCommonUtils'; import { AnalyticsMapperService }
    from '@vsAnalyticsCommonService/analytics-mapper.service'; import { AnalyticsCommonDataService }
    from '@vsAnalyticsCommonService/analytics-common-data.service'; import { Subscription }
    from 'rxjs'; import { DashboardConstants }
    from '@vsDashboardConstants'; import { DashboardCommService }
    from '@vsDashboardCommService'; import { OpportunityFinderService }
    from '@vsOppfinderService/opportunityFinder.service'; import { CommonUrlsConstants }
    from '@vsCommonUrlsConstants'; import { LoaderService }
    from '@vsLoaderService'
import { find } from 'lodash';

declare var $: any; @Component({ changeDetection : ChangeDetectionStrategy.OnPush, selector: 'assign-spend-popup', templateUrl: './assign-spend-popup.component.html', styleUrls: ['./assign-spend-popup.component.scss'], encapsulation: ViewEncapsulation.None, preserveWhitespaces: false })

export class AssignSpendPopUpComponent {
    constants = DashboardConstants;
    btnDoneConfig: any;
    btnNextConfig: any;
    btnCancelConfig: any;
    percentSpend: 0;
    rateControl: any;
    TotalAssignPer: number;
    TotalAssignAmt: number;
    manageSubscription$: Subscription = new Subscription();

    @Input() config: any;
    formatter: Intl.NumberFormat;

    constructor(
        private element: ElementRef,
        private _renderer: Renderer2,
        private _commonUrls: CommonUrlsConstants,
        private _commUtil: CommonUtilitiesService,
        private _loaderService: LoaderService,
        private _oppFinderService: OpportunityFinderService,
        public _dashboardCommService: DashboardCommService,
        private _analyticsCommonDataService: AnalyticsCommonDataService,
        private _cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.setUIConfig();
        this.config.api.setState();
        this.setState();


  }
  ngAfterViewInit() {
    this.setState();
  }


    setUIConfig() {

        this.formatter = new Intl.NumberFormat('en-US', {
            style: undefined,
            currency: undefined,
            minimumFractionDigits: 0,
        });

        this.btnDoneConfig = {
            title: "Done",
            flat: false,
            disable: false
        };
        this.btnNextConfig = {
            title: "Next",
            flat: false,
            disable: false
        };
        this.btnCancelConfig = {
            title: "Cancel",
            flat: true,
            disable: false
        };

        this.config.OpportunityName = {
            value: this._dashboardCommService.oppFinderState.editMode ? this.config.OpportunityName : ""
        };
        this.config.OpportunityDescription = {
            value: this._dashboardCommService.oppFinderState.editMode ? this.config.OpportunityDescription : ""
        };



        this.TotalAssignAmt = parseFloat(this.calculateTotalAssignableSpend().toFixed(0));
        this.TotalAssignPer = parseFloat(this.calculateSumPercent().toFixed(0));

    }
    doneClick() {
        this.config.api.closePopup();
        this.ngOnDestroy();
    }
    onCancel() {
        this.config.api.closePopup();
        this.ngOnDestroy();
    }

    onAssignAmountChange(val, model) {
        if (val == '') {
            model.EstPercent = 0;
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0;
        };
        if (!this.assignAmountValidations(model)) {
            setTimeout(() => {
            model.EstPercent = 0;
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0;
            this.TotalAssignPer = this.calculateSumPercent();
            this.TotalAssignAmt = parseFloat(this.calculateTotalAssignableSpend().toFixed(0));
            },200);

        } else {
            this.calculateAssignedPercent(model);
        }

    }


    onPercentChange(val, model) {
        if (val == '') {
            model.EstPercent = 0;
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0;
        };
        if (!this.percentageValidations(model)) {
            setTimeout(() => {
            model.EstPercent = 0;
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0;
            this.TotalAssignPer = this.calculateSumPercent();
            this.TotalAssignAmt = parseFloat(this.calculateTotalAssignableSpend().toFixed(0));
            this.setState();
             } ,200)

        } else {
            this.calculateAssignedAmount(model);
        }

    }

    assignAmountValidations(model) {

        if (this.calculateTotalAssignableSpend() > this.config.TotalSpend) {
            setTimeout(() => {
            model.EstPercent = 0;
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0;
            },200);
            return false
        } else {
            this.TotalAssignAmt = parseFloat(this.calculateTotalAssignableSpend().toFixed(0));
            return true
        }

    }

    percentageValidations(model) {

        if (this.calculateSumPercent() > 100) {
                setTimeout(() => {
            model.EstPercent = 0;
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = 0;
            this.setState();
        },200);
            return false
        } else {

            this.TotalAssignPer = this.calculateSumPercent();
            return true
        }

    }

    calculateSumPercent() {
        var sum = 0;
        for (var i = 0; i < this.config.SelectedVAriables.length; i++) {
            sum += parseFloat(this.config.SelectedVAriables[i].EstPercent)
        }
        return sum;
    }


    calculateAssignedAmount(model) {
        if (model.EstPercent <= 100) {
            model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] = parseFloat((model.EstPercent * .01 * this.config.TotalSpend).toFixed(0));
            this.TotalAssignAmt = parseFloat(this.calculateTotalAssignableSpend().toFixed(0));
        }
    }

    calculateTotalAssignableSpend() {
        var spend = 0;
        for (var i = 0; i < this.config.SelectedVAriables.length; i++) {
            spend += parseFloat(this.config.SelectedVAriables[i][DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT])
        }
        return spend;
    }

    calculateAssignedPercent(model) {
        if ((this.calculateTotalAssignableSpend() <= this.config.TotalSpend)) {
            model.EstPercent = parseFloat(((model[DashboardConstants.UIMessageConstants.STRING_ASSIGNED_AMOUNT] / this.config.TotalSpend) * 100).toFixed(0));
            this.TotalAssignPer = parseFloat(this.calculateSumPercent().toFixed());
        }
    }

    ngOnDestroy() {
        this.manageSubscription$.unsubscribe();
    }

    private setState() {
        this._cdRef.detectChanges();
    }

}
