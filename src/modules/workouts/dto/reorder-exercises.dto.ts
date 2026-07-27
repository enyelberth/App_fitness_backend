import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ExercisePosition {
  @ApiProperty()
  @IsString()
  exerciseId!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  newPosition!: number;
}

export class ReorderExercisesDto {
  @ApiProperty({ type: [ExercisePosition] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExercisePosition)
  updates!: ExercisePosition[];
}
