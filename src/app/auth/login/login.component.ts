import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor(
    private _authService: AuthService,
    private _snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // this._snackbarService.showSuccess(
    //   `Welcome to Frank's Admin Page, ${'jyotiee'}!`
    // );
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    console.log('inside ngOnDestroy');
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

    this.isLoading = false;
  }

  onForgotPassword() {
    this._snackbarService.showError(
      `Forgot Password feature not available yet!`
    );
  }
}
