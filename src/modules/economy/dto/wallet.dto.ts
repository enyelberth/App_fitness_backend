import { ApiProperty } from '@nestjs/swagger';

export class WalletResponseDto {
  userId: string;
  coins: number;
  gems: number;
  updatedAt: Date;

  constructor(data: any) {
    this.userId = data.userId;
    this.coins = data.coins || 0;
    this.gems = data.gems || 0;
    this.updatedAt = data.updatedAt;
  }
}

export class TransactionDto {
  id: string;
  userId: string;
  type: string; // COINS, GEMS
  amount: number;
  source: string; // QUEST, WORKOUT, PAYMENT, SHOP
  description: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.amount = data.amount;
    this.source = data.source;
    this.description = data.description;
    this.createdAt = data.createdAt;
  }
}
