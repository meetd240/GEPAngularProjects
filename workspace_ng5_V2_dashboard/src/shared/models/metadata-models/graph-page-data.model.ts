import { Injectable } from '@angular/core';
 

// Class provides instance properties for ReportFilter.
// @Injectable()
export class GraphPageData {

    // Reports Data on the basis provided Reporting Objects.
    pageData: Array<string>;

    


    constructor() {
        this.pageData = [];

        return this;
    }

    jsonToObject(response: any) {
        this.pageData = response.Data;

        return this;
    }
}
