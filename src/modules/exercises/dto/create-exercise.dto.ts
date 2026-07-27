import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsUrl, IsOptional } from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Barbell Bench Press' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  videoUrl?: string;
}
