# GUÍA DE ARQUITECTURA MODULAR ESCALABLE
**Para cualquier sitio que necesite: Monolítico → Microservicios**

---

## 🎯 OBJETIVO

Crear arquitectura donde:
```
HOY:    Monolítico (1 backend, 1 BD, 1 servidor)
MAÑANA: Microservicios (N backends, N BDs, N servidores)

SIN REESCRIBIR CÓDIGO
```

---

## 📐 PRINCIPIOS FUNDAMENTALES

### 1. **MÓDULOS COMPLETAMENTE INDEPENDIENTES**

```typescript
// ✅ CORRECTO: Módulo es autónomo
src/modules/fitness/
├── controllers/
├── services/
├── entities/
├── dto/
├── interfaces/
├── repositories/
└── fitness.module.ts

// ❌ INCORRECTO: Módulo depende de otro
// fitness/ llama game/ → Acoplamiento
// game/ llama fitness/ → Acoplamiento
```

### 2. **COMUNICACIÓN VÍA INTERFACES PÚBLICAS**

```typescript
// ✅ CORRECTO: Interface pública limpia
export interface IFitnessService {
  getCompletedWorkouts(userId: string): Promise<Workout[]>;
  getXpForWorkout(workoutId: string): Promise<number>;
}

// ❌ INCORRECTO: Exponer internals
export interface IFitnessService {
  private calculateXP();
  private updateCache();
  private validateOwnership();
}
```

### 3. **EVENTOS PARA COMUNICACIÓN CROSS-MODULE**

```typescript
// ✅ CORRECTO: Publish-Subscribe pattern
// Fitness completa workout → emite evento
// Game escucha evento → actualiza personaje

// ❌ INCORRECTO: Llamadas directas
// game.service.ts llama fitness.service.ts
```

---

## 🏗️ ESTRUCTURA DE DIRECTORIOS (EXTENSIBLE)

```
proyecto-fitness/
│
├── src/
│   │
│   ├── modules/                    # Dominios de negocio
│   │   │
│   │   ├── fitness/                # Dominio: Entrenamiento
│   │   │   ├── controllers/
│   │   │   │   ├── workouts.controller.ts
│   │   │   │   ├── exercises.controller.ts
│   │   │   │   └── progress.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── workouts.service.ts
│   │   │   │   ├── exercises.service.ts
│   │   │   │   ├── progress.service.ts
│   │   │   │   └── muscle-groups.service.ts
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── workouts.repository.ts
│   │   │   │   ├── exercises.repository.ts
│   │   │   │   └── progress.repository.ts
│   │   │   │
│   │   │   ├── entities/           # Modelos de BD
│   │   │   │   ├── workout.entity.ts
│   │   │   │   ├── exercise.entity.ts
│   │   │   │   ├── progress.entity.ts
│   │   │   │   └── muscle-group.entity.ts
│   │   │   │
│   │   │   ├── dto/                # Transfer Objects
│   │   │   │   ├── create-workout.dto.ts
│   │   │   │   ├── update-workout.dto.ts
│   │   │   │   └── log-progress.dto.ts
│   │   │   │
│   │   │   ├── interfaces/         # Contratos públicos
│   │   │   │   ├── ifitness.service.ts
│   │   │   │   └── ifitness.events.ts
│   │   │   │
│   │   │   ├── events/             # Event emitters
│   │   │   │   ├── workout-completed.event.ts
│   │   │   │   ├── exercise-performed.event.ts
│   │   │   │   └── progress-logged.event.ts
│   │   │   │
│   │   │   └── fitness.module.ts
│   │   │
│   │   ├── game/                   # Dominio: Juego RPG
│   │   │   ├── controllers/
│   │   │   │   ├── characters.controller.ts
│   │   │   │   ├── quests.controller.ts
│   │   │   │   ├── cosmetics.controller.ts
│   │   │   │   └── battles.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── characters.service.ts
│   │   │   │   ├── quests.service.ts
│   │   │   │   ├── cosmetics.service.ts
│   │   │   │   └── xp-calculator.service.ts
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── characters.repository.ts
│   │   │   │   ├── quests.repository.ts
│   │   │   │   └── cosmetics.repository.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   ├── character.entity.ts
│   │   │   │   ├── quest.entity.ts
│   │   │   │   └── cosmetic.entity.ts
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── create-character.dto.ts
│   │   │   │   └── level-up.dto.ts
│   │   │   │
│   │   │   ├── interfaces/
│   │   │   │   └── igame.service.ts
│   │   │   │
│   │   │   ├── listeners/          # Escucha eventos
│   │   │   │   ├── on-workout-completed.listener.ts
│   │   │   │   └── on-exercise-performed.listener.ts
│   │   │   │
│   │   │   └── game.module.ts
│   │   │
│   │   ├── payments/               # Dominio: Pagos
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── interfaces/
│   │   │   └── payments.module.ts
│   │   │
│   │   ├── economy/                # Dominio: Economía/Wallet
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── interfaces/
│   │   │   └── economy.module.ts
│   │   │
│   │   └── auth/                   # Dominio: Autenticación (COMPARTIDO)
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── guards/
│   │       ├── strategies/
│   │       ├── dto/
│   │       ├── interfaces/
│   │       └── auth.module.ts
│   │
│   ├── common/                     # Código compartido (NO de negocio)
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   │
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   │
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   │
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── password.utils.ts
│   │   │   ├── jwt.utils.ts
│   │   │   └── validation.utils.ts
│   │   │
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   └── error-response.dto.ts
│   │   │
│   │   ├── types/
│   │   │   └── authenticated-user.ts
│   │   │
│   │   ├── interfaces/
│   │   │   ├── icrud.repository.ts
│   │   │   └── ievent-emitter.ts
│   │   │
│   │   ├── exceptions/
│   │   │   └── custom-exceptions.ts
│   │   │
│   │   └── common.module.ts
│   │
│   ├── events/                     # Event Bus (Global)
│   │   ├── event.bus.ts
│   │   ├── event.types.ts
│   │   └── events.module.ts
│   │
│   ├── database/
│   │   ├── prisma.service.ts
│   │   ├── prisma.module.ts
│   │   └── migrations/
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   └── app.module.ts
│
├── test/
│   ├── unit/
│   │   ├── fitness/
│   │   ├── game/
│   │   └── payments/
│   │
│   ├── integration/
│   │   ├── fitness-game.integration.spec.ts
│   │   └── payments-economy.integration.spec.ts
│   │
│   └── e2e/
│       └── app.e2e.spec.ts
│
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── nestjs.config.js
└── .env.example
```

