import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { MuscleGroupRepository } from '../repositories/muscle-group.repository';
import { CreateExerciseDto, ExerciseResponseDto } from '../dto/exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    private exerciseRepo: ExerciseRepository,
    private muscleGroupRepo: MuscleGroupRepository,
  ) {}

  async create(createDto: CreateExerciseDto) {
    // Verificar que muscle group existe
    const muscleGroup = await this.muscleGroupRepo.findById(createDto.muscleGroupId);
    if (!muscleGroup) {
      throw new NotFoundException('Muscle group not found');
    }

    const exercise = await this.exerciseRepo.create(createDto);
    return new ExerciseResponseDto(exercise);
  }

  async getAll(skip = 0, take = 20) {
    const [exercises, total] = await Promise.all([
      this.exerciseRepo.findAll(skip, take),
      this.exerciseRepo.count(),
    ]);

    return {
      data: exercises.map((e) => new ExerciseResponseDto(e)),
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        hasMore: skip + take < total,
      },
    };
  }

  async search(query: string, skip = 0, take = 20) {
    const exercises = await this.exerciseRepo.search(query, skip, take);
    return {
      data: exercises.map((e) => new ExerciseResponseDto(e)),
    };
  }

  async getById(id: string) {
    const exercise = await this.exerciseRepo.findById(id);
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return new ExerciseResponseDto(exercise);
  }

  async getByMuscleGroup(muscleGroupId: string) {
    const exercises = await this.exerciseRepo.findByMuscleGroup(muscleGroupId);
    return exercises.map((e) => new ExerciseResponseDto(e));
  }
}
