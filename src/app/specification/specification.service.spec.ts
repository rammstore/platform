import { TestBed } from '@angular/core/testing';

import { SpecificationService } from './specification.service';

describe('SpecificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecificationService = TestBed.get(SpecificationService);
    expect(service).toBeTruthy();
  });
});
