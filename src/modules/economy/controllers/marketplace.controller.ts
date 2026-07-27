import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { MarketplaceService } from '../services/marketplace.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Economy - Marketplace')
@Controller('economy/marketplace')
export class MarketplaceController {
  constructor(private service: MarketplaceService) {}

  /**
   * GET - Ver tienda disponible
   */
  @Get('shop')
  @ApiOperation({ summary: 'View shop items' })
  async getShop(@CurrentUser() user: any) {
    return this.service.getShop(user.id);
  }

  /**
   * POST - Comprar con coins
   */
  @Post('buy/coins/:cosmeticId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buy with coins' })
  async buyWithCoins(
    @Param('cosmeticId') cosmeticId: string,
    @CurrentUser() user: any,
  ) {
    return this.service.buyWithCoins(user.id, cosmeticId);
  }

  /**
   * POST - Comprar con gems
   */
  @Post('buy/gems/:cosmeticId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buy with gems' })
  async buyWithGems(
    @Param('cosmeticId') cosmeticId: string,
    @CurrentUser() user: any,
  ) {
    return this.service.buyWithGems(user.id, cosmeticId);
  }

  /**
   * GET - Mi inventario de compras
   */
  @Get('inventory')
  @ApiOperation({ summary: 'Get my purchased items' })
  async getInventory(@CurrentUser() user: any) {
    return this.service.getUserInventory(user.id);
  }
}
