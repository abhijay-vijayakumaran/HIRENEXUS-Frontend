import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../services/candidate';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-jobs',
  imports: [CommonModule,FormsModule],
  templateUrl: './candidate-jobs.html',
  styleUrl: './candidate-jobs.css',
})
export class CandidateJobs implements OnInit {

  jobs: any[] = [];
  filteredJobs: any[] = [];

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  // Search
  searchTerm = '';

  // Filters
  selectedDepartment = '';
  selectedLocation = '';
  selectedEmploymentType = '';

  // Filter options
  departments: string[] = [];
  locations: string[] = [];
  employmentTypes: string[] = [
    'full-time',
    'part-time',
    'contract',
    'internship'
  ];


  constructor(private candidateService: Candidate, private router: Router) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {

    this.loading = true;
    this.errorMessage = '';

    this.candidateService.getJobs().subscribe({

      next: (res) => {

        console.log('Candidate Jobs:', res);
        this.jobs = res.jobs || [];

        this.filteredJobs = [...this.jobs];

        // Create filter options
        this.createFilterOptions();

        this.loading = false;
      },
      error: (err) => {
        console.log('Failed to load jobs:', err);
        this.errorMessage = err.error?.message || 'Failed to load jobs';
        this.loading = false;
        this.showToast(this.errorMessage);
      }
    })
  }

createFilterOptions(){
   this.departments = [
      ...new Set(
        this.jobs
          .map(job => job.department)
          .filter(value => value)
      )
    ];

    this.locations = [
      ...new Set(
        this.jobs
          .map(job => job.location)
          .filter(value => value)
      )
    ];

}

applyFilters(){

    const search = this.searchTerm.trim().toLowerCase();

        this.filteredJobs = this.jobs.filter(job => {

      // Search
      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(search) ||
        job.department?.toLowerCase().includes(search) ||
        job.location?.toLowerCase().includes(search) ||
        job.skills?.some(
          (skill: string) =>
            skill.toLowerCase().includes(search)
        );

      // Department
      const matchesDepartment =
        !this.selectedDepartment ||
        job.department === this.selectedDepartment;

      // Location
      const matchesLocation =
        !this.selectedLocation ||
        job.location === this.selectedLocation;

      // Employment type
      const matchesEmploymentType =
        !this.selectedEmploymentType ||
        job.employmentType === this.selectedEmploymentType;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesLocation &&
        matchesEmploymentType
      );

    });


}


  clearFilters() {

    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedLocation = '';
    this.selectedEmploymentType = '';

    this.filteredJobs = [...this.jobs];

  }

  viewJob(jobId: string) {

    this.router.navigate(['/candidate/jobs', jobId]);
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
