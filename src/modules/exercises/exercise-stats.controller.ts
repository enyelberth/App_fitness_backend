import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { ExerciseStatsService } from './exercise-stats.service';

@ApiTags('exercise-stats')
@ApiBearerAuth()
@Controller('exercise-stats')
export class ExerciseStatsController {
  constructor(private readonly statsService: ExerciseStatsService) {}

  @Get('exercises/:exerciseId/user-stats')
  getUserExerciseStats(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.statsService.getUserExerciseStats(user.id, exerciseId);
  }

  @Get('muscles')
  getUserMuscleGroupStats(@CurrentUser() user: AuthenticatedUser) {
    return this.statsService.getUserMuscleGroupStats(user.id);
  }

  @Get('frequency')
  getUserExerciseFrequency(@CurrentUser() user: AuthenticatedUser) {
    return this.statsService.getUserExerciseFrequency(user.id);
  }

  @Get('progression-summary')
  getUserProgressionSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.statsService.getUserProgressionSummary(user.id);
  }
}
