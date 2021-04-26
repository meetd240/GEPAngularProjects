import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AppConstants } from "smart-platform-services";

@Injectable()
export class SmartBaseInterceptService implements HttpInterceptor {

  constructor(
    private _appConstant: AppConstants
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(this._appConstant.userPreferences.URLs.AppURL)) {
      request = request.clone({
        setHeaders: {
          "Authorization": `${this._appConstant.userPreferences.JWToken}`
        }
      });
    }
    if (this._appConstant.userPreferences.IsNextGen) {
      request = request.clone({
        setHeaders: {
          "ocp-apim-subscription-key": this._appConstant.userPreferences.APIMSubscriptionKey,
          "bpc": this._appConstant.userPreferences.UserBasicDetails.BuyerPartnerCode.toString(),
          "regionid": this._appConstant.userPreferences.RegionID
        }
      });
    }
    return next.handle(request);
  }
}