import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Hr } from '../../services/hr';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-h-interviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './h-interviews.html',
  styleUrl: './h-interviews.css',
})
export class HInterviews implements OnInit {
  interviews: any[] = [];

  loading = true;
  errorMessage = '';

  showScheduleForm = false;
  scheduling = false;

  scheduleMessage = '';
  scheduleError = '';

  scheduleData = {
    applicationId: '',
    candidateId: '',
    date: '',
    time: '',
    type: 'ONLINE',
    meetingLink: '',
  };

  //feedback
  feedbackInterviewId = '';
  feedbackText = '';
  feedbackRating = 5;
  savingFeedback = false;

  //reschedule
  rescheduleInterviewId = '';
  rescheduleDate = '';
  rescheduleTime = '';
  rescheduling = false;

  //Toast
  toastMessage = '';
  toastType: 'error' | 'success' = 'error';
  private toastTimer: any = null;

  constructor(
    private hrService: Hr,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadInterviews();

    const state = history.state;

    console.log('Interview Navigation State:', state);

    if (state?.applicationId && state?.candidateId) {
      this.scheduleData.applicationId = state.applicationId;

      this.scheduleData.candidateId = state.candidateId;

      this.showScheduleForm = true;
    }
  }

  loadInterviews() {
    this.loading = true;
    this.errorMessage = '';

    this.hrService.getInterviews().subscribe({
      next: (response) => {
        console.log('HR Interviews:', response);

        this.interviews = response.interviews || [];

        this.loading = false;
      },

      error: (error) => {
        console.log('Failed to load HR interviews:', error);

        this.errorMessage = error.error?.message || 'Failed to load interviews';

        this.showToast(this.errorMessage);

        this.loading = false;
      },
    });
  }

  openScheduleForm() {
    this.showScheduleForm = true;

    this.scheduleMessage = '';
    this.scheduleError = '';
  }

  closeScheduleForm() {
    this.showScheduleForm = false;

    this.scheduleData = {
      applicationId: '',
      candidateId: '',
      date: '',
      time: '',
      type: 'ONLINE',
      meetingLink: '',
    };

    this.scheduleMessage = '';
    this.scheduleError = '';
  }

  scheduleInterview() {
    this.scheduleMessage = '';
    this.scheduleError = '';

    if (!this.scheduleData.applicationId) {
      this.scheduleError = 'Please enter application ID';
      return;
    }

    if (!this.scheduleData.candidateId) {
      this.scheduleError = 'Please enter candidate ID';
      return;
    }

    if (!this.scheduleData.date) {
      this.scheduleError = 'Please select interview date';
      return;
    }

    if (!this.scheduleData.time) {
      this.scheduleError = 'Please enter interview time';
      return;
    }

    if (this.scheduleData.type === 'ONLINE' && !this.scheduleData.meetingLink) {
      this.scheduleError = 'Please enter meeting link for online interview';
      return;
    }

    this.scheduling = true;

    this.hrService.scheduleInterview(this.scheduleData).subscribe({
      next: (response) => {
        console.log('Interview Scheduled:', response);

        this.scheduleMessage = response.message || 'Interview scheduled successfully';

        this.showToast(
          response.message || 'Interview scheduled successfully',
          'success'
        );

        this.scheduling = false;

        this.loadInterviews();

        setTimeout(() => {
          this.closeScheduleForm();
        }, 1000);
      },

      error: (error) => {
        console.log('Schedule Interview Error:', error);

        this.scheduleError = error.error?.message || 'Failed to schedule interview';

        this.showToast(this.scheduleError);

        this.scheduling = false;
      },
    });
  }

  completeInterview(interviewId: string) {
    const confirmed = confirm('Are you sure you want to mark this interview as completed?');

    if (!confirmed) {
      return;
    }

    this.hrService.completeInterview(interviewId).subscribe({
      next: (response) => {
        console.log('Interview Completed:', response);

        this.loadInterviews();
      },

      error: (error) => {
        console.log('Complete Interview Error:', error);

        this.showToast(
          error.error?.message || 'Failed to complete interview'
        );
      },
    });
  }

