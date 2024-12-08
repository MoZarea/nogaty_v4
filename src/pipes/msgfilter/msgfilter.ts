import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the MsgfilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'msgfilter',
})
export class MsgfilterPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    let counter = 0;
    let countMatch = 0;
    let exp1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  //  let val1=value.replace(exp1, '<a href="$1" target="_system">$1</a>');
    let val1 = value.replace(exp1, (match, p1) => {
        counter++;
        return `<a href="#" onClick="window.open('${p1}', '_system')">${p1}</a>`;
    });

    if(counter == 1)
  //  return val1;
      return this.domSanitizer.bypassSecurityTrustHtml(val1);
    
    let exp2 = /(\b[0-9]{10})/ig;
    let val2=val1.replace(exp2, '<a href="tel:$1">$1</a>');
    
    return val2;
  }
}
