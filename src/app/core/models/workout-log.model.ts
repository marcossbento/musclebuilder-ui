export interface StartWorkoutRequest {
  workoutId: number;
  workoutName: string;
}

export interface WorkoutLogResponse {
    id: number;
    workoutName: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    startedAt: string;
}
