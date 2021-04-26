import { NgModule } from '@angular/core';
import { SmartTextfieldModule } from 'smart-textfield';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SmartButtonModule } from 'smart-button';
import { UserMessageComponent } from './user-message.component';
import { IManifestCollection, SmartInjectorModule } from 'smart-module-injector';

const _userMessageRoute: IManifestCollection = [
    {
        path: 'user-message',
        component: UserMessageComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,
        SmartTextfieldModule,
        SmartButtonModule,
        SmartInjectorModule.forChild(_userMessageRoute)
    ],
    declarations: [UserMessageComponent],
    exports: [],

})
export class UserMessageModule { }