import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobs } from './candidate-jobs';

describe('CandidateJobs', () => {
  let component: CandidateJobs;
  let fixture: ComponentFixture<CandidateJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
