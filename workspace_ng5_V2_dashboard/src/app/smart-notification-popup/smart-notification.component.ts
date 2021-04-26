import { Component, Inject, Input, Output, OnInit, Optional } from '@angular/core';
import { InjectionContext } from 'smart-module-injector';
import { TranslateService } from '@ngx-translate/core';
@Component({
	selector: 'po-smart-notification',
	templateUrl: './smart-notification.component.html',
	preserveWhitespaces: false
})

export class SmartNotifcationComponent implements OnInit {
	@Input() config;
	@Output() buttonClick;

	smartNotificationConfig: any;

	constructor(private injectionContext: InjectionContext) {

	}

	ngOnInit() {
	}

	onButtonClick(e) {
		this.buttonClick(e);
		this.injectionContext.destroyComponent();
	}
}
