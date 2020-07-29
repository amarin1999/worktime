import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  AfterContentChecked,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from 'src/app/shared/service/calendar.service';
import thLocale from '@fullcalendar/core/locales/th';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { first, finalize, map, debounceTime, observeOn } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Subject,
  Subscription,
  BehaviorSubject,
  animationFrameScheduler,
  asyncScheduler,
} from 'rxjs';
import { FullCalendar } from 'primeng/fullcalendar';
import { OverlayPanel } from 'primeng/overlaypanel';
import { OvertimeWork } from 'src/app/shared/interfaces/overtime';
import { OvertimeWorkService } from 'src/app/shared/service/overtime.service';
import { OvertimeWorkComponent } from '../overtime-work/overtime-work.component';
import { OvertimeCalendar } from 'src/app/shared/interfaces/overtime-calendar';


@Component({
  selector: 'app-overtime-work-calendar',
  templateUrl: './overtime-work-calendar.component.html',
  styleUrls: ['./overtime-work-calendar.component.scss']
})
export class OvertimeWorkCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('op') op: OverlayPanel;
  overtimeHistory: Subject<OvertimeWork[]> = this.getHistoryOvertime();
  events: OvertimeCalendar[];
  options: any;
  searchId: number;
  data: OvertimeWork[];
  item: OvertimeWork;
  dateCilckValue: Date;
  subscription = new Subscription();
  message: string;
  togglePanel$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private overtimeWorkService: OvertimeWorkService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // โหลด overtime event ขึ้นบน calendar
    this.subscription.add(
      this.overtimeWorkService.onLoadEventCalendar$.subscribe(
        (event) => (this.events = event)
      )
    );
    this.overtimeWorkService.loadEventCalendar();
    // โหลด data overtime มาดึงขึ้น editdialog form
    this.subscription.add(
      this.overtimeWorkService.onLoadOvertimeCalendar$.subscribe(
        (data) => (this.data = data)
      )
    );
    this.overtimeWorkService.loadOvertimeCalendar();
    // debounceTime ของ layoutPanel
    this.subscription.add(
      this.togglePanel$.pipe(debounceTime(300)).subscribe((result) => {
        console.log(result.event)
        console.log(this.message)
        if (result.display) {
          this.message = result.event.event.extendedProps.remark;
          this.op.toggle(result.event.jsEvent);
        } else {
          this.op.hide();
        }
      })
    );

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locales: [thLocale],
      locale: 'th',
      firstDay: 0, // sunday
      // height: 'parent',
      showNonCurrentDates: false,
      aspectRatio: 2.2,
      defaultView: 'dayGridMonth',
      updateEvents: this.events,
      displayEventTime: false,
      header: {
        left: 'dayGridMonth,dayGridWeek,dayGridDay',
        center: 'title',
        right: 'today, prev,next ',
      },
      editable: false,
      selectable: true,
      dateClick: (el) => {
        this.dateCilckValue = el.date;
        this.openDialogInsert('add');
      },
      eventClick: (el) => {
        this.searchId = parseInt(el.event.id, 0);
        this.item = this.data.find((i) => i.id === this.searchId);
        this.togglePanel$.next({
          event: el,
          display: false,
        });
        this.openDialogEdit(this.item);
      },
      eventMouseEnter: (el) => {
        this.togglePanel$.next({
          event: el,
          display: true, // เปิด layoutPanel
        });
      },
      eventMouseLeave: (el) => {
        this.togglePanel$.next({
          event: el,
          display: false, // ปิด layoutPanel
        });
      },
    };
  }

  getHistoryOvertime(): Subject<OvertimeWork[]> {
    return this.overtimeWorkService.getOvertimeWork();
  }

  openDialogInsert(type: string): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: false,
      autoFocus: false,
      data: { type, dateClickValue: this.dateCilckValue },
    };
    const dialogRef = this.dialog.open(OvertimeWorkComponent, configDialog);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(
        (result) => {
          if (result.status === 'Success') {
            this.messageService.clear();
            this.messageService.add({
              key: 'SuccessMessage',
              severity: 'success',
              summary: 'แจ้งเตือน',
              detail: 'ลงเวลาเรียบร้อยแล้ว',
            });
          } else if (result.error) {
            this.messageService.clear();
            this.messageService.add({
              key: 'errorMessage',
              severity: 'error',
              summary: 'ผิดพลาด',
              detail: result.error.errorMessage,
            });
          }
        },
        (error) => {
          this.messageService.clear();
          this.messageService.add({
            key: 'errorMessage',
            severity: 'error',
            summary: 'ผิดพลาด',
            detail: 'เกิดข้อผิดพลาดระหว่างเพิ่มข้อมูล',
          });
        }
      );
  }

  openDialogEdit(itemOvertimeWork: OvertimeWork): void {
    const configDialog: MatDialogConfig<object> = {
      disableClose: false,
      autoFocus: false,
      data: { ...itemOvertimeWork, type: 'edit', OvertimeWorkId: this.searchId },
    };

    const dialogRef = this.dialog.open(OvertimeWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (
        result.status === 'Success' &&
        this.overtimeWorkService.deleteStatus === false
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'แจ้งเตือน',
          detail: 'แก้ไขการลงเวลาเรียบร้อยแล้ว',
        });
      } else if (
        result.status === 'Success' &&
        this.overtimeWorkService.deleteStatus === true
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'แจ้งเตือน',
          detail: 'ลบรายการลงเวลาเรียบร้อยแล้ว',
        });
      } else if (result.error) {
        this.messageService.add({
          key: 'errorMessage',
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: result.error.errorMessage,
        });
      }
    });
  }
}
