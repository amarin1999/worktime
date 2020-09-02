import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { Calendar } from '../interfaces/calendar';
import { map, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  

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

  private changeHolidays = new Subject<void>();
  onLoadHolidays$ = this.changeHolidays.pipe(
    switchMap((__) =>
      this.getHolidays(localStorage.getItem('month'), localStorage.getItem('year'), localStorage.getItem('employeeNo'))
    )
  );

  loadHolidays() {
    this.changeHolidays.next();
  }

  // Holidays API
  getHolidays(month: any, year: any, id: string) {
        return this.http.get<any>(
        `${ApiConstants.baseURl}/holiday/${month}/${year}/${id}`
      )
      .pipe(map((res) => res.data));
  }
}
