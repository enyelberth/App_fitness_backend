import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ExerciseStatService } from '../services/exercise-stat.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Fitness - Stats & Progress')
@Controller('fitness/stats')
export class ExerciseStatController {
  constructor(private service: ExerciseStatService) {}

  /**
   * GET - Mis stats de progreso general
   */
  @Get('progress')
  @ApiOperation({ summary: 'Get my progress stats' })
  async getProgressStats(@CurrentUser() user: any) {
    return this.service.getProgressStats(user.id);
  }

  /**
   * GET - Stats de un ejercicio específico
   */
  @Get('exercises/:exerciseId')
  @ApiOperation({ summary: 'Get stats for an exercise' })
  async getExerciseStat(
    @CurrentUser() user: any,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.service.getExerciseStat(user.id, exerciseId);
  }

  /**
   * GET - Top ejercicios que más hago
   */
  @Get('top-exercises')
  @ApiOperation({ summary: 'Get top exercises' })
  async getTopExercises(
    @CurrentUser() user: any,
  ) {
    return this.service.getTopExercises(user.id, 10);
  }

  /**
   * GET - Personal Records (máximos pesos)
   */
  @Get('personal-records')
  @ApiOperation({ summary: 'Get personal records' })
  async getPersonalRecords(@CurrentUser() user: any) {
    return this.service.getPersonalRecords(user.id);
  }
}
