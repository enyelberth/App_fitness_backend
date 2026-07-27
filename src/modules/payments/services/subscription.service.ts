import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface BattlePassTier {
  tier: number;
  requiredXP: number;
  freeReward: string;
  premiumReward: string;
}

export interface BattlePass {
  id: string;
  userId: string;
  season: number;
  tier: number;
  currentXP: number;
  isPremium: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'COMPLETED';
  startDate: Date;
  endDate: Date;
  tiers: BattlePassTier[];
}

@Injectable()
export class SubscriptionService {
  private battlePasses: Map<string, BattlePass> = new Map();

  constructor(private prisma: PrismaService) {}

  async getBattlePassInfo(userId: string): Promise<BattlePass | null> {
    // En producción, obtener de base de datos
    const key = `bp_${userId}_season_1`;
    return this.battlePasses.get(key) || null;
  }

  async purchaseBattlePass(userId: string, season: number): Promise<{ success: boolean; battlePass: BattlePass }> {
    const bpKey = `bp_${userId}_season_${season}`;

    let battlePass = this.battlePasses.get(bpKey);

    if (!battlePass) {
      battlePass = {
        id: bpKey,
        userId,
        season,
        tier: 1,
        currentXP: 0,
        isPremium: true,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 months
        tiers: this.generateBattlePassTiers(),
      };

      this.battlePasses.set(bpKey, battlePass);
    } else if (battlePass.isPremium) {
      throw new BadRequestException('Battle Pass already purchased');
    } else {
      battlePass.isPremium = true;
    }

    return {
      success: true,
      battlePass,
    };
  }

  async upgradeBattlePassTier(userId: string, season: number, newTier: number) {
    const bpKey = `bp_${userId}_season_${season}`;
    const battlePass = this.battlePasses.get(bpKey);

    if (!battlePass) {
      throw new BadRequestException('Battle Pass not found');
    }

    if (newTier > 100) {
      throw new BadRequestException('Max tier is 100');
    }

    const currentTier = battlePass.tier;
    if (newTier <= currentTier) {
      throw new BadRequestException('Can only upgrade to higher tiers');
    }

    const tierCost = (newTier - currentTier) * 150; // 150 gems per tier

    battlePass.tier = newTier;

    return {
      success: true,
      newTier,
      gemsCost: tierCost,
      message: `Battle Pass upgraded to tier ${newTier}`,
    };
  }

  async addBattlePassXP(userId: string, season: number, xp: number) {
    const bpKey = `bp_${userId}_season_${season}`;
    let battlePass = this.battlePasses.get(bpKey);

    if (!battlePass) {
      battlePass = {
        id: bpKey,
        userId,
        season,
        tier: 1,
        currentXP: 0,
        isPremium: false,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
        tiers: this.generateBattlePassTiers(),
      };
      this.battlePasses.set(bpKey, battlePass);
    }

    battlePass.currentXP += xp;

    // Check for tier ups
    const tierRequirements = this.generateBattlePassTiers();
    let newTier = 1;

    for (const tier of tierRequirements) {
      if (battlePass.currentXP >= tier.requiredXP) {
        newTier = tier.tier;
      } else {
        break;
      }
    }

    const oldTier = battlePass.tier;
    battlePass.tier = newTier;

    return {
      xpAdded: xp,
      currentXP: battlePass.currentXP,
      tier: battlePass.tier,
      tieredUp: newTier > oldTier,
      newTier: battlePass.tier,
    };
  }

  async claimBattlePassReward(
    userId: string,
    season: number,
    tier: number,
  ): Promise<{ reward: string; claimed: boolean }> {
    const bpKey = `bp_${userId}_season_${season}`;
    const battlePass = this.battlePasses.get(bpKey);

    if (!battlePass) {
      throw new BadRequestException('Battle Pass not found');
    }

    if (battlePass.tier < tier) {
      throw new BadRequestException('Tier not reached yet');
    }

    const tierInfo = battlePass.tiers.find((t) => t.tier === tier);
    if (!tierInfo) {
      throw new BadRequestException('Tier not found');
    }

    const reward = battlePass.isPremium ? tierInfo.premiumReward : tierInfo.freeReward;

    return {
      reward,
      claimed: true,
    };
  }

