/**
 * Types that mirror docs/API.md (Worktime API v2).
 * Dates are `yyyy-MM-dd`, times `HH:mm`, date-times `yyyy-MM-ddTHH:mm` (Asia/Bangkok).
 */

export interface User {
  employeeNo: string;
  firstname: string;
  lastname: string;
  admin: boolean;
}

export interface LoginRequest {
  employeeNo: string;
  password: string;
}

/** 1 = WFH, 2 = Site, 3 = Other, 4 = forgot employee card (ลืมบัตรพนักงาน). */
export type WorkAnywhere = 1 | 2 | 3 | 4;

export const WORK_ANYWHERE = {
  WFH: 1,
  SITE: 2,
  OTHER: 3,
  FORGOT_CARD: 4,
} as const satisfies Record<string, WorkAnywhere>;

export interface Sidework {
  id: number;
  date: string;
  startTime: string;
  endTime: string | null;
  workAnywhere: WorkAnywhere;
  remark: string | null;
  lastUpdate: string;
}

export interface SideworkRequest {
  date: string;
  startTime: string;
  endTime: string;
  workAnywhere: WorkAnywhere;
  remark: string | null;
}

export interface Overtime {
  id: number;
  projectNo: string;
  startTime: string;
  endTime: string;
  remark: string | null;
  lastUpdate: string;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface OvertimeCreateRequest {
  projectNo: string;
  remark: string | null;
  timeRange: TimeRange[];
}

export interface OvertimeUpdateRequest {
  projectNo: string;
  remark: string | null;
  startTime: string;
  endTime: string;
}

export interface Holiday {
  title: string;
  date: string;
}

export interface Leave {
  title: string;
  date: string;
  type: string;
}

export interface EmployeeByDay {
  employeeNo: string;
  firstname: string;
  lastname: string;
  workAnywhere: WorkAnywhere;
  remark: string | null;
  lastUpdateTime: string;
}

/** RFC 7807 problem details returned by the API on errors. */
export interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
}

export type ReportKind = 'time-attendance' | 'worktime' | 'leave';
