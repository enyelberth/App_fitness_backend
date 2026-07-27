import { Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { MatchmakingService } from '../services/matchmaking.service';

@Controller('game/matchmaking')
export class MatchmakingController {
  constructor(private matchmakingService: MatchmakingService) {}

  @Post('queue/join')
  @UseGuards(JwtAuthGuard)
  async joinQueue(@CurrentUser('sub') userId: string) {
    return this.matchmakingService.joinMatchmakingQueue(userId);
  }

  @Delete('queue/leave')
  @UseGuards(JwtAuthGuard)
  async leaveQueue(@CurrentUser('sub') userId: string) {
    return this.matchmakingService.leaveMatchmakingQueue(userId);
  }

  @Get('queue/status')
  @UseGuards(JwtAuthGuard)
  async getQueueStatus(@CurrentUser('sub') userId: string) {
    return this.matchmakingService.getQueueStatus(userId);
  }

  @Get('stats')
  @Public()
  async getMatchmakingStats() {
    return this.matchmakingService.getMatchmakingStats();
  }

  @Get('leaderboard/ranked')
  @Public()
  async getRankedLeaderboard() {
    return this.matchmakingService.getRankedLeaderboard();
  }

  @Get('ranked/my-stats')
  @UseGuards(JwtAuthGuard)
  async getMyRankedStats(@CurrentUser('sub') userId: string) {
    return this.matchmakingService.getPlayerRankedStats(userId);
  }

  @Get('player/rating')
  @UseGuards(JwtAuthGuard)
  async getPlayerRating(@CurrentUser('sub') userId: string) {
    return this.matchmakingService.getPlayerRating(userId);
  }
}
