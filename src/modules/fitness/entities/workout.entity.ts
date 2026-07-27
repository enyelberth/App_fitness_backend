/**
 * Entity: Workout (Rutina de entrenamiento)
 * Tabla: fitness_workouts
 */
export class WorkoutEntity {
  id: string;
  userId: string;
  name: string;
  description?: string;
  difficulty?: string; // BEGINNER, INTERMEDIATE, ADVANCED
  estimatedDurationMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
