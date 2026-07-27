import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Bench Press' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Push weight up from chest', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'chest-id' })
  @IsString()
  @IsNotEmpty()
  muscleGroupId: string;

  @ApiProperty({ example: ['barbell', 'dumbbell'], required: false })
  @IsArray()
  @IsOptional()
  equipment?: string[];

  @ApiProperty({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], required: false })
  @IsString()
  @IsOptional()
  difficulty?: string;
}

export class ExerciseResponseDto {
  id: string;
  name: string;
  description?: string;
  muscleGroupId: string;
  equipment?: string[];
  difficulty?: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.muscleGroupId = data.muscleGroupId;
    this.equipment = data.equipment;
    this.difficulty = data.difficulty;
    this.createdAt = data.createdAt;
  }
}
