import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExerciseVariationService {
  constructor(private prisma: PrismaService) {}

  async getVariations(exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { variations: true },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise.variations;
  }

  async createVariation(exerciseId: string, name: string, description?: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return this.prisma.exerciseVariation.create({
      data: {
        exerciseId,
        name,
        description,
      },
    });
  }

  async updateVariation(variationId: string, name?: string, description?: string) {
    return this.prisma.exerciseVariation.update({
      where: { id: variationId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
    });
  }

  async deleteVariation(variationId: string) {
    return this.prisma.exerciseVariation.delete({
      where: { id: variationId },
    });
  }
}
