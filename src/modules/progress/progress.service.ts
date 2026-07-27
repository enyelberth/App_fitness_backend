import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { LogProgressDto } from './dto/log-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async logEntry(userId: string, dto: LogProgressDto) {
    return this.prisma.progressEntry.create({
      data: {
        userId,
        exerciseId: dto.exerciseId,
        weightKg: dto.weightKg,
        bodyFatPct: dto.bodyFatPct,
        sets: dto.sets,
        reps: dto.reps,
        notes: dto.notes,
        performedAt: dto.performedAt || new Date(),
      },
    });
  }

  async findByUser(userId: string, skip = 0, take = 50) {
    const entries = await this.prisma.progressEntry.findMany({
      where: { userId },
      include: { exercise: true },
      skip,
      take,
      orderBy: { performedAt: 'desc' },
    });

    const total = await this.prisma.progressEntry.count({ where: { userId } });
    return { entries, total };
  }

  async findByExercise(userId: string, exerciseId: string) {
    const entries = await this.prisma.progressEntry.findMany({
      where: { userId, exerciseId },
      orderBy: { performedAt: 'desc' },
      take: 50,
    });

    return entries;
  }

  async getStats(userId: string) {
    const entries = await this.prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { performedAt: 'asc' },
    });

    if (!entries.length) return null;

    const weights = entries.filter((e) => e.weightKg).map((e) => e.weightKg);
    const bodyFats = entries.filter((e) => e.bodyFatPct).map((e) => e.bodyFatPct);

    return {
      totalEntries: entries.length,
      firstDate: entries[0].performedAt,
      lastDate: entries[entries.length - 1].performedAt,
      weight: {
        min: Math.min(...weights.map(Number)),
        max: Math.max(...weights.map(Number)),
        latest: weights[weights.length - 1],
      },
      bodyFat: bodyFats.length
        ? {
            min: Math.min(...bodyFats.map(Number)),
            max: Math.max(...bodyFats.map(Number)),
            latest: bodyFats[bodyFats.length - 1],
          }
        : null,
    };
  }
}
