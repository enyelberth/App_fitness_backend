// TEMPLATE: Eventos para Fitness
// Copiar y renombrar a: workout-completed.event.ts, exercise-performed.event.ts, etc

/**
 * Evento: Template creado
 * Emitido por: TemplateService.create()
 * Escuchado por: Game, Analytics, etc
 */
export class TemplateCreatedEvent {
  constructor(
    public readonly templateId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}
}

/**
 * Evento: Template actualizado
 * Emitido por: TemplateService.update()
 * Escuchado por: Analytics, etc
 */
export class TemplateUpdatedEvent {
  constructor(
    public readonly templateId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly updatedAt: Date,
  ) {}
}

/**
 * Evento: Template eliminado
 * Emitido por: TemplateService.delete()
 * Escuchado por: Analytics, Cleanup, etc
 */
export class TemplateDeletedEvent {
  constructor(
    public readonly templateId: string,
    public readonly userId: string,
    public readonly deletedAt: Date,
  ) {}
}

/**
 * Evento: Workout completado (ejemplo real)
 * Emitido por: WorkoutsService.completeWorkout()
 * Escuchado por: Game (awardXP), Economy (rewards), Analytics, etc
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
 * Escuchado por: Game (update stats), Analytics, etc
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
