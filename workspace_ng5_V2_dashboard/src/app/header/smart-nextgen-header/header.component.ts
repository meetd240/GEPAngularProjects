import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ChangeDetectorMode } from 'smart-core-types';

@Component({
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'], 
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements AfterViewInit {
    constructor(
        private _cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // this.setState(ChangeDetectorMode.DetectChanges);
    }

    ngAfterViewInit() {
      
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
