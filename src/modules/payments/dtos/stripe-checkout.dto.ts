import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class StripeCheckoutDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(0.5)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'usd';
}

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.5)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'usd';

  @IsString()
  description: string;
}

export class ConfirmPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsString()
  paymentMethodId: string;
}

export class RefundDto {
  @IsString()
  paymentIntentId: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
