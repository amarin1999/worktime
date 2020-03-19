import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import "moment/locale/th";

@Pipe({
  name: "formatDayTh"
})
export class FormatDayThPipe implements PipeTransform {
  transform(date: Date): string {
    if (date) {
      return moment(date)
        .add(543, "years")
        .format("LL");
    } else {
      return "";
    }
  }
}
