import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CharacterRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear nuevo personaje
   */
  async create(
    userId: string,
    data: {
      class: string;
      level?: number;
      currentXp?: number;
      totalXp?: number;
    },
  ) {
    return this.prisma.gameCharacter.create({
      data: {
        userId,
        class: data.class,
        level: data.level || 1,
        currentXp: data.currentXp || 0,
        totalXp: data.totalXp || 0,
        health: 100,
        strength: 10,
        speed: 10,
        stamina: 10,
      },
    });
  }

  /**
   * Obtener personaje por ID
   */
  async findById(id: string) {
    return this.prisma.gameCharacter.findUnique({
      where: { id },
    });
  }

  /**
   * Obtener personaje del usuario
   */
  async findByUserId(userId: string) {
    return this.prisma.gameCharacter.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Actualizar XP
   */
  async updateXp(
    id: string,
    xpAmount: number,
  ): Promise<{ character: any; levelsUp: boolean; newLevel?: number }> {
    const character = await this.findById(id);
    if (!character) throw new Error('Character not found');

    const newCurrentXp = character.currentXp + xpAmount;
    const nextLevelXp = this.getXpForNextLevel(character.level);

    if (newCurrentXp >= nextLevelXp) {
      // Level up!
      const leveledUp = await this.prisma.gameCharacter.update({
        where: { id },
        data: {
          level: { increment: 1 },
          currentXp: 0,
          totalXp: { increment: xpAmount },
          strength: { increment: 5 },
          speed: { increment: 5 },
          stamina: { increment: 5 },
        },
      });

      return {
        character: leveledUp,
        levelsUp: true,
        newLevel: leveledUp.level,
      };
    } else {
      // No level up
      const updated = await this.prisma.gameCharacter.update({
        where: { id },
        data: {
          currentXp: newCurrentXp,
          totalXp: { increment: xpAmount },
        },
      });

      return {
        character: updated,
        levelsUp: false,
      };
    }
  }

  /**
   * Incrementar contador de workouts
   */
  async incrementWorkoutCount(id: string) {
    return this.prisma.gameCharacter.update({
      where: { id },
      data: { totalWorkouts: { increment: 1 } },
    });
  }

  /**
   * Obtener top 100 leaderboard
   */
  async getLeaderboard(limit = 100) {
    return this.prisma.gameCharacter.findMany({
      orderBy: [{ level: 'desc' }, { totalXp: 'desc' }],
      take: limit,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  /**
   * Obtener ranking del usuario
   */
  async getUserRank(userId: string) {
    const character = await this.findByUserId(userId);
    if (!character) return null;

    const betterCharacters = await this.prisma.gameCharacter.count({
      where: {
        OR: [
          { level: { gt: character.level } },
          { AND: [{ level: character.level }, { totalXp: { gt: character.totalXp } }] },
        ],
      },
    });

    return betterCharacters + 1; // +1 porque ranking comienza en 1
  }

  /**
   * Calcular XP necesario para siguiente nivel
   * Fórmula: 100 * level^1.5
   */
  private getXpForNextLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}
