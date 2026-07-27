# QUICK START: Game Module

**Instrucciones para implementar el módulo Game RPG**

---

## 📋 Características Principales

```
1. Characters (Personajes)
2. Quests (Misiones)
3. Cosmetics (Cosmética)
4. XP/Leveling (Progresión)
5. Battles (Batallas)
6. Leaderboards (Leaderboards)
```

---

## 🚀 Paso a Paso

### **Fase 1: Characters (Personajes)**

**Crear:**
- `entities/character.entity.ts`
- `repositories/character.repository.ts`
- `services/character.service.ts`
- `services/xp-calculator.service.ts`
- `dto/create-character.dto.ts`, `character-response.dto.ts`
- `controllers/character.controller.ts`
- `events/character-created.event.ts`, `character-leveled-up.event.ts`

**Funcionalidad:**
```
POST   /game/characters              - Crear personaje
GET    /game/characters/me           - Mi personaje
GET    /game/characters/{id}         - Ver personaje
PATCH  /game/characters/me           - Actualizar apariencia
POST   /game/characters/me/customize - Equipar cosmética
```

**Listeners:**
```
- OnWorkoutCompletedListener (escucha fitness)
  → awardXP() cuando workout se completa
  → check si level up
```

---

### **Fase 2: Quests (Misiones)**

**Crear:**
- `entities/quest.entity.ts`, `player-quest.entity.ts`
- `repositories/quest.repository.ts`
- `services/quest.service.ts`
- `dto/quest-response.dto.ts`, `complete-quest.dto.ts`
- `controllers/quest.controller.ts`
- `events/quest-completed.event.ts`

**Funcionalidad:**
```
GET    /game/quests                  - Quests disponibles
GET    /game/quests/my-progress      - Mi progreso
POST   /game/quests/{id}/complete    - Completar quest
GET    /game/quests/{id}/progress    - Progreso específico
```

**Tipos de Quests:**
```
Daily: Completar 1 workout
Weekly: Completar 5 workouts
Seasonal: Llegar a level 50
```

---

### **Fase 3: Cosmetics (Cosmética)**

**Crear:**
- `entities/cosmetic.entity.ts`, `inventory.entity.ts`
- `repositories/cosmetic.repository.ts`
- `services/cosmetic.service.ts`
- `dto/cosmetic-response.dto.ts`
- `controllers/cosmetic.controller.ts`

**Funcionalidad:**
```
GET    /game/cosmetics               - Catálogo de cosmética
GET    /game/cosmetics/owned         - Mi inventario
POST   /game/cosmetics/{id}/equip    - Equipar item
GET    /game/characters/me/appearance - Apariencia actual
```

---

### **Fase 4: Leaderboards (Leaderboards)**

**Crear:**
- `entities/leaderboard-entry.entity.ts`
- `repositories/leaderboard.repository.ts`
- `services/leaderboard.service.ts`
- `controllers/leaderboard.controller.ts`

**Funcionalidad:**
```
GET    /game/leaderboard/global      - Top 100 globales
GET    /game/leaderboard/weekly      - Top semanal
GET    /game/leaderboard/me          - Mi posición
```

---

## 🔌 Integración con Fitness

### **Listeners que Game debe crear:**

```typescript
// Listener 1: Cuando workout se completa
@Injectable()
export class OnWorkoutCompletedListener {
  // Escucha WorkoutCompletedEvent de fitness
  // Action: charactersService.awardXP(userId, xp)
  //         Update leaderboards
  //         Check quests
  //         Emit CharacterLeveledUpEvent si es necesario
}

// Listener 2: Cuando ejercicio se realiza
@Injectable()
export class OnExercisePerformedListener {
  // Escucha ExercisePerformedEvent de fitness
  // Action: Track stats
  //         Update cosmetic unlocks
}
```

---

## 📁 Estructura Final

```
src/modules/game/
├── controllers/
│   ├── character.controller.ts
│   ├── quest.controller.ts
│   ├── cosmetic.controller.ts
│   └── leaderboard.controller.ts
├── services/
│   ├── character.service.ts
│   ├── quest.service.ts
│   ├── cosmetic.service.ts
│   ├── xp-calculator.service.ts
│   └── leaderboard.service.ts
├── repositories/
│   ├── character.repository.ts
│   ├── quest.repository.ts
│   ├── cosmetic.repository.ts
│   └── leaderboard.repository.ts
├── entities/
│   ├── character.entity.ts
│   ├── quest.entity.ts
│   ├── player-quest.entity.ts
│   ├── cosmetic.entity.ts
│   ├── inventory.entity.ts
│   └── leaderboard-entry.entity.ts
├── dto/
│   ├── create-character.dto.ts
│   ├── character-response.dto.ts
│   ├── quest-response.dto.ts
│   └── cosmetic-response.dto.ts
├── interfaces/
│   └── igame.service.ts
├── events/
│   ├── character-created.event.ts
│   ├── character-leveled-up.event.ts
│   └── quest-completed.event.ts
├── listeners/
│   ├── on-workout-completed.listener.ts
│   └── on-exercise-performed.listener.ts
└── game.module.ts
```

---

## 🎯 Orden de Implementación

**Semana 1: Characters**
- Day 1: Crear character entity + repository
- Day 2: Crear character service + xp calculator
- Day 3: Crear character controller + DTOs
- Day 4: Crear listeners (OnWorkoutCompleted)

**Semana 2: Quests**
- Day 1: Crear quest entities + repository
- Day 2: Crear quest service
- Day 3: Crear quest controller
- Day 4: Testing

**Semana 3: Cosmetics + Leaderboards**
- Day 1: Crear cosmetic entities + service
- Day 2: Crear leaderboard service
- Day 3: Controllers
- Day 4: Integration tests

---

## 🔑 Diferencia con Fitness

| Aspecto | Fitness | Game |
|---------|---------|------|
| **Emite** | WorkoutCompleted, ExercisePerformed | CharacterLeveledUp, QuestCompleted |
| **Escucha** | Nada | WorkoutCompleted, ExercisePerformed |
| **Almacena** | Workouts, Sessions | Characters, Quests, Cosmetics |
| **Lógica** | Fitness science | Game mechanics |

---

## ⚡ Recomendación

**MVP (Semana 1-2):**
- ✅ Characters (create, level up, customize)
- ✅ Basic Quests (daily, weekly)
- ✅ Leaderboards (simple)
- ❌ Battles (después)
- ❌ Guilds (después)
- ❌ Advanced Cosmetics (después)

**Esto es suficiente para:**
- Ejercicio → XP
- Level up
- Earn cosmetics
- Ver ranking

---

## ✅ Checklist

- [ ] Characters listos y testeados
- [ ] XP award funcionando
- [ ] Level up event emitido
- [ ] Listeners escuchando fitness events
- [ ] Quests creadas dinámicamente
- [ ] Leaderboards actualizándose
- [ ] Cosmetics equipables
- [ ] DTOs validadas
- [ ] Tests > 80% coverage
- [ ] No importa fitness module (solo eventos)

---

**¡Listo para empezar!** 🚀

El módulo Game es el más complejo. Empieza por Characters.
