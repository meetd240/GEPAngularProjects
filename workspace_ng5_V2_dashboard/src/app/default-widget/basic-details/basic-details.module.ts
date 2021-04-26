
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartWidgetModule } from 'smart-widget';
import { IManifestCollection, SmartInjectorModule, Resolver } from 'smart-module-injector';
import { BasicDetailsComponent } from './basic-details.component';
// import { BasicDetailsResolver } from './basic-details.resolver';
import { BasicDetailsService} from './services'
import{  SmartButtonModule} from 'smart-button';
import { SmartGlobalLoaderModule } from 'smart-global-loader';
import { GlobalLoaderService } from 'smart-platform-services';


export const manifest: IManifestCollection = [
  { path: 'bdw', component: BasicDetailsComponent}//, resolvers: { basicDetails: BasicDetailsResolver } }
];

@NgModule({
  imports: [
    CommonModule,
   SmartWidgetModule,
    SmartInjectorModule.forChild(manifest),
    SmartButtonModule,
    SmartGlobalLoaderModule
  ],
  declarations: [BasicDetailsComponent],
    providers: [ BasicDetailsService, GlobalLoaderService] //BasicDetailsResolver, 
})
export class BasicDetailsModule { }
