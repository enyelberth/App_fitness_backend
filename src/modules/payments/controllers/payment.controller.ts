import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PaymentService } from '../services/payment.service';
import { CreateCheckoutDto } from '../dto/payment.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private service: PaymentService) {}

  /**
   * POST - Crear checkout
   */
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create payment checkout' })
  async createCheckout(@CurrentUser() user: any, @Body() dto: CreateCheckoutDto) {
    return this.service.createCheckout(user.id, dto.amount, dto.type);
  }

  /**
   * GET - Obtener estado del pago
   */
  @Get('status/:orderId')
  @ApiOperation({ summary: 'Get payment status' })
  async getStatus(@Param('orderId') orderId: string) {
    return this.service.getPaymentStatus(orderId);
  }

  /**
   * POST - Simular webhook de pago completado
   * (En producción sería Stripe webhook)
   */
  @Post('webhook/complete/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete payment (webhook simulation)' })
  async completePayment(@Param('orderId') orderId: string) {
    return this.service.completePayment(orderId);
  }
}
