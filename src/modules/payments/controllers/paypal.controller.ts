import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { PayPalService } from '../services/paypal.service';

@Controller('payments/paypal')
export class PayPalController {
  constructor(private paypalService: PayPalService) {}

  @Post('order/create')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() body: { amount: number; currency?: string; description?: string },
  ) {
    return this.paypalService.createOrder(
      userId,
      body.amount,
      body.currency,
      body.description,
    );
  }

  @Post('order/:orderId/capture')
  @UseGuards(JwtAuthGuard)
  async captureOrder(
    @Param('orderId') orderId: string,
    @Body() body: { payerId: string },
  ) {
    return this.paypalService.captureOrder(orderId, body.payerId);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  async getOrderDetails(@Param('orderId') orderId: string) {
    const order = await this.paypalService.getOrderDetails(orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  @Post('order/:orderId/refund')
  @UseGuards(JwtAuthGuard)
  async refundOrder(@Param('orderId') orderId: string, @Body() body?: { amount?: number }) {
    return this.paypalService.refundOrder(orderId, body?.amount);
  }

  @Post('webhook')
  @Public()
  async handleWebhook(
    @Headers('paypal-transmission-id') transmissionId: string,
    @Headers('paypal-transmission-time') transmissionTime: string,
    @Headers('paypal-cert-url') certUrl: string,
    @Headers('paypal-auth-algo') authAlgo: string,
    @Headers('paypal-transmission-sig') signature: string,
    @Body() body: any,
  ) {
    if (!transmissionId || !signature) {
      throw new BadRequestException('Missing PayPal signature headers');
    }

    const isValid = await this.paypalService.validateWebhookSignature(
      transmissionId,
      transmissionTime,
      certUrl,
      JSON.stringify(body),
      signature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid PayPal signature');
    }

    await this.paypalService.handleWebhookEvent(body.event_type, body.resource);

    return { received: true };
  }

  @Get('subscription/plans')
  @Public()
  async getSubscriptionPlans() {
    return this.paypalService.getSubscriptionPlans();
  }

  @Post('subscription/create')
  @UseGuards(JwtAuthGuard)
  async createSubscription(
    @CurrentUser('sub') userId: string,
    @Body() body: { planId: string; payerEmail: string },
  ) {
    return this.paypalService.createSubscription(userId, body.planId, body.payerEmail);
  }

  @Get('subscription/:subscriptionId')
  @UseGuards(JwtAuthGuard)
  async getSubscriptionDetails(@Param('subscriptionId') subscriptionId: string) {
    return this.paypalService.getSubscriptionDetails(subscriptionId);
  }

  @Post('subscription/:subscriptionId/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.paypalService.cancelSubscription(subscriptionId);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async listUserTransactions(@CurrentUser('sub') userId: string) {
    return this.paypalService.listUserTransactions(userId);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @Body() body: { orderId: string; expectedAmount: number },
  ) {
    const isValid = await this.paypalService.verifyPayment(body.orderId, body.expectedAmount);

    return {
      orderId: body.orderId,
      isValid,
      message: isValid ? 'Payment verified' : 'Payment verification failed',
    };
  }
}
