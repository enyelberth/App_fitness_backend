import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutSharingService } from '../services/workout-sharing.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('fitness-sharing')
@Controller('fitness/workouts')
export class WorkoutSharingController {
  constructor(private sharingService: WorkoutSharingService) {}

  @Post(':workoutId/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async shareWorkout(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workoutId') workoutId: string,
    @Body() body: { targetUserId: string },
  ) {
    return this.sharingService.shareWorkout(user.id, workoutId, body.targetUserId);
  }

  @Get('shared-with-me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getSharedWithMe(@CurrentUser() user: AuthenticatedUser) {
    return this.sharingService.getSharedWithMe(user.id);
  }

  @Get('public/:userId')
  @Public()
  async getUserPublicWorkouts(@Param('userId') userId: string) {
    return this.sharingService.getUserPublicWorkouts(userId);
  }
}
