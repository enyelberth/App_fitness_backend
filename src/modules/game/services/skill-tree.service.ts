import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Skill {
  id: string;
  name: string;
  description: string;
  class: string;
  requiredPrestige: number;
  effect: string;
}

@Injectable()
export class SkillTreeService {
  private SKILLS: Skill[] = [
    // WARRIOR TREE
    {
      id: 'warrior-power-strike',
      name: 'Power Strike',
      description: 'Increase melee damage by 20%',
      class: 'WARRIOR',
      requiredPrestige: 1,
      effect: 'damage_20_percent',
    },
    {
      id: 'warrior-bulk-up',
      name: 'Bulk Up',
      description: 'Increase health by 100',
      class: 'WARRIOR',
      requiredPrestige: 1,
      effect: 'health_100',
    },
    {
      id: 'warrior-iron-skin',
      name: 'Iron Skin',
      description: 'Increase defense by 30%',
      class: 'WARRIOR',
      requiredPrestige: 2,
      effect: 'defense_30_percent',
    },
    {
      id: 'warrior-berserk',
      name: 'Berserk Mode',
      description: '2x damage for 10 minutes (cooldown: 10min)',
      class: 'WARRIOR',
      requiredPrestige: 3,
      effect: 'berserk_mode',
    },

    // ROGUE TREE
    {
      id: 'rogue-swift-strikes',
      name: 'Swift Strikes',
      description: 'Increase speed by 25%',
      class: 'ROGUE',
      requiredPrestige: 1,
      effect: 'speed_25_percent',
    },
    {
      id: 'rogue-evasion',
      name: 'Evasion',
      description: 'Gain 20% dodge chance',
      class: 'ROGUE',
      requiredPrestige: 1,
      effect: 'dodge_20_percent',
    },
    {
      id: 'rogue-sprint',
      name: 'Sprint',
      description: '2x speed for 5 minutes (cooldown: 5min)',
      class: 'ROGUE',
      requiredPrestige: 2,
      effect: 'sprint',
    },
    {
      id: 'rogue-shadow-clone',
      name: 'Shadow Clone',
      description: 'Duplicate your stats for a short time',
      class: 'ROGUE',
      requiredPrestige: 3,
      effect: 'shadow_clone',
    },

    // MAGE TREE
    {
      id: 'mage-mana-pool',
      name: 'Mana Pool',
      description: 'Increase stamina by 200',
      class: 'MAGE',
      requiredPrestige: 1,
      effect: 'stamina_200',
    },
    {
      id: 'mage-meditation',
      name: 'Meditation',
      description: 'Passive stamina recovery +10/min',
      class: 'MAGE',
      requiredPrestige: 1,
      effect: 'meditation',
    },
    {
      id: 'mage-energy-burst',
      name: 'Energy Burst',
      description: '+50% stamina for 1 hour (cooldown: 1h)',
      class: 'MAGE',
      requiredPrestige: 2,
      effect: 'energy_burst',
    },
    {
      id: 'mage-elemental-mastery',
      name: 'Elemental Mastery',
      description: 'Unlock aura effects (fire, ice, lightning)',
      class: 'MAGE',
      requiredPrestige: 3,
      effect: 'elemental_mastery',
    },
  ];

  constructor(private prisma: PrismaService) {}

  async getSkillTree(characterClass: string) {
    return this.SKILLS.filter(skill => skill.class === characterClass);
  }

  async unlockSkill(userId: string, skillId: string) {
    const character = await this.prisma.gameCharacter.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const skill = this.SKILLS.find(s => s.id === skillId);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    if (character.prestigeLevel < skill.requiredPrestige) {
      throw new BadRequestException(
        \Requires prestige level \, you have \\,
      );
    }

    console.log(\User \ unlocked skill \\);

    return {
      message: 'Skill unlocked',
      skill,
    };
  }

  async prestigeReset(userId: string) {
    const character = await this.prisma.gameCharacter.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    if (character.level < 100) {
      throw new BadRequestException('Must reach level 100 to prestige');
    }

    const updated = await this.prisma.gameCharacter.update({
      where: { userId },
      data: {
        prestigeLevel: character.prestigeLevel + 1,
        level: 1,
        currentXp: 0,
        strength: 10,
        speed: 10,
        stamina: 10,
      },
    });

    return {
      message: 'Prestige reset complete',
      newPrestigeLevel: updated.prestigeLevel,
    };
  }

  async getPrestigeInfo(userId: string) {
    const character = await this.prisma.gameCharacter.findUnique({
      where: { userId },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    return {
      prestigeLevel: character.prestigeLevel,
      currentLevel: character.level,
      readyToPrestige: character.level >= 100,
      availableSkills: this.SKILLS.filter(
        s => s.requiredPrestige <= character.prestigeLevel,
      ).length,
    };
  }
}
