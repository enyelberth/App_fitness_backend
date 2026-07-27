/**
 * Evento: Workout completado
 * Emitido por: WorkoutsService.completeWorkout()
 * Escuchado por: Game (awardXP), Economy (rewards), Analytics
 */
export class WorkoutCompletedEvent {
  constructor(
    public readonly workoutId: string,
    public readonly userId: string,
    public readonly xp: number,
    public readonly durationMinutes: number,
    public readonly volume: number,
    public readonly completedAt: Date,
  ) {}
}

/**
 * Evento: Ejercicio realizado
 * Emitido por: WorkoutSessionsService.logSet()
 * Escuchado por: Game (update stats), Analytics
 */
export class ExercisePerformedEvent {
  constructor(
    public readonly exerciseId: string,
    public readonly userId: string,
    public readonly sets: number,
    public readonly reps: number,
    public readonly weight: number,
    public readonly timestamp: Date,
  ) {}
}
