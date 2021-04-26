import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
// import { IResolver } from '@interfaces/iresolver.interface';
import * as _ from 'lodash';
import { map } from 'rxjs/operators/map';
import { AnalyticsCommonConstants } from '@vsAnalyticsCommonConstants';
//import { CommonConstants } from '../../../shared/constants/common-constants/common.constants';
// import { CommonUrlsConstants } from '../../../shared/constants/common-url-constants/common-urls.constants';
import { CommonUrlsConstants } from '../../../../shared/constants/common-url-constants/common-urls.constants';


declare var userInfo: any;
@Injectable()
export class BasicDetailsService {
  constructor(
    private AnalyticsCommonConstants: CommonUrlsConstants,
    //private baseservice: BaseService
  ) { }


    getBasicDetails()
    {
        return Observable.of({
            "reportName": "",
            "modelDescription": "",
            "anomalyType": ""
    })
}
}

