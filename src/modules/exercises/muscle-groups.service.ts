import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MuscleGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.muscleGroup.findMany({
      include: { exercises: { include: { exercise: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const muscle = await this.prisma.muscleGroup.findUnique({
      where: { id },
      include: { exercises: { include: { exercise: true } } },
    });
    if (!muscle) throw new NotFoundException('Muscle group not found');
    return muscle;
  }

  async create(name: string) {
    return this.prisma.muscleGroup.create({
      data: { name: name.trim() },
    });
  }

  async getExercises(muscleGroupId: string) {
    await this.findById(muscleGroupId);
    return this.prisma.exerciseMuscle.findMany({
      where: { muscleGroupId },
      include: { exercise: true },
      orderBy: { isPrimary: 'desc' },
    });
  }
}
