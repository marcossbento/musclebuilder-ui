export interface StartWorkoutRequest {
  workoutId: number;
  workoutName: string;
}

export interface ExerciseLogResponse {
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
  durationMinutes?: number; // Propriedade adicionada
  totalVolume?: number; // Propriedade adicionada
  exerciseLogs: ExerciseLogResponse[]; // Propriedade adicionada
}
