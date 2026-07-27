import { Module } from '@nestjs/common';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { MuscleGroupsController } from './muscle-groups.controller';
import { MuscleGroupsService } from './muscle-groups.service';
import { ExerciseRatingsController } from './exercise-ratings.controller';
import { ExerciseRatingsService } from './exercise-ratings.service';
import { ExerciseVariationsController } from './exercise-variations.controller';
import { ExerciseVariationsService } from './exercise-variations.service';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ExerciseStatsService } from './exercise-stats.service';
import { ExerciseStatsController } from './exercise-stats.controller';

@Module({
  controllers: [
    ExercisesController,
    MuscleGroupsController,
    ExerciseRatingsController,
    ExerciseVariationsController,
    FavoritesController,
    ExerciseStatsController,
  ],
  providers: [
    ExercisesService,
    MuscleGroupsService,
    ExerciseRatingsService,
    ExerciseVariationsService,
    FavoritesService,
    ExerciseStatsService,
  ],
  exports: [
    ExercisesService,
    MuscleGroupsService,
    ExerciseRatingsService,
    ExerciseVariationsService,
    FavoritesService,
    ExerciseStatsService,
  ],
})
export class ExercisesModule {}
