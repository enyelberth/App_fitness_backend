# 🚀 QUICK START - Implementación Paso a Paso

**Fecha:** Julio 26, 2025  
**Duración estimada:** 12-16 horas (MVP funcional)

---

## 📋 CHECKLIST RÁPIDO

```
FASE 1: Foundation (2-3 horas)
├─ [ ] src/common/decorators/*.ts (3 archivos)
├─ [ ] src/common/guards/*.ts (2 archivos)
├─ [ ] src/common/filters/*.ts (1 archivo)
├─ [ ] src/common/interceptors/*.ts (1 archivo)
├─ [ ] src/common/types/*.ts (1 archivo)
├─ [ ] src/common/exceptions/*.ts (1 archivo)
├─ [ ] src/common/common.module.ts
└─ [ ] Update src/main.ts

FASE 2: Auth (3-4 horas)
├─ [ ] src/modules/auth/auth.service.ts
├─ [ ] src/modules/auth/auth.controller.ts
├─ [ ] src/modules/auth/jwt.strategy.ts
├─ [ ] src/modules/auth/local.strategy.ts
├─ [ ] src/modules/auth/dto/*.ts
├─ [ ] src/modules/auth/auth.module.ts
└─ [ ] Update src/app.module.ts

FASE 3: Users (2-3 horas)
├─ [ ] src/modules/users/users.service.ts
├─ [ ] src/modules/users/users.controller.ts
├─ [ ] src/modules/users/dto/*.ts
├─ [ ] src/modules/users/users.module.ts
└─ [ ] Update src/app.module.ts

FASE 4: Database (2 horas)
├─ [ ] prisma/seed.ts
├─ [ ] Update package.json
├─ [ ] npx prisma migrate dev
└─ [ ] npx prisma db seed

FASE 5: Testing (2-3 horas)
├─ [ ] Manual testing (Swagger)
├─ [ ] All endpoints working
└─ [ ] Error handling verified
```

---

## 📁 ESTRUCTURA DE CARPETAS A CREAR

```bash
# CommonModule
mkdir -p src/common/{decorators,guards,filters,interceptors,types,exceptions}

# Auth
mkdir -p src/modules/auth/{dto,strategies}

# Users
mkdir -p src/modules/users/{dto,repositories}

# Seed data
# (usar archivo existente o crear nuevo)
```

---

## 🔥 PASO 1: CREAR COMMON MODULE (2-3 horas)

### Archivo 1: `src/common/decorators/@current-user.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/authenticated-user';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
```

### Archivo 2: `src/common/decorators/@public.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### Archivo 3: `src/common/decorators/@roles.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### Archivo 4: `src/common/guards/jwt-auth.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/@public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

### Archivo 5: `src/common/guards/roles.guard.ts`
```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/@roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

### Archivo 6: `src/common/filters/http-exception.filter.ts`
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      this.logger.error(`[${request.method}] ${request.url}`, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### Archivo 7: `src/common/interceptors/logging.interceptor.ts`
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(
          `[${method}] ${url} - ${user?.id || 'anonymous'} - ${duration}ms`,
        );
      }),
    );
  }
}
```

### Archivo 8: `src/common/types/authenticated-user.ts`
```typescript
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: string;
}
```

### Archivo 9: `src/common/exceptions/custom-exceptions.ts`
```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}
```

### Archivo 10: `src/common/common.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  exports: [PassportModule],
})
export class CommonModule {}
```

### Archivo 11: Actualizar `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('FitQuest API')
    .setDescription('Fitness + RPG Game Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
```

---

## 🔑 PASO 2: CREAR AUTH MODULE (3-4 horas)

**Ubicación:** `src/modules/auth/`

### DTOs:
```typescript
// auth/dto/register.dto.ts
export class RegisterDto {
  email: string;
  password: string;
  username: string;
}

// auth/dto/login.dto.ts
export class LoginDto {
  email: string;
  password: string;
}

// auth/dto/auth-response.dto.ts
export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; username: string };
}
```

### Service (pseudocode):
```typescript
// auth/auth.service.ts
async register(registerDto: RegisterDto) {
  // 1. Verificar email no existe
  // 2. Hash password
  // 3. Crear usuario
  // 4. Retornar tokens
}

async login(loginDto: LoginDto) {
  // 1. Buscar usuario por email
  // 2. Verificar password
  // 3. Generar JWT
  // 4. Retornar tokens
}

