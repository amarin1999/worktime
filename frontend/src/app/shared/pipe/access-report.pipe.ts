import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'EmployeeAccessReport'
})
export class AccessReportPipe implements PipeTransform {

  transform(value: string): string {
    if (value != null) {
      if (value === "A") { return "แอดมิน" }
      else if (value === "Y") { return "อนุญาต"}
      else if (value === "M") { return "ผู้จัดการโครงการ"}
      else { return null }
    } else {
      return null;
    }
  }

}
