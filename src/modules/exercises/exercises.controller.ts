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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { FilterExercisesDto } from './dto/filter-exercises.dto';
import { AddMuscleDto } from './dto/add-muscle.dto';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Public()
  @Get()
  findAll(@Query() filter: FilterExercisesDto) {
    return this.exercisesService.findAll(filter);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.exercisesService.findById(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Post()
  create(@Body() dto: CreateExerciseDto) {
    return this.exercisesService.create(dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exercisesService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.exercisesService.delete(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Post(':exerciseId/muscles/:muscleId')
  addMuscle(
    @Param('exerciseId') exerciseId: string,
    @Param('muscleId') muscleId: string,
    @Body() dto: AddMuscleDto,
  ) {
    return this.exercisesService.addMuscle(exerciseId, muscleId, dto.isPrimary);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':exerciseId/muscles/:muscleId')
  removeMuscle(
    @Param('exerciseId') exerciseId: string,
    @Param('muscleId') muscleId: string,
  ) {
    return this.exercisesService.removeMuscle(exerciseId, muscleId);
  }
}
