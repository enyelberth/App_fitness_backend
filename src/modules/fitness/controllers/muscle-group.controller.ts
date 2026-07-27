import { Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MuscleGroupService } from '../services/muscle-group.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Fitness - Muscle Groups')
@Controller('fitness/muscle-groups')
export class MuscleGroupController {
  constructor(private service: MuscleGroupService) {}

  /**
   * GET - Listar todos los grupos musculares
   */
  @Get()
  @ApiOperation({ summary: 'List all muscle groups' })
  async getAll() {
    return this.service.getAll();
  }

  /**
   * GET - Obtener grupo muscular por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get muscle group by ID' })
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  /**
   * GET - Obtener grupo muscular con sus ejercicios
   */
  @Get(':id/exercises')
  @ApiOperation({ summary: 'Get muscle group with exercises' })
  async getWithExercises(@Param('id') id: string) {
    return this.service.getWithExercises(id);
  }

  /**
   * POST - Seed muscle groups (solo primera vez)
   */
  @Post('seed')
  @ApiOperation({ summary: 'Seed muscle groups (admin)' })
  async seed() {
    return this.service.seed();
  }
}
