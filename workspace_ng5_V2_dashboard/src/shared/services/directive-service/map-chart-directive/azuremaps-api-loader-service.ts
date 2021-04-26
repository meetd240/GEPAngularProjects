import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '@vsWindowService';
import { DOCUMENT } from '@angular/common';
import { CommonUrlsConstants } from '@vsCommonUrlsConstants';
import { AppConstants } from 'smart-platform-services';
import { BingMapApiKey } from '../../../configuration/configuration-keys';

@Injectable()

export class AzureMapsApiLoaderService {

    private _azureMapLoadPromise: any;
    private _bingMapUrls: any;
    constructor(
        private _commonUrlsConstants: CommonUrlsConstants,
        private _appConstants: AppConstants,
        @Inject(DOCUMENT) private _documentRef: Document,
        @Inject(WINDOW) private _windowRef: Window
    ) {

    }
    /**
     * Loading the bing maps and adding the API Keys dynamically and loading the files 
     * for the executions purpose.
     */
    public LoadMaps() {

        const thisRef = this;
        // debugger;
        // Is LoadMaps() called for the first time?
        if (!this._azureMapLoadPromise) {
            // Make promise to load
            this._azureMapLoadPromise = new Promise(resolve => {

                var head = document.head;
                var dependencyCount = 3;

                const azureMapsCSS = document.createElement('link');
                azureMapsCSS.setAttribute('rel', 'stylesheet')
                azureMapsCSS.setAttribute('href', 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.css');
                azureMapsCSS.setAttribute('type', 'text/css');
                head.appendChild(azureMapsCSS);
                
                const azureMapsScript = document.createElement('script');
                azureMapsScript.setAttribute('src', 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.js');
                //azureMapsScript.setAttribute('async', 'false');
                head.appendChild(azureMapsScript);

                const azureServicesScript = document.createElement('script');
                azureServicesScript.setAttribute('src', 'https://atlas.microsoft.com/sdk/javascript/service/2/atlas-service.js');
                //azureServicesScript.setAttribute('async', 'false');
                head.appendChild(azureServicesScript);
                
                azureMapsCSS.addEventListener('load', function () {
                    thisRef.checkAndResolvePromise(--dependencyCount, resolve);
                });
                azureMapsScript.addEventListener('load', function() {
                    thisRef.checkAndResolvePromise(--dependencyCount, resolve);
                });
                azureServicesScript.addEventListener('load', function() {
                    thisRef.checkAndResolvePromise(--dependencyCount, resolve);
                })
            });
    
        }


        // Always return promise. When 'load' is called many times, the promise is already resolved.
        return this._azureMapLoadPromise;
    }

    checkAndResolvePromise(count, resolve) {
        if (count == 0)
            resolve('Azure Maps Loaded');
    }

}
