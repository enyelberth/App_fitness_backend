import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsNumber, Max, Min, IsString } from 'class-validator';

export class UpdateExerciseInWorkoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  sets?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  reps?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  weightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(600)
  restSec?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Max(500)
  notes?: string;
}
