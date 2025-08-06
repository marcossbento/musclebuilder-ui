import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from '../../../../core/services/workout.service';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { Observable, switchMap } from 'rxjs';
import { WorkoutDTO } from '../../../../core/models/workout.model';
import { WorkoutLogResponse } from '../../../../core/models/workout-log.model';

@Component({
  selector: 'app-session-runner',
  templateUrl: './session-runner.component.html',
  styleUrl: './session-runner.component.scss'
})
export class SessionRunnerComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private workoutService = inject(WorkoutService);
  private workoutLogService = inject(WorkoutLogService);

  isLoading = true;
  workoutTemplate$: Observable<WorkoutDTO>;
  activeWorkoutLog?: WorkoutLogResponse;

  currentExerciseIndex = 0;

  constructor() {
    this.workoutTemplate$ = this.route.paramMap.pipe(
      switchMap(params => {
        const workoutId = Number(params.get('workoutId'));
        return this.workoutService.getWorkoutById(workoutId);
      })
    );
  }

  ngOnInit(): void {
      this.workoutTemplate$.subscribe(workout => {
        this.workoutLogService.startWorkout({
          workoutId: workout.id,
          workoutName: workout.name
        }).subscribe(log => {
          this.activeWorkoutLog = log;
          this.isLoading = false;
        });
      });
  }

  // Lógica de navegação
  nextExercise(): void {
    this.currentExerciseIndex++;
  }
  
  previousExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }
}

