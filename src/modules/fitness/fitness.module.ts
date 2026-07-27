import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';

// Controllers
import { WorkoutController } from './controllers/workout.controller';

// Services
import { WorkoutService } from './services/workout.service';

// Repositories
import { WorkoutRepository } from './repositories/workout.repository';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutRepository],
  exports: [WorkoutService],
})
export class FitnessModule {}
