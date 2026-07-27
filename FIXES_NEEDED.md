# 🔧 FIXES EXACTOS NECESARIOS

**Lista precisa de qué debe cambiar para que compile**

---

## 1️⃣ FIX: auth.controller.ts - Imports incorrectos

**Archivo:** `src/modules/auth/auth.controller.ts`  
**Línea:** 5

**CAMBIAR:**
```typescript
import { Public, CurrentUser } from '../common';
```

**POR:**
```typescript
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
```

---

## 2️⃣ FIX: auth.controller.ts - Import de guard

**Archivo:** `src/modules/auth/auth.controller.ts`  
**Línea:** 7

**CAMBIAR:**
```typescript
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
```

**POR:**
```typescript
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
```

(Este ya está correcto, dejar igual)

---

## 3️⃣ FIX: users.controller.ts - Imports incorrectos

**Archivo:** `src/modules/users/users.controller.ts`  
**Línea:** 9-10

**CAMBIAR:**
```typescript
import { CurrentUser, Public } from '../../common';
```

**POR:**
```typescript
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
```

---

## 4️⃣ FIX: prisma/seed.ts - Bug en seedCosmetics

**Archivo:** `prisma/seed.ts`  
**Función:** seedCosmetics (completa)

**CAMBIAR ESTO:**
```typescript
async function seedCosmetics() {
  const cosmetics = [
    { name: 'Fire Aura', type: 'AURA', rarity: 'RARE', price: 100, gemPrice: 50 },
    // ...
  ];

  for (const cosmetic of cosmetics) {
    await prisma.gameCosmetic.upsert({
      where: { id: cosmetic.name },
      update: {},
      create: {
        id: cosmetic.name.replace(/\s+/g, '-').toLowerCase(),
        name: cosmetic.name,
        type: cosmetic.type,
        rarity: cosmetic.rarity,
        price: cosmetic.price,
        gemPrice: cosmetic.gemPrice,
      },
    }).catch(() => {});
  }
  console.log('✅ Cosmetics seeded (15)');
}
```

**POR ESTO:**
```typescript
async function seedCosmetics() {
  const cosmetics = [
    { name: 'Fire Aura', type: 'AURA', rarity: 'RARE', price: 100, gemPrice: 50 },
    { name: 'Ice Aura', type: 'AURA', rarity: 'RARE', price: 100, gemPrice: 50 },
    { name: 'Lightning Aura', type: 'AURA', rarity: 'EPIC', price: 200, gemPrice: 100 },
    { name: 'Gold Dumbbell', type: 'WEAPON', rarity: 'EPIC', price: 500, gemPrice: 250 },
    { name: 'Platinum Barbell', type: 'WEAPON', rarity: 'LEGENDARY', price: 1000, gemPrice: 500 },
    { name: 'Diamond Sword', type: 'WEAPON', rarity: 'LEGENDARY', price: 1500, gemPrice: 750 },
    { name: 'Gym Shirt Red', type: 'OUTFIT', rarity: 'COMMON', price: 50, gemPrice: 25 },
    { name: 'Gym Shirt Blue', type: 'OUTFIT', rarity: 'COMMON', price: 50, gemPrice: 25 },
    { name: 'Athletic Shoes', type: 'OUTFIT', rarity: 'COMMON', price: 75, gemPrice: 35 },
    { name: 'Hoodie Black', type: 'OUTFIT', rarity: 'RARE', price: 150, gemPrice: 75 },
    { name: 'Trainer Hat', type: 'ACCESSORY', rarity: 'COMMON', price: 50, gemPrice: 25 },
    { name: 'Gym Gloves', type: 'ACCESSORY', rarity: 'COMMON', price: 60, gemPrice: 30 },
    { name: 'Dragon Pet', type: 'PET', rarity: 'LEGENDARY', price: 2000, gemPrice: 1000 },
    { name: 'Wolf Pet', type: 'PET', rarity: 'EPIC', price: 800, gemPrice: 400 },
    { name: 'Phoenix Pet', type: 'PET', rarity: 'LEGENDARY', price: 2000, gemPrice: 1000 },
  ];

  for (const cosmetic of cosmetics) {
    try {
      await prisma.gameCosmetic.create({
        data: {
          name: cosmetic.name,
          type: cosmetic.type,
          rarity: cosmetic.rarity,
          price: cosmetic.price,
          gemPrice: cosmetic.gemPrice,
        },
      });
    } catch (e) {
      // Ignore if already exists
    }
  }
  console.log('✅ Cosmetics seeded (15)');
}
```

