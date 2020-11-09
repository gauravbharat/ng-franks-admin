import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/** Custom services */
import { SnackbarService } from './snackbar.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Inject dialog service
  constructor(
    private _authService: AuthService,
    private _snackbarService: SnackbarService
  ) {}

  // Take a request, process it and continue with next code block using next.handle(req)
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /** handle actually gives us back the response observable stream, we can just hook into
     * that stream and listen to events
     */
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage =
          'Either the server may be down or restarting or you may be facing network issues, please refresh page after some time. If issue persists, please contact this webpage administrator or your network provider.';
        !navigator.onLine &&
          (errorMessage = 'Please check your network connection and try again');

        if (error.error.message) {
          errorMessage = error.error.message;
          if (errorMessage.includes('login failed')) {
            this._authService.logout();
          }
        }

        this._snackbarService.showError(errorMessage, 9000);

        // Return observable with error
        return throwError(error);
      })
    );
  }
}
