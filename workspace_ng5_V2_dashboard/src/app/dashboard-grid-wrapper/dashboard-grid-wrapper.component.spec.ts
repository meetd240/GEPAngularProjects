import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardGridWrapperComponent } from './dashboard-grid-wrapper.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StaticModuleLoaderService, DynamicModuleLoaderService } from "smart-module-loader";
import { dashboardISection } from '@vsDashboardInterface';
import { DashboardGridComponent } from '../dashboard-grid/dashboard-grid.component';
import { sections } from "./mock-data";


describe('DashboardGridWrapperComponent', () => {
  let component: DashboardGridWrapperComponent;
  let fixture: ComponentFixture<DashboardGridWrapperComponent>;
  let sectionConfigs: dashboardISection[];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [DashboardGridWrapperComponent, DashboardGridComponent],
      providers: [StaticModuleLoaderService, DynamicModuleLoaderService]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    this.sectionConfigs = sections;
    fixture = TestBed.createComponent(DashboardGridWrapperComponent);
    component = fixture.componentInstance;
    component.sections = sections;
    fixture.detectChanges();
  });
});
