import { Module } from "@nestjs/common";

/**
 * Contexto reservado para moneda interna. Su ledger será independiente de
 * PayPal y sólo recibirá créditos desde pagos confirmados e idempotentes.
 */
@Module({})
export class EconomyModule {}
