import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiConstants } from "../constants/ApiConstants";
import { OvertimeWork } from "../interfaces/overtime";

@Injectable({
  providedIn: "root"
})
export class OvertimeService {
  constructor(private http: HttpClient) {}

  addOvertimeWork(body: OvertimeWork) {
    try {
      return this.http
        .post(`${ApiConstants.baseURl}/overtime/posttime`, body)
        .pipe(
          map(response => {
            return {
              status: response["result"],
              code: response["code"]
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }
}
