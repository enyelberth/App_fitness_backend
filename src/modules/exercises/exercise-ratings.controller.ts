import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Roles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { Role } from '@prisma/client';
import { ExerciseRatingsService } from './exercise-ratings.service';
import { CreateExerciseRatingDto } from './dto/create-exercise-rating.dto';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseRatingsController {
  constructor(private readonly ratingsService: ExerciseRatingsService) {}

  @Get(':id/rating-summary')
  getExerciseRatingSummary(@Param('id') exerciseId: string) {
    return this.ratingsService.getExerciseRatingSummary(exerciseId);
  }

  @Get(':id/ratings')
  getExerciseRatings(@Param('id') exerciseId: string) {
    return this.ratingsService.getExerciseRatings(exerciseId);
  }

  @ApiBearerAuth()
  @Post(':id/rating')
  @HttpCode(HttpStatus.CREATED)
  rateExercise(
    @Param('id') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateExerciseRatingDto,
  ) {
    return this.ratingsService.rateExercise(user.id, exerciseId, dto.rating, dto.review);
  }

  @ApiBearerAuth()
  @Get(':id/my-rating')
  getMyRating(
    @Param('id') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ratingsService.getUserRating(user.id, exerciseId);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/rating')
  deleteRating(
    @Param('id') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ratingsService.deleteRating(user.id, exerciseId);
  }
}
