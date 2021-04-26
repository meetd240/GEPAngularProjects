import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFraudAnomalyDetailsComponent } from './save-fraud-anomaly-details.component';

describe('SaveFraudAnomalyDetailsComponent', () => {
  let component: SaveFraudAnomalyDetailsComponent;
  let fixture: ComponentFixture<SaveFraudAnomalyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveFraudAnomalyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveFraudAnomalyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
