import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { WalletService } from './wallet.service';

/**
 * Marketplace Service
 * Maneja compra/venta de cosmética
 */
@Injectable()
export class MarketplaceService {
  // Mock cosmetics shop
  private shop = [
    { cosmeticId: 'shirt-1', name: 'Blue Shirt', price: 100, gemPrice: null },
    { cosmeticId: 'pants-1', name: 'Black Pants', price: 100, gemPrice: null },
    { cosmeticId: 'shoes-1', name: 'Sport Shoes', price: 50, gemPrice: null },
    { cosmeticId: 'hat-1', name: 'Baseball Cap', price: 75, gemPrice: null },
    { cosmeticId: 'weapon-1', name: 'Gold Sword', price: null, gemPrice: 500 },
    { cosmeticId: 'weapon-2', name: 'Diamond Sword', price: null, gemPrice: 1000 },
  ];

  // User inventory (mock)
  private userInventory = new Map<string, Set<string>>();

  constructor(private walletService: WalletService) {}

  /**
   * Obtener tienda
   */
  async getShop(userId: string) {
    const inventory = this.userInventory.get(userId) || new Set();

    return this.shop.map((item) => ({
      ...item,
      owned: inventory.has(item.cosmeticId),
    }));
  }

  /**
   * Comprar con coins
   */
  async buyWithCoins(userId: string, cosmeticId: string) {
    const item = this.shop.find((s) => s.cosmeticId === cosmeticId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (!item.price) {
      throw new BadRequestException('This item is not available for coins');
    }

    // Verificar si ya lo tiene
    const inventory = this.userInventory.get(userId) || new Set();
    if (inventory.has(cosmeticId)) {
      throw new BadRequestException('You already own this item');
    }

    // Restar coins y agregar al inventario
    const wallet = await this.walletService.getWallet(userId);

    if (wallet.coins < item.price) {
      throw new BadRequestException('Insufficient coins');
    }

    // Simulación: en producción sería una transacción real
    await this.walletService.addCoins(userId, -item.price, 'SHOP', `Purchased: ${item.name}`);

    inventory.add(cosmeticId);
    this.userInventory.set(userId, inventory);

    return { success: true, message: `${item.name} purchased!` };
  }

  /**
   * Comprar con gems
   */
  async buyWithGems(userId: string, cosmeticId: string) {
    const item = this.shop.find((s) => s.cosmeticId === cosmeticId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (!item.gemPrice) {
      throw new BadRequestException('This item is not available for gems');
    }

    // Verificar si ya lo tiene
    const inventory = this.userInventory.get(userId) || new Set();
    if (inventory.has(cosmeticId)) {
      throw new BadRequestException('You already own this item');
    }

    const wallet = await this.walletService.getWallet(userId);

    if (wallet.gems < item.gemPrice) {
      throw new BadRequestException('Insufficient gems');
    }

    // Simulación
    await this.walletService.addGems(userId, -item.gemPrice, 'SHOP');

    inventory.add(cosmeticId);
    this.userInventory.set(userId, inventory);

    return { success: true, message: `${item.name} purchased!` };
  }

  /**
   * Obtener inventario del usuario
   */
  async getUserInventory(userId: string) {
    const inventory = this.userInventory.get(userId) || new Set();
    return Array.from(inventory);
  }
}
