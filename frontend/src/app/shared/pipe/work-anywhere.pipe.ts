import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "workAnywhere"
})
export class WorkAnywherePipe implements PipeTransform {
  transform(status: boolean) {
    if (status) {
      return "check";
    } else {
      return "";
    }
  }
}
