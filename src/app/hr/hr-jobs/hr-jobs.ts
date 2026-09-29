import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Hr } from '../../services/hr';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hr-jobs',
  imports: [CommonModule, RouterLink],
  templateUrl: './hr-jobs.html',
  styleUrl: './hr-jobs.css',
})
export class HrJobs implements OnInit {

  jobs: any[] = []

  loading = true

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  ngOnInit(): void {
    this.loadJobs()
  }

  constructor(private hrService: Hr) { }

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

  loadJobs() {
    this.loading = true

    this.hrService.getMyJob().subscribe({
      next: (res) => {
        console.log("My Jobs", res);

        this.jobs = res.jobs

        this.loading = false
      },

      error: (err) => {

        console.log("Failed to load jobs", err);

        this.showToast(
          err.error?.message || 'Failed to load jobs'
        );

        this.loading = false

      }
    })

  }


  deleteJob(jobId:string) {

    const confirmed = confirm(
      'Are you sure you want to delete this job?'
    );

    if (!confirmed) {
      return;
    }

    this.hrService.deleteJob(jobId).subscribe({

      next: (response) => {

        console.log('Job Deleted:', response);

        this.jobs = this.jobs.filter(
          job => job._id !== jobId
        );

        this.showToast(
          response.message || 'Job deleted successfully',
          'success'
        );

      },

      error: (error) => {

        console.log('Delete Job Error:', error);

        this.showToast(
          error.error?.message || 'Failed to delete job'
        );

      }

    });
  }


}
