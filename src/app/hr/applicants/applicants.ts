import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Hr } from '../../services/hr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-applicants',
  imports: [CommonModule],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css',
})
export class Applicants implements OnInit {

  serverUrl = environment.serverUrl;

  resumeUrl(path: string): string {
    return `${this.serverUrl}/${path.replace(/\\/g, '/')}`;
  }

  applications: any[] = [];
  loading = true;
  errorMessage = '';
  updatingApplicationId = '';

  selectedCoverLetter = '';
  selectedApplicantName = '';

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  constructor(private hrService: Hr, private router: Router) { }

  ngOnInit(): void {
    this.loadApplicants();
  }

  loadApplicants() {
    this.loading = true;
    this.errorMessage = '';

    this.hrService.getApplicants().subscribe({

      next: (response) => {

        console.log('HR Applicants:', response);

        this.applications = response.applications;

        this.loading = false;
      },

      error: (error) => {

        console.log('Failed to load applicants:', error);

        this.errorMessage =
          error.error?.message ||
          'Failed to load applicants';

        this.showToast(this.errorMessage);

        this.loading = false;
      }

    });
  }

  updateStatus(applicationId: string, status: string) {

    this.hrService.updateApplicationStatus(applicationId, status).subscribe({
      next: (response) => {

        console.log(
          'Application Status Updated:',
          response
        );

        const updatedApplication =
          response.foundApplication;

        const index =
          this.applications.findIndex(
            app => app._id === applicationId
          );

        if (index !== -1) {

          this.applications[index] =
            updatedApplication;
        }

        this.showToast(
          response.message || `Status updated to ${status}`,
          'success'
        );

        this.updatingApplicationId = '';
      },

      error: (error) => {

        console.log('Update Application Status Error:', error);

        this.showToast(
          error.error?.message || 'Failed to update application status'
        );

        this.updatingApplicationId = '';
      }

    })

  }

  scheduleInterview(application: any) {

    this.router.navigate(
      ['/hr/interviews'],
      {
        state: {
          applicationId: application._id,
          candidateId: application.candidate?._id
        }
      }
    );

  }

  openCoverLetter(application: any) {
    this.selectedCoverLetter = application.coverLetter || '';
    this.selectedApplicantName = application.candidate?.username || 'Candidate';
  }

  closeCoverLetter() {
    this.selectedCoverLetter = '';
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
