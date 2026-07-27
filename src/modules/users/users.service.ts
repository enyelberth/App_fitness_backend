import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      profile: user.profile,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: { username: updateDto.username, id: { not: userId } },
      });

      if (existingUser) {
        throw new ConflictException('Username ya existe');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(updateDto.username && { username: updateDto.username }),
      },
      include: { profile: true },
    });

    if (updateDto.firstName || updateDto.lastName || updateDto.bio || updateDto.avatarUrl) {
      await this.prisma.profile.update({
        where: { userId },
        data: {
          ...(updateDto.firstName && { firstName: updateDto.firstName }),
          ...(updateDto.lastName && { lastName: updateDto.lastName }),
          ...(updateDto.bio && { bio: updateDto.bio }),
          ...(updateDto.avatarUrl && { avatarUrl: updateDto.avatarUrl }),
        },
      });
    }

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      profile: updated.profile,
      createdAt: updated.createdAt,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Cuenta eliminada correctamente' };
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      username: user.username,
      profile: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        bio: user.profile?.bio,
        avatarUrl: user.profile?.avatarUrl,
      },
      createdAt: user.createdAt,
    };
  }
}
