import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthType, AuthData } from '../app.constants';
import { BehaviorSubject } from 'rxjs';

const API_URL = `${environment.apiUrl}/users`;

interface AuthListenerData {
  isUserAuthenticated: boolean;
  username: string;
  userId: string;
  avatar: string;
  name: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any;
  private _authStatusListener = new BehaviorSubject<{
    authData: AuthListenerData;
  }>({
    authData: {
      isUserAuthenticated: false,
      username: null,
      userId: null,
      avatar: null,
      name: null,
      token: null,
    },
  });

  constructor(private _http: HttpClient, private _router: Router) {}

  getAuthStatusListener() {
    /** Return a auth status listener to those concerned, but
     * return as an observable to avoid any modifications to the listener by the requestor
     */
    return this._authStatusListener.asObservable();
  }

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
            this._updateListener(AuthType.UPDATE_USER);
            resolve({
              isSuccess: true,
              username: this.currentUser.user.username,
            });
            this._router.navigate(['/admin']);
          },
          (error) => {
            this.currentUser = null;
            this._updateListener(AuthType.RESET_USER);
            console.log('login error', error);
            reject({ isSuccess: false, error });
          }
        );
    });
  }

  logout() {
    this.currentUser = null;
    this._updateListener(AuthType.RESET_USER);
    this._router.navigate(['/']);
  }

  private _updateListener(authRequestType: AuthType) {
    if (authRequestType === AuthType.UPDATE_USER) {
      const { username, _id, avatar, name } = this.currentUser.user;

      this._authStatusListener.next({
        authData: {
          isUserAuthenticated: true,
          username,
          userId: _id,
          avatar,
          name,
          token: this.currentUser.token,
        },
      });
    } else {
      this._authStatusListener.next({
        authData: {
          isUserAuthenticated: false,
          username: null,
          userId: null,
          avatar: null,
          name: null,
          token: null,
        },
      });
    }
  }
}
