import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FavoriteService } from '../services/favorite.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Fitness - Favorites')
@Controller('fitness/favorites')
export class FavoriteController {
  constructor(private service: FavoriteService) {}

  /**
   * POST - Agregar ejercicio a favoritos
   */
  @Post('exercises/:exerciseId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add exercise to favorites' })
  async addExerciseFavorite(
    @CurrentUser() user: any,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.service.addFavorite(user.id, 'EXERCISE', exerciseId);
  }

  /**
   * DELETE - Remover ejercicio de favoritos
   */
  @Delete('exercises/:exerciseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove exercise from favorites' })
  async removeExerciseFavorite(
    @CurrentUser() user: any,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.service.removeFavorite(user.id, 'EXERCISE', exerciseId);
  }

  /**
   * GET - Mis ejercicios favoritos
   */
  @Get('exercises')
  @ApiOperation({ summary: 'Get my favorite exercises' })
  async getFavoriteExercises(@CurrentUser() user: any) {
    return this.service.getFavorites(user.id, 'EXERCISE');
  }

  /**
   * POST - Agregar workout a favoritos
   */
  @Post('workouts/:workoutId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add workout to favorites' })
  async addWorkoutFavorite(
    @CurrentUser() user: any,
    @Param('workoutId') workoutId: string,
  ) {
    return this.service.addFavorite(user.id, 'WORKOUT', workoutId);
  }

  /**
   * DELETE - Remover workout de favoritos
   */
  @Delete('workouts/:workoutId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove workout from favorites' })
  async removeWorkoutFavorite(
    @CurrentUser() user: any,
    @Param('workoutId') workoutId: string,
  ) {
    return this.service.removeFavorite(user.id, 'WORKOUT', workoutId);
  }

  /**
   * GET - Mis workouts favoritos
   */
  @Get('workouts')
  @ApiOperation({ summary: 'Get my favorite workouts' })
  async getFavoriteWorkouts(@CurrentUser() user: any) {
    return this.service.getFavorites(user.id, 'WORKOUT');
  }
}
