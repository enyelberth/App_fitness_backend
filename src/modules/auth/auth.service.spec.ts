import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import * as argon2 from "argon2";
import { AuthService } from "./auth.service";

jest.mock("argon2", () => ({
  argon2id: 2,
  hash: jest.fn(),
  verify: jest.fn(),
}));

const config = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string | number> = {
      JWT_ACCESS_SECRET: "a".repeat(32),
      JWT_REFRESH_SECRET: "b".repeat(32),
      JWT_ACCESS_TTL_SECONDS: 900,
      JWT_REFRESH_TTL_SECONDS: 604800,
    };
    return values[key];
  }),
} as unknown as ConfigService;

describe("AuthService", () => {
  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as unknown as JwtService;

  function makePrisma() {
    return {
      user: {
        findFirst: jest.fn(),
      },
      authSession: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };
  }

  beforeEach(() => jest.clearAllMocks());

  it("rejects duplicate registration before hashing a password", async () => {
    const prisma = makePrisma();
    prisma.user.findFirst.mockResolvedValue({ id: "existing" });
    const service = new AuthService(prisma as never, jwt, config);

    await expect(
      service.register({
        email: "USER@example.com",
        username: "Existing",
        password: "ValidPass1!",
      }),
    ).rejects.toMatchObject({ status: 409 });
    expect(argon2.hash).not.toHaveBeenCalled();
  });

  it("returns the same error for missing users and invalid passwords", async () => {
    const prisma = makePrisma();
    prisma.user.findFirst.mockResolvedValue(null);
    const service = new AuthService(prisma as never, jwt, config);

    await expect(
      service.login({ identifier: "missing@example.com", password: "wrong" }),
    ).rejects.toMatchObject({
      status: 401,
      message: "Invalid credentials",
    });
  });

  it("revokes a token family when a rotated refresh token is reused", async () => {
    const prisma = makePrisma();
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: "user-1",
      sid: "session-1",
      family: "family-1",
      type: "refresh",
    });
    prisma.authSession.findUnique.mockResolvedValue({
      id: "session-1",
      userId: "user-1",
      familyId: "family-1",
      refreshTokenHash: "00".repeat(32),
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
      user: {
        id: "user-1",
        email: "user@example.com",
        username: "user",
        role: Role.USER,
        deletedAt: null,
      },
    });
    prisma.authSession.updateMany.mockResolvedValue({ count: 1 });
    const service = new AuthService(prisma as never, jwt, config);

    await expect(service.refresh("header.payload.signature")).rejects.toMatchObject(
      {
        status: 401,
        message: "Refresh token reuse detected",
      },
    );
    expect(prisma.authSession.updateMany).toHaveBeenCalledWith({
      where: { familyId: "family-1", revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });
});
