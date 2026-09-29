import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private serverUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  register(userData: any) {
    return this.http.post(`${this.serverUrl}/register`, userData)
  }

  login(userData: any) {
    return this.http.post<any>(`${this.serverUrl}/login`, userData)
  }

  //LocalStorage
  saveAuthData(res: any) {
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.existUser))//same backend response variable
  }

  getToken() {
    return localStorage.getItem('token')
  }
  getUser() {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user);
    }
    return null
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

}
