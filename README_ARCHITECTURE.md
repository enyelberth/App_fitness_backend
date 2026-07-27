# ARQUITECTURA MODULAR - ÍNDICE
**Estructura lista para desarrollo**

---

## 📚 DOCUMENTOS PRINCIPALES

### 1. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** ⭐ EMPIEZA AQUÍ
- Mapa general de la arquitectura
- Componentes principales
- Flujos de datos (ejemplos reales)
- Testing strategy
- Roadmap de implementación
- Checklist de calidad

**¿Cuándo leer?** Cuando necesites entender la arquitectura general

---

### 2. **[src/ARCHITECTURE.md](./src/ARCHITECTURE.md)**
- Estructura de carpetas detallada
- 5 Reglas de Oro
- Cómo crear nuevo módulo (7 pasos)
- Event architecture
- Cómo extraer a microservicios

**¿Cuándo leer?** Cuando empieces a implementar módulos

---

### 3. **[ARCHITECTURE_SCALABILITY.md](./ARCHITECTURE_SCALABILITY.md)**
- Monolítico vs Microservicios
- Comparación ventajas/desventajas
- Cuándo cambiar de arquitectura
- Estrategia híbrida (HOY monolítico, MAÑANA microservicios)

**¿Cuándo leer?** Cuando tengas dudas sobre escalabilidad

---

### 4. **[MODULAR_ARCHITECTURE_GUIDE.md](./MODULAR_ARCHITECTURE_GUIDE.md)**
- Guía extensible para CUALQUIER sitio
- Princípios de arquitectura desacoplada
- Patrones de comunicación
- Cómo extaer a microservicios sin reescritura

**¿Cuándo leer?** Cuando quieras aplicar esto a otro proyecto

---

### 5. **[STRATEGY_ROADMAP.md](./STRATEGY_ROADMAP.md)**
- Análisis de 3 opciones de go-to-market
- Option C (RECOMENDADO): Hybrid approach
- Timeline de 5-7 semanas
- Revenue projections

**¿Cuándo leer?** Cuando necesites contexto del proyecto

---

### 6. **[CLAUDE.md](./CLAUDE.md)**
- Especificación completa de FitQuest
- Concepto, mechanics, monetization
- MVP roadmap
- Success metrics

**¿Cuándo leer?** Cuando quieras entender qué es FitQuest

---

## 📁 ESTRUCTURA DE MÓDULOS

### **Fitness Module**
```
src/modules/fitness/
├── [QUICK_START.md](./src/modules/fitness/QUICK_START.md)  ← Empieza aquí
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
├── interfaces/
├── events/
├── listeners/
└── fitness.module.ts

Template files:
├── .template-repository.ts
├── .template-service.ts
├── .template-controller.ts
├── dto/.template-dto.ts
├── events/.template-event.ts
└── listeners/.template-listener.ts
```

**Lee primero:** `src/modules/fitness/QUICK_START.md`

---

### **Game Module**
```
src/modules/game/
├── [QUICK_START.md](./src/modules/game/QUICK_START.md)  ← Empieza aquí
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
├── interfaces/
├── events/
├── listeners/
└── game.module.ts
```

**Lee primero:** `src/modules/game/QUICK_START.md`

---

### **Payments Module**
```
src/modules/payments/
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
└── payments.module.ts
```

**Status:** Template listo, implementar semana 2

---

### **Economy Module**
```
src/modules/economy/
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
├── listeners/
└── economy.module.ts
```

**Status:** Template listo, implementar semana 2

---

### **Auth Module**
```
src/modules/auth/
├── controllers/
├── services/
├── guards/
├── strategies/
├── dto/
└── auth.module.ts
```

**Status:** COMPARTIDO (no cambiar)

---

### **Common Utilities**
```
src/common/
├── decorators/           (@CurrentUser, @Public, @Roles)
├── guards/              (JwtAuthGuard, RolesGuard)
├── filters/             (ExceptionFilter)
├── pipes/               (ValidationPipe)
├── interceptors/        (LoggingInterceptor)
├── utils/               (password, jwt, validation)
├── dto/                 (PaginationDto, ErrorResponse)
├── types/               (AuthenticatedUser)
├── interfaces/          (ICrudRepository)
└── exceptions/          (CustomExceptions)
```

---

### **Event System**
```
src/events/
├── event.bus.ts         # Central event bus
├── event.types.ts       # Tipo de eventos
└── events.module.ts

Usage:
this.eventBus.emit(new WorkoutCompletedEvent(...));
this.eventBus.on(WorkoutCompletedEvent, (event) => {...});
```

---

## 🚀 CÓMO EMPEZAR

### **Paso 1: Lee documentación** (30 minutos)
```
1. Este archivo (README_ARCHITECTURE.md)
2. IMPLEMENTATION_GUIDE.md (mapa general)
3. src/ARCHITECTURE.md (estructura detallada)
```

### **Paso 2: Elige módulo** (5 minutos)
```
Recomendación: Empieza por Fitness
Razón: Es más simple que Game
```

### **Paso 3: Lee QUICK_START del módulo** (15 minutos)
```
src/modules/fitness/QUICK_START.md
↓
Entiende estructura
↓
Entiende paso a paso
```

