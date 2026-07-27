import { ApiProperty } from '@nestjs/swagger';

export class TransactionDetailDto {
  id: string;
  userId: string;
  type: string; // COINS, GEMS
  amount: number;
  source: string; // QUEST, WORKOUT, PAYMENT, LEVEL_UP, SHOP
  description: string;
  balance: number; // Balance después de transacción
  createdAt: Date;

  constructor(data: any, balance: number = 0) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.amount = data.amount;
    this.source = data.source;
    this.description = data.description;
    this.balance = balance;
    this.createdAt = data.createdAt;
  }
}

export class ShopItemDto {
  cosmeticId: string;
  name: string;
  price?: number;
  gemPrice?: number;
  owned: boolean;

  constructor(data: any, owned: boolean = false) {
    this.cosmeticId = data.cosmeticId;
    this.name = data.name;
    this.price = data.price;
    this.gemPrice = data.gemPrice;
    this.owned = owned;
  }
}
