import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import "moment/locale/th";

@Pipe({
  name: "formatDateTh"
})
export class FormatDateThPipe implements PipeTransform {
  transform(date: Date) {
    if (date) {
      return moment(date).format("LT");
    } else {
      return "";
    }
  }
}
