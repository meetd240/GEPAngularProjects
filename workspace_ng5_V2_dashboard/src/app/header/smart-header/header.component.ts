import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ChangeDetectorMode } from 'smart-core-types';

@Component({
    templateUrl: './header.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements AfterViewInit {
    constructor(
        private _cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        // this.setState(ChangeDetectorMode.DetectChanges);
    }

    public setState(_cdOption) {
        switch (_cdOption) {
            case ChangeDetectorMode.DetectChanges:{
                this._cdRef.detectChanges();
                break;
            }                
            case ChangeDetectorMode.MarkForCheck:{
                this._cdRef.markForCheck;
                    break;
            } 
        }
    }
}