# Implementation Plan: Phases 2-5

**Date:** July 26, 2025  
**Status:** Planning → Implementation  
**Goal:** Complete core backend architecture for App Fitness

---

## Overview

Following Phase 1 (Stabilization), we'll implement:

1. **Phase 2: Identity** (Auth & Users completion) - 8-10 hours
2. **Phase 3: Core Fitness** (Exercises, Workouts, Progress) - 12-15 hours
3. **Phase 4: Payments** (PayPal integration) - 8-10 hours
4. **Phase 5: Economy** (Wallet management) - 6-8 hours

**Total:** ~40 hours of development work

---

## Phase 2: Identity (Complete Auth & Users)

### Current State
- ✓ Auth: register, login, refresh, logout endpoints
- ✓ Users: GET /me, PATCH /me/profile endpoints
- ✓ Basic DTOs and services
- ✗ Missing: email verification, password reset, advanced user queries, role-based endpoints

### Objectives
1. Complete Auth module (JWT strategies, session management)
2. Complete Users module (profile, preferences, account settings)
3. Add 50%+ test coverage for auth flows
4. Implement email verification flow (structure, not sending)
5. Implement password reset flow (structure, not sending)

### Deliverables

#### 2.1 Auth Module Enhancement
**File:** `src/modules/auth/auth.service.ts` (expand)

New methods:
```typescript
// Token verification and validation
async verifyAccessToken(token: string): Promise<AuthPayload>
async verifyRefreshToken(token: string): Promise<RefreshPayload>

// Email verification
async sendEmailVerification(userId: string): Promise<void>
async verifyEmail(token: string): Promise<void>

// Password reset
async initiatePasswordReset(email: string): Promise<void>
async completePasswordReset(token: string, newPassword: string): Promise<void>

// Session management
async revokeSession(userId: string, sessionId: string): Promise<void>
async revokeSessions(userId: string): Promise<void> // logout all devices
async getSessions(userId: string): Promise<AuthSession[]>
```

**File:** `src/modules/auth/auth.controller.ts` (expand)

New endpoints:
```
POST /auth/verify-email/{token}        - Verify email
POST /auth/forgot-password             - Initiate password reset
POST /auth/reset-password/{token}      - Complete password reset
GET /auth/sessions                     - List active sessions
DELETE /auth/sessions/{sessionId}      - Revoke single session
DELETE /auth/sessions                  - Revoke all sessions
```

#### 2.2 Users Module Enhancement
**File:** `src/modules/users/users.service.ts` (expand)

New methods:
```typescript
async getProfile(userId: string): Promise<UserWithProfile>
async updatePreferences(userId: string, dto: UpdatePreferencesDto): Promise<Profile>
async updateGoals(userId: string, dto: UpdateGoalsDto): Promise<Profile>
async updatePhysicalData(userId: string, dto: UpdatePhysicalDataDto): Promise<Profile>
async listUsers(filter?: UserFilterDto, pagination?: PaginationDto): Promise<PaginatedUsers>
async getUsersByRole(role: Role): Promise<User[]>
```

**File:** `src/modules/users/users.controller.ts` (expand)

New endpoints:
```
GET /users/me/profile                  - Get full profile
GET /users/me/preferences              - Get preferences
PATCH /users/me/preferences            - Update preferences
PATCH /users/me/goals                  - Update fitness goals
PATCH /users/me/physical               - Update weight, height, body fat %
GET /users                             - List users (admin)
GET /users/{id}                        - Get user by ID (public profile)
```

#### 2.3 New DTOs
```
src/modules/users/dto/update-preferences.dto.ts
src/modules/users/dto/update-goals.dto.ts
src/modules/users/dto/update-physical-data.dto.ts
src/modules/users/dto/user-filter.dto.ts
src/modules/users/dto/paginated-users.dto.ts

src/modules/auth/dto/email-verification-request.dto.ts
src/modules/auth/dto/password-reset-request.dto.ts
src/modules/auth/dto/password-reset-complete.dto.ts
```

#### 2.4 Tests
- `auth.service.spec.ts` (expand): +10 tests (email verification, password reset, sessions)
- `users.service.spec.ts` (new): 8 tests (profile updates, filtering)
- `auth.controller.spec.ts` (new): 6 tests (endpoint responses)
- `users.controller.spec.ts` (new): 6 tests (endpoint responses)

**Target Coverage:** 50%+

---

## Phase 3: Core Fitness (Exercises, Workouts, Progress)

### Objectives
1. Create Exercises module (catalog, muscle groups)
2. Create Workouts module (routines, user-specific)
3. Create Progress module (tracking, history)
4. Implement authorization (user owns their workouts, coaches can view)
5. Add comprehensive tests

### Deliverables

