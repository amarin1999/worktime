import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workTypePipe',
})
export class WorkTypePipe implements PipeTransform {
  transform(data: String) {
    if (data == '0') {
      return 'ลืมบัตร';
    } else if (data == '1') {
      return 'WFH';
    } else if (data == '2') {
      return 'Site';
    } else if (data == '3') {
      return 'Other';
    } else if (data === 'PERS') {
      return 'ลากิจ';
    } else if (data === 'SICK') {
      return 'ลาป่วย';
    } else if (data === 'VACA') {
      return 'ลาพักผ่อน';
    } else return 'อื่นๆ';
  }
}
