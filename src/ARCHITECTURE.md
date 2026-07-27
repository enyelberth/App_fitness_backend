# ARQUITECTURA MODULAR - GUÍA DE DESARROLLO
**Proyecto:** FitQuest (Fitness + RPG Game)  
**Patrón:** Monolítico escalable a Microservicios  
**Status:** Estructura lista para implementación  

---

## 📁 ESTRUCTURA DE CARPETAS

```
src/
├── modules/                    # Dominios de negocio
│   ├── fitness/               # Dominio: Fitness
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── events/            # Emite eventos
│   │   ├── listeners/         # Escucha eventos
│   │   └── fitness.module.ts
│   │
│   ├── game/                  # Dominio: Game RPG
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── events/            # Emite eventos
│   │   ├── listeners/         # Escucha eventos (WorkoutCompletedEvent)
│   │   └── game.module.ts
│   │
│   ├── payments/              # Dominio: Pagos (extraible)
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   └── payments.module.ts
│   │
│   ├── economy/               # Dominio: Economía (extraible)
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── listeners/         # Escucha PaymentCompletedEvent
│   │   └── economy.module.ts
│   │
│   └── auth/                  # Dominio: Autenticación (COMPARTIDO)
│       ├── controllers/
│       ├── services/
│       ├── guards/
│       ├── strategies/
│       ├── dto/
│       ├── interfaces/
│       └── auth.module.ts
│
├── common/                    # Código compartido (NO de negocio)
│   ├── decorators/           # @CurrentUser(), @Public()
│   ├── guards/               # JwtAuthGuard, RolesGuard
│   ├── filters/              # ExceptionFilter
│   ├── pipes/                # ValidationPipe
│   ├── interceptors/         # LoggingInterceptor
│   ├── utils/                # password, jwt, validation
│   ├── dto/                  # PaginationDto, ErrorResponse
│   ├── types/                # AuthenticatedUser
│   ├── interfaces/           # ICrudRepository
│   ├── exceptions/           # CustomExceptions
│   └── common.module.ts
│
├── events/                    # Event Bus (El corazón del desacoplamiento)
│   ├── event.bus.ts          # Servicio central
│   ├── event.types.ts        # Tipos de eventos
│   └── events.module.ts
│
├── database/
│   ├── prisma.service.ts
│   ├── prisma.module.ts
│   └── migrations/
│
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
│
├── ARCHITECTURE.md           # Este archivo
└── app.module.ts
```

---

## 🎯 REGLAS DE ORO

### **REGLA 1: Módulos COMPLETAMENTE Independientes**

```typescript
// ✅ CORRECTO
// fitness.module.ts
@Module({
  imports: [CommonModule], // SOLO common
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService],
})
export class FitnessModule {}

// ❌ INCORRECTO
@Module({
  imports: [CommonModule, GameModule], // ❌ NO importar módulos
  // ...
})
export class FitnessModule {}
```

### **REGLA 2: Comunicación vía EventBus**

```typescript
// ✅ Fitness EMITE evento
// fitness/services/workouts.service.ts
async completeWorkout(workoutId: string, userId: string) {
  // Lógica fitness
  const xp = this.calculateXP(...);
  
  // EMITIR evento (NO llama game directamente)
  this.eventBus.emit(new WorkoutCompletedEvent(workoutId, userId, xp));
}

// ✅ Game ESCUCHA evento
// game/listeners/on-workout-completed.listener.ts
@Injectable()
export class OnWorkoutCompletedListener {
  onModuleInit() {
    this.eventBus.on(WorkoutCompletedEvent, (event) => {
      this.charactersService.awardXP(event.userId, event.xp);
    });
  }
}

// ❌ NUNCA HACER
// game/services/game.service.ts
constructor(private fitnessService: FitnessService) {}
someMethod() {
  this.fitnessService.updateWorkout(); // ❌ ACOPLAMIENTO
}
```

### **REGLA 3: DTOs Separadas por Módulo**

```typescript
// ✅ CORRECTO - DTOs específicas
// fitness/dto/workout.dto.ts
export class WorkoutDto {
  id: string;
  name: string;
  exercises: ExerciseInWorkoutDto[];
}

// game/dto/character.dto.ts
export class CharacterDto {
  id: string;
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

### **REGLA 4: Tablas Separadas por Dominio**

```sql
-- Fitness domain
CREATE TABLE fitness_workouts (...);
CREATE TABLE fitness_exercises (...);

-- Game domain
CREATE TABLE game_characters (...);
CREATE TABLE game_quests (...);

-- Payments domain
CREATE TABLE payments_orders (...);

-- Economy domain
CREATE TABLE economy_wallets (...);

-- Auth domain (compartido)
CREATE TABLE app_users (...);
```

### **REGLA 5: Interfaces Públicas Claras**

```typescript
// ✅ CORRECTO - Interface pública
// fitness/interfaces/ifitness.service.ts
export interface IFitnessService {
  getCompletedWorkouts(userId: string): Promise<Workout[]>;
  calculateXP(workoutId: string): Promise<number>;
}

// ❌ INCORRECTO - Exponer internals
export interface IBadService {
  private calculateXP();
  private updateCache();
}
```

---

## 🔄 CÓMO CREAR UN NUEVO MÓDULO

### **Paso 1: Crear estructura de carpetas**

```bash
mkdir -p src/modules/analytics/{controllers,services,repositories,entities,dto,interfaces,listeners}
```

### **Paso 2: Crear Entity**

```typescript
// src/modules/analytics/entities/analytics-event.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

