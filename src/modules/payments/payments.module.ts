import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';
import { PaymentController } from './controllers/payment.controller';
import { StripeController } from './controllers/stripe.controller';
import { PayPalController } from './controllers/paypal.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { PayPalService } from './services/paypal.service';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [PaymentController, StripeController, PayPalController, SubscriptionController],
  providers: [PaymentService, StripeService, PayPalService, SubscriptionService],
  exports: [PaymentService, StripeService, PayPalService, SubscriptionService],
})
export class PaymentsModule {}
