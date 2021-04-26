import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import 'jasmine';

import { DashboardTabsComponent } from './dashboard-tabs.component';

describe('DashboardTabsComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DashboardTabsComponent
            ],
        }).compileComponents();
    }));

    it("should create the tab component", async(() => {
        const fixture = TestBed.createComponent(DashboardTabsComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});