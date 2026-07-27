import { ApiProperty } from '@nestjs/swagger';

export class CosmeticResponseDto {
  id: string;
  name: string;
  description?: string;
  type: string;
  rarity: string;
  characterClass?: string;
  price?: number;
  gemPrice?: number;
  imageUrl?: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.rarity = data.rarity;
    this.characterClass = data.characterClass;
    this.price = data.price;
    this.gemPrice = data.gemPrice;
    this.imageUrl = data.imageUrl;
  }
}

export class InventoryItemDto {
  id: string;
  cosmeticId: string;
  cosmetic: CosmeticResponseDto;
  quantity: number;
  equipped: boolean;
  acquiredAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.cosmeticId = data.cosmeticId;
    this.cosmetic = new CosmeticResponseDto(data.cosmetic);
    this.quantity = data.quantity;
    this.equipped = data.equipped;
    this.acquiredAt = data.acquiredAt;
  }
}
