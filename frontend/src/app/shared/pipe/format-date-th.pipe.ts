import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import "moment/locale/th";

@Pipe({
  name: "formatDateTh"
})
export class FormatDateThPipe implements PipeTransform {
  transform(date: Date, type: string) {
    switch (type) {
      case "day": {
        return moment(date)
          .add(543, "year")
          .format("LL");
      }
      case "time": {
        return moment(date).format("LT");
      }
      default: {
        return "";
      }
    }
    // if (type == "day") {
    //   return moment(date).format("LL");
    // } else {
    //   return "";
    // }
  }
}
