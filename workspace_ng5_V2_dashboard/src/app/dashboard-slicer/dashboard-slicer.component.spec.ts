import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSlicerComponent } from './dashboard-slicer.component';

describe('DashboardSlicerComponent', () => {
  let component: DashboardSlicerComponent;
  let fixture: ComponentFixture<DashboardSlicerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSlicerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSlicerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
