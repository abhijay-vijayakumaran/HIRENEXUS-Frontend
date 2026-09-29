import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]*')]],
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

  login() {
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.closeToast();

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Loggedin Successfully', res);

        this.showToast('Loggedin Successfully', 'success');

        //api call for localStorage
        this.auth.saveAuthData(res);
        console.log('Token:', this.auth.getToken()); //for checking
        console.log('User:', this.auth.getUser());

        const user = this.auth.getUser();
        if (!user) {
          console.log('User data not found');
          return;
        }

        setTimeout(() => {
          // rolebased
          if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (user.role === 'hr') {
            this.router.navigate(['/hr/dashboard']);
          } else if (user.role === 'candidate') {
            this.router.navigate(['/candidate/dashboard']);
          } else {
            console.log('Unknown user role:', user.role);
          }
        }, 2000);
      },
      error: (err) => {
        console.log('Login Error', err);

        const msg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'Login failed. Please try again.';

        this.showToast(msg, 'error');
      },
    });
  }
}
