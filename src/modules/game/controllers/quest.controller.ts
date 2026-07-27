import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { QuestService } from '../services/quest.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Game - Quests')
@Controller('game/quests')
export class QuestController {
  constructor(private service: QuestService) {}

  /**
   * GET - Mis quests activos
   */
  @Get('active')
  @ApiOperation({ summary: 'Get my active quests' })
  async getActiveQuests(@CurrentUser() user: any) {
    return this.service.getActiveQuests(user.id);
  }

  /**
   * GET - Quests por tipo
   */
  @Get('type/:type')
  @ApiOperation({ summary: 'Get quests by type (DAILY, WEEKLY, SEASONAL)' })
  async getByType(@CurrentUser() user: any, @Param('type') type: string) {
    return this.service.getQuestsByType(user.id, type);
  }

  /**
   * GET - Quests completados
   */
  @Get('completed')
  @ApiOperation({ summary: 'Get my completed quests' })
  async getCompleted(@CurrentUser() user: any) {
    return this.service.getCompletedQuests(user.id);
  }

  /**
   * PATCH - Actualizar progreso
   */
  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update quest progress' })
  async updateProgress(
    @Param('id') questId: string,
    @CurrentUser() user: any,
    @Body() body: { progress: number },
  ) {
    return this.service.updateProgress(questId, user.id, body.progress);
  }

  /**
   * POST - Completar quest
   */
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete quest' })
  async completeQuest(@Param('id') questId: string, @CurrentUser() user: any) {
    return this.service.completeQuest(questId, user.id);
  }
}
