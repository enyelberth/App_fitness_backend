import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';

/**
 * Evento: Pago completado
 */
export class PaymentCompletedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly type: string, // BATTLE_PASS, GEMS, COSMETIC
    public readonly timestamp: Date,
  ) {}
}

@Injectable()
export class PaymentService {
  private payments = new Map(); // Mock database

  constructor(private eventBus: EventBusService) {}

  /**
   * Crear checkout (mock - en realidad usarías Stripe)
   */
  async createCheckout(userId: string, amount: number, type: string) {
    const orderId = `order_${Date.now()}`;

    const payment = {
      id: orderId,
      userId,
      type,
      amount,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.payments.set(orderId, payment);

    return {
      checkoutUrl: `https://checkout.example.com/${orderId}`,
      orderId,
    };
  }

  /**
   * Completar pago (simulación de webhook de Stripe)
   */
  async completePayment(orderId: string) {
    const payment = this.payments.get(orderId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'COMPLETED';

    // EMITIR evento para Economy module
    this.eventBus.emit(
      new PaymentCompletedEvent(
        orderId,
        payment.userId,
        payment.amount,
        payment.type,
        new Date(),
      ),
    );

    return payment;
  }

  /**
   * Obtener estado del pago
   */
  async getPaymentStatus(orderId: string) {
    const payment = this.payments.get(orderId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }
}
