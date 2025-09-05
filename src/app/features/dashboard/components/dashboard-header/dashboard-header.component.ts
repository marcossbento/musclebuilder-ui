import { Component, inject, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { GamifiedDashboardStats } from '../../../../core/services/dashboard.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent implements OnChanges {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() user: User | null = null;
  @Input() stats: GamifiedDashboardStats | null = null;

  xpPercentage: number = 0;

  // items dropdown do botão de avatar
  items: MenuItem[] = []

  ngOnInit(): void {
    this.items = [
      {
        label: 'Meu perfil',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['stats'] && this.stats) {
        setTimeout(() => {

          if (this.stats && this.stats.xpToNextLevel > 0) {
            const progress = Math.min(this.stats.xp, this.stats.xpToNextLevel);
            this.xpPercentage = (progress / this.stats.xpToNextLevel) * 100;
          } else {
            this.xpPercentage = 0
          }
        }, 100);
      }
  }
}
