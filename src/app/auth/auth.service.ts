import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authdata } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: Authdata = {
      email: email,
      password: password,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
  login(email: string, password: string) {
    const authData = { email, password };
    this.http
      .post('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
