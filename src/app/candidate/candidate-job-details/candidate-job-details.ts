import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from '../../services/candidate';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-job-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-job-details.html',
  styleUrl: './candidate-job-details.css',
})
export class CandidateJobDetails implements OnInit {


  job: any = null;

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  //application form
  applicationData = {
    resume: null as File | null,
    coverLetter: ''
  };

  showApplyForm = false;
  applying = false;
  applicationMessage = '';
  applicationError = '';

  constructor(private route: ActivatedRoute, private candidateService: Candidate, private router: Router) { }


  ngOnInit(): void {

    const jobId = this.route.snapshot.paramMap.get('id');

    if (!jobId) {
      this.errorMessage = 'Job ID not found';
      this.loading = false;
      return;
    }

    this.loadJob(jobId);
  }




  loadJob(jobId: string) {

    this.loading = true;
    this.errorMessage = '';

    this.candidateService.getJobById(jobId).subscribe({

      next: (response) => {

        console.log('Candidate Job Details:', response);

        this.job = response.foundJob[0]

        this.loading = false;

      },

      error: (error) => {

        console.log('Failed to load job:', error);

        this.errorMessage =
          error.error?.message ||
          'Failed to load job details';

        this.loading = false;

        this.showToast(this.errorMessage);

      }

    });

  }

  goBack() {
    this.router.navigate(['/candidate/jobs']);
  }


  //Application
  showApplicationForm() {
    this.showApplyForm = true;
    this.applicationMessage = '';
    this.applicationError = '';
  }
onResumeSelected(event: Event) {

  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {

    this.applicationData.resume = input.files[0];

    console.log(
      'Selected Resume:',
      this.applicationData.resume
    );

  }

}

  cancelApplication() {
    this.showApplyForm = false;
    this.applicationData = {
      resume: null,
      coverLetter: ''
    };
  }

  applyForJob() {

    if (!this.job?._id) {
      return;
    }

  if (!this.applicationData.resume) {
    this.applicationError = 'Please select your resume';
    return;
  }

    this.applying = true;
    this.applicationMessage = '';
    this.applicationError = '';

   const formData = new FormData();

  formData.append(
    'jobId',
    this.job._id
  );

  formData.append(
    'resume',
    this.applicationData.resume
  );

  formData.append(
    'coverLetter',
    this.applicationData.coverLetter
  );
  
    this.candidateService.applyForJob(formData).subscribe({

      next: (response) => {

        console.log('Application Submitted:', response);

        this.applicationMessage =
          response.message ||
          'Application submitted successfully';

        this.showToast(this.applicationMessage, 'success');

        this.applying = false;
        this.showApplyForm = false;

      },

      error: (error) => {

        console.log('Application Error:', error);

        this.applicationError =
          error.error?.message ||
          'Failed to submit application';

        this.showToast(this.applicationError);

        this.applying = false;

      }

    });

  }

  showToast(message: string, type: 'error' | 'success' = 'error') {

    this.toastMessage = message;
    this.toastType = type;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
    }, 3500);

  }

  closeToast() {

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage = '';

  }
}
