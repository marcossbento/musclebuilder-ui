import { DifficultyLevel } from "./exercise.model";

export enum WorkoutStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    COMPLETED = 'Completed',
}

export interface WorkoutExercise {
    id?: number;
    exerciseId: number;
    exerciseName?: string;
    sets: number;
    repsPerSet: number;
    weight?: number;
    restSeconds?: number;
    orderPosition?: number;
}

export interface Workout {
    id?: number;
    name: string;
    description?: string;
    userId: number;
    difficultyLevel?: DifficultyLevel;
    exercises: WorkoutExercise[];
    createdAt?: string;
    updatedAt?: string;
}

export interface StartWorkoutRequest {
    workoutId?: number;
    workoutName: string;
}

export interface LogExerciseRequest {
    exerciseId: number;
    setsCompleted: number;
    repsPerSet: string;
    weightUsed?: number;
    notes?: string;
}