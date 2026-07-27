import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateMuscleGroupDto {
  @ApiProperty({ example: 'Chest' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;
}
