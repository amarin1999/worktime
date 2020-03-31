import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiConstants } from "../constants/ApiConstants";
import { Response } from "../interfaces/response";
import { SideWork } from "../interfaces/sidework";
import * as moment from "moment";
@Injectable({
  providedIn: "root"
})
export class SideWorkService {
  constructor(private http: HttpClient) {}

  addSidework(body: SideWork): Observable<Response> {
    try {
      return this.http
        .post(`${ApiConstants.baseURl}/sidework/posttime`, body)
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

  getSideWorkOnDay(employeeId: string, date: Date): Observable<Response> {
    const dateRequest = moment(date)
      .add(543, "year")
      .format("YYYY-MM-DD");
    try {
      return this.http
        .get(
          `${ApiConstants.baseURl}/sidework/gettime?no=${employeeId}&date=${dateRequest}`
        )
        .pipe(
          map(response => {
            return {
              status: response["result"],
              data: response["data"],
              code: response["code"]
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  getHistorySideWork(id: string): Observable<Response> {
    try {
      return this.http
        .get(`${ApiConstants.baseURl}/datatable/getsidework/${id}`)
        .pipe(
          map(response => {
            return {
              status: response["result"],
              data: response["data"],
              code: response["code"]
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }
}
