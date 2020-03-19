import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiConstants } from "../constants/ApiConstants";
import { Response } from "../interfaces/response";
import { SideWork } from "../interfaces/sidework";

@Injectable({
  providedIn: "root"
})
export class SideworkService {
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
    const dateRequest = `${date.getFullYear() + 543}-${date.getMonth() +
      1}-${date.getDate()}`;
    try {
      return this.http
        .get(
          `${ApiConstants.baseURl}/sidework/gettime?no=${employeeId}&startTime=${dateRequest}`
        )
        .pipe(
          map(response => {
            return {
              status: response["result"],
              data: response["data"][0],
              code: response["code"]
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  getHistorySideWork(id: string) {
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
