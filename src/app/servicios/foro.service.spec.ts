import { TestBed } from '@angular/core/testing';

import { ForoService } from './foro.service';

describe('ForoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForoService = TestBed.get(ForoService);
    expect(service).toBeTruthy();
  });
});
