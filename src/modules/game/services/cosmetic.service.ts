import { Injectable, NotFoundException } from '@nestjs/common';
import { CosmeticRepository } from '../repositories/cosmetic.repository';
import { InventoryRepository } from '../repositories/inventory.repository';
import { CosmeticResponseDto, InventoryItemDto } from '../dto/cosmetic.dto';

@Injectable()
export class CosmeticService {
  constructor(
    private cosmeticRepo: CosmeticRepository,
    private inventoryRepo: InventoryRepository,
  ) {}

  async getAll(skip = 0, take = 20) {
    const [cosmetics, total] = await Promise.all([
      this.cosmeticRepo.findAll(skip, take),
      this.cosmeticRepo.count(),
    ]);

    return {
      data: cosmetics.map((c) => new CosmeticResponseDto(c)),
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        hasMore: skip + take < total,
      },
    };
  }

  async getByType(type: string) {
    const cosmetics = await this.cosmeticRepo.findByType(type);
    return cosmetics.map((c) => new CosmeticResponseDto(c));
  }

  async getByRarity(rarity: string) {
    const cosmetics = await this.cosmeticRepo.findByRarity(rarity);
    return cosmetics.map((c) => new CosmeticResponseDto(c));
  }

  async search(query: string) {
    const cosmetics = await this.cosmeticRepo.search(query);
    return cosmetics.map((c) => new CosmeticResponseDto(c));
  }

  async getUserInventory(userId: string) {
    const items = await this.inventoryRepo.getUserInventory(userId);
    return items.map((item) => new InventoryItemDto(item));
  }

  async equipCosmetic(userId: string, cosmeticId: string) {
    const cosmetic = await this.cosmeticRepo.findById(cosmeticId);
    if (!cosmetic) {
      throw new NotFoundException('Cosmetic not found');
    }

    await this.inventoryRepo.equipCosmetic(userId, cosmeticId);
    return { success: true, message: 'Cosmetic equipped' };
  }

  async unequipCosmetic(userId: string, cosmeticId: string) {
    await this.inventoryRepo.unequipCosmetic(userId, cosmeticId);
    return { success: true, message: 'Cosmetic unequipped' };
  }

  async addToInventory(userId: string, cosmeticId: string) {
    const cosmetic = await this.cosmeticRepo.findById(cosmeticId);
    if (!cosmetic) {
      throw new NotFoundException('Cosmetic not found');
    }

    const item = await this.inventoryRepo.addToInventory(userId, cosmeticId);
    return new InventoryItemDto(item);
  }
}
