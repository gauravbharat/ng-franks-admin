import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private _authStatusSub$: Subscription;
  private _isUserAuthenticated = false;

  constructor(private _authService: AuthService, private _router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    this._authStatusSub$ = await this._authService
      .getAuthStatusListener()
      .subscribe((response) => {
        this._isUserAuthenticated = response.authData.isUserAuthenticated;

        //  Navigate to login page if user is not authorised
        !this._isUserAuthenticated && this._router.navigate(['/']);
      });

    await this._authStatusSub$.unsubscribe();
    return new Promise((resolve) => {
      resolve(this._isUserAuthenticated);
    });
  }
}
