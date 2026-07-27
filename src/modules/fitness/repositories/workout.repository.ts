import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WorkoutRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear nuevo workout
   */
  async create(
    userId: string,
    data: {
      name: string;
      description?: string;
      difficulty?: string;
      estimatedDurationMinutes?: number;
    },
  ) {
    return this.prisma.workout.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  /**
   * Obtener workout por ID
   */
  async findById(id: string) {
    return this.prisma.workout.findFirst({
      where: { id, deletedAt: null },
      include: {
        exercises: {
          where: { deletedAt: null },
        },
      },
    });
  }

  /**
   * Obtener workouts del usuario
   */
  async findByUserId(userId: string, skip = 0, take = 10) {
    return this.prisma.workout.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: {
          where: { deletedAt: null },
        },
      },
    });
  }

  /**
   * Contar workouts del usuario
   */
  async countByUserId(userId: string) {
    return this.prisma.workout.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  /**
   * Actualizar workout
   */
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      difficulty?: string;
      estimatedDurationMinutes?: number;
    },
  ) {
    return this.prisma.workout.update({
      where: { id },
      data,
      include: {
        exercises: {
          where: { deletedAt: null },
        },
      },
    });
  }

  /**
   * Eliminar (soft delete) workout
   */
  async delete(id: string) {
    return this.prisma.workout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Verificar que el workout pertenece al usuario
   */
  async belongsToUser(workoutId: string, userId: string): Promise<boolean> {
    const workout = await this.prisma.workout.findFirst({
      where: { id: workoutId, userId },
    });
    return !!workout;
  }
}
