import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { WorkoutSessionsService } from './workout-sessions.service';
import { WorkoutSessionsController } from './workout-sessions.controller';
import { WorkoutTemplatesService } from './workout-templates.service';
import { WorkoutTemplatesController } from './workout-templates.controller';

@Module({
  controllers: [WorkoutsController, WorkoutSessionsController, WorkoutTemplatesController],
  providers: [WorkoutsService, WorkoutSessionsService, WorkoutTemplatesService],
  exports: [WorkoutsService, WorkoutSessionsService, WorkoutTemplatesService],
})
export class WorkoutsModule {}
