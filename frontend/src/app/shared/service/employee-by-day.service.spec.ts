import { TestBed } from '@angular/core/testing';

import { EmployeeByDayService } from './employee-by-day.service';

describe('EmployeeByDayService', () => {
  let service: EmployeeByDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeByDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
