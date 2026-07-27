import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { WalletResponseDto, TransactionDto } from '../dto/wallet.dto';
import { CharacterLeveledUpEvent } from '../../game/events/character-events';
import { PaymentCompletedEvent } from '../../payments/services/payment.service';

@Injectable()
export class WalletService implements OnModuleInit {
  private wallets = new Map(); // userId -> wallet
  private transactions = new Map(); // transactionId -> transaction

  constructor(private eventBus: EventBusService) {}

  /**
   * OnModuleInit: Registrar listeners
   */
  onModuleInit() {
    // Escuchar cuando personaje sube de nivel
    this.eventBus.on(CharacterLeveledUpEvent, (event) => {
      this.handleCharacterLeveledUp(event);
    });

    // Escuchar cuando se completa un pago
    this.eventBus.on(PaymentCompletedEvent, (event) => {
      this.handlePaymentCompleted(event);
    });
  }

  /**
   * Obtener o crear wallet
   */
  private getOrCreateWallet(userId: string) {
    if (!this.wallets.has(userId)) {
      this.wallets.set(userId, {
        userId,
        coins: 100, // Inicial: 100 coins
        gems: 0,
        updatedAt: new Date(),
      });
    }
    return this.wallets.get(userId);
  }

  /**
   * Obtener mi wallet
   */
  async getWallet(userId: string) {
    const wallet = this.getOrCreateWallet(userId);
    return new WalletResponseDto(wallet);
  }

  /**
   * Agregar coins
   */
  async addCoins(userId: string, amount: number, source: string, description: string) {
    const wallet = this.getOrCreateWallet(userId);
    wallet.coins += amount;
    wallet.updatedAt = new Date();

    // Registrar transacción
    this.recordTransaction(userId, 'COINS', amount, source, description);

    return new WalletResponseDto(wallet);
  }

  /**
   * Agregar gems (premium currency)
   */
  async addGems(userId: string, amount: number, source: string) {
    const wallet = this.getOrCreateWallet(userId);
    wallet.gems += amount;
    wallet.updatedAt = new Date();

    this.recordTransaction(userId, 'GEMS', amount, source, 'Gems purchased');

    return new WalletResponseDto(wallet);
  }

  /**
   * Obtener transacciones del usuario
   */
  async getTransactions(userId: string, limit = 20) {
    const userTransactions = Array.from(this.transactions.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return userTransactions.map((t) => new TransactionDto(t));
  }

  /**
   * Registrar transacción
   */
  private recordTransaction(
    userId: string,
    type: string,
    amount: number,
    source: string,
    description: string,
  ) {
    const transactionId = `tx_${Date.now()}_${Math.random()}`;
    this.transactions.set(transactionId, {
      id: transactionId,
      userId,
      type,
      amount,
      source,
      description,
      createdAt: new Date(),
    });
  }

  /**
   * Handler: Cuando personaje sube de nivel
   * Escucha CharacterLeveledUpEvent de Game module
   */
  private async handleCharacterLeveledUp(event: CharacterLeveledUpEvent) {
    try {
      console.log(
        `[Economy] Handling CharacterLeveledUpEvent for user ${event.userId}, level: ${event.newLevel}`,
      );

      // Recompensar coins por level up
      const bonusCoins = event.newLevel * 25; // 25 coins por level
      await this.addCoins(event.userId, bonusCoins, 'LEVEL_UP', `Leveled up to level ${event.newLevel}`);

      console.log(`[Economy] Awarded ${bonusCoins} coins to user ${event.userId}`);
    } catch (error) {
      console.error(`[Economy] Error handling CharacterLeveledUpEvent:`, error);
    }
  }

  /**
   * Handler: Cuando se completa un pago
   * Escucha PaymentCompletedEvent de Payments module
   */
  private async handlePaymentCompleted(event: PaymentCompletedEvent) {
    try {
      console.log(`[Economy] Handling PaymentCompletedEvent for user ${event.userId}, amount: ${event.amount}`);

      // Convertir dólares a gems (1 USD = 100 gems)
      const gems = Math.floor(event.amount * 100);
      await this.addGems(event.userId, gems, event.type);

      console.log(`[Economy] Awarded ${gems} gems to user ${event.userId}`);
    } catch (error) {
      console.error(`[Economy] Error handling PaymentCompletedEvent:`, error);
    }
  }
}
