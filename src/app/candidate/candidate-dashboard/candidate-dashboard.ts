import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Candidate } from '../../services/candidate';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-candidate-dashboard',
  imports: [CommonModule],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.css',
})
export class CandidateDashboard implements OnInit, AfterViewInit {

  username = ''
  totalJobs = 0;
  totalApplications = 0;
  underReview = 0;
  shortlisted = 0;
  interview = 0;
  selected = 0;
  rejected = 0;

  applications: any[] = [];

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  //new interviews
  interviews: any[] = [];
  upcomingInterview: any = null;

  //charts
  @ViewChild('applicationChart')
  applicationChart!: ElementRef<HTMLCanvasElement>;
  applicationChartInstance: Chart | undefined;

  @ViewChild('interviewChart')
  interviewChart!: ElementRef<HTMLCanvasElement>;
  interviewChartInstance: Chart | undefined;

  constructor(private candidateService: Candidate, private router: Router) { }

  ngAfterViewInit(): void {
      this.createApplicationChart();
  this.createInterviewChart();
  }

  ngOnInit(): void {
    this.username = this.getUsername();
    this.loadDashboard();

    this.loadInterviews()
    this.loadApplications()
  }

  getUsername() {

    const user = localStorage.getItem('user');

    if (user) {

      const userData = JSON.parse(user);

      return userData.username || 'Candidate';

    }

    return 'Candidate';

  }

  loadDashboard() {

    this.loading = true;
    this.errorMessage = '';

    this.candidateService.getJobs().subscribe({

      next: (jobResponse: any) => {

        this.totalJobs = jobResponse.jobs.length;

        this.loadApplications();

      },

      error: (error: any) => {

        console.log(
          'Failed to load candidate jobs:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to load dashboard';

        this.loading = false;

        this.showToast(this.errorMessage);

      }

    });

  }


  loadApplications() {

    this.candidateService.getMyApplications().subscribe({

      next: (response) => {

        console.log(
          'Candidate Applications:',
          response
        );

        this.applications =
          response.applications || [];

        this.totalApplications =
          this.applications.length;

        this.calculateStatistics();

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


  calculateStatistics() {

    this.underReview =
      this.applications.filter(
        app => app.status === 'UNDER_REVIEW'
      ).length;


    this.shortlisted =
      this.applications.filter(
        app => app.status === 'SHORTLISTED'
      ).length;


    this.interview =
      this.applications.filter(
        app => app.status === 'INTERVIEW'
      ).length;


    this.selected =
      this.applications.filter(
        app => app.status === 'SELECTED'
      ).length;


    this.rejected =
      this.applications.filter(
        app => app.status === 'REJECTED'
      ).length;

      this.createApplicationChart();

  }

  //upcomming interview
  loadInterviews() {

    this.candidateService.getMyInterviews().subscribe({

      next: (response) => {

        console.log(
          'Candidate Dashboard Interviews:',
          response
        );

        this.interviews =
          response.interviews || [];

        this.findUpcomingInterview();
        this.createInterviewChart();

      },

      error: (error) => {

        console.log(
          'Failed to load interviews:',
          error
        );

        this.interviews = [];
        this.upcomingInterview = null;

        this.showToast(
          error.error?.message ||
          'Failed to load interviews'
        );

      }

    });

  }

  findUpcomingInterview() {

    const now = Date.now();

    const upcoming = this.interviews
      .filter(interview => interview.status === 'SCHEDULED')
      .map(interview => ({
        interview,
        ts: this.getInterviewTimeMs(interview)
      }))
      .filter(entry => !isNaN(entry.ts) && entry.ts >= now)
      .sort((a, b) => a.ts - b.ts);

    this.upcomingInterview =
      upcoming.length > 0
        ? upcoming[0].interview
        : null;

  }

  private getInterviewTimeMs(interview: any): number {

    const dateStr = String(interview.date || '').split('T')[0];

    if (!dateStr) {
      return NaN;
    }

    let hours = 0;
    let minutes = 0;

    const timeStr = String(interview.time || '').trim().toUpperCase();

    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*([AP]?M)?$/);

    if (match) {

      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);

      if (match[3] === 'PM' && hours < 12) {
        hours += 12;
      }

      if (match[3] === 'AM' && hours === 12) {
        hours = 0;
      }

    }

    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    return new Date(`${dateStr}T${time}`).getTime();

  }
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
  formatInterviewType(type: string): string {

    if (!type) {
      return '';
    }

    return type
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());

  }

  viewAllInterviews() {

    this.router.navigate([
      '/candidate/interviews'
    ]);

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


  //charts
  createApplicationChart() {

  if (!this.applicationChart) {
    return;
  }

  if (this.applicationChartInstance) {
    this.applicationChartInstance.destroy();
  }

  const applied =
    this.totalApplications -
    this.underReview -
    this.shortlisted -
    this.interview -
    this.selected -
    this.rejected;

  this.applicationChartInstance = new Chart(
    this.applicationChart.nativeElement,
    {
      type: 'doughnut',

      data: {

        labels: [
          'Applied',
          'Under Review',
          'Shortlisted',
          'Interview',
          'Selected',
          'Rejected'
        ],

        datasets: [
          {
            label: 'Applications',

            data: [
              applied,
              this.underReview,
              this.shortlisted,
              this.interview,
              this.selected,
              this.rejected
            ]
          }
        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            position: 'bottom'
          }

        }

      }

    }
  );

}
createInterviewChart() {

  if (!this.interviewChart) {
    return;
  }

  if (this.interviewChartInstance) {
    this.interviewChartInstance.destroy();
  }

  const scheduled =
    this.interviews.filter(
      interview => interview.status === 'SCHEDULED'
    ).length;

  const completed =
    this.interviews.filter(
      interview => interview.status === 'COMPLETED'
    ).length;

  const cancelled =
    this.interviews.filter(
      interview => interview.status === 'CANCELLED'
    ).length;

  const rescheduled =
    this.interviews.filter(
      interview => interview.status === 'RESCHEDULED'
    ).length;


  this.interviewChartInstance = new Chart(
    this.interviewChart.nativeElement,
    {
      type: 'doughnut',

      data: {

        labels: [
          'Scheduled',
          'Completed',
          'Cancelled',
          'Rescheduled'
        ],

        datasets: [
          {
            label: 'Interviews',

            data: [
              scheduled,
              completed,
              cancelled,
              rescheduled
            ]
          }
        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            position: 'bottom'
          }

        }

      }

    }
  );

}

}
