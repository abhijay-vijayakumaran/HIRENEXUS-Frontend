import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSettings } from './c-settings';

describe('CSettings', () => {
  let component: CSettings;
  let fixture: ComponentFixture<CSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
