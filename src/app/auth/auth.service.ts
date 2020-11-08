import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AuthType, AuthData } from '../app.constants';

const API_URL = `${environment.apiUrl}/users`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private _http: HttpClient) {}

  login(authData: AuthData) {
    console.log(authData);
  }
}
