import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { TournamentService } from '../services/tournament.service';

@Controller('game/tournaments')
export class TournamentController {
  constructor(private tournamentService: TournamentService) {}

  @Get('list')
  @Public()
  async listTournaments(@Query('status') status?: string) {
    return this.tournamentService.listAllTournaments(status);
  }

  @Get(':tournamentId')
  @Public()
  async getTournamentDetails(@Param('tournamentId') tournamentId: string) {
    return this.tournamentService.getTournamentDetails(tournamentId);
  }

  @Post(':tournamentId/register')
  @UseGuards(JwtAuthGuard)
  async registerForTournament(
    @Param('tournamentId') tournamentId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.tournamentService.registerForTournament(tournamentId, userId);
  }

  @Get(':tournamentId/bracket')
  @Public()
  async getTournamentBracket(@Param('tournamentId') tournamentId: string) {
    return this.tournamentService.getTournamentBracket(tournamentId);
  }

  @Get(':tournamentId/leaderboard')
  @Public()
  async getTournamentLeaderboard(@Param('tournamentId') tournamentId: string) {
    return this.tournamentService.getTournamentLeaderboard(tournamentId);
  }

  @Get('my-tournaments')
  @UseGuards(JwtAuthGuard)
  async getMyTournaments(@CurrentUser('sub') userId: string) {
    return this.tournamentService.getMyTournaments(userId);
  }

  @Post(':tournamentId/claim-reward')
  @UseGuards(JwtAuthGuard)
  async claimTournamentReward(
    @Param('tournamentId') tournamentId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.tournamentService.claimTournamentReward(tournamentId, userId);
  }
}
