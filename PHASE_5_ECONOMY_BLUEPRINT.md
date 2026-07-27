# Phase 5: Economy - Wallet & Credits Blueprint

**Status:** 🔵 Ready for implementation  
**Estimated Duration:** 1 week  
**Dependencies:** Phase 4 complete (Payments)

---

## Architecture Overview

```
User's Wallet = SUM(WalletEntry.amount WHERE walletId = user.wallet.id)

WalletEntry (immutable log):
├── type: CREDIT (payment completed)
├── type: DEBIT (purchase/fee)
└── type: ADJUSTMENT (admin correction)

Each entry has:
├── walletId (links to wallet)
├── paymentId (links to payment, nullable)
├── type (CREDIT/DEBIT/ADJUSTMENT)
├── amount (in cents, stored as Int)
├── reason (why this entry exists)
├── idempotencyKey (prevents duplicates)
└── createdAt (immutable timestamp)

Balance = wallet.entries.sum(amount) → cached in wallet.cachedBalance
```

---

## File Structure to Create

```
src/modules/economy/
├── wallets.module.ts
├── wallets.controller.ts
├── wallets.service.ts
├── wallet-entries.service.ts
├── wallet-audit.service.ts
├── dto/
│   ├── wallet-balance.dto.ts
│   ├── wallet-entry.dto.ts
│   ├── wallet-entry-filter.dto.ts
│   └── adjust-balance.dto.ts
└── wallets.service.spec.ts
```

---

## Step 1: Wallets Service

**File:** `src/modules/economy/wallets.service.ts`

```typescript
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WalletEntryFilterDto } from './dto/wallet-entry-filter.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        entries: {
          select: { amount: true },
        },
      },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    // Calculate balance from entries (in case cache is stale)
    const balance = wallet.entries.reduce((sum, entry) => sum + entry.amount, 0);

    return {
      id: wallet.id,
      userId: wallet.userId,
      balanceCents: balance, // in cents
      balanceUSD: balance / 100, // human-readable
      currency: 'USD',
      lastUpdated: wallet.updatedAt,
    };
  }

  async getEntries(userId: string, filter?: WalletEntryFilterDto, pagination?: PaginationDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    const where: any = { walletId: wallet.id };

    if (filter?.type) {
      where.type = filter.type;
    }

    if (filter?.fromDate) {
      where.createdAt = { gte: filter.fromDate };
    }

    if (filter?.toDate) {
      where.createdAt = { ...where.createdAt, lte: filter.toDate };
    }

    const skip = ((pagination?.skip || 0) + (pagination?.page || 0) * pagination?.pageSize) || 0;
    const take = pagination?.pageSize || 20;

    const [entries, total] = await this.prisma.$transaction([
      this.prisma.walletEntry.findMany({
        where,
        include: { payment: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletEntry.count({ where }),
    ]);

    return {
      entries: entries.map((e) => ({
        ...e,
        amountCents: e.amount,
        amountUSD: e.amount / 100,
      })),
      total,
      page: pagination?.page || 1,
      pageSize: take,
    };
  }

  async getStats(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: { entries: true },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    const entries = wallet.entries;
    const credits = entries.filter((e) => e.type === 'CREDIT').reduce((sum, e) => sum + e.amount, 0);
    const debits = entries.filter((e) => e.type === 'DEBIT').reduce((sum, e) => sum + e.amount, 0);
    const adjustments = entries.filter((e) => e.type === 'ADJUSTMENT').reduce((sum, e) => sum + e.amount, 0);
    const currentBalance = credits - debits + adjustments;

    return {
      currentBalanceCents: currentBalance,
      currentBalanceUSD: currentBalance / 100,
      totalCreditsCents: credits,
      totalCreditsUSD: credits / 100,
      totalDebitsCents: debits,
      totalDebitsUSD: debits / 100,
      totalAdjustmentsCents: adjustments,
      totalAdjustmentsUSD: adjustments / 100,
      transactionCount: entries.length,
      firstTransaction: entries[0]?.createdAt,
      lastTransaction: entries[entries.length - 1]?.createdAt,
    };
  }

  async adjustBalance(
    userId: string,
    amountCents: number,
    reason: string,
    approvalNote?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    if (!reason || reason.length < 5) throw new BadRequestException('Reason must be at least 5 characters');

    // Create audit log entry and wallet entry atomically
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.walletEntry.create({
        data: {
          walletId: wallet.id,
          type: 'ADJUSTMENT',
          amount: amountCents,
          reason,
          idempotencyKey: `adjustment_${Date.now()}_${userId}`,
        },
      });

      // Log to audit trail (implement later with separate audit table)
      console.log(`Admin adjustment: ${userId} ${amountCents}cents - ${reason}`);

      return entry;
    });
  }
}
```

