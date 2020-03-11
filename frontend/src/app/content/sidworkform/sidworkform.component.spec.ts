import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidworkformComponent } from './sidworkform.component';

describe('SidworkformComponent', () => {
  let component: SidworkformComponent;
  let fixture: ComponentFixture<SidworkformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidworkformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidworkformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
