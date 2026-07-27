import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats() {
    const totalUsers = await this.prisma.user.count({
      where: { deletedAt: null },
    });

    const totalWorkouts = await this.prisma.workout.count({
      where: { deletedAt: null },
    });

    const totalExercises = await this.prisma.exercise.count();

    const totalCharacters = await this.prisma.gameCharacter.count();

    const totalCosmetics = await this.prisma.gameCosmetic.count();

    const totalTransactions = await this.prisma.gameTransaction.count();

    return {
      users: totalUsers,
      workouts: totalWorkouts,
      exercises: totalExercises,
      characters: totalCharacters,
      cosmetics: totalCosmetics,
      transactions: totalTransactions,
      timestamp: new Date(),
    };
  }

  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        gameCharacter: true,
        gameWallet: true,
        workouts: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      profile: user.profile,
      character: user.gameCharacter,
      wallet: user.gameWallet,
      workoutCount: user.workouts.length,
    };
  }

  async getDashboardMetrics() {
    const users = await this.prisma.user.count({ where: { deletedAt: null } });
    const newUsersThisMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const totalWorkouts = await this.prisma.workout.count();
    const totalSessions = await this.prisma.workoutSession.count();

    const activeCharacters = await this.prisma.gameCharacter.count({
      where: { level: { gte: 5 } },
    });

    return {
      totalUsers: users,
      newUsersThisMonth,
      totalWorkouts,
      totalSessions,
      activeCharacters,
      engagement: {
        percentageActiveUsers: ((newUsersThisMonth / users) * 100).toFixed(2),
      },
    };
  }

  async listAllUsers(skip: number = 0, take: number = 50) {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take,
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        role: true,
        profile: { select: { avatarUrl: true } },
      },
    });

    const total = await this.prisma.user.count({ where: { deletedAt: null } });

    return {
      data: users,
      pagination: { total, skip, take },
    };
  }

  async deleteUserAdmin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }

  async promoteTo Admin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    });
  }
}
