import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOvertimeWorkFormComponent } from './edit-overtime-work-form.component';

describe('EditOvertimeWorkFormComponent', () => {
  let component: EditOvertimeWorkFormComponent;
  let fixture: ComponentFixture<EditOvertimeWorkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOvertimeWorkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOvertimeWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
