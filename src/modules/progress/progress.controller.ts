import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { ProgressService } from './progress.service';
import { LogProgressDto } from './dto/log-progress.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  logEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogProgressDto,
  ) {
    return this.progressService.logEntry(user.id, dto);
  }

  @Get()
  findByUser(
    @CurrentUser() user: AuthenticatedUser,
    @Query() pagination: PaginationDto,
  ) {
    return this.progressService.findByUser(
      user.id,
      pagination.skip,
      pagination.take,
    );
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.progressService.getStats(user.id);
  }

  @Get('exercise/:exerciseId')
  findByExercise(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.progressService.findByExercise(user.id, exerciseId);
  }
}
