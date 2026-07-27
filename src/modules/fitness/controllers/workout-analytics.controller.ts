import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutAnalyticsService } from '../services/workout-analytics.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('fitness-analytics')
@Controller('fitness/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkoutAnalyticsController {
  constructor(private analyticsService: WorkoutAnalyticsService) {}

  @Get('history')
  async getWorkoutHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit: string = '50',
  ) {
    return this.analyticsService.getWorkoutHistory(user.id, parseInt(limit, 10));
  }

  @Get('weekly')
  async getWeeklyStats(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getWeeklyStats(user.id);
  }

  @Get('monthly')
  async getMonthlyStats(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getMonthlyStats(user.id);
  }

  @Get('body-progress')
  async getBodyProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getBodyProgress(user.id);
  }

  @Get('muscle-groups')
  async getMuscleGroupStats(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getMuscleGroupStats(user.id);
  }
}
