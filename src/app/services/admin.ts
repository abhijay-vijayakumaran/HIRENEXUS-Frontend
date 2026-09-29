import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Admin {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAdminStats() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })

    return this.http.get(`${this.apiUrl}/admin/stats`, { headers })
  }

  getAllUsers() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/admin/users`, { headers })
  }


  updateUserStatus(userId: string, status: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(
      `${this.apiUrl}/admin/users/status/${userId}`, { status }, { headers });
  }

  updateUserRole(userId: string, role: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(
      `${this.apiUrl}/admin/users/role/${userId}`, { role }, { headers });
  }


}
