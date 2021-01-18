import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertSideWorkFormComponent } from './insert-side-work-form.component';

describe('InsertSideWorkFormComponent', () => {
  let component: InsertSideWorkFormComponent;
  let fixture: ComponentFixture<InsertSideWorkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertSideWorkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertSideWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
