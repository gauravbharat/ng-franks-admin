import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoading = true;
  private _authStatusSub$: Subscription;
  private _isUserAuthenticated = false;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authStatusSub$ = this._authService
      .getAuthStatusListener()
      .subscribe((response) => {
        this._isUserAuthenticated = response.authData.isUserAuthenticated;
      });

    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this._authStatusSub$.unsubscribe();
  }

  isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  onLogout() {
    this._authService.logout();
  }
}