#### 3.1 Exercises Module
**File Structure:**
```
src/modules/exercises/
├── exercises.module.ts
├── exercises.controller.ts
├── exercises.service.ts
├── muscle-groups.controller.ts
├── muscle-groups.service.ts
├── dto/
│   ├── create-exercise.dto.ts
│   ├── update-exercise.dto.ts
│   ├── create-muscle-group.dto.ts
│   └── filter-exercises.dto.ts
└── exercises.service.spec.ts
```

**Endpoints:**
```
GET /exercises                         - List all exercises (public)
GET /exercises/{id}                    - Get exercise details
POST /exercises                        - Create exercise (admin)
PATCH /exercises/{id}                  - Update exercise (admin)
DELETE /exercises/{id}                 - Delete exercise (admin)

GET /exercises/{id}/muscles            - List muscles targeted
POST /exercises/{id}/muscles/{muscleId} - Add muscle targeting (admin)
DELETE /exercises/{id}/muscles/{muscleId} - Remove muscle (admin)

GET /muscle-groups                     - List all muscles
POST /muscle-groups                    - Create muscle (admin)
GET /muscle-groups/{id}/exercises      - Exercises for muscle
```

**Services:**
- `ExercisesService`: CRUD, filtering, search
- `MuscleGroupsService`: CRUD, relations

#### 3.2 Workouts Module
**File Structure:**
```
src/modules/workouts/
├── workouts.module.ts
├── workouts.controller.ts
├── workouts.service.ts
├── dto/
│   ├── create-workout.dto.ts
│   ├── update-workout.dto.ts
│   ├── add-exercise.dto.ts
│   └── workout-filter.dto.ts
└── workouts.service.spec.ts
```

**Endpoints:**
```
GET /workouts                          - List user's workouts
POST /workouts                         - Create workout
GET /workouts/{id}                     - Get workout details
PATCH /workouts/{id}                   - Update workout
DELETE /workouts/{id}                  - Delete workout

POST /workouts/{id}/exercises          - Add exercise to workout
PATCH /workouts/{id}/exercises/{exerciseId} - Update exercise in workout (sets, reps, weight)
DELETE /workouts/{id}/exercises/{exerciseId} - Remove exercise

GET /workouts/{id}/log                 - Get workout execution log
POST /workouts/{id}/execute            - Log workout execution
```

**Services:**
- `WorkoutsService`: CRUD, user-scoped queries, exercise management
- `WorkoutExecutionService`: Log workouts, track completed exercises

#### 3.3 Progress Module
**File Structure:**
```
src/modules/progress/
├── progress.module.ts
├── progress.controller.ts
├── progress.service.ts
├── dto/
│   ├── log-progress.dto.ts
│   ├── progress-filter.dto.ts
│   └── progress-stats.dto.ts
└── progress.service.spec.ts
```

**Endpoints:**
```
GET /progress                          - List user's progress entries
POST /progress                         - Log progress entry (weight, body fat, reps, etc.)
GET /progress/stats                    - Get progress statistics (trends)
GET /progress/exercise/{exerciseId}    - Get progress for specific exercise
GET /progress/chart                    - Get chart data (weight over time)
```

**Services:**
- `ProgressService`: Log entries, query history, calculate stats
- `ProgressAnalyticsService`: Trends, charts, PRs (personal records)

#### 3.4 Authorization
- Add ownership checks: user can only see/edit their own workouts and progress
- Coach role: can view assigned users' workouts and progress
- Admin role: can see all

**Guard:** `OwnershipGuard` (check userId matches request.user.id or is coach/admin)

#### 3.5 Tests
- `exercises.service.spec.ts`: 8 tests
- `workouts.service.spec.ts`: 10 tests
- `progress.service.spec.ts`: 8 tests
- Controller tests: 12 tests

**Target Coverage:** 70%+

---

## Phase 4: Payments (PayPal Integration)

### Objectives
1. Implement PayPal orders, captures, refunds
2. Ensure idempotency (no duplicate charges)
3. Handle webhooks for payment status updates
4. Connect to wallet entries
5. Add comprehensive tests

### Deliverables

#### 4.1 Payments Module
**File Structure:**
```
src/modules/payments/
├── payments.module.ts
├── payments.controller.ts
├── payments.service.ts
├── paypal/
│   ├── paypal.service.ts
│   ├── paypal.webhook.controller.ts
│   └── paypal.dto.ts
├── dto/
│   ├── create-order.dto.ts
│   ├── capture-order.dto.ts
│   ├── refund-order.dto.ts
│   └── payment-filter.dto.ts
└── payments.service.spec.ts
```

**Endpoints:**
```
POST /payments/orders                  - Create PayPal order
POST /payments/orders/{orderId}/capture - Capture/complete order
POST /payments/orders/{orderId}/refund - Refund payment
GET /payments                          - List user's payments
GET /payments/{id}                     - Get payment details

POST /payments/webhooks/paypal         - PayPal webhook endpoint (public)
```

