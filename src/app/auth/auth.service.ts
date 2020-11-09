import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthType, AuthData } from '../app.constants';

const API_URL = `${environment.apiUrl}/users`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any;
  constructor(private _http: HttpClient, private _router: Router) {}

  login(authData: AuthData) {
    // Returning a promise instead of subscription, because we need to do
    // some processing here on the result
    return new Promise((resolve, reject) => {
      this._http
        .post<{ message: string; userData: any }>(`${API_URL}/login`, authData)
        .subscribe(
          (response) => {
            this.currentUser = response.userData;
            console.log(this.currentUser);
            resolve({
              isSuccess: true,
              username: this.currentUser.user.username,
            });
          },
          (error) => {
            this.currentUser = null;
            console.log('login error', error);
            reject({ isSuccess: false, error });
          }
        );
    });
  }

  logout() {
    this.currentUser = null;
    this._router.navigate(['/']);
  }
}
