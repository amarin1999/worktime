  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { Calendar } from '../interfaces/calendar';
import { map, switchMap, tap } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {

  requestLeavEmpYear: any;

  private changeHolidays = new Subject<void>();
  onLoadHolidays$ = this.changeHolidays.pipe(
    switchMap((__) =>
      this.getHolidays(localStorage.getItem("year"), localStorage.getItem("employeeNo"))
    )
  );

  loadHolidays() {
    this.changeHolidays.next();
    this.changeHolidays.observers.splice(0,1)
  }

  private changeLeaves = new Subject<void>();
  onLoadLeaves$ = this.changeLeaves.pipe(
    switchMap((__) =>
      this.getLeaveEmployee(localStorage.getItem("year"), localStorage.getItem("employeeNo"))
    )
  );


  loadLeaves() {
    this.changeLeaves.next();
    // this.changeLeaves.observers.splice(0,1)
  }

  private changeYearLeaves = new Subject<void>();
  onLoadYearLeaves$ = this.changeYearLeaves.pipe(
    switchMap((__) =>
      this.getLeaveYearEmployee(localStorage.getItem("year"))
    )
  );


  loadYearLeaves() {
    this.changeYearLeaves.next();
    // this.changeYearLeaves.observers.splice(0,1)
  }

  private leaveEmployee = new BehaviorSubject('');
  storeLeaveEmployee = this.leaveEmployee.asObservable();

  changeSourceLeaveEmployee(value: any) {
    this.leaveEmployee.next(value);
  }

  constructor(
    private http: HttpClient
  ) { }

  // Sidework Event API (from PrimeNg)
  getSideWorkEventForCalendar(id: string) {
    return this.http
      .get<{ data: Calendar[] }>(
        `${ApiConstants.baseURl}/datatable/getsideworkcalendar/${id}`
      )
      .pipe(map((res) => res.data));
  }

  // Ot Event API
  getOtEventForCalendar(id: string) {
    return this.http
      .get<{ data: Calendar[] }>(
        `${ApiConstants.baseURl}/datatable/getotcalendar/${id}`
      )
      .pipe(map((res) => res.data));

  }


 // Holidays API
  getHolidays(year: string, id: string) {
    return this.http
      .get<{ data: Calendar[] }>(
        `${ApiConstants.baseURl}/holiday/${year}/${id}`
      )
      .pipe(map((res) => res.data));
  }
// get LeaveEmployee API
  getLeaveEmployee(year: string, id: string) {
    return this.http
      .get<{data: Calendar[] }>(
        `${ApiConstants.baseURl}/getLeaveEmployee/${year}/${id}`
      )
      .pipe(map((res)=>res.data));
  }

  getLeaveYearEmployee(year: string) {
    return this.http
      .get<{data: Calendar[] }>(
        `${ApiConstants.baseURl}/getLeaveEmployee/${year}`
      )
      .pipe(
        map((res)=>res.data),
        tap((res) => this.requestLeavEmpYear = res)
      );
  }
}
