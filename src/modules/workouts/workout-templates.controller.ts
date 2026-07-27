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
  Roles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { Role } from '@prisma/client';
import { WorkoutTemplatesService } from './workout-templates.service';
import { CreateWorkoutTemplateDto } from './dto/create-workout-template.dto';
import { CloneTemplateDto } from './dto/clone-template.dto';

@ApiTags('workout-templates')
@Controller('workout-templates')
export class WorkoutTemplatesController {
  constructor(private readonly templatesService: WorkoutTemplatesService) {}

  @Get()
  getPublicTemplates(@Query('limit') limit?: string) {
    return this.templatesService.getPublicTemplates(limit ? parseInt(limit) : 50);
  }

  @Get('search')
  searchTemplates(
    @Query('q') search: string,
    @Query('difficulty') difficulty?: string,
    @Query('limit') limit?: string,
  ) {
    return this.templatesService.searchTemplates(search, difficulty, limit ? parseInt(limit) : 20);
  }

  @Get(':id')
  getTemplateById(@Param('id') templateId: string) {
    return this.templatesService.getTemplateById(templateId);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Get('my-templates')
  getMyTemplates(@CurrentUser() user: AuthenticatedUser) {
    return this.templatesService.getMyTemplates(user.id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutTemplateDto,
  ) {
    return this.templatesService.createTemplate(
      user.id,
      dto.name,
      dto.description,
      dto.difficulty,
      dto.durationMin,
      dto.exercises,
    );
  }

  @ApiBearerAuth()
  @Post(':id/clone')
  cloneTemplate(
    @Param('id') templateId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CloneTemplateDto,
  ) {
    return this.templatesService.cloneTemplateToWorkout(user.id, templateId, dto.workoutName);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Patch(':id')
  updateTemplate(
    @Param('id') templateId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: Partial<CreateWorkoutTemplateDto>,
  ) {
    return this.templatesService.updateTemplate(
      templateId,
      user.id,
      dto.name,
      dto.description,
      dto.difficulty,
      dto.durationMin,
    );
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTemplate(
    @Param('id') templateId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.templatesService.deleteTemplate(templateId, user.id);
  }
}
