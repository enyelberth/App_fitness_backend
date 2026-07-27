import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { SeasonalEventsService } from '../services/seasonal-events.service';

@Controller('game/events')
export class SeasonalEventsController {
  constructor(private eventsService: SeasonalEventsService) {}

  @Get('current')
  @Public()
  async getCurrentEvent() {
    return this.eventsService.getCurrentEvent();
  }

  @Get('list')
  @Public()
  async listAllEvents() {
    return this.eventsService.listAllEvents();
  }

  @Get('upcoming')
  @Public()
  async getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }

  @Get(':eventId/leaderboard')
  @Public()
  async getEventLeaderboard(@Param('eventId') eventId: string) {
    return this.eventsService.getEventLeaderboard(eventId);
  }

  @Get(':eventId/progress')
  @UseGuards(JwtAuthGuard)
  async getEventProgress(
    @Param('eventId') eventId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.eventsService.getEventProgress(eventId, userId);
  }

  @Post(':eventId/participate')
  @UseGuards(JwtAuthGuard)
  async participateInEvent(
    @Param('eventId') eventId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.eventsService.participateInEvent(eventId, userId);
  }

  @Post(':eventId/claim-reward')
  @UseGuards(JwtAuthGuard)
  async claimEventReward(
    @Param('eventId') eventId: string,
    @CurrentUser('sub') userId: string,
    @Body() body: { reward: string },
  ) {
    return this.eventsService.claimEventReward(eventId, userId, body.reward);
  }
}
