import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Candidate {

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }



  getJobs() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/candidate/jobs`, { headers })
  }

  getJobById(jobId: string) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/candidate/jobs/${jobId}`, { headers })
  }


  applyForJob(applicationData: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/candidate/applications`, applicationData, { headers });
  }

  getMyApplications() {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/candidate/applications`, { headers });

  }


  withdrawApplication(applicationId: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.apiUrl}/candidate/applications/withdraw/${applicationId}`, {}, { headers });

  }


  getMyInterviews() {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(
    `${this.apiUrl}/candidate/interviews`,
    { headers }
  );

}


cancelInterview(interviewId: string) {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.patch<any>(
    `${this.apiUrl}/candidate/interviews/cancel/${interviewId}/`,
    {},
    { headers }
  );

}


//profile
getProfile() {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(`${this.apiUrl}/candidate/profile`,{ headers });

}

//edit
updateProfile(profileData: any) {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.patch<any>(`${this.apiUrl}/candidate/profile`,profileData,{ headers });

}

}