---

## 5️⃣ FIX: prisma/schema.prisma - Relaciones incompletas

**Archivo:** `prisma/schema.prisma`  
**Modelo:** User

**AGREGAR después de `createdWorkoutTemplate`:**
```prisma
  gameCharacter     GameCharacter?
  gameWallet        GameWallet?
  gameTransactions  GameTransaction[]
  gamePayments      GamePayment[]
```

**VERSIÓN COMPLETA del modelo User debe verse así:**
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  username        String    @unique
  passwordHash    String
  role            Role      @default(USER)
  emailVerifiedAt DateTime?
  deletedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  profile                  Profile?
  sessions                 AuthSession[]
  workouts                 Workout[]
  progressEntries          ProgressEntry[]
  payments                 Payment[]
  wallet                   Wallet?
  ratings                  ExerciseRating[]
  favorites                UserFavorite[]
  workoutSessions          WorkoutSession[] @relation("WorkoutSessions")
  createdWorkoutTemplate   WorkoutTemplate[] @relation("CreatedTemplates")
  
  // AGREGAR ESTOS:
  gameCharacter            GameCharacter?
  gameWallet               GameWallet?
  gameTransactions         GameTransaction[]
  gamePayments             GamePayment[]

  @@index([role])
  @@index([deletedAt])
  @@map("app_users")
}
```

---

## 6️⃣ FIX: package.json - Verificar dependencias

**Archivo:** `package.json`

**Verificar que existen estas líneas en `dependencies`:**
```json
"@nestjs/jwt": "^10.2.0",
"@nestjs/passport": "^10.0.3",
"bcryptjs": "^0.41.1",
"passport": "^0.7.0",
"passport-jwt": "^4.0.1",
"passport-local": "^1.0.0"  // ← CRÍTICO
```

**Si falta `passport-local`, ejecutar:**
```bash
npm install passport-local
```

---

## 7️⃣ FIX: app.module.ts - Verificar que AuthModule está importado

**Archivo:** `src/app.module.ts`

**VERIFICAR QUE EXISTE:**
```typescript
import { AuthModule } from "./modules/auth/auth.module";
```

**Y en imports array:**
```typescript
imports: [
  // ... otros
  AuthModule,      // ← DEBE ESTAR
  UsersModule,     // ← DEBE ESTAR
  // ... otros
]
```

---

## 📋 CHECKLIST: APPLY FIXES EN ORDEN

```
[ ] 1. Arreglar auth.controller.ts imports (línea 5)
[ ] 2. Arreglar users.controller.ts imports
[ ] 3. Arreglar seed.ts seedCosmetics function
[ ] 4. Agregar relaciones en prisma/schema.prisma (modelo User)
[ ] 5. Instalar passport-local: npm install passport-local
[ ] 6. Verificar app.module.ts tiene AuthModule y UsersModule
[ ] 7. Ejecutar: npm run build
[ ] 8. Si build OK: npm run start:dev
[ ] 9. Ir a http://localhost:3000/docs
[ ] 10. Testear POST /auth/register
```

---

## 🚀 DESPUÉS DE FIXES

```bash
# 1. Compilar
npm run build

# 2. Si compila sin errores:
npm run start:dev

# 3. Si inicia sin errores:
npm run db:seed

# 4. Acceder a Swagger
http://localhost:3000/docs
```

---

## ⏱️ TIEMPO ESTIMADO

- Fix 1-2 (imports): 2 minutos
- Fix 3 (seed.ts): 5 minutos
- Fix 4 (Prisma): 3 minutos
- Fix 5 (dependencies): 1 minuto
- Fix 6-7 (app.module): 2 minutos
- Build & test: 5 minutos

**TOTAL: 18 MINUTOS**

---

**¿Quieres que aplique estos 7 fixes automáticamente?**

Dime "sí" y los hago todos ahora.
