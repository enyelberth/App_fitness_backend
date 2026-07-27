import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma, Role } from "@prisma/client";
import * as argon2 from "argon2";
import { createHash, randomUUID, timingSafeEqual } from "crypto";
import { PrismaService } from "../../database/prisma.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthResponseDto, AuthUserDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";

interface RefreshPayload {
  sub: string;
  sid: string;
  family: string;
  type: "refresh";
}

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtl: number;
  private readonly refreshTtl: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessSecret = config.getOrThrow<string>("JWT_ACCESS_SECRET");
    this.refreshSecret = config.getOrThrow<string>("JWT_REFRESH_SECRET");
    this.accessTtl = config.getOrThrow<number>("JWT_ACCESS_TTL_SECONDS");
    this.refreshTtl = config.getOrThrow<number>("JWT_REFRESH_TTL_SECONDS");
  }

  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim().toLowerCase();
    const duplicate = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true },
    });
    if (duplicate) throw new ConflictException("Email or username already exists");

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    try {
      const user = await this.prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            username,
            passwordHash,
            profile: {
              create: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                age: dto.age,
                gender: dto.gender,
                level: dto.level,
                goal: dto.goal,
                weightKg: dto.weightKg,
                heightCm: dto.heightCm,
                availableMinutes: dto.availableMinutes,
                availableEquipment: dto.availableEquipment,
                injuries: dto.injuries,
                preferences: dto.preferences,
              },
            },
            wallet: { create: {} },
          },
          select: { id: true, email: true, username: true, role: true },
        });
        return created;
      });
      return this.issueInitialSession(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Email or username already exists");
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.issueInitialSession(user);
  }

  async refresh(rawToken: string): Promise<AuthResponseDto> {
    const payload = await this.verifyRefreshToken(rawToken);
    const session = await this.prisma.authSession.findUnique({
      where: { id: payload.sid },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            deletedAt: true,
          },
        },
      },
    });

    if (
      !session ||
      session.userId !== payload.sub ||
      session.familyId !== payload.family ||
      session.expiresAt <= new Date() ||
      session.user.deletedAt
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (session.revokedAt || !this.hashMatches(rawToken, session.refreshTokenHash)) {
      await this.revokeFamily(payload.family);
      throw new UnauthorizedException("Refresh token reuse detected");
    }

    const newSessionId = randomUUID();
    const refreshToken = await this.signRefreshToken(
      session.userId,
      newSessionId,
      session.familyId,
    );
    const updated = await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.authSession.updateMany({
        where: { id: session.id, revokedAt: null },
        data: { revokedAt: new Date(), replacedById: newSessionId },
      });
      if (claimed.count !== 1) return false;

      await tx.authSession.create({
        data: {
          id: newSessionId,
          userId: session.userId,
          familyId: session.familyId,
          refreshTokenHash: this.hashToken(refreshToken),
          expiresAt: new Date(Date.now() + this.refreshTtl * 1000),
        },
      });
      return true;
    });

    if (!updated) {
      await this.revokeFamily(session.familyId);
      throw new UnauthorizedException("Refresh token reuse detected");
    }

    return {
      accessToken: await this.signAccessToken(session.user),
      refreshToken,
      user: this.toAuthUser(session.user),
    };
  }

  async logout(rawToken: string): Promise<void> {
    try {
      const payload = await this.verifyRefreshToken(rawToken);
      await this.prisma.authSession.updateMany({
        where: { id: payload.sid, userId: payload.sub, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Logout is idempotent and does not reveal token validity.
    }
  }

  private async issueInitialSession(
    user: AuthUserDto,
  ): Promise<AuthResponseDto> {
    const sessionId = randomUUID();
    const familyId = randomUUID();
    const refreshToken = await this.signRefreshToken(
      user.id,
      sessionId,
      familyId,
    );

    await this.prisma.authSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        familyId,
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTtl * 1000),
      },
    });

    return {
      accessToken: await this.signAccessToken(user),
      refreshToken,
      user: this.toAuthUser(user),
    };
  }

  private signAccessToken(user: AuthUserDto): Promise<string> {
    return this.jwt.signAsync(
      { sub: user.id, role: user.role, type: "access" },
      { secret: this.accessSecret, expiresIn: this.accessTtl },
    );
  }

  private signRefreshToken(
    userId: string,
    sessionId: string,
    familyId: string,
  ): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: userId,
        sid: sessionId,
        family: familyId,
        type: "refresh",
      } satisfies RefreshPayload,
      { secret: this.refreshSecret, expiresIn: this.refreshTtl },
    );
  }

  private async verifyRefreshToken(token: string): Promise<RefreshPayload> {
    try {
      const payload = await this.jwt.verifyAsync<RefreshPayload>(token, {
        secret: this.refreshSecret,
      });
      if (
        payload.type !== "refresh" ||
        !payload.sub ||
        !payload.sid ||
        !payload.family
      ) {
        throw new Error("invalid payload");
      }
      return payload;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private revokeFamily(familyId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.authSession.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private hashMatches(token: string, expectedHash: string): boolean {
    const actual = Buffer.from(this.hashToken(token), "hex");
    const expected = Buffer.from(expectedHash, "hex");
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    username: string;
    role: Role;
  }): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
