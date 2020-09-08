import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiConstants } from '../constants/ApiConstants';
import { map, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { defer, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  downloadFile: any;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document

  ) { }

  download(blob: Blob, name: string) {
    const a = this.document.createElement("a");
    this.document.body.appendChild(a);
    a.style = "display: none";
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);

  }

  getExcel(month: any) {
    this.spinner.show();
    return this.http.get<any>(`${ApiConstants.baseURl}/reports/worktime/${month}`, { responseType: 'blob' as 'json', observe: 'response' })
      .pipe(tap(
        _ => this.spinner.hide(),
        err => this.spinner.hide()
      ),
        map((result: HttpResponse<Blob>) => {
          return result.body
        }))
  }
  getText(month: any, year: any) {
    this.spinner.show();
    return this.http.get<any>(`${ApiConstants.baseURl}/reports/timeAttecdance/${month}/${year}`, { responseType: 'blob' as 'json', observe: 'response' })
      .pipe(tap(
        _ => this.spinner.hide(),
        err => this.spinner.hide()
      ),
        map((result: HttpResponse<Blob>) => {
          return result.body
        }))
  }

}
