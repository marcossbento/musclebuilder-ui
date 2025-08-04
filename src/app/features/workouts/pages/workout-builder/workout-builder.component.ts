import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { ExerciseDTO } from '../../../../core/models/exercise.model';
import { WorkoutService } from '../../../../core/services/workout.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WorkoutCreateDTO } from '../../../../core/models/workout.model';

@Component({
  selector: 'app-workout-builder',
  templateUrl: './workout-builder.component.html',
  styleUrl: './workout-builder.component.scss',
  providers: [MessageService],
})
export class WorkoutBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private exerciseService = inject(ExerciseService);
  private workoutService = inject(WorkoutService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  workoutForm!: FormGroup;
  isSaving = false;

  isExerciseDialogVisible = false;
  //Lista de cache
  allExercises: ExerciseDTO[] = [];
  isLoadingExercises = true;

  ngOnInit(): void {
    this.workoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      exercises: this.fb.array(
        [],
        [Validators.minLength(1)]
      ),
    });
  }


  get exercisesFormArray(): FormArray {
    return this.workoutForm.get('exercises') as FormArray;
  }

  showExerciseDialog(): void {
    //Verifica se a lista de cache está vazia
    if (this.allExercises.length === 0) {
      this.loadAllExercises();
    }
    this.isExerciseDialogVisible = true;
  }

  private loadAllExercises(): void {
    this.isLoadingExercises = true;
    this.exerciseService.getAllExercises().subscribe((data) => {
      this.allExercises = data;
      this.isLoadingExercises = false;
    });
  }

  addExerciseToWorkout(exercise: ExerciseDTO): void {
    const exerciseExists = this.exercisesFormArray.controls.some(
      (control) => control.value.exerciseId === exercise.id
    );

    if (!exerciseExists) {
      const exerciseFormGroup = this.fb.group({
        exerciseId: [exercise.id],
        exerciseName: [exercise.name],
        sets: [3, [Validators.required, Validators.min(1)]],
        repsPerSet: [10, [Validators.required, Validators.min(1)]],
        weight: [null],
        restSeconds: [60],
      });
      this.exercisesFormArray.push(exerciseFormGroup);
    }
    this.isExerciseDialogVisible = false;
  }

  removeExerciseFromWorkout(index: number): void {
    this.exercisesFormArray.removeAt(index);
  }

  saveWorkout(): void {
    //  Marca todos os campos para, se houver erros, mostrar eles.
    this.workoutForm.markAllAsTouched();

    if (this.workoutForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    this.isSaving = true;

    const workoutData: WorkoutCreateDTO = this.workoutForm.getRawValue();

    this.workoutService.createWorkout(workoutData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: `Treino "${response.name}" criado!`,
        });
        setTimeout(() => this.router.navigate(['/workouts']), 1500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível salvar o treino.',
        });
        this.isSaving = false;
      },
    });
  }
}
