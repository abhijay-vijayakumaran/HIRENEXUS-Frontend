import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrJobs } from './hr-jobs';

describe('HrJobs', () => {
  let component: HrJobs;
  let fixture: ComponentFixture<HrJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