---

## 📋 REGLAS DE ARQUITECTURA

### REGLA 1: Módulos Independientes

```typescript
// ✅ fitness.module.ts - CORRECTO
@Module({
  imports: [CommonModule], // SOLO común
  controllers: [WorkoutsController, ExercisesController],
  providers: [WorkoutsService, ExercisesService],
  exports: [WorkoutsService], // Exporta interface pública
})
export class FitnessModule {}

// ❌ INCORRECTO
@Module({
  imports: [CommonModule, GameModule], // NO importar módulos de negocio
  controllers: [...],
  providers: [...],
})
export class FitnessModule {}
```

### REGLA 2: Comunicación vía Events

```typescript
// ✅ Fitness emite evento
// src/modules/fitness/events/workout-completed.event.ts
export class WorkoutCompletedEvent {
  constructor(
    public readonly workoutId: string,
    public readonly userId: string,
    public readonly xp: number,
    public readonly duration: number,
  ) {}
}

// ✅ Fitness emite en service
// src/modules/fitness/services/workouts.service.ts
@Injectable()
export class WorkoutsService {
  constructor(
    private eventBus: EventBusService,
  ) {}

  async completeWorkout(workoutId: string, userId: string) {
    // Lógica de fitness
    const xp = this.calculateXP(workoutId);
    
    // EMITIR evento (no llama directamente game)
    this.eventBus.emit(new WorkoutCompletedEvent(
      workoutId,
      userId,
      xp,
      duration,
    ));
  }
}

// ✅ Game ESCUCHA evento
// src/modules/game/listeners/on-workout-completed.listener.ts
@Injectable()
export class OnWorkoutCompletedListener implements OnEvent(WorkoutCompletedEvent) {
  constructor(private charactersService: CharactersService) {}

  handle(event: WorkoutCompletedEvent) {
    // Game reacciona al evento fitness
    this.charactersService.awardXP(
      event.userId,
      event.xp,
    );
  }
}

// ❌ INCORRECTO - NO HACER ESTO
// game.service.ts
@Injectable()
export class GameService {
  constructor(
    private fitnessService: FitnessService, // ACOPLAMIENTO
  ) {}
  
  someMethod() {
    this.fitnessService.updateWorkout(); // ❌ NUNCA
  }
}
```

