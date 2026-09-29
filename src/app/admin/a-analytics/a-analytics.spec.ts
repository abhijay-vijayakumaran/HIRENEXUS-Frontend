import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AAnalytics } from './a-analytics';

describe('AAnalytics', () => {
  let component: AAnalytics;
  let fixture: ComponentFixture<AAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
