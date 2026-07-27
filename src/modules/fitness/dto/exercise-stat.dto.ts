import { ApiProperty } from '@nestjs/swagger';

export class ExerciseStatResponseDto {
  exerciseId: string;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  timesPerformed: number;
  avgRpe?: number;
  lastPerformed?: Date;

  constructor(data: any) {
    this.exerciseId = data.exerciseId;
    this.totalReps = data.totalReps;
    this.totalVolume = data.totalVolume;
    this.maxWeight = data.maxWeight;
    this.timesPerformed = data.timesPerformed;
    this.avgRpe = data.avgRpe;
    this.lastPerformed = data.lastPerformed;
  }
}

export class ProgressStatsDto {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  favoriteExercise?: string;
  avgRpe?: number;
  workoutStreak: number;

  constructor(data: any = {}) {
    this.totalWorkouts = data.totalWorkouts || 0;
    this.totalVolume = data.totalVolume || 0;
    this.totalDuration = data.totalDuration || 0;
    this.favoriteExercise = data.favoriteExercise;
    this.avgRpe = data.avgRpe;
    this.workoutStreak = data.workoutStreak || 0;
  }
}
