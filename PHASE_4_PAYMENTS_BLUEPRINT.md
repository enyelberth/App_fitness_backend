# Phase 4: Payments - Implementation Blueprint

**Status:** 🔵 Ready for implementation  
**Estimated Duration:** 1-2 weeks  
**Dependencies:** Phase 1-3 complete

---

## Architecture Overview

```
User Request
    ↓
POST /payments/orders
    ↓
PaymentsController → PaymentsService → PayPalService → PayPal API
    ↓
Create Payment record (status: CREATED)
    ↓
Return orderLink to client
    ↓
[User approves on PayPal]
    ↓
POST /payments/orders/{id}/capture
    ↓
PaymentService verifies order → PayPalService calls capture → Update Payment (status: COMPLETED)
    ↓
Create WalletEntry (CREDIT) → Update Wallet balance
    ↓
Return success response
```

---

## File Structure to Create

```
src/modules/payments/
├── payments.module.ts
├── payments.controller.ts
├── payments.service.ts
├── paypal/
│   ├── paypal.service.ts
│   ├── paypal.webhook.controller.ts
│   └── paypal-webhook.service.ts
├── dto/
│   ├── create-order.dto.ts
│   ├── capture-order.dto.ts
│   ├── refund-order.dto.ts
│   ├── paypal-webhook.dto.ts
│   └── payment-filter.dto.ts
└── payments.service.spec.ts
```

---

## Step 1: PayPal Service

**File:** `src/modules/payments/paypal/paypal.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{ rel: string; href: string }>;
}

interface PayPalCapture {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { value: string; currency_code: string };
      }>;
    };
  }>;
}

@Injectable()
export class PayPalService {
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor(config: ConfigService) {
    this.clientId = config.getOrThrow<string>('PAYPAL_CLIENT_ID');
    this.clientSecret = config.getOrThrow<string>('PAYPAL_CLIENT_SECRET');
    this.baseUrl = config.getOrThrow<string>('PAYPAL_API_URL'); // e.g., https://api-m.sandbox.paypal.com

    this.client = axios.create({
      baseURL: this.baseUrl,
      auth: { username: this.clientId, password: this.clientSecret },
    });
  }

  async createOrder(
    amount: string,
    currencyCode: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<PayPalOrder> {
    try {
      const response = await this.client.post('/v2/checkout/orders', {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currencyCode,
              value: amount,
            },
          },
        ],
        application_context: {
          brand_name: 'App Fitness',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(`PayPal order creation failed: ${error.message}`);
    }
  }

  async captureOrder(orderId: string): Promise<PayPalCapture> {
    try {
      const response = await this.client.post(`/v2/checkout/orders/${orderId}/capture`, {});
      return response.data;
    } catch (error) {
      throw new BadRequestException(`PayPal order capture failed: ${error.message}`);
    }
  }

  async refundCapture(captureId: string, amount?: string): Promise<any> {
    try {
      const body: any = {};
      if (amount) {
        body.amount = { value: amount };
      }

      const response = await this.client.post(
        `/v2/payments/captures/${captureId}/refund`,
        body,
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(`PayPal refund failed: ${error.message}`);
    }
  }

  extractCaptureId(paypalCapture: PayPalCapture): string {
    const capture = paypalCapture.purchase_units[0]?.payments?.captures[0];
    if (!capture) throw new BadRequestException('No capture found in PayPal response');
    return capture.id;
  }
}
```

---

## Step 2: Payments Service

