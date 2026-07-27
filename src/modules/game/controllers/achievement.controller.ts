import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementService } from '../services/achievement.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  @Get('list')
  @Public()
  async getAvailableAchievements() {
    return this.achievementService.getAvailableAchievements();
  }

  @Get('my-achievements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyAchievements(@CurrentUser() user: AuthenticatedUser) {
    return this.achievementService.getUserAchievements(user.id);
  }
}