async validateJwt(token: string) {
  // Verificar y retornar usuario
}
```

### Controller:
```typescript
// auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
```

---

## 👤 PASO 3: CREAR USERS MODULE (2-3 horas)

**Ubicación:** `src/modules/users/`

### Service (pseudocode):
```typescript
// users/users.service.ts
async getProfile(userId: string) {
  return this.usersRepository.findOne(userId);
}

async updateProfile(userId: string, updateDto: UpdateProfileDto) {
  return this.usersRepository.update(userId, updateDto);
}

async getPublicProfile(userId: string) {
  // Sin email, solo info pública
}

async changePassword(userId: string, oldPassword: string, newPassword: string) {
  // Verificar old password, actualizar nueva
}

async deleteAccount(userId: string) {
  // Soft delete
}
```

### Controller:
```typescript
// users/users.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get('me')
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateDto);
  }

  @Get(':id/public')
  @Public()
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Delete('me')
  async deleteAccount(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.deleteAccount(user.id);
  }
}
```

---

## 💾 PASO 4: DATABASE SEEDING (2 horas)

### Crear `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMuscleGroups() {
  const groups = [
    { name: 'Chest' },
    { name: 'Back' },
    { name: 'Legs' },
    { name: 'Shoulders' },
    { name: 'Biceps' },
    { name: 'Triceps' },
  ];

  for (const group of groups) {
    await prisma.muscleGroup.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    });
  }
  console.log('✅ MuscleGroups seeded');
}

async function seedExercises() {
  const exercises = [
    { name: 'Bench Press', description: 'Push weight horizontally' },
    { name: 'Squats', description: 'Lower body compound' },
    { name: 'Deadlift', description: 'Full body compound' },
    // ... agregar 50+ más
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }
  console.log('✅ Exercises seeded');
}

async function seedCosmetics() {
  const cosmetics = [
    { name: 'Fire Aura', type: 'AURA', rarity: 'RARE', price: 100 },
    { name: 'Gold Dumbbell', type: 'WEAPON', rarity: 'EPIC', price: 500 },
    // ... agregar 30+ más
  ];

  for (const cosmetic of cosmetics) {
    await prisma.gameCosmetic.create({
      data: cosmetic,
    });
  }
  console.log('✅ Cosmetics seeded');
}

async function main() {
  console.log('🌱 Seeding database...');
  await seedMuscleGroups();
  await seedExercises();
  await seedCosmetics();
  console.log('✅ Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Update `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Comandos a ejecutar:
```bash
# Crear migration
npx prisma migrate dev --name init_all_models

# Ejecutar seed
npx prisma db seed

# Generar client
npx prisma generate
```

---

## 🧪 PASO 5: TESTING (2-3 horas)

### En Swagger (`http://localhost:3000/api/docs`):

```
1. Probar Auth:
   ├─ POST /auth/register
   ├─ POST /auth/login
   └─ GET  /auth/me (con Bearer token)

2. Probar Users:
   ├─ GET  /users/me
   ├─ PATCH /users/me
   └─ DELETE /users/me

3. Probar Fitness (ya existe):
   ├─ GET  /fitness/workouts
   ├─ POST /fitness/workouts
   └─ POST /fitness/sessions

4. Probar Game (ya existe):
   ├─ GET  /game/characters/me
   ├─ GET  /game/quests/active
   └─ GET  /game/leaderboard

5. Probar Economy (ya existe):
   ├─ GET  /economy/wallet
   └─ GET  /economy/marketplace/shop
```

---

## ✅ CHECKLIST FINAL

```
Implementación completada?
├─ [ ] CommonModule (guards, filters, decorators)
├─ [ ] Auth Module (register, login, JWT)
├─ [ ] Users Module (profile, CRUD)
├─ [ ] Database seeding (exercises, cosmetics)
├─ [ ] All 5 modules en app.module.ts
├─ [ ] npm run build (sin errores)
├─ [ ] npm run start:dev (inicia correctamente)
├─ [ ] Swagger docs en http://localhost:3000/api/docs
├─ [ ] Todos los endpoints responden
└─ [ ] Error handling funciona
```

---

## 🚀 RESUMEN

```
TIEMPO TOTAL: 12-16 horas
├─ CommonModule: 2-3h
├─ Auth Module: 3-4h
├─ Users Module: 2-3h
├─ Database Seeding: 2h
└─ Testing: 2-3h

RESULTADO: MVP Backend completamente funcional
```

**¡Adelante! 🎯**
