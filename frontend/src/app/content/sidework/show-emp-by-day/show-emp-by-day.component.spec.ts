import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmpByDayComponent } from './show-emp-by-day.component';

describe('ShowEmpByDayComponent', () => {
  let component: ShowEmpByDayComponent;
  let fixture: ComponentFixture<ShowEmpByDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowEmpByDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmpByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
