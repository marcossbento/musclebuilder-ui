import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/user.model';
import { BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = '/api/auth';

  private readonly ACCESS_TOKEN_KEY = 'musclebuilder_access_token'
  private readonly REFRESH_TOKEN_KEY = 'musclebuilder_refresh_token'

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private logoutReason = new BehaviorSubject<string | null>(null);
  public logoutReason$ = this.logoutReason.asObservable();

  constructor() {
    this.checkInitialAuthState();
  }

  public getIsAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    const tokenPayload = { token: refreshToken };

    return this.http.post<AuthenticationResponse>(`${this.API_URL}/refresh`, tokenPayload).pipe(
      tap((response) => {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  login(credentials: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }
  
  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  logout(reason?: string): void {
    console.log('[AuthService] Logout chamado. Razão:', reason);

    if (reason) {
      console.log('[AuthService] A emitir razão no logoutReason Subject.');
      this.logoutReason.next(reason);
    }

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    this.isAuthenticatedSubject.next(false)

    this.router.navigate(['/auth']);
  }

  public clearLogoutReason(): void {
    this.logoutReason.next(null);
  }

  private checkInitialAuthState(): void {
    const token = this.getAccessToken();
    
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode(token);

      if (typeof decodedToken.exp === 'undefined') {
        return true;
      }

      const expirationDate = decodedToken.exp * 1000;
      const now = Date.now();

      return expirationDate < now
    } catch(error) {
      return true;
    }
  }
}
