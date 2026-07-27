import { Injectable } from '@nestjs/common';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: 'SINGLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  prizePool: string[];
}

@Injectable()
export class TournamentService {
  private tournaments: Map<string, Tournament> = new Map([
    [
      'tournament_weekly_1',
      {
        id: 'tournament_weekly_1',
        name: 'Weekly Championship',
        description: 'Single elimination tournament. 8 players bracket.',
        format: 'SINGLE_ELIMINATION',
        status: 'ACTIVE',
        maxParticipants: 8,
        currentParticipants: 6,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        prizePool: [
          '1st: 500 Coins + Gold Sword',
          '2nd: 300 Coins + Silver Sword',
          '3rd: 150 Coins + Bronze Armor',
        ],
      },
    ],
    [
      'tournament_monthly_1',
      {
        id: 'tournament_monthly_1',
        name: 'Monthly Grand Tournament',
        description: 'Best of month tournament. 32 players max.',
        format: 'ROUND_ROBIN',
        status: 'PENDING',
        maxParticipants: 32,
        currentParticipants: 28,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
        prizePool: [
          '1st: 2000 Coins + Legendary Armor',
          '2nd: 1000 Coins + Epic Armor',
          '3rd-5th: 500 Coins each',
          '6th-10th: 200 Coins each',
        ],
      },
    ],
  ]);

  async listAllTournaments(status?: string): Promise<Tournament[]> {
    const tournaments = Array.from(this.tournaments.values());
    if (status) {
      return tournaments.filter((t) => t.status === status);
    }
    return tournaments;
  }

  async getTournamentDetails(tournamentId: string): Promise<Tournament | null> {
    return this.tournaments.get(tournamentId) || null;
  }

  async registerForTournament(tournamentId: string, userId: string) {
    const tournament = this.tournaments.get(tournamentId);

    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return { error: 'Tournament is full' };
    }

    if (tournament.status !== 'PENDING') {
      return { error: 'Tournament is not accepting registrations' };
    }

    tournament.currentParticipants++;

    return {
      message: 'Successfully registered for tournament',
      tournamentId,
      userId,
      tournamentName: tournament.name,
      spotsRemaining: tournament.maxParticipants - tournament.currentParticipants,
    };
  }

  async getTournamentBracket(tournamentId: string) {
    const tournament = this.tournaments.get(tournamentId);

    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Mock bracket
    if (tournament.format === 'SINGLE_ELIMINATION') {
      return {
        tournament: tournament.name,
        format: tournament.format,
        bracket: [
          {
            round: 1,
            matches: [
              { id: 1, player1: 'GymMaster', player2: 'FitnessKing', winner: null },
              { id: 2, player1: 'CardioQueen', player2: 'StrengthLord', winner: null },
              { id: 3, player1: 'Endurance', player2: 'Speed', winner: null },
              { id: 4, player1: 'Power', player2: 'Balance', winner: null },
            ],
          },
          {
            round: 2,
            matches: [
              { id: 5, player1: 'Winner 1', player2: 'Winner 2', winner: null },
              { id: 6, player1: 'Winner 3', player2: 'Winner 4', winner: null },
            ],
          },
          {
            round: 3,
            matches: [{ id: 7, player1: 'Winner 5', player2: 'Winner 6', winner: null }],
          },
        ],
      };
    }

    return { tournament: tournament.name, format: tournament.format };
  }

  async getTournamentLeaderboard(tournamentId: string) {
    const tournament = this.tournaments.get(tournamentId);

    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Mock leaderboard
    return {
      tournament: tournament.name,
      leaderboard: [
        { rank: 1, username: 'GymMaster', wins: 3, points: 90 },
        { rank: 2, username: 'FitnessKing', wins: 2, points: 60 },
        { rank: 3, username: 'CardioQueen', wins: 2, points: 60 },
        { rank: 4, username: 'StrengthLord', wins: 1, points: 30 },
        { rank: 5, username: 'Endurance', wins: 1, points: 30 },
      ],
    };
  }

  async getMyTournaments(userId: string) {
    // Mock user tournaments
    return {
      userId,
      registered: [
        {
          id: 'tournament_weekly_1',
          name: 'Weekly Championship',
          status: 'ACTIVE',
          myRank: 2,
          myWins: 2,
        },
      ],
      completed: [
        {
          id: 'tournament_prev_1',
          name: 'Last Week Championship',
          status: 'COMPLETED',
          finalRank: 1,
          reward: 'Gold Sword + 500 Coins',
        },
      ],
    };
  }

  async claimTournamentReward(tournamentId: string, userId: string) {
    const tournament = this.tournaments.get(tournamentId);

    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    return {
      message: 'Tournament reward claimed',
      userId,
      reward: tournament.prizePool[0] || 'Participation reward',
      addedToInventory: true,
    };
  }
}
