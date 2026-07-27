import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  cosmeticId: string;
  cosmeticName: string;
  price: number;
  currency: 'COINS' | 'GEMS';
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD';
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED';
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class MarketplaceService {
  private listings: Map<string, MarketplaceListing> = new Map();
  private salesHistory: MarketplaceListing[] = [];

  constructor(private prisma: PrismaService) {}

  async createListing(
    userId: string,
    cosmeticId: string,
    cosmeticName: string,
    price: number,
    currency: 'COINS' | 'GEMS' = 'COINS',
    condition: 'NEW' | 'LIKE_NEW' | 'GOOD' = 'LIKE_NEW',
  ): Promise<MarketplaceListing> {
    const listingId = 'list_' + Math.random().toString(36).substr(2, 24);
    const listing: MarketplaceListing = {
      id: listingId,
      sellerId: userId,
      cosmeticId,
      cosmeticName,
      price,
      currency,
      condition,
      status: 'ACTIVE',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    this.listings.set(listingId, listing);
    return listing;
  }

  async getActiveListings(limit: number = 50, offset: number = 0): Promise<MarketplaceListing[]> {
    return Array.from(this.listings.values())
      .filter((l) => l.status === 'ACTIVE' && l.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async searchListings(query: string, limit: number = 50): Promise<MarketplaceListing[]> {
    return Array.from(this.listings.values())
      .filter(
        (l) =>
          l.status === 'ACTIVE' &&
          l.expiresAt > new Date() &&
          l.cosmeticName.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => a.price - b.price)
      .slice(0, limit);
  }

  async getListingDetails(listingId: string): Promise<MarketplaceListing | null> {
    const listing = this.listings.get(listingId);
    if (!listing) return null;
    if (listing.status !== 'ACTIVE') return null;
    if (listing.expiresAt <= new Date()) return null;
    return listing;
  }

  async purchaseFromListing(buyerId: string, listingId: string): Promise<{ success: boolean; message: string }> {
    const listing = this.listings.get(listingId);
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.status !== 'ACTIVE') throw new BadRequestException('Listing is no longer active');
    if (listing.sellerId === buyerId) throw new BadRequestException('Cannot purchase your own listing');
    
    listing.status = 'SOLD';
    this.salesHistory.push(listing);
    return { success: true, message: `Purchased ${listing.cosmeticName}` };
  }

  async cancelListing(userId: string, listingId: string): Promise<{ success: boolean }> {
    const listing = this.listings.get(listingId);
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== userId) throw new BadRequestException('Cannot cancel others listings');
    listing.status = 'CANCELLED';
    return { success: true };
  }

  async getUserListings(userId: string): Promise<MarketplaceListing[]> {
    return Array.from(this.listings.values())
      .filter((l) => l.sellerId === userId && l.status === 'ACTIVE')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPriceHistory(cosmeticId: string): Promise<any[]> {
    return [{ date: new Date(), price: 50000, currency: 'COINS' }];
  }

  async getTrendingListings(limit: number = 10): Promise<any[]> {
    return Array.from(this.listings.values())
      .filter((l) => l.status === 'ACTIVE')
      .slice(0, limit);
  }

  async getMarketStats(): Promise<any> {
    return {
      totalListings: this.listings.size,
      totalSold: this.salesHistory.length,
      avgPrice: { coins: 50000, gems: 500 },
    };
  }

  async getUserSalesHistory(userId: string): Promise<MarketplaceListing[]> {
    return this.salesHistory.filter((l) => l.sellerId === userId);
  }
}
