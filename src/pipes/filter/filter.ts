import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any, byValue : any) {
    if(!items || byValue.trim() == '') return items;
    return items.filter(item => (item.name1 + ' ' + item.name2 + ' ' + item.name4).indexOf(byValue) > -1);
  }
}
