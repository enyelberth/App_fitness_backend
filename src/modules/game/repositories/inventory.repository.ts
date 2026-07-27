import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class InventoryRepository {
  constructor(private prisma: PrismaService) {}

  async addToInventory(userId: string, cosmeticId: string) {
    // Verificar si ya tiene
    const existing = await this.prisma.gameInventory.findFirst({
      where: { userId, cosmeticId },
    });

    if (existing) {
      return this.prisma.gameInventory.update({
        where: { id: existing.id },
        data: { quantity: { increment: 1 } },
      });
    }

    return this.prisma.gameInventory.create({
      data: {
        userId,
        cosmeticId,
        quantity: 1,
        acquiredAt: new Date(),
      },
    });
  }

  async getUserInventory(userId: string) {
    return this.prisma.gameInventory.findMany({
      where: { userId },
      include: { cosmetic: true },
    });
  }

  async equipCosmetic(userId: string, cosmeticId: string) {
    return this.prisma.gameInventory.updateMany({
      where: { userId, cosmeticId },
      data: { equipped: true },
    });
  }

  async unequipCosmetic(userId: string, cosmeticId: string) {
    return this.prisma.gameInventory.updateMany({
      where: { userId, cosmeticId },
      data: { equipped: false },
    });
  }

  async getEquippedCosmetics(userId: string) {
    return this.prisma.gameInventory.findMany({
      where: { userId, equipped: true },
      include: { cosmetic: true },
    });
  }

  async countInventory(userId: string) {
    return this.prisma.gameInventory.count({
      where: { userId },
    });
  }
}
