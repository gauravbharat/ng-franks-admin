/** 09/11/2020 - Gaurav - Auth Interceptor to intercept outbound http requests and add a authorization token */
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // Take a request, process it and continue with next code block using next.handle(req)
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    // console.log(authToken);

    // Clone and manipulate the request instead of directly changing it to avoid any unwanted side-effects
    // Pass configuration to clone, to edit the clone
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next.handle(authRequest);
  }
}
