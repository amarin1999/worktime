import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeworkformComponent } from './overtimeworkform.component';

describe('OvertimeworkformComponent', () => {
  let component: OvertimeworkformComponent;
  let fixture: ComponentFixture<OvertimeworkformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeworkformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeworkformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
