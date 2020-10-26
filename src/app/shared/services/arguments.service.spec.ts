import { TestBed } from '@angular/core/testing';

import { ArgumentsService } from './arguments.service';

describe('ArgumentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArgumentsService = TestBed.get(ArgumentsService);
    expect(service).toBeTruthy();
  });
});
