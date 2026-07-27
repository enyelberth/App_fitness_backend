import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { WorkoutSessionService } from '../services/workout-session.service';
import { CreateSessionDto, AddSetDto, CompleteSessionDto } from '../dto/workout-session.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Fitness - Workout Sessions')
@Controller('fitness/sessions')
export class WorkoutSessionController {
  constructor(private service: WorkoutSessionService) {}

  /**
   * POST - Iniciar nueva sesión
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start new workout session' })
  async startSession(
    @CurrentUser() user: any,
    @Body() createDto: CreateSessionDto,
  ) {
    return this.service.startSession(user.id, createDto);
  }

  /**
   * GET - Obtener sesión activa
   */
  @Get('current')
  @ApiOperation({ summary: 'Get current active session' })
  async getCurrentSession(@CurrentUser() user: any) {
    return this.service.getActiveSession(user.id);
  }

  /**
   * GET - Obtener sesión por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  async getSessionById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.getSessionById(id, user.id);
  }

  /**
   * GET - Historial de sesiones
   */
  @Get()
  @ApiOperation({ summary: 'Get session history' })
  async getHistory(@CurrentUser() user: any, @Query('skip') skip = 0, @Query('take') take = 10) {
    return this.service.getSessionHistory(user.id, skip, take);
  }

  /**
   * POST - Agregar set a la sesión
   */
  @Post(':id/sets')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add set to session' })
  async addSet(
    @Param('id') sessionId: string,
    @CurrentUser() user: any,
    @Body() addSetDto: AddSetDto,
  ) {
    return this.service.addSet(sessionId, user.id, addSetDto);
  }

  /**
   * POST - Completar sesión
   */
  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete workout session' })
  async completeSession(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() completeDto: CompleteSessionDto,
  ) {
    return this.service.completeSession(id, user.id, completeDto);
  }

  /**
   * GET - Obtener stats del usuario
   */
  @Get('stats/me')
  @ApiOperation({ summary: 'Get my workout stats' })
  async getStats(@CurrentUser() user: any) {
    return this.service.getUserStats(user.id);
  }
}
