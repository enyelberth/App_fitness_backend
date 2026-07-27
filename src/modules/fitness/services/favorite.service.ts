import { Injectable, ConflictException } from '@nestjs/common';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { FavoriteResponseDto } from '../dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private favoriteRepo: FavoriteRepository) {}

  async addFavorite(userId: string, type: string, targetId: string) {
    // Verificar que no esté ya en favoritos
    const existing = await this.favoriteRepo.isFavorite(userId, type, targetId);
    if (existing) {
      throw new ConflictException('Already in favorites');
    }

    const favorite = await this.favoriteRepo.addFavorite(userId, type, targetId);
    return new FavoriteResponseDto(favorite);
  }

  async removeFavorite(userId: string, type: string, targetId: string) {
    await this.favoriteRepo.removeFavorite(userId, type, targetId);
    return { success: true };
  }

  async isFavorite(userId: string, type: string, targetId: string) {
    return this.favoriteRepo.isFavorite(userId, type, targetId);
  }

  async getFavorites(userId: string, type: string) {
    const favorites = await this.favoriteRepo.getFavoritesByType(userId, type);
    return favorites.map((f) => new FavoriteResponseDto(f));
  }

  async countFavorites(userId: string, type: string) {
    return this.favoriteRepo.countFavorites(userId, type);
  }
}
