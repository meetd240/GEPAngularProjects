
import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, OnDestroy, ChangeDetectorRef, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { cdColor, SmartWidgetManagerService, SmartStoreManagerService, SmartWidgetUtilityManagerService, generateUid, SmartDirectivesManagerService } from 'smart-core';
import { Subscription } from 'rxjs';
import { defaultManagerConfig } from '../../configuration/base/default-manager.config';
import { IOutletConfig, InjectionContext } from 'smart-module-injector';
 import { appBuilderManifests, manifestPath } from 'smart-widget-editor';
import { IWidgetsConfig, WidgetTypesEnum } from 'smart-core-types';

declare var userInfo: any;


@Component({
  selector: 'app-default-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './default-widget.component.html',
  styleUrls: ['./default-widget.component.scss'],
    providers:[SmartWidgetManagerService,SmartStoreManagerService,SmartWidgetUtilityManagerService,SmartDirectivesManagerService]
})
export class DefaultWidgetComponent implements OnInit, OnDestroy {
 
  @ViewChild('manager') managerRef: any;

  
  @ViewChild('container', { read: ViewContainerRef }) containerRef: ViewContainerRef;
  @ViewChild('builderTemplate') builderTemplateRef: TemplateRef<any>; 
  @ViewChild("popupTemplate") outletTemplateRef: TemplateRef<any>;
  @ViewChild("popupContainer", { read: ViewContainerRef }) saveStatusPopupRef: ViewContainerRef;

  private streamSubscription: Subscription = new Subscription();
  private context: InjectionContext;
  private previewMode =  userInfo.Mode === 'SCostPrv' ? true : false;

  //config for save and cancel button 
  saveConfig: any = {
    title: 'Save',
    allignRight: true,
    flat: true
  }
  cancelConfig: any = {
    title: 'Cancel',
    allignRight: true,
    flat: true
  }
  @Input() config: any;
  destoryTimeout: any = {};
  constructor(@Inject(SmartWidgetManagerService) public widgetsManagerService: SmartWidgetManagerService,
  @Inject(SmartStoreManagerService) private storeManager: SmartStoreManagerService,
  @Inject(SmartWidgetUtilityManagerService) private swum: SmartWidgetUtilityManagerService,
  private _cdRef: ChangeDetectorRef,
  public cdRef: ChangeDetectorRef) { }

  ngOnInit() { 
    let managerId = defaultManagerConfig.managerId;
    if (!this.widgetsManagerService.has(managerId)) this.widgetsManagerService.registerWidgetManager(defaultManagerConfig);
    this.bindWidgetManagerConfig(); 
    this.setState();
  }
  
  ngOnDestroy(): void { this.streamSubscription && this.streamSubscription.unsubscribe();  clearTimeout(this.destoryTimeout); }

  onInitialize(outletConfig: IOutletConfig): void { }
  onActivate(context: InjectionContext): void { 
    this.context = context; 
  }

  closeWidgetPopup(){
    this.saveStatusPopupRef.detach();
    this.saveStatusPopupRef.clear();
  }

  get builderManifestPath(): string { return manifestPath(appBuilderManifests.widgetsEditorPopup); }
  bindWidgetManagerConfig(): void {
    //used to load widgets as per config provided 
    const managerId = defaultManagerConfig.managerId;
    this.swum.registerViewElement(this.containerRef, this.builderTemplateRef, this.cdRef);
    this.managerRef.config = defaultManagerConfig;
    this.managerRef.scope = this;
    const parsedData: IWidgetsConfig = this.previewMode ? this.parseConfig(defaultManagerConfig) : defaultManagerConfig;

    this.storeManager.attach(managerId, parsedData, true);
    this.storeManager.stream$.filter(_ => _.patch.storeId === managerId).subscribe(_ => {
      this.managerRef.widgetsConfig = _.store;
    });
  }
  save()
  {
      this.saveStatusPopupRef.createEmbeddedView(this.outletTemplateRef, {
        manifestPath: 'save-fraud-anomaly-details/save-fraud-anomaly-details',
        config: {
          config: {
            api: {closePopup: () => { this.closeWidgetPopup(); }}
          }
        }   
      });
      setTimeout(() => {
        this.setState();
      }, 300);
     
  }



  public setState() {
    this._cdRef.markForCheck();
  }



  cancel() {
    this.config.api.closePopup();
    this.ngOnDestroy();
}

  private parseConfig(rawConfig: IWidgetsConfig): IWidgetsConfig {
    let parsedConfig: IWidgetsConfig = { hash: generateUid(), layout: rawConfig.layout, managerId: rawConfig.managerId, widgets: [] };
    rawConfig.widgets.forEach(widget => {
        widget.managerId = rawConfig.managerId;
        widget.hash = generateUid();
        widget.type === WidgetTypesEnum.Standard && widget.children.forEach(child => {
            child.hash = generateUid();
            child.managerId = widget.managerId;
            child.widgetId = widget.widgetId;
            child.behaviour.isConfigEditable = true;
        });
        parsedConfig.widgets.push(widget);
    });
    return parsedConfig;
}
  get changeDetector(): string { return `${cdColor()}`}
}

