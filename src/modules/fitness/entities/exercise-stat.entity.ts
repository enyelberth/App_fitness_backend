/**
 * Entity: ExerciseStat (Estadísticas por ejercicio)
 * Tabla: fitness_exercise_stats
 */
export class ExerciseStatEntity {
  id: string;
  userId: string;
  exerciseId: string;
  totalReps: number = 0;
  totalVolume: number = 0;
  maxWeight: number = 0;
  timesPerformed: number = 0;
  avgRpe?: number;
  lastPerformed?: Date;
  createdAt: Date;
  updatedAt: Date;
}
