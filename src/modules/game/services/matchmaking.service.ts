import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface PlayerRating {
  userId: string;
  username: string;
  rating: number;
  winRate: number;
  level: number;
}

@Injectable()
export class MatchmakingService {
  private waitingPlayers: Map<string, PlayerRating> = new Map();
  private matches: Map<string, { player1: string; player2: string }> = new Map();

  constructor(private prisma: PrismaService) {}

  async getPlayerRating(userId: string): Promise<PlayerRating> {
    // Mock implementation
    return {
      userId,
      username: 'Player_' + userId.substring(0, 4),
      rating: 1200 + Math.random() * 800,
      winRate: 0.45 + Math.random() * 0.4,
      level: 15 + Math.floor(Math.random() * 85),
    };
  }

  async joinMatchmakingQueue(userId: string) {
    if (this.waitingPlayers.has(userId)) {
      throw new BadRequestException('Already in queue');
    }

    const rating = await this.getPlayerRating(userId);
    this.waitingPlayers.set(userId, rating);

    // Check for potential match
    const opponent = this.findOpponent(rating);

    if (opponent) {
      const matchId = this.createMatch(userId, opponent.userId);
      this.waitingPlayers.delete(userId);
      this.waitingPlayers.delete(opponent.userId);

      return {
        matched: true,
        matchId,
        opponentUsername: opponent.username,
        opponentRating: opponent.rating,
        estimatedDuration: '5-10 minutes',
      };
    }

    return {
      matched: false,
      message: 'Waiting for opponent...',
      queuePosition: this.waitingPlayers.size,
      estimatedWaitTime: '30-60 seconds',
    };
  }

  async leaveMatchmakingQueue(userId: string) {
    if (!this.waitingPlayers.has(userId)) {
      throw new BadRequestException('Not in queue');
    }

    this.waitingPlayers.delete(userId);

    return {
      message: 'Left matchmaking queue',
      remainingInQueue: this.waitingPlayers.size,
    };
  }

  async getQueueStatus(userId: string) {
    const isInQueue = this.waitingPlayers.has(userId);

    return {
      userId,
      isInQueue,
      queueSize: this.waitingPlayers.size,
      estimatedWaitTime: isInQueue ? '30-60 seconds' : 'Not queued',
      averageRating: this.calculateAverageRating(),
    };
  }

  private findOpponent(player: PlayerRating): PlayerRating | null {
    let bestMatch: PlayerRating | null = null;
    let bestDifference = Infinity;

    for (const [, opponent] of this.waitingPlayers) {
      if (opponent.userId === player.userId) continue;

      const ratingDifference = Math.abs(player.rating - opponent.rating);

      if (ratingDifference < bestDifference) {
        bestDifference = ratingDifference;
        bestMatch = opponent;
      }
    }

    // Only match if rating difference is reasonable (within 200 points)
    if (bestMatch && bestDifference <= 200) {
      return bestMatch;
    }

    return null;
  }

  private createMatch(player1Id: string, player2Id: string): string {
    const matchId = Math.random().toString(36).substr(2, 9);
    this.matches.set(matchId, { player1: player1Id, player2: player2Id });
    return matchId;
  }

  private calculateAverageRating(): number {
    if (this.waitingPlayers.size === 0) return 0;

    const sum = Array.from(this.waitingPlayers.values()).reduce(
      (acc, player) => acc + player.rating,
      0,
    );
    return Math.round(sum / this.waitingPlayers.size);
  }

  async getMatchmakingStats() {
    return {
      playersInQueue: this.waitingPlayers.size,
      activeMatches: this.matches.size,
      averageQueueTime: '45 seconds',
      longestWait: this.waitingPlayers.size > 0 ? '2 minutes' : '0',
      platformStats: {
        totalMatches: 1000,
        averageMatchDuration: 8.5,
        matchmakingSuccessRate: 98.5,
      },
    };
  }

  async getRankedLeaderboard(limit: number = 100) {
    // Mock leaderboard
    return [
      {
        rank: 1,
        username: 'GrandMaster_Zeus',
        rating: 2400,
        wins: 234,
        losses: 12,
        winRate: '95.1%',
      },
      {
        rank: 2,
        username: 'Challenger_Apollo',
        rating: 2350,
        wins: 198,
        losses: 18,
        winRate: '91.6%',
      },
      {
        rank: 3,
        username: 'Elite_Athena',
        rating: 2300,
        wins: 187,
        losses: 22,
        winRate: '89.5%',
      },
      {
        rank: 4,
        username: 'Legend_Hades',
        rating: 2250,
        wins: 175,
        losses: 28,
        winRate: '86.2%',
      },
      {
        rank: 5,
        username: 'Master_Poseidon',
        rating: 2200,
        wins: 162,
        losses: 32,
        winRate: '83.5%',
      },
    ];
  }

  async getPlayerRankedStats(userId: string) {
    const player = await this.getPlayerRating(userId);

    return {
      userId,
      username: player.username,
      rating: player.rating,
      rank: this.calculateRank(player.rating),
      stats: {
        wins: 45,
        losses: 15,
        winRate: (45 / 60) * 100,
        totalMatches: 60,
      },
      ratingHistory: [
        { date: '2025-07-20', rating: 1100 },
        { date: '2025-07-21', rating: 1150 },
        { date: '2025-07-22', rating: 1180 },
        { date: '2025-07-23', rating: 1250 },
      ],
    };
  }

  private calculateRank(rating: number): string {
    if (rating >= 2400) return 'Grand Master';
    if (rating >= 2200) return 'Master';
    if (rating >= 2000) return 'Diamond';
    if (rating >= 1800) return 'Platinum';
    if (rating >= 1600) return 'Gold';
    if (rating >= 1400) return 'Silver';
    if (rating >= 1200) return 'Bronze';
    return 'Iron';
  }
}
