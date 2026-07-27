import { ApiProperty } from '@nestjs/swagger';

export class FavoriteResponseDto {
  id: string;
  userId: string;
  type: string;
  targetId: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.targetId = data.targetId;
    this.createdAt = data.createdAt;
  }
}
