import { resultEmployee } from './../interfaces/employee';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "../constants/ApiConstants";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Employee } from "../interfaces/employee";
import { Response } from '../interfaces/response';

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

  getEmployeeByID(id: string): Observable<resultEmployee> {
    return this.http.get<resultEmployee>(`${ApiConstants.baseURl}/getEmployee/${id}`);
  }

  getEmployeeByAccessReport(accessReport: string): Observable<resultEmployee> {
    return this.http.get<resultEmployee>(`${ApiConstants.baseURl}/getEmployeeAccessReport/${accessReport}`);
  }

  getAllEmployee(): Observable<resultEmployee> {
    return this.http.get<resultEmployee>(`${ApiConstants.baseURl}/getEmployee/`);
  }

  editAccess(body: any): Observable<Response> {
    try {
      return this.http
        .put(`${ApiConstants.baseURl}/getEmployeeAccessReport/putaccessReport`, body)
        .pipe(
          map((response) => {
            return {
              status: response['result'],
              code: response['code'],
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  getEmployeeSignOn(): Subject<Employee> {
    return this.employee;
  }
}
