import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SortingPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sorting',
})
export class SortingPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(stds: any, countNew : any, sortBy = false) {
    if(!stds || !countNew) return stds;
    return stds.sort((a,b) => {
      if(countNew['s'+a.id] < countNew['s'+b.id])
        return 1;
      else if(countNew['s'+a.id] > countNew['s'+b.id])
        return -1;
      return 0;
    });
  }
}
