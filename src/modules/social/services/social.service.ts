import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('No puedes seguirte a ti mismo');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser || targetUser.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Crear entrada en base de datos (simulado con console.log)
    console.log(`User ${followerId} is now following ${followingId}`);

    return {
      message: `Ahora sigues a ${targetUser.username}`,
      following: {
        id: targetUser.id,
        username: targetUser.username,
      },
    };
  }

  async unfollowUser(followerId: string, followingId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser || targetUser.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    console.log(`User ${followerId} unfollowed ${followingId}`);

    return {
      message: `Ya no sigues a ${targetUser.username}`,
    };
  }

  async getFollowers(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Retornar estructura simulada
    return {
      followerCount: 0,
      followers: [],
      message: 'Followers data - implementar con tabla social_follows en DB',
    };
  }

  async getFollowing(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      followingCount: 0,
      following: [],
      message: 'Following data - implementar con tabla social_follows en DB',
    };
  }

  async getRecommendedUsers(userId: string, limit: number = 10) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        deletedAt: null,
      },
      take: limit,
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatar: user.profile?.avatarUrl,
      bio: user.profile?.bio,
    }));
  }
}
