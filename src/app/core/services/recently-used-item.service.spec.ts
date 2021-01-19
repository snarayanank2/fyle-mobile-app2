import { TestBed } from '@angular/core/testing';

import { RecentlyUsedItemService } from './recently-used-item.service';

describe('RecentlyUsedItemService', () => {
  let service: RecentlyUsedItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentlyUsedItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
