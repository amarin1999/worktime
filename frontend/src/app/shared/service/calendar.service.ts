import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { Calendar } from '../interfaces/calendar';
import { map } from 'rxjs/operators';

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
}
