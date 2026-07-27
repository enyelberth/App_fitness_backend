import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { EventsModule } from '../../events/events.module';

// Controllers
import { CharacterController } from './controllers/character.controller';
import { QuestController } from './controllers/quest.controller';
import { CosmeticController } from './controllers/cosmetic.controller';
import { LeaderboardController } from './controllers/leaderboard.controller';
import { AchievementController } from './controllers/achievement.controller';
import { GuildController } from './controllers/guild.controller';
import { SkillTreeController } from './controllers/skill-tree.controller';
import { PvPController } from './controllers/pvp.controller';
import { DailyStreakController } from './controllers/daily-streak.controller';
import { SeasonalEventsController } from './controllers/seasonal-events.controller';
import { TournamentController } from './controllers/tournament.controller';
import { MatchmakingController } from './controllers/matchmaking.controller';

// Services
import { CharacterService } from './services/character.service';
import { QuestService } from './services/quest.service';
import { CosmeticService } from './services/cosmetic.service';
import { LeaderboardService } from './services/leaderboard.service';
import { AchievementService } from './services/achievement.service';
import { GuildService } from './services/guild.service';
import { SkillTreeService } from './services/skill-tree.service';
import { PvPService } from './services/pvp.service';
import { DailyStreakService } from './services/daily-streak.service';
import { SeasonalEventsService } from './services/seasonal-events.service';
import { TournamentService } from './services/tournament.service';
import { MatchmakingService } from './services/matchmaking.service';

// Repositories
import { CharacterRepository } from './repositories/character.repository';
import { QuestRepository } from './repositories/quest.repository';
import { CosmeticRepository } from './repositories/cosmetic.repository';
import { InventoryRepository } from './repositories/inventory.repository';

@Module({
  imports: [CommonModule, EventsModule],
  controllers: [
    CharacterController,
    QuestController,
    CosmeticController,
    LeaderboardController,
    AchievementController,
    GuildController,
    SkillTreeController,
    PvPController,
    DailyStreakController,
    SeasonalEventsController,
    TournamentController,
    MatchmakingController,
  ],
  providers: [
    CharacterService,
    QuestService,
    CosmeticService,
    LeaderboardService,
    AchievementService,
    GuildService,
    SkillTreeService,
    PvPService,
    DailyStreakService,
    SeasonalEventsService,
    TournamentService,
    MatchmakingService,
    CharacterRepository,
    QuestRepository,
    CosmeticRepository,
    InventoryRepository,
  ],
  exports: [
    CharacterService,
    QuestService,
    CosmeticService,
    LeaderboardService,
    AchievementService,
    GuildService,
    SkillTreeService,
    PvPService,
    DailyStreakService,
    SeasonalEventsService,
    TournamentService,
    MatchmakingService,
  ],
})
export class GameModule {}
