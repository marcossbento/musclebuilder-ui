import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/user.model';
import { MenuItem } from 'primeng/api';
import { Button } from "primeng/button";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent  implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);

  // TODO: Será utilizado para pegar a imagem do avatar.
  @Input() user: User | null = null;

  items: MenuItem[] = [];

  ngOnInit(): void {
      this.items = [
        {
          label: 'Meu perfil',
          icon: 'pi pi-user',
          command: () => {
            this.router.navigate(['/profile']);
          }
        },
        {
          label: 'Sair',
          icon: 'pi pi-sign-out',
          command: () => {
            this.authService.logout();
          }
        }
      ]
  }
}
