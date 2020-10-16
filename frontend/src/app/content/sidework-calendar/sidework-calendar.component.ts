import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import thLocale from '@fullcalendar/core/locales/th';
import { SideWorkComponent } from '../sidework/sidework.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { first, debounceTime, } from 'rxjs/operators';
import { Calendar } from 'src/app/shared/interfaces/calendar';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
import {
  Subject,
  Subscription,
} from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { CalendarService } from 'src/app/shared/service/calendar.service';

@Component({
  selector: 'app-sidework-calendar',
  templateUrl: './sidework-calendar.component.html',
  styleUrls: ['./sidework-calendar.component.scss'],
})
export class SideworkCalendarComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('op') op: OverlayPanel;
  sideWorkHistory: Subject<SideWork[]> = this.getHistorySideWork();
  events: any;
  holidayEvents: any;
  sideworkEvents: any;
  calendarEvents: Calendar[];
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
  empDate: Date;
  eventDateClick: Date;
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
    this.calendarLoad();
  }

  calendarChangeDate(date: Date) {
    this.calendarDate = date;

    const holidayMonth = this.calendarDate.getMonth() + 1;
    const holidayYear = this.calendarDate.getFullYear();

    localStorage.setItem("month", holidayMonth.toString());
    localStorage.setItem("year", holidayYear.toString());

    this.holidaysEventService();

    this.sideworkEvents = {
      [Symbol.iterator]() {
        return [][Symbol.iterator]()
      }
    }
    this.holidayEvents = {
      [Symbol.iterator]() {
        return [][Symbol.iterator]()
      }
    }
  }

  ngAfterViewInit() {
    this.LoadAllEventsOnCalendar();
    
    // debounceTime ของ layoutPanel
    //จะทำกรณีเอาเมาส์ไปชี้ที่ event บนปฏิทิน
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

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calendarLoad() {
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locales: [thLocale],
      locale: 'th',
      firstDay: 0, // sunday
      // height: 'parent',
      showNonCurrentDates: false,
      aspectRatio: 2.3,
      defaultView: 'dayGridMonth',
      displayEventTime: false,
      header: {
        left: 'today',
        center: 'title',
        right: 'prev, next',
      },
      editable: false,
      selectable: false,
      dateClick: (el) => {
        const requestData = {
          ...Subject,
          employeeNo: localStorage.getItem('employeeNo'),
        }

        this.dateCilckValue = el.date;
        let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(this.dateCilckValue).getDay()]

        if ((requestData.employeeNo == '004061' || requestData.employeeNo == '001153' || requestData.employeeNo == '000242'
          || requestData.employeeNo == '000168' || requestData.employeeNo == '000225' || requestData.employeeNo == '004912')
          && (weekday != 'Sun' && weekday != 'Sat')) {
          this.empDate = el.date;
          this.opendialogShowEmp('form');
        } else {
          // วันเสาร์-อาทิตย์กดลงเวลาไม่ได้
          if (weekday != 'Sun' && weekday != 'Sat') {
            this.openDialogInsert('add');
          }
        }
      },
      eventClick: (el) => {
        this.searchId = parseInt(el.event.id, 0);
        this.eventDateClick = el.event.start;
        this.item = this.data.find((i) => i.id === this.searchId);
        this.togglePanel$.next({
          event: el,
          display: false,
        });
        if (this.item != null || this.item != undefined) {
          this.openDialogEdit('edit', this.item);
        }
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
  }


  LoadAllEventsOnCalendar() {
    // โหลด sidework event ขึ้นบน calendar
    this.subscription.add(
      this.sideworkService.onLoadEventCalendar$.subscribe(
        (sideworkEvent) => {
          this.sideworkEvents = sideworkEvent;

          //this.events ใช้สำหรับนำ events ทั้งหมดที่มีขึ้นบนปฏิทิน
          this.events = [...this.sideworkEvents, ...this.holidayEvents];

          // ตั้งค่าสีให้กับ events
          this.events = this.events.map((event) => {
            return {
              ...event,
              color: event.workAnyWhere === 1 ? 'SteelBlue' : event.workAnyWhere === 2 ? 'SeaGreen' :
                event.workAnyWhere === 3 ? 'RebeccaPurple' : event.workAnyWhere === 0 ? 'Maroon' : 'Khaki',
              textColor: event.workAnyWhere === 1 ? 'Azure' : event.workAnyWhere === 2 ? 'Azure' :
                event.workAnyWhere === 3 ? 'Azure' : event.workAnyWhere === 0 ? 'Azure' : 'Black',
            };
          });
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
    

    // โหลด holiday event
    this.subscription.add(
      this.calendarService.onLoadHolidays$.subscribe(
        (holidayEvent) => {
          this.holidayEvents = holidayEvent;

          //this.events ใช้สำหรับนำ events ทั้งหมดที่มีขึ้นบนปฏิทิน
          this.events = [...this.sideworkEvents , ...this.holidayEvents];

          // ตั้งค่าสีให้กับ events
          this.events = this.events.map((event) => {
            return {
              ...event,
              color: event.workAnyWhere === 1 ? 'SteelBlue' : event.workAnyWhere === 2 ? 'SeaGreen' :
                event.workAnyWhere === 3 ? 'RebeccaPurple' : event.workAnyWhere === 0 ? 'Maroon' : 'Khaki',
              textColor: event.workAnyWhere === 1 ? 'Azure' : event.workAnyWhere === 2 ? 'Azure' :
                event.workAnyWhere === 3 ? 'Azure' : event.workAnyWhere === 0 ? 'Azure' : 'Black',
            };
          });
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
              life: 500,
            });
          } else if (result.error) {
            this.messageService.clear();
            this.messageService.add({
              key: 'errorMessage',
              severity: 'error',
              summary: 'ข้อความ',
              detail: result.error.errorMessage,
              life: 500,
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
            life: 500,
          });
        }
      );
  }

  opendialogShowEmp(type: string) {
    const configDialog: MatDialogConfig<object> = {
      disableClose: false,
      autoFocus: false,
      data: { type, date: this.empDate, workAnyWhere: 1, empListClickCheck: 1 },
    };
    const dialogRef = this.dialog.open(SideWorkComponent, configDialog);
    dialogRef.afterClosed().subscribe();
  }

  openDialogEdit(type: string, itemSideWork: SideWork) {
    const configDialog: MatDialogConfig<object> = {
      disableClose: false,
      autoFocus: false,
      data: { ...itemSideWork, type, sideworkId: this.searchId, Date: this.eventDateClick },
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
          life: 500,
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
          life: 500,
        });
      } else if (result.error) {
        this.messageService.add({
          key: 'errorMessage',
          severity: 'error',
          summary: 'ข้อความ',
          detail: result.error.errorMessage,
          life: 500,
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
      (blob => this.excelService.download(blob, 'WorkTime ' + year + '-' + String("0" + month).slice(-2) + '.dat'),
        err => console.error(err)
      )
  }

  exportExcelClick() {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth() + 1;
    this.excelService.getExcel(month).subscribe
      (blob => this.excelService.download(blob, 'WorkTime ' + year + '-' + String("0" + month).slice(-2) + '.xlsx'),
        err => console.error(err)
      )
  }

  // ตรวจสอบ employee ที่ล็อกอินเข้ามา
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
