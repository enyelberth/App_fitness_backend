import { Body, Controller, Get, HttpStatus, Param, Post, Roles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { MuscleGroupsService } from './muscle-groups.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';

@ApiTags('muscle-groups')
@Controller('muscle-groups')
export class MuscleGroupsController {
  constructor(private readonly muscleGroupsService: MuscleGroupsService) {}

  @Public()
  @Get()
  findAll() {
    return this.muscleGroupsService.findAll();
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.muscleGroupsService.findById(id);
  }

  @Public()
  @Get(':id/exercises')
  getExercises(@Param('id') id: string) {
    return this.muscleGroupsService.getExercises(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateMuscleGroupDto) {
    return this.muscleGroupsService.create(dto.name);
  }
}
