import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hr } from '../../services/hr';

@Component({
  selector: 'app-edit-job',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-job.html',
  styleUrl: './edit-job.css',
})
export class EditJob implements OnInit {

  jobForm: FormGroup;

  jobId = '';

  loading = true;

  updating = false;

  errorMessage = '';

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private hrService: Hr) {
    this.jobForm = this.fb.group({

      title: ['', Validators.required],

      description: ['', Validators.required],

      department: ['', Validators.required],

      location: ['', Validators.required],

      employmentType: ['', Validators.required],

      salary: ['', [
        Validators.required,
        Validators.min(0)
      ]],

      skills: ['', Validators.required],

      experience: ['', Validators.required],

      status: ['DRAFT', Validators.required],

      deadline: ['', Validators.required]

    });


  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.errorMessage = 'Invalid job ID';

      this.loading = false;

      return;
    }

    this.jobId = id;

    this.loadJob();
  }

  loadJob() {

    this.hrService.getJobById(this.jobId).subscribe({

      next: (response) => {

        console.log('Edit Job Data:', response);

        const job = response.foundJob;

        this.jobForm.patchValue({

          title: job.title,

          description: job.description,

          department: job.department,

          location: job.location,

          employmentType: job.employmentType,

          salary: job.salary,

          skills: job.skills.join(', '),

          experience: job.experience,

          status: job.status,

          deadline: job.deadline
            ? job.deadline.substring(0, 10)
            : ''

        });

        this.loading = false;

      },

      error: (error) => {

        console.log('Failed to load job:', error);

        this.errorMessage =
          error.error?.message ||
          'Failed to load job';

        this.showToast(this.errorMessage);

        this.loading = false;

      }

    });

  }

  updateJob() {

    if (this.jobForm.invalid) {

      this.jobForm.markAllAsTouched();

      return;

    }

    this.updating = true;

    this.errorMessage = '';


    const formValue = this.jobForm.value;


    const jobData = {

      ...formValue,

      salary: Number(formValue.salary),

      skills: formValue.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill !== '')

    };


    console.log('Updated Job Data:', jobData);


    this.hrService.updateJob(
      this.jobId,
      jobData
    ).subscribe({

      next: (response) => {

        console.log('Job Updated:', response);

        this.updating = false;

        this.showToast(
          response.message || 'Job updated successfully',
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/hr/jobs']);
        }, 1200);

      },

      error: (error) => {

        console.log('Update Job Error:', error);

        this.updating = false;

        this.errorMessage =
          error.error?.message ||
          'Failed to update job';

        this.showToast(this.errorMessage);

      }

    });

  }


  cancel() {

    this.router.navigate(['/hr/jobs']);

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
