import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, SKIP_ERROR_TOAST } from './api';
import {
  EmployeeByDay,
  Holiday,
  Leave,
  Overtime,
  OvertimeCreateRequest,
  OvertimeUpdateRequest,
  Sidework,
  SideworkRequest,
  WorkAnywhere,
} from './models';

/** Sidework (work anywhere) of the current user. */
@Injectable({ providedIn: 'root' })
export class SideworkService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/sidework`;

  list(): Observable<Sidework[]> {
    return this.http.get<Sidework[]>(this.url);
  }

  /** 404 when nothing is recorded on that date; no toast for that case. */
  byDate(date: string): Observable<Sidework> {
    const params = new HttpParams().set('date', date);
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    return this.http.get<Sidework>(`${this.url}/by-date`, { params, context });
  }

  get(id: number): Observable<Sidework> {
    return this.http.get<Sidework>(`${this.url}/${id}`);
  }

  /** Creates, or updates the record that already exists on that date. */
  save(body: SideworkRequest): Observable<Sidework> {
    return this.http.post<Sidework>(this.url, body);
  }

  update(id: number, body: SideworkRequest): Observable<Sidework> {
    return this.http.put<Sidework>(`${this.url}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

/** Overtime of the current user. */
@Injectable({ providedIn: 'root' })
export class OvertimeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/overtime`;

  list(): Observable<Overtime[]> {
    return this.http.get<Overtime[]>(this.url);
  }

  get(id: number): Observable<Overtime> {
    return this.http.get<Overtime>(`${this.url}/${id}`);
  }

  create(body: OvertimeCreateRequest): Observable<Overtime[]> {
    return this.http.post<Overtime[]>(this.url, body);
  }

  update(id: number, body: OvertimeUpdateRequest): Observable<Overtime> {
    return this.http.put<Overtime>(`${this.url}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

/** Holidays / leaves (from the HR IS service) and the employees-by-day list. */
@Injectable({ providedIn: 'root' })
export class CalendarDataService {
  private readonly http = inject(HttpClient);

  holidays(year: number): Observable<Holiday[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<Holiday[]>(`${API_BASE_URL}/holidays`, { params });
  }

  leaves(year: number, month?: number): Observable<Leave[]> {
    let params = new HttpParams().set('year', year);
    if (month !== undefined) {
      params = params.set('month', month);
    }
    return this.http.get<Leave[]>(`${API_BASE_URL}/leaves`, { params });
  }

  employeesByDay(date: string, workAnywhere?: WorkAnywhere): Observable<EmployeeByDay[]> {
    let params = new HttpParams().set('date', date);
    if (workAnywhere !== undefined) {
      params = params.set('workAnywhere', workAnywhere);
    }
    return this.http.get<EmployeeByDay[]>(`${API_BASE_URL}/employees/by-day`, { params });
  }
}
