# Plan de migración esencial

## Decisiones

- NestJS será el framework de destino.
- PostgreSQL y Prisma se mantienen.
- PayPal se conserva dentro de `payments/paypal`.
- Finanzas se rediseñará como `economy`; no se copiarán directamente préstamos,
  cuentas bancarias ni transacciones antiguas.
- Productos, categorías comerciales y Binance se retirarán cuando la nueva
  aplicación pueda arrancar y los datos a conservar estén inventariados.

## Criterios mínimos antes de retirar Express

- Compilación y pruebas automatizadas correctas.
- Variables de entorno validadas al iniciar.
- Contraseñas con Argon2.
- Access tokens cortos y refresh tokens rotatorios almacenados como hash.
- Autorización por propietario/rol.
- DTOs validados y respuestas HTTP consistentes.
- Migración de datos ensayada sobre una copia de la base.
- Endpoints esenciales documentados en OpenAPI.

## Riesgos detectados

- El archivo de ejemplo incluía secretos reales: deben rotarse.
- El middleware JWT heredado extrae incorrectamente el token y compara mal la
  expiración.
- El servidor acepta CORS desde cualquier origen y usa un secreto de sesión
  escrito en el código.
- PayPal crea siempre una orden fija de USD 50 y confía en redirecciones GET;
  debe migrarse a DTOs, webhooks verificados e idempotencia.
- El esquema mezcla fitness, comercio y banca con identificadores incompatibles.
- Las guías entregadas describen archivos que no existen en este repositorio;
  son una referencia, no una implementación ya completada.
