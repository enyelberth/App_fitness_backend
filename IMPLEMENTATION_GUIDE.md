# GUÍA DE IMPLEMENTACIÓN COMPLETA
**FitQuest - Arquitectura Modular**

---

## 🗺️ MAPA DE LA ARQUITECTURA

```
┌─────────────────────────────────────────────────────┐
│           API Gateway / HTTP Requests               │
└────────────────┬────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌────────────┐  ┌────────────┐
    │  Fitness   │  │    Game    │
    │  Module    │  │   Module   │
    └────────────┘  └────────────┘
         │                │
         └────────┬───────┘
                  │
            ┌─────▼──────┐
            │ Event Bus  │
            │ (Central)  │
            └──────┬─────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    ┌────────┐ ┌──────────┐ ┌────────┐
    │Payments│ │ Economy  │ │Analytics│
    └────────┘ └──────────┘ └────────┘

    EVENTOS:
    Fitness → WorkoutCompleted
              ExercisePerformed
    
    Game → CharacterLeveledUp
           QuestCompleted
    
    Payments → PaymentCompleted
    
    Economy → CoinsAwarded
              GemsSpent
```

---

## 📚 COMPONENTES PRINCIPALES

### 1. **Fitness Module**
**Ubicación:** `src/modules/fitness/`

**Responsabilidades:**
- Gestionar workouts (rutinas)
- Rastrear exercises (ejercicios)
- Registrar sesiones de entrenamiento
- Calcular métricas (volumen, duración, RPE)
- **EMITE eventos:** WorkoutCompleted, ExercisePerformed

**NO HACE:**
- No otorga XP (eso es Game)
- No maneja pagos (eso es Payments)
- No toca economía de jugador

**Archivo de inicio:** `src/modules/fitness/QUICK_START.md`

---

### 2. **Game Module**
**Ubicación:** `src/modules/game/`

**Responsabilidades:**
- Gestionar personajes
- Otorgar XP y subidas de nivel
- Crear y rastrear misiones (quests)
- Manejar cosmética (ropa, armas, etc)
- Mantener leaderboards
- **EMITE eventos:** CharacterLeveledUp, QuestCompleted
- **ESCUCHA eventos:** WorkoutCompleted (fitness)

**NO HACE:**
- No registra entrenamientos (eso es Fitness)
- No maneja pagos (eso es Payments)

**Archivo de inicio:** `src/modules/game/QUICK_START.md`

---

### 3. **Payments Module**
**Ubicación:** `src/modules/payments/`

**Responsabilidades:**
- Procesar pagos (Stripe, PayPal, etc)
- Crear órdenes
- Manejar webhooks de pago
- **EMITE eventos:** PaymentCompleted, RefundProcessed

**NO HACE:**
- No otorga items (eso es Game/Economy)
- No calcula precios

---

### 4. **Economy Module**
**Ubicación:** `src/modules/economy/`

**Responsabilidades:**
- Gestionar wallets de usuarios
- Rastrear transacciones (coins, gems)
- Aplicar rewards por quests
- **ESCUCHA eventos:** 
  - PaymentCompleted (payments)
  - QuestCompleted (game)
  - WorkoutCompleted (fitness)

**NO HACE:**
- No maneja pagos
- No otorga XP

---

### 5. **Event Bus**
**Ubicación:** `src/events/`

**Responsabilidades:**
- Central de eventos para toda la app
- Emit/On pattern para comunicación
- Sin acoplamiento directo entre módulos

**Cómo funciona:**
```typescript
// Emit (de any módulo)
this.eventBus.emit(new WorkoutCompletedEvent(...));

// Listen (de any módulo)
this.eventBus.on(WorkoutCompletedEvent, (event) => {...});
```

---

## 🔄 FLUJOS DE DATOS (EJEMPLOS)

### **Flujo 1: Usuario completa workout**

