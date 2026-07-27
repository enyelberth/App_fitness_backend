import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';
import { PaymentController } from './controllers/payment.controller';
import { StripeController } from './controllers/stripe.controller';
import { PayPalController } from './controllers/paypal.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { RefundsController } from './controllers/refunds.controller';
import { InvoicesController } from './controllers/invoices.controller';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { PayPalService } from './services/paypal.service';
import { SubscriptionService } from './services/subscription.service';
import { RefundsService } from './services/refunds.service';
import { InvoicesService } from './services/invoices.service';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [PaymentController, StripeController, PayPalController, SubscriptionController, RefundsController, InvoicesController],
  providers: [PaymentService, StripeService, PayPalService, SubscriptionService, RefundsService, InvoicesService],
  exports: [PaymentService, StripeService, PayPalService, SubscriptionService, RefundsService, InvoicesService],
})
export class PaymentsModule {}
