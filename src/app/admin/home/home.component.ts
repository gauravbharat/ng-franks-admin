import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _authStatusSub$: Subscription;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authStatusSub$ = this._authService
      .getAuthStatusListener()
      .subscribe((response) => {
        console.log(response);
      });
  }

  ngOnDestroy(): void {
    this._authStatusSub$.unsubscribe();
  }
}
