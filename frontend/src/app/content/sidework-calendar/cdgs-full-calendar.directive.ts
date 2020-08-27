import { Directive, ElementRef, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { fromEvent, merge, Subscription, Subject, defer, Observable } from 'rxjs';
import { FullCalendar } from 'primeng/fullcalendar';
import { filter, tap, share } from 'rxjs/operators';

@Directive({
  selector: '[cdgsFullCalendar]'
})
export class CdgsFullCalendarDirective implements OnDestroy, AfterViewInit {
  subscription = new Subscription();
  // monthChange = new Subject<Date>();
  // @Output() onChangeMonth = this.monthChange.pipe(this.distinctOnDateChange(), share())

  @Output() dateChange = new EventEmitter<Date>();
  constructor(private el: ElementRef<HTMLElement>, private fullCalendar: FullCalendar) {

    // this.subscription.add(
    //   merge(prevClick$, nextClick$).subscribe(_ => this.onChangeMonth.emit(this.fullCalendar.calendar.getDate()))
    // )
  }
  ngAfterViewInit(): void {
    this.fullCalendar.calendar.setOption('datesRender', () => this.dateChange.emit(this.fullCalendar.calendar.getDate()))
    this.dateChange.emit(this.fullCalendar.calendar.getDate());

    //second plan
    // const mutationObserver = new MutationObserver(_ => this.monthChange.next(this.fullCalendar.calendar.getDate()));
    // mutationObserver.observe(this.el.nativeElement, { childList: true, attributes: true, subtree: true });
    // this.subscription.add(() => mutationObserver.disconnect());
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  distinctOnDateChange() {
    return (source: Observable<Date>) => defer(() => {
      let prevDate: Date;
      return source.pipe(filter(date => {
        if (!prevDate) {
          return true;
        } else if (prevDate.getMonth() !== date.getMonth()) {
          return true;
        }
        return false;
      }), tap(date => prevDate = date))
    })
  }

}