### **Paso 3: Crear Repository**

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

### **Paso 4: Crear Service**

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

  // Escuchar eventos de otros módulos
  onModuleInit() {
    this.eventBus.on(WorkoutCompletedEvent, (event) => {
      this.logCustomEvent(event.userId, 'workout_completed', event);
    });
  }
}
```

### **Paso 5: Crear Controller**

```typescript
// src/modules/analytics/controllers/analytics.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from '../services/analytics.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('my-events')
  async getMyEvents(@CurrentUser() user: any) {
    return this.analyticsService.getEventsByUser(user.id);
  }
}
```

### **Paso 6: Crear Module**

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

### **Paso 7: Registrar en app.module.ts**

```typescript
// src/app.module.ts
@Module({
  imports: [
    // ... otros
    AnalyticsModule, // ← Agregar aquí
  ],
})
export class AppModule {}
```

---

## 📊 DEFINIR EVENTOS

### **Crear evento**

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
```

### **Emitir evento** (Fitness)

```typescript
// fitness/services/workouts.service.ts
async completeWorkout(workoutId: string, userId: string) {
  // Lógica
  const xp = 100;
  
  // Emitir
  this.eventBus.emit(
    new WorkoutCompletedEvent(workoutId, userId, xp, 60)
  );
}
```

### **Escuchar evento** (Game)

```typescript
// game/listeners/on-workout-completed.listener.ts
@Injectable()
export class OnWorkoutCompletedListener {
  constructor(private charactersService: CharactersService) {}

  onModuleInit() {
    this.eventBus.on(WorkoutCompletedEvent, (event) => {
      this.charactersService.awardXP(event.userId, event.xp);
    });
  }
}
```

---

## 🔀 EXTRAER A MICROSERVICIO (Después)

### **Paso 1: Copiar código**

```bash
cp -r src/modules/game game-backend/src/modules/game
```

### **Paso 2: Setup evento remoto**

```typescript
// game-backend/src/events/remote-event-listener.ts
@Injectable()
export class RemoteEventListener {
  constructor(private amqp: AmqpService) {}

  async subscribeToWorkoutCompleted() {
    this.amqp.subscribe('fitness.workout-completed', (event) => {
      // Manejar igual que antes
    });
  }
}
```

### **Paso 3: API Gateway**

```
GET /api/v1/fitness/* → fitness-backend:4000
GET /api/v1/game/* → game-backend:4001
GET /api/v1/auth/* → main-backend:4000
```

### **Paso 4: Listo**

```
ANTES: 1 Backend (fitness + game + auth)
DESPUÉS: 3 Backends (separados)
REESCRITURA: CERO (solo copiar código)
```

---

## ✅ CHECKLIST: Implementar Módulo

- [ ] Crear estructura de carpetas
- [ ] Crear entities
- [ ] Crear repository
- [ ] Crear service
- [ ] Crear DTOs
- [ ] Crear controller
- [ ] Crear interfaces
- [ ] Crear module
- [ ] Registrar en app.module.ts
- [ ] SI emite eventos: crear event classes
- [ ] SI escucha eventos: crear listeners
- [ ] Crear unit tests
- [ ] Crear integration tests
- [ ] Verificar que NO importa otros módulos de negocio

---

## 📚 REFERENCIAS RÁPIDAS

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
| **Decorators** | `common/decorators/` | Reutilizable |
| **Utils** | `common/utils/` | Funciones helper |
| **Event Bus** | `events/event.bus.ts` | Central event hub |

---

## 🚀 PRÓXIMOS PASOS

### **Phase 1: Refactorizar Phase 3 (Fitness)**
- [ ] Reorganizar workouts/ → fitness/workouts/
- [ ] Reorganizar exercises/ → fitness/exercises/
- [ ] Crear fitness.module.ts
- [ ] Separar DTOs
- [ ] Crear interfaces públicas
- [ ] Setup eventos (WorkoutCompletedEvent, ExercisePerformedEvent)

### **Phase 2: Implementar FitQuest MVP (Game)**
- [ ] Crear game/modules
- [ ] Crear CharactersService
- [ ] Crear QuestsService
- [ ] Crear game.module.ts
- [ ] Setup listeners para WorkoutCompletedEvent
- [ ] Crear game DTOs
- [ ] Crear game controllers

### **Phase 3: Implementar Payments & Economy**
- [ ] Crear payments/modules
- [ ] Crear economy/modules
- [ ] Setup listeners para pagos

### **Phase 4: Testing**
- [ ] Unit tests por módulo
- [ ] Integration tests (fitness-game)
- [ ] E2E tests

---

## 💡 TIPS

1. **No hagas imports circulares**: A no puede importar B si B importa A
2. **Usa interfaces**: Expone solo lo que otros módulos necesitan
3. **Emite eventos**: En lugar de llamadas directas
4. **Separa DTOs**: No compartas entre módulos
5. **Usa repositories**: Para acceso a datos
6. **Testea funcionalidad**: No implementación

---

**Estructura lista. Comienza a implementar módulos siguiendo los pasos arriba.**

¿Listo? 🚀
