import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployee(id: string): Observable<{ status: string, data: Employee, code: number }> {
    try {
      return this.http.get(`${ApiConstants.baseURl}/getEmployee/${id}`).pipe(map(response => {
        
        return {
          status: response['result'],
          code: response['code'],
          data: response['data'] as Employee
        }
      }));
    } catch (error) {
      console.log('fdafasd')
      console.table(error.message);
    }
  }
}
