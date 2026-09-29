import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Hr } from '../../services/hr';

import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)



@Component({
  selector: 'app-hr-dashboard',
  imports: [CommonModule],
  templateUrl: './hr-dashboard.html',
  styleUrl: './hr-dashboard.css',
})


export class HrDashboard implements OnInit, AfterViewInit {


  jobs: any[] = [];

  totalJobs = 0;
  openJobs = 0;
  draftJobs = 0;
  closedJobs = 0;
  pausedJobs = 0;


  totalApplicants = 0;

  appliedApplicants = 0;
  underReviewApplicants = 0;
  shortlistedApplicants = 0;
  interviewApplicants = 0;
  selectedApplicants = 0;
  rejectedApplicants = 0;

  totalInterviews = 0;
  scheduledInterviews = 0;
  completedInterviews = 0;
  cancelledInterviews = 0;
  rescheduledInterviews = 0;

  //Charts
  @ViewChild('applicationChart')
  applicationChart!: ElementRef<HTMLCanvasElement>;
  applicationChartInstance: Chart | undefined;

  @ViewChild('interviewChart')
  interviewChart!: ElementRef<HTMLCanvasElement>;
  interviewChartInstance: Chart | undefined;

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

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


  ngAfterViewInit(): void {
    this.createApplicationChart();
    this.createInterviewChart();
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadApplicants();
    this.loadInterviews();
  }


  refreshDashboard() {

  this.loadJobs();

  this.loadApplicants();

  this.loadInterviews();

}
  loadJobs() {

    this.hrService.getMyJob().subscribe({
      next: (res) => {

        console.log('HR Jobs:', res);

        this.jobs = res.jobs || []
        console.log('Fetched jobs count:', this.jobs.length);

        this.calculateStats();

      },


      error: (err) => {

        console.log('Failed to load HR jobs:', err);

        this.showToast(
          err.error?.message || 'Failed to load jobs'
        );

      }
    })
  }

  loadApplicants() {

    this.hrService.getApplicants().subscribe({

      next: (res) => {

        console.log(
          'HR Dashboard Applicants:',
          res
        );

        const applications =
          res.applications || [];

        this.calculateApplicantStats(
          applications
        );

      },

      error: (err) => {

        console.log(
          'Failed to load HR applicants:',
          err
        );

        this.showToast(
          err.error?.message || 'Failed to load applicants'
        );

      }

    });

  }
  loadInterviews() {

    this.hrService.getInterviews().subscribe({

      next: (res) => {

        console.log(
          'HR Dashboard Interviews:',
          res
        );

        const interviews =
          res.interviews || [];

        this.calculateInterviewStats(
          interviews
        );

      },

      error: (err) => {

        console.log(
          'Failed to load HR interviews:',
          err
        );

        this.showToast(
          err.error?.message || 'Failed to load interviews'
        );

      }

    });

  }
  calculateInterviewStats(
    interviews: any[]
  ) {

    this.totalInterviews =
      interviews.length;

    this.scheduledInterviews =
      interviews.filter(
        interview =>
          interview.status === 'SCHEDULED'
      ).length;

    this.completedInterviews =
      interviews.filter(
        interview =>
          interview.status === 'COMPLETED'
      ).length;

    this.cancelledInterviews =
      interviews.filter(
        interview =>
          interview.status === 'CANCELLED'
      ).length;

    this.rescheduledInterviews =
      interviews.filter(
        interview =>
          interview.status === 'RESCHEDULED'
      ).length;

      this.createInterviewChart();

  }

  calculateApplicantStats(
    applications: any[]
  ) {

    this.totalApplicants =
      applications.length;

    this.appliedApplicants =
      applications.filter(
        app => app.status === 'APPLIED'
      ).length;

    this.underReviewApplicants =
      applications.filter(
        app => app.status === 'UNDER_REVIEW'
      ).length;

    this.shortlistedApplicants =
      applications.filter(
        app => app.status === 'SHORTLISTED'
      ).length;

    this.interviewApplicants =
      applications.filter(
        app => app.status === 'INTERVIEW'
      ).length;

    this.selectedApplicants =
      applications.filter(
        app => app.status === 'SELECTED'
      ).length;

    this.rejectedApplicants =
      applications.filter(
        app => app.status === 'REJECTED'
      ).length;

    // Refresh chart with updated API data
    this.createApplicationChart();
  }

  calculateStats() {

    this.totalJobs = this.jobs.length;

    this.openJobs = this.jobs.filter(
      job => job.status === 'OPEN'
    ).length;

    this.draftJobs = this.jobs.filter(
      job => job.status === 'DRAFT'
    ).length;

    this.closedJobs = this.jobs.filter(
      job => job.status === 'CLOSED'
    ).length;

    this.pausedJobs = this.jobs.filter(
      job => job.status === 'PAUSED'
    ).length;

  }


  //Charts
  createApplicationChart() {

    if (!this.applicationChart) {
      return;
    }

    if (this.applicationChartInstance) {
      this.applicationChartInstance.destroy();
    }

    this.applicationChartInstance =
      new Chart(
        this.applicationChart.nativeElement,
        {

          type: 'bar',

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
                  this.appliedApplicants,
                  this.underReviewApplicants,
                  this.shortlistedApplicants,
                  this.interviewApplicants,
                  this.selectedApplicants,
                  this.rejectedApplicants
                ]
              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

              y: {

                beginAtZero: true,

                ticks: {

                  precision: 0

                }

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

    this.interviewChartInstance =
      new Chart(
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
                  this.scheduledInterviews,
                  this.completedInterviews,
                  this.cancelledInterviews,
                  this.rescheduledInterviews
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
