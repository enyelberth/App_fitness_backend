# App Fitness Backend

Migración incremental de Express a NestJS con PostgreSQL y Prisma.

## Estado

La base NestJS, la validación de ambiente, Swagger, Helmet, CORS, Prisma,
usuarios, autenticación y el health check ya están preparados. El código
Express anterior permanece temporalmente en el repositorio mientras se migran
sus rutas.

Los contextos futuros están separados:

- `payments/paypal`: pagos con dinero real.
- `economy`: futura moneda interna, saldos y movimientos.

Consulta [la arquitectura](docs/ARCHITECTURE.md) y
[el plan de migración](docs/MIGRATION_PLAN.md) antes de implementar módulos.

## Preparación

1. Copia `.env.example` a `.env`.
2. Sustituye todos los secretos de ejemplo.
3. Levanta PostgreSQL con `docker compose up -d`.
4. Instala dependencias con `pnpm install`.
5. Genera Prisma con `pnpm db:generate`.
6. Inicia NestJS con `pnpm start:dev`.

La API usa el prefijo `/api/v1`, Swagger está en `/docs` y el health check en
`/api/v1/health`.

## Endpoints implementados

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me/profile`
- `GET /api/v1/health`

El esquema nuevo es aditivo, pero todavía no debe aplicarse directamente a
producción. Revisa [la estrategia de migración](prisma/SAFE_MIGRATION.md).

## Seguridad

Las credenciales que anteriormente aparecían en `.env.example` deben rotarse en
Supabase/PostgreSQL y PayPal. Eliminarlas del archivo actual no las elimina del
historial ni invalida las claves existentes.

## Aplicación heredada

Durante la transición se puede iniciar Express mediante `pnpm legacy:dev`. No
se deben agregar nuevas funcionalidades a esa estructura.
