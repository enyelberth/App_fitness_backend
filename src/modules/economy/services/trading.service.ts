import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface TradeOffer {
  id: string;
  initiatorId: string;
  respondentId: string;
  initiatorItems: { cosmeticId: string; cosmeticName: string }[];
  respondentItems: { cosmeticId: string; cosmeticName: string }[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class TradingService {
  private trades: Map<string, TradeOffer> = new Map();
  private tradeHistory: TradeOffer[] = [];

  constructor(private prisma: PrismaService) {}

  async createTradeOffer(
    initiatorId: string,
    respondentId: string,
    initiatorItems: { cosmeticId: string; cosmeticName: string }[],
    respondentItems: { cosmeticId: string; cosmeticName: string }[],
  ): Promise<TradeOffer> {
    if (initiatorId === respondentId) {
      throw new BadRequestException('Cannot trade with yourself');
    }

    if (initiatorItems.length === 0 || respondentItems.length === 0) {
      throw new BadRequestException('Both sides must have at least 1 item');
    }

    const tradeId = 'trade_' + Math.random().toString(36).substr(2, 24);

    const offer: TradeOffer = {
      id: tradeId,
      initiatorId,
      respondentId,
      initiatorItems,
      respondentItems,
      status: 'PENDING',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    this.trades.set(tradeId, offer);

    return offer;
  }

  async getTradeDetails(tradeId: string): Promise<TradeOffer | null> {
    const trade = this.trades.get(tradeId);
    if (!trade) return null;
    if (trade.expiresAt <= new Date()) {
      trade.status = 'CANCELLED';
    }
    return trade;
  }

  async acceptTrade(tradeId: string, respondentId: string): Promise<{ success: boolean; message: string }> {
    const trade = this.trades.get(tradeId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (trade.respondentId !== respondentId) {
      throw new BadRequestException('Only respondent can accept this trade');
    }

    if (trade.status !== 'PENDING') {
      throw new BadRequestException('Trade is no longer pending');
    }

    if (trade.expiresAt <= new Date()) {
      throw new BadRequestException('Trade has expired');
    }

    trade.status = 'ACCEPTED';
    this.tradeHistory.push(trade);

    return {
      success: true,
      message: 'Trade accepted! Items exchanged.',
    };
  }

  async rejectTrade(tradeId: string, respondentId: string): Promise<{ success: boolean }> {
    const trade = this.trades.get(tradeId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (trade.respondentId !== respondentId) {
      throw new BadRequestException('Only respondent can reject this trade');
    }

    if (trade.status !== 'PENDING') {
      throw new BadRequestException('Cannot reject non-pending trade');
    }

    trade.status = 'REJECTED';

    return { success: true };
  }

  async cancelTrade(tradeId: string, userId: string): Promise<{ success: boolean }> {
    const trade = this.trades.get(tradeId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (trade.initiatorId !== userId) {
      throw new BadRequestException('Only initiator can cancel this trade');
    }

    if (trade.status !== 'PENDING') {
      throw new BadRequestException('Cannot cancel non-pending trade');
    }

    trade.status = 'CANCELLED';

    return { success: true };
  }

  async getPendingTrades(userId: string): Promise<TradeOffer[]> {
    return Array.from(this.trades.values())
      .filter((t) => (t.respondentId === userId || t.initiatorId === userId) && t.status === 'PENDING' && t.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTradeHistory(userId: string, limit: number = 50): Promise<TradeOffer[]> {
    return this.tradeHistory
      .filter((t) => t.initiatorId === userId || t.respondentId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getUserTradeStats(userId: string): Promise<any> {
    const userTrades = this.tradeHistory.filter((t) => t.initiatorId === userId || t.respondentId === userId);
    const initiated = userTrades.filter((t) => t.initiatorId === userId);
    const completed = userTrades.filter((t) => t.status === 'ACCEPTED');

    return {
      userId,
      totalTrades: userTrades.length,
      initiatedTrades: initiated.length,
      completedTrades: completed.length,
      rejectRate: ((userTrades.length - completed.length) / Math.max(userTrades.length, 1)) * 100,
      trustScore: Math.min(100, 50 + (completed.length * 2)),
    };
  }

  async validateTradeItems(userId: string, itemIds: string[]): Promise<boolean> {
    // En producción, verificar que el usuario tiene estos items
    return itemIds.length > 0;
  }

  async suggestTradePartners(userId: string, itemsOffering: string[]): Promise<any[]> {
    // Sugerir usuarios que tienen items complementarios
    return [
      {
        userId: 'user_123',
        username: 'GymRat',
        trustScore: 95,
        hasItems: ['Gold Sword', 'Dragon Pet'],
        wantsItems: ['Legendary Armor'],
      },
      {
        userId: 'user_456',
        username: 'FitnessKing',
        trustScore: 88,
        hasItems: ['Legendary Armor'],
        wantsItems: ['Gold Sword'],
      },
    ];
  }
}
