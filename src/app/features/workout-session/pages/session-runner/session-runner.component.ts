import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from '../../../../core/services/workout.service';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { Observable, switchMap } from 'rxjs';
import {
  LogExerciseRequest,
  WorkoutDTO,
} from '../../../../core/models/workout.model';
import { WorkoutLogResponse } from '../../../../core/models/workout-log.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-session-runner',
  templateUrl: './session-runner.component.html',
  styleUrl: './session-runner.component.scss',
  providers: [MessageService],
})
export class SessionRunnerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private workoutService = inject(WorkoutService);
  private workoutLogService = inject(WorkoutLogService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  isLoading = true;
  isLoggingExercise = false;
  workout!: WorkoutDTO;
  activeWorkoutLog!: WorkoutLogResponse;

  currentExerciseIndex = 0;
  currentExerciseForm!: FormGroup;

  private exerciseForms: { [exerciseId: number]: FormGroup } = {};

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const workoutId = Number(params.get('workoutId'));
          return this.workoutService.getWorkoutById(workoutId);
        })
      )
      .subscribe((workoutTemplate) => {
        this.workout = workoutTemplate;
        this.workoutLogService
          .startWorkout({
            workoutId: workoutTemplate.id,
            workoutName: workoutTemplate.name,
          })
          .subscribe((log) => {
            this.activeWorkoutLog = log;
            this.setupFormForCurrentExercise();
            this.isLoading = false;
          });
      });
  }

  get setsFormArray(): FormArray {
    return this.currentExerciseForm.get('sets') as FormArray;
  }

  private setupFormForCurrentExercise(): void {
    const currentExercise = this.workout.exercises[this.currentExerciseIndex];
    const exerciseId = currentExercise.exerciseId;

    if (this.exerciseForms[exerciseId]) {
      this.currentExerciseForm = this.exerciseForms[exerciseId];
    } else {
      const newForm = this.fb.group({
        exerciseId: [exerciseId],
        sets: this.fb.array([]),
      });

      for (let i = 0; i < currentExercise.sets; i++) {
        const setFormGroup = this.fb.group({
          reps: [currentExercise.repsPerSet, Validators.required],
          weight: [null, Validators.required]
        });
        (newForm.get('sets') as FormArray).push(setFormGroup);
      }

      this.currentExerciseForm = newForm;
      this.exerciseForms[exerciseId] = newForm;
    }

    this.currentExerciseForm = this.fb.group({
      exerciseId: [currentExercise.exerciseId],
      sets: this.fb.array([]),
    });
  }

  addSet(reps: number | null = null): void {
    const setFormGroup = this.fb.group({
      reps: [null, Validators.required],
      weight: [null, Validators.required],
    });
    this.setsFormArray.push(setFormGroup);
  }

  removeSet(index: number): void {
    this.setsFormArray.removeAt(index);
  }

  // Lógica de navegação
  onNextExercise(): void {
    if (this.currentExerciseForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha  os dados de todas as séries para avançar',
      });
      return;
    }

    this.isLoggingExercise = true;
    const formValue = this.currentExerciseForm.value;
    const request: LogExerciseRequest = {
      exerciseId: formValue.exerciseId,
      repsPerSet: formValue.sets.map((s: any) => s.reps).join(','),
      weightUsed: Math.max(...formValue.sets.map((s: any) => s.weight)),
      setsCompleted: formValue.sets.length,
    };

    this.workoutLogService
      .logExercise(this.activeWorkoutLog.id, request)
      .subscribe({
        next: () => {
          if (this.currentExerciseIndex < this.workout.exercises.length - 1) {
            this.currentExerciseIndex++;
            this.setupFormForCurrentExercise();
          }
          this.isLoggingExercise = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível salvar o progresso.',
          });
          this.isLoggingExercise = false;
        },
      });
  }

  onPreviousExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
      this.setupFormForCurrentExercise();
    }
  }
}
