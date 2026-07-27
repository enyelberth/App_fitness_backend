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
import { StripeService } from '../services/stripe.service';
import {
  StripeCheckoutDto,
  CreatePaymentIntentDto,
  ConfirmPaymentDto,
  RefundDto,
} from '../dtos/stripe-checkout.dto';

@Controller('payments/stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('checkout/session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @CurrentUser('sub') userId: string,
    @Body() dto: StripeCheckoutDto,
  ) {
    return this.stripeService.createCheckoutSession(
      userId,
      dto.productId,
      dto.amount,
      dto.currency,
    );
  }

  @Post('payment-intent/create')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.stripeService.createPaymentIntent(userId, dto.amount, dto.currency);
  }

  @Get('payment-intent/:intentId')
  @UseGuards(JwtAuthGuard)
  async getPaymentIntent(@Param('intentId') intentId: string) {
    return this.stripeService.getPaymentIntent(intentId);
  }

  @Post('payment-intent/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmPayment(
    @CurrentUser('sub') userId: string,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.stripeService.confirmPayment(dto.paymentIntentId, dto.paymentMethodId);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Body() dto: RefundDto) {
    return this.stripeService.refundPayment(dto.paymentIntentId, dto.amount);
  }

  @Post('webhook')
  @Public()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() rawBody: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    const isValid = await this.stripeService.validateWebhookSignature(rawBody, signature);

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Process webhook event
    return { received: true };
  }

  @Get('payment-methods')
  @UseGuards(JwtAuthGuard)
  async getPaymentMethods(@CurrentUser('sub') userId: string) {
    return this.stripeService.listPaymentMethods(userId);
  }

  @Post('payment-methods/:methodId/delete')
  @UseGuards(JwtAuthGuard)
  async deletePaymentMethod(@Param('methodId') methodId: string) {
    return this.stripeService.deletePaymentMethod(methodId);
  }

  @Post('payment-methods/:methodId/update')
  @UseGuards(JwtAuthGuard)
  async updatePaymentMethod(
    @Param('methodId') methodId: string,
    @Body() updates: { expMonth?: number; expYear?: number },
  ) {
    return this.stripeService.updatePaymentMethod(methodId, updates);
  }

  @Get('connect/info')
  @UseGuards(JwtAuthGuard)
  async getConnectInfo() {
    return this.stripeService.getStripeConnectInfo();
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async initiateTransfer(
    @Body() body: { amount: number; destination: string; currency?: string },
  ) {
    return this.stripeService.initiateTransfer(body.amount, body.destination, body.currency);
  }
}
