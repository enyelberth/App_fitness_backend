import { ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';
import { IsString, MaxLength, MinLength, IsEnum, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateWorkoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(5)
  durationMin?: number;
}
