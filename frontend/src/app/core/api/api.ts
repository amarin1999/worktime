import { HttpContextToken } from '@angular/common/http';

/** Base URL of the Worktime API. In development `/workTimeAPI` is proxied to the backend (proxy.conf.json). */
export const API_BASE_URL = '/workTimeAPI/api';

/** Set on a request to stop the error interceptor from showing a toast (the caller handles the error). */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

/** Set on a request to stop the global loading overlay from showing. */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
