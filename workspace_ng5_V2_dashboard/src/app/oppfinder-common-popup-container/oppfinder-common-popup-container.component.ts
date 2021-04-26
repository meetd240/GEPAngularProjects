import { Component, AfterViewInit, Input, ViewEncapsulation, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { DashboardCommService } from '@vsDashboardCommService';
import { DashboardConstants } from '@vsDashboardConstants';



@Component({
  selector: 'common-popup-container',
  templateUrl: './oppfinder-common-popup-container.component.html',
  styleUrls: ['./oppfinder-common-popup-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection :  ChangeDetectionStrategy.Default
})

export class CommonPopupContainer implements AfterViewInit {

  graphTitle: any = { "value": '' };
  costOfCapital: any = {
    Value: 3
}; 

  smartNumericConfig: any = {
    label: '',
    isMandatory: true,
    disabled: false,

    tabIndex: 2,
    data: "Value",
    placeholder: "1-20",
    attributes: {
        maxLength: 5,
        placeholder: "",
        max: 100,
        min: 0
    },
    minPrecession: 0,
    maxPrecession: 2
}

  CardTitleConfig: any = {
    label: DashboardConstants.UIMessageConstants.STRING_Opportunity_Name,
    isMandatory: true,
    allowEmpty: false,
    disabled: false,
    data: 'graphTitle',
    fieldKey: 'value',
    tabIndex: 2,
    attributes: {
      maxLength: 100
    }
  };

  @Input() config: any;
  showCapital: boolean = false;

  constructor(public _dashboardCommService: DashboardCommService,
    
    private _renderer: Renderer2,) {}

  ngOnInit() {
    if(this._dashboardCommService.oppFinderState.strategy.name == DashboardConstants.OpportunityFinderConstants.Strategies.TSA.name){
      this.showCapital = true;
    }
   
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.config.setState();
    }, 100);
  }

  onBlur(config) {
    console.log(config);
  }

  checkboxSelection(idx: number) {

  }

  onChange(value, idx) {
    this.config.Confidence.name = this.config.fields[idx].selectedConfig.value.name;
    // console.log(this.config.fields[idx].selectedConfig);
  }

  onCostOfCapitalClick(value) {
    this.config.fields[3].data = "$"+(Number(this.config.fields[4].data.replace(/[^0-9.-]+/g, "")) * (value / 100)).toFixed(0).toString();
   
}
  onKeyUp() {
    
  }

  onChangeRadio() {

  }
}
