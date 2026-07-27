import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { WorkoutService } from '../services/workout.service';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutResponseDto } from '../dto/workout.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Fitness - Workouts')
@Controller('fitness/workouts')
export class WorkoutController {
  constructor(private service: WorkoutService) {}

  /**
   * POST - Crear nuevo workout
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new workout' })
  @ApiResponse({ status: 201, type: WorkoutResponseDto })
  async create(@CurrentUser() user: any, @Body() createDto: CreateWorkoutDto) {
    return this.service.create(user.id, createDto);
  }

  /**
   * GET - Listar todos los workouts del usuario
   */
  @Get()
  @ApiOperation({ summary: 'List user workouts' })
  @ApiResponse({ status: 200, type: [WorkoutResponseDto] })
  async list(
    @CurrentUser() user: any,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.service.listByUser(user.id, skip, take);
  }

  /**
   * GET - Obtener workout específico
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get workout by ID' })
  @ApiResponse({ status: 200, type: WorkoutResponseDto })
  async getById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.getById(id, user.id);
  }

  /**
   * PATCH - Actualizar workout
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update workout' })
  @ApiResponse({ status: 200, type: WorkoutResponseDto })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateWorkoutDto,
  ) {
    return this.service.update(id, user.id, updateDto);
  }

  /**
   * DELETE - Eliminar workout
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete workout' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.delete(id, user.id);
  }

  /**
   * POST - Completar workout
   * ¡IMPORTANTE! Esto emite WorkoutCompletedEvent
   */
  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete workout and award XP' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { success: true, xp: 150, message: 'Workout completed! +150 XP earned' },
    },
  })
  async complete(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { durationMinutes: number; volume: number },
  ) {
    return this.service.completeWorkout(id, user.id, body);
  }
}
