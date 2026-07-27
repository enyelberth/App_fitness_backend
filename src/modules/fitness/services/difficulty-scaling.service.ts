import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DifficultyScalingService {
  constructor(private prisma: PrismaService) {}

  async getExerciseProgression(userId: string, exerciseId: string) {
    const history = await this.prisma.progressEntry.findMany({
      where: {
        userId,
        exerciseId,
      },
      orderBy: { performedAt: 'desc' },
      take: 10,
    });

    if (history.length === 0) {
      return { 
        message: 'No history for this exercise',
        recommendation: 'Start light and track your progress'
      };
    }

    return {
      history,
      analysis: this.analyzeProgress(history),
    };
  }

  async suggestNextWeight(userId: string, exerciseId: string) {
    const history = await this.prisma.progressEntry.findMany({
      where: {
        userId,
        exerciseId,
      },
      orderBy: { performedAt: 'desc' },
      take: 5,
    });

    if (history.length === 0) {
      return {
        suggestion: 'Start with 10kg or bodyweight',
        reason: 'No previous data',
      };
    }

    const recentEntries = history;
    const avgWeight = recentEntries.reduce((sum, e) => sum + (e.weightKg ? Number(e.weightKg) : 0), 0) / recentEntries.length;
    
    const successRate = recentEntries.filter(e => e.weightKg).length / recentEntries.length;

    if (successRate > 0.8) {
      const newWeight = Number((avgWeight * 1.05).toFixed(1));
      return {
        suggestion: \Increase to \kg\,
        reason: 'Consistently completing sets with good form',
        percentageIncrease: '5%',
      };
    } else if (successRate < 0.5) {
      const newWeight = Number((avgWeight * 0.9).toFixed(1));
      return {
        suggestion: \Decrease to \kg\,
        reason: 'Struggling to complete sets',
        percentageDecrease: '10%',
      };
    } else {
      return {
        suggestion: 'Maintain current weight',
        reason: 'Steady progress - focus on form',
      };
    }
  }

  async updateWorkoutDifficulty(workoutId: string, userId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: true },
    });

    if (!workout || workout.userId !== userId) {
      return { error: 'Workout not found' };
    }

    const sessionHistory = await this.prisma.workoutSession.findMany({
      where: { workoutId },
      orderBy: { startedAt: 'desc' },
      take: 3,
      include: { sets: true },
    });

    if (sessionHistory.length === 0) {
      return { message: 'No session history yet' };
    }

    const recentCompletion = sessionHistory.length >= 2 
      ? sessionHistory.every(s => s.status === 'COMPLETED')
      : null;

    if (recentCompletion === true) {
      const newDifficulty = this.increaseDifficulty(workout.difficulty);
      return {
        action: 'increase',
        newDifficulty,
        message: 'Consistently completing workouts - increasing difficulty',
      };
    } else if (recentCompletion === false) {
      const newDifficulty = this.decreaseDifficulty(workout.difficulty);
      return {
        action: 'decrease',
        newDifficulty,
        message: 'Having trouble completing workouts - decreasing difficulty',
      };
    } else {
      return {
        action: 'maintain',
        message: 'Keep current difficulty',
      };
    }
  }

  private analyzeProgress(entries: any[]) {
    const weights = entries.map(e => e.weightKg).filter(w => w);
    
    if (weights.length < 2) {
      return { trend: 'insufficient_data' };
    }

    const latest = Number(weights[0]);
    const initial = Number(weights[weights.length - 1]);
    const change = latest - initial;
    const percentChange = ((change / initial) * 100).toFixed(1);

    return {
      trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
      totalChange: change.toFixed(1),
      percentChange,
      recommendation: change > 0 
        ? 'Great progress! Keep pushing.'
        : 'Consider maintaining current weight or taking a deload.',
    };
  }

  private increaseDifficulty(current: string): string {
    const map: Record<string, string> = {
      'BEGINNER': 'INTERMEDIATE',
      'INTERMEDIATE': 'ADVANCED',
      'ADVANCED': 'ADVANCED',
    };
    return map[current] || current;
  }

  private decreaseDifficulty(current: string): string {
    const map: Record<string, string> = {
      'ADVANCED': 'INTERMEDIATE',
      'INTERMEDIATE': 'BEGINNER',
      'BEGINNER': 'BEGINNER',
    };
    return map[current] || current;
  }
}
