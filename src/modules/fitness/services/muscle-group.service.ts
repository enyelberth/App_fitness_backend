import { Injectable, NotFoundException } from '@nestjs/common';
import { MuscleGroupRepository } from '../repositories/muscle-group.repository';
import { MuscleGroupResponseDto, MuscleGroupWithExercisesDto } from '../dto/muscle-group.dto';

@Injectable()
export class MuscleGroupService {
  constructor(private muscleGroupRepo: MuscleGroupRepository) {}

  async getAll() {
    const groups = await this.muscleGroupRepo.findAll();
    return groups.map((g) => new MuscleGroupResponseDto(g));
  }

  async getById(id: string) {
    const group = await this.muscleGroupRepo.findById(id);
    if (!group) {
      throw new NotFoundException('Muscle group not found');
    }
    return new MuscleGroupResponseDto(group);
  }

  async getWithExercises(id: string) {
    const group = await this.muscleGroupRepo.findById(id);
    if (!group) {
      throw new NotFoundException('Muscle group not found');
    }

    const exercises = await this.muscleGroupRepo.getExercises(id);
    return new MuscleGroupWithExercisesDto(group, exercises);
  }

  // Seed muscle groups
  async seed() {
    const groups = [
      { name: 'CHEST', description: 'Chest muscles' },
      { name: 'BACK', description: 'Back muscles' },
      { name: 'LEGS', description: 'Leg muscles' },
      { name: 'SHOULDERS', description: 'Shoulder muscles' },
      { name: 'ARMS', description: 'Arm muscles' },
      { name: 'ABS', description: 'Abdominal muscles' },
    ];

    const results = [];
    for (const group of groups) {
      const existing = await this.muscleGroupRepo.findByName(group.name);
      if (!existing) {
        const created = await this.muscleGroupRepo.create(group.name, group.description);
        results.push(created);
      }
    }
    return results;
  }
}
