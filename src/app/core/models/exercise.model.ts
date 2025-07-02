export enum DifficultyLevel {
    BEGINNER = 'Beginner',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced'
}

export interface Exercise {
    id: number;
    name: string;
    description?: string;
    muscleGroup: string;
    equipment?: string;
    difficultyLevel: DifficultyLevel;
    imageUrl?: string;
}