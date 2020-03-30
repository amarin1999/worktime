import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOvertimeWorkComponent } from './history-overtime-work.component';

describe('HistoryOvertimeWorkComponent', () => {
  let component: HistoryOvertimeWorkComponent;
  let fixture: ComponentFixture<HistoryOvertimeWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryOvertimeWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOvertimeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});