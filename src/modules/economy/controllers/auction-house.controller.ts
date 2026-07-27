import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuctionHouseService } from '../services/auction-house.service';

@Controller('economy/auctions')
export class AuctionHouseController {
  constructor(private auctionHouseService: AuctionHouseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAuction(
    @CurrentUser('sub') userId: string,
    @Body() body: { cosmeticId: string; cosmeticName: string; startingBid: number; durationHours?: number },
  ) {
    return this.auctionHouseService.createAuction(userId, body.cosmeticId, body.cosmeticName, body.startingBid, body.durationHours);
  }

  @Get()
  @Public()
  async getActiveAuctions(@Query('page') page: string = '0', @Query('limit') limit: string = '50') {
    const offset = parseInt(page) * parseInt(limit);
    return this.auctionHouseService.getActiveAuctions(parseInt(limit), offset);
  }

  @Get('highest')
  @Public()
  async getHighestValueAuctions(@Query('limit') limit: string = '10') {
    return this.auctionHouseService.getHighestValueAuctions(parseInt(limit));
  }

  @Get('history')
  @Public()
  async getAuctionHistory(@Query('limit') limit: string = '50') {
    return this.auctionHouseService.getAuctionHistory(parseInt(limit));
  }

  @Get('stats')
  @Public()
  async getAuctionStats() {
    return this.auctionHouseService.getAuctionStats();
  }

  @Get(':auctionId')
  @Public()
  async getAuctionDetails(@Param('auctionId') auctionId: string) {
    return this.auctionHouseService.getAuctionDetails(auctionId);
  }

  @Post(':auctionId/bid')
  @UseGuards(JwtAuthGuard)
  async placeBid(
    @Param('auctionId') auctionId: string,
    @CurrentUser('sub') userId: string,
    @Body() body: { bidAmount: number },
  ) {
    return this.auctionHouseService.placeBid(auctionId, userId, body.bidAmount);
  }

  @Post(':auctionId/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelAuction(
    @Param('auctionId') auctionId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.auctionHouseService.cancelAuction(auctionId, userId);
  }

  @Get('user/auctions')
  @UseGuards(JwtAuthGuard)
  async getUserAuctions(@CurrentUser('sub') userId: string) {
    return this.auctionHouseService.getUserAuctions(userId);
  }

  @Get('user/bids')
  @UseGuards(JwtAuthGuard)
  async getUserBids(@CurrentUser('sub') userId: string) {
    return this.auctionHouseService.getUserBids(userId);
  }
}
