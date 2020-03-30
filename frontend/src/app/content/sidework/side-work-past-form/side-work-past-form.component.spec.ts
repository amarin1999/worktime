import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideWorkPastFormComponent } from './side-work-past-form.component';

describe('SideWorkPastFormComponent', () => {
  let component: SideWorkPastFormComponent;
  let fixture: ComponentFixture<SideWorkPastFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideWorkPastFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideWorkPastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