  selectCandidate(interview: any) {
  const confirmed = confirm(
    `Are you sure you want to SELECT ${interview.candidate?.username}?`
  );

  if (!confirmed) return;

  const applicationId = interview.application?._id || interview.application;

  if (!applicationId) {
    alert('Application ID not found');
    return;
  }

  this.hrService.updateApplicationStatus(applicationId, 'SELECTED').subscribe({
    next: (response) => {
      console.log('Candidate Selected:', response);

      this.showToast(
        response.message || 'Candidate selected successfully',
        'success'
      );

      this.loadInterviews();
    },
    error: (error) => {
      console.log('Select Candidate Error:', error);

      this.showToast(
        error.error?.message || 'Failed to select candidate'
      );
    }
  });
}


rejectCandidate(interview: any) {
  const confirmed = confirm(
    `Are you sure you want to REJECT ${interview.candidate?.username}?`
  );

  if (!confirmed) return;

  const applicationId = interview.application?._id || interview.application;

  if (!applicationId) {
    alert('Application ID not found');
    return;
  }

  this.hrService.updateApplicationStatus(applicationId, 'REJECTED').subscribe({
    next: (response) => {
      console.log('Candidate Rejected:', response);

      this.showToast(
        response.message || 'Candidate rejected successfully',
        'success'
      );

      this.loadInterviews();
    },
    error: (error) => {
      console.log('Reject Candidate Error:', error);

      this.showToast(
        error.error?.message || 'Failed to reject candidate'
      );
    }
  });
}

  //feedback
  openFeedbackForm(interview: any) {
    this.feedbackInterviewId = interview._id;

    this.feedbackText = interview.feedback || '';

    this.feedbackRating = interview.rating || 5;
  }

  cancelFeedback() {
    this.feedbackInterviewId = '';
    this.feedbackText = '';
    this.feedbackRating = 5;
  }

  saveFeedback(interviewId: string) {
    if (!this.feedbackText.trim()) {
      this.showToast('Please enter interview feedback');
      return;
    }

    this.savingFeedback = true;

    this.hrService
      .addInterviewFeedback(interviewId, this.feedbackText, this.feedbackRating)
      .subscribe({
        next: (response) => {
          console.log('Interview Feedback Saved:', response);

          this.showToast(
            response.message || 'Feedback saved successfully',
            'success'
          );

          this.savingFeedback = false;

          this.cancelFeedback();

          this.loadInterviews();
        },

        error: (error) => {
          console.log('Feedback Error:', error);

          this.showToast(
            error.error?.message || 'Failed to save feedback'
          );

          this.savingFeedback = false;
        },
      });
  }


  cancelInterview(interviewId: string) {

    const confirmed = confirm(
      'Are you sure you want to cancel this interview?'
    );

    if (!confirmed) {
      return;
    }

    this.hrService
      .cancelInterview(interviewId)
      .subscribe({

        next: (response) => {

          console.log(
            'Interview Cancelled:',
            response
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

  openRescheduleForm(interview: any) {

    this.rescheduleInterviewId = interview._id;
    this.rescheduleDate = interview.date;
    this.rescheduleTime = interview.time;

  }
  
  cancelReschedule() {

    this.rescheduleInterviewId = '';
    this.rescheduleDate = '';
    this.rescheduleTime = '';
  }

  saveReschedule(interviewId: string) {

    if (!this.rescheduleDate) {

      this.showToast('Please select interview date');

      return;

    }

    if (!this.rescheduleTime) {

      this.showToast('Please select interview time');

      return;

    }

    this.rescheduling = true;

    this.hrService
      .rescheduleInterview(
        interviewId,
        this.rescheduleDate,
        this.rescheduleTime
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Interview Rescheduled:',
            response
          );

          this.showToast(
            response.message || 'Interview rescheduled successfully',
            'success'
          );

          this.rescheduling = false;

          this.cancelReschedule();

          this.loadInterviews();

        },

        error: (error) => {

          console.log(
            'Reschedule Interview Error:',
            error
          );

          this.showToast(
            error.error?.message ||
            'Failed to reschedule interview'
          );

          this.rescheduling = false;

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

