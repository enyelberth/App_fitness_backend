import { Module } from "@nestjs/common";

/**
 * El adaptador PayPal se implementará después de autenticación.
 * No importa el servicio Express heredado porque usa importes fijos y no
 * verifica webhooks ni idempotencia.
 */
@Module({})
export class PaypalModule {}
