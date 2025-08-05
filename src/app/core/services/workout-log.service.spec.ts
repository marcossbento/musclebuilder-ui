import { TestBed } from '@angular/core/testing';

import { WorkoutLogService } from './workout-log.service';

describe('WorkoutLogService', () => {
  let service: WorkoutLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
