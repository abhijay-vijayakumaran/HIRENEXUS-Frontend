import {
  Component, OnInit, AfterViewInit,
  ElementRef,
  ViewChild, ChangeDetectorRef
} from '@angular/core';
import { Admin } from '../../services/admin';
import { CommonModule } from '@angular/common';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {

  stats: any = null;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;


  constructor(private adminService: Admin, private cdr: ChangeDetectorRef) { }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }

  closeToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastVisible = false;
  }

  ngAfterViewInit(): void {
    this.createUserChart();
    this.createJobChart();
    this.createApplicationChart();
    this.createInterviewChart();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  //charts
  @ViewChild('userChart')
  userChart!: ElementRef<HTMLCanvasElement>;
  userChartInstance: Chart | undefined;


  @ViewChild('jobChart')
  jobChart!: ElementRef<HTMLCanvasElement>;
  jobChartInstance: Chart | undefined;


  @ViewChild('applicationChart')
  applicationChart!: ElementRef<HTMLCanvasElement>;
  applicationChartInstance: Chart | undefined;


  @ViewChild('interviewChart')
  interviewChart!: ElementRef<HTMLCanvasElement>;
  interviewChartInstance: Chart | undefined;

  //charts
  createUserChart() {

    if (!this.userChart || !this.stats) return;

    if (this.userChartInstance) {
      this.userChartInstance.destroy();
    }

    this.userChartInstance = new Chart(
      this.userChart.nativeElement,
      {
        type: 'doughnut',

        data: {

          labels: [
            'Administrators',
            'HR',
            'Candidates'
          ],

          datasets: [{

            label: 'Users',

            data: [
              this.stats.totalAdmins,
              this.stats.totalHRs,
              this.stats.totalCandidates
            ]

          }]

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

  createJobChart() {

    if (!this.jobChart || !this.stats) return;

    if (this.jobChartInstance) {
      this.jobChartInstance.destroy();
    }

    this.jobChartInstance = new Chart(
      this.jobChart.nativeElement,
      {
        type: 'bar',

        data: {

          labels: [
            'Open',
            'Draft',
            'Closed',
            'Paused'
          ],

          datasets: [{

            label: 'Jobs',

            data: [
              this.stats.openJobs,
              this.stats.draftJobs,
              this.stats.closedJobs,
              this.stats.pausedJobs
            ]

          }]

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

  createApplicationChart() {

    if (!this.applicationChart || !this.stats) return;

    if (this.applicationChartInstance) {
      this.applicationChartInstance.destroy();
    }

    this.applicationChartInstance = new Chart(
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
            'Rejected',
            'Withdrawn'
          ],

          datasets: [{

            label: 'Applications',

            data: [
              this.stats.appliedApplications,
              this.stats.underReviewApplications,
              this.stats.shortlistedApplications,
              this.stats.interviewApplications,
              this.stats.selectedApplications,
              this.stats.rejectedApplications,
              this.stats.withdrawnApplications
            ]

          }]

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

    if (!this.interviewChart || !this.stats) return;

    if (this.interviewChartInstance) {
      this.interviewChartInstance.destroy();
    }

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

          datasets: [{

            label: 'Interviews',

            data: [
              this.stats.scheduledInterviews,
              this.stats.completedInterviews,
              this.stats.cancelledInterviews,
              this.stats.rescheduledInterviews
            ]

          }]

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


loadStats() {

  this.adminService.getAdminStats().subscribe({

    next: (res) => {

      console.log('Admin Stats:', res);

      this.stats = res;

      // Render the @if(stats) section first
      this.cdr.detectChanges();

      // Create charts after canvas elements exist
      this.createUserChart();
      this.createJobChart();
      this.createApplicationChart();
      this.createInterviewChart();

    },

    error: (err) => {

      console.log('Failed to load admin stats:', err);
      this.showToast('Failed to load dashboard statistics. Please try again.', 'error');

    }

  });

}

}
