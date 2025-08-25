import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../../../shared/navigation.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { WorkoutLogResponse } from '../../../../core/models/workout-log.model';
import { forkJoin } from 'rxjs';
import { AchievementService } from '../../../../core/services/achievement.service';
import { Achievement } from '../../../../core/models/achievements.model';
import { ProgressService } from '../../../../core/services/progress.service';
import { ChartConfiguration } from 'chart.js';
import { ExerciseProgressDTO } from '../../../../core/models/progress.model';

interface ExerciseOption {
  exerciseId: number;
  exerciseName: string;
}

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.scss'
})
export class ProfileMainComponent implements OnInit{
  public navigationService = inject(NavigationService);
  private userService = inject(UserService);
  private workoutLogService = inject(WorkoutLogService);
  private achievementService = inject(AchievementService);
  private progressService = inject(ProgressService);

  isLoading = true;
  user: User | null = null;
  workoutHistory: WorkoutLogResponse[] = [];
  achievements: Achievement[] = [];

  // Propriedades do gráfico interativo
  exerciseOptionsForChart: ExerciseOption[] = [];
  selectedExerciseIdForChart: number | null = null;
  selectedExerciseName: string = 'Nenhum';
  exerciseProgressChartConfig?: ChartConfiguration;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;

    forkJoin({
      user: this.userService.getCurrentUserDetails(),
      history: this.workoutLogService.getWorkoutHistory(),
      achievements: this.achievementService.getCurrentUserAchievements()
    }).subscribe({
      next: ({ user, history, achievements }) => {
        this.user = user;
        this.workoutHistory = history;
        this.achievements = achievements;

        this.populateExerciseOptions(history);

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar dados da página de perfil', err);
        this.isLoading = false;
      }
    });
  }

  onChartExerciseChange(): void {
    if (this.selectedExerciseIdForChart) {
      this.loadChartData(this.selectedExerciseIdForChart);
    } else {
      this.exerciseProgressChartConfig = undefined;
      this.selectedExerciseName = 'Nenhum'
    }
  }

  private loadChartData(exerciseId: number): void {
    const selectedOption = this.exerciseOptionsForChart.find(opt => opt.exerciseId === exerciseId);
    this.selectedExerciseName = selectedOption ? selectedOption.exerciseName : 'Desconhecido';

    this.progressService.getExerciseProgress(exerciseId).subscribe(progressData => {
      this.setupChart(progressData);
    });
  }

  private populateExerciseOptions(history: WorkoutLogResponse[]): void {
    const allExerciseLogs = history.flatMap(log => log.exerciseLogs);
    const uniqueExercises = new Map<number, string>();

    allExerciseLogs.forEach(log => {
      if (log.exerciseId && !uniqueExercises.has(log.exerciseId)) {
        uniqueExercises.set(log.exerciseId, log.exerciseName);
      }
    });

    this.exerciseOptionsForChart = Array.from(uniqueExercises, ([exerciseId, exerciseName]) => ({ exerciseId, exerciseName }));
  }

  private setupChart(data: ExerciseProgressDTO[]): void {
    const labels = data.map(d => d.date);
    const maxWeightData = data.map(d => d.maxWeight);
    const textColor = '#EAEAEA';
    const gridColor = '#5A5A7E';
    const accentColor = '#00F2E5';

    this.exerciseProgressChartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Peso Máximo (kg)',
          data: maxWeightData,
          borderColor: accentColor,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
        },
        plugins: {
          legend: { labels: { color: textColor } }
        }
      }
    };
  }
}
