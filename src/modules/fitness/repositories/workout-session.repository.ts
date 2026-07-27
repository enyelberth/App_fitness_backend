import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WorkoutSessionRepository {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, workoutId: string) {
    return this.prisma.workoutSession.create({
      data: {
        userId,
        workoutId,
        status: 'ACTIVE',
        startedAt: new Date(),
        totalVolume: 0,
      },
    });
  }

  async findSessionById(id: string) {
    return this.prisma.workoutSession.findUnique({
      where: { id },
      include: { sets: true },
    });
  }

  async findActiveSession(userId: string) {
    return this.prisma.workoutSession.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { sets: true },
    });
  }

  async findUserSessions(userId: string, skip = 0, take = 10) {
    return this.prisma.workoutSession.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { startedAt: 'desc' },
      include: { sets: true },
    });
  }

  async addSet(sessionId: string, exerciseId: string, data: any) {
    return this.prisma.sessionSet.create({
      data: {
        sessionId,
        exerciseId,
        ...data,
        completedAt: new Date(),
      },
    });
  }

  async updateSet(id: string, data: any) {
    return this.prisma.sessionSet.update({
      where: { id },
      data,
    });
  }

  async completeSession(id: string, durationMinutes: number) {
    // Calcular volumen total
    const sets = await this.prisma.sessionSet.findMany({
      where: { sessionId: id },
    });

    const totalVolume = sets.reduce((sum, set) => {
      return sum + set.weight * set.reps;
    }, 0);

    return this.prisma.workoutSession.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        durationMinutes,
        totalVolume,
      },
      include: { sets: true },
    });
  }

  async countSessions(userId: string) {
    return this.prisma.workoutSession.count({
      where: { userId, status: 'COMPLETED' },
    });
  }

  async getTotalVolume(userId: string) {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId, status: 'COMPLETED' },
    });

    return sessions.reduce((sum, session) => sum + session.totalVolume, 0);
  }
}
