export enum WorkoutLogStatus {
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export interface ExerciseLogDetails {
    id: number;
    exerciseId: number;
    exerciseName: string;
    setsCompleted: number;
    repsPerSet: string;
    weightUsed?: number;
    notes?: string;
}

export interface ProgressSummary {
    totalWorkouts: number;
    totalVolume: number;
    mostFrequentExercise?: string;
}

export interface ExerciseProgress {
    date: string;
    maxWeight: number;
    volume: number;
}