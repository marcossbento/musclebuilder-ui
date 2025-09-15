import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { WorkoutDTO } from '../../../../core/models/workout.model';
import {
  filter,
  forkJoin,
  Observable,
  Subscription,
} from 'rxjs';
import {
  DashboardService,
  GamifiedDashboardStats,
  WeeklyMission,
} from '../../../../core/services/dashboard.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { NavigationEnd, Router } from '@angular/router';
import { WorkoutService } from '../../../../core/services/workout.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private userService = inject(UserService);
  private router = inject(Router);
  private workoutService = inject(WorkoutService);

  isLoading = true;
  user$: Observable<User | null>;
  dashboardStats$: Observable<GamifiedDashboardStats | null>;
  weeklyMission$: Observable<WeeklyMission | null>;

  nextWorkout: WorkoutDTO | null = null;

  private routerSubscription: Subscription;

  constructor() {
    this.user$ = this.userService.getCurrentUserDetails();
    this.dashboardStats$ = this.dashboardService.dashboardStats$;
    this.weeklyMission$ = this.dashboardService.weeklyMission$;

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/dashboard') {
          this.loadDashboardData();
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;

    const dataSources = {
      dashboardData: this.dashboardService.loadDashboardData(),
      recommendedWorkout: this.workoutService.getRecommendedWorkout(),
    };

    forkJoin(dataSources).subscribe({
      next: ({ dashboardData, recommendedWorkout }) => {
        this.nextWorkout = recommendedWorkout;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard', err);
        this.isLoading = false;
        this.nextWorkout = null;
        //TODO: tratar erro com toast
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
