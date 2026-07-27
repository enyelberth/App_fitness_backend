import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CloneTemplateDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  workoutName!: string;
}
