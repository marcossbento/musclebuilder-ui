export enum DifficultyLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
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

export interface ExerciseDTO {
  id?: number;
  name: string;
  description?: string;
  muscleGroup: string;
  equipment?: string;
  difficultyLevel: DifficultyLevel;
  imageUrl?: string;
}