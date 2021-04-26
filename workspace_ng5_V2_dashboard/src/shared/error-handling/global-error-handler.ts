import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorLoggerService } from './error-logger';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private _injector: Injector,
        private _loggerService: ErrorLoggerService
    ) {

    }
    handleError(error) {
        const message = error.message ? error.message : error.toString();
        const url = location instanceof PathLocationStrategy ? location.path() : '';
        this._loggerService.logError(error);
        throw error;
    }


}