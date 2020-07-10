import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiConstants } from '../constants/ApiConstants';
import { OvertimeWork } from '../interfaces/overtime';
import { Observable, Subject } from 'rxjs';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class OvertimeWorkService {
  overtimeWorkItem = new Subject<OvertimeWork[]>();

  constructor(private http: HttpClient) {}

  addOvertimeWork(body: OvertimeWork): Observable<Response> {
    try {
      return this.http
        .post(`${ApiConstants.baseURl}/overtime/posttime`, body)
        .pipe(
          map(response => {
            return {
              status: response['result'],
              code: response['code']
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  editOvertimeWork(body: OvertimeWork): Observable<Response> {
    try {
      return this.http
        .put(`${ApiConstants.baseURl}/overtime/puttime`, body)
        .pipe(
          map(response => {
            return {
              status: response['result'],
              code: response['code']
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }
  setOvertimeWork(id: string): Observable<any> {
    try {
      return this.http
        .get(`${ApiConstants.baseURl}/datatable/getot/${id}`)
        .pipe(
          map(response => {
            this.overtimeWorkItem.next(response['data']);
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  getOvertimeWork(): Subject<OvertimeWork[]> {
    return this.overtimeWorkItem;
  }

  getHistoryOvertimeWork(id: string) {
    try {
      return this.http
        .get(`${ApiConstants.baseURl}/datatable/getot/${id}`)
        .pipe(
          map(response => {
            this.overtimeWorkItem.next(response['data']);
            return {
              status: response['result'],
              data: response['data'],
              code: response['code']
            };
          })
        );
    } catch (error) {
      console.table(error);
    }
  }

  deleteOvertime(otId: number){
    try {
      return this.http
        .delete(`${ApiConstants.baseURl}/overtime/deletetime/${otId}`)
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
