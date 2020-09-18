import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  AfterContentInit,
  DoCheck,
  AfterViewChecked,
  AfterContentChecked
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';
import { SideWorkComponent } from '../sidework/sidework.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { first, finalize, map, debounceTime, observeOn, switchMap, mergeMap } from 'rxjs/operators';
import { Calendar } from 'src/app/shared/interfaces/calendar';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
import {
  Subject,
  Subscription,
  Observable
} from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { CalendarService } from 'src/app/shared/service/calendar.service';

@Component({
  selector: 'app-sidework-calendar',
  templateUrl: './sidework-calendar.component.html',
  styleUrls: ['./sidework-calendar.component.scss'],
})
export class SideworkCalendarComponent implements OnInit, OnDestroy {

  @ViewChild('op') op: OverlayPanel;
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  sideWorkCalendar: Subject<SideWork[]> = this.calendarLoad();
  events: Calendar[];
  holidayEvents: Calendar[];
  sideworkEvents: Calendar[];
  options: any;
  searchId: number;
  data: SideWork[];
  item: SideWork;
  dateCilckValue: Date;
  subscription = new Subscription();
  message: string;
  idSideWork: string;
  holidayMessage: string;
  togglePanel$ = new Subject<any>();
  showExcelExport = false;
  calendarDate: Date;

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private excelService: ExcelService,
    private sideworkService: SideWorkService,
    private calendarService: CalendarService,

  ) {

  }

  ngOnInit(): void {
    this.checkEmployee();
  }

  calendarChangeDate(date: Date) {
    this.calendarDate = date;

    const holidayMonth = this.calendarDate.getMonth() + 1;
    const holidayYear = this.calendarDate.getFullYear();

    localStorage.setItem("month", holidayMonth.toString());
    localStorage.setItem("year", holidayYear.toString());

    this.holidaysEventService();
    this.LoadAllEventsOnCalendar();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calendarLoad(): Subject<SideWork[]> {
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
        left: 'today',
        center: 'title',
        right: 'prev, next',
      },
      editable: true,
      selectable: false,
      dateClick: (el) => {
        this.dateCilckValue = el.date;
        const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(this.dateCilckValue).getDay()]
        if (weekday != 'Sun' && weekday != 'Sat') {
          this.openDialogInsert('add');
        }

        // if(this.disable != this.dateCilckValue){
        //   this.openDialogInsert('add');
        // }
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
    };

    return this.options;
  }


  LoadAllEventsOnCalendar() {
    // โหลด sidework event ขึ้นบน calendar
    this.subscription.add(
      this.sideworkService.onLoadEventCalendar$.subscribe(
        // (event) => (this.events = event)
        (event) => {
          this.sideworkEvents = Object.assign(event);
        }
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
          this.idSideWork = result.event.event.id;
          this.message = result.event.event.extendedProps.remark;
          this.holidayMessage = result.event.event.title;
          this.op.toggle(result.event.jsEvent);
        } else {
          this.op.hide();
        }
      })
    );

    // รวมค่าที่ได้จากการลงเวลา กับ holiday และโหลดขึ้น calendar
    this.subscription.add(
      this.calendarService.onLoadHolidays$.subscribe(
        // (event) => (this.events = event)
        (event) => {
          this.holidayEvents = Object.assign(event);
          this.events = [...this.sideworkEvents, ...this.holidayEvents];
          }
      )
    );
    this.calendarService.loadHolidays();
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

  holidaysEventService() {
    const requestData = {
      ...Subject,
      employeeNo: localStorage.getItem('employeeNo'),
      holidayYear: localStorage.getItem('year')
    }

    this.calendarService.getHolidays(requestData.holidayYear, requestData.employeeNo)
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
      (blob => this.excelService.download(blob, 'worktime2020.xlsx'),
        err => console.error(err)
      )
  }

  checkEmployee(): any {
    const requestData = {
      ...Subject,
      employeeNo: localStorage.getItem('employeeNo'),
    }
    if (requestData.employeeNo == '004061' || requestData.employeeNo == '001153' || requestData.employeeNo == '000242'
      || requestData.employeeNo == '000168' || requestData.employeeNo == '000225' || requestData.employeeNo == '004912') {
      this.showExcelExport = true;
    }
  }

}