### REGLA 3: Interfaces Públicas Solo

```typescript
// ✅ Interface pública (qué el módulo EXPONE)
// src/modules/fitness/interfaces/ifitness.service.ts
export interface IFitnessService {
  getCompletedWorkouts(userId: string): Promise<Workout[]>;
  calculateXP(workoutId: string): Promise<number>;
  getProgressStats(userId: string): Promise<ProgressStats>;
}

// ❌ NO exponer métodos privados
export interface IBadFitnessService {
  private calculateXP();
  private updateCache();
  private validateOwnership();
}
```

### REGLA 4: Tablas de BD Separadas (por dominio)

```sql
-- Fitness domain
CREATE TABLE fitness_workouts (...);
CREATE TABLE fitness_exercises (...);
CREATE TABLE fitness_progress_entries (...);

-- Game domain
CREATE TABLE game_characters (...);
CREATE TABLE game_quests (...);
CREATE TABLE game_cosmetics (...);

-- Payments domain (extraible)
CREATE TABLE payments_orders (...);

-- Economy domain (extraible)
CREATE TABLE economy_wallets (...);
CREATE TABLE economy_wallet_entries (...);

-- Auth domain (compartido)
CREATE TABLE app_users (...);
CREATE TABLE auth_sessions (...);
```

### REGLA 5: DTOs Específicas de Módulo

```typescript
// ✅ CORRECTO - DTOs separadas por módulo

// src/modules/fitness/dto/workout.dto.ts
export class WorkoutDto {
  id: string;
  userId: string;
  name: string;
  exercises: ExerciseInWorkoutDto[];
}

// src/modules/game/dto/character.dto.ts
export class CharacterDto {
  id: string;
  userId: string;
  level: number;
  xp: number;
}

// ❌ INCORRECTO - DTOs compartidas
// common/dto/shared.dto.ts
export class SharedWorkoutCharacterDto { // ❌ NO
  workoutId: string;
  characterLevel: number;
}
```

---

## 🔄 EVENT ARCHITECTURE (El corazón del desacoplamiento)

### Event Bus Central

```typescript
// src/events/event.bus.ts
@Injectable()
export class EventBusService {
  private readonly eventEmitter = new EventEmitter2();

  emit<T>(event: T): void {
    const eventName = event.constructor.name;
    this.eventEmitter.emit(eventName, event);
  }

  on<T>(
    eventClass: Type<T>,
    handler: (event: T) => void | Promise<void>,
  ): void {
    const eventName = eventClass.name;
    this.eventEmitter.on(eventName, handler);
  }
}
```

### Definir Eventos

```typescript
// src/modules/fitness/events/workout-completed.event.ts
export class WorkoutCompletedEvent {
  constructor(
    public readonly workoutId: string,
    public readonly userId: string,
    public readonly xp: number,
    public readonly durationMinutes: number,
  ) {}
}

// src/modules/fitness/events/exercise-performed.event.ts
export class ExercisePerformedEvent {
  constructor(
    public readonly exerciseId: string,
    public readonly userId: string,
    public readonly sets: number,
    public readonly reps: number,
    public readonly weight: number,
  ) {}
}
```

### Emitir Eventos (Fitness module)

```typescript
// src/modules/fitness/services/workouts.service.ts
@Injectable()
export class WorkoutsService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async completeWorkout(workoutId: string, userId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: true },
    });

    if (!workout) throw new NotFoundException();

    // Lógica de fitness (NO llama a game)
    const xp = this.calculateXP(workout.exercises.length);

    // EMITIR evento
    this.eventBus.emit(
      new WorkoutCompletedEvent(workoutId, userId, xp, 60),
    );

    return { success: true, xp };
  }
}
```

### Escuchar Eventos (Game module)

```typescript
// src/modules/game/listeners/on-workout-completed.listener.ts
@Injectable()
export class OnWorkoutCompletedListener {
  constructor(
    private charactersService: CharactersService,
    private eventBus: EventBusService,
  ) {}

  onModuleInit() {
    this.eventBus.on(
      WorkoutCompletedEvent,
      (event: WorkoutCompletedEvent) => this.handle(event),
    );
  }

  private async handle(event: WorkoutCompletedEvent) {
    // Game reacciona al evento fitness
    await this.charactersService.awardXP(event.userId, event.xp);

    // Posiblemente emitir otro evento (game → otros)
    this.eventBus.emit(new CharacterLeveledUpEvent(...));
  }
}
```

