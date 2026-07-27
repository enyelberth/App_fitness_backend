import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WorkoutTemplateService {
  constructor(private prisma: PrismaService) {}

  async createTemplate(userId: string, workoutId: string, name: string, description?: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: true },
    });

    if (!workout || workout.userId !== userId) {
      throw new NotFoundException('Workout not found');
    }

    return this.prisma.workoutTemplate.create({
      data: {
        createdBy: userId,
        name,
        description,
        difficulty: workout.difficulty,
        durationMin: workout.durationMin,
        exercises: workout.exercises,
      },
    });
  }

  async getMyTemplates(userId: string) {
    return this.prisma.workoutTemplate.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTemplate(templateId: string) {
    const template = await this.prisma.workoutTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async useTemplate(userId: string, templateId: string) {
    const template = await this.getTemplate(templateId);

    return this.prisma.workout.create({
      data: {
        userId,
        name: `${template.name} (from template)`,
        description: template.description,
        difficulty: template.difficulty,
        durationMin: template.durationMin,
        isTemplate: false,
      },
    });
  }

  async deleteTemplate(userId: string, templateId: string) {
    const template = await this.getTemplate(templateId);

    if (template.createdBy !== userId) {
      throw new NotFoundException('Not authorized');
    }

    return this.prisma.workoutTemplate.delete({
      where: { id: templateId },
    });
  }
}
