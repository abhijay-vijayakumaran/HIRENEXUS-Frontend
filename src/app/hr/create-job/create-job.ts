import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Hr } from '../../services/hr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-job',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css',
})
export class CreateJob {

  jobForm: FormGroup

  loading = false
  errorMessage = ''

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  constructor(private fb: FormBuilder, private hrService: Hr, private router: Router) {

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
    })
  }


  createJob() {

    if (this.jobForm.invalid) {

      this.jobForm.markAllAsTouched();

      return;
    }

    this.loading = true;

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


    console.log('Job Data:', jobData);

    this.hrService.createJob(jobData).subscribe({
      next: (res) => {
        console.log('Job Created:', res);

        this.loading = false;

        this.showToast(
          res.message || 'Job created successfully',
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/hr/jobs']);
        }, 1200);

      },
      error: (err) => {
        console.log('Create Job Error:', err);

        this.loading = false;

        this.errorMessage =
          err.error?.message ||
          'Failed to create job';

        this.showToast(this.errorMessage);
      }
    })


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