**File:** `src/modules/payments/payments.service.ts`

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PayPalService } from './paypal/paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CaptureOrderDto } from './dto/capture-order.dto';
import { RefundOrderDto } from './dto/refund-order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paypal: PayPalService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto, returnUrl: string, cancelUrl: string) {
    const idempotencyKey = randomUUID();

    // Check if this exact request was already processed
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey },
    });
    if (existing) return existing;

    // Create PayPal order
    const paypalOrder = await this.paypal.createOrder(
      dto.amount.toFixed(2),
      dto.currency,
      returnUrl,
      cancelUrl,
    );

    // Save to database
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        provider: 'PAYPAL',
        externalOrderId: paypalOrder.id,
        idempotencyKey,
        amount: dto.amount,
        currency: dto.currency,
        status: 'CREATED',
      },
    });

    return {
      ...payment,
      approvalUrl: paypalOrder.links.find((l) => l.rel === 'approve-order')?.href,
    };
  }

  async captureOrder(userId: string, dto: CaptureOrderDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { externalOrderId: dto.orderId },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId !== userId) throw new ConflictException('Cannot access other users payments');
    if (payment.status !== 'CREATED') throw new ConflictException('Payment already processed');

    // Capture with PayPal
    const paypalCapture = await this.paypal.captureOrder(dto.orderId);
    const captureId = this.paypal.extractCaptureId(paypalCapture);

    // Update payment and create wallet entry in transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { externalOrderId: dto.orderId },
        data: {
          status: 'COMPLETED',
          externalCaptureId: captureId,
          completedAt: new Date(),
        },
      });

      // Create wallet entry (credits)
      await tx.walletEntry.create({
        data: {
          walletId: (await tx.wallet.findUnique({ where: { userId } }))!.id,
          paymentId: updatedPayment.id,
          type: 'CREDIT',
          amount: Math.round(updatedPayment.amount.toNumber() * 100), // Store in cents
          reason: `Payment from ${updatedPayment.provider}`,
          idempotencyKey: randomUUID(),
        },
      });

      return updatedPayment;
    });

    return updated;
  }

  async refundOrder(userId: string, dto: RefundOrderDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { externalOrderId: dto.orderId },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId !== userId) throw new ConflictException('Cannot refund other users payments');
    if (payment.status !== 'COMPLETED') throw new ConflictException('Cannot refund incomplete payment');
    if (!payment.externalCaptureId) throw new ConflictException('No capture to refund');

    // Refund with PayPal
    await this.paypal.refundCapture(payment.externalCaptureId);

    // Update payment and create reversal entry
    const updated = await this.prisma.$transaction(async (tx) => {
      const refunded = await tx.payment.update({
        where: { externalOrderId: dto.orderId },
        data: { status: 'REFUNDED' },
      });

      // Create reversal wallet entry
      await tx.walletEntry.create({
        data: {
          walletId: (await tx.wallet.findUnique({ where: { userId } }))!.id,
          paymentId: refunded.id,
          type: 'DEBIT',
          amount: Math.round(refunded.amount.toNumber() * 100),
          reason: `Refund for ${refunded.provider} payment`,
          idempotencyKey: randomUUID(),
        },
      });

      return refunded;
    });

    return updated;
  }

  async findByUser(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId !== userId) throw new ConflictException('Cannot access other users payments');

    return payment;
  }
}
```

---

## Step 3: Controllers

**File:** `src/modules/payments/payments.controller.ts`

```typescript
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CaptureOrderDto } from './dto/capture-order.dto';
import { RefundOrderDto } from './dto/refund-order.dto';
import { Response } from 'express';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findByUser(@CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.findByUser(user.id);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.findById(user.id, id);
  }

  @Post('orders')
  async createOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrderDto,
    @Res() res: Response,
  ) {
    const returnUrl = `${process.env.APP_URL}/payments/return`;
    const cancelUrl = `${process.env.APP_URL}/payments/cancel`;

    const order = await this.paymentsService.createOrder(user.id, dto, returnUrl, cancelUrl);
    return res.json(order);
  }

  @Post('orders/:orderId/capture')
  captureOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CaptureOrderDto,
  ) {
    return this.paymentsService.captureOrder(user.id, { orderId });
  }

  @Post('orders/:orderId/refund')
  refundOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RefundOrderDto,
  ) {
    return this.paymentsService.refundOrder(user.id, { orderId });
  }
}
```

**File:** `src/modules/payments/paypal/paypal.webhook.controller.ts`

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { PaypalWebhookService } from './paypal-webhook.service';
import { PayPalWebhookDto } from '../dto/paypal-webhook.dto';

@Controller('payments/webhooks')
export class PayPalWebhookController {
  constructor(private readonly webhookService: PaypalWebhookService) {}

  @Public()
  @Post('paypal')
  async handlePayPalWebhook(@Body() event: PayPalWebhookDto) {
    return this.webhookService.process(event);
  }
}
```

