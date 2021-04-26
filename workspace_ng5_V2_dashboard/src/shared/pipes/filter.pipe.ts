import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {

    transform(items: any[], filterObj): any {
        if (filterObj.isSelectAll) {
            
            return filterObj ? items.filter((item: any) => this.applyFilter(item, filterObj)) : items;            
        }
        else {
            return items;
        }
    }


    /**
       * Perform the filtering.
       * 
       * @param {item} any The item to compare to the filter.
       * @param {filterObj} any The filter to apply.
       * @return {boolean} True if book satisfies filters, false if not.
    */

    applyFilter(item: any, filterObj: any): boolean {
        filterObj.term = typeof (filterObj.term) === 'undefined' ? '' : filterObj.term;
        let field = filterObj.key;
        if (filterObj.term !== '' && typeof filterObj.term === 'string') {
            if (typeof field === "object") {
                          
                return field.some(element => item[element] && item[element].toLowerCase().indexOf(filterObj.term.toLowerCase()) > -1)

            }
            else if (typeof field === "string") {
                if (item[field]) {
                    if (item[field].toLowerCase().indexOf(filterObj.term.toLowerCase()) === -1) {
                        return false;
                    }
                }
            }
        }
        else if (filterObj.term !== '' && typeof filterObj.term === 'number' && typeof field === "string") {
            if (item[field]) {
                if (item[field].toString().indexOf(filterObj.term) === -1) {
                    return false;
                }
            }
        }

        return true;
    }

}