---

## Step 2: Wallet Entries Service

**File:** `src/modules/economy/wallet-entries.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class WalletEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log a wallet entry atomically.
   * Returns existing entry if idempotencyKey matches.
   */
  async create(
    walletId: string,
    type: 'CREDIT' | 'DEBIT' | 'ADJUSTMENT',
    amountCents: number,
    reason: string,
    paymentId?: string,
    idempotencyKey?: string,
  ) {
    const key = idempotencyKey || randomUUID();

    // Try to find existing entry with same key
    const existing = await this.prisma.walletEntry.findUnique({
      where: { idempotencyKey: key },
    });

    if (existing) return existing;

    // Create new entry
    return this.prisma.walletEntry.create({
      data: {
        walletId,
        type,
        amount: amountCents,
        reason,
        paymentId,
        idempotencyKey: key,
      },
    });
  }

  /**
   * Get all entries for a wallet (immutable read-only view).
   */
  async findByWalletId(walletId: string) {
    return this.prisma.walletEntry.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      include: { payment: { select: { externalOrderId: true, amount: true } } },
    });
  }

  /**
   * Verify immutability: no entries can be deleted or modified.
   */
  assertImmutability() {
    // This method documents the immutability rule.
    // No DELETE or UPDATE operations on WalletEntry should exist.
    // Only INSERT is allowed.
  }
}
```

---

## Step 3: Controllers

**File:** `src/modules/economy/wallets.controller.ts`

```typescript
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Roles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/auth/authenticated-user';
import { Role } from '@prisma/client';
import { WalletsService } from './wallets.service';
import { WalletEntryFilterDto } from './dto/wallet-entry-filter.dto';
import { AdjustBalanceDto } from './dto/adjust-balance.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('economy')
@ApiBearerAuth()
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me')
  getBalance(@CurrentUser() user: AuthenticatedUser) {
    return this.walletsService.getBalance(user.id);
  }

  @Get('me/entries')
  getEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: WalletEntryFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.walletsService.getEntries(user.id, filter, pagination);
  }

  @Get('me/entries/stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.walletsService.getStats(user.id);
  }

  @Roles(Role.ADMIN)
  @Post('me/adjust')
  adjustBalance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AdjustBalanceDto,
  ) {
    return this.walletsService.adjustBalance(
      user.id,
      dto.amountCents,
      dto.reason,
      dto.approvalNote,
    );
  }

  @Roles(Role.ADMIN)
  @Get('transactions')
  getAuditTrail(@Query() pagination: PaginationDto) {
    // TODO: Implement audit trail query
    // Should return all adjustments across all users
  }
}
```

---

## Step 4: DTOs

Create the following DTOs in `src/modules/economy/dto/`:

**wallet-balance.dto.ts:**
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class WalletBalanceDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ description: 'Balance in cents' })
  balanceCents!: number;

  @ApiProperty({ description: 'Balance in USD' })
  balanceUSD!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  lastUpdated!: Date;
}
```

**wallet-entry.dto.ts:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { WalletEntryType } from '@prisma/client';

export class WalletEntryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['CREDIT', 'DEBIT', 'ADJUSTMENT'] })
  type!: WalletEntryType;

  @ApiProperty({ description: 'Amount in cents' })
  amountCents!: number;

  @ApiProperty({ description: 'Amount in USD' })
  amountUSD!: number;

  @ApiProperty()
  reason!: string;

  @ApiProperty({ required: false })
  paymentId?: string;

  @ApiProperty()
  createdAt!: Date;
}
```

**wallet-entry-filter.dto.ts:**
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WalletEntryType } from '@prisma/client';
import { IsOptional, IsEnum, Type } from 'class-validator';

