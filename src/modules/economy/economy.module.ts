import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';
import { WalletController } from './controllers/wallet.controller';
import { MarketplaceController } from './controllers/marketplace.controller';
import { WalletService } from './services/wallet.service';
import { MarketplaceService } from './services/marketplace.service';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [WalletController, MarketplaceController],
  providers: [WalletService, MarketplaceService],
  exports: [WalletService, MarketplaceService],
})
export class EconomyModule {}
