import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoading = true;
  @Input() isEditMode: boolean;
  private _authStatusSub$: Subscription;
  private _isUserAuthenticated = false;
  @Output() editCompleted = new EventEmitter<boolean>();

  constructor(private _authService: AuthService, private _router: Router) {}

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

  onHome() {
    this.editCompleted.emit(true);
    this._router.navigate(['/admin']);
  }
}
