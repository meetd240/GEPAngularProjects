import {
  Input, Output, Component,
  EventEmitter, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild, ViewContainerRef, TemplateRef, OnDestroy, EmbeddedViewRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
// import { LazyComponentConfiguration } from '../../../modules-manifest';
import { CommonUtilitiesService } from '@vsCommonUtils';


@Component({
  selector: 'custom-summary-card-wrapper',
  templateUrl: './custom-summary-cards-wrapper.component.html',
  styleUrls: ['./custom-summary-cards-wrapper.component.scss'],
  preserveWhitespaces: false
})
export class CustomSummaryCardsWrapperComponent implements OnInit {
  // static componentId = LazyComponentConfiguration.CustomSummaryCardsWrapper.componentName;

  @Input() config: any;
  constructor(private _commUtil: CommonUtilitiesService) {
  }

  ngOnInit() {
    console.log(this.config);
  }

  checkVal(val: any) {
    this._commUtil.isNune(val) ? true : false;
  }

}

