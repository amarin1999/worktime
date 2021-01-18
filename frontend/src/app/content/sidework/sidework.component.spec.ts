import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideWorkComponent } from './sidework.component';

describe('SideworkComponent', () => {
  let component: SideWorkComponent;
  let fixture: ComponentFixture<SideWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
