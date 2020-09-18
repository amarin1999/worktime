import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workTypePipe'
})
export class WorkTypePipe implements PipeTransform {

  transform(data: String) {
    if (data == "1") {
      return "WFH";
    } else if (data == "2") {
      return "Site work";
    }
    else if (data == "3") {
      return "Other";
    }
    else return "ลืมบัตรพนักงาน";
  }

}
