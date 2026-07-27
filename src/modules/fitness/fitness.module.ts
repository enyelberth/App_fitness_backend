import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';

// Controllers
import { WorkoutController } from './controllers/workout.controller';
import { ExerciseController } from './controllers/exercise.controller';
import { MuscleGroupController } from './controllers/muscle-group.controller';
import { WorkoutSessionController } from './controllers/workout-session.controller';
import { FavoriteController } from './controllers/favorite.controller';
import { ExerciseStatController } from './controllers/exercise-stat.controller';

// Services
import { WorkoutService } from './services/workout.service';
import { ExerciseService } from './services/exercise.service';
import { MuscleGroupService } from './services/muscle-group.service';
import { WorkoutSessionService } from './services/workout-session.service';
import { FavoriteService } from './services/favorite.service';
import { ExerciseStatService } from './services/exercise-stat.service';

// Repositories
import { WorkoutRepository } from './repositories/workout.repository';
import { ExerciseRepository } from './repositories/exercise.repository';
import { MuscleGroupRepository } from './repositories/muscle-group.repository';
import { WorkoutSessionRepository } from './repositories/workout-session.repository';
import { FavoriteRepository } from './repositories/favorite.repository';
import { ExerciseStatRepository } from './repositories/exercise-stat.repository';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [
    WorkoutController,
    ExerciseController,
    MuscleGroupController,
    WorkoutSessionController,
    FavoriteController,
    ExerciseStatController,
  ],
  providers: [
    WorkoutService,
    ExerciseService,
    MuscleGroupService,
    WorkoutSessionService,
    FavoriteService,
    ExerciseStatService,
    WorkoutRepository,
    ExerciseRepository,
    MuscleGroupRepository,
    WorkoutSessionRepository,
    FavoriteRepository,
    ExerciseStatRepository,
  ],
  exports: [
    WorkoutService,
    ExerciseService,
    MuscleGroupService,
    WorkoutSessionService,
    FavoriteService,
    ExerciseStatService,
  ],
})
export class FitnessModule {}
