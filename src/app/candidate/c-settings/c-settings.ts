import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../services/candidate';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-c-settings',
  imports: [CommonModule, RouterLink],
  templateUrl: './c-settings.html',
  styleUrl: './c-settings.css',
})
export class CSettings implements OnInit {

  profile: any = null;

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  constructor(private candidateService: Candidate, private router: Router) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {

    this.loading = true;
    this.errorMessage = '';

    this.candidateService.getProfile().subscribe({

      next: (response) => {

        console.log(
          'Candidate Settings Profile:',
          response
        );

        this.profile =
          response.foundUser;

        this.loading = false;

      },

      error: (error) => {

        console.log(
          'Failed to load account information:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to load account information';

        this.loading = false;

        this.showToast(this.errorMessage);

      }

    });

  }

  //logout
  logout() {

    const confirmed = confirm(
      'Are you sure you want to logout?'
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);

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
