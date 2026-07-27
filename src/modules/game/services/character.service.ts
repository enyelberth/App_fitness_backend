import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { CharacterRepository } from '../repositories/character.repository';
import { CreateCharacterDto, CharacterResponseDto, LeaderboardEntryDto, CharacterClass } from '../dto/character.dto';
import {
  CharacterCreatedEvent,
  CharacterLeveledUpEvent,
  XpAwardedEvent,
} from '../events/character-events';
import { WorkoutCompletedEvent } from '../../fitness/events/workout-completed.event';

@Injectable()
export class CharacterService implements OnModuleInit {
  constructor(
    private repository: CharacterRepository,
    private eventBus: EventBusService,
  ) {}

  /**
   * OnModuleInit: Escuchar eventos de Fitness
   */
  onModuleInit() {
    // Escuchar cuando workout se completa
    this.eventBus.on(WorkoutCompletedEvent, (event) => {
      this.handleWorkoutCompleted(event);
    });
  }

  /**
   * Crear nuevo personaje
   */
  async create(userId: string, createDto: CreateCharacterDto) {
    // Verificar que el usuario no tenga ya un personaje
    const existing = await this.repository.findByUserId(userId);
    if (existing) {
      throw new BadRequestException('You already have a character');
    }

    const character = await this.repository.create(userId, {
      class: createDto.class,
      level: 1,
      currentXp: 0,
      totalXp: 0,
    });

    // Emitir evento
    this.eventBus.emit(
      new CharacterCreatedEvent(character.id, userId, character.class, character.createdAt),
    );

    return new CharacterResponseDto(character);
  }

  /**
   * Obtener mi personaje
   */
  async getMyCharacter(userId: string) {
    const character = await this.repository.findByUserId(userId);

    if (!character) {
      throw new NotFoundException('You do not have a character yet');
    }

    return new CharacterResponseDto(character);
  }

  /**
   * Obtener personaje por ID (pública - solo datos básicos)
   */
  async getById(id: string) {
    const character = await this.repository.findById(id);

    if (!character) {
      throw new NotFoundException(`Character ${id} not found`);
    }

    return new CharacterResponseDto(character);
  }

  /**
   * Otorgar XP al personaje
   * Manejado por listener de WorkoutCompletedEvent
   */
  async awardXP(userId: string, xpAmount: number, source = 'workout') {
    const character = await this.repository.findByUserId(userId);

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    // Actualizar XP
    const result = await this.repository.updateXp(character.id, xpAmount);

    // Emitir evento de XP awarded
    this.eventBus.emit(
      new XpAwardedEvent(character.id, userId, xpAmount, source, new Date()),
    );

    // Si leveled up, emitir ese evento también
    if (result.levelsUp) {
      this.eventBus.emit(
        new CharacterLeveledUpEvent(
          character.id,
          userId,
          result.newLevel,
          result.character.totalXp,
          new Date(),
        ),
      );
    }

    return {
      success: true,
      xp: xpAmount,
      levelsUp: result.levelsUp,
      newLevel: result.newLevel,
      character: new CharacterResponseDto(result.character),
    };
  }

  /**
   * Obtener leaderboard global
   */
  async getLeaderboard(limit = 100) {
    const characters = await this.repository.getLeaderboard(limit);

    return characters.map(
      (char, index) =>
        new LeaderboardEntryDto(index + 1, char),
    );
  }

  /**
   * Obtener mi posición en leaderboard
   */
  async getMyRank(userId: string) {
    const rank = await this.repository.getUserRank(userId);

    if (!rank) {
      throw new NotFoundException('Character not found');
    }

    return { rank };
  }

  /**
   * Handler: Cuando workout se completa
   * Escucha WorkoutCompletedEvent de Fitness module
   */
  private async handleWorkoutCompleted(event: WorkoutCompletedEvent) {
    try {
      console.log(`[Game] Handling WorkoutCompletedEvent for user ${event.userId}, XP: ${event.xp}`);

      // Otorgar XP al personaje
      await this.awardXP(event.userId, event.xp, 'workout');

      // Incrementar contador de workouts
      const character = await this.repository.findByUserId(event.userId);
      if (character) {
        await this.repository.incrementWorkoutCount(character.id);
      }
    } catch (error) {
      console.error(`[Game] Error handling WorkoutCompletedEvent:`, error);
    }
  }
}
