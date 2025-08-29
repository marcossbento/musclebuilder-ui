import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoutDTO } from '../../../../core/models/workout.model';
import { filter, Observable, Subscription } from 'rxjs';
import { DashboardService, GamifiedDashboardStats, WeeklyMission } from '../../../../core/services/dashboard.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private userService = inject(UserService);
  private router = inject(Router);

  isLoading = true;
  user$: Observable<User | null>;
  dashboardStats$: Observable<GamifiedDashboardStats | null>;
  nextWorkout$: Observable<WorkoutDTO | null>;
  weeklyMission$: Observable<WeeklyMission | null>; 

  private routerSubscription: Subscription;

  constructor() {
    this.user$ = this.userService.getCurrentUserDetails();
    this.dashboardStats$ = this.dashboardService.dashboardStats$;
    this.nextWorkout$ = this.dashboardService.nextWorkout$;
    this.weeklyMission$ = this.dashboardService.weeklyMission$;
  

  this.routerSubscription = this.router.events.pipe(
      // Filtramos os eventos para pegar apenas o 'NavigationEnd',
      // que acontece quando uma navegação é completada com sucesso.
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Verificamos se a nova URL é a do dashboard
      if (event.url === '/dashboard') {
        console.log('Navegou para o dashboard, atualizando dados...');
        this.loadDashboardData();
      }
    });
  }

  // ngOnInit continua aqui, mas a chamada inicial agora é feita pelo evento do roteador
  ngOnInit(): void {}

  // 7. Implementar o ngOnDestroy para evitar vazamentos de memória
  ngOnDestroy(): void {
    // Quando o componente for destruído, cancelamos a inscrição nos eventos
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.loadDashboardData().subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard', err);
        this.isLoading = false;
        //TODO: tratar erro com toast
      }
    });
    
  }

  logout(): void {
    this.authService.logout();
  }
}
