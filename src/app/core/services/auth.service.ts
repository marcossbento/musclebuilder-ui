import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/user.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = '/api';
  private readonly AUTH_KEY = 'musclebuilder_auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkInitialAuthState();
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.AUTH_KEY, response.token);
        
        this.isAuthenticatedSubject.next(true);
      }),
      map(() => {
        return;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);

    this.isAuthenticatedSubject.next(false)

    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }

  private checkInitialAuthState(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }
}
