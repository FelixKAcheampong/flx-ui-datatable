import { TestBed, inject } from '@angular/core/testing';

import { FlxUiDatatableService } from './flx-ui-datatable.service';

describe('FlxUiDatatableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlxUiDatatableService]
    });
  });

  it('should be created', inject([FlxUiDatatableService], (service: FlxUiDatatableService) => {
    expect(service).toBeTruthy();
  }));
});
