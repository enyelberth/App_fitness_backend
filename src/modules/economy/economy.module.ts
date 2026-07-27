import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';
import { WalletController } from './controllers/wallet.controller';
import { MarketplaceController } from './controllers/marketplace.controller';
import { TradingController } from './controllers/trading.controller';
import { AuctionHouseController } from './controllers/auction-house.controller';
import { WalletService } from './services/wallet.service';
import { MarketplaceService } from './services/marketplace.service';
import { TradingService } from './services/trading.service';
import { AuctionHouseService } from './services/auction-house.service';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [WalletController, MarketplaceController, TradingController, AuctionHouseController],
  providers: [WalletService, MarketplaceService, TradingService, AuctionHouseService],
  exports: [WalletService, MarketplaceService, TradingService, AuctionHouseService],
})
export class EconomyModule {}
