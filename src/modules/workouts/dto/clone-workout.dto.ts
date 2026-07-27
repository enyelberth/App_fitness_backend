import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CloneWorkoutDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;
}
