// module
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
// material
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
// primgng
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { CoreModule } from '../core/core.module';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
// guard
import { AuthGuard } from '../shared/guard/auth.guard';
// pipe
import { WorkAnywherePipe } from '../shared/pipe/work-anywhere.pipe';
// service
import { OvertimeWorkService } from '../shared/service/overtime.service';
import { SideWorkService } from '../shared/service/sidework.service';
import { SharedModule } from '../shared/shared.module';
// component

// route
import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { HistoryOvertimeWorkComponent } from './history/history-overtime-work/history-overtime-work.component';
import { HistorySideWorkComponent } from './history/history-side-work/history-side-work.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { EditOvertimeWorkFormComponent } from './overtime-work/edit-overtime-work-form/edit-overtime-work-form.component';
import { InsertOvertimeWorkFormComponent } from './overtime-work/insert-overtime-work-form/insert-overtime-work-form.component';
import { OvertimeWorkComponent } from './overtime-work/overtime-work.component';
import { EditSideWorkFormComponent } from './sidework/edit-side-work-form/edit-side-work-form.component';
import { SideWorkComponent } from './sidework/sidework.component';
import { SignInComponent } from './signin/signin.component';
import { InsertSideWorkFormComponent } from './sidework/insert-side-work-form/insert-side-work-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CalendarModule } from 'primeng/calendar';
import { SideworkCalendarComponent } from './sidework-calendar/sidework-calendar.component';
import { CalendarService } from '../shared/service/calendar.service';
@NgModule({
  declarations: [
    ContentComponent,
    SignInComponent,
    HomeComponent,
    ConfirmDialogComponent,
    SideWorkComponent,
    HistoryComponent,
    HistorySideWorkComponent,
    HistoryOvertimeWorkComponent,
    EditSideWorkFormComponent,
    OvertimeWorkComponent,
    EditOvertimeWorkFormComponent,
    InsertOvertimeWorkFormComponent,
    InsertSideWorkFormComponent,
    SideworkCalendarComponent,
  ],

  imports: [
    SharedModule,
    CoreModule,
    ContentRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    MatRippleModule,
    MatCheckboxModule,
    MatTabsModule,
    MatListModule,
    MatBadgeModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    // DateTime
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    CalendarModule,
    FullCalendarModule,
    OverlayPanelModule,
  ],
  providers: [
    AuthGuard,
    MessageService,
    SideWorkService,
    OvertimeWorkService,
    WorkAnywherePipe,
    CalendarService,
  ],
  exports: [ContentComponent],
})
export class ContentModule {}
