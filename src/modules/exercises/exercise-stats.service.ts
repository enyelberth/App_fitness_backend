import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExerciseStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserExerciseStats(userId: string, exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const workingSets = await this.prisma.workoutSessionSet.findMany({
      where: {
        exerciseId,
        session: { userId },
        isWarmupSet: false,
      },
      include: { session: true },
      orderBy: { createdAt: 'asc' },
    });

    if (workingSets.length === 0) {
      return {
        exerciseId,
        totalTimesPerformed: 0,
        personalRecord: null,
        averageWeight: 0,
        averageReps: 0,
        totalVolume: 0,
        progressionTrend: 'NONE',
        stats: null,
      };
    }

    // Calculate PR (highest weight x reps combo)
    let prSet = workingSets[0];
    let maxWeight = 0;
    workingSets.forEach((set) => {
      const weight = set.weightUsed ? parseFloat(set.weightUsed.toString()) : 0;
      if (weight > maxWeight) {
        maxWeight = weight;
        prSet = set;
      }
    });

    const prWeight = prSet.weightUsed ? parseFloat(prSet.weightUsed.toString()) : 0;
    const prReps = prSet.repsPerformed.length > 0 ? Math.max(...prSet.repsPerformed) : 0;
    const estimatedMaxRep = this.calculateEstimated1RM(prWeight, prReps);

    // Calculate volume and averages
    let totalVolume = 0;
    let totalWeight = 0;
    let totalReps = 0;
    let totalRPE = 0;
    let rpeCount = 0;

    workingSets.forEach((set) => {
      const weight = set.weightUsed ? parseFloat(set.weightUsed.toString()) : 0;
      const reps = set.repsPerformed.length;
      totalVolume += weight * reps;
      totalWeight += weight;
      totalReps += reps;
      if (set.rpe) {
        totalRPE += set.rpe;
        rpeCount++;
      }
    });

    const averageWeight = totalWeight / workingSets.length;
    const averageReps = totalReps / workingSets.length;
    const averageRpe = rpeCount > 0 ? totalRPE / rpeCount : 0;

    // Calculate progression trend
    const recentSets = workingSets.slice(-5);
    const olderSets = workingSets.slice(0, Math.max(1, workingSets.length - 5));

    const recentAvgWeight =
      recentSets.reduce((sum, s) => sum + (s.weightUsed ? parseFloat(s.weightUsed.toString()) : 0), 0) /
      recentSets.length;
    const olderAvgWeight =
      olderSets.reduce((sum, s) => sum + (s.weightUsed ? parseFloat(s.weightUsed.toString()) : 0), 0) /
      olderSets.length;

    let progressionTrend = 'STABLE';
    if (recentAvgWeight > olderAvgWeight * 1.05) {
      progressionTrend = 'UP';
    } else if (recentAvgWeight < olderAvgWeight * 0.95) {
      progressionTrend = 'DOWN';
    }

    return {
      exerciseId,
      totalTimesPerformed: workingSets.length,
      personalRecord: {
        weight: prWeight,
        reps: prReps,
        date: prSet.createdAt,
        estimatedMaxRep: Math.round(estimatedMaxRep * 10) / 10,
      },
      averageWeight: Math.round(averageWeight * 100) / 100,
      averageReps: Math.round(averageReps * 10) / 10,
      averageRpe: Math.round(averageRpe * 10) / 10,
      totalVolume: Math.round(totalVolume),
      progressionTrend,
      firstSession: workingSets[0]?.createdAt,
      lastSession: workingSets[workingSets.length - 1]?.createdAt,
    };
  }

  async getUserMuscleGroupStats(userId: string) {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId },
      include: {
        sets: {
          include: { exercise: { include: { muscles: { include: { muscleGroup: true } } } } },
          where: { isWarmupSet: false },
        },
      },
    });

    if (sessions.length === 0) {
      return {};
    }

    const muscleStats: any = {};

    sessions.forEach((session) => {
      session.sets.forEach((set) => {
        const weight = set.weightUsed ? parseFloat(set.weightUsed.toString()) : 0;
        const reps = set.repsPerformed.length;
        const volume = weight * reps;

        set.exercise.muscles.forEach((em) => {
          const muscleName = em.muscleGroup.name;
          if (!muscleStats[muscleName]) {
            muscleStats[muscleName] = {
              volume: 0,
              frequency: 0,
              timesTargeted: 0,
            };
          }
          muscleStats[muscleName].volume += volume;
          muscleStats[muscleName].frequency += 1;
        });
      });
    });

    // Count times muscle was targeted (sessions where it was worked)
    sessions.forEach((session) => {
      const musclesInSession = new Set<string>();
      session.sets.forEach((set) => {
        set.exercise.muscles.forEach((em) => {
          musclesInSession.add(em.muscleGroup.name);
        });
      });
      musclesInSession.forEach((muscleName) => {
        muscleStats[muscleName].timesTargeted += 1;
      });
    });

    return muscleStats;
  }

  async getUserExerciseFrequency(userId: string) {
    const exercises = await this.prisma.workoutSessionSet.findMany({
      where: {
        session: { userId },
        isWarmupSet: false,
      },
      include: { exercise: true },
    });

    const frequency: any = {};

    exercises.forEach((set) => {
      if (!frequency[set.exerciseId]) {
        frequency[set.exerciseId] = {
          exerciseName: set.exercise.name,
          timesPerformed: 0,
          totalVolume: 0,
          totalWeight: 0,
          totalReps: 0,
        };
      }

      const weight = set.weightUsed ? parseFloat(set.weightUsed.toString()) : 0;
      const reps = set.repsPerformed.length;

      frequency[set.exerciseId].timesPerformed += 1;
      frequency[set.exerciseId].totalVolume += weight * reps;
      frequency[set.exerciseId].totalWeight += weight;
      frequency[set.exerciseId].totalReps += reps;
    });

    return Object.values(frequency).sort(
      (a: any, b: any) => b.timesPerformed - a.timesPerformed
    );
  }

  async getUserProgressionSummary(userId: string) {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId },
      include: {
        sets: {
          include: { exercise: true },
          where: { isWarmupSet: false },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (sessions.length === 0) {
      return null;
    }

    // Get first week stats
    const firstSessionDate = sessions[0].createdAt;
    const firstWeekEnd = new Date(firstSessionDate);
    firstWeekEnd.setDate(firstWeekEnd.getDate() + 7);

    const firstWeekSessions = sessions.filter((s) => s.createdAt <= firstWeekEnd);
    const firstWeekVolume = firstWeekSessions.reduce((sum, s) => {
      return (
        sum +
        s.sets.reduce((setSum, set) => {
          const weight = set.weightUsed ? parseFloat(set.weightUsed.toString()) : 0;
          return setSum + weight * set.repsPerformed.length;
        }, 0)
      );
    }, 0);

    // Get last week stats
    const lastSessionDate = sessions[sessions.length - 1].createdAt;
    const lastWeekStart = new Date(lastSessionDate);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastWeekSessions = sessions.filter((s) => s.createdAt >= lastWeekStart);
    const lastWeekVolume = lastWeekSessions.reduce((sum, s) => {
      return (
        sum +
        s.sets.reduce((setSum, set) => {
          const weight = set.weightUsed ? parseFloat(set.weightUsed.toString()) : 0;
          return setSum + weight * set.repsPerformed.length;
        }, 0)
      );
    }, 0);

    const volumeProgress = ((lastWeekVolume - firstWeekVolume) / firstWeekVolume) * 100;

    return {
      totalSessions: sessions.length,
      dateRange: {
        start: firstSessionDate,
        end: lastSessionDate,
      },
      firstWeekVolume: Math.round(firstWeekVolume),
      lastWeekVolume: Math.round(lastWeekVolume),
      volumeProgressPercent: Math.round(volumeProgress * 10) / 10,
      trend: volumeProgress > 5 ? 'IMPROVING' : volumeProgress < -5 ? 'DECLINING' : 'STABLE',
    };
  }

  private calculateEstimated1RM(weight: number, reps: number): number {
    if (reps === 1) return weight;
    if (reps <= 0) return weight;

    // Epley formula: 1RM = weight × (1 + (reps / 30))
    return weight * (1 + reps / 30);
  }
}
