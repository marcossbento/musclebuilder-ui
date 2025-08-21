import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ProgressService } from '../../../../core/services/progress.service';
import {
  ExerciseProgressDTO,
  ProgressSummaryDTO,
} from '../../../../core/models/progress.model';
import { ChartConfiguration } from 'chart.js';
import { WorkoutService } from '../../../../core/services/workout.service';
import { WorkoutDTO } from '../../../../core/models/workout.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  private authService = inject(AuthService);
  private progressService = inject(ProgressService);
  private workoutService = inject(WorkoutService);

  isLoading = true;
  progressSummary?: ProgressSummaryDTO;
  nextWorkout: WorkoutDTO | null = null;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      summary: this.progressService.getProgressSummary(),
      workouts: this.workoutService.getUserWorkouts()
    }).subscribe({
      next: ({ summary, workouts }) => {
        this.progressSummary = summary;
        
        if (workouts && workouts.length > 0) {
          this.nextWorkout = workouts[0];
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard', err);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
