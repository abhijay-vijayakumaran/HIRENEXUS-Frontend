import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CProfile } from './c-profile';

describe('CProfile', () => {
  let component: CProfile;
  let fixture: ComponentFixture<CProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
