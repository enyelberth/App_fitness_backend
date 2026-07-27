import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class QuestRepository {
  constructor(private prisma: PrismaService) {}

  async createQuest(userId: string, data: any) {
    return this.prisma.gameQuest.create({
      data: {
        userId,
        ...data,
        status: 'ACTIVE',
      },
    });
  }

  async findActiveQuests(userId: string) {
    return this.prisma.gameQuest.findMany({
      where: { userId, status: 'ACTIVE' },
    });
  }

  async findQuestsByType(userId: string, type: string) {
    return this.prisma.gameQuest.findMany({
      where: { userId, type, status: 'ACTIVE' },
    });
  }

  async updateProgress(id: string, progress: number) {
    return this.prisma.gameQuest.update({
      where: { id },
      data: { currentProgress: progress },
    });
  }

  async completeQuest(id: string) {
    return this.prisma.gameQuest.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  async getCompletedQuests(userId: string) {
    return this.prisma.gameQuest.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
    });
  }
}