```
1. Usuario termina sesión en Fitness app
2. Fitness API: PATCH /workout-sessions/:id/complete
3. WorkoutsService.completeWorkout()
4. Emite: WorkoutCompletedEvent
   - { workoutId, userId, xp: 100, duration: 60 }

5. Game listener escucha evento
   OnWorkoutCompletedListener.handle()
6. CharactersService.awardXP(userId, 100)
7. Character XP += 100
8. Check si levelUp()
9. Si level up: Emite CharacterLeveledUpEvent

10. Economy listener escucha
    CharacterLeveledUpEvent
11. Reward coins al usuario
    CoinsTransaction: +50 coins

12. User ve notification:
    "Level 5! +100 XP, +50 coins, New shirt unlocked!"
```

---

### **Flujo 2: Usuario compra battle pass**

```
1. Usuario: POST /payments/checkout
2. PaymentsService.createCheckout()
3. Integra con Stripe
4. Usuario paga
5. Webhook: Stripe → /payments/webhook
6. PaymentWebhookService.handle()
7. Emite: PaymentCompletedEvent
   - { userId, orderId, amount: $9.99, type: 'BATTLE_PASS' }

8. Economy listener escucha
   OnPaymentCompletedListener.handle()
9. WalletsService.addGemsForPayment(userId, 1000)
10. GemsTransaction: +1000 gems
11. BattlePassService.activateBattlePass(userId)

12. User ve:
    "Battle Pass activated! 1000 gems added"
```

---

### **Flujo 3: Daily Quest reward**

```
1. User completes daily quest
2. Game API: POST /game/quests/:id/complete
3. QuestService.completeQuest()
4. Emite: QuestCompletedEvent
   - { questId, userId, reward: { xp: 50, coins: 100 } }

5. Economy listener escucha
   OnQuestCompletedListener.handle()
6. CoinsTransaction: +100 coins
7. XpTransaction: +50 xp (si aplica)

8. Character nivel sube?
   → Emite CharacterLeveledUpEvent
   → Economy agrega bonus coins

9. User notification cascade:
   "Quest complete! +50 XP, +100 coins"
   "Level 10! +250 bonus coins"
```

---

## 🧪 TESTING STRATEGY

### **Unit Tests (por módulo)**
```
src/modules/fitness/test/workout.service.spec.ts
- Mock PrismaService
- Mock EventBusService
- Test create, update, delete
- Verify events emitted
```

### **Integration Tests (cross-module)**
```
src/modules/game/test/on-workout-completed.integration.spec.ts
- Setup real EventBus
- Emit WorkoutCompletedEvent
- Verify CharactersService.awardXP() called
- Verify CharacterLeveledUpEvent emitted
```

### **E2E Tests**
```
test/e2e/workout-to-level-up.e2e.spec.ts
1. Create user
2. Complete workout
3. Assert character leveled up
4. Assert cosmetic unlocked
5. Assert coins rewarded
```

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### **SEMANA 1: MVP Core**
```
Monday:    Fitness refactor (entities, services, controllers)
Tuesday:   Game characters (create, level up)
Wednesday: Game quests (daily, weekly)
Thursday:  Event system integration
Friday:    Testing + bug fixes
```

### **SEMANA 2: Payments + Economy**
```
Monday:    Payments module setup
Tuesday:   Economy wallets + transactions
Wednesday: Event listeners (payment → coins)
Thursday:  Battle pass system
Friday:    Integration testing
```

### **SEMANA 3: Polish**
```
Monday-Thursday: Additional features, edge cases, security
Friday:          Launch readiness
```

---

## 📋 CHECKLIST: ANTES DE EMPEZAR CADA MÓDULO

### **Pre-Implementation**
- [ ] Leer QUICK_START.md del módulo
- [ ] Revisar ARCHITECTURE.md
- [ ] Entender qué módulos escucha/emite

### **Entities**
- [ ] Crear entity classes
- [ ] Agregar campos necesarios
- [ ] Soft deletes (deletedAt?)
- [ ] Índices en BD

