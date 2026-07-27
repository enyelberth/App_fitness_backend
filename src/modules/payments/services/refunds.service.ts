import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Refund {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  createdAt: Date;
  processedAt?: Date;
  notes?: string;
}

@Injectable()
export class RefundsService {
  private refunds: Map<string, Refund> = new Map();

  constructor(private prisma: PrismaService) {}

  async requestRefund(
    userId: string,
    orderId: string,
    amount: number,
    reason: string,
    currency: string = 'USD',
  ): Promise<Refund> {
    const refundId = 'refund_' + Math.random().toString(36).substr(2, 24);

    const refund: Refund = {
      id: refundId,
      orderId,
      userId,
      amount,
      currency,
      reason,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.refunds.set(refundId, refund);

    return refund;
  }

  async getRefundDetails(refundId: string): Promise<Refund | null> {
    return this.refunds.get(refundId) || null;
  }

  async getUserRefunds(userId: string, limit: number = 50): Promise<Refund[]> {
    return Array.from(this.refunds.values())
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async approveRefund(refundId: string, notes?: string): Promise<Refund> {
    const refund = this.refunds.get(refundId);

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== 'PENDING') {
      throw new BadRequestException('Refund is not pending');
    }

    refund.status = 'APPROVED';
    refund.notes = notes;

    return refund;
  }

  async rejectRefund(refundId: string, reason: string): Promise<Refund> {
    const refund = this.refunds.get(refundId);

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== 'PENDING') {
      throw new BadRequestException('Refund is not pending');
    }

    refund.status = 'REJECTED';
    refund.notes = reason;

    return refund;
  }

  async processRefund(refundId: string): Promise<{ success: boolean; message: string }> {
    const refund = this.refunds.get(refundId);

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== 'APPROVED') {
      throw new BadRequestException('Only approved refunds can be processed');
    }

    // En producción: procesar con Stripe/PayPal
    refund.status = 'PROCESSED';
    refund.processedAt = new Date();

    return {
      success: true,
      message: `Refund of ${refund.amount} ${refund.currency} processed successfully`,
    };
  }

  async getRefundStats(): Promise<any> {
    const all = Array.from(this.refunds.values());
    const pending = all.filter((r) => r.status === 'PENDING');
    const approved = all.filter((r) => r.status === 'APPROVED');
    const rejected = all.filter((r) => r.status === 'REJECTED');
    const processed = all.filter((r) => r.status === 'PROCESSED');

    const totalAmount = all.reduce((sum, r) => sum + r.amount, 0);
    const processedAmount = processed.reduce((sum, r) => sum + r.amount, 0);

    return {
      total: all.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      processed: processed.length,
      totalAmount,
      processedAmount,
      approvalRate: ((approved.length / all.length) * 100).toFixed(1),
    };
  }

  async getRefundsByReason(): Promise<any> {
    const all = Array.from(this.refunds.values());
    const byReason = new Map<string, number>();

    all.forEach((r) => {
      byReason.set(r.reason, (byReason.get(r.reason) || 0) + 1);
    });

    return Array.from(byReason.entries()).map(([reason, count]) => ({
      reason,
      count,
      percentage: ((count / all.length) * 100).toFixed(1),
    }));
  }

  async canRefund(orderId: string, daysLimit: number = 30): Promise<boolean> {
    // En producción: verificar que la orden fue hace menos de daysLimit días
    return true;
  }

  async autoRefundExpiredBattlePass(userId: string, battlePassId: string): Promise<Refund> {
    const refund = await this.requestRefund(userId, battlePassId, 999, 'Battle Pass Cancellation', 'USD');
    refund.status = 'APPROVED';
    return refund;
  }
}
