# CDG Time Attendance – frontend

Angular 22 single-page app for recording work-anywhere (WFH / Site / Other / forgot card) days and overtime.
It talks to the Worktime API v2 described in [`../docs/API.md`](../docs/API.md).

## Run

Requirements: Node 24, npm 11.

```bash
npm install
npm start            # ng serve on http://localhost:4200
npm run build        # production build -> dist/cdg-time-attendance/browser
npm test             # unit tests (Vitest), add --watch=false for a single run
npm run lint         # ESLint (angular-eslint)
```

### API proxy

All API calls go to `/workTimeAPI/api/...` (constant `API_BASE_URL` in `src/app/core/api/api.ts`).
In development `ng serve` uses `proxy.conf.json` (wired in `angular.json` → `serve.options.proxyConfig`)
to forward `/workTimeAPI` to the backend at `http://localhost:8080`, so the browser sees a single origin
and the session/CSRF cookies just work. In production serve the built files and the API from the same origin
(e.g. behind one reverse proxy).

## Security model (what the frontend relies on)

- The session is an **HttpOnly cookie** set by `POST /auth/login`; JavaScript never sees a token.
  The signed-in user is kept **in memory only** (`AuthService` signal, reloaded from `GET /auth/me`).
  Nothing auth-related is stored in `localStorage`/`sessionStorage`.
- CSRF: `GET /auth/csrf` sets the `XSRF-TOKEN` cookie; `HttpClient` sends it back as `X-XSRF-TOKEN`
  on POST/PUT/DELETE (`withXsrfConfiguration` in `app.config.ts`).
- A `401` from any data endpoint clears the user and sends the browser to `/signin`.
  Other errors show the RFC 7807 `detail` (Thai text from the server) in a toast.
- No `innerHTML`, no `bypassSecurityTrust*`, no third-party origins at runtime: fonts (Kanit, Material Icons)
  and the background image are bundled, so a strict CSP (sent by the server) works. No service worker
  (it would cache personal API data).

## Structure

```
src/
  index.html, main.ts, styles.scss      global page, bootstrap, global styles (fonts/theme are in angular.json)
  app/
    app.ts / app.config.ts / app.routes.ts   shell (navbar, router outlet, loading overlay), providers, routes
    core/
      api/          models.ts (types matching API.md), api.ts (base URL, HttpContext flags),
                    worktime-api.service.ts (sidework, overtime, holidays/leaves, employees-by-day),
                    report.service.ts (admin report downloads, Content-Disposition file name)
      auth/         auth.service.ts (login/logout/me, user signal), auth.guard.ts (authGuard, signinGuard)
      http/         interceptors.ts (loading overlay, 401 -> /signin, error toast)
      calendar/     calendar-events.ts (builds FullCalendar events + the v1 event titles on the client)
      util/         date-utils.ts (replaces moment.js; Buddhist-era formatting)
      notify.service.ts, loading.service.ts
    layout/         navbar, footer
    shared/         banner, pipes (thaiDate, thaiDateTime, workAnywhere)
    dialogs/        sidework (add/edit/delete), overtime (add/edit/delete, multiple ranges),
                    employees-by-day (admin), confirm; work-dialogs.service.ts chains them and shows toasts
    pages/          signin, home, sidework-calendar, overtime-calendar, history (+ tables), holiday, not-found
public/assets/images  logos, menu icons, loading spinner, background image
```

## Screens / routes

| Route | Screen |
|---|---|
| `/signin` | Sign-in with employee number + password |
| `/main` | Menu (work anywhere / overtime / history) |
| `/main/sidework-calendar` | Work-anywhere calendar with holidays and leaves. Click a weekday to add (admins first see who worked that day), click an entry to edit/delete. Admins also get the report download buttons for the shown month. |
| `/main/overtime-calendar` | Overtime calendar; click a day to add one or more time ranges, click an entry to edit/delete |
| `/main/history` | Tables of all work-anywhere and overtime records (search, sort, paging; click a row to edit) |
| `/main/holiday` | Company holidays of a year |

## Libraries

Angular 22 + Angular Material 22 (UI, date/time pickers, tables, dialogs, snack-bar toasts),
FullCalendar 7 (`@fullcalendar/angular` with the daygrid/interaction plugins, Thai locale, classic theme),
`@fontsource/kanit` and `material-icons` (self-hosted fonts). Tests: Vitest via `@angular/build:unit-test`.
