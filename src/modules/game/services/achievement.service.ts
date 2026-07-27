import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  targetValue: number;
}

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  private readonly ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first_workout',
      name: 'First Steps',
      description: 'Complete your first workout',
      icon: '🏋️',
      requirement: 'complete_1_workout',
      targetValue: 1,
    },
    {
      id: 'iron_will',
      name: 'Iron Will',
      description: 'Complete 50 workouts',
      icon: '💪',
      requirement: 'total_workouts',
      targetValue: 50,
    },
    {
      id: 'champion',
      name: 'Champion',
      description: 'Reach level 25',
      icon: '👑',
      requirement: 'character_level',
      targetValue: 25,
    },
    {
      id: 'fitness_deity',
      name: 'Fitness Deity',
      description: 'Reach level 50',
      icon: '🔱',
      requirement: 'character_level',
      targetValue: 50,
    },
    {
      id: 'collector',
      name: 'Collector',
      description: 'Collect 20 cosmetics',
      icon: '💎',
      requirement: 'cosmetic_items',
      targetValue: 20,
    },
    {
      id: 'leaderboard_king',
      name: 'Leaderboard King',
      description: 'Reach top 10 in leaderboard',
      icon: '👸',
      requirement: 'leaderboard_rank',
      targetValue: 10,
    },
  ];

  async getAvailableAchievements() {
    return this.ACHIEVEMENTS;
  }

  async checkAndAwardAchievements(userId: string, characterId: string) {
    const character = await this.prisma.gameCharacter.findUnique({
      where: { id: characterId },
    });

    const leaderboardEntry = await this.prisma.gameLeaderboardEntry.findUnique({
      where: { userId },
    });

    const inventory = await this.prisma.gameInventory.findMany({
      where: { userId },
    });

    const earnedAchievements: Achievement[] = [];

    for (const achievement of this.ACHIEVEMENTS) {
      if (achievement.requirement === 'complete_1_workout' && character?.totalWorkouts >= 1) {
        earnedAchievements.push(achievement);
      } else if (achievement.requirement === 'total_workouts' && character?.totalWorkouts! >= achievement.targetValue) {
        earnedAchievements.push(achievement);
      } else if (achievement.requirement === 'character_level' && character?.level! >= achievement.targetValue) {
        earnedAchievements.push(achievement);
      } else if (achievement.requirement === 'cosmetic_items' && inventory.length >= achievement.targetValue) {
        earnedAchievements.push(achievement);
      } else if (achievement.requirement === 'leaderboard_rank' && leaderboardEntry?.rank! <= achievement.targetValue) {
        earnedAchievements.push(achievement);
      }
    }

    return earnedAchievements;
  }

  async getUserAchievements(userId: string) {
    const character = await this.prisma.gameCharacter.findUnique({
      where: { userId },
    });

    if (!character) {
      return [];
    }

    return this.checkAndAwardAchievements(userId, character.id);
  }
}
