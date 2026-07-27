import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TradingService } from '../services/trading.service';

@Controller('economy/trading')
@UseGuards(JwtAuthGuard)
export class TradingController {
  constructor(private tradingService: TradingService) {}

  @Post('offers')
  async createTradeOffer(
    @CurrentUser('sub') userId: string,
    @Body() body: {
      respondentId: string;
      initiatorItems: { cosmeticId: string; cosmeticName: string }[];
      respondentItems: { cosmeticId: string; cosmeticName: string }[];
    },
  ) {
    return this.tradingService.createTradeOffer(
      userId,
      body.respondentId,
      body.initiatorItems,
      body.respondentItems,
    );
  }

  @Get('offers/:tradeId')
  async getTradeDetails(@Param('tradeId') tradeId: string) {
    return this.tradingService.getTradeDetails(tradeId);
  }

  @Post('offers/:tradeId/accept')
  async acceptTrade(
    @Param('tradeId') tradeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.tradingService.acceptTrade(tradeId, userId);
  }

  @Post('offers/:tradeId/reject')
  async rejectTrade(
    @Param('tradeId') tradeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.tradingService.rejectTrade(tradeId, userId);
  }

  @Post('offers/:tradeId/cancel')
  async cancelTrade(
    @Param('tradeId') tradeId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.tradingService.cancelTrade(tradeId, userId);
  }

  @Get('pending')
  async getPendingTrades(@CurrentUser('sub') userId: string) {
    return this.tradingService.getPendingTrades(userId);
  }

  @Get('history')
  async getTradeHistory(@CurrentUser('sub') userId: string) {
    return this.tradingService.getTradeHistory(userId);
  }

  @Get('stats')
  async getUserTradeStats(@CurrentUser('sub') userId: string) {
    return this.tradingService.getUserTradeStats(userId);
  }

  @Post('suggest-partners')
  async suggestTradePartners(
    @CurrentUser('sub') userId: string,
    @Body() body: { itemsOffering: string[] },
  ) {
    return this.tradingService.suggestTradePartners(userId, body.itemsOffering);
  }
}
