import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { validateEnvironment } from "./config/env.validation";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { UsersModule } from "./modules/users/users.module";
import { ExercisesModule } from "./modules/exercises/exercises.module";
import { WorkoutsModule } from "./modules/workouts/workouts.module";
import { ProgressModule } from "./modules/progress/progress.module";

// Nueva arquitectura modular
import { EventsModule } from "./events/events.module";
import { FitnessModule } from "./modules/fitness/fitness.module";
import { GameModule } from "./modules/game/game.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { EconomyModule } from "./modules/economy/economy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: 60_000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ExercisesModule,
    WorkoutsModule,
    ProgressModule,

    // Nueva arquitectura modular
    EventsModule,      // Event Bus (necesario para todo)
    FitnessModule,     // Fitness MVP
    GameModule,        // Game RPG (escucha Fitness)
    PaymentsModule,    // Payments
    EconomyModule,     // Economy (escucha Game + Payments)
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
