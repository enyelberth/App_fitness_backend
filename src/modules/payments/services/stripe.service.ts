import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface StripeCheckoutSession {
  id: string;
  url: string;
  clientSecret: string;
  status: 'open' | 'complete' | 'expired';
}

export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'succeeded' | 'processing';
}

@Injectable()
export class StripeService {
  private mockPaymentIntents: Map<string, StripePaymentIntent> = new Map();

  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(
    userId: string,
    productId: string,
    amount: number,
    currency: string = 'usd',
  ): Promise<StripeCheckoutSession> {
    // In production, use real Stripe SDK: import Stripe from 'stripe'
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Mock implementation for MVP
    const sessionId = 'cs_test_' + Math.random().toString(36).substr(2, 24);

    return {
      id: sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      clientSecret: `pi_test_${Math.random().toString(36).substr(2, 24)}`,
      status: 'open',
    };
  }

  async createPaymentIntent(
    userId: string,
    amount: number,
    currency: string = 'usd',
  ): Promise<StripePaymentIntent> {
    // In production:
    // const intent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Stripe expects cents
    //   currency,
    //   metadata: { userId },
    // });

    const intentId = 'pi_test_' + Math.random().toString(36).substr(2, 24);
    const intent: StripePaymentIntent = {
      id: intentId,
      clientSecret: `${intentId}_secret_${Math.random().toString(36).substr(2, 32)}`,
      amount,
      currency,
      status: 'requires_payment_method',
    };

    this.mockPaymentIntents.set(intentId, intent);

    return intent;
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<{ status: string; message: string }> {
    // In production:
    // const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
    //   payment_method: paymentMethodId,
    // });

    const intent = this.mockPaymentIntents.get(paymentIntentId);

    if (!intent) {
      throw new BadRequestException('Payment intent not found');
    }

    // Mock successful payment
    intent.status = 'succeeded';

    return {
      status: 'succeeded',
      message: 'Payment processed successfully',
    };
  }

  async getPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    // In production:
    // const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const intent = this.mockPaymentIntents.get(paymentIntentId);

    if (!intent) {
      throw new BadRequestException('Payment intent not found');
    }

    return intent;
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
  ): Promise<{ status: string; refundId: string }> {
    // In production:
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   amount: amount ? Math.round(amount * 100) : undefined,
    // });

    const intent = this.mockPaymentIntents.get(paymentIntentId);

    if (!intent || intent.status !== 'succeeded') {
      throw new BadRequestException('Cannot refund this payment');
    }

    const refundId = 're_test_' + Math.random().toString(36).substr(2, 24);

    return {
      status: 'refunded',
      refundId,
    };
  }

  async validateWebhookSignature(
    body: string,
    signature: string,
  ): Promise<boolean> {
    // In production:
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    // Mock implementation
    return signature && body ? true : false;
  }

  async handlePaymentSucceeded(paymentIntentId: string): Promise<void> {
    // Update payment status in database
    const intent = this.mockPaymentIntents.get(paymentIntentId);

    if (intent) {
      // Save to database
      console.log(`Payment ${paymentIntentId} succeeded for amount ${intent.amount}`);
    }
  }

  async handlePaymentFailed(paymentIntentId: string, errorMessage: string): Promise<void> {
    // Handle payment failure
    console.log(`Payment ${paymentIntentId} failed: ${errorMessage}`);
  }

  async listPaymentMethods(userId: string) {
    // In production:
    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: userId,
    //   type: 'card',
    // });

    // Mock implementation
    return {
      userId,
      paymentMethods: [
        {
          id: 'pm_test_123',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025,
          },
          isDefault: true,
        },
      ],
    };
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<{ status: string }> {
    // In production:
    // await stripe.paymentMethods.detach(paymentMethodId);

    return { status: 'deleted' };
  }

  async updatePaymentMethod(
    paymentMethodId: string,
    updates: { expMonth?: number; expYear?: number },
  ) {
    // In production:
    // const paymentMethod = await stripe.paymentMethods.update(paymentMethodId, updates);

    return {
      id: paymentMethodId,
      updated: true,
      updates,
    };
  }

  async getStripeConnectInfo() {
    // For seller payouts
    return {
      connectedAccountId: 'acct_test_connect',
      status: 'verified',
      payoutSchedule: 'daily',
      nextPayout: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  async initiateTransfer(
    amount: number,
    destination: string,
    currency: string = 'usd',
  ) {
    // For marketplace transfers
    return {
      id: 'tr_test_' + Math.random().toString(36).substr(2, 24),
      amount,
      destination,
      status: 'succeeded',
      created: new Date(),
    };
  }
}
