import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Battle {
  id: string;
  challenger: string;
  opponent: string;
  status: 'pending' | 'active' | 'completed';
  winner?: string;
  reward: number;
  createdAt: Date;
}

@Injectable()
export class PvPService {
  private battles: Map<string, Battle> = new Map();

  constructor(private prisma: PrismaService) {}

  async challengePlayer(challengerId: string, opponentId: string) {
    if (challengerId === opponentId) {
      throw new BadRequestException('Cannot challenge yourself');
    }

    const opponent = await this.prisma.user.findUnique({
      where: { id: opponentId },
    });

    if (!opponent) {
      throw new NotFoundException('Opponent not found');
    }

    const battle: Battle = {
      id: Math.random().toString(36).substr(2, 9),
      challenger: challengerId,
      opponent: opponentId,
      status: 'pending',
      reward: 100,
      createdAt: new Date(),
    };

    this.battles.set(battle.id, battle);

    return battle;
  }

  async acceptBattle(battleId: string, opponentId: string) {
    const battle = this.battles.get(battleId);

    if (!battle) {
      throw new NotFoundException('Battle not found');
    }

    if (battle.opponent !== opponentId) {
      throw new BadRequestException('Only the opponent can accept');
    }

    battle.status = 'active';

    return {
      message: 'Battle started',
      battleId: battle.id,
      challenger: battle.challenger,
      opponent: battle.opponent,
    };
  }

  async reportBattleResult(battleId: string, winnerId: string, coinReward: number) {
    const battle = this.battles.get(battleId);

    if (!battle) {
      throw new NotFoundException('Battle not found');
    }

    if (winnerId !== battle.challenger && winnerId !== battle.opponent) {
      throw new BadRequestException('Invalid winner');
    }

    battle.status = 'completed';
    battle.winner = winnerId;

    console.log(`Winner ${winnerId} earned ${coinReward} coins`);

    return {
      message: 'Battle result recorded',
      winner: winnerId,
      reward: coinReward,
    };
  }

  async getBattleHistory(userId: string, limit: number = 20) {
    const userBattles = Array.from(this.battles.values())
      .filter(b => b.challenger === userId || b.opponent === userId)
      .filter(b => b.status === 'completed')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return {
      userId,
      battles: userBattles,
      totalBattles: userBattles.length,
    };
  }

  async getBattleStats(userId: string) {
    const userBattles = Array.from(this.battles.values())
      .filter(b => b.challenger === userId || b.opponent === userId)
      .filter(b => b.status === 'completed');

    const wins = userBattles.filter(b => b.winner === userId).length;
    const losses = userBattles.length - wins;
    const winRate = userBattles.length > 0 
      ? ((wins / userBattles.length) * 100).toFixed(1)
      : 0;

    return {
      totalBattles: userBattles.length,
      wins,
      losses,
      winRate: `${winRate}%`,
      rank: this.calculateRank(wins),
    };
  }

  private calculateRank(wins: number): string {
    if (wins >= 100) return 'Legendary';
    if (wins >= 50) return 'Champion';
    if (wins >= 20) return 'Warrior';
    if (wins >= 10) return 'Challenger';
    return 'Novice';
  }

  async getPendingBattles(userId: string) {
    return Array.from(this.battles.values())
      .filter(b => b.opponent === userId && b.status === 'pending');
  }
}
