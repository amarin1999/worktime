import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideWorkFormComponent } from './sideworkform.component';

describe('SideworkformComponent', () => {
  let component: SideWorkFormComponent;
  let fixture: ComponentFixture<SideWorkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideWorkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
