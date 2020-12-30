import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { Calendar } from '../interfaces/calendar';
import { map, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {

  private changeHolidays = new Subject<void>();
  onLoadHolidays$ = this.changeHolidays.pipe(
    switchMap((__) =>
      this.getHolidays(localStorage.getItem('year'), localStorage.getItem('employeeNo'))
    )
  );

  loadHolidays() {
    this.changeHolidays.next();
  }

  private changeLeaves = new Subject<void>();
  onLoadLeaves$ = this.changeLeaves.pipe(
    switchMap((__) =>
      this.getLeaveEmployee(localStorage.getItem('year'), localStorage.getItem('employeeNo'))
    )
  );

  loadLeaves() {
    this.changeLeaves.next();
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
}
