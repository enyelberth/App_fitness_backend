import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CosmeticService } from '../services/cosmetic.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Game - Cosmetics')
@Controller('game/cosmetics')
export class CosmeticController {
  constructor(private service: CosmeticService) {}

  /**
   * GET - Listar cosmética disponible
   */
  @Get()
  @ApiOperation({ summary: 'List available cosmetics' })
  async getAll(@Query('skip') skip = 0, @Query('take') take = 20) {
    return this.service.getAll(skip, take);
  }

  /**
   * GET - Cosmética por tipo
   */
  @Get('type/:type')
  @ApiOperation({ summary: 'Get cosmetics by type' })
  async getByType(@Param('type') type: string) {
    return this.service.getByType(type);
  }

  /**
   * GET - Cosmética por rareza
   */
  @Get('rarity/:rarity')
  @ApiOperation({ summary: 'Get cosmetics by rarity' })
  async getByRarity(@Param('rarity') rarity: string) {
    return this.service.getByRarity(rarity);
  }

  /**
   * GET - Buscar cosmética
   */
  @Get('search')
  @ApiOperation({ summary: 'Search cosmetics' })
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return { data: [] };
    }
    return this.service.search(query);
  }

  /**
   * GET - Mi inventario
   */
  @Get('inventory/me')
  @ApiOperation({ summary: 'Get my inventory' })
  async getInventory(@CurrentUser() user: any) {
    return this.service.getUserInventory(user.id);
  }

  /**
   * POST - Equipar cosmética
   */
  @Post('inventory/:cosmeticId/equip')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Equip cosmetic' })
  async equipCosmetic(
    @Param('cosmeticId') cosmeticId: string,
    @CurrentUser() user: any,
  ) {
    return this.service.equipCosmetic(user.id, cosmeticId);
  }

  /**
   * POST - Desequipar cosmética
   */
  @Post('inventory/:cosmeticId/unequip')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unequip cosmetic' })
  async unequipCosmetic(
    @Param('cosmeticId') cosmeticId: string,
    @CurrentUser() user: any,
  ) {
    return this.service.unequipCosmetic(user.id, cosmeticId);
  }

  /**
   * POST - Agregar al inventario (reward)
   */
  @Post('inventory/:cosmeticId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add cosmetic to inventory' })
  async addToInventory(
    @Param('cosmeticId') cosmeticId: string,
    @CurrentUser() user: any,
  ) {
    return this.service.addToInventory(user.id, cosmeticId);
  }
}