---

## 🏗️ PASO A PASO: Crear Nuevo Módulo

### 1. Crear estructura de directorios

```bash
mkdir -p src/modules/analytics/{controllers,services,repositories,entities,dto,interfaces}
```

### 2. Crear entities

```typescript
// src/modules/analytics/entities/analytics-event.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  eventType: string;

  @Column('json')
  data: Record<string, any>;

  @Column()
  createdAt: Date;
}
```

### 3. Crear repository

```typescript
// src/modules/analytics/repositories/analytics.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AnalyticsRepository {
  constructor(private prisma: PrismaService) {}

  async logEvent(userId: string, eventType: string, data: any) {
    return this.prisma.analyticsEvent.create({
      data: { userId, eventType, data },
    });
  }

  async getEventsByUser(userId: string) {
    return this.prisma.analyticsEvent.findMany({
      where: { userId },
    });
  }
}
```

### 4. Crear service

```typescript
// src/modules/analytics/services/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { AnalyticsRepository } from '../repositories/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    private repository: AnalyticsRepository,
    private eventBus: EventBusService,
  ) {}

  async logCustomEvent(userId: string, eventType: string, data: any) {
    return this.repository.logEvent(userId, eventType, data);
  }

  // ESCUCHA eventos de otros módulos
  onModuleInit() {
    this.eventBus.on(
      WorkoutCompletedEvent,
      (event) => this.logCustomEvent(event.userId, 'workout_completed', event),
    );
  }
}
```

### 5. Crear controller

```typescript
// src/modules/analytics/controllers/analytics.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('my-events')
  async getMyEvents(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getEventsByUser(user.id);
  }
}
```

### 6. Crear module

```typescript
// src/modules/analytics/analytics.module.ts
import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { EventsModule } from '../../events/events.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [EventsModule, CommonModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
```

### 7. Registrar en app.module.ts

```typescript
// src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CommonModule,
    EventsModule,
    AuthModule,
    FitnessModule,
    GameModule,
    PaymentsModule,
    EconomyModule,
    AnalyticsModule, // ← Agregar aquí
  ],
})
export class AppModule {}
```

---

## 🔀 EXTRAER A MICROSERVICIO (Fácil después)

Cuando llegues a 100k+ DAU y necesites extraer Game a servidor separado:

### Paso 1: Copiar código

```bash
cp -r src/modules/game game-backend/src/modules/game
```

### Paso 2: Setup evento remoto

```typescript
// game-backend/src/events/remote-event-listener.ts
@Injectable()
export class RemoteEventListener {
  constructor(private amqp: AmqpService) {} // RabbitMQ, Kafka, etc

  async subscribeToWorkoutCompleted() {
    this.amqp.subscribe('fitness.workout-completed', (event) => {
      // Manejar evento remoto igual que antes
    });
  }
}
```

### Paso 3: API Gateway

```typescript
// src/gateway/api.gateway.ts
@Module({
  imports: [
    HttpModule,
  ],
})
export class ApiGatewayModule {}

// Rutas:
// GET /api/v1/fitness/* → fitness-backend:4000
// GET /api/v1/game/* → game-backend:4001
// GET /api/v1/auth/* → main-backend:4000
```

### Paso 4: Listo

```
ANTES (Monolítico):
1 Backend (fitness + game + auth)

DESPUÉS (Microservicios):
3 Backends:
├─ Main (auth + payments + economy)
├─ Fitness (fitness)
└─ Game (game)

CERO reescritura de código
```

---

## 🧪 TESTING STRATEGY

### Unit Tests (por módulo)

```typescript
// test/unit/fitness/workouts.service.spec.ts
describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let mockRepository: jest.Mocked<WorkoutsRepository>;
  let mockEventBus: jest.Mocked<EventBusService>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    mockEventBus = createMockEventBus();
    service = new WorkoutsService(mockRepository, mockEventBus);
  });

  it('should emit WorkoutCompletedEvent when workout completes', async () => {
    const event = await service.completeWorkout('w1', 'u1');
    
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      expect.any(WorkoutCompletedEvent),
    );
  });
});
```

### Integration Tests (cross-module)

