import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLeaveEmpByDayComponent } from './show-leave-emp-by-day.component';

describe('ShowLeaveEmpByDayComponent', () => {
  let component: ShowLeaveEmpByDayComponent;
  let fixture: ComponentFixture<ShowLeaveEmpByDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLeaveEmpByDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLeaveEmpByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
