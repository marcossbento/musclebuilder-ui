import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../../../shared/navigation.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { WorkoutLogResponse } from '../../../../core/models/workout-log.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.scss'
})
export class ProfileMainComponent implements OnInit{
  public navigationService = inject(NavigationService);
  private userService = inject(UserService);
  private workoutLogService = inject(WorkoutLogService);

  isLoading = true;
  user: User | null = null;
  workoutHistory: WorkoutLogResponse[] = [];

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;

    forkJoin({
      user: this.userService.getCurrentUserDetails(),
      history: this.workoutLogService.getWorkoutHistory()
    }).subscribe({
      next: ({ user, history }) => {
        this.user = user;
        this.workoutHistory = history;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar dados do perfil', err);
        this.isLoading = false;
      }
    });
  }
}
