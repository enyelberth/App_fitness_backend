/**
 * Entity: Exercise (Ejercicio)
 * Tabla: fitness_exercises
 */
export class ExerciseEntity {
  id: string;
  name: string;
  description?: string;
  muscleGroupId: string;
  equipment?: string[]; // ["barbell", "dumbbell", "cable"]
  difficulty?: string; // BEGINNER, INTERMEDIATE, ADVANCED
  instructions?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
