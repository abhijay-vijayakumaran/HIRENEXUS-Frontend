import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../services/candidate';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-candidate-applications',
  imports: [CommonModule,FormsModule],
  templateUrl: './candidate-applications.html',
  styleUrl: './candidate-applications.css',
})
export class CandidateApplications implements OnInit {

  serverUrl = environment.serverUrl;

  resumeUrl(path: string): string {
    return `${this.serverUrl}/${path.replace(/\\/g, '/')}`;
  }

  applications: any[] = [];

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  //expand
  expandedApplication: string | null = null;

  //search 
  searchTerm = '';
  filteredApplications: any[] = [];

  constructor(private candidateService: Candidate) { }


  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {

    this.loading = true;
    this.errorMessage = '';


    this.candidateService.getMyApplications().subscribe({

      next: (response) => {

        console.log(
          'My Applications:',
          response
        );

        this.applications =
          response.applications || [];

        this.filteredApplications =
          [...this.applications];
        this.loading = false;
      },

      error: (error) => {

        console.log(
          'Failed to load applications:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to load applications';

        this.loading = false;

        this.showToast(this.errorMessage);
      }

    });

  }

  searchApplications() {

  const search = this.searchTerm
    .trim()
    .toLowerCase();

  this.filteredApplications =
    this.applications.filter(application => {

      return (
        application.job?.title
          ?.toLowerCase()
          .includes(search) ||

        application.job?.department
          ?.toLowerCase()
          .includes(search) ||

        application.job?.location
          ?.toLowerCase()
          .includes(search) ||

        application.status
          ?.toLowerCase()
          .includes(search)
      );

    });

}

  formatStatus(status: string): string {

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());

  }

  getStatusStep(status: string): number {

    const steps = [
      'APPLIED',
      'UNDER_REVIEW',
      'SHORTLISTED',
      'INTERVIEW',
      'SELECTED'
    ];

    return steps.indexOf(status);

  }

  toggleApplication(applicationId: string) {

    if (this.expandedApplication === applicationId) {
      this.expandedApplication = null;
    } else {
      this.expandedApplication = applicationId;
    }

  }

  withdrawApplication(applicationId: string) {

    const confirmed = confirm(
      'Are you sure you want to withdraw this application?'
    );

    if (!confirmed) {
      return;
    }

    this.candidateService
      .withdrawApplication(applicationId)
      .subscribe({

        next: (response) => {

          console.log(
            'Application Withdrawn:',
            response
          );

          this.showToast(
            response.message ||
            'Application withdrawn successfully',
            'success'
          );

          // Reload applications
          this.loadApplications();

        },

        error: (error) => {

          console.log(
            'Withdraw Error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to withdraw application';

          this.showToast(this.errorMessage);

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
