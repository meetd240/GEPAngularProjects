import { Component, Injectable, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConstants } from 'smart-platform-services';
import { SmartCommentService } from 'smart-platform-services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PersistenceService } from 'smart-platform-services'
import { SubHeaderComponent } from './subHeader.component';
import { componentFactoryName } from '@angular/compiler';
import { RouterTestingModule } from '@angular/router/testing';
// import { appConstantClass } from '../services/go-constant.service';

describe('subHeaderComponent', () => {
    let component: SubHeaderComponent;
    let fixture: ComponentFixture<SubHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [SubHeaderComponent, SmartLiteSideNavComponent],
            providers: [
                SmartCommentService,
                AppConstants,
                // appConstantClass,
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: PersistenceService, useClass: MockPersistenceService }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});

@Component({
    selector: 'smart-lite-sidenavigation',
    template: ''
})
class SmartLiteSideNavComponent {
    @Input() config: any;
}

@Injectable()
class MockTranslateService {

}

@Injectable()
class MockSCConstants {

}

@Injectable()
class MockPersistenceService {

}