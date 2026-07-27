import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { WalletService } from '../services/wallet.service';
import { WalletResponseDto, TransactionDto } from '../dto/wallet.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Economy - Wallet')
@Controller('economy/wallet')
export class WalletController {
  constructor(private service: WalletService) {}

  /**
   * GET - Obtener mi wallet
   */
  @Get()
  @ApiOperation({ summary: 'Get my wallet balance' })
  async getWallet(@CurrentUser() user: any): Promise<WalletResponseDto> {
    return this.service.getWallet(user.id);
  }

  /**
   * GET - Obtener transacciones
   */
  @Get('transactions')
  @ApiOperation({ summary: 'Get my transactions' })
  async getTransactions(
    @CurrentUser() user: any,
  ): Promise<TransactionDto[]> {
    return this.service.getTransactions(user.id);
  }
}
