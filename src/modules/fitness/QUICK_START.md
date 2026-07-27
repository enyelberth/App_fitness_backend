# QUICK START: Fitness Module

**Instrucciones para implementar el módulo de Fitness**

---

## 📋 Paso a Paso

### 1. **Crear Entity** (Modelo de BD)

Crear archivo: `entities/workout.entity.ts`

```typescript
// Basarse en: .template-entity.ts
// Cambiar "PLACEHOLDER" por nombre real (Workout, Exercise, etc)
```

**Archivos a crear:**
- `entities/workout.entity.ts`
- `entities/exercise.entity.ts`
- `entities/workout-session.entity.ts`
- Etc...

---

### 2. **Crear Repository** (Acceso a datos)

Crear archivo: `repositories/workout.repository.ts`

```typescript
// Basarse en: .template-repository.ts
// Métodos: create, findById, findByUserId, update, delete, count
```

**Archivos a crear:**
- `repositories/workout.repository.ts`
- `repositories/exercise.repository.ts`
- Etc...

---

### 3. **Crear Service** (Lógica de negocio)

Crear archivo: `services/workout.service.ts`

```typescript
// Basarse en: .template-service.ts
// Métodos: create, getById, listByUser, update, delete
// ¡IMPORTANTE! Emitir eventos aquí
```

**Archivos a crear:**
- `services/workout.service.ts`
- `services/exercise.service.ts`
- `services/workout-session.service.ts`
- Etc...

---

### 4. **Crear DTOs** (Transfer Objects)

Crear archivo: `dto/create-workout.dto.ts`

```typescript
// Basarse en: dto/.template-dto.ts
// DTOs: CreateWorkoutDto, UpdateWorkoutDto, WorkoutResponseDto
```

**Archivos a crear:**
- `dto/create-workout.dto.ts`
- `dto/update-workout.dto.ts`
- `dto/workout-response.dto.ts`
- Etc...

---

### 5. **Crear Events** (Eventos)

Crear archivo: `events/workout-completed.event.ts`

```typescript
// Basarse en: events/.template-event.ts
// Eventos: WorkoutCompletedEvent, ExercisePerformedEvent, etc
```

**Archivos a crear:**
- `events/workout-completed.event.ts`
- `events/exercise-performed.event.ts`
- Etc...

---

### 6. **Crear Controller** (HTTP endpoints)

Crear archivo: `controllers/workout.controller.ts`

```typescript
// Basarse en: .template-controller.ts
// Endpoints: POST, GET, GET:id, PATCH, DELETE
```

**Archivos a crear:**
- `controllers/workout.controller.ts`
- `controllers/exercise.controller.ts`
- Etc...

---

### 7. **Crear Listeners** (Event handlers)

Crear archivo: `listeners/on-workout-completed.listener.ts`

```typescript
// Basarse en: listeners/.template-listener.ts
// Listener escucha WorkoutCompletedEvent y reacciona
```

**Archivos a crear:**
- Solo si el módulo ESCUCHA eventos de otros módulos
- Fitness generalmente EMITE (no escucha)

---

### 8. **Actualizar Module**

Actualizar archivo: `fitness.module.ts`

```typescript
// Descomenta y agregue imports reales
// Registre todos los controllers, services, repositories, listeners
```

---

## 🚀 Orden Recomendado

**Día 1 (Workouts):**
1. Crear `entities/workout.entity.ts`
2. Crear `repositories/workout.repository.ts`
3. Crear `services/workout.service.ts`
4. Crear `dto/workout.dto.ts`
5. Crear `controllers/workout.controller.ts`
6. Actualizar `fitness.module.ts`

**Día 2 (Exercises):**
Repetir pasos 1-6 para exercises

**Día 3 (Sessions):**
Repetir pasos 1-6 para workout sessions + crear eventos

---

## 📁 Estructura Final

```
src/modules/fitness/
├── controllers/
│   ├── workout.controller.ts
│   ├── exercise.controller.ts
│   └── workout-session.controller.ts
├── services/
│   ├── workout.service.ts
│   ├── exercise.service.ts
│   └── workout-session.service.ts
├── repositories/
│   ├── workout.repository.ts
│   ├── exercise.repository.ts
│   └── workout-session.repository.ts
├── entities/
│   ├── workout.entity.ts
│   ├── exercise.entity.ts
│   └── workout-session.entity.ts
├── dto/
│   ├── create-workout.dto.ts
│   ├── update-workout.dto.ts
│   └── workout-response.dto.ts
├── interfaces/
│   └── ifitness.service.ts
├── events/
│   ├── workout-completed.event.ts
│   └── exercise-performed.event.ts
├── listeners/
│   └── (solo si escucha eventos)
└── fitness.module.ts
```

---

## 🔑 Reglas Importantes

✅ **DEBE HACER:**
- [ ] Emitir eventos en services
- [ ] Usar repositories para acceso a datos
- [ ] Crear DTOs para request/response
- [ ] Validation en DTOs
- [ ] Error handling
- [ ] Tests unitarios
- [ ] TypeScript stricto

❌ **NO HACER:**
- [ ] Importar otros módulos (game, payments, etc)
- [ ] Llamadas directas a otros servicios
- [ ] DTOs compartidas con otros módulos
- [ ] Lógica de BD en controllers
- [ ] Exponer detalles internos en interfaces

---

## 🧪 Testing

Crear archivo: `test/fitness.service.spec.ts`

```typescript
// Test debe mockear:
// - PrismaService
// - EventBusService
// - Verificar que eventos se emiten
```

---

## ✅ Checklist Antes de Mergear

- [ ] Código compila sin errores
- [ ] Todos los imports están correctos
- [ ] Fixtures/seeders funcionan (si hay)
- [ ] Controllers tienen @UseGuards(JwtAuthGuard)
- [ ] DTOs tienen validación
- [ ] Services emiten eventos
- [ ] No hay imports de otros módulos
- [ ] Tests pasan
- [ ] Swagger docs se ven correctas

---

**¡Listo para empezar!** 🚀

Usa los templates en este directorio como base.
