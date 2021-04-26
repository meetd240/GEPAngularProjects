import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilitiesService } from "@vsCommonUtils";
import { DashboardConstants } from '@vsDashboardConstants';
import { BehaviorSubject, Subject } from 'rxjs';




@Injectable()
export class LoaderService implements OnInit, OnDestroy {

    /**
     *  This is the common service for displaying the global loader as well as card loader 
     *  on vision dashboard.
     */
    public _sliderLoaderbehaviorSubject$ = new Subject<any>();
    constructor(
        private _commUtils: CommonUtilitiesService
    ) {

    }

    ngOnDestroy() {

    }

    ngOnInit() {

    }

    public showGlobalLoader() {
        this._commUtils.showLoader();
    }

    public hideGlobalLoader() {
        this._commUtils.hideLoader();
    }

    public showSliderLoader(cardId: string) {
        this._sliderLoaderbehaviorSubject$.next({
            LoaderType: DashboardConstants.LoaderType.BlockLoader,
            showLoader: true,
            cardId: cardId
        })
    }

    public hideSliderLoader(cardId: string) {
        this._sliderLoaderbehaviorSubject$.next({
            LoaderType: DashboardConstants.LoaderType.BlockLoader,
            showLoader: false,
            cardId: cardId
        })
    }

    public showCardLoader(cardId: string) {
        this._sliderLoaderbehaviorSubject$.next({
            LoaderType: DashboardConstants.LoaderType.CardLoader,
            showLoader: true,
            cardId: cardId
        })
    }

    public hideCardLoader(cardId: string) {
        this._sliderLoaderbehaviorSubject$.next({
            LoaderType: DashboardConstants.LoaderType.CardLoader,
            showLoader: false,
            cardId: cardId
        })
    }

}
