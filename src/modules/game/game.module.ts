import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';

// Controllers
import { CharacterController } from './controllers/character.controller';
import { QuestController } from './controllers/quest.controller';
import { CosmeticController } from './controllers/cosmetic.controller';

// Services
import { CharacterService } from './services/character.service';
import { QuestService } from './services/quest.service';
import { CosmeticService } from './services/cosmetic.service';

// Repositories
import { CharacterRepository } from './repositories/character.repository';
import { QuestRepository } from './repositories/quest.repository';
import { CosmeticRepository } from './repositories/cosmetic.repository';
import { InventoryRepository } from './repositories/inventory.repository';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [CharacterController, QuestController, CosmeticController],
  providers: [
    CharacterService,
    QuestService,
    CosmeticService,
    CharacterRepository,
    QuestRepository,
    CosmeticRepository,
    InventoryRepository,
  ],
  exports: [CharacterService, QuestService, CosmeticService],
})
export class GameModule {}
