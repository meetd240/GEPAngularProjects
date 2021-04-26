import { TestBed, async, inject } from '@angular/core/testing';
import { BasicDetailsService } from './basicDetails.service';
import { GlobalLoaderService, AppConstants, FormBuilderUtilsService, TranslateService, SmartFormWidgetsService } from 'smart-platform-services';
import { APIBasicDetailsService } from './api-basicDetails.service';
import {  CMService, ConfigUpdateService} from '@sharedServices/index';

describe('Service: BasicDetails', () => {

 
  let appConstants = jasmine.createSpyObj("AppConstants", [""]);
  let basicDetailsApiRequest = jasmine.createSpyObj("APIBasicDetailsService", [""]);
  let smartFormWidgetService = jasmine.createSpyObj("SmartFormWidgetsService", [""]);
  let cmService = jasmine.createSpyObj("CMService", [""]);
  let configUpdateSvc = jasmine.createSpyObj("ConfigUpdateService", [""]);
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BasicDetailsService,
        { provide: AppConstants, useValue: appConstants },        
        { provide: APIBasicDetailsService, useValue: basicDetailsApiRequest },
        { provide: ConfigUpdateService, useValue: configUpdateSvc },
        { provide: CMService, useValue: cmService },
        { provide: SmartFormWidgetsService, useValue: smartFormWidgetService },
      ]
    });
  });

  it('should ...', inject([BasicDetailsService], (service: BasicDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
