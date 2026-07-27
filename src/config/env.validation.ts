const REQUIRED = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_TTL_SECONDS",
  "JWT_REFRESH_TTL_SECONDS",
  "CORS_ORIGINS",
] as const;

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const missing = REQUIRED.filter((key) => {
    const value = config[key];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  for (const key of ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"] as const) {
    if (String(config[key]).length < 32) {
      throw new Error(`${key} must contain at least 32 characters`);
    }
  }

  const port = Number(config.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const accessTtl = Number(config.JWT_ACCESS_TTL_SECONDS);
  const refreshTtl = Number(config.JWT_REFRESH_TTL_SECONDS);
  if (!Number.isInteger(accessTtl) || accessTtl < 60) {
    throw new Error("JWT_ACCESS_TTL_SECONDS must be an integer of at least 60");
  }
  if (!Number.isInteger(refreshTtl) || refreshTtl <= accessTtl) {
    throw new Error("JWT_REFRESH_TTL_SECONDS must be greater than access TTL");
  }

  return {
    ...config,
    PORT: port,
    JWT_ACCESS_TTL_SECONDS: accessTtl,
    JWT_REFRESH_TTL_SECONDS: refreshTtl,
  };
}
