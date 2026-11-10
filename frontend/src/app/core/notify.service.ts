import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProblemDetail } from './api/models';

export const GENERIC_ERROR = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';

/** Returns the Thai `detail` of an RFC 7807 response, or a generic message. */
export function problemDetail(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ProblemDetail | string | null;
    if (body && typeof body === 'object' && typeof body.detail === 'string' && body.detail) {
      return body.detail;
    }
    if (error.status === 0) {
      return 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
    }
  }
  return GENERIC_ERROR;
}

/** Toast messages at the bottom centre (Material snack bar; styled in styles.scss). */
@Injectable({ providedIn: 'root' })
export class NotifyService {
  private readonly snackBar = inject(MatSnackBar);

  success(detail: string): void {
    this.show(detail, 'toast-success', 2000);
  }

  warn(detail: string): void {
    this.show(detail, 'toast-warn', 4000);
  }

  error(detail: string): void {
    this.show(detail, 'toast-error', 4000);
  }

  private show(message: string, panelClass: string, duration: number): void {
    this.snackBar.open(message, 'ปิด', {
      duration,
      panelClass,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
