import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';
import { HeaderComponent } from './header.component';
import { SmartNG5HeaderModule } from 'smart-ng5-header';

const headerRouter: IManifestCollection = [{
    path: 'index', component: HeaderComponent,
}];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        SmartNG5HeaderModule,
        SmartInjectorModule.forChild(headerRouter)
    ],
    providers: [

    ],
    declarations: [HeaderComponent]
})
export class HeaderModule { }