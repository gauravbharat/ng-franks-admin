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
  private _currentUser: any;
  private _tokenTimer: any;
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
            if (response.userData.token) {
              this._currentUser = response.userData;
              console.log(this._currentUser);

              this._setAuthTimer(response.userData.expiresIn);

              this._updateListener(AuthType.UPDATE_USER);
              resolve({
                isSuccess: true,
                username: this._currentUser.user.username,
              });

              this._saveAuthData();
              this._router.navigate(['/admin']);
            }
          },
          (error) => {
            this._resetAuthData();
            console.log('login error', error);
            reject({ isSuccess: false, error });
          }
        );
    });
  }

  logout() {
    this._resetAuthData();
    this._router.navigate(['/']);
  }

  private _resetAuthData() {
    this._currentUser = null;
    clearTimeout(this._tokenTimer);
    this._clearAuthData();
    this._updateListener(AuthType.RESET_USER);
  }

  private _updateListener(authRequestType: AuthType) {
    if (authRequestType === AuthType.UPDATE_USER) {
      const { username, _id, avatar, name } = this._currentUser.user;

      this._authStatusListener.next({
        authData: {
          isUserAuthenticated: true,
          username,
          userId: _id,
          avatar,
          name,
          token: this._currentUser.token,
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

  /** Changes to persist user login, per the received expiresIn timer */
  private _setAuthTimer(duration: number) {
    this._tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private _saveAuthData() {
    localStorage.setItem('token', this._currentUser.token);
    localStorage.setItem('userId', this._currentUser.user._id);
    localStorage.setItem('username', this._currentUser.user.username);
    localStorage.setItem('avatar', this._currentUser.user.avatar);
    localStorage.setItem('name', this._currentUser.user.name);

    const now = new Date();
    const expirationDate = new Date(
      now.getTime() + this._currentUser.expiresIn * 1000
    );

    //serialized expiration date stored
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private _clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('name');
  }

  private _getAuthData() {
    const authData = {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      avatar: localStorage.getItem('avatar'),
      name: localStorage.getItem('name'),
      expirationDate: localStorage.getItem('expiration'),
    };

    if (!authData.token || !authData.expirationDate) {
      return;
    }

    // De-serialize expiration date
    return {
      ...authData,
      expirationDate: new Date(authData.expirationDate),
    };
  }

  autoAuthUser() {
    const authInformation = this._getAuthData();
    if (!authInformation) return;

    // Check that the token expiration date is in the future
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      /** This needs to be worked on if the original user data fetched from the API is required
       * Use IndexedDB instead to store complex objects */
      this._currentUser = {
        user: {
          _id: authInformation.userId,
          username: authInformation.username,
          avatar: authInformation.avatar,
          name: authInformation.name,
        },
        token: authInformation.token,
        expiresIn,
      };
      this._setAuthTimer(expiresIn / 1000);
      this._updateListener(AuthType.UPDATE_USER);
    } else {
      this.logout();
    }
  }
}
