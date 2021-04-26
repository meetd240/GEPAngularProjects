import { Injectable } from "@angular/core";
import { HttpService, AppConstants } from 'smart-platform-services';

@Injectable()
export class AdministrationAppService {
 
    private getAllServerListUrl: string;
    private createTOMUrl: string;

    constructor(
        private appConstants: AppConstants,
        private http: HttpService
    ){
        let OLOC = `?oloc=${this.appConstants.oloc.analytics}&c=${this.appConstants.userPreferences.EncryptedBPC}`;
        let baseUrl = this.appConstants.userPreferences.URLs.AppURL;
        this.getAllServerListUrl = baseUrl + 'Admin/GetDatabaseInstanceDetails' + OLOC;
        this.createTOMUrl = baseUrl + 'Admin/CreateTOM' + OLOC;
    }

    
   getServerList(){
         let req = {
            method: "GET",
            url: this.getAllServerListUrl,
            data: { }
        }

        let tmpSuccess;
        let tmpError;
        let requestPromise = {
            then: (success, error) => {
                tmpSuccess = success;
                tmpError = error; 
            }
        };

        this.http.directhttp(req).then((serverList: any) => {
            tmpSuccess(serverList);
        }, (error: any) => {
            tmpError(error);
        });

        return requestPromise;
    }

    createTOM(databaseInstanceID: string){
        let req = {
            method: "POST",
            url: this.createTOMUrl,
            data: { databaseInstanceID: databaseInstanceID}
        }

        let tmpSuccess;
        let tmpError;
        let requestPromise = {
            then: (success, error) => {
                tmpSuccess = success;
                tmpError = error; 
            }
        };

        this.http.directhttp(req).then((response: any) => {
            tmpSuccess(response);
        }, (error: any) => {
            tmpError(error);
        });

        return requestPromise;
    }

}