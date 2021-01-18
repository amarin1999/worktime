import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySideWorkComponent } from './history-side-work.component';

describe('HistorySideWorkComponent', () => {
  let component: HistorySideWorkComponent;
  let fixture: ComponentFixture<HistorySideWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorySideWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorySideWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
