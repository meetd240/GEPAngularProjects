import { Component, ChangeDetectionStrategy, ViewContainerRef, ViewChild, TemplateRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { AppConstants } from 'smart-platform-services';

@Component({
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  preserveWhitespaces: false
})

export class HeaderContComponent implements AfterViewInit, AfterContentInit {
  @ViewChild('headerContainer', { read: ViewContainerRef }) headerContainer: ViewContainerRef;
  @ViewChild('headerTemplate') headerTemplate: TemplateRef<any>;
  headerManifest: any;

  constructor(
    public _appConstants: AppConstants
  ) {

  }

  ngAfterContentInit() {
    this.loadHeaderBar();
  }

  private loadHeaderBar() {
    if (this._appConstants.userPreferences.moduleSettings.showSmartHedaerCompponent) {
      if (this._appConstants.userPreferences.IsNextGen) {
        this.headerManifest = {
          path: 'smart-nextgen-header/index',
          config: {

          }
        };
      }
      else {
        this.headerManifest = {
          path: 'smart-header/index',
          config: {

          }
        };
      }
      this.headerContainer.clear();
      this.headerContainer.createEmbeddedView(this.headerTemplate, this.headerManifest);
    }
  }

  ngAfterViewInit(): void {

  }

  onInitialize() {
  }


  onDeinitialize() {
  }


  onActivate() {
    
  }
}
