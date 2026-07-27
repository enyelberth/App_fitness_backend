import { ApiProperty } from '@nestjs/swagger';

export class QuestResponseDto {
  id: string;
  title: string;
  description?: string;
  type: string;
  requirement: string;
  targetValue: number;
  currentProgress: number;
  status: string;
  xpReward: number;
  coinReward: number;
  progress: number; // Porcentaje

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.type = data.type;
    this.requirement = data.requirement;
    this.targetValue = data.targetValue;
    this.currentProgress = data.currentProgress || 0;
    this.status = data.status;
    this.xpReward = data.xpReward;
    this.coinReward = data.coinReward;
    this.progress = Math.min(100, Math.floor((this.currentProgress / this.targetValue) * 100));
  }
}
