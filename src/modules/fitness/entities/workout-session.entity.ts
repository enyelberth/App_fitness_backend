/**
 * Entity: WorkoutSession (Sesión de entrenamiento)
 * Tabla: fitness_workout_sessions
 */
export class WorkoutSessionEntity {
  id: string;
  workoutId: string;
  userId: string;
  status: string; // ACTIVE, COMPLETED, ABANDONED
  startedAt: Date;
  completedAt?: Date;
  durationMinutes?: number;
  totalVolume: number = 0;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entity: SessionSet (Set dentro de una sesión)
 * Tabla: fitness_session_sets
 */
export class SessionSetEntity {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restSeconds?: number;
  notes?: string;
  completedAt: Date;
  createdAt: Date;
}
