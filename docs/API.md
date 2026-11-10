# Worktime API (v2)

Base URL: `/workTimeAPI/api` (the frontend dev server proxies `/workTimeAPI` to `http://localhost:8080`).

## Conventions
- JSON in/out. Dates are `yyyy-MM-dd`, times are `HH:mm`, date-times are ISO local `yyyy-MM-ddTHH:mm` (Asia/Bangkok).
- **Authentication**: an HttpOnly cookie `WT_SESSION` (JWT) is set by `POST /auth/login`. The browser sends it automatically (same origin), so JavaScript never sees the token.
- **CSRF**: the server sets the cookie `XSRF-TOKEN`. Every `POST/PUT/DELETE` must send the header `X-XSRF-TOKEN` with that value. Angular's `HttpClient` does this automatically (`withXsrfConfiguration` defaults). To get the cookie before the first login, call `GET /auth/csrf`.
- The employee is always taken from the session. No endpoint accepts an `employeeNo` from the client, except login.
- Errors use RFC 7807 `application/problem+json`: `{ "title", "status", "detail" }`. `detail` is a safe Thai message the UI can show. 400 = validation, 401 = not logged in or session expired, 403 = not allowed or bad CSRF token, 404 = not found or not yours, 429 = too many login attempts.

## Auth
| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/auth/csrf` | – | 204, sets `XSRF-TOKEN` cookie |
| POST | `/auth/login` | `{ "employeeNo": string, "password": string }` | 200 `User` + session cookie; 401 for a wrong employee number or password |
| POST | `/auth/logout` | – | 204, clears the cookie |
| GET | `/auth/me` | – | 200 `User` / 401 |

`User` = `{ "employeeNo": string, "firstname": string, "lastname": string, "admin": boolean }`

## Work anywhere (sidework), current user
`workAnywhere`: 1 = WFH, 2 = Site, 3 = Other, 4 = forgot employee card (ลืมบัตรพนักงาน)

`Sidework` = `{ "id": number, "date": "yyyy-MM-dd", "startTime": "HH:mm", "endTime": "HH:mm"|null, "workAnywhere": number, "remark": string|null, "lastUpdate": "yyyy-MM-ddTHH:mm:ss" }`

`SideworkRequest` = `{ "date": "yyyy-MM-dd", "startTime": "HH:mm", "endTime": "HH:mm", "workAnywhere": 1-4, "remark": string ≤ 250 | null }` (endTime must be after startTime)

| Method | Path | Response |
|---|---|---|
| GET | `/sidework` | `Sidework[]` (newest first). Used for both the history table and the calendar |
| GET | `/sidework/by-date?date=yyyy-MM-dd` | `Sidework` or 404 |
| GET | `/sidework/{id}` | `Sidework` |
| POST | `/sidework` body `SideworkRequest` | 200 `Sidework`. If the user already has a record on that date, it is updated (same upsert behavior as v1) |
| PUT | `/sidework/{id}` body `SideworkRequest` | 200 `Sidework` |
| DELETE | `/sidework/{id}` | 204 |

## Overtime, current user
`Overtime` = `{ "id": number, "projectNo": string, "startTime": "yyyy-MM-ddTHH:mm", "endTime": "yyyy-MM-ddTHH:mm", "remark": string|null, "lastUpdate": "yyyy-MM-ddTHH:mm:ss" }`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/overtime` | – | `Overtime[]` (newest first) |
| GET | `/overtime/{id}` | – | `Overtime` |
| POST | `/overtime` | `{ "projectNo": string ≤ 45, "remark": string ≤ 45 | null, "timeRange": [{ "startTime", "endTime" }] (1-31 items) }` | 200 `Overtime[]` (every range is saved) |
| PUT | `/overtime/{id}` | `{ "projectNo", "remark", "startTime", "endTime" }` (same limits) | 200 `Overtime` |
| DELETE | `/overtime/{id}` | – | 204 |

## Calendar data from the HR IS service, current user
| Method | Path | Response |
|---|---|---|
| GET | `/holidays?year=2026` | `[{ "title": string, "date": "yyyy-MM-dd" }]` |
| GET | `/leaves?year=2026[&month=1-12]` | `[{ "title": string, "date": "yyyy-MM-dd", "type": string }]` |

## Employees by day (any logged-in user)
`GET /employees/by-day?date=yyyy-MM-dd[&workAnywhere=1-4]` returns `[{ "employeeNo", "firstname", "lastname", "workAnywhere", "remark", "lastUpdateTime" }]`

## Reports (admin only, 403 otherwise)
| Path | File |
|---|---|
| `GET /admin/reports/time-attendance?year=&month=` | `add-workanywhere-YYYYMM.dat` (text/plain) |
| `GET /admin/reports/worktime?year=&month=` | `worktimeExcelYYYYMM.xlsx` |
| `GET /admin/reports/leave?year=&month=` | `leaveEmployeeYYYYMM.xlsx` |

The filename comes in `Content-Disposition`. Admins are the employee numbers listed in the `APP_ADMIN_EMPLOYEE_NOS` setting.
