import { Routes } from '@angular/router';
import { authGuard, signinGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'signin',
    canActivate: [signinGuard],
    title: 'เข้าสู่ระบบ',
    loadComponent: () => import('./pages/signin/signin').then((m) => m.Signin),
  },
  {
    path: 'main',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'หน้าหลัก',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'history',
        title: 'ประวัติการลงเวลา',
        loadComponent: () => import('./pages/history/history').then((m) => m.History),
      },
      {
        path: 'sidework-calendar',
        title: 'ปฏิทินการทำงานนอกสถานที่',
        loadComponent: () =>
          import('./pages/sidework-calendar/sidework-calendar').then((m) => m.SideworkCalendar),
      },
      {
        path: 'overtime-calendar',
        title: 'ปฏิทินการทำงานล่วงเวลา',
        loadComponent: () =>
          import('./pages/overtime-calendar/overtime-calendar').then((m) => m.OvertimeCalendar),
      },
      {
        path: 'holiday',
        title: 'วันหยุด',
        loadComponent: () => import('./pages/holiday/holiday').then((m) => m.HolidayPage),
      },
    ],
  },
  // v1 also exposed the calendar at the top level.
  { path: 'sidework-calendar', redirectTo: 'main/sidework-calendar', pathMatch: 'full' },
  {
    path: '**',
    title: 'ไม่พบหน้าเพจ',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
