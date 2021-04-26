import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardConstants } from '@vsDashboardConstants';
 
 
//#region Handle Errors Service
@Injectable()
export class ErrorLoggerService {

  constructor() {

  }

  //Log error method
  public logError(error: any) {
    //Returns a date converted to a string using Universal Coordinated Time (UTC).
    const date = new Date().toUTCString();

    if (error instanceof HttpErrorResponse) {
      //The response body may contain clues as to what went wrong,
      console.error(date, DashboardConstants.ErrorHandlerConstants.HttpError, error.message, 'Status code:', (<HttpErrorResponse>error).status);
    }
    else if (error instanceof TypeError) {
      console.error(date, DashboardConstants.ErrorHandlerConstants.TypeError, error.message, error.stack);
    }
    else if (error instanceof Error) {
      console.error(date, DashboardConstants.ErrorHandlerConstants.GeneralError, error.message, error.stack);
    }
    else if (error instanceof ErrorEvent) {
      //A client-side or network error occurred. Handle it accordingly.
      console.error(date, DashboardConstants.ErrorHandlerConstants.GeneralError, error.message);
    }
    else {
      console.error(date, DashboardConstants.ErrorHandlerConstants.UnexpectedError, error.message, error.stack);
    }
  }
}