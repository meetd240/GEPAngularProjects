import {
	Component, OnInit, Input,
	ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, ComponentFactoryResolver, ViewEncapsulation
} from "@angular/core";
import { DashboardConstants } from "@vsDashboardConstants";
import { CommonUtilitiesService } from "@vsCommonUtils";
// import { LazyComponentConfiguration } from "../../../modules-manifest";
import { DashboardCommService } from "@vsDashboardCommService";
import { AppConstants } from "smart-platform-services";
import { ViewAppliedFilterPopupComponent } from "../view-applied-filter-popup/view-applied-filter-popup.component";
import { LoaderService } from "@vsLoaderService";
import { each, filter } from "lodash";
import { TabDetail } from "@vsDashletModels/tab-detail-model";

@Component({
	selector: 'linked-view-filter',
	templateUrl: './linked-view-filter.component.html',
	styleUrls: ['./linked-view-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	preserveWhitespaces: false
})

export class LinkedViewFilterComponents implements OnInit, OnDestroy {
	appliedFilter: any = [];
	@Input() config: any;
	@ViewChild('viewAppliedFilterPopup', { read: ViewContainerRef }) private viewAppliedFilterPopupRef: ViewContainerRef;
	linkedReportConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartLinkedReportConfig);
	viewAppliedFilterConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartViewAppliedFilterConfig);
	linkedToDashboardConfig: any = this._commUtils.getUIElementConfig(DashboardConstants.SmartComponentConfig.SmartLinkedToDashboardConfig)
	showAppliedFilterPopupIcon: boolean = false;
	constructor(
		private _compFactResolve: ComponentFactoryResolver,
		private _dashboardCommService: DashboardCommService,
		private _appConstants: AppConstants,
		private _loaderService: LoaderService,
		private _commUtils: CommonUtilitiesService,
		private _changeDetection: ChangeDetectorRef) {

	}

	ngOnInit() {
		this.config.changeDetectionMutation.setLinkedViewFilterState = this.setState.bind(this);
		each(this._dashboardCommService.appliedFilters,(_val:any)=>{
			if(_val.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource &&  this._appConstants.userPreferences.moduleSettings.showFilterIconOption){
				 this.showAppliedFilterPopupIcon = true;
				 return;
			}
		})
		let _currentTabDetail: TabDetail = filter(this._dashboardCommService.tabDashletInfo.lstTabDetails, {tabId: this._dashboardCommService.selectedTab.tabId})[0];
		each(_currentTabDetail.lstAppliedTabFilters, (_val: any)=>{
			if(_val.FilterIdentifier != DashboardConstants.ViewFilterType.SlicerFilterSingleDataSource &&  this._appConstants.userPreferences.moduleSettings.showFilterIconOption){
				this.showAppliedFilterPopupIcon = true;
				return;
		   }
		})
	}

	ngOnDestroy() {
		this.viewAppliedFilterPopupRef.clear()
	}

	public async openViewAppliedFilter(widgetConfig) {
		this._loaderService.showGlobalLoader();
		// const _viewAppliedFilterRef: any = await this._commUtils.getLazyComponentReferences(LazyComponentConfiguration.ViewAppliedFilterPopup);
		const _viewAppliedFilterRef: any = this._compFactResolve.resolveComponentFactory(ViewAppliedFilterPopupComponent);
		this._loaderService.hideGlobalLoader();
		const _viewAppliedFilterCompRef: ComponentRef<any> = this.viewAppliedFilterPopupRef.createComponent(_viewAppliedFilterRef);
		const viewAppliedFilterPopupConfig = {
			api: {},
			moduleType: DashboardConstants.ModuleType.DASHBOARD,
			appliedFilters: widgetConfig.reportDetails.lstFilterReportObject,
		};
		viewAppliedFilterPopupConfig.api = {
			closePopup: () => { this.viewAppliedFilterPopupClose(_viewAppliedFilterCompRef); },
			doneClick: () => { this.viewAppliedFilterPopupDone(_viewAppliedFilterCompRef); },
			cancelClick: () => { this.viewAppliedFilterPopupCancel(_viewAppliedFilterCompRef); },
		};
		_viewAppliedFilterCompRef.instance.config = viewAppliedFilterPopupConfig;
		this.setState();
	}

	public viewAppliedFilterPopupClose(_viewAppliedFilterCompRef: ComponentRef<any>) {
		this.viewAppliedFilterPopupRef.detach();
		this.viewAppliedFilterPopupRef.clear();
		_viewAppliedFilterCompRef.destroy();
	}

	public viewAppliedFilterPopupDone(_viewAppliedFilterCompRef: ComponentRef<any>) {
		this.viewAppliedFilterPopupClose(_viewAppliedFilterCompRef);
	}

	public viewAppliedFilterPopupCancel(_viewAppliedFilterCompRef: ComponentRef<any>) {
		this.viewAppliedFilterPopupClose(_viewAppliedFilterCompRef);
	}

	public setState() {
		this._changeDetection.markForCheck();
	}
}
