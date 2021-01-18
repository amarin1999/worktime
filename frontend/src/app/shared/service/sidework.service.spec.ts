import { TestBed } from '@angular/core/testing';

import { SideWorkService } from './sidework.service';

describe('SideworkService', () => {
  let service: SideWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
