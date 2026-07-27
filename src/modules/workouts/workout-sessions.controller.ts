import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { WorkoutSessionsService } from './workout-sessions.service';
import { AddSessionSetDto } from './dto/add-session-set.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { UpdateSessionSetDto } from './dto/update-session-set.dto';
import { LogDiscomfortDto } from './dto/session-discomfort.dto';

@ApiTags('workout-sessions')
@ApiBearerAuth()
@Controller('workouts/:workoutId/sessions')
export class WorkoutSessionsController {
  constructor(private readonly sessionsService: WorkoutSessionsService) {}

  @Post()
  startSession(
    @Param('workoutId') workoutId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.sessionsService.startSession(workoutId, user.id);
  }

  @Get()
  getSessions(
    @Param('workoutId') workoutId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.sessionsService.getWorkoutSessions(workoutId, user.id);
  }

  @Get(':sessionId')
  getSessionDetails(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.sessionsService.getSessionDetails(sessionId, user.id);
  }

  @Post(':sessionId/end')
  @HttpCode(HttpStatus.OK)
  endSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: EndSessionDto,
  ) {
    return this.sessionsService.endSession(sessionId, user.id, dto.notes);
  }

  @Post(':sessionId/sets')
  addSet(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddSessionSetDto,
  ) {
    return this.sessionsService.addSetToSession(
      sessionId,
      user.id,
      dto.exerciseId,
      dto.setsCompleted,
      dto.repsPerformed,
      dto.weightUsed,
      dto.rpe,
      dto.notes,
    );
  }

  @Patch(':sessionId/sets/:setId')
  updateSet(
    @Param('sessionId') sessionId: string,
    @Param('setId') setId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSessionSetDto,
  ) {
    return this.sessionsService.updateSessionSet(sessionId, user.id, setId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':sessionId/sets/:setId')
  deleteSet(
    @Param('sessionId') sessionId: string,
    @Param('setId') setId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.sessionsService.deleteSessionSet(sessionId, user.id, setId);
  }

  @Post(':sessionId/discomfort')
  @HttpCode(HttpStatus.CREATED)
  logDiscomfort(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogDiscomfortDto,
  ) {
    return this.sessionsService.logDiscomfort(
      sessionId,
      user.id,
      dto.bodyPart,
      dto.type,
      dto.severity,
      dto.notes,
    );
  }

  @Get(':sessionId/discomfort')
  getDiscomforts(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.sessionsService.getSessionDiscomforts(sessionId, user.id);
  }

  @Patch(':sessionId/status/:status')
  updateStatus(
    @Param('sessionId') sessionId: string,
    @Param('status') status: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.sessionsService.updateSessionStatus(sessionId, user.id, status);
  }
}
