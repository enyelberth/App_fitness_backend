import { ApiProperty } from '@nestjs/swagger';

export class MuscleGroupResponseDto {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
  }
}

export class MuscleGroupWithExercisesDto {
  id: string;
  name: string;
  description?: string;
  exercises: any[];

  constructor(data: any, exercises: any[] = []) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.exercises = exercises;
  }
}
