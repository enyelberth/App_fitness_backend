import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty({
    description: 'Tipo de pago',
    enum: ['BATTLE_PASS', 'GEMS', 'COSMETIC'],
    example: 'BATTLE_PASS',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Cantidad a pagar en USD',
    example: 9.99,
  })
  @IsNumber()
  @Min(0.99)
  @IsNotEmpty()
  amount: number;
}

export class PaymentResponseDto {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string; // PENDING, COMPLETED, FAILED
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.amount = data.amount;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}
