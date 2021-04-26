import { Injectable } from '@angular/core';
import { AppConstants } from 'smart-platform-services';
// import * as moment from 'moment';

@Injectable()

export class GlobalizationService {

    constructor(private appConstants: AppConstants) { }

    getNumberFormat(val) {
        let cultureCode = this.appConstants.userPreferences.UserBasicDetails.Culture;
        var d;
        var thousandSep = val.indexOf(',') != -1;
        var allSep = val.indexOf('.') != -1 && val.indexOf(',') != -1;

        switch (cultureCode) {
            case "it-IT":
            case "de-DE":
            case "da-DK":
            case "es-ES":
            case "sv-SE":
            case "pt-PT":
                d = allSep == true ? val.replace('.', ',').replace(',', '.') : thousandSep == true ? val.replace(',', '.') : val.replace('.', ',');
                break;
            case "fr-FR":
            case "pl-PL":
            case "ru-RU":
            case "cs-CZ":
                d = allSep == true ? val.replace('.', ',').replace(',', ' ') : thousandSep == true ? val.replace(',', ' ') : val.replace('.', ',');
                break;
            case "ja-JP":
            case "th-TH":
            case "zh-CN":
            case "ko-KR":
            case "zh-CN":
            case "en-US":
            case "en-AU":
                d = val;
                break;
        }
        return d;
    }
}