**Services:**
- `PaymentsService`: CRUD, create orders, capture, refund, list
- `PayPalService`: Calls PayPal API, handles responses
- `PaymentWebhookService`: Process webhook updates, update order status

#### 4.2 Features
1. **Order Creation:** POST /payments/orders
   - Validates amount and currency
   - Creates Payment record with CREATED status
   - Calls PayPal API
   - Returns externalOrderId and approval link

2. **Order Capture:** POST /payments/orders/{orderId}/capture
   - Verifies order status
   - Calls PayPal capture endpoint
   - Updates Payment with COMPLETED status
   - Creates WalletEntry (credits)
   - Returns transaction receipt

3. **Refunds:** POST /payments/orders/{orderId}/refund
   - Checks if order is refundable
   - Calls PayPal refund endpoint
   - Updates Payment with REFUNDED status
   - Reverses WalletEntry

4. **Idempotency:**
   - Use idempotencyKey (unique per user + amount + timestamp)
   - Prevent duplicate charges on network retries
   - Return same response for duplicate requests

5. **Webhooks:**
   - PAYMENT.CAPTURE.COMPLETED
   - PAYMENT.CAPTURE.DENIED
   - PAYMENT.CAPTURE.PENDING
   - PAYMENT.CAPTURE.REFUNDED

#### 4.3 DTOs
```
CreateOrderDto
  amount: number
  currency: string (USD, EUR, etc.)
  description?: string

CaptureOrderDto
  orderId: string
  payerEmail?: string (validation)

RefundOrderDto
  orderId: string
  reason?: string

PayPalWebhookDto
  id: string
  event_type: string
  resource: { id, status, amount, ... }
```

#### 4.4 Database
- Payment model: id, userId, provider, externalOrderId, externalCaptureId, idempotencyKey, amount, currency, status, completedAt
- WalletEntry model: id, walletId, paymentId, type, amount, reason, idempotencyKey

#### 4.5 Tests
- `payments.service.spec.ts`: 12 tests (CRUD, capture, refund)
- `paypal.service.spec.ts`: 8 tests (API calls, error handling)
- `payments.webhook.spec.ts`: 8 tests (webhook processing)

**Target Coverage:** 70%+

---

## Phase 5: Economy (Wallet & Credits)

### Objectives
1. Implement wallet system (user credits/balance)
2. Implement immutable transaction log
3. Connect payments to wallet credits
4. Ensure financial integrity (no duplicate entries, no negative balance without permission)
5. Add comprehensive tests

### Deliverables

#### 5.1 Economy Module
**File Structure:**
```
src/modules/economy/
├── economy.module.ts
├── wallets.controller.ts
├── wallets.service.ts
├── wallet-entries.service.ts
├── dto/
│   ├── wallet-balance.dto.ts
│   ├── wallet-entry-filter.dto.ts
│   └── adjust-balance.dto.ts
└── wallets.service.spec.ts
```

**Endpoints:**
```
GET /wallets/me                        - Get user's wallet balance
GET /wallets/me/entries                - Get transaction history
GET /wallets/me/entries/stats          - Get wallet statistics

POST /wallets/me/adjust                - Admin: adjust balance (with audit trail)
GET /wallets/transactions              - Admin: audit trail
```

**Services:**
- `WalletsService`: Get balance, list entries, admin adjustments
- `WalletEntriesService`: Log entries, search, stats
- `WalletAuditService`: Track manual adjustments, audit trail

#### 5.2 Features
1. **Wallet Balance:**
   - Read-only for users
   - Calculated from WalletEntry sum
   - Fast cached value (updated on each entry)

2. **Transaction Types:**
   - CREDIT: incoming (payment, reward, bonus)
   - DEBIT: outgoing (purchase, fee, refund)
   - ADJUSTMENT: manual (admin correction, promotion)

3. **Immutability:**
   - WalletEntry never deleted or modified
   - Only new entries created
   - Corrections via opposite entry (debit + new credit)

4. **Idempotency:**
   - idempotencyKey prevents duplicate entries
   - Retry same request returns same result
   - No duplicate credits for network retries

5. **Financial Integrity:**
   - All entries logged with reason and audit trail
   - No negative balances without approval
   - Admin adjustments require reason and tracking
   - Monthly reconciliation checks

#### 5.3 Wallet Entry Types
```
CREDIT (amount > 0):
  - Payment received (from PayPal)
  - Bonus credits
  - Promotional offer
  - Referral reward

DEBIT (amount > 0, stored as negative):
  - In-app purchase
  - Fee deduction
  - Dispute correction

ADJUSTMENT (admin only):
  - Manual balance correction
  - Promotion credit
  - Billing correction
```

