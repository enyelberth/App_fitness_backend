import { Controller, Post, Get, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GuildService } from '../services/guild-service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('guilds')
@Controller('game/guilds')
export class GuildController {
  constructor(private guildService: GuildService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createGuild(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { name: string; description?: string },
  ) {
    return this.guildService.createGuild(user.id, body.name, body.description);
  }

  @Get()
  @Public()
  async listGuilds(@Query('limit') limit: string = '50') {
    return this.guildService.listGuilds(parseInt(limit, 10));
  }

  @Get(':guildId')
  @Public()
  async getGuild(@Param('guildId') guildId: string) {
    return this.guildService.getGuild(guildId);
  }

  @Post(':guildId/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async joinGuild(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guildId') guildId: string,
  ) {
    return this.guildService.joinGuild(user.id, guildId);
  }

  @Delete(':guildId/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async leaveGuild(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guildId') guildId: string,
  ) {
    return this.guildService.leaveGuild(user.id, guildId);
  }

  @Get(':guildId/members')
  @Public()
  async getGuildMembers(@Param('guildId') guildId: string) {
    return this.guildService.getGuildMembers(guildId);
  }

  @Get(':guildId/leaderboard')
  @Public()
  async getGuildLeaderboard(@Param('guildId') guildId: string) {
    return this.guildService.getGuildLeaderboard(guildId);
  }

  @Post(':guildId/treasury/deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async depositToTreasury(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guildId') guildId: string,
    @Body() body: { amount: number },
  ) {
    return this.guildService.depositToTreasury(user.id, guildId, body.amount);
  }

  @Post(':guildId/treasury/withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async withdrawFromTreasury(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guildId') guildId: string,
    @Body() body: { amount: number },
  ) {
    return this.guildService.withdrawFromTreasury(user.id, guildId, body.amount);
  }
}
