import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExerciseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.exercise.create({ data });
  }

  async findById(id: string) {
    return this.prisma.exercise.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findAll(skip = 0, take = 20) {
    return this.prisma.exercise.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async search(query: string, skip = 0, take = 20) {
    return this.prisma.exercise.findMany({
      where: {
        deletedAt: null,
        name: { contains: query, mode: 'insensitive' },
      },
      skip,
      take,
    });
  }

  async findByMuscleGroup(muscleGroupId: string) {
    return this.prisma.exercise.findMany({
      where: { muscleGroupId, deletedAt: null },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.exercise.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async count() {
    return this.prisma.exercise.count({
      where: { deletedAt: null },
    });
  }
}
