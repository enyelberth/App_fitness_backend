import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'workout-id' })
  @IsString()
  workoutId: string;
}

export class AddSetDto {
  @ApiProperty({ example: 'exercise-id' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  setNumber: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  reps: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ example: 7, required: false })
  @IsNumber()
  @IsOptional()
  rpe?: number;

  @ApiProperty({ example: 60, required: false })
  @IsNumber()
  @IsOptional()
  restSeconds?: number;

  @ApiProperty({ example: 'Felt strong', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CompleteSessionDto {
  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(1)
  durationMinutes: number;
}

export class SessionSetResponseDto {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number;
  restSeconds?: number;
  completedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.sessionId = data.sessionId;
    this.exerciseId = data.exerciseId;
    this.setNumber = data.setNumber;
    this.reps = data.reps;
    this.weight = data.weight;
    this.rpe = data.rpe;
    this.restSeconds = data.restSeconds;
    this.completedAt = data.completedAt;
  }
}

export class SessionResponseDto {
  id: string;
  workoutId: string;
  userId: string;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  durationMinutes?: number;
  totalVolume: number;
  sets: SessionSetResponseDto[];

  constructor(data: any) {
    this.id = data.id;
    this.workoutId = data.workoutId;
    this.userId = data.userId;
    this.status = data.status;
    this.startedAt = data.startedAt;
    this.completedAt = data.completedAt;
    this.durationMinutes = data.durationMinutes;
    this.totalVolume = data.totalVolume;
    this.sets = (data.sets || []).map((s: any) => new SessionSetResponseDto(s));
  }
}
