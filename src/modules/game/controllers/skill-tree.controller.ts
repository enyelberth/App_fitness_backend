import { Controller, Post, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkillTreeService } from '../services/skill-tree.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('skill-tree')
@Controller('game/skills')
export class SkillTreeController {
  constructor(private skillTreeService: SkillTreeService) {}

  @Get('tree')
  @Public()
  async getSkillTree(@Query('class') characterClass: string = 'WARRIOR') {
    return this.skillTreeService.getSkillTree(characterClass);
  }

  @Post(':skillId/unlock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unlockSkill(
    @CurrentUser() user: AuthenticatedUser,
    @Param('skillId') skillId: string,
  ) {
    return this.skillTreeService.unlockSkill(user.id, skillId);
  }

  @Get('prestige/info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPrestigeInfo(@CurrentUser() user: AuthenticatedUser) {
    return this.skillTreeService.getPrestigeInfo(user.id);
  }

  @Post('prestige/reset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async prestigeReset(@CurrentUser() user: AuthenticatedUser) {
    return this.skillTreeService.prestigeReset(user.id);
  }
}
