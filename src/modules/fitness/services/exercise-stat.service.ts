import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ExerciseStatRepository } from '../repositories/exercise-stat.repository';
import { ExerciseStatResponseDto, ProgressStatsDto } from '../dto/exercise-stat.dto';
import { WorkoutSessionRepository } from '../repositories/workout-session.repository';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { ExercisePerformedEvent } from '../events/workout-completed.event';
import { EventBusService } from '../../../events/event.bus';

@Injectable()
export class ExerciseStatService implements OnModuleInit {
  constructor(
    private statRepo: ExerciseStatRepository,
    private sessionRepo: WorkoutSessionRepository,
    private exerciseRepo: ExerciseRepository,
    private eventBus: EventBusService,
  ) {}

  /**
   * OnModuleInit: Escuchar eventos de ejercicios
   */
  onModuleInit() {
    this.eventBus.on(ExercisePerformedEvent, (event) => {
      this.handleExercisePerformed(event);
    });
  }

  async getExerciseStat(userId: string, exerciseId: string) {
    const stat = await this.statRepo.getByExercise(userId, exerciseId);
    if (!stat) {
      throw new NotFoundException('No stats for this exercise');
    }
    return new ExerciseStatResponseDto(stat);
  }

  async getTopExercises(userId: string, limit = 10) {
    const stats = await this.statRepo.getTopExercises(userId, limit);
    return stats.map((s) => new ExerciseStatResponseDto(s));
  }

  async getPersonalRecords(userId: string) {
    const stats = await this.statRepo.getPersonalRecords(userId);
    return stats.map((s) => new ExerciseStatResponseDto(s));
  }

  async getProgressStats(userId: string) {
    // Calcular stats generales del usuario
    const totalSessions = await this.sessionRepo.countSessions(userId);
    const totalVolume = await this.sessionRepo.getTotalVolume(userId);

    // Encontrar ejercicio favorito
    const topExercises = await this.statRepo.getTopExercises(userId, 1);
    const favoriteExercise = topExercises[0]?.exerciseId;

    return new ProgressStatsDto({
      totalWorkouts: totalSessions,
      totalVolume,
      totalDuration: 0, // TODO: calcular desde sessions
      favoriteExercise,
      workoutStreak: 0, // TODO: calcular desde sessions
    });
  }

  /**
   * Handler: Cuando se realiza un ejercicio
   */
  private async handleExercisePerformed(event: ExercisePerformedEvent) {
    try {
      console.log(
        `[ExerciseStats] Updating stats for exercise ${event.exerciseId}`,
      );

      // Actualizar stats del ejercicio
      await this.statRepo.updateStat(
        event.userId,
        event.exerciseId,
        event.reps,
        event.weight,
      );
    } catch (error) {
      console.error(`[ExerciseStats] Error updating stats:`, error);
    }
  }
}
