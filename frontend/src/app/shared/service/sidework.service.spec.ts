import { TestBed } from '@angular/core/testing';

import { SideworkService } from './sidework.service';

describe('SideworkService', () => {
  let service: SideworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
