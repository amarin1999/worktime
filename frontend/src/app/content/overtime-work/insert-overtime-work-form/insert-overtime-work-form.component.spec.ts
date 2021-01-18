import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertOvertimeWorkFormComponent } from './insert-overtime-work-form.component';

describe('InsertOvertimeWorkFormComponent', () => {
  let component: InsertOvertimeWorkFormComponent;
  let fixture: ComponentFixture<InsertOvertimeWorkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertOvertimeWorkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertOvertimeWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