```typescript
// test/integration/fitness-game.integration.spec.ts
describe('Fitness → Game Integration', () => {
  let fitnessService: FitnessService;
  let gameService: GameService;
  let eventBus: EventBusService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [FitnessModule, GameModule, EventsModule],
    }).compile();

    fitnessService = module.get(FitnessService);
    gameService = module.get(GameService);
    eventBus = module.get(EventBusService);
  });

  it('should award XP when workout completes', async () => {
    const character = await gameService.createCharacter('u1', 'Warrior');
    const xpBefore = character.xp;

    await fitnessService.completeWorkout('w1', 'u1');
    
    const updated = await gameService.getCharacter('u1');
    expect(updated.xp).toBeGreaterThan(xpBefore);
  });
});
```

---

## ✅ CHECKLIST: Crear Nuevo Módulo

- [ ] Crear estructura de directorios
- [ ] Crear entities con prefijo de dominio (fitness_*, game_*, etc)
- [ ] Crear repository con métodos CRUD
- [ ] Crear service con lógica de negocio
- [ ] Crear DTOs específicas del módulo
- [ ] Crear controller con rutas
- [ ] Crear interfaces públicas
- [ ] Crear module y registrar en app.module
- [ ] SI emite eventos: crear event classes
- [ ] SI escucha eventos: crear listeners
- [ ] Crear unit tests
- [ ] Crear integration tests
- [ ] Verificar que NO importa otros módulos de negocio

---

## 🚀 RESUMEN: Para Tu Proyecto

### HOY (MVP - Monolítico):
```
1 Backend NestJS
├── fitness/ (completamente aislado)
├── game/ (completamente aislado)
├── payments/ (extraible después)
├── economy/ (extraible después)
├── auth/ (compartido siempre)
└── common/ (utilidades, guards, decorators)

1 PostgreSQL
1 Servidor

Fitness → WorkoutCompletedEvent → Game (vía EventBus)
Game → CharacterLeveledUpEvent → Otros módulos (vía EventBus)
```

### AÑO 2 (Si creces >100k DAU):
```
Extracto Game:
├── game-backend (4001)
├── fitness-backend (4000)
├── auth-backend (4000)
└── API Gateway (4000)

Sin cambiar código (solo config)
```

---

## 📚 REFERENCIA RÁPIDA

| Concepto | Ubicación | Propósito |
|----------|-----------|----------|
| **Entidades** | `modules/{domain}/entities/` | Modelos de BD |
| **Servicios** | `modules/{domain}/services/` | Lógica de negocio |
| **Repositorios** | `modules/{domain}/repositories/` | Acceso a datos |
| **DTOs** | `modules/{domain}/dto/` | Transfer objects |
| **Interfaces** | `modules/{domain}/interfaces/` | Contratos públicos |
| **Eventos** | `modules/{domain}/events/` | Event definitions |
| **Listeners** | `modules/{domain}/listeners/` | Event handlers |
| **Controllers** | `modules/{domain}/controllers/` | HTTP routes |
| **Guards** | `common/guards/` | Auth/Authorization |
| **Decorators** | `common/decorators/` | Reutilizable (no dominio) |
| **Utils** | `common/utils/` | Funciones helper |
| **Event Bus** | `events/event.bus.ts` | Central event hub |

---

## 🎯 REGLAS DE ORO

```
1. ✅ Módulos completamente independientes
   ✅ Fitness NO importa Game
   ✅ Game NO importa Fitness

2. ✅ Comunicación vía EventBus
   ✅ Fitness emite evento
   ✅ Game escucha evento
   ✅ Sin llamadas directas

3. ✅ Tablas separadas por dominio
   ✅ fitness_* tables
   ✅ game_* tables
   ✅ Fácil de particionar después

4. ✅ DTOs específicas por módulo
   ✅ No compartir DTOs entre módulos
   ✅ Traducir en boundaries

5. ✅ Interfaces públicas limpias
   ✅ Exponer solo métodos públicos
   ✅ Esconder detalles de implementación

6. ✅ Tests por módulo
   ✅ Unit tests (mocked)
   ✅ Integration tests (con EventBus)
   ✅ Sin acoplamiento en tests
```

---

## 📝 EJEMPLO COMPLETO: Analytics Module

Ver estructura arriba (pasos 1-7) para crear nuevo módulo completamente desacoplado.

**Resultado:**
- Analytics NO depende de Fitness ni Game
- Fitness y Game NO dependen de Analytics
- Analytics escucha eventos de todos
- Extraer a microservicio = copiar código + cambiar eventos a remoto

---

**Usar esta guía para:**
- Crear nuevos módulos sin acoplamiento
- Extraer módulos a microservicios sin reescritura
- Escalar de 100k a 1M usuarios sin cambiar código
