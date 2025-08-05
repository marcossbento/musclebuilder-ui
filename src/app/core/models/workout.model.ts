import { DifficultyLevel } from './exercise.model';

//models para templates de treino, usados no gerenciamento de treinos(CRUD)
export interface WorkoutExerciseCreateDTO {
  exerciseId: number;
  sets: number;
  repsPerSet: number;
  weight?: number;
  restSeconds?: number;
}

export interface WorkoutDTO {
  id: number;
  name: string;
  description?: string;
  difficultyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  exercises: {
    exerciseId: number;
    exerciseName?: string;
    sets: number;
    repsPerSet: number;
  }[];
}

export interface WorkoutCreateDTO {
  name: string;
  description?: string;
  exercises: WorkoutExerciseCreateDTO[];
}

//models para logs de treino, usados no acompanhamento do treino

export enum WorkoutLogStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface LogExerciseRequest {
  exerciseId: number;
  setsCompleted: number;
  repsPerSet: string;
  weightUsed?: number;
  notes?: string;
}
