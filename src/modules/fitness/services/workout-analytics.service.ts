import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WorkoutAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getWorkoutHistory(userId: string, limit: number = 50) {
    return this.prisma.workoutSession.findMany({
      where: { userId },
      take: limit,
      orderBy: { startedAt: 'desc' },
      include: {
        workout: true,
        sets: { include: { exercise: true } },
      },
    });
  }

  async getWeeklyStats(userId: string) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        startedAt: { gte: oneWeekAgo },
      },
      include: { sets: true },
    });

    const totalSessions = sessions.length;
    const totalVolume = sessions.reduce((acc, session) => {
      const volumePerSession = session.sets.reduce((setAcc, set) => {
        return setAcc + (set.weightUsed ? Number(set.weightUsed) * set.setsCompleted * set.repsPerformed[0] : 0);
      }, 0);
      return acc + volumePerSession;
    }, 0);

    const avgDuration = sessions.length > 0 
      ? sessions.reduce((acc, s) => acc + (s.endedAt ? (s.endedAt.getTime() - s.startedAt.getTime()) / 60000 : 0), 0) / sessions.length
      : 0;

    return {
      period: 'weekly',
      totalSessions,
      totalVolume: totalVolume.toFixed(0),
      avgDurationMin: avgDuration.toFixed(1),
      daysActive: new Set(sessions.map(s => s.startedAt.toDateString())).size,
    };
  }

  async getMonthlyStats(userId: string) {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        startedAt: { gte: oneMonthAgo },
      },
      include: { sets: true },
    });

    const totalSessions = sessions.length;
    const totalVolume = sessions.reduce((acc, session) => {
      const volumePerSession = session.sets.reduce((setAcc, set) => {
        return setAcc + (set.weightUsed ? Number(set.weightUsed) * set.setsCompleted : 0);
      }, 0);
      return acc + volumePerSession;
    }, 0);

    return {
      period: 'monthly',
      totalSessions,
      totalVolume: totalVolume.toFixed(0),
      avgSessionsPerWeek: (totalSessions / 4.3).toFixed(1),
      consistency: totalSessions >= 12 ? 'excellent' : totalSessions >= 8 ? 'good' : 'needs-improvement',
    };
  }

  async getBodyProgress(userId: string) {
    const progressEntries = await this.prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { performedAt: 'asc' },
      select: {
        weightKg: true,
        bodyFatPct: true,
        performedAt: true,
      },
    });

    if (progressEntries.length === 0) {
      return { message: 'No progress data yet' };
    }

    const latest = progressEntries[progressEntries.length - 1];
    const initial = progressEntries[0];

    return {
      current: {
        weight: latest.weightKg,
        bodyFat: latest.bodyFatPct,
        date: latest.performedAt,
      },
      initial: {
        weight: initial.weightKg,
        bodyFat: initial.bodyFatPct,
        date: initial.performedAt,
      },
      change: {
        weightChange: latest.weightKg && initial.weightKg 
          ? (Number(latest.weightKg) - Number(initial.weightKg)).toFixed(1)
          : 'N/A',
        bodyFatChange: latest.bodyFatPct && initial.bodyFatPct
          ? (Number(latest.bodyFatPct) - Number(initial.bodyFatPct)).toFixed(1)
          : 'N/A',
      },
    };
  }

  async getMuscleGroupStats(userId: string) {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId },
      include: {
        sets: {
          include: {
            exercise: {
              include: {
                muscles: true,
              },
            },
          },
        },
      },
    });

    const muscleStats: Record<string, { sessions: number; volume: number }> = {};

    sessions.forEach(session => {
      session.sets.forEach(set => {
        set.exercise.muscles.forEach(muscle => {
          if (!muscleStats[muscle.muscleGroupId]) {
            muscleStats[muscle.muscleGroupId] = { sessions: 0, volume: 0 };
          }
          muscleStats[muscle.muscleGroupId].sessions += 1;
          muscleStats[muscle.muscleGroupId].volume += set.weightUsed ? Number(set.weightUsed) * set.setsCompleted : 0;
        });
      });
    });

    return Object.entries(muscleStats).map(([muscleId, stats]) => ({
      muscleGroupId: muscleId,
      sessions: stats.sessions,
      totalVolume: stats.volume.toFixed(0),
    }));
  }
}
