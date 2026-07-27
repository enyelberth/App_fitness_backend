import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: Date;
  totalWorkouts: number;
}

@Injectable()
export class DailyStreakService {
  constructor(private prisma: PrismaService) {}

  async getMyStreak(userId: string): Promise<StreakData> {
    // Mock implementation
    return {
      userId,
      currentStreak: 5,
      longestStreak: 12,
      lastWorkoutDate: new Date(),
      totalWorkouts: 25,
    };
  }

  async checkinWorkout(userId: string) {
    // Mock implementation
    const streak = await this.getMyStreak(userId);

    return {
      message: 'Workout checked in',
      currentStreak: streak.currentStreak + 1,
      rewards: this.calculateRewards(streak.currentStreak + 1),
    };
  }

  async getStreakRewards(userId: string) {
    const streak = await this.getMyStreak(userId);

    return {
      userId,
      currentStreak: streak.currentStreak,
      rewards: [
        {
          milestone: 3,
          reward: '1 Cosmetic',
          unlocked: streak.currentStreak >= 3,
        },
        {
          milestone: 7,
          reward: 'Battle Pass Discount 50%',
          unlocked: streak.currentStreak >= 7,
        },
        {
          milestone: 30,
          reward: 'Exclusive Title: Unstoppable',
          unlocked: streak.currentStreak >= 30,
        },
        {
          milestone: 100,
          reward: 'Legendary Badge + 1000 Coins',
          unlocked: streak.currentStreak >= 100,
        },
      ],
    };
  }

  private calculateRewards(streak: number) {
    const rewards = [];

    if (streak === 3) rewards.push('Cosmetic: Basic T-Shirt');
    if (streak === 7) rewards.push('50% Battle Pass Discount');
    if (streak === 30) rewards.push('Title: Unstoppable');
    if (streak === 100) rewards.push('Badge: Legendary + 1000 Coins');

    return rewards;
  }

  async resetStreak(userId: string) {
    // Called when user misses a day
    return {
      message: 'Streak reset. Start a new workout to begin again!',
      newStreak: 0,
    };
  }

  async getLeaderboardByStreak(limit: number = 100) {
    // Mock leaderboard
    return [
      {
        rank: 1,
        username: 'FitnessKing',
        currentStreak: 45,
        reward: 'Top 1%',
      },
      {
        rank: 2,
        username: 'GymRat',
        currentStreak: 38,
        reward: 'Top 5%',
      },
      {
        rank: 3,
        username: 'NoGymNoGain',
        currentStreak: 25,
        reward: 'Top 10%',
      },
    ];
  }

  async getStreakMultiplier(currentStreak: number): Promise<number> {
    // XP multiplier based on streak
    if (currentStreak >= 30) return 2.0; // 2x XP
    if (currentStreak >= 14) return 1.5; // 1.5x XP
    if (currentStreak >= 7) return 1.25; // 1.25x XP
    if (currentStreak >= 3) return 1.1; // 1.1x XP
    return 1.0; // 1x XP
  }
}
