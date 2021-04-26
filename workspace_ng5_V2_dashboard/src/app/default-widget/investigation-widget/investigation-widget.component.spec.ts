import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationWidgetComponent } from './investigation-widget.component';

describe('InvestigationWidgetComponent', () => {
  let component: InvestigationWidgetComponent;
  let fixture: ComponentFixture<InvestigationWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
