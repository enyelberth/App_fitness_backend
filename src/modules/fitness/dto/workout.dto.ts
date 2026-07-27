import { IsString, IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO: Crear nuevo Workout
 */
export class CreateWorkoutDto {
  @ApiProperty({
    description: 'Nombre del workout',
    example: 'Chest & Triceps',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del workout',
    example: 'Rutina de pecho y tríceps',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Dificultad',
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    example: 'INTERMEDIATE',
    required: false,
  })
  @IsString()
  @IsOptional()
  difficulty?: string;

  @ApiProperty({
    description: 'Duración estimada en minutos',
    example: 60,
    required: false,
  })
  @IsNumber()
  @Min(5)
  @IsOptional()
  estimatedDurationMinutes?: number;
}

/**
 * DTO: Actualizar Workout
 */
export class UpdateWorkoutDto {
  @ApiProperty({
    description: 'Nombre del workout',
    example: 'Chest & Triceps Updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Dificultad',
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    required: false,
  })
  @IsString()
  @IsOptional()
  difficulty?: string;

  @ApiProperty({
    description: 'Duración estimada en minutos',
    required: false,
  })
  @IsNumber()
  @Min(5)
  @IsOptional()
  estimatedDurationMinutes?: number;
}

/**
 * DTO: Response de Workout
 */
export class WorkoutResponseDto {
  id: string;
  name: string;
  description?: string;
  difficulty?: string;
  estimatedDurationMinutes?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.difficulty = data.difficulty;
    this.estimatedDurationMinutes = data.estimatedDurationMinutes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
