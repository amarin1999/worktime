import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
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
} from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { Employee } from 'src/app/shared/interfaces/employee';

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
  consoleLog = console.log;
  item: SideWork;
  dateCilckValue: Date;
  subscription = new Subscription();
  message: string;
  togglePanel$ = new Subject<any>();
  showExcelExport = false;

  calendarDate: Date;

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private excelService: ExcelService,
    private sideworkService: SideWorkService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calendarChangeDate(date: Date) {
    this.calendarDate = date;
  }



  ngOnInit(): void {
    this.checkEmployee();
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
        right: 'today, prev, next',
      },

      editable: false,
      selectable: false,
      // datesRender: (info) => {
      //   console.log('info', info);

      // },
      dateClick: (el) => {
        this.dateCilckValue = el.date;
        let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(this.dateCilckValue).getDay()]
        if (weekday != 'Sun' && weekday != 'Sat') {
          this.openDialogInsert('add');
        }
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
          display: true, // เปิด layoutPane0l
        });
      },
      eventMouseLeave: (el) => {
        this.togglePanel$.next({
          event: el,
          display: false, // ปิด layoutPanel
        });
      },
      events: (info, success, fail) => {
        console.log('info', info);
        console.log('success', success);
        console.log('fail', fail);
      }
    };
  }

  getHistorySideWork(): Subject<SideWork[]> {
    return this.sideworkService.getSideWork();
  }

  openDialogInsert(type: string): void {

    const configDialog: MatDialogConfig<any> = {
      disableClose: false,
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
              summary: 'ข้อความ',
              detail: 'ลงเวลาเรียบร้อยแล้ว',
            });
          } else if (result.error) {
            this.messageService.clear();
            this.messageService.add({
              key: 'errorMessage',
              severity: 'error',
              summary: 'ข้อความ',
              detail: result.error.errorMessage,
            });
          }
        },
        (error) => {
          this.messageService.clear();
          this.messageService.add({
            key: 'errorMessage',
            severity: 'error',
            summary: 'ข้อความ',
            detail: 'เกิดข้อผิดพลาดระหว่างเพิ่มข้อมูล',
          });
        }
      );
  }

  openDialogEdit(itemSideWork: SideWork): void {
    const configDialog: MatDialogConfig<object> = {
      disableClose: false,
      autoFocus: false,
      data: { ...itemSideWork, type: 'edit', sideworkId: this.searchId },
    };

    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (
        result.status === 'Success' &&
        this.sideworkService.deleteStatus === false
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'ข้อความ',
          detail: 'แก้ไขการลงเวลาเรียบร้อยแล้ว',
        });
      } else if (
        result.status === 'Success' &&
        this.sideworkService.deleteStatus === true
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'SuccessMessage',
          severity: 'success',
          summary: 'ข้อความ',
          detail: 'ลบรายการลงเวลาเรียบร้อยแล้ว',
        });
      } else if (result.error) {
        this.messageService.add({
          key: 'errorMessage',
          severity: 'error',
          summary: 'ข้อความ',
          detail: result.error.errorMessage,
        });
      }
    });
  }

  exportText() {
    const month = this.calendarDate.getMonth() + 1;
    const year = this.calendarDate.getFullYear();
    this.excelService.getText(month, year).subscribe
      (blob => this.excelService.download(blob, 'add-workanywhere-' + year + String("0" + month).slice(-2) + '.dat'),
        err => console.error(err)
      )


  }

  exportExcelClick() {
    this.excelService.getExcel().subscribe
      (blob => this.excelService.download(blob, 'worktime.xlsx'),
        err => console.error(err)
      )
  }

  checkEmployee(): any {
    const requestData = {
      ...Subject,
      employeeNo: localStorage.getItem('employeeNo'),
    }
    console.log(requestData.employeeNo)
    if (requestData.employeeNo == '004061' || requestData.employeeNo == '001153' || requestData.employeeNo == '000242'
      || requestData.employeeNo == '000168' || requestData.employeeNo == '000225' || requestData.employeeNo == '004912') {
      this.showExcelExport = true;
    }
  }

}
