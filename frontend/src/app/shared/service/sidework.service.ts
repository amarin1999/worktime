import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiConstants } from '../constants/ApiConstants';
import { Response } from '../interfaces/response';
import { SideWork } from '../interfaces/sidework';
import * as moment from 'moment';
import { Calendar } from '../interfaces/calendar';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root',
})
export class SideWorkService {
  sideWorkItem = new Subject<SideWork[]>();

  private changeEventCalendar = new Subject<void>();
  onLoadEventCalendar$ = this.changeEventCalendar.pipe(
    switchMap((_) =>
      this.calendarService.getSideWorkEventForCalendar(
        localStorage.getItem('employeeNo')
      )
    )
  );

  private changeSideworkCalendar = new Subject<void>();
  onLoadSideworkCalendar$ = this.changeSideworkCalendar.pipe(
    switchMap((__) =>
      this.getSideworkCalendar(localStorage.getItem('employeeNo'))
    )
  );

  constructor(
    private http: HttpClient,
    private calendarService: CalendarService
  ) {}

  loadEventCalendar() {
    this.changeEventCalendar.next();
  }

  loadSideworkCalendar() {
    this.changeSideworkCalendar.next();
  }

  getSideworkCalendar(id: string) {
    return this.http
      .get<{ data: SideWork[] }>(
        `${ApiConstants.baseURl}/datatable/getsidework/${id}`
      )
      .pipe(map((res) => res.data));
  }

  addSidework(body: SideWork): Observable<Response> {
    try {
      return this.http
        .post(`${ApiConstants.baseURl}/sidework/posttime`, body)
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

  editSideWork(body: SideWork): Observable<Response> {
    try {
      return this.http
        .put(`${ApiConstants.baseURl}/sidework/puttime`, body)
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

  getSideWorkOnDay(employeeId: string, date: Date): Observable<Response> {
    date = new Date(date);
    const dateRequest = moment(date)
      // .add(543, "year")
      .format('YYYY-MM-DD');

    try {
      return this.http
        .get(
          `${ApiConstants.baseURl}/sidework/gettime?no=${employeeId}&date=${dateRequest}`
        )
        .pipe(
          map((response) => {
            return {
              status: response['result'],
              data: response['data'],
              code: response['code'],
            };
          })
        );
    } catch (error) {
      return error;
    }
  }

  getHistorySideWork(id: string): Observable<Response> {
    try {
      return this.http
        .get(`${ApiConstants.baseURl}/datatable/getsidework/${id}`)
        .pipe(
          map((response) => {
            this.sideWorkItem.next(response['data']);
            return {
              status: response['result'],
              data: response['data'],
              code: response['code'],
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  setSideWork(id: string): Observable<any> {
    try {
      return this.http
        .get(`${ApiConstants.baseURl}/datatable/getsidework/${id}`)
        .pipe(
          map((response) => {
            this.sideWorkItem.next(response['data']);
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  getSideWork(): Subject<SideWork[]> {
    return this.sideWorkItem;
  }

  deleteSideWork(sideworkId: number) {
    try {
      return this.http
        .delete(`${ApiConstants.baseURl}/sidework/deletetime/${sideworkId}`)
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
}