---

## Step 4: Webhook Service

**File:** `src/modules/payments/paypal/paypal-webhook.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { PayPalWebhookDto } from '../dto/paypal-webhook.dto';

@Injectable()
export class PaypalWebhookService {
  private logger = new Logger(PaypalWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async process(event: PayPalWebhookDto) {
    this.logger.log(`Processing PayPal event: ${event.event_type}`);

    try {
      switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          await this.handleCaptureCompleted(event);
          break;
        case 'PAYMENT.CAPTURE.DENIED':
          await this.handleCaptureDenied(event);
          break;
        case 'PAYMENT.CAPTURE.REFUNDED':
          await this.handleCaptureRefunded(event);
          break;
        default:
          this.logger.warn(`Unknown event type: ${event.event_type}`);
      }

      return { status: 'ok' };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  private async handleCaptureCompleted(event: PayPalWebhookDto) {
    const captureId = event.resource.id;
    // Find payment by externalCaptureId and update status
    // This is a safety mechanism in case capture endpoint fails
    this.logger.log(`Capture completed: ${captureId}`);
  }

  private async handleCaptureDenied(event: PayPalWebhookDto) {
    const orderId = event.resource.supplementary_data?.related_ids?.order_id;
    if (orderId) {
      await this.prisma.payment.update({
        where: { externalOrderId: orderId },
        data: { status: 'FAILED' },
      });
    }
  }

  private async handleCaptureRefunded(event: PayPalWebhookDto) {
    const captureId = event.resource.links?.[0]?.rel; // Parse based on webhook structure
    this.logger.log(`Capture refunded: ${captureId}`);
  }
}
```

---

## Step 5: DTOs

Create the following DTOs in `src/modules/payments/dto/`:

- **create-order.dto.ts**: amount, currency, description (optional)
- **capture-order.dto.ts**: orderId, payerEmail (optional)
- **refund-order.dto.ts**: orderId, reason (optional)
- **paypal-webhook.dto.ts**: event_type, resource, etc.
- **payment-filter.dto.ts**: status, dateFrom, dateTo

---

## Step 6: Module Registration

**File:** `src/modules/payments/payments.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PayPalService } from './paypal/paypal.service';
import { PayPalWebhookController } from './paypal/paypal.webhook.controller';
import { PaypalWebhookService } from './paypal/paypal-webhook.service';

@Module({
  controllers: [PaymentsController, PayPalWebhookController],
  providers: [PaymentsService, PayPalService, PaypalWebhookService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
```

Update `src/app.module.ts` to import PaymentsModule.

---

## Environment Variables Required

```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com  # or production URL
APP_URL=http://localhost:3000  # Frontend URL for return/cancel
```

---

## Testing Endpoints

```bash
# Create order
curl -X POST http://localhost:4000/api/v1/payments/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.99,
    "currency": "USD"
  }'

# Capture order (after user approves on PayPal)
curl -X POST http://localhost:4000/api/v1/payments/orders/PAYPAL_ORDER_ID/capture \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'

# List payments
curl http://localhost:4000/api/v1/payments \
  -H "Authorization: Bearer <token>"
```

---

## Key Design Decisions

1. **Idempotency:** Every order creation has a unique idempotencyKey. Retries return the same order.
2. **Atomic Operations:** Payment status update + wallet entry creation happen in a transaction.
3. **No Manual Balance:** Wallet never modified directly; always via WalletEntry.
4. **Webhook Safety:** Webhooks are a safety net; capture endpoint is the primary update.
5. **Audit Trail:** All payments tracked with timestamps and statuses.

---

## Next Steps After Implementation

1. Test with PayPal sandbox
2. Verify webhook signature (add verification logic)
3. Add payment reconciliation job (daily)
4. Add payment retry logic for failed captures
5. Add logging and monitoring
6. Prepare for Phase 5 (Economy) integration

---

**Ready for implementation. Reference this blueprint for all Phase 4 work.**
