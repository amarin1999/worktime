import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatYear'
})
export class FormatYearPipe implements PipeTransform {

  transform(date: Date) {
    const yearFormat = moment(date, 'DD/MM/YYYY').add(543, 'year').format('DD/MM/YYYY');
    return yearFormat;
  }


}
