import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GlobalFilterService } from '@vsGlobalFilterService';

@Injectable()

export class GlobalFilterResolverService {
    constructor(private globalFilterService: GlobalFilterService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        let tab = this.getTabById(route.paramMap.get('id'));

        if (typeof tab != 'undefined' && tab != null) {
            return Observable.of<any>(tab);
        }

        return null;
    }

    getTabById(id) {
        return this.globalFilterService.reportingObjects.find(obj => {
            return obj.ReportObjectId === id;
        })
    }
}
