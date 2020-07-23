import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { ContentComponent } from './content.component';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { SideworkCalendarComponent } from './sidework-calendar/sidework-calendar.component';
import { OvertimeWorkCalendarComponent } from './overtime-work-calendar/overtime-work-calendar.component';

const routes: Routes = [
  {
    path: 'main',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      { path: 'history', component: HistoryComponent },
      { path: 'sidework-calendar', component: SideworkCalendarComponent },
      { path: 'overtime-calendar', component: OvertimeWorkCalendarComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRoutingModule {}
