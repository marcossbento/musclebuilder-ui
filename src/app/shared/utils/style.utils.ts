// src/app/shared/utils/style.utils.ts

import { DifficultyLevel } from '../../core/models/exercise.model';


export type TagSeverity = 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'contrast';

export function getSeverity(difficultyLevel: DifficultyLevel): TagSeverity {
  switch (difficultyLevel) {
    case 'BEGINNER':
      return 'success';
    case 'INTERMEDIATE':
      return 'warning';
    case 'ADVANCED':
      return 'danger';
    default:
      return 'info';
  }
}