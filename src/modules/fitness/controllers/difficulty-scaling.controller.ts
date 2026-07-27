import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DifficultyScalingService } from '../services/difficulty-scaling.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('fitness-progression')
@Controller('fitness/progression')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DifficultyScalingController {
  constructor(private scalingService: DifficultyScalingService) {}

  @Get('exercise/:exerciseId/history')
  async getExerciseProgression(
    @CurrentUser() user: AuthenticatedUser,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.scalingService.getExerciseProgression(user.id, exerciseId);
  }

  @Get('exercise/:exerciseId/next-weight')
  async suggestNextWeight(
    @CurrentUser() user: AuthenticatedUser,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.scalingService.suggestNextWeight(user.id, exerciseId);
  }

  @Get('workout/:workoutId/difficulty-adjustment')
  async updateWorkoutDifficulty(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workoutId') workoutId: string,
  ) {
    return this.scalingService.updateWorkoutDifficulty(workoutId, user.id);
  }
}