### **Repository**
- [ ] Métodos CRUD básicos
- [ ] Filtros por userId
- [ ] Pagination support
- [ ] Usar transactions donde sea necesario

### **Service**
- [ ] Lógica de negocio
- [ ] Error handling
- [ ] ¡EMITIR EVENTOS!
- [ ] Usar repositories (no Prisma directo)

### **DTOs**
- [ ] CreateDto con validación
- [ ] UpdateDto (todos opcionales)
- [ ] ResponseDto (no exponer internals)
- [ ] Swagger decorators

### **Controller**
- [ ] @UseGuards(JwtAuthGuard) en POST/PATCH/DELETE
- [ ] @CurrentUser() para obtener userId
- [ ] Swagger decorators
- [ ] Respuestas consistentes
- [ ] Error handling

### **Tests**
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests con EventBus
- [ ] E2E tests (si aplica)
- [ ] Edge cases

### **Module**
- [ ] Registrar en providers
- [ ] Registrar en exports
- [ ] Imports correctos
- [ ] ¡NO importar otros módulos!

---

## 🔗 REFERENCIAS RÁPIDAS

### **DTOs Comunes**
```typescript
// Pagination
export class PaginationDto {
  @IsOptional()
  skip?: number = 0;
  
  @IsOptional()
  take?: number = 10;
}

// Respuesta estándar
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}
```

### **Estructura de carpetas (plantilla)**
```
src/modules/{domain}/
├── controllers/       # HTTP endpoints
├── services/         # Business logic
├── repositories/     # Data access
├── entities/         # DB models
├── dto/              # Request/Response
├── interfaces/       # Public contracts
├── events/           # Event definitions
├── listeners/        # Event handlers
├── test/             # Unit tests
└── {domain}.module.ts
```

### **Decoradores útiles**
```typescript
@UseGuards(JwtAuthGuard)           // Require auth
@CurrentUser() user: any            // Get current user
@Roles('ADMIN')                     // Role-based access
@Public()                           // Skip auth
@ApiTags('fitness')                 // Swagger grouping
@ApiBearerAuth()                    // Swagger auth
```

---

## ✅ QUALITY GATES

Antes de merging:

- [ ] **Compilation:** `npm run build` (sin errores)
- [ ] **Tests:** `npm run test` (>80% coverage)
- [ ] **Linting:** `npm run lint` (sin warnings)
- [ ] **Type checking:** Tipos correctos, no `any`
- [ ] **No circular imports:** Verificar
- [ ] **Eventos emitidos:** En services relevantes
- [ ] **No imports circulares:** A → B → A ❌
- [ ] **Swagger docs:** Visible y correcto
- [ ] **Error handling:** Excepciones correctas
- [ ] **Soft deletes:** Si aplica

---

## 🎯 PRÓXIMOS PASOS

1. **Lee ARCHITECTURE.md** - Entiende la estructura global
2. **Abre Fitness QUICK_START** - Empieza por Fitness
3. **Sigue pasos 1-8** - Crea entity → controller
4. **Después Game QUICK_START** - Implementa Game
5. **Integra Events** - Fitness → Game vía eventos
6. **Testing** - Unit + Integration tests
7. **Lanzamiento** - Deploy a producción

---

## 💡 TIPS

1. **Emite eventos en services, no controllers**
2. **Listeners en formato OnXxxListener**
3. **DTOs separadas = fácil refactoring después**
4. **Tests mientras desarrollas, no después**
5. **No compiles cambios no testeados**
6. **Logging en operaciones críticas**
7. **Errores descriptivos (NotFoundException, ConflictException)**
8. **Pagination en todos los GET listados**

---

**¿Listo?** 

1. Ve a `src/modules/fitness/QUICK_START.md`
2. Empieza creando entities
3. Sigue paso a paso
4. ¡Buena suerte! 🚀
