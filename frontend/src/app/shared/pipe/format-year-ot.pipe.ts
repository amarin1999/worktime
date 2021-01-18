import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatYearOt'
})
export class FormatYearOtPipe implements PipeTransform {

  transform(date: Date) {
    const yearFormat = moment(date, 'DD/MM/YYYY HH:mm').add(543, 'year').format('DD/MM/YYYY HH:mm');
    return yearFormat;
  }

}
