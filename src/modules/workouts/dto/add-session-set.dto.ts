import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class AddSessionSetDto {
  @ApiProperty()
  @IsString()
  exerciseId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100)
  setsCompleted!: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  repsPerformed!: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  weightUsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rpe?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Max(500)
  notes?: string;
}
