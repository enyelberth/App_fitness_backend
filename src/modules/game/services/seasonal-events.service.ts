import { Injectable } from '@nestjs/common';

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  type: 'SUMMER' | 'NEW_YEAR' | 'HOLIDAY' | 'SPORTS';
  startDate: Date;
  endDate: Date;
  rewards: string[];
  leaderboard?: string;
}

@Injectable()
export class SeasonalEventsService {
  private events: SeasonalEvent[] = [
    {
      id: 'event_summer_2025',
      name: 'Summer Challenge',
      description: 'Cardio focused event. Complete cardio workouts and climb the leaderboard!',
      type: 'SUMMER',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-08-31'),
      rewards: [
        'Beach Outfit (Top 10)',
        'Shorts Cosmetic (Top 50)',
        'Sunglasses Accessory (Top 100)',
        '500 Coins (Top 500)',
      ],
    },
    {
      id: 'event_newyear_2026',
      name: 'New Year Resolution',
      description: 'All workout types count. January challenge!',
      type: 'NEW_YEAR',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      rewards: [
        'New Year Badge',
        'Premium Gym Shirt',
        'Motivation Title',
        '1000 Coins (Winner)',
      ],
    },
    {
      id: 'event_holiday_2025',
      name: 'Holiday Event',
      description: 'Special holiday cosmetics and exclusive rewards!',
      type: 'HOLIDAY',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31'),
      rewards: [
        'Christmas Outfit',
        'Santa Hat Accessory',
        'Holiday Spirit Badge',
        'Gold Sword (Top 5)',
      ],
    },
  ];

  async getCurrentEvent(): Promise<SeasonalEvent | null> {
    const now = new Date();
    return this.events.find(
      (event) => event.startDate <= now && now <= event.endDate,
    ) || null;
  }

  async listAllEvents(): Promise<SeasonalEvent[]> {
    return this.events;
  }

  async getEventLeaderboard(eventId: string, limit: number = 100) {
    const event = this.events.find((e) => e.id === eventId);

    if (!event) {
      return { message: 'Event not found' };
    }

    // Mock leaderboard
    return {
      event: event.name,
      leaderboard: [
        {
          rank: 1,
          username: 'GymMaster',
          score: 15000,
          reward: event.rewards[0],
        },
        {
          rank: 2,
          username: 'FitnessQueen',
          score: 14200,
          reward: event.rewards[0],
        },
        {
          rank: 3,
          username: 'CardioKing',
          score: 13500,
          reward: event.rewards[0],
        },
        {
          rank: 4,
          username: 'StrengthLord',
          score: 12800,
          reward: event.rewards[1],
        },
        {
          rank: 5,
          username: 'EnduranceRunner',
          score: 12200,
          reward: event.rewards[1],
        },
      ],
    };
  }

  async getEventProgress(eventId: string, userId: string) {
    const event = this.events.find((e) => e.id === eventId);

    if (!event) {
      return { message: 'Event not found' };
    }

    // Mock user progress
    return {
      userId,
      event: event.name,
      progress: {
        currentScore: 5234,
        rank: 42,
        pointsToNextRank: 766,
        milestones: [
          { milestone: 1000, unlocked: true, reward: '100 Coins' },
          { milestone: 5000, unlocked: true, reward: event.rewards[1] },
          { milestone: 10000, unlocked: false, reward: event.rewards[0] },
        ],
      },
      estimatedPlacement: 'Top 50',
    };
  }

  async participateInEvent(eventId: string, userId: string) {
    const event = this.events.find((e) => e.id === eventId);

    if (!event) {
      return { message: 'Event not found' };
    }

    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      return { message: 'Event is not active' };
    }

    return {
      message: 'Successfully joined event',
      event: event.name,
      userId,
      startDate: event.startDate,
      endDate: event.endDate,
      rewards: event.rewards,
    };
  }

  async getUpcomingEvents(): Promise<SeasonalEvent[]> {
    const now = new Date();
    return this.events
      .filter((event) => event.startDate > now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async claimEventReward(eventId: string, userId: string, reward: string) {
    return {
      message: 'Reward claimed',
      userId,
      reward,
      addedToInventory: true,
    };
  }
}
