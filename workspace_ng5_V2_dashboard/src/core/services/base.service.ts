import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';

import { catchError, tap } from 'rxjs/operators';
// import { LoggerService } from './logger.service';
declare var userInfo: any;

@Injectable()
export class BaseService {

  constructor(private httpClient: HttpClient) { }

  postData(url: string, data: any, headers: any ={}): Observable<any> {
    const httpOptions = {
      headers: headers
    };

    return this.httpClient.post<any>(url, data, httpOptions).pipe(
     // tap((d: any) => this.loggerService.info('baseService postData get called.')),
      catchError(this.handleError));

  }

  getData(url: string, headers: any = {}): Observable<any> {
    const httpOptions = {
      headers: headers
    };
    let data: any;
    return this.httpClient.get(url, httpOptions).pipe(
     // tap((response: any) => { data = response; this.loggerService.info("baseService get data returned.") }),
      catchError(this.handleError));
  };


  deleteData(url: string, headers: any = {}): Observable<any> {
    const httpOptions = {
      headers: headers
    };

    return this.httpClient.delete<any>(url, httpOptions).pipe(
     // tap(_ => this.loggerService.info('baseService deleted the data')),
      catchError(this.handleError));

  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message

    return "Something bad happened; please try again later.";
  };
}
