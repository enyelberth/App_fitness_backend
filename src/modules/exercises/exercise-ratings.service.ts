import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExerciseRatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async rateExercise(userId: string, exerciseId: string, rating: number, review?: string) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const existing = await this.prisma.exerciseRating.findUnique({
      where: { userId_exerciseId: { userId, exerciseId } },
    });

    if (existing) {
      return this.prisma.exerciseRating.update({
        where: { userId_exerciseId: { userId, exerciseId } },
        data: { rating, review },
      });
    }

    return this.prisma.exerciseRating.create({
      data: {
        userId,
        exerciseId,
        rating,
        review,
      },
    });
  }

  async getExerciseRatings(exerciseId: string, limit = 20) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const ratings = await this.prisma.exerciseRating.findMany({
      where: { exerciseId },
      include: { user: { select: { id: true, username: true, profile: true } } },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return ratings;
  }

  async getExerciseRatingSummary(exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const ratings = await this.prisma.exerciseRating.findMany({
      where: { exerciseId },
    });

    if (ratings.length === 0) {
      return {
        exerciseId,
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratings.forEach((r) => {
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++;
    });

    return {
      exerciseId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      ratingDistribution,
    };
  }

  async getUserRating(userId: string, exerciseId: string) {
    return this.prisma.exerciseRating.findUnique({
      where: { userId_exerciseId: { userId, exerciseId } },
    });
  }

  async deleteRating(userId: string, exerciseId: string) {
    const existing = await this.prisma.exerciseRating.findUnique({
      where: { userId_exerciseId: { userId, exerciseId } },
    });

    if (!existing) throw new NotFoundException('Rating not found');

    return this.prisma.exerciseRating.delete({
      where: { userId_exerciseId: { userId, exerciseId } },
    });
  }
}
