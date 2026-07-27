import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class WorkoutTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(
    adminId: string,
    name: string,
    description?: string,
    difficulty?: string,
    durationMin?: number,
    exercisesData?: any
  ) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || (admin.role !== Role.ADMIN && admin.role !== Role.COACH)) {
      throw new ForbiddenException('Only admins and coaches can create templates');
    }

    return this.prisma.workoutTemplate.create({
      data: {
        createdBy: adminId,
        name: name.trim(),
        description: description?.trim(),
        difficulty: difficulty || 'BEGINNER',
        durationMin,
        exercises: exercisesData || [],
      },
    });
  }

  async getPublicTemplates(limit = 50) {
    return this.prisma.workoutTemplate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        difficulty: true,
        durationMin: true,
        exercises: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            username: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getTemplateById(templateId: string) {
    const template = await this.prisma.workoutTemplate.findUnique({
      where: { id: templateId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async cloneTemplateToWorkout(userId: string, templateId: string, workoutName: string) {
    const template = await this.getTemplateById(templateId);

    const workout = await this.prisma.workout.create({
      data: {
        userId,
        name: workoutName.trim(),
        description: template.description,
        difficulty: template.difficulty as any,
        durationMin: template.durationMin,
      },
      include: { exercises: { include: { exercise: true } } },
    });

    const exercisesData = Array.isArray(template.exercises) ? template.exercises : [];
    if (exercisesData.length > 0) {
      const workoutExercises = await Promise.all(
        exercisesData.map((ex: any, idx: number) =>
          this.prisma.workoutExercise.create({
            data: {
              workoutId: workout.id,
              exerciseId: ex.exerciseId,
              position: idx,
              sets: ex.sets,
              reps: ex.reps,
              weightKg: ex.weightKg,
              restSec: ex.restSec,
              notes: ex.notes,
            },
            include: { exercise: true },
          })
        )
      );

      return { ...workout, exercises: workoutExercises };
    }

    return workout;
  }

  async updateTemplate(
    templateId: string,
    adminId: string,
    name?: string,
    description?: string,
    difficulty?: string,
    durationMin?: number
  ) {
    const template = await this.prisma.workoutTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) throw new NotFoundException('Template not found');
    if (template.createdBy !== adminId) throw new ForbiddenException('Cannot modify templates created by others');

    return this.prisma.workoutTemplate.update({
      where: { id: templateId },
      data: {
        name: name?.trim() ?? template.name,
        description: description?.trim() ?? template.description,
        difficulty: difficulty ?? template.difficulty,
        durationMin: durationMin ?? template.durationMin,
      },
    });
  }

  async deleteTemplate(templateId: string, adminId: string) {
    const template = await this.prisma.workoutTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) throw new NotFoundException('Template not found');
    if (template.createdBy !== adminId) throw new ForbiddenException('Cannot delete templates created by others');

    return this.prisma.workoutTemplate.delete({
      where: { id: templateId },
    });
  }

  async getMyTemplates(adminId: string) {
    return this.prisma.workoutTemplate.findMany({
      where: { createdBy: adminId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchTemplates(search: string, difficulty?: string, limit = 20) {
    const where: any = {
      OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }],
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    return this.prisma.workoutTemplate.findMany({
      where,
      include: {
        creator: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
