import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WorkoutSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async startSession(workoutId: string, userId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) throw new NotFoundException('Workout not found');
    if (workout.userId !== userId) throw new ForbiddenException('Cannot access other users workouts');

    return this.prisma.workoutSession.create({
      data: {
        workoutId,
        userId,
        startedAt: new Date(),
      },
      include: { sets: { include: { exercise: true } } },
    });
  }

  async endSession(sessionId: string, userId: string, notes?: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    return this.prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        notes,
      },
      include: { sets: { include: { exercise: true } } },
    });
  }

  async addSetToSession(
    sessionId: string,
    userId: string,
    exerciseId: string,
    setsCompleted: number,
    repsPerformed: number[],
    weightUsed?: number,
    rpe?: number,
    notes?: string
  ) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');
    if (session.endedAt) throw new Error('Cannot add sets to completed session');

    return this.prisma.workoutSessionSet.create({
      data: {
        sessionId,
        exerciseId,
        setsCompleted,
        repsPerformed,
        weightUsed: weightUsed ? parseFloat(weightUsed.toString()) : null,
        rpe: rpe && rpe >= 1 && rpe <= 10 ? rpe : null,
        notes,
      },
      include: { exercise: true },
    });
  }

  async getSessionDetails(sessionId: string, userId: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        workout: { include: { exercises: { include: { exercise: true } } } },
        sets: { include: { exercise: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    return session;
  }

  async getWorkoutSessions(workoutId: string, userId: string, limit = 20) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) throw new NotFoundException('Workout not found');
    if (workout.userId !== userId) throw new ForbiddenException('Cannot access other users workouts');

    const sessions = await this.prisma.workoutSession.findMany({
      where: { workoutId },
      include: { sets: true },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });

    const sessionStats = sessions.map((session) => {
      const duration = session.endedAt ? session.endedAt.getTime() - session.startedAt.getTime() : null;
      const totalSets = session.sets.length;
      const totalReps = session.sets.reduce((sum, s) => sum + s.repsPerformed.length, 0);
      const avgRpe =
        session.sets.filter((s) => s.rpe).length > 0
          ? session.sets.reduce((sum, s) => sum + (s.rpe || 0), 0) / session.sets.filter((s) => s.rpe).length
          : null;

      return {
        ...session,
        durationMinutes: duration ? Math.round(duration / 60000) : null,
        totalSets,
        totalReps,
        avgRpe,
      };
    });

    return sessionStats;
  }

  async getUserSessionStats(userId: string) {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId },
      include: { sets: true, workout: true },
    });

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalWorkoutTime: 0,
        averageSessionDuration: 0,
        totalSetsPerformed: 0,
        mostRecentSession: null,
      };
    }

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.endedAt);
    const totalWorkoutTime = completedSessions.reduce((sum, s) => {
      if (!s.endedAt) return sum;
      return sum + (s.endedAt.getTime() - s.startedAt.getTime());
    }, 0);
    const averageSessionDuration = completedSessions.length > 0 ? Math.round(totalWorkoutTime / completedSessions.length / 60000) : 0;
    const totalSetsPerformed = sessions.reduce((sum, s) => sum + s.sets.length, 0);
    const mostRecentSession = sessions[0];

    return {
      totalSessions,
      totalWorkoutTimeMinutes: Math.round(totalWorkoutTime / 60000),
      averageSessionDurationMinutes: averageSessionDuration,
      totalSetsPerformed,
      mostRecentSession,
    };
  }

  async updateSessionSet(sessionId: string, userId: string, setId: string, dto: any) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: { sets: true },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    const setToUpdate = session.sets.find((s) => s.id === setId);
    if (!setToUpdate) throw new NotFoundException('Set not found in session');

    return this.prisma.workoutSessionSet.update({
      where: { id: setId },
      data: {
        setsCompleted: dto.setsCompleted ?? setToUpdate.setsCompleted,
        repsPerformed: dto.repsPerformed ?? setToUpdate.repsPerformed,
        weightUsed: dto.weightUsed ?? setToUpdate.weightUsed,
        rpe: dto.rpe ?? setToUpdate.rpe,
        actualRestSec: dto.actualRestSec ?? setToUpdate.actualRestSec,
        isWarmupSet: dto.isWarmupSet !== undefined ? dto.isWarmupSet : setToUpdate.isWarmupSet,
      },
      include: { exercise: true },
    });
  }

  async deleteSessionSet(sessionId: string, userId: string, setId: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    const setToDelete = await this.prisma.workoutSessionSet.findUnique({
      where: { id: setId },
    });

    if (!setToDelete) throw new NotFoundException('Set not found');
    if (setToDelete.sessionId !== sessionId) throw new ForbiddenException('Set does not belong to this session');

    return this.prisma.workoutSessionSet.delete({
      where: { id: setId },
    });
  }

  async logDiscomfort(sessionId: string, userId: string, bodyPart: string, type: string, severity: number, notes?: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    return this.prisma.sessionDiscomfort.create({
      data: {
        sessionId,
        bodyPart,
        type: type as any,
        severity,
        notes,
      },
    });
  }

  async getSessionDiscomforts(sessionId: string, userId: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    return this.prisma.sessionDiscomfort.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateSessionStatus(sessionId: string, userId: string, status: string) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException('Cannot access other users sessions');

    return this.prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: status as any,
      },
      include: { sets: { include: { exercise: true } } },
    });
  }
}
