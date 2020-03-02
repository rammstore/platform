import { TestBed } from '@angular/core/testing';

import { CreateInstanceService } from './create-instance.service';

describe('CreateInstanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateInstanceService = TestBed.get(CreateInstanceService);
    expect(service).toBeTruthy();
  });
});
