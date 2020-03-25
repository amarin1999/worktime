import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSideWorkComponent } from './edit-side-work.component';

describe('EditSideWorkComponent', () => {
  let component: EditSideWorkComponent;
  let fixture: ComponentFixture<EditSideWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSideWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSideWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
