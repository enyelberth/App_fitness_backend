/**
 * Evento: Personaje creado
 */
export class CharacterCreatedEvent {
  constructor(
    public readonly characterId: string,
    public readonly userId: string,
    public readonly class: string,
    public readonly createdAt: Date,
  ) {}
}

/**
 * Evento: XP otorgado
 */
export class XpAwardedEvent {
  constructor(
    public readonly characterId: string,
    public readonly userId: string,
    public readonly xpAmount: number,
    public readonly source: string, // 'workout', 'quest', 'battle'
    public readonly timestamp: Date,
  ) {}
}

/**
 * Evento: Personaje subió de nivel
 * Escuchado por: Economy (reward coins), Analytics
 */
export class CharacterLeveledUpEvent {
  constructor(
    public readonly characterId: string,
    public readonly userId: string,
    public readonly newLevel: number,
    public readonly totalXp: number,
    public readonly timestamp: Date,
  ) {}
}

/**
 * Evento: Misión completada
 */
export class QuestCompletedEvent {
  constructor(
    public readonly questId: string,
    public readonly userId: string,
    public readonly reward: {
      xp: number;
      coins: number;
      gems?: number;
    },
    public readonly timestamp: Date,
  ) {}
}
