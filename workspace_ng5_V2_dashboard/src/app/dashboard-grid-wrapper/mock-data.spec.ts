import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { sections } from "./mock-data";


describe('dashboardWrapperComponent', () => {
//   let component: dashboardWrapperComponent;
//   let fixture: ComponentFixture<dashboardWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      declarations: [ sections ],
      providers: [ ]
    })
    .compileComponents();
  }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(dashboardWrapperComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

  
});