import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PvPService } from '../services/pvp.service';

@Controller('game/battles')
@UseGuards(JwtAuthGuard)
export class PvPController {
  constructor(private pvpService: PvPService) {}

  @Post('challenge/:opponentId')
  async challengePlayer(
    @CurrentUser('sub') userId: string,
    @Param('opponentId') opponentId: string,
  ) {
    return this.pvpService.challengePlayer(userId, opponentId);
  }

  @Post(':battleId/accept')
  async acceptBattle(
    @Param('battleId') battleId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.pvpService.acceptBattle(battleId, userId);
  }

  @Post(':battleId/result')
  async reportResult(
    @Param('battleId') battleId: string,
    @Body() body: { winnerId: string; coinReward: number },
  ) {
    return this.pvpService.reportBattleResult(
      battleId,
      body.winnerId,
      body.coinReward,
    );
  }

  @Get('history')
  async getBattleHistory(@CurrentUser('sub') userId: string) {
    return this.pvpService.getBattleHistory(userId);
  }

  @Get('stats')
  async getBattleStats(@CurrentUser('sub') userId: string) {
    return this.pvpService.getBattleStats(userId);
  }

  @Get('pending')
  async getPendingBattles(@CurrentUser('sub') userId: string) {
    return this.pvpService.getPendingBattles(userId);
  }
}
