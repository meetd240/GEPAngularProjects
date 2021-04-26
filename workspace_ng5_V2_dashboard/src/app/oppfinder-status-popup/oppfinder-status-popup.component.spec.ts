import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppfinderStatusPopupComponent } from './oppfinder-status-popup.component';

describe('OppfinderStatusPopupComponent', () => {
  let component: OppfinderStatusPopupComponent;
  let fixture: ComponentFixture<OppfinderStatusPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppfinderStatusPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppfinderStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
