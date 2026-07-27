import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { QuestRepository } from '../repositories/quest.repository';
import { QuestResponseDto } from '../dto/quest.dto';
import { QuestCompletedEvent } from '../events/character-events';

@Injectable()
export class QuestService {
  constructor(
    private questRepo: QuestRepository,
    private eventBus: EventBusService,
  ) {}

  async getActiveQuests(userId: string) {
    const quests = await this.questRepo.findActiveQuests(userId);
    return quests.map((q) => new QuestResponseDto(q));
  }

  async getQuestsByType(userId: string, type: string) {
    const quests = await this.questRepo.findQuestsByType(userId, type);
    return quests.map((q) => new QuestResponseDto(q));
  }

  async updateProgress(questId: string, userId: string, progress: number) {
    const quest = await this.questRepo.updateProgress(questId, progress);

    // Verificar si se completó
    if (quest.currentProgress >= quest.targetValue) {
      return this.completeQuest(questId, userId);
    }

    return new QuestResponseDto(quest);
  }

  async completeQuest(questId: string, userId: string) {
    const quest = await this.questRepo.completeQuest(questId);

    // EMITIR evento
    this.eventBus.emit(
      new QuestCompletedEvent(
        questId,
        userId,
        {
          xp: quest.xpReward,
          coins: quest.coinReward,
          gems: quest.gemReward,
        },
        new Date(),
      ),
    );

    return new QuestResponseDto(quest);
  }

  async getCompletedQuests(userId: string) {
    const quests = await this.questRepo.getCompletedQuests(userId);
    return quests.map((q) => new QuestResponseDto(q));
  }
}
