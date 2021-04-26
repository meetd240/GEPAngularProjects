import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    RouterTestingModule
} from '@angular/router/testing';
import { HeaderContComponent } from './header.component';
import { Component } from '@angular/core';
// import { HeaderComponent } from '../../../node_modules/smart-header/dist/header.component'; 
 describe('HeaderContComponent', () => {
    let component: HeaderContComponent;
    let fixture: ComponentFixture<HeaderContComponent>;
     beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [HeaderContComponent, HeaderComponent]
        })
            .compileComponents();
    }));
     beforeEach(() => {
        fixture = TestBed.createComponent(HeaderContComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
     it('should create', () => {
        expect(component).toBeTruthy();
    });
});
 @Component({
    selector: 'smart-header',
    template: ''
})
class HeaderComponent {
 } 