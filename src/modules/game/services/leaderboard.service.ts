import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getGlobalLeaderboard(limit: number = 100) {
    const leaderboard = await this.prisma.gameLeaderboardEntry.findMany({
      take: limit,
      orderBy: { score: 'desc' },
      include: {
        character: {
          include: {
            user: {
              select: { id: true, username: true, profile: true },
            },
          },
        },
      },
    });

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      score: entry.score,
      character: {
        id: entry.character.id,
        level: entry.character.level,
        class: entry.character.class,
      },
      user: {
        id: entry.character.user.id,
        username: entry.character.user.username,
        avatar: entry.character.user.profile?.avatarUrl,
      },
    }));
  }

  async getUserRank(userId: string) {
    const entry = await this.prisma.gameLeaderboardEntry.findUnique({
      where: { userId },
      include: {
        character: {
          include: {
            user: { select: { id: true, username: true } },
          },
        },
      },
    });

    if (!entry) {
      return { message: 'Usuario no en leaderboard' };
    }

    const rank = await this.prisma.gameLeaderboardEntry.count({
      where: { score: { gt: entry.score } },
    });

    return {
      rank: rank + 1,
      score: entry.score,
      character: {
        level: entry.character.level,
        class: entry.character.class,
      },
    };
  }

  async updateLeaderboardScore(userId: string, newScore: number) {
    return this.prisma.gameLeaderboardEntry.update({
      where: { userId },
      data: { score: newScore },
    });
  }

  async getCharacterStats(characterId: string) {
    const character = await this.prisma.gameCharacter.findUnique({
      where: { id: characterId },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    if (!character) {
      throw new Error('Character not found');
    }

    return {
      id: character.id,
      user: character.user,
      level: character.level,
      totalXp: character.totalXp,
      currentXp: character.currentXp,
      stats: {
        strength: character.strength,
        speed: character.speed,
        stamina: character.stamina,
      },
      workouts: character.totalWorkouts,
      prestigeLevel: character.prestigeLevel,
    };
  }
}
