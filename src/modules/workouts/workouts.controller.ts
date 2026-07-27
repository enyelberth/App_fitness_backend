import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';
import { UpdateExerciseInWorkoutDto } from './dto/update-exercise-in-workout.dto';
import { ReorderExercisesDto } from './dto/reorder-exercises.dto';
import { CloneWorkoutDto } from './dto/clone-workout.dto';

@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findByUser(@CurrentUser() user: AuthenticatedUser) {
    return this.workoutsService.findByUser(user.id);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workoutsService.findById(id, user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(id, user.id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workoutsService.delete(id, user.id);
  }

  @Post(':workoutId/exercises')
  addExercise(
    @Param('workoutId') workoutId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddExerciseDto,
  ) {
    return this.workoutsService.addExercise(workoutId, user.id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':workoutId/exercises/:exerciseId')
  removeExercise(
    @Param('workoutId') workoutId: string,
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workoutsService.removeExercise(workoutId, user.id, exerciseId);
  }

  @Patch(':workoutId/exercises/:exerciseId')
  updateExerciseInWorkout(
    @Param('workoutId') workoutId: string,
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateExerciseInWorkoutDto,
  ) {
    return this.workoutsService.updateExerciseInWorkout(workoutId, user.id, exerciseId, dto);
  }

  @Patch(':id/reorder')
  reorderExercises(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReorderExercisesDto,
  ) {
    return this.workoutsService.reorderExercises(id, user.id, dto.updates);
  }

  @Post(':id/clone')
  cloneWorkout(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CloneWorkoutDto,
  ) {
    return this.workoutsService.cloneWorkout(id, user.id, dto.name);
  }
}
