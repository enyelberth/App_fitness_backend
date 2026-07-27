# GUÍA FINAL DE IMPLEMENTACIÓN - MVP COMPLETO
**Fecha:** Julio 26, 2025  
**Estado:** 80% Completado - Guía para últimos 20%

---

## ✅ YA COMPLETADO (80%)

### **Módulos Implementados:**
- ✅ **Fitness** (6 controllers, 25+ endpoints, completo)
- ✅ **Game** (3 controllers, 15+ endpoints, completo)
- ✅ **Payments** (1 controller, 3 endpoints, básico)
- ✅ **Economy** (2 controllers, 8+ endpoints, completo)
- ✅ **Event Bus** (Comunicación desacoplada)
- ✅ **Prisma Schema** (Actualizado con Game, Economy, Payments)
- ✅ **.env.example** (Configuración)

---

## 🔴 QUÉ FALTA (20% - Crítico para MVP)

### **1. CommonModule Completo** (~2-3 horas)

**Ubicación:** `src/common/`

**Crear estos archivos:**

```typescript
// decorators/@current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// decorators/@public.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);

// decorators/@roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// guards/jwt-auth.guard.ts (MEJORADO)
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

// guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

// filters/http-exception.filter.ts
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
    let error = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exception.message;
      error = (exceptionResponse as any).error;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// interceptors/logging.interceptor.ts
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

// pipes/validation.pipe.ts (NestJS ya proporciona)
// Usarlo en main.ts:
// app.useGlobalPipes(new ValidationPipe({ transform: true }));

// types/authenticated-user.ts
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

// exceptions/custom-exceptions.ts
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

---

### **2. Auth Module Completo** (~3-4 horas)

**Ubicación:** `src/modules/auth/`

**Crear:**
```typescript
// auth.service.ts
- register(email, password, username)
- login(email, password)
- refreshToken(refreshToken)
- verifyEmail(token)
- forgotPassword(email)
- resetPassword(token, newPassword)
- validateToken(token)

// auth.controller.ts
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/verify-email
- POST /auth/forgot-password
- POST /auth/reset-password
- GET  /auth/me

// jwt.strategy.ts
- Estrategia JWT con extracción de usuario

// local.strategy.ts
- Estrategia local (email + password)

// auth.module.ts
- Importar PassportModule, JwtModule
- Configurar JWT con SECRET y EXPIRATION
```

---

### **3. Users Module Completo** (~2-3 horas)

**Ubicación:** `src/modules/users/`

**Crear:**
```typescript
// users.service.ts
- getProfile(userId)
- updateProfile(userId, updateDto)
- getPublicProfile(userId)
- searchUsers(query)
- changePassword(userId, oldPassword, newPassword)
- deleteAccount(userId)

// users.controller.ts
- GET  /users/me
- PATCH /users/me
- GET  /users/:id/public-profile
- GET  /users/search
- PATCH /users/me/password
- DELETE /users/me

// user.entity.ts
- Relación con Profile, GameCharacter, Wallet, etc.

// users.module.ts
```

---

### **4. Database Seeding** (~2 horas)

**Ubicación:** `prisma/seed.ts`

```typescript
// prisma/seed.ts
async function main() {
  // 1. Seed MuscleGroups (6)
  // 2. Seed Exercises (50+)
  // 3. Seed Cosmetics (30+)
  // 4. Seed GameQuests templates
  // 5. Seed initial user roles/permissions
}

// npm script en package.json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}

// Ejecutar:
// npx prisma db seed
```

---

### **5. Global Error Handling** (~1 hora)

**En `src/main.ts`:**
```typescript
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Filters
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // CORS
  app.enableCors();
  
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('FitQuest API')
    .setDescription('Fitness + RPG Game API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT || 3000);
}
```

---

### **6. Update app.module.ts** (~30 min)

```typescript
// Agregar todos los módulos faltantes
@Module({
  imports: [
    // ... existing
    AuthModule,
    UsersModule,
    // Ya existen:
    EventsModule,
    FitnessModule,
    GameModule,
    PaymentsModule,
    EconomyModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
```

---

### **7. Database Migrations** (~30 min)

```bash
# Crear migration de schema actualizado
npx prisma migrate dev --name add_game_economy_models

# Generar Prisma client
npx prisma generate

# Ejecutar seed
npx prisma db seed
```

---

## 📋 CHECKLIST: Orden de implementación

### **FASE 1: Foundation (Día 1)**
- [ ] CommonModule completo
  - [ ] Decorators (@CurrentUser, @Public, @Roles)
  - [ ] Guards (JwtAuthGuard, RolesGuard)
  - [ ] Filters (GlobalExceptionFilter)
  - [ ] Interceptors (LoggingInterceptor)
  - [ ] Types
  - [ ] Exceptions
- [ ] Update main.ts con filters, pipes, interceptors
- [ ] Actualizar app.module.ts
- [ ] Database migrations

### **FASE 2: Auth (Día 2)**
- [ ] Auth module completo
  - [ ] Strategies (JWT, Local)
  - [ ] Service (register, login, verify, etc)
  - [ ] Controller
  - [ ] DTOs
- [ ] Database seeding básico

### **FASE 3: Users (Día 2-3)**
- [ ] Users module completo
  - [ ] Service (getProfile, updateProfile, etc)
  - [ ] Controller
  - [ ] DTOs
- [ ] Complete database seeding

### **FASE 4: Testing**
- [ ] Manual testing todos los endpoints
- [ ] Swagger docs completos
- [ ] postman collection

---

## 🚀 DESPUÉS DE IMPLEMENTAR

```bash
# Compilar
npm run build

# Iniciar
npm run start:dev

# Ver Swagger
http://localhost:3000/api/docs

# Testear endpoints
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@fitquest.com","password":"Password123","username":"testuser"}'
```

---

## 📊 RESUMEN: ESFUERZO RESTANTE

| Tarea | Horas | Criticidad |
|-------|-------|-----------|
| CommonModule | 2-3 | 🔴 CRÍTICO |
| Auth Module | 3-4 | 🔴 CRÍTICO |
| Users Module | 2-3 | 🔴 CRÍTICO |
| Database Seeding | 2 | 🔴 CRÍTICO |
| Global Error Handling | 1 | 🔴 CRÍTICO |
| Testing & Polish | 2-3 | 🟡 IMPORTANTE |
| **TOTAL** | **12-16** | |

---

## ✨ ESTADO FINAL DEL MVP

**Cuando completes esto tendrás:**

```
✅ Backend NestJS 100% funcional
✅ Todos los módulos implementados
✅ Autenticación JWT completa
✅ Error handling global
✅ Database seeding
✅ Swagger documentation
✅ 51+ endpoints funcionales
✅ Event-driven architecture
✅ Listo para testing y deploy
```

---

## 💡 RECOMENDACIONES

1. **Implementa en paralelo si tienes múltiples devs:**
   - Dev 1: CommonModule + main.ts
   - Dev 2: Auth module
   - Dev 3: Users module
   - Dev 4: Database seeding

2. **Testing mientras implementas:**
   - Usa Swagger para testear endpoints
   - Crea Postman collection
   - Test auth flows completos

3. **Antes de lanzar:**
   - [ ] Compilar sin errores
   - [ ] Todos los endpoints responsivos
   - [ ] Swagger docs completos
   - [ ] Database migrado
   - [ ] Seed ejecutado

---

**¡MVP está 80% completo! Solo necesita los últimos components críticos (Auth, Users, CommonModule)** 🚀
