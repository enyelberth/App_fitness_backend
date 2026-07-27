import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('favorites/exercises')
  getFavoriteExercises(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.getFavoriteExercises(user.id);
  }

  @Get('favorites/workouts')
  getFavoriteWorkouts(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.getFavoriteWorkouts(user.id);
  }

  @Post('exercises/:id/favorite')
  @HttpCode(HttpStatus.CREATED)
  addFavoriteExercise(
    @Param('id') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.favoritesService.addFavoriteExercise(user.id, exerciseId);
  }

  @Delete('exercises/:id/favorite')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFavoriteExercise(
    @Param('id') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.favoritesService.removeFavoriteExercise(user.id, exerciseId);
  }

  @Post('workouts/:id/favorite')
  @HttpCode(HttpStatus.CREATED)
  addFavoriteWorkout(
    @Param('id') workoutId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.favoritesService.addFavoriteWorkout(user.id, workoutId);
  }

  @Delete('workouts/:id/favorite')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFavoriteWorkout(
    @Param('id') workoutId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.favoritesService.removeFavoriteWorkout(user.id, workoutId);
  }
}
