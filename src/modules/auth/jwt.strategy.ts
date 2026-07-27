import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Role } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedUser } from "../../common/auth/authenticated-user";
import { PrismaService } from "../../database/prisma.service";

interface AccessPayload {
  sub: string;
  role: Role;
  type: "access";
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });
  }

  async validate(payload: AccessPayload): Promise<AuthenticatedUser> {
    if (payload.type !== "access") throw new UnauthorizedException();
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true, email: true, username: true, role: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
