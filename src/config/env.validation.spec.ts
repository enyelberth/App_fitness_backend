import { validateEnvironment } from "./env.validation";

const validEnvironment = {
  DATABASE_URL: "postgresql://localhost/app",
  JWT_ACCESS_SECRET: "a".repeat(32),
  JWT_REFRESH_SECRET: "b".repeat(32),
  JWT_ACCESS_TTL_SECONDS: "900",
  JWT_REFRESH_TTL_SECONDS: "604800",
  CORS_ORIGINS: "http://localhost:3000",
  PORT: "4000",
};

describe("validateEnvironment", () => {
  it("normalizes numeric settings", () => {
    expect(validateEnvironment(validEnvironment)).toMatchObject({
      PORT: 4000,
      JWT_ACCESS_TTL_SECONDS: 900,
      JWT_REFRESH_TTL_SECONDS: 604800,
    });
  });

  it("rejects weak JWT secrets", () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        JWT_ACCESS_SECRET: "weak",
      }),
    ).toThrow("JWT_ACCESS_SECRET must contain at least 32 characters");
  });

  it("requires refresh tokens to outlive access tokens", () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        JWT_REFRESH_TTL_SECONDS: "900",
      }),
    ).toThrow("JWT_REFRESH_TTL_SECONDS must be greater than access TTL");
  });
});
