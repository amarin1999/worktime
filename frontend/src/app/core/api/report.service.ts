import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './api';
import { ReportKind } from './models';

/** Reads the file name from a Content-Disposition header (RFC 6266, incl. `filename*=UTF-8''...`). */
export function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) {
    return null;
  }
  const extended = /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/.exec(header);
  if (extended) {
    try {
      return decodeURIComponent(extended[1].trim().replace(/^"|"$/g, ''));
    } catch {
      // fall through to the plain filename
    }
  }
  const plain = /filename\s*=\s*("([^"]*)"|[^;]+)/.exec(header);
  const name = plain ? (plain[2] ?? plain[1]).trim() : '';
  return name || null;
}

/** Fallback names used when the server does not send Content-Disposition. */
export function defaultReportName(kind: ReportKind, year: number, month: number): string {
  const ym = `${year}${String(month).padStart(2, '0')}`;
  switch (kind) {
    case 'time-attendance':
      return `add-workanywhere-${ym}.dat`;
    case 'worktime':
      return `worktimeExcel${ym}.xlsx`;
    case 'leave':
      return `leaveReport${ym}.xlsx`;
  }
}

export interface DownloadedFile {
  blob: Blob;
  filename: string;
}

/** Admin-only report downloads (the API answers 403 for everybody else). */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  fetch(kind: ReportKind, year: number, month: number): Observable<DownloadedFile> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http
      .get(`${API_BASE_URL}/admin/reports/${kind}`, { params, observe: 'response', responseType: 'blob' })
      .pipe(
        map((res: HttpResponse<Blob>) => ({
          blob: res.body ?? new Blob(),
          filename:
            filenameFromContentDisposition(res.headers.get('Content-Disposition')) ??
            defaultReportName(kind, year, month),
        })),
      );
  }

  download(kind: ReportKind, year: number, month: number): void {
    this.fetch(kind, year, month).subscribe(({ blob, filename }) => this.save(blob, filename));
  }

  /** Saves a blob through a temporary <a download> element. */
  save(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = this.document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    this.document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url));
  }
}
