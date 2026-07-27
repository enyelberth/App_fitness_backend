import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WorkoutSharingService {
  constructor(private prisma: PrismaService) {}

  async shareWorkout(userId: string, workoutId: string, targetUserId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.userId !== userId) {
      throw new NotFoundException('Workout not found');
    }

    if (userId === targetUserId) {
      throw new BadRequestException('Cannot share with yourself');
    }

    return this.prisma.workout.create({
      data: {
        userId: targetUserId,
        name: \ (shared from \),
        description: workout.description,
        difficulty: workout.difficulty,
        durationMin: workout.durationMin,
        isTemplate: false,
      },
    });
  }

  async getSharedWithMe(userId: string) {
    return this.prisma.workout.findMany({
      where: {
        userId,
        name: { contains: 'shared from' },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserPublicWorkouts(userId: string) {
    return this.prisma.workout.findMany({
      where: {
        userId,
        isTemplate: true,
      },
    });
  }
}
