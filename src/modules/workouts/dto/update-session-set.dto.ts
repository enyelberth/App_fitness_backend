import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsArray, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class UpdateSessionSetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  setsCompleted?: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  repsPerformed?: number[];

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
  @IsInt()
  @Min(0)
  @Max(300)
  actualRestSec?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isWarmupSet?: boolean;
}
