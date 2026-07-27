import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExerciseStatRepository {
  constructor(private prisma: PrismaService) {}

  async getOrCreate(userId: string, exerciseId: string) {
    let stat = await this.prisma.exerciseStat.findFirst({
      where: { userId, exerciseId },
    });

    if (!stat) {
      stat = await this.prisma.exerciseStat.create({
        data: {
          userId,
          exerciseId,
          totalReps: 0,
          totalVolume: 0,
          maxWeight: 0,
          timesPerformed: 0,
        },
      });
    }

    return stat;
  }

  async updateStat(userId: string, exerciseId: string, reps: number, weight: number, rpe?: number) {
    const stat = await this.getOrCreate(userId, exerciseId);

    return this.prisma.exerciseStat.update({
      where: { id: stat.id },
      data: {
        totalReps: { increment: reps },
        totalVolume: { increment: weight * reps },
        maxWeight: Math.max(stat.maxWeight, weight),
        timesPerformed: { increment: 1 },
        avgRpe: rpe ? (stat.avgRpe ? (stat.avgRpe + rpe) / 2 : rpe) : stat.avgRpe,
        lastPerformed: new Date(),
      },
    });
  }

  async getByExercise(userId: string, exerciseId: string) {
    return this.prisma.exerciseStat.findFirst({
      where: { userId, exerciseId },
    });
  }

  async getTopExercises(userId: string, limit = 10) {
    return this.prisma.exerciseStat.findMany({
      where: { userId },
      orderBy: { timesPerformed: 'desc' },
      take: limit,
    });
  }

  async getPersonalRecords(userId: string) {
    return this.prisma.exerciseStat.findMany({
      where: { userId, maxWeight: { gt: 0 } },
      orderBy: { maxWeight: 'desc' },
    });
  }
}
