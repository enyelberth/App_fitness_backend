import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardService } from '../services/leaderboard.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('global')
  @Public()
  async getGlobalLeaderboard(@Query('limit') limit: string = '100') {
    return this.leaderboardService.getGlobalLeaderboard(parseInt(limit, 10));
  }

  @Get('my-rank')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyRank(@CurrentUser() user: AuthenticatedUser) {
    return this.leaderboardService.getUserRank(user.id);
  }

  @Get('character-stats/:characterId')
  @Public()
  async getCharacterStats(@Param('characterId') characterId: string) {
    return this.leaderboardService.getCharacterStats(characterId);
  }
}
