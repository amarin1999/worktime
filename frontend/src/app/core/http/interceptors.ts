import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { SKIP_ERROR_TOAST, SKIP_LOADING } from '../api/api';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading.service';
import { NotifyService, problemDetail } from '../notify.service';

/**
 * On 401 (not logged in / session expired): forget the user and go to the sign-in page.
 * Requests to /auth/* are left alone - the login form and the guards handle those themselves.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/')) {
        auth.clear();
        void router.navigate(['/signin']);
      }
      return throwError(() => error);
    }),
  );
};

/** Shows the problem+json `detail` of a failed request in a toast. */
export const errorToastInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotifyService);
  return next(req).pipe(
    catchError((error: unknown) => {
      const handledElsewhere = error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/login');
      if (!req.context.get(SKIP_ERROR_TOAST) && !handledElsewhere) {
        notify.error(problemDetail(error));
      }
      return throwError(() => error);
    }),
  );
};

/** Drives the global loading overlay. */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
