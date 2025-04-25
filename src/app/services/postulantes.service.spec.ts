import { TestBed } from '@angular/core/testing';

import { PostulantesService } from './postulantes.service';

describe('PostulantesService', () => {
  let service: PostulantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostulantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
