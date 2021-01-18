import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "../constants/ApiConstants";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Employee } from "../interfaces/employee";

@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  private employee = new Subject<Employee>();
  constructor(private http: HttpClient) {}

  getEmployee(
    id: string
  ): Observable<{ status: string; data: Employee; code: number }> {
    try {
      return this.http.get(`${ApiConstants.baseURl}/getEmployee/${id}`).pipe(
        map(response => {
          this.employee.next(response["data"][0]);
          return {
            status: response["result"],
            code: response["code"],
            data: response["data"][0] as Employee
          };
        })
      );
    } catch (error) {
      console.table(error.message);
    }
  }

  getEmployeeSignOn(): Subject<Employee> {
    return this.employee;
  }
}
