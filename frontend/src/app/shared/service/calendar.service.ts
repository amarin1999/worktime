import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { Calendar } from '../interfaces/calendar';

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(private http: HttpClient) {}


  getSideWorkEventForCalendar(id: string) {
    return this.http
      .get(`${ApiConstants.baseURl}/datatable/getsideworkcalendar/${id}`)
      .toPromise()
      .then((res) => res["data"] as Calendar[])
      .then((data) => {
        return data;
      });
  }

  getOtEventForCalendar(id: string) {
    return this.http
      .get(`${ApiConstants.baseURl}/datatable/getotcalendar/${id}`)
      .toPromise()
      .then((res) => res["data"] as Calendar[])
      .then((data) => {
        return data;
      });
  }



}