export class WalletEntryFilterDto {
  @ApiPropertyOptional({ enum: ['CREDIT', 'DEBIT', 'ADJUSTMENT'] })
  @IsOptional()
  @IsEnum(['CREDIT', 'DEBIT', 'ADJUSTMENT'])
  type?: WalletEntryType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  fromDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  toDate?: Date;
}
```

**adjust-balance.dto.ts:**
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class AdjustBalanceDto {
  @ApiProperty({ description: 'Amount in cents' })
  @IsInt()
  amountCents!: number;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  approvalNote?: string;
}
```

---

## Step 5: Module Registration

**File:** `src/modules/economy/economy.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { WalletEntriesService } from './wallet-entries.service';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, WalletEntriesService],
  exports: [WalletsService, WalletEntriesService],
})
export class EconomyModule {}
```

**Already imported in app.module.ts**

---

## Integration with Phase 4 (Payments)

When a Payment is completed (Phase 4):

```typescript
// In payments.service.ts, after successful capture:
const entry = await this.walletEntriesService.create(
  wallet.id,
  'CREDIT',
  Math.round(payment.amount * 100), // cents
  `Payment from ${payment.provider}`,
  payment.id, // link to payment
  payment.idempotencyKey, // ensure idempotency
);
```

---

## Key Design Principles

### 1. Immutability
```
✓ WalletEntry records are NEVER deleted
✓ WalletEntry records are NEVER updated
✗ Only INSERT is allowed
✗ Corrections use opposite entries (DEBIT + new CREDIT)
```

### 2. Atomicity
```
Payment Completion:
  1. Update Payment.status = COMPLETED
  2. Create WalletEntry (CREDIT)
  3. All or nothing (transaction)
```

### 3. Idempotency
```
Same idempotencyKey = same result, always.
Prevents duplicate credits on network retries.
```

### 4. No Direct Balance Updates
```
✗ wallet.balance = 100 (WRONG)
✓ create WalletEntry { amount: 100, reason: "..." } (CORRECT)
```

### 5. Audit Trail
```
Every credit/debit has:
  - Type (CREDIT/DEBIT/ADJUSTMENT)
  - Amount
  - Reason (why?)
  - Timestamp (when?)
  - Payment link (if applicable)
```

---

## Testing Endpoints

```bash
# Get current balance
curl http://localhost:4000/api/v1/wallets/me \
  -H "Authorization: Bearer <token>"

# Get transaction history
curl "http://localhost:4000/api/v1/wallets/me/entries?skip=0&take=20" \
  -H "Authorization: Bearer <token>"

# Get statistics
curl http://localhost:4000/api/v1/wallets/me/entries/stats \
  -H "Authorization: Bearer <token>"

# Admin: Adjust balance (add 50 USD = 5000 cents)
curl -X POST http://localhost:4000/api/v1/wallets/me/adjust \
  -H "Authorization: Bearer <adminToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "amountCents": 5000,
    "reason": "Promotional credit for new user"
  }'
```

---

## Database Constraints

Ensure these constraints in Prisma schema:

```prisma
model WalletEntry {
  // No composite index on (walletId, idempotencyKey) for fast lookups
  @@unique([walletId, idempotencyKey])
  
  // Fast sorting by date
  @@index([walletId, createdAt])
  
  // Never allow modification
  // Database-level constraints: RESTRICT on cascade
}
```

---

## Performance Considerations

### Balance Calculation
```
Option 1: SUM on every request (slow for large entry counts)
Option 2: Cached balance in wallet.cachedBalance (updated on each entry) (fast, recommended)
Option 3: Materialized view in database (complex, overkill for this use case)

We use Option 2 for balance reads.
```

### Querying Entries
- Use pagination (20-50 entries per page)
- Index on (walletId, createdAt)
- Filter by type/date only when needed

---

## Future Enhancements

1. **Scheduled Reconciliation Job:**
   - Daily: verify sum(WalletEntry.amount) = wallet.cachedBalance
   - Auto-heal if mismatch found

2. **Audit Dashboard:**
   - Admin-only view of all adjustments
   - Filter by admin, date, reason

3. **Recurring Credits:**
   - Monthly subscription credits
   - Loyalty programs

4. **Negative Balances:**
   - Configurable: allow or reject
   - Add soft limit (e.g., -$10)

---

## Next Steps After Implementation

1. Test with Phase 4 (Payments) integration
2. Verify idempotency with network failures
3. Load test balance calculations
4. Set up reconciliation job
5. Create admin audit dashboard
6. Prepare for Phase 6 (Migration)

---

**Ready for implementation. Reference this blueprint for all Phase 5 work.**
