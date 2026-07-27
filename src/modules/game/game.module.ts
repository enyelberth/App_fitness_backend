import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';

// Controllers
import { CharacterController } from './controllers/character.controller';

// Services
import { CharacterService } from './services/character.service';

// Repositories
import { CharacterRepository } from './repositories/character.repository';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository],
  exports: [CharacterService],
})
export class GameModule {}
