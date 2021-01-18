import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { EmployeeByDay } from '../interfaces/employee-by-day';
import { ApiConstants } from '../constants/ApiConstants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeByDayService {
  // private employee = new Subject<EmployeeByDay>();
  constructor(private http: HttpClient) { }

  getEmployeeByDay(
    year: any,
    month: any,
    day: any,
    work: any,
  ) {
    let httpParams = new HttpParams();
    const observable = this.http.get<EmployeeByDay[]>(`${ApiConstants.baseURl}/getEmployee/${year}/${month}/${day}/${work}`, { params: httpParams });
    return observable;
  }

  getEmployeeAllByDay(
    year: any,
    month: any,
    day: any,
  ) {
    let httpParams = new HttpParams();
    const observable = this.http.get<EmployeeByDay[]>(`${ApiConstants.baseURl}/getEmployee/${year}/${month}/${day}`, { params: httpParams });
    return observable;
  }
}
