import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { DailyStreakService } from '../services/daily-streak.service';

@Controller('game/streak')
@UseGuards(JwtAuthGuard)
export class DailyStreakController {
  constructor(private streakService: DailyStreakService) {}

  @Get('my-streak')
  async getMyStreak(@CurrentUser('sub') userId: string) {
    return this.streakService.getMyStreak(userId);
  }

  @Post('checkin')
  async checkinWorkout(@CurrentUser('sub') userId: string) {
    return this.streakService.checkinWorkout(userId);
  }

  @Get('rewards')
  async getStreakRewards(@CurrentUser('sub') userId: string) {
    return this.streakService.getStreakRewards(userId);
  }

  @Get('leaderboard')
  async getStreakLeaderboard() {
    return this.streakService.getLeaderboardByStreak();
  }
}
