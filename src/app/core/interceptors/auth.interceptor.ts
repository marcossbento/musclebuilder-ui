import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError, switchMap, filter, take, BehaviorSubject } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const isAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh');

  let authReq = req;
  if (accessToken && !isAuthRequest) {
    authReq = addToken(req, accessToken);
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthRequest) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) => {
  if (!authService.isRefreshing) {
    authService.isRefreshing = true;
    authService.refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((token: any) => {
        authService.isRefreshing = false;
        authService.refreshTokenSubject.next(token.accessToken);
        return next(addToken(req, token.accessToken));
      }),
      catchError((err) => {
        authService.isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return authService.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next(addToken(req, jwt!));
      })
    );
  }
}
