import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutTemplateService } from '../services/workout-template.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('fitness-templates')
@Controller('fitness/templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkoutTemplateController {
  constructor(private templateService: WorkoutTemplateService) {}

  @Post()
  async createTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { workoutId: string; name: string; description?: string },
  ) {
    return this.templateService.createTemplate(
      user.id,
      body.workoutId,
      body.name,
      body.description,
    );
  }

  @Get()
  async getMyTemplates(@CurrentUser() user: AuthenticatedUser) {
    return this.templateService.getMyTemplates(user.id);
  }

  @Get(':templateId')
  async getTemplate(@Param('templateId') templateId: string) {
    return this.templateService.getTemplate(templateId);
  }

  @Post(':templateId/use')
  async useTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('templateId') templateId: string,
  ) {
    return this.templateService.useTemplate(user.id, templateId);
  }

  @Delete(':templateId')
  async deleteTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('templateId') templateId: string,
  ) {
    return this.templateService.deleteTemplate(user.id, templateId);
  }
}
