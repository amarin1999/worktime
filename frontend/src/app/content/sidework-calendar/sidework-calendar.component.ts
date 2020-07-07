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
import { SideWorkComponent } from '../sidework/sidework.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { first, finalize, map, debounceTime, observeOn } from 'rxjs/operators';
import { Calendar } from 'src/app/shared/interfaces/calendar';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
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

@Component({
  selector: 'app-sidework-calendar',
  templateUrl: './sidework-calendar.component.html',
  styleUrls: ['./sidework-calendar.component.scss'],
})
export class SideworkCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('op') op: OverlayPanel;
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  events: Calendar[];
  options: any;
  searchId: number;
  data: SideWork[];
  item: SideWork;
  dateCilckValue: Date;
  subscription = new Subscription();
  message: string;
  togglePanel$ = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private calendarService: CalendarService,
    private sideworkService: SideWorkService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // โหลด sidework event ขึ้นบน calendar
    this.subscription.add(
      this.sideworkService.onLoadEventCalendar$.subscribe(
        (event) => (this.events = event)
      )
    );
    this.sideworkService.loadEventCalendar();
    // โหลด data sidework มาดึงขึ้น editdialog form
    this.subscription.add(
      this.sideworkService.onLoadSideworkCalendar$.subscribe(
        (data) => (this.data = data)
      )
    );
    this.sideworkService.loadSideworkCalendar();
    // debounceTime ของ layoutPanel
    this.subscription.add(
      this.togglePanel$.pipe(debounceTime(300)).subscribe((result) => {
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
      // height: 'parent',
      aspectRatio: 2.2,
      defaultView: 'dayGridMonth',
      updateEvents: this.events,
      locale: 'th',
      displayEventTime: false,
      header: {
        left: 'dayGridMonth,today',
        center: 'title',
        right: 'prev,next ',
      },
      editable: true,
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
        this.togglePanel$.next({ // เปิด layoutPanel
          event: el,
          display: true,
        });
      },
      eventMouseLeave: (el) => {
        this.togglePanel$.next({
          event: el,
          display: false,  // ปิด layoutPanel
        });
      },
    };
  }

  getHistorySideWork(): Subject<SideWork[]> {
    return this.sideworkService.getSideWork();
  }

  openDialogInsert(type: string): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      data: { type, dateClickValue: this.dateCilckValue },
    };
    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
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

  openDialogEdit(itemSideWork: SideWork): void {
    const configDialog: MatDialogConfig<object> = {
      disableClose: true,
      autoFocus: false,
      data: { ...itemSideWork, type: 'edit', sideworkId: this.searchId },
    };

    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status === 'Success') {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'แจ้งเตือน',
          detail: 'แก้ไขการลงเวลาเรียบร้อยแล้ว',
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
