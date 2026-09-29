import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../services/candidate';

@Component({
  selector: 'app-c-interviews',
  imports: [CommonModule],
  templateUrl: './c-interviews.html',
  styleUrl: './c-interviews.css',
})
export class CInterviews implements OnInit {

  interviews: any[] = [];

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  expandedInterview: string | null = null;

  constructor(private candidateService: Candidate) { }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews() {


    this.loading = true;
    this.errorMessage = '';

    this.candidateService.getMyInterviews().subscribe({

      next: (response) => {

        console.log(
          'Candidate Interviews:',
          response
        );

        this.interviews =
          response.interviews || [];

        this.loading = false;

      },

      error: (error) => {

        console.log(
          'Failed to load interviews:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to load interviews';

        this.loading = false;

        this.showToast(this.errorMessage);

      }

    });
  }



  formatStatus(status: string): string {

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());

  }

  toggleInterview(interviewId: string) {

    if (this.expandedInterview === interviewId) {

      this.expandedInterview = null;

    } else {

      this.expandedInterview = interviewId;

    }

  }

  //link
  joinInterview(meetingLink: string) {

    if (!meetingLink) {
      return;
    }

    window.open(
      meetingLink,
      '_blank',
      'noopener,noreferrer'
    );

  }

  //Date
  formatInterviewDate(date: string): string {

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

  cancelInterview(interviewId: string) {

    const confirmed = confirm(
      'Are you sure you want to cancel this interview?'
    );

    if (!confirmed) {
      return;
    }

    this.candidateService
      .cancelInterview(interviewId)
      .subscribe({

        next: (response) => {

          console.log(
            'Interview Cancelled:',
            response
          );

          this.showToast(
            response.message ||
            'Interview cancelled successfully',
            'success'
          );

          this.loadInterviews();

        },

        error: (error) => {

          console.log(
            'Cancel Interview Error:',
            error
          );

          this.showToast(
            error.error?.message ||
            'Failed to cancel interview'
          );

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
