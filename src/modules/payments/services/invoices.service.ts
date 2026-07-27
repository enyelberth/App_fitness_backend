import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID';
  createdAt: Date;
  paidAt?: Date;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
}

@Injectable()
export class InvoicesService {
  private invoices: Map<string, Invoice> = new Map();

  constructor(private prisma: PrismaService) {}

  async generateInvoice(
    userId: string,
    orderId: string,
    amount: number,
    description: string,
    currency: string = 'USD',
    items?: any[],
  ): Promise<Invoice> {
    const invoiceId = 'inv_' + Math.random().toString(36).substr(2, 24);

    const invoice: Invoice = {
      id: invoiceId,
      orderId,
      userId,
      amount,
      currency,
      description,
      status: 'DRAFT',
      createdAt: new Date(),
      items: items || [
        {
          description,
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      ],
    };

    this.invoices.set(invoiceId, invoice);

    return invoice;
  }

  async getInvoice(invoiceId: string): Promise<Invoice | null> {
    return this.invoices.get(invoiceId) || null;
  }

  async getUserInvoices(userId: string, limit: number = 50): Promise<Invoice[]> {
    return Array.from(this.invoices.values())
      .filter((i) => i.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async sendInvoice(invoiceId: string, recipientEmail: string): Promise<{ success: boolean; message: string }> {
    const invoice = this.invoices.get(invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // En producción: usar SendGrid/AWS SES para enviar email
    invoice.status = 'SENT';

    return {
      success: true,
      message: `Invoice sent to ${recipientEmail}`,
    };
  }

  async markInvoiceViewed(invoiceId: string): Promise<Invoice> {
    const invoice = this.invoices.get(invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'SENT') {
      invoice.status = 'VIEWED';
    }

    return invoice;
  }

  async markInvoicePaid(invoiceId: string): Promise<Invoice> {
    const invoice = this.invoices.get(invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    invoice.status = 'PAID';
    invoice.paidAt = new Date();

    return invoice;
  }

  async downloadInvoice(invoiceId: string): Promise<{ success: boolean; pdfUrl: string }> {
    const invoice = this.invoices.get(invoiceId);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // En producción: generar PDF con pdfkit/puppeteer
    return {
      success: true,
      pdfUrl: `https://api.fitquest.com/invoices/${invoiceId}/download`,
    };
  }

  async getInvoiceStats(): Promise<any> {
    const all = Array.from(this.invoices.values());
    const totalAmount = all.reduce((sum, i) => sum + i.amount, 0);
    const paid = all.filter((i) => i.status === 'PAID');
    const paidAmount = paid.reduce((sum, i) => sum + i.amount, 0);

    return {
      totalInvoices: all.length,
      draftInvoices: all.filter((i) => i.status === 'DRAFT').length,
      sentInvoices: all.filter((i) => i.status === 'SENT').length,
      viewedInvoices: all.filter((i) => i.status === 'VIEWED').length,
      paidInvoices: paid.length,
      totalAmount,
      paidAmount,
      unpaidAmount: totalAmount - paidAmount,
      collectionRate: ((paidAmount / totalAmount) * 100).toFixed(1),
    };
  }

  async generateBulkInvoices(invoiceData: any[]): Promise<Invoice[]> {
    const generated: Invoice[] = [];

    for (const data of invoiceData) {
      const invoice = await this.generateInvoice(
        data.userId,
        data.orderId,
        data.amount,
        data.description,
        data.currency,
        data.items,
      );
      generated.push(invoice);
    }

    return generated;
  }
}
