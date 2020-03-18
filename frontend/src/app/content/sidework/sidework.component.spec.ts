import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideworkComponent } from './sidework.component';

describe('SideworkComponent', () => {
  let component: SideworkComponent;
  let fixture: ComponentFixture<SideworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
