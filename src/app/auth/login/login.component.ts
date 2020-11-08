import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

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
    console.log(form.value.username);
    console.log(form.value.password);

    this.isLoading = false;
  }

  onForgotPassword() {
    this._snackbarService.showError(
      `Forgot Password feature not available yet!`
    );
  }
}
