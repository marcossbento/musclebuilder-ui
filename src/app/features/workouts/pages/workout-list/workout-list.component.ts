import { Component, inject, OnInit } from '@angular/core';
import { WorkoutService } from '../../../../core/services/workout.service';
import { WorkoutDTO } from '../../../../core/models/workout.model';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.scss',
})
export class WorkoutListComponent implements OnInit{
  private workoutService = inject(WorkoutService);

  userWorkouts: WorkoutDTO[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.workoutService.getUserWorkouts().subscribe({
        next: (data) => {
          this.userWorkouts = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar treinos do usuário', err);
          this.isLoading = false;
          //TODO: toast de erro
        }
      });
  }
}
