import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  const isApiRequest = req.url.startsWith('/api');
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  if (accessToken && isApiRequest &&!isAuthRequest) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
