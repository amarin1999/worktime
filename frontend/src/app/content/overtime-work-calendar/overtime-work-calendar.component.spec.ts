import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeWorkCalendarComponent } from './overtime-work-calendar.component';

describe('OvertimeWorkCalendarComponent', () => {
  let component: OvertimeWorkCalendarComponent;
  let fixture: ComponentFixture<OvertimeWorkCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeWorkCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeWorkCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
