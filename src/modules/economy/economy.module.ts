import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class EconomyModule {}
