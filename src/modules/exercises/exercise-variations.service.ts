import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExerciseVariationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVariation(exerciseId: string, name: string, description?: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    const existing = await this.prisma.exerciseVariation.findUnique({
      where: { exerciseId_name: { exerciseId, name } },
    });

    if (existing) {
      throw new ConflictException('Variation with this name already exists for this exercise');
    }

    return this.prisma.exerciseVariation.create({
      data: {
        exerciseId,
        name: name.trim(),
        description: description?.trim(),
      },
    });
  }

  async getVariations(exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');

    return this.prisma.exerciseVariation.findMany({
      where: { exerciseId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateVariation(variationId: string, name?: string, description?: string) {
    const variation = await this.prisma.exerciseVariation.findUnique({
      where: { id: variationId },
    });

    if (!variation) throw new NotFoundException('Variation not found');

    return this.prisma.exerciseVariation.update({
      where: { id: variationId },
      data: {
        name: name?.trim() ?? variation.name,
        description: description?.trim() ?? variation.description,
      },
    });
  }

  async deleteVariation(variationId: string) {
    const variation = await this.prisma.exerciseVariation.findUnique({
      where: { id: variationId },
    });

    if (!variation) throw new NotFoundException('Variation not found');

    return this.prisma.exerciseVariation.delete({
      where: { id: variationId },
    });
  }
}
