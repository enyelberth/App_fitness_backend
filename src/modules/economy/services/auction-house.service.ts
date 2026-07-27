import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Auction {
  id: string;
  sellerId: string;
  cosmeticId: string;
  cosmeticName: string;
  startingBid: number;
  currentBid: number;
  currentBidder?: string;
  status: 'ACTIVE' | 'SOLD' | 'UNSOLD' | 'CANCELLED';
  createdAt: Date;
  expiresAt: Date;
  bids: { bidderId: string; amount: number; timestamp: Date }[];
}

@Injectable()
export class AuctionHouseService {
  private auctions: Map<string, Auction> = new Map();
  private soldAuctions: Auction[] = [];

  constructor(private prisma: PrismaService) {}

  async createAuction(
    sellerId: string,
    cosmeticId: string,
    cosmeticName: string,
    startingBid: number,
    durationHours: number = 48,
  ): Promise<Auction> {
    if (startingBid <= 0) {
      throw new BadRequestException('Starting bid must be greater than 0');
    }

    const auctionId = 'auction_' + Math.random().toString(36).substr(2, 24);

    const auction: Auction = {
      id: auctionId,
      sellerId,
      cosmeticId,
      cosmeticName,
      startingBid,
      currentBid: startingBid,
      status: 'ACTIVE',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000),
      bids: [],
    };

    this.auctions.set(auctionId, auction);

    return auction;
  }

  async getActiveAuctions(limit: number = 50, offset: number = 0): Promise<Auction[]> {
    return Array.from(this.auctions.values())
      .filter((a) => a.status === 'ACTIVE' && a.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async placeBid(auctionId: string, bidderId: string, bidAmount: number): Promise<{ success: boolean; message: string }> {
    const auction = this.auctions.get(auctionId);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('Auction is no longer active');
    }

    if (auction.expiresAt <= new Date()) {
      await this.closeAuction(auctionId);
      throw new BadRequestException('Auction has expired');
    }

    if (bidAmount <= auction.currentBid) {
      throw new BadRequestException(`Bid must be higher than current bid (${auction.currentBid})`);
    }

    if (auction.currentBidder === bidderId) {
      throw new BadRequestException('Cannot outbid yourself');
    }

    if (auction.sellerId === bidderId) {
      throw new BadRequestException('Seller cannot bid on own auction');
    }

    auction.currentBid = bidAmount;
    auction.currentBidder = bidderId;
    auction.bids.push({
      bidderId,
      amount: bidAmount,
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Bid placed for ${bidAmount} coins`,
    };
  }

  async getAuctionDetails(auctionId: string): Promise<Auction | null> {
    const auction = this.auctions.get(auctionId);
    if (!auction) return null;

    if (auction.expiresAt <= new Date() && auction.status === 'ACTIVE') {
      await this.closeAuction(auctionId);
    }

    return auction;
  }

  async closeAuction(auctionId: string): Promise<Auction> {
    const auction = this.auctions.get(auctionId);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.currentBidder) {
      auction.status = 'SOLD';
    } else {
      auction.status = 'UNSOLD';
    }

    this.soldAuctions.push(auction);

    return auction;
  }

  async cancelAuction(auctionId: string, sellerId: string): Promise<{ success: boolean }> {
    const auction = this.auctions.get(auctionId);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.sellerId !== sellerId) {
      throw new BadRequestException('Only seller can cancel');
    }

    if (auction.bids.length > 0) {
      throw new BadRequestException('Cannot cancel auction with bids');
    }

    auction.status = 'CANCELLED';

    return { success: true };
  }

  async getUserAuctions(userId: string): Promise<Auction[]> {
    return Array.from(this.auctions.values())
      .filter((a) => a.sellerId === userId && a.status === 'ACTIVE')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserBids(userId: string): Promise<Auction[]> {
    return Array.from(this.auctions.values())
      .filter((a) => a.currentBidder === userId && a.status === 'ACTIVE')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAuctionHistory(limit: number = 50): Promise<Auction[]> {
    return this.soldAuctions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getHighestValueAuctions(limit: number = 10): Promise<Auction[]> {
    return Array.from(this.auctions.values())
      .filter((a) => a.status === 'ACTIVE')
      .sort((a, b) => b.currentBid - a.currentBid)
      .slice(0, limit);
  }

  async getAuctionStats(): Promise<any> {
    const active = Array.from(this.auctions.values()).filter((a) => a.status === 'ACTIVE').length;
    const sold = this.soldAuctions.filter((a) => a.status === 'SOLD').length;
    const avgPrice = this.soldAuctions.length > 0
      ? this.soldAuctions.reduce((sum, a) => sum + a.currentBid, 0) / this.soldAuctions.length
      : 0;

    return {
      activeAuctions: active,
      totalSold: sold,
      averagePrice: Math.round(avgPrice),
      highestSale: Math.max(...this.soldAuctions.map((a) => a.currentBid), 0),
    };
  }
}
