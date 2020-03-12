import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "../constants/ApiConstants";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Employee } from "../interfaces/employee";
import { SideWork } from "../interfaces/sidework";

@Injectable({
  providedIn: "root"
})
export class SideworkService {
  constructor(private http: HttpClient) {}

  addSidework(body: SideWork): any {
    try {
      return this.http.post(`${ApiConstants.baseURl}/sideWork`, body).pipe(
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