### **Paso 4: Empieza a implementar** (3-4 horas por módulo)
```
Sigue los pasos:
1. Crear entity
2. Crear repository
3. Crear service
4. Crear DTOs
5. Crear controller
6. Crear events/listeners
7. Actualizar module
8. Tests
```

---

## 🎯 ROADMAP RECOMENDADO

### **Semana 1: Core MVP**
```
LUNES:
├─ Refactorizar Phase 3 (Fitness) → Fitness module
├─ Crear fitness entities, repositories, services
└─ Tiempo: 4 horas

MARTES-MIÉRCOLES:
├─ Implementar Fitness controllers + tests
├─ Crear eventos (WorkoutCompleted, ExercisePerformed)
└─ Tiempo: 4 horas

JUEVES-VIERNES:
├─ Implementar Game module
├─ Crear characters service
├─ Crear listeners (OnWorkoutCompleted)
└─ Tiempo: 6 horas
```

### **Semana 2: Payments + Economy**
```
LUNES:
├─ Payments module (lite version)
└─ Tiempo: 3 horas

MARTES-MIÉRCOLES:
├─ Economy module
├─ Wallets, transactions, listeners
└─ Tiempo: 4 horas

JUEVES-VIERNES:
├─ Integration testing
├─ Bug fixes
├─ Launch prep
└─ Tiempo: 4 horas
```

### **Resultado Semana 2:**
```
✅ Fitness MVP (refactorizado)
✅ Game MVP (characters, quests)
✅ Payments LITE (checkout)
✅ Economy (wallets, coins)
✅ TODO INTEGRADO vía EventBus
✅ LISTO para producción
```

---

## 🔑 REGLAS IMPORTANTES

### **SI ESTÁS en un módulo:**
✅ **HACES:**
- Crear entities de tu dominio
- Crear servicios de tu lógica
- Emitir eventos
- Escuchar eventos de otros módulos
- Usar repositories

❌ **NO HACES:**
- Importar otros módulos de negocio
- Llamadas directas a otros servicios
- Compartir DTOs
- Lógica en controllers
- Sin testing

### **Comunicación entre módulos:**
✅ **VÍA EVENTOS** (desacoplado)
```typescript
Fitness emite: WorkoutCompletedEvent
Game escucha:  @eventBus.on(WorkoutCompletedEvent, ...)
```

❌ **NO VÍA IMPORTS** (acoplado)
```typescript
// ❌ NUNCA
constructor(private fitnessService: FitnessService) {}
this.fitnessService.updateWorkout();
```

---

## 📊 ESTRUCTURA VISUAL

```
┌─ ARCHITECTURE.md
│  └─ Cómo está organizado todo
│
├─ IMPLEMENTATION_GUIDE.md
│  └─ Mapa y flujos
│
├─ STRATEGY_ROADMAP.md
│  └─ Por qué esta arquitectura
│
├─ MODULAR_ARCHITECTURE_GUIDE.md
│  └─ Para otros proyectos
│
├─ src/ARCHITECTURE.md
│  └─ Detalles técnicos
│
├─ src/modules/fitness/QUICK_START.md
│  └─ Cómo implementar Fitness
│
├─ src/modules/game/QUICK_START.md
│  └─ Cómo implementar Game
│
└─ [Código real]
   ├─ fitness/
   ├─ game/
   ├─ payments/
   ├─ economy/
   ├─ auth/
   ├─ common/
   └─ events/
```

---

## ✅ CHECKLIST: Antes de implementar

- [ ] Leí IMPLEMENTATION_GUIDE.md
- [ ] Leí src/ARCHITECTURE.md
- [ ] Leí QUICK_START del módulo
- [ ] Entiendo las 5 reglas de oro
- [ ] Entiendo cómo emitir eventos
- [ ] Entiendo cómo escuchar eventos
- [ ] Tengo carpetas creadas
- [ ] Tengo templates listos
- [ ] ¿Preguntas? Releer docs primero

---

## 🆘 SI NO ENTIENDES ALGO

**¿Cuál es la estructura?**
→ Lee `src/ARCHITECTURE.md`

**¿Cómo implemento un módulo?**
→ Lee `src/modules/{module}/QUICK_START.md`

**¿Cómo comunican módulos?**
→ Lee `IMPLEMENTATION_GUIDE.md` (flujos de datos)

**¿Puedo importar otro módulo?**
→ NO, usa eventos (ver ARCHITECTURE.md, Regla 2)

**¿Dónde pongo validación?**
→ En DTOs con class-validator

**¿Dónde pongo lógica compleja?**
→ En Services, no Controllers

**¿Cómo testeo?**
→ Mira templates de test en módulos

---

## 🚀 LISTO PARA EMPEZAR

```
1. Ve a: src/modules/fitness/QUICK_START.md
2. Sigue pasos 1-8
3. Crea entities → controllers
4. Tests mientras desarrollas
5. Emite eventos
6. ¡Hazlo!
```

---

**Última actualización:** Julio 26, 2025  
**Versión:** 1.0 - MVP Ready  
**Estado:** ✅ Estructura lista, listo para desarrollo
