import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSideWorkFormComponent } from './edit-side-work-form.component';

describe('EditSideWorkFormComponent', () => {
  let component: EditSideWorkFormComponent;
  let fixture: ComponentFixture<EditSideWorkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSideWorkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSideWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
