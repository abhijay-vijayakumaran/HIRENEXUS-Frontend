import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobDetails } from './candidate-job-details';

describe('CandidateJobDetails', () => {
  let component: CandidateJobDetails;
  let fixture: ComponentFixture<CandidateJobDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateJobDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateJobDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
