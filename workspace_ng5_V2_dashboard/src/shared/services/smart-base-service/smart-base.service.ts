import { AppConstants } from 'smart-platform-services';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';;
import { CommonUtilitiesService } from '@vsCommonUtils';
import { ErrorLoggerService } from '../../../shared/error-handling/error-logger';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


@Injectable()
export class SmartBaseService {
    private headers: any = {};
    constructor(
        private _httpClient: HttpClient,
        private _appConstants: AppConstants,
        private _commUtils: CommonUtilitiesService,
        private _loggerService: ErrorLoggerService) {
        this.headers = Object.assign({}, {
            // "Ocp-Apim-Subscription-Key": this._appConstants.userPreferences.SCAPIMSubKey,
            "BPC": this._appConstants.userPreferences.UserBasicDetails.BuyerPartnerCode,
            'Content-Type': 'application/json',
            // 'UserExecutionContext': JSON.stringify(this._appConstants.userPreferences.UserBasicDetails)
        })
    }

    public postMethod(url: string, data: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders(this.headers)
        };

        return this._httpClient.post<any>(
            this._commUtils.noCacheUrl(url), data, httpOptions)
            .pipe(
                tap(
                    (response: any) => {
                        data = response
                    }
                ),
                catchError(
                    this.handleError<any>('smart base service post', 'error')
                ));
    }

    public getMethod(url: string): Observable<any> {
        let data: any;
        const httpOptions = {
            headers: new HttpHeaders(this.headers)
        };
        return this._httpClient.get(this._commUtils.noCacheUrl(url), httpOptions)
            .pipe(
                tap(
                    (response: any) => {
                        data = response
                    }
                ),
                catchError(
                    this.handleError<any>('smart base service get', 'error')
                ));
    };

    public deleteMethod(url: string, headers: any): Observable<any> {
        let data: any;
        const httpOptions = {
            headers: new HttpHeaders(this.headers)
        };
        return this._httpClient.delete<any>(this._commUtils.noCacheUrl(url), httpOptions)
            .pipe(
                tap(
                    (response: any) => {
                        data = response
                    }
                ),
                catchError(
                    this.handleError<any>('smart base service delete', 'error')
                ));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this._commUtils.getMessageDialog(
                `${error.status} : ${error.statusText} \n Something went wrong with ::${error.url}`, () => { });
            // TODO: send the error to remote logging infrastructure
            this._loggerService.logError(error); // log to console instead
            // Let the app keep running by returning an empty result.
            return of(result as T);
        }
    };


}
