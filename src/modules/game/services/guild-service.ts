import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Guild {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  level: number;
  memberCount: number;
  treasury: number;
  createdAt: Date;
}

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async createGuild(userId: string, name: string, description?: string): Promise<Guild> {
    const existingGuild = await this.prisma.guild.findFirst({
      where: { name },
    });

    if (existingGuild) {
      throw new BadRequestException('Guild name already exists');
    }

    return this.prisma.guild.create({
      data: {
        name,
        description,
        leaderId: userId,
        level: 1,
        members: 1,
        maxMembers: 50,
        treasury: 0,
      },
    });
  }

  async getGuild(guildId: string) {
    const guild = await this.prisma.guild.findUnique({
      where: { id: guildId },
    });

    if (!guild) {
      throw new NotFoundException('Guild not found');
    }

    return guild;
  }

  async listGuilds(limit: number = 50) {
    return this.prisma.guild.findMany({
      take: limit,
      orderBy: { level: 'desc' },
    });
  }

  async joinGuild(userId: string, guildId: string) {
    const guild = await this.getGuild(guildId);

    if (guild.members >= guild.maxMembers) {
      throw new BadRequestException('Guild is full');
    }

    // Actualizar miembro de guild (simulado)
    console.log(\User \ joined guild \\);

    return {
      message: 'Successfully joined guild',
      guild: {
        id: guild.id,
        name: guild.name,
        level: guild.level,
      },
    };
  }

  async leaveGuild(userId: string, guildId: string) {
    const guild = await this.getGuild(guildId);

    if (guild.leaderId === userId) {
      throw new BadRequestException('Leader cannot leave guild');
    }

    console.log(\User \ left guild \\);

    return { message: 'Successfully left guild' };
  }

  async getGuildMembers(guildId: string) {
    const guild = await this.getGuild(guildId);

    return {
      guildId,
      memberCount: guild.members,
      maxMembers: guild.maxMembers,
      leaderId: guild.leaderId,
      // En producción, traer lista real de miembros
      members: [
        {
          userId: guild.leaderId,
          role: 'leader',
          joinedAt: guild.createdAt,
        },
      ],
    };
  }

  async getGuildLeaderboard(guildId: string) {
    // Leaderboard dentro de la guild
    return {
      guildId,
      leaderboard: [
        {
          rank: 1,
          userId: 'user1',
          username: 'player1',
          level: 45,
          xp: 5000,
        },
      ],
    };
  }

  async depositToTreasury(userId: string, guildId: string, amount: number) {
    const guild = await this.getGuild(guildId);

    const updated = await this.prisma.guild.update({
      where: { id: guildId },
      data: { treasury: guild.treasury + amount },
    });

    console.log(\User \ deposited \ coins to \\);

    return {
      message: 'Deposit successful',
      newTreasury: updated.treasury,
    };
  }

  async withdrawFromTreasury(userId: string, guildId: string, amount: number) {
    const guild = await this.getGuild(guildId);

    if (guild.leaderId !== userId) {
      throw new ForbiddenException('Only leader can withdraw');
    }

    if (guild.treasury < amount) {
      throw new BadRequestException('Insufficient treasury funds');
    }

    const updated = await this.prisma.guild.update({
      where: { id: guildId },
      data: { treasury: guild.treasury - amount },
    });

    return {
      message: 'Withdrawal successful',
      newTreasury: updated.treasury,
    };
  }
}
