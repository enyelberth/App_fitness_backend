import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { InvoicesService } from '../services/invoices.service';

@Controller('payments/invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async generateInvoice(
    @Body() body: {
      userId: string;
      orderId: string;
      amount: number;
      description: string;
      currency?: string;
      items?: any[];
    },
  ) {
    return this.invoicesService.generateInvoice(
      body.userId,
      body.orderId,
      body.amount,
      body.description,
      body.currency,
      body.items,
    );
  }

  @Get(':invoiceId')
  @UseGuards(JwtAuthGuard)
  async getInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoicesService.getInvoice(invoiceId);
  }

  @Get('user/list')
  @UseGuards(JwtAuthGuard)
  async getUserInvoices(@CurrentUser('sub') userId: string) {
    return this.invoicesService.getUserInvoices(userId);
  }

  @Post(':invoiceId/send')
  @UseGuards(JwtAuthGuard)
  async sendInvoice(
    @Param('invoiceId') invoiceId: string,
    @Body() body: { recipientEmail: string },
  ) {
    return this.invoicesService.sendInvoice(invoiceId, body.recipientEmail);
  }

  @Post(':invoiceId/viewed')
  @UseGuards(JwtAuthGuard)
  async markViewed(@Param('invoiceId') invoiceId: string) {
    return this.invoicesService.markInvoiceViewed(invoiceId);
  }

  @Post(':invoiceId/paid')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async markPaid(@Param('invoiceId') invoiceId: string) {
    return this.invoicesService.markInvoicePaid(invoiceId);
  }

  @Get(':invoiceId/download')
  @UseGuards(JwtAuthGuard)
  async downloadInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoicesService.downloadInvoice(invoiceId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async getStats() {
    return this.invoicesService.getInvoiceStats();
  }

  @Post('admin/bulk-generate')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async generateBulk(@Body() body: { invoiceData: any[] }) {
    return this.invoicesService.generateBulkInvoices(body.invoiceData);
  }
}
