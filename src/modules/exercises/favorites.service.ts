import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserFavoriteType } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavoriteExercise(userId: string, exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const existing = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        type: UserFavoriteType.EXERCISE,
        exerciseId,
      },
    });

    if (existing) return existing;

    return this.prisma.userFavorite.create({
      data: {
        userId,
        type: UserFavoriteType.EXERCISE,
        exerciseId,
      },
    });
  }

  async addFavoriteWorkout(userId: string, workoutId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) throw new NotFoundException('Workout not found');
    if (workout.userId !== userId) {
      throw new BadRequestException('Can only favorite own workouts or shared workouts');
    }

    const existing = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        type: UserFavoriteType.WORKOUT,
        workoutId,
      },
    });

    if (existing) return existing;

    return this.prisma.userFavorite.create({
      data: {
        userId,
        type: UserFavoriteType.WORKOUT,
        workoutId,
      },
    });
  }

  async removeFavoriteExercise(userId: string, exerciseId: string) {
    const favorite = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        type: UserFavoriteType.EXERCISE,
        exerciseId,
      },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    return this.prisma.userFavorite.delete({
      where: { id: favorite.id },
    });
  }

  async removeFavoriteWorkout(userId: string, workoutId: string) {
    const favorite = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        type: UserFavoriteType.WORKOUT,
        workoutId,
      },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    return this.prisma.userFavorite.delete({
      where: { id: favorite.id },
    });
  }

  async getFavoriteExercises(userId: string) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: {
        userId,
        type: UserFavoriteType.EXERCISE,
      },
      include: { exercise: true },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.exercise);
  }

  async getFavoriteWorkouts(userId: string) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: {
        userId,
        type: UserFavoriteType.WORKOUT,
      },
      include: { workout: { include: { exercises: { include: { exercise: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.workout);
  }

  async isFavoriteExercise(userId: string, exerciseId: string): Promise<boolean> {
    const favorite = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        type: UserFavoriteType.EXERCISE,
        exerciseId,
      },
    });

    return !!favorite;
  }

  async isFavoriteWorkout(userId: string, workoutId: string): Promise<boolean> {
    const favorite = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        type: UserFavoriteType.WORKOUT,
        workoutId,
      },
    });

    return !!favorite;
  }
}
