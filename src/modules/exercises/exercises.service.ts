import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { FilterExercisesDto } from './dto/filter-exercises.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim(),
        videoUrl: dto.videoUrl?.trim(),
      },
    });
  }

  async findAll(filter?: FilterExercisesDto) {
    const where: Prisma.ExerciseWhereInput = {};

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const skip = ((filter?.page ?? 1) - 1) * (filter?.pageSize ?? 20);
    const take = filter?.pageSize ?? 20;

    const [exercises, total] = await this.prisma.$transaction([
      this.prisma.exercise.findMany({
        where,
        include: { muscles: { include: { muscleGroup: true } } },
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.exercise.count({ where }),
    ]);

    return { exercises, total, page: filter?.page ?? 1, pageSize: take };
  }

  async findById(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { muscles: { include: { muscleGroup: true } } },
    });

    if (!exercise) throw new NotFoundException('Exercise not found');
    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findById(id);
    return this.prisma.exercise.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        description: dto.description?.trim(),
        videoUrl: dto.videoUrl?.trim(),
      },
      include: { muscles: { include: { muscleGroup: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.exercise.delete({ where: { id } });
  }

  async addMuscle(exerciseId: string, muscleGroupId: string, isPrimary: boolean = false) {
    await Promise.all([this.findById(exerciseId), this.findMuscleById(muscleGroupId)]);

    return this.prisma.exerciseMuscle.create({
      data: { exerciseId, muscleGroupId, isPrimary },
      include: { muscleGroup: true },
    });
  }

  async removeMuscle(exerciseId: string, muscleGroupId: string) {
    await this.prisma.exerciseMuscle.delete({
      where: { exerciseId_muscleGroupId: { exerciseId, muscleGroupId } },
    });
  }

  private async findMuscleById(id: string) {
    const muscle = await this.prisma.muscleGroup.findUnique({ where: { id } });
    if (!muscle) throw new NotFoundException('Muscle group not found');
    return muscle;
  }
}
