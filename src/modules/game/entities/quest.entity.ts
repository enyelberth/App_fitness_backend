/**
 * Entity: Quest (Misión/Tarea)
 * Tabla: game_quests
 */
export class QuestEntity {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: string; // DAILY, WEEKLY, SEASONAL
  requirement: string; // "complete_5_workouts", "reach_level_10"
  targetValue: number;
  currentProgress: number = 0;
  status: string; // ACTIVE, COMPLETED, EXPIRED
  xpReward: number;
  coinReward: number;
  gemReward?: number;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

/**
 * Entity: Cosmetic (Cosmética/Items)
 * Tabla: game_cosmetics
 */
export class CosmeticEntity {
  id: string;
  name: string;
  description?: string;
  type: string; // OUTFIT, WEAPON, ACCESSORY, AURA, PET
  rarity: string; // COMMON, RARE, EPIC, LEGENDARY
  characterClass?: string; // null = todos
  price?: number; // coins
  gemPrice?: number;
  imageUrl?: string;
  createdAt: Date;
}

/**
 * Entity: Inventory (Inventario del usuario)
 * Tabla: game_inventory
 */
export class InventoryEntity {
  id: string;
  userId: string;
  cosmeticId: string;
  quantity: number = 1;
  equipped: boolean = false;
  acquiredAt: Date;
}
