import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../services/candidate';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-c-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './c-profile.html',
  styleUrl: './c-profile.css',
})
export class CProfile implements OnInit {

   profile: any = null;

  loading = true;
  errorMessage = '';

  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  //Edit
    editMode = false;
  saving = false;

  successMessage = '';
  saveError = '';

  editData = {
    username: '',
    phone: '',
    location: '',
    education: '',
    skills: '',
    experience: '',
    bio: ''
  };

  constructor(private candidateService:Candidate){}


  ngOnInit(): void {
      this.loadProfile();
  }



  loadProfile(){
     this.loading = true;
    this.errorMessage = '';

    this.candidateService.getProfile().subscribe({

      next: (response) => {

        console.log(
          'Candidate Profile:',
          response
        );

        this.profile = response.foundUser;

        this.loading = false;

      },

      error: (error) => {

        console.log(
          'Failed to load profile:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to load profile';

        this.loading = false;

        this.showToast(this.errorMessage);

      }

    });


  }

    openEditMode() {

    this.successMessage = '';
    this.saveError = '';

    this.editData = {

      username: this.profile?.username || '',

      phone: this.profile?.phone || '',

      location: this.profile?.location || '',

      education: this.profile?.education || '',

      skills: this.profile?.skills
        ? this.profile.skills.join(', ')
        : '',

      experience: this.profile?.experience || '',

      bio: this.profile?.bio || ''

    };

    this.editMode = true;

  }

  cancelEdit() {

    this.editMode = false;

    this.successMessage = '';
    this.saveError = '';

  }

  saveProfile() {

    this.successMessage = '';
    this.saveError = '';

    if (!this.editData.username.trim()) {

      this.saveError =
        'Username is required';

      return;

    }

    this.saving = true;

    const updatedData = {

      username:
        this.editData.username.trim(),

      phone:
        this.editData.phone.trim(),

      location:
        this.editData.location.trim(),

      education:
        this.editData.education.trim(),

      skills:
        this.editData.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0),

      experience:
        this.editData.experience.trim(),

      bio:
        this.editData.bio.trim()

    };

    this.candidateService
      .updateProfile(updatedData)
      .subscribe({

        next: (response) => {

          console.log(
            'Profile Updated:',
            response
          );

          this.profile =
            response.updatedProfile;

          this.successMessage =
            response.message ||
            'Profile updated successfully';

          this.showToast(this.successMessage, 'success');

          this.saving = false;

          this.editMode = false;

        },

        error: (error) => {

          console.log(
            'Profile Update Error:',
            error
          );

          this.saveError =
            error.error?.message ||
            'Failed to update profile';

          this.showToast(this.saveError);

          this.saving = false;

        }

      });

  }

  //completion

  getProfileCompletion(): number {

  if (!this.profile) {
    return 0;
  }

  const fields = [
    this.profile.username,
    this.profile.phone,
    this.profile.location,
    this.profile.education,
    this.profile.skills?.length > 0,
    this.profile.experience,
    this.profile.bio
  ];

  const completedFields =
    fields.filter(field => {
      if (typeof field === 'boolean') {
        return field;
      }

      return field &&
        field.toString().trim().length > 0;
    }).length;

  return Math.round(
    (completedFields / fields.length) * 100
  );

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
