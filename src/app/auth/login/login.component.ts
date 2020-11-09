import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { AuthData } from '../../app.constants';

/** Material Snackbar */
import { SnackbarService } from '../../utils/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = true;
  hide = false;
  username: String;
  email: String;
  authData: AuthData;
  private _authStatusSub$: Subscription;

  constructor(
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._authStatusSub$ = this._authService
      .getAuthStatusListener()
      .subscribe((response) => {
        if (response.authData.isUserAuthenticated) {
          this._router.navigate(['/admin']);
        }
      });

    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this._authStatusSub$.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;
    if (!form.value.email && !form.value.username) return;

    this.isLoading = true;

    this.authData = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };

    this._authService
      .login(this.authData)
      .then((data: { isSuccess: boolean; username: string }) => {
        data.isSuccess &&
          this._snackbarService.showSuccess(
            `Welcome to Frank's User Admin, ${data.username}!`
          );
        this.isLoading = false;
      })
      .catch((error) => {
        //show nothing, handled by inteceptor
        this.isLoading = false;
      });
  }

  onForgotPassword() {
    this._snackbarService.showError(
      `Forgot Password feature not available yet!`
    );
  }
}
