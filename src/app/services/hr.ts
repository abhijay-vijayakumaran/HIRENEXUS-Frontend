import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Hr {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMyJob() {
    const token = localStorage.getItem('token');

    console.log('HR Token exists:', !!token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/hr/jobs`, { headers });
  }



  getJobById(jobId: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(
      `${this.apiUrl}/hr/jobs/${jobId}`, { headers });

  }


  createJob(jobData: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(
      `${this.apiUrl}/hr/jobs`, jobData, { headers });

  }


  updateJob(jobId: string, jobData: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(
      `${this.apiUrl}/hr/jobs/${jobId}`, jobData, { headers });

  }


  deleteJob(jobId: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.apiUrl}/hr/jobs/${jobId}`, { headers });

  }


  getApplicants() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/hr/applicants`, { headers })
  }


  updateApplicationStatus(applicationId: string, status: string) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.apiUrl}/hr/applications/status/${applicationId}`, { status }, { headers })
  }


  //get interviews
  getInterviews() {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/hr/interviews`, { headers });

  }


  scheduleInterview(interviewData: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/hr/interviews`, interviewData, { headers });

  }


  completeInterview(interviewId: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.apiUrl}/hr/interviews/complete/${interviewId}`, {}, { headers });

  }



  addInterviewFeedback(interviewId: string, feedback: string, rating: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.apiUrl}/hr/interviews/feedback/${interviewId}`, { feedback, rating }, { headers });

  }

  cancelInterview(interviewId: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.apiUrl}/hr/interviews/cancel/${interviewId}`, {}, { headers });
  }

  rescheduleInterview(interviewId: string, date: string, time: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.apiUrl}/hr/interviews/reschedule/${interviewId}`, { date, time }, { headers });

  }


}
