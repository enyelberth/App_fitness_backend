import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { MarketplaceService } from '../services/marketplace.service';

@Controller('economy/marketplace')
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) {}

  @Post('listings')
  @UseGuards(JwtAuthGuard)
  async createListing(
    @CurrentUser('sub') userId: string,
    @Body() body: { cosmeticId: string; cosmeticName: string; price: number; currency?: string; condition?: string },
  ) {
    return this.marketplaceService.createListing(userId, body.cosmeticId, body.cosmeticName, body.price, body.currency as any);
  }

  @Get('listings')
  @Public()
  async getActiveListings(@Query('page') page: string = '0', @Query('limit') limit: string = '50') {
    const offset = parseInt(page) * parseInt(limit);
    return this.marketplaceService.getActiveListings(parseInt(limit), offset);
  }

  @Get('listings/search')
  @Public()
  async searchListings(@Query('q') query: string, @Query('limit') limit: string = '50') {
    return this.marketplaceService.searchListings(query, parseInt(limit));
  }

  @Get('listings/:listingId')
  @Public()
  async getListingDetails(@Param('listingId') listingId: string) {
    return this.marketplaceService.getListingDetails(listingId);
  }

  @Post('listings/:listingId/purchase')
  @UseGuards(JwtAuthGuard)
  async purchaseListing(
    @CurrentUser('sub') userId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.marketplaceService.purchaseFromListing(userId, listingId);
  }

  @Delete('listings/:listingId')
  @UseGuards(JwtAuthGuard)
  async cancelListing(
    @CurrentUser('sub') userId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.marketplaceService.cancelListing(userId, listingId);
  }

  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  async getUserListings(@CurrentUser('sub') userId: string) {
    return this.marketplaceService.getUserListings(userId);
  }

  @Get('trending')
  @Public()
  async getTrendingListings() {
    return this.marketplaceService.getTrendingListings();
  }

  @Get('stats')
  @Public()
  async getMarketStats() {
    return this.marketplaceService.getMarketStats();
  }

  @Get('price-history/:cosmeticId')
  @Public()
  async getPriceHistory(@Param('cosmeticId') cosmeticId: string) {
    return this.marketplaceService.getPriceHistory(cosmeticId);
  }

  @Get('sales-history')
  @UseGuards(JwtAuthGuard)
  async getUserSalesHistory(@CurrentUser('sub') userId: string) {
    return this.marketplaceService.getUserSalesHistory(userId);
  }
}
