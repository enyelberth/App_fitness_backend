import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { WorkoutSessionRepository } from '../repositories/workout-session.repository';
import { WorkoutRepository } from '../repositories/workout.repository';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { CreateSessionDto, AddSetDto, CompleteSessionDto, SessionResponseDto } from '../dto/workout-session.dto';
import { ExercisePerformedEvent } from '../events/workout-completed.event';

@Injectable()
export class WorkoutSessionService {
  constructor(
    private sessionRepo: WorkoutSessionRepository,
    private workoutRepo: WorkoutRepository,
    private exerciseRepo: ExerciseRepository,
    private eventBus: EventBusService,
  ) {}

  /**
   * Iniciar nueva sesión
   */
  async startSession(userId: string, createDto: CreateSessionDto) {
    // Verificar que workout existe
    const workout = await this.workoutRepo.findById(createDto.workoutId);
    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    const session = await this.sessionRepo.createSession(userId, createDto.workoutId);
    return new SessionResponseDto(session);
  }

  /**
   * Obtener sesión activa del usuario
   */
  async getActiveSession(userId: string) {
    const session = await this.sessionRepo.findActiveSession(userId);
    if (!session) {
      throw new NotFoundException('No active session');
    }
    return new SessionResponseDto(session);
  }

  /**
   * Obtener sesión por ID
   */
  async getSessionById(id: string, userId: string) {
    const session = await this.sessionRepo.findSessionById(id);
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }
    return new SessionResponseDto(session);
  }

  /**
   * Obtener historial de sesiones del usuario
   */
  async getSessionHistory(userId: string, skip = 0, take = 10) {
    const sessions = await this.sessionRepo.findUserSessions(userId, skip, take);
    return sessions.map((s) => new SessionResponseDto(s));
  }

  /**
   * Agregar set a la sesión
   */
  async addSet(sessionId: string, userId: string, addSetDto: AddSetDto) {
    // Verificar que la sesión existe y pertenece al usuario
    const session = await this.sessionRepo.findSessionById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Session is not active');
    }

    // Verificar que el ejercicio existe
    const exercise = await this.exerciseRepo.findById(addSetDto.exerciseId);
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const set = await this.sessionRepo.addSet(sessionId, addSetDto.exerciseId, addSetDto);

    // EMITIR evento
    this.eventBus.emit(
      new ExercisePerformedEvent(
        addSetDto.exerciseId,
        userId,
        addSetDto.reps,
        addSetDto.reps,
        addSetDto.weight,
        new Date(),
      ),
    );

    return set;
  }

  /**
   * Completar sesión
   */
  async completeSession(sessionId: string, userId: string, completeDto: CompleteSessionDto) {
    // Verificar que la sesión existe y pertenece al usuario
    const session = await this.sessionRepo.findSessionById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Session is not active');
    }

    const completed = await this.sessionRepo.completeSession(
      sessionId,
      completeDto.durationMinutes,
    );

    return new SessionResponseDto(completed);
  }

  /**
   * Obtener stats del usuario
   */
  async getUserStats(userId: string) {
    const totalSessions = await this.sessionRepo.countSessions(userId);
    const totalVolume = await this.sessionRepo.getTotalVolume(userId);

    return {
      totalWorkouts: totalSessions,
      totalVolume,
      avgVolumePerSession: totalSessions > 0 ? Math.floor(totalVolume / totalSessions) : 0,
    };
  }
}
