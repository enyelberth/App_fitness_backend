import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RefundsService } from '../services/refunds.service';

@Controller('payments/refunds')
export class RefundsController {
  constructor(private refundsService: RefundsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async requestRefund(
    @CurrentUser('sub') userId: string,
    @Body() body: { orderId: string; amount: number; reason: string; currency?: string },
  ) {
    return this.refundsService.requestRefund(userId, body.orderId, body.amount, body.reason, body.currency);
  }

  @Get(':refundId')
  @UseGuards(JwtAuthGuard)
  async getRefundDetails(@Param('refundId') refundId: string) {
    return this.refundsService.getRefundDetails(refundId);
  }

  @Get('user/list')
  @UseGuards(JwtAuthGuard)
  async getUserRefunds(@CurrentUser('sub') userId: string) {
    return this.refundsService.getUserRefunds(userId);
  }

  @Post(':refundId/approve')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async approveRefund(
    @Param('refundId') refundId: string,
    @Body() body?: { notes?: string },
  ) {
    return this.refundsService.approveRefund(refundId, body?.notes);
  }

  @Post(':refundId/reject')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async rejectRefund(
    @Param('refundId') refundId: string,
    @Body() body: { reason: string },
  ) {
    return this.refundsService.rejectRefund(refundId, body.reason);
  }

  @Post(':refundId/process')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async processRefund(@Param('refundId') refundId: string) {
    return this.refundsService.processRefund(refundId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async getRefundStats() {
    return this.refundsService.getRefundStats();
  }

  @Get('admin/by-reason')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async getRefundsByReason() {
    return this.refundsService.getRefundsByReason();
  }
}
