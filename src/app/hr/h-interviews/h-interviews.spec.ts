import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HInterviews } from './h-interviews';

describe('HInterviews', () => {
  let component: HInterviews;
  let fixture: ComponentFixture<HInterviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HInterviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HInterviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
