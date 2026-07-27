import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';
import { IsString, MaxLength, MinLength, IsEnum, IsInt, Min, IsOptional } from 'class-validator';

export class CreateWorkoutDto {
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
}
