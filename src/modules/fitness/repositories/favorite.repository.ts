import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class FavoriteRepository {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, type: string, targetId: string) {
    return this.prisma.favorite.create({
      data: { userId, type, targetId },
    });
  }

  async removeFavorite(userId: string, type: string, targetId: string) {
    return this.prisma.favorite.deleteMany({
      where: { userId, type, targetId },
    });
  }

  async isFavorite(userId: string, type: string, targetId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, type, targetId },
    });
    return !!favorite;
  }

  async getFavoritesByType(userId: string, type: string) {
    return this.prisma.favorite.findMany({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countFavorites(userId: string, type: string) {
    return this.prisma.favorite.count({
      where: { userId, type },
    });
  }
}