#### 5.4 Connecting Payments to Wallet
When PayPal order is completed:
1. Payment record updated to COMPLETED
2. WalletEntry created (CREDIT, amount, reason: "Payment from PayPal")
3. Wallet balance calculated (cached)
4. User receives balance confirmation

#### 5.5 DTOs
```
WalletBalanceDto
  id: string
  userId: string
  balance: number
  currency: string (USD)
  lastUpdated: DateTime

WalletEntryDto
  id: string
  type: WalletEntryType
  amount: number
  reason: string
  paymentId?: string
  createdAt: DateTime

AdjustBalanceDto (admin only)
  amount: number
  reason: string
  approvalNote?: string
```

#### 5.6 Tests
- `wallets.service.spec.ts`: 8 tests (balance, entries)
- `wallet-entries.service.spec.ts`: 10 tests (logging, immutability)
- `wallet-audit.spec.ts`: 8 tests (admin adjustments, trail)

**Target Coverage:** 75%+

---

## Implementation Order & Timeline

### Week 1-2: Phase 2 (Identity)
- Day 1-2: Auth enhancement (email verification, password reset, sessions)
- Day 3-4: Users enhancement (profile, preferences, goals)
- Day 5: Tests and refinement

### Week 3-4: Phase 3 (Core Fitness)
- Day 1-2: Exercises module (CRUD, muscles)
- Day 3-4: Workouts module (CRUD, user-scoped)
- Day 5-6: Progress module (logging, analytics)
- Day 7: Tests and authorization

### Week 5: Phase 4 (Payments)
- Day 1-3: PayPal integration (orders, capture, refund)
- Day 4: Webhooks and status updates
- Day 5: Tests and integration

### Week 6: Phase 5 (Economy)
- Day 1-2: Wallet system
- Day 3: Transaction logging
- Day 4: Admin functions
- Day 5: Tests and integration

### Week 7: Integration & Polish
- Integration tests (Payments → Wallet)
- End-to-end flows
- Performance optimization
- Security review
- Documentation

---

## Technology Stack (Confirmed)

- **Framework:** NestJS 10
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5
- **Auth:** JWT (access + refresh tokens)
- **Password:** Argon2id
- **Validation:** class-validator
- **Testing:** Jest
- **API Docs:** Swagger
- **Rate Limiting:** @nestjs/throttler
- **Security:** Helmet
- **Payments:** PayPal REST API

---

## Quality Standards

### Code
- TypeScript strict mode
- ESLint with rules enforced
- Prettier formatting
- No `any` types allowed
- Explicit return types on all functions

### Testing
- Phase 2: 50% coverage target
- Phase 3: 70% coverage target
- Phase 4: 70% coverage target
- Phase 5: 75% coverage target
- All critical paths tested

### Security
- No secrets in code
- JWT validation on all protected routes
- Input validation strict (class-validator)
- Rate limiting on auth endpoints
- CORS restricted to configured origins
- SQL injection prevention (Prisma ORM)

### Documentation
- Swagger/OpenAPI for all endpoints
- JSDoc comments on public methods
- README updates
- Migration guides

---

## Success Criteria

✅ **Phase 2 Complete When:**
- All Auth endpoints work (register, login, refresh, logout)
- Email verification structure (ready for email service)
- Password reset structure (ready for email service)
- Session management (list, revoke)
- User profile and preferences updatable
- 50%+ test coverage
- All endpoints documented in Swagger

✅ **Phase 3 Complete When:**
- Exercises, Workouts, Progress fully functional
- User can create workout and log progress
- Authorization working (users see own data only)
- 70%+ test coverage
- All endpoints documented

✅ **Phase 4 Complete When:**
- PayPal orders create and capture
- Refunds work
- Webhooks process status updates
- Idempotency prevents duplicate charges
- 70%+ test coverage

✅ **Phase 5 Complete When:**
- Wallet balance accurate
- Transaction history immutable
- Payments auto-create wallet entries
- Admin audit functions work
- 75%+ test coverage

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| PayPal API rate limits | Implement caching, queue requests |
| Duplicate wallet entries | Idempotency key enforcement |
| Data consistency | Database transactions for sensitive ops |
| Performance on large datasets | Indexes, pagination, async queries |
| JWT secret rotation | Plan for Phase 6 if needed |

---

## Next Immediate Steps

1. ✅ Phase 1 validation complete
2. → Start Phase 2: Auth & Users enhancement
3. → Create controllers, services, DTOs
4. → Implement tests
5. → Repeat for Phases 3, 4, 5

**Expected Timeline:** 6-8 weeks for full implementation

---

**Plan Created:** July 26, 2025  
**Status:** Ready for implementation  
**Next Action:** Begin Phase 2 implementation
