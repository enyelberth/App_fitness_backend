/**
 * Entity: Character (Personaje RPG)
 * Tabla: game_characters
 *
 * Representa el personaje del jugador en el juego
 */
export class CharacterEntity {
  id: string;
  userId: string;

  // Clase y progresión
  class: string; // WARRIOR, ROGUE, MAGE, PALADIN
  level: number = 1;
  currentXp: number = 0;
  totalXp: number = 0;

  // Stats
  health: number = 100;
  strength: number = 10;
  speed: number = 10;
  stamina: number = 10;

  // Apariencia
  appearanceData?: {
    skinTone?: string;
    hairStyle?: string;
    hairColor?: string;
    faceType?: string;
    bodyType?: string;
  };

  // Cosmética equipada
  equippedCosmetics?: {
    shirtId?: string;
    pantsId?: string;
    shoeId?: string;
    weaponId?: string;
    petId?: string;
  };

  // Progresión
  prestigeLevel: number = 0;
  totalWorkouts: number = 0;
  totalDistance?: number = 0;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
}
