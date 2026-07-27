import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

const publicUserSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  emailVerifiedAt: true,
  createdAt: true,
  profile: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublicById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: publicUserSelect,
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findPublicById(userId);
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
    return this.findPublicById(userId);
  }
}
