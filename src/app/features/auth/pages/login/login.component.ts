import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthenticationResponse,
  AuthService,
} from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/user.model';
import { finalize, take } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  hidePassword = true;
  isLoading = false;

  ngOnInit(): void {
    this.authService.logoutReason$.pipe(take(1)).subscribe((reason) => {
      console.log(
        '[LoginComponent] ngOnInit: Razão recebida da subscrição ->',
        reason
      );
      if (reason) {
        console.log('[LoginComponent] ngOnInit: A adicionar toast com a razão.');
        this.messageService.add({
          severity: 'warn',
          summary: 'Sessão Expirada',
          detail: reason,
          life: 5000,
        });
        console.log('[LoginComponent] ngOnInit: A limpar a razão.');
        this.authService.clearLogoutReason();
      }
    });
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginForm.disable();

    const credentials = this.loginForm.getRawValue() as LoginRequest;

    this.authService
      .login(credentials)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loginForm.enable();
        })
      )
      .subscribe({
        next: (response: AuthenticationResponse) => {
          if (response && response.accessToken) {
            this.router.navigate(['/dashboard']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro Inesperado',
              detail:
                'A resposta do servidor foi inválida. Por favor, tente novamente.',
            });
          }
        },
        error: (err) => {
          const detailMessage =
            err?.error?.message || 'Email ou senha inválidos';

          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Login',
            detail: detailMessage,
          });
        },
      });
  }
}
