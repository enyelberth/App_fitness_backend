import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkoutDto) {
    return this.prisma.workout.create({
      data: {
        userId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        difficulty: dto.difficulty,
        durationMin: dto.durationMin,
      },
      include: { exercises: { include: { exercise: true } } },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.workout.findMany({
      where: { userId, deletedAt: null },
      include: { exercises: { include: { exercise: true }, orderBy: { position: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId?: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: { exercises: { include: { exercise: true }, orderBy: { position: 'asc' } } },
    });

    if (!workout) throw new NotFoundException('Workout not found');
    if (workout.deletedAt) throw new NotFoundException('Workout has been deleted');
    if (userId && workout.userId !== userId) {
      throw new ForbiddenException('Cannot access other users workouts');
    }
    return workout;
  }

  async update(id: string, userId: string, dto: UpdateWorkoutDto) {
    await this.findById(id, userId);
    return this.prisma.workout.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        description: dto.description?.trim(),
        difficulty: dto.difficulty,
        durationMin: dto.durationMin,
      },
      include: { exercises: { include: { exercise: true } } },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.workout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async addExercise(workoutId: string, userId: string, dto: AddExerciseDto) {
    const workout = await this.findById(workoutId, userId);
    const maxPosition = workout.exercises.reduce((max, e) => Math.max(max, e.position), -1);

    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: dto.exerciseId,
        position: maxPosition + 1,
        sets: dto.sets,
        reps: dto.reps,
        weightKg: dto.weightKg,
        restSec: dto.restSec,
        notes: dto.notes,
      },
      include: { exercise: true },
    });
  }

  async removeExercise(workoutId: string, userId: string, exerciseId: string) {
    const workout = await this.findById(workoutId, userId);
    const exerciseToRemove = workout.exercises.find((e) => e.exerciseId === exerciseId);

    if (!exerciseToRemove) throw new NotFoundException('Exercise not in this workout');

    await this.prisma.workoutExercise.delete({
      where: { id: exerciseToRemove.id },
    });

    const remainingExercises = workout.exercises
      .filter((e) => e.exerciseId !== exerciseId)
      .sort((a, b) => a.position - b.position);

    await this.prisma.$transaction(
      remainingExercises.map((ex, idx) =>
        this.prisma.workoutExercise.update({
          where: { id: ex.id },
          data: { position: idx },
        })
      )
    );
  }

  async updateExerciseInWorkout(
    workoutId: string,
    userId: string,
    exerciseId: string,
    dto: any
  ) {
    const workout = await this.findById(workoutId, userId);
    const workoutExercise = workout.exercises.find((e) => e.exerciseId === exerciseId);

    if (!workoutExercise) throw new NotFoundException('Exercise not in this workout');

    return this.prisma.workoutExercise.update({
      where: { id: workoutExercise.id },
      data: {
        sets: dto.sets ?? workoutExercise.sets,
        reps: dto.reps ?? workoutExercise.reps,
        weightKg: dto.weightKg ?? workoutExercise.weightKg,
        restSec: dto.restSec ?? workoutExercise.restSec,
        notes: dto.notes ?? workoutExercise.notes,
      },
      include: { exercise: true },
    });
  }

  async reorderExercises(
    workoutId: string,
    userId: string,
    updates: Array<{ exerciseId: string; newPosition: number }>
  ) {
    const workout = await this.findById(workoutId, userId);

    const updatedExercises = updates.map((update) => {
      const exercise = workout.exercises.find((e) => e.exerciseId === update.exerciseId);
      if (!exercise) throw new NotFoundException(`Exercise ${update.exerciseId} not in workout`);
      return { ...exercise, newPosition: update.newPosition };
    });

    await this.prisma.$transaction(
      updatedExercises.map((ex) =>
        this.prisma.workoutExercise.update({
          where: { id: ex.id },
          data: { position: ex.newPosition },
        })
      )
    );

    return this.findById(workoutId, userId);
  }

  async cloneWorkout(workoutId: string, userId: string, newName: string) {
    const original = await this.findById(workoutId, userId);

    return this.prisma.$transaction(async (tx) => {
      const cloned = await tx.workout.create({
        data: {
          userId,
          name: newName.trim(),
          description: original.description,
          difficulty: original.difficulty,
          durationMin: original.durationMin,
        },
      });

      const exercises = await Promise.all(
        original.exercises.map((ex) =>
          tx.workoutExercise.create({
            data: {
              workoutId: cloned.id,
              exerciseId: ex.exerciseId,
              position: ex.position,
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

      return { ...cloned, exercises };
    });
  }
}
