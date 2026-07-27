import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MuscleGroupRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string, description?: string, imageUrl?: string) {
    return this.prisma.muscleGroup.create({
      data: { name, description, imageUrl },
    });
  }

  async findAll() {
    return this.prisma.muscleGroup.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.muscleGroup.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return this.prisma.muscleGroup.findFirst({
      where: { name },
    });
  }

  async getExercises(muscleGroupId: string) {
    return this.prisma.exercise.findMany({
      where: { muscleGroupId, deletedAt: null },
    });
  }
}
