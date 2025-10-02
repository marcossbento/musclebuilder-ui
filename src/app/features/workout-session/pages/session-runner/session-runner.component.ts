import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../../core/services/workout.service';
import { WorkoutLogService } from '../../../../core/services/workout-log.service';
import { Observable, switchMap, throwError } from 'rxjs';
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
  private router = inject(Router);
  private workoutService = inject(WorkoutService);
  private workoutLogService = inject(WorkoutLogService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  isLoading = true;
  isSaving = false;
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

    console.log('A processar o exercício:', currentExercise);

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
          weight: [currentExercise.weight, Validators.required],
        });
        (newForm.get('sets') as FormArray).push(setFormGroup);
      }

      this.currentExerciseForm = newForm;
      this.exerciseForms[exerciseId] = newForm;
    }
  }

  addSet(): void {
    let lastReps = null;
    let lastWeight = null;

    if (this.setsFormArray.length > 0) {
      const lastSet = this.setsFormArray.at(this.setsFormArray.length - 1);
      lastReps = lastSet.value.reps;
      lastWeight = lastSet.value.weight;
    }

    const setFormGroup = this.fb.group({
      reps: [lastReps, Validators.required],
      weight: [lastWeight, Validators.required],
    });
    this.setsFormArray.push(setFormGroup);
  }

  removeSet(index: number): void {
    this.setsFormArray.removeAt(index);
  }

  //Método que salva o progresso do exercício atual
  private logCurrentExercise(): Observable<WorkoutLogResponse> {
    if (this.currentExerciseForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os dados de todas as séries',
      });
      return throwError(() => new Error('Formulário inválido'));
    }

    this.isSaving = true;
    const formValue = this.currentExerciseForm.value;
    const request: LogExerciseRequest = {
      exerciseId: formValue.exerciseId,
      repsPerSet: formValue.sets.map((s: any) => s.reps).join(','),
      weightUsed: Math.max(...formValue.sets.map((s: any) => s.weight)),
      setsCompleted: formValue.sets.length,
    };

    return this.workoutLogService.logExercise(
      this.activeWorkoutLog.id,
      request
    );
  }

  // Lógica de navegação
  onNextExercise(): void {
    this.logCurrentExercise().subscribe({
      next: () => {
        if (this.currentExerciseIndex < this.workout.exercises.length - 1) {
          this.currentExerciseIndex++;
          this.setupFormForCurrentExercise();
        }
        this.isSaving = false;
      },
      error: (err) => {
        this.isSaving = false;
      },
    });
  }

  onPreviousExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
      this.setupFormForCurrentExercise();
    }
  }

  onCompleteWorkout(): void {
    this.logCurrentExercise()
      .pipe(
        switchMap(() =>
          this.workoutLogService.completeWorkout(this.activeWorkoutLog.id)
        )
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Parabéns!',
            detail: 'Treino finalizado com sucesso!',
          });

          if (response.newlyAwardedAchievements && response.newlyAwardedAchievements.length > 0) {
            setTimeout(() => {
              response.newlyAwardedAchievements.forEach(ach => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Conquista desbloqueada',
                  detail: ach.name,
                  icon: 'pi pi-star-fill',
                  life: 4000
                });
              });
            }, 700);
          }

          setTimeout(() => {
            this.router.navigate(['/session', response.workoutLog.id, 'summary']);
          }, 1500);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível finalizar o treino' })
          this.isSaving = false;
        }
      });
  }
}
