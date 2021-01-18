import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideworkCalendarComponent } from './sidework-calendar.component';

describe('SideworkCalendarComponent', () => {
  let component: SideworkCalendarComponent;
  let fixture: ComponentFixture<SideworkCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideworkCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideworkCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
