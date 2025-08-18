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

export interface ProgressSummaryDTO {
    totalWorkouts: number;
    totalVolume: number;
    mostFrequentExercise: string;
}

export interface ExerciseProgressDTO {
    date: string;
    maxWeight: number;
    volume: number;
}