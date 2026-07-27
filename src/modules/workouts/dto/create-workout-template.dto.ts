import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';
import { IsString, MaxLength, MinLength, IsEnum, IsInt, Min, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TemplateExerciseDto {
  @ApiProperty()
  @IsString()
  exerciseId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sets?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  reps?: number;

  @ApiPropertyOptional()
  @IsOptional()
  weightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  restSec?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutTemplateDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: Difficulty, default: Difficulty.BEGINNER })
  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(5)
  durationMin?: number;

  @ApiPropertyOptional({ type: [TemplateExerciseDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateExerciseDto)
  exercises?: TemplateExerciseDto[];
}
