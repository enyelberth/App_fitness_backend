# Arquitectura objetivo

Este backend se migrará de Express a NestJS de forma incremental. El dominio
principal es fitness; pagos y economía quedan como contextos separados para no
mezclar dinero real con una futura moneda interna.

## Módulos principales

```text
src/
├── common/                 # Guards, decoradores, filtros y utilidades compartidas
├── config/                 # Configuración y validación del ambiente
├── database/               # PrismaService y acceso a PostgreSQL
└── modules/
    ├── auth/               # Registro, login, JWT y refresh tokens
    ├── users/              # Cuenta y perfil fitness
    ├── workouts/           # Rutinas y ejercicios asignados
    ├── exercises/          # Catálogo de ejercicios y grupos musculares
    ├── progress/           # Historial, medidas y evolución
    ├── payments/
    │   └── paypal/         # Dinero real; órdenes y capturas de PayPal
    └── economy/            # Reservado para saldo/moneda interna
```

## Límites del dominio

- `payments` registra operaciones de dinero real y respuestas del proveedor.
- `economy` gestionará saldos y movimientos internos; nunca almacenará
  credenciales de PayPal ni asumirá que un crédito equivale a una moneda real.
- Una captura PayPal confirmada podrá originar una transacción de economía
  mediante un caso de uso explícito e idempotente.
- Fitness no dependerá directamente de PayPal.

## Código heredado

El código Express actual permanece temporalmente disponible durante la
migración. No se agregarán funcionalidades nuevas en `src/system`, `src/routes`
ni en los módulos antiguos. Cada ruta se retirará después de contar con su
equivalente NestJS y pruebas.

Los módulos de productos y Binance están fuera del alcance del producto. Los
modelos financieros actuales no deben reutilizarse sin rediseño: representan
cuentas bancarias, préstamos y monedas, no una economía de aplicación.

## Orden de implementación

1. Bootstrap, configuración validada, Prisma, manejo de errores y health check.
2. Usuarios y autenticación segura.
3. Rutinas, ejercicios y progreso.
4. Adaptador PayPal con importe recibido desde un caso de uso, webhooks e
   idempotencia.
5. Economía interna con ledger inmutable.
6. Eliminación final del código Express y modelos obsoletos.
