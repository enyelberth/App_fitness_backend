import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';

export enum DiscomfortType {
  MILD_DISCOMFORT = 'MILD_DISCOMFORT',
  PAIN = 'PAIN',
  SHARP_PAIN = 'SHARP_PAIN',
  PINCHING = 'PINCHING',
}

export class LogDiscomfortDto {
  @ApiProperty()
  @IsString()
  bodyPart!: string;

  @ApiProperty({ enum: DiscomfortType })
  @IsEnum(DiscomfortType)
  type!: DiscomfortType;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(10)
  severity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
