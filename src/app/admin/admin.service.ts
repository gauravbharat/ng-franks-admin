import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
const API_URL = `${environment.apiUrl}`;

@Injectable()
export class AdminService {
  constructor(private _http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this._http.get<{ message: string; allUsers: any }>(
      `${API_URL}/users/all`
    );
  }

  getStaticData(): Observable<any> {
    return this._http.get<{ message: string; allUsers: any }>(
      `${API_URL}/users/statics`
    );
  }

  updateUserData(updateData: any) {
    return this._http.post(`${API_URL}/users/update`, updateData);
  }
}
