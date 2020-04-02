import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeWorkComponent } from './overtime-work.component';

describe('OvertimeWorkComponent', () => {
  let component: OvertimeWorkComponent;
  let fixture: ComponentFixture<OvertimeWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
