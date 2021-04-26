import { Component, OnInit, ViewEncapsulation, Input, ChangeDetectionStrategy } from '@angular/core';
import { DashboardConstants } from '@vsDashboardConstants';

@Component({
  selector: 'oppfinder-status-popup',
  templateUrl: './oppfinder-status-popup.component.html',
  styleUrls: ['./oppfinder-status-popup.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  preserveWhitespaces: false
})
export class OppfinderStatusPopupComponent implements OnInit {

  @Input() config: any;
  btnDoneConfig: any;
  btnCancelConfig: any;
  ddlPeriodSelected: any;
  ddlPeriod: any;
  popupData: any;
  constants = DashboardConstants;  
  constructor() { }

  ngOnInit() {
    this.btnDoneConfig = {
      title: this.constants.UIMessageConstants.STRING_DONE_BTN_TXT,
      flat: false,
      disable: false
    }
    this.btnCancelConfig = {
      title: this.constants.UIMessageConstants.STRING_CANCEL_BTN_TEXT,
      flat: true,
      disable: false
    }
    this.ddlPeriodSelected = {
      'value': {
        "Id": 1,
        "Value": "Weeks"
      }
    };

    this.ddlPeriod = {
      dataKey: 'Id',
      label: '',
      displayKey: 'Value',
      fieldKey: 'value',
      cssClass: 'line-height-manager',
      options: [
        {
          "Id": 0,
          "Value": "Days"
        },
        {
          "Id": 1,
          "Value": "Weeks"
        },
        {
          "Id": 2,
          "Value": "Months"
        }
      ]
    }
    this.config.fields = [
      {
        type: 'text',
        modalData: { 'value': '' },
        Config: {
          label: '',
          attributes: { maxLength: 16 },
          isMandatory: true,
          disabled: false,
          data: 'modalData',
           fieldKey: 'value',
          cssClass:"line-height-manager padding10",
          placeholder:'Enter the value'
        }
      },
      {
        type: 'text',
        modalData: "",
        Config: {
          label: this.constants.UIMessageConstants.STRING_COMMENT,
          isMandatory: false,
          allowEmpty: true,
          disabled: false,
          data: 'modalData',
          fieldKey: 'value',
          tabIndex: 2,
          attributes: {
            maxLength: 100,
            min: 1
          },
          placeholder: this.constants.UIMessageConstants.STRING_COMMENT
        }
      }
    ];
  }

  btnDoneClick() {
    this.popupData = {
      Comment: this.config.fields[1].value,
      numOfDays: this.config.fields[0].modalData.value,
      ddlSelect: this.ddlPeriodSelected.value
    };
    this.config.api.donePopup(this.popupData);
  }

  onCancel() {
    this.config.api.closePopup();
  }
  onKeyUp() {
    
  }
}
