import { Achievement } from "./achievements.model";

export interface StartWorkoutRequest {
  workoutId: number;
  workoutName: string;
}

export interface ExerciseLogResponse {
  id: number;
  exerciseName: string;
  repsPerSet: string;
  weightUsed?: number;
  setsCompleted: number;
  targetSets?: number;
  targetReps?: number;
}

export interface WorkoutLogResponse {
  id: number;
  workoutName: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  totalVolume?: number; 
  exerciseLogs: ExerciseLogResponse[]; 
}

export interface CompleteWorkoutResponse {
  workoutLog: WorkoutLogResponse;
  newlyAwardedAchievements: Achievement[];
}