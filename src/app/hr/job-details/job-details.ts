import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Hr } from '../../services/hr';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css',
})
export class JobDetails implements OnInit {
  job: any = null;

  loading = true;

  errorMessage = '';

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  ngOnInit(): void {

    const jobId = this.route.snapshot.paramMap.get('id');

    if (!jobId) {

      this.errorMessage = 'Invalid job ID';

      this.loading = false;

      return;
    }
    this.loadJob(jobId);

  }

  constructor(private route: ActivatedRoute, private router: Router, private hrService: Hr) { }

  loadJob(jobId: string) {

    this.hrService.getJobById(jobId).subscribe({
      next: (res) => {

        console.log('Job Details:', res);

        this.job = res.foundJob;

        this.loading = false;

      },

      error: (err) => {

        console.log('Failed to load job:', err);

        this.errorMessage =
          err.error?.message ||
          'Failed to load job';

        this.showToast(this.errorMessage);

        this.loading = false;

      }

    })
  }
  goBack() {
    this.router.navigate(['/hr/jobs'])
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
