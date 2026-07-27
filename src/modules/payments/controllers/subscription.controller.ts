import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { SubscriptionService } from '../services/subscription.service';

@Controller('payments/subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get('battle-pass')
  @UseGuards(JwtAuthGuard)
  async getBattlePassInfo(@CurrentUser('sub') userId: string) {
    return this.subscriptionService.getBattlePassInfo(userId);
  }

  @Post('battle-pass/purchase')
  @UseGuards(JwtAuthGuard)
  async purchaseBattlePass(
    @CurrentUser('sub') userId: string,
    @Body() body: { season: number },
  ) {
    return this.subscriptionService.purchaseBattlePass(userId, body.season);
  }

  @Post('battle-pass/:season/xp')
  @UseGuards(JwtAuthGuard)
  async addBattlePassXP(
    @CurrentUser('sub') userId: string,
    @Param('season') season: string,
    @Body() body: { xp: number },
  ) {
    return this.subscriptionService.addBattlePassXP(userId, parseInt(season), body.xp);
  }

  @Get('battle-pass/:season/progress')
  @UseGuards(JwtAuthGuard)
  async getBattlePassProgress(
    @CurrentUser('sub') userId: string,
    @Param('season') season: string,
  ) {
    return this.subscriptionService.getBattlePassProgress(userId, parseInt(season));
  }

  @Post('battle-pass/:season/tier/:tier/claim')
  @UseGuards(JwtAuthGuard)
  async claimBattlePassReward(
    @CurrentUser('sub') userId: string,
    @Param('season') season: string,
    @Param('tier') tier: string,
  ) {
    return this.subscriptionService.claimBattlePassReward(userId, parseInt(season), parseInt(tier));
  }

  @Post('battle-pass/:season/upgrade/:tier')
  @UseGuards(JwtAuthGuard)
  async upgradeTier(
    @CurrentUser('sub') userId: string,
    @Param('season') season: string,
    @Param('tier') tier: string,
  ) {
    return this.subscriptionService.upgradeBattlePassTier(userId, parseInt(season), parseInt(tier));
  }

  @Get('battle-pass/seasons')
  @Public()
  async getBattlePassSeasons() {
    return this.subscriptionService.getBattlePassSeasons();
  }

  @Post('battle-pass/:season/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBattlePass(
    @CurrentUser('sub') userId: string,
    @Param('season') season: string,
  ) {
    return this.subscriptionService.cancelBattlePass(userId, parseInt(season));
  }
}
