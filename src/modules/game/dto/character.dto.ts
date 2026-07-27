import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CharacterClass {
  WARRIOR = 'WARRIOR',
  ROGUE = 'ROGUE',
  MAGE = 'MAGE',
  PALADIN = 'PALADIN',
}

/**
 * DTO: Crear personaje
 */
export class CreateCharacterDto {
  @ApiProperty({
    description: 'Clase del personaje',
    enum: CharacterClass,
    example: 'WARRIOR',
  })
  @IsEnum(CharacterClass)
  @IsNotEmpty()
  class: CharacterClass;
}

/**
 * DTO: Response de Personaje
 */
export class CharacterResponseDto {
  id: string;
  class: string;
  level: number;
  currentXp: number;
  totalXp: number;
  health: number;
  strength: number;
  speed: number;
  stamina: number;
  totalWorkouts: number;
  prestigeLevel: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.class = data.class;
    this.level = data.level;
    this.currentXp = data.currentXp;
    this.totalXp = data.totalXp;
    this.health = data.health;
    this.strength = data.strength;
    this.speed = data.speed;
    this.stamina = data.stamina;
    this.totalWorkouts = data.totalWorkouts;
    this.prestigeLevel = data.prestigeLevel || 0;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

/**
 * DTO: Leaderboard Entry
 */
export class LeaderboardEntryDto {
  rank: number;
  characterId: string;
  level: number;
  totalXp: number;
  class: string;
  totalWorkouts: number;
  userId: string;

  constructor(rank: number, data: any) {
    this.rank = rank;
    this.characterId = data.id;
    this.level = data.level;
    this.totalXp = data.totalXp;
    this.class = data.class;
    this.totalWorkouts = data.totalWorkouts;
    this.userId = data.userId;
  }
}
