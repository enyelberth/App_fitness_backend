import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { WorkoutRepository } from '../repositories/workout.repository';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutResponseDto } from '../dto/workout.dto';
import { WorkoutCompletedEvent } from '../events/workout-completed.event';

@Injectable()
export class WorkoutService {
  constructor(
    private repository: WorkoutRepository,
    private eventBus: EventBusService,
  ) {}

  /**
   * Crear nuevo workout
   */
  async create(userId: string, createDto: CreateWorkoutDto) {
    const workout = await this.repository.create(userId, {
      name: createDto.name,
      description: createDto.description,
      difficulty: createDto.difficulty || 'INTERMEDIATE',
      estimatedDurationMinutes: createDto.estimatedDurationMinutes || 60,
    });

    return new WorkoutResponseDto(workout);
  }

  /**
   * Obtener workout por ID
   */
  async getById(id: string, userId: string) {
    const workout = await this.repository.findById(id);

    if (!workout) {
      throw new NotFoundException(`Workout ${id} not found`);
    }

    if (workout.userId !== userId) {
      throw new ForbiddenException('You do not have access to this workout');
    }

    return new WorkoutResponseDto(workout);
  }

  /**
   * Listar workouts del usuario
   */
  async listByUser(userId: string, skip = 0, take = 10) {
    const [workouts, total] = await Promise.all([
      this.repository.findByUserId(userId, skip, take),
      this.repository.countByUserId(userId),
    ]);

    return {
      data: workouts.map((w) => new WorkoutResponseDto(w)),
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        hasMore: skip + take < total,
      },
    };
  }

  /**
   * Actualizar workout
   */
  async update(id: string, userId: string, updateDto: UpdateWorkoutDto) {
    // Verificar que pertenece al usuario
    const belongs = await this.repository.belongsToUser(id, userId);
    if (!belongs) {
      throw new ForbiddenException('You do not have access to this workout');
    }

    const updated = await this.repository.update(id, updateDto);
    return new WorkoutResponseDto(updated);
  }

  /**
   * Eliminar workout
   */
  async delete(id: string, userId: string) {
    const belongs = await this.repository.belongsToUser(id, userId);
    if (!belongs) {
      throw new ForbiddenException('You do not have access to this workout');
    }

    await this.repository.delete(id);
    return { success: true, message: 'Workout deleted' };
  }

  /**
   * Completar workout (IMPORTANTE: Emite evento)
   */
  async completeWorkout(
    workoutId: string,
    userId: string,
    data: {
      durationMinutes: number;
      volume: number;
    },
  ) {
    const belongs = await this.repository.belongsToUser(workoutId, userId);
    if (!belongs) {
      throw new ForbiddenException('You do not have access to this workout');
    }

    // Calcular XP basado en duration y volumen
    const xp = this.calculateXP(data.durationMinutes, data.volume);

    // EMITIR evento para que Game module lo escuche
    this.eventBus.emit(
      new WorkoutCompletedEvent(
        workoutId,
        userId,
        xp,
        data.durationMinutes,
        data.volume,
        new Date(),
      ),
    );

    return {
      success: true,
      xp,
      message: `Workout completed! +${xp} XP earned`,
    };
  }

  /**
   * Calcular XP para un workout
   * Fórmula: (duration / 10) + (volume / 1000)
   */
  private calculateXP(durationMinutes: number, volume: number): number {
    const durationXP = Math.floor(durationMinutes / 10) * 10; // 10 XP cada 10 minutos
    const volumeXP = Math.floor(volume / 1000) * 5; // 5 XP cada 1000kg
    return Math.max(50, durationXP + volumeXP); // Mínimo 50 XP
  }
}
