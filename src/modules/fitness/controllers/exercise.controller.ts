import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ExerciseService } from '../services/exercise.service';
import { CreateExerciseDto, ExerciseResponseDto } from '../dto/exercise.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Fitness - Exercises')
@Controller('fitness/exercises')
export class ExerciseController {
  constructor(private service: ExerciseService) {}

  /**
   * GET - Listar ejercicios
   */
  @Get()
  @ApiOperation({ summary: 'List exercises' })
  async list(@Query('skip') skip = 0, @Query('take') take = 20) {
    return this.service.getAll(skip, take);
  }

  /**
   * GET - Buscar ejercicios
   */
  @Get('search')
  @ApiOperation({ summary: 'Search exercises' })
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return { data: [] };
    }
    return this.service.search(query);
  }

  /**
   * GET - Obtener ejercicio por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by ID' })
  async getById(@Param('id') id: string): Promise<ExerciseResponseDto> {
    return this.service.getById(id);
  }

  /**
   * GET - Ejercicios por grupo muscular
   */
  @Get('muscle/:muscleGroupId')
  @ApiOperation({ summary: 'Get exercises by muscle group' })
  async getByMuscleGroup(@Param('muscleGroupId') muscleGroupId: string) {
    return this.service.getByMuscleGroup(muscleGroupId);
  }

  /**
   * POST - Crear ejercicio (Admin)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create exercise (admin)' })
  async create(@Body() createDto: CreateExerciseDto) {
    return this.service.create(createDto);
  }
}