  async getBattlePassProgress(userId: string, season: number) {
    const bpKey = `bp_${userId}_season_${season}`;
    const battlePass = this.battlePasses.get(bpKey);

    if (!battlePass) {
      return {
        hasActiveBattlePass: false,
        message: 'No active Battle Pass',
      };
    }

    const currentTierInfo = battlePass.tiers.find((t) => t.tier === battlePass.tier);
    const nextTierInfo = battlePass.tiers.find((t) => t.tier === battlePass.tier + 1);

    const xpToNextTier = nextTierInfo ? nextTierInfo.requiredXP - battlePass.currentXP : 0;
    const progressToNextTier = nextTierInfo
      ? ((battlePass.currentXP - currentTierInfo!.requiredXP) /
          (nextTierInfo.requiredXP - currentTierInfo!.requiredXP)) *
        100
      : 100;

    return {
      hasActiveBattlePass: true,
      season: battlePass.season,
      tier: battlePass.tier,
      currentXP: battlePass.currentXP,
      isPremium: battlePass.isPremium,
      daysRemaining: Math.ceil((battlePass.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      xpToNextTier: Math.max(0, xpToNextTier),
      progressPercentage: Math.min(100, progressToNextTier),
      rewards: {
        claimed: this.getClaimedRewards(battlePass),
        available: this.getAvailableRewards(battlePass),
      },
    };
  }

  private getClaimedRewards(battlePass: BattlePass) {
    return battlePass.tiers
      .filter((t) => t.tier <= battlePass.tier)
      .map((t) => ({
        tier: t.tier,
        reward: battlePass.isPremium ? t.premiumReward : t.freeReward,
      }));
  }

  private getAvailableRewards(battlePass: BattlePass) {
    return battlePass.tiers
      .filter((t) => t.tier > battlePass.tier)
      .slice(0, 5) // Show next 5 rewards
      .map((t) => ({
        tier: t.tier,
        reward: battlePass.isPremium ? t.premiumReward : t.freeReward,
      }));
  }

  async getBattlePassSeasons() {
    return [
      {
        season: 1,
        name: 'Season 1: Rise of the Warrior',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-09-30'),
        theme: 'Strength & Power',
        cosmetics: 50,
        status: 'ACTIVE',
      },
      {
        season: 2,
        name: 'Season 2: Speed Demon',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-12-31'),
        theme: 'Cardio & Agility',
        cosmetics: 50,
        status: 'COMING_SOON',
      },
      {
        season: 3,
        name: 'Season 3: Endurance Champion',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        theme: 'Stamina & Resilience',
        cosmetics: 50,
        status: 'COMING_SOON',
      },
    ];
  }

  async cancelBattlePass(userId: string, season: number): Promise<{ success: boolean; refund: number }> {
    const bpKey = `bp_${userId}_season_${season}`;
    const battlePass = this.battlePasses.get(bpKey);

    if (!battlePass) {
      throw new BadRequestException('Battle Pass not found');
    }

    if (!battlePass.isPremium) {
      throw new BadRequestException('Cannot cancel free Battle Pass');
    }

    // Pro-rata refund based on days remaining
    const daysRemaining = Math.ceil((battlePass.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    const totalDays = 90;
    const refund = Math.round((daysRemaining / totalDays) * 999); // $9.99 in cents

    battlePass.status = 'EXPIRED';
    battlePass.isPremium = false;

    return {
      success: true,
      refund,
    };
  }

  private generateBattlePassTiers(): BattlePassTier[] {
    const tiers: BattlePassTier[] = [];

    for (let i = 1; i <= 100; i++) {
      tiers.push({
        tier: i,
        requiredXP: i * 10000, // 10k XP per tier
        freeReward: this.getFreeReward(i),
        premiumReward: this.getPremiumReward(i),
      });
    }

    return tiers;
  }

  private getFreeReward(tier: number): string {
    if (tier % 5 === 0) return `Free Cosmetic #${tier}`;
    if (tier % 10 === 0) return `Free Emote #${tier / 10}`;
    return `500 XP Boost`;
  }

  private getPremiumReward(tier: number): string {
    if (tier % 5 === 0) return `Premium Cosmetic #${tier}`;
    if (tier % 10 === 0) return `Exclusive Weapon #${tier / 10}`;
    if (tier % 20 === 0) return `Legendary Armor #${tier / 20}`;
    return `1000 Coins`;
  }
}
