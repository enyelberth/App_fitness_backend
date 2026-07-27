import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CosmeticRepository {
  constructor(private prisma: PrismaService) {}

  async createCosmetic(data: any) {
    return this.prisma.gameCosmetic.create({ data });
  }

  async findById(id: string) {
    return this.prisma.gameCosmetic.findUnique({ where: { id } });
  }

  async findAll(skip = 0, take = 20) {
    return this.prisma.gameCosmetic.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(type: string) {
    return this.prisma.gameCosmetic.findMany({
      where: { type },
    });
  }

  async findByRarity(rarity: string) {
    return this.prisma.gameCosmetic.findMany({
      where: { rarity },
    });
  }

  async search(query: string) {
    return this.prisma.gameCosmetic.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
    });
  }

  async count() {
    return this.prisma.gameCosmetic.count();
  }
}
